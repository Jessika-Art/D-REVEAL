import type { Metadata, Viewport } from "next";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import StructuredData from "@/components/StructuredData";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "D-REVEAL | AI Financial Market Forecasting Platform",
    template: "%s | D-REVEAL"
  },
  description: "Revolutionary AI-powered deep-learning algorithm that forecasts cryptocurrency, forex, stocks, and commodities with unprecedented precision. Transform your trading with D-REVEAL's predictive intelligence and dominate financial markets.",
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
    title: "D-REVEAL | AI Financial Market Forecasting Platform",
    description: "Revolutionary AI-powered deep-learning algorithm that forecasts cryptocurrency, forex, stocks, and commodities with unprecedented precision. Transform your trading with predictive intelligence.",
    url: '/',
    siteName: 'D-REVEAL',
    images: [
      {
        url: '/D-REVEAL.png',
        width: 1200,
        height: 630,
        alt: 'D-REVEAL - AI Financial Market Forecasting Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "D-REVEAL | AI Financial Market Forecasting Platform",
    description: "Revolutionary AI-powered algorithm for cryptocurrency, forex, stocks & commodities forecasting. Transform your trading with predictive intelligence.",
    images: ['/D-REVEAL.png'],
    creator: '@D_REVEAL',
    site: '@D_REVEAL',
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
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.svg', sizes: '180x180', type: 'image/svg+xml' }
    ],
    shortcut: '/favicon.ico',
    other: [
      {
        rel: 'mask-icon',
        url: '/favicon.svg',
        color: '#8b5cf6'
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
