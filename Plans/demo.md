# Frontier -- Hackathon Demo Script

> **TinyFish x OpenAI Hackathon, Singapore**
> Demo duration: 3-5 minutes
> Target prizes: Deep Sea Architect, Most Likely to Be the Next Unicorn

---

## 1. Pre-Demo Checklist

### 30 Minutes Before

- [ ] Laptop charged to 100%, charger plugged in
- [ ] Browser open with Frontier dashboard loaded (do NOT rely on cold start)
- [ ] Two browser tabs ready:
  - **Tab 1:** Frontier app (main demo)
  - **Tab 2:** Architecture diagram (static image or slide)
- [ ] Phone on silent, notifications off on laptop (Do Not Disturb)
- [ ] Font size increased in browser to 150%
- [ ] Terminal window open with backend logs visible (shows real SSE events)

### API and Environment

- [ ] Confirm `TINYFISH_API_KEY` has sufficient credits
- [ ] Confirm `OPENAI_API_KEY` is working
- [ ] Run one test query to warm up connections
- [ ] Verify SSE streaming works (watch for venue Wi-Fi blocking long-lived connections)
- [ ] Have mobile hotspot ready as backup

### Pre-Cached Data (Critical)

Run the exact demo query **"AI-powered legal document translation for SMEs"** at least twice before presenting:

- [ ] Full results JSON saved to `cache/legal-translation-smes.json`
- [ ] Screenshots of each results screen saved to `cache/screenshots/`
- [ ] Screen recording of a successful live run (MP4, 90 seconds) as emergency backup

### Fallback Priority Order

1. **Live demo works** -- use it (best case)
2. **Live demo is slow** -- narrate over progress events while they stream
3. **Live demo fails** -- switch to pre-cached results from 20 minutes ago
4. **Everything fails** -- show the 90-second screen recording

---

## 2. Opening Hook (0:00 - 0:15)

> "Raise your hand if you have ever killed a startup idea because you Googled it and found competitors."
>
> *Wait for hands.*
>
> "What if those competitors were only in the US -- and the real opportunity was in Indonesia, Vietnam, or Brazil, and you never saw it?"
>
> "That is the problem we built Frontier to solve."

**Notes:** Make eye contact during the hand-raise. Let the silence land. Do not rush.

---

## 3. Problem Statement (0:15 - 0:45)

> "I work at IIE, Singapore's innovation institute. I have competed in LKYGBPC. I built PathwiseAI. And every single time, I hit the same wall.
>
> I had an idea. I Googled it. I found US competitors. I killed it.
>
> What I never saw was the massive opportunity sitting in Southeast Asia.
>
> The information exists. It is on Vietnamese news sites, Brazilian VC blogs, Indonesian government grant portals. It is in local languages, behind login walls, scattered across 40 different sources. No founder has time to find it.
>
> **ChatGPT cannot do this.** It hallucinates. It uses stale training data. Ask it about a grant that closes next week -- it does not know it exists.
>
> So we built Frontier. Live market intelligence from the actual web, right now."

---

## 4. Live Demo (0:45 - 2:45)

### Step 1: Input the Query (0:45 - 1:00)

**On screen:** Frontier dashboard with clean search interface.

**Action:** Type slowly so the audience reads along:

```
AI-powered legal document translation for SMEs
```

**Say:**

> "I am a founder. I have this idea -- AI that translates legal documents for small businesses. Let me ask Frontier where in the world this idea has the biggest gap."

Click "Scan Global Markets".

---

### Step 2: Agent Progress -- The Technical Wow Moment (1:00 - 1:45)

**On screen:** Real-time progress panel with multiple agent cards animating simultaneously.

```
AGENT: Crunchbase Scanner .............. RUNNING
  -> Navigating to Crunchbase search...
  -> Extracting LegalTech companies by region...

AGENT: SEA Competitor Scan ............. RUNNING
  -> Searching DailySocial.id for "legal translation"...
  -> Scanning TechInAsia startup database...

AGENT: Grant Portal Monitor ........... RUNNING
  -> Navigating Enterprise Singapore grants page...
  -> Searching MDI Ventures open funds...

AGENT: VC Signal Tracker .............. RUNNING
  -> Scanning Indian LegalTech funding Q1 2026...
  -> Analyzing hiring velocity on LinkedIn Jobs...
```

