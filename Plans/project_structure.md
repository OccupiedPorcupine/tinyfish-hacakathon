# Frontier -- Project Structure

> Market intelligence platform that helps founders find geographic market gaps.
> Built for the TinyFish x OpenAI Hackathon, March 2026.

---

## 1. Monorepo Layout

```
frontier/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── api/
│   │   ├── __init__.py
│   │   ├── gap_radar.py
│   │   ├── signal_feed.py
│   │   └── trend_bridge.py
│   ├── agents/
│   │   ├── __init__.py
│   │   ├── orchestrator.py
│   │   ├── tinyfish_client.py
│   │   └── sources/
│   │       ├── __init__.py
│   │       ├── crunchbase.py
│   │       ├── techinasia.py
│   │       ├── producthunt.py
│   │       ├── appstore.py
│   │       ├── grants.py
│   │       ├── news_local.py
│   │       └── job_boards.py
│   ├── synthesis/
│   │   ├── __init__.py
│   │   ├── market_analyzer.py
│   │   └── prompts/
│   │       ├── gap_radar_system.txt
│   │       ├── signal_feed_system.txt
│   │       ├── trend_bridge_system.txt
│   │       └── market_brief_system.txt
│   ├── models/
│   │   ├── __init__.py
│   │   ├── market.py
│   │   ├── competitor.py
│   │   ├── signal.py
│   │   ├── opportunity.py
│   │   └── scan.py
│   ├── config/
│   │   ├── __init__.py
│   │   ├── settings.py
│   │   ├── regions.py
│   │   └── sources.py
│   ├── cache/
│   │   ├── __init__.py
│   │   └── store.py
│   └── db/
│       ├── __init__.py
│       └── database.py
├── frontend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── next.config.ts
│   ├── components.json
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── results/
│   │   │   ├── page.tsx
│   │   │   └── loading.tsx
│   │   └── api/
│   │       └── scan/
│   │           └── route.ts
│   ├── components/
│   │   ├── ui/                  # shadcn/ui primitives
│   │   ├── search-input.tsx
│   │   ├── market-card.tsx
│   │   ├── agent-progress.tsx
│   │   ├── opportunity-score.tsx
│   │   ├── trend-chart.tsx
│   │   ├── grant-card.tsx
│   │   ├── signal-feed-list.tsx
│   │   ├── region-heatmap.tsx
│   │   └── scan-header.tsx
│   ├── lib/
│   │   ├── api-client.ts
│   │   ├── types.ts
│   │   ├── utils.ts
│   │   └── constants.ts
│   └── hooks/
│       ├── use-sse.ts
│       ├── use-market-data.ts
│       └── use-scan.ts
├── scripts/
│   ├── test_tinyfish.py
│   └── test_openai.py
├── .env.example
├── .gitignore
├── Makefile
└── README.md
```

---

## 2. Backend Structure (Python / FastAPI)

### `main.py` -- Application Entry Point

Creates the FastAPI app, registers CORS middleware (allows Next.js on localhost:3000), mounts all three API routers under `/api/v1`, and defines a root health-check endpoint.

### `api/` -- Route Handlers

| File | Route Prefix | Purpose |
|------|-------------|---------|
| `gap_radar.py` | `/api/v1/gap-radar` | Accepts business idea, triggers orchestrator, streams progress via SSE, returns scored market opportunities |
| `signal_feed.py` | `/api/v1/signals` | Returns cached signal data (funding, regulations, hiring) for a given region or sector |
| `trend_bridge.py` | `/api/v1/trends` | Returns emerging category data from mature markets with SEA migration scores |

### `agents/` -- TinyFish Agent Orchestration

| File | Purpose |
|------|---------|
| `orchestrator.py` | Core engine. Takes business idea + regions, fans out parallel TinyFish calls via `asyncio.gather()`, collects results, handles partial failures with `return_exceptions=True`, feeds raw data to synthesis layer. Emits SSE progress events. |
| `tinyfish_client.py` | Thin async wrapper around TinyFish SSE API. Handles `aiohttp` session management, API key auth, SSE event parsing, retry logic (1 retry with stealth+proxy on failure), timeout handling. |

### `agents/sources/` -- Source-Specific Agent Configs

Each file exports a function returning `AgentTask` objects (url + goal pairs) for the orchestrator.

| File | Sources Targeted | Data Extracted |
|------|-----------------|----------------|
| `crunchbase.py` | Crunchbase search pages | Competitors, funding rounds, investor names |
| `techinasia.py` | Tech in Asia articles, startup DB | SEA funding news, startup profiles |
| `producthunt.py` | Product Hunt search | Similar products, launch dates, traction |
| `appstore.py` | Apple App Store / Google Play | App rankings, review counts per market |
| `grants.py` | Enterprise SG, MDI Ventures, regional portals | Open grants, deadlines, eligibility |
| `news_local.py` | VNExpress, DailySocial, Kompas | Local language news about sector |
| `job_boards.py` | LinkedIn, JobStreet, Glints | Hiring velocity, role types, growth signals |

