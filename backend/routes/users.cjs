const express = require('express');
const { pool } = require('../db/connection.cjs');
const { auth, authorize } = require('../middleware/auth.cjs');
const { logAction } = require('../utils/logger.cjs');

const router = express.Router();

// Get all users (Admin only)
router.get('/', auth, authorize(['admin']), async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, email, rol AS role, creado_en AS created_at FROM usuarios');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
});

// Delete a user (Admin only)
router.delete('/:id', auth, authorize(['admin']), async (req, res) => {
  const { id } = req.params;
  const actorId = req.user.id;

  // Un administrador no se puede eliminar a sí mismo
  if (parseInt(id, 10) === actorId) {
    return res.status(403).json({ message: 'Un administrador no se puede eliminar a sí mismo.' });
  }

  try {
    const [result] = await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    await logAction(actorId, 'delete_user', { deletedUserId: id });

    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error al eliminar usuario' });
  }
});

module.exports = router;