**Say:**

> "Right now, five TinyFish agents are running in parallel. Each one is a real browser session -- not an API call to a database, a real browser navigating real websites.
>
> This one is on Crunchbase right now. This one is scanning DailySocial in Indonesia. This one is inside a government grant portal, extracting deadlines.
>
> TinyFish handles the hard parts -- anti-bot detection, JavaScript rendering, login walls, local language content."

---

### Step 3: Results -- The Money Moment (1:45 - 2:30)

**On screen:** Dashboard transitions from progress to structured results.

```
GAP RADAR: AI Legal Document Translation for SMEs

  RED   United States     Score: 18/100
        Saturated. 12+ funded players. $1.8B total sector funding.

  YELLOW  Singapore       Score: 52/100
        Early stage. 2 players found. Underfunded. $3.2M total raised.

  GREEN  Indonesia        Score: 87/100
        HIGH OPPORTUNITY. Zero direct competitors. 60M SMEs.
        OJK mandate for digital compliance records.

  GREEN  Vietnam          Score: 79/100
        One adjacent player (not legal-specific).
        VC interest in LegalTech spiking Q1 2026.

  YELLOW  India           Score: 41/100
        Growing but competitive. 8 players, 3 well-funded.
        SIGNAL: Sector raised $180M across 3 deals in Q1 2026.
```

**Say:**

> "This is the moment. The US is red -- saturated, twelve funded players. If I had Googled this idea, I would have seen Luminance and Harvey and killed it.
>
> But look at Indonesia. Score: 87 out of 100. Zero direct competitors. Sixty million SMEs. And Indonesia's financial regulator, OJK, just mandated digital compliance records. That is a regulatory tailwind pushing demand for exactly this product.
>
> Every single data point is cited and timestamped. These are not hallucinations. That OJK regulation? Pulled from OJK.go.id one minute ago."

**Signal Feed highlights:**

> "Below that -- India just poured 180 million into this exact category in Q1. There is an open grant from MDI Ventures, closes April 30th, for SME digitization in SEA. Found by navigating the actual grant portal."

---

### Step 4: Deep Dive Click (2:30 - 2:45)

**Action:** Click on Indonesia card to expand.

**Say:**

> "One click, full market brief. Key investors, comparable exits, and a concrete next step: apply to MDI Ventures before April 30th.
>
> A founder just went from 'is my idea viable' to 'here is exactly where to build it and who to call.' In under 60 seconds."

---

## 5. Technical Deep Dive (2:45 - 3:15)

**Action:** Switch to architecture diagram tab.

> "Under the hood, three layers.
>
> First, the orchestrator. When you submit a query, we decompose it into parallel agent tasks. Five to eight TinyFish agents fire simultaneously -- each targeting a different data source. Crunchbase. TechInAsia. DailySocial. Government grant portals.
>
> TinyFish is the key. Each agent is a cloud-hosted browser that takes a natural language goal and navigates the actual website. Stealth mode for anti-bot sites. Geo-proxied for region-locked content.
>
> Second, aggregation. Raw results collected as they complete -- we do not wait for the slowest agent.
>
> Third, synthesis. OpenAI GPT-4o takes the raw, messy, multilingual data and produces the structured market intelligence you just saw."

---

## 6. Business Case (3:15 - 3:45)

> "I work at IIE. We run accelerator cohorts. Every cohort, founders ask: 'where should I build this?' IIE is our first customer, our pilot, and our case study.
>
> Free tier for students. Pro at 29 dollars a month for active founders. Team tier at 500 a month for accelerators and VCs -- cohort-wide access.
>
> There are over 200 accelerator programs in Asia-Pacific. We are not selling to individual founders at scale on day one -- we are selling to the institutions that serve hundreds of founders at once."

---

## 7. Closing (3:45 - 4:00)

> "Every founder in this room has killed an idea that was only dead in Silicon Valley.
>
> Frontier finds where it is alive.
>
> We scan every market in the world so you can find where your idea is a gap -- not a graveyard."

