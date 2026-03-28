"use client";

import { CompareView } from "@/components/geogap/compare-view";
import { EvidenceDrawer } from "@/components/geogap/evidence-drawer";
import { MarketInsightBanner } from "@/components/geogap/market-insight-banner";
import { OpportunityScoreCards } from "@/components/geogap/opportunity-score-cards";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BUSINESS_MODELS, MVP_CATEGORIES } from "@/lib/geogap/constants";
import { saveScanResult } from "@/lib/geogap/saved-local";
import { useScanPoll } from "@/hooks/use-scan-poll";
import type { MarketOpportunity } from "@/lib/tinyfish/types";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

function CompetitorCards({ competitors }: { competitors: MarketOpportunity["competitors"] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {competitors.map((c) => (
        <Card key={c.id} className="border-border/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{c.name}</CardTitle>
            <p className="text-xs text-muted-foreground">
              {c.region} · {c.stage}
              {c.totalRaised ? ` · ${c.totalRaised}` : ""}
            </p>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground leading-relaxed">
            {c.oneLiner}
            {c.sourceUrl && (
              <a href={c.sourceUrl} className="mt-2 block font-mono text-[10px] text-foreground underline" target="_blank" rel="noreferrer">
                Source
              </a>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function RunScanClient() {
  const sp = useSearchParams();
  const { phase, progress, result, error, startScan } = useScanPoll();
  const [idea, setIdea] = useState(
    () => sp.get("idea") ?? "Vertical AI assistant for SME compliance logs with export-ready audit trails",
  );
  const [category, setCategory] = useState(() => sp.get("category") ?? MVP_CATEGORIES[2]);
  const [businessModel, setBusinessModel] = useState(() => sp.get("businessModel") ?? BUSINESS_MODELS[0]);
  const [companyUrl, setCompanyUrl] = useState(() => sp.get("companyUrl") ?? "");

  useEffect(() => {
    const i = sp.get("idea");
    if (i) setIdea(i);
    const c = sp.get("category");
    if (c && MVP_CATEGORIES.includes(c as (typeof MVP_CATEGORIES)[number])) setCategory(c);
    const b = sp.get("businessModel");
    if (b) setBusinessModel(b);
    const u = sp.get("companyUrl");
    if (u !== null) setCompanyUrl(u);
  }, [sp]);

  const [evidenceFor, setEvidenceFor] = useState<MarketOpportunity | null>(null);
  const [comparePick, setComparePick] = useState<[MarketOpportunity | null, MarketOpportunity | null]>([
    null,
    null,
  ]);

  const topTwo = useMemo(() => {
    if (!result?.markets?.length) return null;
    const sorted = [...result.markets].sort((a, b) => a.rank - b.rank);
    return [sorted[0], sorted[1]] as [MarketOpportunity, MarketOpportunity];
  }, [result]);

  const progressValue =
    progress.length === 0
      ? 5
      : (progress.filter((p) => p.status === "done").length / progress.length) * 100;

  return (
    <div className="space-y-8">
      <MarketInsightBanner eyebrow="Gap Radar" title="Run Scan">
        Flagship workflow: idea, category, business model, and optional URL. GeoGap runs TinyFish agents server-side,
        normalizes scores, and opens the evidence drawer on demand.
      </MarketInsightBanner>

      <div className="grid gap-8 lg:grid-cols-5">
        <Card className="border-border/80 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Scan input</CardTitle>
            <p className="text-xs text-muted-foreground">POST /api/scan — poll GET /api/scan/:id</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="idea">Startup idea</Label>
              <Textarea id="idea" rows={4} value={idea} onChange={(e) => setIdea(e.target.value)} className="font-mono text-sm" />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MVP_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Business model</Label>
              <Select value={businessModel} onValueChange={setBusinessModel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BUSINESS_MODELS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">Company URL</Label>
              <Input id="url" value={companyUrl} onChange={(e) => setCompanyUrl(e.target.value)} className="font-mono text-sm" placeholder="https://…" />
            </div>
            <Button
              type="button"
              disabled={phase === "running" || phase === "pending"}
              onClick={() =>
                startScan({
                  idea,
                  category,
                  businessModel,
                  companyUrl,
                })
              }
            >
              {phase === "running" || phase === "pending" ? "Scanning…" : "Run Gap Radar"}
            </Button>
            {(phase === "running" || phase === "pending") && (
              <div className="space-y-2">
                <Progress value={progressValue} />
                <ul className="space-y-1 font-mono text-[10px] text-muted-foreground">
                  {progress.map((p) => (
                    <li key={p.id}>
                      {p.label}: {p.status}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {error && <p className="text-sm text-red-700">{error}</p>}
          </CardContent>
        </Card>

        <div className="space-y-6 lg:col-span-3">
          {result && (
            <>
              <div className="flex flex-wrap items-center gap-2">
                {result.usedMockFallback && (
                  <Badge variant="med">Demo continuity / partial agents</Badge>
                )}
                {result.fallbackReason && (
                  <span className="text-xs text-muted-foreground">{result.fallbackReason}</span>
                )}
              </div>
              <Card className="border-border/80">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Global read</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground leading-relaxed">{result.globalInsight}</CardContent>
              </Card>
              {result.proofOfModel && (
                <Card className="border-border/80">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Proof of model (funding)</CardTitle>
                    <p className="text-xs text-muted-foreground">{result.proofOfModel.totalFundingGlobally}</p>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <Badge variant="outline">{result.proofOfModel.maturityVerdict}</Badge>
                    <ul className="list-inside list-disc text-xs text-muted-foreground">
                      {result.proofOfModel.keyDeals.map((d) => (
                        <li key={`${d.company}-${d.date}`}>
                          {d.company} · {d.amount} · {d.market} · {d.date}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
              <div className="space-y-3">
                <h2 className="text-lg font-semibold">Ranked target markets</h2>
                <div className="grid gap-4">
                  {result.markets.map((m) => (
                    <OpportunityScoreCards
                      key={m.market}
                      opportunity={m}
                      onOpenEvidence={() => setEvidenceFor(m)}
                    />
                  ))}
                </div>
              </div>
              <EvidenceDrawer
                open={!!evidenceFor}
                onOpenChange={(o) => {
                  if (!o) setEvidenceFor(null);
                }}
                sources={evidenceFor?.evidenceSources ?? []}
                title={evidenceFor ? `Evidence — ${evidenceFor.market}` : "Evidence sources"}
              />
              <div className="space-y-3">
                <h2 className="text-lg font-semibold">Competitors & analogues</h2>
                {result.markets.map((m) => (
                  <div key={`comp-${m.market}`}>
                    <p className="mb-2 text-sm font-medium">{m.market}</p>
                    <CompetitorCards competitors={m.competitors} />
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    saveScanResult(result);
                  }}
                >
                  Save scan
                </Button>
                {topTwo && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setComparePick([topTwo[0], topTwo[1]])}
                  >
                    Compare top two markets
                  </Button>
                )}
                <Button asChild variant="ghost">
                  <Link href="/saved">View saved</Link>
                </Button>
              </div>
              {comparePick[0] && comparePick[1] && (
                <div className="space-y-3">
                  <h2 className="text-lg font-semibold">Compare</h2>
                  <CompareView a={comparePick[0]} b={comparePick[1]} />
                </div>
              )}
            </>
          )}
          {!result && phase === "idle" && (
            <p className="text-sm text-muted-foreground">
              Submit a scan to see ranked markets, scores, competitors, and evidence-backed copy.
            </p>
          )}
        </div>
      </div>

    </div>
  );
}
