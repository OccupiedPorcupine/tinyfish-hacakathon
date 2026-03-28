'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';

const MOCK_SCANS = [
  { id: '1a2b', query: 'Creator Economy Tools', topMarket: 'SEA', confidenceScore: 88, savedAt: new Date('2025-10-12').getTime() },
  { id: '3c4d', query: 'SMB SaaS Automation', topMarket: 'Latin America', confidenceScore: 92, savedAt: new Date('2025-10-09').getTime() },
  { id: '5e6f', query: 'Vertical AI Agents', topMarket: 'India', confidenceScore: 75, savedAt: new Date('2025-10-08').getTime() },
];

interface SavedScan {
  id: string;
  query: string;
  topMarket: string | null;
  confidenceScore: number;
  savedAt: number;
  topScore?: number | null;
}

export default function SavedOpportunitiesPage() {
  const [scans, setScans] = useState<SavedScan[]>(MOCK_SCANS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/saved')
      .then(res => res.json())
      .then(data => {
        if (data.scans && data.scans.length > 0) {
          setScans(data.scans);
        }
        // else keep mock fallback
      })
      .catch(() => {
        // silently fall back to mock data
      })
      .finally(() => setLoading(false));
  }, []);

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

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse border-white/5">
              <div className="h-4 bg-white/10 rounded mb-4 w-1/3" />
              <div className="h-6 bg-white/10 rounded mb-2 w-2/3" />
              <div className="h-4 bg-white/10 rounded w-1/2 mt-8" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scans.map(scan => (
            <Link key={scan.id} href={`/scan?id=${scan.id}`}>
              <Card className="hover:-translate-y-1 transition-all group cursor-pointer border-brand-500/10 hover:border-brand-500/50">
                <div className="flex justify-between items-start mb-6">
                  <span className="px-3 py-1 bg-brand-500/10 text-brand-400 text-xs font-bold rounded-lg uppercase tracking-wider">
                    {scan.topMarket ?? 'SEA'}
                  </span>
                  <button className="text-gray-500 hover:text-white transition-colors" onClick={e => e.preventDefault()}>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                    </svg>
                  </button>
                </div>
                <h3 className="text-xl font-display font-medium text-white mb-2 group-hover:text-brand-300 transition-colors">
                  {scan.query}
                </h3>
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/5">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 uppercase font-medium">Window Score</span>
                    <span className="text-lg font-bold text-white">{scan.confidenceScore}/100</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-500 uppercase font-medium">Scanned On</span>
                    <span className="text-sm font-medium text-gray-300">{new Date(scan.savedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
