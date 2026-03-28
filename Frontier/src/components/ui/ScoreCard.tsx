import React from 'react';
import { MarketScore } from '@/lib/tinyfish/types';

export function ScoreCard({ score }: { score: MarketScore }) {
  const isHighOpportunity = score.opportunityWindow >= 80;

  return (
    <div className="glass-panel p-6 flex flex-col gap-4 border-t-2 border-t-transparent hover:border-t-brand-500 transition-all group">
      <div className="flex justify-between items-center pb-4 border-b border-white/5">
        <h3 className="text-xl font-display font-semibold text-white">{score.market}</h3>
        <span className={`text-2xl font-bold font-display ${isHighOpportunity ? 'text-brand-400' : 'text-gray-300'}`}>
          {score.opportunityWindow}
          <span className="text-sm text-gray-500 font-sans font-normal">/100</span>
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-y-4 gap-x-6 pt-2">
        <ScoreItem label="Validation" value={score.validation} />
        <ScoreItem label="Whitespace" value={score.whitespace} />
        <ScoreItem label="User Pain" value={score.pain} />
        <ScoreItem label="Momentum" value={score.momentum} />
        <ScoreItem label="Localization" value={score.localization} className="col-span-2" />
      </div>
    </div>
  );
}

function ScoreItem({ label, value, className = '' }: { label: string; value: number; className?: string }) {
  // Determine color based on score
  const colorClass = value >= 75 ? 'bg-brand-500' : (value >= 50 ? 'bg-yellow-500' : 'bg-red-500');
  
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <div className="flex justify-between text-xs text-gray-400">
        <span>{label}</span>
        <span className="text-gray-200 font-medium">{value}</span>
      </div>
      <div className="h-1.5 w-full bg-dark-600 rounded-full overflow-hidden">
        <div className={`h-full ${colorClass} rounded-full transition-all duration-1000`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
