'use client';

import { motion } from 'framer-motion';

export default function About() {
  return (
    <main className="min-h-screen">
      <div className="bg-gradient-to-r from-slate-900 to-blue-900 text-white py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6 font-poppins tracking-tight leading-tight">About Crossroads<br/>Sober Living</h1>
          <p className="text-lg md:text-xl text-blue-100 font-light">Building a foundation for lasting recovery and personal growth</p>
        </div>
      </div>

      <section className="py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 font-poppins">Our Mission</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-16 font-light">
            At Crossroads Sober Living, our mission is to facilitate the transition from a life of addiction to a fulfilling life through a comprehensive program that helps residents get on a path to stable employment, supportive community, and the beginnings of home ownership or stable housing.
          </p>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 font-poppins">Our Core Values</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {[
              {title: "Compassion", desc: "We understand that recovery is a journey. Every resident is treated with dignity, respect, and understanding."},
              {title: "Accountability", desc: "We believe in personal responsibility and provide structured support."},
              {title: "Community", desc: "Recovery thrives in connection. We foster a supportive environment."},
              {title: "Empowerment", desc: "We provide tools and resources to help residents build independent lives."},
              {title: "Evidence-Based", desc: "We support MAT and other proven recovery methods backed by science."},
              {title: "Holistic Growth", desc: "We address employment, housing, health, and personal development."}
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

          <div className="bg-blue-50 border-l-4 border-amber-600 p-10 rounded-r-xl mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-poppins">MAT Supportive Environment</h2>
            <p className="text-lg text-gray-700 mb-4 font-light leading-relaxed">
              Crossroads Sober Living is proud to be a MAT-supportive facility. We recognize that Medication Assisted Treatment is an evidence-based approach to treating substance use disorders.
            </p>
            <p className="text-gray-700 font-light leading-relaxed">
              We welcome residents using medications such as Methadone, Buprenorphine (Suboxone), Naltrexone (Vivitrol), and other prescribed medications for substance use disorders.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
