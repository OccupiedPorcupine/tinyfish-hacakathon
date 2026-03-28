export interface GapRadarRequest {
  query: string; // e.g., "SMB SaaS", "Creator Economy", "Vertical AI"
  sourceMarkets: string[]; // e.g., ["US", "India", "Brazil"]
  targetMarkets: string[]; // e.g., ["Singapore", "Indonesia", "Vietnam"]
}

export interface MarketScore {
  market: string;
  opportunityWindow: number; // 0-100
  validation: number; // 0-100
  whitespace: number; // 0-100
  pain: number; // 0-100
  momentum: number; // 0-100
  localization: number; // 0-100
}

export interface EvidenceLabel {
  text: string;
  type: 'funding' | 'hiring' | 'regulation' | 'trend';
  sourceUrl?: string;
  sourceName?: string;
}

export interface ScanResult {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  query: string;
  confidenceScore: number;
  shortExplanation: string;
  scores: MarketScore[];
  evidence: EvidenceLabel[];
  competitorDensity: { market: string; density: 'Low' | 'Medium' | 'High' }[];
  wedgeRecommendation: string;
  signalTimeline: { date: string; event: string }[];
}

export interface TinyFishRawResponse {
  // Raw structure expected from TinyFish LLM
  analysis_id: string;
  confidence: number;
  explanation: string;
  markets: {
    name: string;
    metrics: { window: number; validation: number; space: number; pain: number; momentum: number; local: number; };
  }[];
  evidence_points: { text: string; category: string; link?: string; name?: string }[];
  density_map: { market: string; level: string }[];
  recommendation: string;
  timeline: { d: string; e: string }[];
}
