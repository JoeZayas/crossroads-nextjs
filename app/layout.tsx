import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const poppins = Poppins({ weight: ['400', '500', '600', '700', '800'], subsets: ["latin"], variable: '--font-poppins' });
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Men's Sober Living in Rochester, MN | Crossroads Sober Living",
  description: "Crossroads Sober Living offers structured men's recovery housing in Rochester, Minnesota. MAT-supportive, affordable, and community-focused. Two houses available. Call (507) 398-1970.",
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
