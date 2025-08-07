import type { Metadata, Viewport } from "next";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import StructuredData from "@/components/StructuredData";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "D-REVEAL - AI Financial Market Forecasting",
  description: "Revolutionary deep-learning algorithm that forecasts crypto, forex, stocks, and commodities with unprecedented precision. Dominate markets with D-REVEAL's predictive intelligence.",
  keywords: [
    "AI financial forecasting",
    "market prediction",
    "cryptocurrency forecasting",
    "forex prediction",
    "stock market AI",
    "commodities trading",
    "deep learning finance",
    "algorithmic trading",
    "financial technology",
    "market intelligence"
  ],
  authors: [{ name: "D-REVEAL" }],
  creator: "D-REVEAL",
  publisher: "D-REVEAL",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "D-REVEAL - AI Financial Market Forecasting",
    description: "Revolutionary deep-learning algorithm that forecasts crypto, forex, stocks, and commodities with unprecedented precision.",
    url: '/',
    siteName: 'D-REVEAL',
    images: [
      {
        url: '/D-REVEAL.png',
        width: 1200,
        height: 630,
        alt: 'D-REVEAL AI Financial Market Forecasting',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "D-REVEAL - AI Financial Market Forecasting",
    description: "Revolutionary deep-learning algorithm that forecasts crypto, forex, stocks, and commodities with unprecedented precision.",
    images: ['/D-REVEAL.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico?v=3', sizes: 'any' },
      { url: '/favicon.ico?v=3', type: 'image/x-icon' },
    ],
    shortcut: '/favicon.ico?v=3',
    apple: '/favicon.ico?v=3',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico?v=3" sizes="any" />
        <link rel="shortcut icon" href="/favicon.ico?v=3" />
      </head>
      <body className="font-sans antialiased">
        <GoogleAnalytics />
        <StructuredData />
        {children}
      </body>
    </html>
  );
}
