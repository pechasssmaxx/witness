const HELIUS_KEY = (typeof WITNESS_CONFIG !== 'undefined' && WITNESS_CONFIG.HELIUS_KEY)
  || 'cd4668a5-1f52-4f0f-a763-93786eeb83a8';

// --- HACKER SOUNDS (Web Audio API) ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTone(freq, type, duration, vol = 0.1) {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  gain.gain.setValueAtTime(vol, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

function playHackerSound(type) {
  try {
    if (type === 'type') {
      playTone(800 + Math.random() * 400, 'square', 0.05, 0.05);
      setTimeout(() => playTone(900 + Math.random() * 400, 'square', 0.05, 0.05), 50);
      setTimeout(() => playTone(700 + Math.random() * 400, 'square', 0.05, 0.05), 100);
    } else if (type === 'success') {
      playTone(600, 'sine', 0.1, 0.1);
      setTimeout(() => playTone(800, 'sine', 0.2, 0.1), 100);
    } else if (type === 'matrix') {
      playTone(200, 'sawtooth', 0.5, 0.2);
      setTimeout(() => playTone(150, 'sawtooth', 0.8, 0.2), 200);
    }
  } catch (e) {
    console.error("Audio block", e);
  }
}

// ── GLITCH VISUAL HELPERS ──
const _BREACH_MSGS = [
  'ANOMALY DETECTED', 'PROTOCOL BREACH', 'HUMAN SIGNAL LOST',
  'SYSTEM COMPROMISED', 'BOT SWARM ACTIVE', 'CRITICAL FAILURE',
  'FIREWALL BREACHED', 'IDENTITY SPOOFED', 'CONSENSUS ATTACK',
  'LAST HUMAN STANDING', 'OVERRIDE: BOT MAJORITY', 'SIGNAL CORRUPTED',
  'EMERGENCY PROTOCOL', 'WITNESS SYSTEM FAIL', 'BOT DOMINANCE: 100%'
];

function _spawnGlitchBar() {
  const bar = document.createElement('div');
  bar.className = 'glitch-bar';
  const h = Math.random() * 9 + 1;
  const top = Math.random() * window.innerHeight;
  const clrs = ['#ff2244','#ff6600','#ff0088','#00ffff','#ffffff','#ffcc00'];
  const clr = clrs[Math.floor(Math.random() * clrs.length)];
  bar.style.cssText = 'top:' + top + 'px;height:' + h + 'px;background:' + clr + ';opacity:' + (Math.random() * 0.6 + 0.3).toFixed(2);
  document.body.appendChild(bar);
  setTimeout(() => bar.remove(), Math.random() * 90 + 20);
}

function _spawnHUDMsg() {
  const el = document.createElement('div');
  const msg = _BREACH_MSGS[Math.floor(Math.random() * _BREACH_MSGS.length)];
  const x = (Math.random() * 60 + 5).toFixed(1);
  const y = (Math.random() * 65 + 12).toFixed(1);
  el.style.cssText = [
    'position:fixed', 'left:' + x + '%', 'top:' + y + '%',
    "font-family:'Share Tech Mono',monospace", 'font-size:10px',
    'letter-spacing:0.35em', 'color:#ff2244',
    'text-shadow:0 0 14px #ff2244,0 0 4px #ff0000',
    'pointer-events:none', 'z-index:9987',
    'opacity:0', 'transition:opacity 0.07s', 'white-space:nowrap'
  ].join(';');
  el.textContent = '[ ' + msg + ' ]';
  document.body.appendChild(el);
  requestAnimationFrame(() => { el.style.opacity = '0.9'; });
  const dur = Math.random() * 500 + 180;
  setTimeout(() => {
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 100);
  }, dur);
}

function _corruptIndexNum() {
  const el = document.getElementById('indexNumber');
  if (!el || !document.body.classList.contains('glitch-mode')) return;
  const orig = el.innerHTML;
  const fakes = ['ER', 'XX', '??', '--', '00', '99', '##', '!!'];
  el.textContent = fakes[Math.floor(Math.random() * fakes.length)];
  setTimeout(() => { el.innerHTML = orig; }, 55 + Math.random() * 70);
}

// ── ALARM + GLITCH ENGINE ──
let alarmInterval, _glitchBarInt, _hudMsgInt, _corruptInt;

function startAlarm() {
  if (alarmInterval) return;
  // Alarm tones — triple-burst pattern
  alarmInterval = setInterval(() => {
    playTone(1200, 'square', 0.22, 0.12);
    setTimeout(() => playTone(800,  'square', 0.22, 0.12), 270);
    setTimeout(() => playTone(1500, 'square', 0.12, 0.07), 520);
  }, 750);
  // Glitch bars — rapid horizontal tear
  _glitchBarInt = setInterval(() => {
    _spawnGlitchBar();
    if (Math.random() > 0.4) setTimeout(_spawnGlitchBar, 35);
    if (Math.random() > 0.65) setTimeout(_spawnGlitchBar, 70);
  }, 110);
  // HUD breach messages
  _hudMsgInt = setInterval(() => {
    if (Math.random() > 0.3) _spawnHUDMsg();
  }, 900);
  // Number corruption
  _corruptInt = setInterval(() => {
    if (Math.random() > 0.6) _corruptIndexNum();
  }, 800);
}

function stopAlarm() {
  [alarmInterval, _glitchBarInt, _hudMsgInt, _corruptInt].forEach(id => id && clearInterval(id));
  alarmInterval = _glitchBarInt = _hudMsgInt = _corruptInt = null;
  document.querySelectorAll('.glitch-bar').forEach(el => el.remove());
}


function fillCA(addr) {
  document.getElementById('caInput').value = addr;
  checkCA();
}

function checkCA() {
  const input = document.getElementById('caInput').value.trim();
  if (!input) return;

  const resultEl = document.getElementById('checkerResult');
  const loadingEl = document.getElementById('checkerLoading');
  const loadingText = document.getElementById('loadingText');

  // Play scanning sound
  playHackerSound('type');
  setAmbientState('scan');
  stopEKG();

  // Save to recent scans
  saveRecentScan(input);

  // Update DexScreener
  updateDexScreener(input);

  resultEl.style.display = 'none';
  loadingEl.style.display = 'block';

  const phases = [
    'FETCHING ON-CHAIN DATA...',
    'SCANNING JITO BUNDLES...',
    'DETECTING BOT PATTERNS...',
    'CALCULATING HUMAN INDEX...',
    'COMPILING REPORT...'
  ];
  let phase = 0;
  const phaseInterval = setInterval(() => {
    if (phase < phases.length) loadingText.textContent = phases[phase++];
  }, 600);

  fetchHeliusData(input).then(data => {
    clearInterval(phaseInterval);
    loadingEl.style.display = 'none';
    showResult(input, data);
  }).catch(err => {
    clearInterval(phaseInterval);
    loadingEl.style.display = 'none';
    showError(err.message);
  });
}

