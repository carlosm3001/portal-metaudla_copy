const express = require('express');
const { pool } = require('../db/connection.cjs');
const { auth } = require('../middleware/auth.cjs');
const { logAction } = require('../utils/logger.cjs');

const router = express.Router();

// GET: Obtener todos los comentarios de un proyecto
router.get('/projects/:id/comments', async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      SELECT c.id, c.comentario, c.creado_en, u.email AS usuario_email
      FROM comentarios c
      JOIN usuarios u ON c.usuario_id = u.id
      WHERE c.proyecto_id = ?
      ORDER BY c.creado_en DESC
    `;
    const [comments] = await pool.query(query, [id]);
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Error al obtener los comentarios' });
  }
});

// POST: Añadir un nuevo comentario a un proyecto
router.post('/projects/:id/comments', auth, async (req, res) => {
  const { id: proyecto_id } = req.params;
  const { comentario } = req.body;
  const { id: usuario_id } = req.user;

  if (!comentario || !comentario.trim()) {
    return res.status(400).json({ message: 'El comentario no puede estar vacío' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO comentarios (comentario, proyecto_id, usuario_id) VALUES (?, ?, ?)',
      [comentario, proyecto_id, usuario_id]
    );

    await logAction(usuario_id, 'create_comment', { projectId: proyecto_id, commentId: result.insertId });

    // Devolver el comentario recién creado con la info del usuario
    const [rows] = await pool.query('SELECT email FROM usuarios WHERE id = ?', [usuario_id]);
    const usuario_email = rows[0]?.email;

    res.status(201).json({
      id: result.insertId,
      comentario,
      creado_en: new Date(),
      usuario_email
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Error al crear el comentario' });
  }
});

module.exports = router;
