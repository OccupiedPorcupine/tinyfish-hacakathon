"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface Mover {
  id: string;
  market: string;
  delta: string;
  driver: string;
  windowDays: number;
}

export function MarketMoversPanel({ movers }: { movers: Mover[] }) {
  return (
    <Card className="h-full border-border/80">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Market movers</CardTitle>
        <p className="text-xs text-muted-foreground">Agent-tracked deltas vs trailing baseline</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {movers.map((m) => (
          <div key={m.id} className="rounded-md border border-border/80 bg-muted/30 p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium">{m.market}</span>
              <Badge variant={m.delta.startsWith("−") || m.delta.startsWith("-") ? "low" : "high"}>
                {m.delta} pts
              </Badge>
            </div>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{m.driver}</p>
            <p className="mt-2 font-mono text-[10px] text-muted-foreground">{m.windowDays}d window</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
