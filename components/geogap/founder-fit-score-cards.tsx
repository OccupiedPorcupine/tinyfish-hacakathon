"use client";

import type { FounderFitInput } from "@/components/geogap/founder-fit-input-panel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

function scoreFromText(text: string, keywords: string[]): number {
  const t = text.toLowerCase();
  let n = 42;
  for (const k of keywords) {
    if (t.includes(k)) n += 9;
  }
  return Math.min(88, n);
}

export function FounderFitScoreCards({ input }: { input: FounderFitInput | null }) {
  if (!input) {
    return (
      <p className="text-sm text-muted-foreground">
        Run the panel on the left—GeoGap scores fit heuristically from your text (secondary surface, not a clinical
        assessment).
      </p>
    );
  }

  const fit = scoreFromText(
    `${input.resume} ${input.background} ${input.industries} ${input.languages}`,
    ["b2b", "saas", "indonesia", "bahasa", "manufacturing", "implementation", "product"],
  );

  const markets = [
    { name: "Indonesia", s: fit + 4 },
    { name: "Vietnam", s: fit - 2 },
    { name: "Singapore", s: fit - 6 },
  ].sort((a, b) => b.s - a.s);

  const categories = [
    { name: "SMB SaaS", s: fit + 2 },
    { name: "Vertical AI", s: fit + 6 },
    { name: "Creator economy tools", s: fit - 10 },
  ].sort((a, b) => b.s - a.s);

  return (
    <div className="space-y-4">
      <Card className="border-border/80">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Founder–market fit</CardTitle>
          <p className="text-xs text-muted-foreground">Heuristic demo score — replace with model + resume parse later.</p>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Composite fit</span>
            <span className="font-mono">{fit}</span>
          </div>
          <Progress value={fit} />
        </CardContent>
      </Card>

      <Card className="border-border/80">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Best-fit markets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {markets.map((m) => (
            <div key={m.name} className="flex items-center justify-between text-sm">
              <span>{m.name}</span>
              <Badge variant="outline" className="font-mono">
                {m.s}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-border/80">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Best-fit categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {categories.map((m) => (
            <div key={m.name} className="flex items-center justify-between text-sm">
              <span>{m.name}</span>
              <Badge variant="outline" className="font-mono">
                {m.s}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-border/80">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Unfair advantages</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-inside list-disc text-sm text-muted-foreground">
            <li>Ship-day implementation fluency de-risks Indonesia field rollouts.</li>
            <li>Bahasa working proficiency lowers localization cost vs pure English GTM teams.</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="border-border/80">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Blind spots / risks</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-inside list-disc text-sm text-muted-foreground">
            <li>Underestimating Singapore enterprise security review timelines.</li>
            <li>Creator economy motion is a channel mismatch for your resume-shaped profile.</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="border-border/80">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Recommended directions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Lead with a Bahasa-first vertical AI wedge for SME compliance logs, priced for mid-market ACVs, with Singapore
            as trust HQ and Indonesia as scale market.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
