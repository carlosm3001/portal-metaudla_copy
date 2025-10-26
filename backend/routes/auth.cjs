const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../src/db/connection.cjs');
const { logAction } = require('../utils/logger.cjs');
const { auth } = require('../src/middleware/auth.cjs');

const router = express.Router();

// Register User
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Correo y contraseña son requeridos.' });
  }

  try {
    const role = email.endsWith('@udla.edu.co') ? 'student' : 'user';
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO usuarios (email, contrasena, rol) VALUES (?, ?, ?)',
      [email, hashedPassword, role]
    );
    const userId = result.insertId;

    await logAction(userId, 'register');

    res.status(201).json({ message: 'Usuario registrado exitosamente', userId });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'El correo electrónico ya está registrado.' });
    }
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error al registrar el usuario' });
  }
});

// Login User
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query('SELECT id, email, contrasena, rol AS role FROM usuarios WHERE email = ?', [email]);
    const user = rows[0];

    if (!user) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    const isMatch = await bcrypt.compare(password, user.contrasena);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    await logAction(user.id, 'login');

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, role: user.role });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
});

// Get current user data based on token
router.get('/me', auth, async (req, res) => {
  console.log('Auth /me route: Request reached handler.');
  try {
    const [rows] = await pool.query('SELECT id, email, rol AS role FROM usuarios WHERE id = ?', [req.user.id]);
    const user = rows[0];
    if (!user) {
      console.log('Auth /me route: User not found in DB.');
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }
    console.log('Auth /me route: User data sent:', user);
    res.json(user);
  } catch (error) {
    console.error('Auth /me route: Error fetching user data:', error);
    res.status(500).json({ message: 'Error al obtener datos del usuario.' });
  }
});

module.exports = router;