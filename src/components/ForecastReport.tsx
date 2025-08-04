'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Calendar, Target, BarChart3, AlertTriangle, CheckCircle, Clock, DollarSign, Activity, Maximize2, X, Move, ZoomIn, ZoomOut, Hand, HelpCircle, Home, ArrowRight, Link, Check, QrCode } from 'lucide-react';
import { useState, useEffect } from 'react';
import QRCode from 'qrcode';

interface ReportData {
  agent: {
    name: string;
    version: string;
    model: string;
  };
  forecast: {
    asset: string;
    direction: string;
    timeframe: string;
    duration: string;
    confidence: number;
  };
  technical_analysis: {
    [key: string]: {
      trend: string;
      support: number;
      resistance: number;
      indicators: {
        rsi: number;
        macd: string;
        bollinger: string;
      };
    };
  };
  macro_fundamentals: {
    economic_outlook: string;
    market_sentiment: string;
    risk_factors: string[];
  };
  economic_calendar: Array<{
    date: string;
    event: string;
    impact: string;
    forecast: string;
  }>;
  strategic_notes: {
    entry_strategy: string;
    risk_management: string;
    exit_strategy: string;
  };
}

interface ForecastReportProps {
  clientName: string;
  generatedDate: string;
  chartUrl: string;
  reportData: ReportData;
}

