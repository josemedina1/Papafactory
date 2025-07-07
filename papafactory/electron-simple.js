const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'PapaFactory',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    autoHideMenuBar: true, // Ocultar menú automáticamente
    menuBarVisible: false   // Menú no visible
  });

  // Ocultar completamente el menú
  Menu.setApplicationMenu(null);

  // Cargar el archivo HTML de la aplicación construida
  mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));

  // Establecer el título de la ventana
  mainWindow.setTitle('PapaFactory');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
}); 