// const db = require('./conexion.js');

import db from './conexion';
// const db  = require('./conexion.js');
// const Database = require('better-sqlite3');

// const db = require(path.join(__dirname, 'conexion'));
// import { db } from './conexion';

function runMigrations() {
  // db.serialize(() => {
  //   db.run(`
  //     CREATE TABLE IF NOT EXISTS usuarios (
  //       id INTEGER PRIMARY KEY AUTOINCREMENT,
  //       nombre TEXT NOT NULL,
  //       email TEXT NOT NULL UNIQUE
  //     );
  //   `);

  //   db.run(`
  //     CREATE TABLE IF NOT EXISTS productos (
  //       id INTEGER PRIMARY KEY AUTOINCREMENT,
  //       nombre TEXT NOT NULL,
  //       precio REAL NOT NULL
  //     );
  //   `);

  //   console.log('Migraciones ejecutadas correctamente.');
  // });

  // Crear tabla si no existe
  db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL
    )
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS producto (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      descripcion TEXT NOT NULL,
      precio_compra TEXT UNIQUE NOT NULL,
      precio_venta TEXT UNIQUE NOT NULL,
      cantidad_Stock TEXT UNIQUE NOT NULL

    )
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS producto_a (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      precio_compra TEXT UNIQUE NOT NULL,
      precio_venta TEXT UNIQUE NOT NULL,
      stock TEXT UNIQUE NOT NULL 

    )
  `).run();

  // Tabla Cliente
  db.exec(`
  CREATE TABLE IF NOT EXISTS Cliente (
    idCliente INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    telefono TEXT,
    direccion TEXT
  );
`);

  // Tabla Producto
  db.exec(`
  CREATE TABLE IF NOT EXISTS Producto (
    idProducto INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    descripcion TEXT,
    precioCompra REAL,
    precioVenta REAL,
    cantidadStock INTEGER,
    utilidadPercibida REAL
  );
`);

  // Tabla Factura
  db.exec(`
  CREATE TABLE IF NOT EXISTS Factura (
    idFactura INTEGER PRIMARY KEY AUTOINCREMENT,
    idCliente INTEGER,
    idEmpleado INTEGER,
    fecha TEXT,
    total REAL,
    FOREIGN KEY(idCliente) REFERENCES Cliente(idCliente),
    FOREIGN KEY(idEmpleado) REFERENCES Empleado(idEmpleado)
  );
`);

  // Tabla Empleado
  db.exec(`
  CREATE TABLE IF NOT EXISTS Empleado (
    idEmpleado INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    puesto TEXT
  );
`);

  // Tabla Pedido
  db.exec(`
  CREATE TABLE IF NOT EXISTS Pedido (
    idPedido INTEGER PRIMARY KEY AUTOINCREMENT,
    fechaPedido TEXT,
    cantidad INTEGER
  );
`);

  // Tabla Proveedor
  db.exec(`
  CREATE TABLE IF NOT EXISTS Proveedor (
    idProveedor INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    direccion TEXT,
    telefono TEXT
  );
`);


}

try {
  runMigrations()
} catch (error) {

  console.log("Ocurri un erro::", error);


}
export default runMigrations;

// module.exports = runMigrations;
// module.exports = { runMigrations };