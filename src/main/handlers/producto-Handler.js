const { ipcMain } = require('electron');
import { actualizarProducto, eliminarProducto, insertarProducto, listarProductos } from '../Controller/ProductoController';
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

  ipcMain.handle('listar-productos', async () => {
    try {
      const productos =  listarProductos();  // Llama a la función para obtener los productos

      // Retornamos la lista de productos al renderer
      return { success: true, productos };
    } catch (error) {
      console.error('Error al listar productos:', error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('eliminar-producto', async (_event, id) => {
    return eliminarProducto(id);
  });


  ipcMain.handle('actualizar-producto', async (_event, producto) => {
    return actualizarProducto(producto);
  });

}

module.exports = { registerProductoHandlers };
