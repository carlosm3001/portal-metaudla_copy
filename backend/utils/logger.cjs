const { pool } = require('../db/connection.cjs');

/**
 * Registra una acción de usuario en la base de datos.
 * @param {number} usuario_id - El ID del usuario que realiza la acción.
 * @param {string} accion - El nombre de la acción (ej: 'login', 'create_project').
 * @param {object} [detalles] - Un objeto con detalles adicionales para almacenar como JSON.
 */
async function logAction(usuario_id, accion, detalles = null) {
  try {
    const detallesJson = detalles ? JSON.stringify(detalles) : null;
    await pool.query(
      'INSERT INTO auditoria_acciones (usuario_id, accion, detalles) VALUES (?, ?, ?)',
      [usuario_id, accion, detallesJson]
    );
  } catch (error) {
    console.error('Error al registrar la acción de auditoría:', error.message);
    // No detenemos la ejecución principal si falla el log, solo lo registramos en la consola.
  }
}

module.exports = { logAction };
