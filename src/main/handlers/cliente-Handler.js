const { ipcMain } = require('electron');
import {
    actualizarCliente,
    eliminarCliente,
    insertarCliente,
    listarCliente
} from '../Controller/ClienteController';


export function registerClienteHandlers() {
    ipcMain.handle('insertar-cliente', async (_event, data) => {
        try {
            const resultado = insertarCliente(data);
            return resultado; // Retorna el resultado completo, incluyendo el ID insertado
        } catch (err) {
            return { success: false, error: err.message };
        }
    });
}
ipcMain.handle('listar-cliente', async () => {
    try {
        const clientes = listarCliente();  // Llama a la funci�n para obtener los clientes
        return clientes
        // Retornamos la lista de clientes al renderer
        // return { success: true, clientes };
    } catch (error) {
        console.error('Error al listar clientes:', error);
        return { success: false, error: error.message };
    }
});


ipcMain.handle('eliminar-cliente', async (_event, id) => {
    return eliminarCliente(id);
});


ipcMain.handle('actualizar-cliente', async (_event, cliente) => {
    return actualizarCliente(cliente);
});