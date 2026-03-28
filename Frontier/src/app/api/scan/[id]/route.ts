import { NextResponse } from 'next/server';

const globalStore = global as any;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Next.js 15 route handler param typing
) {
  const id = (await params).id;
  const scan = globalStore.scans?.get(id);

  if (!scan) {
    return NextResponse.json({ error: 'Scan not found' }, { status: 404 });
  }

  if (scan.status === 'completed') {
    return NextResponse.json(scan.result);
  }

  return NextResponse.json({ status: scan.status, id });
}
