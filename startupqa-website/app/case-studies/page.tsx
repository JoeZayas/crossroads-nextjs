import Link from 'next/link';

export default function CaseStudies() {
  const commonScenarios = [
    {
      scenario: 'Pre-Seed SaaS Company',
      situation: 'Building MVP with 2-person eng team. No QA yet. Preparing for beta launch.',
      approach: 'Part-time QA (20hrs/week) focused on manual testing of critical user flows and bug documentation.',
      outcome: 'Ship beta with confidence, gather user feedback without major blockers.',
      color: 'from-blue-100 to-indigo-100',
    },
    {
      scenario: 'Seed-Stage Fintech',
      situation: 'Growing to 5 engineers. Manual testing slowing down releases. Need automation.',
      approach: 'Full-time QA (2 engineers) building automated test suite while maintaining manual coverage.',
      outcome: 'Automated regression testing, faster releases, more time for eng team to build features.',
      color: 'from-green-100 to-teal-100',
    },
    {
      scenario: 'Series A Product Company',
      situation: 'Scaling to 10+ engineers. QA bottleneck before every release. Considering first QA hire.',
      approach: 'Full-time QA team (2-3 engineers) handling manual and automated testing, plus QA process design.',
      outcome: 'Structured release process, clear quality gates, more predictable shipping schedule.',
      color: 'from-purple-100 to-pink-100',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Who We Help
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're a new consultancy preparing to work with Seed to Series B SaaS startups.
              Here's who we're designed to serve.
            </p>
          </div>
        </div>
      </section>

      {/* Common Scenarios */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Common Scenarios We're Built For
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real situations we expect to encounter with our first clients
            </p>
          </div>
          <div className="space-y-12">
            {commonScenarios.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className={`bg-gradient-to-br ${item.color} p-8 md:p-12`}>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {item.scenario}
                  </h2>
                </div>

                <div className="p-8 md:p-12">
                  <div className="grid md:grid-cols-3 gap-8">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        The Situation
                      </h3>
                      <p className="text-gray-600">{item.situation}</p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Our Approach
                      </h3>
                      <p className="text-gray-600">{item.approach}</p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Expected Outcome
                      </h3>
                      <p className="text-gray-600">{item.outcome}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Offshore Works */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Egypt-Based QA Works
            </h2>
            <p className="text-xl text-gray-600">
              Addressing the obvious concern directly
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Cost vs. Quality Trade-off
              </h3>
              <p className="text-gray-600">
                You get skilled QA engineers at 1/4 the cost of U.S. hires, but with U.S.-based
                leadership ensuring quality doesn't slip. The Egypt team executes, the U.S. lead
                owns the results.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Communication
              </h3>
              <p className="text-gray-600">
                Our Egypt engineers are fluent in English and work during overlap hours with U.S. time zones
                (typically 8am-12pm ET). Daily Slack updates, clear bug reports, and weekly video calls
                keep everyone aligned.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Vetting Process
              </h3>
              <p className="text-gray-600">
                We only work with engineers who have 3+ years of QA experience, strong English skills,
                and a track record of working with distributed teams. Your U.S. lead manages them directly.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                If It Doesn't Work
              </h3>
              <p className="text-gray-600">
                No long-term contracts. If the quality isn't there or communication isn't working,
                you can pause or cancel with 2 weeks notice. We only succeed if you're getting value.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Does This Sound Like You?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Let's talk about whether we're a good fit for your QA needs
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-4 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-semibold text-lg shadow-lg"
          >
            Schedule a 15-Min Call
          </Link>
        </div>
      </section>
    </div>
  );
}
