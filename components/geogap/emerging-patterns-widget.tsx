import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface EmergingPattern {
  pattern: string;
  transferLagMonths: string;
  sourceMarkets: string;
  seaReadiness: string;
}

export function EmergingPatternsWidget({ patterns }: { patterns: EmergingPattern[] }) {
  return (
    <Card className="border-border/80">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Emerging patterns</CardTitle>
        <p className="text-xs text-muted-foreground">Pattern migration layer — mature → SEA transfer watchlist</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {patterns.map((p) => (
          <div key={p.pattern} className="rounded-md border border-border/70 bg-muted/25 p-3">
            <p className="text-sm font-medium leading-snug">{p.pattern}</p>
            <p className="mt-2 font-mono text-[10px] text-muted-foreground">
              Lag {p.transferLagMonths} · Sources {p.sourceMarkets}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">SEA: {p.seaReadiness}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
