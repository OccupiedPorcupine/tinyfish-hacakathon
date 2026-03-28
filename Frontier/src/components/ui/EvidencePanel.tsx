import React from 'react';
import { EvidenceLabel } from '@/lib/tinyfish/types';
import { Card } from './Card';

const typeColors = {
  funding: 'text-green-400 bg-green-400/10 border-green-400/20',
  hiring: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  regulation: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  trend: 'text-brand-400 bg-brand-400/10 border-brand-400/20',
};

export function EvidencePanel({ evidence }: { evidence: EvidenceLabel[] }) {
  return (
    <Card className="flex flex-col gap-4">
      <h3 className="text-lg font-display font-medium text-white flex items-center gap-2">
        <svg className="w-5 h-5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Evidence Sources
      </h3>
      <div className="flex flex-col gap-3">
        {evidence.map((item, idx) => (
          <div key={idx} className="p-3 bg-dark-700/50 rounded-xl border border-white/5 hover:border-white/10 transition-colors group">
            <div className="flex justify-between items-start mb-2">
              <span className={`text-xs px-2 py-0.5 rounded-md border font-medium uppercase tracking-wider ${typeColors[item.type]}`}>
                {item.type}
              </span>
              {item.sourceName && (
                <span className="text-xs text-gray-500 font-medium">Source: {item.sourceName}</span>
              )}
            </div>
            <p className="text-sm text-gray-300 leading-relaxed group-hover:text-white transition-colors">
              "{item.text}"
            </p>
            {item.sourceUrl && (
              <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="text-xs text-brand-400 hover:text-brand-300 mt-2 inline-block">
                View Source &rarr;
              </a>
            )}
          </div>
        ))}
        {evidence.length === 0 && (
          <p className="text-sm text-gray-500 italic">No direct evidence extracted.</p>
        )}
      </div>
    </Card>
  );
}
