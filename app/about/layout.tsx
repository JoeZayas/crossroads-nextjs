import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "About Us | Men's Recovery Housing Rochester MN | Crossroads Sober Living",
  description: "Learn about Crossroads Sober Living — Rochester Minnesota's supportive men's sober living community. MAT-friendly, evidence-based, and focused on lasting recovery.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
