// ═══════════════════════════════════════════════════════════════
//  $WITNESS — DEPLOY CONFIG
//  Отредактируй этот файл перед деплоем на GitHub Pages
//
//  Шаги при выходе токена:
//  1. Вставь CA (contract address)
//  2. Вставь ссылки DEXSCREENER и PUMPFUN
//  3. Обнови BUY_URL на финальную ссылку покупки
//  4. (опционально) Замени HELIUS_KEY на новый ключ
//  5. git add config.js && git push
// ═══════════════════════════════════════════════════════════════

const WITNESS_CONFIG = {

  // ── ТОКЕН ────────────────────────────────────────────────────
  CA:       '',          // Contract Address — вставь при выходе токена
  SYMBOL:   '$WITNESS',
  NAME:     'THE LAST HUMAN TOKEN',

  // ── ССЫЛКИ ───────────────────────────────────────────────────
  TWITTER:     'https://x.com/witnes_sol',
  TELEGRAM:    'https://t.me/witness_sol',
  DEXSCREENER: '',       // Заполни: https://dexscreener.com/solana/<CA>
  PUMPFUN:     '',       // Заполни: https://pump.fun/<CA>
  BUY_URL:     'https://pump.fun',   // Главная кнопка BUY ON PUMP.FUN

  // ── API ──────────────────────────────────────────────────────
  // ВНИМАНИЕ: ключ будет публичным на GitHub.
  // Перед деплоем создай новый ключ на helius.xyz
  // и поставь rate limit (например 100 req/min).
  HELIUS_KEY: 'cd4668a5-1f52-4f0f-a763-93786eeb83a8',

};
