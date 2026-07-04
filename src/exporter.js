/* ============================================================
   ICT Data Provider — design tokens
   Palette: ink terminal + antique gold (nods to XAU/USD)
   Display/data face: monospace (IBM Plex Mono)
   UI face: Inter
   ============================================================ */

:root{
  --ink-0:#05070a;
  --ink-1:#0a0e13;
  --ink-2:#10151d;
  --ink-3:#171e29;
  --line:#232c39;
  --line-soft:#1a212c;

  --text-hi:#e7edf4;
  --text-mid:#a9b6c4;
  --text-low:#697585;

  --gold:#d4af37;
  --gold-soft:#8a7433;
  --gold-dim:rgba(212,175,55,0.14);

  --up:#3ecf8e;
  --down:#e5484d;

  --font-ui: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-mono: "IBM Plex Mono", "SFMono-Regular", Menlo, Consolas, monospace;

  --radius: 3px;
  --radius-lg: 6px;
}

@supports (font-variation-settings: normal){
  :root{ --font-ui: "InterVariable", "Inter", sans-serif; }
}

*{ box-sizing: border-box; }

html, body{
  margin:0;
  padding:0;
  background: var(--ink-0);
  color: var(--text-hi);
  font-family: var(--font-ui);
  -webkit-font-smoothing: antialiased;
}

body{
  min-height: 100vh;
  min-height: 100dvh;
  padding-bottom: env(safe-area-inset-bottom);
}

@media (prefers-reduced-motion: reduce){
  *{ animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; }
}

::selection{ background: var(--gold-dim); color: var(--text-hi); }

/* ---------------- Ticker tape (signature element) ---------------- */

.tape{
  background: var(--ink-1);
  border-bottom: 1px solid var(--line);
  overflow: hidden;
  white-space: nowrap;
  height: 30px;
  display:flex;
  align-items:center;
}

.tape-track{
  display: inline-flex;
  gap: 48px;
  padding-left: 100%;
  animation: scroll-tape 26s linear infinite;
}

@keyframes scroll-tape{
  from{ transform: translateX(0); }
  to{ transform: translateX(-100%); }
}

.tape-item{
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  color: var(--gold-soft);
  text-transform: uppercase;
}

/* ---------------- Shell / layout ---------------- */

.shell{
  max-width: 980px;
  margin: 0 auto;
  padding: 28px 20px 40px;
}

.masthead{
  display:flex;
  align-items:flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 18px;
}

.masthead-title{
  display:flex;
  align-items:flex-start;
  gap: 12px;
}

.glyph{
  font-size: 26px;
  color: var(--gold);
  line-height: 1;
  margin-top: 2px;
}

.masthead h1{
  margin: 0 0 4px;
  font-size: 20px;
  letter-spacing: 0.01em;
  font-weight: 700;
}

.subhead{
  margin:0;
  color: var(--text-mid);
  font-size: 13px;
  max-width: 46ch;
}

.status-board{
  display:flex;
  align-items:center;
  gap:8px;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-mid);
  background: var(--ink-2);
  border: 1px solid var(--line);
  padding: 7px 12px;
  border-radius: var(--radius-lg);
  white-space: nowrap;
}

.dot{
  width:8px; height:8px;
  border-radius:50%;
  background: var(--text-low);
  box-shadow: 0 0 0 0 rgba(0,0,0,0);
}

.dot.live{
  background: var(--up);
  box-shadow: 0 0 0 3px rgba(62,207,142,0.18);
}

.dot.error{
  background: var(--down);
  box-shadow: 0 0 0 3px rgba(229,72,77,0.18);
}

