# CLAUDE.md — Frontier

> Market intelligence platform for founders. Scans global markets to find geographic gaps for business ideas.
> Built for the TinyFish x OpenAI Hackathon, Singapore.

---

## Project Overview

Frontier is an AI-powered market arbitrage engine. A founder types in a business idea, and Frontier fires parallel TinyFish web agents across dozens of sources — local news, VC blogs, app stores, grant portals, accelerator pages — in multiple languages and regions. It returns structured market intelligence: where the idea is proven, where it has zero penetration, what funding is available, and what timing signals exist.

The core value proposition: "We scan every market in the world so founders can find where their idea is a gap, not a graveyard."

### Three Core Modules

1. **Gap Radar** (flagship, demo centerpiece) — Takes a business model, finds markets where it is proven, checks if an equivalent exists in the target market, scores the opportunity window.
2. **Signal Feed** — Real-time monitoring of funding activity, regulatory changes, accelerator cohort themes, hiring velocity across SEA and source markets.
3. **Trend Bridge** — Surfaces emerging categories from mature markets (US, India, Brazil, Nigeria) that are 12-24 months from reaching SEA.

For the hackathon demo, Gap Radar is the priority. Signal Feed and Trend Bridge are stretch goals.

---

## Tech Stack

### Backend — Python 3.12+ with FastAPI

- **Why FastAPI:** Native async/await support is critical for parallel TinyFish agent execution. SSE streaming support built in. Pydantic models give us typed request/response validation for free. Fast to prototype.
- **Key libraries:**
  - `fastapi` + `uvicorn` — API server
  - `aiohttp` — Async HTTP client for parallel TinyFish SSE streams
  - `openai` — OpenAI Python SDK for GPT-4o synthesis
  - `pydantic` — Data models and validation
  - `python-dotenv` — Environment variable loading
  - `sse-starlette` — Server-Sent Events for streaming results to the frontend

### Frontend — Next.js 14+ (React, TypeScript)

- **Why Next.js:** Fast to scaffold, good defaults for a demo. App Router for clean page structure. Server components where useful, but primarily client-side for the interactive dashboard.
- **Key libraries:**
  - `tailwindcss` — Rapid UI styling
  - `framer-motion` — Animations for the scanning/progress UX
  - `eventsource` or native `EventSource` — Consuming SSE from the backend

### External Services

- **TinyFish Web Agent API** — Cloud browser automation for live web data extraction
- **OpenAI GPT-4o** — Synthesis of raw extracted data into structured market briefs

---

## Architecture

### Three-Phase Pipeline

```
User Input (business idea)
        |
        v
[Phase 1: Source Discovery]
  OpenAI generates a target list: URLs + goals for each market/source
  Output: list of {url, goal, market, source_type} objects
        |
        v
[Phase 2: Parallel Extraction]
  Fire N TinyFish agents simultaneously via asyncio.gather
  Each agent: POST /v1/automation/run-sse with url + goal
  Stream PROGRESS events to frontend in real time
  Collect COMPLETE results, handle failures gracefully
        |
        v
[Phase 3: AI Synthesis]
  Feed all raw extraction results to GPT-4o
  Prompt: structure into market brief with scores, signals, opportunities
  Output: MarketReport with per-region assessments
        |
        v
Frontend Dashboard (renders structured report)
```

### Key Data Flow

```
Frontend --POST /api/scan {idea}--> Backend
Backend --OpenAI call--> Source plan (URLs + goals)
Backend --N parallel TinyFish SSE streams--> Raw results[]
Backend --OpenAI call--> Structured MarketReport
Backend --SSE stream--> Frontend (progress + final report)
```

---

## Environment Variables

Create a `.env` file in the project root. Never commit it.

```bash
# Required
TINYFISH_API_KEY=sk-tinyfish-xxxxx      # From https://agent.tinyfish.ai/api-keys
OPENAI_API_KEY=sk-xxxxx                  # From OpenAI dashboard (hackathon credits)

# Optional
OPENAI_MODEL=gpt-4o                      # Default model for synthesis
TINYFISH_BROWSER_PROFILE=stealth         # "lite" (faster) or "stealth" (anti-detection)
TINYFISH_MAX_CONCURRENT=5                # Max parallel agents (respect tier limits)
FRONTEND_URL=http://localhost:3000       # For CORS config
LOG_LEVEL=INFO                           # DEBUG for development
```

