import type { TinyFishAgentRequest, TinyFishAgentRawResult, TinyFishSseEvent } from "@/lib/tinyfish/types";

const TINYFISH_BASE = "https://agent.tinyfish.ai/v1";
const TINYFISH_RUN_ASYNC = `${TINYFISH_BASE}/automation/run-async`;
const TINYFISH_RUN_SSE = `${TINYFISH_BASE}/automation/run-sse`;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseTimeoutMs(): number {
  const raw = process.env.TINYFISH_AGENT_TIMEOUT_MS;
  if (raw) {
    const n = parseInt(raw, 10);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return 720_000;
}

function parsePollIntervalMs(): number {
  const raw = process.env.TINYFISH_POLL_INTERVAL_MS;
  if (raw) {
    const n = parseInt(raw, 10);
    if (Number.isFinite(n) && n >= 1000) return n;
  }
  return 4000;
}

function sseTransportEnabled(): boolean {
  return process.env.TINYFISH_USE_SSE === "1" || process.env.TINYFISH_USE_SSE === "true";
}

interface TinyFishRunRecord {
  run_id?: string;
  status?: string;
  result?: unknown;
  resultJson?: unknown;
  error?: { message?: string };
}

function extractRunId(body: Record<string, unknown>): string | null {
  const id = body.run_id ?? body.runId;
  return typeof id === "string" && id.length > 0 ? id : null;
}

async function submitAsyncRun(
  apiKey: string,
  req: TinyFishAgentRequest,
  signal: AbortSignal,
): Promise<{ runId: string } | { error: string }> {
  const res = await fetch(TINYFISH_RUN_ASYNC, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify({
      url: req.url,
      goal: req.goal,
      browser_profile: req.browser_profile ?? process.env.TINYFISH_BROWSER_PROFILE ?? "stealth",
    }),
    signal,
  });

  let body: unknown;
  try {
    body = await res.json();
  } catch {
    return { error: `run-async: HTTP ${res.status} (non-JSON body)` };
  }

  if (!res.ok) {
    const msg =
      typeof body === "object" && body !== null && "message" in body
        ? String((body as { message: unknown }).message)
        : JSON.stringify(body);
    return { error: `run-async: HTTP ${res.status} — ${msg}` };
  }

  const runId = extractRunId(body as Record<string, unknown>);
  if (!runId) {
    return { error: "run-async: missing run_id in response" };
  }
  return { runId };
}

async function pollRunUntilTerminal(
  apiKey: string,
  runId: string,
  deadline: number,
  pollIntervalMs: number,
  signal: AbortSignal,
  meta: { agentId: string; url: string },
  startedAt: number,
  onProgress?: (msg: string) => void,
): Promise<TinyFishAgentRawResult> {
  let lastStatus = "";

  while (Date.now() < deadline) {
    if (signal.aborted) {
      return {
        ...meta,
        success: false,
        errorMessage: "This operation was aborted",
      };
    }

    const res = await fetch(`${TINYFISH_BASE}/runs/${encodeURIComponent(runId)}`, {
      headers: { "X-API-Key": apiKey },
      signal,
    });

    let run: TinyFishRunRecord;
    try {
      run = (await res.json()) as TinyFishRunRecord;
    } catch {
      await sleep(pollIntervalMs);
      continue;
    }

    if (!res.ok) {
      await sleep(pollIntervalMs);
      continue;
    }

    const st = String(run.status ?? "").toUpperCase();
    if (st && st !== lastStatus) {
      lastStatus = st;
      onProgress?.(`Async ${runId.slice(0, 10)}… ${st}`);
    }

    if (st === "COMPLETED") {
      const result = run.resultJson !== undefined ? run.resultJson : run.result;
      return {
        ...meta,
        success: true,
        result: result !== undefined ? result : {},
      };
    }

    if (st === "FAILED" || st === "CANCELLED") {
      return {
        ...meta,
        success: false,
        errorMessage: run.error?.message ?? st,
      };
    }

    await sleep(pollIntervalMs);
  }

  return {
    ...meta,
    success: false,
    errorMessage: `Poll timeout: no COMPLETED after ${Math.round((Date.now() - startedAt) / 1000)}s (raise TINYFISH_AGENT_TIMEOUT_MS or Next route maxDuration)`,
  };
}

async function* readSseLines(reader: ReadableStreamDefaultReader<Uint8Array>) {
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      if (buffer.trim()) yield buffer;
      break;
    }
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) yield line;
  }
}

