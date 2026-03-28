"use client";

import type { MarketOpportunity } from "@/lib/tinyfish/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

function MiniScores({ m }: { m: MarketOpportunity }) {
  const entries: [string, number][] = [
    ["Window", m.scores.opportunityWindow],
    ["Validation", m.scores.validation],
    ["Whitespace", m.scores.whitespace],
    ["Confidence", m.scores.confidence],
  ];
  return (
    <div className="space-y-2">
      {entries.map(([k, v]) => (
        <div key={k}>
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>{k}</span>
            <span className="font-mono">{v}</span>
          </div>
          <Progress value={v} className="h-1" />
        </div>
      ))}
    </div>
  );
}

export function CompareView({ a, b }: { a: MarketOpportunity; b: MarketOpportunity }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {[a, b].map((m) => (
        <Card key={m.market} className="border-border/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{m.market}</CardTitle>
            <p className="text-xs text-muted-foreground leading-relaxed">{m.shortExplanation}</p>
          </CardHeader>
          <CardContent>
            <MiniScores m={m} />
            <p className="mt-3 text-xs font-medium text-foreground">Wedge</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{m.recommendedWedge}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
