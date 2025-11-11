const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();
const { testConnection } = require('./src/db/connection.cjs');
const { runMigrations } = require('./src/db/migration.cjs');
const authRoutes = require('./routes/auth.cjs');
const proyectosRoutes = require('./routes/proyectos.cjs');
const usersRoutes = require('./routes/users.cjs');
const tecnologiasRoutes = require('./routes/tecnologias.cjs');
const categoriasRoutes = require('./routes/categorias.cjs');
const auditoriaRoutes = require('./routes/auditoria.cjs');
const comentariosRoutes = require('./routes/comentarios.cjs');
const calificacionesRoutes = require('./routes/calificaciones.cjs');
const blogRoutes = require('./routes/blog.cjs');
const noticiasRoutes = require('./routes/noticias.cjs');
const forumRoutes = require('./routes/forum.cjs');
const solicitudesRouter = require('./routes/solicitudes.cjs');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));
app.use(express.static(path.join(__dirname, '../dist')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', proyectosRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/technologies', tecnologiasRoutes);
app.use('/api/categories', categoriasRoutes);
app.use('/api/audit', auditoriaRoutes);
app.use('/api', comentariosRoutes); // Montado en /api
app.use('/api', calificacionesRoutes); // Montado en /api
app.use('/api/blog', blogRoutes);
app.use('/api/news', noticiasRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/solicitudes', solicitudesRouter);

// Basic route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Catch-all route to serve index.html for client-side routing
app.get(/^(?!\/api\/).*$/, (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

// Start server and run migrations
async function startServer() {
  await testConnection();
  await runMigrations();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();