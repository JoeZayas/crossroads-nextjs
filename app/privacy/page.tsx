import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | Crossroads Sober Living',
  description:
    'How Crossroads Sober Living in Rochester, MN collects, uses, and protects the information you share with us.',
};

const LAST_UPDATED = 'September 28, 2026';

export default function Privacy() {
  return (
    <main className="min-h-screen">
      <div className="bg-gradient-to-r from-slate-900 to-blue-900 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6 font-poppins tracking-tight leading-tight">
            Privacy Policy
          </h1>
          <p className="text-lg text-blue-100 font-light">Last updated: {LAST_UPDATED}</p>
        </div>
      </div>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto space-y-10 text-gray-700 leading-relaxed">
          <div>
            <p>
              Crossroads Sober Living (&ldquo;Crossroads,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;) operates recovery
              housing in Rochester, Minnesota and this website, crossroads-soberliving.com. This policy explains what
              information we collect, how we use it, and the choices you have. We take the privacy of people in
              recovery seriously.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-poppins">Information we collect</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Contact and intake forms.</strong> When you use our contact or intake forms, we receive what you
                choose to share, such as your name, phone number, email address, and details about your situation and
                housing needs.
              </li>
              <li>
                <strong>Email and phone.</strong> If you email or call us, we receive your message and contact
                details.
              </li>
              <li>
                <strong>Resident records.</strong> For current residents, we keep the records needed to run the house,
                such as move-in dates, rent and payment history, and house assignments.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-poppins">How we use it</h2>
            <p>
              We use this information only to respond to you, evaluate and process intake requests, operate our houses,
              and keep resident accounts accurate. We do not sell, rent, or trade your information, and we do not use
              it for advertising.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-poppins">Who we share it with</h2>
            <p className="mb-4">
              We do not share your information with anyone outside Crossroads except:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Service providers that help us run the website and deliver messages (for example, our website host
                and email delivery service), only as needed to provide those services;
              </li>
              <li>With your permission, such as when you ask us to coordinate with a referral source or program;</li>
              <li>When required by law.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-poppins">Email tools and Google user data</h2>
            <p className="mb-4">
              Crossroads uses a private internal tool, <strong>Joe Agents</strong>, to help manage our own Gmail
              mailboxes. With the account owner&apos;s permission, it uses the Google Gmail API to read, search,
              label, archive, and draft messages in those mailboxes. It does not send or delete email.
            </p>
            <p className="mb-4">
              Sign-in tokens for Joe Agents are stored only on our own computer. Information received from Google APIs
              is used only to provide these mailbox features to the account owner. It is not sold, not shared with
              third parties, not used for advertising, and not used to train generalized AI or machine-learning models.
            </p>
            <p>
              Joe Agents&apos; use and transfer of information received from Google APIs adheres to the{' '}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                className="text-blue-700 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google API Services User Data Policy
              </a>
              , including the Limited Use requirements. Access can be revoked at any time at{' '}
              <a
                href="https://myaccount.google.com/permissions"
                className="text-blue-700 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                myaccount.google.com/permissions
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-poppins">How we protect it</h2>
            <p>
              Access to resident and applicant information is limited to Crossroads staff who need it. Our admin tools
              require a login. No system is perfectly secure, but we work to keep your information safe.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-poppins">Your choices</h2>
            <p>
              You can ask us what information we have about you, ask us to correct it, or ask us to delete it where we
              are not required to keep it. Contact us using the details below.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-poppins">Changes</h2>
            <p>If we change this policy, we will update the date at the top of this page.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-poppins">Contact us</h2>
            <p>
              Crossroads Sober Living, Rochester, MN
              <br />
              Email:{' '}
              <a href="mailto:joe@crossroads-soberliving.com" className="text-blue-700 underline">
                joe@crossroads-soberliving.com
              </a>
              <br />
              Phone:{' '}
              <a href="tel:+15073981970" className="text-blue-700 underline">
                (507) 398-1970
              </a>
            </p>
          </div>

          <div className="pt-4">
            <Link href="/" className="text-blue-700 underline">
              &larr; Back to home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