### `synthesis/` -- OpenAI Synthesis Layer

| File | Purpose |
|------|---------|
| `market_analyzer.py` | Takes raw scraped data, calls GPT-4o to produce structured market analysis. Outputs: opportunity scores, competition density, regulatory assessment. Uses JSON mode for parseable responses. |

### `synthesis/prompts/` -- System Prompts

Plain text files loaded at runtime. Separate files so they can be iterated without touching Python.

| File | Used By |
|------|---------|
| `gap_radar_system.txt` | Main scoring prompt. Evaluates regions on: market vacuum, competition, regulatory environment, funding momentum, timing. |
| `signal_feed_system.txt` | Classifies and scores individual signals by relevance and urgency. |
| `trend_bridge_system.txt` | Analyzes mature-market trends and estimates SEA migration probability. |
| `market_brief_system.txt` | Generates human-readable one-paragraph market briefs. |

### `models/` -- Pydantic Data Models

| File | Models Defined |
|------|---------------|
| `market.py` | `Market` (region name, population, GDP, internet penetration) |
| `competitor.py` | `Competitor` (name, funding_stage, total_raised, region, source_url) |
| `signal.py` | `Signal` (type, title, summary, region, date, relevance_score) |
| `opportunity.py` | `Opportunity` (market assessment with score, competitors, signals, grants) |
| `scan.py` | `ScanRequest`, `ScanStatus`, `ScanResult`, `GapRadarResult` |

### `config/` -- Settings and Configuration

| File | Purpose |
|------|---------|
| `settings.py` | Pydantic `BaseSettings` reading from `.env`. All config flows through here. |
| `regions.py` | Registry of supported regions with metadata: display name, flag emoji, proxy country code, local news URLs, grant portal URLs, language. |
| `sources.py` | Registry of data sources with base URLs and browser profile preferences. |

### `cache/store.py` -- Caching Layer

In-memory dict with TTL (hackathon simplicity). Caches TinyFish results keyed by `hash(url + goal)` to avoid re-burning API credits. TTL: 1 hour for market data, 15 minutes for signals.

### `db/database.py` -- Database

SQLite setup using `aiosqlite`. Tables: `scans` (id, idea, status, timestamps), `scan_results` (scan_id, region, opportunity_json). Async `get_scan()`, `save_scan()`, `list_scans()`.

---

## 3. Frontend Structure (Next.js 14+ / TypeScript)

### `app/` -- Pages

| File | Purpose |
|------|---------|
| `layout.tsx` | Root layout. Font (Inter), metadata, global providers, dark mode. |
| `page.tsx` | Landing page. Hero with tagline, `SearchInput` centered, "How it works" section. First thing judges see. |
| `globals.css` | Tailwind imports + shadcn/ui CSS variables. Dark background, accent colors for scoring (green/amber/red). |
| `results/page.tsx` | Client component. Reads `scan_id` from params. Uses `useScan` hook. Shows `AgentProgress` during scanning, then `MarketCard` grid on completion. Most complex frontend page. |
| `results/loading.tsx` | Skeleton cards matching MarketCard layout. |
| `api/scan/route.ts` | Optional BFF proxy to backend. Skip for hackathon if calling backend directly. |

### `components/` -- UI Components

| File | Purpose |
|------|---------|
| `ui/` | shadcn/ui primitives. Install with `npx shadcn@latest add button card badge input skeleton progress separator collapsible`. |
| `search-input.tsx` | Large text input + "Scan Markets" button. On submit: POST to backend, navigate to results page. |
| `market-card.tsx` | Region card with: flag + name, verdict badge (green/amber/red), score (0-100) with circular progress, competitor count, top signal, one-line brief. Expandable on click. |
| `agent-progress.tsx` | Real-time scanning visualization. Vertical timeline of agent steps with spinner/check/X status. The "wow" moment in the demo. |
| `opportunity-score.tsx` | Large circular gauge (0-100) with color gradient. Sub-score bars below. |
| `trend-chart.tsx` | Timeline showing category growth in mature markets + SEA prediction. Tailwind-styled bars, or `recharts` if time permits. |
| `grant-card.tsx` | Grant name, issuing body, deadline (urgency coloring), amount, eligibility, source link. |
| `signal-feed-list.tsx` | Vertical list of signals with type icons, region badges, summaries. |
| `region-heatmap.tsx` | Color-coded grid of all target regions as visual overview. |
| `scan-header.tsx` | Header bar showing scanned idea, timestamp, sources checked, processing time. |

