'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

// Enhanced founder profile with operational details
const FOUNDER_PROFILE = {
  background: ['Product Management', 'Partnerships'],
  strengths: ['GTM Strategy', 'Partnerships', 'Ecosystem Access'],
  preferredMarkets: ['SEA'],
  preferredModels: ['B2B SaaS', 'Platforms'],
  yearsExperience: 8,
  network: 'Strong US/India, emerging SEA',
  capital: { min: 500, max: 1000, label: '$500K-1M to deploy' },
  
  // New detailed profile fields
  teamComposition: '1 founder (you) - Product/GTM',
  buyerAccess: 'Direct SMB relationships in India; developing Indonesia',
  languageFamiliarity: 'English, conversational Hindi',
  regulatoryTolerance: 'Moderate - prefer B2B with light compliance',
  executionStyle: 'Partnership-first, lean validation',
  
  completionPercent: 72,
};

// Mock opportunities with fit scores and detailed reasoning
// Mock opportunities with comprehensive founder-market fit data
const FIT_OPPORTUNITIES = [
  {
    id: '1', 
    category: 'AI Sales Agents', 
    market: 'Indonesia',
    
    // Scores
    marketScore: 92, 
    founderFitScore: 88,
    fitConfidence: 'High',
    
    // Opportunity requirements
    requiredTechnicalDepth: 'Medium-High (LLM integration, API calls)',
    requiredDistributionMotion: 'Enterprise/Mid-market sales + partnerships',
    buyerType: 'SMB with technical teams',
    localizationBurden: 'Low (English-speaking teams)',
    regulatoryBurden: 'Low',
    capitalIntensity: 'Low-Medium ($100-250K runway)',
    salesCycle: 'Medium (30-60 days)',
    trustBarrier: 'Medium (AI adoption still early)',
    teamRequirement: 'Can start solo, need 1 engineer in 6mo',
    
    // Founder-opportunity fit
    reasons: ['strong GTM fit', 'SEA edge', 'low capital req'],
    risks: ['technical gap'],
    whyFits: 'Your GTM expertise + partnership skills directly align with needed distribution. SMB validation plays to your strengths. Team size fits capital.',
    whatYouBring: 'Prior experience launching B2B products to SMBs in India. Direct relationships with sales teams. Partnership-first mindset matches market needs.',
    whatItRequires: 'Technical cofounder or 1 ML engineer by month 2. Ability to handle complex LLM debugging. Comfort with API integrations.',
    whatMayHoldYouBack: 'Limited AI/ML domain expertise. Need to rely on cofounder for product architecture. Technical risk factors.',
    whatWouldHelp: 'Technical cofounder (adds +15 fit). Local GTM partner in Indonesia (adds +8 fit). Additional $200K capital (adds +5 fit).',
    comparisonTo2: 'Ranks #1 vs B2B Logistics (Thailand): stronger market opportunity (92 vs 79). Better capital efficiency. Execution motion matches your strengths.',
    
    whereWeak: { technical: 85, buyerAccess: 72, capital: 88, localAccess: 75 },
    improve: 'Partner with technical cofounder or hire 1 strong ML engineer',
    firstMove: 'Validate GTM approach with 3-5 SMB pilots in Jakarta. Interview enterprise sales ops to understand objection handling.',
    subScores: { 
      domainFamiliarity: 72, 
      executionFit: 88, 
      marketAccess: 92, 
      buyerAccess: 85,
      distributionEdge: 94, 
      buildCapacity: 65,
      capitalFit: 88, 
      preferenceAlignment: 85 
    }
  },
  {
    id: '2', 
    category: 'B2B Logistics SaaS', 
    market: 'Thailand',
    
    marketScore: 79, 
    founderFitScore: 82,
    fitConfidence: 'Medium-High',
    
    requiredTechnicalDepth: 'Medium (ERP integration, tracking systems)',
    requiredDistribututionMotion: 'Carrier outbound sales + logistics partnerships',
    buyerType: 'Logistics operators + 3PLs',
    localizationBurden: 'Medium (Carrier ops are regional)',
    regulatoryBurden: 'Low-Medium',
    capitalIntensity: 'Medium ($250-500K runway)',
    salesCycle: 'Long (60-90 days due to ops testing)',
    trustBarrier: 'High (operators risk-averse)',
    teamRequirement: 'Domain advisor critical. Engineer + sales person by month 1.',
    
    reasons: ['execution fit', 'good margins', 'SEA presence'],
    risks: ['domain knowledge gap'],
    whyFits: 'Your operations experience + partnership strategy work well. Regional network growing. B2B SaaS preference aligned.',
    whatYouBring: 'Operations background gives you credibility with logistics operators. Partnership-first approach matches carrier relationships. Know regional ops standards.',
    whatItRequires: 'Logistics domain expert to validate product roadmap. Ability to map operator pain points. Carrier relationship building over 3-6 months.',
    whatMayHoldYouBack: 'Limited domain expertise in logistics. Smaller market vs AI Sales. Longer sales cycle requires capital runway.',
    whatWouldHelp: 'Logistics advisor as cofounder (adds +18 fit). Additional capital $250K (adds +8 fit). Carrier relationship warm intro (adds +10 fit).',
    comparisonTo2: 'Solid #2 option: lower market ceiling than #1 but strong execution fit. Better margins once product scales. Carrier loyalty creates defensibility.',
    
    whereWeak: { technical: 70, buyerAccess: 58, capital: 75, localAccess: 68 },
    improve: 'Hire logistics domain advisor; validate with 8-10 operators first',
    firstMove: 'Map current logistics tech stack in Bangkok/Chiang Mai. Interview 5 operators. Validate ERP integration approach.',
    subScores: { 
      domainFamiliarity: 58, 
      executionFit: 85, 
      marketAccess: 78, 
      buyerAccess: 72,
      distributionEdge: 88, 
      buildCapacity: 72,
      capitalFit: 80, 
      preferenceAlignment: 82 
    }
  },
  {
    id: '3', 
    category: 'Embedded Finance', 
    market: 'Vietnam',
    
    marketScore: 88, 
    founderFitScore: 78,
    fitConfidence: 'Medium',
    
    requiredTechnicalDepth: 'High (Banking APIs, compliance systems)',
    requiredDistributionMotion: 'Bank + platform partnerships',
    buyerType: 'SMB merchants + platforms',
    localizationBurden: 'Medium-High (Regulatory compliance)',
    regulatoryBurden: 'High (Banking license + compliance)',
    capitalIntensity: 'Medium-High ($300-700K runway)',
    salesCycle: 'Long (90-120 days for bank approvals)',
    trustBarrier: 'High (Regulatory + financial risk)',
    teamRequirement: 'Compliance/banking expert essential. Finance engineer required.',
    
    reasons: ['strong market', 'SMB GTM fit', 'partnership model'],
    risks: ['regulatory complexity', 'fintech domain gap'],
    whyFits: 'Partnership-led model fits your approach. SMB GTM strength applies. Growing market with low incumbents.',
    whatYouBring: 'Partnership-first mindset. SMB distribution experience. Ability to navigate complex stakeholder relationships.',
    whatItRequires: 'Fintech regulatory expert (not optional). Banking integration engineer. Capital for longer sales cycle + compliance. Comfort with regulatory uncertainty.',
    whatMayHoldYouBack: 'Limited fintech domain expertise. Regulatory complexity unproven for you. Higher capital requirements than #1. Trust barrier with banking partners.',
    whatWouldHelp: 'Fintech advisor / cofounder with banking relationships (adds +22 fit). Additional capital $300K (adds +10 fit). Relationship with 1 bank (adds +12 fit).',
    comparisonTo2: 'Ranks #3: Strong market (88) but regulatory complexity pulls fit down vs #1. Model risk is regulatory, not execution. Higher stakes.',
    
    whereWeak: { technical: 52, buyerAccess: 82, capital: 70, localAccess: 68 },
    improve: 'Add fintech compliance advisor as cofounder. Secure banking relationship pre-launch.',
    firstMove: 'Audit fintech regulatory landscape in Vietnam. Schedule 3 bank partnership conversations. Map competitive landscape.',
    subScores: { 
      domainFamiliarity: 52, 
      executionFit: 78, 
      marketAccess: 82, 
      buyerAccess: 88,
      distributionEdge: 85, 
      buildCapacity: 48,
      capitalFit: 68, 
      preferenceAlignment: 78 
    }
  },
];

