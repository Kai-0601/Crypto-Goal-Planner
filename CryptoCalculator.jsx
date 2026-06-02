/* =====================================================
 * 加密貨幣資產翻倍計算器 - CryptoCalculator.jsx
 * 單一檔案 React 應用程式（純本地版，無 Firebase）
 * ===================================================== */

const { useState, useEffect, useRef, useCallback, useMemo } = React;

// ──────────────────────────────────────────────────────
// Icon 元件
// ──────────────────────────────────────────────────────
const FALLBACK_ICONS = {
  'alert-triangle': [['path', { d: 'M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z' }], ['path', { d: 'M12 9v4' }], ['path', { d: 'M12 17h.01' }]],
  check: [['path', { d: 'm20 6-11 11-5-5' }]],
  target: [['circle', { cx: '12', cy: '12', r: '10' }], ['circle', { cx: '12', cy: '12', r: '6' }], ['circle', { cx: '12', cy: '12', r: '2' }]],
  x: [['path', { d: 'M18 6 6 18' }], ['path', { d: 'm6 6 12 12' }]],
  'grip-vertical': [['circle', { cx: '9', cy: '5', r: '1' }], ['circle', { cx: '9', cy: '12', r: '1' }], ['circle', { cx: '9', cy: '19', r: '1' }], ['circle', { cx: '15', cy: '5', r: '1' }], ['circle', { cx: '15', cy: '12', r: '1' }], ['circle', { cx: '15', cy: '19', r: '1' }]],
  'arrow-right': [['path', { d: 'M5 12h14' }], ['path', { d: 'm12 5 7 7-7 7' }]],
  plus: [['path', { d: 'M5 12h14' }], ['path', { d: 'M12 5v14' }]],
  settings: [['path', { d: 'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.52a2 2 0 0 1-1 1.72l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.72v-.52a2 2 0 0 1 1-1.72l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2Z' }], ['circle', { cx: '12', cy: '12', r: '3' }]],
  'trash-2': [['path', { d: 'M3 6h18' }], ['path', { d: 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6' }], ['path', { d: 'M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2' }], ['path', { d: 'M10 11v6' }], ['path', { d: 'M14 11v6' }]],
  'table-2': [['path', { d: 'M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0-12h12M3 9h6m0 12h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9' }]],
  info: [['circle', { cx: '12', cy: '12', r: '10' }], ['path', { d: 'M12 16v-4' }], ['path', { d: 'M12 8h.01' }]],
  'bar-chart-3': [['path', { d: 'M3 3v18h18' }], ['path', { d: 'M18 17V9' }], ['path', { d: 'M13 17V5' }], ['path', { d: 'M8 17v-3' }]],
  'rotate-ccw': [['path', { d: 'M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8' }], ['path', { d: 'M3 3v5h5' }]],
  'edit-2': [['path', { d: 'M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z' }], ['path', { d: 'm15 5 4 4' }]],
  wallet: [['path', { d: 'M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3v4a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V5' }], ['path', { d: 'M18 12h.01' }]],
  crosshair: [['circle', { cx: '12', cy: '12', r: '10' }], ['path', { d: 'M22 12h-4' }], ['path', { d: 'M6 12H2' }], ['path', { d: 'M12 6V2' }], ['path', { d: 'M12 22v-4' }]],
  percent: [['path', { d: 'm19 5-14 14' }], ['circle', { cx: '6.5', cy: '6.5', r: '2.5' }], ['circle', { cx: '17.5', cy: '17.5', r: '2.5' }]],
  banknote: [['rect', { x: '2', y: '6', width: '20', height: '12', rx: '2' }], ['circle', { cx: '12', cy: '12', r: '2' }], ['path', { d: 'M6 12h.01' }], ['path', { d: 'M18 12h.01' }]],
  flag: [['path', { d: 'M4 15s1-1 4-1 5 2 8 0 4-1 4-1V3s-1 1-4 1-5-2-8 0-4 1-4 1z' }], ['path', { d: 'M4 22v-7' }]],
  landmark: [['path', { d: 'M3 22h18' }], ['path', { d: 'M6 18v-7' }], ['path', { d: 'M10 18v-7' }], ['path', { d: 'M14 18v-7' }], ['path', { d: 'M18 18v-7' }], ['path', { d: 'M12 2 20 7H4z' }]],
  'trending-up': [['path', { d: 'm22 7-8.5 8.5-5-5L2 17' }], ['path', { d: 'M16 7h6v6' }]],
  zap: [['path', { d: 'M13 2 3 14h9l-1 8 10-12h-9z' }]],
  list: [['path', { d: 'M8 6h13' }], ['path', { d: 'M8 12h13' }], ['path', { d: 'M8 18h13' }], ['path', { d: 'M3 6h.01' }], ['path', { d: 'M3 12h.01' }], ['path', { d: 'M3 18h.01' }]],
  slash: [['circle', { cx: '12', cy: '12', r: '10' }], ['path', { d: 'M4.93 4.93 19.07 19.07' }]],
  'circle-off': [['circle', { cx: '12', cy: '12', r: '10' }], ['path', { d: 'M4.93 4.93 19.07 19.07' }]]
};

const Icon = ({ name, className = 'w-5 h-5', ...rest }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      try {
        const pascalName = String(name || '').split('-').map(part => part ? part[0].toUpperCase() + part.slice(1) : '').join('');
        const lucideGlobal = window.lucide || {};
        const iconSource = lucideGlobal.icons || lucideGlobal || {};
        const iconDef = iconSource[name] || iconSource[pascalName] || FALLBACK_ICONS[name];
        const iconShape = Array.isArray(iconDef) ? iconDef : iconDef?.iconNode;
        const buildSvg = (shape) => {
          const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          Object.entries({
            xmlns: 'http://www.w3.org/2000/svg',
            width: 24,
            height: 24,
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: 2,
            strokeLinecap: 'round',
            strokeLinejoin: 'round'
          }).forEach(([key, value]) => svg.setAttribute(key, value));
          shape.forEach(([tag, attrs]) => {
            const child = document.createElementNS('http://www.w3.org/2000/svg', tag);
            Object.entries(attrs || {}).forEach(([key, value]) => child.setAttribute(key, value));
            svg.appendChild(child);
          });
          return svg;
        };
        const iconNode = iconDef && lucideGlobal.createElement ? lucideGlobal.createElement(iconDef) : (iconShape ? buildSvg(iconShape) : null);
        ref.current.innerHTML = '';
        if (iconNode) ref.current.appendChild(iconNode);
        const svg = ref.current.querySelector('svg');
        if (svg && className) {
          className.split(' ').filter(Boolean).forEach(c => svg.classList.add(c));
        }
      } catch (e) {
        ref.current.textContent = '';
      }
    }
  }, [name, className]);
  return React.createElement('span', { ref, className: 'inline-flex items-center', ...rest });
};

// ──────────────────────────────────────────────────────
// 常數與預設值
// ──────────────────────────────────────────────────────
const APP_ID = 'crypto-doubling-calculator';
const DEBOUNCE_MS = 1000;

const DEFAULT_SCENARIOS = [
  { label: '+100%', multiplier: 2.0 },
  { label: '+200%', multiplier: 3.0 },
  { label: '+300%', multiplier: 4.0 },
  { label: '+500%', multiplier: 6.0 },
  { label: '+700%', multiplier: 8.0 },
  { label: '+1000%', multiplier: 11.0 },
  { label: '+2000%', multiplier: 21.0 },
  { label: '+3000%', multiplier: 31.0 }
];

const DEFAULT_TARGET = { label: '1,540', value: 1540 };

const EXCHANGE_FEE_CSV_PATH = './exchange_fees_comparison.csv';
const USDT_TWD_RATE_ENDPOINT = './api/usdt-twd-rate';
const TWD_RATE_REFRESH_MS = 8 * 60 * 60 * 1000;
const MEXC_BOT_CONTEXT_ENDPOINTS = [
  'http://127.0.0.1:8787/api/integrations/doubling-calculator/context?live=1',
  'http://localhost:8787/api/integrations/doubling-calculator/context?live=1',
  'http://127.0.0.1:8788/api/integrations/doubling-calculator/context?live=1',
  'http://localhost:8788/api/integrations/doubling-calculator/context?live=1'
];
const MEXC_WALLET_SYNC_MS = 2 * 1000;

const DEFAULT_EXCHANGE_FEE_CSV = `Exchange,VIP Level,Maker Fee (Limit Order),Taker Fee (Market Order),Notes / Eligibility
Binance,Regular (VIP 0),0.0200%,0.0500%,<$15M volume or <50 BNB
Binance,VIP1,0.0160%,0.0400%,≥$15M volume or ≥50 BNB
Binance,VIP2,0.0140%,0.0350%,≥$50M volume or ≥200 BNB
Binance,VIP3,0.0120%,0.0320%,≥$200M volume or ≥500 BNB
Binance,VIP4,0.0100%,0.0300%,"≥$500M volume or ≥1,000 BNB"
Binance,VIP5+,0.0080%,0.0270%,"≥$1B volume or ≥1,500 BNB"
OKX,Regular (VIP 0),0.0200%,0.0500%,<$5M volume or <$100k assets
OKX,VIP1,0.0160%,0.0450%,≥$5M volume or ≥$100k assets
OKX,VIP2,0.0150%,0.0360%,≥$20M volume or ≥$500k assets
OKX,VIP3,~0.0100%,~0.0300%,≥$100M volume or ≥$2M assets
OKX,VIP4,~0.0080%,~0.0250%,≥$300M volume or ≥$5M assets
OKX,VIP5,~0.0050%,~0.0200%,≥$600M volume or ≥$10M assets
OKX,VIP6,~0.0020%,~0.0180%,≥$1B volume or ≥$20M assets
OKX,VIP7–9,0% to -0.005% (rebate),0.0150%,institutional tiers; volume/asset thresholds vary
BingX,Non-VIP (Standard),0.020%,0.050%,Perpetual futures base fees
BingX,VIP1,0.014%,0.040%,Futures rates; thresholds not provided
BingX,VIP2,0.012%,0.0375%,Futures rates
BingX,VIP3,0.010%,0.035%,Futures rates
BingX,VIP4,0.008%,0.0315%,Futures rates
BingX,VIP5,0.006%,0.030%,Futures rates
BingX,Supreme VIP,0%,0.028%,Highest tier
MEXC,Standard,0.000%,0.020%,"Futures base; 0% maker, 0.02% taker"
MEXC,VIP programme,Not public,Not public,Requires ≥10M USDT monthly volume; discount for MX token holders
Gate.io,VIP0,0.020%,0.050%,Standard futures fees
Gate.io,VIP1,0.020%,0.050%,"30-day trading volume < 400,000 USDT or GT ≥ 0"
Gate.io,VIP2,0.020%,0.050%,"Vol ≥ 400,000–1,000,000 USDT or GT ≥ 100"
Gate.io,VIP3,0.020%,0.048%,1M–3M USDT or GT ≥ 200
Gate.io,VIP4,0.020%,0.048%,≥3M–10M USDT or GT ≥ 500
Gate.io,VIP5,0.020%,0.045%,≥10M–40M USDT or GT ≥ 1000
Gate.io,VIP6,0.018%,0.042%,≥40M–100M USDT or GT ≥ 2500
Gate.io,VIP7,0.016%,0.0375%,≥100M–200M USDT or GT ≥ 5000
Gate.io,VIP8,0.014%,0.033%,"≥200M–500M USDT or GT ≥ 10,000"
Gate.io,VIP9,0.012%,0.032%,"≥500M–1B USDT or GT ≥ 25,000"
Gate.io,VIP10,0.010%,0.030%,"≥1B–2B USDT or GT ≥ 50,000"
Gate.io,VIP11,0.008%,0.028%,"≥2B–3B USDT or GT ≥ 100,000"
Gate.io,VIP12,0.006%,0.026%,"≥3B–5B USDT or GT ≥ 200,000"
Gate.io,VIP13,0.005%,0.024%,"≥5B–10B USDT or GT ≥ 500,000"
Gate.io,VIP14,0.002%,0.022%,≥10B–20B USDT or GT ≥ 1M
Gate.io,VIP15,0.000%,0.018%,≥20B–30B USDT or GT ≥ 2.5M
Gate.io,VIP16,0.000%,0.016%,≥30B USDT or GT ≥ 5M`;

const parseCsvLine = (line) => {
  const values = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current.trim());
  return values;
};

const normalizeExchangeKey = (exchange) => String(exchange || '').toLowerCase().replace(/\.io$/, '').replace(/[^a-z0-9]+/g, '');

const parseFeeRate = (value) => {
  const raw = String(value || '').trim();
  if (!raw || /not\s+public/i.test(raw)) return null;
  const matches = raw.match(/-?\d+(?:\.\d+)?/g);
  if (!matches || matches.length === 0) return null;
  const values = matches.map(Number).filter(Number.isFinite);
  if (values.length === 0) return null;
  if (/\bto\b/i.test(raw)) return Math.max(...values);
  return values[0];
};

const parseExchangeFeeCatalog = (csvText) => {
  const rows = String(csvText || '').split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  const exchanges = [];
  rows.slice(1).forEach(line => {
    const [exchange, level, makerRaw, takerRaw, note = ''] = parseCsvLine(line);
    const makerFeeRate = parseFeeRate(makerRaw);
    const takerFeeRate = parseFeeRate(takerRaw);
    const key = normalizeExchangeKey(exchange);
    if (!key || !exchange) return;
    let preset = exchanges.find(item => item.key === key);
    if (!preset) {
      preset = {
        key,
        label: exchange,
        slippageRate: key === 'gate' ? 0.05 : key === 'bingx' || key === 'mexc' ? 0.04 : 0.03,
        fundingRate: 0.01,
        tiers: [],
        unavailableTiers: []
      };
      exchanges.push(preset);
    }
    const tier = { level, makerFeeRate, takerFeeRate, makerRaw, takerRaw, note };
    if (makerFeeRate === null || takerFeeRate === null) {
      preset.unavailableTiers.push(tier);
    } else {
      preset.tiers.push(tier);
    }
  });
  return exchanges.filter(exchange => exchange.tiers.length > 0);
};

const DEFAULT_EXCHANGE_FEE_PRESETS = parseExchangeFeeCatalog(DEFAULT_EXCHANGE_FEE_CSV);
const DEFAULT_EXCHANGE_PRESET = DEFAULT_EXCHANGE_FEE_PRESETS[0];
const DEFAULT_FEE_TIER = DEFAULT_EXCHANGE_PRESET.tiers[0];

const DEFAULT_API_EXCHANGE_NAMES = ['Binance', 'OKX', 'MEXC', 'BingX', 'Bitget', 'Gate', 'KuCoin', 'HTX', 'LBank', 'Bitunix'];
const DEFAULT_LANGUAGE_CODE = 'zh-TW';
const POPULAR_LANGUAGE_OPTIONS = [
  { code: 'zh-TW', label: '繁體中文', nativeName: '繁體中文', region: '台灣 / 香港' },
  { code: 'en-US', label: '英文', nativeName: 'English', region: '美國 / 全球' },
  { code: 'ja-JP', label: '日文', nativeName: '日本語', region: '日本' },
  { code: 'ko-KR', label: '韓文', nativeName: '한국어', region: '韓國' },
  { code: 'de-DE', label: '德文', nativeName: 'Deutsch', region: '德國' },
  { code: 'fr-FR', label: '法文', nativeName: 'Français', region: '法國' },
  { code: 'es-ES', label: '西班牙文', nativeName: 'Español', region: '西班牙 / 拉美' },
  { code: 'pt-BR', label: '葡萄牙文', nativeName: 'Português', region: '巴西' },
  { code: 'it-IT', label: '義大利文', nativeName: 'Italiano', region: '義大利' },
  { code: 'ru-RU', label: '俄文', nativeName: 'Русский', region: '俄羅斯' },
  { code: 'th-TH', label: '泰文', nativeName: 'ไทย', region: '泰國' },
  { code: 'vi-VN', label: '越南文', nativeName: 'Tiếng Việt', region: '越南' },
  { code: 'id-ID', label: '印尼文', nativeName: 'Bahasa Indonesia', region: '印尼' },
  { code: 'hi-IN', label: '印度文', nativeName: 'हिन्दी', region: '印度' },
  { code: 'ar-SA', label: '阿拉伯文', nativeName: 'العربية', region: '中東' },
  { code: 'tr-TR', label: '土耳其文', nativeName: 'Türkçe', region: '土耳其' }
];

