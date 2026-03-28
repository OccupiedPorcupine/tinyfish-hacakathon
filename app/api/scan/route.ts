import { after } from "next/server";
import { MVP_CATEGORIES } from "@/lib/geogap/constants";
import { executeGapRadarScan, startGapRadarScan } from "@/lib/run-gap-radar-scan";
import type { GapRadarScanInput } from "@/lib/tinyfish/types";

export const runtime = "nodejs";
/** Seconds — must cover slowest parallel agent (~10 min) + OpenAI synthesis. Vercel caps vary by plan (often 800 max). */
export const maxDuration = 800;

function parseBody(body: unknown): GapRadarScanInput | null {
  if (!body || typeof body !== "object") return null;
  const o = body as Record<string, unknown>;
  const idea = typeof o.idea === "string" ? o.idea.trim() : "";
  const category = o.category as string;
  const businessModel = typeof o.businessModel === "string" ? o.businessModel.trim() : "";
  const companyUrl = typeof o.companyUrl === "string" ? o.companyUrl.trim() : "";

  if (!idea || idea.length < 8) return null;
  if (!MVP_CATEGORIES.includes(category as (typeof MVP_CATEGORIES)[number])) return null;
  if (!businessModel) return null;

  return {
    idea,
    category: category as GapRadarScanInput["category"],
    businessModel,
    companyUrl,
  };
}

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const input = parseBody(json);
  if (!input) {
    return Response.json(
      { error: "Invalid payload: idea (min 8 chars), category, and businessModel required." },
      { status: 400 },
    );
  }

  const id = startGapRadarScan(input);

  after(async () => {
    await executeGapRadarScan(id);
  });

  return Response.json({ id });
}
