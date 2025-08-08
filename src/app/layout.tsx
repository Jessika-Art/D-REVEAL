import type { Metadata, Viewport } from "next";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import StructuredData from "@/components/StructuredData";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "D-REVEAL",
  description: "D-REVEAL | AI Forecasting Financial Markets. Revolutionary deep-learning algorithm that forecasts crypto, forex, stocks, and commodities with unprecedented precision. Dominate markets with D-REVEAL's predictive intelligence.",
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
  applicationName: "D-REVEAL",
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
    title: "D-REVEAL | AI Forecasting Financial Markets",
    description: "D-REVEAL | AI Forecasting Financial Markets. Revolutionary deep-learning algorithm that forecasts crypto, forex, stocks, commodities, and more, with unprecedented precision.",
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
    title: "D-REVEAL | AI Forecasting Financial Markets",
    description: "D-REVEAL | AI Forecasting Financial Markets. Revolutionary deep-learning algorithm that forecasts crypto, forex, stocks, and commodities with unprecedented precision.",
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
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.ico', sizes: '16x16' },
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/favicon-32x32.svg', sizes: '32x32', type: 'image/svg+xml' },
      { url: '/favicon-16x16.svg', sizes: '16x16', type: 'image/svg+xml' }
    ],
    apple: [
      { url: '/apple-touch-icon.svg', sizes: '180x180', type: 'image/svg+xml' }
    ],
    shortcut: '/favicon.ico',
    other: [
      {
        rel: 'mask-icon',
        url: '/favicon.svg',
        color: '#00d285'
      },
      {
        rel: 'icon',
        url: '/favicon.ico',
        type: 'image/x-icon'
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
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="font-sans antialiased">
        <GoogleAnalytics />
        <StructuredData />
        {children}
      </body>
    </html>
  );
}
