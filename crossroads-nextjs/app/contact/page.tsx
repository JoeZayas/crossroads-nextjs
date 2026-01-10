'use client';

import Link from 'next/link';
import { PhoneIcon, EnvelopeIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

export default function Contact() {
  return (
    <main className="min-h-screen">
      <div className="bg-gradient-to-r from-slate-900 to-blue-900 text-white py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6 font-poppins tracking-tight leading-tight">Contact & Intake</h1>
          <p className="text-lg md:text-xl text-blue-100 font-light">Start your journey to recovery today. We're here to help every step of the way.</p>
        </div>
      </div>

      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-center text-gray-900 mb-4 font-poppins">Get In Touch</h2>
          <p className="text-lg text-center text-gray-700 mb-16 font-light leading-relaxed max-w-2xl mx-auto">Whether you're interested in learning more about our program, starting the intake process, or have questions about how we can support your recovery journey—we're here to help.</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-xl shadow-md hover:shadow-lg transition-shadow border-t-4 border-amber-600 text-center">
              <PhoneIcon className="w-16 h-16 text-amber-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-3 font-poppins text-slate-900">Phone</h3>
              <p className="text-slate-700 mb-6 font-light leading-relaxed">Call us anytime for immediate assistance and answers to your questions</p>
              <a href="tel:+15073981970" className="text-amber-600 font-semibold text-lg hover:text-amber-700 transition-colors">
                Call
              </a>
            </div>

            <div className="bg-white p-10 rounded-xl shadow-md hover:shadow-lg transition-shadow border-t-4 border-amber-600 text-center">
              <EnvelopeIcon className="w-16 h-16 text-amber-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-3 font-poppins text-slate-900">Email</h3>
              <p className="text-slate-700 mb-6 font-light leading-relaxed">Send us a message and we'll respond promptly during business hours</p>
              <a href="mailto:joe@crossroads-soberliving.com" className="text-amber-600 font-semibold hover:text-amber-700 transition-colors break-all">
                joe@crossroads-soberliving.com
              </a>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-blue-900 p-10 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center text-white">
              <DocumentTextIcon className="w-16 h-16 mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-3 font-poppins">Intake Form</h3>
              <p className="mb-8 font-light leading-relaxed">Complete our confidential questionnaire to begin the intake process</p>
              <Link 
                href="/intake"
                className="inline-block bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-semibold font-poppins transition-colors"
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
