"use client";

import { FounderFitInputPanel } from "@/components/geogap/founder-fit-input-panel";
import { FounderFitScoreCards } from "@/components/geogap/founder-fit-score-cards";
import type { FounderFitInput } from "@/components/geogap/founder-fit-input-panel";
import { useState } from "react";

export function FounderFitClient() {
  const [input, setInput] = useState<FounderFitInput | null>(null);
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <FounderFitInputPanel onAnalyze={setInput} />
      <FounderFitScoreCards input={input} />
    </div>
  );
}
