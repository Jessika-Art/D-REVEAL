'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Target, BarChart3, Zap, Eye, Calendar, Settings } from 'lucide-react';

const HowItWorksSection = () => {
  const offerings = [
    {
      icon: TrendingUp,
      title: "Future Price Trajectories",
      description: "Visual candlestick forecasts shown directly on charts — not signals, not sentiment, but clear market direction."
    },
    {
      icon: Target,
      title: "Multi-Timeframe Confluence",
      description: "Directional alignment across multiple timeframes for enhanced confidence and precision."
    },
    {
      icon: BarChart3,
      title: "Economic Event Sensitivity",
      description: "Forecast adjustments based on upcoming economic events and market-moving announcements."
    },
    {
      icon: Eye,
      title: "Confidence Zones",
      description: "Know not just where the market is going, but how far — with precise confidence intervals."
    },
    {
      icon: Zap,
      title: "Setup Detection",
      description: "Identify breakout zones, reversals, and trend continuations before they happen."
    },
    {
      icon: Settings,
      title: "Custom Asset Training",
      description: "Specialized model training on specific assets or portfolios for enhanced accuracy."
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8">
            What We Offer
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Professional-grade forecasting tools that deliver clarity without noise. Built for institutions that demand precision.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {offerings.map((offering, index) => (
            <motion.div
              key={offering.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl mb-6 mx-auto">
                <offering.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                {offering.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-center">
                {offering.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* What You Won't Find Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-red-50 to-orange-50 p-8 md:p-12 rounded-3xl border border-red-100"
        >
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
            What You Won't Find Here
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-500 text-2xl">✕</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">No Noisy Indicators</h4>
              <p className="text-gray-600">No dashboards filled with lagging indicators and confusing signals.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-500 text-2xl">✕</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">No Signal Spam</h4>
              <p className="text-gray-600">No overwhelming alerts or lagging setups that follow price action.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-500 text-2xl">✕</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">No Retail Fluff</h4>
              <p className="text-gray-600">No mass-market appeal or outdated strategies without institutional rigor.</p>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <p className="text-xl font-semibold text-gray-900">
              Just the future, visualized — with the clarity professionals demand.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;