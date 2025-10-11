const express = require('express');
const { pool } = require('../db/connection.cjs');

const router = express.Router();

// Get all technologies
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tecnologias ORDER BY nombre ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching technologies:', error);
    res.status(500).json({ message: 'Error al obtener las tecnologías' });
  }
});

module.exports = router;