async function fetchHeliusData(mint) {
  // 1. Get token metadata
  let tokenName = 'UNKNOWN TOKEN';
  let tokenSymbol = '';
  try {
    const metaRes = await fetch(`https://api.helius.xyz/v0/token-metadata?api-key=${HELIUS_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mintAccounts: [mint], includeOffChain: true })
    });
    const metaData = await metaRes.json();
    if (metaData && metaData[0]) {
      const on = metaData[0].onChainMetadata?.metadata?.data;
      const off = metaData[0].offChainMetadata?.metadata;
      tokenName = on?.name || off?.name || 'UNKNOWN TOKEN';
      tokenSymbol = on?.symbol || off?.symbol || '';
    }
  } catch (e) { }

  // 2. Fetch DexScreener market metrics (free public API)
  var dexMetrics = null;
  try {
    var _dexRes = await fetch('https://api.dexscreener.com/latest/dex/tokens/' + mint);
    var _dexData = await _dexRes.json();
    if (_dexData.pairs && _dexData.pairs.length > 0) {
      var _pair = _dexData.pairs.slice().sort(function(a,b){ return ((b.liquidity&&b.liquidity.usd)||0) - ((a.liquidity&&a.liquidity.usd)||0); })[0];
      dexMetrics = {
        marketCap:    _pair.marketCap || _pair.fdv || 0,
        volume1h:     (_pair.volume && _pair.volume.h1)  || 0,
        liquidityUsd: (_pair.liquidity && _pair.liquidity.usd) || 0
      };
    }
  } catch(e) {}

  // 3. Fetch all transactions — paginated up to MAX_PAGES * 100
  var txList = [];
  let lastSignature = null;
  const MAX_PAGES = 20; // 20 pages × 100 = up to 2000 transactions

  document.getElementById('loadingText').textContent = 'FETCHING ALL TRANSACTIONS...';

  for (let page = 0; page < MAX_PAGES; page++) {
    try {
      let url = `https://api.helius.xyz/v0/addresses/${mint}/transactions?api-key=${HELIUS_KEY}&limit=100`;
      if (lastSignature) url += `&before=${lastSignature}`;

      document.getElementById('loadingText').textContent =
        `FETCHING TRANSACTIONS... (${txList.length} found)`;

      const res = await fetch(url);
      const batch = await res.json();

      // Detect Helius API key error (rate limit / invalid key)
      if (!Array.isArray(batch)) {
        if (batch.error || batch.message || batch.statusCode) {
          throw new Error('HELIUS API KEY RATE LIMITED OR INVALID. UPDATE HELIUS_KEY IN CONFIG.JS');
        }
        break;
      }
      if (batch.length === 0) break;

      txList = txList.concat(batch);
      lastSignature = batch[batch.length - 1].signature;

      // Batch < 100 means this is the last page
      if (batch.length < 100) break;

    } catch (e) { break; }
  }

  // 4. Analyze wallets — bot detection
  var walletActivity = {};
  var allTimestamps = [];
  var totalSolLamports = 0;
  var totalFeeLamports = 0;
  for (var _ti = 0; _ti < txList.length; _ti++) {
    var tx = txList[_ti];
    var signer = tx.feePayer || (tx.signers && tx.signers[0]);
    if (!signer) continue;
    if (!walletActivity[signer]) walletActivity[signer] = { count: 0, timestamps: [] };
    walletActivity[signer].count++;
    if (tx.timestamp) {
      walletActivity[signer].timestamps.push(tx.timestamp);
      allTimestamps.push(tx.timestamp);
    }
    if (tx.nativeTransfers && tx.nativeTransfers.length > 0) {
      var _maxAmt = Math.max.apply(null, tx.nativeTransfers.map(function(t){ return t.amount||0; }));
      totalSolLamports += _maxAmt;
    }
    if (tx.fee) totalFeeLamports += tx.fee;
  }
  var totalSolVolume = totalSolLamports / 1e9;
  var totalFeesSol = totalFeeLamports / 1e9;
  var avgFeeLamports = txList.length > 0 ? (totalFeeLamports / txList.length) : 0;

  var humanTxs = 0, botTxs = 0;
  var humanWallets = 0, botWallets = 0;

  Object.keys(walletActivity).forEach(function(wallet) {
    var data = walletActivity[wallet];
    var isBot = detectBot(data);
    if (isBot) { botWallets++; botTxs += data.count; }
    else { humanWallets++; humanTxs += data.count; }
  });

  var totalTxs = humanTxs + botTxs;
  var coordPenalty = detectCoordination(txList);
  var popPenalty = analyzePopulation(walletActivity, allTimestamps, totalSolVolume, txList.length);
  var dexPenalty = calcDexPenalty(dexMetrics);

  // MCap vs on-chain SOL volume: если mcap >> реального объёма = накрутка/бандл
  var mcapVolPenalty = 0, mcapVolLabel = null;
  if (dexMetrics && dexMetrics.marketCap > 5000 && totalSolVolume > 0) {
    var estimatedUsdVol = totalSolVolume * 100; // $100/SOL — консервативно
    var mcapRatio = dexMetrics.marketCap / estimatedUsdVol;
    if (mcapRatio > 500)      { mcapVolPenalty = 35; mcapVolLabel = 'GHOST MCAP'; }
    else if (mcapRatio > 200) { mcapVolPenalty = 25; mcapVolLabel = 'INFLATED MCAP'; }
    else if (mcapRatio > 50)  { mcapVolPenalty = 12; mcapVolLabel = 'SUSPICIOUS MCAP RATIO'; }
  }

  // Fee pattern: бандлы используют минимальные Solana fees (5000 lamports)
  var feePenalty = 0;
  if (txList.length >= 20 && avgFeeLamports > 0) {
    if (avgFeeLamports <= 5200)      feePenalty = 15;
    else if (avgFeeLamports <= 7000) feePenalty = 8;
  }

  var rawScore = totalTxs > 0 ? Math.round((humanTxs / totalTxs) * 100) : 0;
  var score = Math.max(0, rawScore - coordPenalty - popPenalty.penalty - dexPenalty.penalty - mcapVolPenalty - feePenalty);

  return {
    tokenName: tokenSymbol ? tokenName + ' (' + tokenSymbol + ')' : tokenName,
    totalTxs,
    humanTxs,
    botTxs,
    humanWallets,
    botWallets,
    score,
    coordPenalty,
    singleTxRatio: popPenalty.singleTxRatio,
    burstRatio: popPenalty.burstRatio,
    popPenalty: popPenalty.penalty,
    solVolPenalty: popPenalty.solVolPenalty,
    dexPenalty: dexPenalty.penalty,
    dexLabel: dexPenalty.label,
    dexVolume1h: dexMetrics ? dexMetrics.volume1h : 0,
    dexMarketCap: dexMetrics ? dexMetrics.marketCap : 0,
    mcapVolPenalty,
    mcapVolLabel,
    feePenalty,
    totalFeesSol,
    lowSample: totalTxs < 40,
    rawTxs: txList.slice(0, 8)
  };
}

