const { contextBridge, ipcRenderer } = require('electron');

// Exponer la API de impresión de manera segura
contextBridge.exposeInMainWorld(
  'electron',
  {
    printSilent: async (htmlContent) => {
      try {
        return await ipcRenderer.invoke('print-silent', htmlContent);
      } catch (error) {
        console.error('Error en la impresión:', error);
        throw error;
      }
    }
  }
); 