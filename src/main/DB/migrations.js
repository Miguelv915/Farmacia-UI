// const db = require('./conexion');
import  db  from './conexion';

// const db = require(path.join(__dirname, 'conexion'));
// import { db } from './conexion';

function runMigrations() {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE
      );
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS productos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        precio REAL NOT NULL
      );
    `);

    console.log('Migraciones ejecutadas correctamente.');
  });
}
export default runMigrations; 

// module.exports = runMigrations;
// module.exports = { runMigrations };