import { NextResponse } from 'next/server';
import { readCache } from '@/lib/cache';
import { ScanResult } from '@/lib/tinyfish/types';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;

  // Scans never expire — pass a very large TTL
  const scan = readCache<ScanResult | { status: string; id: string; error?: string }>(
    `scan-${id}`,
    Number.MAX_SAFE_INTEGER
  );

  if (!scan) {
    return NextResponse.json({ error: 'Scan not found' }, { status: 404 });
  }

  // If still pending/processing, return status only
  if ('status' in scan && (scan.status === 'pending' || scan.status === 'processing')) {
    return NextResponse.json({ status: scan.status, id });
  }

  // If failed, return error
  if ('status' in scan && scan.status === 'failed') {
    return NextResponse.json({ status: 'failed', error: scan.error ?? 'Unknown error' }, { status: 500 });
  }

  // Completed — return the full result
  return NextResponse.json(scan);
}
