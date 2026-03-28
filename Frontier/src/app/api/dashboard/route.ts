import { NextResponse } from 'next/server';
import { runTinyFishTask } from '@/lib/tinyfish/sse-client';
import { structureData } from '@/lib/openai/client';
import { readCache, writeCache } from '@/lib/cache';

export interface Opportunity {
  id: string;
  category: string;
  market: string;
  momentum: number;
  competitionDensity: number;
  demand: number;
  score: number;
  confidence: number;
  trend: string;
  whyNow: string;
  analogs: string[];
}

export interface RisingCategory {
  category: string;
  market: string;
  trend: string;
  declining: boolean;
}

export interface MigrationSignal {
  category: string;
  path: string[];   // e.g. ["US", "IN", "ID"]
  confidence: string;
  window: string;
}

export interface FundingSignal {
  company: string;
  round: string;
  market: string;
  sector: string;
}

export interface DashboardData {
  opportunities: Opportunity[];
  risingCategories: RisingCategory[];
  migrationSignals: MigrationSignal[];
  fundingSignals: FundingSignal[];
}

const CACHE_KEY = 'dashboard';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

export async function GET() {
  const cached = readCache<DashboardData>(CACHE_KEY, CACHE_TTL_MS);
  if (cached) return NextResponse.json(cached);

  try {
    const raw = await runTinyFishTask(
      'https://techinasia.com',
      `Browse this page and search for recent startup and tech news across Southeast Asia.

Find and collect the following:

1. STARTUP OPPORTUNITIES (6 items): For each of the top 6 most interesting startup opportunities in SEA right now, find:
   - The business category (e.g. "HealthTech", "Embedded Finance", "B2B SaaS")
   - The SEA target market (e.g. Indonesia, Vietnam, Philippines, Singapore, Thailand, Malaysia)
   - Which mature market it mirrors (e.g. US, India, China, Brazil)
   - Signs of momentum (hiring growth, funding activity, user growth)
   - Why this is a good opportunity right now

2. FASTEST RISING CATEGORIES (4 items): Which startup categories are growing the fastest in SEA right now, and which are declining? Include growth percentages if available.

3. MIGRATION SIGNALS (3 items): Which business models from the US, India, or China are being replicated in SEA right now? Trace the path.

4. RECENT FUNDING ROUNDS (3 items): The 3 most recent startup funding rounds announced in SEA. Include company name, round size, country, and sector.`
    );

    const structured = await structureData<DashboardData>(
      raw,
      `Return a JSON object with exactly these four keys:

"opportunities": array of 6 objects, each with:
  - "id": short slug string (e.g. "healthtech-ph")
  - "category": business model category string
  - "market": SEA country name
  - "momentum": integer 0-100 (market growth speed)
  - "competitionDensity": integer 0-100 (how crowded it is)
  - "demand": integer 0-100 (consumer demand strength)
  - "score": integer 0-100 (overall opportunity score)
  - "confidence": integer 0-100 (data confidence)
  - "trend": string like "+24%" or "-5%"
  - "whyNow": 1-2 sentence explanation
  - "analogs": array of 1-3 source market strings (e.g. ["US", "India"])

"risingCategories": array of 4 objects, each with:
  - "category": category name
  - "market": SEA country
  - "trend": string like "+18.2%" or "-12.6%"
  - "declining": boolean (true if trend is negative)

"migrationSignals": array of 3 objects, each with:
  - "category": business model name
  - "path": array of market codes showing migration path (e.g. ["US", "IN", "ID"])
  - "confidence": string like "High confidence" or "Moderate confidence"
  - "window": string like "3-6mo window" or "inflecting now"

"fundingSignals": array of 3 objects, each with:
  - "company": company name
  - "round": round description (e.g. "$12M Series A")
  - "market": 2-letter country code (e.g. "SG", "ID", "VN")
  - "sector": sector name`
    );

    writeCache(CACHE_KEY, structured);
    return NextResponse.json(structured);
  } catch (err) {
    console.error('[/api/dashboard]', err);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
