import { AcceleratingCategoriesSection } from "@/components/geogap/accelerating-categories-section";
import { FundingPulseCards } from "@/components/geogap/funding-pulse-cards";
import { MarketInsightBanner } from "@/components/geogap/market-insight-banner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ACCELERATING_CATEGORIES, FUNDING_PULSE } from "@/lib/geogap/demo-static";
import { SOURCE_MARKETS, TARGET_MARKETS } from "@/lib/geogap/constants";

export default function FundingFeedPage() {
  return (
    <div className="space-y-10">
      <MarketInsightBanner eyebrow="Live intelligence" title="Funding Feed">
        Aggregated view of rounds, stages, and regional investors—fed by TinyFish funding agents on each Gap Radar run
        plus static demo rows for continuity.
      </MarketInsightBanner>

      <FundingPulseCards items={[...FUNDING_PULSE]} />

      <AcceleratingCategoriesSection categories={[...ACCELERATING_CATEGORIES]} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Funding by market</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 font-mono text-xs text-muted-foreground">
            <p>US / EU: dense Series A–C (agents: TechCrunch venture)</p>
            <p>India: repeat SMB + fintech infra rounds</p>
            <p>Brazil: creator + SMB payments clusters</p>
            <p>SEA targets: {TARGET_MARKETS.join(", ")} — check Gap Radar for gap vs proof</p>
          </CardContent>
        </Card>
        <Card className="border-border/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Funding by category</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 font-mono text-xs text-muted-foreground">
            <p>Vertical AI: highest global velocity</p>
            <p>SMB SaaS: steady grant tailwinds in ID/SG</p>
            <p>Creator tools: US/India lead; SEA payout layer thin</p>
          </CardContent>
        </Card>
      </div>

      <section className="grid gap-6 md:grid-cols-3">
        <Card className="border-border/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Stage breakdown</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-1">
            <p>Seed: 34%</p>
            <p>Series A: 41%</p>
            <p>Series B+: 25%</p>
            <p className="pt-2 text-[10px]">Demo distribution — replace with your aggregation job.</p>
          </CardContent>
        </Card>
        <Card className="border-border/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Active investors by region</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-1">
            <p>US: multi-stage software funds</p>
            <p>India: operator-led seed programs</p>
            <p>SEA: regional growth funds + CVC</p>
          </CardContent>
        </Card>
        <Card className="border-border/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Hiring velocity</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Manufacturing analytics roles up in Vietnam; Singapore GTM for vertical AI flat QoQ (demo read).
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Card className="border-border/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Accelerator themes</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground leading-relaxed">
            AI compliance copilots, climate reporting for SMEs, cross-border payouts—themes recurring in {SOURCE_MARKETS.join("/")}{" "}
            cohort announcements.
          </CardContent>
        </Card>
        <Card className="border-border/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Launch activity & regulatory</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground leading-relaxed">
            New data residency guidance discussions in Vietnam; Singapore enterprise AI procurement templates circulating;
            Indonesia digitization grants renewing Q2 window (monitor with agents).
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
