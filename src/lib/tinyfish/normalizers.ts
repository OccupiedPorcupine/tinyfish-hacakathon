import { ScanResult, TinyFishRawResponse } from './types';

export function normalizeScanResult(raw: TinyFishRawResponse, query: string): ScanResult {
  return {
    id: raw.analysis_id || crypto.randomUUID(),
    status: 'completed',
    query,
    confidenceScore: raw.confidence,
    shortExplanation: raw.explanation,
    scores: raw.markets.map(m => ({
      market: m.name,
      opportunityWindow: m.metrics.window,
      validation: m.metrics.validation,
      whitespace: m.metrics.space,
      pain: m.metrics.pain,
      momentum: m.metrics.momentum,
      localization: m.metrics.local,
    })),
    evidence: raw.evidence_points.map(e => ({
      text: e.text,
      type: e.category as any,
      sourceUrl: e.link,
      sourceName: e.name,
    })),
    competitorDensity: raw.density_map.map(d => ({
      market: d.market,
      density: d.level as 'Low' | 'Medium' | 'High',
    })),
    wedgeRecommendation: raw.recommendation,
    signalTimeline: raw.timeline.map(t => ({
      date: t.d,
      event: t.e,
    })),
  };
}
