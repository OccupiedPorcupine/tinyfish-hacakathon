'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { DashboardData, Opportunity } from '@/app/api/dashboard/route';

const FALLBACK: DashboardData = {
  opportunities: [
    { id: 'ai-sales-id', category: 'AI Sales Agents', market: 'Indonesia', momentum: 88, competitionDensity: 35, demand: 85, score: 92, confidence: 89, trend: '+24%', whyNow: 'SMB digitization wave colliding with LLM accessibility. Local incumbents lack modern AI features.', analogs: ['US', 'India'] },
    { id: 'embed-fin-vn', category: 'Embedded Finance', market: 'Vietnam', momentum: 76, competitionDensity: 42, demand: 70, score: 84, confidence: 82, trend: '+18%', whyNow: 'Regulatory sandboxes opening up parallel to non-bank retail growth.', analogs: ['Brazil', 'US'] },
    { id: 'creator-sg', category: 'Creator Tools', market: 'Singapore', momentum: 65, competitionDensity: 82, demand: 60, score: 68, confidence: 91, trend: '-4%', whyNow: 'High saturation from global incumbents. Only hyper-niche workflows viable.', analogs: ['US'] },
    { id: 'health-ph', category: 'HealthTech', market: 'Philippines', momentum: 92, competitionDensity: 15, demand: 90, score: 96, confidence: 78, trend: '+31%', whyNow: 'Severe infra gaps being closed by new telehealth mandates and rising middle class.', analogs: ['India', 'Brazil'] },
    { id: 'b2b-saas-th', category: 'B2B Logistics SaaS', market: 'Thailand', momentum: 74, competitionDensity: 65, demand: 80, score: 75, confidence: 85, trend: '+12%', whyNow: 'Supply chain fragmentation driving demand for unified visibility platforms.', analogs: ['US', 'India'] },
    { id: 'sme-lending-my', category: 'SME Lending Infra', market: 'Malaysia', momentum: 55, competitionDensity: 48, demand: 65, score: 60, confidence: 80, trend: '+6%', whyNow: 'Open banking initiatives slowly gaining traction among traditional B2B lenders.', analogs: ['UK', 'Singapore'] },
  ],
  risingCategories: [
    { category: 'Embedded Finance', market: 'Vietnam', trend: '+18.2%', declining: false },
    { category: 'B2B E-commerce', market: 'Indonesia', trend: '+12.4%', declining: false },
    { category: 'HealthTech', market: 'Vietnam', trend: '+8.9%', declining: false },
    { category: 'EdTech', market: 'Indonesia', trend: '-12.6%', declining: true },
  ],
  migrationSignals: [
    { category: 'AI SDR Tools', path: ['US', 'IN', 'ID'], confidence: 'High confidence', window: '3-6mo window' },
    { category: 'SME Embedded Finance', path: ['BR', 'VN'], confidence: 'Moderate confidence', window: 'inflecting now' },
    { category: 'Vertical Clinic SaaS', path: ['IN', 'PH'], confidence: 'High confidence', window: 'lagging 18mo behind' },
  ],
  fundingSignals: [
    { company: 'DataForge', round: '$12M Series A', market: 'SG', sector: 'Data Infrastructure' },
    { company: 'KrediCepat', round: '$5M Seed', market: 'ID', sector: 'Consumer Lending' },
    { company: 'MediSync', round: '$8M Pre-Series A', market: 'VN', sector: 'HealthTech' },
  ],
};

