import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';

export default function SavedOpportunitiesPage() {
  const saved = [
    { id: '1a2b', title: 'Creator Economy Tools', region: 'SEA', score: 88, date: 'Oct 12, 2025' },
    { id: '3c4d', title: 'SMB SaaS Automation', region: 'Latin America', score: 92, date: 'Oct 09, 2025' },
    { id: '5e6f', title: 'Vertical AI Agents', region: 'India', score: 75, date: 'Oct 08, 2025' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-display font-semibold text-white mb-2">Saved Opportunities</h1>
          <p className="text-gray-400 text-lg">Your bookmarked gap analyses and reports.</p>
        </div>
        <Link href="/" className="hidden md:flex px-6 py-3 bg-brand-600 hover:bg-brand-500 transition-colors text-white font-semibold rounded-xl items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Analysis
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {saved.map(item => (
          <Card key={item.id} className="hover:-translate-y-1 transition-all group cursor-pointer border-brand-500/10 hover:border-brand-500/50">
            <div className="flex justify-between items-start mb-6">
              <span className="px-3 py-1 bg-brand-500/10 text-brand-400 text-xs font-bold rounded-lg uppercase tracking-wider">
                {item.region}
              </span>
              <button className="text-gray-500 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                </svg>
              </button>
            </div>
            <h3 className="text-xl font-display font-medium text-white mb-2 group-hover:text-brand-300 transition-colors">
              {item.title}
            </h3>
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/5">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 uppercase font-medium">Window Score</span>
                <span className="text-lg font-bold text-white">{item.score}/100</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-gray-500 uppercase font-medium">Scanned On</span>
                <span className="text-sm font-medium text-gray-300">{item.date}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
