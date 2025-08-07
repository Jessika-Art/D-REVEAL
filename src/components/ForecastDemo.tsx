'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Calendar, Target, BarChart3, AlertTriangle, CheckCircle, Clock, DollarSign, Activity, Maximize2, X, Move, ZoomIn, ZoomOut, Hand, HelpCircle, Home, ArrowRight, Link, Check, QrCode } from 'lucide-react';
import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { trackEvent, trackButtonClick } from './GoogleAnalytics';

interface ForecastData {
  agent: {
    name: string;
    forecast_recaps: {
      asset: string;
      forecast_direction: string;
      timeframe: string;
      confidence_level: string;
    };
    technical_analysis: {
      [key: string]: {
        trend: string;
        support_resistance: {
          support: number[];
          resistance: number[];
        };
        supply_demand_zones: {
          demand: number[];
          supply: number[];
        };
        structure: {
          BOS: string;
          ChOCh: string;
        };
        indicators: {
          cumulative_delta: string;
          sentiment: string;
          market_regime: string;
        };
      };
    };
    macro_fundamentals: string;
    economic_calendar: Array<{
      country: string;
      event: string;
      time: string;
      impact: string;
      forecast: string;
      previous: string;
    }>;
    justification: string;
    strategic_notes: string;
    summary: string[];
  };
}

