import { NextResponse } from 'next/server';
import { runTinyFishTask } from '@/lib/tinyfish/sse-client';
import { structureData } from '@/lib/openai/client';
import { readCache, writeCache } from '@/lib/cache';

export interface Signal {
  id: number;
  type: 'funding' | 'regulation' | 'hiring' | 'trend';
  market: string;
  text: string;
  source: string;
  date: string;
}

const CACHE_KEY = 'feed';
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

export async function GET() {
  const cached = readCache<{ signals: Signal[] }>(CACHE_KEY, CACHE_TTL_MS);
  if (cached) return NextResponse.json(cached);

  try {
    const raw = await runTinyFishTask(
      'https://techinasia.com',
      `Browse this page and find the 8 most recent startup and tech news articles from Southeast Asia.
For each article extract:
- headline (the article title)
- signal type: one of "funding", "regulation", "hiring", or "trend"
- country or market (e.g. Indonesia, Vietnam, Singapore, Thailand, Philippines, Malaysia)
- the publication or source name
- approximate date (e.g. "2 hours ago", "1 day ago", "Mar 27")

Focus on articles about startup funding rounds, government regulation of tech, company hiring announcements, and market trend stories.`
    );

    const structured = await structureData<{ signals: Signal[] }>(
      raw,
      `Return a JSON object with a "signals" array. Each item must have:
- "id": incrementing number starting at 1
- "type": one of "funding" | "regulation" | "hiring" | "trend"
- "market": the country or market name
- "text": the article headline
- "source": the publication name
- "date": the time/date string

Example:
{
  "signals": [
    { "id": 1, "type": "funding", "market": "Indonesia", "text": "GoTo raises $300M to expand logistics", "source": "Tech in Asia", "date": "3 hours ago" }
  ]
}`
    );

    writeCache(CACHE_KEY, { signals: structured.signals });
    return NextResponse.json({ signals: structured.signals });
  } catch (err) {
    console.error('[/api/feed]', err);
    return NextResponse.json({ error: 'Failed to fetch signals' }, { status: 500 });
  }
}
