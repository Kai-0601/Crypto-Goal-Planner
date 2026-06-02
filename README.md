# Crypto Goal Planner

加密貨幣翻倍計算器是一個 Electron 桌面工具，用來推演加密貨幣資金成長、倉位配置、目標達成輪數與不同收益率情境。介面以繁體中文為主，適合用來做本機策略試算與風險檢查。

> 本專案僅提供試算與規劃用途，不構成投資建議。加密貨幣交易具有高波動與本金損失風險，請自行評估並控管風險。

## 主要功能

- 資金翻倍推演：輸入初始資金、目前持有、目標金額與單次收益率，估算達標輪數。
- 多目標管理：可建立多組目標金額，並支援 USDT / TWD 輸入換算。
- 倉位模式：支援百分比倉位、固定投入金額與動態倉位規則。
- 情境比較：內建多組收益率情境，可自訂策略並比較不同倉位下的達標輪數。
- 敏感度分析：比較本金變動、倉位變動與收益率情境對結果的影響。
- 交易所 API 設定中心：可在本機管理交易所 API 欄位、UID、備註與語言偏好。
- MEXC Wallet 選擇性綁定：可選擇是否從本機 MEXC Bot API 讀取 Wallet Balance。
- USDT/TWD 匯率：透過本機 Electron 伺服器代理 Max 交易所公開 ticker，並快取 8 小時。
- 本機資料保存：設定會保存在瀏覽器 `localStorage`，重啟應用後可延續使用。

## 技術架構

- Electron：桌面應用外殼與本機 HTTP 伺服器。
- React 18：主要介面與互動邏輯。
- Tailwind CSS CDN：介面樣式。
- Babel Standalone：在本機載入 `CryptoCalculator.jsx`。
- Lucide Icons CDN：介面圖示。
- electron-builder：Windows 安裝版與可攜版打包。

## 專案結構

```text
.
├── build/
│   ├── icon.ico
│   └── icon.png
├── CryptoCalculator.jsx
├── index.html
├── main.js
├── package.json
├── package-lock.json
├── preload.js
├── version_history.txt
└── version_history_archive.md
```

## 安裝與啟動

需求：

- Node.js
- npm
- Windows 環境建議用於打包與測試 Electron Builder 產物

安裝依賴：

```powershell
npm install
```

啟動桌面應用：

```powershell
npm run start
```

建立 Windows 安裝版與可攜版：

```powershell
npm run build
```

建立未封裝目錄供檢查：

```powershell
npm run build:dir
```

打包輸出會產生在 `dist/`，該目錄屬於建置產物，不應提交到 Git。

## 匯率與外部連線

應用啟動後，`main.js` 會在 `127.0.0.1:17654` 建立本機 HTTP 伺服器，負責：

- 載入本機 HTML / JSX / 圖示資源，避免 `file://` CORS 限制。
- 提供 `/api/usdt-twd-rate`，代理 Max 交易所公開 USDT/TWD ticker。
- 將 USDT/TWD 匯率快取到 Electron `userData`，快取時間為 8 小時；若刷新失敗，會嘗試使用舊快取。

## 敏感資料與安全注意事項

本專案已加入 `.gitignore`，避免下列內容被提交：

- `.env`、`.env.*`
- 金鑰與憑證檔，例如 `*.pem`、`*.p12`、`*.pfx`、`*.key`
- `secrets/`、`credentials/`
- `.claude/`、`.codex/`、`.agents/`、`agent-events.jsonl`
- `node_modules/`、`dist/`、`output/`、`release/`
- `*.exe`、`*.blockmap`

交易所 API 設定目前保存在本機 `localStorage` 的 `crypto-doubling-calculator_settings`。請不要把正式 API Key、Secret、Passphrase、`.env` 或任何帳戶資料提交到 GitHub。若要在共享裝置或正式交易環境使用，建議改成後端安全儲存或作業系統憑證庫流程。

## 開發注意事項

- Renderer 端沒有 Node.js 權限；需要原生能力時，應透過 `preload.js` 與 `main.js` 明確建立橋接。
- `main.js` 使用 `contextIsolation: true` 與 `nodeIntegration: false`。
- `package.json` 目前沒有 `test`、`lint` 或 `typecheck` script。
- 使用者介面文字以繁體中文為主。
- 新增、修復、重構、封裝或發布後，請更新 `version_history.txt`。

## 授權

MIT
