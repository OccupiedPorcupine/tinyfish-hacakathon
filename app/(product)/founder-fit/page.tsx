import { FounderFitClient } from "./founder-fit-client";
import { MarketInsightBanner } from "@/components/geogap/market-insight-banner";

export default function FounderFitPage() {
  return (
    <div className="space-y-8">
      <MarketInsightBanner eyebrow="Personalization" title="Founder Fit">
        Secondary surface: map your resume-shaped profile to markets and categories. Heuristic demo scoring—not hiring or
        investment advice.
      </MarketInsightBanner>
      <FounderFitClient />
    </div>
  );
}
