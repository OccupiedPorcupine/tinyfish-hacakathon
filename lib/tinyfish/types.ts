import type { MvpCategory, TargetMarket } from "@/lib/geogap/constants";

/** Raw TinyFish SSE event (subset we care about) */
export type TinyFishEventType = "PROGRESS" | "COMPLETE" | string;

export interface TinyFishSseEvent {
  type: TinyFishEventType;
  /** TinyFish docs use resultJson on COMPLETE; some payloads may use result */
  result?: unknown;
  resultJson?: unknown;
  error?: { message?: string; code?: string };
  purpose?: string;
  /** COMPLETE events: COMPLETED | FAILED (see TinyFish API) */
  status?: string;
  /** Some ERROR events expose message at top level */
  message?: string;
  code?: string;
}

export interface TinyFishAgentRequest {
  url: string;
  goal: string;
  browser_profile?: "lite" | "stealth";
  agentId: string;
}

export interface TinyFishAgentRawResult {
  agentId: string;
  url: string;
  success: boolean;
  result?: unknown;
  errorMessage?: string;
}

/** Evidence tied to real or synthetic sources */
export interface EvidenceSource {
  id: string;
  title: string;
  url: string;
  fetchedAt: string;
  agentId?: string;
  note?: string;
}

/** 0–100 scores for UI bars */
export interface ScanScores {
  opportunityWindow: number;
  validation: number;
  whitespace: number;
  pain: number;
  momentum: number;
  localization: number;
  confidence: number;
}

export interface CompetitorCard {
  id: string;
  name: string;
  region: string;
  stage: string;
  totalRaised?: string;
  oneLiner: string;
  sourceUrl?: string;
}

export interface SaturationWhitespace {
  saturationSignal: string;
  whitespaceSignal: string;
}

export interface MarketOpportunity {
  market: TargetMarket;
  rank: number;
  scores: ScanScores;
  shortExplanation: string;
  evidenceSources: EvidenceSource[];
  competitors: CompetitorCard[];
  saturationWhitespace: SaturationWhitespace;
  recommendedWedge: string;
}

export interface GapRadarScanInput {
  idea: string;
  category: MvpCategory;
  businessModel: string;
  companyUrl: string;
}

export type ScanJobState = "queued" | "running" | "complete" | "failed";

export interface ScanProgressStep {
  id: string;
  label: string;
  status: "pending" | "active" | "done" | "error";
  at?: string;
}

export interface NormalizedScanResult {
  scanId: string;
  input: GapRadarScanInput;
  markets: MarketOpportunity[];
  globalInsight: string;
  proofOfModel?: {
    totalFundingGlobally: string;
    keyDeals: { company: string; amount: string; market: string; date: string }[];
    maturityVerdict: string;
  };
  usedMockFallback: boolean;
  fallbackReason?: string;
  generatedAt: string;
}

export interface ScanJob {
  id: string;
  state: ScanJobState;
  input: GapRadarScanInput;
  progress: ScanProgressStep[];
  result?: NormalizedScanResult;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

/** LLM / synthesis JSON shape (before normalization) */
export interface SynthesisMarketRow {
  market?: string;
  rank?: number;
  opportunity_window?: number;
  validation?: number;
  whitespace?: number;
  pain?: number;
  momentum?: number;
  localization?: number;
  confidence?: number;
  short_explanation?: string;
  recommended_wedge?: string;
  saturation_signal?: string;
  whitespace_signal?: string;
  competitors?: Array<{
    name?: string;
    region?: string;
    stage?: string;
    total_raised?: string;
    one_liner?: string;
    source_url?: string;
  }>;
  evidence?: Array<{
    title?: string;
    url?: string;
    note?: string;
  }>;
}

export interface SynthesisPayload {
  global_insight?: string;
  proof_of_model?: {
    total_funding_globally?: string;
    key_deals?: Array<{ company?: string; amount?: string; market?: string; date?: string }>;
    maturity_verdict?: string;
  };
  markets?: SynthesisMarketRow[];
}