const ForecastDemo = () => {
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isChartFullscreen, setIsChartFullscreen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeDataURL, setQrCodeDataURL] = useState('');

  useEffect(() => {
    const loadForecastData = async () => {
      try {
        const response = await fetch('/api/forecast-data');
        if (!response.ok) {
          // Fallback to static import if API fails
          const data = await import('../reports/US500.json');
          setForecastData(data.default);
        } else {
          const data = await response.json();
          setForecastData(data);
        }
      } catch (error) {
        console.error('Error loading forecast data:', error);
        // Fallback to static import
        try {
          const data = await import('../reports/US500.json');
          setForecastData(data.default);
        } catch (importError) {
          console.error('Error importing static data:', importError);
        }
      } finally {
        setLoading(false);
      }
    };

    loadForecastData();
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!forecastData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center text-white">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Unable to Load Forecast Data</h2>
          <p className="text-gray-300">Please try again later.</p>
        </div>
      </div>
    );
  }

  const { agent } = forecastData;
  const getDirectionIcon = (direction: string) => {
    return direction.toLowerCase() === 'buy' ? TrendingUp : TrendingDown;
  };

  const getDirectionColor = (direction: string) => {
    return direction.toLowerCase() === 'buy' ? 'text-green-400' : 'text-red-400';
  };

  const getConfidenceColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date to dd/mm/yyyy format
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return dateString; // Return original if invalid
      }
      
      // Format to dd/mm/yyyy
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      
      return `${day}/${month}/${year}`;
    } catch (error) {
      return dateString; // Return original if error
    }
  };

  // Sort economic calendar by date (nearest upcoming events first)
  const sortedEconomicCalendar = [...agent.economic_calendar].sort((a, b) => {
    try {
      const dateA = new Date(a.time);
      const dateB = new Date(b.time);
      return dateA.getTime() - dateB.getTime(); // Ascending order (nearest dates first)
    } catch (error) {
      return 0; // Keep original order if dates can't be parsed
    }
  });

  const DirectionIcon = getDirectionIcon(agent.forecast_recaps.forecast_direction);

  // Calculate duration based on timeframe * 60
  const calculateDuration = (timeframe: string) => {
    const numericValue = parseInt(timeframe.replace(/[^0-9]/g, ''));
    const totalHours = numericValue * 60;
    const days = Math.round(totalHours / 24); // Convert hours to days
    
    if (days >= 30) {
      const months = Math.round(days / 30);
      return `${months} month${months > 1 ? 's' : ''}`;
    } else {
      return `${days} day${days > 1 ? 's' : ''}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white relative overflow-hidden">

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
                onClick={() => trackEvent('button_click', { button_name: 'return_to_home_demo' })}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full font-medium transition-all text-sm sm:text-base w-full xs:w-auto"
              >
                <Home className="w-4 h-4" />
                <span className="hidden xs:inline">Return to Home</span>
                <span className="xs:hidden">Home</span>
              </motion.a>
              <motion.a
                href="/waitlist"
                onClick={() => trackEvent('button_click', { button_name: 'request_access_demo' })}
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
                onClick={() => {
                  trackEvent('button_click', { button_name: 'generate_qr_code' });
                  generateQRCode();
                }}
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
                onClick={() => {
                  trackEvent('button_click', { button_name: 'copy_url' });
                  copyURL();
                }}
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
              <p className="text-purple-300 mt-2">to Nexus Alpha Capital</p>
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
                <div className="text-lg font-semibold">{agent.date ? formatDate(agent.date) : formatDate(new Date().toISOString())}</div>
                <div className="text-sm text-gray-500">dd/mm/yyyy</div>
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
              <div className="text-3xl font-bold text-purple-300">{agent.forecast_recaps.asset}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-300 mb-2">Direction</div>
              <div className={`flex items-center justify-center gap-2 text-2xl font-bold ${getDirectionColor(agent.forecast_recaps.forecast_direction)}`}>
                <DirectionIcon className="w-8 h-8" />
                {agent.forecast_recaps.forecast_direction}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-300 mb-2">Timeframe</div>
              <div className="text-2xl font-bold text-blue-300">{agent.forecast_recaps.timeframe}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-300 mb-2">Duration</div>
              <div className="text-2xl font-bold text-purple-400">
                {calculateDuration(agent.forecast_recaps.timeframe)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-300 mb-2">Confidence</div>
              <div className="flex items-center justify-center">
                <span className={`px-4 py-2 rounded-full text-white font-bold ${getConfidenceColor(agent.forecast_recaps.confidence_level)}`}>
                  {agent.forecast_recaps.confidence_level}
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
                  src="/US500.png" 
                  alt={`${agent.forecast_recaps.asset} ${agent.forecast_recaps.timeframe} Forecast Chart`}
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
            </div>
            
            {/* Chart Info - moved outside */}
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
            {Object.entries(agent.technical_analysis).map(([timeframe, analysis], index) => (
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
                    <div className="font-semibold text-green-400 capitalize">{analysis.trend}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-300 mb-1">Support Levels</div>
                    <div className="flex flex-wrap gap-2">
                      {analysis.support_resistance.support.map((level, idx) => (
                        <span key={idx} className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-sm">
                          {level}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-300 mb-1">Resistance Levels</div>
                    <div className="flex flex-wrap gap-2">
                      {analysis.support_resistance.resistance.map((level, idx) => (
                        <span key={idx} className="px-2 py-1 bg-red-500/20 text-red-300 rounded text-sm">
                          {level}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-300 mb-1">Demand Zones</div>
                    <div className="flex flex-wrap gap-2">
                      {analysis.supply_demand_zones.demand.map((level, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-sm">
                          {level}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-300 mb-1">Supply Zones</div>
                    <div className="flex flex-wrap gap-2">
                      {analysis.supply_demand_zones.supply.map((level, idx) => (
                        <span key={idx} className="px-2 py-1 bg-orange-500/20 text-orange-300 rounded text-sm">
                          {level}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-3">
                    <div className="text-sm text-gray-300 mb-2">Market Structure</div>
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs text-gray-400">BOS:</span>
                        <div className="text-sm text-purple-300">{analysis.structure.BOS}</div>
                      </div>
                      <div>
                        <span className="text-xs text-gray-400">ChOCh:</span>
                        <div className="text-sm text-purple-300">{analysis.structure.ChOCh}</div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-3">
                    <div className="text-sm text-gray-300 mb-2">Advanced Indicators</div>
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs text-gray-400">Cumulative Delta:</span>
                        <div className="text-sm text-cyan-300">{analysis.indicators.cumulative_delta}</div>
                      </div>
                      <div>
                        <span className="text-xs text-gray-400">Sentiment:</span>
                        <div className="text-sm text-cyan-300">{analysis.indicators.sentiment}</div>
                      </div>
                      <div>
                        <span className="text-xs text-gray-400">Market Regime:</span>
                        <div className="text-sm text-cyan-300">{analysis.indicators.market_regime}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
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
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Previous</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedEconomicCalendar.map((event, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                      className="border-t border-white/10 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {formatDate(event.time)}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">{event.event}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(event.impact)}`}>
                          {event.impact}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-blue-300">{event.forecast}</td>
                      <td className="px-6 py-4 text-sm text-gray-400">{event.previous}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Analysis Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Macro Fundamentals */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
              <DollarSign className="w-6 h-6 text-purple-400" />
              Macro Fundamentals
            </h3>
            <p className="text-gray-300 leading-relaxed">{agent.macro_fundamentals}</p>
          </motion.div>

          {/* Strategic Notes */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
              <Target className="w-6 h-6 text-purple-400" />
              Strategic Notes
            </h3>
            <p className="text-gray-300 leading-relaxed">{agent.strategic_notes}</p>
          </motion.div>
        </div>

        {/* Justification */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-300/30 mb-8"
        >
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <Activity className="w-8 h-8 text-purple-400" />
            AI Model Justification
          </h3>
          <p className="text-gray-200 leading-relaxed text-lg">{agent.justification}</p>
        </motion.div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
        >
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-400" />
            Executive Summary
          </h3>
          <div className="space-y-3">
            {agent.summary.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                className="flex items-start gap-3"
              >
                <div className="flex-shrink-0 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-green-900 text-sm font-bold">✓</span>
                </div>
                <p className="text-gray-200 leading-relaxed">{point}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Fullscreen Chart Modal */}
      {isChartFullscreen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsChartFullscreen(false)}
        >
          <div className="relative w-[200%] h-full max-w-[82%] max-h-[90%] pt-20">
            <button
              onClick={() => setIsChartFullscreen(false)}
              className="absolute top-4 right-4 z-10 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors group"
              title="Close Fullscreen"
            >
              <X className="w-6 h-6 text-white group-hover:text-gray-300 transition-colors" />
            </button>
            <div className="w-full h-full bg-black/30 rounded-xl border border-white/20">
              <img 
                src="/US500.png" 
                alt={`${agent.forecast_recaps.asset} ${agent.forecast_recaps.timeframe} Forecast Chart - Fullscreen`}
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* QR Code Modal */}
      {showQRCode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowQRCode(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-lg p-6 max-w-sm mx-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Scan QR Code
            </h3>
            {qrCodeDataURL && (
              <img
                src={qrCodeDataURL}
                alt="QR Code"
                className="mx-auto mb-4 rounded-lg"
              />
            )}
            <p className="text-sm text-gray-600 mb-4">
              Scan this QR code to open this page on another device
            </p>
            <button
              onClick={() => setShowQRCode(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ForecastDemo;