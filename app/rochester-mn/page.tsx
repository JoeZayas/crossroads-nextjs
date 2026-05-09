import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Men's Sober Living Rochester MN | Crossroads Sober Living",
  description:
    "Looking for men's sober living in Rochester, MN? Crossroads Sober Living offers structured, affordable recovery housing for men in Rochester, Minnesota. MAT-supportive. Call (507) 398-1970.",
};

const faqs = [
  {
    q: 'How much does sober living cost in Rochester, MN?',
    a: 'At Crossroads, pricing starts at $165/week or $650/month for House A, and $175/week or $700/month for House B. We offer both weekly and monthly payment options. There are no hidden fees.',
  },
  {
    q: 'Do I need to be in treatment to live at a sober house in Rochester?',
    a: 'No. While many of our residents are in or have recently completed outpatient or inpatient treatment, it is not required. We welcome men who are committed to sobriety and ready to live in a structured, accountable environment.',
  },
  {
    q: 'Is MAT (Methadone, Suboxone) allowed at your Rochester sober house?',
    a: 'Yes. Crossroads Sober Living is fully MAT-supportive. We welcome residents using Methadone, Buprenorphine (Suboxone), Naltrexone (Vivitrol), and other prescribed medications for substance use disorders. We believe MAT is evidence-based and support our residents\' treatment decisions without judgment.',
  },
  {
    q: 'How do I apply for sober living in Rochester, MN?',
    a: 'Call us at (507) 398-1970, email joe@crossroads-soberliving.com, or complete our online intake form. We typically respond within 24 hours.',
  },
  {
    q: "What's the difference between sober living and a halfway house in Minnesota?",
    a: 'Sober living homes like Crossroads are peer-supported, self-pay recovery residences with structured rules and accountability. Halfway houses in Minnesota are often state-funded and tied to the corrections system. Sober living is typically more flexible and open to a broader range of men in recovery.',
  },
  {
    q: 'Where are your sober houses located in Rochester?',
    a: 'We have two houses in Rochester, MN. Exact addresses are provided during the intake process for resident privacy.',
  },
];

export default function RochesterMN() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-900 text-white py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6 font-poppins tracking-tight leading-tight">
            Men&apos;s Sober Living<br />in Rochester, MN
          </h1>
          <p className="text-lg md:text-xl text-blue-100 font-light">
            Structured, affordable recovery housing for men in Rochester, Minnesota
          </p>
        </div>
      </div>

      <section className="py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto">

          {/* Intro */}
          <div className="mb-16">
            <p className="text-lg text-gray-700 leading-relaxed font-light mb-6">
              If you&apos;re searching for men&apos;s sober living in Rochester, MN, Crossroads Sober Living is here. We offer structured, affordable recovery housing specifically for men in Rochester, Minnesota and the surrounding southeast Minnesota region. Whether you&apos;re transitioning from inpatient treatment, completing an outpatient program, or simply need a safe, sober environment to rebuild — Crossroads has a home for you.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed font-light">
              We operate two sober living houses in Rochester, MN, both designed to give men in recovery the structure, accountability, and community they need to stay sober and move forward. Our program supports men at every stage of recovery, including those on MAT (Medication Assisted Treatment).
            </p>
          </div>

          {/* Why Choose Crossroads */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 font-poppins">
              Why Choose Crossroads for Sober Living in Rochester?
            </h2>
            <ul className="space-y-4">
              {[
                'Rochester-based — we know this community, this job market, and these treatment systems',
                'Two houses available with immediate openings',
                'MAT-supportive (Methadone, Suboxone, Vivitrol)',
                'Structured three-phase program',
                'Affordable: from $165/week or $650/month',
                'Men-only environment for focused recovery',
                'Connected to local treatment providers, drug court, and outpatient programs',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-700 text-lg font-light">
                  <span className="text-amber-600 font-bold mt-1">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Rochester Recovery Resources */}
          <div className="bg-slate-50 border-l-4 border-amber-600 p-10 rounded-r-xl mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 font-poppins">
              Rochester, MN Recovery Resources We Work With
            </h2>
            <p className="text-lg text-gray-700 font-light leading-relaxed">
              Crossroads works alongside Rochester&apos;s recovery ecosystem — outpatient programs, drug court coordinators, Olmsted County social services, and peer support organizations — to help residents get connected to every resource available to them. We don&apos;t just provide housing; we help you navigate the full network of support Rochester has to offer.
            </p>
          </div>

          {/* FAQ */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10 font-poppins">
              Frequently Asked Questions — Sober Living in Rochester, MN
            </h2>
            <div className="space-y-8">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 font-poppins">{faq.q}</h3>
                  <p className="text-gray-700 font-light leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-12 rounded-2xl text-center">
            <h2 className="text-3xl font-bold mb-4 font-poppins">Ready to Take the Next Step?</h2>
            <p className="text-blue-100 mb-8 text-lg font-light">
              Beds are available now in Rochester, MN. Call (507) 398-1970 or complete our intake form today.
            </p>
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
