# TinyFish Web Agent -- Complete Technical Reference

> Consolidated from tinyfish.ai, docs.tinyfish.ai, GitHub tinyfish-io org, and raw API docs.
> Prepared for the TinyFish x OpenAI Hackathon (Frontier project).

---

## 1. What TinyFish Is

TinyFish is **enterprise infrastructure for AI web agents**. It is a fully managed, cloud-hosted browser automation API. You send a URL and a natural language goal, and get back structured JSON. It handles navigation, form filling, JavaScript rendering, anti-bot bypassing, proxy rotation, and multi-step workflows -- all without you managing browsers, selectors, or proxies.

**Tagline:** "SOTA web agents in an API"

You describe *what* you want in plain English. TinyFish's AI agent figures out *how* to do it in a real browser.

### Core Capabilities

- **Natural language control** -- no CSS selectors, no XPath
- **Real-time streaming** -- Server-Sent Events for live progress
- **Anti-detection** -- stealth mode for bot-protected sites (Cloudflare, DataDome)
- **Proxy support** -- geo routing: US, GB, CA, DE, FR, JP, AU
- **Full JS rendering** -- SPAs (React, Vue, Angular), infinite scroll, lazy loading
- **Authentication** -- login flows described directly in the goal
- **Parallel execution** -- up to 1,000 simultaneous operations
- **Credential vault** -- secure storage for reusable credentials

### Performance

| Metric | Value |
|--------|-------|
| Simple page extraction | 3-10 seconds |
| Complex multi-step tasks | 30-60 seconds |
| 50 portals benchmark | 2 min 14 sec (vs 45+ min traditional) |
| Success rate | 98.7% |
| Cost per operation | ~$0.04 all-in |
| Mind2Web benchmark | 90% accuracy |

---

## 2. API Endpoints

### 2a. Run Automation with SSE Streaming (Primary)

```
POST https://agent.tinyfish.ai/v1/automation/run-sse
```

**Headers:**
```
X-API-Key: <your_api_key>
Content-Type: application/json
```

**Request Body:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `url` | string (URI) | Yes | Target website URL |
| `goal` | string | Yes | Natural language task description |
| `browser_profile` | string enum | No | `"lite"` (default, faster) or `"stealth"` (anti-detection) |
| `proxy_config.enabled` | boolean | No | Enable proxy routing |
| `proxy_config.country_code` | string enum | No | `US`, `GB`, `CA`, `DE`, `FR`, `JP`, `AU` |
| `api_integration` | string | No | Integration name (e.g., "dify", "zapier", "n8n") |
| `use_vault` | boolean | No | Use vault credentials (default false) |
| `credential_item_ids` | array[string] | No | Specific vault credential IDs |

**SSE Event Types:**

```
STARTED       -> { type, run_id, timestamp }
STREAMING_URL -> { type, run_id, streaming_url, timestamp }  // live browser view, valid 24h
PROGRESS      -> { type, run_id, purpose, timestamp }         // step descriptions
COMPLETE      -> { type, run_id, status, result, error, help_url, help_message, timestamp }
HEARTBEAT     -> { type, timestamp }
```

### 2b. Run Automation Synchronous

```
POST https://agent.tinyfish.ai/v1/automation/run
```

Same parameters as SSE endpoint. Returns a single JSON response when complete (blocking).

**Response:**
```json
{
  "status": "COMPLETED",
  "result": { ... }
}
```

### 2c. Run Automation Async

Returns `run_id` immediately. Poll with get_run.

### 2d. Batch Operations

Up to 100 runs in a single request.

### 2e. Run Management

- **Get run** -- retrieve status/results by run_id
- **Cancel run** -- stop a running automation
- **Search runs** -- filter by status and date range

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success / SSE stream |
| 400 | Invalid request parameters |
| 401 | Missing or invalid API key |
| 403 | Insufficient credits / no subscription |
| 500 | Server error |

