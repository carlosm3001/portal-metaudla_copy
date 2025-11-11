const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true
};

const pool = mysql.createPool(dbConfig);

async function testConnection() {
  try {
    // Conexión inicial sin base de datos para crearla si no existe
    const initialConnection = await mysql.createConnection({
        host: dbConfig.host,
        user: dbConfig.user,
        password: dbConfig.password,
        port: dbConfig.port,
        ssl: { rejectUnauthorized: false }
    });

    await initialConnection.query(`CREATE DATABASE IF NOT EXISTS 
      ${dbConfig.database}
    `);
    await initialConnection.end();

    // Probar la conexión del pool principal a la base de datos ya existente
    const connection = await pool.getConnection();
    connection.release();
    console.log('Conexión a la base de datos y creación de la misma exitosa.');

  } catch (error) {
    console.error('Error al conectar o crear la base de datos:', error.message);
    process.exit(1);
  }
}

module.exports = { pool, testConnection };