'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';

// Google Analytics tracking ID
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Admin pages to exclude from tracking
const EXCLUDED_PATHS = ['/admin', '/admin/reports', '/admin/waitlist'];

// Check if current path should be excluded from tracking
const isExcludedPath = (pathname: string): boolean => {
  return EXCLUDED_PATHS.some(excludedPath => 
    pathname.startsWith(excludedPath)
  );
};

// Google Analytics gtag function
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

// Track page views
export const trackPageView = (url: string) => {
  if (!GA_MEASUREMENT_ID || isExcludedPath(url)) return;
  
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Track custom events
export const trackEvent = (action: string, parameters?: { [key: string]: any }) => {
  if (!GA_MEASUREMENT_ID) return;
  
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: 'engagement',
      ...parameters,
    });
  }
};

// Track form submissions
export const trackFormSubmission = (formName: string, formData?: { [key: string]: any }) => {
  trackEvent('form_submit', { 
    form_name: formName,
    event_category: 'conversion',
    ...formData 
  });
};

// Track button clicks
export const trackButtonClick = (buttonName: string, location?: string) => {
  trackEvent('button_click', { 
    button_name: buttonName,
    location: location 
  });
};

// Track report generation
export const trackReportGeneration = (reportType: string) => {
  trackEvent('report_generated', { 
    report_type: reportType,
    event_category: 'conversion'
  });
};

// Track waitlist signup
export const trackWaitlistSignup = () => {
  trackEvent('waitlist_signup', { 
    event_category: 'conversion',
    form_name: 'waitlist_form'
  });
};

// Main Google Analytics component
export default function GoogleAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!isExcludedPath(pathname)) {
      trackPageView(pathname);
    }
  }, [pathname]);

  // Don't render anything if no GA ID or on excluded paths
  if (!GA_MEASUREMENT_ID || isExcludedPath(pathname)) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}