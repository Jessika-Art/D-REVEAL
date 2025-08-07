'use client';

import { useState, useEffect } from 'react';

interface BingSitemapStatus {
  url?: string;
  status?: string;
  lastSubmitted?: string;
  urlsDiscovered?: number;
  urlsIndexed?: number;
  errors?: string[];
  message?: string;
  sitemapUrl?: string;
}

interface BingSitemapResult {
  success: boolean;
  message: string;
  submissionId?: string;
}

export default function BingSitemapManager() {
  const [status, setStatus] = useState<BingSitemapStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastAction, setLastAction] = useState<string>('');

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/bing-sitemap');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Error fetching Bing sitemap status:', error);
      setStatus({ message: 'Error fetching status' });
    } finally {
      setLoading(false);
    }
  };

  const submitSitemap = async () => {
    setLoading(true);
    setLastAction('Submitting sitemap to Bing...');
    try {
      const response = await fetch('/api/bing-sitemap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'submit' }),
      });
      const result: BingSitemapResult = await response.json();
      setLastAction(result.message);
      if (result.success) {
        await fetchStatus();
      }
    } catch (error) {
      setLastAction('Error submitting sitemap');
    } finally {
      setLoading(false);
    }
  };

  const pingBing = async () => {
    setLoading(true);
    setLastAction('Pinging Bing about sitemap update...');
    try {
      const response = await fetch('/api/bing-sitemap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ping' }),
      });
      const result: BingSitemapResult = await response.json();
      setLastAction(result.message);
    } catch (error) {
      setLastAction('Error pinging Bing');
    } finally {
      setLoading(false);
    }
  };

  const validateSitemap = async () => {
    setLoading(true);
    setLastAction('Validating sitemap for Bing...');
    try {
      const response = await fetch('/api/bing-sitemap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'validate' }),
      });
      const result = await response.json();
      if (result.isValid) {
        setLastAction('✅ Sitemap is valid for Bing');
      } else {
        setLastAction(`❌ Sitemap issues: ${result.issues.join(', ')}`);
      }
    } catch (error) {
      setLastAction('Error validating sitemap');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Bing Sitemap Management</h2>
      
      {/* Status Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Current Status</h3>
        {loading && <p className="text-blue-600">Loading...</p>}
        {status && (
          <div className="bg-gray-50 rounded-lg p-4">
            {status.url ? (
              <div className="space-y-2">
                <p><strong>Sitemap URL:</strong> {status.url}</p>
                <p><strong>Status:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded text-sm ${
                    status.status === 'processed' ? 'bg-green-100 text-green-800' :
                    status.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                    status.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {status.status}
                  </span>
                </p>
                {status.lastSubmitted && (
                  <p><strong>Last Submitted:</strong> {new Date(status.lastSubmitted).toLocaleString()}</p>
                )}
                {status.urlsDiscovered !== undefined && (
                  <p><strong>URLs Discovered:</strong> {status.urlsDiscovered}</p>
                )}
                {status.urlsIndexed !== undefined && (
                  <p><strong>URLs Indexed:</strong> {status.urlsIndexed}</p>
                )}
                {status.errors && status.errors.length > 0 && (
                  <div>
                    <strong>Errors:</strong>
                    <ul className="list-disc list-inside mt-1 text-red-600">
                      {status.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p>{status.message}</p>
                {status.sitemapUrl && (
                  <p className="mt-2"><strong>Sitemap URL:</strong> {status.sitemapUrl}</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={submitSitemap}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Submit to Bing
          </button>
          <button
            onClick={pingBing}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Ping Bing
          </button>
          <button
            onClick={validateSitemap}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Validate Sitemap
          </button>
          <button
            onClick={fetchStatus}
            disabled={loading}
            className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Refresh Status
          </button>
        </div>
      </div>

      {/* Last Action Result */}
      {lastAction && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Last Action</h3>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <p className="text-blue-700">{lastAction}</p>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">Setup Instructions</h3>
        <div className="text-yellow-700 space-y-2">
          <p><strong>For full Bing integration:</strong></p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Sign up for <a href="https://www.bing.com/webmasters" target="_blank" rel="noopener noreferrer" className="underline">Bing Webmaster Tools</a></li>
            <li>Add your website and verify ownership</li>
            <li>Get your API key from the settings</li>
            <li>Add <code className="bg-yellow-100 px-1 rounded">BING_WEBMASTER_API_KEY</code> to your environment variables</li>
            <li>Use the "Submit to Bing" button above</li>
          </ol>
          <p className="mt-3"><strong>Alternative:</strong> Use "Ping Bing" for simple notifications (no API key required)</p>
        </div>
      </div>
    </div>
  );
}