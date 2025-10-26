import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
// Custom APIs for renderer

/** 
 * 
 * En api van todas las fuciones 
 * Funciona como puente de segurid , seprado el backend y el frontend
 *  */


const api = {

  producto: {
    insertar: (data) => ipcRenderer.invoke('insertar-producto', data),
    listar: () => ipcRenderer.invoke('listar-productos'),
    eliminar: (id) => ipcRenderer.invoke('eliminar-producto', id),
    actulizar: (data) => ipcRenderer.invoke('actualizar-producto', data),
  },

  proveedor: {
    insertar: (data) => ipcRenderer.invoke('insertar-proveedor', data),
    listar: () => ipcRenderer.invoke('listar-proveedor'),
    eliminar: (id) => ipcRenderer.invoke('eliminar-proveedor', id),
    actualizar: (data) => ipcRenderer.invoke('actualizar-proveedor', data),
  },

  cliente: {
    insertar: (data) => ipcRenderer.invoke('insertar-cliente', data),
    listar: () => ipcRenderer.invoke('listar-cliente'),
    eliminar: (id) => ipcRenderer.invoke('eliminar-cliente', id),
    actualizar: (data) => ipcRenderer.invoke('actualizar-cliente', data),
  },

  compras: {
    insertar: (data) => ipcRenderer.invoke('insertar-compra', data),
    listar: () => ipcRenderer.invoke('listar-compras'),
    obtenerDetalles: (id) => ipcRenderer.invoke('obtener-detalles-compra', id),
    eliminar: (id) => ipcRenderer.invoke('eliminar-compra', id),
    actualizar: (data) => ipcRenderer.invoke('actualizar-compra', data),
    listarProveedores: () => ipcRenderer.invoke('listar-proveedores-compra'),
    listarProductos: () => ipcRenderer.invoke('listar-productos-compra'),
  },

  ventas: {
    insertar: (data) => ipcRenderer.invoke('insertar-venta', data),
    listar: () => ipcRenderer.invoke('listar-ventas'),
    obtenerDetalles: (id) => ipcRenderer.invoke('obtener-detalles-venta', id),
    eliminar: (id) => ipcRenderer.invoke('eliminar-venta', id),
    actualizar: (data) => ipcRenderer.invoke('actualizar-venta', data),
    listarProductos: () => ipcRenderer.invoke('listar-todos-productos-venta'),
    listarClientes: () => ipcRenderer.invoke('listar-clientes-venta'),
  },

}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    // contextBridge.exposeInMainWorld('electron', {
    //   ipcRenderer: ipcRenderer, // Expone ipcRenderer de forma segura
    // });
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
