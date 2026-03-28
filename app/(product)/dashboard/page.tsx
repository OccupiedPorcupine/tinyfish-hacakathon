"use client";

import { AcceleratingCategoriesSection } from "@/components/geogap/accelerating-categories-section";
import { EmergingPatternsWidget } from "@/components/geogap/emerging-patterns-widget";
import { FundingPulseCards } from "@/components/geogap/funding-pulse-cards";
import { GlobalHeatmap } from "@/components/geogap/global-heatmap";
import { MarketInsightBanner } from "@/components/geogap/market-insight-banner";
import { MarketMoversPanel } from "@/components/geogap/market-movers-panel";
import { ScanComposer } from "@/components/geogap/scan-composer";
import { SelectedMarketDetailPanel } from "@/components/geogap/selected-market-detail-panel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ACCELERATING_CATEGORIES,
  EMERGING_PATTERNS,
  FUNDING_PULSE,
  HEATMAP_CELLS,
  INTELLIGENCE_STRIP,
  MARKET_MOVERS,
} from "@/lib/geogap/demo-static";
import Link from "next/link";
import { useState } from "react";

export default function DashboardPage() {
  const [selectedMarket, setSelectedMarket] = useState<string | null>("Indonesia");

  return (
    <div className="space-y-8">
      <MarketInsightBanner eyebrow="Founder intelligence terminal" title="GeoGap dashboard">
        Cross-market arbitrage signals across US, India, and Brazil into Singapore, Indonesia, and Vietnam—evidence
        labeled, never magical.
      </MarketInsightBanner>

      <section className="space-y-3">
        <h2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground">Intelligence strip</h2>
        <div className="grid gap-3 lg:grid-cols-3">
          {INTELLIGENCE_STRIP.map((i) => (
            <Card key={i.id} className="border-border/80">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold leading-snug">{i.headline}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground leading-relaxed">{i.detail}</p>
                <p className="mt-2 font-mono text-[10px] text-muted-foreground">Confidence {i.confidence}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Global heatmap</h2>
            <p className="text-sm text-muted-foreground">Target market intensity vs last baseline (demo calibration)</p>
          </div>
        </div>
        <GlobalHeatmap cells={[...HEATMAP_CELLS]} selected={selectedMarket} onSelect={setSelectedMarket} />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <MarketMoversPanel movers={[...MARKET_MOVERS]} />
            <SelectedMarketDetailPanel market={selectedMarket} />
          </div>
          <FundingPulseCards items={[...FUNDING_PULSE]} />
          <div className="grid gap-6 lg:grid-cols-2">
            <EmergingPatternsWidget patterns={[...EMERGING_PATTERNS]} />
            <Card className="border-border/80">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Quick scan</CardTitle>
                <p className="text-xs text-muted-foreground">Hand off to Gap Radar with context pre-filled</p>
              </CardHeader>
              <CardContent>
                <ScanComposer compact />
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="space-y-4">
          <Card className="border-border/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Saved & compare</CardTitle>
              <p className="text-xs text-muted-foreground">Workflow memory</p>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Button asChild variant="secondary" className="w-full justify-start">
                <Link href="/saved">Open saved scans & shortlist</Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/run-scan">Run full Gap Radar</Link>
              </Button>
            </CardContent>
          </Card>
          <AcceleratingCategoriesSection categories={[...ACCELERATING_CATEGORIES]} />
        </div>
      </div>
    </div>
  );
}
