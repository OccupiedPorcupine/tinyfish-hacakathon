import { NextResponse } from 'next/server';
import { GapRadarRequest } from '@/lib/tinyfish/types';
import { writeCache } from '@/lib/cache';

export async function POST(request: Request) {
  try {
    const body: GapRadarRequest = await request.json();
    const id = crypto.randomUUID();

    // Write pending status immediately so polling can start
    writeCache(`scan-${id}`, { status: 'pending', id });

    // Fire and forget — runs in background while frontend polls
    runScanInBackground(id, body);

    return NextResponse.json({ id, status: 'pending' });
  } catch {
    return NextResponse.json({ error: 'Failed to start scan' }, { status: 500 });
  }
}

async function runScanInBackground(id: string, request: GapRadarRequest) {
  const { runMarketScan } = await import('@/lib/tinyfish/client');
  try {
    console.log(`[scan] Starting scan ${id} for "${request.query}"`);
    writeCache(`scan-${id}`, { status: 'processing', id });

    const result = await runMarketScan(request);

    writeCache(`scan-${id}`, result);
    console.log(`[scan] Completed scan ${id}`);
  } catch (err) {
    console.error(`[scan] Failed scan ${id}:`, err);
    writeCache(`scan-${id}`, { status: 'failed', id, error: String(err) });
  }
}
