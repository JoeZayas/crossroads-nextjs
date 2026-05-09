import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "FAQ — Men's Sober Living Rochester MN | Crossroads Sober Living",
  description:
    'Answers to common questions about sober living in Rochester, MN. Cost, MAT support, intake process, house rules, and more from Crossroads Sober Living.',
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
    a: "Yes. Crossroads Sober Living is fully MAT-supportive. We welcome residents using Methadone, Buprenorphine (Suboxone), Naltrexone (Vivitrol), and other prescribed medications for substance use disorders. We believe MAT is evidence-based and support our residents' treatment decisions without judgment.",
  },
  {
    q: 'How do I apply for sober living in Rochester, MN?',
    a: 'Call us at (507) 398-1970, email joe@crossroads-soberliving.com, or complete our online intake form at the link below. We typically respond within 24 hours.',
  },
  {
    q: "What's the difference between sober living and a halfway house in Minnesota?",
    a: 'Sober living homes like Crossroads are peer-supported, self-pay recovery residences with structured rules and accountability. Halfway houses in Minnesota are often state-funded and tied to the corrections system. Sober living is typically more flexible and open to a broader range of men in recovery.',
  },
  {
    q: 'Where are your sober houses located in Rochester?',
    a: 'We have two houses in Rochester, MN. Exact addresses are provided during the intake process for resident privacy.',
  },
  {
    q: 'How long can I stay at Crossroads?',
    a: 'There is no fixed maximum stay. Our program has three phases and most residents stay 3–12 months depending on their goals. We work with each resident individually on their transition timeline.',
  },
  {
    q: 'What are the house rules?',
    a: 'All residents must maintain sobriety from non-prescribed substances, attend weekly house meetings, fulfill chore responsibilities, maintain employment or be actively seeking work, and treat fellow residents with respect. Full guidelines are available on our House Guidelines page.',
  },
  {
    q: 'Do you accept residents from drug court or probation?',
    a: 'Yes. We work with men referred through Olmsted County drug court and probation. Please contact us to discuss your specific situation.',
  },
  {
    q: 'Is there a curfew?',
    a: 'Yes. Curfews are part of our structured environment, particularly in early phases of the program. Details are outlined in the house guidelines.',
  },
];

export default function FAQ() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-900 text-white py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6 font-poppins tracking-tight leading-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-lg md:text-xl text-blue-100 font-light">
            Sober living in Rochester, MN — your questions answered
          </p>
        </div>
      </div>

      <section className="py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6 mb-16">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-3 font-poppins">{faq.q}</h2>
                <p className="text-gray-700 font-light leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>

          {/* House Guidelines link */}
          <div className="bg-slate-50 border-l-4 border-amber-600 p-8 rounded-r-xl mb-12">
            <p className="text-gray-700 font-light">
              For the full list of house expectations, see our{' '}
              <Link href="/contract" className="text-amber-600 hover:text-amber-700 font-semibold underline">
                House Guidelines
              </Link>
              .
            </p>
          </div>

          {/* Contact CTA */}
          <div className="text-center">
            <p className="text-lg text-gray-700 mb-6 font-light">Still have questions?</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+15073981970"
                className="inline-block bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-lg font-semibold font-poppins text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                Call (507) 398-1970
              </a>
              <a
                href="mailto:joe@crossroads-soberliving.com"
                className="inline-block bg-white border-2 border-amber-600 text-amber-600 hover:bg-amber-50 px-8 py-4 rounded-lg font-semibold font-poppins text-lg transition-all"
              >
                joe@crossroads-soberliving.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
