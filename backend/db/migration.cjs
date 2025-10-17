const { pool } = require('./connection.cjs');
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');

async function createDefaultAdmin() {
  const adminEmail = 'admin@udla.edu.co';
  const adminPassword = 'admin';

  const [users] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [adminEmail]);

  if (users.length === 0) {
    console.log('Creando usuario administrador por defecto...');
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await pool.query(
      'INSERT INTO usuarios (email, contrasena, rol) VALUES (?, ?, ?)',
      [adminEmail, hashedPassword, 'admin']
    );
    console.log('Usuario administrador creado exitosamente.');
  }
}

async function seedDefaultData() {
  console.log('Poblando con datos iniciales (categorías y tecnologías)...');
  const defaultCategories = ['Juegos de Matemáticas', 'Juegos de Física', 'Simulaciones Interactivas', 'Realidad Virtual (VR) Educativa', 'Realidad Aumentada (AR) Educativa', 'Software de Tutoría Inteligente', 'Plataformas de Aprendizaje', 'Otro'];
  const defaultTechnologies = ['JavaScript', 'React', 'Node.js', 'Python', 'Flask', 'Django', 'Unity', 'Unreal Engine', 'C#', 'C++', 'Java', 'Kotlin', 'Swift', 'Flutter', 'React Native', 'Vue.js', 'Angular', 'SQL', 'MongoDB', 'Firebase', 'Docker', 'WebGL', 'Three.js'];
  
  try {
    for (const category of defaultCategories) {
      await pool.query('INSERT IGNORE INTO categorias (nombre) VALUES (?)', [category]);
    }
    for (const tech of defaultTechnologies) {
      await pool.query('INSERT IGNORE INTO tecnologias (nombre) VALUES (?)', [tech]);
    }
    console.log('Datos iniciales poblados exitosamente.');
  } catch (error) {
    console.error('Error al poblar datos iniciales:', error.message);
  }
}

async function seedProjects() {
  const [projects] = await pool.query('SELECT id FROM proyectos LIMIT 1');
  if (projects.length > 0) {
    console.log('Los proyectos de ejemplo ya existen.');
    return;
  }
  console.log('Creando proyectos de ejemplo...');
  try {
    const projectsToSeed = [
      {
        nombre: "GeoAventura",
        descripcion: "Explora el mundo de la geometría a través de puzzles interactivos. Construye figuras, resuelve acertijos y domina los teoremas fundamentales en un entorno lúdico.",
        participantes: "Euclides, Pitágoras",
        categoria: "Juegos de Matemáticas",
        technologies: ["React", "Three.js", "Node.js"],
      },
      {
        nombre: "Fuerza y Movimiento",
        descripcion: "Una simulación de física donde puedes experimentar con las leyes de Newton. Lanza objetos, ajusta la gravedad y observa los resultados en tiempo real.",
        participantes: "Isaac Newton, Galileo Galilei",
        categoria: "Juegos de Física",
        technologies: ["JavaScript", "HTML5 Canvas"],
      },
      {
        nombre: "CodeQuest",
        descripcion: "Aprende a programar en Python resolviendo misiones en un mundo de fantasía. Lucha contra monstruos escribiendo código y automatiza tareas para avanzar.",
        participantes: "Ada Lovelace, Guido van Rossum",
        categoria: "Plataformas de Aprendizaje",
        technologies: ["Python", "Django", "React"],
      }
    ];

    for (const proj of projectsToSeed) {
      const [cat] = await pool.query('SELECT id FROM categorias WHERE nombre = ?', [proj.categoria]);
      const categoryId = cat[0]?.id || null;

      const [res] = await pool.query(
        'INSERT INTO proyectos (nombre, descripcion, categoria_id, participantes) VALUES (?, ?, ?, ?)',
        [proj.nombre, proj.descripcion, categoryId, proj.participantes]
      );
      const projectId = res.insertId;

      if (proj.technologies.length > 0) {
        const techIds = await Promise.all(proj.technologies.map(async (techName) => {
          const [t] = await pool.query('SELECT id FROM tecnologias WHERE nombre = ?', [techName]);
          return t[0]?.id;
        }));
        const techValues = techIds.filter(Boolean).map(techId => [projectId, techId]);
        if (techValues.length > 0) {
          await pool.query('INSERT INTO proyectos_tecnologias (proyecto_id, tecnologia_id) VALUES ?', [techValues]);
        }
      }
    }
    console.log('Proyectos de ejemplo creados.');
  } catch (error) {
    console.error('Error creando proyectos de ejemplo:', error.message);
  }
}

const { seedNews } = require('./seed_news.cjs');

const runMigrations = async () => {
  try {
    // ... (existing migration code)
    await seedNews();
  } catch (error) {
    console.error('Error running migrations:', error);
  }
};

module.exports = { runMigrations };