import type { Metadata } from "next";
import { Inter } from "next/font/google";
import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/ui/BackToTop";
import ScrollProgress from "@/components/ui/ScrollProgress";
import { siteConfig } from "@/data/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
      <body className={`${inter.variable} font-sans`}>
        <TopBar />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <BackToTop />
        <ScrollProgress />
      </body>
    </html>
  );
}
