'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  MapPinIcon,
  UserGroupIcon,
  HeartIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  HomeIcon,
  BriefcaseIcon,
  PhoneIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Crossroads Sober Living',
  description:
    "Men's sober living and recovery housing in Rochester, Minnesota. MAT-supportive, structured, and affordable.",
  url: 'https://www.crossroads-soberliving.com',
  telephone: '+15073981970',
  email: 'joe@crossroads-soberliving.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Rochester',
    addressRegion: 'MN',
    addressCountry: 'US',
  },
  areaServed: {
    '@type': 'City',
    name: 'Rochester',
    sameAs: 'https://en.wikipedia.org/wiki/Rochester,_Minnesota',
  },
  priceRange: '$165-$700/month',
};

export default function Home() {
  const whyCards = [
    {
      icon: <MapPinIcon className="w-10 h-10" />,
      title: 'Rochester-Based',
      description:
        "We're right here in Rochester, MN — close to work, treatment, and the community you're rebuilding in.",
    },
    {
      icon: <UserGroupIcon className="w-10 h-10" />,
      title: "Men's Only",
      description:
        'A focused environment built specifically for men in recovery. No distractions. Peer accountability.',
    },
    {
      icon: <HeartIcon className="w-10 h-10" />,
      title: 'MAT-Supportive',
      description:
        'We fully support Methadone, Suboxone, Vivitrol, and other prescribed medications. Zero judgment.',
    },
    {
      icon: <CurrencyDollarIcon className="w-10 h-10" />,
      title: 'Affordable',
      description:
        'Starting at $165/week or $650/month. Transparent pricing, no hidden fees.',
    },
    {
      icon: <ChartBarIcon className="w-10 h-10" />,
      title: 'Structured Program',
      description:
        'Three phases of growth: employment, community, and housing stability.',
    },
    {
      icon: <HomeIcon className="w-10 h-10" />,
      title: 'Available Now',
      description:
        'Two houses in Rochester with beds available. Call today.',
    },
  ];

  return (
    <main className="min-h-screen">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-slate-900 to-blue-900 text-white py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight font-poppins tracking-tight">
              Men&apos;s Sober Living<br />in Rochester, MN
            </h1>
            <p className="text-lg md:text-xl mb-10 text-blue-100 max-w-3xl mx-auto font-light leading-relaxed">
              A structured, supportive home for men serious about recovery. Two houses available in Rochester, Minnesota.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-lg font-semibold font-poppins text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                Start Your Intake
              </Link>
              <Link
                href="/program"
                className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-4 rounded-lg font-semibold font-poppins text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                Learn About Our Program
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Crossroads Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-poppins">Why Crossroads?</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              We built Crossroads specifically for men in Rochester, MN who are ready to do the work of recovery.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-t-4 border-amber-600"
              >
                <div className="text-amber-600 mb-4">{card.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 font-poppins">{card.title}</h3>
                <p className="text-gray-600 leading-relaxed">{card.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Two Houses Section */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-poppins">Our Two Houses</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Both houses are located in Rochester, MN and include structured house meetings, chore schedules, and peer support.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-xl shadow-md hover:shadow-lg transition-shadow border-t-4 border-amber-600"
            >
              <div className="flex items-center gap-3 mb-4">
                <BriefcaseIcon className="w-8 h-8 text-amber-600" />
                <h3 className="text-2xl font-bold text-gray-900 font-poppins">House A</h3>
              </div>
              <p className="text-gray-600 mb-4">4-bedroom, 2-bath</p>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-amber-600 font-poppins">$650<span className="text-lg font-normal text-gray-600">/month</span></p>
                <p className="text-lg text-gray-600">or $165/week</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white p-10 rounded-xl shadow-md hover:shadow-lg transition-shadow border-t-4 border-amber-600"
            >
              <div className="flex items-center gap-3 mb-4">
                <BriefcaseIcon className="w-8 h-8 text-amber-600" />
                <h3 className="text-2xl font-bold text-gray-900 font-poppins">House B</h3>
              </div>
              <p className="text-gray-600 mb-4">5-bedroom, 2-bath</p>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-amber-600 font-poppins">$700<span className="text-lg font-normal text-gray-600">/month</span></p>
                <p className="text-lg text-gray-600">or $175/week</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Who We Serve Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 font-poppins">Who We Serve</h2>
            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
              Men in Rochester, MN and southeast Minnesota who have completed or are currently in treatment, are on MAT, are transitioning from incarceration, or simply need a safe, sober environment to rebuild their lives. If you&apos;re serious about recovery, there&apos;s a place for you at Crossroads.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Get Started CTA Section */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-poppins">Get Started Today</h2>
          <p className="text-lg md:text-xl mb-10 text-blue-100 font-light leading-relaxed">
            Beds are available now in Rochester, MN. Call us, send an email, or complete the intake form — we typically respond within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/contact"
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-lg font-semibold font-poppins text-lg transition-all transform hover:scale-105"
            >
              Start Your Intake
            </Link>
            <a
              href="tel:+15073981970"
              className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-4 rounded-lg font-semibold font-poppins text-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <PhoneIcon className="w-5 h-5" />
              (507) 398-1970
            </a>
          </div>
          <a
            href="mailto:joe@crossroads-soberliving.com"
            className="inline-flex items-center gap-2 text-blue-200 hover:text-white transition-colors"
          >
            <EnvelopeIcon className="w-5 h-5" />
            joe@crossroads-soberliving.com
          </a>
        </div>
      </section>
    </main>
  );
}