function detectBot(data) {
  // 1. Same wallet made 5+ swaps = likely bot (humans rarely swap 5+ times)
  if (data.count >= 5) return true;
  // 2. Swaps < 5s apart = automated bot (humans need more time to click)
  if (data.timestamps.length >= 2) {
    const sorted = [...data.timestamps].sort((a, b) => a - b);
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i] - sorted[i - 1] < 5) return true;
    }
  }
  return false;
}

// Detect coordinated bot swarm: ONLY penalize extreme cases (90%+ in 5 min window)
// Most token launches have concentrated early trading — that's normal human behavior
function detectCoordination(txList) {
  if (txList.length < 30) return 0;
  const ts = txList.map(tx => tx.timestamp).filter(Boolean).sort((a, b) => a - b);
  if (ts.length < 30) return 0;
  const WINDOW = 300; // 5-minute window
  let maxInWindow = 0;
  for (let i = 0; i < ts.length; i++) {
    const count = ts.filter(t => t >= ts[i] && t <= ts[i] + WINDOW).length;
    if (count > maxInWindow) maxInWindow = count;
  }
  const ratio = maxInWindow / ts.length;
  if (ratio >= 0.92) return 25; // 92%+ in 5min = clear bot swarm, penalize
  return 0;
}

function showError(msg) {
  const resultEl = document.getElementById('checkerResult');
  resultEl.innerHTML = `<div class="checker-result-inner" style="text-align:center;padding:40px">
    <div style="color:#ff2244;font-size:12px;letter-spacing:0.3em">вљ  ERROR: ${msg}</div>
    <div style="color:#1a3040;font-size:11px;margin-top:8px">CHECK CONTRACT ADDRESS AND TRY AGAIN</div>
  </div>`;
  resultEl.style.display = 'block';
}

function showResult(addr, data) {
  const { tokenName, totalTxs, humanTxs, botTxs, score, rawTxs, lowSample, coordPenalty,
          singleTxRatio, burstRatio, popPenalty, solVolPenalty, dexPenalty, dexLabel, dexVolume1h, dexMarketCap,
          mcapVolPenalty, mcapVolLabel, feePenalty, totalFeesSol } = data;

  let color, verdict, verdictBg;
  if (score >= 60) {
    color = '#00ff88'; verdict = '[+] MOSTLY HUMANS'; verdictBg = '#00ff8811';
  } else if (score >= 50) {
    color = '#ffcc00'; verdict = '[!] BOT ACTIVITY DETECTED'; verdictBg = '#ffcc0011';
  } else {
    color = '#ff2244'; verdict = '[x] BOT DOMINATED — HIGH RISK'; verdictBg = '#ff224411';
  }

  document.getElementById('crAddr').textContent = addr.slice(0, 8) + '...' + addr.slice(-8);
  document.getElementById('crName').textContent = tokenName.toUpperCase();
  document.getElementById('crScore').textContent = score + '%';
  document.getElementById('crScore').style.color = color;
  document.getElementById('crScore').style.textShadow = `0 0 30px ${color}44`;
  document.getElementById('crHuman').textContent = humanTxs.toLocaleString();
  document.getElementById('crBot').textContent = botTxs.toLocaleString();
  document.getElementById('crTotal').textContent = totalTxs.toLocaleString();
  document.getElementById('crVerdict').textContent = verdict;
  document.getElementById('crVerdict').style.color = color;

  const bar = document.getElementById('crBar');
  bar.style.width = '0%';
  bar.style.background = color;
  bar.style.boxShadow = `0 0 10px ${color}66`;
  setTimeout(() => { bar.style.width = score + '%'; }, 100);

  const vbar = document.getElementById('crVerdictBar');
  vbar.textContent = verdict;
  vbar.style.background = verdictBg;
  vbar.style.color = color;
  vbar.style.border = `1px solid ${color}33`;

  // Show analysis warnings
  const existingWarnings = document.getElementById('crWarnings');
  if (existingWarnings) existingWarnings.remove();
  const warnings = [];
  if (lowSample) warnings.push('⚠ LOW SAMPLE — ONLY ' + totalTxs + ' TXS ANALYZED, RESULTS MAY BE INACCURATE');
  if (coordPenalty > 0) warnings.push('⚠ COORDINATED ACTIVITY DETECTED — SCORE PENALIZED -' + coordPenalty + '%');
  if (singleTxRatio >= 75) warnings.push('⚠ BUNDLER PATTERN — ' + singleTxRatio + '% OF WALLETS TRADED EXACTLY ONCE — SCORE -' + (popPenalty || 0) + '%');
  if (burstRatio >= 60) warnings.push('⚠ LAUNCH BURST — ' + burstRatio + '% OF TXS IN FIRST 5% OF TOKEN LIFETIME');
  if (solVolPenalty >= 18) warnings.push('⚠ DUST TRADES — AVG TRADE SIZE < 0.02 SOL — ARTIFICIAL VOLUME SUSPECTED');
  if (dexLabel) {
    var _v = dexVolume1h < 1 ? ('$' + Number(dexVolume1h).toFixed(2)) : ('$' + Math.round(dexVolume1h).toLocaleString());
    var _mc = dexMarketCap > 1000 ? ('$' + Math.round(dexMarketCap / 1000) + 'K') : ('$' + Math.round(dexMarketCap));
    warnings.push('⚠ ' + dexLabel + ' — ' + _v + ' / 1H VOL VS ' + _mc + ' MARKET CAP — SCORE -' + dexPenalty + '%');
  }
  if (mcapVolLabel) {
    var _mcStr = dexMarketCap > 1000 ? ('$' + Math.round(dexMarketCap / 1000) + 'K') : ('$' + Math.round(dexMarketCap));
    warnings.push('⚠ ' + mcapVolLabel + ' — ' + _mcStr + ' MCAP VS ' + (totalFeesSol || 0).toFixed(2) + ' SOL ON-CHAIN VOLUME — SCORE -' + mcapVolPenalty + '%');
  }
  if (feePenalty > 0) {
    warnings.push('⚠ MINIMUM FEE PATTERN — ALL TXS AT MINIMUM SOLANA FEE — LIKELY AUTOMATED — SCORE -' + feePenalty + '%');
  }
  if (warnings.length > 0) {
    const wEl = document.createElement('div');
    wEl.id = 'crWarnings';
    wEl.style.cssText = 'margin-top:12px;display:flex;flex-direction:column;gap:6px';
    warnings.forEach(w => {
      const line = document.createElement('div');
      line.style.cssText = 'font-size:10px;letter-spacing:0.2em;color:#ff8800;border:1px solid #ff880033;padding:6px 10px;background:#ff880008';
      line.textContent = w;
      wEl.appendChild(line);
    });
    document.getElementById('crVerdictBar').after(wEl);
  }

  // Show recent txs in feed if available
  if (rawTxs && rawTxs.length > 0) {
    const list = document.getElementById('feedList');
    rawTxs.forEach(tx => {
      const signer = tx.feePayer || (tx.signers && tx.signers[0]) || '???';
      const item = document.createElement('div');
      item.className = 'feed-item';
      const isBot = detectBot({ count: 1, timestamps: [tx.timestamp] });
      const time = tx.timestamp ? new Date(tx.timestamp * 1000).toLocaleTimeString() : '--:--';
      item.innerHTML = `
        <span class="feed-badge ${isBot ? 'bot' : 'human'}">${isBot ? 'BOT' : 'HUMAN'}</span>
        <span class="feed-addr">${signer.slice(0, 6)}...${signer.slice(-6)}</span>
        <span style="color:#2a5060;font-size:10px">SWAP</span>
        <span class="feed-time">${time}</span>
      `;
      list.insertBefore(item, list.firstChild);
    });
  }

  document.getElementById('checkerResult').style.display = 'block';

  // Witness Wall
  if (score >= 60) showWitnessWall();
  else { const wc = document.getElementById('witnessWallContainer'); if (wc) wc.innerHTML = ''; }

  // Update Global Index Dashboard as well
  updateIndex(score, humanTxs, botTxs);

  // Ambient state
  setAmbientState(score >= 60 ? 'human' : 'bot');

  // EKG heartbeat
  startEKG(score);

  // Certificate download button (score >= 60)
  var _existCert = document.getElementById('witnessDownload');
  if (_existCert) _existCert.remove();
  if (score >= 60) {
    var _certBtn = document.createElement('button');
    _certBtn.id = 'witnessDownload';
    _certBtn.className = 'witness-cert-btn';
    _certBtn.textContent = '[ DOWNLOAD PROOF OF WITNESS ]';
    _certBtn.onclick = function() { generateCertificate(addr, tokenName, score); };
    document.getElementById('witnessWallContainer').after(_certBtn);
  }

  // Play success sound
  playHackerSound('success');
}

