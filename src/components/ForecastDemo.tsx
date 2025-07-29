'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Calendar, Target, BarChart3, AlertTriangle, CheckCircle, Clock, DollarSign, Activity, Maximize2, X } from 'lucide-react';
import { useState, useEffect } from 'react';

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
          demand: string[];
          supply: string[];
        };
        structure: {
          BOS: string;
          ChOCh: string;
        };
        indicators: {
          RSI: string;
          MACD: string;
          MA: {
            [key: string]: string;
          };
          Bollinger_Bands: string;
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-black/20 backdrop-blur-sm border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
                <div className="text-lg font-semibold">{new Date().toLocaleDateString()}</div>
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
              <button
                onClick={() => setIsChartFullscreen(true)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
                title="View Fullscreen"
              >
                <Maximize2 className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              </button>
            </div>
            <div className="p-2">
              <div className="bg-black/30 rounded-xl border border-white/10 overflow-hidden" style={{ height: '600px' }}>
                <iframe 
                  src="/US500.html" 
                  title={`${agent.forecast_recaps.asset} ${agent.forecast_recaps.timeframe} Interactive Chart Analysis`}
                  className="w-full h-full border-0"
                  style={{ 
                    overflow: 'hidden',
                    transform: 'scale(0.66)',
                    transformOrigin: 'top left',
                    width: '177%',
                    height: '200%'
                  }}
                />
              </div>
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
                  {agent.economic_calendar.map((event, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                      className="border-t border-white/10 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {new Date(event.time).toLocaleDateString()}
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
            <div className="w-full h-full bg-black/30 rounded-xl border border-white/20 overflow-hidden">
              <iframe 
                src="/US500.html" 
                title={`${agent.forecast_recaps.asset} ${agent.forecast_recaps.timeframe} Interactive Chart Analysis - Fullscreen`}
                className="w-full h-full border-0"
                style={{ 
                   overflow: 'hidden',
                   transform: 'scale(1.0)',
                   transformOrigin: 'top left',
                   width: '100%',
                   height: '100%'
                 }}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ForecastDemo;