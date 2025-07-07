const { app, BrowserWindow, shell, ipcMain } = require('electron');
const path = require('path');

// Detectar si estamos en desarrollo
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

// Mantener una referencia global de la ventana principal
let mainWindow = null;

function createWindow() {
  // Crear la ventana principal
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    icon: path.join(__dirname, 'public/icon.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    show: false,
    autoHideMenuBar: true
  });

  // Cargar la aplicación
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173').catch(err => {
      console.error('Error loading development URL:', err);
      mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
    });
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
  }

  // Mostrar ventana cuando esté lista
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Manejar enlaces externos
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

// Este método se ejecuta cuando Electron ha terminado de inicializarse
app.whenReady().then(() => {
  createWindow();

  // Configurar IPC para impresión silenciosa
  ipcMain.handle('print-silent', async (event, htmlContent) => {
    return new Promise((resolve, reject) => {
      try {
        // Crear una ventana oculta para la impresión
        const printWindow = new BrowserWindow({
          show: false,
          webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
          }
        });

        printWindow.webContents.on('did-finish-load', () => {
          // Configurar opciones de impresión
          const options = {
            silent: true,
            deviceName: '', // Usar impresora predeterminada
            printBackground: true,
            color: true,
            margins: {
              marginType: 'none'
            }
          };

          // Imprimir directamente
          printWindow.webContents.print(options, (success, failureReason) => {
            if (success) {
              resolve({ success: true });
            } else {
              console.error('Fallo en la impresión:', failureReason);
              reject(new Error(failureReason));
            }
            // Cerrar la ventana de impresión
            printWindow.close();
          });
        });

        // Cargar el contenido HTML
        printWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent));

      } catch (error) {
        console.error('Error al imprimir:', error);
        reject(error);
      }
    });
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Salir cuando todas las ventanas estén cerradas (excepto en macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Configuración de seguridad adicional
app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (navigationEvent, navigationURL) => {
    const parsedUrl = new URL(navigationURL);
    if (parsedUrl.origin !== 'http://localhost:5173' && parsedUrl.origin !== 'file://') {
      navigationEvent.preventDefault();
    }
  });
}); 