### `lib/` -- Utilities

| File | Purpose |
|------|---------|
| `api-client.ts` | Typed fetch wrapper: `startScan()`, `getScanResults()`, `getSignals()`, `getTrends()`. Base URL from `NEXT_PUBLIC_API_URL`. |
| `types.ts` | TypeScript interfaces mirroring backend Pydantic models. Single source of truth for frontend types. |
| `utils.ts` | `cn()` (class merge), `formatScore()`, `getVerdictColor()`, `timeAgo()`. |
| `constants.ts` | `REGIONS`, `VERDICT_LABELS`, `SIGNAL_TYPE_ICONS`, `DEFAULT_REGIONS`. |

### `hooks/` -- Custom React Hooks

| File | Purpose |
|------|---------|
| `use-sse.ts` | Generic SSE hook. Takes URL, returns `{ events, isConnected, error }`. Handles EventSource lifecycle and reconnection. |
| `use-market-data.ts` | Fetches completed scan results. Takes `scan_id`, returns `{ data, isLoading, error }`. |
| `use-scan.ts` | Orchestrates full scan flow. State machine: `idle -> submitting -> scanning -> complete -> error`. Single hook for results page. |

---

## 4. Shared / Config Files

### `.env.example`

```bash
# TinyFish
TINYFISH_API_KEY=sk-tinyfish-your-key-here

# OpenAI
OPENAI_API_KEY=sk-your-openai-key-here
OPENAI_MODEL=gpt-4o

# Backend
CORS_ORIGINS=http://localhost:3000
LOG_LEVEL=info

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### `.gitignore`

```
__pycache__/
*.pyc
.venv/
node_modules/
.next/
.env
.env.local
*.db
.DS_Store
```

### `Makefile`

```makefile
setup: setup-backend setup-frontend

setup-backend:
	cd backend && python -m venv .venv && .venv/bin/pip install -r requirements.txt

setup-frontend:
	cd frontend && npm install

dev-backend:
	cd backend && .venv/bin/uvicorn main:app --reload --port 8000

dev-frontend:
	cd frontend && npm run dev

lint:
	cd backend && .venv/bin/ruff check .
	cd frontend && npm run lint
```

---

## 5. File-by-File Descriptions

### Backend Core

**`backend/main.py`** -- FastAPI app factory. CORS middleware, router mounting, health check endpoint. Entry point for `uvicorn`.

**`backend/agents/orchestrator.py`** -- The brain. `async def run_scan(idea, regions) -> AsyncGenerator[ScanEvent]` that: (1) generates agent tasks per source module, (2) fires all in parallel via `asyncio.gather()`, (3) yields progress events, (4) collects results, (5) feeds to synthesis. Most important backend file.

**`backend/agents/tinyfish_client.py`** -- Async TinyFish wrapper. `async def run_agent(url, goal, stealth, proxy_country) -> AgentResult`. Uses `aiohttp` for SSE streaming, implements retry with stealth on failure, 60-second timeout.

**`backend/synthesis/market_analyzer.py`** -- `async def analyze_market(idea, raw_data) -> list[Opportunity]`. Loads system prompt, constructs user message with raw data, calls OpenAI with JSON mode, parses into Pydantic models.

**`backend/config/settings.py`** -- Single Pydantic `BaseSettings` class. All config flows through `from config.settings import settings`.

### Frontend Core

**`frontend/app/page.tsx`** -- Landing page. Centered layout, gradient background, `SearchInput` as focal point. Designed to look impressive immediately.

**`frontend/app/results/page.tsx`** -- Client component. `useScan` hook manages lifecycle. Renders `AgentProgress` while scanning, then `RegionHeatmap` + `MarketCard` grid + `GrantCard` list on completion. Most complex frontend page.

**`frontend/components/agent-progress.tsx`** -- Vertical timeline with animated steps from SSE events. Spinner=active, check=done, X=failed. Creates the "wow" factor.

**`frontend/components/market-card.tsx`** -- Color-coded card per region. Green (#22c55e) for 70+, amber (#f59e0b) for 40-69, red (#ef4444) for below 40. Expandable for detail.

**`frontend/hooks/use-sse.ts`** -- `EventSource` connection to backend. Returns parsed events, connected state, error. Auto-reconnect, cleanup on unmount.

---

## 6. Dependency List

### Backend (`requirements.txt`)

```
fastapi>=0.115.0
uvicorn[standard]>=0.34.0
tinyfish>=0.1.0
aiohttp>=3.11.0
openai>=1.60.0
pydantic>=2.10.0
pydantic-settings>=2.7.0
aiosqlite>=0.20.0
sse-starlette>=2.2.0
python-dotenv>=1.0.1
cachetools>=5.5.0
ruff>=0.8.0
```

### Frontend (`package.json`)

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.6.0",
    "lucide-react": "^0.460.0",
    "@radix-ui/react-slot": "^1.1.0",
    "@radix-ui/react-progress": "^1.1.0",
    "@radix-ui/react-separator": "^1.1.0",
    "@radix-ui/react-collapsible": "^1.1.0"
  },
  "devDependencies": {
    "typescript": "^5.6.0",
    "@types/react": "^18.3.0",
    "@types/node": "^22.0.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^9.0.0",
    "eslint-config-next": "^14.2.0"
  }
}
```

