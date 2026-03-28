import type { GapRadarScanInput } from "@/lib/tinyfish/types";
import { SOURCE_MARKETS, TARGET_MARKETS } from "@/lib/geogap/constants";

const TC_VENTURE = "https://techcrunch.com/category/venture/";

export function buildGapRadarAgentTasks(input: GapRadarScanInput) {
  const idea = input.idea.slice(0, 500);
  const cat = input.category;
  const bm = input.businessModel;
  const urlHint = input.companyUrl?.trim() ? `Founder reference URL: ${input.companyUrl}` : "";

  const targets = TARGET_MARKETS.join(", ");

  return [
    {
      agentId: "techcrunch_funding",
      url: TC_VENTURE,
      goal: `Find funding rounds from the last 6 months related to: "${idea}" (category: ${cat}). Return JSON: { "rounds": [ { "company": string, "amount": string, "country": string, "date": string, "description": string } ] } Limit 8. Focus on US and European deals. If none match, return rounds closest to this space.`,
    },
    {
      agentId: "crunchbase_public",
      url: "https://www.crunchbase.com/discover/funding_rounds",
      goal: `Scan for recent funding rounds (last 6 months) in ${cat} related to: "${idea}". Return JSON: { "rounds": [ { "company": string, "amount": string, "location": string, "date": string } ] } Max 6. If blocked, return { "rounds": [], "note": "blocked" }.`,
    },
    {
      agentId: "sea_vc_signal",
      url: "https://www.techinasia.com/tag/fundings",
      goal: `Find SEA (Singapore, Indonesia, Vietnam) funding or product news for "${idea}" / ${cat}. Return JSON: { "items": [ { "title": string, "url": string, "market": string, "summary": string } ] } Max 6.`,
    },
    {
      agentId: "competitor_us",
      url: "https://www.google.com/search?q=" + encodeURIComponent(`${idea} ${cat} startup funding US`),
      goal: `From visible results, list competitors. Return JSON: { "companies": [ { "name": string, "url": string, "snippet": string } ] } Max 5 for US/India/Brazil context.`,
    },
    {
      agentId: "competitor_sea",
      url: "https://www.google.com/search?q=" + encodeURIComponent(`${idea} ${cat} startup Singapore OR Indonesia OR Vietnam`),
      goal: `List likely competitors or analogues in ${targets}. Return JSON: { "companies": [ { "name": string, "url": string, "market": string, "snippet": string } ] } Max 6.`,
    },
    {
      agentId: "grant_reg_sg",
      url: "https://www.enterprisesg.gov.sg/grow-your-business/grants/for-startups",
      goal: `Summarize any open grants or programs relevant to ${cat} / SME digitization. Return JSON: { "programs": [ { "name": string, "url": string, "eligibility": string } ] } Max 4 or empty.`,
    },
  ].map((t) => ({
    ...t,
    goal: `${t.goal}\nContext: business model ${bm}. ${urlHint}`.trim(),
  }));
}

export function gapRadarSynthesisSystemPrompt(): string {
  return `You are a market intelligence analyst for GeoGap, specializing in cross-market arbitrage for founders.
Source markets (mature signals): ${SOURCE_MARKETS.join(", ")}.
Target markets (gap scan): ${TARGET_MARKETS.join(", ")}.

You receive raw web agent extractions (JSON). They may be partial or noisy. Never invent specific dollar amounts or company names not present in the input; if missing, use conservative language and lower confidence scores.

Return a single JSON object with this exact shape:
{
  "global_insight": "string — one tight paragraph on what the combined evidence suggests",
  "proof_of_model": {
    "total_funding_globally": "string — summarize only from provided funding rows, or say insufficient data",
    "key_deals": [ { "company": "string", "amount": "string", "market": "string", "date": "string" } ],
    "maturity_verdict": "emerging | growing | mature | saturated | insufficient_data"
  },
  "markets": [
    {
      "market": "Singapore" | "Indonesia" | "Vietnam",
      "rank": number,
      "opportunity_window": 0-100,
      "validation": 0-100,
      "whitespace": 0-100,
      "pain": 0-100,
      "momentum": 0-100,
      "localization": 0-100,
      "confidence": 0-100,
      "short_explanation": "string — 2-3 sentences, cite evidence themes not magic",
      "recommended_wedge": "string",
      "saturation_signal": "string",
      "whitespace_signal": "string",
      "competitors": [ { "name": "string", "region": "string", "stage": "string", "total_raised": "string or null", "one_liner": "string", "source_url": "string or null" } ],
      "evidence": [ { "title": "string", "url": "string", "note": "string" } ]
    }
  ]
}

Rules:
- Include exactly one entry per target market: Singapore, Indonesia, Vietnam (3 total).
- Rank 1 = best opportunity window for THIS idea.
- Scores must reflect evidence density: low agent data => confidence <= 45.
- Evidence urls should prefer URLs from the raw payload; use "https://example.com" only if you must placeholder — prefer null and omit if none. Actually use only urls that appear in raw data; if none, use empty evidence array.`;
}

export function gapRadarSynthesisUserPayload(idea: GapRadarScanInput, rawAgentResults: unknown): string {
  return JSON.stringify({ idea, raw_agent_results: rawAgentResults }, null, 2);
}
