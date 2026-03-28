"use client";

import type { HeatCell } from "@/lib/geogap/demo-static";
import { cn } from "@/lib/utils";

export function GlobalHeatmap({
  cells,
  selected,
  onSelect,
}: {
  cells: HeatCell[];
  selected?: string | null;
  onSelect?: (market: string) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {cells.map((c) => {
        const active = selected === c.market;
        const bg = `rgba(15, 23, 42, ${0.04 + (c.intensity / 100) * 0.12})`;
        return (
          <button
            key={c.market}
            type="button"
            onClick={() => onSelect?.(c.market)}
            className={cn(
              "rounded-lg border p-4 text-left transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active ? "border-foreground shadow-md" : "border-border hover:border-foreground/30",
            )}
            style={{ backgroundColor: bg }}
          >
            <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Target</div>
            <div className="mt-1 text-lg font-semibold tracking-tight">{c.market}</div>
            <div className="mt-3 flex items-baseline justify-between gap-2">
              <span className="text-xs text-muted-foreground">{c.label}</span>
              <span className="font-mono text-sm tabular-nums">{c.intensity}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
