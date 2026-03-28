import { runTinyFishAgentsParallel } from "@/lib/tinyfish/client";
import {
  buildNormalizedScanResult,
  evidenceFromAgentResults,
  mockSynthesisPayload,
} from "@/lib/tinyfish/normalizers";
import { buildGapRadarAgentTasks } from "@/lib/tinyfish/prompts";
import { synthesizeGapRadar } from "@/lib/tinyfish/synthesis";
import type { GapRadarScanInput, NormalizedScanResult, TinyFishAgentRequest } from "@/lib/tinyfish/types";
import {
  createScanJob,
  getScanJob,
  setScanComplete,
  setScanFailed,
  setScanRunning,
  updateProgress,
} from "@/lib/scan-store";

export async function runGapRadarCore(
  scanId: string,
  input: GapRadarScanInput,
): Promise<NormalizedScanResult> {
  const tasks: TinyFishAgentRequest[] = buildGapRadarAgentTasks(input).map((t) => ({
    agentId: t.agentId,
    url: t.url,
    goal: t.goal,
  }));

  const raw = await runTinyFishAgentsParallel(tasks);

  const agentEvidence = evidenceFromAgentResults(scanId, raw);
  const anySuccess = raw.some((r) => r.success);

  let synthesis = await synthesizeGapRadar(input, raw);
  let usedMock = false;
  let fallbackReason: string | undefined;

  if (!synthesis || !synthesis.markets?.length) {
    usedMock = true;
    fallbackReason = !anySuccess
      ? "All TinyFish agents failed or returned empty; demo continuity engaged."
      : "Synthesis unavailable or unparsable; demo continuity engaged.";
    synthesis = mockSynthesisPayload(input);
  }

  return buildNormalizedScanResult({
    scanId,
    input,
    synthesis,
    agentEvidence,
    usedMockFallback: usedMock,
    fallbackReason,
  });
}

export async function executeGapRadarScan(scanId: string): Promise<void> {
  const job = getScanJob(scanId);
  if (!job) return;

  try {
    setScanRunning(scanId);
    updateProgress(scanId, "agents", "active");

    const result = await runGapRadarCore(scanId, job.input);

    updateProgress(scanId, "agents", "done");
    updateProgress(scanId, "synthesis", "done");
    updateProgress(scanId, "normalize", "done");
    setScanComplete(scanId, result);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    setScanFailed(scanId, msg);
  }
}

export function startGapRadarScan(input: Parameters<typeof createScanJob>[0]): string {
  const { id } = createScanJob(input);
  return id;
}
