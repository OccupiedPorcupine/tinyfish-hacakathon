'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Signal } from '@/app/api/feed/route';

const typeColors: Record<string, string> = {
  funding: 'text-green-400 bg-green-400/10 border-green-400/20',
  hiring: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  regulation: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  trend: 'text-brand-400 bg-brand-400/10 border-brand-400/20',
};

const FILTERS = ['All Signals', 'Funding', 'Regulation', 'Hiring', 'Macro Trends'] as const;
const filterToType: Record<string, string> = {
  Funding: 'funding',
  Regulation: 'regulation',
  Hiring: 'hiring',
  'Macro Trends': 'trend',
};

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-white/5 bg-dark-800 p-5 animate-pulse">
      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
        <div className="w-20 h-6 bg-dark-600 rounded-md" />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-dark-600 rounded w-3/4" />
          <div className="h-4 bg-dark-600 rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}

export default function SignalFeedPage() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('All Signals');

  useEffect(() => {
    fetch('/api/feed')
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setSignals(data.signals);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    activeFilter === 'All Signals'
      ? signals
      : signals.filter((s) => s.type === filterToType[activeFilter]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-display font-semibold text-white mb-2">Signal Feed</h1>
        <p className="text-gray-400 text-lg">Live market ingestion supporting Gap Radar intelligence.</p>
      </div>

      <div className="flex gap-4 mb-8 overflow-x-auto pb-4 hide-scrollbar">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
              activeFilter === filter
                ? 'bg-brand-500 text-white'
                : 'bg-dark-800 text-gray-400 hover:text-white border border-white/5 hover:border-white/20'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {loading && Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}

        {error && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-red-400 mb-1">Failed to load signals</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">No signals found.</div>
        )}

        {!loading &&
          !error &&
          filtered.map((signal) => (
            <Card key={signal.id} className="hover:border-brand-500/30 transition-all cursor-pointer group">
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                <div className="flex-shrink-0">
                  <span
                    className={`text-xs px-3 py-1 rounded-md border font-bold uppercase tracking-widest ${typeColors[signal.type] ?? typeColors.trend}`}
                  >
                    {signal.type}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-lg text-gray-200 font-medium group-hover:text-white transition-colors">
                    {signal.text}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5 font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                      {signal.market}
                    </span>
                    <span>&bull;</span>
                    <span>{signal.source}</span>
                    <span>&bull;</span>
                    <span>{signal.date}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
      </div>

      {!loading && !error && signals.length > 0 && (
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              setLoading(true);
              setError(null);
              fetch('/api/feed?refresh=1')
                .then((r) => r.json())
                .then((data) => {
                  if (data.error) throw new Error(data.error);
                  setSignals(data.signals);
                })
                .catch((e) => setError(e.message))
                .finally(() => setLoading(false));
            }}
            className="px-6 py-3 rounded-xl bg-dark-800 text-gray-300 font-medium hover:bg-dark-700 transition-colors border border-white/5"
          >
            Refresh Signals
          </button>
        </div>
      )}
    </div>
  );
}
