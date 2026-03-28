'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // For demo purposes, accept any email/password
      // In production, this would call an API to verify credentials
      if (!email || !password) {
        setError('Please enter email and password');
        setLoading(false);
        return;
      }

      // Set auth token in cookie
      document.cookie = `auth-token=${email}; path=/; max-age=2592000`; // 30 days

      // Redirect to original destination or dashboard
      router.push(redirect);
    } catch (err) {
      setError('Failed to sign in. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0a0a0b] min-h-screen flex items-center justify-center px-4 selection:bg-brand-500/30">
      <div className="w-full max-w-md">
        {/* Logo / Branding */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-display font-bold text-white mb-2">GeoGap</h1>
          <p className="text-gray-400 text-sm">Founder-fit startup opportunities</p>
        </div>

        {/* Sign In Card */}
        <div className="bg-[#111113] border border-white/10 rounded-2xl p-8 mb-6">
          <h2 className="text-2xl font-display font-bold text-white mb-1">Sign In</h2>
          <p className="text-sm text-gray-400 mb-8">Access your founder profile and best-fit opportunities</p>

          <form onSubmit={handleSignIn} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="founder@example.com"
                className="w-full bg-[#0a0a0b] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-400/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0a0a0b] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-400/50 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors mt-6"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/5">
            <p className="text-sm text-gray-400 text-center">
              Don't have an account?{' '}
              <Link href="/signup" className="text-brand-400 hover:text-brand-300 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Demo Notice */}
        <div className="bg-brand-500/10 border border-brand-500/20 rounded-lg p-4 text-xs text-brand-200">
          <p className="font-medium mb-1">Demo Mode</p>
          <p>Use any email and password to sign in for testing.</p>
        </div>
      </div>
    </div>
  );
}
