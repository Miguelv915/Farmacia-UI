// const db = require('../conexion');
import  db  from '../conexion'; 

export  function  insertarUsuario(nombre, email) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO usuarios (nombre, email) VALUES (?, ?)`,
      [nombre, email],
      function (err) {
        if (err) reject(err.message);
        else resolve(this.lastID);
      }
    );
  });
}

export function obtenerUsuarios() {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM usuarios`, [], (err, rows) => {
      if (err) reject(err.message);
      else resolve(rows);
    });
  });
}

// exports = { insertarUsuario, obtenerUsuarios };
