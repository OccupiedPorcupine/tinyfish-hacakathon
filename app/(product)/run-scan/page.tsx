import { Suspense } from "react";
import RunScanClient from "./run-scan-client";

export default function RunScanPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-lg border border-border bg-muted/30 p-8 text-sm text-muted-foreground">
          Loading Run Scan…
        </div>
      }
    >
      <RunScanClient />
    </Suspense>
  );
}
