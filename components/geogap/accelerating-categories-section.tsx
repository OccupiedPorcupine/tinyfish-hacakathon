import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface AccelCategory {
  name: string;
  velocity: "high" | "medium" | "low";
  note: string;
}

export function AcceleratingCategoriesSection({ categories }: { categories: AccelCategory[] }) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Accelerating categories</h2>
        <p className="text-sm text-muted-foreground">
          Funding + hiring velocity vs trailing baseline (pattern migration overlay on the funding lens).
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {categories.map((c) => (
          <Card key={c.name} className="border-border/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{c.name}</CardTitle>
              <Badge variant={c.velocity === "high" ? "high" : c.velocity === "medium" ? "med" : "low"}>
                {c.velocity}
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground leading-relaxed">{c.note}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
