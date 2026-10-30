const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const { pathToFileURL } = require('url');
const { autoUpdater } = require('electron-updater');
const { createUpdateController } = require('./desktop-updates.cjs');

let mainWindow;
let updates;
const appUrl = pathToFileURL(path.join(__dirname, 'dist/index.html')).href;

function registerUpdates() {
  updates = createUpdateController({
    updater: autoUpdater,
    version: app.getVersion(),
    enabled: app.isPackaged && process.platform === 'win32',
    onState: (state) => {
      if (mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.send('updates:state-changed', state);
    }
  });
  const trusted = (event) => mainWindow && event.sender === mainWindow.webContents &&
    event.senderFrame === event.sender.mainFrame && event.senderFrame.url.split('#')[0] === appUrl;
  for (const [channel, action] of Object.entries({
    'updates:state': () => updates.getState(),
    'updates:check': () => updates.check(),
    'updates:download': () => updates.download(),
    'updates:install': async () => {
      if (updates.getState().status !== 'downloaded') return false;
      const { response } = await dialog.showMessageBox(mainWindow, {
        type: 'question', buttons: ['Actualizar y reiniciar', 'Cancelar'], defaultId: 1, cancelId: 1,
        title: 'Actualizar PapaFactory',
        message: 'La aplicación se cerrará para instalar la actualización.',
        detail: 'Finaliza tus pedidos y guarda el trabajo pendiente antes de continuar.'
      });
      return response === 0 && updates.install();
    }
  })) {
    ipcMain.handle(channel, (event) => {
      if (!trusted(event)) throw new Error('Solicitud de actualización no autorizada');
      return action();
    });
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'PapaFactory',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      preload: path.join(__dirname, 'preload.cjs')
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
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (url.split('#')[0] !== appUrl) event.preventDefault();
  });
  // Las ventanas en blanco se usan para imprimir los comprobantes.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => url === 'about:blank'
    ? { action: 'allow', overrideBrowserWindowOptions: { webPreferences: { nodeIntegration: false, contextIsolation: true, sandbox: true, preload: undefined } } }
    : { action: 'deny' });
  mainWindow.webContents.on('did-finish-load', () => { void updates.check(); });
}

app.whenReady().then(() => { registerUpdates(); createWindow(); });

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
