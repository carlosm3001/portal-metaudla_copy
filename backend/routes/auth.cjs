const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
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

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const [rows] = await pool.query('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (rows.length === 0) {
      // For security, always return a generic success message even if user not found
      return res.status(200).json({ message: 'Si el correo electrónico está registrado, recibirás un enlace para restablecer tu contraseña.' });
    }

    const user = rows[0];
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour from now

    await pool.query(
      'UPDATE usuarios SET reset_token = ?, reset_token_expires = ? WHERE id = ?',
      [resetToken, resetTokenExpires, user.id]
    );

    console.log(`Password reset token for ${email}: ${resetToken}`); // Log token instead of sending email

    res.status(200).json({ message: 'Si el correo electrónico está registrado, recibirás un enlace para restablecer tu contraseña.' });
  } catch (error) {
    console.error('Error in forgot-password:', error);
    res.status(500).json({ message: 'Error al solicitar el restablecimiento de contraseña.' });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const [rows] = await pool.query(
      'SELECT id FROM usuarios WHERE reset_token = ? AND reset_token_expires > NOW()',
      [token]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: 'Token de restablecimiento inválido o expirado.' });
    }

    const user = rows[0];
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      'UPDATE usuarios SET contrasena = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?',
      [hashedPassword, user.id]
    );

    res.status(200).json({ message: 'Contraseña restablecida exitosamente.' });
  } catch (error) {
    console.error('Error in reset-password:', error);
    res.status(500).json({ message: 'Error al restablecer la contraseña.' });
  }
});

module.exports = router;