const makeExchangeApiConfig = (name, overrides = {}) => {
  const normalizedName = String(name || overrides.name || '').trim() || '自訂交易所';
  const key = normalizeExchangeKey(normalizedName) || 'exchange';
  return {
    id: String(overrides.id || `custom_${key}_${Date.now()}`),
    name: normalizedName,
    apiKey: String(overrides.apiKey || ''),
    apiSecret: String(overrides.apiSecret || ''),
    passphrase: String(overrides.passphrase || ''),
    uid: String(overrides.uid || ''),
    enabled: Boolean(overrides.enabled),
    notes: String(overrides.notes || '')
  };
};

const createDefaultExchangeApiConfigs = () => DEFAULT_API_EXCHANGE_NAMES.map(name => (
  makeExchangeApiConfig(name, { id: `preset_${normalizeExchangeKey(name)}` })
));

const isPresetExchangeApiConfig = (config) => {
  const key = normalizeExchangeKey(config?.name);
  return String(config?.id || '').startsWith('preset_') || DEFAULT_API_EXCHANGE_NAMES.some(name => normalizeExchangeKey(name) === key);
};

const hasExchangeApiCredential = (config) => Boolean(String(config?.apiKey || '').trim() && String(config?.apiSecret || '').trim());

const getLanguageOption = (code) => POPULAR_LANGUAGE_OPTIONS.find(option => option.code === code)
  || POPULAR_LANGUAGE_OPTIONS.find(option => option.code === DEFAULT_LANGUAGE_CODE);

const DEFAULT_SETTINGS = {
  principal: 10,
  currentBalance: 0,
  activeTargetTab: 0,
  basePosition: 50,
  dynamicPositionEnabled: false,
  dynamicRules: [],
  activeScenario: 0,
  targets: [
    DEFAULT_TARGET
  ],
  scenarios: [...DEFAULT_SCENARIOS],
  fixedAmountEnabled: false,
  fixedAmount: 50,
  exchangeKey: DEFAULT_EXCHANGE_PRESET.key,
  feeTier: DEFAULT_FEE_TIER.level,
  feeMode: 'taker',
  slippageRate: DEFAULT_EXCHANGE_PRESET.slippageRate,
  fundingRate: DEFAULT_EXCHANGE_PRESET.fundingRate,
  amountInputCurrency: 'USDT',
  mexcWalletBindingEnabled: false,
  exchangeApiConfigs: createDefaultExchangeApiConfigs(),
  preferredLanguage: DEFAULT_LANGUAGE_CODE
};

const QUICK_POSITIONS = [1, 3, 5, 7, 10, 20, 50, 100];
const QUICK_AMOUNTS = [10, 25, 50, 100, 200, 500];

const getScenarios = (settings) => {
  return (settings.scenarios && settings.scenarios.length > 0) ? settings.scenarios : DEFAULT_SCENARIOS;
};

// ──────────────────────────────────────────────────────
// 核心邏輯
// ──────────────────────────────────────────────────────
const calculatePosition = (currentBalance, basePosition, dynamicEnabled, dynamicRules) => {
  const clamp = (v) => Math.max(0, Math.min(100, v));
  if (!dynamicEnabled || !Array.isArray(dynamicRules) || dynamicRules.length === 0) {
    return clamp(basePosition);
  }
  const sorted = [...dynamicRules]
    .filter(r => r && typeof r.threshold === 'number' && typeof r.position === 'number')
    .sort((a, b) => b.threshold - a.threshold);
  for (const rule of sorted) {
    if (currentBalance >= rule.threshold) return clamp(rule.position);
  }
  return clamp(basePosition);
};

const getEffectiveTarget = (activeTabIdx, targets) => {
  const t = targets && targets[activeTabIdx];
  return t ? t.value : (targets && targets[0] ? targets[0].value : 1540);
};

const roundValue = (value, digits = 4) => {
  const factor = 10 ** digits;
  return Math.round((Number(value) || 0) * factor) / factor;
};

const parseInputNumber = (raw) => {
  const value = raw === '' ? 0 : parseFloat(raw);
  return isNaN(value) || value < 0 ? 0 : value;
};

const getValidUsdtTwdRate = (rateState) => {
  const rate = Number(rateState?.rate);
  return Number.isFinite(rate) && rate > 0 ? rate : null;
};

const normalizeInputCurrency = (currency, rate) => currency === 'TWD' && rate ? 'TWD' : 'USDT';

const toUsdtAmount = (amount, currency, rate) => currency === 'TWD' && rate ? amount / rate : amount;

const fromUsdtAmount = (amount, currency, rate) => currency === 'TWD' && rate ? amount * rate : amount;

const formatMoneyInput = (amount, currency, rate) => {
  const value = fromUsdtAmount(Number(amount) || 0, currency, rate);
  if (!value) return '';
  return String(currency === 'TWD' ? Math.round(value) : roundValue(value, 4));
};


const getExchangePreset = (exchangeKey, feeCatalog = DEFAULT_EXCHANGE_FEE_PRESETS) => feeCatalog.find(preset => preset.key === exchangeKey) || feeCatalog[0] || DEFAULT_EXCHANGE_PRESET;

const getFeeTier = (preset, feeTier) => preset.tiers.find(tier => tier.level === feeTier) || preset.tiers[0];

const safeRate = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : fallback;
};

const getCostSettings = (settings, feeCatalog = DEFAULT_EXCHANGE_FEE_PRESETS) => {
  const preset = getExchangePreset(settings.exchangeKey, feeCatalog);
  const tier = getFeeTier(preset, settings.feeTier);
  return {
    exchangeKey: preset.key,
    exchangeLabel: preset.label,
    feeTier: tier.level,
    feeMode: settings.feeMode === 'maker' ? 'maker' : 'taker',
    makerFeeRate: tier.makerFeeRate,
    takerFeeRate: tier.takerFeeRate,
    slippageRate: safeRate(settings.slippageRate, preset.slippageRate),
    fundingRate: safeRate(settings.fundingRate, preset.fundingRate),
    availableTiers: preset.tiers
  };
};

const getCostRateParts = (costSettings, multiplier = 1) => {
  const activeFeeRate = (costSettings.feeMode === 'maker' ? costSettings.makerFeeRate : costSettings.takerFeeRate) / 100;
  const slippageRate = costSettings.slippageRate / 100;
  const fundingRate = costSettings.fundingRate / 100;
  return {
    activeFeeRate,
    slippageRate,
    fundingRate,
    totalRateOnPosition: activeFeeRate + (activeFeeRate * multiplier) + slippageRate + fundingRate
  };
};

const calculateTradeCosts = (positionSize, multiplier, costSettings) => {
  const costRates = getCostRateParts(costSettings, multiplier);
  const entryFee = positionSize * costRates.activeFeeRate;
  const exitFee = positionSize * multiplier * costRates.activeFeeRate;
  const slippageCost = positionSize * costRates.slippageRate;
  const fundingCost = positionSize * costRates.fundingRate;
  const totalCost = entryFee + exitFee + slippageCost + fundingCost;
  return { entryFee, exitFee, slippageCost, fundingCost, totalCost };
};

const calculateRoundsToTarget = (principal, target, basePosition, dynamicEnabled, dynamicRules, multiplier, fixedAmountEnabled = false, fixedAmount = 0) => {
  if (principal <= 0) return -1;
  if (target <= principal) return 0;
  if (multiplier <= 1) return -1;

  let balance = principal;
  let rounds = 0;
  const MAX_ROUNDS = 800;

  while (balance < target && rounds < MAX_ROUNDS) {
    if (balance < 0.01) return -1;

    let positionSize;
    if (fixedAmountEnabled && fixedAmount > 0) {
      positionSize = Math.min(fixedAmount, balance);
    } else {
      const posPercent = calculatePosition(balance, basePosition, dynamicEnabled, dynamicRules);
      if (posPercent <= 0) return -1;
      positionSize = balance * (posPercent / 100);
    }

    const profit = positionSize * (multiplier - 1);
    if (profit <= 0) return -1;
    balance += profit;
    rounds++;
  }

  return rounds >= MAX_ROUNDS ? '> 800' : rounds;
};

const buildSimulationSummary = (path, balance, reachedGoal, bankrupt, goalRound) => {
  return {
    totalRounds: path.length,
    finalBalance: roundValue(balance),
    reachedGoal,
    bankrupt,
    goalRound
  };
};

const simulateGrowthPath = (principal, target, basePosition, dynamicEnabled, dynamicRules, multiplier, fixedAmountEnabled = false, fixedAmount = 0) => {
  const MAX_ROUNDS = 800;
  const BANKRUPTCY_THRESHOLD = 0.01;
  const path = [];

  if (principal <= 0 || multiplier <= 1) {
    return { path: [], summary: buildSimulationSummary(path, principal, false, principal <= 0, null) };
  }
  if (principal >= target) {
    const initialPath = [{ round: 0, balanceBefore: principal, posPercent: 0, positionSize: 0, profit: 0, balanceAfter: principal, growthRate: 0, reachedGoal: true }];
    return { path: initialPath, summary: buildSimulationSummary(initialPath, principal, true, false, 0) };
  }

  let balance = principal;
  let goalRound = null;

  for (let round = 1; round <= MAX_ROUNDS; round++) {
    if (balance < BANKRUPTCY_THRESHOLD) {
      return { path, summary: buildSimulationSummary(path, balance, false, true, null) };
    }

    const balanceBefore = balance;
    let posPercent, positionSize;

    if (fixedAmountEnabled && fixedAmount > 0) {
      positionSize = Math.min(fixedAmount, balance);
      posPercent = balance > 0 ? Math.round((positionSize / balance) * 10000) / 100 : 0;
    } else {
      posPercent = calculatePosition(balance, basePosition, dynamicEnabled, dynamicRules);
      positionSize = balance * (posPercent / 100);
    }

    const profit = positionSize * (multiplier - 1);
    balance += profit;
    balance = Math.round(balance * 1e6) / 1e6;

    const balanceAfter = balance;
    const growthRate = balanceBefore > 0 ? ((balanceAfter - balanceBefore) / balanceBefore) * 100 : 0;
    const reachedGoal = balance >= target;

    if (reachedGoal && goalRound === null) goalRound = round;

    path.push({
      round,
      balanceBefore: roundValue(balanceBefore),
      posPercent,
      positionSize: roundValue(positionSize),
      profit: roundValue(profit),
      balanceAfter: roundValue(balanceAfter),
      growthRate: Math.round(growthRate * 100) / 100,
      reachedGoal
    });

    if (reachedGoal || balance <= BANKRUPTCY_THRESHOLD || profit <= 0) break;
  }

  return {
    path,
    summary: buildSimulationSummary(path, balance, goalRound !== null, balance <= BANKRUPTCY_THRESHOLD, goalRound)
  };
};

const useGrowthSimulation = (settings) => {
  return useMemo(() => {
    const scenarios = getScenarios(settings);
    const scenario = scenarios[settings.activeScenario];
    if (!scenario) return { path: [], summary: buildSimulationSummary([], 0, false, false, null) };
    const target = getEffectiveTarget(settings.activeTargetTab, settings.targets);
    return simulateGrowthPath(
      settings.principal, target, settings.basePosition,
      settings.dynamicPositionEnabled, settings.dynamicRules, scenario.multiplier,
      settings.fixedAmountEnabled, settings.fixedAmount
    );
  }, [
    settings.principal, settings.activeTargetTab, settings.targets,
    settings.basePosition, settings.dynamicPositionEnabled, settings.dynamicRules,
    settings.activeScenario, settings.scenarios,
    settings.fixedAmountEnabled, settings.fixedAmount
  ]);
};

const makeTargetLabel = (value) => {
  const number = Number(value) || 0;
  return number.toLocaleString('en-US', { maximumFractionDigits: 0 });
};

const shouldSyncTargetLabel = (label) => {
  const normalized = String(label || '').trim();
  return !normalized || /^[\d,]+$/.test(normalized) || /^目標\s*[\d,]+$/.test(normalized);
};

const normalizeTargetLabels = (targets) => {
  const source = Array.isArray(targets) ? targets : [];
  const normalized = source
    .map((target) => {
      const value = Number(target?.value);
      if (!Number.isFinite(value) || value <= 0) return null;
      const label = shouldSyncTargetLabel(target?.label) ? makeTargetLabel(value) : String(target.label || '').trim();
      return { ...target, value, label: label || makeTargetLabel(value) };
    })
    .filter(Boolean);
  return normalized.length > 0 ? normalized : [{ ...DEFAULT_TARGET }];
};

const normalizeTargetSettings = (settings) => {
  const targets = normalizeTargetLabels(settings.targets);
  const activeTargetTab = Math.min(
    targets.length - 1,
    Math.max(0, Number.isFinite(Number(settings.activeTargetTab)) ? Number(settings.activeTargetTab) : 0)
  );
  return { ...settings, activeTargetTab, targets };
};

const normalizeExchangeApiConfigs = (configs) => {
  const source = Array.isArray(configs) ? configs : [];
  const usedIndexes = new Set();
  const defaults = createDefaultExchangeApiConfigs().map(defaultConfig => {
    const defaultKey = normalizeExchangeKey(defaultConfig.name);
    const sourceIndex = source.findIndex(item => (
      String(item?.id || '') === defaultConfig.id || normalizeExchangeKey(item?.name) === defaultKey
    ));
    const savedConfig = sourceIndex >= 0 ? source[sourceIndex] : {};
    if (sourceIndex >= 0) usedIndexes.add(sourceIndex);
    return makeExchangeApiConfig(defaultConfig.name, {
      ...defaultConfig,
      ...savedConfig,
      id: defaultConfig.id,
      name: defaultConfig.name
    });
  });

  const customConfigs = source
    .map((item, index) => ({ item, index }))
    .filter(({ item, index }) => !usedIndexes.has(index) && item && !isPresetExchangeApiConfig(item))
    .map(({ item, index }) => {
      const name = String(item.name || '').trim();
      if (!name) return null;
      const key = normalizeExchangeKey(name) || `custom${index}`;
      return makeExchangeApiConfig(name, {
        ...item,
        id: String(item.id || `custom_${key}_${index}`)
      });
    })
    .filter(Boolean);

  const seenIds = new Set();
  return [...defaults, ...customConfigs].filter(config => {
    if (seenIds.has(config.id)) return false;
    seenIds.add(config.id);
    return true;
  });
};

const normalizePreferredLanguage = (code) => getLanguageOption(code)?.code || DEFAULT_LANGUAGE_CODE;

