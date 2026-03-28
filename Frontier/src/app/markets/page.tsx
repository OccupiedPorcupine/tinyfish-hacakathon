'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface MigrationVector {
  source: string;
  target: string;
  weight: number;
  category: string;
}

// Opportunity Sources
type OpportunitySource = 
  | 'Transfer Gap' 
  | 'Demand-Led Gap' 
  | 'Funding-Led Category Formation' 
  | 'Tailwind / Inflection' 
  | 'Hidden Local Pain';

interface ValidationSnapshot {
  painEvidenceCount: number;
  communitiesIdentified: number;
  wtpSignalsFound: number;
  validationConfidence: number;
  suggestedWedge: string;
}

interface Opportunity {
  id: string;
  category: string;
  targetMarket: string;
  opportunityScore: number;
  urgency: 'High' | 'Medium' | 'Low';
  confidence: 'High' | 'Medium-High' | 'Medium' | 'Low';
  window: string;
  opportunityType: OpportunitySource;
  whySurfaced: string;
  description: string;
  contributingSignals: string[];
  supportingEvidence: string[];
  anglophoneGap: string;
  sourceMarketInspiration?: {
    market: string;
    description: string;
  };
  suggestedWedge: string;
  scoreBreakdown: {
    sourceMarketProof: number;
    targetMarketGap: number;
    whyNow: number;
    entryFeasibility: number;
  };
  validation: ValidationSnapshot;
  
  // New fields for reference design
  globalFunding: string;
  fundingDeals: string;
  seaCompetitors: string;
  competitorStatus: string;
  communitySize: string;
  communityPlatforms: string;
  timelineWindow: string;
  avgScore?: number;
}

const OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-1',
    category: 'AI Sales Automation',
    targetMarket: 'Indonesia',
    opportunityScore: 92,
    urgency: 'High',
    confidence: 'High',
    window: '12-18 months',
    opportunityType: 'Transfer Gap',
    whySurfaced: 'Proven in US/India, zero localized solutions in Indonesia',
    description: 'B2B sales teams in Indonesia spend 4-6 hours daily on manual outreach. US AI SDR tools ignore local context, payment methods, and buyer culture.',
    contributingSignals: [
      'LinkedIn hiring surge for sales ops in Indonesia (Q4 2025)',
      'Reddit discussions: manual outreach is "biggest time killer"',
      '$200+/mo willingness to pay for local solution',
      'Zero competitors offering localized support'
    ],
    supportingEvidence: [
      'Similar model generated $500M ARR in US (Apollo, Outreach)',
      'India clones reached $50M+ within 3 years',
      'Indonesia has 15K+ B2B sales teams (LinkedIn data)',
      'Average contract value 30% higher than India'
    ],
    anglophoneGap: 'Three Indonesian B2B sales communities on Facebook (totalling ~80K members) actively complaining about manual outreach — no English-language coverage of this demand exists. Bahasa-language job boards show 3x spike in "sales ops" hiring in Jakarta Q1 2026.',
    sourceMarketInspiration: {
      market: 'United States (2018-2020)',
      description: 'Apollo raised $100M at $5B valuation. Later cloned successfully in India and Brazil.'
    },
    suggestedWedge: 'Start with Tier-1 cities (Jakarta, Surabaya). Land 5-10 SMB sales teams. Charge 30% premium for local support. Build out payment integration (local methods). Expand geographically once Indonesia is validated.',
    scoreBreakdown: {
      sourceMarketProof: 95,
      targetMarketGap: 94,
      whyNow: 88,
      entryFeasibility: 85
    },
    validation: {
      painEvidenceCount: 12,
      communitiesIdentified: 5,
      wtpSignalsFound: 4,
      validationConfidence: 88,
      suggestedWedge: 'Post validation questions in r/indonesia_entrepreneurs and Komunitas Sales Indonesia'
    },
    globalFunding: '$420M',
    fundingDeals: '18 deals, 2024-25',
    seaCompetitors: '0',
    competitorStatus: 'direct, 2 adjacent',
    communitySize: '240K',
    communityPlatforms: 'across 4 platforms',
    timelineWindow: '3-6mo',
    avgScore: 88
  },
  {
    id: 'opp-2',
    category: 'Embedded Finance',
    targetMarket: 'Vietnam',
    opportunityScore: 87,
    urgency: 'High',
    confidence: 'Medium-High',
    window: '18-24 months',
    opportunityType: 'Demand-Led Gap',
    whySurfaced: 'Rapid SME growth + limited working capital access',
    description: 'Vietnamese SMEs lack access to supply chain financing. Existing tools are India-first, don\'t support local bank APIs, and require complex KYC.',
    contributingSignals: [
      'SME loan applications up 200% YoY (Vietnam State Bank)',
      'Finance Ministry announced regulatory sandbox for fintech',
      'Early clones from India gaining traction but failing on compliance',
      'Average enterprise willingness to pay: $500/month'
    ],
    supportingEvidence: [
      'Brazil saw $2B+ embedded finance market in 2 years',
      'Vietnam SME population grew 15% YoY to 850K+ entities',
      'Central bank opened open banking APIs (Dec 2025)',
      'Competitor density still very low'
    ],
    anglophoneGap: 'Product documentation in English. Integration guides assume Indian banking system. KYC workflows don\'t map to Vietnam regulatory requirements.',
    sourceMarketInspiration: {
      market: 'Brazil (2020-2023)',
      description: 'Payflow and others generated $500M+ ARR by focusing on SME supply chain financing.'
    },
    suggestedWedge: 'Partner with government SMEB program. Integrate with top 3 Vietnamese banks. Start with accounts payable financing. Win 20 pilot customers in first 6 months.',
    scoreBreakdown: {
      sourceMarketProof: 88,
      targetMarketGap: 92,
      whyNow: 85,
      entryFeasibility: 78
    },
    validation: {
      painEvidenceCount: 8,
      communitiesIdentified: 4,
      wtpSignalsFound: 3,
      validationConfidence: 82,
      suggestedWedge: 'Validate with B2B chambers of commerce and local accountant networks'
    },
    globalFunding: '$1.2B',
    fundingDeals: '32 deals, 2024-25',
    seaCompetitors: '2',
    competitorStatus: 'early stage, underfunded',
    communitySize: '180K',
    communityPlatforms: 'across 2 platforms',
    timelineWindow: '6-12mo',
    avgScore: 86
  },
  {
    id: 'opp-3',
    category: 'Vertical Clinic SaaS',
    targetMarket: 'Philippines',
    opportunityScore: 79,
    urgency: 'Medium',
    confidence: 'Medium-High',
    window: '18-30 months',
    opportunityType: 'Hidden Local Pain',
    whySurfaced: 'Strong healthcare infrastructure gap + high willingness to pay',
    description: 'Philippine healthcare clinics rely on WhatsApp + Excel for patient records and scheduling. Existing solutions require expensive IT infrastructure or are built for tier-1 metros only.',
    contributingSignals: [
      'Philippine Medical Association survey: 60% still use paper records',
      'Private clinics seeing 3x patient volume growth (post-COVID)',
      'No local solution for multi-branch clinic chains',
      'Willingness to pay: $300-600/month per clinic'
    ],
    supportingEvidence: [
      'Similar solution in India (mFine, Vezeeta) reached $100M+ ARR',
      'Philippines has 25K+ private clinics (DOH data)',
      'Regulatory framework supports digital health (DOH 2024 guidelines)',
      'Internet penetration 73% and rising'
    ],
    anglophoneGap: 'English UI assumes familiarity with cloud concepts. Doesn\'t support Filipino regulations (DOH compliance). No support for local payment methods or telemed workflows.',
    suggestedWedge: 'Begin with Metro Manila private clinics. Offer free trial + hands-on setup. Build Filipino language UI. Integrate SMS appointment reminders (critical for low-broadband patients). Win LOI from 10 clinics before building.',
    scoreBreakdown: {
      sourceMarketProof: 82,
      targetMarketGap: 85,
      whyNow: 76,
      entryFeasibility: 82
    },
    validation: {
      painEvidenceCount: 6,
      communitiesIdentified: 3,
      wtpSignalsFound: 2,
      validationConfidence: 75,
      suggestedWedge: 'Reach out directly to clinic managers and medical associations'
    },
    globalFunding: '$850M',
    fundingDeals: '24 deals, 2024-25',
    seaCompetitors: '1',
    competitorStatus: 'nascent, unfocused',
    communitySize: '120K',
    communityPlatforms: 'across 3 platforms',
    timelineWindow: '18mo',
    avgScore: 81
  },
  {
    id: 'opp-4',
    category: 'B2B Logistics Workflow',
    targetMarket: 'Thailand',
    opportunityScore: 84,
    urgency: 'High',
    confidence: 'High',
    window: '12-20 months',
    opportunityType: 'Tailwind / Inflection',
    whySurfaced: 'Cross-border commerce growing 45% YoY + zero localized logistics tools',
    description: 'Thai logistics operators manage routes, carrier networks, and customs using Google Maps + email. No single platform supports local carrier APIs or customs workflows.',
    contributingSignals: [
      'Cross-border shipments through Thailand +45% YoY (Thai Customs)',
      'E-commerce marketplaces offering logistics as differentiator',
      'Early interest from 3PL operators in WTA/WTB partnerships',
      'Average willingness to pay: $600-1000/month per operator'
    ],
    supportingEvidence: [
      'Similar solution in Indonesia (Wahana) reached $50M ARR',
      'Thailand logistics market valued at $5B+ (JLL 2025)',
      'Government promoting digital supply chain (BOI incentives)',
      'Top 50 3PLs control 60% of market (consolidation play)'
    ],
    anglophoneGap: 'Tools assume international shipping workflows. Miss local carrier networks (DHL/Flash/Kerry locals). No support for Thailand-specific customs documentation or regulations.',
    sourceMarketInspiration: {
      market: 'Indonesia (2018-2022)',
      description: 'Wahana solved local logistics fragmentation, reached $50M ARR in 3 years.'
    },
    suggestedWedge: 'Start with e-commerce logistics (fastest growth segment). Partner with top 3 marketplaces. Build carrier integrations incrementally. Win 30 operators in first year.',
    scoreBreakdown: {
      sourceMarketProof: 90,
      targetMarketGap: 89,
      whyNow: 91,
      entryFeasibility: 79
    },
    validation: {
      painEvidenceCount: 10,
      communitiesIdentified: 4,
      wtpSignalsFound: 4,
      validationConfidence: 85,
      suggestedWedge: 'Survey logistics operators directly. Host roundtables with e-commerce platforms.'
    },
    globalFunding: '$680M',
    fundingDeals: '23 deals, 2024-25',
    seaCompetitors: '1',
    competitorStatus: 'underfunded, poor UX',
    communitySize: '165K',
    communityPlatforms: 'across 3 platforms',
    timelineWindow: '12-18mo',
    avgScore: 85
  },
  {
    id: 'opp-5',
    category: 'Creator Commerce Ops',
    targetMarket: 'Indonesia',
    opportunityScore: 76,
    urgency: 'Medium',
    confidence: 'Medium',
    window: '24-36 months',
    opportunityType: 'Funding-Led Category Formation',
    whySurfaced: 'Creator economy rapidly growing but fragmented tooling + fresh VC funding',
    description: 'Indonesian TikTok/Instagram creators (100K+ followers) manage fan communities, orders, and payments across 5+ platforms with no unified dashboard.',
    contributingSignals: [
      'Creator monetization market growing 60% YoY in SEA',
      'Recent $500M venture funding wave into creator tools',
      'Reddit/Twitter: creators frustrated with tool fragmentation',
      'Early signals: $100-300/month willingness to pay'
    ],
    supportingEvidence: [
      'BeReal, Beam, other creator tools saw $100M+ valuations',
      'Indonesia has 50M+ active social creators (think tank data)',
      'TikTok Shop now live in Indonesia (new monetization pressure)',
      'Creator spending on tools still very low vs US (upside play)'
    ],
    anglophoneGap: 'Existing tools optimize for YouTube revenue. Miss TikTok Shop, WhatsApp commerce, and fan community dynamics. No Indonesian payment integrations.',
    suggestedWedge: 'Start with micro-creators (10K-100K followers). Offer Tiktok Shop integration as hook. Build fan membership management. Charge per-creator, not per-shop.',
    scoreBreakdown: {
      sourceMarketProof: 74,
      targetMarketGap: 78,
      whyNow: 75,
      entryFeasibility: 72
    },
    validation: {
      painEvidenceCount: 5,
      communitiesIdentified: 3,
      wtpSignalsFound: 2,
      validationConfidence: 68,
      suggestedWedge: 'Engage directly with creator communities and TikTok/Instagram groups'
    },
    globalFunding: '$520M',
    fundingDeals: '19 deals, 2024-25',
    seaCompetitors: '2',
    competitorStatus: 'early stage, US-focused',
    communitySize: '310K',
    communityPlatforms: 'across 5 platforms',
    timelineWindow: '24-36mo',
    avgScore: 75
  },
  {
    id: 'opp-6',
    category: 'KYC / Compliance API',
    targetMarket: 'Singapore',
    opportunityScore: 81,
    urgency: 'High',
    confidence: 'High',
    window: '12-18 months',
    opportunityType: 'Transfer Gap',
    whySurfaced: 'MAS fintech regulations + existing solutions underserve API model',
    description: 'Singapore fintechs and neobanks need real-time KYC/AML compliance but existing solutions are slow, expensive, and US-first. MAS regulatory sandbox creating urgency.',
    contributingSignals: [
      'MAS announced new fintech licensing framework (Jan 2026)',
      'Singapore fintech funding up 30% YoY ($2.5B in 2025)',
      'Existing providers report 10+ day compliance timelines',
      'Enterprise willingness to pay: $5K-20K/month'
    ],
    supportingEvidence: [
      'Similar solutions in UK (Passfort, ComplyAdvantage) valued at $1B+',
      'Singapore fintech ecosystem growing rapidly (300+ companies)',
      'Regulatory clarity helps market maturation',
      'High-value enterprise segment (not SME-dependent)'
    ],
    anglophoneGap: 'US-based KYC tools miss Singapore data sources and regulatory nuances. No local ID verification. Compliance templates not tailored to MAS requirements.',
    sourceMarketInspiration: {
      market: 'United Kingdom (2015-2020)',
      description: 'Passfort and similar solutions reached $1B+ valuation by solving regulatory complexity for regulated fintech.'
    },
    suggestedWedge: 'Focus on neobanks and licensed money changers first. Offer MAS regulatory consultation. Build integrations with Singapore payment rails. Win 5-10 enterprise customers in year 1.',
    scoreBreakdown: {
      sourceMarketProof: 92,
      targetMarketGap: 88,
      whyNow: 90,
      entryFeasibility: 82
    },
    validation: {
      painEvidenceCount: 9,
      communitiesIdentified: 3,
      wtpSignalsFound: 3,
      validationConfidence: 87,
      suggestedWedge: 'Validate with Singapore fintech association and regulated enterprises'
    },
    globalFunding: '$750M',
    fundingDeals: '28 deals, 2024-25',
    seaCompetitors: '0',
    competitorStatus: 'direct, 1 adjacent',
    communitySize: '95K',
    communityPlatforms: 'across 2 platforms',
    timelineWindow: '12-18mo',
    avgScore: 87
  }
];

