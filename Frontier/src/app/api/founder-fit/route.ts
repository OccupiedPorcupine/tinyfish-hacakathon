import { NextResponse } from 'next/server';
import { readCache, writeCache } from '@/lib/cache';
import { structureData } from '@/lib/openai/client';

const FOUNDER_PROFILE = `
Background: Product Management, Partnerships
Strengths: GTM Strategy, Partnerships, Ecosystem Access
Preferred Markets: SEA (Southeast Asia)
Preferred Models: B2B SaaS, Platforms
Years Experience: 8
Network: Strong US/India, emerging SEA
Capital: $500K-1M to deploy
Team: 1 founder (Product/GTM)
Execution Style: Partnership-first, lean validation
Regulatory Tolerance: Moderate - prefer B2B with light compliance
`;

interface FitOpportunity {
  id: string;
  category: string;
  market: string;
  marketScore: number;
  founderFitScore: number;
  fitConfidence: 'High' | 'Medium-High' | 'Medium' | 'Low';
  whyFits: string;
  whatMayHoldYouBack: string;
  firstMove: string;
  reasons: string[];
  risks: string[];
}

const CACHE_KEY = 'founder-fit';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

export async function GET() {
  const cached = readCache<{ opportunities: FitOpportunity[] }>(CACHE_KEY, CACHE_TTL_MS);
  if (cached) return NextResponse.json(cached);

  try {
    // Reuse dashboard opportunities if available
    const dashboard = readCache<any>('dashboard', Number.MAX_SAFE_INTEGER);
    const opportunities = dashboard?.opportunities ?? [];

    if (opportunities.length === 0) {
      return NextResponse.json({ opportunities: [] });
    }

    const oppList = opportunities.map((op: any) =>
      `- ${op.category} in ${op.market} (score: ${op.score}, momentum: ${op.momentum}%, competition: ${op.competitionDensity}%)`
    ).join('\n');

    const structured = await structureData<{ opportunities: FitOpportunity[] }>(
      `Opportunities list:\n${oppList}`,
      `You are a startup advisor. Given this founder profile:
${FOUNDER_PROFILE}

And these market opportunities:
${oppList}

Score each opportunity for FOUNDER FIT (separate from market score). Return a JSON object:
{
  "opportunities": [
    {
      "id": "<slug from category>",
      "category": "<category name>",
      "market": "<market name>",
      "marketScore": <integer 0-100 from the list above>,
      "founderFitScore": <integer 0-100 based on founder profile match>,
      "fitConfidence": "<High | Medium-High | Medium | Low>",
      "whyFits": "<1-2 sentences on why this founder fits this opportunity>",
      "whatMayHoldYouBack": "<1 sentence on the main risk for this founder>",
      "firstMove": "<1 sentence concrete first action>",
      "reasons": ["<short reason 1>", "<short reason 2>"],
      "risks": ["<short risk>"]
    }
  ]
}

Score founderFitScore based on: domain familiarity, execution motion match, buyer access, capital fit, and partnership potential. Higher score = better fit for THIS specific founder profile.`
    );

    writeCache(CACHE_KEY, structured);
    return NextResponse.json(structured);
  } catch (err) {
    console.error('[/api/founder-fit]', err);
    return NextResponse.json({ opportunities: [] }, { status: 500 });
  }
}
