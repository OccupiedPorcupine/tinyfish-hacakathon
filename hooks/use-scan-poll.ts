"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { NormalizedScanResult } from "@/lib/tinyfish/types";

export type ScanPollState = "idle" | "pending" | "running" | "complete" | "failed";

export interface ScanPollResponse {
  id: string;
  state: string;
  progress: { id: string; label: string; status: string }[];
  result?: NormalizedScanResult;
  error?: string;
}

export function useScanPoll() {
  const [scanId, setScanId] = useState<string | null>(null);
  const [phase, setPhase] = useState<ScanPollState>("idle");
  const [progress, setProgress] = useState<ScanPollResponse["progress"]>([]);
  const [result, setResult] = useState<NormalizedScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPoll = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  }, []);

  const pollOnce = useCallback(async (id: string) => {
    const res = await fetch(`/api/scan/${id}`);
    if (!res.ok) {
      setPhase("failed");
      setError("Scan not found");
      stopPoll();
      return;
    }
    const data = (await res.json()) as ScanPollResponse;
    setProgress(data.progress ?? []);
    if (data.state === "complete" && data.result) {
      setResult(data.result);
      setPhase("complete");
      stopPoll();
    } else if (data.state === "failed") {
      setError(data.error ?? "Scan failed");
      setPhase("failed");
      stopPoll();
    } else if (data.state === "running" || data.state === "queued") {
      setPhase("running");
    }
  }, [stopPoll]);

  const startScan = useCallback(
    async (body: {
      idea: string;
      category: string;
      businessModel: string;
      companyUrl: string;
    }) => {
      stopPoll();
      setError(null);
      setResult(null);
      setPhase("pending");
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setPhase("failed");
        setError((j as { error?: string }).error ?? "Could not start scan");
        return;
      }
      const { id } = (await res.json()) as { id: string };
      setScanId(id);
      setPhase("running");
      timer.current = setInterval(() => void pollOnce(id), 2000);
      void pollOnce(id);
    },
    [pollOnce, stopPoll],
  );

  useEffect(() => () => stopPoll(), [stopPoll]);

  return { scanId, phase, progress, result, error, startScan, pollOnce, stopPoll };
}