The `.env.example` file should contain the same keys with placeholder values.

---

## How to Run Locally

### Prerequisites

- Python 3.12+
- Node.js 20+
- npm or pnpm

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp ../.env.example ../.env      # Then fill in real keys
uvicorn main:app --reload --port 8000
```

Backend will be at `http://localhost:8000`. API docs at `http://localhost:8000/docs`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will be at `http://localhost:3000`.

### Quick Smoke Tests

```bash
# Verify TinyFish API key works
python scripts/test_tinyfish.py

# Verify OpenAI API key works
python scripts/test_openai.py
```

---

## Key Commands

```bash
# Backend
uvicorn main:app --reload --port 8000          # Dev server with hot reload
pytest                                          # Run tests
ruff check backend/                            # Lint
ruff format backend/                           # Format

# Frontend
npm run dev                                     # Dev server (port 3000)
npm run build                                   # Production build
npm run lint                                    # ESLint
npx prettier --write .                         # Format
```

---

## Code Conventions

### Python (Backend)

- **Formatter/linter:** Ruff (replaces black + isort + flake8)
- **Type hints:** Required on all function signatures
- **Naming:** `snake_case` for files, functions, variables. `PascalCase` for classes and Pydantic models.
- **Import order:** stdlib, third-party, local (Ruff enforces this)
- **Async by default:** All service functions that call external APIs must be `async def`
- **Pydantic models:** All API request/response bodies and internal data structures
- **Error handling:** Never let TinyFish/OpenAI failures crash the pipeline. Catch, log, return partial results.

### TypeScript (Frontend)

- **Formatter/linter:** ESLint + Prettier (Next.js defaults)
- **Naming:** `PascalCase` for components and types. `camelCase` for functions and variables. `kebab-case` for filenames except components.
- **Components:** Functional components only. Props typed with interfaces, not inline.
- **State:** React hooks. No Redux — overkill for this scope.
- **Imports:** React/Next.js first, third-party second, local last.

### General

- Commit messages: imperative mood, lowercase, no period. Example: `add parallel extraction service`
- Branch naming: `feature/gap-radar`, `fix/sse-parsing`, `demo/final-polish`
- No `console.log` in committed code (frontend). Use `logger` (backend).
- All secrets in `.env`, never hardcoded.

---

## API Patterns

### TinyFish SSE Streaming (Canonical Pattern)

This is the core pattern for every TinyFish call. Use aiohttp, not requests, for async streaming.

```python
import asyncio
import aiohttp
import json
import os
from typing import Optional

TINYFISH_URL = "https://agent.tinyfish.ai/v1/automation/run-sse"

async def run_tinyfish_agent(
    session: aiohttp.ClientSession,
    url: str,
    goal: str,
    on_progress: Optional[callable] = None,
) -> dict:
    """Run a single TinyFish agent and return the COMPLETE event result."""
    headers = {
        "X-API-Key": os.getenv("TINYFISH_API_KEY"),
        "Content-Type": "application/json",
    }
    payload = {
        "url": url,
        "goal": goal,
        "browser_profile": os.getenv("TINYFISH_BROWSER_PROFILE", "stealth"),
    }

    async with session.post(TINYFISH_URL, headers=headers, json=payload) as resp:
        async for line in resp.content:
            line_str = line.decode("utf-8").strip()
            if not line_str.startswith("data: "):
                continue
            event = json.loads(line_str[6:])
            if event["type"] == "PROGRESS" and on_progress:
                await on_progress(event.get("purpose", ""))
            elif event["type"] == "COMPLETE":
                if event.get("status") == "COMPLETED":
                    return {"success": True, "result": event.get("result")}
                return {"success": False, "error": event.get("error", {})}

    return {"success": False, "error": {"message": "Stream ended without COMPLETE event"}}
```

