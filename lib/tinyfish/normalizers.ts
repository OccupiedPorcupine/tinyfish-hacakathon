import { SOURCE_MARKETS, TARGET_MARKETS, type TargetMarket } from "@/lib/geogap/constants";
import type {
  EvidenceSource,
  GapRadarScanInput,
  MarketOpportunity,
  NormalizedScanResult,
  ScanScores,
  SynthesisPayload,
} from "@/lib/tinyfish/types";

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

function toScore(v: unknown, fallback: number): number {
  if (typeof v === "number" && Number.isFinite(v)) return clamp(Math.round(v), 0, 100);
  if (typeof v === "string") {
    const p = parseFloat(v);
    if (Number.isFinite(p)) return clamp(Math.round(p), 0, 100);
  }
  return fallback;
}

const MARKET_ALIASES: Record<string, TargetMarket> = {
  singapore: "Singapore",
  sg: "Singapore",
  indonesia: "Indonesia",
  id: "Indonesia",
  jakarta: "Indonesia",
  vietnam: "Vietnam",
  vn: "Vietnam",
  "ho chi minh": "Vietnam",
  hanoi: "Vietnam",
};

function parseMarket(m: unknown): TargetMarket | null {
  if (typeof m !== "string") return null;
  const key = m.trim().toLowerCase();
  if (MARKET_ALIASES[key]) return MARKET_ALIASES[key];
  for (const tm of TARGET_MARKETS) {
    if (tm.toLowerCase() === key) return tm;
  }
  return null;
}

export function normalizeSynthesisToMarkets(
  payload: SynthesisPayload,
  scanId: string,
  input: GapRadarScanInput,
  agentEvidence: EvidenceSource[],
): MarketOpportunity[] {
  const rows = payload.markets ?? [];
  const byMarket = new Map<TargetMarket, MarketOpportunity>();

  for (const row of rows) {
    const market = parseMarket(row.market);
    if (!market) continue;

    const scores: ScanScores = {
      opportunityWindow: toScore(row.opportunity_window, 50),
      validation: toScore(row.validation, 45),
      whitespace: toScore(row.whitespace, 50),
      pain: toScore(row.pain, 50),
      momentum: toScore(row.momentum, 45),
      localization: toScore(row.localization, 40),
      confidence: toScore(row.confidence, 40),
    };

    const localEvidence: EvidenceSource[] = (row.evidence ?? []).map((e, i) => ({
      id: `${scanId}-${market}-ev-${i}`,
      title: typeof e.title === "string" ? e.title : "Source",
      url: typeof e.url === "string" && e.url.startsWith("http") ? e.url : "https://www.techinasia.com",
      fetchedAt: new Date().toISOString(),
      note: typeof e.note === "string" ? e.note : undefined,
    }));

    const mergedEvidence = [...localEvidence, ...agentEvidence.slice(0, 3)];

    byMarket.set(market, {
      market,
      rank: typeof row.rank === "number" ? row.rank : 99,
      scores,
      shortExplanation:
        typeof row.short_explanation === "string"
          ? row.short_explanation
          : "Insufficient structured explanation from model.",
      evidenceSources: mergedEvidence.length ? mergedEvidence : agentEvidence,
      competitors: (row.competitors ?? []).map((c, i) => ({
        id: `${scanId}-${market}-c-${i}`,
        name: String(c.name ?? "Unknown"),
        region: String(c.region ?? "—"),
        stage: String(c.stage ?? "—"),
        totalRaised: c.total_raised ? String(c.total_raised) : undefined,
        oneLiner: String(c.one_liner ?? "—"),
        sourceUrl: c.source_url && String(c.source_url).startsWith("http") ? String(c.source_url) : undefined,
      })),
      saturationWhitespace: {
        saturationSignal: String(row.saturation_signal ?? "Not enough data to assess saturation."),
        whitespaceSignal: String(row.whitespace_signal ?? "Whitespace unclear from current extraction."),
      },
      recommendedWedge:
        typeof row.recommended_wedge === "string"
          ? row.recommended_wedge
          : "Narrow to a paid pilot with one vertical ICP.",
    });
  }

  // Ensure all target markets present
  const ordered: MarketOpportunity[] = [];
  for (const tm of TARGET_MARKETS) {
    const existing = byMarket.get(tm);
    if (existing) ordered.push(existing);
  }
  ordered.sort((a, b) => a.rank - b.rank);
  return ordered;
}

export function buildNormalizedScanResult(params: {
  scanId: string;
  input: GapRadarScanInput;
  synthesis: SynthesisPayload;
  agentEvidence: EvidenceSource[];
  usedMockFallback: boolean;
  fallbackReason?: string;
}): NormalizedScanResult {
  const markets = normalizeSynthesisToMarkets(
    params.synthesis,
    params.scanId,
    params.input,
    params.agentEvidence,
  );

  const pm = params.synthesis.proof_of_model;
  return {
    scanId: params.scanId,
    input: params.input,
    markets,
    globalInsight:
      typeof params.synthesis.global_insight === "string"
        ? params.synthesis.global_insight
        : "GeoGap aggregated agent extractions; review evidence drawer for limitations.",
    proofOfModel: pm
      ? {
          totalFundingGlobally: String(pm.total_funding_globally ?? "—"),
          keyDeals: (pm.key_deals ?? []).map((d) => ({
            company: String(d.company ?? "—"),
            amount: String(d.amount ?? "—"),
            market: String(d.market ?? "—"),
            date: String(d.date ?? "—"),
          })),
          maturityVerdict: String(pm.maturity_verdict ?? "insufficient_data"),
        }
      : undefined,
    usedMockFallback: params.usedMockFallback,
    fallbackReason: params.fallbackReason,
    generatedAt: new Date().toISOString(),
  };
}

