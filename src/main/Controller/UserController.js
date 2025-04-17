// // const db = require('../conexion');
// import  db  from '../conexion'; 

// export  function  insertarUsuario(nombre, email) {
//   return new Promise((resolve, reject) => {
//     db.run(
//       `INSERT INTO usuarios (nombre, email) VALUES (?, ?)`,
//       [nombre, email],
//       function (err) {
//         if (err) reject(err.message);
//         else resolve(this.lastID);
//       }
//     );
//   });
// }

// export function obtenerUsuarios() {
//   return new Promise((resolve, reject) => {
//     db.all(`SELECT * FROM usuarios`, [], (err, rows) => {
//       if (err) reject(err.message);
//       else resolve(rows);
//     });
//   });
// }

// exports = { insertarUsuario, obtenerUsuarios };

import db from '../DB/conexion';

function getUsuarios() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM usuarios', [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function insertUsuario(nombre) {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO usuarios(nombre) VALUES (?)', [nombre], function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID });
    });
  });
}

module.exports = {
  getUsuarios,
  insertUsuario,
};
