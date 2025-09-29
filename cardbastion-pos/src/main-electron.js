const { app, BrowserWindow } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 600,
    height: 400
  });

  win.loadURL(' http://localhost:5173');
}

app.whenReady().then(() => {
  console.log('✅ Electron ejecutándose correctamente');
  createWindow();
});