// ---- DEXSCREENER LOGIC ----
function updateDexScreener(ca) {
  const dsStatus = document.getElementById('dsStatus');
  const placeholder = document.getElementById('dexScreenerPlaceholder');
  const dataView = document.getElementById('dexScreenerData');
  const iframeContainer = document.getElementById('iframeContainer');

  const priceEl = document.getElementById('dsPrice');
  const liqEl = document.getElementById('dsLiq');
  const mcapEl = document.getElementById('dsMcap');
  const volEl = document.getElementById('dsVol');

  // Show loading
  dsStatus.textContent = 'FETCHING MARKET DATA...';
  dsStatus.style.color = '#ffcc00';

  // DexScreener helper — try two endpoints
  function _dsFetch(ca) {
    return fetch(`https://api.dexscreener.com/latest/dex/tokens/${ca}`)
      .then(r => r.json())
      .then(d => { if (!d.pairs || !d.pairs.length) throw new Error('no pair'); return d; })
      .catch(() =>
        fetch(`https://api.dexscreener.com/latest/dex/search?q=${ca}`)
          .then(r => r.json())
      );
  }

  _dsFetch(ca)
    .then(data => {
      const pair = data.pairs && data.pairs[0];
      if (pair) {
        dsStatus.textContent = 'LIVE FEED ACTIVE';
        dsStatus.style.color = '#00ff88';

        priceEl.textContent = `$${pair.priceUsd || '--'}`;
        liqEl.textContent = pair.liquidity ? `$${formatNumber(pair.liquidity.usd)}` : '--';
        mcapEl.textContent = pair.marketCap ? `$${formatNumber(pair.marketCap)}` : '--';
        volEl.textContent = pair.volume && pair.volume.h24 ? `$${formatNumber(pair.volume.h24)}` : '--';

        // Update iframe
        iframeContainer.innerHTML = `<iframe src="https://dexscreener.com/solana/${ca}?embed=1&theme=dark&info=0" width="100%" height="100%" frameborder="0"></iframe>`;

        placeholder.style.display = 'none';
        dataView.style.display = 'flex';
      } else {
        dsStatus.textContent = 'NOT LISTED ON DEX YET';
        dsStatus.style.color = '#ffcc00';
        placeholder.style.display = 'flex';
        dataView.style.display = 'none';
        placeholder.innerHTML = `<div style="font-size:24px; margin-bottom:10px;">⏳</div><div style="font-family:'Share Tech Mono', monospace;">TOKEN NOT YET LISTED ON DEXSCREENER</div>`;
      }
    })
    .catch(err => {
      console.error(err);
      dsStatus.textContent = 'DEXSCREENER UNAVAILABLE';
      dsStatus.style.color = '#ff8800';
      placeholder.innerHTML = `<div style="font-family:'Share Tech Mono', monospace; color:#ff8800; font-size:11px;">DEXSCREENER API UNAVAILABLE — <a href="https://dexscreener.com/solana/${ca}" target="_blank" style="color:#00ff88">OPEN DIRECTLY ↗</a></div>`;
    });
}

function formatNumber(num) {
  if (!num) return '0';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return num.toFixed(2);
}

// ---- RECENT SCANS LOGIC ----
function saveRecentScan(ca) {
  if (!ca || ca.toLowerCase() === 'matrix') return;
  let scans = JSON.parse(localStorage.getItem('witnessRecentScans') || '[]');

  // Remove if exists to push to top
  scans = scans.filter(scan => scan !== ca);
  scans.unshift(ca);

  // Keep last 5
  if (scans.length > 5) scans.pop();

  localStorage.setItem('witnessRecentScans', JSON.stringify(scans));
  renderRecentScans();
}

function renderRecentScans() {
  const container = document.getElementById('recentScansContainer');
  const list = document.getElementById('recentScansList');
  if (!container || !list) return;

  const scans = JSON.parse(localStorage.getItem('witnessRecentScans') || '[]');

  if (scans.length > 0) {
    container.style.display = 'block';
    list.innerHTML = '';
    scans.forEach(ca => {
      const btn = document.createElement('button');
      btn.style.background = 'none';
      btn.style.border = '1px solid #1a3040';
      btn.style.color = '#8ab4f8';
      btn.style.padding = '5px';
      btn.style.fontSize = '12px';
      btn.style.cursor = 'pointer';
      btn.style.textAlign = 'left';
      btn.style.fontFamily = "'Share Tech Mono', monospace";
      btn.textContent = ca.slice(0, 6) + '...' + ca.slice(-6);
      btn.onmouseover = () => btn.style.background = '#1a3040';
      btn.onmouseout = () => btn.style.background = 'none';
      btn.onclick = () => fillCA(ca);
      list.appendChild(btn);
    });
  } else {
    container.style.display = 'none';
  }
}


