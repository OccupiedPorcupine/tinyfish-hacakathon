import { EarlyTransferSignals } from "@/components/geogap/early-transfer-signals";
import { GlobalHeatmap } from "@/components/geogap/global-heatmap";
import { MarketInsightBanner } from "@/components/geogap/market-insight-banner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EARLY_TRANSFER_SIGNALS, HEATMAP_CELLS } from "@/lib/geogap/demo-static";
import { SOURCE_MARKETS, TARGET_MARKETS } from "@/lib/geogap/constants";

export default function MarketsPage() {
  return (
    <div className="space-y-10">
      <MarketInsightBanner eyebrow="Markets" title="SEA drill-down">
        Source signals: {SOURCE_MARKETS.join(", ")}. Targets: {TARGET_MARKETS.join(", ")}.
      </MarketInsightBanner>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">Market overview</h2>
        <p className="text-sm text-muted-foreground max-w-3xl">
          GeoGap layers category heat, startup density proxies, and funding/hiring cues. Numbers below are calibrated demo
          baselines until your live scan populates the store.
        </p>
        <GlobalHeatmap cells={[...HEATMAP_CELLS]} />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border/80 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Category heat by sector</CardTitle>
            <p className="text-xs text-muted-foreground">Weighted by agent-captured headline velocity (demo)</p>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            {[
              { n: "SMB SaaS", v: 82 },
              { n: "Vertical AI", v: 91 },
              { n: "Creator economy tools", v: 64 },
            ].map((x) => (
              <div key={x.n} className="rounded-md border border-border/70 p-3">
                <p className="text-sm font-medium">{x.n}</p>
                <p className="mt-2 font-mono text-2xl tabular-nums">{x.v}</p>
                <p className="text-[10px] text-muted-foreground">heat index</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="border-border/80">
          <CardHeader>
            <CardTitle className="text-base">Localization / regulatory</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-muted-foreground leading-relaxed">
            <p>
              <span className="font-medium text-foreground">Singapore:</span> Enterprise security reviews; MAS-adjacent
              data handling for fintech adjacencies.
            </p>
            <p>
              <span className="font-medium text-foreground">Indonesia:</span> Bahasa contracts; OJK reporting nudges for
              digitization.
            </p>
            <p>
              <span className="font-medium text-foreground">Vietnam:</span> Data residency discussions for factories;
              bilingual GTM still scarce.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">Startup density & competition map</h2>
        <p className="text-sm text-muted-foreground">
          Singapore: HQ + global incumbents. Indonesia: seed-heavy SMB plays. Vietnam: fewer scaled B2B brands in English
          databases—agents must read local press.
        </p>
        <div className="grid gap-3 md:grid-cols-3">
          {TARGET_MARKETS.map((m) => (
            <Card key={m} className="border-border/80">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{m}</CardTitle>
              </CardHeader>
              <CardContent className="font-mono text-xs text-muted-foreground">
                Mapped competitors + hiring velocity surface after each Gap Radar run.
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <EarlyTransferSignals signals={[...EARLY_TRANSFER_SIGNALS]} />

      <section className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">Whitespace & local companies</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-border/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Whitespace opportunities</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground leading-relaxed">
              Bundled SMB compliance + ops copilots with native Bahasa/Vietnamese UX. US-validated models with no regional
              Series B anchor yet.
            </CardContent>
          </Card>
          <Card className="border-border/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Top local companies (sample)</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <p>BukuKita SaaS — Indonesia — SMB core systems</p>
              <p>FlowOne — Vietnam — workflow automation</p>
              <p>Vertex Cloud — Singapore — enterprise AI ops</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
