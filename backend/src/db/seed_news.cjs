const { pool } = require('./connection.cjs');

const seedNews = async () => {
  try {
    // Check if news already exist
    const [existingNews] = await pool.query('SELECT id FROM noticias LIMIT 1');
    if (existingNews.length > 0) {
      console.log('News already seeded.');
      return;
    }

    const news = [
      {
        titulo: 'Proceso de elección de rector en la Universidad de la Amazonia',
        contenido: 'El 14 de octubre de 2025, el Consejo Superior de la Universidad de la Amazonía evaluó a los candidatos para el cargo de rector. Algunos fueron inhabilitados por no cumplir con los requisitos, y se abrió un período de apelación hasta el 17 de octubre. La elección está programada para el 28 de octubre de 2025.',
        autor_id: 1,
      },
      {
        titulo: 'Inscripciones abiertas en la sede Guaviare',
        contenido: 'La sede Guaviare de la Universidad de la Amazonía tiene inscripciones abiertas hasta el 10 de diciembre de 2024 para el primer semestre de 2025 en los programas de Derecho e Ingeniería Agroecológica.',
        autor_id: 1,
      },
      {
        titulo: 'Oportunidades para jóvenes rurales',
        contenido: 'Desde septiembre de 2024, la universidad ofrece ingreso prioritario a estudiantes graduados en zonas rurales para dos programas especiales: Derecho y Medicina Veterinaria y Zootecnia, beneficiando a aproximadamente 100 jóvenes.',
        autor_id: 1,
      },
      {
        titulo: 'V Semana Artística y Cultural por la Paz',
        contenido: 'La universidad ha estado llevando a cabo diversas actividades, incluyendo la V Semana Artística y Cultural por la Paz, que incluyó una Ceremonia de Pueblos Indígenas y un encuentro con el arte y la creatividad.',
        autor_id: 1,
      },
    ];

    for (const a of news) {
      await pool.query('INSERT INTO noticias (titulo, contenido, autor_id) VALUES (?, ?, ?)', [a.titulo, a.contenido, a.autor_id]);
    }

    console.log('News seeded successfully.');
  } catch (error) {
    console.error('Error seeding news:', error);
  }
};

module.exports = { seedNews };