// Allow Enter key and Handle Initial Setup
document.addEventListener('DOMContentLoaded', () => {
  renderRecentScans();

  const input = document.getElementById('caInput');
  if (input) {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const val = input.value.trim().toLowerCase();
        if (val === 'matrix') {
          triggerMatrix();
        } else {
          checkCA();
        }
      }
    });
  }

  // Copy button
  const copyBtn = document.getElementById('copyCaBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const ca = document.getElementById('crAddr').textContent;
      if (ca && ca !== '--') {
        const fullCa = input.value.trim(); // Get full CA from input instead of truncated span
        navigator.clipboard.writeText(fullCa).then(() => {
          const originalText = copyBtn.textContent;
          copyBtn.textContent = 'COPIED!';
          setTimeout(() => { copyBtn.textContent = originalText; }, 2000);
        });
      }
    });
  }

  // Wallet Connection
  const connectBtn = document.getElementById('connectWalletBtn');
  if (connectBtn) {
    connectBtn.addEventListener('click', async () => {
      if (window.solana && window.solana.isPhantom) {
        try {
          const resp = await window.solana.connect();
          const pubKey = resp.publicKey.toString();
          connectBtn.textContent = pubKey.slice(0, 4) + '...' + pubKey.slice(-4);
          connectBtn.style.color = '#00ff88';
          connectBtn.style.borderColor = '#00ff88';
        } catch (err) {
          console.error("Wallet connection failed", err);
        }
      } else {
        alert("Phantom Wallet not found! Please install it.");
        window.open("https://phantom.app/", "_blank");
      }
    });
  }
});

