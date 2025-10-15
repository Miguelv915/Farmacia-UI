const { ipcMain } = require('electron');
import {
    actualizarCompra,
    eliminarCompra,
    insertarCompra,
    listarCompras,
    obtenerDetallesCompra,
    listarProveedores,
    listarProductos
} from '../Controller/ComprasController';


export function registerCompraHandlers() {
    ipcMain.handle('insertar-compra', async (_event, data) => {
        try {
            const resultado = insertarCompra(data);
            return resultado; // Retorna el resultado completo, incluyendo el ID insertado
        } catch (err) {
            return { success: false, error: err.message };
        }
    });
    ipcMain.handle('listar-compras', async () => {
        try {
            const compras = listarCompras();  // Llama a la función para obtener las compras
            return compras;
            // Retornamos la lista de compras al renderer
        } catch (error) {
            console.error('Error al listar compras:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('obtener-detalles-compra', async (_event, compraId) => {
        try {
            const detalles = obtenerDetallesCompra(compraId);
            return detalles;
        } catch (error) {
            console.error('Error al obtener detalles de compra:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('eliminar-compra', async (_event, id) => {
        try {
            return eliminarCompra(id);
        } catch (error) {
            console.error('Error al eliminar compra:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('actualizar-compra', async (_event, compra) => {
        try {
            return actualizarCompra(compra);
        } catch (error) {
            console.error('Error al actualizar compra:', error);
            return { success: false, error: error.message };
        }
    });

    // Handlers auxiliares para obtener datos de dropdowns
    ipcMain.handle('listar-proveedores-compra', async () => {
        try {
            const proveedores = listarProveedores();
            return proveedores;
        } catch (error) {
            console.error('Error al listar proveedores para compra:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('listar-productos-compra', async () => {
        try {
            const productos = listarProductos();
            return productos;
        } catch (error) {
            console.error('Error al listar productos para compra:', error);
            return { success: false, error: error.message };
        }
    });
}

