const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

// Ruta de almacenamiento persistente
const dbPath = path.join(app.getPath('userData'), 'database.db');

// Crear o abrir la base de datos
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.message);
  } else {
    console.log(`Base de datos conectada en: ${dbPath}`);
  }
});

// Crear una tabla de ejemplo
db.run(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
  )
`);

export default db; 

// module.exports = db;
