import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export interface TransferSignal {
  category: string;
  matureSignal: string;
  seaGap: string;
  confidence: number;
}

export function EarlyTransferSignals({ signals }: { signals: TransferSignal[] }) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Early transfer signals</h2>
        <p className="text-sm text-muted-foreground">
          What is heating in US / India / Brazil before it fully lands in Singapore, Indonesia, or Vietnam.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {signals.map((s) => (
          <Card key={s.category} className="border-border/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">{s.category}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Mature market</p>
                <p className="mt-1 text-muted-foreground leading-relaxed">{s.matureSignal}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">SEA gap read</p>
                <p className="mt-1 text-muted-foreground leading-relaxed">{s.seaGap}</p>
              </div>
              <div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Confidence</span>
                  <span className="font-mono">{s.confidence}</span>
                </div>
                <Progress value={s.confidence} className="mt-1 h-1" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
