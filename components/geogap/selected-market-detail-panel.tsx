"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const DETAIL: Record<string, { thesis: string; risks: string[]; signals: string[] }> = {
  Singapore: {
    thesis:
      "Enterprise and regional HQ buyers centralize here—strong validation, but mid-market whitespace requires ASEAN rollout clarity.",
    risks: ["Global vendor POC competition", "Higher CAC for net-new logos"],
    signals: ["Grant programs favor SME digitization partners", "Hiring for GTM roles in vertical AI"],
  },
  Indonesia: {
    thesis:
      "Bahasa-first workflows and large SME population create a localization moat if you ship compliance-aware bundles early.",
    risks: ["Payment terms", "Field onboarding costs"],
    signals: ["Regulatory pushes on digital records", "Local VC repeating SMB SaaS theses"],
  },
  Vietnam: {
    thesis:
      "Manufacturing-led digital adoption plus younger SaaS buyers—good for vertical tools with on-prem or hybrid options.",
    risks: ["Data residency conversations", "Price sensitivity vs Singapore"],
    signals: ["Export sector analytics hiring", "English + Vietnamese GTM still thin"],
  },
};

export function SelectedMarketDetailPanel({ market }: { market: string | null }) {
  const d = market ? DETAIL[market] : null;
  return (
    <Card className="h-full border-border/80">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Selected market</CardTitle>
        <p className="text-xs text-muted-foreground">
          {market ? `${market} — why it matters` : "Tap a region on the heatmap"}
        </p>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {!d && <p className="text-muted-foreground">GeoGap highlights one target to narrate the opportunity stack.</p>}
        {d && (
          <>
            <p className="leading-relaxed text-foreground/90">{d.thesis}</p>
            <Separator />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Risks</p>
              <ul className="mt-1 list-inside list-disc text-xs text-muted-foreground">
                {d.risks.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Signals</p>
              <ul className="mt-1 list-inside list-disc text-xs text-muted-foreground">
                {d.signals.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
