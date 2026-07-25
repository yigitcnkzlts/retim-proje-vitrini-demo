import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/ui/BackToTop";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import ScrollProgress from "@/components/ui/ScrollProgress";
import VisitTracker from "@/components/analytics/VisitTracker";
import JsonLd from "@/components/seo/JsonLd";
import { siteConfig } from "@/data/site";
import { getSiteUrl } from "@/lib/seo/site-url";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteUrl,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    foundingDate: "1989-11-27",
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.addressLine1,
      addressLocality: "İstanbul",
      addressRegion: "İstanbul",
      addressCountry: "TR",
    },
    sameAs: [
      "https://www.linkedin.com/company/retim-restorasyon/",
      "https://www.instagram.com/retimrestorasyon/",
      "https://www.facebook.com/share/1ERyrDESb8/",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteUrl,
    description: siteConfig.description,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteUrl,
    },
    inLanguage: "tr-TR",
  };

  return (
    <html lang="tr">
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <JsonLd data={[organizationSchema, websiteSchema]} />
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