/** Deterministic mock when APIs fail — realistic copy, labeled synthetic */
export function mockSynthesisPayload(input: GapRadarScanInput): SynthesisPayload {
  return {
    global_insight: `Based on typical ${input.category} dynamics, ${SOURCE_MARKETS.join("/")} show repeated funding cycles while ${TARGET_MARKETS.join(", ")} still show distribution and localization headroom for "${input.idea.slice(0, 80)}". This card uses demo continuity data because live agents did not return parseable results.`,
    proof_of_model: {
      total_funding_globally: "Demo assumption: $180–320M sector funding (last 4–6 quarters) — verify with live scan",
      key_deals: [
        {
          company: "NexLedger AI",
          amount: "$44M Series B",
          market: "US",
          date: "2025-11",
        },
        {
          company: "StackMind",
          amount: "$28M Series A",
          market: "India",
          date: "2025-09",
        },
      ],
      maturity_verdict: "growing",
    },
    markets: [
      {
        market: "Indonesia",
        rank: 1,
        opportunity_window: 86,
        validation: 72,
        whitespace: 81,
        pain: 77,
        momentum: 74,
        localization: 63,
        confidence: 38,
        short_explanation:
          "Demo fallback: Large SME base and Bahasa-first procurement create a localization moat; US-validated workflows rarely ship native Bahasa compliance out of the box. Confidence is capped because this row is synthetic.",
        recommended_wedge: "Pilot with one mid-market distributor cohort; embed Bahasa contract templates day one.",
        saturation_signal: "Horizontal AI assistants crowded; vertical SMB workflows still thin.",
        whitespace_signal: "Few players bundle payroll + industry KPI copilots for 50–300 employee firms.",
        competitors: [
          {
            name: "BukuKita SaaS",
            region: "Indonesia",
            stage: "Seed",
            total_raised: "$4.2M",
            one_liner: "SMB invoicing + basic analytics",
            source_url: "https://www.techinasia.com",
          },
        ],
        evidence: [
          {
            title: "Synthetic demo source — replace with TinyFish output",
            url: "https://www.enterprisesg.gov.sg",
            note: "Labeled synthetic for demo resilience",
          },
        ],
      },
      {
        market: "Vietnam",
        rank: 2,
        opportunity_window: 78,
        validation: 68,
        whitespace: 74,
        pain: 80,
        momentum: 69,
        localization: 58,
        confidence: 36,
        short_explanation:
          "Demo fallback: High digital adoption velocity; fewer scaled Series B analogues vs Jakarta/SG for this category. Vietnamese language UI and local payment rails remain adoption gates.",
        recommended_wedge: "Land with export-oriented manufacturers needing bilingual ops dashboards.",
        saturation_signal: "Consumer fintech noise high; B2B vertical layer less documented in English sources.",
        whitespace_signal: "Operator-facing copilots with on-prem option for data residency concerns.",
        competitors: [
          {
            name: "FlowOne",
            region: "Vietnam",
            stage: "Series A",
            total_raised: "$11M",
            one_liner: "Generic workflow automation",
            source_url: "https://www.techinasia.com",
          },
        ],
        evidence: [
          {
            title: "Synthetic demo source — replace with TinyFish output",
            url: "https://vnexpress.net",
            note: "Labeled synthetic for demo resilience",
          },
        ],
      },
      {
        market: "Singapore",
        rank: 3,
        opportunity_window: 62,
        validation: 88,
        whitespace: 48,
        pain: 55,
        momentum: 71,
        localization: 42,
        confidence: 41,
        short_explanation:
          "Demo fallback: Validation dense (enterprises, GTM HQs) but whitespace tighter; pricing power strong yet incumbents and global vendors compress new entrant air cover.",
        recommended_wedge: "HQ-in-SG, build+price for Indonesia/VN rollout; use SG for trust + compliance narrative.",
        saturation_signal: "Global vendors anchor enterprise deals; POC cycle competitive.",
        whitespace_signal: "Mid-market bundle tailored to ASEAN regulatory reporting still underserviced.",
        competitors: [
          {
            name: "Vertex Cloud",
            region: "Singapore",
            stage: "Series C",
            total_raised: "$95M",
            one_liner: "Enterprise AI ops suite",
            source_url: "https://www.crunchbase.com",
          },
        ],
        evidence: [
          {
            title: "Synthetic demo source — replace with TinyFish output",
            url: "https://www.enterprisesg.gov.sg",
            note: "Labeled synthetic for demo resilience",
          },
        ],
      },
    ],
  };
}

export function evidenceFromAgentResults(
  scanId: string,
  results: Array<{
    agentId: string;
    url: string;
    success: boolean;
    result?: unknown;
    errorMessage?: string;
  }>,
): EvidenceSource[] {
  const out: EvidenceSource[] = [];
  let idx = 0;
  for (const r of results) {
    if (!r.success) {
      const detail = r.errorMessage?.trim() || "Unknown failure";
      out.push({
        id: `${scanId}-agent-${idx++}`,
        title: `Agent ${r.agentId} did not complete`,
        url: r.url,
        fetchedAt: new Date().toISOString(),
        agentId: r.agentId,
        note: `Server: ${detail}`,
      });
      continue;
    }
    const text = typeof r.result === "string" ? r.result : JSON.stringify(r.result).slice(0, 400);
    out.push({
      id: `${scanId}-agent-${idx++}`,
      title: `Extraction: ${r.agentId}`,
      url: r.url,
      fetchedAt: new Date().toISOString(),
      agentId: r.agentId,
      note: text.slice(0, 280),
    });
  }
  return out;
}
