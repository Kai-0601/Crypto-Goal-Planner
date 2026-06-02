// ──────────────────────────────────────────────────────
// Electron Preload Script — Task 16
// 安全沙箱環境，不暴露 Node.js API 給渲染層
// ──────────────────────────────────────────────────────
const { contextBridge } = require('electron');

// 暴露安全的 API 給渲染層
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  isElectron: true
});
