# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a small Electron desktop app named `crypto-doubling-calculator` / `加密貨幣翻倍計算器`. It ships a local React + Tailwind calculator UI for simulating crypto position sizing and target-doubling scenarios.

There is no project README, AGENTS.md, Projectskills.md, Cursor rule, or Copilot instruction file in the repository root at the time this file was updated.

## Common Commands

```powershell
npm install          # install Electron and electron-builder dependencies
npm run start       # launch the Electron app locally
npm run build       # build Windows x64 NSIS installer and portable executable
npm run build:dir   # build unpacked Windows x64 app directory for inspection
```

`package.json` currently does not define `test`, `lint`, `typecheck`, or single-test scripts. Do not report those checks as run unless scripts are added first.

## Architecture

- `package.json` is the source of app metadata and Electron Builder configuration. The packaged app includes `main.js`, `preload.js`, `index.html`, and `CryptoCalculator.jsx`; Windows artifacts are configured to emit under `dist/` using resources from `build/`.
- `main.js` is the Electron main process. It starts a local HTTP server bound to `127.0.0.1:17654`, serves files from the app directory with a small MIME map, exposes `/api/usdt-twd-rate` as a cached Max Exchange USDT/TWD proxy, creates a single `BrowserWindow`, and loads `http://127.0.0.1:17654`. This avoids `file://` CORS issues for the JSX module and Max ticker lookup. The renderer runs with `contextIsolation: true` and `nodeIntegration: false`.
- `preload.js` exposes a minimal `window.electronAPI` object via `contextBridge`. Renderer changes should not assume Node APIs are available; add any required native bridge APIs through preload/main explicitly.
- `index.html` defines the visual shell: Traditional Chinese HTML metadata, Tailwind CDN configuration, CSS variables, app-wide styles, React/ReactDOM CDN scripts, Lucide icons, Babel Standalone, and then loads `CryptoCalculator.jsx` as `type="text/babel"`. It also contains a fallback message for direct `file://` opening.
- `CryptoCalculator.jsx` is a single-file React app. The top section contains constants/default settings, Max USDT/TWD rate loading, calculation helpers (`calculatePosition`, `calculateRoundsToTarget`, `simulateGrowthPath`), optional MEXC Wallet Balance sync, and memoized simulation hooks. `useLocalSettings` persists user settings to `localStorage` under `crypto-doubling-calculator_settings`.
- The USDT/TWD conversion rate comes from Max Exchange via `main.js` `/api/usdt-twd-rate`; it is cached in Electron `userData` for 8 hours and reused if a refresh fails.
- The renderer UI is organized around `App`: a left sidebar for capital, targets, optional MEXC binding, order mode, fixed amount, and dynamic rules; a right workspace for metric cards, scenario selection, simulation details, sensitivity tools, and the comparison matrix. Modal components edit targets, scenarios, and reset confirmation.
- Generated binaries and unpacked artifacts should be treated as build outputs, not source. Prefer changing the source files included by Electron Builder, then rebuild.

## Project-Specific Notes

- UI copy and user-facing labels are Traditional Chinese.
- The UI stack is CDN-loaded React 18, Tailwind CSS, Lucide, and Babel Standalone rather than a Vite/Webpack build pipeline.
- Calculator behavior is mostly pure client-side state plus `localStorage`; the only external runtime data source is Max Exchange's public USDT/TWD ticker, fetched through the local Electron server and cached for 8 hours.
- For user-facing app changes, append an entry to `version_history.txt` without deleting or rewriting older history.
