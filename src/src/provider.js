/* ============================================================
   ICT Data Provider — app.js
   Responsibility: fetch OHLCV candles from Twelve Data and
   format them into a standardized "ICT Data Package".
   This file performs NO market structure analysis of any kind.
   No BOS / MSS / Order Block / FVG / Liquidity detection here —
   that logic belongs exclusively to the downstream Master Prompt.
   ============================================================ */

(function () {
  "use strict";

  const TWELVE_DATA_BASE = "https://api.twelvedata.com/time_series";
  const STORAGE_KEY = "ictDataProvider.apiKey";

  // ---- DOM references ----
  const els = {
    apiKey: document.getElementById("apiKey"),
    toggleKey: document.getElementById("toggleKey"),
    rememberKey: document.getElementById("rememberKey"),
    symbolSelect: document.getElementById("symbolSelect"),
    customSymbol: document.getElementById("customSymbol"),
    timeframeSelect: document.getElementById("timeframeSelect"),
    candleCount: document.getElementById("candleCount"),
    fetchBtn: document.getElementById("fetchBtn"),
    errorMsg: document.getElementById("errorMsg"),
    jsonCode: document.getElementById("jsonCode"),
    jsonView: document.getElementById("jsonView"),
    metaChips: document.getElementById("metaChips"),
    copyBtn: document.getElementById("copyBtn"),
    downloadJsonBtn: document.getElementById("downloadJsonBtn"),
    downloadCsvBtn: document.getElementById("downloadCsvBtn"),
    clearBtn: document.getElementById("clearBtn"),
    statusDot: document.getElementById("statusDot"),
    statusText: document.getElementById("statusText"),
    toast: document.getElementById("toast"),
  };

  // Holds the last successfully generated ICT Data Package.
  let currentPackage = null;
  let toastTimer = null;

  // ---------------- Init: restore remembered key ----------------
  (function restoreKey() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        els.apiKey.value = saved;
        els.rememberKey.checked = true;
      }
    } catch (_) {
      /* localStorage unavailable — silently ignore */
    }
  })();

  // ---------------- Symbol select handling ----------------
  els.symbolSelect.addEventListener("change", () => {
    const isCustom = els.symbolSelect.value === "__custom__";
    els.customSymbol.classList.toggle("hidden", !isCustom);
    if (isCustom) els.customSymbol.focus();
  });

  els.toggleKey.addEventListener("click", () => {
    const isPw = els.apiKey.type === "password";
    els.apiKey.type = isPw ? "text" : "password";
    els.toggleKey.textContent = isPw ? "🙈" : "👁";
    els.toggleKey.setAttribute("aria-label", isPw ? "Hide API key" : "Show API key");
  });

  els.rememberKey.addEventListener("change", () => {
    if (!els.rememberKey.checked) {
      try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
    }
  });

  // ---------------- Helpers ----------------

  function setStatus(state, text) {
    els.statusDot.className = "dot" + (state ? " " + state : "");
    els.statusText.textContent = text;
  }

  function showError(message) {
    els.errorMsg.textContent = message || "";
  }

  function showToast(message) {
    els.toast.textContent = message;
    els.toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => els.toast.classList.remove("show"), 2200);
  }

  function resolveSymbol() {
    if (els.symbolSelect.value === "__custom__") {
      return els.customSymbol.value.trim().toUpperCase();
    }
    return els.symbolSelect.value;
  }

  /**
   * Normalizes a symbol typed without a slash (e.g. "USDJPY")
   * into Twelve Data's expected "BASE/QUOTE" format when it
   * looks like a 6-letter currency pair. Leaves anything else untouched.
   */
  function normalizeSymbol(raw) {
    const s = raw.replace(/\s+/g, "").toUpperCase();
    if (/^[A-Z]{6}$/.test(s)) {
      return s.slice(0, 3) + "/" + s.slice(3);
    }
    return s;
  }

  function setButtonsEnabled(enabled) {
    els.copyBtn.disabled = !enabled;
    els.downloadJsonBtn.disabled = !enabled;
    els.downloadCsvBtn.disabled = !enabled;
  }

  function renderMetaChips(pkg) {
    els.metaChips.innerHTML = "";
    const items = [
      pkg.metadata.symbol,
      pkg.metadata.timeframe,
      pkg.metadata.total_candles + " candles",
      pkg.metadata.source,
    ];
    for (const item of items) {
      const span = document.createElement("span");
      span.className = "chip";
      span.textContent = item;
      els.metaChips.appendChild(span);
    }
  }

  /**
   * Converts a raw Twelve Data "values" row into a clean candle object.
   * Only datetime/open/high/low/close/volume survive — nothing else.
   * All numeric fields are cast to Number, never left as strings.
   */
  function toCandle(row) {
    return {
      datetime: row.datetime,
      open: Number(row.open),
      high: Number(row.high),
      low: Number(row.low),
      close: Number(row.close),
      volume: row.volume !== undefined && row.volume !== null ? Number(row.volume) : 0,
    };
  }

  function buildIctDataPackage({ symbol, timeframe, meta, values }) {
    // Twelve Data returns newest-first by default; sort defensively oldest -> newest.
    const candles = values
      .map(toCandle)
      .sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

    return {
      market: {
        symbol: symbol,
        type: meta && meta.instrument_type ? meta.instrument_type : "unknown",
        exchange: meta && meta.exchange ? meta.exchange : null,
      },
      metadata: {
        symbol: symbol,
        timeframe: timeframe,
        generated_at: new Date().toISOString(),
        timezone: (meta && meta.exchange_timezone) || "UTC",
        source: "Twelve Data",
        total_candles: candles.length,
      },
      candles: candles,
    };
  }

  function packageToCsv(pkg) {
    const header = "datetime,open,high,low,close,volume";
    const rows = pkg.candles.map((c) =>
      [c.datetime, c.open, c.high, c.low, c.close, c.volume].join(",")
    );
    return [header, ...rows].join("\n");
  }

  function downloadBlob(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function safeFileStem(pkg) {
    const sym = pkg.metadata.symbol.replace(/[^A-Za-z0-9]/g, "");
    const tf = pkg.metadata.timeframe;
    const stamp = pkg.metadata.generated_at.replace(/[:.]/g, "-");
    return `ict_data_${sym}_${tf}_${stamp}`;
  }

  // ---------------- Fetch flow ----------------

  async function fetchData() {
    showError("");

    const apiKey = els.apiKey.value.trim();
    const rawSymbol = resolveSymbol();
    const timeframe = els.timeframeSelect.value;
    const count = parseInt(els.candleCount.value, 10);

    if (!apiKey) return showError("Enter your Twelve Data API key.");
    if (!rawSymbol) return showError("Enter or select a symbol.");
    if (!Number.isFinite(count) || count < 1 || count > 5000) {
      return showError("Number of candles must be between 1 and 5000.");
    }

    const symbol = normalizeSymbol(rawSymbol);

    if (els.rememberKey.checked) {
      try { localStorage.setItem(STORAGE_KEY, apiKey); } catch (_) {}
    }

    setStatus("loading", "Fetching…");
    els.fetchBtn.disabled = true;

    try {
      const url = new URL(TWELVE_DATA_BASE);
      url.searchParams.set("symbol", symbol);
      url.searchParams.set("interval", timeframe);
      url.searchParams.set("outputsize", String(count));
      url.searchParams.set("order", "ASC");
      url.searchParams.set("apikey", apiKey);

      const res = await fetch(url.toString());
      const data = await res.json();

      if (!res.ok || data.status === "error") {
        const msg = data && data.message ? data.message : `Request failed (HTTP ${res.status}).`;
        throw new Error(msg);
      }

      if (!Array.isArray(data.values) || data.values.length === 0) {
        throw new Error("No candle data returned for this symbol/timeframe combination.");
      }

      const pkg = buildIctDataPackage({
        symbol,
        timeframe,
        meta: data.meta,
        values: data.values,
      });

      currentPackage = pkg;
      els.jsonCode.textContent = JSON.stringify(pkg, null, 2);
      renderMetaChips(pkg);
      setButtonsEnabled(true);
      setStatus("live", `${pkg.metadata.total_candles} candles ready`);
      showToast("ICT Data Package generated.");
    } catch (err) {
      currentPackage = null;
      setButtonsEnabled(false);
      setStatus("error", "Error");
      showError(err.message || "Something went wrong while fetching data.");
    } finally {
      els.fetchBtn.disabled = false;
    }
  }

  // ---------------- Button wiring ----------------

  els.fetchBtn.addEventListener("click", fetchData);

  els.copyBtn.addEventListener("click", async () => {
    if (!currentPackage) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(currentPackage, null, 2));
      showToast("JSON copied to clipboard.");
    } catch (_) {
      showToast("Could not copy — select and copy manually.");
    }
  });

  els.downloadJsonBtn.addEventListener("click", () => {
    if (!currentPackage) return;
    downloadBlob(
      JSON.stringify(currentPackage, null, 2),
      safeFileStem(currentPackage) + ".json",
      "application/json"
    );
    showToast("JSON downloaded.");
  });

  els.downloadCsvBtn.addEventListener("click", () => {
    if (!currentPackage) return;
    downloadBlob(packageToCsv(currentPackage), safeFileStem(currentPackage) + ".csv", "text/csv");
    showToast("CSV downloaded.");
  });

  els.clearBtn.addEventListener("click", () => {
    currentPackage = null;
    setButtonsEnabled(false);
    showError("");
    els.jsonCode.textContent =
      "// Fetched candles will appear here as a standardized ICT Data Package.\n// Nothing is analyzed, scored, or interpreted — this is raw, formatted OHLCV data only.";
    els.metaChips.innerHTML = "";
    setStatus("", "Idle");
    showToast("Cleared.");
  });
})();
