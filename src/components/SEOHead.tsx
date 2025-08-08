import Head from 'next/head'

export default function SEOHead() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://d-reveal.onrender.com'
  
  return (
    <Head>
      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#8b5cf6" />
      <meta name="msapplication-TileColor" content="#8b5cf6" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={siteUrl} />
      
      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      
      {/* DNS Prefetch for better performance */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      
      {/* Additional favicon formats for better compatibility */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.svg" />
      <link rel="mask-icon" href="/favicon.svg" color="#8b5cf6" />
      
      {/* Web App Manifest */}
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Additional meta tags for better SEO */}
      <meta name="rating" content="general" />
      <meta name="distribution" content="global" />
      <meta name="revisit-after" content="7 days" />
      <meta name="language" content="en" />
      <meta name="geo.region" content="US" />
      <meta name="geo.placename" content="United States" />
      
      {/* Open Graph additional tags */}
      <meta property="og:site_name" content="D-REVEAL" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:type" content="website" />
      
      {/* Twitter Card additional tags */}
      <meta name="twitter:domain" content={siteUrl.replace('https://', '')} />
      <meta name="twitter:url" content={siteUrl} />
      
      {/* Schema.org markup for better search results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "D-REVEAL",
            "url": siteUrl,
            "logo": `${siteUrl}/D-REVEAL.png`,
            "description": "Revolutionary AI-powered deep-learning algorithm that forecasts cryptocurrency, forex, stocks, and commodities with unprecedented precision.",
            "sameAs": [
              // Add your social media URLs here when available
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer service",
              "availableLanguage": "English"
            }
          })
        }}
      />
    </Head>
  )
}