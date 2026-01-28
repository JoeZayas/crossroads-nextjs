import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const poppins = Poppins({ weight: ['400', '500', '600', '700', '800'], subsets: ["latin"], variable: '--font-poppins' });
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Crossroads Sober Living - Your Path to Recovery",
  description: "A supportive community helping individuals transition from addiction to a fulfilling life through stable employment, community, and housing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} ${poppins.variable}`} suppressHydrationWarning>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
