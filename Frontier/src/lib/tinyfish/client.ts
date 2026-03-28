import { GapRadarRequest, ScanResult } from './types';
import { runTinyFishTask } from './sse-client';
import { structureData } from '@/lib/openai/client';

export async function runMarketScan(request: GapRadarRequest): Promise<ScanResult> {
  const id = crypto.randomUUID();

  const goal = `Research the startup market opportunity for "${request.query}" in these target markets: ${request.targetMarkets.join(', ')}.

Compare against mature source markets where this model has already proven itself: ${request.sourceMarkets.join(', ')}.

For each target market, search for:
1. Recent startup funding rounds in this category
2. Company hiring signals (job postings in this space)
3. Regulatory changes or government initiatives affecting this model
4. Market size trends, growth rates, and user adoption signals
5. Existing local competitors and their traction
6. Specific reasons why NOW is or isn't a good entry window

Be specific per market. Use real company names and data where possible.`;

  const raw = await runTinyFishTask('https://techcrunch.com', goal);

  const result = await structureData<ScanResult>(
    raw,
    `Return a JSON object with exactly these fields:

"id": "${id}"
"status": "completed"
"query": "${request.query}"
"confidenceScore": integer 0-100 based on data quality found
"shortExplanation": 2-3 sentence executive summary of the opportunity

"scores": array with one object per target market (${request.targetMarkets.map(m => `"${m}"`).join(', ')}), each with:
  "market": market name string
  "opportunityWindow": integer 0-100
  "validation": integer 0-100
  "whitespace": integer 0-100
  "pain": integer 0-100
  "momentum": integer 0-100
  "localization": integer 0-100

"evidence": array of 4-6 objects, each with:
  "text": string describing specific evidence found (funding round, job posting, regulation, trend)
  "type": one of "funding" | "hiring" | "regulation" | "trend"
  "sourceName": publication or source name (optional)

"competitorDensity": array with one object per target market, each with:
  "market": market name string
  "density": one of "Low" | "Medium" | "High"

"wedgeRecommendation": paragraph recommending the best GTM entry motion

"signalTimeline": array of 3-4 objects, each with:
  "date": quarter string like "2025 Q3" or "2026 Q1"
  "event": description of a key market event or milestone`
  );

  return result;
}