const normalizeSettings = (settings) => {
  const targetSettings = normalizeTargetSettings(settings);
  return {
    ...targetSettings,
    exchangeApiConfigs: normalizeExchangeApiConfigs(targetSettings.exchangeApiConfigs),
    preferredLanguage: normalizePreferredLanguage(targetSettings.preferredLanguage)
  };
};
// ──────────────────────────────────────────────────────
// Hooks — localStorage
// ──────────────────────────────────────────────────────
const useLocalSettings = () => {
  const [settings, setSettings] = useState(() => {
    try {
      const cached = localStorage.getItem(`${APP_ID}_settings`);
      if (cached) return normalizeSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(cached) });
    } catch (e) {}
    return normalizeSettings({ ...DEFAULT_SETTINGS });
  });

  const updateSettings = useCallback((updater) => {
    setSettings((prev) => {
      const rawSettings = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      const newSettings = normalizeSettings(rawSettings);
      try { localStorage.setItem(`${APP_ID}_settings`, JSON.stringify(newSettings)); } catch (e) {}
      return newSettings;
    });
  }, []);

  const clearAllData = useCallback(async () => {
    try { localStorage.removeItem(`${APP_ID}_settings`); return true; } catch (err) { return false; }
  }, []);

  return { settings, updateSettings, clearAllData };
};

const useExchangeFeeCatalog = () => {
  const [state, setState] = useState({ catalog: DEFAULT_EXCHANGE_FEE_PRESETS, source: '內建 CSV 備援', loaded: false, error: null });
  useEffect(() => {
    let cancelled = false;
    fetch(`${EXCHANGE_FEE_CSV_PATH}?v=${Date.now()}`)
      .then(response => {
        if (!response.ok) throw new Error(`CSV ${response.status}`);
        return response.text();
      })
      .then(text => {
        const catalog = parseExchangeFeeCatalog(text);
        if (!cancelled && catalog.length > 0) setState({ catalog, source: 'exchange_fees_comparison.csv', loaded: true, error: null });
      })
      .catch(error => {
        if (!cancelled) setState(prev => ({ ...prev, loaded: true, error: error.message || 'CSV 載入失敗' }));
      });
    return () => { cancelled = true; };
  }, []);
  return state;
};

const useUsdtTwdRate = () => {
  const [state, setState] = useState({ source: 'Max 交易所', rate: null, buy: null, sell: null, updatedAt: null, loaded: false, stale: false, error: null });

  const loadRate = useCallback((force = false) => {
    const query = force ? `?force=1&v=${Date.now()}` : `?v=${Date.now()}`;
    return fetch(`${USDT_TWD_RATE_ENDPOINT}${query}`)
      .then(response => response.json().then(data => ({ response, data })))
      .then(({ response, data }) => {
        const rate = Number(data.rate);
        if (!response.ok || !Number.isFinite(rate) || rate <= 0) throw new Error(data.error || `MAX 匯率 ${response.status}`);
        setState({
          source: data.source || 'Max 交易所',
          rate,
          buy: Number(data.buy) || null,
          sell: Number(data.sell) || null,
          updatedAt: Number(data.updatedAt) || Date.now(),
          loaded: true,
          stale: Boolean(data.stale),
          error: data.error || null
        });
      })
      .catch(error => {
        setState(prev => ({ ...prev, loaded: true, error: error.message || 'MAX 匯率載入失敗' }));
      });
  }, []);

  useEffect(() => {
    loadRate(false);
    const timer = setInterval(() => loadRate(false), TWD_RATE_REFRESH_MS);
    return () => clearInterval(timer);
  }, [loadRate]);

  return { ...state, refresh: () => loadRate(true) };
};

const readMexcWalletBalance = (payload) => {
  const account = payload?.account || {};
  const settings = payload?.calculator_settings || {};
  const candidates = [
    account.wallet_balance,
    account.futures_wallet_balance,
    settings.principal,
    settings.currentBalance
  ];
  for (const value of candidates) {
    const number = Number(value);
    if (Number.isFinite(number) && number >= 0) return number;
  }
  return null;
};

const formatSyncTime = (value) => {
  const time = value ? new Date(value) : null;
  if (!time || Number.isNaN(time.getTime())) return '尚未同步';
  return time.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

const useMexcWalletSync = (updateSettings, enabled) => {
  const [state, setState] = useState({
    connected: false,
    syncing: false,
    walletBalance: null,
    updatedAt: null,
    source: null,
    error: null
  });

  const syncWallet = useCallback(async () => {
    if (!enabled) {
      setState(prev => ({ ...prev, connected: false, syncing: false, error: null }));
      return;
    }

    setState(prev => ({ ...prev, syncing: true }));
    let lastError = null;

    for (const endpoint of MEXC_BOT_CONTEXT_ENDPOINTS) {
      try {
        const response = await fetch(`${endpoint}&v=${Date.now()}`, { cache: 'no-store' });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || `MEXC Bot API ${response.status}`);

        const walletBalance = readMexcWalletBalance(payload);
        if (walletBalance === null) throw new Error('MEXC Wallet Balance 無有效數值');

        updateSettings(prev => {
          const samePrincipal = Math.abs((Number(prev.principal) || 0) - walletBalance) < 0.000001;
          const sameBalance = Math.abs((Number(prev.currentBalance) || 0) - walletBalance) < 0.000001;
          if (samePrincipal && sameBalance) return prev;
          return {
            ...prev,
            principal: walletBalance,
            currentBalance: walletBalance
          };
        });

        setState({
          connected: true,
          syncing: false,
          walletBalance,
          updatedAt: payload?.account?.wallet_balance_updated_at || payload?.generated_at || new Date().toISOString(),
          source: payload?.account?.wallet_balance_source || payload?.source || 'MEXC',
          error: payload?.account?.live_error || null
        });
        return;
      } catch (error) {
        lastError = error;
      }
    }

    setState(prev => ({
      ...prev,
      connected: false,
      syncing: false,
      error: lastError?.message || 'MEXC Bot API 未連線'
    }));
  }, [updateSettings, enabled]);

  useEffect(() => {
    if (!enabled) {
      setState({
        connected: false,
        syncing: false,
        walletBalance: null,
        updatedAt: null,
        source: null,
        error: null
      });
      return undefined;
    }

    syncWallet();
    const timer = setInterval(syncWallet, MEXC_WALLET_SYNC_MS);
    return () => clearInterval(timer);
  }, [enabled, syncWallet]);

  return { ...state, enabled, refresh: syncWallet };
};

// ──────────────────────────────────────────────────────
// 子元件
// ──────────────────────────────────────────────────────
const StorageIndicator = () => (
  <div className="flex min-h-9 items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 text-xs font-semibold text-emerald-300 transition-default">
    <span className="w-2 h-2 rounded-full bg-emerald-400" />
    <span>本地儲存</span>
  </div>
);

const cx = (...classes) => classes.filter(Boolean).join(' ');

const formatNumber = (value, options = {}) => {
  const number = Number(value) || 0;
  return number.toLocaleString('en-US', {
    maximumFractionDigits: 2,
    ...options
  });
};

const formatTwdEquivalent = (amount, rate) => rate ? `NT$ ${formatNumber(fromUsdtAmount(amount, 'TWD', rate), { maximumFractionDigits: 0 })}` : '等待 Max 匯率';

const formatCurrencyEquivalent = (amount, currency, rate) => {
  if (currency === 'TWD') return `${formatNumber(amount, { maximumFractionDigits: 4 })} USDT`;
  return formatTwdEquivalent(amount, rate);
};

const formatCompactNumber = (value) => {
  const number = Number(value) || 0;
  if (Math.abs(number) >= 1e9) return `${(number / 1e9).toFixed(2)}B`;
  if (Math.abs(number) >= 1e6) return `${(number / 1e6).toFixed(2)}M`;
  if (Math.abs(number) >= 1e3) return `${(number / 1e3).toFixed(1)}K`;
  return number.toFixed(0);
};

const formatSignedNumber = (value, options = {}) => {
  const number = Number(value) || 0;
  const prefix = number > 0 ? '+' : '';
  return `${prefix}${formatNumber(number, options)}`;
};

const SectionHeader = ({ icon, title, eyebrow, action }) => (
  <div className="mb-4 flex items-start justify-between gap-3">
    <div className="min-w-0">
      {eyebrow && <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{eyebrow}</p>}
      <div className="flex items-center gap-2">
        {icon && (
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-300">
            <Icon name={icon} className="h-4 w-4" />
          </span>
        )}
        <h2 className="truncate text-sm font-bold text-slate-100">{title}</h2>
      </div>
    </div>
    {action}
  </div>
);

const Panel = ({ children, className = '' }) => (
  <section className={cx('glass-panel p-5', className)}>{children}</section>
);

const MetricCard = ({ label, value, unit, icon, tone = 'slate', caption }) => {
  const toneClasses = {
    amber: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
    emerald: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    violet: 'border-violet-500/30 bg-violet-500/10 text-violet-300',
    red: 'border-red-500/30 bg-red-500/10 text-red-300',
    slate: 'border-slate-700/70 bg-slate-950/45 text-slate-200'
  };
  return (
    <div className={cx('rounded-lg border p-4', toneClasses[tone] || toneClasses.slate)}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">{label}</span>
        {icon && <Icon name={icon} className="h-4 w-4 opacity-80" />}
      </div>
      <div className="flex items-end gap-1 font-mono text-3xl font-black leading-none text-slate-50">
        <span>{value}</span>
        {unit && <span className="pb-1 text-sm font-semibold text-slate-500">{unit}</span>}
      </div>
      {caption && <p className="mt-2 text-xs leading-relaxed text-slate-400">{caption}</p>}
    </div>
  );
};

const EmptyState = ({ icon = 'circle-off', title, detail }) => (
  <div className="flex h-full min-h-[220px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-700/70 bg-slate-950/35 p-8 text-center">
    <Icon name={icon} className="mb-3 h-7 w-7 text-slate-500" />
    <p className="text-sm font-semibold text-slate-300">{title}</p>
    {detail && <p className="mt-1 max-w-sm text-xs leading-relaxed text-slate-500">{detail}</p>}
  </div>
);

const MarketStatusBadge = () => {
  const [dayInfo, setDayInfo] = useState(null);
  useEffect(() => {
    const update = () => {
      const taipeiStr = new Date().toLocaleString('en-US', { timeZone: 'Asia/Taipei', weekday: 'short' });
      const dayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      const day = dayMap[taipeiStr.split(',')[0]] ?? new Date().getDay();
      setDayInfo(day);
    };
    update();
    const timer = setInterval(update, 60000);
    return () => clearInterval(timer);
  }, []);
  if (dayInfo === null) return null;
  const isWeekend = dayInfo === 0 || dayInfo === 6;
  const dayNames = ['日', '一', '二', '三', '四', '五', '六'];
  return (
    <div className={`flex min-h-9 items-center gap-2 rounded-lg border px-3 text-xs font-bold transition-default ${
      isWeekend ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' : 'bg-violet-500/10 border-violet-500/30 text-violet-300'
    }`}>
      <span className={`w-2 h-2 rounded-full animate-pulse flex-shrink-0 ${isWeekend ? 'bg-amber-400' : 'bg-violet-400'}`} />
      <span>{isWeekend ? '週末盤' : `週${dayNames[dayInfo]}`}</span>
    </div>
  );
};

