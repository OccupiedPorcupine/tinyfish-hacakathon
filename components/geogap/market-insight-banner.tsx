import { cn } from "@/lib/utils";

export function MarketInsightBanner({
  eyebrow,
  title,
  children,
  className,
}: {
  eyebrow?: string;
  title: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card px-4 py-3 shadow-sm sm:px-5 sm:py-4",
        className,
      )}
    >
      {eyebrow && (
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{eyebrow}</p>
      )}
      <h1 className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">{title}</h1>
      {children && <div className="mt-2 text-sm text-muted-foreground">{children}</div>}
    </div>
  );
}
