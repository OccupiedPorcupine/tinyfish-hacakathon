/** MVP market scope — single source of truth */

export const SOURCE_MARKETS = ["US", "India", "Brazil"] as const;
export type SourceMarket = (typeof SOURCE_MARKETS)[number];

export const TARGET_MARKETS = ["Singapore", "Indonesia", "Vietnam"] as const;
export type TargetMarket = (typeof TARGET_MARKETS)[number];

export const UI_LANGUAGES = ["English", "Bahasa Indonesia", "Vietnamese"] as const;

export const MVP_CATEGORIES = ["SMB SaaS", "Creator economy tools", "Vertical AI"] as const;
export type MvpCategory = (typeof MVP_CATEGORIES)[number];

export const BUSINESS_MODELS = [
  "B2B SaaS",
  "Marketplace",
  "Usage-based API",
  "Consumer subscription",
  "Hardware + software",
] as const;
