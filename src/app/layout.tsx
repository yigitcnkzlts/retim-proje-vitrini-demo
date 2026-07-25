import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/ui/BackToTop";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import ScrollProgress from "@/components/ui/ScrollProgress";
import VisitTracker from "@/components/analytics/VisitTracker";
import { siteConfig } from "@/data/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} | ${siteConfig.title}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <div className="site-chrome">
          <TopBar />
          <Header />
        </div>
        <main className="min-h-screen">{children}</main>
        <div className="site-chrome">
          <Footer />
          <WhatsAppButton />
          <BackToTop />
          <ScrollProgress />
        </div>
        <VisitTracker />
      </body>
    </html>
  );
}
