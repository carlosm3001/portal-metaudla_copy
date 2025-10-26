const express = require('express');
const { pool } = require('../src/db/connection.cjs');
const { auth, authorize } = require('../src/middleware/auth.cjs');
const { logAction } = require('../utils/logger.cjs');

const router = express.Router();

// Create a new project request
router.post('/', auth, async (req, res) => {
  const { nombre, descripcion, githubUrl, websiteUrl, participantes, semestre } = req.body;
  const usuario_id = req.user.id;

  try {
    const [result] = await pool.query(
      'INSERT INTO proyecto_solicitudes (nombre, descripcion, githubUrl, websiteUrl, participantes, semestre, usuario_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nombre, descripcion, githubUrl, websiteUrl, participantes, semestre, usuario_id]
    );

    await logAction(usuario_id, 'create_project_request', { projectRequestId: result.insertId });

    res.status(201).json({ message: 'Solicitud de proyecto creada exitosamente' });
  } catch (error) {
    console.error('Error creating project request:', error);
    res.status(500).json({ message: 'Error al crear la solicitud de proyecto' });
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
      const [solicitud] = await pool.query('SELECT * FROM proyecto_solicitudes WHERE id = ?', [id]);
      const { nombre, descripcion, githubUrl, websiteUrl, participantes, semestre } = solicitud[0];
      
      const [projectResult] = await pool.query(
        'INSERT INTO proyectos (nombre, descripcion, githubUrl, websiteUrl, participantes, semestre) VALUES (?, ?, ?, ?, ?, ?)',
        [nombre, descripcion, githubUrl, websiteUrl, participantes, semestre]
      );

      await logAction(actorId, 'create_project_from_request', { projectId: projectResult.insertId, projectRequestId: id });
    }

    res.json({ message: 'Estado de la solicitud de proyecto actualizado exitosamente' });
  } catch (error) {
    console.error('Error updating project request status:', error);
    res.status(500).json({ message: 'Error al actualizar el estado de la solicitud de proyecto' });
  }
});

module.exports = router;
