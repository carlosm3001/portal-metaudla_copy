const express = require('express');
const { pool } = require('../db/connection.cjs');
const { auth } = require('../middleware/auth.cjs');

const router = express.Router();

// Get all blog posts
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT bp.*, u.email as autor_email FROM blog_posts bp JOIN usuarios u ON bp.autor_id = u.id ORDER BY bp.creado_en DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ message: 'Error al obtener las publicaciones del blog' });
  }
});

// Get a single blog post by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT bp.*, u.email as autor_email FROM blog_posts bp JOIN usuarios u ON bp.autor_id = u.id WHERE bp.id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Publicación de blog no encontrada' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ message: 'Error al obtener la publicación del blog' });
  }
});

// Create a new blog post (only for students)
router.post('/', auth, async (req, res) => {
  try {
    const { titulo, contenido, tema } = req.body;
    const autor_id = req.user.id; // Assuming auth middleware adds user info to req



    if (!titulo || !contenido) {
      return res.status(400).json({ message: 'Título y contenido son requeridos' });
    }

    const [result] = await pool.query('INSERT INTO blog_posts (titulo, contenido, tema, autor_id) VALUES (?, ?, ?, ?)', [titulo, contenido, tema, autor_id]);
    res.status(201).json({ id: result.insertId, titulo, contenido, tema, autor_id, creado_en: new Date() });
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({ message: 'Error al crear la publicación del blog' });
  }
});

// Update a blog post (only for author or admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, contenido, tema } = req.body;
    const usuario_id = req.user.id;
    const user_rol = req.user.rol;

    if (!titulo || !contenido) {
      return res.status(400).json({ message: 'Título y contenido son requeridos' });
    }

    const [post] = await pool.query('SELECT autor_id FROM blog_posts WHERE id = ?', [id]);

    if (post.length === 0) {
      return res.status(404).json({ message: 'Publicación de blog no encontrada' });
    }

    if (post[0].autor_id !== usuario_id && user_rol !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado. Solo el autor o un administrador pueden actualizar esta publicación.' });
    }

    await pool.query('UPDATE blog_posts SET titulo = ?, contenido = ?, tema = ? WHERE id = ?', [titulo, contenido, tema, id]);
    res.json({ message: 'Publicación de blog actualizada exitosamente' });
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({ message: 'Error al actualizar la publicación del blog' });
  }
});

// Delete a blog post (only for author or admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const usuario_id = req.user.id;
    const user_rol = req.user.rol;

    const [post] = await pool.query('SELECT autor_id FROM blog_posts WHERE id = ?', [id]);

    if (post.length === 0) {
      return res.status(404).json({ message: 'Publicación de blog no encontrada' });
    }

    if (post[0].autor_id !== usuario_id && user_rol !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado. Solo el autor o un administrador pueden eliminar esta publicación.' });
    }

    await pool.query('DELETE FROM blog_posts WHERE id = ?', [id]);
    res.json({ message: 'Publicación de blog eliminada exitosamente' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({ message: 'Error al eliminar la publicación del blog' });
  }
});

module.exports = router;
