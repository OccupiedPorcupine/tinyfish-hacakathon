'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validation
      if (!formData.name || !formData.email || !formData.password) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      // Set auth token and redirect to onboard
      document.cookie = `auth-token=${formData.email}; path=/; max-age=2592000`; // 30 days

      // Redirect to founder profile onboard
      router.push('/founder-fit/onboard');
    } catch (err) {
      setError('Failed to create account. Please try again.');
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

        {/* Sign Up Card */}
        <div className="bg-[#111113] border border-white/10 rounded-2xl p-8 mb-6">
          <h2 className="text-2xl font-display font-bold text-white mb-1">Create Your Account</h2>
          <p className="text-sm text-gray-400 mb-8">Find your founder-fit opportunities in emerging markets</p>

          <form onSubmit={handleSignUp} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full bg-[#0a0a0b] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-400/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="founder@example.com"
                className="w-full bg-[#0a0a0b] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-400/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-[#0a0a0b] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-400/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-[#0a0a0b] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-400/50 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors mt-6"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/5">
            <p className="text-sm text-gray-400 text-center">
              Already have an account?{' '}
              <Link href="/signin" className="text-brand-400 hover:text-brand-300 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-3 text-xs text-gray-500">
          <p>✓ Access to founder-fit matching engine</p>
          <p>✓ Personalized opportunity recommendations</p>
          <p>✓ Market and founder profile analysis</p>
        </div>
      </div>
    </div>
  );
}
