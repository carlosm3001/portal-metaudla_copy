const express = require('express');
const { pool } = require('../src/db/connection.cjs');
const { auth, authorize } = require('../src/middleware/auth.cjs');
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


// Update user role (Admin only)
router.put('/role', auth, authorize(['admin']), async (req, res) => {
  const { email, role } = req.body;
  const actorId = req.user.id;

  try {
    const [result] = await pool.query('UPDATE usuarios SET rol = ? WHERE email = ?', [role, email]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    await logAction(actorId, 'update_user_role', { updatedUserEmail: email, newRole: role });

    res.json({ message: 'Rol de usuario actualizado exitosamente' });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: 'Error al actualizar el rol del usuario' });
  }
});

// Update user active status (Admin only)
router.put('/active', auth, authorize(['admin']), async (req, res) => {
  const { email, is_active } = req.body;
  const actorId = req.user.id;

  try {
    const [result] = await pool.query('UPDATE usuarios SET is_active = ? WHERE email = ?', [is_active, email]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    await logAction(actorId, 'update_user_status', { updatedUserEmail: email, newStatus: is_active });

    res.json({ message: 'Estado de usuario actualizado exitosamente' });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: 'Error al actualizar el estado del usuario' });
  }
});

module.exports = router;