export default function DashboardTerminal() {
  const router = useRouter();

  // Dashboard live data
  const [dashData, setDashData] = useState<DashboardData>(FALLBACK);
  const [liveUpdating, setLiveUpdating] = useState(true);
  const [liveReady, setLiveReady] = useState(false);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(r => r.json())
      .then(data => {
        if (!data.error && data.opportunities?.length) {
          setDashData(data);
          setLiveReady(true);
        }
      })
      .catch(() => { /* keep fallback */ })
      .finally(() => setLiveUpdating(false));
  }, []);

  // Scan Module State
  const [scanCat, setScanCat] = useState('');
  const [scanSource, setScanSource] = useState('');
  const [scanTarget, setScanTarget] = useState('');
  const [scanPriority, setScanPriority] = useState('Whitespace');
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState('');

  // Matrix State
  const [timeFilter, setTimeFilter] = useState('7D');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [viewBy, setViewBy] = useState<'Category' | 'Market'>('Category');
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const opportunities = dashData.opportunities;

  const filteredData = useMemo(() => {
    return opportunities.filter(op =>
      categoryFilter === 'All' ||
      op.category.includes(categoryFilter) ||
      (categoryFilter === 'Fintech' && (op.category.includes('Finance') || op.category.includes('Lending'))) ||
      (categoryFilter === 'SaaS' && op.category.includes('SaaS'))
    );
  }, [categoryFilter, opportunities]);

  const selectedOp: Opportunity = opportunities.find(op => op.id === selectedId) ?? opportunities[0];
  const topOp: Opportunity = opportunities[0];

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanCat || !scanTarget) return;
    setIsScanning(true);
    setScanError('');
    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: scanCat,
          sourceMarkets: scanSource ? [scanSource] : ['US', 'India', 'Brazil'],
          targetMarkets: [scanTarget]
        })
      });
      const data = await res.json();
      if (data.id) {
        router.push(`/scan?id=${data.id}`);
      } else {
        setScanError(data.error ?? 'Failed to start scan.');
        setIsScanning(false);
      }
    } catch (err) {
      setScanError('Could not reach server. Is the dev server running?');
      console.error(err);
      setIsScanning(false);
    }
  };

  return (
    <div className="bg-[#0a0a0b] min-h-[calc(100vh-4rem)] text-gray-100 font-sans pb-16 selection:bg-brand-500/30">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

        {/* SECTION 1: TOP HERO ROW */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Top Opportunity Hero (7 cols) */}
          <div className="lg:col-span-7 bg-[#111113] border border-white/10 rounded-2xl p-8 relative overflow-hidden shadow-2xl flex flex-col justify-between group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 blur-[80px] pointer-events-none group-hover:bg-brand-500/15 transition-all duration-700" />

            <div>
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xs font-mono font-bold tracking-widest text-brand-400 uppercase flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-500 shadow-[0_0_10px_rgba(20,184,166,0.8)] animate-pulse" />
                  Top Opportunity This Week
                </h2>
                <div className="text-right">
                  <span className="block text-[10px] text-gray-500 font-mono tracking-widest uppercase">Score</span>
                  <span className="text-4xl font-display font-bold text-white tracking-tighter shadow-brand-500/20 drop-shadow-lg">{topOp.score}</span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-3xl font-display font-semibold text-white mb-2 leading-tight">{topOp.category}</h3>
                <div className="flex items-center gap-3 text-sm font-medium text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {topOp.market}
                  </span>
                  <span>•</span>
                  <span className="text-brand-300">Confidence: {topOp.confidence}%</span>
                  <span>•</span>
                  <span className="text-yellow-400">Competition: {topOp.competitionDensity < 40 ? 'Low' : topOp.competitionDensity < 70 ? 'Medium' : 'High'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-6">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-500 font-mono mb-1">Momentum (7D)</div>
                  <div className={`text-lg font-mono font-medium ${topOp.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {topOp.trend}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-500 font-mono mb-1">Analog Markets</div>
                  <div className="text-lg font-mono font-medium text-white">{topOp.analogs.join(', ')}</div>
                </div>
              </div>

              <div className="bg-black/30 border border-white/5 rounded-xl p-4 mb-8">
                <div className="text-[10px] uppercase tracking-widest text-gray-500 font-mono mb-2">Why Now</div>
                <p className="text-sm text-gray-300 leading-relaxed font-light">&ldquo;{topOp.whyNow}&rdquo;</p>
              </div>
            </div>

            <div>
              <div className="flex flex-wrap gap-3">
                <button className="bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold py-2.5 px-6 rounded-lg transition-colors shadow-lg shadow-brand-500/20">
                  View Full Analysis
                </button>
                <button className="bg-[#222] hover:bg-[#333] border border-white/10 text-white text-sm font-medium py-2.5 px-6 rounded-lg transition-colors">
                  Save Opportunity
                </button>
                <button className="bg-[#222] hover:bg-[#333] border border-white/10 text-white text-sm font-medium py-2.5 px-6 rounded-lg transition-colors">
                  Compare Markets
                </button>
              </div>
            </div>
          </div>

          {/* Guided Scan Module (5 cols) */}
          <div className="lg:col-span-5 bg-[#111113] border border-white/10 rounded-2xl p-8 relative flex flex-col">
            <h2 className="text-lg font-display font-semibold text-white mb-1">Run New Opportunity Scan</h2>
            <p className="text-xs text-gray-500 mb-6">Arbitrage market patterns across global ecosystems.</p>

            <form onSubmit={handleScan} className="flex-1 flex flex-col gap-4">
              <div>
                <label className="block text-[10px] font-mono tracking-widest text-gray-500 uppercase mb-1.5">Category / Business Model</label>
                <input type="text" value={scanCat} onChange={e => setScanCat(e.target.value)} required placeholder="e.g. Creator Economy Tools" className="w-full bg-[#0a0a0b] border border-white/10 rounded-lg py-2.5 px-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 transition-all font-mono" />
              </div>
              <div>
                <label className="block text-[10px] font-mono tracking-widest text-gray-500 uppercase mb-1.5">Source Market (Optional)</label>
                <input type="text" value={scanSource} onChange={e => setScanSource(e.target.value)} placeholder="e.g. US, India" className="w-full bg-[#0a0a0b] border border-white/10 rounded-lg py-2.5 px-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 transition-all font-mono" />
              </div>
              <div>
                <label className="block text-[10px] font-mono tracking-widest text-gray-500 uppercase mb-1.5">Target Region / Market</label>
                <input type="text" value={scanTarget} onChange={e => setScanTarget(e.target.value)} required placeholder="e.g. Southeast Asia" className="w-full bg-[#0a0a0b] border border-white/10 rounded-lg py-2.5 px-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 transition-all font-mono" />
              </div>
              <div>
                <label className="block text-[10px] font-mono tracking-widest text-gray-500 uppercase mb-1.5">Priority Engine</label>
                <select value={scanPriority} onChange={e => setScanPriority(e.target.value)} className="w-full bg-[#0a0a0b] border border-white/10 rounded-lg py-2.5 px-4 text-sm text-white focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 transition-all font-mono appearance-none">
                  <option>Whitespace</option>
                  <option>Momentum</option>
                  <option>Ease of Entry</option>
                  <option>Competition</option>
                </select>
              </div>

              <div className="mt-auto pt-6">
                {scanError && (
                  <p className="text-xs text-red-400 mb-3">{scanError}</p>
                )}
                <button type="submit" disabled={isScanning || !scanCat || !scanTarget} className="w-full bg-white hover:bg-gray-200 disabled:opacity-50 text-black text-sm font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2">
                  {isScanning ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : 'Find Best Markets'}
                </button>
              </div>
            </form>

            <div className="mt-6 pt-5 border-t border-white/5">
              <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-3">Suggested Vectors</div>
              <div className="flex flex-wrap gap-2">
                {['AI Sales Agents', 'Embedded Finance', 'Vertical SaaS for Logistics', 'Creator Economy Tools'].map(chip => (
                  <button key={chip} onClick={() => setScanCat(chip)} className="text-xs px-3 py-1.5 bg-[#161618] border border-white/10 text-gray-400 rounded-lg hover:bg-white/10 hover:text-white transition-colors">
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: OPPORTUNITY MATRIX ROW */}
        <section className="bg-[#111113] border border-white/10 rounded-2xl p-8 relative overflow-hidden">
          <header className="mb-6 flex flex-col lg:flex-row justify-between lg:items-end gap-6">
            <div>
              <h2 className="text-2xl font-display font-semibold text-white tracking-tight">Market Opportunity Matrix</h2>
              <p className="text-gray-400 mt-1.5 text-sm max-w-xl">
                Compare markets by momentum and competitive intensity to spot high-potential entry windows.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex bg-[#0a0a0b] border border-white/5 rounded-lg p-1">
                {['24H', '7D', '30D'].map(t => (
                  <button key={t} onClick={() => setTimeFilter(t)} className={`px-4 py-1.5 text-xs font-mono rounded-md transition-all ${timeFilter === t ? 'bg-[#222] text-brand-400 shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}>{t}</button>
                ))}
              </div>
              <div className="flex bg-[#0a0a0b] border border-white/5 rounded-lg p-1">
                <button onClick={() => setViewBy('Category')} className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${viewBy === 'Category' ? 'bg-[#222] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}>By Category</button>
                <button onClick={() => setViewBy('Market')} className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${viewBy === 'Market' ? 'bg-[#222] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}>By Market</button>
              </div>
            </div>
          </header>

          <div className="mb-8 flex flex-wrap gap-2">
            {['All', 'B2B', 'Consumer', 'Fintech', 'HealthTech', 'SaaS'].map(cat => (
              <button key={cat} onClick={() => setCategoryFilter(cat)} className={`px-4 py-1.5 text-xs font-medium rounded-full border transition-all ${categoryFilter === cat ? 'bg-white text-black border-transparent' : 'bg-[#0a0a0b] border-white/10 text-gray-400 hover:bg-[#1a1a1c] hover:text-white'}`}>
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* The Matrix Plot (8 cols) */}
            <div className="lg:col-span-8 flex flex-col min-h-[500px] h-[65vh] max-h-[700px] relative">
              <div className="absolute inset-0 bg-[#0d0d0f] border border-white/10 rounded-2xl overflow-hidden shadow-inner">
                <div className="absolute top-1/2 left-0 w-full border-t border-dashed border-white/5" />
                <div className="absolute top-0 left-1/2 h-full border-l border-dashed border-white/5" />
                <div className="absolute top-6 left-6 text-[10px] font-mono font-bold text-gray-600 uppercase tracking-widest">Emerging Whitespace</div>
                <div className="absolute top-6 right-6 text-[10px] font-mono font-bold text-gray-600 uppercase tracking-widest text-right">Hot but Crowded</div>
                <div className="absolute bottom-6 left-6 text-[10px] font-mono font-bold text-gray-600 uppercase tracking-widest">Low Priority</div>
                <div className="absolute bottom-6 right-6 text-[10px] font-mono font-bold text-gray-600 uppercase tracking-widest text-right">Mature / Saturated</div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 font-mono tracking-widest uppercase flex items-center gap-2">
                  <span>Low</span><span className="w-16 h-px bg-gray-700"></span><span>Competition Density</span><span className="w-16 h-px bg-gray-700"></span><span>High</span>
                </div>
                <div className="absolute top-1/2 left-2 -translate-y-1/2 -rotate-90 text-[10px] text-gray-500 font-mono tracking-widest uppercase flex items-center gap-2 origin-center">
                  <span>Low</span><span className="w-16 h-px bg-gray-700"></span><span>Market Momentum</span><span className="w-16 h-px bg-gray-700"></span><span>High</span>
                </div>

                {liveUpdating && (
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/40 border border-white/5">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                    <span className="text-[9px] text-gray-500 font-mono">fetching live data</span>
                  </div>
                )}

                <div className="absolute inset-x-12 inset-y-16">
                  {filteredData.map(op => {
                    const size = 20 + (op.demand / 100) * 40;
                    let colorClass = 'border-gray-500 bg-gray-500/20 text-gray-400';
                    let glowClass = '';
                    if (op.score >= 90) { colorClass = 'border-brand-400 bg-brand-500/30 text-brand-100'; glowClass = 'shadow-[0_0_30px_rgba(20,184,166,0.3)]'; }
                    else if (op.score >= 80) { colorClass = 'border-blue-400 bg-blue-500/30 text-blue-100'; glowClass = 'shadow-[0_0_20px_rgba(59,130,246,0.2)]'; }
                    else if (op.score >= 60) { colorClass = 'border-yellow-400 bg-yellow-500/20 text-yellow-100'; }
                    else { colorClass = 'border-red-400 bg-red-500/20 text-red-100'; }

                    const isSelected = selectedId === op.id;
                    const isHovered = hoveredNode === op.id;
                    const dimOthers = (selectedId || hoveredNode) && !isSelected && !isHovered;

                    return (
                      <div
                        key={op.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                        style={{ left: `${op.competitionDensity}%`, bottom: `${op.momentum}%`, zIndex: isSelected ? 50 : (isHovered ? 40 : 10), transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}
                        onMouseEnter={() => setHoveredNode(op.id)}
                        onMouseLeave={() => setHoveredNode(null)}
                        onClick={() => setSelectedId(op.id)}
                      >
                        <div
                          className={`rounded-full border backdrop-blur-md flex items-center justify-center transition-all ${colorClass} ${glowClass} ${dimOthers ? 'opacity-20 scale-90 blur-[2px] saturate-0' : 'opacity-100'} ${isSelected ? 'ring-4 ring-white/10 scale-110' : ''}`}
                          style={{ width: size, height: size }}
                        >
                          <span className="text-[10px] font-bold tracking-tight opacity-90 drop-shadow-md">{op.score}</span>
                        </div>
                        <div className={`absolute left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap text-[10px] font-medium transition-all ${dimOthers ? 'opacity-0' : 'opacity-100 text-gray-300'}`}>
                          {viewBy === 'Category' ? op.category : op.market}
                        </div>
                        <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 bg-[#1a1a1c] border border-white/10 rounded-xl p-4 shadow-2xl transition-all pointer-events-none ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="text-xs font-bold text-white mb-0.5">{op.category}</div>
                              <div className="text-[10px] text-gray-400 font-mono uppercase">{op.market}</div>
                            </div>
                            <div className={`text-xs font-black font-mono ${op.score >= 80 ? 'text-brand-400' : 'text-yellow-400'}`}>{op.score}</div>
                          </div>
                          <p className="text-[10px] text-gray-300 leading-relaxed mb-3 line-clamp-2">{op.whyNow}</p>
                          <div className="grid grid-cols-2 gap-2 border-t border-white/5 pt-2">
                            <div>
                              <span className="block text-[8px] text-gray-500 uppercase font-mono tracking-widest">Momentum</span>
                              <span className={`text-[10px] font-mono ${op.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{op.trend} 7D</span>
                            </div>
                            <div>
                              <span className="block text-[8px] text-gray-500 uppercase font-mono tracking-widest">Competition</span>
                              <span className="text-[10px] font-mono text-gray-300">{op.competitionDensity}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Side Matrix Insight Panel (4 cols) */}
            <div className="lg:col-span-4 flex flex-col h-full">
              <div className="bg-[#0a0a0b] border border-white/5 rounded-2xl flex flex-col flex-1 overflow-hidden shadow-inner relative group h-full">
                <div className={`absolute top-0 right-0 w-48 h-48 blur-[80px] opacity-20 transition-all ${selectedOp.score >= 80 ? 'bg-brand-500' : 'bg-yellow-500'}`} />
                <div className="flex-1 flex flex-col p-6 z-10 overflow-y-auto">
                  <div className="flex justify-between items-start mb-6">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] tracking-widest text-gray-300 font-mono uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Matrix Selection
                    </div>
                    <div className="text-right">
                      <span className="block text-[10px] font-mono text-gray-500 uppercase">Score</span>
                      <span className={`text-3xl font-display font-semibold tracking-tighter ${selectedOp.score >= 80 ? 'text-brand-400' : 'text-white'}`}>{selectedOp.score}</span>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-white leading-tight mb-1">{selectedOp.category}</h2>
                  <h3 className="text-lg text-gray-400 font-medium font-display mb-8">— {selectedOp.market}</h3>
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-widest font-mono mb-1">Confidence</div>
                      <div className="text-lg font-mono text-white">{selectedOp.confidence}%</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-widest font-mono mb-1">Competition</div>
                      <div className="text-lg font-mono text-white">{selectedOp.competitionDensity}% Density</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-widest font-mono mb-1">Momentum Trend</div>
                      <div className={`text-lg font-mono ${selectedOp.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{selectedOp.trend}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-widest font-mono mb-1">Analog Markets</div>
                      <div className="text-sm font-medium text-gray-300 flex flex-wrap gap-1 mt-1">
                        {selectedOp.analogs.map(a => <span key={a} className="bg-white/5 px-2 py-0.5 rounded border border-white/5">{a}</span>)}
                      </div>
                    </div>
                  </div>
                  <div className="mb-8">
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest font-mono mb-3">Why Now</div>
                    <p className="text-sm text-gray-300 leading-relaxed bg-[#161618] p-4 rounded-xl border border-white/5">{selectedOp.whyNow}</p>
                  </div>
                  <div className="mt-auto space-y-3 pt-6">
                    <button className="w-full bg-brand-600 hover:bg-brand-500 text-white font-semibold py-3.5 rounded-xl transition-colors shadow-lg shadow-brand-500/20 text-sm">View Full Analysis</button>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="bg-[#222] hover:bg-[#333] border border-white/5 text-xs font-medium text-white py-3 rounded-xl transition-colors">Save Opportunity</button>
                      <button className="bg-[#222] hover:bg-[#333] border border-white/5 text-xs font-medium text-white py-3 rounded-xl transition-colors">Compare Markets</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: SUPPORTING INTELLIGENCE ROW */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Fastest-Rising Categories */}
          <div className="bg-[#111113] border border-white/10 rounded-2xl p-6 flex flex-col">
            <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider font-mono">Fastest-Rising Categories</h3>
            <div className="flex flex-col gap-4">
              {dashData.risingCategories.map((item, i) => (
                <div key={i} className="flex justify-between items-center group">
                  <div>
                    <div className={`text-sm font-medium ${item.declining ? 'text-gray-400 line-through decoration-red-500/50' : 'text-white'}`}>{item.category}</div>
                    <div className="text-[10px] font-mono text-gray-500 tracking-wider uppercase">{item.market}</div>
                  </div>
                  <div className={`text-sm font-mono font-bold group-hover:scale-110 transition-transform ${item.declining ? 'text-red-400' : 'text-green-400'}`}>{item.trend}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Pattern Migration Signals */}
          <div className="bg-[#111113] border border-white/10 rounded-2xl p-6 flex flex-col">
            <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider font-mono">Pattern Migration Signals</h3>
            <div className="flex flex-col gap-5">
              {dashData.migrationSignals.map((sig, i) => (
                <div key={i} className="flex flex-col gap-1.5">
                  <div className="text-sm font-medium text-white">{sig.category}</div>
                  <div className="flex items-center text-[11px] font-mono text-gray-400 gap-2">
                    {sig.path.map((market, j) => (
                      <React.Fragment key={j}>
                        <span className={j === sig.path.length - 1 ? 'text-white font-bold' : ''}>{market}</span>
                        {j < sig.path.length - 1 && <span className="text-brand-500">→</span>}
                      </React.Fragment>
                    ))}
                  </div>
                  <div className="text-[10px] text-gray-500 italic">{sig.confidence} — {sig.window}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Funding Signals */}
          <div className="bg-[#111113] border border-white/10 rounded-2xl p-6 flex flex-col">
            <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider font-mono">Recent Funding Signals</h3>
            <div className="flex flex-col gap-5">
              {dashData.fundingSignals.map((sig, i) => (
                <div key={i} className="border-l-2 border-brand-500/50 pl-3">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-sm font-bold text-white">{sig.company}</span>
                    <span className="text-[10px] font-mono font-medium text-brand-300 bg-brand-500/10 border border-brand-500/20 px-1.5 py-0.5 rounded">{sig.round}</span>
                  </div>
                  <div className="text-[11px] text-gray-400 flex items-center gap-2">
                    <span className="uppercase font-mono">{sig.market}</span> • <span>{sig.sector}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4: USER WORKSPACE ROW */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="bg-[#111113] border border-white/10 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider font-mono flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Recent Scans
            </h3>
            <div className="flex flex-col gap-4">
              <Link href="/scan?id=fintech" className="block bg-[#0a0a0b] border border-white/5 rounded-xl p-4 hover:border-white/20 transition-all group">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-bold text-white group-hover:text-brand-300 transition-colors">Fintech Super App</span>
                  <span className="text-xs font-mono font-bold text-brand-400">Score 84</span>
                </div>
                <div className="text-[11px] text-gray-400 flex flex-col gap-1">
                  <div><span className="text-gray-500">Best market:</span> Philippines</div>
                  <div><span className="text-gray-500">Risk:</span> Incumbent density</div>
                </div>
              </Link>
              <Link href="/scan?id=quickcommerce" className="block bg-[#0a0a0b] border border-white/5 rounded-xl p-4 hover:border-white/20 transition-all group">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-bold text-white group-hover:text-brand-300 transition-colors">Quick Commerce</span>
                  <span className="text-xs font-mono font-bold text-blue-400">Score 71</span>
                </div>
                <div className="text-[11px] text-gray-400 flex flex-col gap-1">
                  <div><span className="text-gray-500">Best market:</span> Vietnam Tier-2</div>
                  <div><span className="text-gray-500">Risk:</span> Margin pressure</div>
                </div>
              </Link>
            </div>
          </div>

          <div className="bg-[#111113] border border-white/10 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider font-mono flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
              Saved Opportunities
            </h3>
            <div className="flex flex-col gap-4">
              <div className="bg-[#0a0a0b] border border-white/5 rounded-xl p-4 flex justify-between items-center group cursor-pointer hover:border-white/20 transition-all">
                <div>
                  <div className="text-sm font-bold text-white mb-1 group-hover:text-brand-300 transition-colors">Vertical AI CRM</div>
                  <div className="text-[11px] font-mono text-gray-500 flex items-center gap-2">
                    <span>US</span><span className="text-white">→</span><span>VN</span>
                    <span>•</span>
                    <span className="text-gray-600">Saved 2d ago</span>
                  </div>
                </div>
                <div className="text-xs font-mono font-bold text-brand-400">88.2%</div>
              </div>
              <div className="bg-[#0a0a0b] border border-white/5 rounded-xl p-4 flex justify-between items-center group cursor-pointer hover:border-white/20 transition-all">
                <div>
                  <div className="text-sm font-bold text-white mb-1 group-hover:text-brand-300 transition-colors">Earned Wage Access</div>
                  <div className="text-[11px] font-mono text-gray-500 flex items-center gap-2">
                    <span>BR</span><span className="text-white">→</span><span>ID</span>
                    <span>•</span>
                    <span className="text-gray-600">Saved 4d ago</span>
                  </div>
                </div>
                <div className="text-xs font-mono font-bold text-blue-400">81.4%</div>
              </div>
            </div>
          </div>

        </section>

      </div>
    </div>
  );
}
