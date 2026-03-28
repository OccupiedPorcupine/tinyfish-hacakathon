# GeoGap

Founder intelligence terminal for cross-market gap radar: **US, India, Brazil** as source signal markets and **Singapore, Indonesia, Vietnam** as targets. TinyFish runs **only on the server**; the browser never sees `TINYFISH_API_KEY`.

## Stack

- Next.js 15 (App Router), TypeScript, Tailwind CSS, Radix primitives
- Server routes: `POST /api/scan`, `GET /api/scan/[id]`, `POST /api/tinyfish/market-scan`
- Optional OpenAI synthesis after TinyFish extraction; deterministic **mock fallback** keeps the UI demoable if agents or LLM fail

## Run locally

```bash
cp .env.example .env.local
# Add TINYFISH_API_KEY (and optionally OPENAI_API_KEY)

npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you land on **Dashboard** (`/` redirects to `/dashboard`).

## Product structure

| Route           | Purpose                                      |
|-----------------|----------------------------------------------|
| `/dashboard`    | Intelligence terminal (heatmap, movers, …)   |
| `/run-scan`     | Gap Radar (primary workflow)                 |
| `/markets`      | Drill-down + early transfer signals          |
| `/founder-fit`  | Secondary fit heuristic                      |
| `/funding-feed` | Funding lens + accelerating categories       |
| `/saved`        | Saved scans, compare, notes / shortlist      |

Pattern migration is **embedded** (emerging patterns on Dashboard, transfer signals on Markets, accelerating categories on Funding Feed)—not a top-level nav item.

## Server modules

- [`lib/tinyfish/client.ts`](lib/tinyfish/client.ts) — TinyFish SSE client
- [`lib/tinyfish/types.ts`](lib/tinyfish/types.ts) — Normalized types
- [`lib/tinyfish/normalizers.ts`](lib/tinyfish/normalizers.ts) — Map synthesis → UI models + mock payload
- [`lib/tinyfish/prompts.ts`](lib/tinyfish/prompts.ts) — Agent goals + synthesis prompt

## TinyFish client (async by default)

GeoGap uses **`POST /v1/automation/run-async`** then polls **`GET /v1/runs/{run_id}`** until `COMPLETED` / `FAILED` / `CANCELLED`. That avoids holding a long-lived SSE connection (which was timing out around ~5–10m on slow sites).

- Default per-agent wait: **`TINYFISH_AGENT_TIMEOUT_MS`** or **12 minutes** (`720000` ms).
- Poll cadence: **`TINYFISH_POLL_INTERVAL_MS`** or **4s**.
- Legacy streaming: set **`TINYFISH_USE_SSE=true`** to use `/run-sse` instead (still reads `resultJson` on `COMPLETE`).

`POST /api/scan` sets **`maxDuration = 800`** (seconds) so the `after()` worker can outlast ~10m parallel agents plus synthesis. On Vercel, your plan’s max may be lower—raise it in project settings if scans cut off early.

## Demo note

Scan jobs are stored **in memory** on the server process. Restarting `next dev` clears them; use **Save scan** (localStorage) to keep results across refreshes on the client.
