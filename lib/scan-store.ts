import type { GapRadarScanInput, NormalizedScanResult, ScanJob, ScanProgressStep } from "@/lib/tinyfish/types";

const jobs = new Map<string, ScanJob>();

function nowIso() {
  return new Date().toISOString();
}

export function createScanJob(input: GapRadarScanInput): ScanJob {
  const id = `scan_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const progress: ScanProgressStep[] = [
    { id: "agents", label: "Running TinyFish agents", status: "pending" },
    { id: "synthesis", label: "Synthesizing markets", status: "pending" },
    { id: "normalize", label: "Normalizing scores", status: "pending" },
  ];
  const job: ScanJob = {
    id,
    state: "queued",
    input,
    progress,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  jobs.set(id, job);
  return job;
}

export function getScanJob(id: string): ScanJob | undefined {
  return jobs.get(id);
}

function updateJob(id: string, patch: Partial<ScanJob>) {
  const j = jobs.get(id);
  if (!j) return;
  jobs.set(id, { ...j, ...patch, updatedAt: nowIso() });
}

export function setScanRunning(id: string) {
  updateJob(id, { state: "running" });
}

export function updateProgress(id: string, stepId: string, status: ScanProgressStep["status"]) {
  const j = jobs.get(id);
  if (!j) return;
  const progress = j.progress.map((p) =>
    p.id === stepId ? { ...p, status, at: nowIso() } : p,
  );
  updateJob(id, { progress });
}

export function setScanComplete(id: string, result: NormalizedScanResult) {
  updateJob(id, { state: "complete", result });
}

export function setScanFailed(id: string, error: string) {
  updateJob(id, { state: "failed", error });
}
