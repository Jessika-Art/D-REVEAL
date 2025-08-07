'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Users, TrendingUp, Mail, User, MapPin, DollarSign, Target, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { trackEvent, trackFormSubmission } from '@/components/GoogleAnalytics';

const WaitlistPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    jobTitle: '',
    companyType: '',
    aum: '',
    primaryMarkets: [] as string[],
    currentTools: '',
    teamSize: '',
    location: '',
    biggestChallenge: '',
    interestLevel: '',
    budgetRange: '',
    contactMethod: '',
    timeline: '',
    additionalNotes: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: boolean}>({});
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const companyTypes = [
    'Hedge Fund',
    'Family Office',
    'Investment Bank',
    'Asset Management',
    'Pension Fund',
    'Insurance Company',
    'Proprietary Trading',
    'Wealth Management',
    'Fintech Company',
    'Other'
  ];

  const aumRanges = [
    'Under $10M',
    '$10M - $50M',
    '$50M - $100M',
    '$100M - $500M',
    '$500M - $1B',
    '$1B - $5B',
    '$5B - $10B',
    'Over $10B'
  ];

  const marketOptions = [
    'Equities',
    'Fixed Income',
    'Forex/FX',
    'Commodities',
    'Derivatives',
    'Cryptocurrency',
    'Real Estate'
  ];

  const budgetRanges = [
    'Under $10K annually',
    '$10K - $50K annually',
    '$50K - $100K annually',
    '$100K - $500K annually',
    '$500K - $1M annually',
    'Over $1M annually',
    'Prefer to discuss'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (market: string) => {
    setFormData(prev => ({
      ...prev,
      primaryMarkets: prev.primaryMarkets.includes(market)
        ? prev.primaryMarkets.filter(m => m !== market)
        : [...prev.primaryMarkets, market]
    }));
  };

  const validateForm = () => {
    const newErrors: {[key: string]: boolean} = {};
    
    // Required fields
    if (!formData.fullName.trim()) newErrors.fullName = true;
    if (!formData.email.trim()) newErrors.email = true;
    if (!formData.company.trim()) newErrors.company = true;
    if (!formData.jobTitle.trim()) newErrors.jobTitle = true;
    if (!formData.companyType) newErrors.companyType = true;
    if (!formData.aum) newErrors.aum = true;
    if (formData.primaryMarkets.length === 0) newErrors.primaryMarkets = true;
    if (!formData.teamSize) newErrors.teamSize = true;
    if (!formData.interestLevel) newErrors.interestLevel = true;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        // Track successful form submission
        trackFormSubmission('waitlist_form', {
          company_type: formData.companyType,
          aum_range: formData.aum,
          team_size: formData.teamSize,
          interest_level: formData.interestLevel,
          primary_markets: formData.primaryMarkets.join(',')
        });
        
        setIsSubmitted(true);
      } else {
        console.error('Submission failed:', result.message);
        // You could add error handling here
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      // You could add error handling here
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 text-center max-w-md w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-8 h-8 text-white" />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-white mb-4">You're on the list!</h2>
          <p className="text-gray-300 mb-6">
            Thank you for your interest in D-REVEAL. We'll be in touch soon with exclusive early access information.
          </p>
          
          <Link
            href="/"
            onClick={() => trackEvent('button_click', { button_name: 'back_to_home_success' })}
            className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Link
            href="/"
            onClick={() => trackEvent('button_click', { button_name: 'back_to_home_form' })}
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Join the Waitlist
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Get early access to revolutionary market forecasting technology.
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-400" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Company *
                    </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors ${
                      hasAttemptedSubmit && errors.fullName ? 'border-red-500' : 'border-white/20'
                    }`}
                    placeholder="John Smith"
                  />
                  {hasAttemptedSubmit && errors.fullName && (
                    <p className="text-red-400 text-sm mt-1">This field is required</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors ${
                      hasAttemptedSubmit && errors.email ? 'border-red-500' : 'border-white/20'
                    }`}
                    placeholder="john@company.com"
                  />
                  {hasAttemptedSubmit && errors.email && (
                    <p className="text-red-400 text-sm mt-1">This field is required</p>
                  )}
                </div>
              </div>
            </div>

            {/* Company Information */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-400" />
                Company Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Company/Institution Name *
                  </label>
                  <input
                    type="text"
                    name="company"
                    required
                    value={formData.company}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors ${
                      hasAttemptedSubmit && errors.company ? 'border-red-500' : 'border-white/20'
                    }`}
                    placeholder="Acme Capital Management"
                  />
                  {hasAttemptedSubmit && errors.company && (
                    <p className="text-red-400 text-sm mt-1">This field is required</p>
                  )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Role Title *
                    </label>
                  <input
                    type="text"
                    name="jobTitle"
                    required
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors ${
                      hasAttemptedSubmit && errors.jobTitle ? 'border-red-500' : 'border-white/20'
                    }`}
                    placeholder="Portfolio Manager"
                  />
                  {hasAttemptedSubmit && errors.jobTitle && (
                    <p className="text-red-400 text-sm mt-1">This field is required</p>
                  )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Company Type *
                    </label>
                  <select
                    name="companyType"
                    required
                    value={formData.companyType}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white focus:outline-none focus:border-blue-400 transition-colors ${
                      hasAttemptedSubmit && errors.companyType ? 'border-red-500' : 'border-white/20'
                    }`}
                  >
                    <option value="">Select company type</option>
                    {companyTypes.map(type => (
                      <option key={type} value={type} className="bg-gray-800">
                        {type}
                      </option>
                    ))}
                  </select>
                  {hasAttemptedSubmit && errors.companyType && (
                    <p className="text-red-400 text-sm mt-1">This field is required</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Assets Under Management *
                  </label>
                  <select
                    name="aum"
                    value={formData.aum}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white focus:outline-none focus:border-blue-400 transition-colors ${
                      hasAttemptedSubmit && errors.aum ? 'border-red-500' : 'border-white/20'
                    }`}
                  >
                    <option value="">Select AUM range</option>
                    {aumRanges.map(range => (
                      <option key={range} value={range} className="bg-gray-800">
                        {range}
                      </option>
                    ))}
                  </select>
                  {hasAttemptedSubmit && errors.aum && (
                    <p className="text-red-400 text-sm mt-1">This field is required</p>
                  )}
                </div>
              </div>
            </div>

            {/* Trading Information */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                Trading & Analysis
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Primary Markets Traded * (select at least one)
                  </label>
                  <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 p-3 rounded-lg border transition-colors ${
                    hasAttemptedSubmit && errors.primaryMarkets ? 'border-red-500 bg-red-500/5' : 'border-white/20'
                  }`}>
                    {marketOptions.map(market => (
                      <label key={market} className="flex items-center gap-2 text-gray-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.primaryMarkets.includes(market)}
                          onChange={() => handleCheckboxChange(market)}
                          className="w-4 h-4 text-blue-400 bg-white/5 border-white/20 rounded focus:ring-blue-400"
                        />
                        <span className="text-sm">{market}</span>
                      </label>
                    ))}
                  </div>
                  {hasAttemptedSubmit && errors.primaryMarkets && (
                    <p className="text-red-400 text-sm mt-1">Please select at least one option</p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Current Analysis Tools
                    </label>
                    <input
                      type="text"
                      name="currentTools"
                      value={formData.currentTools}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                      placeholder="Bloomberg, TradingView, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Team Size *
                    </label>
                    <select
                      name="teamSize"
                      value={formData.teamSize}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white focus:outline-none focus:border-blue-400 transition-colors ${
                        hasAttemptedSubmit && errors.teamSize ? 'border-red-500' : 'border-white/20'
                      }`}
                    >
                      <option value="">Select team size</option>
                      <option value="Individual" className="bg-gray-800">Individual Trader</option>
                      <option value="Small Team (2-10)" className="bg-gray-800">Small Team (2-10)</option>
                      <option value="Medium Team (11-50)" className="bg-gray-800">Medium Team (11-50)</option>
                      <option value="Large Team (50+)" className="bg-gray-800">Large Team (50+)</option>
                    </select>
                    {hasAttemptedSubmit && errors.teamSize && (
                      <p className="text-red-400 text-sm mt-1">This field is required</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Business Context */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-400" />
                Business Context
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Biggest Challenge in Current Forecasting/Analysis
                  </label>
                  <textarea
                    name="biggestChallenge"
                    value={formData.biggestChallenge}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors resize-none"
                    placeholder="Describe your main challenges with current tools or methods..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Interest Level *
                  </label>
                  <select
                    name="interestLevel"
                    value={formData.interestLevel}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white focus:outline-none focus:border-blue-400 transition-colors ${
                      hasAttemptedSubmit && errors.interestLevel ? 'border-red-500' : 'border-white/20'
                    }`}
                  >
                    <option value="">Select interest level</option>
                    <option value="Immediate need" className="bg-gray-800">Immediate need</option>
                    <option value="Exploring options" className="bg-gray-800">Exploring options</option>
                    <option value="Future consideration" className="bg-gray-800">Future consideration</option>
                  </select>
                  {hasAttemptedSubmit && errors.interestLevel && (
                    <p className="text-red-400 text-sm mt-1">This field is required</p>
                  )}
                </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Budget Range
                    </label>
                    <select
                      name="budgetRange"
                      value={formData.budgetRange}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400 transition-colors"
                    >
                      <option value="">Select budget range</option>
                      {budgetRanges.map(range => (
                        <option key={range} value={range} className="bg-gray-800">
                          {range}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Additional Notes
                </label>
                <textarea
                  name="additionalNotes"
                  value={formData.additionalNotes || ''}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors resize-vertical"
                  placeholder="Any additional information you'd like to share about your requirements, current challenges, or specific use cases..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  Join Waitlist
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default WaitlistPage;