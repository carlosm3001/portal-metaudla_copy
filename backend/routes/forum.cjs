const express = require('express');
const { pool } = require('../db/connection.cjs');
const { auth } = require('../middleware/auth.cjs');

const router = express.Router();

// Get all forum threads with optional filters
router.get('/threads', async (req, res) => {
  try {
    const { category, onlyMine, onlyRepliedBy } = req.query;
    let sql = 'SELECT ft.*, u.email as author_email FROM forum_threads ft JOIN usuarios u ON ft.author_id = u.id';
    const conditions = [];
    const params = [];

    if (category) {
      conditions.push('ft.category = ?');
      params.push(category);
    }

    // Note: onlyMine and onlyRepliedBy require user authentication to work correctly
    // For now, we'll implement basic filtering. Full logic will depend on frontend passing user_id.

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    sql += ' ORDER BY ft.last_activity_at DESC';

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching forum threads:', error);
    res.status(500).json({ message: 'Error al obtener los hilos del foro' });
  }
});

// Get a single forum thread and its posts
router.get('/threads/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [threadRows] = await pool.query('SELECT ft.*, u.email as author_email FROM forum_threads ft JOIN usuarios u ON ft.author_id = u.id WHERE ft.id = ?', [id]);

    if (threadRows.length === 0) {
      return res.status(404).json({ message: 'Hilo del foro no encontrado' });
    }

    const [postsRows] = await pool.query('SELECT fp.*, u.email as author_email FROM forum_posts fp JOIN usuarios u ON fp.author_id = u.id WHERE fp.thread_id = ? ORDER BY fp.created_at ASC', [id]);

    res.json({ thread: threadRows[0], posts: postsRows });
  } catch (error) {
    console.error('Error fetching forum thread and posts:', error);
    res.status(500).json({ message: 'Error al obtener el hilo y las publicaciones del foro' });
  }
});

// Create a new forum thread
router.post('/threads', auth, async (req, res) => {
  try {
    const { title, category, firstContent } = req.body;
    const author_id = req.user.id;

    if (!title || !firstContent) {
      return res.status(400).json({ message: 'Título y contenido son requeridos' });
    }

    const [threadResult] = await pool.query('INSERT INTO forum_threads (title, category, author_id, created_at) VALUES (?, ?, ?, NOW())', [title, category, author_id]);
    const threadId = threadResult.insertId;

    await pool.query('INSERT INTO forum_posts (thread_id, author_id, content) VALUES (?, ?, ?)', [threadId, author_id, firstContent]);

    res.status(201).json({ id: threadId, title, category, author_id, firstContent, created_at: new Date() });
  } catch (error) {
    console.error('Error creating forum thread:', error);
    res.status(500).json({ message: 'Error al crear el hilo del foro' });
  }
});

// Add a post to a forum thread
router.post('/threads/:id/posts', auth, async (req, res) => {
  try {
    const { id } = req.params; // thread_id
    const { content } = req.body;
    const author_id = req.user.id;

    if (!content) {
      return res.status(400).json({ message: 'El contenido de la publicación es requerido' });
    }

    const [postResult] = await pool.query('INSERT INTO forum_posts (thread_id, author_id, content) VALUES (?, ?, ?)', [id, author_id, content]);

    // Update replies_count and last_activity_at for the thread
    await pool.query('UPDATE forum_threads SET replies_count = replies_count + 1, last_activity_at = NOW() WHERE id = ?', [id]);

    res.status(201).json({ id: postResult.insertId, thread_id: id, author_id, content, created_at: new Date() });
  } catch (error) {
    console.error('Error adding post to thread:', error);
    res.status(500).json({ message: 'Error al añadir la publicación al hilo' });
  }
});

module.exports = router;
