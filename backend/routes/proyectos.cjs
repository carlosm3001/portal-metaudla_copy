const express = require('express');
const { pool } = require('../db/connection.cjs');
const { auth, authorize } = require('../middleware/auth.cjs');
const upload = require('../middleware/uploads.cjs');
const { logAction } = require('../utils/logger.cjs');

const router = express.Router();

// ... (keep helper functions getOrCreateCategory, handleTechnologies)
async function getOrCreateCategory(connection, categoryName) {
  if (!categoryName || !categoryName.trim()) return null;
  const trimmedName = categoryName.trim();
  let [rows] = await connection.query('SELECT id FROM categorias WHERE nombre = ?', [trimmedName]);
  if (rows.length > 0) return rows[0].id;
  const [result] = await connection.query('INSERT INTO categorias (nombre) VALUES (?)', [trimmedName]);
  return result.insertId;
}

async function handleTechnologies(connection, projectId, technologiesStr) {
  if (!technologiesStr || !technologiesStr.trim()) return;
  const techNames = technologiesStr.split(',').map(t => t.trim()).filter(t => t);
  for (const name of techNames) {
    try {
      let [rows] = await connection.query('SELECT id FROM tecnologias WHERE nombre = ?', [name]);
      let techId;
      if (rows.length > 0) {
        techId = rows[0].id;
      } else {
        const [result] = await connection.query('INSERT INTO tecnologias (nombre) VALUES (?)', [name]);
        techId = result.insertId;
      }
      await connection.query('INSERT INTO proyectos_tecnologias (proyecto_id, tecnologia_id) VALUES (?, ?)', [projectId, techId]);
    } catch (error) {
      console.error(`Error handling technology '${name}' for project ${projectId}:`, error.message);
      throw error; // Re-throw to trigger transaction rollback
    }
  }
}

const baseSelectQuery = `
  SELECT
    p.id, p.nombre AS name, p.descripcion AS description, p.participantes,
    p.imagenUrl AS imageUrl, p.githubUrl, p.websiteUrl, p.likes, p.dislikes,
    p.vistas AS views, p.calificacion_promedio AS averageRating,
    p.cantidad_calificaciones AS ratingCount, p.creado_en AS createdAt,
    c.nombre AS category,
    GROUP_CONCAT(DISTINCT t.nombre SEPARATOR ', ') AS technologies
  FROM proyectos p
  LEFT JOIN categorias c ON p.categoria_id = c.id
  LEFT JOIN proyectos_tecnologias pt ON p.id = pt.proyecto_id
  LEFT JOIN tecnologias t ON pt.tecnologia_id = t.id
`;

// GET all projects
router.get('/', async (req, res) => {
  try {
    const { q, categoria_id, semestre, dificultad } = req.query;
    let sql = 'SELECT p.*, c.nombre as categoria_nombre FROM proyectos p LEFT JOIN categorias c ON p.categoria_id = c.id';
    const conditions = [];
    const params = [];

    if (q) {
      conditions.push('(p.nombre LIKE ? OR p.descripcion LIKE ?)');
      params.push(`%${q}%`, `%${q}%`);
    }
    if (categoria_id) {
      conditions.push('p.categoria_id = ?');
      params.push(categoria_id);
    }
    if (semestre) {
      conditions.push('p.semestre = ?');
      params.push(semestre);
    }
    if (dificultad) {
      conditions.push('p.dificultad = ?');
      params.push(dificultad);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener proyectos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// GET single project with gallery
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(`${baseSelectQuery} WHERE p.id = ? GROUP BY p.id`, [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Proyecto no encontrado' });
    
    const project = rows[0];
    const [gallery] = await pool.query('SELECT id, imagenUrl FROM proyecto_imagenes WHERE proyecto_id = ?', [id]);
    project.gallery = gallery;

    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: 'Error al obtener el proyecto' });
  }
});

// POST create a new project
router.post('/', auth, authorize(['admin']), upload, async (req, res) => {
  const { name, description, githubUrl, websiteUrl, category, technologies, participantes } = req.body;
  const mainImage = req.files?.projectImage?.[0];
  const galleryImages = req.files?.galleryImages || [];
  const imagenUrl = mainImage ? `/uploads/${mainImage.filename}` : null;
  
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const categoryId = await getOrCreateCategory(connection, category);

    const [projectResult] = await connection.query(
      'INSERT INTO proyectos (nombre, descripcion, imagenUrl, githubUrl, websiteUrl, categoria_id, participantes) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, description, imagenUrl, githubUrl, websiteUrl, categoryId, participantes]
    );
    const projectId = projectResult.insertId;

    await handleTechnologies(connection, projectId, technologies);

    if (galleryImages.length > 0) {
      const galleryValues = galleryImages.map(file => [projectId, `/uploads/${file.filename}`]);
      await connection.query('INSERT INTO proyecto_imagenes (proyecto_id, imagenUrl) VALUES ?', [galleryValues]);
    }

    await connection.commit();
    await logAction(req.user.id, 'create_project', { projectId });

    res.status(201).json({ message: 'Proyecto creado exitosamente', projectId });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error creating project:', error.message);
    res.status(500).json({ message: 'Error al crear el proyecto', error: error.message });
  } finally {
    if (connection) connection.release();
  }
});

// PUT update a project
router.put('/:id', auth, authorize(['admin']), upload, async (req, res) => {
  const { id } = req.params;
  const { name, description, githubUrl, websiteUrl, category, technologies, participantes } = req.body;
  
  const mainImage = req.files?.projectImage?.[0];
  const galleryImages = req.files?.galleryImages || [];
  let imagenUrl = req.body.imageUrl; // Keep old image by default
  if (mainImage) imagenUrl = `/uploads/${mainImage.filename}`; // Set new if uploaded

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const categoryId = await getOrCreateCategory(connection, category);

    await connection.query(
      'UPDATE proyectos SET nombre = ?, descripcion = ?, imagenUrl = ?, githubUrl = ?, websiteUrl = ?, categoria_id = ?, participantes = ? WHERE id = ?',
      [name, description, imagenUrl, githubUrl, websiteUrl, categoryId, participantes, id]
    );

    await connection.query('DELETE FROM proyectos_tecnologias WHERE proyecto_id = ?', [id]);
    await handleTechnologies(connection, id, technologies);

    if (galleryImages.length > 0) {
      const galleryValues = galleryImages.map(file => [id, `/uploads/${file.filename}`]);
      await connection.query('INSERT INTO proyecto_imagenes (proyecto_id, imagenUrl) VALUES ?', [galleryValues]);
    }

    await connection.commit();
    await logAction(req.user.id, 'update_project', { projectId: id });

    res.json({ message: 'Proyecto actualizado exitosamente' });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error updating project:', error.message);
    res.status(500).json({ message: 'Error al actualizar el proyecto', error: error.message });
  } finally {
    if (connection) connection.release();
  }
});

// DELETE a project
router.delete('/:id', auth, authorize(['admin']), async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM proyectos WHERE id = ?', [id]);
    await logAction(req.user.id, 'delete_project', { projectId: id });
    res.json({ message: 'Proyecto eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting project:', error.message);
    res.status(500).json({ message: 'Error al eliminar el proyecto', error: error.message });
  }
});

module.exports = router;