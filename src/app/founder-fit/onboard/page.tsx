'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

type FounderRoleType = 'founder' | 'product' | 'engineering' | 'gtm' | 'operations' | 'partnerships' | 'investor';
type StageType = '0-to-1' | '1-to-10' | 'scale-up';
type TechnicalAbilityType = 'solo' | 'prototype' | 'cofounder' | 'non-technical';
type CapitalType = '<50k' | '50k-250k' | '250k-1m' | '1m+';

interface FounderProfile {
  // Step 1: Operating Background
  primaryRole?: FounderRoleType;
  yearsExperience?: number;
  functionalStrengths?: string[];
  industriesWorkedIn?: string[];
  stageFamiliarity?: StageType[];

  // Step 2: Market Access
  preferredRegions?: string[];
  countriesKnownWell?: string[];
  languagesSpoken?: string[];
  buyerAccess?: string[];
  networkStrength?: string[];

  // Step 3: Build & Distribution Capacity
  technicalAbility?: TechnicalAbilityType;
  teamComposition?: string;
  distributionStrengths?: string[];
  comfortSelling?: string[];
  canRecruitOperators?: boolean;

  // Step 4: Constraints & Preferences
  capitalAvailable?: CapitalType;
  timeHorizonToValidate?: string;
  riskAppetite?: 'low' | 'medium' | 'high';
  preferredBusinessModels?: string[];
  regulatoryTolerance?: 'low' | 'medium' | 'high';
  teamStyle?: string;

  // Meta
  completedAt?: string;
  completionPercent?: number;
}

const PRIMARY_ROLES = [
  { value: 'founder' as FounderRoleType, label: 'Founder', description: 'Built startup(s)' },
  { value: 'product' as FounderRoleType, label: 'Product', description: 'Led product strategy' },
  { value: 'engineering' as FounderRoleType, label: 'Engineering', description: 'Led eng team' },
  { value: 'gtm' as FounderRoleType, label: 'GTM / Sales', description: 'Led go-to-market' },
  { value: 'operations' as FounderRoleType, label: 'Operations', description: 'Led operations' },
  { value: 'partnerships' as FounderRoleType, label: 'Partnerships', description: 'Led partnerships' },
  { value: 'investor' as FounderRoleType, label: 'Investor / Advisor', description: 'Invested or advised' },
];

const FUNCTIONAL_STRENGTHS = [
  'GTM Strategy',
  'Sales',
  'Product',
  'Engineering',
  'Operations',
  'Fundraising',
  'Board Management',
  'Partnerships',
];

const INDUSTRIES = [
  'SaaS',
  'Fintech',
  'E-commerce',
  'Logistics',
  'HealthTech',
  'EdTech',
  'Marketplace',
  'AI/ML',
  'Infrastructure',
  'Vertical SaaS',
];

const REGIONS = ['North America', 'Europe', 'Asia', 'Southeast Asia', 'South Asia', 'Africa', 'Latin America', 'Middle East'];

const SEA_COUNTRIES = ['Indonesia', 'Vietnam', 'Thailand', 'Philippines', 'Singapore', 'Malaysia'];

const LANGUAGES = ['English', 'Mandarin', 'Hindi', 'Indonesian', 'Vietnamese', 'Thai', 'Spanish', 'French', 'Japanese'];

const FUNCTIONAL_STRENGTHS_OPTIONS = [
  'Domain expertise',
  'Technical skills',
  'User research',
  'Prototyping',
  'Launch management',
];

const DISTRIBUTION_STRENGTHS = [
  'Outbound sales',
  'Partnerships',
  'Product-led growth',
  'Community building',
  'Content marketing',
  'Direct relationships',
];

const BUSINESS_MODELS = [
  'B2B SaaS',
  'Marketplace',
  'Fintech',
  'Consumer',
  'Enterprise Infrastructure',
  'API / Platform',
];

