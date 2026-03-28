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

// Validation Kit Workflow Types
export interface ValidationQuestion {
  id: string;
  question: string;
  focusArea: 'pain_quantification' | 'workflow' | 'wtp' | 'switching_cost';
  context: string; // Why this question matters given the market gap
  expectedSignals: string[]; // What answers indicate strong signal
}

export interface CommunitySource {
  id: string;
  platform: 'reddit' | 'facebook' | 'linkedin' | 'slack' | 'discord';
  name: string;
  url: string;
  memberCount: number;
  relevance: 'primary' | 'secondary'; // Primary = directly target audience, secondary = adjacent
  difficulty: 'easy' | 'medium' | 'hard'; // How easy to join/post
  description: string;
}

export interface PreValidatedSignal {
  id: string;
  signal: string; // The actual statement/quote from community
  source: string; // "r/indonesia_entrepreneurs · post comment"
  category: 'workflow_description' | 'pain_complaint' | 'tool_mention' | 'wtp_indicator';
  relevance: number; // 0-100 score for how relevant to the gap
  context: string; // Brief explanation of relevance
  url?: string;
}

export interface ValidationKit {
  id: string;
  opportunityId: string; // Reference to the gap that generated this
  category: string;
  market: string;
  createdAt: Date;

  // Step 2 output: Questions
  validationQuestions: ValidationQuestion[];

  // Step 3 output: Communities
  communities: CommunitySource[];

  // Step 4 output: Pre-validated signals
  preValidatedSignals: PreValidatedSignal[];

  // Summary metrics
  painSignalStrength: number; // 0-100: How strong are pain signals in communities
  willingSample: number; // Count of signals showing willingness to pay
  productivityGap: number; // %-0-100: Estimated time/efficiency gap from signals

  // Export formats
  markdownScript?: string; // Copy-paste interview script
  jsonData?: object; // Structured export
}

export interface ValidationKitRequest {
  scanResultId?: string; // Reference to a completed scan result
  category: string;
  market: string;
  painArea: string; // What specific pain to validate (e.g., "manual sales outreach")
  targetAudience: string; // Who we're validating with
}