// Calculate category momentum and migration signals
function calculateCategoryMomentum() {
  return [
    { category: 'Embedded finance', market: 'Vietnam', momentum: 18.2, direction: 'up' },
    { category: 'B2B e-commerce', market: 'Indonesia', momentum: 12.4, direction: 'up' },
    { category: 'HealthTech', market: 'Vietnam', momentum: 8.9, direction: 'up' },
    { category: 'EdTech', market: 'Indonesia', momentum: -12.6, direction: 'down' }
  ];
}

function getMigrationSignals() {
  return [
    { opportunity: 'AI SDR tools', path: 'US → IN → ID', confidence: 'High confidence', window: '3-6mo window' },
    { opportunity: 'SME embedded finance', path: 'BR → VN', confidence: 'Moderate confidence', window: 'Inflecting now' },
    { opportunity: 'Vertical clinic SaaS', path: 'IN → PH', confidence: 'High confidence', window: 'Lagging 18mo behind' }
  ];
}

export default function MarketsPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | 'All'>('All');
  const [selectedMarket, setSelectedMarket] = useState<string | 'All'>('All');
  const [selectedTimeRange, setSelectedTimeRange] = useState<string | 'Last 30 days'>('Last 30 days');
  const [liveVectors, setLiveVectors] = useState<MigrationVector[] | null>(null);
  const [vectorsFetching, setVectorsFetching] = useState(true);

  useEffect(() => {
    // Load from sessionStorage immediately (instant on return visits)
    const cached = sessionStorage.getItem('frontier-markets');
    if (cached) {
      try {
        const data = JSON.parse(cached);
        if (data.vectors?.length) setLiveVectors(data.vectors);
        setVectorsFetching(false);
        return;
      } catch {}
    }

    fetch('/api/markets')
      .then(r => r.json())
      .then(data => {
        if (data.vectors?.length) {
          setLiveVectors(data.vectors);
          sessionStorage.setItem('frontier-markets', JSON.stringify(data));
        }
      })
      .catch(() => {/* silently use mock data */})
      .finally(() => setVectorsFetching(false));
  }, []);

  const filteredOpportunities = useMemo(() => {
    return OPPORTUNITIES.filter(opp => {
      if (selectedCategory !== 'All' && opp.category !== selectedCategory) return false;
      if (selectedMarket !== 'All' && opp.targetMarket !== selectedMarket) return false;
      return true;
    }).sort((a, b) => b.opportunityScore - a.opportunityScore);
  }, [selectedCategory, selectedMarket]);

  const categoryMomentum = calculateCategoryMomentum();

  const migrationSignals = liveVectors
    ? liveVectors.slice(0, 4).map(v => ({
        opportunity: v.category,
        path: `${v.source} → ${v.target}`,
        confidence: v.weight >= 80 ? 'High confidence' : v.weight >= 60 ? 'Moderate confidence' : 'Early signal',
        window: v.weight >= 80 ? 'Inflecting now' : v.weight >= 60 ? '6-12mo window' : '12-18mo window',
      }))
    : getMigrationSignals();

  return (
    <div className="min-h-screen bg-[#0a0a0b]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Top Filter Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <FilterSelect 
            label=""
            placeholder="All categories"
            options={['All', ...OPPORTUNITIES.map(o => o.category)]}
            value={selectedCategory}
            onChange={setSelectedCategory}
          />
          <FilterSelect 
            label=""
            placeholder="Last 30 days"
            options={['Last 30 days', 'Last 90 days', 'Last 6 months', 'All time']}
            value={selectedTimeRange}
            onChange={setSelectedTimeRange}
          />
          <FilterSelect 
            label=""
            placeholder="All SEA markets"
            options={['All', ...new Set(OPPORTUNITIES.map(o => o.targetMarket))]}
            value={selectedMarket}
            onChange={setSelectedMarket}
          />
        </div>

        {/* Scan Button (top right on mobile, could be absolute) */}
        <div className="flex justify-end mb-8">
          <button className="text-gray-400 border border-gray-600 hover:border-gray-400 px-6 py-2 rounded-lg text-sm transition-colors">
            Scan now ↗
          </button>
        </div>

        {/* Intelligence Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Fastest-Rising Categories */}
          <div className="bg-[#111113] border border-white/10 rounded-2xl p-6">
            <div className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-6">Fastest-Rising Categories</div>
            <div className="space-y-4">
              {categoryMomentum.map((cat, i) => (
                <div key={i} className="flex items-center justify-between pb-4 border-b border-white/5 last:border-0 last:pb-0">
                  <div>
                    <div className="font-semibold text-white">{cat.category}</div>
                    <div className="text-xs text-gray-500">{cat.market}</div>
                  </div>
                  <div className={`text-lg font-semibold ${cat.direction === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                    {cat.direction === 'up' ? '+' : ''}{cat.momentum}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pattern Migration Signals */}
          <div className="bg-[#111113] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="text-xs font-mono text-gray-400 uppercase tracking-widest">Pattern Migration Signals</div>
              {vectorsFetching ? (
                <span className="flex items-center gap-1 text-[10px] font-mono text-brand-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />live
                </span>
              ) : liveVectors ? (
                <span className="flex items-center gap-1 text-[10px] font-mono text-green-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />live
                </span>
              ) : null}
            </div>
            <div className="space-y-4">
              {migrationSignals.map((sig, i) => (
                <div key={i} className="pb-4 border-b border-white/5 last:border-0 last:pb-0">
                  <div className="font-semibold text-white mb-2">{sig.opportunity}</div>
                  <div className="flex items-center gap-2 mb-1 text-sm">
                    {sig.path.split(' → ').map((market, j) => (
                      <React.Fragment key={j}>
                        <span className={`px-2 py-1 rounded text-xs font-mono ${j === sig.path.split(' → ').length - 1 ? 'bg-teal-500/20 text-teal-300' : 'bg-gray-600/20 text-gray-300'}`}>
                          {market}
                        </span>
                        {j < sig.path.split(' → ').length - 1 && <span className="text-gray-600">→</span>}
                      </React.Fragment>
                    ))}
                  </div>
                  <div className="text-xs text-gray-300 italic">{sig.confidence} — {sig.window}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Opportunities Feed */}
        <div className="space-y-4">
          {filteredOpportunities.map(opp => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              isExpanded={expandedId === opp.id}
              onToggle={() => setExpandedId(expandedId === opp.id ? null : opp.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function FilterSelect({ label, placeholder, options, value, onChange }: { label?: string; placeholder?: string; options: string[]; value: string; onChange: (v: any) => void }) {
  return (
    <div>
      {label && <label className="text-[9px] uppercase tracking-widest text-gray-400 font-mono mb-1 block">{label}</label>}
      <select 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/5 border border-gray-600 hover:border-gray-400 px-4 py-2 rounded-lg text-sm text-white placeholder-gray-300 focus:border-gray-300 focus:outline-none appearance-none"
      >
        {options.map(opt => (
          <option key={opt} value={opt} className="bg-gray-900 text-white">{opt}</option>
        ))}
      </select>
    </div>
  );
}

function OpportunityCard({ opportunity, isExpanded, onToggle }: { opportunity: Opportunity; isExpanded: boolean; onToggle: () => void }) {
  const router = useRouter();
  const [generatingKit, setGeneratingKit] = useState(false);

  const generateValidationKit = async () => {
    setGeneratingKit(true);
    try {
      const painArea = opportunity.description.split('.')[0].toLowerCase();
      const request = {
        category: opportunity.category,
        market: opportunity.targetMarket,
        painArea: painArea,
        targetAudience: `${opportunity.category} operators in ${opportunity.targetMarket}`,
        scanResultId: opportunity.id
      };

      const response = await fetch('/api/validation-kit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });

      if (!response.ok) throw new Error('Failed to generate kit');
      router.push('/validation-kit?opp=' + opportunity.id);
    } catch (error) {
      console.error('Error generating kit:', error);
      alert('Failed to generate validation kit');
    } finally {
      setGeneratingKit(false);
    }
  };

  return (
    <div className="bg-[#111113] border border-white/10 rounded-2xl overflow-hidden transition-all">
      {/* Collapsed View */}
      <button
        onClick={onToggle}
        className="w-full text-left p-6 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="font-bold text-white">{opportunity.category}</div>
              <span className="text-xs text-gray-500">/</span>
              <span className="text-xs text-gray-400">{opportunity.opportunityType.split('/')[0]}</span>
            </div>
            <div className="text-sm text-gray-400">{opportunity.targetMarket}</div>
          </div>
          
          <div className="text-right">
            <div className={`text-xs font-semibold px-2.5 py-1 rounded mb-2 w-fit ml-auto ${
              opportunity.urgency === 'High' ? 'bg-red-500/20 text-red-300' :
              opportunity.urgency === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
              'bg-gray-500/20 text-gray-300'
            }`}>
              {opportunity.urgency} urgency
            </div>
          </div>
        </div>
      </button>

      {/* Expanded View */}
      {isExpanded && (
        <div className="border-t border-white/10 p-6 space-y-6 bg-black/20">
          
          {/* Top Metric Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricBox label="GLOBAL FUNDING" value={opportunity.globalFunding} subtext={opportunity.fundingDeals} />
            <MetricBox label="SEA COMPETITORS" value={opportunity.seaCompetitors} subtext={opportunity.competitorStatus} />
            <MetricBox label="COMMUNITY SIZE" value={opportunity.communitySize} subtext={opportunity.communityPlatforms} />
            <MetricBox label="WINDOW" value={opportunity.timelineWindow} subtext="before copycats arrive" />
          </div>

          {/* Score Boxes (6 metrics in 2 rows) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ScoreBox
              label="Funding velocity"
              score={9}
              context={opportunity.fundingDeals}
              color="green"
            />
            <ScoreBox
              label="Competitor gap"
              score={10}
              context="Zero direct SEA players found"
              color="green"
            />
            <ScoreBox
              label="Market size"
              score={7}
              context="$4.2B TAM globally, SEA est. $380M"
              color="amber"
            />
            <ScoreBox
              label="Search demand"
              score={7}
              context="+34% MoM in ID, mostly English queries"
              color="green"
            />
            <ScoreBox
              label="Community size"
              score={8}
              context={`r/sales ${opportunity.communitySize}, FB groups 80K ID members`}
              color="green"
            />
            <ScoreBox
              label="Local tailwinds"
              score={6}
              context="GoTo digitization push, no reg barrier"
              color="gray"
            />
          </div>

          {/* Anglophone Gap Callout */}
          <div className="border-l-4 border-teal-500 bg-teal-500/5 p-4">
            <div className="text-xs font-mono text-teal-400 uppercase tracking-widest mb-2">What Anglophone Search Misses</div>
            <p className="text-sm text-gray-300">{opportunity.anglophoneGap}</p>
          </div>

          {/* CTA Button */}
          <button 
            onClick={generateValidationKit}
            disabled={generatingKit}
            className="w-full bg-brand-600 hover:bg-brand-500 disabled:bg-gray-700 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
          >
            {generatingKit ? '⏳ Generating...' : '→ Generate Validation Kit'}
          </button>
        </div>
      )}
    </div>
  );
}

function MetricBox({ label, value, subtext }: { label: string; value: string; subtext: string }) {
  return (
    <div className="border border-white/5 rounded-lg p-3 bg-black/30">
      <div className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">{label}</div>
      <div className="text-xl font-mono font-bold text-white mb-1">{value}</div>
      <div className="text-xs text-gray-300">{subtext}</div>
    </div>
  );
}

function ScoreBox({ label, score, context, color }: { label: string; score: number; context: string; color: 'green' | 'amber' | 'gray' }) {
  const bgColor = color === 'green' ? 'bg-green-500/20' : color === 'amber' ? 'bg-yellow-500/20' : 'bg-gray-500/20';
  const barColor = color === 'green' ? 'bg-green-500' : color === 'amber' ? 'bg-yellow-500' : 'bg-gray-500';
  
  return (
    <div className={`${bgColor} border border-white/5 rounded-lg p-4`}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium text-white">{label}</div>
        <div className="text-lg font-mono font-bold text-white">{score}/10</div>
      </div>
      <div className="h-1 bg-black/30 rounded-full overflow-hidden mb-2">
        <div 
          className={`h-full ${barColor} transition-all`}
          style={{ width: `${(score / 10) * 100}%` }}
        />
      </div>
      <div className="text-xs text-gray-300">{context}</div>
    </div>
  );
}

function ScoreBar({ label, score, color }: { label: string; score: number; color: string }) {
  const colorClass = color === 'brand' ? 'bg-brand-500' : 
                     color === 'teal' ? 'bg-teal-500' :
                     color === 'green' ? 'bg-green-500' :
                     'bg-blue-500';

  return (
    <div className="bg-black/30 rounded-lg p-3 border border-white/5">
      <div className="text-xs text-gray-600 mb-2 font-mono">{label}</div>
      <div className="text-2xl font-mono font-bold text-white mb-2">{score}</div>
      <div className="h-1 bg-black/50 rounded-full overflow-hidden">
        <div 
          className={`h-full ${colorClass} transition-all`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

function ValidationMetric({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <div className="bg-black/30 rounded-lg p-3 border border-white/5">
      <div className="text-xs text-gray-600 font-mono uppercase mb-1">{label}</div>
      <div className="flex items-baseline gap-1">
        <div className="text-xl font-mono font-bold text-pink-400">{value}</div>
        <div className="text-xs text-gray-500">{unit}</div>
      </div>
    </div>
  );
}
