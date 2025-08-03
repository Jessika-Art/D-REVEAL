'use client';

import { motion } from 'framer-motion';
import { Building2, TrendingUp, Shield, Zap, Target, BarChart3, Users, CheckCircle } from 'lucide-react';

const CompaniesSection = () => {
  const targetAudience = [
    {
      icon: Building2,
      title: "Hedge Funds",
      description: "Institutional-grade forecasting for sophisticated trading strategies and risk management."
    },
    {
      icon: TrendingUp,
      title: "Prop Trading Firms",
      description: "Edge-driven insights for proprietary trading operations seeking alpha generation."
    },
    {
      icon: Shield,
      title: "Family Offices",
      description: "Wealth preservation and growth through forward-looking market intelligence."
    },
    {
      icon: Users,
      title: "Investment Banks",
      description: "Client advisory services backed by cutting-edge predictive analytics."
    }
  ];

  const comparisons = [
    {
      category: "High Frequency Trading HFT",
      ourApproach: "One forecast last days",
      others: "Ultra-expensive infrastructure, geo-distributed servers",
      advantage: "Anticipate the short and long-term market movements"
    },
    {
      category: "Traditional Technical Analysis",
      ourApproach: "Forward-looking price trajectories",
      others: "Lagging indicators and reactive signals",
      advantage: "See the future, don't follow the past"
    },
    {
      category: "Signal Services",
      ourApproach: "Visual forecasts with confidence zones",
      others: "Binary buy/sell alerts without context",
      advantage: "Understand probability, not just direction"
    },
    {
      category: "Sentiment Analysis",
      ourApproach: "Price-based predictive modeling",
      others: "News and social media sentiment",
      advantage: "Price leads sentiment, not the reverse"
    },
    {
      category: "Fundamental Analysis",
      ourApproach: "Economic event sensitivity integration",
      others: "Static fundamental metrics",
      advantage: "Dynamic adaptation to market conditions"
    }
  ];

  return (
    <section id="companies" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Target Audience Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8">
            Built for Professionals
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Designed for institutions that demand precision, clarity, and actionable intelligence in their trading decisions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {targetAudience.map((audience, index) => (
            <motion.div
              key={audience.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center p-6 rounded-2xl border border-gray-100 hover:border-purple-200 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl mb-6 mx-auto">
                <audience.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {audience.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {audience.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Comparison Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
            How We Compare
          </h3>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            While others rely on outdated methods, we deliver what professionals actually need: clarity about future market direction.
          </p>
        </motion.div>

        <div className="space-y-8 mb-16">
          {comparisons.map((comparison, index) => (
            <motion.div
              key={comparison.category}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-gray-50 to-purple-50 p-8 rounded-2xl border border-gray-100"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{comparison.category}</h4>
                  <div className="flex items-center gap-2 text-red-600">
                    <span className="text-sm font-medium">Others:</span>
                    <span className="text-sm">{comparison.others}</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">Our Approach:</span>
                  </div>
                  <p className="text-gray-900 font-medium">{comparison.ourApproach}</p>
                </div>
                <div className="text-right lg:text-left">
                  <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
                    <Zap className="w-4 h-4" />
                    {comparison.advantage}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Key Advantages Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-slate-900 to-purple-900 p-8 md:p-12 rounded-3xl text-white mb-16"
        >
          <h3 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Why D-REVEAL Stands Apart
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="flex items-start gap-4"
            >
              <div className="flex-shrink-0 w-2 h-2 bg-purple-400 rounded-full mt-3"></div>
              <div>
                <h4 className="text-lg font-bold mb-2">No expensive infrastructure</h4>
                <p className="text-white/80">No need for co-location, GPUs, or high-speed networks.</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex items-start gap-4"
            >
              <div className="flex-shrink-0 w-2 h-2 bg-purple-400 rounded-full mt-3"></div>
              <div>
                <h4 className="text-lg font-bold mb-2">No team required</h4>
                <p className="text-white/80">No quants, devs, or ops needed to keep it running.</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex items-start gap-4"
            >
              <div className="flex-shrink-0 w-2 h-2 bg-purple-400 rounded-full mt-3"></div>
              <div>
                <h4 className="text-lg font-bold mb-2">Self-contained intelligence</h4>
                <p className="text-white/80">The model forecasts forward based on real patterns, not lagging indicators.</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex items-start gap-4"
            >
              <div className="flex-shrink-0 w-2 h-2 bg-purple-400 rounded-full mt-3"></div>
              <div>
                <h4 className="text-lg font-bold mb-2">Clear output</h4>
                <p className="text-white/80">Visual candlestick forecasts, not abstract statistics.</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              className="flex items-start gap-4"
            >
              <div className="flex-shrink-0 w-2 h-2 bg-purple-400 rounded-full mt-3"></div>
              <div>
                <h4 className="text-lg font-bold mb-2">Adaptable</h4>
                <p className="text-white/80">Works across assets and timeframes without custom tuning.</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="flex items-start gap-4"
            >
              <div className="flex-shrink-0 w-2 h-2 bg-purple-400 rounded-full mt-3"></div>
              <div>
                <h4 className="text-lg font-bold mb-2">Lightweight and scalable</h4>
                <p className="text-white/80">Can serve hedge funds, family offices, and high-performing desks without a tech overhaul.</p>
              </div>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            viewport={{ once: true }}
            className="text-center border-t border-white/20 pt-8"
          >
            <p className="text-xl md:text-2xl font-bold text-purple-200 mb-4">
              This system delivers what others only imply:
            </p>
            <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
              A clear sense of where the market is going — before it does.
            </p>
          </motion.div>
        </motion.div>

        {/* Sample Results Section */}
        {/* <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-purple-500 to-blue-500 p-8 md:p-12 rounded-3xl text-white text-center"
        >
          <h3 className="text-3xl md:text-4xl font-bold mb-6">
            Sample Results
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl"
            >
              <div className="text-3xl font-bold mb-2">US500</div>
              <div className="text-lg opacity-90">Clear Trend Direction</div>
              <div className="text-sm opacity-75 mt-2">Any Timeframe</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl"
            >
              <div className="text-3xl font-bold mb-2">1 Hour to 30 Days</div>
              <div className="text-lg opacity-90">Forecast Horizon</div>
              <div className="text-sm opacity-75 mt-2">Forward-Looking</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl"
            >
              <div className="text-3xl font-bold mb-2">Economic Calendar</div>
              <div className="text-lg opacity-90">Price Zones</div>
              <div className="text-sm opacity-75 mt-2">Support & Resistance</div>
            </motion.div>
          </div>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Real forecasting intelligence with multi-timeframe analysis, confidence levels, and precise price targets.
          </p>
        </motion.div> */}
      </div>
    </section>
  );
};

export default CompaniesSection;