const ForecastReport = ({ clientName, generatedDate, chartUrl, reportData }: ForecastReportProps) => {
  const [isChartFullscreen, setIsChartFullscreen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeDataURL, setQrCodeDataURL] = useState('');

  // QR Code function with logo overlay
  const generateQRCode = async () => {
    try {
      const currentURL = window.location.href;
      
      // Generate the base QR code
      const qrDataURL = await QRCode.toDataURL(currentURL, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M' // Medium error correction to allow for logo overlay
      });

      // Create a canvas to add the logo overlay
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const qrImage = new Image();

      qrImage.onload = () => {
        canvas.width = qrImage.width;
        canvas.height = qrImage.height;
        
        // Draw the QR code
        ctx.drawImage(qrImage, 0, 0);
        
        // Create logo overlay in the center
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const logoSize = 60; // Size of the logo area
        
        // Draw white background for logo
        ctx.fillStyle = '#000000';
        ctx.fillRect(centerX - logoSize/2, centerY - logoSize/2, logoSize, logoSize);
        
        // Draw border around logo area
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.strokeRect(centerX - logoSize/2, centerY - logoSize/2, logoSize, logoSize);
        
        // Draw the logo text "[ : : ]"
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 26px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('[::]', centerX, centerY);
        
        // Convert canvas to data URL
        const finalDataURL = canvas.toDataURL('image/png');
        setQrCodeDataURL(finalDataURL);
        setShowQRCode(true);
      };

      qrImage.src = qrDataURL;
    } catch (error) {
      console.error('Error generating QR code:', error);
      alert('Error generating QR code. Please try again.');
    }
  };

  const copyURL = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setUrlCopied(true);
      setTimeout(() => setUrlCopied(false), 2000);
    } catch (error) {
      console.error('Error copying URL:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setUrlCopied(true);
      setTimeout(() => setUrlCopied(false), 2000);
    }
  };

  const getDirectionIcon = (direction: string) => {
    return direction.toLowerCase() === 'buy' ? TrendingUp : TrendingDown;
  };

  const getDirectionColor = (direction: string) => {
    return direction.toLowerCase() === 'buy' ? 'text-green-400' : 'text-red-400';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-500';
    if (confidence >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getConfidenceLevel = (confidence: number) => {
    if (confidence >= 80) return 'High';
    if (confidence >= 60) return 'Medium';
    return 'Low';
  };

  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle different data structures safely
  const forecast = reportData.forecast || reportData.agent?.forecast_recaps;
  const direction = forecast?.direction || forecast?.forecast_direction || 'Unknown';
  const asset = forecast?.asset || 'Unknown Asset';
  const timeframe = forecast?.timeframe || 'Unknown';
  const duration = forecast?.duration || 'Unknown';
  const confidence = forecast?.confidence || forecast?.confidence_level || 0;
  
  // Convert confidence level text to number if needed
  const confidenceNumber = typeof confidence === 'string' ? 
    (confidence.toLowerCase() === 'high' ? 85 : confidence.toLowerCase() === 'medium' ? 65 : 45) : 
    confidence;
  
  // Handle technical analysis data structure
  const technicalAnalysis = reportData.technical_analysis || reportData.agent?.technical_analysis || {};
  
  // Handle economic calendar data structure
  const economicCalendar = reportData.economic_calendar || reportData.agent?.economic_calendar || [];
  
  // Handle macro fundamentals data structure
  const macroFundamentals = reportData.macro_fundamentals || {
    economic_outlook: reportData.agent?.macro_fundamentals || 'N/A',
    market_sentiment: 'N/A',
    risk_factors: []
  };
  
  // Handle strategic notes data structure
  const strategicNotes = reportData.strategic_notes || {
    entry_strategy: reportData.agent?.strategic_notes || 'N/A',
    risk_management: 'N/A',
    exit_strategy: 'N/A'
  };
  
  const DirectionIcon = getDirectionIcon(direction);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white relative overflow-hidden">
      {/* QR Code Modal */}
      {showQRCode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowQRCode(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-2xl p-8 max-w-sm w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">Share This Report</h3>
            <div className="mb-4">
              <img src={qrCodeDataURL} alt="QR Code" className="mx-auto rounded-lg" />
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Scan this QR code to share the report
            </p>
            <button
              onClick={() => setShowQRCode(false)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Fullscreen Chart Modal */}
      {isChartFullscreen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black z-50 flex items-center justify-center"
        >
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <button
              onClick={() => setIsChartFullscreen(false)}
              className="absolute top-4 right-4 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <img 
              src={chartUrl} 
              alt={`${asset} ${timeframe} Forecast Chart`}
              className="max-w-full max-h-full object-contain rounded-xl"
            />
          </div>
        </motion.div>
      )}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-black/20 backdrop-blur-sm border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Navigation - Fully Responsive */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mb-8">
            {/* Main Navigation Buttons */}
            <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <motion.a
                href="/"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full font-medium transition-all backdrop-blur-sm text-sm sm:text-base w-full xs:w-auto"
              >
                <Home className="w-4 h-4" />
                <span className="hidden xs:inline">Return to Home</span>
                <span className="xs:hidden">Home</span>
              </motion.a>
              <motion.a
                href="/waitlist"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-full font-medium transition-all text-sm sm:text-base w-full xs:w-auto"
              >
                <span className="hidden xs:inline">Request Access</span>
                <span className="xs:hidden">Access</span>
                <ArrowRight className="w-4 h-4" />
              </motion.a>
            </div>
            
            {/* Share Features - Responsive positioning */}
            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto sm:ml-4">
              <motion.button
                onClick={generateQRCode}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg text-xs sm:text-sm font-medium transition-all backdrop-blur-sm flex-1 sm:flex-none"
                title="Generate QR Code"
              >
                <QrCode className="w-4 h-4" />
                <span className="hidden xs:inline">QR Code</span>
                <span className="xs:hidden">QR</span>
              </motion.button>

              <motion.button
                onClick={copyURL}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.45 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg text-xs sm:text-sm font-medium transition-all backdrop-blur-sm flex-1 sm:flex-none"
                title="Copy Page URL"
              >
                {urlCopied ? (
                  <>
                    <Check className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 hidden xs:inline">Copied!</span>
                    <span className="text-green-400 xs:hidden">✓</span>
                  </>
                ) : (
                  <>
                    <Link className="w-4 h-4" />
                    <span className="hidden xs:inline">Copy URL</span>
                    <span className="xs:hidden">Copy</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Forecast Report</h1>
              <p className="text-purple-300 mt-2">to {clientName}</p>
            </div>
            <div className="flex items-center gap-6">
              {/* Logo */}
              <div className="hidden md:block">
                <img 
                  src="/D-REVEAL full w1.png" 
                  alt="D-REVEAL Logo" 
                  className="h-12 w-auto opacity-90 hover:opacity-100 transition-opacity"
                />
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-300">Generated</div>
                <div className="text-lg font-semibold">{generatedDate}</div>
                <div className="text-sm text-gray-500">mm/dd/yyyy</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Forecast Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 mb-8 border border-white/20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="text-center">
              <div className="text-sm text-gray-300 mb-2">Asset</div>
              <div className="text-3xl font-bold text-purple-300">{asset}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-300 mb-2">Direction</div>
              <div className={`flex items-center justify-center gap-2 text-2xl font-bold ${getDirectionColor(direction)}`}>
                <DirectionIcon className="w-8 h-8" />
                {direction}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-300 mb-2">Timeframe</div>
              <div className="text-2xl font-bold text-blue-300">{timeframe}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-300 mb-2">Duration</div>
              <div className="text-2xl font-bold text-purple-400">{duration || 'N/A'}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-300 mb-2">Confidence</div>
              <div className="flex items-center justify-center">
                <span className={`px-4 py-2 rounded-full text-white font-bold ${getConfidenceColor(confidenceNumber)}`}>
                  {getConfidenceLevel(confidenceNumber)} ({typeof confidence === 'string' ? confidence : `${confidenceNumber}%`})
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Chart Window */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mb-8"
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
            <div className="bg-white/10 px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-xl font-bold flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-purple-400" />
                Forecast Chart
              </h3>
              
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <HelpCircle className="w-4 h-4 text-blue-400" />
                  </button>
                  {showTooltip && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-80 bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg p-4 text-sm text-white z-50">
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-black/90 border-l border-t border-white/20 rotate-45"></div>
                      <p className="leading-relaxed">
                        The first 1 to 30 candles have a higher accuracy. In the last 30 candles the accuracy decreases. The model produces what is about to come sometimes 2 or 3 candles earlier or later than when the actual move take place.
                      </p>
                      <p className="mt-2 leading-relaxed">
                        Long candles suggest high volatility.
                      </p>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setIsChartFullscreen(true)}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-white/10 rounded-lg transition-colors group"
                  title="View Fullscreen"
                >
                  <span className="text-sm text-gray-400 group-hover:text-white transition-colors">full-screen</span>
                  <Maximize2 className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                </button>
              </div>
            </div>
            <div className="p-2">
              <div className="bg-black/30 rounded-xl border border-white/10 relative" style={{ height: '600px' }}>
                <img 
                  src={chartUrl} 
                  alt={`${asset} ${timeframe} Forecast Chart`}
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
            </div>
            
            {/* Chart Info */}
            <div className="px-2 pb-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="bg-black/50 backdrop-blur-sm rounded-lg p-3 border border-white/20"
              >
                <div className="flex items-center justify-between text-xs text-gray-300">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-purple-400" />
                    <span>Static forecast chart view</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Maximize2 className="w-3 h-3 text-blue-400" />
                      <span>Click fullscreen for larger view</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Technical Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-purple-400" />
            Technical Analysis
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {Object.entries(technicalAnalysis).map(([timeframe, analysis], index) => {
              // Handle different data structures
              const trend = analysis.trend || 'N/A';
              const support = analysis.support || analysis.support_resistance?.support || 'N/A';
              const resistance = analysis.resistance || analysis.support_resistance?.resistance || 'N/A';
              const indicators = analysis.indicators || {};
              
              // Format support/resistance if they are arrays
              const supportDisplay = Array.isArray(support) ? support.join(', ') : support;
              const resistanceDisplay = Array.isArray(resistance) ? resistance.join(', ') : resistance;
              
              return (
                <motion.div
                  key={timeframe}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                >
                  <h3 className="text-xl font-bold mb-4 text-purple-300">{timeframe} Analysis</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-300 mb-1">Trend</div>
                      <div className="font-semibold text-green-400 capitalize">{trend}</div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-300 mb-1">Support Level</div>
                      <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-sm">
                        {supportDisplay}
                      </span>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-300 mb-1">Resistance Level</div>
                      <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded text-sm">
                        {resistanceDisplay}
                      </span>
                    </div>

                    {indicators && Object.keys(indicators).length > 0 && (
                      <div className="border-t border-white/10 pt-3">
                        <div className="text-sm text-gray-300 mb-2">Indicators</div>
                        <div className="space-y-2">
                          {indicators.rsi && (
                            <div>
                              <span className="text-xs text-gray-400">RSI:</span>
                              <div className="text-sm text-purple-300">{indicators.rsi}</div>
                            </div>
                          )}
                          {indicators.macd && (
                            <div>
                              <span className="text-xs text-gray-400">MACD:</span>
                              <div className="text-sm text-purple-300">{indicators.macd}</div>
                            </div>
                          )}
                          {indicators.bollinger && (
                            <div>
                              <span className="text-xs text-gray-400">Bollinger Bands:</span>
                              <div className="text-sm text-purple-300">{indicators.bollinger}</div>
                            </div>
                          )}
                          {indicators.cumulative_delta && (
                            <div>
                              <span className="text-xs text-gray-400">Cumulative Delta:</span>
                              <div className="text-sm text-purple-300">{indicators.cumulative_delta}</div>
                            </div>
                          )}
                          {indicators.sentiment && (
                            <div>
                              <span className="text-xs text-gray-400">Sentiment:</span>
                              <div className="text-sm text-purple-300">{indicators.sentiment}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Economic Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-purple-400" />
            Economic Calendar
          </h2>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Event</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Impact</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Forecast</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {economicCalendar.map((event, index) => (
                    <tr key={index} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-sm text-white">{event.date || event.time || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-white">{event.event || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(event.impact || 'low')}`}>
                          {event.impact || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">{event.forecast || event.previous || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Macro Fundamentals */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-purple-400" />
            Macro Fundamentals
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold mb-3 text-purple-300">Economic Outlook</h3>
              <p className="text-gray-300 leading-relaxed">{macroFundamentals.economic_outlook}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold mb-3 text-purple-300">Market Sentiment</h3>
              <p className="text-gray-300 leading-relaxed">{macroFundamentals.market_sentiment}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold mb-3 text-purple-300">Risk Factors</h3>
              {macroFundamentals.risk_factors && macroFundamentals.risk_factors.length > 0 ? (
                <ul className="space-y-2">
                  {macroFundamentals.risk_factors.map((factor, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-300">
                      <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{factor}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-300 leading-relaxed">No specific risk factors identified.</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Strategic Notes */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Target className="w-8 h-8 text-purple-400" />
            Strategic Notes
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold mb-3 text-green-300 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Entry Strategy
              </h3>
              <p className="text-gray-300 leading-relaxed">{strategicNotes.entry_strategy}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold mb-3 text-yellow-300 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Risk Management
              </h3>
              <p className="text-gray-300 leading-relaxed">{strategicNotes.risk_management}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold mb-3 text-red-300 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Exit Strategy
              </h3>
              <p className="text-gray-300 leading-relaxed">{strategicNotes.exit_strategy}</p>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-center py-8 border-t border-white/10"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <img 
              src="/D-REVEAL full w1.png" 
              alt="D-REVEAL Logo" 
              className="h-8 w-auto opacity-70"
            />
            <div className="text-sm text-gray-400">
              Powered by {reportData.agent.name} v{reportData.agent.version} ({reportData.agent.model})
            </div>
          </div>
          <p className="text-xs text-gray-500">
            This report is generated for informational purposes only and should not be considered as financial advice.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ForecastReport;