.dot.loading{
  background: var(--gold);
  animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse{
  0%,100%{ opacity: 1; }
  50%{ opacity: 0.35; }
}

.scope-note{
  font-size: 12.5px;
  color: var(--text-mid);
  background: var(--ink-2);
  border: 1px solid var(--line-soft);
  border-left: 3px solid var(--gold-soft);
  padding: 10px 14px;
  border-radius: var(--radius);
  margin: 0 0 22px;
  line-height: 1.55;
}

.scope-note strong{ color: var(--text-hi); }

/* ---------------- Panels ---------------- */

.panels{
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 18px;
  align-items: start;
}

@media (max-width: 780px){
  .panels{ grid-template-columns: 1fr; }
}

.panel{
  background: var(--ink-1);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: 18px;
}

.panel h2{
  margin: 0 0 16px;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  color: var(--text-mid);
  font-weight: 600;
}

/* ---------------- Form fields ---------------- */

.field{ margin-bottom: 16px; }
.field-row{ display:flex; gap: 12px; }
.field-row .field{ flex:1; min-width: 0; }

label{
  display:block;
  font-size: 12px;
  color: var(--text-mid);
  margin-bottom: 6px;
}

input[type="text"],
input[type="password"],
input[type="number"],
select{
  width: 100%;
  background: var(--ink-2);
  border: 1px solid var(--line);
  color: var(--text-hi);
  padding: 10px 11px;
  border-radius: var(--radius);
  font-family: var(--font-mono);
  font-size: 13.5px;
  appearance: none;
  -webkit-appearance: none;
}

select{
  background-image: linear-gradient(45deg, transparent 50%, var(--text-mid) 50%), linear-gradient(135deg, var(--text-mid) 50%, transparent 50%);
  background-position: calc(100% - 18px) center, calc(100% - 13px) center;
  background-size: 5px 5px, 5px 5px;
  background-repeat: no-repeat;
  padding-right: 32px;
}

input:focus-visible, select:focus-visible, button:focus-visible{
  outline: 2px solid var(--gold);
  outline-offset: 1px;
}

input::placeholder{ color: var(--text-low); }

.key-row{ display:flex; gap:8px; }
.key-row input{ flex:1; min-width:0; }

.icon-btn{
  background: var(--ink-2);
  border: 1px solid var(--line);
  color: var(--text-mid);
  border-radius: var(--radius);
  width: 40px;
  cursor: pointer;
  font-size: 15px;
}

.remember-row{
  display:flex;
  align-items:center;
  gap: 7px;
  margin-top: 9px;
  font-size: 12px;
  color: var(--text-low);
  cursor: pointer;
}

.remember-row input{ width:auto; accent-color: var(--gold); }

.hidden{ display:none !important; }

/* ---------------- Buttons ---------------- */

.btn{
  font-family: var(--font-ui);
  font-size: 13.5px;
  font-weight: 600;
  padding: 11px 16px;
  border-radius: var(--radius);
  border: 1px solid var(--line);
  cursor: pointer;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:7px;
  transition: background 0.15s ease, border-color 0.15s ease, opacity 0.15s ease;
}

.btn:disabled{ opacity: 0.4; cursor: not-allowed; }

.btn-primary{
  width: 100%;
  background: var(--gold);
  border-color: var(--gold);
  color: #17130a;
}

.btn-primary:hover:not(:disabled){ background: #e2bf51; }

.btn-icon{ font-size: 13px; }

.btn-ghost{
  background: var(--ink-2);
  color: var(--text-hi);
}

.btn-ghost:hover:not(:disabled){ border-color: var(--gold-soft); color: var(--gold); }

.btn-danger{
  background: transparent;
  color: var(--down);
  border-color: var(--line);
  margin-left: auto;
}

.btn-danger:hover{ border-color: var(--down); }

.error{
  color: var(--down);
  font-size: 12.5px;
  margin: 12px 0 0;
  min-height: 0;
  line-height: 1.5;
}

.error:empty{ display:none; }

/* ---------------- Output panel ---------------- */

.output-header{
  display:flex;
  align-items:center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 14px;
}

.output-header h2{ margin:0; }

.meta-chips{
  display:flex;
  gap: 6px;
  flex-wrap: wrap;
}

.chip{
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--gold-soft);
  background: var(--gold-dim);
  border: 1px solid rgba(212,175,55,0.28);
  padding: 3px 9px;
  border-radius: 20px;
  white-space: nowrap;
}

.json-view{
  margin: 0;
  background: var(--ink-0);
  border: 1px solid var(--line-soft);
  border-radius: var(--radius);
  padding: 14px;
  max-height: 480px;
  overflow: auto;
  font-family: var(--font-mono);
  font-size: 12.5px;
  line-height: 1.6;
  color: var(--text-mid);
  white-space: pre;
}

.json-view code{ font-family: inherit; }

.action-row{
  display:flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 14px;
}

/* ---------------- Footer ---------------- */

.foot{
  margin-top: 26px;
  text-align:center;
}

.foot p{
  font-size: 11.5px;
  color: var(--text-low);
}

.foot a{ color: var(--gold-soft); }

/* ---------------- Toast ---------------- */

.toast{
  position: fixed;
  left: 50%;
  bottom: 24px;
  transform: translateX(-50%) translateY(12px);
  background: var(--ink-3);
  border: 1px solid var(--gold-soft);
  color: var(--text-hi);
  padding: 10px 18px;
  border-radius: var(--radius-lg);
  font-size: 13px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease, transform 0.2s ease;
  z-index: 50;
  max-width: calc(100vw - 40px);
  text-align: center;
}

.toast.show{
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

/* ---------------- iPhone Safari niceties ---------------- */

@media (max-width: 480px){
  .shell{ padding: 20px 14px 32px; }
  .masthead h1{ font-size: 18px; }
  .field-row{ flex-direction: column; gap: 0; }
  .action-row{ flex-direction: column; }
  .action-row .btn{ width: 100%; margin-left: 0 !important; }
  .json-view{ max-height: 360px; font-size: 12px; }
  input, select, .btn{ font-size: 16px; } /* prevents iOS auto-zoom on focus */
}
