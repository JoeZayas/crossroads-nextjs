import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "House Guidelines | Sober Living Rules Rochester MN | Crossroads Sober Living",
  description: "Review Crossroads Sober Living's house guidelines and resident expectations. Structured, supportive men's recovery housing in Rochester, Minnesota.",
};

export default function ContractLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
