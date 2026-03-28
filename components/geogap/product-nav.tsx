"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/run-scan", label: "Run Scan" },
  { href: "/markets", label: "Markets" },
  { href: "/founder-fit", label: "Founder Fit" },
  { href: "/funding-feed", label: "Funding Feed" },
  { href: "/saved", label: "Saved" },
] as const;

export function ProductNav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="rounded bg-foreground px-1.5 py-0.5 font-mono text-xs text-background">GG</span>
          <span>GeoGap</span>
        </Link>
        <nav className="flex flex-1 flex-wrap items-center justify-end gap-1 sm:gap-2">
          {LINKS.map((l) => {
            const active = pathname === l.href || (l.href !== "/dashboard" && pathname.startsWith(l.href));
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors sm:text-sm",
                  active ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/80 hover:text-foreground",
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
