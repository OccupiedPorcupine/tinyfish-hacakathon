import { GapRadarRequest, ScanResult, ValidationKit, ValidationKitRequest } from './types';
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

export async function generateValidationKitForOpportunity(request: ValidationKitRequest): Promise<ValidationKit> {
  const id = crypto.randomUUID();

  const goal = `Search Reddit, LinkedIn, Facebook Groups, and community forums for discussions about "${request.painArea}" by ${request.targetAudience} in ${request.market}.

Find:
1. Real complaints and pain points people describe about this problem
2. Current tools or workarounds people are using
3. Signals of willingness to pay (pricing discussions, quotes about costs)
4. Workflow descriptions showing how people handle this problem today
5. Specific communities (subreddits, Facebook groups, LinkedIn groups) where this audience hangs out

Also identify 3-4 communities where ${request.targetAudience} in ${request.market} would be active.

Be specific — include real quotes, subreddit names, group names, and estimated member counts where possible.`;

  const raw = await runTinyFishTask('https://reddit.com', goal);

  const result = await structureData<ValidationKit>(
    raw,
    `Return a JSON object matching this exact structure for a validation kit about "${request.category}" in ${request.market}:

{
  "id": "${id}",
  "opportunityId": "${request.scanResultId ?? id}",
  "category": "${request.category}",
  "market": "${request.market}",
  "createdAt": "${new Date().toISOString()}",
  "painSignalStrength": <integer 0-100>,
  "willingSample": <integer count of wtp signals found>,
  "productivityGap": <integer 0-100 estimated efficiency gap>,
  "validationQuestions": [
    {
      "id": "q1",
      "question": "<targeted interview question>",
      "focusArea": "<one of: pain_quantification | workflow | wtp | switching_cost>",
      "context": "<why this question matters>",
      "expectedSignals": ["<signal 1>", "<signal 2>"]
    }
    // 6-8 questions total
  ],
  "communities": [
    {
      "id": "c1",
      "platform": "<one of: reddit | facebook | linkedin | slack | discord>",
      "name": "<community name>",
      "url": "<url>",
      "memberCount": <integer>,
      "relevance": "<primary or secondary>",
      "difficulty": "<easy | medium | hard>",
      "description": "<1 sentence description>"
    }
    // 4-6 communities total (mix of primary and secondary)
  ],
  "preValidatedSignals": [
    {
      "id": "s1",
      "signal": "<real quote or paraphrase from community>",
      "source": "<e.g. r/indonesia_entrepreneurs · comment>",
      "category": "<one of: workflow_description | pain_complaint | tool_mention | wtp_indicator>",
      "relevance": <integer 0-100>,
      "context": "<brief explanation of relevance>"
    }
    // 6-10 signals total across all four categories
  ],
  "markdownScript": "# Validation Interview Script\\n\\n## ${request.category} in ${request.market}\\n\\n<formatted markdown with all questions as an interview script>",
  "jsonData": {}}`
  );

  return result;
}
