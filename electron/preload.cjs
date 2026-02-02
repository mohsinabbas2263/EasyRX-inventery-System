const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
    // Receipt printing
    printReceipt: (receiptData) => ipcRenderer.invoke('print-receipt', receiptData),

    // Barcode scanning
    scanBarcode: () => ipcRenderer.invoke('scan-barcode'),

    // Offline status
    getOfflineStatus: () => ipcRenderer.invoke('get-offline-status'),

    // Platform info
    platform: process.platform,
    isElectron: true,
});
