import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Our Recovery Program | Sober Living Rochester MN | Crossroads Sober Living",
  description: "Our three-pillar recovery program helps men in Rochester, MN build stable employment, supportive community, and a path to lasting housing. MAT-supportive environment.",
};

export default function ProgramLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
