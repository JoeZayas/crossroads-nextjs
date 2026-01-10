import Link from 'next/link';
import { PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Crossroads Sober Living</h3>
            <p className="text-slate-300">Building pathways to recovery, stability, and fulfillment.</p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-slate-300 hover:text-amber-600 transition-colors">Home</Link></li>
              <li><Link href="/about" className="text-slate-300 hover:text-amber-600 transition-colors">About</Link></li>
              <li><Link href="/program" className="text-slate-300 hover:text-amber-600 transition-colors">Our Program</Link></li>
              <li><Link href="/contact" className="text-slate-300 hover:text-amber-600 transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <PhoneIcon className="h-5 w-5" />
                <a href="tel:+15073981970" className="text-slate-300 hover:text-amber-600 transition-colors font-semibold">
                  Call
                </a>
              </li>
              <li className="flex items-center gap-2">
                <EnvelopeIcon className="h-5 w-5" />
                <a href="mailto:joe@crossroads-soberliving.com" className="text-slate-300 hover:text-amber-600 transition-colors">
                  joe@crossroads-soberliving.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-700 pt-8 text-center text-slate-300">
          <p>&copy; 2026 Crossroads Sober Living. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
