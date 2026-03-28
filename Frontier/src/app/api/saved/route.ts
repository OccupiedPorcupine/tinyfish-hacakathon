import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const cacheDir = path.join(process.cwd(), '.cache');
    if (!fs.existsSync(cacheDir)) {
      return NextResponse.json({ scans: [] });
    }

    const files = fs.readdirSync(cacheDir).filter(f => f.startsWith('scan-') && f.endsWith('.json'));

    const scans = files
      .map(file => {
        try {
          const raw = JSON.parse(fs.readFileSync(path.join(cacheDir, file), 'utf8'));
          const data = raw.data;
          // Only return completed scans (have scores field)
          if (!data || !data.scores) return null;
          return {
            id: data.id,
            query: data.query,
            confidenceScore: data.confidenceScore,
            shortExplanation: data.shortExplanation,
            savedAt: raw.savedAt,
            topMarket: data.scores?.[0]?.market ?? null,
            topScore: data.scores?.[0]?.opportunityWindow ?? null,
          };
        } catch {
          return null;
        }
      })
      .filter(Boolean)
      .sort((a: any, b: any) => b.savedAt - a.savedAt);

    return NextResponse.json({ scans });
  } catch (err) {
    console.error('[/api/saved]', err);
    return NextResponse.json({ scans: [] });
  }
}
