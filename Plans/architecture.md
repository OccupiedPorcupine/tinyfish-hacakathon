# Frontier: Architecture Document

> Market intelligence platform that helps founders find geographic market gaps for their business ideas.
> Built for the TinyFish x OpenAI Hackathon, Singapore 2026.

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Component Breakdown](#2-component-breakdown)
3. [Data Flow: Gap Radar Query](#3-data-flow-gap-radar-query)
4. [Agent Orchestration Pattern](#4-agent-orchestration-pattern)
5. [API Endpoint Design](#5-api-endpoint-design)
6. [Data Models](#6-data-models)
7. [Caching Strategy](#7-caching-strategy)
8. [Error Handling and Graceful Degradation](#8-error-handling-and-graceful-degradation)
9. [SSE Streaming to Frontend](#9-sse-streaming-to-frontend)
10. [Security Considerations](#10-security-considerations)

---

## 1. System Overview

```
                           FRONTIER SYSTEM ARCHITECTURE
 ===========================================================================

  FOUNDER'S BROWSER
  +----------------------------------+
  |  Next.js 14 Frontend (Vercel)    |
  |  +-----------+ +---------------+ |         SSE (real-time
  |  | Gap Radar | | Signal Feed   | |         progress updates)
  |  | Dashboard | | Timeline      | |              |
  |  +-----------+ +---------------+ |              |
  |  +-----------------------------+ |              |
  |  |      Trend Bridge View      | |              |
  |  +-----------------------------+ |              |
  +----------------|-----------------+              |
                   | REST + SSE                     |
                   v                                |
  +----------------------------------+              |
  |  FastAPI Backend (Railway/Render) |<-------------+
  |                                  |
  |  +----------------------------+  |
  |  |    Request Router          |  |
  |  |  /gap-radar  /signals      |  |
  |  |  /trends     /markets      |  |
  |  +-------------|-------------+  |
  |                |                 |
  |  +----------------------------+  |
  |  |  Agent Orchestrator        |  |    +---------------------+
  |  |                            |--|--->| TinyFish Cloud API  |
  |  |  - Source Discovery (AI)   |  |    | POST /v1/automation |
  |  |  - Parallel Dispatch       |  |    |      /run-sse       |
  |  |  - Result Collection       |  |    |                     |
  |  |  - Failure Handling        |  |    | Up to 50 concurrent |
  |  +----------------------------+  |    | browser agents      |
  |                |                 |    +---------------------+
  |  +----------------------------+  |          |
  |  |  AI Synthesis Layer        |  |          | Scrapes live web:
  |  |  (OpenAI GPT-4o / 4.1)    |  |          | - Crunchbase
  |  |                            |  |          | - TechInAsia
  |  |  - Data structuring        |  |          | - App stores
  |  |  - Market scoring          |  |          | - VC blogs
  |  |  - Trend analysis          |  |          | - Grant portals
  |  |  - Opportunity ranking     |  |          | - Job boards
  |  +----------------------------+  |          | - Local news
  |                |                 |          | - Accelerator sites
  |  +----------------------------+  |
  |  |  Data Layer               |  |
  |  |  SQLite + In-Memory Cache |  |
  |  +----------------------------+  |
  +----------------------------------+
```

### Key Design Decisions

| Decision | Rationale |
|---|---|
| Python/FastAPI backend | Native async support for parallel TinyFish agents via asyncio; strong OpenAI SDK ecosystem |
| SSE over WebSockets | Simpler to implement; one-directional updates are sufficient; matches TinyFish's own SSE pattern |
| SQLite for persistence | Zero-config for hackathon; single-file DB; sufficient for demo-scale data |
| Next.js on Vercel | Zero-config deployment; server components for SEO; built-in API routes if needed |

---

## 2. Component Breakdown

### 2.1 Frontend (Next.js 14 + TypeScript + Tailwind + shadcn/ui)

```
frontend/
  app/
    page.tsx                  # Landing: search bar + value prop
    results/
      page.tsx                # Gap Radar results dashboard
  components/
    search-input.tsx          # Main input: business idea text
    market-card.tsx           # Single market score card (red/yellow/green)
    region-heatmap.tsx        # Grid of all markets with color scores
    agent-progress.tsx        # Real-time SSE progress display
    grant-card.tsx            # Grant opportunity cards
    signal-feed-list.tsx      # Chronological signal events
    opportunity-score.tsx     # Score visualization
    scan-header.tsx           # Scan metadata bar
  lib/
    api-client.ts             # HTTP client wrapping backend REST calls
    types.ts                  # Shared TypeScript type definitions
    utils.ts                  # Utility functions
    constants.ts              # Region configs, colors
  hooks/
    use-sse.ts                # Generic SSE connection hook
    use-market-data.ts        # Hook for fetching completed results
    use-scan.ts               # Full scan lifecycle hook
```

**Responsibilities:**
- Capture business idea input and target market preferences
- Establish SSE connection to backend for real-time agent progress
- Render market scoring heatmap with drill-down capability
- Display structured competitive landscape, signals, and opportunities

### 2.2 Backend API (FastAPI, Python 3.12+)

```
backend/
  main.py                     # FastAPI app factory, middleware, CORS
  config/
    settings.py               # Settings from environment variables
    regions.py                # Region metadata registry
    sources.py                # Data source registry
  api/
    gap_radar.py              # /api/v1/gap-radar endpoints
    signal_feed.py            # /api/v1/signals endpoints
    trend_bridge.py           # /api/v1/trends endpoints
  agents/
    orchestrator.py           # Agent orchestration engine
    tinyfish_client.py        # TinyFish API wrapper
    sources/
      crunchbase.py           # Crunchbase agent tasks
      techinasia.py           # TechInAsia agent tasks
      appstore.py             # App Store / Google Play agent tasks
      grants.py               # Government grant portal agent tasks
      news_local.py           # Local news extraction agent tasks
      job_boards.py           # Job board hiring velocity agent tasks
  synthesis/
    market_analyzer.py        # OpenAI synthesis pipeline
    prompts/
      gap_radar_system.txt    # Scoring system prompt
      market_brief_system.txt # Brief generation prompt
  models/
    scan.py                   # Request/response schemas
    market.py                 # Market data models
    competitor.py             # Competitor models
    signal.py                 # Signal models
    opportunity.py            # Opportunity/grant models
  cache/
    store.py                  # In-memory TTL cache
  db/
    database.py               # SQLite setup
  requirements.txt
```

### 2.3 Agent Orchestrator

The orchestrator is the backbone of Frontier. It converts a business idea into a set of parallel TinyFish scraping tasks, collects results, and feeds them to the synthesis layer.

**Core responsibilities:**
- Accept a parsed business idea and target regions
- Call the Source Discovery service to determine which URLs and goals to send to TinyFish
- Dispatch up to 50 concurrent TinyFish SSE agents using `asyncio.gather`
- Stream progress events back to the frontend via the SSE manager
- Collect results, handle partial failures, and pass structured data to synthesis
- Enforce per-query timeout (90 seconds max)

### 2.4 Data Pipeline

```
 Business Idea (text)
        |
        v
 [Source Discovery] -- OpenAI call: "Given this business idea and these
        |               target markets, return a JSON list of URLs and
        |               extraction goals for each data source category."
        v
 [Agent Dispatch] --- asyncio.gather over TinyFish SSE agents
        |              (competitor, appstore, grant, news, vc, jobs)
        |              Each agent: POST /v1/automation/run-sse
        v
 [Raw Results Collection] -- JSON blobs from each agent, tagged by
        |                     source category and target market
        v
 [AI Synthesis] -- OpenAI GPT-4o call with structured prompt:
        |           "Given these raw data extractions for [business idea]
        |            across [markets], produce: market scores, competitor
        |            landscape, open grants, trend signals."
        v
 [Structured Output] -- MarketAssessment[], Competitor[], Signal[],
        |                 Opportunity[] objects
        v
 [Persist + Return] -- Save to SQLite, return to frontend via SSE
```

### 2.5 AI Synthesis Layer

Two distinct OpenAI call patterns:

**Pattern A: Source Discovery (pre-scraping)**
- Input: Business idea text, target region list, source category list
- Output: JSON array of `{ url, goal, category, market, browser_profile, proxy_config }`
- Model: GPT-4o (fast, cheap)
- Purpose: The AI decides which specific URLs to scrape and how to phrase the TinyFish goal for each

**Pattern B: Data Synthesis (post-scraping)**
- Input: All raw TinyFish extraction results, grouped by market and category
- Output: Structured market intelligence (scores, competitors, signals, opportunities)
- Model: GPT-4o (latency is priority for hackathon)
- Purpose: Transform raw heterogeneous data into actionable, scored intelligence

---

## 3. Data Flow: Gap Radar Query

Step-by-step trace for a founder entering "AI-powered legal document translation for SMEs":

```
STEP  WHO                WHAT HAPPENS
----  -----------------  ------------------------------------------------
 1    Frontend           User types idea into search bar, selects target
                         markets (default: SEA + source markets).
                         POST /api/v1/gap-radar/scan with { idea, markets }

 2    Backend Router     Validates input. Creates a ScanRecord with
                         status=PENDING. Returns scan_id.
                         Opens SSE stream at /api/v1/gap-radar/stream/{scan_id}

 3    Frontend           Connects to SSE endpoint. Shows "Scanning Global
                         Signals..." animation with agent-progress component.

 4    Source Discovery    Backend calls OpenAI GPT-4o:
                         "For the business idea 'AI legal translation for
                         SMEs' in markets [Singapore, Indonesia, Vietnam,
                         India, USA], determine which URLs to scan.
                         Return JSON array of agent tasks."

                         OpenAI returns ~15-25 agent tasks, e.g.:
                         [
                           { url: "https://crunchbase.com/search",
                             goal: "Search for LegalTech and AI translation
                                    startups in Indonesia...",
                             category: "competitor",
                             market: "Indonesia",
                             browser_profile: "stealth" },
                           ...
                         ]

 5    SSE Broadcast      Backend sends SSE event to frontend:
                         { type: "SOURCES_IDENTIFIED", count: 22 }

 6    Agent Dispatch     Orchestrator fires all agents in parallel via
                         asyncio.gather. Each agent calls:
                         POST https://agent.tinyfish.ai/v1/automation/run-sse

 7    Progress Relay     As each TinyFish agent emits PROGRESS events,
                         the orchestrator relays them to the frontend SSE:
                         { type: "AGENT_PROGRESS",
                           category: "grant",
                           market: "Indonesia",
                           message: "Navigating MDI Ventures grant portal..." }

 8    Result Collection  Each agent completes. Orchestrator collects results.
                         Failed agents are logged and skipped.
                         SSE update: { type: "AGENT_COMPLETE",
                           category: "competitor", market: "Singapore",
                           status: "success" }

 9    Cache Write        Raw results cached with TTL key:
                         cache:{url_hash}:{goal_hash} -> raw_result (TTL 6h)

10    AI Synthesis       All raw results batched and sent to OpenAI GPT-4o
                         for structured market analysis.

11    Final SSE          Backend sends final SSE event:
                         { type: "COMPLETE",
                           result: { ... full GapRadarResult ... } }

12    Frontend           Renders the market heatmap, competitor table,
                         signal timeline, and opportunity panel.
                         Total elapsed time target: 30-60 seconds.
```

---

## 4. Agent Orchestration Pattern

### Three-Phase Pattern (mirrors TinyFish cookbook "TinySkills" architecture)

```
 Phase 1: SOURCE DISCOVERY          Phase 2: PARALLEL EXTRACTION        Phase 3: SYNTHESIS
 ========================          =========================           ==================

 Business idea + markets            Agent tasks (from Phase 1)          Raw results (from Phase 2)
         |                                   |                                  |
         v                                   v                                  v
  +-------------+                   +------------------+                +--------------+
  | OpenAI call |                   | asyncio.gather   |                | OpenAI call  |
  | "What URLs  |                   |                  |                | "Synthesize  |
  |  should we  |                   | +------+ +-----+ |                |  into scored |
  |  scan?"     |                   | |TF #1 | |TF #2| |                |  market      |
  +-------------+                   | +------+ +-----+ |                |  intelligence|
         |                          | +------+ +-----+ |                +--------------+
         v                          | |TF #3 | |TF #4| |                       |
  List of                           | +------+ +-----+ |                       v
  { url, goal,                      |    ...up to 50   |              GapRadarResult
    category,                       +------------------+              (structured JSON)
    market }                                 |
                                             v
                                    Raw JSON per agent
                                    (some may be errors)
```

### Orchestrator Pseudocode

```python
async def run_gap_radar(idea: str, markets: list[str], sse: SSEManager):
    # Phase 1: Source Discovery
    sse.send("PHASE", {"phase": "source_discovery"})
    agent_tasks = await discover_sources(idea, markets)
    sse.send("SOURCES_IDENTIFIED", {"count": len(agent_tasks)})

    # Phase 2: Parallel Extraction
    sse.send("PHASE", {"phase": "extraction"})

    semaphore = asyncio.Semaphore(MAX_CONCURRENT_AGENTS)

    async def run_single_agent(task):
        async with semaphore:
            cached = await cache.get(task.cache_key)
            if cached:
                sse.send("AGENT_COMPLETE", {**task.meta, "status": "cached"})
                return cached

            result = await tinyfish_sse_agent(
                url=task.url,
                goal=task.goal,
                on_progress=lambda msg: sse.send("AGENT_PROGRESS", {
                    **task.meta, "message": msg
                })
            )
            await cache.set(task.cache_key, result, ttl=21600)
            sse.send("AGENT_COMPLETE", {**task.meta, "status": "success"})
            return result

    results = await asyncio.gather(
        *[run_single_agent(t) for t in agent_tasks],
        return_exceptions=True
    )

    # Separate successes from failures
    successes, failures = partition_results(results, agent_tasks)

    # Phase 3: AI Synthesis
    sse.send("PHASE", {"phase": "synthesis"})
    structured = await synthesize_market_intelligence(idea, markets, successes)

    sse.send("COMPLETE", {"result": structured})
    return structured
```

### Concurrency Limits

| TinyFish Tier | Max Concurrent Agents | Strategy |
|---|---|---|
| Pay-as-you-go | 2 | Sequential batches of 2 |
| Starter | 10 | 2 batches of ~10 |
| Pro (hackathon target) | 50 | Single batch, all parallel |

---

## 5. API Endpoint Design

### 5.1 Gap Radar

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/v1/gap-radar/scan` | Submit a new Gap Radar query |
| `GET` | `/api/v1/gap-radar/stream/{scan_id}` | SSE stream for real-time progress |
| `GET` | `/api/v1/gap-radar/result/{scan_id}` | Fetch completed result (polling fallback) |

**POST /api/v1/gap-radar/scan**

Request:
```json
{
  "idea": "AI-powered legal document translation for SMEs",
  "target_markets": ["SG", "ID", "VN"],
  "source_markets": ["US", "IN", "BR"]
}
```

Response:
```json
{
  "scan_id": "qr_abc123",
  "status": "PROCESSING",
  "stream_url": "/api/v1/gap-radar/stream/qr_abc123"
}
```

### 5.2 Signal Feed

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/v1/signals` | Fetch latest signals (paginated) |
| `GET` | `/api/v1/signals/{region}` | Signals for a specific region |

### 5.3 Trend Bridge

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/v1/trends` | Fetch emerging trends with migration timeline |
| `GET` | `/api/v1/trends/{category}` | Detailed trend with supporting evidence |

### 5.4 Supporting Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/v1/markets` | List all supported markets with metadata |
| `GET` | `/health` | Backend health check |

---

## 6. Data Models

### Core Pydantic Schemas

```python
from pydantic import BaseModel, Field
from enum import Enum
from datetime import datetime

class MarketScore(str, Enum):
    GREEN = "green"     # Strong opportunity, low competition
    YELLOW = "yellow"   # Moderate opportunity or moderate competition
    RED = "red"         # Saturated or hostile market

class SignalType(str, Enum):
    FUNDING_ROUND = "funding_round"
    REGULATION = "regulation"
    ACCELERATOR_THEME = "accelerator_theme"
    HIRING_VELOCITY = "hiring_velocity"
    GRANT_OPENING = "grant_opening"

class AgentCategory(str, Enum):
    COMPETITOR = "competitor"
    APPSTORE = "appstore"
    GRANT = "grant"
    NEWS = "news"
    VC = "vc"
    JOBS = "jobs"

class QueryStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    PARTIAL = "partial"
    FAILED = "failed"

class Competitor(BaseModel):
    name: str
    market: str
    description: str
    funding_stage: str | None = None
    funding_amount_usd: float | None = None
    founded_year: int | None = None
    url: str | None = None
    source_url: str
    similarity_score: float = Field(ge=0, le=1)

class Signal(BaseModel):
    type: SignalType
    market: str
    title: str
    summary: str
    source_url: str
    extracted_at: datetime
    relevance_score: float = Field(ge=0, le=1)

class Opportunity(BaseModel):
    type: str                           # "grant", "accelerator_batch", "fund"
    title: str
    provider: str
    market: str
    description: str
    amount_usd: float | None = None
    deadline: datetime | None = None
    url: str
    relevance_score: float = Field(ge=0, le=1)

class MarketAssessment(BaseModel):
    market: str
    score: MarketScore
    score_numeric: int = Field(ge=0, le=100)
    score_rationale: str
    competitor_count: int
    competitors: list[Competitor]
    signals: list[Signal]
    opportunities: list[Opportunity]
    key_insight: str

class GapRadarResult(BaseModel):
    scan_id: str
    idea: str
    status: QueryStatus
    markets: list[MarketAssessment]
    trend_signal: str
    recommended_market: str
    summary: str
    created_at: datetime
    completed_at: datetime | None = None
    sources_scanned: int
    scan_duration_seconds: float

class AgentTask(BaseModel):
    url: str
    goal: str
    category: AgentCategory
    market: str
    browser_profile: str = "lite"
    proxy_config: dict | None = None
    cache_key: str
```

---

## 7. Caching Strategy

### Cache Key Design

```
cache:{sha256(url + "|" + normalized_goal)} -> raw_result_json
```

### TTL Strategy

| Source Category | TTL | Rationale |
|---|---|---|
| Competitor databases | 6 hours | Funding data changes infrequently |
| App store rankings | 4 hours | Rankings shift daily but not hourly |
| Government grant portals | 12 hours | Grant listings change slowly |
| Local news | 2 hours | News is time-sensitive |
| VC blogs | 6 hours | Blog posts do not change once published |
| Job boards | 4 hours | New postings appear throughout the day |

### Implementation

For hackathon: in-memory dict with TTL (`cachetools.TTLCache`). Loses persistence across restarts but avoids Redis infrastructure.

---

## 8. Error Handling and Graceful Degradation

### Failure Modes

| Failure Mode | Impact | Strategy |
|---|---|---|
| Single TinyFish agent fails | Low | Skip agent, proceed with remaining results |
| Multiple agents for same market fail | Medium | Flag market as "insufficient data" instead of scoring |
| All agents fail | High | Return error with "please retry" message |
| TinyFish rate limit hit | Medium | Exponential backoff with 1 retry |
| OpenAI source discovery fails | High | Fall back to hardcoded source map |
| OpenAI synthesis fails | High | Return raw extracted data without scoring |

### Implementation

```python
results = await asyncio.gather(
    *[run_single_agent(t) for t in agent_tasks],
    return_exceptions=True    # Critical: do not let one failure cancel all
)

successes = [r for r in results if not isinstance(r, Exception) and r is not None]
failures = [r for r in results if isinstance(r, Exception) or r is None]

if len(successes) == 0:
    status = QueryStatus.FAILED
elif len(failures) > 0:
    status = QueryStatus.PARTIAL
else:
    status = QueryStatus.COMPLETED
```

### Frontend Degradation

| Scenario | Frontend Behavior |
|---|---|
| All markets scored | Full heatmap with drill-down |
| Some markets missing data | Scored markets + grayed-out cards with "Limited data" badge |
| Synthesis failed | Raw data in "Source Extracts" accordion view |
| Complete failure | Error state with "Retry" button |

---

## 9. SSE Streaming to Frontend

### Event Protocol

```
event: frontier
data: {"type": "<EVENT_TYPE>", "timestamp": "<ISO8601>", ...payload}
```

### Event Types

| Event Type | Payload | When Emitted |
|---|---|---|
| `QUERY_ACCEPTED` | `{ scan_id }` | Query received |
| `PHASE` | `{ phase }` | Major phase transition |
| `SOURCES_IDENTIFIED` | `{ count }` | Source discovery complete |
| `AGENT_STARTED` | `{ agent_id, category, market }` | Agent dispatched |
| `AGENT_PROGRESS` | `{ agent_id, category, market, message }` | TinyFish PROGRESS relayed |
| `AGENT_COMPLETE` | `{ agent_id, category, market, status }` | Agent finished |
| `COMPLETE` | `{ scan_id, result }` | Final result |
| `ERROR` | `{ code, message }` | Unrecoverable error |
| `HEARTBEAT` | `{}` | Every 15 seconds |

### Backend Implementation

```python
from fastapi.responses import StreamingResponse

class SSEManager:
    def __init__(self):
        self.queue: asyncio.Queue = asyncio.Queue()

    async def send(self, event_type: str, payload: dict):
        event = {"type": event_type, "timestamp": utcnow_iso(), **payload}
        await self.queue.put(event)

    async def stream(self):
        while True:
            try:
                event = await asyncio.wait_for(self.queue.get(), timeout=15)
                yield f"event: frontier\ndata: {json.dumps(event)}\n\n"
                if event["type"] in ("COMPLETE", "ERROR"):
                    break
            except asyncio.TimeoutError:
                yield f"event: frontier\ndata: {json.dumps({'type': 'HEARTBEAT'})}\n\n"

@app.get("/api/v1/gap-radar/stream/{scan_id}")
async def stream_scan(scan_id: str):
    sse = get_sse_manager(scan_id)
    return StreamingResponse(
        sse.stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "Connection": "keep-alive"},
    )
```

### Progress UX During Scanning

```
  Scanning Global Signals...
  ==========================================

  Phase: Extracting data (14/22 agents active)

  [v] Crunchbase (Singapore)      -- 2 competitors found
  [v] TechInAsia (Indonesia)      -- 3 articles extracted
  [~] DailySocial.id (Indonesia)  -- Navigating to search results...
  [~] MDI Ventures (Indonesia)    -- Checking open grant programs...
  [ ] Google Play (Vietnam)       -- Queued
  [x] VNExpress (Vietnam)         -- Failed: timeout

  ==========================================
  [v] Complete  [~] In progress  [ ] Queued  [x] Failed
```

---

## 10. Security Considerations

### API Key Management

- TinyFish and OpenAI keys never leave the backend
- All secrets loaded via environment variables
- `.env` in `.gitignore`
- Frontend never calls TinyFish or OpenAI directly

### CORS Configuration

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)
```

### TinyFish Goal Injection Prevention

User input is embedded as a quoted reference within structured goal templates, not passed as raw goals:

```python
goal_template = (
    f'Search for companies related to the following business concept: '
    f'"{sanitized_idea}". '
    f'Extract company name, funding stage, funding amount, and description. '
    f'Return as JSON array.'
)
```

### Input Validation

```python
class ScanRequest(BaseModel):
    idea: str = Field(min_length=10, max_length=500)
    target_markets: list[str] = Field(default=["SG", "ID", "VN"], max_length=10)
```

---

## Appendix A: Cost Estimation (Per Query)

| Component | Units | Cost |
|---|---|---|
| TinyFish agents (20 agents x ~5 steps each) | 100 steps | $1.50 |
| OpenAI source discovery (GPT-4o, ~2K tokens) | 1 call | ~$0.01 |
| OpenAI synthesis (GPT-4o, ~8K tokens) | 1 call | ~$0.15 |
| **Total per query** | | **~$1.66** |

With caching, repeat queries drop to ~$0.15-0.50.

---

## Appendix B: Implementation Priority

| Priority | Component | Est. Time |
|---|---|---|
| P0 | TinyFish agent wrapper with SSE | 2 hours |
| P0 | Orchestrator with asyncio.gather | 2 hours |
| P0 | OpenAI synthesis pipeline | 2 hours |
| P0 | Frontend: search bar + SSE progress | 2 hours |
| P0 | Frontend: market heatmap + score cards | 2 hours |
| P1 | Source discovery via OpenAI | 1.5 hours |
| P1 | In-memory caching layer | 1 hour |
| P1 | Frontend: competitor table + opportunities | 1.5 hours |
| P2 | Signal Feed module | 2 hours |
| P2 | Trend Bridge module | 2 hours |

**Minimum viable demo (P0 only): ~10 hours of focused work.**
