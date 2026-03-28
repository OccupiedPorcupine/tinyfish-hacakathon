import { MVP_CATEGORIES } from "@/lib/geogap/constants";
import { runGapRadarCore } from "@/lib/run-gap-radar-scan";
import type { GapRadarScanInput } from "@/lib/tinyfish/types";

export const runtime = "nodejs";
export const maxDuration = 800;

function parseBody(body: unknown): GapRadarScanInput | null {
  if (!body || typeof body !== "object") return null;
  const o = body as Record<string, unknown>;
  const idea = typeof o.idea === "string" ? o.idea.trim() : "";
  const category = o.category as string;
  const businessModel = typeof o.businessModel === "string" ? o.businessModel.trim() : "B2B SaaS";
  const companyUrl = typeof o.companyUrl === "string" ? o.companyUrl.trim() : "";

  if (!idea || idea.length < 4) return null;
  if (!MVP_CATEGORIES.includes(category as (typeof MVP_CATEGORIES)[number])) return null;

  return {
    idea,
    category: category as GapRadarScanInput["category"],
    businessModel,
    companyUrl,
  };
}

/** Direct market scan: runs TinyFish + synthesis inline (debug / tooling). */
export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const input = parseBody(json);
  if (!input) {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }

  const previewId = `market_preview_${Date.now()}`;
  const result = await runGapRadarCore(previewId, input);
  return Response.json({ result });
}
