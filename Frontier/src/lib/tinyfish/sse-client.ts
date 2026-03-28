/**
 * Calls TinyFish via the run-sse endpoint, consumes the SSE stream,
 * and resolves with the final result from the COMPLETE event.
 */
export async function runTinyFishTask(url: string, goal: string): Promise<string> {
  const apiKey = process.env.TINYFISH_API_KEY;
  if (!apiKey) throw new Error('TINYFISH_API_KEY is not set');

  console.log(`[TinyFish] Starting task → ${url}`);

  const res = await fetch('https://agent.tinyfish.ai/v1/automation/run-sse', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
    },
    body: JSON.stringify({ url, goal, browser_profile: 'lite' }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`[TinyFish] HTTP error ${res.status}: ${text}`);
    throw new Error(`TinyFish API error ${res.status}: ${text}`);
  }

  if (!res.body) throw new Error('TinyFish returned no response body');

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let runId = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const raw = line.slice(6).trim();
      if (!raw || raw === '[DONE]') continue;

      let event: Record<string, unknown>;
      try {
        event = JSON.parse(raw);
      } catch {
        continue;
      }

      if (event.type === 'STARTED') {
        runId = event.run_id as string;
        console.log(`[TinyFish] Run started — run_id: ${runId}`);
      } else if (event.type === 'PROGRESS') {
        console.log(`[TinyFish] Progress — ${event.purpose}`);
      } else if (event.type === 'COMPLETE') {
        if (event.status === 'COMPLETED') {
          console.log(`[TinyFish] ✓ Completed — run_id: ${runId}`);
          return typeof event.result === 'string'
            ? event.result
            : JSON.stringify(event.result);
        }
        console.error(`[TinyFish] ✗ Failed — ${event.error}`);
        throw new Error((event.error as string) ?? 'TinyFish task failed');
      }
    }
  }

  throw new Error('SSE stream ended without a COMPLETE event');
}
