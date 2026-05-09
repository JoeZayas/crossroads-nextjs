'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function About() {
  return (
    <main className="min-h-screen">
      <div className="bg-gradient-to-r from-slate-900 to-blue-900 text-white py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6 font-poppins tracking-tight leading-tight">
            About Crossroads Sober Living<br />— Rochester, MN
          </h1>
          <p className="text-lg md:text-xl text-blue-100 font-light">
            Building a foundation for lasting recovery and personal growth in southeast Minnesota
          </p>
        </div>
      </div>

      <section className="py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 font-poppins">Our Mission</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-16 font-light">
            Crossroads Sober Living is a men&apos;s recovery housing organization based in Rochester, Minnesota. We provide structured, affordable sober living for men who are committed to recovery from alcohol and substance use disorders. Our mission is to help men in Rochester and southeast Minnesota build the foundation they need for lasting sobriety: stable employment, a supportive community, and a clear path to independent housing.
          </p>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 font-poppins">Our Core Values</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {[
              {
                title: 'Compassion',
                desc: 'We understand that recovery is a journey. Every resident is treated with dignity, respect, and understanding — no matter where they are in their story.',
              },
              {
                title: 'Accountability',
                desc: 'We believe in personal responsibility and provide the structured support that makes accountability achievable, not punishing.',
              },
              {
                title: 'Community',
                desc: 'Recovery thrives in connection. We foster a supportive environment where men hold each other up and build real relationships.',
              },
              {
                title: 'Empowerment',
                desc: 'We provide tools and resources to help residents build independent lives — not dependence on the program, but readiness to move forward.',
              },
              {
                title: 'Evidence-Based',
                desc: 'We support MAT and other proven recovery methods backed by science. Our approach reflects what the research actually shows works.',
              },
              {
                title: 'Holistic Growth',
                desc: 'We address employment, housing, health, and personal development — because lasting recovery requires more than one thing to go right.',
              },
            ].map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border-l-4 border-amber-600 p-8 shadow-md rounded-r-lg hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-3 font-poppins">{value.title}</h3>
                <p className="text-gray-700 font-light leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Serving Rochester section */}
          <div className="bg-slate-50 border-l-4 border-amber-600 p-10 rounded-r-xl mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-poppins">
              Serving Rochester and Southeast Minnesota
            </h2>
            <p className="text-lg text-gray-700 font-light leading-relaxed">
              Located in Rochester, MN, Crossroads Sober Living serves men from Olmsted County and the surrounding region including Dodge, Fillmore, and Winona counties. We work closely with local treatment providers, outpatient programs, and court systems to ensure seamless transitions into our homes.
            </p>
          </div>

          {/* MAT Supportive section */}
          <div className="bg-blue-50 border-l-4 border-amber-600 p-10 rounded-r-xl mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-poppins">MAT Supportive Environment</h2>
            <p className="text-lg text-gray-700 mb-4 font-light leading-relaxed">
              Crossroads is proud to be one of Rochester&apos;s MAT-supportive sober living options. We recognize that Medication Assisted Treatment is an evidence-based approach to treating substance use disorders.
            </p>
            <p className="text-gray-700 font-light leading-relaxed">
              We welcome residents using Methadone, Buprenorphine (Suboxone), Naltrexone (Vivitrol), and other prescribed medications for substance use disorders — without judgment, full stop.
            </p>
          </div>

          <div className="text-center">
            <Link
              href="/contact"
              className="inline-block bg-amber-600 hover:bg-amber-700 text-white px-10 py-4 rounded-lg font-semibold text-lg font-poppins transition-all transform hover:scale-105 shadow-lg"
            >
              Start Your Intake
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