export default function FounderFitOnboardPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [profile, setProfile] = useState<FounderProfile>({});
  const [showSavePrompt, setShowSavePrompt] = useState(false);

  // Toggle multi-select fields
  const toggleArrayField = (field: keyof FounderProfile, value: string) => {
    const currentValues = (profile[field] as string[]) || [];
    const updated = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    setProfile({ ...profile, [field]: updated });
  };

  // Calculate profile completeness
  const completionPercent = useMemo(() => {
    const fields = [
      profile.primaryRole,
      profile.yearsExperience,
      profile.functionalStrengths?.length,
      profile.industriesWorkedIn?.length,
      profile.stageFamiliarity?.length,
      profile.preferredRegions?.length,
      profile.countriesKnownWell?.length,
      profile.buyerAccess?.length,
      profile.technicalAbility,
      profile.distributionStrengths?.length,
      profile.capitalAvailable,
      profile.preferredBusinessModels?.length,
      profile.regulatoryTolerance,
    ];
    const completedFields = fields.filter(f => f !== undefined && f !== null && f !== 0).length;
    return Math.round((completedFields / fields.length) * 100);
  }, [profile]);

  // Step indicators
  const steps = [
    { num: 1, label: 'Operating Background', time: '1 min' },
    { num: 2, label: 'Market Access', time: '1 min' },
    { num: 3, label: 'Build & Distribution', time: '1 min' },
    { num: 4, label: 'Constraints', time: '1 min' },
    { num: 5, label: 'Review', time: '1 min' },
  ];

  const handleNext = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
    else {
      // Submit profile
      setProfile({ ...profile, completedAt: new Date().toISOString(), completionPercent });
      // Redirect to founder-fit page
      window.location.href = '/founder-fit';
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="bg-[#0a0a0b] min-h-screen text-gray-100 font-sans selection:bg-brand-500/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* HEADER */}
        <div className="mb-12">
          <h1 className="text-4xl font-display font-bold text-white mb-2">Build Your Founder Profile</h1>
          <p className="text-gray-400 text-lg">Help us understand your operating background, access, and constraints.</p>
          <p className="text-xs text-gray-500 mt-4 font-mono">Estimated time: 2–4 min</p>
        </div>

        {/* PROGRESS BAR */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <div className="text-xs font-mono text-gray-400">
              Step {currentStep} of 5
            </div>
            <div className="text-xs font-mono text-brand-400">
              {completionPercent}% complete
            </div>
          </div>
          
          {/* Progress indication with step dots */}
          <div className="flex gap-2 mb-6">
            {steps.map(step => (
              <div key={step.num} className="flex-1">
                <button
                  onClick={() => step.num < currentStep && setCurrentStep(step.num)}
                  className="w-full group"
                >
                  <div className={`h-1 rounded-full transition-all ${
                    step.num < currentStep
                      ? 'bg-brand-500'
                      : step.num === currentStep
                      ? 'bg-brand-400'
                      : 'bg-white/10'
                  }`} />
                </button>
              </div>
            ))}
          </div>

          {/* Step indicator */}
          <div className="text-sm text-gray-400 font-mono">
            <span className="text-brand-400 font-bold">{steps[currentStep - 1].label}</span> — {steps[currentStep - 1].time}
          </div>
        </div>

        {/* STEP CONTENT */}
        <div className="bg-[#111113] border border-white/10 rounded-2xl p-10 mb-12 min-h-96">
          
          {/* STEP 1: Operating Background */}
          {currentStep === 1 && (
            <div className="space-y-8">
              <div>
                <label className="text-sm font-mono uppercase tracking-widest text-gray-500 mb-4 block">
                  Primary Role or Founder Type
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {PRIMARY_ROLES.map(role => (
                    <button
                      key={role.value}
                      onClick={() => setProfile({ ...profile, primaryRole: role.value })}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        profile.primaryRole === role.value
                          ? 'bg-brand-500/15 border-brand-400/50'
                          : 'bg-[#0a0a0b] border-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className="font-semibold text-sm">{role.label}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{role.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-mono uppercase tracking-widest text-gray-500 mb-4 block">
                  Years of Experience
                </label>
                <div className="flex gap-2 flex-wrap">
                  {['2', '5', '8', '10', '15', '20+'].map(year => (
                    <button
                      key={year}
                      onClick={() => setProfile({ ...profile, yearsExperience: parseInt(year) })}
                      className={`px-4 py-2 rounded-lg border transition-all text-sm font-mono ${
                        String(profile.yearsExperience) === year
                          ? 'bg-brand-500/15 border-brand-400/50 text-brand-300'
                          : 'bg-[#0a0a0b] border-white/5 hover:border-white/10 text-gray-300'
                      }`}
                    >
                      {year}y
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-mono uppercase tracking-widest text-gray-500 mb-4 block">
                  Functional Strengths (select up to 4)
                </label>
                <div className="flex flex-wrap gap-2">
                  {FUNCTIONAL_STRENGTHS.map(strength => (
                    <button
                      key={strength}
                      onClick={() => toggleArrayField('functionalStrengths', strength)}
                      disabled={(profile.functionalStrengths?.length || 0) >= 4 && !profile.functionalStrengths?.includes(strength)}
                      className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                        profile.functionalStrengths?.includes(strength)
                          ? 'bg-brand-500/20 border-brand-400/50 text-brand-200'
                          : 'bg-[#0a0a0b] border-white/5 text-gray-400 hover:border-white/10 disabled:opacity-50 disabled:cursor-not-allowed'
                      }`}
                    >
                      {strength}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-mono uppercase tracking-widest text-gray-500 mb-4 block">
                  Industries You've Worked In (select at least 1)
                </label>
                <div className="flex flex-wrap gap-2">
                  {INDUSTRIES.map(industry => (
                    <button
                      key={industry}
                      onClick={() => toggleArrayField('industriesWorkedIn', industry)}
                      className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                        profile.industriesWorkedIn?.includes(industry)
                          ? 'bg-teal-500/20 border-teal-400/50 text-teal-200'
                          : 'bg-[#0a0a0b] border-white/5 text-gray-400 hover:border-white/10'
                      }`}
                    >
                      {industry}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-mono uppercase tracking-widest text-gray-500 mb-4 block">
                  Startup Stage Familiarity
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: '0-to-1', label: '0→1', color: 'brand' },
                    { value: '1-to-10', label: '1→10', color: 'brand' },
                    { value: 'scale-up', label: 'Scale-up / Enterprise', color: 'brand' },
                  ].map(stage => (
                    <button
                      key={stage.value}
                      onClick={() => {
                        const updated = (profile.stageFamiliarity || []).includes(stage.value as StageType)
                          ? (profile.stageFamiliarity || []).filter(s => s !== stage.value)
                          : [...(profile.stageFamiliarity || []), stage.value as StageType];
                        setProfile({ ...profile, stageFamiliarity: updated });
                      }}
                      className={`px-4 py-2 rounded-lg border font-medium text-sm transition-all ${
                        profile.stageFamiliarity?.includes(stage.value as StageType)
                          ? 'bg-brand-500/15 border-brand-400/50 text-brand-300'
                          : 'bg-[#0a0a0b] border-white/5 text-gray-400 hover:border-white/10'
                      }`}
                    >
                      {stage.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Market Access */}
          {currentStep === 2 && (
            <div className="space-y-8">
              <div className="bg-black/30 border border-white/5 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-300 italic">"The best market on paper is not always the best market for you to enter first."</p>
              </div>

              <div>
                <label className="text-sm font-mono uppercase tracking-widest text-gray-500 mb-4 block">
                  Preferred Regions (select at least 1)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {REGIONS.map(region => (
                    <button
                      key={region}
                      onClick={() => toggleArrayField('preferredRegions', region)}
                      className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                        profile.preferredRegions?.includes(region)
                          ? 'bg-teal-500/20 border-teal-400/50 text-teal-200'
                          : 'bg-[#0a0a0b] border-white/5 text-gray-400 hover:border-white/10'
                      }`}
                    >
                      {region}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-mono uppercase tracking-widest text-gray-500 mb-4 block">
                  Countries You Know Well (geographic edge)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {SEA_COUNTRIES.map(country => (
                    <button
                      key={country}
                      onClick={() => toggleArrayField('countriesKnownWell', country)}
                      className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                        profile.countriesKnownWell?.includes(country)
                          ? 'bg-brand-500/20 border-brand-400/50 text-brand-200'
                          : 'bg-[#0a0a0b] border-white/5 text-gray-400 hover:border-white/10'
                      }`}
                    >
                      {country}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-mono uppercase tracking-widest text-gray-500 mb-4 block">
                  Languages Spoken
                </label>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang}
                      onClick={() => toggleArrayField('languagesSpoken', lang)}
                      className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                        profile.languagesSpoken?.includes(lang)
                          ? 'bg-green-500/20 border-green-400/50 text-green-200'
                          : 'bg-[#0a0a0b] border-white/5 text-gray-400 hover:border-white/10'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-mono uppercase tracking-widest text-gray-500 mb-4 block">
                  Buyer Access (what types of buyers do you have relationships with?)
                </label>
                <div className="flex flex-wrap gap-2">
                  {['SMB', 'Mid-market', 'Enterprise', 'Consumers', 'Government'].map(buyer => (
                    <button
                      key={buyer}
                      onClick={() => toggleArrayField('buyerAccess', buyer)}
                      className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                        profile.buyerAccess?.includes(buyer)
                          ? 'bg-purple-500/20 border-purple-400/50 text-purple-200'
                          : 'bg-[#0a0a0b] border-white/5 text-gray-400 hover:border-white/10'
                      }`}
                    >
                      {buyer}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-mono uppercase tracking-widest text-gray-500 mb-4 block">
                  Which network strengths do you have?
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Local operators', 'Investors', 'Distribution partners', 'Corporate buyers', 'Other founders'].map(network => (
                    <button
                      key={network}
                      onClick={() => toggleArrayField('networkStrength', network)}
                      className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                        profile.networkStrength?.includes(network)
                          ? 'bg-blue-500/20 border-blue-400/50 text-blue-200'
                          : 'bg-[#0a0a0b] border-white/5 text-gray-400 hover:border-white/10'
                      }`}
                    >
                      {network}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Build & Distribution Capacity */}
          {currentStep === 3 && (
            <div className="space-y-8">
              <div>
                <label className="text-sm font-mono uppercase tracking-widest text-gray-500 mb-4 block">
                  Your Technical Build Ability
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'solo', label: 'Can build solo', description: 'Technical founder, can ship products' },
                    { value: 'prototype', label: 'Can prototype', description: 'Can validate ideas but not scale alone' },
                    { value: 'cofounder', label: 'Need technical cofounder', description: 'Can lead go-to-market, need dev support' },
                    { value: 'non-technical', label: 'Non-technical', description: 'Will need technical team' },
                  ].map(ability => (
                    <button
                      key={ability.value}
                      onClick={() => setProfile({ ...profile, technicalAbility: ability.value as TechnicalAbilityType })}
                      className={`w-full p-3 rounded-lg border text-left transition-all ${
                        profile.technicalAbility === ability.value
                          ? 'bg-brand-500/15 border-brand-400/50'
                          : 'bg-[#0a0a0b] border-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className="font-medium text-sm">{ability.label}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{ability.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-mono uppercase tracking-widest text-gray-500 mb-4 block">
                  Current Team Composition
                </label>
                <input
                  type="text"
                  placeholder="e.g., Solo founder, seeking technical cofounder"
                  value={profile.teamComposition || ''}
                  onChange={e => setProfile({ ...profile, teamComposition: e.target.value })}
                  className="w-full bg-[#0a0a0b] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-400/50 transition-all"
                />
              </div>

              <div>
                <label className="text-sm font-mono uppercase tracking-widest text-gray-500 mb-4 block">
                  Distribution Strengths (select up to 3)
                </label>
                <div className="flex flex-wrap gap-2">
                  {DISTRIBUTION_STRENGTHS.map(strength => (
                    <button
                      key={strength}
                      onClick={() => toggleArrayField('distributionStrengths', strength)}
                      disabled={(profile.distributionStrengths?.length || 0) >= 3 && !profile.distributionStrengths?.includes(strength)}
                      className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                        profile.distributionStrengths?.includes(strength)
                          ? 'bg-orange-500/20 border-orange-400/50 text-orange-200'
                          : 'bg-[#0a0a0b] border-white/5 text-gray-400 hover:border-white/10 disabled:opacity-50 disabled:cursor-not-allowed'
                      }`}
                    >
                      {strength}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-mono uppercase tracking-widest text-gray-500 mb-4 block">
                  Comfort Selling To...
                </label>
                <div className="flex flex-wrap gap-2">
                  {['SMBs', 'Mid-market', 'Enterprise', 'Regulated buyers'].map(type => (
                    <button
                      key={type}
                      onClick={() => toggleArrayField('comfortSelling', type)}
                      className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                        profile.comfortSelling?.includes(type)
                          ? 'bg-red-500/20 border-red-400/50 text-red-200'
                          : 'bg-[#0a0a0b] border-white/5 text-gray-400 hover:border-white/10'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-mono uppercase tracking-widest text-gray-500 mb-4 block">
                  Can you recruit / attract operators?
                </label>
                <div className="flex gap-3">
                  {[
                    { value: true, label: 'Yes' },
                    { value: false, label: 'No' },
                  ].map(option => (
                    <button
                      key={String(option.value)}
                      onClick={() => setProfile({ ...profile, canRecruitOperators: option.value })}
                      className={`px-6 py-2 rounded-lg border font-medium text-sm transition-all ${
                        profile.canRecruitOperators === option.value
                          ? 'bg-brand-500/15 border-brand-400/50 text-brand-300'
                          : 'bg-[#0a0a0b] border-white/5 text-gray-400 hover:border-white/10'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Constraints & Preferences */}
          {currentStep === 4 && (
            <div className="space-y-8">
              <div>
                <label className="text-sm font-mono uppercase tracking-widest text-gray-500 mb-4 block">
                  Capital Available to Deploy
                </label>
                <div className="space-y-2">
                  {[
                    { value: '<50k', label: 'Under $50K', color: 'brand' },
                    { value: '50k-250k', label: '$50K–250K', color: 'brand' },
                    { value: '250k-1m', label: '$250K–1M', color: 'brand' },
                    { value: '1m+', label: '$1M+', color: 'brand' },
                  ].map(cap => (
                    <button
                      key={cap.value}
                      onClick={() => setProfile({ ...profile, capitalAvailable: cap.value as CapitalType })}
                      className={`w-full p-3 rounded-lg border text-left transition-all font-medium text-sm ${
                        profile.capitalAvailable === cap.value
                          ? 'bg-green-500/15 border-green-400/50 text-green-300'
                          : 'bg-[#0a0a0b] border-white/5 text-gray-300 hover:border-white/10'
                      }`}
                    >
                      {cap.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-mono uppercase tracking-widest text-gray-500 mb-4 block">
                  Time Horizon to Validate (months)
                </label>
                <div className="flex gap-2 flex-wrap">
                  {['3', '6', '12', '18', '24'].map(months => (
                    <button
                      key={months}
                      onClick={() => setProfile({ ...profile, timeHorizonToValidate: months })}
                      className={`px-4 py-2 rounded-lg border transition-all text-sm font-mono ${
                        profile.timeHorizonToValidate === months
                          ? 'bg-brand-500/15 border-brand-400/50 text-brand-300'
                          : 'bg-[#0a0a0b] border-white/5 hover:border-white/10 text-gray-300'
                      }`}
                    >
                      {months}m
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-mono uppercase tracking-widest text-gray-500 mb-4 block">
                  Risk Appetite
                </label>
                <div className="flex gap-3">
                  {[
                    { value: 'low', label: 'Low' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'high', label: 'High' },
                  ].map(risk => (
                    <button
                      key={risk.value}
                      onClick={() => setProfile({ ...profile, riskAppetite: risk.value as 'low' | 'medium' | 'high' })}
                      className={`flex-1 px-4 py-2 rounded-lg border font-medium text-sm transition-all ${
                        profile.riskAppetite === risk.value
                          ? 'bg-brand-500/15 border-brand-400/50 text-brand-300'
                          : 'bg-[#0a0a0b] border-white/5 text-gray-300 hover:border-white/10'
                      }`}
                    >
                      {risk.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-mono uppercase tracking-widest text-gray-500 mb-4 block">
                  Preferred Business Models (select at least 1)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {BUSINESS_MODELS.map(model => (
                    <button
                      key={model}
                      onClick={() => toggleArrayField('preferredBusinessModels', model)}
                      className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all text-left ${
                        profile.preferredBusinessModels?.includes(model)
                          ? 'bg-brand-500/20 border-brand-400/50 text-brand-200'
                          : 'bg-[#0a0a0b] border-white/5 text-gray-400 hover:border-white/10'
                      }`}
                    >
                      {model}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-mono uppercase tracking-widest text-gray-500 mb-4 block">
                  Regulatory Tolerance
                </label>
                <div className="flex gap-3">
                  {[
                    { value: 'low', label: 'Low', description: 'Prefer highly regulated spaces' },
                    { value: 'medium', label: 'Medium', description: 'okay with some regulation' },
                    { value: 'high', label: 'High', description: 'Can handle complex/gray areas' },
                  ].map(tolerance => (
                    <button
                      key={tolerance.value}
                      onClick={() => setProfile({ ...profile, regulatoryTolerance: tolerance.value as 'low' | 'medium' | 'high' })}
                      className={`flex-1 p-3 rounded-lg border transition-all text-center ${
                        profile.regulatoryTolerance === tolerance.value
                          ? 'bg-brand-500/15 border-brand-400/50'
                          : 'bg-[#0a0a0b] border-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className="font-medium text-xs">{tolerance.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-mono uppercase tracking-widest text-gray-500 mb-4 block">
                  Team Style Preference
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'solo', label: 'Solo founder', description: 'Work independently' },
                    { value: 'cofounder', label: 'Cofounder partnership', description: 'Need a strong cofounder' },
                    { value: 'team', label: 'Full team', description: 'Need a larger team' },
                  ].map(style => (
                    <button
                      key={style.value}
                      onClick={() => setProfile({ ...profile, teamStyle: style.value })}
                      className={`w-full p-3 rounded-lg border text-left transition-all ${
                        profile.teamStyle === style.value
                          ? 'bg-brand-500/15 border-brand-400/50'
                          : 'bg-[#0a0a0b] border-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className="font-medium text-sm">{style.label}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{style.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Review & Generate */}
          {currentStep === 5 && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-display font-semibold text-white mb-1">Profile Summary</h3>
                <p className="text-sm text-gray-400 mb-6">Review your profile before generating your best-fit opportunities.</p>
              </div>

              {/* Profile completeness indicator */}
              <div className="bg-black/30 border border-white/5 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono text-gray-400">Profile Completeness</span>
                  <span className="text-sm font-mono font-bold text-brand-300">{completionPercent}%</span>
                </div>
                <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-500 transition-all" style={{ width: `${completionPercent}%` }} />
                </div>
              </div>

              {/* Summary sections */}
              <div className="space-y-4">
                {profile.primaryRole && (
                  <div className="bg-[#0a0a0b] border border-white/5 rounded-lg p-4">
                    <div className="text-xs font-mono text-gray-500 mb-2">Operating Background</div>
                    <div className="space-y-1 text-sm text-gray-300">
                      <div>• <span className="text-white font-medium">{PRIMARY_ROLES.find(r => r.value === profile.primaryRole)?.label}</span></div>
                      {profile.yearsExperience && <div>• <span className="text-white font-medium">{profile.yearsExperience} years experience</span></div>}
                      {profile.functionalStrengths && profile.functionalStrengths.length > 0 && (
                        <div>• Strengths: {profile.functionalStrengths.join(', ')}</div>
                      )}
                      {profile.industriesWorkedIn && profile.industriesWorkedIn.length > 0 && (
                        <div>• Industries: {profile.industriesWorkedIn.join(', ')}</div>
                      )}
                    </div>
                  </div>
                )}

                {profile.preferredRegions && profile.preferredRegions.length > 0 && (
                  <div className="bg-[#0a0a0b] border border-white/5 rounded-lg p-4">
                    <div className="text-xs font-mono text-gray-500 mb-2">Market Access</div>
                    <div className="space-y-1 text-sm text-gray-300">
                      {profile.preferredRegions.length > 0 && <div>• Regions: {profile.preferredRegions.join(', ')}</div>}
                      {profile.countriesKnownWell && profile.countriesKnownWell.length > 0 && <div>• Countries: {profile.countriesKnownWell.join(', ')}</div>}
                      {profile.languagesSpoken && profile.languagesSpoken.length > 0 && <div>• Languages: {profile.languagesSpoken.join(', ')}</div>}
                    </div>
                  </div>
                )}

                {profile.technicalAbility && (
                  <div className="bg-[#0a0a0b] border border-white/5 rounded-lg p-4">
                    <div className="text-xs font-mono text-gray-500 mb-2">Build & Distribution Capacity</div>
                    <div className="space-y-1 text-sm text-gray-300">
                      <div>• Technical: <span className="text-white font-medium">{profile.technicalAbility}</span></div>
                      {profile.distributionStrengths && profile.distributionStrengths.length > 0 && <div>• Distribution: {profile.distributionStrengths.join(', ')}</div>}
                    </div>
                  </div>
                )}

                {profile.capitalAvailable && (
                  <div className="bg-[#0a0a0b] border border-white/5 rounded-lg p-4">
                    <div className="text-xs font-mono text-gray-500 mb-2">Constraints & Preferences</div>
                    <div className="space-y-1 text-sm text-gray-300">
                      <div>• Capital: <span className="text-white font-medium">{profile.capitalAvailable}</span></div>
                      {profile.riskAppetite && <div>• Risk appetite: <span className="text-white font-medium">{profile.riskAppetite}</span></div>}
                      {profile.preferredBusinessModels && profile.preferredBusinessModels.length > 0 && <div>• Models: {profile.preferredBusinessModels.join(', ')}</div>}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-brand-500/10 border border-brand-500/20 rounded-lg p-4">
                <p className="text-sm text-brand-100">
                  <span className="font-semibold">Next step:</span> We'll use this profile to match you with your best-fit opportunities and explain why each one works for your situation.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER CONTROLS */}
        <div className="flex justify-between items-center gap-4">
          <div className="flex gap-3">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="px-6 py-3 rounded-lg border border-white/10 text-white font-medium hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              ← Back
            </button>
            <button
              onClick={() => setShowSavePrompt(true)}
              className="px-6 py-3 rounded-lg bg-[#222] hover:bg-[#333] border border-white/10 text-white font-medium transition-all text-sm"
            >
              Save & Continue Later
            </button>
          </div>

          <button
            onClick={handleNext}
            className="px-8 py-3 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-brand-500/20"
          >
            {currentStep === 5 ? 'Generate My Best-Fit Opportunities' : 'Continue →'}
          </button>
        </div>

        {/* SAVE PROMPT */}
        {showSavePrompt && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#111113] border border-white/10 rounded-2xl p-8 max-w-md">
              <h3 className="text-lg font-display font-bold text-white mb-2">Save Your Progress</h3>
              <p className="text-sm text-gray-400 mb-6">We'll save your profile and send you an email with a link to continue.</p>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full bg-[#0a0a0b] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 mb-4 focus:outline-none focus:border-brand-400/50 transition-all"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSavePrompt(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-white/10 text-white font-medium hover:border-white/20 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowSavePrompt(false);
                    alert('Profile saved! Check your email for a link to continue.');
                  }}
                  className="flex-1 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold transition-all"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
