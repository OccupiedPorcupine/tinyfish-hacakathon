import { NextResponse } from 'next/server';
import { GapRadarRequest } from '@/lib/tinyfish/types';

// In-memory store for demo purposes (would be Redis/DB in prod)
const globalStore = global as any;
if (!globalStore.scans) {
  globalStore.scans = new Map();
}

export async function POST(request: Request) {
  try {
    const body: GapRadarRequest = await request.json();
    const id = crypto.randomUUID();
    
    globalStore.scans.set(id, {
      status: 'pending',
      request: body,
      createdAt: Date.now()
    });

    // Fire and forget the background simulation
    startSimulatedBackgroundScan(id, body);

    return NextResponse.json({ id, status: 'pending' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to start scan' }, { status: 500 });
  }
}

async function startSimulatedBackgroundScan(id: string, request: GapRadarRequest) {
  const { runMarketScan } = await import('@/lib/tinyfish/client');
  try {
    const result = await runMarketScan(request);
    globalStore.scans.set(id, {
      status: 'completed',
      result,
      updatedAt: Date.now()
    });
  } catch (err) {
    globalStore.scans.set(id, { status: 'failed', error: String(err) });
  }
}
