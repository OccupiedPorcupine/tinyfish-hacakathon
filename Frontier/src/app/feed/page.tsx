'use client';

import React, { useState, useMemo, useEffect } from 'react';

// Type definitions
type SignalType = 'opening-window' | 'pattern-transfer' | 'saturation-alert' | 'regulation' | 'funding-spike' | 'hiring-growth';
type ConfidenceLevel = 'low' | 'medium' | 'medium-high' | 'high';

interface ApiSignal {
  id: number;
  type: 'funding' | 'regulation' | 'hiring' | 'trend';
  market: string;
  text: string;
  source: string;
  date: string;
}

function apiSignalToCard(s: ApiSignal): SignalCard {
  const typeMap: Record<string, SignalType> = {
    funding: 'funding-spike',
    regulation: 'regulation',
    hiring: 'hiring-growth',
    trend: 'opening-window',
  };
  return {
    id: `live-${s.id}`,
    category: s.text.length > 40 ? s.text.slice(0, 37) + '…' : s.text,
    sourceMarket: 'Global',
    targetMarket: s.market,
    signalType: typeMap[s.type] ?? 'opening-window',
    confidence: 'medium',
    momentum: ((s.id * 7) % 20) + 5,
    summary: s.text,
    whyNow: s.text,
    evidence: [s.type.charAt(0).toUpperCase() + s.type.slice(1)],
    timestamp: s.date,
    sourceValidation: [s.source],
    targetReadiness: [],
  };
}

interface SignalCard {
  id: string;
  category: string;
  sourceMarket: string;
  targetMarket: string;
  signalType: SignalType;
  confidence: ConfidenceLevel;
  momentum: number;
  summary: string;
  whyNow: string;
  evidence: string[];
  timestamp: string;
  sourceValidation: string[];
  targetReadiness: string[];
}

// Mock signal data
const FEATURED_SIGNALS: SignalCard[] = [
  {
    id: 'f1',
    category: 'AI Sales Agents',
    sourceMarket: 'US',
    targetMarket: 'Indonesia',
    signalType: 'opening-window',
    confidence: 'high',
    momentum: 14,
    summary: 'B2B SMB buying power + AI LLM API adoption inflecting',
    whyNow: 'Indonesian SMBs reached Rp 500M ARR threshold. OpenAI API coverage expanded. Local payment rails mature. Sales teams actively hiring.',
    evidence: ['Funding spike', 'Hiring growth', 'Local launch detected', 'Regulation tailwind'],
    timestamp: '2 hours ago',
    sourceValidation: ['$8.2B TAM in US', '40+ funded companies', 'Apollo, Outreach', 'Hunter, Lemlist'],
    targetReadiness: ['SMB sophistication rising', 'English-speaking teams', 'API adoption 38%', 'Gojek GTM blueprint exists'],
  },
  {
    id: 'f2',
    category: 'Embedded Finance',
    sourceMarket: 'Singapore',
    targetMarket: 'Vietnam',
    signalType: 'pattern-transfer',
    confidence: 'medium-high',
    momentum: 18,
    summary: 'Regional banking APIs + SMB underbanking = ripe validation market',
    whyNow: 'Viettel, Saigon Commercial Bank opened APIs Q3 2025. 85% SMBs unbanked. Tiki, Shopee processing $40B GMV. Local fintech teams building.',
    evidence: ['Regulation tailwind', 'Local launch detected', 'Weak local equivalent'],
    timestamp: '4 hours ago',
    sourceValidation: ['Stripe integration', 'Wise adoption 2.5M users', 'Bambi expanding', 'Wise Vietnam revenue +280%'],
    targetReadiness: ['Banking APIs live', 'No pure-play competitor', 'GMV processing layer exists', 'Regulatory clarity Q1 2026'],
  },
  {
    id: 'f3',
    category: 'Creator Monetization Tools',
    sourceMarket: 'US',
    targetMarket: 'Singapore',
    signalType: 'saturation-alert',
    confidence: 'high',
    momentum: -22,
    summary: 'Market consolidating fast. Founder entry window closing.',
    whyNow: 'Patreon, Gumroad, Substack all launched SG ops last 12 months. Tier, Ben, Podia building local teams. Category leader funding rounds completed.',
    evidence: ['Category leader expansion', 'Rising competition'],
    timestamp: '6 hours ago',
    sourceValidation: ['41 competitors in US market', '3+ category leaders', 'Founder funding complete'],
    targetReadiness: ['Market saturation 65%', '3 leaders fighting for share', 'CAC rising 23% YoY', 'Unit economics pressured'],
  },
];

