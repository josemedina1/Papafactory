/// <reference types="vite/client" />

// Extensión de la interfaz Window para Electron
declare global {
  interface Window {
    electron?: {
      ipcRenderer: {
        invoke(channel: string, ...args: any[]): Promise<any>;
      };
      printSilent(htmlContent: string): Promise<{ success: boolean; error?: string }>;
    };
  }
}

export {}
