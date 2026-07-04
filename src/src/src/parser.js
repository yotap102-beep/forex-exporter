# ICT Data Provider

A lightweight, client-side web app that pulls OHLCV candle data from the
[Twelve Data](https://twelvedata.com) API and formats it into a standardized
**ICT Data Package** (JSON or CSV).

## What this project is — and isn't

**This is a data provider only.** It fetches candles and formats them. It performs:

- ❌ No ICT market structure analysis
- ❌ No indicator calculations
- ❌ No BOS / MSS detection
- ❌ No Order Block detection
- ❌ No Fair Value Gap (FVG) detection
- ❌ No liquidity detection
- ❌ No trading signals of any kind

All of that logic belongs to the downstream consumer of this data — the
**Ahmed ICT Master Prompt v2.1 Enterprise**. This app's only job is to hand
that prompt clean, correctly-typed, chronologically-ordered market data.

## Output format

Clicking **Fetch data** produces a single JSON object, the **ICT Data Package**:

```json
{
  "market": {
    "symbol": "XAU/USD",
    "type": "unknown",
    "exchange": null
  },
  "metadata": {
    "symbol": "XAU/USD",
    "timeframe": "1h",
    "generated_at": "2026-07-04T12:00:00.000Z",
    "timezone": "UTC",
    "source": "Twelve Data",
    "total_candles": 200
  },
  "candles": [
    {
      "datetime": "2026-06-25 09:00:00",
      "open": 2338.12,
      "high": 2341.05,
      "low": 2336.90,
      "close": 2340.10,
      "volume": 0
    }
  ]
}
```

- `candles` is always ordered **oldest → newest**.
- Every numeric field (`open`, `high`, `low`, `close`, `volume`) is a real
  JSON number — never a string.
- `metadata` gives the consuming system (the Master Prompt) everything it
  needs to know about provenance: symbol, timeframe, when it was generated,
  timezone, source, and candle count.

## Getting a Twelve Data API key

1. Go to [twelvedata.com](https://twelvedata.com) and create a free account.
2. After signing in, open your **Dashboard**.
3. Copy the **API Key** shown there (a long alphanumeric string).
4. Keep it private — treat it like a password. The free tier includes a
   limited number of requests per minute/day, which is enough for manual,
   on-demand use with this tool.

## Using the app

1. Open the app (locally or via your deployed GitHub Pages URL).
2. Paste your **Twelve Data API key** into the API key field.
   - Optionally check **Remember key on this device** to save it in your
     browser's local storage so you don't have to re-enter it. Nothing is
     ever sent anywhere except directly to Twelve Data's API.
3. Choose a **Symbol**:
   - Pick one of the presets — `XAU/USD`, `EUR/USD`, `GBP/USD`, `USD/JPY`
   - Or select **Custom symbol…** and type any symbol Twelve Data supports
     (e.g. `AUD/CAD`).
4. Choose a **Timeframe**: `1min`, `5min`, `15min`, `30min`, `45min`, `1h`,
   `2h`, `4h`, `8h`, or `1day`.
5. Set the **Number of candles** you want (1–5000, subject to your Twelve
   Data plan's limits).
6. Click **Fetch data**.
7. Once the ICT Data Package appears, use:
   - **Copy JSON** — copies the package to your clipboard.
   - **Download JSON** — saves it as a `.json` file.
   - **Download CSV** — saves the candle table as a `.csv` file.
   - **Clear** — resets the output panel.
8. Feed the resulting JSON into the Ahmed ICT Master Prompt v2.1 Enterprise
   for structural analysis.

The app works entirely in your browser — there is no backend server, and
your API key never leaves your device except in direct calls to
`api.twelvedata.com`.

## Deploying with GitHub Pages

1. Push this repository to GitHub (if you haven't already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit: ICT Data Provider"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```
2. On GitHub, open your repository's **Settings** tab.
3. In the left sidebar, select **Pages**.
4. Under **Build and deployment → Source**, choose **Deploy from a branch**.
5. Under **Branch**, select `main` and folder `/ (root)`, then click **Save**.
6. Wait a minute or two, then refresh the Pages settings screen — GitHub
   will show your live URL, typically:
   ```
   https://<your-username>.github.io/<your-repo>/
   ```
7. Open that URL on your iPhone or desktop — the app is fully responsive
   and optimized for mobile Safari.

## Project structure

```
.
├── index.html      # App structure/markup
├── style.css       # Dark-mode, responsive styling
├── app.js          # Twelve Data fetch + ICT Data Package formatting logic
├── README.md       # This file
├── .gitignore
└── LICENSE
```

## Notes on scope and safety

- This tool never stores your data on a server — everything happens in the
  browser.
- Your API key is only ever sent to `https://api.twelvedata.com`.
- Symbol support depends entirely on your Twelve Data plan and their symbol
  catalog; if a request fails, the app will surface Twelve Data's own error
  message.
- This repository intentionally contains **zero** trading or analytical
  logic. If you're looking for ICT structural analysis, that responsibility
  lives in the Ahmed ICT Master Prompt v2.1 Enterprise, which consumes the
  JSON this app produces.
