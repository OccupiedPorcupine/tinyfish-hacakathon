"use client";

import type { MarketOpportunity, ScanScores } from "@/lib/tinyfish/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const SCORE_META: { key: keyof ScanScores; label: string }[] = [
  { key: "opportunityWindow", label: "Opportunity window" },
  { key: "validation", label: "Validation" },
  { key: "whitespace", label: "Whitespace" },
  { key: "pain", label: "Pain" },
  { key: "momentum", label: "Momentum" },
  { key: "localization", label: "Localization" },
  { key: "confidence", label: "Confidence" },
];

function ScoreRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono tabular-nums">{value}</span>
      </div>
      <Progress value={value} className="h-1.5" />
    </div>
  );
}

export function OpportunityScoreCards({
  opportunity,
  className,
  onOpenEvidence,
}: {
  opportunity: MarketOpportunity;
  className?: string;
  onOpenEvidence?: () => void;
}) {
  return (
    <Card className={cn("border-border/80", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-lg">{opportunity.market}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground leading-snug">{opportunity.shortExplanation}</p>
          </div>
          <span className="font-mono text-xs text-muted-foreground shrink-0">Rank #{opportunity.rank}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-2 sm:grid-cols-2">
          {SCORE_META.map(({ key, label }) => (
            <ScoreRow key={key} label={label} value={opportunity.scores[key]} />
          ))}
        </div>
        <div className="rounded-md border border-border bg-muted/40 px-3 py-2 text-xs">
          <span className="font-medium text-foreground">Wedge: </span>
          {opportunity.recommendedWedge}
        </div>
        <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
          <div>
            <span className="font-medium text-foreground">Saturation: </span>
            {opportunity.saturationWhitespace.saturationSignal}
          </div>
          <div>
            <span className="font-medium text-foreground">Whitespace: </span>
            {opportunity.saturationWhitespace.whitespaceSignal}
          </div>
        </div>
        {onOpenEvidence && (
          <button
            type="button"
            onClick={onOpenEvidence}
            className="text-xs font-medium text-foreground underline underline-offset-2 hover:text-muted-foreground"
          >
            View evidence ({opportunity.evidenceSources.length} sources)
          </button>
        )}
      </CardContent>
    </Card>
  );
}