async function runTinyFishAgentSse(
  req: TinyFishAgentRequest,
  apiKey: string,
  timeoutMs: number,
  options?: { onProgress?: (msg: string) => void },
): Promise<TinyFishAgentRawResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(TINYFISH_RUN_SSE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify({
        url: req.url,
        goal: req.goal,
        browser_profile: req.browser_profile ?? process.env.TINYFISH_BROWSER_PROFILE ?? "stealth",
      }),
      signal: controller.signal,
    });

    if (!res.ok || !res.body) {
      return {
        agentId: req.agentId,
        url: req.url,
        success: false,
        errorMessage: `HTTP ${res.status}`,
      };
    }

    const reader = res.body.getReader();
    let lastResult: unknown;

    for await (const line of readSseLines(reader)) {
      const full = line.trim();
      if (!full.startsWith("data: ")) continue;
      const jsonStr = full.slice(6).trim();
      if (!jsonStr || jsonStr === "[DONE]") continue;
      let ev: TinyFishSseEvent;
      try {
        ev = JSON.parse(jsonStr) as TinyFishSseEvent;
      } catch {
        continue;
      }
      if (ev.type === "ERROR") {
        const msg = ev.message ?? ev.error?.message ?? ev.code ?? "TinyFish ERROR event";
        return {
          agentId: req.agentId,
          url: req.url,
          success: false,
          errorMessage: msg,
        };
      }
      if (ev.type === "PROGRESS" && ev.purpose && options?.onProgress) {
        options.onProgress(ev.purpose);
      }
      if (ev.type === "COMPLETE") {
        const ok = ev.status === "COMPLETED" || ev.status === "completed";
        if (ok) {
          if (ev.resultJson !== undefined) lastResult = ev.resultJson;
          else if (ev.result !== undefined) lastResult = ev.result;
          else lastResult = {};
        } else {
          return {
            agentId: req.agentId,
            url: req.url,
            success: false,
            errorMessage: ev.error?.message ?? "TinyFish COMPLETE without success",
          };
        }
      }
    }

    if (lastResult === undefined) {
      return {
        agentId: req.agentId,
        url: req.url,
        success: false,
        errorMessage: "Stream ended without COMPLETE",
      };
    }

    return {
      agentId: req.agentId,
      url: req.url,
      success: true,
      result: lastResult,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return {
      agentId: req.agentId,
      url: req.url,
      success: false,
      errorMessage: msg,
    };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Default: POST /automation/run-async + poll GET /runs/{id} (suited to multi-minute runs).
 * TINYFISH_USE_SSE=true → legacy /run-sse streaming.
 */
export async function runTinyFishAgent(
  req: TinyFishAgentRequest,
  options?: { timeoutMs?: number; onProgress?: (msg: string) => void },
): Promise<TinyFishAgentRawResult> {
  const apiKey = process.env.TINYFISH_API_KEY;
  if (!apiKey) {
    return {
      agentId: req.agentId,
      url: req.url,
      success: false,
      errorMessage: "TINYFISH_API_KEY not configured",
    };
  }

  const timeoutMs = options?.timeoutMs ?? parseTimeoutMs();
  const pollIntervalMs = parsePollIntervalMs();
  const meta = { agentId: req.agentId, url: req.url };

  if (sseTransportEnabled()) {
    return runTinyFishAgentSse(req, apiKey, timeoutMs, options);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const submit = await submitAsyncRun(apiKey, req, controller.signal);
    if ("error" in submit) {
      return { ...meta, success: false, errorMessage: submit.error };
    }

    const startedAt = Date.now();
    const deadline = startedAt + timeoutMs;
    options?.onProgress?.(`Queued async run ${submit.runId.slice(0, 14)}…`);

    return await pollRunUntilTerminal(
      apiKey,
      submit.runId,
      deadline,
      pollIntervalMs,
      controller.signal,
      meta,
      startedAt,
      options?.onProgress,
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ...meta, success: false, errorMessage: msg };
  } finally {
    clearTimeout(timer);
  }
}

export async function runTinyFishAgentsParallel(
  tasks: TinyFishAgentRequest[],
  onProgress?: (agentId: string, msg: string) => void,
): Promise<TinyFishAgentRawResult[]> {
  return Promise.all(
    tasks.map((t) =>
      runTinyFishAgent(t, {
        onProgress: (m) => onProgress?.(t.agentId, m),
      }),
    ),
  );
}
