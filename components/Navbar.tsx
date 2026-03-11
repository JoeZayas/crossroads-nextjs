'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Our Program', href: '/program' },
    { name: 'Contact & Intake', href: '/contact' },
    { name: 'House Guidelines', href: '/contract' },
  ];

  // Close menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Close menu on Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-md" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-slate-500 rounded"
            aria-label="Crossroads Sober Living — Home"
          >
            <img
              src="/assets/images/crossroads_sober_living_logo.png"
              alt=""
              aria-hidden="true"
              className="h-20 w-auto"
            />
            <span className="text-xl font-bold text-slate-900 hidden sm:inline">Crossroads Sober Living</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex gap-6">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 ${
                    isActive
                      ? 'text-amber-600 bg-amber-50 font-semibold'
                      : 'text-slate-700 hover:text-amber-600 hover:bg-amber-50'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            className="lg:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`lg:hidden bg-slate-50 py-4 px-4 space-y-2 ${mobileMenuOpen ? 'block' : 'hidden'}`}
        aria-hidden={!mobileMenuOpen}
      >
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={`block px-4 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 ${
                isActive
                  ? 'bg-amber-100 text-amber-700 font-semibold'
                  : 'text-slate-700 hover:bg-amber-100 hover:text-amber-600'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
