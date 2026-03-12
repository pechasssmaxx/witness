// ═══════════════════════════════════════════════════════════════
//  $WITNESS — DEPLOY CONFIG
//  Edit this file before deploying to GitHub Pages
//
//  Steps when token launches:
//  1. Paste CA (contract address)
//  2. Paste DEXSCREENER and PUMPFUN links
//  3. Update BUY_URL to the final purchase link
//  4. (optional) Replace HELIUS_KEY with a new key
//  5. git add config.js && git push
// ═══════════════════════════════════════════════════════════════

const WITNESS_CONFIG = {

  // ── TOKEN ─────────────────────────────────────────────────────
  CA:       '',          // Contract Address — fill in when token launches
  SYMBOL:   '$WITNESS',
  NAME:     'THE LAST HUMAN TOKEN',

  // ── LINKS ─────────────────────────────────────────────────────
  TWITTER:     'https://x.com/witnes_sol',
  TELEGRAM:    'https://t.me/witness_sol',
  DEXSCREENER: '',       // Fill in: https://dexscreener.com/solana/<CA>
  PUMPFUN:     '',       // Fill in: https://pump.fun/<CA>
  BUY_URL:     'https://pump.fun',   // Main BUY ON PUMP.FUN button

  // ── API ───────────────────────────────────────────────────────
  // WARNING: this key will be public on GitHub.
  // Before deploying, create a new key at helius.xyz
  // and set a rate limit (e.g. 100 req/min).
  HELIUS_KEY: '52ea7eb7-7c40-4e66-9dea-dd30f05310db',

};
