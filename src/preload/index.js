import { contextBridge , ipcRenderer} from 'electron'
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
    // eliminar: (id) => ipcRenderer.invoke('eliminar-producto', id),
    // editar: (data) => ipcRenderer.invoke('editar-producto', data)
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