### Error Codes

Returned as `{ error: { code, message, details } }`:

`MISSING_API_KEY`, `INVALID_API_KEY`, `INVALID_INPUT`, `RATE_LIMIT_EXCEEDED`, `INSUFFICIENT_CREDITS`, `CONTENT_POLICY_VIOLATION`, `MAX_STEPS_EXCEEDED`, `SITE_BLOCKED`, `TASK_FAILED`, `CANCELLED`, `TIMEOUT`, `SERVICE_BUSY`, `INTERNAL_ERROR`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`

---

## 3. Authentication

### REST API: API Key

1. Sign up at https://agent.tinyfish.ai/signup
2. Create key at https://agent.tinyfish.ai/api-keys (shown only once)
3. Pass as header: `X-API-Key: <key>`
4. Or set env var: `TINYFISH_API_KEY=sk-tinyfish-*****`

### MCP: OAuth 2.1

For Claude/Cursor, uses browser-based OAuth flow. Auto-completes if already signed in.

---

## 4. Code Examples

### 4a. Python -- Synchronous (Simplest)

```python
import os
from dotenv import load_dotenv
import requests

load_dotenv()

def run_automation(url: str, goal: str):
    response = requests.post(
        "https://agent.tinyfish.ai/v1/automation/run",
        headers={
            "X-API-Key": os.environ["TINYFISH_API_KEY"],
            "Content-Type": "application/json",
        },
        json={"url": url, "goal": goal},
    )
    run = response.json()
    if run["status"] == "COMPLETED":
        return run["result"]
    raise Exception(run.get("error", {}).get("message", "Automation failed"))

result = run_automation(
    "https://example.com/products",
    "Extract all product names and prices. Return as JSON array."
)
print(result)
```

### 4b. Python -- SSE Streaming

```python
import json
import os
import requests

response = requests.post(
    "https://agent.tinyfish.ai/v1/automation/run-sse",
    headers={
        "X-API-Key": os.getenv("TINYFISH_API_KEY"),
        "Content-Type": "application/json",
    },
    json={
        "url": "https://example.com",
        "goal": "Extract all product names, prices, and descriptions. Return as JSON."
    },
    stream=True,
)

for line in response.iter_lines():
    if line:
        line_str = line.decode("utf-8")
        if line_str.startswith("data: "):
            event = json.loads(line_str[6:])
            if event["type"] == "PROGRESS":
                print(f"Step: {event.get('purpose', '')}")
            elif event["type"] == "COMPLETE":
                if event["status"] == "COMPLETED":
                    print("Result:", event["result"])
                else:
                    print("Failed:", event.get("error"))
```

### 4c. Python -- Official SDK

```python
from tinyfish import TinyFish, EventType, RunStatus, BrowserProfile, ProxyConfig, ProxyCountryCode

client = TinyFish()  # reads TINYFISH_API_KEY from env

# Basic extraction
with client.agent.stream(
    url="https://scrapeme.live/shop/Bulbasaur/",
    goal="Extract the product name, price, and stock status",
) as stream:
    for event in stream:
        if event.type == EventType.COMPLETE and event.status == RunStatus.COMPLETED:
            print("Result:", event.result_json)

# With stealth + proxy
with client.agent.stream(
    url="https://protected-site.com",
    goal="Extract pricing data",
    browser_profile=BrowserProfile.STEALTH,
    proxy_config=ProxyConfig(enabled=True, country_code=ProxyCountryCode.US),
) as stream:
    for event in stream:
        if event.type == EventType.COMPLETE and event.status == RunStatus.COMPLETED:
            print("Result:", event.result_json)
```

### 4d. TypeScript -- Synchronous

```typescript
async function runAutomation(url: string, goal: string) {
    const response = await fetch("https://agent.tinyfish.ai/v1/automation/run", {
        method: "POST",
        headers: {
            "X-API-Key": process.env.TINYFISH_API_KEY!,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, goal }),
    });

    const run = await response.json();
    if (run.status === "COMPLETED") {
        return run.result;
    }
    throw new Error(run.error?.message || "Automation failed");
}