export default function FounderFitPage() {
  const [selectedId, setSelectedId] = useState<string>('1');
  const [showScoringFormula, setShowScoringFormula] = useState(false);
  
  const selectedOp = FIT_OPPORTUNITIES.find(op => op.id === selectedId) || FIT_OPPORTUNITIES[0];

  // Calculate scores using 55/45 formula
  const allOpportunitiesWithScores = useMemo(() => {
    return FIT_OPPORTUNITIES.map(op => {
      const bestBetScore = Math.round(op.marketScore * 0.55 + op.founderFitScore * 0.45);
      return { ...op, bestBetScore };
    });
  }, []);

  // Sorted by Best Bet Score descending
  const rankedOpportunities = useMemo(() => {
    return [...allOpportunitiesWithScores].sort((a, b) => b.bestBetScore - a.bestBetScore);
  }, [allOpportunitiesWithScores]);

  const adjustedSelectedOp = allOpportunitiesWithScores.find(op => op.id === selectedId) || allOpportunitiesWithScores[0];

  return (
    <div className="bg-[#0a0a0b] min-h-screen text-gray-100 font-sans pb-16 selection:bg-brand-500/30">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* SCORING TRANSPARENCY BANNER */}
        <section className="border border-white/5 rounded-xl bg-[#0d0d0f] p-4">
          <button 
            onClick={() => setShowScoringFormula(!showScoringFormula)}
            className="flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-white transition-colors"
          >
            <span className="text-brand-400">↓</span> How We Score
          </button>
          {showScoringFormula && (
            <div className="mt-3 pt-3 border-t border-white/5 space-y-3 text-xs text-gray-400 font-mono">
              <div className="bg-black/30 border border-white/5 rounded-lg p-3">
                <div className="text-white font-bold mb-2">How We Score Your Best Bets</div>
                <div className="space-y-2 text-gray-300">
                  <div><span className="text-brand-300 font-mono font-bold">Best Bet = (55% Market Opportunity) + (45% Founder Fit)</span></div>
                  <div className="text-gray-500">Best Bet combines market attractiveness with how well your actual founder profile matches this opportunity's execution requirements.</div>
                </div>
              </div>
              
              <div>
                <div className="text-white font-bold mb-2">Market Opportunity Score</div>
                <div className="ml-2 text-gray-500">Market size, growth rate, competitive intensity, timing for your target market.</div>
              </div>

              <div>
                <div className="text-white font-bold mb-2">Founder Fit Score (8 sub-scores)</div>
                <div className="ml-4 space-y-1 text-gray-500">
                  <div>• Domain Familiarity - Your prior experience in this category</div>
                  <div>• Execution Fit - Match with your operating approach & style</div>
                  <div>• Market Access - Buyer relationships in your target market</div>
                  <div>• Buyer Access - Access to the buyer type this opportunity needs</div>
                  <div>• Distribution Edge - GTM advantage from your profile & network</div>
                  <div>• Build Capacity - Your technical + team ability to execute</div>
                  <div>• Capital Fit - Entry cost vs your available capital</div>
                  <div>• Preference Alignment - Your stated preferences (B2B/model/etc)</div>
                </div>
              </div>

              <div>
                <div className="text-white font-bold mb-2">Fit Confidence</div>
                <div className="ml-2 text-gray-500">How confident we are in this assessment based on your profile completeness ({FOUNDER_PROFILE.completionPercent}%) and data quality.</div>
              </div>
            </div>
          )}
        </section>

        {/* HERO SECTION */}
        <section className="space-y-6">
          <div>
            <h1 className="text-5xl font-display font-bold text-white tracking-tight mb-4">Founder Fit</h1>
            <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
              Match your operating background, access advantages, and execution strengths to the market gaps most worth building.
            </p>
          </div>
          
          <div className="flex gap-3 items-center">
            <button className="bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold py-3 px-8 rounded-lg transition-colors shadow-lg shadow-brand-500/20">
              Build Founder Profile
            </button>
            <button className="bg-[#222] hover:bg-[#333] border border-white/10 text-white text-sm font-medium py-3 px-8 rounded-lg transition-colors">
              Update Profile
            </button>
          </div>
        </section>

        {/* FOUNDER PROFILE SUMMARY + BEST-FIT RANKING ROW */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Founder Profile Summary (5 cols) - ENHANCED */}
          <div className="lg:col-span-5 bg-[#111113] border border-white/10 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-500/5 blur-[80px] pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-sm font-mono font-bold tracking-widest text-brand-400 uppercase">Your Profile</h2>
                <div className="text-right">
                  <div className="text-xs text-gray-500 font-mono mb-1">Profile Complete</div>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-1.5 bg-black/40 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-brand-500 transition-all" 
                        style={{ width: `${FOUNDER_PROFILE.completionPercent}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono font-bold text-white">{FOUNDER_PROFILE.completionPercent}%</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-500 font-mono mb-1.5">Background</div>
                  <div className="flex flex-wrap gap-2">
                    {FOUNDER_PROFILE.background.map(item => (
                      <span key={item} className="text-xs px-2.5 py-1 bg-brand-500/10 border border-brand-500/30 text-brand-300 rounded">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-500 font-mono mb-1.5">Execution Strengths</div>
                  <div className="flex flex-wrap gap-2">
                    {FOUNDER_PROFILE.strengths.map(item => (
                      <span key={item} className="text-xs px-2.5 py-1 bg-teal-500/10 border border-teal-500/30 text-teal-300 rounded">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-500 font-mono mb-1">Preferred Markets</div>
                  <div className="text-white">{FOUNDER_PROFILE.preferredMarkets.join(', ')}</div>
                </div>

                <div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-500 font-mono mb-1">Preferred Model</div>
                  <div className="text-white">{FOUNDER_PROFILE.preferredModels.join(', ')}</div>
                </div>

                <div className="bg-black/20 border border-white/5 rounded-xl p-3 space-y-2">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-500 font-mono mb-0.5">Team Now</div>
                    <div className="text-xs text-white">{FOUNDER_PROFILE.teamComposition}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-500 font-mono mb-0.5">Buyer Access</div>
                    <div className="text-xs text-white">{FOUNDER_PROFILE.buyerAccess}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-500 font-mono mb-0.5">Language / Local</div>
                    <div className="text-xs text-white">{FOUNDER_PROFILE.languageFamiliarity}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-500 font-mono mb-0.5">Regulatory Tolerance</div>
                    <div className="text-xs text-white">{FOUNDER_PROFILE.regulatoryTolerance}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-500 font-mono mb-0.5">Execution Style</div>
                    <div className="text-xs text-white">{FOUNDER_PROFILE.executionStyle}</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/5">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-500 font-mono mb-1">Experience</div>
                    <div className="text-lg font-mono font-bold text-white">{FOUNDER_PROFILE.yearsExperience}y</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-500 font-mono mb-1">Capital</div>
                    <div className="text-sm font-mono font-bold text-green-400">{FOUNDER_PROFILE.capital.label}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-500 font-mono mb-1">Network</div>
                    <div className="text-xs text-white">{FOUNDER_PROFILE.network}</div>
                  </div>
                </div>

                <button className="w-full text-xs text-brand-400 hover:text-brand-300 font-mono font-bold uppercase tracking-widest py-2 px-3 mt-2 border border-brand-500/20 hover:border-brand-500/40 rounded transition-all">
                  ✎ Edit Assumptions
                </button>
              </div>
            </div>
          </div>

          {/* Best-Fit Opportunities Ranking (7 cols) - WITH REASON CHIPS */}
          <div className="lg:col-span-7 bg-[#111113] border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-display font-semibold text-white mb-1">Your Best-Fit Opportunities</h2>
            <p className="text-xs text-gray-500 mb-6">Ranked by Market Opportunity (60%) + Founder Fit (40%)</p>
            
            <div className="space-y-3">
              {rankedOpportunities.map((op, idx) => (
                <button
                  key={op.id}
                  onClick={() => setSelectedId(op.id)}
                  className={`w-full p-4 rounded-xl border transition-all text-left ${
                    selectedId === op.id
                      ? 'bg-brand-500/15 border-brand-400/50 shadow-lg shadow-brand-500/20'
                      : 'bg-[#0a0a0b] border-white/5 hover:bg-[#161618] hover:border-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs font-mono font-bold ${selectedId === op.id ? 'text-brand-300' : 'text-gray-500'}`}>#{idx + 1}</span>
                        <div className="font-semibold text-white text-sm">{op.category}</div>
                        <span className="text-xs text-gray-400 font-mono">— {op.market}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {op.reasons.slice(0, 2).map(reason => (
                          <span key={reason} className="text-[9px] px-2 py-0.5 rounded bg-green-500/15 border border-green-500/30 text-green-300 font-mono">
                            ✓ {reason}
                          </span>
                        ))}
                        {op.risks.map(risk => (
                          <span key={risk} className="text-[9px] px-2 py-0.5 rounded bg-red-500/15 border border-red-500/30 text-red-300 font-mono">
                            ⚠ {risk}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className={`text-2xl font-mono font-bold whitespace-nowrap ${selectedId === op.id ? 'text-brand-300' : 'text-white'}`}>
                        {op.bestBetScore}
                      </div>
                      <div className="text-[9px] text-gray-600 font-mono mt-0.5">Best Bet</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs border-t border-white/5 pt-2 mt-2">
                    <div className="flex items-center gap-4">
                      <div>
                        <span className="text-gray-600 font-mono">Market:</span>
                        <span className="font-mono font-bold text-teal-400 ml-1">{op.marketScore}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 font-mono">Fit:</span>
                        <span className="font-mono font-bold text-brand-300 ml-1">{op.founderFitScore}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 font-mono">Confidence:</span>
                        <span className="font-mono font-bold text-blue-400 ml-1">{op.fitConfidence}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* FOUNDER FIT MATRIX + DETAIL PANEL ROW */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Founder Fit Matrix (7 cols) */}
          <div className="lg:col-span-7 bg-[#111113] border border-white/10 rounded-2xl p-8 relative overflow-hidden">
            <h2 className="text-lg font-display font-semibold text-white mb-4">Fit Matrix: Market Opportunity vs Your Fit</h2>
            
            <div className="relative h-96 bg-[#0d0d0f] rounded-xl overflow-hidden border border-white/[0.05]">
              {/* Quadrant backgrounds */}
              <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-green-500/5 mix-blend-screen" />
              <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-yellow-500/5 mix-blend-screen" />
              <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-blue-500/5 mix-blend-screen" />
              <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-red-500/5 mix-blend-screen" />

              {/* Quadrant lines */}
              <div className="absolute top-1/2 left-0 w-full border-t border-dashed border-white/[0.08] z-0" />
              <div className="absolute top-0 left-1/2 h-full border-l border-dashed border-white/[0.08] z-0" />

              {/* Quadrant labels */}
              <div className="absolute top-4 left-4 text-[9px] font-mono font-bold text-green-600/50 uppercase tracking-wider">Best Bets</div>
              <div className="absolute top-4 right-4 text-[9px] font-mono font-bold text-yellow-600/50 uppercase tracking-wider text-right">Good Fit,<br />Weaker Market</div>
              <div className="absolute bottom-12 left-4 text-[9px] font-mono font-bold text-blue-600/50 uppercase tracking-wider">Strong Market,<br />Weak Fit</div>
              <div className="absolute bottom-12 right-4 text-[9px] font-mono font-bold text-red-600/50 uppercase tracking-wider text-right">Avoid<br />for Now</div>

              {/* Axes */}
              <div className="absolute bottom-1 left-4 right-4 flex justify-between text-[8px] text-gray-500 font-mono uppercase">
                <span>Low</span>
                <span className="font-bold">Market Opportunity →</span>
                <span>High</span>
              </div>
              <div className="absolute left-1 top-4 bottom-12 flex flex-col justify-between text-[8px] text-gray-500 font-mono uppercase">
                <span className="-rotate-90 origin-center translate-x-2">High</span>
                <span className="-rotate-90 origin-center font-bold whitespace-nowrap">← Your Fit</span>
                <span className="-rotate-90 origin-center translate-x-1">Low</span>
              </div>

              {/* Plot points */}
              <div className="absolute inset-x-8 inset-y-8 z-10">
                {FIT_OPPORTUNITIES.map(op => {
                  const x = (op.marketScore / 100) * 100;
                  const y = (op.founderFitScore / 100) * 100;
                  const isSelected = selectedId === op.id;
                  const size = 32;

                  return (
                    <button
                      key={op.id}
                      onClick={() => setSelectedId(op.id)}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${isSelected ? 'z-50' : 'z-20'}`}
                      style={{ left: `${x}%`, bottom: `${y}%` }}
                    >
                      <div className={`rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                        isSelected 
                          ? `w-12 h-12 bg-brand-500 ring-2 ring-brand-300 shadow-lg shadow-brand-500/50 text-white scale-125` 
                          : op.bestBetScore >= 85 ? `w-8 h-8 bg-green-500/60 text-white hover:scale-110` 
                          : op.bestBetScore >= 75 ? `w-8 h-8 bg-blue-500/50 text-white hover:scale-110`
                          : `w-8 h-8 bg-gray-600/40 text-gray-300 hover:scale-110`
                      }`}>
                        {op.bestBetScore}
                      </div>
                      <div className={`absolute top-full mt-2 whitespace-nowrap text-[9px] font-mono text-center transition-opacity pointer-events-none ${isSelected ? 'opacity-100' : 'opacity-60'}`}>
                        <div className="text-white font-bold">{op.category}</div>
                        <div className="text-gray-400">{op.market}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-4 font-mono">
              Bubble size indicates opportunity score. <strong className="text-white">Selected:</strong> {selectedOp.category} — {selectedOp.market}
            </p>
          </div>

          {/* Selected Opportunity Detail Panel (5 cols) */}
          <div className="lg:col-span-5 bg-[#111113] border border-white/10 rounded-2xl p-6 relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 w-40 h-40 bg-brand-500/8 blur-[60px] pointer-events-none" />
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-0.5">{selectedOp.category}</h2>
                <p className="text-lg text-gray-400 font-display">— {selectedOp.market}</p>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-8">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-500 font-mono mb-1">Best Bet Score</div>
                  <div className="text-2xl font-mono font-bold text-white">{selectedOp.bestBetScore}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-500 font-mono mb-1">Market Opp</div>
                  <div className="text-2xl font-mono font-bold text-teal-400">{selectedOp.marketScore}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-500 font-mono mb-1">Your Fit</div>
                  <div className="text-2xl font-mono font-bold text-brand-300">{selectedOp.founderFitScore}</div>
                </div>
              </div>

              <div className="space-y-5 flex-1">
                {/* What You Bring */}
                <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4">
                  <div className="text-[10px] uppercase tracking-widest text-green-400 font-mono mb-2">✓ What You Bring</div>
                  <p className="text-sm text-white leading-relaxed">{selectedOp.whatYouBring}</p>
                </div>

                {/* What It Requires */}
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
                  <div className="text-[10px] uppercase tracking-widest text-blue-400 font-mono mb-2">⚙ What It Requires</div>
                  <p className="text-sm text-white leading-relaxed">{selectedOp.whatItRequires}</p>
                </div>

                {/* What May Hold You Back */}
                <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-4">
                  <div className="text-[10px] uppercase tracking-widest text-orange-400 font-mono mb-2">⚠ What May Hold You Back</div>
                  <p className="text-sm text-white leading-relaxed">{selectedOp.whatMayHoldYouBack}</p>
                </div>

                {/* What Would Help */}
                <div className="bg-teal-500/5 border border-teal-500/20 rounded-xl p-4">
                  <div className="text-[10px] uppercase tracking-widest text-teal-400 font-mono mb-2">↑ What Would Help</div>
                  <p className="text-sm text-white leading-relaxed">{selectedOp.whatWouldHelp}</p>
                </div>

                {/* Why Ranks Above #2 */}
                <div className="bg-brand-500/10 border border-brand-500/20 rounded-xl p-4">
                  <div className="text-[10px] uppercase tracking-widest text-brand-400 font-mono mb-2">★ Why This Ranks Above #2</div>
                  <p className="text-sm text-white leading-relaxed">{selectedOp.comparisonTo2}</p>
                </div>
              </div>

              <div className="flex gap-3 mt-auto pt-4 border-t border-white/5">
                <button className="flex-1 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold py-2.5 rounded-lg transition-colors">
                  View Full Analysis
                </button>
                <button className="flex-1 bg-[#222] hover:bg-[#333] border border-white/10 text-white text-xs font-medium py-2.5 rounded-lg transition-colors">
                  Save as Best Bet
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FIT BREAKDOWN CARD */}
        <section className="bg-[#111113] border border-white/10 rounded-2xl p-8">
          <h2 className="text-lg font-display font-semibold text-white mb-8">Fit Breakdown: {selectedOp.category}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Domain Familiarity', score: selectedOp.subScores.domainFamiliarity, color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
              { label: 'Execution Fit', score: selectedOp.subScores.executionFit, color: 'text-teal-400', bgColor: 'bg-teal-500/10' },
              { label: 'Market Access', score: selectedOp.subScores.marketAccess, color: 'text-green-400', bgColor: 'bg-green-500/10' },
              { label: 'Buyer Access', score: selectedOp.subScores.buyerAccess, color: 'text-emerald-400', bgColor: 'bg-emerald-500/10' },
              { label: 'Distribution Edge', score: selectedOp.subScores.distributionEdge, color: 'text-brand-300', bgColor: 'bg-brand-500/10' },
              { label: 'Build Capacity', score: selectedOp.subScores.buildCapacity, color: 'text-violet-400', bgColor: 'bg-violet-500/10' },
              { label: 'Preference Alignment', score: selectedOp.subScores.preferenceAlignment, color: 'text-yellow-400', bgColor: 'bg-yellow-500/10' },
              { label: 'Capital Fit', score: selectedOp.subScores.capitalFit, color: 'text-purple-400', bgColor: 'bg-purple-500/10' },
            ].map(item => (
              <div key={item.label} className={`${item.bgColor} border border-white/5 rounded-xl p-4`}>
                <div className="text-xs text-gray-400 font-medium mb-3">{item.label}</div>
                <div className="flex items-end gap-3 mb-3">
                  <div className={`text-3xl font-mono font-bold ${item.color}`}>{item.score}</div>
                  <div className="flex-1 bg-black/30 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${item.color.replace('text-', 'bg-')}`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
                <div className="text-[11px] text-gray-500">
                  {item.score >= 80 ? '✓ Strong' : item.score >= 60 ? '→ Solid' : '⚠ Needs work'}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* IMPROVE YOUR FIT SECTION */}
        <section className="bg-gradient-to-br from-brand-500/10 to-teal-500/5 border border-white/5 rounded-2xl p-8">
          <h2 className="text-lg font-display font-semibold text-white mb-1">Improve Your Fit</h2>
          <p className="text-sm text-gray-400 mb-8">Operational moves to strengthen your odds on {selectedOp.category}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: '👥', title: 'Find Local GTM Partner', desc: 'Partner with distributor who knows {selectedOp.market} B2B landscape' },
              { icon: '⚙️', title: 'Add Technical Cofounder', desc: 'Recruit technical lead with your domain to handle product/engineering' },
              { icon: '🎯', title: 'Start Adjacent Market First', desc: 'Validate model in tier-2 city before scaling to metro' },
              { icon: '📊', title: 'Validate with SMBs First', desc: 'Pre-sell to 3-5 SMBs before building; confirm willingness to pay' },
            ].map((item, idx) => (
              <div key={idx} className="bg-[#111113] border border-white/5 rounded-xl p-6 hover:border-brand-400/30 transition-colors">
                <div className="text-2xl mb-3">{item.icon}</div>
                <h3 className="text-sm font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA FOOTER */}
        <section className="text-center py-8">
          <p className="text-gray-400 mb-4">Ready to go deeper?</p>
          <Link href="/dashboard" className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold py-3 px-8 rounded-lg transition-colors shadow-lg shadow-brand-500/20">
            Explore Full Market Matrix
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </Link>
        </section>

      </div>
    </div>
  );
}
