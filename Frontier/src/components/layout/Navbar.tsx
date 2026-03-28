'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Dashboard', href: '/' },
    { name: 'Run Scan', href: '/scan' },
    { name: 'Markets', href: '/markets' },
    { name: 'Founder Fit', href: '/founder-fit' },
    { name: 'Funding Feed', href: '/feed' },
    { name: 'Saved', href: '/saved' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-dark-900/80 backdrop-blur-xl">
      <div className="flex h-16 items-center px-4 md:px-8 mx-auto max-w-7xl">
        <div className="flex items-center gap-2 mr-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-600 to-brand-500 flex items-center justify-center text-white font-bold font-display shadow-lg shadow-brand-500/20">
            G
          </div>
          <Link href="/" className="text-xl font-bold font-display tracking-tight hover:text-brand-100 transition-colors">
            GeoGap
          </Link>
        </div>

        <div className="hidden md:flex gap-6">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive ? 'text-brand-500' : 'text-gray-400 hover:text-gray-100'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        <div className="ml-auto flex items-center gap-4">
          <button className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
            Sign In
          </button>
          <button className="text-sm font-semibold bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-full transition-all shadow-lg shadow-brand-500/20">
            Start Scanning
          </button>
        </div>
      </div>
    </nav>
  );
}