### Parallel Execution (Core of Phase 2)

```python
async def extract_all(targets: list[dict]) -> list[dict]:
    """Fire all TinyFish agents in parallel. Failures return error dicts, not exceptions."""
    async with aiohttp.ClientSession() as session:
        tasks = [
            run_tinyfish_agent(session, t["url"], t["goal"])
            for t in targets
        ]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        return [
            r if not isinstance(r, Exception) else {"success": False, "error": str(r)}
            for r in results
        ]
```

### Frontend SSE Consumption

```typescript
function streamScan(idea: string, onProgress: (msg: string) => void): Promise<MarketReport> {
  return new Promise((resolve, reject) => {
    const eventSource = new EventSource(`/api/scan/stream?idea=${encodeURIComponent(idea)}`);

    eventSource.addEventListener("progress", (e) => {
      onProgress(JSON.parse(e.data).message);
    });

    eventSource.addEventListener("complete", (e) => {
      resolve(JSON.parse(e.data) as MarketReport);
      eventSource.close();
    });

    eventSource.addEventListener("error", (e) => {
      reject(new Error("Scan stream failed"));
      eventSource.close();
    });
  });
}
```

### OpenAI Call Pattern

```python
from openai import AsyncOpenAI

client = AsyncOpenAI()

async def synthesize_report(idea: str, raw_results: list[dict]) -> dict:
    """Phase 3: Synthesize raw TinyFish extractions into a structured market report."""
    response = await client.chat.completions.create(
        model=os.getenv("OPENAI_MODEL", "gpt-4o"),
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": SYNTHESIS_SYSTEM_PROMPT},
            {"role": "user", "content": json.dumps({"idea": idea, "raw_data": raw_results})},
        ],
    )
    return json.loads(response.choices[0].message.content)
```

---

## TinyFish Goal Writing Guide

Goals are the most important variable in extraction quality. Follow these rules:

1. **Be specific about output format.** Always end goals with `"Return as JSON with fields: ..."`.
2. **Set scope limits.** `"Extract the first 10 results"` not `"Extract all results"`.
3. **Handle missing data.** `"If a field is not found, set to null."`
4. **Name the data you want.** `"company name, funding amount, funding stage, date, investors"` not `"funding info"`.
5. **One goal per agent.** Do not try to do 5 things in one goal. Split into separate agents.

### Example Goals for Frontier

```python
# Competitor search
"Search for companies doing '{idea}' in {market}. Return JSON array with fields: company_name, description, funding_total, funding_stage, founding_year, url. Limit to first 10 results. If a field is not found, set to null."

# Funding signals
"Find recent funding rounds or investments related to '{sector}' in {region} from the last 6 months. Return JSON array with fields: company_name, amount, currency, round_type, date, investors, source_url. Limit to 10 results."

# Grant discovery
"Find open grants, funding programs, or government incentives for '{sector}' businesses in {country}. Return JSON array with fields: program_name, organization, amount, deadline, eligibility_summary, url. Only include currently open programs."
```

---

## Hackathon Constraints

### Time Budget

This is a one-day hackathon. Ruthless prioritization.

| Priority | Task | Time |
|----------|------|------|
| P0 | Backend pipeline (3 phases working end to end) | 3-4 hours |
| P0 | Frontend input + results display | 2-3 hours |
| P0 | Demo polish (loading states, animations, sample data fallback) | 1-2 hours |
| P1 | Error handling and retry logic | 1 hour |
| P1 | Multiple market regions | 30 min |
| P2 | Signal Feed module | Only if time permits |
| P2 | Trend Bridge module | Only if time permits |

### API Credit Budget

- TinyFish: ~$0.015 per step, complex tasks 10-30 steps. Budget roughly $0.15-0.45 per agent run.
- OpenAI: GPT-4o is ~$2.50/1M input tokens, $10/1M output tokens. Synthesis calls are cheap.
- **Rule:** During development, test with 2-3 agents max. Save full parallel runs (5-8 agents) for the demo.
- **Rule:** Cache results aggressively during development. Do not re-run TinyFish for the same query.

