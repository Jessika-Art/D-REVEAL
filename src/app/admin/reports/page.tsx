'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  Image, 
  Calendar, 
  User, 
  Plus,
  RefreshCw,
  Eye,
  Trash2,
  LogOut,
  Copy,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSessionTimeout } from '@/hooks/useSessionTimeout';
import SessionTimeoutWarning from '@/components/SessionTimeoutWarning';

interface GeneratedReport {
  id: string;
  token: string;
  clientName: string;
  generatedDate: string;
  createdAt: string;
  chartFileName: string;
  jsonFileName: string;
}

const ReportsAdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [reports, setReports] = useState<GeneratedReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Session timeout state
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  
  // Form state
  const [clientName, setClientName] = useState('');
  const [generatedDate, setGeneratedDate] = useState('');
  const [chartFile, setChartFile] = useState<File | null>(null);
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const router = useRouter();

  // Session timeout handlers
  const handleSessionWarning = (remaining: number) => {
    setTimeRemaining(remaining);
    setShowTimeoutWarning(true);
  };

  const handleSessionTimeout = () => {
    setShowTimeoutWarning(false);
    setIsAuthenticated(false);
    router.push('/admin/login');
  };

  const handleExtendSession = async () => {
    try {
      const response = await fetch('/api/auth', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.authenticated) {
        setShowTimeoutWarning(false);
        setSuccess('Session extended successfully');
      } else {
        handleSessionTimeout();
      }
    } catch (error) {
      console.error('Failed to extend session:', error);
      handleSessionTimeout();
    }
  };

  // Initialize session timeout monitoring
  const { refreshSession } = useSessionTimeout({
    onWarning: handleSessionWarning,
    onTimeout: handleSessionTimeout
  });

  const checkAuthentication = async () => {
    try {
      const response = await fetch('/api/auth', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.authenticated) {
        setIsAuthenticated(true);
        fetchReports();
      } else {
        setIsAuthenticated(false);
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
      router.push('/admin/login');
    }
  };

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/reports', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        setReports(data.reports);
      } else {
        // Only show error if it's not an authentication issue
        if (response.status !== 401) {
          setError('Failed to load reports');
        }
      }
    } catch (err) {
      setError('Error fetching reports');
      console.error('Error:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth', { 
        method: 'DELETE',
        credentials: 'include'
      });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
      router.push('/admin/login');
    }
  };

  const handleGenerateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientName || !generatedDate || !chartFile || !jsonFile) {
      setError('Please fill in all fields and upload both files');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('clientName', clientName);
      formData.append('generatedDate', generatedDate);
      formData.append('chartFile', chartFile);
      formData.append('jsonFile', jsonFile);

      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(`Report generated successfully! Token: ${data.token}`);
        setClientName('');
        setGeneratedDate('');
        setChartFile(null);
        setJsonFile(null);
        // Reset file inputs
        const chartInput = document.getElementById('chartFile') as HTMLInputElement;
        const jsonInput = document.getElementById('jsonFile') as HTMLInputElement;
        if (chartInput) chartInput.value = '';
        if (jsonInput) jsonInput.value = '';
        
        fetchReports();
      } else {
        setError(data.error || 'Failed to generate report');
      }
    } catch (err) {
      setError('Error generating report');
      console.error('Error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    if (!confirm('Are you sure you want to delete this report?')) return;

    try {
      const response = await fetch(`/api/reports/${reportId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Report deleted successfully');
        fetchReports();
      } else {
        setError(data.error || 'Failed to delete report');
      }
    } catch (err) {
      setError('Error deleting report');
      console.error('Error:', err);
    }
  };

  const copyReportUrl = async (token: string) => {
    const url = `${window.location.origin}/report/${token}`;
    try {
      await navigator.clipboard.writeText(url);
      setSuccess('Report URL copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy URL:', err);
      setError('Failed to copy URL');
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 flex items-center justify-center">
        <div className="flex items-center gap-3 text-white">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span>Checking authentication...</span>
        </div>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 py-8 px-4">
      {/* Session Timeout Warning */}
      {showTimeoutWarning && (
        <SessionTimeoutWarning
          timeRemaining={timeRemaining}
          onExtendSession={handleExtendSession}
          onLogout={handleLogout}
        />
      )}
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Report Generator</h1>
              <p className="text-gray-300">Create custom forecast reports for clients</p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/admin/waitlist"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <FileText className="w-4 h-4" />
                Waitlist
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200 mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 text-green-200 mb-4">
              {success}
            </div>
          )}
        </motion.div>

        {/* Report Generation Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 mb-8"
        >
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Plus className="w-6 h-6 text-purple-400" />
            Generate New Report
          </h2>

          <form onSubmit={handleGenerateReport} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Client Name
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g., Nexus Alpha Capital"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Generated Date
                </label>
                <input
                  type="date"
                  value={generatedDate}
                  onChange={(e) => setGeneratedDate(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Chart Image (.png)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    id="chartFile"
                    accept=".png"
                    onChange={(e) => setChartFile(e.target.files?.[0] || null)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                  <Image className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Data File (.json)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    id="jsonFile"
                    accept=".json"
                    onChange={(e) => setJsonFile(e.target.files?.[0] || null)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                  <FileText className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Generating Report...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Generate Report
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Generated Reports List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FileText className="w-6 h-6 text-purple-400" />
              Generated Reports ({reports.length})
            </h2>
            <button
              onClick={fetchReports}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>

          {reports.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No reports generated yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {report.clientName}
                      </h3>
                      <div className="text-sm text-gray-400 space-y-1">
                        <p>Generated: {report.generatedDate}</p>
                        <p>Created: {new Date(report.createdAt).toLocaleString()}</p>
                        <p className="font-mono text-xs">Token: {report.token}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyReportUrl(report.token)}
                        className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                        title="Copy Report URL"
                      >
                        <Copy className="w-4 h-4" />
                        Copy URL
                      </button>
                      <a
                        href={`/report/${report.token}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                        title="View Report"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View
                      </a>
                      <button
                        onClick={() => handleDeleteReport(report.id)}
                        className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                        title="Delete Report"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ReportsAdminPage;