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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://d-reveal.onrender.com'),
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
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/favicon-32x32.svg', sizes: '32x32', type: 'image/svg+xml' },
      { url: '/favicon-16x16.svg', sizes: '16x16', type: 'image/svg+xml' }
    ],
    apple: '/apple-touch-icon.svg',
    shortcut: '/favicon.ico',
    other: [
      {
        rel: 'mask-icon',
        url: '/favicon.svg',
        color: '#4F46E5'
      }
    ]
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <GoogleAnalytics />
        <StructuredData />
        {children}
      </body>
    </html>
  );
}
