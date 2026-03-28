'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Types for live dashboard data
type DashboardOp = {
  id: string; category: string; market: string; sector: string;
  x: number; y: number; score: number; confidence: number;
  demand: number; trend: string; analogs: string[]; whyNow: string;
};
type RisingCategory = { category: string; market: string; trend: string; declining: boolean; };
type MigrationSignal = { category: string; path: string[]; confidence: string; window: string; };
type FundingSignal = { company: string; round: string; market: string; sector: string; };

// Fallback data shown immediately (no blank states)
const FALLBACK_OPPORTUNITIES: DashboardOp[] = [
  {
    id: '1', category: 'AI Sales Agents', market: 'Indonesia', sector: 'SaaS',
    x: 34, y: 84, score: 92, confidence: 84, demand: 78,
    trend: '+14%', analogs: ['US', 'India'], whyNow: 'Strong SMB digitization tailwinds and relatively weak local category leaders.'
  },
  {
    id: '2', category: 'Vertical SaaS for Clinics', market: 'Vietnam', sector: 'HealthTech',
    x: 28, y: 78, score: 89, confidence: 83, demand: 66,
    trend: '+13%', analogs: ['India'], whyNow: 'Clinic digitization demand is rising quickly with limited specialized incumbents.'
  },
  {
    id: '3', category: 'Embedded Finance', market: 'Vietnam', sector: 'Fintech',
    x: 44, y: 76, score: 88, confidence: 81, demand: 74,
    trend: '+18%', analogs: ['Brazil', 'India'], whyNow: 'Growing SME financial infrastructure demand and rising digital commerce adoption.'
  },
  {
    id: '4', category: 'HealthTech Workflow SaaS', market: 'Philippines', sector: 'HealthTech',
    x: 22, y: 58, score: 85, confidence: 77, demand: 64,
    trend: '+11%', analogs: ['India'], whyNow: 'Operational digitization demand is rising while incumbents remain fragmented.'
  },
  {
    id: '5', category: 'B2B Logistics SaaS', market: 'Thailand', sector: 'B2B',
    x: 56, y: 60, score: 79, confidence: 75, demand: 72,
    trend: '+9%', analogs: ['China', 'India'], whyNow: 'Logistics modernization is increasing and category maturity is still moderate.'
  },
  {
    id: '6', category: 'SME Lending Infrastructure', market: 'Malaysia', sector: 'Fintech',
    x: 66, y: 52, score: 71, confidence: 73, demand: 69,
    trend: '+7%', analogs: ['Brazil'], whyNow: 'Lender digitization is improving, but competition is building.'
  },
  {
    id: '7', category: 'Quick Commerce Enablement', market: 'Indonesia', sector: 'B2B',
    x: 62, y: 44, score: 66, confidence: 70, demand: 76,
    trend: '+4%', analogs: ['India', 'LATAM'], whyNow: 'Large operational demand exists, but the category is getting more crowded.'
  },
  {
    id: '8', category: 'Creator Monetization Tools', market: 'Singapore', sector: 'Consumer',
    x: 78, y: 64, score: 61, confidence: 69, demand: 67,
    trend: '+5%', analogs: ['US'], whyNow: 'High monetization readiness but increasingly crowded vendor landscape.'
  },
  {
    id: '9', category: 'KYC / Compliance API', market: 'Singapore', sector: 'Fintech',
    x: 83, y: 46, score: 54, confidence: 72, demand: 63,
    trend: '+3%', analogs: ['US', 'UK'], whyNow: 'Strong compliance need, but heavy incumbent density limits whitespace.'
  },
  {
    id: '10', category: 'Blue-collar Workforce Tech', market: 'Philippines', sector: 'B2B',
    x: 18, y: 34, score: 82, confidence: 76, demand: 71,
    trend: '+10%', analogs: ['India'], whyNow: 'Labor market digitization is improving and category competition remains low.'
  }
];

const FALLBACK_RISING: RisingCategory[] = [
  { category: 'Embedded Finance', market: 'Vietnam', trend: '+18.2%', declining: false },
  { category: 'B2B E-commerce', market: 'Indonesia', trend: '+12.4%', declining: false },
  { category: 'HealthTech', market: 'Vietnam', trend: '+8.9%', declining: false },
  { category: 'EdTech', market: 'Indonesia', trend: '-12.6%', declining: true },
];

