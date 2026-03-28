"use client";

import { CompareView } from "@/components/geogap/compare-view";
import { MarketInsightBanner } from "@/components/geogap/market-insight-banner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  loadBookmarkedMarkets,
  loadNotes,
  loadSavedScans,
  saveNotes,
  saveScanResult,
  toggleBookmarkMarket,
} from "@/lib/geogap/saved-local";
import type { NormalizedScanResult } from "@/lib/tinyfish/types";
import { TARGET_MARKETS } from "@/lib/geogap/constants";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function SavedPage() {
  const [scans, setScans] = useState<NormalizedScanResult[]>([]);
  const [notes, setNotes] = useState("");
  const [pickA, setPickA] = useState<string>("");
  const [pickB, setPickB] = useState<string>("");
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  const refreshBookmarks = () => setBookmarks(loadBookmarkedMarkets());

  useEffect(() => {
    setScans(loadSavedScans());
    setNotes(loadNotes());
    refreshBookmarks();
  }, []);

  const byId = useMemo(() => Object.fromEntries(scans.map((s) => [s.scanId, s])), [scans]);

  const pair = useMemo(() => {
    const best = (s: NormalizedScanResult | undefined) =>
      s?.markets?.length ? [...s.markets].sort((x, y) => x.rank - y.rank)[0] : undefined;
    const a = best(byId[pickA]);
    const b = best(byId[pickB]);
    if (a && b && pickA !== pickB) return [a, b] as const;
    return null;
  }, [byId, pickA, pickB]);

  return (
    <div className="space-y-8">
      <MarketInsightBanner eyebrow="Workflow memory" title="Saved">
        Saved scans, bookmarked markets, compare, and your shortlist notes—stored locally for the demo.
      </MarketInsightBanner>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Saved scans</CardTitle>
            <p className="text-xs text-muted-foreground">Populated when you hit “Save scan” on Run Scan</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {scans.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No scans yet.{" "}
                <Link href="/run-scan" className="underline">
                  Run Gap Radar
                </Link>
              </p>
            )}
            {scans.map((s) => (
              <div key={s.scanId} className="rounded-md border border-border/70 p-3 text-sm">
                <p className="font-mono text-[10px] text-muted-foreground">{s.scanId}</p>
                <p className="mt-1 font-medium line-clamp-2">{s.input.idea}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {s.input.category} · {s.usedMockFallback ? "mock/partial" : "live-normalized"}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      saveScanResult(s);
                      setScans(loadSavedScans());
                    }}
                  >
                    Refresh in list
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Notes / shortlist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Textarea
              rows={12}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={() => saveNotes(notes)}
              placeholder="Track hypotheses, investors to ping, markets to re-scan…"
              className="font-mono text-sm"
            />
            <Button type="button" size="sm" variant="secondary" onClick={() => saveNotes(notes)}>
              Save notes
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/80">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Bookmarked markets</CardTitle>
          <p className="text-xs text-muted-foreground">Toggle targets you are tracking across sessions (local only)</p>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {TARGET_MARKETS.map((m) => {
            const on = bookmarks.includes(m);
            return (
              <Button
                key={m}
                type="button"
                size="sm"
                variant={on ? "default" : "outline"}
                onClick={() => {
                  toggleBookmarkMarket(m);
                  refreshBookmarks();
                }}
              >
                {m}
              </Button>
            );
          })}
        </CardContent>
      </Card>

      <Card className="border-border/80">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Compare view</CardTitle>
          <p className="text-xs text-muted-foreground">Pick two saved scans — compares top-ranked market from each</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <select
              className="h-9 rounded-md border border-input bg-card px-2 text-sm"
              value={pickA}
              onChange={(e) => setPickA(e.target.value)}
            >
              <option value="">Scan A…</option>
              {scans.map((s) => (
                <option key={`a-${s.scanId}`} value={s.scanId}>
                  {s.scanId.slice(0, 18)}…
                </option>
              ))}
            </select>
            <select
              className="h-9 rounded-md border border-input bg-card px-2 text-sm"
              value={pickB}
              onChange={(e) => setPickB(e.target.value)}
            >
              <option value="">Scan B…</option>
              {scans.map((s) => (
                <option key={`b-${s.scanId}`} value={s.scanId}>
                  {s.scanId.slice(0, 18)}…
                </option>
              ))}
            </select>
          </div>
          {pair ? (
            <CompareView a={pair[0]} b={pair[1]} />
          ) : (
            <p className="text-sm text-muted-foreground">Select two different saved scans to compare lead markets.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
