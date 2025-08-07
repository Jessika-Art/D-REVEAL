/**
 * Bing Webmaster Tools Sitemap Integration
 * This utility helps with Bing sitemap submission and monitoring
 */

export interface BingSitemapSubmissionResult {
  success: boolean;
  message: string;
  submissionId?: string;
}

export interface BingSitemapStatus {
  url: string;
  status: 'submitted' | 'processed' | 'error' | 'pending';
  lastSubmitted?: Date;
  urlsDiscovered?: number;
  urlsIndexed?: number;
  errors?: string[];
}

/**
 * Submit sitemap to Bing Webmaster Tools
 * Note: This requires Bing Webmaster Tools API key to be set in environment variables
 */
export async function submitSitemapToBing(siteUrl: string): Promise<BingSitemapSubmissionResult> {
  const sitemapUrl = `${siteUrl}/sitemap.xml`;
  
  try {
    // Bing Webmaster Tools API endpoint for sitemap submission
    const bingApiKey = process.env.BING_WEBMASTER_API_KEY;
    
    if (!bingApiKey) {
      return {
        success: false,
        message: 'Bing Webmaster API key not configured. Please add BING_WEBMASTER_API_KEY to your environment variables.',
      };
    }

    const response = await fetch(`https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlbatch?apikey=${bingApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        siteUrl: siteUrl,
        urlList: [sitemapUrl],
      }),
    });

    if (response.ok) {
      const result = await response.json();
      return {
        success: true,
        message: 'Sitemap successfully submitted to Bing',
        submissionId: result.d,
      };
    } else {
      return {
        success: false,
        message: `Failed to submit sitemap to Bing: ${response.statusText}`,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Error submitting sitemap to Bing: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Get sitemap status from Bing Webmaster Tools
 */
export async function getBingSitemapStatus(siteUrl: string): Promise<BingSitemapStatus | null> {
  try {
    const bingApiKey = process.env.BING_WEBMASTER_API_KEY;
    
    if (!bingApiKey) {
      console.warn('Bing Webmaster API key not configured');
      return null;
    }

    const response = await fetch(`https://ssl.bing.com/webmaster/api.svc/json/GetSitemaps?siteUrl=${encodeURIComponent(siteUrl)}&apikey=${bingApiKey}`);
    
    if (response.ok) {
      const data = await response.json();
      const sitemaps = data.d;
      
      if (sitemaps && sitemaps.length > 0) {
        const sitemap = sitemaps[0];
        return {
          url: sitemap.Url,
          status: sitemap.Status.toLowerCase(),
          lastSubmitted: sitemap.LastSubmittedDate ? new Date(sitemap.LastSubmittedDate) : undefined,
          urlsDiscovered: sitemap.UrlsSubmitted,
          urlsIndexed: sitemap.UrlsIndexed,
          errors: sitemap.Errors || [],
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error getting Bing sitemap status:', error);
    return null;
  }
}

/**
 * Ping Bing about sitemap updates (alternative method)
 * This is a simpler method that doesn't require API keys
 */
export async function pingBingAboutSitemap(siteUrl: string): Promise<boolean> {
  try {
    const sitemapUrl = `${siteUrl}/sitemap.xml`;
    const pingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
    
    const response = await fetch(pingUrl, {
      method: 'GET',
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error pinging Bing about sitemap:', error);
    return false;
  }
}

/**
 * Validate sitemap format for Bing compatibility
 */
export function validateSitemapForBing(sitemapData: any[]): { isValid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  // Check if sitemap has entries
  if (!sitemapData || sitemapData.length === 0) {
    issues.push('Sitemap is empty');
  }
  
  // Validate each URL entry
  sitemapData.forEach((entry, index) => {
    if (!entry.url) {
      issues.push(`Entry ${index + 1}: Missing URL`);
    }
    
    if (!entry.lastModified) {
      issues.push(`Entry ${index + 1}: Missing lastModified date`);
    }
    
    if (!entry.changeFrequency) {
      issues.push(`Entry ${index + 1}: Missing changeFrequency`);
    }
    
    if (entry.priority !== undefined && (entry.priority < 0 || entry.priority > 1)) {
      issues.push(`Entry ${index + 1}: Priority must be between 0 and 1`);
    }
  });
  
  return {
    isValid: issues.length === 0,
    issues,
  };
}

/**
 * Generate Bing-optimized sitemap metadata
 */
export function generateBingOptimizedSitemap(baseUrl: string) {
  const currentDate = new Date();
  
  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/waitlist`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/demo`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ];
}