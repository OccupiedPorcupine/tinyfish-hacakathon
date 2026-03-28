import { NextResponse } from 'next/server';
import { runMarketScan } from '@/lib/tinyfish/client';
import { GapRadarRequest } from '@/lib/tinyfish/types';

export async function POST(request: Request) {
  try {
    const body: GapRadarRequest = await request.json();
    
    // In a real app, we might validate the payload here.
    if (!body.query || !body.sourceMarkets || !body.targetMarkets) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await runMarketScan(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error during market scan:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
