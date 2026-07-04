<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<meta name="theme-color" content="#0A0E13">
<title>ICT Data Provider — Twelve Data Feed</title>
<meta name="description" content="Lightweight market data acquisition tool. Pulls OHLCV candles from Twelve Data and exports a standardized ICT Data Package (JSON/CSV). No analysis, no indicators, no signals.">
<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>▤</text></svg>">
<link rel="stylesheet" href="style.css">
</head>
<body>

<div class="tape" id="tape" aria-hidden="true">
  <div class="tape-track" id="tapeTrack">
    <span class="tape-item">XAU/USD</span>
    <span class="tape-item">EUR/USD</span>
    <span class="tape-item">GBP/USD</span>
    <span class="tape-item">USD/JPY</span>
    <span class="tape-item">XAU/USD</span>
    <span class="tape-item">EUR/USD</span>
    <span class="tape-item">GBP/USD</span>
    <span class="tape-item">USD/JPY</span>
  </div>
</div>

<div class="shell">

  <header class="masthead">
    <div class="masthead-title">
      <span class="glyph">▤</span>
      <div>
        <h1>ICT Data Provider</h1>
        <p class="subhead">Market data acquisition layer for the Ahmed ICT Master Prompt v2.1 Enterprise</p>
      </div>
    </div>
    <div class="status-board" id="statusBoard">
      <span class="dot" id="statusDot"></span>
      <span id="statusText">Idle</span>
    </div>
  </header>

  <p class="scope-note">
    <strong>Scope.</strong> This tool only fetches and formats candle data. It performs no ICT analysis —
    no BOS, MSS, Order Blocks, FVGs, or liquidity detection. Structural interpretation belongs to the Master Prompt.
  </p>

  <main class="panels">

    <section class="panel form-panel" aria-labelledby="formHeading">
      <h2 id="formHeading">Request parameters</h2>

      <div class="field">
        <label for="apiKey">Twelve Data API key</label>
        <div class="key-row">
          <input type="password" id="apiKey" placeholder="Paste your API key" autocomplete="off" spellcheck="false">
          <button type="button" class="icon-btn" id="toggleKey" aria-label="Show API key">👁</button>
        </div>
        <label class="remember-row">
          <input type="checkbox" id="rememberKey">
          <span>Remember key on this device</span>
        </label>
      </div>

      <div class="field">
        <label for="symbolSelect">Symbol</label>
        <select id="symbolSelect">
          <option value="XAU/USD">XAU/USD — Gold Spot</option>
          <option value="EUR/USD">EUR/USD — Euro / US Dollar</option>
          <option value="GBP/USD">GBP/USD — British Pound / US Dollar</option>
          <option value="USD/JPY">USD/JPY — US Dollar / Japanese Yen</option>
          <option value="__custom__">Custom symbol…</option>
        </select>
        <input type="text" id="customSymbol" placeholder="e.g. AUD/CAD" class="hidden" autocomplete="off" spellcheck="false">
      </div>

      <div class="field-row">
        <div class="field">
          <label for="timeframeSelect">Timeframe</label>
          <select id="timeframeSelect">
            <option value="1min">1 minute</option>
            <option value="5min">5 minutes</option>
            <option value="15min">15 minutes</option>
            <option value="30min">30 minutes</option>
            <option value="45min">45 minutes</option>
            <option value="1h" selected>1 hour</option>
            <option value="2h">2 hours</option>
            <option value="4h">4 hours</option>
            <option value="8h">8 hours</option>
            <option value="1day">1 day</option>
          </select>
        </div>

        <div class="field">
          <label for="candleCount">Number of candles</label>
          <input type="number" id="candleCount" value="200" min="1" max="5000" inputmode="numeric">
        </div>
      </div>

      <button type="button" class="btn btn-primary" id="fetchBtn">
        <span class="btn-icon">⇩</span> Fetch data
      </button>

      <p class="error" id="errorMsg" role="alert"></p>
    </section>

    <section class="panel output-panel" aria-labelledby="outputHeading">
      <div class="output-header">
        <h2 id="outputHeading">ICT Data Package</h2>
        <div class="meta-chips" id="metaChips"></div>
      </div>

      <pre class="json-view" id="jsonView"><code id="jsonCode">// Fetched candles will appear here as a standardized ICT Data Package.
// Nothing is analyzed, scored, or interpreted — this is raw, formatted OHLCV data only.</code></pre>

      <div class="action-row">
        <button type="button" class="btn btn-ghost" id="copyBtn" disabled>Copy JSON</button>
        <button type="button" class="btn btn-ghost" id="downloadJsonBtn" disabled>Download JSON</button>
        <button type="button" class="btn btn-ghost" id="downloadCsvBtn" disabled>Download CSV</button>
        <button type="button" class="btn btn-danger" id="clearBtn">Clear</button>
      </div>
    </section>

  </main>

  <footer class="foot">
    <p>ICT Data Provider · Data via <a href="https://twelvedata.com" target="_blank" rel="noopener">Twelve Data</a> · No trading logic, no signals, no analysis.</p>
  </footer>

</div>

<div class="toast" id="toast" role="status" aria-live="polite"></div>

<script src="app.js"></script>
</body>
</html>
