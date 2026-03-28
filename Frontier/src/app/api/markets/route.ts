import { NextResponse } from 'next/server';
import { runTinyFishTask } from '@/lib/tinyfish/sse-client';
import { structureData } from '@/lib/openai/client';
import { readCache, writeCache } from '@/lib/cache';

export interface MigrationVector {
  source: string;
  target: string;
  weight: number;
  category: string;
}

const CACHE_KEY = 'markets';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

export async function GET() {
  const cached = readCache<{ vectors: MigrationVector[] }>(CACHE_KEY, CACHE_TTL_MS);
  if (cached) return NextResponse.json(cached);

  try {
    const raw = await runTinyFishTask(
      'https://techcrunch.com',
      `Search this site and the web for examples of successful startup business models that originated in the US, India, China, or Brazil and are now being actively replicated or adopted in Southeast Asia (Singapore, Indonesia, Vietnam, Thailand, Malaysia, Philippines).

For each pattern find:
- The source market (where the model originated)
- The target market in SEA (where it is being replicated)
- The business category (e.g. "Quick Commerce", "Embedded Finance", "B2B SaaS", "Live Commerce")
- A confidence score from 0-100 indicating how strongly the pattern is being replicated right now

Find at least 5 examples.`
    );

    const structured = await structureData<{ vectors: MigrationVector[] }>(
      raw,
      `Return a JSON object with a "vectors" array. Each item must have:
- "source": source market name (e.g. "US", "India", "China", "Brazil")
- "target": SEA target market name (e.g. "Indonesia", "Vietnam", "Singapore")
- "weight": number 0-100 representing replication strength
- "category": the business model category string

Example:
{
  "vectors": [
    { "source": "India", "target": "Indonesia", "weight": 92, "category": "Quick Commerce" },
    { "source": "US", "target": "Singapore", "weight": 85, "category": "B2B Vertical SaaS" }
  ]
}`
    );

    writeCache(CACHE_KEY, { vectors: structured.vectors });
    return NextResponse.json({ vectors: structured.vectors });
  } catch (err) {
    console.error('[/api/markets]', err);
    return NextResponse.json({ error: 'Failed to fetch market vectors' }, { status: 500 });
  }
}
