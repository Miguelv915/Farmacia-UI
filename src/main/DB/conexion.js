// database.js
// const Database = require('better-sqlite3');

import  Database  from 'better-sqlite3';
import  path  from 'path';
// const path = require('path');

// Ruta al archivo SQLite
const dbPath = path.join(__dirname, 'data_Farmacia.db');

console.log("RUTA::",__dirname, 'data_Farmacia.db' );

const db = new Database(dbPath);

// Exportar la instancia
export default db; 
// module.exports = {db};