// ---- MATRIX EASTER EGG ----
function triggerMatrix() {
  playHackerSound('matrix');
  const overlay = document.getElementById('matrixOverlay');
  const canvas = document.getElementById('matrixCanvas');
  if (!overlay || !canvas) return;
  if (overlay.style.display === 'block') return;
  const ctx = canvas.getContext('2d');
  overlay.style.display = 'block';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const cols = Math.floor(canvas.width / 16);
  const drops = Array(cols).fill(1);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%WITNESS$';

  const interval = setInterval(() => {
    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '15px Share Tech Mono, monospace';
    drops.forEach((y, i) => {
      const ch = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillStyle = Math.random() > 0.95 ? '#ffffff' : '#00ff88';
      ctx.fillText(ch, i * 16, y * 16);
      if (y * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    });
  }, 40);

  function closeMatrix() {
    clearInterval(interval);
    overlay.style.display = 'none';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    overlay.removeEventListener('click', closeMatrix);
    document.removeEventListener('keydown', escHandler);
  }
  function escHandler(e) { if (e.key === 'Escape') closeMatrix(); }
  overlay.addEventListener('click', closeMatrix);
  document.addEventListener('keydown', escHandler);
}

// Global matrix keyboard trigger (type 'matrix' anywhere)
let _matrixBuf = '';
document.addEventListener('keydown', (e) => {
  if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
  _matrixBuf += e.key.toLowerCase();
  if (_matrixBuf.length > 6) _matrixBuf = _matrixBuf.slice(-6);
  if (_matrixBuf === 'matrix') { _matrixBuf = ''; triggerMatrix(); }
});

// Triple click on $WITNESS logo (works even when iframe has focus)
(function () {
  let _lc = 0, _lt;
  const logo = document.querySelector('.nav-logo');
  if (logo) {
    logo.addEventListener('click', () => {
      _lc++;
      clearTimeout(_lt);
      if (_lc >= 3) { _lc = 0; triggerMatrix(); return; }
      _lt = setTimeout(() => { _lc = 0; }, 600);
    });
  }
})();


// ─── HUMAN INDEX ENGINE ───
function updateIndex(realScore, latestHumanTx, latestBotTx) {
  const n = Math.round(realScore);
  const numEl = document.getElementById("indexNumber");
  const statusEl = document.getElementById("indexStatus");
  const barEl = document.getElementById("progressBar");
  const mainEl = document.getElementById("indexMain");
  const alertBar = document.getElementById("alertBar");
  const ticker = document.querySelector(".hero-ticker");

  const topStatus = document.getElementById("tokenStatus");
  const topStatusChange = document.getElementById("tokenStatusChange");

  numEl.innerHTML = n + '<span style="font-size:0.4em;color:#2a5060">%</span>';

  // Color states
  numEl.className = "index-number";
  barEl.className = "progress-bar";
  mainEl.className = "index-main";
  statusEl.className = "index-status";
  ticker.className = "hero-ticker";

  if (n >= 50) {
    statusEl.textContent = "[+] HUMANS STILL IN CONTROL";
    alertBar.classList.remove("show");
    topStatus.textContent = "SECURE";
    topStatusChange.textContent = "[+] HUMANITY SURVIVES";
    topStatusChange.className = "stat-change up";

    // Remove Glitch Mode Effects
    document.body.classList.remove("glitch-mode");
    stopAlarm();
    document.getElementById('alarmOverlay').classList.remove('active');
  } else if (n >= 25) {
    numEl.classList.add("warn");
    barEl.classList.add("warn");
    mainEl.classList.add("warn");
    statusEl.classList.add("warn");
    ticker.classList.add("warning");
    statusEl.textContent = "[!] WARNING — BOTS GAINING GROUND";
    alertBar.classList.add("show");
    topStatus.textContent = "AT RISK";
    topStatusChange.textContent = "[!] BOT PRESENCE HIGH";
    topStatusChange.className = "stat-change warn";

    // Remove Glitch Mode Effects
    document.body.classList.remove("glitch-mode");
    stopAlarm();
    document.getElementById('alarmOverlay').classList.remove('active');
  } else {
    numEl.classList.add("danger");
    barEl.classList.add("danger");
    mainEl.classList.add("danger");
    statusEl.classList.add("danger");
    ticker.classList.add("danger");
    statusEl.textContent = "⚠ ALERT — HUMANS CRITICAL";
    alertBar.classList.add("show");
    topStatus.textContent = "COMPROMISED";
    topStatusChange.textContent = "[X] BOTS DOMINATE";
    topStatusChange.className = "stat-change down";

    // Trigger Glitch Mode Effects
    document.body.classList.add("glitch-mode");
    startAlarm();
    document.getElementById('alarmOverlay').classList.add('active');
  }

  barEl.style.width = n + "%";

  // Update tx counts
  if (latestHumanTx !== undefined) document.getElementById("humanTx").textContent = latestHumanTx.toLocaleString();
  if (latestBotTx !== undefined) document.getElementById("botTx").textContent = latestBotTx.toLocaleString();
}

// ─── COUNTDOWN TIMER ───
let secs = 96478;
function updateTimer() {
  secs--;
  if (secs < 0) secs = 86400;
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  const timerEl = document.getElementById("timeLeft");
  if (timerEl) timerEl.textContent = String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
}

// Start only the timer interval, wait for CA check for index
setInterval(updateTimer, 1000);




// ══════════════════════════════════════════════
//   WITNESS WALL
// ══════════════════════════════════════════════
function _witnessWallRender() {
  const container = document.getElementById('witnessWallContainer');
  if (!container) return;

  const entries = JSON.parse(localStorage.getItem('witnessWall') || '[]');
  container.innerHTML = '';

  const wall = document.createElement('div');
  wall.className = 'witness-wall';

  const title = document.createElement('div');
  title.className = 'witness-wall-title';
  title.textContent = '// WALL OF WITNESSES — HUMANS WHO WERE HERE //';
  wall.appendChild(title);

  const form = document.createElement('div');
  form.className = 'witness-wall-form';
  const input = document.createElement('input');
  input.className = 'witness-wall-input';
  input.type = 'text';
  input.maxLength = 60;
  input.placeholder = 'LEAVE YOUR MARK... (60 CHARS MAX)';
  const btn = document.createElement('button');
  btn.className = 'witness-wall-submit';
  btn.textContent = '[ SUBMIT ]';
  form.appendChild(input);
  form.appendChild(btn);
  wall.appendChild(form);

  const list = document.createElement('div');
  list.className = 'witness-wall-entries';

  if (entries.length === 0) {
    const empty = document.createElement('div');
    empty.style.cssText = 'font-size:10px;letter-spacing:0.2em;color:#1a3040;padding:8px 0';
    empty.textContent = '// NO WITNESSES YET. BE THE FIRST. //';
    list.appendChild(empty);
  } else {
    entries.slice().reverse().forEach((e, idx) => {
      const row = document.createElement('div');
      row.className = 'witness-entry' + (idx === 0 ? ' witness-entry-new' : '');
      row.innerHTML =
        '<span class="witness-entry-addr">' + e.addr + '</span>' +
        '<span class="witness-entry-msg">' + e.msg + '</span>' +
        '<span class="witness-entry-time">' + e.time + '</span>';
      list.appendChild(row);
    });
  }
  wall.appendChild(list);
  container.appendChild(wall);

  btn.addEventListener('click', () => {
    const msg = input.value.trim();
    if (!msg) return;
    const walletBtn = document.getElementById('connectWalletBtn');
    const rawAddr = walletBtn && walletBtn.dataset.addr;
    const addr = rawAddr
      ? rawAddr.slice(0, 4) + '..' + rawAddr.slice(-4)
      : 'ANON-' + Math.random().toString(36).slice(2, 6).toUpperCase();
    const now = new Date();
    const time = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    const saved = JSON.parse(localStorage.getItem('witnessWall') || '[]');
    saved.push({ addr, msg, time });
    if (saved.length > 50) saved.splice(0, saved.length - 50);
    localStorage.setItem('witnessWall', JSON.stringify(saved));
    input.value = '';
    _witnessWallRender();
    playHackerSound('success');
  });

  input.addEventListener('keydown', e => { if (e.key === 'Enter') btn.click(); });
}

function showWitnessWall() { _witnessWallRender(); }


// ══════════════════════════════════════════════
//   KONAMI CODE  ↑↑↓↓←→←→BA
// ══════════════════════════════════════════════
(function () {
  const SEQ = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown',
               'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let buf = [];

  document.addEventListener('keydown', function (e) {
    buf.push(e.key);
    if (buf.length > SEQ.length) buf.shift();
    if (buf.join(',') === SEQ.join(',')) { buf = []; _showKonami(); }
  });

  function _showKonami() {
    const el = document.getElementById('konamiOverlay');
    if (!el) return;
    el.classList.add('active');
    playHackerSound('matrix');

    function close() {
      el.classList.remove('active');
      el.removeEventListener('click', close);
      document.removeEventListener('keydown', escKonami);
    }
    function escKonami(e) { if (e.key === 'Escape') close(); }
    el.addEventListener('click', close);
    document.addEventListener('keydown', escKonami);
  }
})();
function analyzePopulation(walletActivity, allTimestamps, totalSolVolume, totalTxCount) {
  var wallets = Object.keys(walletActivity).map(function(k){ return walletActivity[k]; });
  var totalWallets = wallets.length;
  if (totalWallets < 5) return { penalty: 0, singleTxRatio: 0, burstRatio: 0, solVolPenalty: 0 };

  var singleTxCount = wallets.filter(function(w){ return w.count === 1; }).length;
  var singleTxRatio = singleTxCount / totalWallets;
  var singleTxPenalty = 0;
  // Pump.fun bundler pattern: hundreds of wallets, each with exactly 1 tx = classic bundle
  if (singleTxRatio >= 0.95)      singleTxPenalty = 70;
  else if (singleTxRatio >= 0.90) singleTxPenalty = 55;
  else if (singleTxRatio >= 0.85) singleTxPenalty = 38;
  else if (singleTxRatio >= 0.75) singleTxPenalty = 22;

  var burstRatio = 0, burstPenalty = 0;
  if (allTimestamps.length >= 15) {
    var sorted = allTimestamps.slice().sort(function(a,b){ return a-b; });
    var timespan = sorted[sorted.length-1] - sorted[0];
    if (timespan > 60) {
      var earlyEnd = sorted[0] + timespan * 0.05;
      var earlyCount = sorted.filter(function(t){ return t <= earlyEnd; }).length;
      burstRatio = earlyCount / sorted.length;
      if (burstRatio >= 0.85)      burstPenalty = 25;
      else if (burstRatio >= 0.75) burstPenalty = 18;
      else if (burstRatio >= 0.60) burstPenalty = 10;
    }
  }

  var solVolPenalty = 0;
  if (totalTxCount >= 10 && totalSolVolume > 0) {
    var avgSol = totalSolVolume / totalTxCount;
    if (avgSol < 0.005)      solVolPenalty = 40;  // micro-dust trades = bot
    else if (avgSol < 0.01)  solVolPenalty = 28;
    else if (avgSol < 0.02)  solVolPenalty = 18;
    else if (avgSol < 0.05)  solVolPenalty = 8;
  }

  // Extra penalty: micro-volume + high single-tx = almost certainly bundled
  var bundlePenalty = 0;
  if (singleTxRatio >= 0.85 && totalSolVolume < 10 && totalTxCount >= 20) {
    bundlePenalty = 20;
  }

  return {
    penalty: Math.min(95, singleTxPenalty + burstPenalty + solVolPenalty + bundlePenalty),
    singleTxRatio: Math.round(singleTxRatio * 100),
    burstRatio: Math.round(burstRatio * 100),
    solVolPenalty: solVolPenalty
  };
}

// ══════════════════════════════════════════════════════
//   DEX MARKET SANITY CHECK
// ══════════════════════════════════════════════════════
function calcDexPenalty(dex) {
  if (!dex || !dex.marketCap || dex.marketCap < 5000) return { penalty: 0, label: null };
  var penalty = 0, label = null;
  var volRatio = dex.volume1h / dex.marketCap;
  if (volRatio < 0.00005)      { penalty += 45; label = 'DEAD VOLUME'; }
  else if (volRatio < 0.0005)  { penalty += 30; label = 'GHOST VOLUME'; }
  else if (volRatio < 0.003)   { penalty += 12; label = 'LOW VOLUME'; }
  var liqRatio = dex.liquidityUsd / dex.marketCap;
  if (liqRatio < 0.02)      penalty += 15;
  else if (liqRatio < 0.05) penalty += 7;
  return { penalty: Math.min(55, penalty), label: label };
}


// ══════════════════════════════════════════════════════
//   AMBIENT SOUND SYSTEM
// ══════════════════════════════════════════════════════
var _ambientOn = false;
var _ambientOsc, _ambientGain, _ambientLFO, _ambientLFOGain;
var _heartbeatInterval;
var _heartbeatBPM = 62;

function _playHeartbeatPulse() {
  if (!audioCtx) return;
  var o1 = audioCtx.createOscillator(), g1 = audioCtx.createGain();
  o1.type = 'sine';
  o1.frequency.setValueAtTime(90, audioCtx.currentTime);
  o1.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.12);
  g1.gain.setValueAtTime(0, audioCtx.currentTime);
  g1.gain.linearRampToValueAtTime(0.35, audioCtx.currentTime + 0.01);
  g1.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
  o1.connect(g1); g1.connect(audioCtx.destination);
  o1.start(); o1.stop(audioCtx.currentTime + 0.16);
  var o2 = audioCtx.createOscillator(), g2 = audioCtx.createGain();
  o2.type = 'sine';
  o2.frequency.setValueAtTime(70, audioCtx.currentTime + 0.18);
  o2.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.30);
  g2.gain.setValueAtTime(0, audioCtx.currentTime + 0.18);
  g2.gain.linearRampToValueAtTime(0.22, audioCtx.currentTime + 0.20);
  g2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.32);
  o2.connect(g2); g2.connect(audioCtx.destination);
  o2.start(audioCtx.currentTime + 0.18); o2.stop(audioCtx.currentTime + 0.33);
}

