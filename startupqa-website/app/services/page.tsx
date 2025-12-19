import Link from 'next/link';

export default function Services() {
  const services = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Manual Testing',
      description: 'Thorough manual testing of your web or mobile app across user flows, devices, and browsers.',
      features: [
        'Regression testing before releases',
        'Exploratory testing for new features',
        'Cross-browser and device testing',
        'Bug documentation with repro steps',
      ],
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      title: 'Test Automation',
      description: 'Build automated test suites that run on every deployment to catch regressions early.',
      features: [
        'E2E tests for critical user flows',
        'CI/CD integration (GitHub Actions, etc.)',
        'API testing with Postman/Playwright',
        'Maintenance and updates as product evolves',
      ],
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      title: 'Test Planning',
      description: 'Design a practical QA process that fits your team size, release cadence, and stage.',
      features: [
        'Test strategy for your product',
        'Priority areas to focus on first',
        'QA process recommendations',
        'Tooling setup and integration',
      ],
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              What We Test
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Practical QA services designed for growing SaaS startups
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 text-indigo-600">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <ul className="space-y-3">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-indigo-600 mr-2 mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Don't Do */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What We Don't Do (Yet)
            </h2>
            <p className="text-xl text-gray-600">
              Being upfront about our scope
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-2xl mr-3">❌</span>
                <div>
                  <p className="font-semibold text-gray-900">Security/Penetration Testing</p>
                  <p className="text-gray-600 text-sm">
                    We test for basic security issues, but we're not a security firm. You'll need
                    specialists for pen testing and compliance audits.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-3">❌</span>
                <div>
                  <p className="font-semibold text-gray-900">Load/Performance Testing at Scale</p>
                  <p className="text-gray-600 text-sm">
                    We can test basic performance, but if you need to simulate 100K+ concurrent
                    users, you'll need performance specialists.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-3">❌</span>
                <div>
                  <p className="font-semibold text-gray-900">Accessibility Audits</p>
                  <p className="text-gray-600 text-sm">
                    We'll catch obvious accessibility issues, but WCAG compliance requires
                    dedicated accessibility experts.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Tech Stacks */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Tech Stacks We Work With
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Most modern web and mobile stacks
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-3">Web Apps</h3>
              <p className="text-gray-600">
                React, Next.js, Vue, Angular, Rails, Django, Node.js—if it runs in a browser,
                we can test it.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-3">Mobile Apps</h3>
              <p className="text-gray-600">
                iOS (native/React Native), Android (native/React Native), Flutter. Manual
                testing across real devices.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-3">APIs</h3>
              <p className="text-gray-600">
                REST and GraphQL API testing with Postman, Playwright, or similar tools.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-3">Automation Tools</h3>
              <p className="text-gray-600">
                Playwright, Cypress, Selenium, Appium. We adapt to your existing setup or
                recommend what fits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Let's Discuss Your Testing Needs
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            15-minute call to talk about your product and what QA coverage makes sense
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
