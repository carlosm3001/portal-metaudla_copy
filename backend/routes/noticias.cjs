const express = require('express');
const { pool } = require('../src/db/connection.cjs');
const { auth } = require('../src/middleware/auth.cjs');

const router = express.Router();

// Get all news items
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT n.*, u.email as autor_email FROM noticias n JOIN usuarios u ON n.autor_id = u.id ORDER BY n.creado_en DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching news items:', error);
    res.status(500).json({ message: 'Error al obtener las noticias' });
  }
});

// Get a single news item by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT n.*, u.email as autor_email FROM noticias n JOIN usuarios u ON n.autor_id = u.id WHERE n.id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Noticia no encontrada' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching news item:', error);
    res.status(500).json({ message: 'Error al obtener la noticia' });
  }
});

// Create a new news item (only for admin)
router.post('/', auth, async (req, res) => {
  try {
    const { titulo, contenido } = req.body;
    const autor_id = req.user.id; // Assuming auth middleware adds user info to req

    if (req.user.rol !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado. Solo administradores pueden crear noticias.' });
    }

    if (!titulo || !contenido) {
      return res.status(400).json({ message: 'Título y contenido son requeridos' });
    }

    const [result] = await pool.query('INSERT INTO noticias (titulo, contenido, autor_id) VALUES (?, ?, ?)', [titulo, contenido, autor_id]);
    res.status(201).json({ id: result.insertId, titulo, contenido, autor_id, creado_en: new Date() });
  } catch (error) {
    console.error('Error creating news item:', error);
    res.status(500).json({ message: 'Error al crear la noticia' });
  }
});

// Update a news item (only for admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, contenido } = req.body;
    const user_rol = req.user.rol;

    if (!titulo || !contenido) {
      return res.status(400).json({ message: 'Título y contenido son requeridos' });
    }

    if (user_rol !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado. Solo un administrador puede actualizar esta noticia.' });
    }

    await pool.query('UPDATE noticias SET titulo = ?, contenido = ? WHERE id = ?', [titulo, contenido, id]);
    res.json({ message: 'Noticia actualizada exitosamente' });
  } catch (error) {
    console.error('Error updating news item:', error);
    res.status(500).json({ message: 'Error al actualizar la noticia' });
  }
});

// Delete a news item (only for admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const user_rol = req.user.rol;

    if (user_rol !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado. Solo un administrador puede eliminar esta noticia.' });
    }

    await pool.query('DELETE FROM noticias WHERE id = ?', [id]);
    res.json({ message: 'Noticia eliminada exitosamente' });
  } catch (error) {
    console.error('Error deleting news item:', error);
    res.status(500).json({ message: 'Error al eliminar la noticia' });
  }
});

module.exports = router;
