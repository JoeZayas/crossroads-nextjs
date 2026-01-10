'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Program() {
  const pillars = [
    {
      num: "1",
      title: "Stable Employment",
      items: ["Resume building", "Job search assistance", "Financial literacy", "Career planning"]
    },
    {
      num: "2",
      title: "Supportive Community",
      items: ["Peer support", "House meetings", "Recovery resources", "Mentorship"]
    },
    {
      num: "3",
      title: "Housing Pathways",
      items: ["Credit building", "Savings plans", "Housing search", "Homebuyer education"]
    }
  ];

  return (
    <main className="min-h-screen">
      <div className="bg-gradient-to-r from-emerald-800 to-teal-700 text-white py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6 font-poppins tracking-tight leading-tight">Our Program</h1>
          <p className="text-lg md:text-xl text-emerald-50 font-light">A comprehensive approach to recovery and life transformation</p>
        </div>
      </div>

      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-center text-gray-900 mb-16 font-poppins">Three Pillars of Success</h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {pillars.map((pillar, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-white p-10 rounded-xl shadow-md hover:shadow-lg transition-shadow border-t-4 border-emerald-600"
              >
                <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mb-6 font-poppins">
                  {pillar.num}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 font-poppins">{pillar.title}</h3>
                <ul className="space-y-3">
                  {pillar.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-3 text-gray-700 font-light">
                      <span className="text-green-600">✓</span> {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <div className="bg-emerald-50 border-l-4 border-emerald-600 p-10 rounded-r-xl mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-poppins">MAT Support</h2>
            <p className="text-lg text-gray-700 mb-6 font-light leading-relaxed">
              At Crossroads, we fully support residents participating in MAT programs. We understand that MAT is an evidence-based approach that significantly improves recovery outcomes.
            </p>
            <ul className="space-y-3 text-gray-700 font-light">
              <li className="flex items-center gap-3"><span className="text-emerald-600 font-bold">✓</span> Judgment-free environment</li>
              <li className="flex items-center gap-3"><span className="text-emerald-600 font-bold">✓</span> Medication compliance assistance</li>
              <li className="flex items-center gap-3"><span className="text-emerald-600 font-bold">✓</span> Transportation coordination</li>
              <li className="flex items-center gap-3"><span className="text-emerald-600 font-bold">✓</span> Secure medication storage</li>
            </ul>
          </div>

          <div className="text-center">
            <Link href="/contact" className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 rounded-lg font-semibold text-lg font-poppins transition-all transform hover:scale-105 shadow-lg">
              Start Your Intake
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
