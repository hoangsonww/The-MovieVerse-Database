const { app, BrowserWindow, ipcMain } = require('electron');
let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    mainWindow.loadFile('index.html');

    mainWindow.webContents.openDevTools();
}

app.whenReady().then(createWindow);

ipcMain.on('message-to-main', (event, arg) => {
    console.log(arg);
    mainWindow.webContents.send('message-from-main', 'Hello from Main');
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
