import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://d-reveal.onrender.com'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/report/',
        ],
      },
      // Specific rules for Bing crawler
      {
        userAgent: 'bingbot',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/report/',
        ],
      },
      // Specific rules for Google crawler
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/report/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}