### Demo-First Development

- Build the happy path first. Make the demo flow work perfectly for ONE example query (e.g., "AI legal translation for SMEs").
- Hard-code fallback data for the demo in case live APIs are slow or flaky during presentation.
- The progress animation (showing agents scanning in real time) is as important as the final result for wow factor.
- Target: idea input to full report in under 60 seconds.

### What NOT to Build

- No user authentication
- No database (in-memory or flat file cache is fine)
- No payment integration
- No production deployment pipeline
- No comprehensive error pages — a simple error toast is enough

---

## Key Pydantic Models

```python
from pydantic import BaseModel
from enum import Enum

class ScanRequest(BaseModel):
    idea: str                          # "AI legal translation for SMEs"
    target_markets: list[str] = ["singapore", "indonesia", "vietnam", "india"]

class MarketScore(str, Enum):
    HIGH_OPPORTUNITY = "high"          # Green — gap exists, signals positive
    MODERATE = "moderate"              # Yellow — some competition or unclear signals
    SATURATED = "saturated"            # Red — crowded market
    INSUFFICIENT_DATA = "unknown"      # Gray — could not gather enough data

class MarketAssessment(BaseModel):
    market: str                        # "Indonesia"
    score: MarketScore
    competitors_found: int
    competitor_names: list[str]
    funding_signals: list[str]         # Recent relevant funding headlines
    regulatory_signals: list[str]      # Relevant policy/regulation notes
    opportunity_summary: str           # 2-3 sentence summary
    grants: list[dict]                 # Open grants/programs if found
    confidence: float                  # 0-1, based on data quality

class MarketReport(BaseModel):
    idea: str
    markets: list[MarketAssessment]
    trend_signal: str                  # Cross-market trend summary
    recommended_market: str            # Best opportunity
    generated_at: str                  # ISO timestamp
    sources_scanned: int
    scan_duration_seconds: float
```

---

## Testing Approach

### For the Hackathon

Testing is minimal. Focus on two things:

1. **Smoke tests** — Verify API keys work and basic TinyFish/OpenAI calls return data. Run these first thing after setup.

2. **Pipeline integration test** — Run the full 3-phase pipeline once with a known query to verify end-to-end flow before building the frontend.

### What We Skip

- Unit tests for individual functions (hackathon trade-off)
- Frontend tests
- Load testing
- E2E browser tests

---

## Common Pitfalls

1. **TinyFish SSE parsing:** Lines may arrive chunked. Always check for `data: ` prefix and handle partial lines.
2. **TinyFish timeouts:** Complex goals can take 30-60 seconds. Set `aiohttp` timeout to 120 seconds minimum.
3. **Parallel agent limits:** Hackathon tier may limit concurrent agents. If you get `RATE_LIMIT_EXCEEDED`, reduce `TINYFISH_MAX_CONCURRENT`.
4. **OpenAI JSON mode:** Always set `response_format={"type": "json_object"}` and mention JSON in the system prompt. Otherwise GPT-4o may return markdown-wrapped JSON.
5. **CORS:** FastAPI needs explicit CORS middleware for the Next.js frontend on a different port.
6. **SSE from backend to frontend:** Use `sse-starlette` or FastAPI `StreamingResponse` with proper `text/event-stream` content type.
7. **Goal drift:** TinyFish agents work best with short, precise goals. If extraction quality is poor, simplify the goal rather than making it longer.

---

## Reference Links

| Resource | URL |
|----------|-----|
| TinyFish API Docs | https://docs.tinyfish.ai |
| TinyFish SSE Endpoint | https://docs.tinyfish.ai/api-reference/automation/run-browser-automation-with-sse-streaming |
| TinyFish Cookbook | https://github.com/tinyfish-io/tinyfish-cookbook |
| TinyFish Python SDK | https://github.com/tinyfish-io/agent-sdk-python |
| OpenAI API Docs | https://platform.openai.com/docs |
| FastAPI Docs | https://fastapi.tiangolo.com |
| Next.js Docs | https://nextjs.org/docs |
