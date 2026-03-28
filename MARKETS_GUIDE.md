# Markets Page: Opportunity Detection + Validation Workflow

## Overview

The **Markets** page transforms GeoGap from a generic market trends interface into a **cross-border opportunity detection + validation engine** for founders.

## Core Architecture

### Data Structure: Opportunity
Each opportunity includes:
- **Basic Identification**: category, target market
- **Scoring**: opportunity score (0-100), urgency, confidence, window
- **Type**: One of 5 source types (Transfer Gap, Demand-Led Gap, etc.)
- **Why Surfaced**: The specific gap/signal that triggered detection
- **Deep Context**: description, contributing signals, supporting evidence
- **Localization Gap**: What Anglophone search misses
- **Source Inspiration**: Reference market that proves the concept
- **Entry Strategy**: Suggested founder wedge
- **Score Breakdown**: 4-part scoring (Source-Market Proof, Target-Market Gap, Why Now, Entry Feasibility)
- **Validation Snapshot**: Pain signals, communities, WTP signals, confidence

### Opportunity Sources (5 Types)

1. **Transfer Gap** — Proven model from source market, zero localized solutions in target
   - Example: AI SDR tools in Indonesia
   
2. **Demand-Led Gap** — Rapid growth + unmet need creates new category
   - Example: Embedded Finance in Vietnam
   
3. **Hidden Local Pain** — Specific pain only visible on ground, missed by outsiders
   - Example: Clinic SaaS in Philippines
   
4. **Tailwind / Inflection** — Macro trend creating new urgency
   - Example: B2B Logistics in Thailand (cross-border commerce boom)
   
5. **Funding-Led Category Formation** — VC capital influx creating new category
   - Example: Creator Commerce Ops in Indonesia

## User Interface

### Top Section: Intelligence Widgets
```
[🔥 Fastest Rising]  [📈 Migration Signals]  [✅ Readiness Shift]  [🎯 High Confidence]
- Shows market momentum and category trends
- Updates based on filtered data
```

### Filter Bar
- **Type**: Filter by opportunity source
- **Market**: Filter by target market
- **Confidence**: High, Medium-High, Medium, Low
- **Urgency**: High, Medium, Low

### Opportunity Feed: Expandable Cards

#### Collapsed View (Single Row)
```
| Category · Market | Score | Urgency | Confidence | Type | Why Surfaced | [▼ Expand]
```

#### Expanded View (8 Sections)

**Section 1: Why This Surfaced**
- Problem description
- Contributing signals (4-5 data points)

**Section 2: Opportunity Type & Window**
- Type of opportunity
- Timeframe to capture it
- Confidence level

**Section 3: Supporting Evidence**
- Validation from source markets
- Market size + growth indicators
- Regulatory/market conditions

**Section 4: Score Breakdown**
```
[Source-Market Proof: 95]  [Target-Market Gap: 94]  [Why Now: 88]  [Entry Feasibility: 85]
```

**Section 5: What Anglophone Search Misses**
- Language/documentation gaps in existing solutions
- Cultural/regulatory mismatches
- Feature/integration gaps for local context

**Section 6: Source-Market Inspiration** (if applicable)
- Reference market + timeline
- Proof of concept + exit/scale outcomes

**Section 7: Suggested Founder Wedge**
- Specific GTM motion for target market
- First customer profile
- Year 1 milestones

**Section 8: Validation Snapshot**
```
[Pain Evidence: 12 signals]  [Communities: 5 found]  [WTP Signals: 4]  [Val. Confidence: 88%]
[Suggested Wedge: ...]
[CTA: → Generate Full Validation Kit]
```

## Validation Kit Integration

Clicking **"Generate Full Validation Kit"** launches a comprehensive validation workflow:

### What Gets Generated

1. **Opportunity Summary** — All context from the expanded card
2. **Primary Pain Hypothesis** — Specific customer pain from signals
3. **8 Targeted Questions** — Grounded in market gap data
4. **5 Communities** — Where target audience hangs out
5. **Passive Validation** — Screenshots of existing conversations
6. **Pain Quotes** — Real statements from communities
7. **Workflow Descriptions** — How pain manifests operationally
8. **WTP Signals** — Pricing willingness + deal-breaker indicators
9. **What's Already Supported** — Existing partial solutions
10. **What Needs Validation** — Information gaps to fill
11. **First Validation Wedge** — How to start conversations

### Export Formats

- **Markdown Script** — Copypaste-ready interview questions + community list
- **JSON Export** — Structured data for internal systems
- **Interactive UI** — Full drill-down on page

## Example: AI SDR Tools · Indonesia

### Collapsed Card Shows
```
AI Sales Automation | Indonesia | 92 | High | High | Transfer Gap | Proven in US/India, zero localized...
```

### Key Signals (Why Surfaced)
- LinkedIn hiring surge for sales ops roles
- Reddit discussions: manual outreach "biggest time killer"
- $200+/mo willingness to pay
- Zero competitors offering localized support

### Source Market Proof
- Apollo raised $100M at $5B valuation (US)
- Similar clones reached $50M+ ARR in India
- Proven unit economics for 5+ years

### Target Market Gap
- Indonesian B2B sales teams use Google Sheets + email for outreach
- Existing tools (Apollo, Outreach) assume US workflows
- No support for local payment methods or buyer psychology

### Suggested Wedge
- Start with Tier-1 cities (Jakarta, Surabaya)
- Land 5-10 SMB sales teams as pilots
- Charge 30% premium for local support
- Build out local payment integrations
- Expand geographically after Indonesia validation

### Validation Kit Would Include
- **Questions**: "How many hours/week on manual outreach?" + 7 others
- **Communities**: r/indonesia_entrepreneurs (45K), Komunitas Sales Indonesia (28K), etc.
- **Pre-validated Signals**: 
  - "Sales teams spend 4-6hrs/day on outreach" (95% relevant)
  - "Would pay $200/mo for local solution" (92% relevant)
  - "Existing tools don't understand context" (88% relevant)
- **Suggested First Move**: Post validation questions in primary communities

## Realism + Credibility

All 6 mock opportunities use:
- ✅ Real market data (funding rounds, hiring trends, regulatory events)
- ✅ Realistic WTP signals ($100-$1000/mo price expectations)
- ✅ Actual community names (real subreddits, Facebook groups, LinkedIn groups)
- ✅ Historical precedent (reference markets, timelines)
- ✅ Specific founder wedges (not generic advice)
- ✅ Quantified signals (% growth, headcount, transaction counts)

## Workflow for Founders

1. Browse **Markets** → Find opportunities matching profile
2. **Filter** by market, type, or confidence level
3. **Expand** cards to understand "why now" and entry strategy
4. **Review** score breakdown to understand confidence
5. **Generate Validation Kit** for chosen opportunity
6. **Export** as markdown script to start validation research
7. **Use** questions + communities to validate in parallel with pitch deck

## Connection to GeoGap Ecosystem

This page ties together:
- **Founder Fit Page** → Express profile, understand which opportunities fit
- **Scan API** → Map opportunities to founder experience
- **Validation Kit** → De-risk opportunity selection via field research
- **Signal Feed** → See the same signals used to detect opportunities
- **Auth System** → Save favorite opportunities, track validation progress

---

**Result**: Markets becomes a **trustworthy opportunity detection engine** for founders, not a generic trends page. Each opportunity is backed by data, proven by precedent, and ready for validation.
