'use client';

import Link from 'next/link';
import { PhoneIcon, EnvelopeIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

export default function Contact() {
  return (
    <main className="min-h-screen">
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Contact & Intake</h1>
          <p className="text-xl text-blue-100">Start your journey to recovery today</p>
        </div>
      </div>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Get In Touch</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition-all transform hover:-translate-y-2">
              <PhoneIcon className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Phone</h3>
              <p className="text-gray-600 mb-4">Call us anytime for immediate assistance</p>
              <a href="tel:+15073981970" className="text-emerald-600 font-semibold text-xl hover:text-emerald-700">
                Call
              </a>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition-all transform hover:-translate-y-2">
              <EnvelopeIcon className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Email</h3>
              <p className="text-gray-600 mb-4">Send us a message and we'll respond promptly</p>
              <a href="mailto:joe@crossroads-soberliving.com" className="text-emerald-600 font-semibold hover:text-emerald-700 break-all">
                joe@crossroads-soberliving.com
              </a>
            </div>

            <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 p-8 rounded-xl shadow-lg text-center text-white hover:shadow-xl transition-all transform hover:-translate-y-2">
              <DocumentTextIcon className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Intake Form</h3>
              <p className="mb-6">Complete our confidential questionnaire</p>
              <Link 
                href="/intake"
                className="inline-block bg-white text-emerald-700 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors"
              >
                Start Intake Form →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
