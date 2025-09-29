// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getProducts: () => ipcRenderer.invoke('db:getProducts'),
  findProductBySku: (sku) => ipcRenderer.invoke('db:findProductBySku', sku),
  upsertProducts: (products) => ipcRenderer.invoke('db:upsertProducts', products),
  createSale: (payload) => ipcRenderer.invoke('db:createSale', payload),
  getPendingSales: () => ipcRenderer.invoke('db:getPendingSales'),
  markSaleSynced: (info) => ipcRenderer.invoke('db:markSaleSynced', info),
  uploadPendingSales: (opts) => ipcRenderer.invoke('sync:uploadPendingSales', opts),
});

console.log('✅ preload.js ejecutado');