const LIVE_SIGNALS: SignalCard[] = [
  {
    id: 's1',
    category: 'Quick Commerce Enablement',
    sourceMarket: 'Dubai',
    targetMarket: 'Malaysia',
    signalType: 'opening-window',
    confidence: 'medium-high',
    momentum: 12,
    summary: 'GCash-like infrastructure reaching parity. Local retailer networks consolidating.',
    whyNow: 'Grab expanded fulfillment network. Fintech APIs opened. Retailer SOP standardizing. Tech talent available.',
    evidence: ['Local launch detected', 'Hiring growth', 'Funding spike'],
    timestamp: '1 hour ago',
    sourceValidation: ['Noon GMV $2.8B', 'Delivery layer proven', '120+ merchants onboarded'],
    targetReadiness: ['Grab infrastructure ready', '40% tech adoption', 'Unmet retailer demand high'],
  },
  {
    id: 's2',
    category: 'B2B Logistics SaaS',
    sourceMarket: 'Thailand',
    targetMarket: 'Philippines',
    signalType: 'pattern-transfer',
    confidence: 'medium',
    momentum: 8,
    summary: 'Supply chain digitization accelerating post-COVID. Carrier networks stable.',
    whyNow: 'Pilot programs successful in 3 major ports. Local operators interviewed. Tech stack validated.',
    evidence: ['Weak local equivalent', 'Regulation tailwind'],
    timestamp: '3 hours ago',
    sourceValidation: ['100 Thai customers', 'MOL integration proven', 'ARR $1.2M'],
    targetReadiness: ['Port digitization mandate', 'Carrier adoption growing', 'No native competitor'],
  },
  {
    id: 's3',
    category: 'HealthTech Workflow SaaS',
    sourceMarket: 'India',
    targetMarket: 'Bangladesh',
    signalType: 'opening-window',
    confidence: 'medium-high',
    momentum: 15,
    summary: 'Digital health adoption policy + tier-2 clinic expansion = market inflection',
    whyNow: 'GoI National Digital Health Mission expanded. Class-C cities clinic expansion 40% YoY. Mobile payment adoption 42%.',
    evidence: ['Regulation tailwind', 'Hiring growth', 'Funding spike'],
    timestamp: '5 hours ago',
    sourceValidation: ['2500+ Indian clinics', 'NPS 42', 'Retention 85%'],
    targetReadiness: ['Digital health policy live', 'Clinic expansion accelerating', 'Payment rails mature'],
  },
  {
    id: 's4',
    category: 'Embedded Finance',
    sourceMarket: 'Indonesia',
    targetMarket: 'Thailand',
    signalType: 'pattern-transfer',
    confidence: 'medium',
    momentum: 11,
    summary: 'Banking API maturity + SMB debt underutilization = supply match demand',
    whyNow: 'Bank of Thailand opened Fintech Regulatory Sandbox. Local SMB survey shows 78% want accessible debt.',
    evidence: ['Local launch detected', 'Regulation tailwind'],
    timestamp: '7 hours ago',
    sourceValidation: ['8M+ SMBs served', 'Defer platform $400M AUM', 'Customer CAC $8'],
    targetReadiness: ['Regulatory clarity achieved', 'SMB demand validated', 'API ecosystem ready'],
  },
  {
    id: 's5',
    category: 'AI Sales Coaching',
    sourceMarket: 'US',
    targetMarket: 'Singapore',
    signalType: 'saturation-alert',
    confidence: 'medium-high',
    momentum: -18,
    summary: 'Consolidation thesis confirmed. Market narrowing to 3-4 players.',
    whyNow: 'Revenue.io, Chorus, Gong all launched SG offices. Customer acquisition slowing 45% QoQ.',
    evidence: ['Category leader expansion', 'Rising competition'],
    timestamp: '8 hours ago',
    sourceValidation: ['35 competitors in US', '4 funded category leaders', 'Average CAC $45k'],
    targetReadiness: ['Market share concentrated', 'Leader CAC economics weak', 'Limited TAM expansion'],
  },
  {
    id: 's6',
    category: 'Supply Chain Finance',
    sourceMarket: 'Vietnam',
    targetMarket: 'Cambodia',
    signalType: 'opening-window',
    confidence: 'low',
    momentum: 5,
    summary: 'Nascent but watching. Supply chain digitization beginning.',
    whyNow: 'ASEAN integration deepening. 3PL networks forming. Financial infrastructure gaps identified.',
    evidence: ['Local launch detected'],
    timestamp: '10 hours ago',
    sourceValidation: ['Early-stage Vietnamese company', 'Pilot phase', 'Initial validation'],
    targetReadiness: ['Supply chain nascent', 'Finance infrastructure limited', 'Greenfield opportunity'],
  },
  {
    id: 's7',
    category: 'Vertical SaaS - Restaurants',
    sourceMarket: 'US',
    targetMarket: 'Indonesia',
    signalType: 'pattern-transfer',
    confidence: 'high',
    momentum: 21,
    summary: 'Toast, Square kitchens + QSR explosion in SEA = strongest signal this week',
    whyNow: 'Grab Food merchant base 280K+. Average ticket rising. Team availability. Capital flowing.',
    evidence: ['Funding spike', 'Hiring growth', 'Local launch detected', 'Weak local equivalent'],
    timestamp: '9 hours ago',
    sourceValidation: ['Toast $7B valuation', '12K customers', 'Grab kitchen integration proven'],
    targetReadiness: ['QSR expansion 35% YoY', 'Merchant SOP standardized', 'No quality local competitor'],
  },
];