const result = await runAutomation(
    "https://example.com/products",
    "Extract all product names and prices. Return JSON array."
);
console.log(result);
```

### 4e. TypeScript -- SSE Streaming

```typescript
const response = await fetch("https://agent.tinyfish.ai/v1/automation/run-sse", {
    method: "POST",
    headers: {
        "X-API-Key": process.env.TINYFISH_API_KEY!,
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        url: "https://example.com",
        goal: "Find all subscription plans and prices. Return JSON.",
    }),
});

const reader = response.body!.getReader();
const decoder = new TextDecoder();

while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const lines = decoder.decode(value).split("\n");
    for (const line of lines) {
        if (line.startsWith("data: ")) {
            const event = JSON.parse(line.slice(6));
            if (event.type === "COMPLETE") {
                console.log("Result:", event.result);
            }
        }
    }
}
```

### 4f. TypeScript -- Official SDK

```typescript
import { TinyFish, EventType, RunStatus, BrowserProfile, ProxyCountryCode } from "@tiny-fish/sdk";

const client = new TinyFish();

const stream = await client.agent.stream({
    url: "https://scrapeme.live/shop/Bulbasaur/",
    goal: "Extract the product name, price, and stock status",
});

for await (const event of stream) {
    if (event.type === EventType.COMPLETE && event.status === RunStatus.COMPLETED) {
        console.log("Result:", event.result);
    }
}
```

### 4g. cURL

```bash
curl -N -X POST https://agent.tinyfish.ai/v1/automation/run-sse \
  -H "X-API-Key: $TINYFISH_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "goal": "Find all subscription plans and prices"
  }'
```

### 4h. CLI

```bash
tinyfish agent run "Extract the product name, price, and stock status" \
  --url scrapeme.live/shop/Bulbasaur/ --pretty
```

### 4i. Stealth + Proxy Configuration

```bash
curl -N -X POST https://agent.tinyfish.ai/v1/automation/run-sse \
  -H "X-API-Key: $TINYFISH_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://protected-site.com",
    "goal": "Extract all pricing data",
    "browser_profile": "stealth",
    "proxy_config": {
      "enabled": true,
      "country_code": "US"
    }
  }'
```

---

## 5. Parallel Execution Pattern (Key for Frontier)

### Python: asyncio + aiohttp

```python
import asyncio
import aiohttp
import json
import os

API_URL = "https://agent.tinyfish.ai/v1/automation/run-sse"
API_KEY = os.getenv("TINYFISH_API_KEY")

async def run_agent(session, url, goal):
    headers = {
        "X-API-Key": API_KEY,
        "Content-Type": "application/json",
    }
    payload = {"url": url, "goal": goal, "browser_profile": "stealth"}

    async with session.post(API_URL, headers=headers, json=payload) as resp:
        result = None
        async for line in resp.content:
            line_str = line.decode("utf-8").strip()
            if line_str.startswith("data: "):
                event = json.loads(line_str[6:])
                if event.get("type") == "COMPLETE":
                    result = event
        return result

async def scan_markets(targets):
    async with aiohttp.ClientSession() as session:
        tasks = [run_agent(session, t["url"], t["goal"]) for t in targets]
        return await asyncio.gather(*tasks, return_exceptions=True)

