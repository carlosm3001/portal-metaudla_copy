const express = require('express');
const { pool } = require('../src/db/connection.cjs');
const { auth, authorize } = require('../src/middleware/auth.cjs');
const { logAction } = require('../utils/logger.cjs');
const upload = require('../src/middleware/uploads.cjs');

const router = express.Router();

// Helper functions (copied from proyectos.cjs for now)
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

// Create a new project request
router.post('/', auth, upload, async (req, res) => {
  const { name, description, githubUrl, websiteUrl, participantes, semestre, category, technologies } = req.body;
  const usuario_id = req.user.id;
  const mainImage = req.files?.projectImage?.[0];
  const galleryImages = req.files?.galleryImages || [];
  const imagenUrl = mainImage ? `/uploads/${mainImage.filename}` : null;

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [result] = await connection.query(
      'INSERT INTO proyecto_solicitudes (nombre, descripcion, githubUrl, websiteUrl, participantes, semestre, usuario_id, imagenUrl, categoria, tecnologias) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, description, githubUrl, websiteUrl, participantes, semestre, usuario_id, imagenUrl, category, technologies]
    );
    const projectRequestId = result.insertId;

    if (galleryImages.length > 0) {
      const galleryValues = galleryImages.map(file => [projectRequestId, `/uploads/${file.filename}`]);
      await connection.query('INSERT INTO proyecto_solicitud_imagenes (solicitud_id, imagenUrl) VALUES ?', [galleryValues]);
    }

    await connection.commit();
    await logAction(usuario_id, 'create_project_request', { projectRequestId });

    res.status(201).json({ message: 'Solicitud de proyecto creada exitosamente' });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error creating project request:', error);
    res.status(500).json({ message: 'Error al crear la solicitud de proyecto' });
  } finally {
    if (connection) connection.release();
  }
});

// Get all project requests (Admin only)
router.get('/', auth, authorize(['admin']), async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM proyecto_solicitudes');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching project requests:', error);
    res.status(500).json({ message: 'Error al obtener las solicitudes de proyecto' });
  }
});

// Get a single project request by ID (Admin only)
router.get('/:id', auth, authorize(['admin']), async (req, res) => {
  const { id } = req.params;
  try {
    const [requestRows] = await pool.query('SELECT * FROM proyecto_solicitudes WHERE id = ?', [id]);
    if (requestRows.length === 0) {
      return res.status(404).json({ message: 'Solicitud de proyecto no encontrada' });
    }
    const request = requestRows[0];

    const [galleryRows] = await pool.query('SELECT id, imagenUrl FROM proyecto_solicitud_imagenes WHERE solicitud_id = ?', [id]);
    request.gallery = galleryRows;

    res.json(request);
  } catch (error) {
    console.error('Error fetching single project request:', error);
    res.status(500).json({ message: 'Error al obtener la solicitud de proyecto' });
  }
});

// Update project request status (Admin only)
router.put('/:id', auth, authorize(['admin']), async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  const actorId = req.user.id;

  try {
    const [result] = await pool.query('UPDATE proyecto_solicitudes SET estado = ? WHERE id = ?', [estado, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Solicitud de proyecto no encontrada' });
    }

    await logAction(actorId, 'update_project_request_status', { projectRequestId: id, newStatus: estado });

    if (estado === 'aprobado') {
      const [solicitudRows] = await pool.query('SELECT * FROM proyecto_solicitudes WHERE id = ?', [id]);
      if (solicitudRows.length === 0) {
        throw new Error('Solicitud de proyecto no encontrada para aprobación');
      }
      const { nombre, descripcion, githubUrl, websiteUrl, participantes, semestre, imagenUrl, categoria, tecnologias } = solicitudRows[0];
      
      let connectionForProject;
      try {
        connectionForProject = await pool.getConnection();
        await connectionForProject.beginTransaction();

        const categoryId = await getOrCreateCategory(connectionForProject, categoria);

        const [projectResult] = await connectionForProject.query(
          'INSERT INTO proyectos (nombre, descripcion, githubUrl, websiteUrl, participantes, semestre, imagenUrl, categoria_id, creado_en, calificacion_promedio, cantidad_calificaciones, likes, dislikes, vistas) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), 0, 0, 0, 0, 0)',
          [nombre, descripcion, githubUrl, websiteUrl, participantes, semestre, imagenUrl, categoryId]
        );
        const projectId = projectResult.insertId;

        await handleTechnologies(connectionForProject, projectId, tecnologias);

        // Transferir imágenes de la galería de la solicitud al proyecto
        const [gallerySolicitud] = await pool.query('SELECT imagenUrl FROM proyecto_solicitud_imagenes WHERE solicitud_id = ?', [id]);
        if (gallerySolicitud.length > 0) {
          const galleryValues = gallerySolicitud.map(img => [projectId, img.imagenUrl]);
          await connectionForProject.query('INSERT INTO proyecto_imagenes (proyecto_id, imagenUrl) VALUES ?', [galleryValues]);
        }

        await connectionForProject.commit();
        await logAction(actorId, 'create_project_from_request', { projectId, projectRequestId: id });

      } catch (projectCreationError) {
        if (connectionForProject) await connectionForProject.rollback();
        console.error('Error al crear el proyecto desde la solicitud:', projectCreationError);
        // Consider throwing this error or handling it more gracefully if project creation fails
        throw projectCreationError; 
      } finally {
        if (connectionForProject) connectionForProject.release();
      }
    }

    res.json({ message: 'Estado de la solicitud de proyecto actualizado exitosamente' });
  } catch (error) {
    console.error('Error updating project request status:', error);
    res.status(500).json({ message: 'Error al actualizar el estado de la solicitud de proyecto' });
  }
});

module.exports = router;
