===== 版本變更封存 =====

## 2026-06-03 從 version_history.txt 搬移

[v14] 2026-05-18
build: 打包 CSV 手續費版本 EXE 1.0.1
- Commit: 未提交（封裝後待建立 commit）
- 封裝：使用既有 npm run build / electron-builder --win --x64 重新產出 Windows x64 安裝版與可攜版
- 產物：dist/加密貨幣翻倍計算器 Setup 1.0.1.exe
- 產物：dist/加密貨幣翻倍計算器 1.0.1.exe
- 產物：dist/加密貨幣翻倍計算器 Setup 1.0.1.exe.blockmap
- 產物：dist/win-unpacked/加密貨幣翻倍計算器.exe
- 程式碼變化：封裝包含 exchange_fees_comparison.csv 與 CSV 驅動交易成本模型
- 變更檔案：dist/*, version_history.txt

[v13] 2026-05-18
feat: 交易所 VIP 手續費改用 CSV 資料來源
- Commit: 未提交（工作樹仍有既有未提交變更）
- 新增：讀取 exchange_fees_comparison.csv 作為交易所、VIP 等級、限價 Maker 與市價 Taker 手續費資料來源
- 新增：CSV 解析器支援含逗號引號欄位、近似值與保守範圍計算；Not public 費率不提供計算選項
- 新增：交易成本面板顯示資料來源、VIP 資格備註與未公開費率提示
- 變更：Electron 本機伺服器新增 text/csv MIME，封裝清單加入 exchange_fees_comparison.csv
- 程式碼變化：將內建硬編碼費率表改為 CSV 解析 catalog，並保留內建 CSV 備援以避免載入失敗時無資料
- 變更檔案：CryptoCalculator.jsx, main.js, package.json, exchange_fees_comparison.csv, version_history.txt

## 2026-05-29 從 version_history.txt 搬移

[v12] 2026-05-18
feat: 交易成本改為交易所 VIP 費率表
- Commit: 未提交（工作樹仍有既有未提交變更）
- 新增：Binance / OKX / BingX / MEXC / Gate 交易所 VIP 等級費率表
- 新增：交易成本模型依使用者選擇的交易所、VIP 等級與限價 Maker / 市價 Taker 自動套用手續費
- 新增：成本顯示支援 Maker 返佣情境，推演明細改為「成本/返佣」顯示淨影響
- 保留：滑價與資金費率仍可手動調整，以符合不同交易品種與行情流動性
- 程式碼變化：移除手動 Maker/Taker 手續費輸入，改由 getCostSettings 依 feeTier 讀取費率表
- 變更檔案：CryptoCalculator.jsx, version_history.txt

[v11] 2026-05-17
build: 封裝輸出目錄改為 dist
- Commit: 未提交（工作樹仍有既有未提交變更）
- 封裝：將 electron-builder build.directories.output 從 output 改為 dist
- 封裝：使用既有 npm run build / electron-builder --win --x64 重新產出 Windows x64 安裝版與可攜版
- 產物：dist/加密貨幣翻倍計算器 Setup 1.0.1.exe
- 產物：dist/加密貨幣翻倍計算器 1.0.1.exe
- 產物：dist/加密貨幣翻倍計算器 Setup 1.0.1.exe.blockmap
- 產物：dist/win-unpacked/加密貨幣翻倍計算器.exe
- 程式碼變化：未修改應用邏輯；僅調整封裝輸出目錄與更新封裝產物
- 變更檔案：package.json, dist/*, version_history.txt

[v10] 2026-05-17
build: 打包 Windows EXE 1.0.1
- Commit: 未提交（本次僅執行封裝，工作樹仍有既有未提交變更）
- 封裝：使用既有 npm run build / electron-builder --win --x64 流程
- 產物：output/加密貨幣翻倍計算器 Setup 1.0.1.exe
- 產物：output/加密貨幣翻倍計算器 1.0.1.exe
- 產物：output/加密貨幣翻倍計算器 Setup 1.0.1.exe.blockmap
- 產物：output/win-unpacked/加密貨幣翻倍計算器.exe
- 程式碼變化：未修改應用程式碼；更新封裝輸出產物與版本紀錄
- 變更檔案：output/*, version_history.txt

[v9] 2026-05-16
feat: 新增交易成本模型與策略分析工具
- Commit: 未提交（工作樹已有既有未提交變更，避免混入無關修改）
- 新增：交易所成本模型，支援 Binance / OKX / BingX / MEXC / Gate 預設模板
- 新增：Maker / Taker 手續費、滑價與資金費率設定，推演明細改為顯示毛利、成本與淨利
- 新增：資金曲線視覺化圖表，標示目標線、淨值曲線、總毛利、總成本與總淨利
- 新增：達標倒推計算器，可依期望達成局數反推每局淨成長、所需收益率與建議倉位
- 新增：倉位規則健康檢查，偵測成本吃掉收益、過高倉位、重複門檻與高滑價風險
- 新增：里程碑式目標追蹤與敏感度分析面板，支援本金、倉位與成本變動比較
- 程式碼變化：擴充核心 simulateGrowthPath / calculateRoundsToTarget 成本計算參數，新增多個分析面板元件
- 變更檔案：CryptoCalculator.jsx, version_history.txt

[v8] 2026-05-04
fix: 目標清單收斂為單一 1,540
- Commit: 未提交（CryptoCalculator.jsx 已有既有未提交變更，避免混入無關修改）
- 修復：預設達成目標只保留 1,540，移除 3,080 與 32,000
- 修復：載入既有多目標 localStorage 設定時只保留 1,540，並重設 activeTargetTab 為 0
- 程式碼變化：新增 DEFAULT_TARGET，集中單一目標值來源
- 變更檔案：CryptoCalculator.jsx, version_history.txt

[v7] 2026-04-05
feat: 全面視覺品質升級 — Premium Dark Fintech 風格
- 視覺：全面消除 8-11px 微小字型，最低 12px (text-xs)，所有元素放大 1-2 級
- 視覺：glass-panel 升級為漸層玻璃 (from-slate-800/50 to-slate-900/40) + shadow-xl
- 視覺：body 背景改為 160deg 深藍漸層，更有深度感
- 視覺：range slider 自訂樣式 — 18px 圓形滑塊 + indigo 發光效果
- 視覺：策略卡片數字放大至 text-2xl font-black，摘要指標放大至 text-3xl
- 佈局：側邊欄加寬 w-80→w-[360px]，內部 padding p-3.5→p-5，更多呼吸空間
- 互動：所有按鈕最低 py-2 (32px+)，輸入框 py-2.5，符合觸控規範
- 互動：所有圓角統一 — 區塊 rounded-2xl，按鈕/輸入 rounded-xl
- 表格：推演/比較/行情表格行高增加 py-2.5，字體 text-sm font-mono
- 進度條：高度 h-1.5→h-2，狀態文字 text-sm，更易閱讀
- 變更檔案：CryptoCalculator.jsx, index.html

[v6] 2026-04-05
feat: 全面 UI/UX 重新設計 + 新增固定金額下注模式
- 重構：水平 3 面板控制列 → 左側邊欄 (w-80) + 右側全高內容區佈局
  - 側邊欄：資金設定 / 下注設定（百分比 or 固定金額）
  - 右側上方：收益率策略 (8 卡片橫排) + 模擬摘要 (3 指標 + 進度條水平一行)
  - 右側下方：推演、比較、行情三個 Tab 內容區
- 新增：固定金額下注模式 — segmented control 切換「百分比 %」/「固定金額 $」
  - 固定金額模式：每次下單使用固定 USDT 金額，不隨本金變動
  - 快捷金額按鈕：10 / 25 / 50 / 100 / 200 / 500 USDT
  - 超過餘額時自動使用全部餘額
  - 核心引擎 calculateRoundsToTarget / simulateGrowthPath 皆已支援固定金額
- 新增：Inter 字型（Google Fonts CDN），全域套用
- 變更：glass-panel 風格精緻化 — bg-slate-900/40 + backdrop-blur-xl + rounded-xl + shadow-black/20
- 變更：自訂 range slider 樣式（圓形滑塊 + indigo 發光效果）
- 變更：所有子元件視覺縮小適配側邊欄寬度
- 變更：推演表格「倉位」欄位根據下注模式顯示 % 或 $ 金額
- 變更：比較矩陣新增固定金額模式提示
- 變更：DEFAULT_SETTINGS 新增 fixedAmountEnabled / fixedAmount 欄位
- 變更檔案：CryptoCalculator.jsx, index.html

[v5] 2026-04-04 - 6506f13
feat: 上面板放大 100% — 所有元素尺寸翻倍
- 變更：Header 區塊 — 圖標 w-4→w-7、標題 text-sm→text-2xl、副標題 text-xs→text-lg、padding px-3 py-1→px-6 py-3
- 變更：Panel A (資金與目標) — 標題 text-[11px]→text-lg、input text-xs→text-lg、py-1→py-2.5、label text-[9px]→text-sm、目標 Tab text-[10px]→text-base
- 變更：Panel B (倉位控制) — 倉位數字 text-xs→text-lg、快捷按鈕 text-[10px]→text-base py-0.5→py-1.5、toggle w-8 h-4→w-12 h-6、slider h-1→h-2
- 變更：Panel C (策略 & 摘要) — 策略卡片標籤 text-[10px]→text-base、數字 text-sm→text-2xl、摘要指標 text-sm→text-2xl、進度條 h-1→h-2.5
- 變更：Tab Bar — text-xs→text-base、icon w-3→w-5、py-1→py-2
- 變更：MarketStatusBadge — text-[11px]→text-base、dot w-1.5→w-2.5
- 變更：StorageIndicator — text-xs→text-base、dot w-1.5→w-2.5
- 變更檔案：CryptoCalculator.jsx

[v4] 2026-04-03 - b92b930
feat: UIUX 架構大改版 — 水平控制列 + 全寬內容區
- 重構：2 欄佈局（左側邊欄+右側內容）→ 水平 3 面板控制列 + 全寬 Tab 內容
  - Panel A (col-span-3): 資金與目標（輸入框並排）
  - Panel B (col-span-3): 倉位控制（slider + 8 快捷鍵一行 + 動態切換）
  - Panel C (col-span-6): 策略卡片 + 模擬摘要 + 進度追蹤
- 效果：消除左側邊欄 ~445px 空白浪費，Tab 內容區增至 ~690px 高度
- 修正：emoji 改為 Lucide SVG Icon（符合 UI 規範）
- 變更：所有互動元素加入 cursor-pointer
- 變更檔案：CryptoCalculator.jsx

[v3] 2026-04-03 - efc82c8
feat: 全面重新編排 UIUX，確保 1440×900 預設視窗顯示所有功能
- 新增：市場狀態橫幅合併至 Header（MarketStatusBanner → MarketStatusBadge），節省 ~32px 垂直空間
- 新增：模擬摘要改為水平佈局，3 指標卡 + 進度追蹤同一行，節省 ~80px 垂直空間
- 變更：所有面板 padding 縮減（p-3 → p-2/p-2.5），gap 縮減（gap-2 → gap-1/gap-1.5）
- 變更：glass-panel 圓角縮小（rounded-3xl → rounded-2xl）
- 變更檔案：CryptoCalculator.jsx, index.html

[v2] 2026-03-30 - 9b4a16e
fix: 初始資金與目前持有欄位支援清空且可輸入 0
- 新增 principalRaw / balanceRaw 本地字串 state，解耦顯示值與數值
- 變更檔案：CryptoCalculator.jsx

[v1] 2026-03-30 - f5f2077
fix: 修復初始資金與目前持有欄位無法輸入數字 0 的問題
- 變更檔案：CryptoCalculator.jsx (第 1074、1094 行)
