import Link from "next/link";
import { Card } from "@/components/ui/Card";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4">
      
      {/* Hero Section */}
      <section className="relative w-full max-w-5xl mx-auto pt-20 pb-32 flex flex-col items-center text-center z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-400 mb-8 font-medium font-sans">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
          </span>
          Powered by TinyFish LLM Intelligence
        </div>

        <h1 className="text-5xl md:text-7xl font-bold font-display tracking-tight text-white mb-6 max-w-4xl leading-tight">
          Find your next startup <br className="hidden md:block" />
          <span className="gradient-text">Window of Opportunity</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-12 font-sans font-light leading-relaxed">
          Frontier compares mature source markets like the US & India with emerging target markets like SEA to identify statistically validated whitespace for your next big idea.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link href="/" className="px-8 py-4 rounded-full bg-brand-600 hover:bg-brand-500 text-white font-semibold text-lg transition-all shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:-translate-y-0.5">
            Launch Platform
          </Link>
          <Link href="/scan" className="px-8 py-4 rounded-full bg-dark-800 hover:bg-dark-700 border border-white/10 text-white font-semibold text-lg transition-all hover:border-white/20">
            View Live Demo
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="w-full max-w-6xl mx-auto py-20 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card gradient className="group hover:-translate-y-1 transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-6 group-hover:bg-brand-500/20 transition-colors">
            <svg className="w-6 h-6 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-display font-semibold text-white mb-3">Gap Radar</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Scan thousands of signals to cross-reference mature patterns against emerging market deficits and pinpoint precise launch trajectories.
          </p>
        </Card>
        <Card className="group hover:-translate-y-1 transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
            <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-display font-semibold text-white mb-3">Signal Feed</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Real-time market ingestion across funding rounds, competitor hiring, and regulatory shifts that indicate an opportunity window opening.
          </p>
        </Card>
        <Card className="group hover:-translate-y-1 transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors">
            <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-xl font-display font-semibold text-white mb-3">Pattern Migration</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Historical correlation metrics mapping successful category transfers mapped directly onto your startup concept.
          </p>
        </Card>
      </section>

    </div>
  );
}
