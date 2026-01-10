'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Our Program', href: '/program' },
    { name: 'Contact & Intake', href: '/contact' },
    { name: 'House Guidelines', href: '/contract' },
  ];

  return (
    <nav className="bg-emerald-50 border-b border-emerald-200 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image
              src="/assets/images/crossroads_sober_living_logo.png"
              alt="Crossroads Sober Living Logo"
              width={48}
              height={48}
              className="h-12 w-auto"
            />
            <span className="text-xl font-bold text-emerald-900 hidden sm:inline">Crossroads Sober Living</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-emerald-800 hover:text-emerald-600 hover:bg-emerald-100 px-4 py-2 rounded-lg transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2"
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-emerald-100 py-4 px-4 space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block text-emerald-800 hover:bg-emerald-200 px-4 py-3 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
