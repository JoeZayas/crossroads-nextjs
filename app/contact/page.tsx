'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { PhoneIcon, EnvelopeIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        message: formData.get('message') as string,
      };

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message');
      }

      setSubmitted(true);
    } catch (err) {
      console.error('Submission error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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

      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4 font-poppins">Send Us a Message</h2>
          <p className="text-lg text-center text-gray-700 mb-12 font-light leading-relaxed">Have a question? Fill out the form below and we'll get back to you as soon as we can.</p>

          {submitted ? (
            <div role="status" className="bg-green-50 border-2 border-green-600 p-8 rounded-xl text-center">
              <h3 className="text-2xl font-bold text-green-800 mb-3 font-poppins">Thank You!</h3>
              <p className="text-gray-700">
                Your message has been sent. A member of our team will get back to you soon. If you need immediate assistance, please <a href="tel:+15073981970" className="text-amber-600 font-semibold hover:text-amber-700">call us</a>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-xl shadow-md border-t-4 border-amber-600">
              {error && (
                <div role="alert" className="mb-6 bg-red-50 border-2 border-red-500 p-4 rounded-lg">
                  <p className="text-red-800 font-semibold">{error}</p>
                </div>
              )}

              <div className="mb-6">
                <label htmlFor="contact-name" className="block text-slate-900 font-semibold mb-2">
                  Name <span className="text-red-600" aria-hidden="true">*</span>
                </label>
                <input
                  type="text"
                  id="contact-name"
                  name="name"
                  required
                  autoComplete="name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="contact-email" className="block text-slate-900 font-semibold mb-2">
                    Email <span className="text-red-600" aria-hidden="true">*</span>
                  </label>
                  <input
                    type="email"
                    id="contact-email"
                    name="email"
                    required
                    autoComplete="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="contact-phone" className="block text-slate-900 font-semibold mb-2">
                    Phone <span className="text-gray-500 font-normal">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    id="contact-phone"
                    name="phone"
                    autoComplete="tel"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mb-8">
                <label htmlFor="contact-message" className="block text-slate-900 font-semibold mb-2">
                  Message <span className="text-red-600" aria-hidden="true">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 disabled:cursor-not-allowed text-white px-8 py-4 rounded-lg font-semibold font-poppins text-lg transition-colors"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
