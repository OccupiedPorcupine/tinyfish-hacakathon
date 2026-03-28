'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ScanResult } from '@/lib/tinyfish/types';
import { ScoreCard } from '@/components/ui/ScoreCard';
import { EvidencePanel } from '@/components/ui/EvidencePanel';
import { SignalTimeline } from '@/components/ui/SignalTimeline';
import { Card } from '@/components/ui/Card';

function RadarContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) {
      setError('No scan ID provided. Please run a scan from the dashboard.');
      setLoading(false);
      return;
    }

    let intervalId: NodeJS.Timeout;

    const pollResult = async () => {
      try {
        const res = await fetch(`/api/scan/${id}`);
        if (!res.ok) {
          setError('Failed to fetch scan results.');
          setLoading(false);
          return;
        }
        const data = await res.json();
        
        if (data.status === 'pending' || data.status === 'processing') {
          // keep polling
        } else if (data.status === 'failed') {
          setError(data.error ?? 'Scan failed.');
          setLoading(false);
          clearInterval(intervalId);
        } else if (data.scores) {
          // completed — API returns the full ScanResult directly
          setResult(data as ScanResult);
          setLoading(false);
          clearInterval(intervalId);
        }
      } catch (err) {
        setError('Error connecting to server.');
        setLoading(false);
        clearInterval(intervalId);
      }
    };

    pollResult();
    intervalId = setInterval(pollResult, 1000);

    return () => clearInterval(intervalId);
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 bg-brand-500 rounded-full animate-ping opacity-20" />
          <div className="absolute inset-2 bg-brand-500 rounded-full animate-pulse opacity-40" />
          <div className="absolute inset-6 bg-brand-500 rounded-full" />
        </div>
        <p className="text-xl font-display font-medium text-white animate-pulse">Running Market Scan Analysis...</p>
        <p className="text-gray-400 text-sm">Consulting aggregate signals and TinyFish intelligence.</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Card className="border-red-500/50 bg-red-500/10">
          <h2 className="text-2xl text-red-100 mb-2">Error</h2>
          <p className="text-red-200">{error}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold uppercase tracking-wider">Analysis Complete</span>
            <span className="text-gray-500 text-sm">{result.id.slice(0,8)}</span>
          </div>
          <h1 className="text-4xl font-display font-semibold text-white">
            Gap Radar: <span className="text-brand-400">"{result.query}"</span>
          </h1>
        </div>
        <div className="flex items-center gap-4 bg-dark-800 p-4 rounded-2xl border border-white/5">
          <div className="text-right">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">AI Confidence</p>
            <p className={`text-3xl font-bold font-display ${result.confidenceScore >= 80 ? 'text-green-400' : 'text-yellow-400'}`}>
              {result.confidenceScore}%
            </p>
          </div>
        </div>
      </div>

      <Card gradient className="mb-10 p-8 border-brand-500/20">
        <div className="flex gap-4">
          <div className="mt-1">
            <svg className="w-8 h-8 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-display font-medium text-white mb-3">Executive Summary</h2>
            <p className="text-lg text-gray-300 leading-relaxed max-w-4xl">{result.shortExplanation}</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="text-2xl font-display font-semibold text-white mb-6">Market Opportunity Scores</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {result.scores.map((score) => (
                <ScoreCard key={score.market} score={score} />
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-dark-800 to-dark-700">
              <h3 className="text-lg font-display font-medium text-white mb-4">Competitor Density</h3>
              <div className="space-y-4">
                {result.competitorDensity.map((density) => (
                  <div key={density.market} className="flex justify-between items-center bg-dark-900/50 p-3 rounded-xl">
                    <span className="text-gray-300">{density.market}</span>
                    <span className={`text-sm px-2 py-1 rounded-md font-medium ${
                      density.density === 'Low' ? 'text-green-400 bg-green-400/10' :
                      density.density === 'Medium' ? 'text-yellow-400 bg-yellow-400/10' :
                      'text-red-400 bg-red-400/10'
                    }`}>
                      {density.density}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="border-brand-500/20 bg-brand-900/10">
              <h3 className="text-lg font-display font-medium text-brand-100 mb-4">Wedge Recommendation</h3>
              <p className="text-brand-100/80 leading-relaxed text-sm">
                {result.wedgeRecommendation}
              </p>
            </Card>
          </div>
        </div>

        <div className="space-y-8">
          <EvidencePanel evidence={result.evidence} />
          <SignalTimeline events={result.signalTimeline} />
        </div>
      </div>
    </div>
  );
}

export default function RadarPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-gray-400">Loading radar component...</div>}>
      <RadarContent />
    </Suspense>
  );
}
