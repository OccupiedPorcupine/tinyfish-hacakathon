"use client";

import type { NormalizedScanResult } from "@/lib/tinyfish/types";

const KEY_SCANS = "geogap_saved_scans_v1";
const KEY_MARKETS = "geogap_bookmarked_markets_v1";
const KEY_NOTES = "geogap_notes_v1";
const KEY_COMPARE = "geogap_compare_ids_v1";

export function loadSavedScans(): NormalizedScanResult[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY_SCANS);
    if (!raw) return [];
    return JSON.parse(raw) as NormalizedScanResult[];
  } catch {
    return [];
  }
}

export function saveScanResult(result: NormalizedScanResult): void {
  const prev = loadSavedScans();
  const next = [result, ...prev.filter((s) => s.scanId !== result.scanId)].slice(0, 40);
  localStorage.setItem(KEY_SCANS, JSON.stringify(next));
}

export function loadNotes(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(KEY_NOTES) ?? "";
}

export function saveNotes(text: string): void {
  localStorage.setItem(KEY_NOTES, text);
}

export function loadCompareIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY_COMPARE);
    if (!raw) return [];
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export function setCompareIds(ids: string[]): void {
  localStorage.setItem(KEY_COMPARE, JSON.stringify(ids.slice(0, 4)));
}

export function toggleBookmarkMarket(market: string): boolean {
  const raw = localStorage.getItem(KEY_MARKETS);
  const list: string[] = raw ? (JSON.parse(raw) as string[]) : [];
  const has = list.includes(market);
  const next = has ? list.filter((m) => m !== market) : [...list, market];
  localStorage.setItem(KEY_MARKETS, JSON.stringify(next));
  return !has;
}

export function loadBookmarkedMarkets(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY_MARKETS);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}
