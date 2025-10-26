const express = require('express');
const { pool } = require('../src/db/connection.cjs');
const { auth } = require('../src/middleware/auth.cjs');
const { logAction } = require('../utils/logger.cjs');

const router = express.Router();

// POST: Añadir o actualizar una calificación para un proyecto
router.post('/projects/:id/rate', auth, async (req, res) => {
  const { id: proyecto_id } = req.params;
  const { calificacion } = req.body;
  const { id: usuario_id } = req.user;

  if (!calificacion || calificacion < 1 || calificacion > 5) {
    return res.status(400).json({ message: 'La calificación debe ser un número entre 1 y 5' });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Usar INSERT ... ON DUPLICATE KEY UPDATE para insertar o actualizar la calificación
    // Esto depende de la clave única (proyecto_id, usuario_id) en la tabla calificaciones
    await connection.query(
      `INSERT INTO calificaciones (proyecto_id, usuario_id, calificacion) 
       VALUES (?, ?, ?) 
       ON DUPLICATE KEY UPDATE calificacion = ?`,
      [proyecto_id, usuario_id, calificacion, calificacion]
    );

    // Recalcular el promedio y la cantidad de calificaciones para el proyecto
    const [stats] = await connection.query(
      `SELECT AVG(calificacion) as avg_rating, COUNT(id) as count_rating 
       FROM calificaciones 
       WHERE proyecto_id = ?`,
      [proyecto_id]
    );

    const { avg_rating, count_rating } = stats[0];

    // Actualizar la tabla de proyectos con los nuevos valores
    await connection.query(
      'UPDATE proyectos SET calificacion_promedio = ?, cantidad_calificaciones = ? WHERE id = ?',
      [avg_rating, count_rating, proyecto_id]
    );

    await connection.commit();

    await logAction(usuario_id, 'rate_project', { projectId: proyecto_id, rating: calificacion });

    res.status(200).json({
      message: 'Calificación guardada exitosamente',
      calificacion_promedio: avg_rating,
      cantidad_calificaciones: count_rating
    });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error saving rating:', error);
    res.status(500).json({ message: 'Error al guardar la calificación' });
  } finally {
    if (connection) connection.release();
  }
});

module.exports = router;