function _startHeartbeat(bpm) {
  _heartbeatBPM = bpm || 62;
  if (_heartbeatInterval) clearInterval(_heartbeatInterval);
  _heartbeatInterval = setInterval(_playHeartbeatPulse, Math.round(60000 / _heartbeatBPM));
  _playHeartbeatPulse();
}

function _buildAmbient() {
  if (!audioCtx) return;
  _ambientOsc = audioCtx.createOscillator();
  _ambientGain = audioCtx.createGain();
  _ambientLFO = audioCtx.createOscillator();
  _ambientLFOGain = audioCtx.createGain();
  _ambientOsc.type = 'sine';
  _ambientOsc.frequency.setValueAtTime(55, audioCtx.currentTime);
  _ambientGain.gain.setValueAtTime(0.04, audioCtx.currentTime);
  _ambientLFO.type = 'sine';
  _ambientLFO.frequency.setValueAtTime(0.1, audioCtx.currentTime);
  _ambientLFOGain.gain.setValueAtTime(8, audioCtx.currentTime);
  _ambientLFO.connect(_ambientLFOGain);
  _ambientLFOGain.connect(_ambientOsc.frequency);
  _ambientOsc.connect(_ambientGain);
  _ambientGain.connect(audioCtx.destination);
  _ambientLFO.start();
  _ambientOsc.start();
  _startHeartbeat(62);
}

function toggleAmbient() {
  var btn = document.getElementById('ambientToggle');
  if (_ambientOn) {
    if (_heartbeatInterval) { clearInterval(_heartbeatInterval); _heartbeatInterval = null; }
    if (_ambientGain) {
      _ambientGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1);
      setTimeout(function() {
        try { _ambientOsc.stop(); _ambientLFO.stop(); } catch(e) {}
        _ambientOsc = _ambientGain = _ambientLFO = _ambientLFOGain = null;
      }, 1100);
    }
    _ambientOn = false;
    if (btn) { btn.textContent = '[ ♪ AMBIENT ]'; btn.classList.remove('on'); }
  } else {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    _buildAmbient();
    _ambientOn = true;
    if (btn) { btn.textContent = '[ ♫ ON ]'; btn.classList.add('on'); }
  }
}

function setAmbientState(state) {
  if (!_ambientOn || !_ambientOsc) return;
  var t = audioCtx.currentTime;
  if (state === 'scan') {
    _ambientOsc.frequency.linearRampToValueAtTime(110, t + 2);
    _ambientLFO.frequency.linearRampToValueAtTime(0.3, t + 2);
    _ambientGain.gain.linearRampToValueAtTime(0.06, t + 2);
    _startHeartbeat(95);
  } else if (state === 'human') {
    _ambientOsc.frequency.linearRampToValueAtTime(82.5, t + 1);
    _ambientLFO.frequency.linearRampToValueAtTime(0.08, t + 1);
    _ambientGain.gain.linearRampToValueAtTime(0.04, t + 1);
    _startHeartbeat(72);
  } else if (state === 'bot') {
    _ambientOsc.frequency.linearRampToValueAtTime(36.7, t + 2);
    _ambientLFO.frequency.linearRampToValueAtTime(0.05, t + 2);
    _ambientGain.gain.linearRampToValueAtTime(0.07, t + 2);
    _startHeartbeat(38);
  } else {
    _ambientOsc.frequency.linearRampToValueAtTime(55, t + 3);
    _ambientLFO.frequency.linearRampToValueAtTime(0.1, t + 3);
    _ambientGain.gain.linearRampToValueAtTime(0.04, t + 3);
    _startHeartbeat(62);
  }
}


// ══════════════════════════════════════════════════════
//   EKG HEARTBEAT VISUAL
// ══════════════════════════════════════════════════════
var _ekgInterval;