**Hold eye contact. Let the line land.**

---

## 8. Anticipated Q&A

### "How is this different from just asking ChatGPT?"

> "Three things. **Freshness** -- ChatGPT has a training data cutoff. Our agents are live. **Hallucination** -- we extract from actual websites, we do not invent companies. **Structure** -- ChatGPT gives a wall of text; Frontier gives scored markets, cited sources, specific grants with deadlines."

### "How accurate is the data?"

> "Every data point is sourced and timestamped. We inherit TinyFish's 98.7% success rate. When an agent fails, we show partial results and flag unreachable sources. We never fill gaps with made-up data."

### "What is your moat?"

> "Three layers. Data freshness from live, fragmented sources that do not have APIs. Agent tuning -- our goals are specifically engineered for market intelligence extraction. And the distribution wedge -- we are embedded at IIE, signing accelerator programs as customers."

### "How do you handle rate limiting / anti-bot?"

> "That is exactly why we use TinyFish. Their stealth browser profile handles Cloudflare and DataDome. We use `asyncio.gather` with `return_exceptions=True` so if one agent fails, the others still return results. And we cache results with TTL so repeated queries do not re-hit the same sites."

### "How long does a scan take?"

> "Typically 30 to 60 seconds. TinyFish agents run in parallel, so total time equals the slowest agent, not the sum. We stream results as they arrive -- you start seeing market cards within 15 to 20 seconds."

---

## 9. Fallback Plan

### If demo is slow

Fill time with technical narration:

> "While the agents are working -- you can see the live progress events streaming in -- let me explain what is happening. Agent A is navigating Crunchbase's search interface right now. Agent B is on DailySocial.id, an Indonesian tech news site, navigating in Bahasa Indonesia."

### If demo fails completely

Stay calm. Pivot:

> "Looks like the venue Wi-Fi is not cooperating -- which is a pretty good demonstration of why building on the messy web is hard."
>
> *Get a laugh. Then:*
>
> "Let me show you the results from our run 20 minutes ago. Same query, same live data."

Switch to pre-cached results or screen recording.

### If a judge asks to try a different query

If working: "Absolutely. What idea should we try?" Let them suggest one.

If not working: "I would love to show you after the session on a better connection -- but let me show you the depth of results we get."

---

## Timing Summary

| Section | Duration | Cumulative |
|---------|----------|------------|
| Opening Hook | 0:15 | 0:15 |
| Problem Statement | 0:30 | 0:45 |
| Demo: Input | 0:15 | 1:00 |
| Demo: Agent Progress | 0:45 | 1:45 |
| Demo: Results | 0:45 | 2:30 |
| Demo: Deep Dive | 0:15 | 2:45 |
| Technical Architecture | 0:30 | 3:15 |
| Business Case | 0:30 | 3:45 |
| Closing | 0:15 | 4:00 |

---

## Key Lines to Memorize

1. "Raise your hand if you have ever killed a startup idea because you Googled it and found competitors."
2. "What I never saw was the massive opportunity in Vietnam, Indonesia, Brazil."
3. "Frontier's agents are live -- every result is cited, timestamped, sourced from the actual web right now."
4. "A founder just went from 'is my idea viable' to 'here is exactly where to build it and who to call.' In under 60 seconds."
5. "Frontier finds where your idea is alive."

---

## What NOT to Say

- Do not say "we just scrape websites." Say "our agents navigate live web sources."
- Do not say "it is like ChatGPT but better." Say "ChatGPT generates text. Frontier extracts live intelligence."
- Do not say "we built a wrapper around TinyFish." Say "we built a market intelligence orchestration layer powered by TinyFish."
- Do not oversell accuracy. Never say "100% accurate." Say "cited, timestamped, and sourced."

---

## Prize Alignment

| Prize | How Frontier Wins It |
|-------|---------------------|
| Deep Sea Architect | Parallel TinyFish agents with SSE streaming, multi-source synthesis -- the "aha" moment is Indonesia appearing from navigating a government portal in Bahasa Indonesian |
| Most Likely Unicorn | IIE as first customer, B2B accelerator wedge, tiered pricing, 200+ APAC accelerator programs as addressable market |
