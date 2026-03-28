import { GapRadarRequest, ScanResult, TinyFishRawResponse, ValidationKitRequest, ValidationKit } from './types';
import { normalizeScanResult } from './normalizers';
import { generateValidationKit } from './validation';

export async function runMarketScan(request: GapRadarRequest): Promise<ScanResult> {
  if (!process.env.TINYFISH_API_KEY) {
    console.warn("TINYFISH_API_KEY is not set. Falling back to mock data.");
    // Simulate network/LLM processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockRawResponse: TinyFishRawResponse = {
      analysis_id: crypto.randomUUID(),
      confidence: 88,
      explanation: `Target markets show strong indicators for '${request.query}' driven by rapid digital adoption and a growing middle class, mirroring early stages of ${request.sourceMarkets.join(' and ')}.`,
      markets: request.targetMarkets.map((market, i) => ({
        name: market,
        metrics: {
          window: 75 + (i * 5),
          validation: 80 - (i * 2),
          space: 60 + (i * 10),
          pain: 85 - i,
          momentum: 90 - (i * 5),
          local: 70 + (i * 8),
        }
      })),
      evidence_points: [
        { text: "Recent $50M Series B in similar vertical", category: "funding", name: "Tech in Asia" },
        { text: "Regulatory sandbox opened for digital models", category: "regulation", name: "GovTech Portal" },
        { text: "Surge in product manager hiring", category: "hiring", name: "LinkedIn Data" }
      ],
      density_map: request.targetMarkets.map((m, i) => ({ market: m, level: i === 0 ? 'High' : (i === 1 ? 'Medium' : 'Low') as any })),
      recommendation: "Establish a localized GTM motion wedge targeting Tier-2 cities where competitor density is low but digital adoption is inflecting.",
      timeline: [
        { d: "2025 Q3", e: "Early local clones appear" },
        { d: "2025 Q4", e: "First major regulatory framework introduced" },
        { d: "2026 Q1", e: "Growth phase inflection point" }
      ]
    };

    return normalizeScanResult(mockRawResponse, request.query);
  }

  const prompt = `Search the web for market analysis, startup trends, and funding news related to '${request.query}'. Compare the mature source markets (${request.sourceMarkets.join(', ')}) to the emerging target markets (${request.targetMarkets.join(', ')}). Extract the findings into a precise JSON object with the following structure:
  {
    "analysis_id": "a unique string",
    "confidence": a number between 0 and 100,
    "explanation": "a detailed string explaining the findings",
    "markets": [
      {
        "name": "Market Name",
        "metrics": { "window": 1-100, "validation": 1-100, "space": 1-100, "pain": 1-100, "momentum": 1-100, "local": 1-100 }
      }
    ],
    "evidence_points": [
      { "text": "string describing evidence", "category": "funding|regulation|hiring", "name": "source name" }
    ],
    "density_map": [
      { "market": "Market Name", "level": "High|Medium|Low" }
    ],
    "recommendation": "string recommending a GTM motion",
    "timeline": [
      { "d": "Date/Quarter string", "e": "event description" }
    ]
  }
  Respond ONLY with the JSON object.`;

  const payload = {
    url: "https://google.com",
    goal: prompt,
    browser_profile: "lite"
  };

  try {
    const res = await fetch("https://agent.tinyfish.ai/v1/automation/run", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.TINYFISH_API_KEY
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error(`TinyFish API error: ${res.statusText}`);
    }

    const data = await res.json();
    
    if (data.status !== "COMPLETED" || data.error) {
      throw new Error(data.error || "Automation did not complete successfully.");
    }

    const rawResult = data.result;
    return normalizeScanResult(rawResult as TinyFishRawResponse, request.query);
  } catch (error) {
    console.error("Error connecting to TinyFish API:", error);
    throw error;
  }
}

/**
 * Generate a complete validation kit for an opportunity
 * Orchestrates: questions → communities → pre-validated signals → export formats
 */
export async function generateValidationKitForOpportunity(request: ValidationKitRequest): Promise<ValidationKit> {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  return generateValidationKit(request);
}

