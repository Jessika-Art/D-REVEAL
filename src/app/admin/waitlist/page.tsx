'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Download, 
  Calendar, 
  Building2, 
  Mail, 
  TrendingUp,
  Target,
  User,
  RefreshCw,
  Eye,
  X,
  LogOut,
  MessageSquare,
  FileText
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SessionStatus from '@/components/SessionStatus';

interface WaitlistSubmission {
  id: string;
  timestamp: string;
  fullName: string;
  email: string;
  company: string;
  jobTitle: string;
  companyType: string;
  aum: string;
  primaryMarkets: string[];
  currentTools: string;
  teamSize: string;
  biggestChallenge: string;
  interestLevel: string;
  budgetRange: string;
  additionalNotes?: string;
}

const WaitlistAdminPage = () => {
  const [submissions, setSubmissions] = useState<WaitlistSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<WaitlistSubmission | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/waitlist');
      const data = await response.json();
      
      if (data.success) {
        setSubmissions(data.submissions.reverse()); // Show newest first
        setError(null);
      } else {
        setError('Failed to load submissions');
      }
    } catch (err) {
      setError('Error fetching submissions');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkAuthentication = async () => {
    try {
      const response = await fetch('/api/auth');
      const data = await response.json();
      
      if (data.authenticated) {
        setIsAuthenticated(true);
        fetchSubmissions();
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

  const handleLogout = async () => {
    try {
      await fetch('/api/auth', { method: 'DELETE' });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
      router.push('/admin/login');
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  const exportToCSV = () => {
    if (submissions.length === 0) return;

    const headers = [
      'ID', 'Timestamp', 'Full Name', 'Email', 'Company', 'Job Title', 
      'Company Type', 'AUM', 'Primary Markets', 'Current Tools', 'Team Size',
      'Biggest Challenge', 'Interest Level', 'Budget Range', 'Additional Notes'
    ];

    const csvContent = [
      headers.join(','),
      ...submissions.map(sub => [
        sub.id,
        sub.timestamp,
        `"${sub.fullName}"`,
        sub.email,
        `"${sub.company}"`,
        `"${sub.jobTitle}"`,
        `"${sub.companyType}"`,
        `"${sub.aum}"`,
        `"${sub.primaryMarkets.join('; ')}"`,
        `"${sub.currentTools}"`,
        `"${sub.teamSize}"`,
        `"${sub.biggestChallenge.replace(/"/g, '""')}"`,
        `"${sub.interestLevel}"`,
        `"${sub.budgetRange}"`,
        `"${sub.additionalNotes?.replace(/"/g, '""') || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `waitlist-submissions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (isAuthenticated === null || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 flex items-center justify-center">
        <div className="flex items-center gap-3 text-white">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span>{isAuthenticated === null ? 'Checking authentication...' : 'Loading submissions...'}</span>
        </div>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header - Mobile Responsive */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Waitlist Submissions</h1>
              <p className="text-gray-300 text-sm sm:text-base">
                {submissions.length} total submission{submissions.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
              <button
                onClick={fetchSubmissions}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="sm:inline">Refresh</span>
              </button>
              <button
                onClick={exportToCSV}
                disabled={submissions.length === 0}
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
              >
                <Download className="w-4 h-4" />
                <span className="sm:inline">Export CSV</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
              >
                <LogOut className="w-4 h-4" />
                <span className="sm:inline">Logout</span>
              </button>
              <Link
                href="/"
                className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
              >
                <span className="sm:inline">Back to Home</span>
              </Link>
            </div>
          </div>

          {/* Session Status */}
          {/* Temporarily disabled SessionStatus to focus on mobile optimization */}
      {/* <div className="mb-6">
        <SessionStatus />
      </div> */}

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200">
              {error}
            </div>
          )}
        </motion.div>

        {/* Stats Cards - Mobile Responsive */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8"
        >
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
              <div>
                <p className="text-gray-300 text-xs sm:text-sm">Total Submissions</p>
                <p className="text-xl sm:text-2xl font-bold text-white">{submissions.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
              <div>
                <p className="text-gray-300 text-xs sm:text-sm">This Week</p>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {submissions.filter(sub => {
                    const submissionDate = new Date(sub.timestamp);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return submissionDate > weekAgo;
                  }).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
              <div>
                <p className="text-gray-300 text-xs sm:text-sm">Unique Companies</p>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {new Set(submissions.map(sub => sub.company.toLowerCase())).size}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-orange-400" />
              <div>
                <p className="text-gray-300 text-xs sm:text-sm">High Interest</p>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {submissions.filter(sub => sub.interestLevel === 'Immediate need').length}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Submissions - Responsive Layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden"
        >
          {submissions.length === 0 ? (
            <div className="p-8 sm:p-12 text-center">
              <Users className="w-12 h-12 sm:w-16 sm:h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">No submissions yet</h3>
              <p className="text-gray-400 text-sm sm:text-base">Waitlist submissions will appear here once users start signing up.</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Date</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Name</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Email</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Company</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Interest Level</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {submissions.map((submission, index) => (
                        <motion.tr
                          key={submission.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-white/5 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm text-gray-300">
                            {formatDate(submission.timestamp)}
                          </td>
                          <td className="px-6 py-4 text-sm text-white font-medium">
                            {submission.fullName}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-300">
                            {submission.email}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-300">
                            {submission.company}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              submission.interestLevel === 'Immediate need' 
                                ? 'bg-red-500/20 text-red-300'
                                : submission.interestLevel === 'Exploring options'
                                ? 'bg-yellow-500/20 text-yellow-300'
                                : 'bg-green-500/20 text-green-300'
                            }`}>
                              {submission.interestLevel}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <button
                              onClick={() => setSelectedSubmission(submission)}
                              className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden">
                <div className="divide-y divide-white/10">
                  {submissions.map((submission, index) => (
                    <motion.div
                      key={submission.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 hover:bg-white/5 transition-colors"
                    >
                      <div className="flex flex-col space-y-3">
                        {/* Header Row */}
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-medium text-sm truncate">
                              {submission.fullName}
                            </h3>
                            <p className="text-gray-400 text-xs truncate">
                              {submission.email}
                            </p>
                          </div>
                          <div className="ml-2 flex-shrink-0">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              submission.interestLevel === 'Immediate need' 
                                ? 'bg-red-500/20 text-red-300'
                                : submission.interestLevel === 'Exploring options'
                                ? 'bg-yellow-500/20 text-yellow-300'
                                : 'bg-green-500/20 text-green-300'
                            }`}>
                              {submission.interestLevel}
                            </span>
                          </div>
                        </div>

                        {/* Company and Date Row */}
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-300 truncate flex-1 min-w-0">
                            {submission.company}
                          </span>
                          <span className="text-gray-400 ml-2 flex-shrink-0">
                            {formatDate(submission.timestamp)}
                          </span>
                        </div>

                        {/* Action Button */}
                        <div className="pt-2">
                          <button
                            onClick={() => setSelectedSubmission(submission)}
                            className="w-full flex items-center justify-center gap-2 text-blue-400 hover:text-blue-300 transition-colors py-2 px-3 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg text-sm"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* Detail Modal - Mobile Responsive */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 border border-white/20 rounded-xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
          >
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-white">Submission Details</h2>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="text-gray-400 hover:text-white transition-colors p-1"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                      Personal Information
                    </h3>
                    <div className="space-y-2 text-xs sm:text-sm">
                      <p><span className="text-gray-400">Name:</span> <span className="text-white break-words">{selectedSubmission.fullName}</span></p>
                      <p><span className="text-gray-400">Email:</span> <span className="text-white break-all">{selectedSubmission.email}</span></p>
                      <p><span className="text-gray-400">Submitted:</span> <span className="text-white">{formatDate(selectedSubmission.timestamp)}</span></p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                      Company Information
                    </h3>
                    <div className="space-y-2 text-xs sm:text-sm">
                      <p><span className="text-gray-400">Company:</span> <span className="text-white break-words">{selectedSubmission.company}</span></p>
                      <p><span className="text-gray-400">Job Title:</span> <span className="text-white break-words">{selectedSubmission.jobTitle}</span></p>
                      <p><span className="text-gray-400">Company Type:</span> <span className="text-white">{selectedSubmission.companyType}</span></p>
                      <p><span className="text-gray-400">AUM:</span> <span className="text-white">{selectedSubmission.aum}</span></p>
                      <p><span className="text-gray-400">Team Size:</span> <span className="text-white">{selectedSubmission.teamSize}</span></p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                      Trading & Analysis
                    </h3>
                    <div className="space-y-2 text-xs sm:text-sm">
                      <p><span className="text-gray-400">Primary Markets:</span> <span className="text-white break-words">{selectedSubmission.primaryMarkets.join(', ')}</span></p>
                      <p><span className="text-gray-400">Current Tools:</span> <span className="text-white break-words">{selectedSubmission.currentTools || 'Not specified'}</span></p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <Target className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                      Business Context
                    </h3>
                    <div className="space-y-2 text-xs sm:text-sm">
                      <p><span className="text-gray-400">Interest Level:</span> <span className="text-white">{selectedSubmission.interestLevel}</span></p>
                      <p><span className="text-gray-400">Budget Range:</span> <span className="text-white">{selectedSubmission.budgetRange || 'Not specified'}</span></p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:gap-6 mb-6">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                    Biggest Challenge
                  </h3>
                  <div className="bg-gray-800 rounded-lg p-3 sm:p-4">
                    <p className="text-gray-300 text-xs sm:text-sm leading-relaxed break-words">
                      {selectedSubmission.biggestChallenge || 'Not provided'}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                    Additional Notes
                  </h3>
                  <div className="bg-gray-800 rounded-lg p-3 sm:p-4">
                    <p className="text-gray-300 text-xs sm:text-sm leading-relaxed break-words">
                      {selectedSubmission.additionalNotes || 'No additional notes'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default WaitlistAdminPage;