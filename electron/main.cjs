const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        minWidth: 1024,
        minHeight: 768,
        title: 'EazyRX POS',
        icon: path.join(__dirname, '../public/icon.png'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.cjs'),
        },
        autoHideMenuBar: true,
        backgroundColor: '#0f172a',
    });

    // Load app
    if (isDev) {
        // Development: Load from Vite dev server
        mainWindow.loadURL('http://localhost:5173/login/pos');
        mainWindow.webContents.openDevTools();
    } else {
        // Production: Load from built files
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }

    // Handle window close
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Prevent navigation away from app
    mainWindow.webContents.on('will-navigate', (event, url) => {
        if (!url.startsWith('http://localhost') && !url.startsWith('file://')) {
            event.preventDefault();
        }
    });
}

// App lifecycle
app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// IPC Handlers (for future hardware integration)
ipcMain.handle('print-receipt', async (event, receiptData) => {
    // TODO: Implement receipt printing
    console.log('Print receipt:', receiptData);
    return { success: true };
});

ipcMain.handle('scan-barcode', async (event) => {
    // TODO: Implement barcode scanner
    console.log('Scan barcode');
    return { barcode: null };
});

ipcMain.handle('get-offline-status', async (event) => {
    // TODO: Check Local Node connection
    return { offline: false };
});
