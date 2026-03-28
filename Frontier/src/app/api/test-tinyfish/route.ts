import { NextResponse } from 'next/server';

// Hits TinyFish and returns the first SSE event only (fast — no need to wait for completion)
export async function GET() {
  const apiKey = process.env.TINYFISH_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'TINYFISH_API_KEY not set' }, { status: 500 });

  try {
    const res = await fetch('https://agent.tinyfish.ai/v1/automation/run-sse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-API-Key': apiKey },
      body: JSON.stringify({ url: 'https://example.com', goal: 'What is the title of this page?', browser_profile: 'lite' }),
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: `TinyFish HTTP ${res.status}`, body: text });
    }

    // Read just the first SSE event then stop
    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let firstEvent = '';

    while (!firstEvent) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      const line = chunk.split('\n').find(l => l.startsWith('data: '));
      if (line) firstEvent = line.slice(6);
    }

    reader.cancel();
    return NextResponse.json({ ok: true, firstEvent: JSON.parse(firstEvent) });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
