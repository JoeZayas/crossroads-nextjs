'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Program() {
  const pillars = [
    {
      num: '1',
      title: 'Stable Employment',
      items: ['Resume building', 'Job search assistance', 'Financial literacy', 'Career planning'],
      context:
        "Rochester's economy offers real opportunities — we help you access them with resume support, job search assistance, and financial literacy coaching.",
    },
    {
      num: '2',
      title: 'Supportive Community',
      items: ['Peer support', 'House meetings', 'Recovery resources', 'Mentorship'],
      context:
        'Our Rochester houses run regular house meetings, connect residents to local recovery resources, and build the peer accountability that makes sobriety stick.',
    },
    {
      num: '3',
      title: 'Housing Pathways',
      items: ['Credit building', 'Savings plans', 'Housing search', 'Homebuyer education'],
      context:
        'We help residents in Rochester plan for what comes next — credit building, savings strategies, and connecting to local housing resources.',
    },
  ];

  const phases = [
    {
      phase: 'Phase 1',
      duration: 'Months 1–2',
      label: 'Stabilization',
      desc: 'Settle in, establish routines, attend required meetings, and secure or maintain employment.',
    },
    {
      phase: 'Phase 2',
      duration: 'Months 3–4',
      label: 'Growth',
      desc: 'Build savings, take on house responsibilities, and engage more deeply with the community.',
    },
    {
      phase: 'Phase 3',
      duration: 'Month 5+',
      label: 'Independence',
      desc: 'Transition planning, housing search, and full preparation for independent living.',
    },
  ];

  return (
    <main className="min-h-screen">
      <div className="bg-gradient-to-r from-slate-900 to-blue-900 text-white py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6 font-poppins tracking-tight leading-tight">
            Our Recovery Program<br />— Men&apos;s Sober Living Rochester, MN
          </h1>
          <p className="text-lg md:text-xl text-blue-100 font-light">
            A comprehensive approach to recovery and life transformation
          </p>
        </div>
      </div>

      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mx-auto mb-16">
            <p className="text-lg text-gray-700 leading-relaxed font-light">
              At Crossroads Sober Living in Rochester, Minnesota, we believe recovery is about more than staying sober — it&apos;s about rebuilding your life. Our structured three-phase program gives men the tools, accountability, and support to achieve lasting independence.
            </p>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16 font-poppins">Three Pillars of Success</h2>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {pillars.map((pillar, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-white p-10 rounded-xl shadow-md hover:shadow-lg transition-shadow border-t-4 border-amber-600"
              >
                <div className="w-16 h-16 bg-amber-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mb-6 font-poppins">
                  {pillar.num}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 font-poppins">{pillar.title}</h3>
                <p className="text-gray-600 font-light leading-relaxed mb-6">{pillar.context}</p>
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

          {/* Program Phases */}
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12 font-poppins">Program Phases</h2>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {phases.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-slate-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-amber-600 font-bold text-sm uppercase tracking-wide mb-1">{p.phase}</div>
                <div className="text-gray-500 text-sm mb-3">{p.duration}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 font-poppins">{p.label}</h3>
                <p className="text-gray-700 font-light leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* MAT Support */}
          <div className="bg-blue-50 border-l-4 border-amber-600 p-10 rounded-r-xl mb-16">
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
            <Link
              href="/contact"
              className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 rounded-lg font-semibold text-lg font-poppins transition-all transform hover:scale-105 shadow-lg"
            >
              Start Your Intake
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
