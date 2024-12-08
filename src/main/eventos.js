const { ipcMain } = require('electron');
// const { insertarUsuario, obtenerUsuarios } = require('./DB/Queries/Usuario');
// import  ipcMain  from 'electron';

import  {insertarUsuario , obtenerUsuarios}  from './DB/Queries/Usuario';
export default function setupIPCHandlers() {
  ipcMain.handle('insertar-usuario', async (event, { nombre, email }) => {
    try {
      const id = await insertarUsuario(nombre, email);
      return { success: true, id };
    } catch (error) {
      return { success: false, error };
    }
  });

  ipcMain.handle('obtener-usuarios', async () => {
    try {
      const usuarios = await obtenerUsuarios();
      return { success: true, usuarios };
    } catch (error) {
      return { success: false, error };
    }
  });

console.log("hola meindo S");

}

// module.exports = setupIPCHandlers;