# Example: parallel market scanning
targets = [
    {"url": "https://crunchbase.com", "goal": "Search for AI tutoring companies in Vietnam. Return JSON with name, funding, stage."},
    {"url": "https://techinasia.com", "goal": "Find edtech funding articles in SEA. Return JSON with title, date, summary."},
    {"url": "https://producthunt.com", "goal": "Search AI tutoring products from last 6 months. Return JSON with name, tagline, upvotes."},
]
results = asyncio.run(scan_markets(targets))
```

### JavaScript: Promise.allSettled

```javascript
async function runAgent(url, goal) {
    const response = await fetch("https://agent.tinyfish.ai/v1/automation/run-sse", {
        method: "POST",
        headers: { "X-API-Key": process.env.TINYFISH_API_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ url, goal, browser_profile: "stealth" }),
    });
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let result = null;
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        for (const line of decoder.decode(value).split("\n")) {
            if (line.startsWith("data: ")) {
                const event = JSON.parse(line.slice(6));
                if (event.type === "COMPLETE") result = event;
            }
        }
    }
    return result;
}

const results = await Promise.allSettled([
    runAgent("https://crunchbase.com", "Search AI tutoring in Vietnam..."),
    runAgent("https://techinasia.com", "Find SEA edtech funding..."),
    runAgent("https://producthunt.com", "Search AI tutoring products..."),
]);
```

---

## 6. MCP Integration (Claude / Cursor / Claude Code)

### Setup

**Claude Desktop** (`~/Library/Application Support/Claude/claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "tinyfish": {
      "url": "https://agent.tinyfish.ai/mcp"
    }
  }
}
```

**Claude Code:**
```bash
claude mcp add --transport http tinyfish https://agent.tinyfish.ai/mcp
```

**Cursor** (MCP settings):
```json
{
  "mcpServers": {
    "tinyfish": {
      "url": "https://agent.tinyfish.ai/mcp"
    }
  }
}
```

### MCP Tools

| Tool | Description | Key Params |
|------|------------|------------|
| `run_web_automation` | Sync execution with streaming | url, goal, browser_profile, proxy_config |
| `run_web_automation_async` | Background execution, returns run_id | url, goal, browser_profile, proxy_config |
| `get_run` | Get status/results by ID | id |
| `list_runs` | Query history | status, cursor, limit (1-100) |

---

## 7. Goal Writing Best Practices

### Define Output Schema
```
"Extract all products. Return JSON array where each item has: name (string), price (number), currency (string), in_stock (boolean), url (string)"
```

### Set Termination Conditions
```
"Scrape the first 5 pages. Stop if no 'Next' button or page 5 reached."
```

### Handle Edge Cases
```
"If price shows 'Contact Us', set price to null and price_type to 'contact_required'. If field missing, set to null. On CAPTCHA, stop and return partial data."
```

### Request Structured Errors
```
"If extraction fails, return: { success: false, error_type: 'timeout|blocked|not_found', message: '...', partial_results: [...] }"
```

### Multi-Step Workflows
```
"1. Go to login page. 2. Enter username 'user@example.com' and password from vault. 3. Navigate to dashboard. 4. Extract all recent transactions with date, amount, description."
```

---

## 8. Response Handling

### Three response categories:

**1. Success** (status=COMPLETED, result has data):
```python
if event["status"] == "COMPLETED" and event["result"]:
    data = event["result"]
