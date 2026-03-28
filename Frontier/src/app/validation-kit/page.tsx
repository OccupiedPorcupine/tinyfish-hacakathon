'use client';

import React, { useState } from 'react';
import { ValidationKit, ValidationKitRequest } from '@/lib/tinyfish/types';

export default function ValidationKitPage() {
  const [kit, setKit] = useState<ValidationKit | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'questions' | 'communities' | 'signals' | 'export'>('questions');

  // Default example request
  const [request, setRequest] = useState<ValidationKitRequest>({
    category: 'AI SDR tools',
    market: 'Indonesia',
    painArea: 'manual sales outreach',
    targetAudience: 'B2B sales teams',
  });

  const generateKit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/validation-kit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (!response.ok) throw new Error('Failed to generate validation kit');
      const data = await response.json();
      setKit(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const downloadMarkdown = () => {
    if (!kit?.markdownScript) return;
    const blob = new Blob([kit.markdownScript], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `validation-kit-${kit.category.replace(/\s/g, '-').toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyMarkdownToClipboard = () => {
    if (!kit?.markdownScript) return;
    navigator.clipboard.writeText(kit.markdownScript);
    alert('Copied to clipboard!');
  };

  if (!kit) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] text-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h1 className="text-5xl font-display font-bold mb-4">Validation Kit Generator</h1>
            <p className="text-xl text-gray-400">
              Generate targeted validation questions, find your communities, and access pre-validated market signals.
            </p>
          </div>

          <div className="bg-[#111113] border border-white/10 rounded-2xl p-8 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-mono text-gray-500 uppercase tracking-widest mb-2 block">
                  Category
                </label>
                <input
                  type="text"
                  value={request.category}
                  onChange={e => setRequest({ ...request, category: e.target.value })}
                  placeholder="e.g., AI SDR tools"
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-mono text-gray-500 uppercase tracking-widest mb-2 block">
                  Market
                </label>
                <input
                  type="text"
                  value={request.market}
                  onChange={e => setRequest({ ...request, market: e.target.value })}
                  placeholder="e.g., Indonesia"
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="col-span-2">
                <label className="text-sm font-mono text-gray-500 uppercase tracking-widest mb-2 block">
                  Pain Area
                </label>
                <input
                  type="text"
                  value={request.painArea}
                  onChange={e => setRequest({ ...request, painArea: e.target.value })}
                  placeholder="e.g., manual sales outreach"
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="col-span-2">
                <label className="text-sm font-mono text-gray-500 uppercase tracking-widest mb-2 block">
                  Target Audience
                </label>
                <input
                  type="text"
                  value={request.targetAudience}
                  onChange={e => setRequest({ ...request, targetAudience: e.target.value })}
                  placeholder="e.g., B2B sales teams"
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:border-brand-500 focus:outline-none"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-300 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={generateKit}
              disabled={loading}
              className="w-full bg-brand-600 hover:bg-brand-500 disabled:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {loading ? 'Generating...' : 'Generate Validation Kit'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => setKit(null)}
            className="text-gray-400 hover:text-white mb-4 text-sm font-mono"
          >
            ← Back to Generator
          </button>
          <h1 className="text-4xl font-display font-bold mb-2">
            {kit.category} in {kit.market}
          </h1>
          <p className="text-gray-400">
            Validation Kit • Created {new Date(kit.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Quick Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#111113] border border-white/10 rounded-xl p-4">
            <div className="text-[10px] uppercase tracking-widest text-gray-500 font-mono mb-2">
              Pain Signal Strength
            </div>
            <div className="text-3xl font-mono font-bold text-brand-400">
              {kit.painSignalStrength}
            </div>
            <div className="text-xs text-gray-500 mt-2">/ 100</div>
          </div>

          <div className="bg-[#111113] border border-white/10 rounded-xl p-4">
            <div className="text-[10px] uppercase tracking-widest text-gray-500 font-mono mb-2">
              WTP Signals Found
            </div>
            <div className="text-3xl font-mono font-bold text-green-400">
              {kit.willingSample}
            </div>
            <div className="text-xs text-gray-500 mt-2">conversations</div>
          </div>

          <div className="bg-[#111113] border border-white/10 rounded-xl p-4">
            <div className="text-[10px] uppercase tracking-widest text-gray-500 font-mono mb-2">
              Communities
            </div>
            <div className="text-3xl font-mono font-bold text-teal-400">
              {kit.communities.length}
            </div>
            <div className="text-xs text-gray-500 mt-2">to post in</div>
          </div>

          <div className="bg-[#111113] border border-white/10 rounded-xl p-4">
            <div className="text-[10px] uppercase tracking-widest text-gray-500 font-mono mb-2">
              Pre-Validated Signals
            </div>
            <div className="text-3xl font-mono font-bold text-blue-400">
              {kit.preValidatedSignals.length}
            </div>
            <div className="text-xs text-gray-500 mt-2">found online</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-white/5">
          {(['questions', 'communities', 'signals', 'export'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                activeTab === tab
                  ? 'border-brand-500 text-white'
                  : 'border-transparent text-gray-500 hover:text-gray-400'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-[#111113] border border-white/10 rounded-2xl p-8">
          {/* Questions Tab */}
          {activeTab === 'questions' && (
            <div className="space-y-6">
              <div className="text-sm text-gray-400 mb-6">
                8 targeted questions designed to quantify pain, understand workflows, and surface WTP signals.
              </div>
              {kit.validationQuestions.map((q, idx) => (
                <div key={q.id} className="bg-black/30 border border-white/5 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="font-mono font-bold text-white">Q{idx + 1}</div>
                    <span className="text-[10px] uppercase tracking-widest text-brand-400 font-mono">
                      {q.focusArea.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-white font-medium mb-3">{q.question}</p>
                  <p className="text-xs text-gray-400 mb-3">{q.context}</p>
                  <div className="bg-black/50 rounded-lg p-3">
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Strong Signals:</div>
                    <ul className="text-xs text-gray-300 space-y-1">
                      {q.expectedSignals.map((signal, i) => (
                        <li key={i}>✓ {signal}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Communities Tab */}
          {activeTab === 'communities' && (
            <div className="space-y-6">
              <div className="text-sm text-gray-400 mb-6">
                Communities where your target audience hangs out. Primary communities first, then secondary.
              </div>

              <div>
                <h3 className="text-sm font-mono text-brand-400 uppercase tracking-widest mb-3">
                  Primary Communities (Best Response Rate)
                </h3>
                <div className="space-y-2">
                  {kit.communities
                    .filter(c => c.relevance === 'primary')
                    .map(c => (
                      <a
                        key={c.id}
                        href={c.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-black/30 border border-white/5 rounded-lg p-4 hover:border-brand-500/30 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="font-medium text-white">{c.name}</div>
                            <div className="text-xs text-gray-500">{c.description}</div>
                          </div>
                          <span className="text-[10px] bg-green-500/20 text-green-300 px-2 py-1 rounded font-mono">
                            {c.platform}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>{c.memberCount.toLocaleString()} members</span>
                          <span className="text-[10px] bg-white/5 px-2 py-1 rounded">
                            {c.difficulty}
                          </span>
                        </div>
                      </a>
                    ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-mono text-gray-400 uppercase tracking-widest mb-3">
                  Secondary Communities (Backup)
                </h3>
                <div className="space-y-2">
                  {kit.communities
                    .filter(c => c.relevance === 'secondary')
                    .map(c => (
                      <a
                        key={c.id}
                        href={c.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-black/30 border border-white/5 rounded-lg p-4 hover:border-brand-500/30 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="font-medium text-white">{c.name}</div>
                            <div className="text-xs text-gray-500">{c.description}</div>
                          </div>
                          <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-1 rounded font-mono">
                            {c.platform}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>{c.memberCount.toLocaleString()} members</span>
                          <span className="text-[10px] bg-white/5 px-2 py-1 rounded">
                            {c.difficulty}
                          </span>
                        </div>
                      </a>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* Signals Tab */}
          {activeTab === 'signals' && (
            <div className="space-y-6">
              <div className="text-sm text-gray-400 mb-6">
                Pre-validated signals from community discussions. These are real quotes already happening online.
              </div>

              {(['pain_complaint', 'tool_mention', 'wtp_indicator', 'workflow_description'] as const).map(
                category => (
                  <div key={category}>
                    <h3 className="text-sm font-mono text-brand-400 uppercase tracking-widest mb-3">
                      {category === 'pain_complaint'
                        ? '🔴 Pain Signals'
                        : category === 'tool_mention'
                          ? '🔧 Tool Gaps & Current Solutions'
                          : category === 'wtp_indicator'
                            ? '💰 Willingness to Pay & Value'
                            : '📋 Workflow Descriptions'}
                    </h3>
                    <div className="space-y-2">
                      {kit.preValidatedSignals
                        .filter(s => s.category === category)
                        .map(signal => (
                          <div key={signal.id} className="bg-black/30 border border-white/5 rounded-lg p-4">
                            <p className="text-white font-medium mb-2">"{signal.signal}"</p>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-gray-400">{signal.source}</span>
                              <span className="text-xs bg-brand-500/20 text-brand-300 px-2 py-1 rounded">
                                {signal.relevance}% relevant
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">{signal.context}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          {/* Export Tab */}
          {activeTab === 'export' && (
            <div className="space-y-6">
              <div className="text-sm text-gray-400 mb-6">
                Export your validation kit as markdown or JSON for use in your research.
              </div>

              <div className="space-y-4">
                <button
                  onClick={copyMarkdownToClipboard}
                  className="w-full bg-brand-600 hover:bg-brand-500 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  📋 Copy Markdown Interview Script
                </button>

                <button
                  onClick={downloadMarkdown}
                  className="w-full bg-[#222] hover:bg-[#333] border border-white/10 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  ⬇️ Download as .md File
                </button>

                <div className="bg-black/30 border border-white/5 rounded-lg p-4">
                  <div className="text-sm font-mono text-gray-400 uppercase tracking-widest mb-3">JSON Export</div>
                  <pre className="bg-black/50 p-3 rounded text-xs overflow-auto max-h-96 text-gray-300">
                    {JSON.stringify(kit.jsonData, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-xs text-gray-500 text-center">
          Ready to validate? Start by posting in the primary communities above.
        </div>
      </div>
    </div>
  );
}
