import Script from 'next/script'

export default function StructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://d-reveal.onrender.com'
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "D-REVEAL",
    "description": "Revolutionary deep-learning algorithm that forecasts crypto, forex, stocks, and commodities with unprecedented precision. Dominate markets with D-REVEAL's predictive intelligence.",
    "url": baseUrl,
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "description": "Join our waitlist for early access"
    },
    "provider": {
      "@type": "Organization",
      "name": "D-REVEAL",
      "url": baseUrl
    },
    "featureList": [
      "AI-powered financial market forecasting",
      "Cryptocurrency price prediction",
      "Forex market analysis",
      "Stock market forecasting",
      "Commodities trading insights",
      "Deep learning algorithms",
      "Real-time market intelligence"
    ]
  }

  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "D-REVEAL",
    "url": baseUrl,
    "description": "AI-powered financial market forecasting platform",
    "foundingDate": "2024",
    "industry": "Financial Technology",
    "knowsAbout": [
      "Artificial Intelligence",
      "Machine Learning",
      "Financial Markets",
      "Cryptocurrency",
      "Forex Trading",
      "Stock Market Analysis",
      "Commodities Trading"
    ]
  }

  return (
    <>
      <Script
        id="structured-data-software"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <Script
        id="structured-data-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationData),
        }}
      />
    </>
  )
}