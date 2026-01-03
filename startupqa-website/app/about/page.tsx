import Link from 'next/link';

export default function About() {
  const values = [
    {
      icon: '🎯',
      title: 'Clear Communication',
      description: 'No jargon, no surprises. You always know what we\'re testing, what we found, and what\'s next.',
    },
    {
      icon: '💰',
      title: 'Fair Pricing',
      description: 'U.S. QA costs are prohibitive for early-stage startups. We make quality QA accessible.',
    },
    {
      icon: '🤝',
      title: 'Low-Risk Start',
      description: 'No long contracts. If it\'s not working, you can pause or stop with 2 weeks notice.',
    },
    {
      icon: '📈',
      title: 'Built for Scale',
      description: 'Start with part-time QA, scale to a full team as you grow. We adapt to your needs.',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              About StartupQA
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're a new QA consultancy designed specifically for growing SaaS startups
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Why We Exist
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-6">
              Most startups can't afford $120K+ for a senior QA engineer, but they also
              can't afford to ship bugs that erode customer trust or block funding rounds.
            </p>
            <p className="text-xl text-gray-600 leading-relaxed">
              We built StartupQA to solve this: U.S.-based QA leadership paired with skilled
              offshore execution. You get the strategy, accountability, and communication
              you need, at a price that makes sense for early-stage companies.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 text-center">
            Where We Are Today
          </h2>
          <div className="prose prose-lg max-w-none text-gray-600 space-y-6">
            <p>
              StartupQA is pre-revenue and preparing to launch at SaaStr in May 2025. We don't
              have case studies or client logos yet—we're being upfront about that.
            </p>
            <p>
              What we do have is a clear model: a U.S.-based QA professional who serves as your
              point of contact and owns the results, supported by vetted QA engineers in Egypt
              who handle the execution work.
            </p>
            <p>
              This approach isn't new—distributed QA teams are common in larger companies. We're
              making it accessible and structured for startups who need quality testing without
              the overhead of full-time U.S. hires.
            </p>
            <p>
              If you're considering working with us, you'd be among our first clients. That comes
              with risk, which is why we're offering flexible terms and no long-term contracts.
              We only succeed if you get value.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Our Principles
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              How we approach our work
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section - Simplified */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Who You'll Work With
            </h2>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Your U.S.-Based QA Lead
            </h3>
            <p className="text-gray-600 mb-6">
              Every client works with a senior QA professional based in the U.S. They own your
              account, design your test strategy, manage the offshore team, and serve as your
              day-to-day point of contact.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <svg className="w-6 h-6 text-indigo-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">7+ years of QA experience</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-indigo-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Available during U.S. business hours</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-indigo-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Accountable for quality and results</span>
              </li>
            </ul>

            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Your Egypt-Based QA Engineers
            </h3>
            <p className="text-gray-600 mb-6">
              The engineers who execute your test plans are based in Egypt. They're managed
              by your U.S. lead and work during overlap hours with U.S. time zones.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg className="w-6 h-6 text-indigo-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">3+ years of QA experience</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-indigo-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Fluent English, strong written communication</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-indigo-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Available 8am-12pm ET for overlap</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Consider Us
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Affordable for Startups
              </h3>
              <p className="text-gray-600">
                Fraction of the cost of a full-time U.S. QA hire ($120K+/year).
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Fast to Start
              </h3>
              <p className="text-gray-600">
                Call this week, start testing next week. No 2-3 month hiring process.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Low Commitment
              </h3>
              <p className="text-gray-600">
                Month-to-month. Pause or cancel with 2 weeks notice if it's not working.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Let's Talk
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            15-minute intro call to see if we're a fit for your QA needs
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-4 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-semibold text-lg shadow-lg"
          >
            Schedule a Call
          </Link>
        </div>
      </section>
    </div>
  );
}
