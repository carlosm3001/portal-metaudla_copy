const express = require('express');
const { pool } = require('../db/connection.cjs');

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categorias ORDER BY nombre ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error al obtener las categorías' });
  }
});

module.exports = router;