const ResetConfirmModal = ({ isOpen, onConfirm, onCancel, isResetting }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onCancel}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative w-full max-w-md rounded-lg border border-red-500/30 bg-[#0E1223] p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center mb-4">
            <Icon name="alert-triangle" className="w-7 h-7 text-red-400" />
          </div>
          <h3 className="text-lg font-bold text-red-400 mb-2">確定要重置所有設定？</h3>
          <p className="text-sm text-slate-400 mb-5 leading-relaxed">
            此操作將<span className="text-red-300 font-bold">永久清除</span>本地（LocalStorage）的全部資料，<br/>並恢復為系統預設值。此操作無法復原。
          </p>
          <div className="flex w-full gap-2.5">
            <button onClick={onCancel} disabled={isResetting} className="flex-1 min-h-11 rounded-lg border border-slate-700 bg-slate-950/50 px-3 text-sm font-semibold text-slate-300 transition-default hover:bg-slate-800 disabled:opacity-50 cursor-pointer">取消</button>
            <button onClick={onConfirm} disabled={isResetting} className="flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-500/50 bg-red-500/20 px-3 text-sm font-semibold text-red-300 transition-default hover:bg-red-500/30 disabled:opacity-50 cursor-pointer">
              {isResetting ? (<><div className="w-3.5 h-3.5 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" /> 清除中...</>) : (<><Icon name="trash-2" className="w-3.5 h-3.5" /> 確認重置</>)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TargetEditModal = ({ isOpen, onClose, targets, onSave, amountInputCurrency, usdtTwdRate }) => {
  const [localTargets, setLocalTargets] = useState([]);
  const targetCurrency = normalizeInputCurrency(amountInputCurrency, usdtTwdRate);
  useEffect(() => {
    if (isOpen) setLocalTargets(JSON.parse(JSON.stringify(normalizeTargetLabels(targets))));
  }, [isOpen, targets]);
  const updateTargetValue = (idx, raw) => {
    const inputValue = parseInputNumber(raw);
    const nextValue = toUsdtAmount(inputValue, targetCurrency, usdtTwdRate);
    const newT = [...localTargets];
    if (!newT[idx]) return;
    if (shouldSyncTargetLabel(newT[idx].label)) newT[idx].label = makeTargetLabel(nextValue);
    newT[idx].value = nextValue;
    setLocalTargets(newT);
  };
  const addTarget = () => {
    const baseValue = localTargets.length > 0 ? Number(localTargets[localTargets.length - 1].value) || DEFAULT_TARGET.value : DEFAULT_TARGET.value;
    const value = Math.max(1, Math.round(baseValue * 2));
    setLocalTargets([...localTargets, { label: makeTargetLabel(value), value }]);
  };
  const removeTarget = (idx) => {
    if (localTargets.length <= 1) return;
    setLocalTargets(localTargets.filter((_, i) => i !== idx));
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative w-full max-w-md rounded-lg border border-slate-700/60 bg-[#0E1223] p-5 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-slate-200 flex items-center">
            <Icon name="target" className="w-4 h-4 mr-2 text-amber-300" /> 設定達成目標
          </h3>
          <button onClick={onClose} aria-label="關閉目標設定" className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-default hover:bg-slate-800 hover:text-slate-300 cursor-pointer">
            <Icon name="x" className="w-4 h-4" />
          </button>
        </div>
        <div className="mb-4 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs leading-relaxed text-slate-400">
          目前以 <span className="font-bold text-amber-200">{targetCurrency}</span> 輸入目標；{targetCurrency === 'TWD' ? `依 Max 1 USDT = ${formatNumber(usdtTwdRate, { maximumFractionDigits: 3 })} TWD 換算後儲存為 USDT。` : '可在資金面板切換為 TWD 後直接輸入新台幣目標。'}
        </div>
        <div className="mb-5 max-h-[48vh] space-y-3 overflow-y-auto pr-1">
          {localTargets.map((t, idx) => (
            <div key={idx} className="rounded-lg border border-slate-800 bg-slate-950/35 p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Target {idx + 1}</span>
                <button onClick={() => removeTarget(idx)} disabled={localTargets.length <= 1}
                  aria-label={`刪除目標 ${idx + 1}`}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 transition-default hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer">
                  <Icon name="trash-2" className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="flex gap-2.5">
                <div className="flex-1">
                  <label className="text-xs text-slate-500 mb-1 block">標籤名稱</label>
                  <input type="text" value={t.label}
                    onChange={e => { const newT = [...localTargets]; newT[idx].label = e.target.value; setLocalTargets(newT); }}
                    className="h-11 w-full rounded-lg border border-slate-700/70 bg-slate-950/70 px-3 text-sm text-slate-200 transition-default placeholder:text-slate-600 focus:border-amber-500" placeholder="例如: 10,000"
                  />
                </div>
                <div className="w-[46%]">
                  <label className="text-xs text-slate-500 mb-1 block whitespace-nowrap">目標金額 ({targetCurrency})</label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-600 text-xs font-bold">{targetCurrency === 'TWD' ? 'NT$' : '$'}</span>
                    <input type="number" min="0" step={targetCurrency === 'TWD' ? '100' : '1'} value={formatMoneyInput(t.value, targetCurrency, usdtTwdRate)}
                      aria-label={`目標 ${idx + 1} 金額 ${targetCurrency}`}
                      onChange={e => updateTargetValue(idx, e.target.value)}
                      className="h-11 w-full rounded-lg border border-slate-700/70 bg-slate-950/70 pl-10 pr-12 text-right font-mono text-sm text-amber-300 transition-default focus:border-amber-500"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-500">{targetCurrency}</span>
                  </div>
                  <p className="mt-1 text-right text-[11px] text-slate-500">≈ {formatCurrencyEquivalent(t.value, targetCurrency, usdtTwdRate)}</p>
                </div>
              </div>
            </div>
          ))}
          <button onClick={addTarget}
            className="flex min-h-11 w-full items-center justify-center rounded-lg border border-dashed border-amber-500/30 bg-amber-500/5 text-sm font-bold text-amber-300 transition-default hover:border-amber-500/55 hover:bg-amber-500/10 cursor-pointer">
            <Icon name="plus" className="mr-1.5 h-4 w-4" /> 新增目標金額
          </button>
        </div>
        <div className="flex gap-2.5">
          <button onClick={onClose} className="min-h-11 flex-1 rounded-lg border border-slate-700 text-sm font-medium text-slate-300 transition-default hover:bg-slate-800 cursor-pointer">取消</button>
          <button onClick={() => { onSave(normalizeTargetLabels(localTargets)); onClose(); }} className="flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-lg bg-amber-400 text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/15 transition-default hover:bg-amber-300 cursor-pointer">
            <Icon name="check" className="w-3.5 h-3.5" /> 儲存
          </button>
        </div>
      </div>
    </div>
  );
};

const DynamicRulesList = ({ rules, onChange }) => {
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [thresholdRaws, setThresholdRaws] = useState(() => {
    const init = {};
    rules.forEach(r => { init[r.id] = r.threshold === 0 ? '' : String(r.threshold); });
    return init;
  });
  const [positionRaws, setPositionRaws] = useState(() => {
    const init = {};
    rules.forEach(r => { init[r.id] = r.position === 0 ? '' : String(r.position); });
    return init;
  });

  const handleDragStart = (e, idx) => { setDraggedIdx(idx); e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", idx); };
  const handleDragOver = (e) => { e.preventDefault(); };
  const handleDrop = (e, dropIdx) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === dropIdx) return;
    const newRules = [...rules];
    const item = newRules.splice(draggedIdx, 1)[0];
    newRules.splice(dropIdx, 0, item);
    onChange(newRules);
    setDraggedIdx(null);
  };

  return (
    <div className="mt-3 space-y-2">
      {rules.length > 0 && (
        <div className="flex items-center gap-1.5 px-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
          <span className="w-4" /><span className="flex-1 text-center">餘額 ≥</span><span className="w-3" /><span className="w-16 text-center">倉位</span><span className="w-5" />
        </div>
      )}
      {rules.map((rule, idx) => (
        <div key={rule.id} draggable onDragStart={e => handleDragStart(e, idx)} onDragOver={handleDragOver} onDrop={e => handleDrop(e, idx)} onDragEnd={() => setDraggedIdx(null)}
          className={`flex items-center gap-1.5 rounded-lg border bg-slate-950/50 px-1.5 py-1.5 transition-default ${draggedIdx === idx ? 'scale-95 border-amber-500 opacity-30' : 'border-slate-700/50 hover:border-slate-600'}`}>
          <button aria-label="拖曳排序規則" className="flex h-8 w-5 flex-shrink-0 cursor-grab items-center justify-center text-slate-600 transition-default hover:text-slate-400 active:cursor-grabbing">
            <Icon name="grip-vertical" className="w-3.5 h-3.5 pointer-events-none" />
          </button>
          <div className="relative flex-1 min-w-0">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-600 text-xs">$</span>
            <input type="number" min="0" step="100" placeholder="餘額"
              value={thresholdRaws[rule.id] ?? (rule.threshold === 0 ? '' : String(rule.threshold))}
              onChange={e => { const raw = e.target.value; setThresholdRaws(prev => ({ ...prev, [rule.id]: raw })); const val = raw === '' ? 0 : parseFloat(raw); const newRules = [...rules]; newRules[idx].threshold = isNaN(val) || val < 0 ? 0 : val; onChange(newRules); }}
              className="h-8 w-full rounded-lg border border-slate-700/60 bg-slate-900/80 pl-5 pr-1 text-right font-mono text-xs text-emerald-300 transition-default focus:border-amber-500"
            />
          </div>
          <Icon name="arrow-right" className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
          <div className="relative w-16 flex-shrink-0">
            <input type="number" min="0" max="100" step="1" placeholder="%"
              value={positionRaws[rule.id] ?? (rule.position === 0 ? '' : String(rule.position))}
              onChange={e => { const raw = e.target.value; setPositionRaws(prev => ({ ...prev, [rule.id]: raw })); const val = raw === '' ? 0 : parseFloat(raw); const newRules = [...rules]; newRules[idx].position = isNaN(val) || val < 0 ? 0 : val > 100 ? 100 : val; onChange(newRules); }}
              className="h-8 w-full rounded-lg border border-slate-700/60 bg-slate-900/80 pl-1 pr-5 text-right font-mono text-xs text-amber-300 transition-default focus:border-amber-500"
            />
            <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-600 text-xs">%</span>
          </div>
          <button aria-label="刪除動態倉位規則" onClick={() => { setThresholdRaws(prev => { const n = {...prev}; delete n[rule.id]; return n; }); setPositionRaws(prev => { const n = {...prev}; delete n[rule.id]; return n; }); onChange(rules.filter((_, i) => i !== idx)); }}
            className="flex h-8 w-7 flex-shrink-0 items-center justify-center rounded-lg text-slate-600 transition-default hover:bg-red-500/10 hover:text-red-300 cursor-pointer">
            <Icon name="x" className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
      <button onClick={() => { const newId = 'rule_'+Date.now(); setThresholdRaws(prev => ({ ...prev, [newId]: '1000' })); setPositionRaws(prev => ({ ...prev, [newId]: '10' })); onChange([...rules, { id: newId, threshold: 1000, position: 10 }]); }}
        className="mt-1 flex min-h-10 w-full items-center justify-center rounded-lg border border-dashed border-amber-500/25 text-xs font-semibold text-slate-500 transition-default hover:border-amber-500/50 hover:bg-amber-500/5 hover:text-amber-300 cursor-pointer">
        <Icon name="plus" className="w-3.5 h-3.5 mr-1.5" /> 新增規則
      </button>
    </div>
  );
};

const ScenarioEditModal = ({ isOpen, onClose, scenarios, onSave }) => {
  const [localScenarios, setLocalScenarios] = useState([]);
  useEffect(() => {
    if (isOpen && scenarios) setLocalScenarios(JSON.parse(JSON.stringify(scenarios)));
  }, [isOpen, scenarios]);
  if (!isOpen) return null;
  const getPercent = (s) => Math.round((s.multiplier - 1) * 100);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative max-h-[80vh] w-full max-w-md overflow-y-auto rounded-lg border border-slate-700/60 bg-[#0E1223] p-5 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-slate-200 flex items-center">
            <Icon name="settings" className="w-4 h-4 mr-2 text-amber-300" /> 自訂收益率策略
          </h3>
          <button onClick={onClose} aria-label="關閉收益率策略設定" className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-default hover:bg-slate-800 hover:text-slate-300 cursor-pointer">
            <Icon name="x" className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-2.5 mb-5">
          {localScenarios.map((s, idx) => (
            <div key={idx} className="flex items-center gap-2.5 rounded-lg border border-slate-700/60 bg-slate-950/50 p-3">
              <div className="flex-1">
                <label className="text-xs text-slate-500 mb-1 block">收益率 (%)</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm">+</span>
                  <input type="number" min="1" step="10" value={getPercent(s)}
                    onChange={e => { const pct = parseFloat(e.target.value); if (isNaN(pct) || pct <= 0) return; const newS = [...localScenarios]; newS[idx] = { label: `+${pct}%`, multiplier: 1 + pct / 100 }; setLocalScenarios(newS); }}
                    className="h-10 w-full rounded-lg border border-slate-700/60 bg-slate-900/80 pl-7 pr-8 text-right font-mono text-sm text-amber-300 transition-default focus:border-amber-500"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm">%</span>
                </div>
              </div>
              <div className="flex-shrink-0 pt-5"><span className="text-xs text-slate-500 font-mono">x{s.multiplier.toFixed(1)}</span></div>
              <button onClick={() => { if (localScenarios.length <= 1) return; setLocalScenarios(localScenarios.filter((_, i) => i !== idx)); }}
                disabled={localScenarios.length <= 1}
                aria-label="刪除收益率策略"
                className="flex-shrink-0 rounded-lg p-1.5 pt-5 text-slate-500 transition-default hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer">
                <Icon name="trash-2" className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <button onClick={() => setLocalScenarios([...localScenarios, { label: '+100%', multiplier: 2.0 }])}
          className="mb-5 flex min-h-11 w-full items-center justify-center rounded-lg border border-dashed border-slate-700/60 text-sm font-semibold text-slate-400 transition-default hover:border-amber-500/40 hover:bg-amber-500/5 hover:text-amber-300 cursor-pointer">
          <Icon name="plus" className="w-4 h-4 mr-1.5" /> 新增策略
        </button>
        <div className="flex gap-2.5">
          <button onClick={onClose} className="min-h-11 flex-1 rounded-lg border border-slate-700 text-sm font-medium text-slate-300 transition-default hover:bg-slate-800 cursor-pointer">取消</button>
          <button onClick={() => { onSave(localScenarios); onClose(); }} className="flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-lg bg-amber-400 text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/15 transition-default hover:bg-amber-300 cursor-pointer">
            <Icon name="check" className="w-4 h-4" /> 儲存
          </button>
        </div>
      </div>
    </div>
  );
};

const SettingsModal = ({ isOpen, onClose, settings, onSave }) => {
  const [activeTab, setActiveTab] = useState('api');
  const [localApiConfigs, setLocalApiConfigs] = useState([]);
  const [localLanguage, setLocalLanguage] = useState(DEFAULT_LANGUAGE_CODE);
  const [selectedExchangeId, setSelectedExchangeId] = useState('');
  const [newExchangeName, setNewExchangeName] = useState('');
  const [showSecrets, setShowSecrets] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const normalizedConfigs = normalizeExchangeApiConfigs(settings.exchangeApiConfigs);
    setLocalApiConfigs(normalizedConfigs);
    setLocalLanguage(normalizePreferredLanguage(settings.preferredLanguage));
    setSelectedExchangeId(prev => normalizedConfigs.some(config => config.id === prev) ? prev : (normalizedConfigs[0]?.id || ''));
    setNewExchangeName('');
    setShowSecrets(false);
    setActiveTab('api');
  }, [isOpen]);

  if (!isOpen) return null;

  const selectedConfig = localApiConfigs.find(config => config.id === selectedExchangeId) || localApiConfigs[0];
  const selectedLanguage = getLanguageOption(localLanguage);
  const configuredCount = localApiConfigs.filter(hasExchangeApiCredential).length;
  const isSelectedPreset = selectedConfig ? isPresetExchangeApiConfig(selectedConfig) : true;

  const updateSelectedConfig = (patch) => {
    if (!selectedConfig) return;
    setLocalApiConfigs(prev => prev.map(config => (
      config.id === selectedConfig.id ? { ...config, ...patch } : config
    )));
  };

  const addCustomExchange = () => {
    const name = newExchangeName.trim();
    if (!name) return;
    const existing = localApiConfigs.find(config => normalizeExchangeKey(config.name) === normalizeExchangeKey(name));
    if (existing) {
      setSelectedExchangeId(existing.id);
      setNewExchangeName('');
      return;
    }
    const key = normalizeExchangeKey(name) || 'exchange';
    const newConfig = makeExchangeApiConfig(name, { id: `custom_${key}_${Date.now()}` });
    setLocalApiConfigs(prev => [...prev, newConfig]);
    setSelectedExchangeId(newConfig.id);
    setNewExchangeName('');
  };

  const clearSelectedConfig = () => {
    updateSelectedConfig({
      apiKey: '',
      apiSecret: '',
      passphrase: '',
      uid: '',
      enabled: false,
      notes: ''
    });
  };

  const removeSelectedConfig = () => {
    if (!selectedConfig || isSelectedPreset) return;
    const nextConfigs = localApiConfigs.filter(config => config.id !== selectedConfig.id);
    setLocalApiConfigs(nextConfigs);
    setSelectedExchangeId(nextConfigs[0]?.id || '');
  };

  const saveSettings = () => {
    onSave({
      exchangeApiConfigs: normalizeExchangeApiConfigs(localApiConfigs),
      preferredLanguage: normalizePreferredLanguage(localLanguage)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative flex max-h-[88vh] w-full max-w-5xl flex-col rounded-lg border border-slate-700/60 bg-[#0E1223] shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex flex-shrink-0 items-start justify-between gap-4 border-b border-slate-800 px-5 py-4">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-300">Settings</p>
            <h3 className="mt-1 text-lg font-black text-slate-50">API 與語言設定</h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">集中管理交易所 API Key、Secret、Passphrase 與介面語言偏好。</p>
          </div>
          <button onClick={onClose} aria-label="關閉設定" className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-slate-500 transition-default hover:bg-slate-800 hover:text-slate-300 cursor-pointer">
            <Icon name="x" className="h-4 w-4" />
          </button>
        </div>

        <div className="grid flex-shrink-0 grid-cols-2 gap-2 border-b border-slate-800 bg-slate-950/35 p-2">
          {[
            { key: 'api', label: '交易所 API', caption: `${configuredCount}/${localApiConfigs.length} 已填寫` },
            { key: 'language', label: '語言偏好', caption: selectedLanguage?.nativeName || '繁體中文' }
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={cx(
                'flex min-h-12 items-center justify-between rounded-lg px-4 text-left transition-default cursor-pointer',
                activeTab === tab.key ? 'bg-cyan-400 text-slate-950' : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-100'
              )}>
              <span className="text-sm font-black">{tab.label}</span>
              <span className={cx('text-xs font-semibold', activeTab === tab.key ? 'text-slate-800' : 'text-slate-500')}>{tab.caption}</span>
            </button>
          ))}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          {activeTab === 'api' && (
            <div className="grid gap-4 lg:grid-cols-[250px_minmax(0,1fr)]">
              <div className="space-y-3">
                <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 p-3 text-xs leading-relaxed text-cyan-100">
                  API 資料只會保存於本機 LocalStorage，不會在此畫面送往任何交易所；共享電腦請避免保存正式金鑰。
                </div>
                <div className="max-h-[47vh] space-y-1.5 overflow-y-auto pr-1">
                  {localApiConfigs.map(config => {
                    const active = selectedConfig?.id === config.id;
                    const complete = hasExchangeApiCredential(config);
                    return (
                      <button key={config.id} onClick={() => setSelectedExchangeId(config.id)}
                        className={cx(
                          'flex min-h-12 w-full items-center justify-between gap-2 rounded-lg border px-3 text-left transition-default cursor-pointer',
                          active
                            ? 'border-cyan-400/50 bg-cyan-500/15 text-cyan-100'
                            : 'border-slate-700/60 bg-slate-950/35 text-slate-400 hover:border-slate-600 hover:bg-slate-900/70 hover:text-slate-200'
                        )}>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-bold">{config.name}</span>
                          <span className="mt-0.5 block text-[11px] text-slate-500">{isPresetExchangeApiConfig(config) ? '內建交易所' : '自訂交易所'}</span>
                        </span>
                        <span className={cx(
                          'flex-shrink-0 rounded-md border px-2 py-1 text-[10px] font-bold',
                          complete
                            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                            : 'border-slate-700 bg-slate-900 text-slate-500'
                        )}>
                          {complete ? '已設定' : '未填'}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-950/35 p-3">
                  <label className="mb-1.5 block text-xs font-semibold text-slate-400">新增自訂交易所</label>
                  <div className="flex gap-2">
                    <input type="text" value={newExchangeName} placeholder="例如：Bybit"
                      onChange={e => setNewExchangeName(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') addCustomExchange(); }}
                      className="h-10 min-w-0 flex-1 rounded-lg border border-slate-700/70 bg-slate-950/70 px-3 text-sm text-slate-200 transition-default placeholder:text-slate-600 focus:border-cyan-400"
                    />
                    <button onClick={addCustomExchange}
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-cyan-500/35 bg-cyan-500/10 text-cyan-200 transition-default hover:bg-cyan-500/20 cursor-pointer"
                      aria-label="新增自訂交易所">
                      <Icon name="plus" className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {selectedConfig ? (
                <div className="rounded-lg border border-slate-700/60 bg-slate-950/35 p-4">
                  <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Exchange API</p>
                      <h4 className="mt-1 truncate text-base font-black text-slate-50">{selectedConfig.name}</h4>
                    </div>
                    <label className="relative inline-flex min-h-9 cursor-pointer items-center gap-2 rounded-lg border border-slate-700/70 bg-slate-950/50 px-3 text-xs font-bold text-slate-300">
                      <input type="checkbox" className="sr-only peer" checked={Boolean(selectedConfig.enabled)}
                        onChange={e => updateSelectedConfig({ enabled: e.target.checked })} />
                      <span className="h-5 w-9 rounded-full border border-slate-700 bg-slate-800 transition-default peer-checked:border-cyan-400 peer-checked:bg-cyan-500 after:absolute after:left-[16px] after:top-[10px] after:h-3.5 after:w-3.5 after:rounded-full after:bg-slate-400 after:transition-default after:content-[''] peer-checked:after:translate-x-4 peer-checked:after:bg-slate-950" />
                      啟用
                    </label>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-semibold text-slate-400">交易所名稱</span>
                      <input type="text" value={selectedConfig.name} disabled={isSelectedPreset}
                        onChange={e => updateSelectedConfig({ name: e.target.value })}
                        className={cx(
                          'h-11 w-full rounded-lg border border-slate-700/70 bg-slate-950/70 px-3 text-sm text-slate-200 transition-default focus:border-cyan-400',
                          isSelectedPreset ? 'cursor-not-allowed opacity-70' : ''
                        )}
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-semibold text-slate-400">UID / 子帳號備註</span>
                      <input type="text" value={selectedConfig.uid}
                        onChange={e => updateSelectedConfig({ uid: e.target.value })}
                        className="h-11 w-full rounded-lg border border-slate-700/70 bg-slate-950/70 px-3 text-sm text-slate-200 transition-default placeholder:text-slate-600 focus:border-cyan-400"
                        placeholder="可留空"
                      />
                    </label>
                    <label className="block md:col-span-2">
                      <span className="mb-1.5 block text-xs font-semibold text-slate-400">API Key</span>
                      <input type={showSecrets ? 'text' : 'password'} value={selectedConfig.apiKey}
                        onChange={e => updateSelectedConfig({ apiKey: e.target.value })}
                        className="h-11 w-full rounded-lg border border-slate-700/70 bg-slate-950/70 px-3 font-mono text-sm text-cyan-100 transition-default placeholder:text-slate-600 focus:border-cyan-400"
                        placeholder="貼上 API Key"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-semibold text-slate-400">API Secret</span>
                      <input type={showSecrets ? 'text' : 'password'} value={selectedConfig.apiSecret}
                        onChange={e => updateSelectedConfig({ apiSecret: e.target.value })}
                        className="h-11 w-full rounded-lg border border-slate-700/70 bg-slate-950/70 px-3 font-mono text-sm text-cyan-100 transition-default placeholder:text-slate-600 focus:border-cyan-400"
                        placeholder="貼上 API Secret"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-semibold text-slate-400">Passphrase / Password</span>
                      <input type={showSecrets ? 'text' : 'password'} value={selectedConfig.passphrase}
                        onChange={e => updateSelectedConfig({ passphrase: e.target.value })}
                        className="h-11 w-full rounded-lg border border-slate-700/70 bg-slate-950/70 px-3 font-mono text-sm text-cyan-100 transition-default placeholder:text-slate-600 focus:border-cyan-400"
                        placeholder="OKX、Bitget 等需要時填寫"
                      />
                    </label>
                    <label className="block md:col-span-2">
                      <span className="mb-1.5 block text-xs font-semibold text-slate-400">備註</span>
                      <textarea value={selectedConfig.notes} rows="3"
                        onChange={e => updateSelectedConfig({ notes: e.target.value })}
                        className="w-full resize-none rounded-lg border border-slate-700/70 bg-slate-950/70 px-3 py-2 text-sm leading-relaxed text-slate-200 transition-default placeholder:text-slate-600 focus:border-cyan-400"
                        placeholder="例如：只開啟讀取權限、用於資產同步、不允許提幣"
                      />
                    </label>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 pt-4">
                    <button onClick={() => setShowSecrets(prev => !prev)}
                      className="min-h-10 rounded-lg border border-slate-700/70 bg-slate-950/50 px-3 text-xs font-bold text-slate-300 transition-default hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-200 cursor-pointer">
                      {showSecrets ? '隱藏敏感欄位' : '顯示敏感欄位'}
                    </button>
                    <div className="flex gap-2">
                      <button onClick={clearSelectedConfig}
                        className="min-h-10 rounded-lg border border-slate-700/70 bg-slate-950/50 px-3 text-xs font-bold text-slate-300 transition-default hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300 cursor-pointer">
                        清除 API
                      </button>
                      {!isSelectedPreset && (
                        <button onClick={removeSelectedConfig}
                          className="min-h-10 rounded-lg border border-red-500/40 bg-red-500/10 px-3 text-xs font-bold text-red-300 transition-default hover:bg-red-500/20 cursor-pointer">
                          刪除此交易所
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <EmptyState icon="settings" title="尚未選擇交易所" detail="請從左側選擇交易所，或新增自訂交易所。" />
              )}
            </div>
          )}

          {activeTab === 'language' && (
            <div className="space-y-4">
              <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
                <p className="text-sm font-bold text-slate-100">目前語言：{selectedLanguage?.nativeName}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">此設定會保存為使用者偏好並同步更新頁面語言標記，方便後續多語系內容與整合服務沿用。</p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {POPULAR_LANGUAGE_OPTIONS.map(option => {
                  const active = localLanguage === option.code;
                  return (
                    <button key={option.code} onClick={() => setLocalLanguage(option.code)}
                      className={cx(
                        'min-h-[82px] rounded-lg border p-3 text-left transition-default cursor-pointer',
                        active
                          ? 'border-amber-500/50 bg-amber-500/10 text-slate-50'
                          : 'border-slate-700/60 bg-slate-950/35 text-slate-400 hover:border-slate-600 hover:bg-slate-900/70 hover:text-slate-200'
                      )}>
                      <span className="flex items-center justify-between gap-2">
                        <span className="text-sm font-black">{option.nativeName}</span>
                        {active && <Icon name="check" className="h-4 w-4 text-amber-300" />}
                      </span>
                      <span className="mt-1 block text-xs font-semibold text-slate-400">{option.label}</span>
                      <span className="mt-1 block text-[11px] text-slate-500">{option.region}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-shrink-0 justify-end gap-2 border-t border-slate-800 px-5 py-4">
          <button onClick={onClose} className="min-h-11 rounded-lg border border-slate-700 px-4 text-sm font-semibold text-slate-300 transition-default hover:bg-slate-800 cursor-pointer">取消</button>
          <button onClick={saveSettings} className="flex min-h-11 items-center justify-center gap-1.5 rounded-lg bg-cyan-400 px-4 text-sm font-black text-slate-950 shadow-lg shadow-cyan-500/15 transition-default hover:bg-cyan-300 cursor-pointer">
            <Icon name="check" className="h-4 w-4" /> 儲存設定
          </button>
        </div>
      </div>
    </div>
  );
};

const CostSettingsPanel = ({ settings, updateSettings, costSettings, feeCatalogState }) => {
  const updateRate = (key, raw) => {
    const value = raw === '' ? 0 : parseFloat(raw);
    updateSettings({ [key]: isNaN(value) || value < 0 ? 0 : value });
  };
  const applyPreset = (preset) => updateSettings({
    exchangeKey: preset.key,
    feeTier: preset.tiers[0].level,
    slippageRate: preset.slippageRate,
    fundingRate: preset.fundingRate
  });
  const feeCatalog = feeCatalogState.catalog;
  const selectedPreset = getExchangePreset(costSettings.exchangeKey, feeCatalog);
  const selectedTier = getFeeTier(selectedPreset, costSettings.feeTier);
  const activeFeeRate = costSettings.feeMode === 'maker' ? costSettings.makerFeeRate : costSettings.takerFeeRate;

  return (
    <Panel className="border-cyan-500/20">
      <SectionHeader
        icon="settings"
        eyebrow="Cost Model"
        title="交易成本模型"
        action={<span className="rounded-lg border border-cyan-500/25 bg-cyan-500/10 px-3 py-2 text-xs font-bold text-cyan-200">{costSettings.exchangeLabel} / {costSettings.feeTier}</span>}
      />
      <div className="grid grid-cols-5 gap-1.5">
        {feeCatalog.map(preset => (
          <button key={preset.key} onClick={() => applyPreset(preset)}
            className={cx(
              'min-h-9 rounded-lg border px-1.5 text-[11px] font-bold transition-default cursor-pointer',
              costSettings.exchangeKey === preset.key
                ? 'border-cyan-400/50 bg-cyan-500/15 text-cyan-100'
                : 'border-slate-700/60 bg-slate-950/35 text-slate-500 hover:border-slate-600 hover:text-slate-200'
            )}>
            {preset.label}
          </button>
        ))}
      </div>

      <div className="mt-4 grid max-h-32 grid-cols-3 gap-1.5 overflow-y-auto rounded-lg border border-slate-800 bg-slate-950/35 p-1.5">
        {selectedPreset.tiers.map(tier => (
          <button key={tier.level} onClick={() => updateSettings({ feeTier: tier.level })}
            className={cx(
              'min-h-8 rounded-md px-2 text-[11px] font-bold transition-default cursor-pointer',
              costSettings.feeTier === tier.level ? 'bg-cyan-400 text-slate-950' : 'text-slate-500 hover:bg-slate-800/70 hover:text-slate-100'
            )}>
            {tier.level}
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 rounded-lg border border-slate-800 bg-slate-950/45 p-1">
        {[
          { value: 'maker', label: '限價 Maker' },
          { value: 'taker', label: '市價 Taker' }
        ].map(mode => (
          <button key={mode.value} onClick={() => updateSettings({ feeMode: mode.value })}
            className={cx(
              'min-h-10 rounded-md text-sm font-bold transition-default cursor-pointer',
              costSettings.feeMode === mode.value ? 'bg-cyan-400 text-slate-950' : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-100'
            )}>
            {mode.label}
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
        <div className="rounded-lg border border-slate-800 bg-slate-950/35 p-3">
          <span className="text-slate-500">限價費率</span>
          <strong className={cx('mt-1 block font-mono text-sm', costSettings.makerFeeRate < 0 ? 'text-emerald-300' : 'text-cyan-200')}>{costSettings.makerFeeRate.toFixed(4)}%</strong>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/35 p-3">
          <span className="text-slate-500">市價費率</span>
          <strong className="mt-1 block font-mono text-sm text-cyan-200">{costSettings.takerFeeRate.toFixed(4)}%</strong>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/35 p-3">
          <span className="text-slate-500">目前套用</span>
          <strong className={cx('mt-1 block font-mono text-sm', activeFeeRate < 0 ? 'text-emerald-300' : 'text-amber-300')}>{activeFeeRate.toFixed(4)}%</strong>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {[
          { key: 'slippageRate', label: '滑價' },
          { key: 'fundingRate', label: '資金費率' }
        ].map(field => (
          <label key={field.key} className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-400">{field.label}</span>
            <span className="relative block">
              <input type="number" min="0" step="0.01" value={settings[field.key] ?? 0}
                onChange={e => updateRate(field.key, e.target.value)}
                className="h-10 w-full rounded-lg border border-slate-700/70 bg-slate-950/70 pl-2 pr-7 text-right font-mono text-sm text-cyan-200 transition-default focus:border-cyan-400"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500">%</span>
            </span>
          </label>
        ))}
      </div>
      <div className="mt-3 rounded-lg border border-slate-800 bg-slate-950/35 p-3 text-xs leading-relaxed text-slate-500">
        <p>資料來源：{feeCatalogState.error ? `${feeCatalogState.source}（CSV 載入失敗，使用備援）` : feeCatalogState.source}</p>
        {selectedTier.note && <p className="mt-1 text-slate-400">資格備註：{selectedTier.note}</p>}
        {selectedPreset.unavailableTiers?.length > 0 && <p className="mt-1 text-amber-300">未公開費率：{selectedPreset.unavailableTiers.map(tier => tier.level).join('、')}</p>}
        <p className="mt-1">手續費依 CSV 的交易所、VIP 等級與限價/市價自動套用；滑價與資金費率仍可依交易品種手動調整。</p>
      </div>
    </Panel>
  );
};

const getNetReturnPerPosition = (multiplier, costSettings) => multiplier - 1 - getCostRateParts(costSettings, multiplier).totalRateOnPosition;

const formatRoundResult = (rounds) => {
  if (rounds === -1) return '無法達標';
  return String(rounds);
};

const CapitalCurveChart = ({ simulation, target }) => {
  if (!simulation.path.length) {
    return <Panel className="h-full"><EmptyState icon="bar-chart-3" title="尚無資金曲線" detail="請輸入有效本金、目標與收益率策略後產生曲線。" /></Panel>;
  }

  const chartPoints = [
    { round: 0, balance: simulation.path[0]?.balanceBefore || 0 },
    ...simulation.path.map(row => ({ round: row.round, balance: row.balanceAfter }))
  ];
  const width = 720;
  const height = 300;
  const padX = 44;
  const padY = 28;
  const balances = chartPoints.map(point => point.balance);
  const maxBalance = Math.max(target, ...balances, 1);
  const minBalance = Math.min(0, ...balances);
  const xFor = (index) => chartPoints.length === 1 ? padX : padX + (index / (chartPoints.length - 1)) * (width - padX * 2);
  const yFor = (value) => height - padY - ((value - minBalance) / Math.max(1, maxBalance - minBalance)) * (height - padY * 2);
  const linePath = chartPoints.map((point, index) => `${index === 0 ? 'M' : 'L'} ${xFor(index).toFixed(2)} ${yFor(point.balance).toFixed(2)}`).join(' ');
  const areaPath = `${linePath} L ${xFor(chartPoints.length - 1).toFixed(2)} ${height - padY} L ${padX} ${height - padY} Z`;
  const targetY = yFor(target);
  const lastPoint = chartPoints[chartPoints.length - 1];

  return (
    <Panel className="flex h-full min-h-0 flex-col">
      <SectionHeader
        icon="bar-chart-3"
        eyebrow="Equity Curve"
        title="資金曲線視覺化"
        action={<span className="rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-200">淨值曲線</span>}
      />
      <div className="min-h-0 flex-1 rounded-lg border border-slate-700/60 bg-slate-950/45 p-3">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-full min-h-[280px] w-full" role="img" aria-label="資金曲線圖">
          <defs>
            <linearGradient id="curveFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0.02" />
            </linearGradient>
            <filter id="curveGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {[0.25, 0.5, 0.75].map(mark => {
            const y = padY + mark * (height - padY * 2);
            return <line key={mark} x1={padX} x2={width - padX} y1={y} y2={y} stroke="#1e293b" strokeWidth="1" />;
          })}
          <line x1={padX} x2={width - padX} y1={targetY} y2={targetY} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="7 7" />
          <text x={width - padX} y={targetY - 8} textAnchor="end" fill="#fbbf24" fontSize="12" fontWeight="700">目標 {formatCompactNumber(target)} U</text>
          <path d={areaPath} fill="url(#curveFill)" />
          <path d={linePath} fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" filter="url(#curveGlow)" />
          <circle cx={xFor(chartPoints.length - 1)} cy={yFor(lastPoint.balance)} r="5" fill="#020617" stroke="#34d399" strokeWidth="3" />
          <text x={padX} y={height - 8} fill="#64748b" fontSize="12">第 0 局</text>
          <text x={width - padX} y={height - 8} textAnchor="end" fill="#64748b" fontSize="12">第 {lastPoint.round} 局</text>
        </svg>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <div className="rounded-lg border border-slate-800 bg-slate-950/35 p-3"><span className="text-slate-500">總毛利</span><strong className="mt-1 block font-mono text-emerald-300">{formatNumber(simulation.summary.totalGrossProfit)} U</strong></div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/35 p-3"><span className="text-slate-500">成本/返佣</span><strong className={cx('mt-1 block font-mono', simulation.summary.totalCost < 0 ? 'text-emerald-300' : 'text-cyan-200')}>{formatSignedNumber(-simulation.summary.totalCost)} U</strong></div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/35 p-3"><span className="text-slate-500">總淨利</span><strong className="mt-1 block font-mono text-amber-300">{formatNumber(simulation.summary.totalNetProfit)} U</strong></div>
      </div>
    </Panel>
  );
};

const MilestoneTracker = ({ settings, costSettings, scenario }) => {
  const target = getEffectiveTarget(settings.activeTargetTab, settings.targets);
  const principal = settings.principal || 0;
  const current = settings.currentBalance || 0;
  const gap = target - principal;

  if (principal <= 0 || gap <= 0 || !scenario) {
    return <Panel><EmptyState icon="target" title="無法建立里程碑" detail="請確認初始資金低於目標資金，且目前策略有效。" /></Panel>;
  }

  const milestones = [25, 50, 75, 100].map(percent => {
    const value = principal + gap * (percent / 100);
    const rounds = calculateRoundsToTarget(
      principal, value, settings.basePosition,
      settings.dynamicPositionEnabled, settings.dynamicRules, scenario.multiplier,
      settings.fixedAmountEnabled, settings.fixedAmount, costSettings
    );
    const progress = Math.min(100, Math.max(0, ((current - principal) / Math.max(1, value - principal)) * 100));
    return { percent, value, rounds, progress, reached: current >= value };
  });

  return (
    <Panel>
      <SectionHeader icon="target" eyebrow="Milestone" title="里程碑式目標追蹤" />
      <div className="space-y-3">
        {milestones.map(item => (
          <div key={item.percent} className={cx('rounded-lg border p-3', item.reached ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-slate-700/60 bg-slate-950/35')}>
            <div className="mb-2 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-slate-100">{item.percent}% 里程碑</p>
                <p className="mt-0.5 font-mono text-xs text-slate-500">{formatNumber(item.value, { maximumFractionDigits: 0 })} U</p>
              </div>
              <span className={cx('rounded-lg px-2.5 py-1 font-mono text-xs font-bold', item.reached ? 'bg-emerald-400 text-slate-950' : 'bg-slate-800 text-slate-300')}>{item.reached ? '已達成' : item.rounds === -1 ? '無法達標' : `${item.rounds} 局`}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-emerald-400 transition-all" style={{ width: `${item.progress}%` }} /></div>
          </div>
        ))}
      </div>
    </Panel>
  );
};

const ReverseTargetCalculator = ({ settings, costSettings, scenario }) => {
  const [desiredRounds, setDesiredRounds] = useState(12);
  const result = useMemo(() => {
    const target = getEffectiveTarget(settings.activeTargetTab, settings.targets);
    const principal = settings.principal || 0;
    const rounds = Math.max(1, Number(desiredRounds) || 1);
    if (principal <= 0 || target <= principal || !scenario) return null;
    const requiredGrowth = Math.pow(target / principal, 1 / rounds) - 1;
    const activeFeeRate = getCostRateParts(costSettings, scenario.multiplier).activeFeeRate;
    const slippageRate = costSettings.slippageRate / 100;
    const fundingRate = costSettings.fundingRate / 100;
    const averageBalance = (principal + target) / 2;
    const currentPositionFraction = settings.fixedAmountEnabled
      ? Math.min(1, Math.max(0.0001, settings.fixedAmount / Math.max(1, averageBalance)))
      : Math.max(0.0001, calculatePosition(principal, settings.basePosition, settings.dynamicPositionEnabled, settings.dynamicRules) / 100);
    const requiredMultiplier = (requiredGrowth / currentPositionFraction + 1 + activeFeeRate + slippageRate + fundingRate) / Math.max(0.0001, 1 - activeFeeRate);
    const netReturnPerPosition = getNetReturnPerPosition(scenario.multiplier, costSettings);
    const suggestedPosition = netReturnPerPosition > 0 ? (requiredGrowth / netReturnPerPosition) * 100 : null;
    return {
      requiredGrowth: requiredGrowth * 100,
      requiredProfitRate: Math.max(0, (requiredMultiplier - 1) * 100),
      suggestedPosition,
      suggestedFixedAmount: suggestedPosition ? averageBalance * (suggestedPosition / 100) : null
    };
  }, [settings, costSettings, scenario, desiredRounds]);

  return (
    <Panel>
      <SectionHeader icon="target" eyebrow="Reverse" title="達標倒推計算器" />
      <div className="grid gap-4 lg:grid-cols-[180px_minmax(0,1fr)]">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-400">期望達成局數</span>
          <input type="number" min="1" max="800" value={desiredRounds}
            onChange={e => setDesiredRounds(Math.max(1, parseInt(e.target.value, 10) || 1))}
            className="h-12 w-full rounded-lg border border-slate-700/70 bg-slate-950/70 px-3 text-right font-mono text-lg font-black text-amber-300 transition-default focus:border-amber-500"
          />
        </label>
        {result ? (
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-lg border border-slate-800 bg-slate-950/35 p-3"><span className="text-xs text-slate-500">每局需淨成長</span><strong className="mt-1 block font-mono text-xl text-emerald-300">{result.requiredGrowth.toFixed(2)}%</strong></div>
            <div className="rounded-lg border border-slate-800 bg-slate-950/35 p-3"><span className="text-xs text-slate-500">目前倉位需收益</span><strong className="mt-1 block font-mono text-xl text-amber-300">+{result.requiredProfitRate.toFixed(1)}%</strong></div>
            <div className="rounded-lg border border-slate-800 bg-slate-950/35 p-3"><span className="text-xs text-slate-500">目前策略建議倉位</span><strong className="mt-1 block font-mono text-xl text-cyan-200">{result.suggestedPosition ? `${Math.min(999, result.suggestedPosition).toFixed(1)}%` : '不可行'}</strong></div>
          </div>
        ) : <EmptyState icon="slash" title="倒推資料不足" detail="需要有效本金、目標與收益率策略。" />}
      </div>
      {settings.fixedAmountEnabled && result?.suggestedFixedAmount && (
        <p className="mt-3 rounded-lg border border-cyan-500/20 bg-cyan-500/10 p-3 text-xs leading-relaxed text-cyan-100">固定金額模式估算：若沿用目前策略，平均每局約需投入 {formatNumber(result.suggestedFixedAmount)} U。</p>
      )}
    </Panel>
  );
};

const buildHealthChecks = (settings, costSettings, scenario, simulation) => {
  const checks = [];
  const add = (level, title, detail) => checks.push({ level, title, detail });
  const netReturnPerPosition = scenario ? getNetReturnPerPosition(scenario.multiplier, costSettings) : 0;
  if (!scenario || netReturnPerPosition <= 0) add('red', '成本吃掉收益', '目前收益率扣除手續費、滑價與資金費率後為非正報酬，推演無法有效成長。');
  if (!settings.fixedAmountEnabled && settings.basePosition >= 80) add('red', '基礎倉位過高', '80% 以上倉位會讓單次失敗直接重創本金，建議降低或啟用動態倉位。');
  else if (!settings.fixedAmountEnabled && settings.basePosition >= 50) add('amber', '基礎倉位偏高', '50% 以上倉位適合高風險挑戰，不適合作為保守長期策略。');
  if (settings.fixedAmountEnabled && settings.principal > 0 && settings.fixedAmount > settings.principal) add('amber', '固定金額高於本金', '系統會自動以全部餘額推演，但這代表前期實際是滿倉投入。');
  if (settings.dynamicPositionEnabled) {
    if (!settings.dynamicRules.length) add('amber', '動態倉位未設定規則', '已開啟動態倉位，但沒有任何門檻規則，實際仍使用基礎倉位。');
    const thresholds = settings.dynamicRules.map(rule => Number(rule.threshold)).filter(Number.isFinite);
    if (new Set(thresholds).size !== thresholds.length) add('amber', '門檻重複', '動態規則有重複餘額門檻，可能導致使用者難以判讀實際套用規則。');
    const aggressiveRule = settings.dynamicRules.find(rule => Number(rule.position) >= 70);
    if (aggressiveRule) add('red', '動態規則過度激進', `餘額 ≥ ${formatNumber(aggressiveRule.threshold, { maximumFractionDigits: 0 })} 時倉位達 ${aggressiveRule.position}%。`);
  }
  if (costSettings.slippageRate >= 0.2) add('amber', '滑價假設偏高', '高滑價會明顯拖慢達標局數，建議檢查是否符合實際交易品種流動性。');
  if (simulation.summary.totalCost > Math.max(1, simulation.summary.totalGrossProfit * 0.2)) add('amber', '交易成本占比偏高', '總成本已超過毛利 20%，策略可能對交易所費率與滑價非常敏感。');
  return checks;
};

const PositionHealthCheck = ({ settings, costSettings, scenario, simulation }) => {
  const checks = buildHealthChecks(settings, costSettings, scenario, simulation);
  const toneMap = {
    red: 'border-red-500/30 bg-red-500/10 text-red-200',
    amber: 'border-amber-500/30 bg-amber-500/10 text-amber-200',
    emerald: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
  };
  const rows = checks.length ? checks : [{ level: 'emerald', title: '策略檢查通過', detail: '目前沒有偵測到重複門檻、過高倉位或成本吃掉收益的明顯問題。' }];
  return (
    <Panel>
      <SectionHeader icon="alert-triangle" eyebrow="Health" title="倉位規則健康檢查" />
      <div className="space-y-3">
        {rows.map((check, idx) => (
          <div key={idx} className={cx('rounded-lg border p-3', toneMap[check.level])}>
            <p className="text-sm font-bold">{check.title}</p>
            <p className="mt-1 text-xs leading-relaxed opacity-80">{check.detail}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
};

const MiniSensitivityTable = ({ title, rows }) => (
  <div className="rounded-lg border border-slate-700/60 bg-slate-950/35">
    <div className="border-b border-slate-800 px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">{title}</div>
    <div className="divide-y divide-slate-800/80">
      {rows.map((row, idx) => (
        <div key={idx} className="grid grid-cols-[1fr_auto] gap-3 px-3 py-2.5 text-sm">
          <span className="truncate text-slate-400">{row.label}</span>
          <span className={cx('font-mono font-bold', row.rounds === -1 ? 'text-red-300' : 'text-emerald-300')}>{formatRoundResult(row.rounds)}</span>
        </div>
      ))}
    </div>
  </div>
);

const SensitivityPanel = ({ settings, scenarios }) => {
  const target = getEffectiveTarget(settings.activeTargetTab, settings.targets);
  const activeScenario = scenarios[settings.activeScenario] || scenarios[0];
  const principalRows = [0.5, 1, 2, 5].map(mult => {
    const principal = Math.max(0.01, settings.principal * mult);
    return {
      label: `本金 x${mult}`,
      rounds: calculateRoundsToTarget(principal, target, settings.basePosition, settings.dynamicPositionEnabled, settings.dynamicRules, activeScenario.multiplier, settings.fixedAmountEnabled, settings.fixedAmount)
    };
  });
  const positionRows = QUICK_POSITIONS.map(pos => ({
    label: `${pos}% 倉位`,
    rounds: calculateRoundsToTarget(settings.principal, target, pos, false, [], activeScenario.multiplier, false, 0)
  }));

  return (
    <Panel>
      <SectionHeader icon="table-2" eyebrow="Sensitivity" title="敏感度分析面板" />
      <div className="grid gap-3 xl:grid-cols-2">
        <MiniSensitivityTable title="本金變動" rows={principalRows} />
        <MiniSensitivityTable title="倉位變動" rows={positionRows} />
      </div>
    </Panel>
  );
};

// ──────────────────────────────────────────────────────
// 比較矩陣
// ──────────────────────────────────────────────────────
const ComparisonTable = ({ settings }) => {
  const scenarios = getScenarios(settings);
  const target = getEffectiveTarget(settings.activeTargetTab, settings.targets);
  const positionSizes = [1, 3, 5, 7, 10, 20, 50, 100];

  return (
    <Panel className="flex h-full min-h-0 flex-col">
      <SectionHeader
        icon="table-2"
        eyebrow="Matrix"
        title="策略比較矩陣"
        action={<span className="rounded-lg border border-slate-700/70 bg-slate-950/45 px-3 py-2 text-xs font-semibold text-slate-400">倉位 x 收益率 → 達標局數</span>}
      />
      {settings.fixedAmountEnabled && (
        <div className="mb-3 rounded-lg border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-200">
          固定金額模式中，此矩陣以百分比倉位計算，供策略對照使用。
        </div>
      )}
      <div className="min-h-0 flex-1 overflow-auto rounded-lg border border-slate-700/60">
        <table className="w-full whitespace-nowrap">
          <thead className="sticky top-0 z-10 border-b border-slate-700/70 bg-slate-900 text-xs uppercase tracking-[0.12em] text-slate-400">
            <tr>
              <th className="sticky left-0 z-20 bg-slate-900 px-4 py-3 text-left font-semibold">倉位</th>
              {scenarios.map((s, i) => (
                <th key={i} className={`px-4 py-3 text-center font-semibold transition-default ${settings.activeScenario === i ? 'bg-amber-500/10 text-amber-200' : ''}`}>{s.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 bg-slate-950/30">
            {positionSizes.map(pos => (
              <tr key={pos} className={`transition-default hover:bg-slate-800/45 ${settings.basePosition === pos && !settings.fixedAmountEnabled ? 'bg-amber-500/5' : ''}`}>
                <td className={`sticky left-0 z-10 px-4 py-3 text-sm font-mono font-bold ${settings.basePosition === pos && !settings.fixedAmountEnabled ? 'bg-amber-500/10 text-amber-200' : 'bg-slate-950 text-slate-400'}`}>{pos}%</td>
                {scenarios.map((s, i) => {
                  const rounds = calculateRoundsToTarget(settings.principal, target, pos, false, [], s.multiplier, false, 0);
                  const isBankrupt = rounds === -1;
                  const isOverLimit = rounds === '> 800';
                  const isCurrentCell = settings.basePosition === pos && settings.activeScenario === i && !settings.fixedAmountEnabled;
                  return (
                    <td key={i} className={`px-4 py-3 text-center text-sm font-mono transition-default ${
                      isCurrentCell ? 'bg-emerald-500/15 text-emerald-200 font-black ring-2 ring-inset ring-emerald-500/35' :
                      isBankrupt || isOverLimit ? 'text-red-500/50' :
                      settings.activeScenario === i ? 'bg-amber-500/5 text-slate-100' : 'text-slate-300'
                    }`}>{isBankrupt ? '—' : rounds}</td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 flex items-center text-xs text-slate-500">
        <Icon name="info" className="mr-1.5 h-3.5 w-3.5" /> 此矩陣以固定倉位計算（不含動態調整規則），高亮格為目前選中組合。
      </p>
    </Panel>
  );
};

// ──────────────────────────────────────────────────────
// 主要 App 元件 — 左側邊欄 + 右側內容區
// ──────────────────────────────────────────────────────
const App = () => {
  const { settings, updateSettings, clearAllData } = useLocalSettings();
  const usdtTwdRateState = useUsdtTwdRate();
  const mexcWalletBindingEnabled = Boolean(settings.mexcWalletBindingEnabled);
  const mexcWalletSyncState = useMexcWalletSync(updateSettings, mexcWalletBindingEnabled);
  const usdtTwdRate = getValidUsdtTwdRate(usdtTwdRateState);
  const amountInputCurrency = normalizeInputCurrency(settings.amountInputCurrency, usdtTwdRate);
  const simulation = useGrowthSimulation(settings);
  const scenarios = getScenarios(settings);
  const languageOption = getLanguageOption(settings.preferredLanguage);
  const configuredApiCount = (settings.exchangeApiConfigs || []).filter(hasExchangeApiCredential).length;

  const [showResetModal, setShowResetModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [showScenarioModal, setShowScenarioModal] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [activeContentTab, setActiveContentTab] = useState(0);
  const [principalRaw, setPrincipalRaw] = useState(settings.principal === 0 ? '' : String(settings.principal));
  const [balanceRaw, setBalanceRaw] = useState(settings.currentBalance === 0 ? '' : String(settings.currentBalance));
  const [fixedAmountRaw, setFixedAmountRaw] = useState(settings.fixedAmount === 0 ? '' : String(settings.fixedAmount));

  useEffect(() => {
    setPrincipalRaw(formatMoneyInput(settings.principal, amountInputCurrency, usdtTwdRate));
  }, [settings.principal, amountInputCurrency, usdtTwdRate]);

  useEffect(() => {
    setBalanceRaw(formatMoneyInput(settings.currentBalance, amountInputCurrency, usdtTwdRate));
  }, [settings.currentBalance, amountInputCurrency, usdtTwdRate]);

  useEffect(() => {
    document.documentElement.lang = languageOption?.code || DEFAULT_LANGUAGE_CODE;
  }, [languageOption]);

  const updateMoneySetting = (key, raw, setRaw) => {
    setRaw(raw);
    const inputValue = parseInputNumber(raw);
    updateSettings({ [key]: toUsdtAmount(inputValue, amountInputCurrency, usdtTwdRate) });
  };

  const toggleMexcWalletBinding = () => {
    updateSettings(prev => ({ ...prev, mexcWalletBindingEnabled: !Boolean(prev.mexcWalletBindingEnabled) }));
  };

  const handleResetConfirm = async () => {
    setIsResetting(true);
    try { await clearAllData(); window.location.reload(); }
    catch (err) { setIsResetting(false); setShowResetModal(false); }
  };

  // 進度計算
  const progressData = useMemo(() => {
    const target = getEffectiveTarget(settings.activeTargetTab, settings.targets);
    const cur = settings.currentBalance || 0;
    const principal = settings.principal || 0;
    const totalGap = target - principal;
    const progressPercent = totalGap > 0 ? Math.min(100, Math.max(0, ((cur - principal) / totalGap) * 100)) : (cur >= target ? 100 : 0);
    const remaining = target - cur;
    const scenario = scenarios[settings.activeScenario];
    const remainingRounds = cur > 0 && cur < target && scenario
      ? calculateRoundsToTarget(cur, target, settings.basePosition, settings.dynamicPositionEnabled, settings.dynamicRules, scenario.multiplier, settings.fixedAmountEnabled, settings.fixedAmount)
      : null;
    let encourageText = '', encourageColor = 'text-slate-400';
    if (cur <= 0 || principal <= 0) { encourageText = '填入資金開始追蹤'; encourageColor = 'text-slate-500'; }
    else if (cur >= target) { encourageText = '恭喜達標！'; encourageColor = 'text-emerald-400'; }
    else if (progressPercent >= 80) { encourageText = '即將達標！'; encourageColor = 'text-emerald-400'; }
    else if (progressPercent >= 50) { encourageText = '過半了！'; encourageColor = 'text-amber-300'; }
    else if (progressPercent >= 20) { encourageText = '穩步前進！'; encourageColor = 'text-violet-300'; }
    else if (cur > principal) { encourageText = '繼續加油'; encourageColor = 'text-violet-300'; }
    else if (cur < principal) { encourageText = '沉住氣！'; encourageColor = 'text-amber-400'; }
    else { encourageText = '加油！'; encourageColor = 'text-violet-300'; }
    return { target, cur, progressPercent, remaining, remainingRounds, encourageText, encourageColor };
  }, [settings, scenarios, simulation]);

  const activeScenario = scenarios[settings.activeScenario] || scenarios[0] || DEFAULT_SCENARIOS[0];
  const totalGrowthRate = settings.principal > 0 ? ((simulation.summary.finalBalance / settings.principal - 1) * 100) : 0;
  const resultTone = simulation.summary.bankrupt ? 'red' : simulation.summary.reachedGoal ? 'emerald' : 'amber';
  const orderModeLabel = settings.fixedAmountEnabled
    ? `固定 ${formatNumber(settings.fixedAmount, { maximumFractionDigits: 0 })} U`
    : `${settings.basePosition}% 倉位`;
  const mexcWalletStatusLabel = !mexcWalletBindingEnabled
    ? '未綁定'
    : mexcWalletSyncState.connected
      ? '同步中'
      : mexcWalletSyncState.syncing
        ? '連線中'
        : '離線';
  const mexcWalletDisplayValue = !mexcWalletBindingEnabled
    ? '手動輸入模式'
    : mexcWalletSyncState.walletBalance !== null
      ? `${formatNumber(mexcWalletSyncState.walletBalance, { maximumFractionDigits: 4 })} USDT`
      : '等待連線';
  const mexcWalletDetail = !mexcWalletBindingEnabled
    ? '未綁定 MEXC，初始資金與目前持有可自行輸入。'
    : mexcWalletSyncState.connected
      ? `更新 ${formatSyncTime(mexcWalletSyncState.updatedAt)}`
      : (mexcWalletSyncState.error || '啟用後會同步 MEXC Wallet Balance');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500/30 lg:h-screen lg:overflow-hidden">
      <a href="#main-workspace" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-amber-400 focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-slate-950">
        跳到主要內容
      </a>

      <ResetConfirmModal isOpen={showResetModal} onConfirm={handleResetConfirm} onCancel={() => setShowResetModal(false)} isResetting={isResetting} />
      <SettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} settings={settings} onSave={(nextSettings) => updateSettings(nextSettings)} />
      <TargetEditModal isOpen={showTargetModal} onClose={() => setShowTargetModal(false)} targets={settings.targets} onSave={(t) => updateSettings({ targets: t })} amountInputCurrency={amountInputCurrency} usdtTwdRate={usdtTwdRate} />
      <ScenarioEditModal isOpen={showScenarioModal} onClose={() => setShowScenarioModal(false)} scenarios={scenarios} onSave={(s) => updateSettings({ scenarios: s, activeScenario: 0 })} />

      <div className="flex min-h-screen flex-col lg:h-full">
        <header className="flex-shrink-0 border-b border-slate-800/80 bg-slate-950/90 px-5 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg border border-amber-500/25 bg-amber-500/10 text-amber-300">
                <Icon name="bar-chart-3" className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-300">Position Planner</p>
                <h1 className="truncate text-xl font-black tracking-tight text-slate-50">加密貨幣翻倍計算器</h1>
              </div>
              <div className="hidden items-center gap-2 xl:flex">
                <MarketStatusBadge />
                <StorageIndicator />
              </div>
            </div>
            <div className="flex flex-shrink-0 items-center gap-2">
              <div className="hidden rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-slate-400 md:block">
                <span className="font-semibold text-amber-200">USDT/TWD</span>
                <span className="mx-2 text-slate-600">=</span>
                <span className="font-mono text-slate-50">{usdtTwdRate ? formatNumber(usdtTwdRate, { maximumFractionDigits: 3 }) : '載入中'}</span>
              </div>
              <button onClick={() => setShowSettingsModal(true)} aria-label="開啟 API 與語言設定" title={`API 與語言設定 · ${configuredApiCount} 個 API · ${languageOption?.nativeName || '繁體中文'}`}
                className="relative flex h-11 w-11 items-center justify-center rounded-lg border border-slate-700/70 bg-slate-900/70 text-slate-400 transition-default hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-200 cursor-pointer">
                <Icon name="settings" className="h-4 w-4" />
                {configuredApiCount > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border border-slate-950 bg-cyan-400 px-1 text-[10px] font-black text-slate-950">{configuredApiCount}</span>}
              </button>
              <button onClick={() => setShowResetModal(true)} aria-label="重置所有設定" title="重置設定"
                className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-700/70 bg-slate-900/70 text-slate-400 transition-default hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300 cursor-pointer">
                <Icon name="rotate-ccw" className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        <div className="grid flex-1 gap-4 p-4 lg:min-h-0 lg:grid-cols-[392px_minmax(0,1fr)] lg:overflow-hidden">
          <aside className="flex flex-col gap-4 pr-1 lg:min-h-0 lg:overflow-y-auto">
            <Panel>
              <SectionHeader
                icon="wallet"
                eyebrow="Capital"
                title="資金與目標"
                action={
                  <div className="flex items-center gap-2">
                    <button onClick={toggleMexcWalletBinding}
                      aria-pressed={mexcWalletBindingEnabled}
                      title={mexcWalletBindingEnabled ? '取消 MEXC Wallet 綁定' : '綁定 MEXC Wallet Balance'}
                      className={cx(
                        'inline-flex min-h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-bold transition-default cursor-pointer',
                        mexcWalletBindingEnabled
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:border-emerald-400/60'
                          : 'border-slate-700/70 bg-slate-950/50 text-slate-300 hover:border-amber-500/40 hover:bg-amber-500/10 hover:text-amber-300'
                      )}>
                      <Icon name={mexcWalletBindingEnabled ? 'x' : 'wallet'} className="h-3.5 w-3.5" />
                      {mexcWalletBindingEnabled ? '取消綁定' : '綁定 MEXC'}
                    </button>
                    <button onClick={mexcWalletSyncState.refresh} disabled={!mexcWalletBindingEnabled}
                      aria-label="手動同步 MEXC Wallet Balance" title={mexcWalletBindingEnabled ? '手動同步 MEXC Wallet Balance' : '先綁定 MEXC 後才能同步'}
                      className={cx(
                        'flex h-9 w-9 items-center justify-center rounded-lg border transition-default',
                        !mexcWalletBindingEnabled
                          ? 'cursor-not-allowed border-slate-800 bg-slate-950/35 text-slate-600 opacity-60'
                          : mexcWalletSyncState.connected
                          ? 'cursor-pointer border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:border-emerald-400/60'
                          : 'cursor-pointer border-slate-700/70 bg-slate-950/50 text-slate-400 hover:border-amber-500/40 hover:bg-amber-500/10 hover:text-amber-300'
                      )}>
                      <Icon name="rotate-ccw" className={cx('h-3.5 w-3.5', mexcWalletSyncState.syncing ? 'animate-spin' : '')} />
                    </button>
                    <button onClick={() => setShowTargetModal(true)}
                      className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-700/70 bg-slate-950/50 px-3 text-xs font-bold text-amber-300 transition-default hover:border-amber-500/40 hover:bg-amber-500/10 cursor-pointer">
                      <Icon name="edit-2" className="h-3.5 w-3.5" /> 編輯數字
                    </button>
                  </div>
                }
              />

              <div className="mb-4 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-mono text-lg font-black text-slate-50">
                    <span className="mr-2 text-xs font-bold text-amber-300">USDT/TWD</span>
                    {usdtTwdRate ? formatNumber(usdtTwdRate, { maximumFractionDigits: 3 }) : '載入中'}
                  </p>
                  <div className="grid w-32 grid-cols-2 gap-1 rounded-lg border border-slate-800 bg-slate-950/50 p-1">
                    {['USDT', 'TWD'].map(currency => (
                      <button key={currency} disabled={currency === 'TWD' && !usdtTwdRate} onClick={() => updateSettings({ amountInputCurrency: currency })}
                        className={cx(
                          'min-h-8 rounded-md text-xs font-black transition-default',
                          amountInputCurrency === currency ? 'bg-amber-400 text-slate-950' : 'text-slate-500 hover:bg-slate-800 hover:text-slate-200',
                          currency === 'TWD' && !usdtTwdRate ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'
                        )}>
                        {currency}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className={cx(
                'mb-4 rounded-lg border p-3',
                mexcWalletBindingEnabled && mexcWalletSyncState.connected
                  ? 'border-emerald-500/25 bg-emerald-500/10'
                  : mexcWalletBindingEnabled
                    ? 'border-amber-500/25 bg-amber-500/5'
                    : 'border-slate-700/70 bg-slate-950/35'
              )}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">MEXC Wallet Balance</p>
                    <p className={cx('mt-1 truncate font-mono text-lg font-black', mexcWalletBindingEnabled && mexcWalletSyncState.connected ? 'text-emerald-200' : 'text-slate-300')}>
                      {mexcWalletDisplayValue}
                    </p>
                  </div>
                  <span className={cx(
                    'rounded-lg border px-2.5 py-1 text-[11px] font-bold',
                    mexcWalletBindingEnabled && mexcWalletSyncState.connected
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                      : mexcWalletBindingEnabled
                        ? 'border-amber-500/25 bg-amber-500/10 text-amber-300'
                        : 'border-slate-700 bg-slate-900 text-slate-400'
                  )}>
                    {mexcWalletStatusLabel}
                  </span>
                </div>
                <p className="mt-2 truncate text-xs text-slate-500">
                  {mexcWalletDetail}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-slate-400">初始資金 ({amountInputCurrency})</span>
                  <span className="relative block">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-600">{amountInputCurrency === 'TWD' ? 'NT$' : '$'}</span>
                    <input type="number" min="0" step={amountInputCurrency === 'TWD' ? '100' : '0.1'} value={principalRaw}
                      onChange={e => updateMoneySetting('principal', e.target.value, setPrincipalRaw)}
                      className="h-12 w-full rounded-lg border border-slate-700/70 bg-slate-950/70 pl-12 pr-16 text-base font-bold text-slate-100 transition-default placeholder:text-slate-600 focus:border-amber-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-500">{amountInputCurrency}</span>
                  </span>
                  <span className="mt-1 block text-[11px] text-slate-500">折合 {formatCurrencyEquivalent(settings.principal, amountInputCurrency, usdtTwdRate)}</span>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-slate-400">目前持有 ({amountInputCurrency})</span>
                  <span className="relative block">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-600">{amountInputCurrency === 'TWD' ? 'NT$' : '$'}</span>
                    <input type="number" min="0" step={amountInputCurrency === 'TWD' ? '100' : '0.1'} value={balanceRaw}
                      onChange={e => updateMoneySetting('currentBalance', e.target.value, setBalanceRaw)}
                      className="h-12 w-full rounded-lg border border-slate-700/70 bg-slate-950/70 pl-12 pr-16 text-base font-bold text-emerald-300 transition-default placeholder:text-slate-600 focus:border-amber-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-500">{amountInputCurrency}</span>
                  </span>
                  <span className="mt-1 block text-[11px] text-slate-500">折合 {formatCurrencyEquivalent(settings.currentBalance, amountInputCurrency, usdtTwdRate)}</span>
                </label>
              </div>

              <div className="mt-4 grid gap-2">
                {(settings.targets || []).map((target, idx) => {
                  const isActive = settings.activeTargetTab === idx;
                  return (
                    <button key={idx} onClick={() => updateSettings({ activeTargetTab: idx })}
                      className={cx(
                        'flex min-h-[58px] items-center justify-between rounded-lg border px-4 py-3 text-left transition-default cursor-pointer',
                        isActive
                          ? 'border-amber-500/45 bg-amber-500/10 text-slate-50'
                          : 'border-slate-700/60 bg-slate-950/35 text-slate-400 hover:border-slate-600 hover:bg-slate-900/70 hover:text-slate-200'
                      )}>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-bold">{target.label}</span>
                        <span className="mt-0.5 block text-xs text-slate-500">達標資金</span>
                      </span>
                      <span className="text-right">
                        <span className="block font-mono text-lg font-black text-amber-300">{formatCompactNumber(target.value)} U</span>
                        {usdtTwdRate && <span className="mt-0.5 block text-[10px] font-semibold text-slate-500">≈ {formatTwdEquivalent(target.value, usdtTwdRate)}</span>}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Panel>

            <Panel className={settings.fixedAmountEnabled || settings.dynamicPositionEnabled ? 'border-amber-500/35' : ''}>
              <SectionHeader
                icon="crosshair"
                eyebrow="Execution"
                title="下單模式"
                action={<span className="rounded-lg border border-slate-700/70 bg-slate-950/50 px-3 py-2 font-mono text-xs font-bold text-slate-200">{orderModeLabel}</span>}
              />

              <div className="grid grid-cols-2 gap-2 rounded-lg border border-slate-800 bg-slate-950/45 p-1">
                <button onClick={() => updateSettings({ fixedAmountEnabled: false })}
                  className={cx(
                    'inline-flex min-h-11 items-center justify-center gap-2 rounded-md text-sm font-bold transition-default cursor-pointer',
                    !settings.fixedAmountEnabled ? 'bg-amber-400 text-slate-950 shadow-sm shadow-amber-500/20' : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-200'
                  )}>
                  <Icon name="percent" className="h-4 w-4" /> 百分比
                </button>
                <button onClick={() => updateSettings({ fixedAmountEnabled: true })}
                  className={cx(
                    'inline-flex min-h-11 items-center justify-center gap-2 rounded-md text-sm font-bold transition-default cursor-pointer',
                    settings.fixedAmountEnabled ? 'bg-amber-400 text-slate-950 shadow-sm shadow-amber-500/20' : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-200'
                  )}>
                  <Icon name="banknote" className="h-4 w-4" /> 固定金額
                </button>
              </div>

              {!settings.fixedAmountEnabled ? (
                <div className="mt-5">
                  <div className="mb-3 flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-400">基礎倉位</label>
                    <span className="font-mono text-2xl font-black text-amber-300">{settings.basePosition}%</span>
                  </div>
                  <input type="range" min="1" max="100" value={settings.basePosition}
                    onChange={e => updateSettings({ basePosition: parseInt(e.target.value, 10) || 1 })}
                    aria-label="基礎倉位百分比"
                    className="mb-3 w-full cursor-pointer"
                  />
                  <div className="grid grid-cols-4 gap-2">
                    {QUICK_POSITIONS.map(val => (
                      <button key={val} onClick={() => updateSettings({ basePosition: val })}
                        className={cx(
                          'min-h-10 rounded-lg border text-sm font-bold transition-default cursor-pointer',
                          settings.basePosition === val
                            ? 'border-amber-500/45 bg-amber-500/15 text-amber-200'
                            : 'border-slate-700/60 bg-slate-950/35 text-slate-400 hover:border-slate-600 hover:bg-slate-900/70 hover:text-slate-200'
                        )}
                      >{val}%</button>
                    ))}
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-800/80 pt-4">
                    <div>
                      <p className="text-sm font-bold text-slate-200">動態倉位調整</p>
                      <p className="mt-0.5 text-xs text-slate-500">依餘額門檻自動切換倉位</p>
                    </div>
                    <label className="relative inline-flex min-h-11 cursor-pointer items-center">
                      <input type="checkbox" className="sr-only peer" checked={settings.dynamicPositionEnabled}
                        aria-label="啟用動態倉位調整"
                        onChange={e => updateSettings({ dynamicPositionEnabled: e.target.checked })} />
                      <span className="h-6 w-11 rounded-full border border-slate-700 bg-slate-800 transition-default peer-checked:border-amber-400 peer-checked:bg-amber-500 after:absolute after:left-[4px] after:top-[12px] after:h-4 after:w-4 after:rounded-full after:bg-slate-400 after:transition-default after:content-[''] peer-checked:after:translate-x-5 peer-checked:after:bg-slate-950" />
                    </label>
                  </div>
                  {settings.dynamicPositionEnabled && (
                    <DynamicRulesList rules={settings.dynamicRules} onChange={(r) => updateSettings({ dynamicRules: r })} />
                  )}
                </div>
              ) : (
                <div className="mt-5">
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-slate-400">每次下單金額</span>
                    <span className="relative block">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-600">$</span>
                      <input type="number" min="0" step="1" value={fixedAmountRaw}
                        onChange={e => { const raw = e.target.value; setFixedAmountRaw(raw); const val = raw === '' ? 0 : parseFloat(raw); updateSettings({ fixedAmount: isNaN(val) || val < 0 ? 0 : val }); }}
                        className="h-12 w-full rounded-lg border border-slate-700/70 bg-slate-950/70 pl-8 pr-16 text-base font-bold text-amber-300 transition-default focus:border-amber-500"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500">USDT</span>
                    </span>
                  </label>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {QUICK_AMOUNTS.map(val => (
                      <button key={val} onClick={() => { setFixedAmountRaw(String(val)); updateSettings({ fixedAmount: val }); }}
                        className={cx(
                          'min-h-10 rounded-lg border text-sm font-bold transition-default cursor-pointer',
                          settings.fixedAmount === val
                            ? 'border-amber-500/45 bg-amber-500/15 text-amber-200'
                            : 'border-slate-700/60 bg-slate-950/35 text-slate-400 hover:border-slate-600 hover:bg-slate-900/70 hover:text-slate-200'
                        )}
                      >{val}</button>
                    ))}
                  </div>
                  <p className="mt-3 rounded-lg border border-slate-800 bg-slate-950/35 p-3 text-xs leading-relaxed text-slate-500">
                    固定下注金額不隨本金變動；若金額超過餘額，系統會以全部餘額推演。
                  </p>
                </div>
              )}
            </Panel>

          </aside>

          <main id="main-workspace" className="flex min-w-0 flex-col gap-4 lg:min-h-0 lg:overflow-hidden">
            <section className="grid flex-shrink-0 grid-cols-1 gap-3 xl:grid-cols-[repeat(3,minmax(0,1fr))_1.45fr]">
              <MetricCard
                label="達標局數"
                icon="flag"
                tone={resultTone}
                value={simulation.summary.bankrupt ? '破產' : simulation.summary.reachedGoal ? simulation.summary.goalRound : `>${simulation.summary.totalRounds}`}
                unit={simulation.summary.bankrupt ? '' : '局'}
                caption={`目前策略 ${activeScenario.label} / ${orderModeLabel}`}
              />
              <MetricCard
                label="最終資金"
                icon="landmark"
                value={formatNumber(simulation.summary.finalBalance)}
                unit="U"
                caption={`目標 ${formatNumber(progressData.target, { maximumFractionDigits: 0 })} U`}
              />
              <MetricCard
                label="總成長率"
                icon="trending-up"
                tone="violet"
                value={settings.principal > 0 ? totalGrowthRate.toFixed(1) : '0.0'}
                unit="%"
                caption="以初始資金為基準"
              />
              <div className={cx(
                'rounded-lg border p-4',
                progressData.cur >= progressData.target ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-slate-700/70 bg-[#0E1223]/95'
              )}>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Goal Progress</p>
                    <p className={cx('mt-1 text-sm font-bold', progressData.encourageColor)}>{progressData.encourageText}</p>
                  </div>
                  <span className="font-mono text-2xl font-black text-slate-50">{progressData.progressPercent.toFixed(1)}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                  <div className={cx('h-full rounded-full transition-all duration-500', progressData.cur >= progressData.target ? 'bg-emerald-400' : 'bg-amber-400')}
                    style={{ width: `${progressData.progressPercent}%` }} />
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                  <span>目前 <strong className="font-mono text-slate-100">{formatNumber(progressData.cur)} U</strong></span>
                  {progressData.cur >= progressData.target ? (
                    <span className="font-bold text-emerald-300">已達標</span>
                  ) : (
                    <span>剩餘 <strong className="font-mono text-amber-300">{formatNumber(Math.max(0, progressData.remaining))} U</strong></span>
                  )}
                </div>
              </div>
            </section>

            <Panel className="flex-shrink-0 py-3">
              <SectionHeader
                icon="zap"
                eyebrow="Scenario"
                title="收益率策略"
                action={
                  <button onClick={() => setShowScenarioModal(true)}
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-700/70 bg-slate-950/50 px-3 text-xs font-bold text-amber-300 transition-default hover:border-amber-500/40 hover:bg-amber-500/10 cursor-pointer">
                    <Icon name="settings" className="h-3.5 w-3.5" /> 編輯策略
                  </button>
                }
              />
              <div className="grid grid-cols-4 gap-1 xl:grid-cols-8">
                {scenarios.map((scenario, idx) => {
                  const isActive = settings.activeScenario === idx;
                  const estRounds = calculateRoundsToTarget(
                    settings.principal, progressData.target, settings.basePosition,
                    settings.dynamicPositionEnabled, settings.dynamicRules, scenario.multiplier,
                    settings.fixedAmountEnabled, settings.fixedAmount
                  );
                  const isBankrupt = estRounds === -1;
                  return (
                    <button key={idx} onClick={() => updateSettings({ activeScenario: idx })}
                      aria-pressed={isActive}
                      className={cx(
                        'relative min-h-[56px] rounded-lg border p-1.5 text-left transition-default cursor-pointer',
                        isActive
                          ? 'border-amber-500/55 bg-amber-500/10 text-slate-50 shadow-sm shadow-amber-500/10'
                          : 'border-slate-700/60 bg-slate-950/35 text-slate-400 hover:border-slate-600 hover:bg-slate-900/70 hover:text-slate-200'
                      )}>
                      <span className="block text-[11px] font-bold leading-none text-amber-300">{scenario.label}</span>
                      <span className={cx('mt-1 block font-mono text-xl font-black leading-none', isBankrupt ? 'text-red-300' : isActive ? 'text-slate-50' : 'text-slate-300')}>
                        {isBankrupt ? '—' : estRounds}
                      </span>
                      <span className="mt-0.5 block text-[10px] leading-none text-slate-500">{isBankrupt ? '無法達標' : '預估局數'}</span>
                    </button>
                  );
                })}
              </div>
            </Panel>

            <nav className="grid flex-shrink-0 grid-cols-2 gap-2 rounded-lg border border-slate-800 bg-slate-950/60 p-1" aria-label="主要資料檢視">
              {[
                { label: '推演明細', icon: 'list' },
                { label: '策略分析', icon: 'table-2' }
              ].map((tab, i) => (
                <button key={i} onClick={() => setActiveContentTab(i)}
                  aria-pressed={activeContentTab === i}
                  className={cx(
                    'inline-flex min-h-11 items-center justify-center gap-2 rounded-md text-sm font-bold transition-default cursor-pointer',
                    activeContentTab === i ? 'bg-slate-100 text-slate-950' : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-100'
                  )}>
                  <Icon name={tab.icon} className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </nav>

            <div className="min-h-[420px] overflow-y-auto pr-1 lg:min-h-0 lg:flex-1">
              {activeContentTab === 0 && (
                <Panel className="flex h-full min-h-0 flex-col">
                  <SectionHeader icon="list" eyebrow="Simulation" title="資金推演明細" />
                  {simulation.path.length > 0 ? (
                    <div className="min-h-0 flex-1 overflow-auto rounded-lg border border-slate-700/60">
                      <table className="w-full whitespace-nowrap text-left">
                        <thead className="sticky top-0 z-10 border-b border-slate-700/70 bg-slate-900 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                          <tr>
                            <th className="px-4 py-3 font-semibold">局數</th>
                            <th className="px-4 py-3 text-right font-semibold">起始資金</th>
                            <th className="px-4 py-3 text-right font-semibold">{settings.fixedAmountEnabled ? '投入 $' : '倉位 %'}</th>
                            <th className="px-4 py-3 text-right font-semibold">投入金額</th>
                            <th className="px-4 py-3 text-right font-semibold">獲利</th>
                            <th className="px-4 py-3 text-right font-semibold">結算資金</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/80 bg-slate-950/30">
                          {simulation.path.map((row) => (
                            <tr key={row.round} className={cx('transition-default hover:bg-slate-800/45', row.reachedGoal ? 'bg-emerald-500/10' : '')}>
                              <td className="px-4 py-3 text-sm font-mono font-bold text-slate-300">{row.round}</td>
                              <td className="px-4 py-3 text-right text-sm font-mono text-slate-400">{formatNumber(row.balanceBefore, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                              <td className="px-4 py-3 text-right text-sm font-mono font-bold text-amber-300">
                                {settings.fixedAmountEnabled ? `$${formatNumber(row.positionSize, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `${row.posPercent}%`}
                              </td>
                              <td className="px-4 py-3 text-right text-sm font-mono text-slate-400">{formatNumber(row.positionSize, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                              <td className="px-4 py-3 text-right text-sm font-mono font-bold text-emerald-300">{formatSignedNumber(row.profit, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                              <td className={cx('px-4 py-3 text-right text-sm font-mono font-black', row.reachedGoal ? 'text-emerald-200' : 'text-slate-100')}>
                                {formatNumber(row.balanceAfter, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                {row.reachedGoal && <Icon name="target" className="ml-1.5 inline h-3.5 w-3.5 text-emerald-300" />}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <EmptyState icon="slash" title="缺乏有效運算資料" detail="請確認初始資金、目標與收益率策略皆為有效數值。" />
                  )}
                </Panel>
              )}
              {activeContentTab === 1 && (
                <div className="grid gap-4">
                  <ComparisonTable settings={settings} />
                  <SensitivityPanel settings={settings} scenarios={scenarios} />
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────────────
// 掛載 React 應用程式
// ──────────────────────────────────────────────────────
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(React.createElement(App));