```

**2. Goal failure** (status=COMPLETED, but result indicates failure):
Browser worked but goal not achieved. Retry with better goal, stealth, or proxy.

**3. Infrastructure failure** (status=FAILED):
Browser crashed or timed out. Retry with `browser_profile: "stealth"` and/or proxy.

---

## 9. Pricing

| Tier | Cost | Steps Included | Concurrent Agents |
|------|------|---------------|-------------------|
| Pay-as-you-go | $0.015/step | 0 | 2 |
| Starter | $15/mo | 1,650 | 10 |
| Pro | $150/mo | 16,500 | 50 |
| Enterprise | Custom | Custom | Custom |

**All plans include at no extra cost:**
- LLM inference costs
- Remote browser ($0/hour)
- Residential proxy ($0/GB)
- Anti-bot protection

**Hackathon:** Credits provided to all participants.

---

## 10. SDK Packages

| Platform | Package | Install |
|----------|---------|---------|
| Python (TinyFish SDK) | tinyfish | `pip install tinyfish` |
| TypeScript (TinyFish SDK) | @tiny-fish/sdk | `npm install @tiny-fish/sdk` |
| Python (AgentQL - separate product) | agentql | `pip install agentql` |
| JS (AgentQL - separate product) | agentql | `npm install agentql` |
| Python (AG2 framework) | ag2[tinyfish] | `pip install -U "ag2[openai,tinyfish]"` |
| n8n community node | n8n-nodes-tinyfish | Install via n8n Settings > Community Nodes |

**Note:** AgentQL is a *separate* TinyFish product (Playwright-based, local browser). For the hackathon, use the **TinyFish Web Agent API** (cloud-hosted, no browser management).

---

## 11. Cookbook Reference Implementations

Source: https://github.com/tinyfish-io/tinyfish-cookbook (27+ examples)

**Most relevant for Frontier:**

| Recipe | What It Does |
|--------|-------------|
| `competitor-analysis` | Live pricing intelligence dashboard |
| `competitor-scout-cli` | CLI tool researching competitor features |
| `concept-discovery-system` | Validates ideas against existing implementations |
| `research-sentry` | Academic research assistant (ArXiv, PubMed) |
| `tenders-finder` | Singapore government tender discovery |
| `scholarship-finder` | Live scholarship discovery |
| `silicon-signal` | Supply chain tracking |
| `logistics-sentry` | Port congestion and risk tracking |
| `tinyskills` | Multi-source guide generator (good architecture pattern) |

### TinySkills Architecture Pattern (Useful for Frontier)

Three-phase approach:
1. **Source Discovery** -- AI identifies relevant URLs per category
2. **Parallel Extraction** -- TinyFish agents scrape all sources simultaneously
3. **AI Synthesis** -- extracted content consolidated into structured output

Uses `Promise.allSettled()` for graceful failure handling.

---

## 12. Integration Ecosystem

- **Dify** -- plugin for Dify AI platform
- **n8n** -- community node (`n8n-nodes-tinyfish`)
- **AG2/AutoGen** -- `TinyFishTool` class
- **MCP** -- Claude, Cursor, Claude Code
- **Any HTTP client** -- direct REST API

---

## 13. Key Technical Notes

- `streaming_url` in SSE events gives a live browser view URL valid for 24 hours
- Browser profiles: `lite` = standard Chromium (fast), `stealth` = modified Chromium with anti-detection (slower)
- Always include `https://` in URLs
- AI-driven path learning: repeated runs on same site get faster and more deterministic
- Concurrent agent limits depend on pricing tier (2/10/50/custom)
- Each run produces a unique `run_id` for tracking

---

## 14. Key Links

| Resource | URL |
|----------|-----|
| Main site | https://tinyfish.ai |
| Documentation | https://docs.tinyfish.ai |
| LLM-readable docs | https://docs.tinyfish.ai/llms.txt |
| Sign up | https://agent.tinyfish.ai/signup |
| API keys | https://agent.tinyfish.ai/api-keys |
| Playground | https://agent.tinyfish.ai |
| MCP endpoint | https://agent.tinyfish.ai/mcp |
| Cookbook | https://github.com/tinyfish-io/tinyfish-cookbook |
| Python SDK | https://github.com/tinyfish-io/agent-sdk-python |
| Integrations | https://github.com/tinyfish-io/tinyfish-web-agent-integrations |
| AgentQL | https://github.com/tinyfish-io/agentql |
| Discord | https://discord.gg/tinyfish |
| AI integration guide | https://docs.tinyfish.ai/ai-integration |
| FAQ | https://docs.tinyfish.ai/faq |
| Scraping examples | https://docs.tinyfish.ai/examples/scraping |
| Auth docs | https://docs.tinyfish.ai/authentication |
| SSE endpoint ref | https://docs.tinyfish.ai/api-reference/automation/run-browser-automation-with-sse-streaming |