const CATEGORIES = ['AI Sales Agents', 'Embedded Finance', 'B2B Logistics SaaS', 'HealthTech Workflow SaaS', 'Creator Monetization Tools', 'Quick Commerce Enablement', 'Supply Chain Finance', 'Vertical SaaS - Restaurants'];
const SOURCE_MARKETS = ['US', 'EU', 'India', 'Singapore', 'Indonesia', 'Thailand', 'Vietnam', 'Dubai'];
const TARGET_MARKETS = ['Indonesia', 'Vietnam', 'Thailand', 'Philippines', 'Singapore', 'Malaysia', 'Bangladesh', 'Cambodia'];

export default function SignalFeedPage() {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSourceMarket, setSelectedSourceMarket] = useState<string | null>(null);
  const [selectedTargetMarket, setSelectedTargetMarket] = useState<string | null>(null);
  const [confidenceFilter, setConfidenceFilter] = useState<ConfidenceLevel | null>(null);
  const [timeWindow, setTimeWindow] = useState<'24h' | '7d' | '30d'>('7d');
  const [savedWatches, setSavedWatches] = useState<string[]>([]);
  const [followedMarkets, setFollowedMarkets] = useState<string[]>(['Indonesia', 'Vietnam', 'Singapore']);
  const [liveSignals, setLiveSignals] = useState<SignalCard[]>([]);
  const [liveFetching, setLiveFetching] = useState(true);

  useEffect(() => {
    fetch('/api/feed')
      .then(r => r.json())
      .then(data => {
        if (data.signals) {
          setLiveSignals((data.signals as ApiSignal[]).map(apiSignalToCard));
        }
      })
      .catch(() => {/* silently use mock data */})
      .finally(() => setLiveFetching(false));
  }, []);

  // Filter signals — live API data shown first, then static mock data
  const filteredSignals = useMemo(() => {
    const mockSignals = [...FEATURED_SIGNALS, ...LIVE_SIGNALS];
    let signals = liveSignals.length > 0 ? [...liveSignals, ...mockSignals] : mockSignals;

    if (activeTab === 'opening-window') signals = signals.filter(s => s.signalType === 'opening-window');
    else if (activeTab === 'pattern-transfer') signals = signals.filter(s => s.signalType === 'pattern-transfer');
    else if (activeTab === 'saturation-alert') signals = signals.filter(s => s.signalType === 'saturation-alert');
    else if (activeTab === 'regulation') signals = signals.filter(s => s.evidence.some(e => e.toLowerCase().includes('regulation')));
    else if (activeTab === 'funding-hiring') signals = signals.filter(s => s.evidence.some(e => ['Funding spike', 'Hiring growth', 'Funding', 'Hiring'].includes(e)));

    if (selectedCategory) signals = signals.filter(s => s.category === selectedCategory);
    if (selectedSourceMarket) signals = signals.filter(s => s.sourceMarket === selectedSourceMarket);
    if (selectedTargetMarket) signals = signals.filter(s => s.targetMarket === selectedTargetMarket);
    if (confidenceFilter) signals = signals.filter(s => s.confidence === confidenceFilter);

    return signals;
  }, [activeTab, selectedCategory, selectedSourceMarket, selectedTargetMarket, confidenceFilter, liveSignals]);

  const toggleSavedWatch = (id: string) => {
    setSavedWatches(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleFollowedMarket = (market: string) => {
    setFollowedMarkets(prev => prev.includes(market) ? prev.filter(x => x !== market) : [...prev, market]);
  };

  const getConfidenceColor = (confidence: ConfidenceLevel) => {
    const colors: Record<ConfidenceLevel, string> = {
      'low': 'text-yellow-400',
      'medium': 'text-blue-400',
      'medium-high': 'text-teal-400',
      'high': 'text-green-400',
    };
    return colors[confidence];
  };

  const getSignalTypeColor = (type: SignalType) => {
    const colors: Record<SignalType, string> = {
      'opening-window': 'bg-green-500/20 border-green-500/30 text-green-200',
      'pattern-transfer': 'bg-teal-500/20 border-teal-500/30 text-teal-200',
      'saturation-alert': 'bg-red-500/20 border-red-500/30 text-red-200',
      'regulation': 'bg-blue-500/20 border-blue-500/30 text-blue-200',
      'funding-spike': 'bg-purple-500/20 border-purple-500/30 text-purple-200',
      'hiring-growth': 'bg-orange-500/20 border-orange-500/30 text-orange-200',
    };
    return colors[type];
  };

  const getSignalTypeLabel = (type: SignalType) => {
    const labels: Record<SignalType, string> = {
      'opening-window': 'Opening Window',
      'pattern-transfer': 'Pattern Transfer',
      'saturation-alert': 'Saturation Alert',
      'regulation': 'Regulation',
      'funding-spike': 'Funding Spike',
      'hiring-growth': 'Hiring Growth',
    };
    return labels[type];
  };

  return (
    <div className="bg-[#0a0a0b] min-h-screen text-gray-100 font-sans pb-16 selection:bg-brand-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* HERO SECTION */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-5xl font-display font-bold text-white tracking-tight">Signal Feed</h1>
            {liveFetching ? (
              <span className="flex items-center gap-1.5 text-xs font-mono text-brand-400 bg-brand-500/10 border border-brand-500/20 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
                Fetching live signals…
              </span>
            ) : liveSignals.length > 0 ? (
              <span className="flex items-center gap-1.5 text-xs font-mono text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                {liveSignals.length} live signals
              </span>
            ) : null}
          </div>
          <p className="text-xl text-gray-400 max-w-3xl leading-relaxed">
            Track live signals showing which startup patterns are opening, transferring, or saturating across emerging markets. Not news. Pure pattern intelligence.
          </p>
        </section>

        {/* FILTER TABS */}
        <section className="mb-8 flex overflow-x-auto gap-2 pb-2">
          {[
            { id: 'all', label: 'All Signals' },
            { id: 'opening-window', label: 'Opening Windows' },
            { id: 'pattern-transfer', label: 'Pattern Transfer' },
            { id: 'saturation-alert', label: 'Saturation Alerts' },
            { id: 'regulation', label: 'Regulation' },
            { id: 'funding-hiring', label: 'Funding / Hiring' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-lg border font-medium text-sm whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-brand-500/15 border-brand-400/50 text-brand-300'
                  : 'bg-[#111113] border-white/5 text-gray-400 hover:border-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </section>

        {/* FEATURED SIGNALS ROW */}
        <section className="mb-12">
          <h2 className="text-sm font-mono uppercase tracking-widest text-gray-500 mb-4">
            {liveSignals.length > 0 ? 'Latest Live Signals' : "This Week's Strongest Signals"}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {(liveSignals.length > 0 ? liveSignals : FEATURED_SIGNALS).slice(0, 3).map(signal => (
              <div key={signal.id} className="bg-[#111113] border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="text-xs font-mono text-gray-500 mb-1">PATTERN</div>
                    <h3 className="text-lg font-semibold text-white">{signal.category}</h3>
                  </div>
                  <button
                    onClick={() => toggleSavedWatch(signal.id)}
                    className={`text-xl transition-colors ${
                      savedWatches.includes(signal.id) ? 'text-brand-400' : 'text-gray-600 hover:text-gray-400'
                    }`}
                  >
                    ★
                  </button>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm font-mono text-gray-400">{signal.sourceMarket}</span>
                  <span className="text-xs text-gray-600">→</span>
                  <span className="text-sm font-mono text-brand-300 font-bold">{signal.targetMarket}</span>
                </div>

                <div className="flex gap-2 mb-4">
                  <span className={`text-xs px-2 py-1 rounded border ${getSignalTypeColor(signal.signalType)}`}>
                    {getSignalTypeLabel(signal.signalType)}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded border border-white/10 font-mono ${getConfidenceColor(signal.confidence)}`}>
                    {signal.confidence}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="text-xs font-mono text-gray-500 mb-1">MOMENTUM</div>
                  <div className={`text-2xl font-mono font-bold ${signal.momentum > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {signal.momentum > 0 ? '+' : ''}{signal.momentum}%
                  </div>
                </div>

                <p className="text-sm text-gray-300 mb-4 leading-relaxed">{signal.whyNow}</p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {signal.evidence.map(e => (
                    <span key={e} className="text-[9px] px-2 py-0.5 bg-white/5 border border-white/10 rounded text-gray-400 font-mono">
                      {e}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                  <span className="text-xs text-gray-600 font-mono">{signal.timestamp}</span>
                  <button className="text-xs font-mono font-bold text-brand-400 hover:text-brand-300">View Pattern →</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* MAIN LAYOUT: FEED + SIDEBAR */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LIVE FEED (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-sm font-mono uppercase tracking-widest text-gray-500 mb-4">Live Intelligence Feed</h2>
            
            {filteredSignals.map(signal => (
              <div key={signal.id} className="bg-[#111113] border border-white/10 rounded-lg p-5 hover:border-white/20 transition-all hover:bg-[#161618]">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-white">{signal.category}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded border ${getSignalTypeColor(signal.signalType)}`}>
                        {getSignalTypeLabel(signal.signalType)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span className="font-mono">{signal.sourceMarket}</span>
                      <span className="text-xs text-gray-600">→</span>
                      <span className="font-mono font-bold text-teal-400">{signal.targetMarket}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleSavedWatch(signal.id)}
                    className={`text-lg transition-colors ${
                      savedWatches.includes(signal.id) ? 'text-brand-400' : 'text-gray-600 hover:text-gray-400'
                    }`}
                  >
                    ★
                  </button>
                </div>

                <p className="text-sm text-gray-300 mb-3 leading-relaxed">{signal.whyNow}</p>

                <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 font-mono">Confidence:</span>
                      <span className={`text-xs font-mono font-bold ${getConfidenceColor(signal.confidence)}`}>
                        {signal.confidence}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 font-mono">Momentum:</span>
                      <span className={`text-xs font-mono font-bold ${signal.momentum > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {signal.momentum > 0 ? '+' : ''}{signal.momentum}%
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 font-mono">{signal.timestamp}</span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {signal.evidence.map(e => (
                    <span key={e} className="text-[9px] px-2 py-1 bg-white/5 border border-white/10 rounded text-gray-400 font-mono">
                      {e}
                    </span>
                  ))}
                </div>

                <div className="text-xs text-gray-600 mb-3 pb-3 border-b border-white/5">
                  <div className="font-mono mb-1 text-gray-500">Source Validation:</div>
                  <div className="text-gray-500">{signal.sourceValidation.join(' • ')}</div>
                </div>

                <div className="text-xs text-gray-600 mb-3">
                  <div className="font-mono mb-1 text-gray-500">Target Readiness:</div>
                  <div className="text-gray-500">{signal.targetReadiness.join(' • ')}</div>
                </div>

                <button className="text-xs font-mono font-bold text-brand-400 hover:text-brand-300">
                  Explore Pattern →
                </button>
              </div>
            ))}

            {filteredSignals.length === 0 && (
              <div className="bg-[#111113] border border-white/10 rounded-lg p-12 text-center">
                <p className="text-gray-400">No signals match your filters. Try adjusting your selections.</p>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR: FILTERS + WIDGETS (1 col) */}
          <div className="space-y-6">
            
            {/* TIME WINDOW */}
            <div className="bg-[#111113] border border-white/10 rounded-lg p-4">
              <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">Time Window</div>
              <div className="flex gap-2">
                {(['24h', '7d', '30d'] as const).map(window => (
                  <button
                    key={window}
                    onClick={() => setTimeWindow(window)}
                    className={`flex-1 px-3 py-2 rounded border text-xs font-mono transition-all ${
                      timeWindow === window
                        ? 'bg-brand-500/15 border-brand-400/50 text-brand-300'
                        : 'bg-[#0a0a0b] border-white/5 text-gray-400 hover:border-white/10'
                    }`}
                  >
                    {window}
                  </button>
                ))}
              </div>
            </div>

            {/* CATEGORY FILTER */}
            <div className="bg-[#111113] border border-white/10 rounded-lg p-4 max-h-64 overflow-y-auto">
              <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">Categories</div>
              <div className="space-y-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                    className={`w-full text-left text-xs px-3 py-2 rounded border transition-all ${
                      selectedCategory === cat
                        ? 'bg-brand-500/15 border-brand-400/50 text-brand-300'
                        : 'bg-[#0a0a0b] border-white/5 text-gray-400 hover:border-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* SOURCE MARKET FILTER */}
            <div className="bg-[#111113] border border-white/10 rounded-lg p-4">
              <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">Source Markets</div>
              <div className="space-y-2">
                {SOURCE_MARKETS.map(market => (
                  <button
                    key={market}
                    onClick={() => setSelectedSourceMarket(selectedSourceMarket === market ? null : market)}
                    className={`w-full text-left text-xs px-3 py-2 rounded border transition-all ${
                      selectedSourceMarket === market
                        ? 'bg-teal-500/15 border-teal-400/50 text-teal-300'
                        : 'bg-[#0a0a0b] border-white/5 text-gray-400 hover:border-white/10'
                    }`}
                  >
                    {market}
                  </button>
                ))}
              </div>
            </div>

            {/* TARGET MARKET FILTER */}
            <div className="bg-[#111113] border border-white/10 rounded-lg p-4 max-h-64 overflow-y-auto">
              <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">Target Markets</div>
              <div className="space-y-2">
                {TARGET_MARKETS.map(market => (
                  <button
                    key={market}
                    onClick={() => setSelectedTargetMarket(selectedTargetMarket === market ? null : market)}
                    className={`w-full text-left text-xs px-3 py-2 rounded border transition-all ${
                      selectedTargetMarket === market
                        ? 'bg-brand-500/15 border-brand-400/50 text-brand-300'
                        : 'bg-[#0a0a0b] border-white/5 text-gray-400 hover:border-white/10'
                    }`}
                  >
                    {market}
                  </button>
                ))}
              </div>
            </div>

            {/* CONFIDENCE FILTER */}
            <div className="bg-[#111113] border border-white/10 rounded-lg p-4">
              <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">Confidence</div>
              <div className="space-y-2">
                {(['high', 'medium-high', 'medium', 'low'] as const).map(level => (
                  <button
                    key={level}
                    onClick={() => setConfidenceFilter(confidenceFilter === level ? null : level)}
                    className={`w-full text-left text-xs px-3 py-2 rounded border transition-all ${
                      confidenceFilter === level
                        ? 'bg-brand-500/15 border-brand-400/50 text-brand-300'
                        : 'bg-[#0a0a0b] border-white/5 text-gray-400 hover:border-white/10'
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* SAVED WATCHES */}
            <div className="bg-[#111113] border border-white/10 rounded-lg p-4">
              <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">Saved Watches</div>
              <div className="text-xs text-gray-400">
                {savedWatches.length === 0 ? (
                  <span>Star signals to save them</span>
                ) : (
                  <div className="space-y-1.5">
                    {FEATURED_SIGNALS.filter(s => savedWatches.includes(s.id)).map(s => (
                      <div key={s.id} className="flex items-center justify-between p-2 bg-[#0a0a0b] rounded border border-white/5">
                        <div>
                          <div className="font-medium text-white text-xs">{s.category}</div>
                          <div className="text-gray-600">{s.sourceMarket} → {s.targetMarket}</div>
                        </div>
                        <button
                          onClick={() => toggleSavedWatch(s.id)}
                          className="text-yellow-400 hover:text-yellow-300"
                        >
                          ★
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* FOLLOWED MARKETS */}
            <div className="bg-[#111113] border border-white/10 rounded-lg p-4">
              <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-3">Followed Markets</div>
              <div className="flex flex-wrap gap-2">
                {TARGET_MARKETS.map(market => (
                  <button
                    key={market}
                    onClick={() => toggleFollowedMarket(market)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                      followedMarkets.includes(market)
                        ? 'bg-brand-500/20 border-brand-400/50 text-brand-200'
                        : 'bg-[#0a0a0b] border-white/5 text-gray-500 hover:border-white/10'
                    }`}
                  >
                    {market}
                  </button>
                ))}
              </div>
            </div>

            {/* INTELLIGENCE WIDGETS */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-green-500/10 to-teal-500/5 border border-green-500/20 rounded-lg p-4">
                <div className="text-xs font-mono uppercase tracking-widest text-green-400 mb-2">Top Emerging Transfers</div>
                <div className="space-y-2 text-xs">
                  <div><strong className="text-white">Vertical SaaS - Restaurants</strong><br /> US → Indonesia (+21%)</div>
                  <div><strong className="text-white">Embedded Finance</strong><br /> Singapore → Vietnam (+18%)</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-500/10 to-orange-500/5 border border-red-500/20 rounded-lg p-4">
                <div className="text-xs font-mono uppercase tracking-widest text-red-400 mb-2">Fastest Saturating Markets</div>
                <div className="space-y-2 text-xs">
                  <div><strong className="text-white">Creator Tools</strong><br /> Singapore (-22%)</div>
                  <div><strong className="text-white">AI Sales Coaching</strong><br /> Singapore (-18%)</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/5 border border-blue-500/20 rounded-lg p-4">
                <div className="text-xs font-mono uppercase tracking-widest text-blue-400 mb-2">Readiness Shifts</div>
                <div className="text-xs text-gray-400">
                  <div>Vietnam reached Fintech API readiness threshold this month.</div>
                  <div className="mt-2">Indonesia SMB sophistication reached inflection point Q4 2025.</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/5 border border-yellow-500/20 rounded-lg p-4">
                <div className="text-xs font-mono uppercase tracking-widest text-yellow-400 mb-2">Regulation Watch</div>
                <div className="text-xs text-gray-400">
                  <div>🔔 Thailand Opens Fintech Regulatory Sandbox</div>
                  <div className="mt-2">🔔 Vietnam Digital Health Policy Expanded</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
