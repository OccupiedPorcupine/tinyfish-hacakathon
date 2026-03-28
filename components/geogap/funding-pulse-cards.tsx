import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface FundingPulseItem {
  company: string;
  amount: string;
  market: string;
  category: string;
  date: string;
}

export function FundingPulseCards({
  items,
  compact,
}: {
  items: FundingPulseItem[];
  compact?: boolean;
}) {
  return (
    <Card className="border-border/80">
      <CardHeader className="pb-2">
        <CardTitle className={compact ? "text-sm font-semibold" : "text-base font-semibold"}>
          Funding pulse
        </CardTitle>
        <p className="text-xs text-muted-foreground">Latest rounds agents surfaced (demo dataset + live scans)</p>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((f, i) => (
          <div
            key={`${f.company}-${f.date}-${f.amount}-${i}`}
            className="flex flex-col gap-1 rounded-md border border-border/60 bg-muted/20 px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-sm font-medium">{f.company}</p>
              <p className="text-xs text-muted-foreground">
                {f.category} · {f.market}
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-sm">{f.amount}</p>
              <p className="font-mono text-[10px] text-muted-foreground">{f.date}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
