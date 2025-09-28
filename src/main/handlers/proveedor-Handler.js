const { ipcMain } = require('electron');
import {
    actualizarProveedor,
    eliminarProveedor,
    // actualizarProducto, eliminarProducto, 
    insertarProveedor,
    listarProveedor
} from '../Controller/ProveedorController';


export function registerProveedorHandlers() {
    ipcMain.handle('insertar-proveedor', async (_event, data) => {
        try {
            const resultado = insertarProveedor(data);
            return resultado; // Retorna el resultado completo, incluyendo el ID insertado
        } catch (err) {
            return { success: false, error: err.message };
        }
    });
}
ipcMain.handle('listar-proveedor', async () => {
    try {
        const proveedores = listarProveedor();  // Llama a la función para obtener los proveedores

        // Retornamos la lista de proveedores al renderer
        return { success: true, proveedores };
    } catch (error) {
        console.error('Error al listar proveedores:', error);
        return { success: false, error: error.message };
    }
});


ipcMain.handle('eliminar-proveedor', async (_event, id) => {
    return eliminarProveedor(id);
});


ipcMain.handle('actualizar-proveedor', async (_event, producto) => {
    return actualizarProveedor(producto);
});
