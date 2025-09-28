const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow () {
  console.log('Creando ventana...');
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true
    }
  });

  win.loadURL('http://localhost:5173');
  win.webContents.on('did-finish-load', () => {
    console.log('Ventana cargada');
  });
}

app.whenReady().then(() => {
  console.log('App lista');
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
