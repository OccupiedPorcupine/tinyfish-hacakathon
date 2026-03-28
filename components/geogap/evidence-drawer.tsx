"use client";

import type { EvidenceSource } from "@/lib/tinyfish/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ExternalLink } from "lucide-react";

export function EvidenceDrawer({
  sources,
  title = "Evidence sources",
  trigger,
  open,
  onOpenChange,
}: {
  sources: EvidenceSource[];
  title?: string;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent className="max-h-[85vh] max-w-lg sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Each item ties to a TinyFish agent run or synthesis note. Low-confidence scans may include labeled
            synthetic continuity rows.
          </p>
        </DialogHeader>
        <ScrollArea className="max-h-[55vh] pr-3">
          <ul className="space-y-3">
            {sources.map((s) => (
              <li key={s.id} className="rounded-md border border-border bg-card p-3 text-sm">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-medium leading-tight">{s.title}</span>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 text-muted-foreground hover:text-foreground"
                    aria-label="Open source"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
                {s.agentId && (
                  <p className="mt-1 font-mono text-xs text-muted-foreground">Agent: {s.agentId}</p>
                )}
                {s.note && <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{s.note}</p>}
                <p className="mt-2 font-mono text-[10px] text-muted-foreground">{s.fetchedAt}</p>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
