const { ipcMain } = require('electron');
import {
    actualizarVenta,
    eliminarVenta,
    insertarVenta,
    listarVentas,
    obtenerDetallesVenta,
    listarProductosConStock,
    listarTodosProductosVenta,
    listarClientesVenta
} from '../Controller/VentaController';


export function registerVentaHandlers() {
    ipcMain.handle('insertar-venta', async (_event, data) => {
        try {
            const resultado = insertarVenta(data);
            return resultado; // Retorna el resultado completo, incluyendo el ID insertado
        } catch (err) {
            return { success: false, error: err.message };
        }
    });

    ipcMain.handle('listar-ventas', async (_event, fechaDesde, fechaHasta) => {
        try {
            const ventas = listarVentas(fechaDesde, fechaHasta);
            return ventas;
        } catch (error) {
            console.error('Error al listar ventas:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('obtener-detalles-venta', async (_event, ventaId) => {
        try {
            const detalles = obtenerDetallesVenta(ventaId);
            return detalles;
        } catch (error) {
            console.error('Error al obtener detalles de venta:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('eliminar-venta', async (_event, id) => {
        try {
            return eliminarVenta(id);
        } catch (error) {
            console.error('Error al eliminar venta:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('actualizar-venta', async (_event, venta) => {
        try {
            return actualizarVenta(venta);
        } catch (error) {
            console.error('Error al actualizar venta:', error);
            return { success: false, error: error.message };
        }
    });

    // Handlers auxiliares para obtener datos de dropdowns
    ipcMain.handle('listar-productos-con-stock', async () => {
        try {
            const productos = listarProductosConStock();
            return productos;
        } catch (error) {
            console.error('Error al listar productos con stock:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('listar-todos-productos-venta', async () => {
        try {
            const productos = listarTodosProductosVenta();
            return productos;
        } catch (error) {
            console.error('Error al listar todos los productos para venta:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('listar-clientes-venta', async () => {
        try {
            const clientes = listarClientesVenta();
            return clientes;
        } catch (error) {
            console.error('Error al listar clientes para venta:', error);
            return { success: false, error: error.message };
        }
    });
}
