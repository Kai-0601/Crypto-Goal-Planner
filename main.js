// ──────────────────────────────────────────────────────
// Electron 主程序 (Main Process)
// ──────────────────────────────────────────────────────
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');

const LOCAL_SERVER_PORT = 17654;
const MAX_USDT_TWD_TICKER_URL = 'https://max-api.maicoin.com/api/v2/tickers/usdttwd';
const TWD_RATE_REFRESH_MS = 8 * 60 * 60 * 1000;
const TWD_RATE_CACHE_FILE = 'usdt-twd-rate-cache.json';
let mainWindow = null;
let usdtTwdRateCache = null;
let usdtTwdFetchPromise = null;

// MIME 類型對應
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.jsx': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml'
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  res.end(JSON.stringify(payload));
}

function parsePositiveNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : null;
}

function getRateCachePath() {
  return path.join(app.getPath('userData'), TWD_RATE_CACHE_FILE);
}

function normalizeUsdtTwdRate(raw, updatedAt = Date.now(), stale = false) {
  const rate = parsePositiveNumber(raw && raw.last);
  if (!rate) throw new Error('Invalid MAX USDT/TWD rate');
  return {
    source: 'Max 交易所',
    market: 'usdttwd',
    rate,
    buy: parsePositiveNumber(raw.buy),
    sell: parsePositiveNumber(raw.sell),
    maxTimestamp: Number(raw.at) || null,
    updatedAt,
    expiresAt: updatedAt + TWD_RATE_REFRESH_MS,
    refreshIntervalMs: TWD_RATE_REFRESH_MS,
    stale
  };
}

function loadUsdtTwdRateCache() {
  if (usdtTwdRateCache) return usdtTwdRateCache;
  try {
    const payload = JSON.parse(fs.readFileSync(getRateCachePath(), 'utf8'));
    if (payload && parsePositiveNumber(payload.rate) && Number.isFinite(Number(payload.updatedAt))) {
      usdtTwdRateCache = payload;
      return usdtTwdRateCache;
    }
  } catch (e) {}
  return null;
}

function saveUsdtTwdRateCache(payload) {
  usdtTwdRateCache = payload;
  try {
    fs.writeFileSync(getRateCachePath(), JSON.stringify(payload, null, 2), 'utf8');
  } catch (e) {}
}

function isFreshRateCache(payload) {
  return payload && Date.now() - Number(payload.updatedAt) < TWD_RATE_REFRESH_MS;
}

function requestJson(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'crypto-doubling-calculator' } }, (res) => {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        res.resume();
        reject(new Error(`MAX API ${res.statusCode}`));
        return;
      }
      let body = '';
      res.setEncoding('utf8');
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => {
        try { resolve(JSON.parse(body)); }
        catch (error) { reject(error); }
      });
    });
    req.setTimeout(10000, () => {
      req.destroy(new Error('MAX API timeout'));
    });
    req.on('error', reject);
  });
}

async function getUsdtTwdRate(force = false) {
  const cached = loadUsdtTwdRateCache();
  if (!force && isFreshRateCache(cached)) return { ...cached, stale: false };

  if (!usdtTwdFetchPromise) {
    usdtTwdFetchPromise = requestJson(MAX_USDT_TWD_TICKER_URL);
  }

  try {
    const ticker = await usdtTwdFetchPromise;
    const payload = normalizeUsdtTwdRate(ticker, Date.now(), false);
    saveUsdtTwdRateCache(payload);
    return payload;
  } catch (error) {
    if (cached) return { ...cached, stale: true, error: error.message || 'MAX 匯率更新失敗' };
    throw error;
  } finally {
    usdtTwdFetchPromise = null;
  }
}

// 建立本地 HTTP 伺服器，解決 file:// CORS 限制
function startLocalServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const urlPath = decodeURIComponent(req.url.split('?')[0]);

      if (urlPath === '/api/usdt-twd-rate') {
        getUsdtTwdRate(req.url.includes('force=1'))
          .then(payload => sendJson(res, 200, payload))
          .catch(error => sendJson(res, 502, {
            source: 'Max 交易所',
            market: 'usdttwd',
            rate: null,
            refreshIntervalMs: TWD_RATE_REFRESH_MS,
            loaded: true,
            error: error.message || 'MAX 匯率載入失敗'
          }));
        return;
      }

      const filePath = path.join(__dirname, urlPath === '/' ? 'index.html' : urlPath);
      const ext = path.extname(filePath).toLowerCase();

      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404);
          res.end('Not Found');
          return;
        }
        res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
        res.end(data);
      });
    });

    server.on('error', reject);
    server.listen(LOCAL_SERVER_PORT, '127.0.0.1', () => {
      resolve(server);
    });
  });
}

// 建立主視窗
function createWindow() {
  if (mainWindow && !mainWindow.isDestroyed()) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
    return;
  }

  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: '加密貨幣翻倍計算器',
    backgroundColor: '#020617',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.loadURL(`http://127.0.0.1:${LOCAL_SERVER_PORT}`);
}

const gotSingleInstanceLock = app.requestSingleInstanceLock();

if (!gotSingleInstanceLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    createWindow();
  });

  // 應用程式就緒後建立視窗
  app.whenReady().then(async () => {
    const server = await startLocalServer();

    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });

    // 應用退出時關閉伺服器
    app.on('before-quit', () => {
      server.close();
    });
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
