const express = require('express');
const { pool } = require('../db/connection.cjs');
const { auth, authorize } = require('../middleware/auth.cjs');

const router = express.Router();

// Get all audit log entries (Admin only)
router.get('/', auth, authorize(['admin']), async (req, res) => {
  try {
    // Consulta corregida: se eliminó el comentario inválido y se restauró la unión de tablas.
    const query = `
      SELECT 
        a.id,
        a.accion,
        a.detalles,
        a.fecha,
        u.email AS usuario_email
      FROM auditoria_acciones a
      LEFT JOIN usuarios u ON a.usuario_id = u.id
      ORDER BY a.fecha DESC
      LIMIT 100
    `;
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ message: 'Error al obtener los registros de auditoría' });
  }
});

module.exports = router;