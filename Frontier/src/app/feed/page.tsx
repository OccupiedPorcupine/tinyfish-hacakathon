import React from 'react';
import { Card } from '@/components/ui/Card';

const MOCK_SIGNALS = [
  { id: 1, type: 'funding', market: 'Indonesia', text: 'eFishery raises $200M Series D to expand aquatic SaaS', source: 'Tech in Asia', date: '2 hours ago' },
  { id: 2, type: 'regulation', market: 'Vietnam', text: 'Central Bank issues new framework for digital lending', source: 'VN Express', date: '5 hours ago' },
  { id: 3, type: 'hiring', market: 'Singapore', text: 'OpenAI opens regional hub, hiring 50+ GTM roles', source: 'LinkedIn', date: '1 day ago' },
  { id: 4, type: 'trend', market: 'Brazil -> SE Asia', text: 'Pix-like instant payment adoption accelerates 40% YoY in Indonesia', source: 'McKinsey', date: '2 days ago' },
];

const typeColors: Record<string, string> = {
  funding: 'text-green-400 bg-green-400/10 border-green-400/20',
  hiring: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  regulation: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  trend: 'text-brand-400 bg-brand-400/10 border-brand-400/20',
};

export default function SignalFeedPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-display font-semibold text-white mb-2">Signal Feed</h1>
        <p className="text-gray-400 text-lg">Live market ingestion supporting Gap Radar intelligence.</p>
      </div>

      <div className="flex gap-4 mb-8 overflow-x-auto pb-4 hide-scrollbar">
        {['All Signals', 'Funding', 'Regulation', 'Hiring', 'Macro Trends'].map((filter, i) => (
          <button key={filter} className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${i === 0 ? 'bg-brand-500 text-white' : 'bg-dark-800 text-gray-400 hover:text-white border border-white/5 hover:border-white/20'}`}>
            {filter}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {MOCK_SIGNALS.map((signal) => (
          <Card key={signal.id} className="hover:border-brand-500/30 transition-all cursor-pointer group">
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
              <div className="flex-shrink-0">
                <span className={`text-xs px-3 py-1 rounded-md border font-bold uppercase tracking-widest ${typeColors[signal.type]}`}>
                  {signal.type}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-lg text-gray-200 font-medium group-hover:text-white transition-colors">{signal.text}</p>
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

      <div className="mt-8 text-center">
        <button className="px-6 py-3 rounded-xl bg-dark-800 text-gray-300 font-medium hover:bg-dark-700 transition-colors border border-white/5">
          Load More Signals
        </button>
      </div>
    </div>
  );
}
