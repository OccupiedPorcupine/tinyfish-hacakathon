import React from 'react';
import { Card } from '@/components/ui/Card';

export default function PatternMigrationPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-display font-semibold text-white mb-2">Pattern Migration</h1>
        <p className="text-gray-400 text-lg">Track successful business models transferring across global economic gradients.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <Card gradient>
          <h2 className="text-xl font-display font-medium text-white mb-6">Active Migration Vectors</h2>
          <div className="space-y-6 flex flex-col justify-center h-[300px]">
            <VectorRow source="US" target="Singapore" weight={85} category="B2B Vertical SaaS" />
            <VectorRow source="India" target="Indonesia" weight={92} category="Quick Commerce" />
            <VectorRow source="Brazil" target="Vietnam" weight={78} category="Embedded Finance" />
            <VectorRow source="China" target="Indonesia" weight={88} category="Live Commerce" />
          </div>
        </Card>
        
        <Card>
          <h2 className="text-xl font-display font-medium text-white mb-6">Maturity Timeline Mapping</h2>
          <div className="flex flex-col space-y-8 relative">
            <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-brand-900" />
            
            <div className="relative pl-10">
              <div className="absolute left-3.5 top-1.5 w-2 h-2 rounded-full bg-brand-500" />
              <h4 className="text-white font-medium mb-1">Source Inflection (T-0)</h4>
              <p className="text-sm text-gray-400">Market validates business model unit economics.</p>
            </div>
            
            <div className="relative pl-10">
              <div className="absolute left-3.5 top-1.5 w-2 h-2 rounded-full bg-blue-500" />
              <h4 className="text-white font-medium mb-1">Early Cloning (T+18mo)</h4>
              <p className="text-sm text-gray-400">Target markets see early unpolished clones with raw local operations.</p>
            </div>

            <div className="relative pl-10">
              <div className="absolute left-2.5 top-1 w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center">
                 <div className="w-2 h-2 rounded-full bg-green-500" />
              </div>
              <h4 className="text-green-400 font-bold mb-1">The Opportunity Window (T+24mo)</h4>
              <p className="text-sm text-gray-400">Ideal timing for localized execution with strong seed funding access.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function VectorRow({ source, target, weight, category }: { source: string; target: string; weight: number; category: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-20 text-right font-medium text-gray-300">{source}</div>
      <div className="flex-1 h-3 bg-dark-600 rounded-full relative overflow-hidden group">
        <div 
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-brand-600 to-brand-400 rounded-full transition-all group-hover:brightness-125"
          style={{ width: `${weight}%` }}
        >
          <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]" style={{ transform: 'translateX(-100%)' }} />
        </div>
      </div>
      <div className="w-28 font-medium text-white">{target}</div>
      <div className="hidden sm:block w-36 text-xs text-brand-400 font-mono text-right">{category}</div>
    </div>
  );
}
