'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { PhoneIcon, EnvelopeIcon, HomeIcon, BriefcaseIcon, HeartIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const features = [
    {
      icon: <HomeIcon className="w-12 h-12" />,
      title: "Safe Environment",
      description: "A structured, supportive living space where you can focus on your recovery journey in a substance-free environment."
    },
    {
      icon: <BriefcaseIcon className="w-12 h-12" />,
      title: "Employment Support",
      description: "We help residents build a path to stable employment, providing guidance and resources for career development."
    },
    {
      icon: <HeartIcon className="w-12 h-12" />,
      title: "Supportive Community",
      description: "Connect with peers who understand your journey and build meaningful relationships that support long-term recovery."
    },
    {
      icon: <ShieldCheckIcon className="w-12 h-12" />,
      title: "MAT Supportive",
      description: "We welcome and support residents using Medication Assisted Treatment (MAT) as part of their recovery plan."
    }
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-600 text-white py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight font-poppins tracking-tight">
              Your Journey to Recovery<br/>Starts Here
            </h1>
            <p className="text-lg md:text-xl mb-10 text-emerald-50 max-w-3xl mx-auto font-light leading-relaxed">
              A supportive community dedicated to helping you build a fulfilling life in recovery. Whether you're exploring recovery, supporting a loved one, or a professional helping someone find housing, we're here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg">
                Start Your Intake
              </Link>
              <Link href="/about" className="bg-white text-blue-900 hover:bg-blue-50 px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg">
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-6 font-poppins">Welcome to Crossroads</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              At Crossroads Sober Living, we provide more than just housing—we offer a pathway to transformation with structured support for employment, community, and housing stability.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-800 to-blue-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Take the Next Step?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Our team is here to answer your questions and guide you through the intake process.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="bg-green-600 hover:bg-green-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105">
              Contact Us Today
            </Link>
            <a href="tel:+15073981970" className="bg-white text-emerald-900 hover:bg-emerald-50 px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105">
              Call
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