**shadcn/ui setup:** Run `npx shadcn@latest init` then `npx shadcn@latest add button card badge input skeleton progress separator collapsible`.

---

## 7. Implementation Priority (MVP Path)

### Phase 1: Vertical Slice (Hours 0-3)

One complete flow: idea in, results out.

| # | File | Time |
|---|------|------|
| 1 | `backend/config/settings.py` | 10 min |
| 2 | `backend/models/scan.py` + `models/opportunity.py` | 15 min |
| 3 | `backend/agents/tinyfish_client.py` | 30 min |
| 4 | `backend/agents/sources/crunchbase.py` | 20 min |
| 5 | `backend/agents/orchestrator.py` | 45 min |
| 6 | `backend/synthesis/market_analyzer.py` + prompts | 45 min |
| 7 | `backend/api/gap_radar.py` + `main.py` | 30 min |

### Phase 2: Frontend Shell (Hours 3-5)

| # | File | Time |
|---|------|------|
| 8 | Frontend scaffolding + shadcn init | 15 min |
| 9 | `lib/types.ts` + `api-client.ts` | 20 min |
| 10 | `components/search-input.tsx` | 30 min |
| 11 | `app/page.tsx` | 20 min |
| 12 | `hooks/use-sse.ts` | 30 min |
| 13 | `components/agent-progress.tsx` | 30 min |
| 14 | `components/market-card.tsx` | 30 min |
| 15 | `app/results/page.tsx` | 30 min |

**Working demo at this point: type idea -> see agents scan -> see scored results.**

### Phase 3: More Sources + Polish (Hours 5-7)

| # | File | Time |
|---|------|------|
| 16 | `agents/sources/techinasia.py` | 15 min |
| 17 | `agents/sources/grants.py` | 20 min |
| 18 | `agents/sources/news_local.py` | 20 min |
| 19 | `components/grant-card.tsx` | 15 min |
| 20 | `components/opportunity-score.tsx` | 20 min |
| 21 | `cache/store.py` | 20 min |
| 22 | `db/database.py` | 20 min |

### Phase 4: If Time Permits (Hours 7-8)

| # | File | Time |
|---|------|------|
| 23 | `agents/sources/producthunt.py` | 15 min |
| 24 | `agents/sources/appstore.py` | 15 min |
| 25 | `components/region-heatmap.tsx` | 20 min |
| 26 | `components/trend-chart.tsx` | 20 min |
| 27 | `api/signal_feed.py` | 30 min |
| 28 | `api/trend_bridge.py` | 30 min |

---

## 8. What to Skip

| Skip | Why |
|------|-----|
| User authentication | No users at a hackathon demo |
| Database migrations | SQLite auto-create tables. Blow away DB if schema changes. |
| Unit/integration/E2E tests | Test manually. Zero hackathon value. |
| CI/CD pipelines | Deploying to your laptop. |
| Docker (for dev) | Running uvicorn + npm directly is faster. |
| Redis | In-memory cache is fine for demo. |
| Rate limiting | You are the only user. |
| Custom error pages | Judges will not see these. |
| Responsive/mobile design | Demo is on a laptop at 1440px. |
| SEO, analytics, payments | Not relevant. |
| Full Signal Feed monitoring | Show signals from the same scan, not a background loop. |
| Full Trend Bridge pipeline | Static/mocked section if time is short. |
| SVG map visualization | Colored grid of cards is equally effective. |
| Charting library | Tailwind-styled bars are enough. Add recharts only if everything else is done. |
| Internationalization | Multilingual is TinyFish reading foreign sources, not the UI. |

### The Hackathon Mindset

Focus on three things that win:

1. **Agent progress animation** (`agent-progress.tsx` + SSE) -- the visceral "holy shit" moment
2. **Scoring output** (`market-card.tsx` + `opportunity-score.tsx`) -- real data, real names, real deadlines, cited sources
3. **Prompt engineering** (`synthesis/prompts/`) -- the quality of GPT-4o's analysis is the difference between "cool demo" and "I would actually use this"

Everything else is plumbing. Build it fast, make it work, move on.
