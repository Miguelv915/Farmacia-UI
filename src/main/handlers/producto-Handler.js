const { ipcMain } = require('electron');
import { getUsuarios, insertUsuario } from '../Controller/UserController';


export function registerProductoHandlers() {
  ipcMain.handle('insertar-producto', async (_event, data) => {
    try {
      const resultado = insertarProducto(data);
      return resultado; // Retorna el resultado completo, incluyendo el ID insertado
    } catch (err) {
      return { success: false, error: err.message };
    }
  });
}

module.exports = { registerProductoHandlers };
