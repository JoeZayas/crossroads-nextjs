import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contact & Intake | Men's Sober House Rochester MN | Crossroads Sober Living",
  description: "Ready to start your recovery? Contact Crossroads Sober Living in Rochester, MN today. Call (507) 398-1970 or complete our confidential intake form.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
