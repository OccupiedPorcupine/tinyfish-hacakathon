import type { TargetMarket } from "@/lib/geogap/constants";

export const INTELLIGENCE_STRIP = [
  {
    id: "1",
    headline: "Vertical AI for regulated workflows is funding faster in the US than SEA deployment cycles.",
    detail: "Based on last-90d agent sampling across TechCrunch venture + regional tech press.",
    confidence: 62,
  },
  {
    id: "2",
    headline: "Indonesia shows the widest whitespace for SMB SaaS bundles with Bahasa-first onboarding.",
    detail: "Compared to Singapore HQ density and Vietnam’s manufacturing-led buyer behavior.",
    confidence: 58,
  },
  {
    id: "3",
    headline: "Creator economy tooling is consolidating in India; Vietnam still lacks payout + tax stack depth.",
    detail: "Cross-check hiring velocity still thin versus US comparables.",
    confidence: 54,
  },
] as const;

export interface HeatCell {
  market: TargetMarket;
  intensity: number;
  label: string;
}

export const HEATMAP_CELLS: HeatCell[] = [
  { market: "Singapore", intensity: 72, label: "Validation dense" },
  { market: "Indonesia", intensity: 88, label: "Whitespace hot" },
  { market: "Vietnam", intensity: 79, label: "Momentum building" },
];

export const MARKET_MOVERS = [
  {
    id: "m1",
    market: "Indonesia" as const,
    delta: "+2.4",
    driver: "OJK digital reporting nudges lifted SMB software intent in agent-captured headlines.",
    windowDays: 14,
  },
  {
    id: "m2",
    market: "Vietnam" as const,
    delta: "+1.1",
    driver: "Export manufacturers posting more MES/analytics roles vs prior quarter baseline.",
    windowDays: 21,
  },
  {
    id: "m3",
    market: "Singapore" as const,
    delta: "−0.6",
    driver: "Global vendor POC wins compressed mid-market whitespace in vertical AI pitches.",
    windowDays: 30,
  },
];

export const FUNDING_PULSE = [
  {
    company: "NexLedger AI",
    amount: "$44M Series B",
    market: "US",
    category: "Vertical AI",
    date: "Nov 2025",
  },
  {
    company: "KreatorPay",
    amount: "$18M Series A",
    market: "India",
    category: "Creator economy tools",
    date: "Oct 2025",
  },
  {
    company: "BukuKita SaaS",
    amount: "$4.2M Seed",
    market: "Indonesia",
    category: "SMB SaaS",
    date: "Sep 2025",
  },
  {
    company: "Vertex Cloud",
    amount: "$22M extension",
    market: "Singapore",
    category: "Vertical AI",
    date: "Aug 2025",
  },
  {
    company: "RioFlow",
    amount: "$12M Seed",
    market: "Brazil",
    category: "SMB SaaS",
    date: "Jul 2025",
  },
];

export const EMERGING_PATTERNS = [
  {
    pattern: "SMB copilots bundled with payroll",
    transferLagMonths: "14–20",
    sourceMarkets: "US, India",
    seaReadiness: "ID high, VN medium, SG crowded",
  },
  {
    pattern: "Creator payout + tax compliance stacks",
    transferLagMonths: "10–16",
    sourceMarkets: "US, Brazil",
    seaReadiness: "VN high, ID medium",
  },
];

export const EARLY_TRANSFER_SIGNALS = [
  {
    category: "Vertical AI for compliance logs",
    matureSignal: "Three $25M+ US rounds in Q4 with explicit regulated-industry GTM.",
    seaGap: "Few Bahasa/Vietnamese-native audit trail vendors at Series A scale.",
    confidence: 55,
  },
  {
    category: "Creator CRM + brand deal analytics",
    matureSignal: "India marketplaces integrating invoicing; US tools adding AI briefs.",
    seaGap: "SEA still split between spreadsheets and lightweight mobile CRMs.",
    confidence: 48,
  },
];

export const ACCELERATING_CATEGORIES = [
  { name: "SMB SaaS", velocity: "high" as const, note: "Grants + digitization mandates in ID/SG feeds." },
  { name: "Vertical AI", velocity: "high" as const, note: "US proofs arriving faster than local deployment." },
  { name: "Creator economy tools", velocity: "medium" as const, note: "Payout infra still the choke point." },
];