const FALLBACK_MIGRATION: MigrationSignal[] = [
  { category: 'AI SDR Tools', path: ['US', 'IN', 'ID'], confidence: 'High confidence', window: '3-6mo window' },
  { category: 'SME Embedded Finance', path: ['BR', 'VN'], confidence: 'Moderate confidence', window: 'inflecting now' },
  { category: 'Vertical Clinic SaaS', path: ['IN', 'PH'], confidence: 'High confidence', window: 'lagging 18mo behind' },
];

const FALLBACK_FUNDING: FundingSignal[] = [
  { company: 'DataForge', round: '$12M Series A', market: 'SG', sector: 'Data Infrastructure' },
  { company: 'KrediCepat', round: '$5M Seed', market: 'ID', sector: 'Consumer Lending' },
  { company: 'MediSync', round: '$8M Pre-Series A', market: 'VN', sector: 'HealthTech' },
];

export default function DashboardTerminal() {
  const router = useRouter();

  // Scan Module State
  const [scanCat, setScanCat] = useState('');
  const [scanSource, setScanSource] = useState('');
  const [scanTarget, setScanTarget] = useState('');
  const [scanPriority, setScanPriority] = useState('Whitespace');
  const [isScanning, setIsScanning] = useState(false);

  // Live dashboard data (fallback shown immediately)
  const [opportunities, setOpportunities] = useState<DashboardOp[]>(FALLBACK_OPPORTUNITIES);
  const [risingCategories, setRisingCategories] = useState<RisingCategory[]>(FALLBACK_RISING);
  const [migrationSignals, setMigrationSignals] = useState<MigrationSignal[]>(FALLBACK_MIGRATION);
  const [fundingSignals, setFundingSignals] = useState<FundingSignal[]>(FALLBACK_FUNDING);
  const [dashLive, setDashLive] = useState(false);
  const [dashFetching, setDashFetching] = useState(true);

  useEffect(() => {
    // Load from sessionStorage immediately (instant on return visits)
    const cached = sessionStorage.getItem('frontier-dashboard');
    if (cached) {
      try {
        const data = JSON.parse(cached);
        applyDashboardData(data);
        setDashFetching(false);
        return; // skip API call — already have data
      } catch {}
    }

    fetch('/api/dashboard')
      .then(r => r.json())
      .then(data => {
        applyDashboardData(data);
        sessionStorage.setItem('frontier-dashboard', JSON.stringify(data));
      })
      .catch(() => {/* silently use fallback */})
      .finally(() => setDashFetching(false));
  }, []);

  function applyDashboardData(data: any) {
    if (data.opportunities?.length) {
      setOpportunities(data.opportunities.map((op: any, i: number) => ({
        id: op.id || String(i + 1),
        category: op.category,
        market: op.market,
        sector: op.analogs?.[0] || 'Tech',
        x: op.competitionDensity ?? 50,
        y: op.momentum ?? 50,
        score: op.score,
        confidence: op.confidence,
        demand: op.demand,
        trend: op.trend,
        analogs: op.analogs || [],
        whyNow: op.whyNow,
      })));
      setDashLive(true);
    }
    if (data.risingCategories?.length) setRisingCategories(data.risingCategories);
    if (data.migrationSignals?.length) setMigrationSignals(data.migrationSignals);
    if (data.fundingSignals?.length) setFundingSignals(data.fundingSignals);
  }

  // Matrix State
  const [timeFilter, setTimeFilter] = useState('7D');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [viewBy, setViewBy] = useState<'Category' | 'Market'>('Category');
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredData = useMemo(() => {
    return opportunities.filter(op => categoryFilter === 'All' || op.category.includes(categoryFilter) || (categoryFilter === 'Fintech' && (op.category.includes('Finance') || op.category.includes('Lending'))) || (categoryFilter === 'SaaS' && op.category.includes('SaaS')));
  }, [categoryFilter, opportunities]);

  const selectedOp = opportunities.find(op => op.id === selectedId) || opportunities[0];

  // Get top 4 opportunities ranked by score for the shortlist
  const topOpportunities = useMemo(() => {
    return [...opportunities].sort((a, b) => b.score - a.score).slice(0, 4);
  }, [opportunities]);

  const getCompetitionColor = (x: number) => {
    if (x < 30) return 'text-teal-400 bg-teal-500/10 border-teal-500/20';
    if (x < 50) return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    if (x < 70) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
    return 'text-red-400 bg-red-500/10 border-red-500/20';
  };

  const getCompetitionLabel = (x: number) => {
    if (x < 30) return 'Low';
    if (x < 50) return 'Low/Med';
    if (x < 70) return 'Medium';
    return 'High';
  };

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanCat || !scanTarget) return;
    setIsScanning(true);
    
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
      if (data.id) router.push(`/scan?id=${data.id}`);
    } catch (err) {
      console.error(err);
      setIsScanning(false);
    }
  };

  return (
    <div className="bg-[#0a0a0b] min-h-[calc(100vh-4rem)] text-gray-100 font-sans pb-16 selection:bg-brand-500/30">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* SECTION 1: TOP RANKED OPPORTUNITY + SHORTLIST ROW */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Selected Opportunity Detail (8 cols) */}
          <div className="lg:col-span-8 bg-[#111113] border border-white/10 rounded-2xl p-8 relative overflow-hidden shadow-2xl flex flex-col justify-between group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 blur-[80px] pointer-events-none group-hover:bg-brand-500/15 transition-all duration-700" />
            
            <div>
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xs font-mono font-bold tracking-widest text-brand-400 uppercase flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-500 shadow-[0_0_10px_rgba(20,184,166,0.8)] animate-pulse" />
                  Top Opportunity This Week
                </h2>
                <div className="text-right">
                  <span className="block text-[10px] text-gray-500 font-mono tracking-widest uppercase">Opportunity Score</span>
                  <span className="text-4xl font-display font-bold text-white tracking-tighter shadow-brand-500/20 drop-shadow-lg">{selectedOp.score}</span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-3xl font-display font-semibold text-white mb-2 leading-tight">{selectedOp.category}</h3>
                <div className="flex items-center gap-3 text-sm font-medium text-gray-400">
                  <span className="flex items-center gap-1.5"><svg className="w-4 h-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg> {selectedOp.market}</span>
                  <span>•</span>
                  <span className="text-brand-300">Confidence: {selectedOp.confidence}%</span>
                  <span>•</span>
                  <span className={getCompetitionLabel(selectedOp.x) === 'Low' ? 'text-teal-400' : getCompetitionLabel(selectedOp.x) === 'Low/Med' ? 'text-blue-400' : 'text-yellow-400'}>Competition: {getCompetitionLabel(selectedOp.x)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-6">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-500 font-mono mb-1">Momentum (7D)</div>
                  <div className="text-lg font-mono font-medium text-green-400">{selectedOp.trend}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-500 font-mono mb-1">Time Window</div>
                  <div className="text-lg font-mono font-medium text-white">6–12 Months</div>
                </div>
              </div>

              <div className="bg-black/30 border border-white/5 rounded-xl p-4 mb-8">
                <div className="text-[10px] uppercase tracking-widest text-gray-500 font-mono mb-2">Why Now</div>
                <p className="text-sm text-gray-300 leading-relaxed font-light">
                  {selectedOp.whyNow}
                </p>
              </div>
            </div>

            <div>
              <div className="flex gap-6 mb-6">
                <div className="flex items-center gap-2"><span className="text-white font-mono font-bold">12</span> <span className="text-xs text-gray-500 font-medium tracking-wide">Funding signals</span></div>
                <div className="flex items-center gap-2"><span className="text-white font-mono font-bold">18</span> <span className="text-xs text-gray-500 font-medium tracking-wide">Hiring signals</span></div>
                <div className="flex items-center gap-2"><span className="text-white font-mono font-bold">9</span> <span className="text-xs text-gray-500 font-medium tracking-wide">Launch signals</span></div>
                <div className="flex items-center gap-2"><span className="text-blue-400 font-mono font-bold">MODERATE</span> <span className="text-xs text-gray-500 font-medium tracking-wide">Regulatory tailwinds</span></div>
              </div>
              
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

          {/* Right: Top 4 Ranked Opportunities (4 cols) */}
          <div className="lg:col-span-4 bg-[#111113] border border-white/10 rounded-2xl p-6 relative flex flex-col overflow-hidden">
            <h2 className="text-lg font-display font-semibold text-white mb-1">Top Opportunities Right Now</h2>
            <p className="text-xs text-gray-500 mb-6">Ranked by composite opportunity score</p>
            
            <div className="flex flex-col gap-3 flex-1">
              {topOpportunities.map((op, idx) => (
                <button
                  key={op.id}
                  onClick={() => setSelectedId(op.id)}
                  className={`p-4 rounded-xl border transition-all text-left ${
                    selectedId === op.id
                      ? 'bg-brand-500/15 border-brand-400/50 shadow-lg shadow-brand-500/20'
                      : 'bg-[#0a0a0b] border-white/5 hover:bg-[#161618] hover:border-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2.5">
                    <div className="flex items-start gap-3 flex-1">
                      <span className={`text-sm font-mono font-bold ${selectedId === op.id ? 'text-brand-300' : 'text-gray-500'}`}>#{idx + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-white text-sm leading-tight">{op.category.split(' ').slice(0, 2).join(' ')}</div>
                        <div className="text-[11px] text-gray-400 font-mono uppercase tracking-wide">{op.market}</div>
                      </div>
                    </div>
                    <span className={`font-mono font-bold text-lg whitespace-nowrap ml-2 ${selectedId === op.id ? 'text-brand-300' : 'text-white'}`}>{op.score}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono text-green-400 font-bold bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">{op.trend}</span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getCompetitionColor(op.x)}`}>{getCompetitionLabel(op.x)} Competition</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-white/5">
              <Link href="/markets" className="text-xs text-brand-400 hover:text-brand-300 font-mono font-bold uppercase tracking-widest transition-colors flex items-center gap-2">
                View full matrix
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </Link>
            </div>
          </div>

        </section>

        {/* SECTION 2: OPPORTUNITY MATRIX ROW */}
        <section className="bg-[#111113] border border-white/10 rounded-2xl p-8 relative overflow-hidden">
          <header className="mb-6 flex flex-col lg:flex-row justify-between lg:items-end gap-6">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-display font-semibold text-white tracking-tight">Market Opportunity Matrix</h2>
                {dashFetching ? (
                  <span className="flex items-center gap-1.5 text-xs font-mono text-brand-400 bg-brand-500/10 border border-brand-500/20 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />fetching live data
                  </span>
                ) : dashLive ? (
                  <span className="flex items-center gap-1.5 text-xs font-mono text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" />live
                  </span>
                ) : null}
              </div>
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
            
            {/* The Matrix Plot - Full Width (12 cols) */}
            <div className="lg:col-span-12 flex flex-col min-h-[500px] h-[65vh] max-h-[700px] relative">
              <div className="absolute inset-0 bg-[#0d0d0f] border border-white/10 rounded-2xl overflow-hidden shadow-inner flex">
                {/* Quadrant Backgrounds - More Subtle */}
                <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-teal-500/3 mix-blend-screen" />
                <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-amber-500/3 mix-blend-screen" />
                <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gray-500/2 mix-blend-screen" />
                <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-rose-500/3 mix-blend-screen" />

                {/* Quadrant Lines - Very Subtle */}
                <div className="absolute top-1/2 left-0 w-full border-t border-dashed border-white/3 z-0" />
                <div className="absolute top-0 left-1/2 h-full border-l border-dashed border-white/3 z-0" />
                
                {/* Quadrant Labels - Reduced Opacity */}
                <div className="absolute top-6 left-6 text-[9px] font-mono font-bold text-teal-600/40 uppercase tracking-widest z-0">Emerging Whitespace</div>
                <div className="absolute top-6 right-6 text-[9px] font-mono font-bold text-amber-600/40 uppercase tracking-widest text-right z-0">Hot but Crowded</div>
                <div className="absolute bottom-10 left-6 text-[9px] font-mono font-bold text-gray-500/40 uppercase tracking-widest z-0">Low Priority</div>
                <div className="absolute bottom-10 right-6 text-[9px] font-mono font-bold text-rose-600/40 uppercase tracking-widest text-right z-0">Mature / Saturated</div>
                
                {/* Axes */}
                <div className="absolute bottom-2 left-6 right-6 flex items-center justify-between text-[9px] text-gray-500 font-mono tracking-widest uppercase z-0 border-t border-gray-800/50 pt-1">
                  <span>Low</span>
                  <span className="font-bold text-gray-400">Competition Density</span>
                  <span>High</span>
                </div>
                <div className="absolute top-6 bottom-10 left-2 w-4 flex flex-col items-center justify-between text-[9px] text-gray-500 font-mono tracking-widest uppercase z-0">
                  <span className="-rotate-90 origin-center translate-y-2">High</span>
                  <span className="-rotate-90 origin-center font-bold text-gray-400 whitespace-nowrap">Market Momentum</span>
                  <span className="-rotate-90 origin-center -translate-y-2">Low</span>
                </div>

                {/* Legend - Reduced Prominence */}
                <div className="absolute bottom-12 right-6 bg-black/20 border border-white/5 p-2 rounded-lg flex gap-3 text-[8px] text-gray-500 font-mono z-10 backdrop-blur-sm">
                   <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full border border-gray-600" /> Size = Demand</div>
                   <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-white opacity-40" /> Fill = Score</div>
                   <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full border border-white/40" /> Ring = Confidence</div>
                </div>

                {/* Data Points Playfield */}
                <div className="absolute inset-x-12 inset-y-16 lg:inset-x-16 lg:inset-y-16 z-20">
                  {useMemo(() => {
                    // Get top 3 opportunities by score for secondary labels
                    const topOps = [...filteredData].sort((a, b) => b.score - a.score).slice(0, 3).map(op => op.id);
                    return filteredData.map(op => {
                      const size = Math.max(24, (op.demand / 100) * 60);
                      
                      // Opportunity Score = Fill intensity/color
                      let fillClass = 'bg-gray-500/20';
                      let textClass = 'text-gray-400';
                      let glowClass = '';
                      
                      if (op.score >= 90) { fillClass = 'bg-brand-500/80'; textClass = 'text-white'; glowClass = 'shadow-[0_0_20px_rgba(20,184,166,0.6)]'; }
                      else if (op.score >= 80) { fillClass = 'bg-brand-500/50'; textClass = 'text-white'; glowClass = 'shadow-[0_0_15px_rgba(20,184,166,0.3)]'; }
                      else if (op.score >= 70) { fillClass = 'bg-blue-500/40'; textClass = 'text-white'; glowClass = 'shadow-[0_0_10px_rgba(59,130,246,0.2)]'; }
                      else if (op.score >= 60) { fillClass = 'bg-yellow-500/30'; textClass = 'text-yellow-100'; }
                      else { fillClass = 'bg-red-500/30'; textClass = 'text-red-100'; }

                      // Confidence = Ring stroke
                      let borderClass = 'border-white/10 border';
                      if (op.confidence >= 80) borderClass = 'border-white/50 border-2';
                      else if (op.confidence >= 70) borderClass = 'border-white/30 border-2';

                      const isSelected = selectedId === op.id;
                      const isHovered = hoveredNode === op.id;
                      const isTopOp = topOps.includes(op.id) && !isSelected;
                      const dimOthers = selectedId && !isSelected && !isHovered && !isTopOp;

                      return (
                        <div
                          key={op.id}
                          className={`absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-all duration-500 ${dimOthers ? 'opacity-35 saturate-40' : (isTopOp && !isHovered ? 'opacity-65' : 'opacity-100')} ${isSelected ? 'z-50' : (isHovered ? 'z-40' : 'z-30')}`}
                          style={{ 
                            left: `${op.x}%`, 
                            bottom: `${op.y}%`
                          }}
                          onMouseEnter={() => setHoveredNode(op.id)}
                          onMouseLeave={() => setHoveredNode(null)}
                          onClick={() => setSelectedId(op.id)}
                        >
                          <div 
                            className={`rounded-full flex items-center justify-center transition-all duration-300 ${fillClass} ${borderClass} ${isSelected ? `ring-2 ring-brand-300 scale-140 ${glowClass} !bg-brand-400 shadow-2xl` : (isHovered ? 'scale-125 ring-1 ring-white/30' : '')} hover:scale-110`}
                            style={{ width: size, height: size }}
                          >
                            <span className={`text-[10px] font-bold tracking-tight drop-shadow-md ${textClass} ${isSelected ? '!text-white' : ''} ${(!isSelected && size < 30) ? 'opacity-0 group-hover:opacity-100' : ''}`}>
                              {op.score}
                            </span>
                          </div>

                          {/* Smart Label Logic */}
                          {isSelected && (
                            <div className="absolute left-1/2 -translate-x-1/2 mt-2 flex flex-col items-center whitespace-nowrap z-50 pointer-events-none">
                              <span className="text-[10px] font-bold text-white drop-shadow-lg">{op.category}</span>
                              <span className="text-[8px] font-mono tracking-widest text-gray-200 drop-shadow-lg">{op.market}</span>
                              <span className="text-[9px] font-mono font-bold text-brand-300 drop-shadow-lg mt-1">{op.score} Score</span>
                            </div>
                          )}
                          {isTopOp && !isSelected && (
                            <div className="absolute left-1/2 -translate-x-1/2 mt-2 flex flex-col items-center whitespace-nowrap z-30 opacity-60 pointer-events-none">
                              <span className="text-[9px] font-semibold text-gray-300 drop-shadow-md">{op.category.split(' ').slice(0, 2).join(' ')}</span>
                              <span className="text-[8px] font-mono tracking-widest text-gray-400 drop-shadow-md">{op.market}</span>
                            </div>
                          )}

                          {/* Hover Tooltip */}
                          <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 bg-[#1a1a1c] border border-white/10 rounded-lg p-3 shadow-2xl transition-all pointer-events-none z-50 ${isHovered && !isSelected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                            <div className="flex flex-col gap-1.5">
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-white truncate w-32">{op.category}</span>
                                <span className={`text-xs font-black font-mono ${op.score >= 80 ? 'text-brand-400' : 'text-yellow-400'}`}>{op.score}</span>
                              </div>
                              <span className="text-[10px] text-gray-400 font-mono uppercase truncate">{op.market}</span>
                              <div className="text-[10px] text-gray-300 line-clamp-2 mt-1">{op.whyNow}</div>
                            </div>
                          </div>
                        </div>
                      );
                    });
                  }, [filteredData, selectedId, hoveredNode])}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 2B: RUN NEW SCAN */}
        <section className="bg-[#111113] border border-white/10 rounded-2xl p-8 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-display font-semibold text-white mb-1 tracking-tight">Run New Opportunity Scan</h2>
              <p className="text-gray-400 text-sm mb-8">Arbitrage market patterns across global ecosystems to find hidden opportunities.</p>

              <form onSubmit={handleScan} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
              </form>

              <button onClick={(e) => { e.preventDefault(); handleScan(e as any); }} disabled={isScanning || !scanCat || !scanTarget} className="bg-white hover:bg-gray-200 disabled:opacity-50 text-black text-sm font-bold py-3.5 px-8 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 w-full md:w-auto">
                {isScanning ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : 'Find Best Markets'}
              </button>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider font-mono">Suggested Vectors</h3>
              <div className="flex flex-col gap-2">
                {['AI Sales Agents', 'Embedded Finance', 'Vertical SaaS for Logistics', 'Creator Economy Tools'].map(chip => (
                  <button key={chip} onClick={() => setScanCat(chip)} className="text-xs px-4 py-2.5 bg-[#0a0a0b] border border-white/10 text-gray-400 rounded-lg hover:bg-white/10 hover:text-white transition-colors text-left">
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: SUPPORTING INTELLIGENCE ROW */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-[#111113] border border-white/10 rounded-2xl p-6 flex flex-col">
            <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider font-mono flex items-center gap-2">
              Fastest-Rising Categories
              {dashFetching ? <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" /> : dashLive ? <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> : null}
            </h3>
            <div className="flex flex-col gap-4">
              {risingCategories.map((cat, i) => (
                <div key={i} className="flex justify-between items-center group">
                  <div>
                    <div className={`text-sm font-medium ${cat.declining ? 'text-gray-400 line-through decoration-red-500/50' : 'text-white'}`}>{cat.category}</div>
                    <div className="text-[10px] font-mono text-gray-500 tracking-wider">{cat.market.toUpperCase()}</div>
                  </div>
                  <div className={`text-sm font-mono font-bold ${cat.declining ? 'text-red-400' : 'text-green-400'} group-hover:scale-110 transition-transform`}>{cat.trend}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#111113] border border-white/10 rounded-2xl p-6 flex flex-col">
            <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider font-mono flex items-center gap-2">
              Pattern Migration Signals
              {dashFetching ? <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" /> : dashLive ? <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> : null}
            </h3>
            <div className="flex flex-col gap-5">
              {migrationSignals.map((sig, i) => (
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

          <div className="bg-[#111113] border border-white/10 rounded-2xl p-6 flex flex-col">
            <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider font-mono flex items-center gap-2">
              Recent Funding Signals
              {dashFetching ? <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" /> : dashLive ? <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> : null}
            </h3>
            <div className="flex flex-col gap-5">
              {fundingSignals.map((sig, i) => (
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
