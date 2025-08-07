import { NextRequest, NextResponse } from 'next/server';
import { 
  submitSitemapToBing, 
  getBingSitemapStatus, 
  pingBingAboutSitemap,
  validateSitemapForBing,
  generateBingOptimizedSitemap
} from '@/lib/bing-sitemap';

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://d-reveal.onrender.com';
    
    if (!baseUrl) {
      return NextResponse.json(
        { error: 'NEXT_PUBLIC_SITE_URL not configured' },
        { status: 500 }
      );
    }

    switch (action) {
      case 'submit':
        const submitResult = await submitSitemapToBing(baseUrl);
        return NextResponse.json(submitResult);

      case 'ping':
        const pingSuccess = await pingBingAboutSitemap(baseUrl);
        return NextResponse.json({ 
          success: pingSuccess,
          message: pingSuccess ? 'Successfully pinged Bing about sitemap update' : 'Failed to ping Bing'
        });

      case 'validate':
        const sitemapData = generateBingOptimizedSitemap(baseUrl);
        const validation = validateSitemapForBing(sitemapData);
        return NextResponse.json(validation);

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: submit, ping, or validate' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Bing sitemap API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://d-reveal.onrender.com';
    
    if (!baseUrl) {
      return NextResponse.json(
        { error: 'NEXT_PUBLIC_SITE_URL not configured' },
        { status: 500 }
      );
    }

    // Get sitemap status from Bing
    const status = await getBingSitemapStatus(baseUrl);
    
    if (status) {
      return NextResponse.json(status);
    } else {
      return NextResponse.json({
        message: 'No sitemap status available. Either not submitted yet or API key not configured.',
        sitemapUrl: `${baseUrl}/sitemap.xml`
      });
    }
  } catch (error) {
    console.error('Bing sitemap status error:', error);
    return NextResponse.json(
      { error: 'Failed to get sitemap status' },
      { status: 500 }
    );
  }
}