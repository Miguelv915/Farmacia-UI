import db from './DB/conexion';

const { ipcMain } = require('electron');
// const { insertarUsuario, obtenerUsuarios } = require('./DB/Queries/Usuario');
// import  ipcMain  from 'electron';

// import { insertarUsuario, obtenerUsuarios } from './DB/Queries/Usuario';


  function setupIPCHandlers() {
  // ipcMain.handle('insertar-usuario', async (event, { nombre, email }) => {
  //   try {
  //     const id = await insertarUsuario(nombre, email);
  //     return { success: true, id };
  //   } catch (error) {
  //     return { success: false, error };
  //   }
  // });

  // ipcMain.handle('obtener-usuarios', async () => {
  //   try {
  //     const usuarios = await obtenerUsuarios();
  //     return { success: true, usuarios };
  //   } catch (error) {
  //     return { success: false, error };
  //   }
  // });



  // Escuchar la inserción
  ipcMain.handle('insertar-producto', (event, producto) => {
    try {
      const stmt = db.prepare(`
      INSERT INTO producto (nombre, descripcion, precio_compra, precio_venta, cantidad_Stock)
      VALUES (?, ?, ?, ?, ?)
    `);

      const info = stmt.run(
        producto.nombre,
        producto.descripcion,
        producto.precioCompra,
        producto.precioVenta,
        producto.cantidadStock,
        
      );

      return { success: true, id: info.lastInsertRowid };
    } catch (error) {
      console.error('Error al insertar producto:', error);
      return { success: false, error: error.message };
    }
  });



  console.log("hola meindo S");

}

// module.exports = setupIPCHandlers;