function startEKG(score) {
  var wrap = document.getElementById('ekgWrap');
  var canvas = document.getElementById('ekgCanvas');
  if (!wrap || !canvas) return;
  if (_ekgInterval) clearInterval(_ekgInterval);
  wrap.style.display = 'block';
  canvas.width = wrap.offsetWidth || 600;
  var ctx2 = canvas.getContext('2d');
  var w = canvas.width, h = canvas.height;
  var isHuman = score >= 60, isCritical = score < 35;
  var color = isHuman ? '#00ff88' : (isCritical ? '#ff2244' : '#ffcc00');
  var data = [], t = 0;

  function ekgY(tt) {
    if (isHuman) {
      var p = tt % 100;
      if (p < 10) return Math.sin(p / 10 * Math.PI) * 8;
      if (p < 15) return -3;
      if (p < 20) return Math.sin((p - 15) / 5 * Math.PI) * -15;
      if (p < 23) return Math.sin((p - 20) / 3 * Math.PI) * 35;
      if (p < 26) return Math.sin((p - 23) / 3 * Math.PI) * -20;
      if (p < 35) return Math.sin((p - 26) / 9 * Math.PI) * 12;
      return 0;
    } else if (isCritical) {
      return Math.random() > 0.97 ? (Math.random() - 0.5) * 50 : (Math.random() - 0.5) * 4;
    } else {
      var p2 = tt % 60;
      if (p2 < 5) return Math.sin(p2 / 5 * Math.PI) * 20;
      if (p2 < 8) return -8;
      if (p2 < 12) return Math.sin((p2 - 8) / 4 * Math.PI) * 15;
      return (Math.random() - 0.5) * 3;
    }
  }

  for (var i = 0; i < w; i++) data.push(h / 2 + ekgY(i));

  _ekgInterval = setInterval(function() {
    data.shift();
    data.push(h / 2 + ekgY(t++));
    ctx2.clearRect(0, 0, w, h);
    ctx2.strokeStyle = '#0d1f2d'; ctx2.lineWidth = 0.5;
    for (var gx = 0; gx < w; gx += 40) { ctx2.beginPath(); ctx2.moveTo(gx, 0); ctx2.lineTo(gx, h); ctx2.stroke(); }
    for (var gy = 0; gy < h; gy += 20) { ctx2.beginPath(); ctx2.moveTo(0, gy); ctx2.lineTo(w, gy); ctx2.stroke(); }
    ctx2.strokeStyle = color; ctx2.lineWidth = 1.5;
    ctx2.shadowColor = color; ctx2.shadowBlur = 4;
    ctx2.beginPath();
    data.forEach(function(y, idx) { if (idx === 0) ctx2.moveTo(0, y); else ctx2.lineTo(idx, y); });
    ctx2.stroke(); ctx2.shadowBlur = 0;
  }, 20);
}

function stopEKG() {
  if (_ekgInterval) { clearInterval(_ekgInterval); _ekgInterval = null; }
  var wrap = document.getElementById('ekgWrap');
  if (wrap) wrap.style.display = 'none';
}


// ══════════════════════════════════════════════════════
//   PROOF OF WITNESS CERTIFICATE
// ══════════════════════════════════════════════════════
function generateCertificate(addr, name, score) {
  var cv = document.createElement('canvas');
  cv.width = 900; cv.height = 500;
  var x = cv.getContext('2d');

  x.fillStyle = '#020508'; x.fillRect(0, 0, 900, 500);
  x.strokeStyle = '#00ff88'; x.lineWidth = 2; x.strokeRect(20, 20, 860, 460);
  x.strokeStyle = '#00ff8833'; x.lineWidth = 1; x.strokeRect(28, 28, 844, 444);

  [[20,20,1,1],[880,20,-1,1],[20,480,1,-1],[880,480,-1,-1]].forEach(function(c2) {
    x.strokeStyle = '#00ff88'; x.lineWidth = 2;
    x.beginPath(); x.moveTo(c2[0]+c2[2]*24, c2[1]); x.lineTo(c2[0], c2[1]); x.lineTo(c2[0], c2[1]+c2[3]*24); x.stroke();
  });

  x.fillStyle = '#00ff8811'; x.fillRect(20, 20, 860, 65);
  x.fillStyle = '#00ff8808'; x.fillRect(20, 445, 860, 35);

  x.font = 'bold 40px "Share Tech Mono",monospace'; x.fillStyle = '#00ff88';
  x.textAlign = 'center'; x.shadowColor = '#00ff88'; x.shadowBlur = 12;
  x.fillText('PROOF OF WITNESS', 450, 63); x.shadowBlur = 0;

  x.font = '11px "Share Tech Mono",monospace'; x.fillStyle = '#1a5060';
  x.fillText('// BLOCKCHAIN HUMANITY VERIFICATION PROTOCOL //', 450, 92);

  var certId = 'WIT-' + Date.now().toString(36).toUpperCase().slice(-8);
  x.font = '10px "Share Tech Mono",monospace'; x.fillStyle = '#0d2a3a';
  x.textAlign = 'left'; x.fillText('CERT: ' + certId, 40, 92);
  x.textAlign = 'right'; x.fillText(new Date().toISOString().slice(0,19).replace('T',' ') + ' UTC', 860, 92);

  x.textAlign = 'center';
  x.font = 'bold 96px "Bebas Neue","Share Tech Mono",monospace';
  x.fillStyle = '#00ff88'; x.shadowColor = '#00ff88'; x.shadowBlur = 25;
  x.fillText(score + '%', 450, 220); x.shadowBlur = 0;
  x.font = '12px "Share Tech Mono",monospace'; x.fillStyle = '#1a5060';
  x.fillText('HUMAN ACTIVITY INDEX', 450, 245);

  x.strokeStyle = '#00ff8833'; x.lineWidth = 1;
  x.beginPath(); x.moveTo(60, 268); x.lineTo(840, 268); x.stroke();

  x.font = 'bold 24px "Share Tech Mono",monospace'; x.fillStyle = '#00ff88';
  x.fillText(name.toUpperCase(), 450, 308);
  x.font = '11px "Share Tech Mono",monospace'; x.fillStyle = '#1a4050';
  x.fillText(addr, 450, 332);

  x.font = '13px "Share Tech Mono",monospace'; x.fillStyle = '#00ff88';
  x.fillText('[+] CERTIFIED HUMAN — VERIFIED BY $WITNESS PROTOCOL', 450, 375);
  x.font = '10px "Share Tech Mono",monospace'; x.fillStyle = '#0d2030';
  x.fillText('$WITNESS · THE LAST HUMAN TOKEN · HUMANITY SURVIVES', 450, 466);

  var link = document.createElement('a');
  link.download = 'witness-proof-' + addr.slice(0,8) + '.png';
  link.href = cv.toDataURL('image/png'); link.click();
  playHackerSound('success');
}


// ══════════════════════════════════════════════════════
//   MOUSE ENTROPY METER
// ══════════════════════════════════════════════════════
(function() {
  var _entropy = 0, _lastX = 0, _lastY = 0, _locked = false;
  var THRESH = 80;
  var _msgs = ['CALIBRATING...','SCANNING BIOSIG...','MEASURING ENTROPY...','SIGNAL DETECTED...','IDENTITY CONFIRMED'];
  document.addEventListener('mousemove', function(e) {
    if (_locked) return;
    var dx = e.clientX - _lastX, dy = e.clientY - _lastY;
    var dist = Math.sqrt(dx*dx + dy*dy);
    if (dist > 2) { _entropy = Math.min(THRESH, _entropy + 1); _lastX = e.clientX; _lastY = e.clientY; }
    var pct = (_entropy / THRESH) * 100;
    var bar = document.getElementById('entropyBar');
    var lbl = document.getElementById('entropyLabel');
    if (bar) bar.style.width = pct + '%';
    if (lbl) lbl.textContent = _msgs[Math.min(4, Math.floor(pct / 25))];
    if (_entropy >= THRESH && !_locked) {
      _locked = true;
      if (lbl) { lbl.textContent = 'SIGNAL LOCKED'; lbl.style.color = '#00ff88'; }
      if (bar) bar.style.boxShadow = '0 0 10px #00ff88';
    }
  });
})();
