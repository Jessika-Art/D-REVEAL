'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Eye, TrendingUp, Shield, Zap, Clock, Target } from 'lucide-react';

const OpportunitiesSection = () => {
  const valueProps = [
    {
      icon: Eye,
      title: "See What Others Can't",
      description: "While others react to price movements, you'll see them coming days in advance.",
      highlight: "Predictive Edge"
    },
    {
      icon: TrendingUp,
      title: "Trade with Confidence",
      description: "Visual forecasts with confidence zones eliminate guesswork from your trading decisions.",
      highlight: "Precision Clarity"
    },
    {
      icon: Shield,
      title: "Institutional Quality",
      description: "Professional-grade tools designed for sophisticated trading operations and risk management.",
      highlight: "Elite Standards"
    },
    {
      icon: Zap,
      title: "Immediate Implementation",
      description: "No complex setups or learning curves. Visual forecasts integrate directly into your workflow.",
      highlight: "Instant Value"
    }
  ];

  const benefits = [
    "Forward-looking price trajectories, not lagging indicators",
    "Multi-timeframe confluence for enhanced precision",
    "Economic event sensitivity and market adaptation",
    "Visual confidence zones with probability assessments",
    "Setup detection for breakouts and reversals",
    "Weekly institutional reports and custom training"
  ];

  return (
    <section id="opportunities" className="py-20 bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8">
            The Future of Trading Intelligence
          </h2>
          <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed">
            Stop following the market. Start leading it. Join the institutions that see tomorrow's moves today.
          </p>
        </motion.div>

        {/* Value Propositions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {valueProps.map((prop, index) => (
            <motion.div
              key={prop.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:border-white/40 transition-all"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-400 to-blue-400 rounded-xl">
                  <prop.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{prop.title}</h3>
                  <span className="text-sm text-purple-300 font-medium">{prop.highlight}</span>
                </div>
              </div>
              <p className="text-white/80 leading-relaxed">{prop.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Benefits List */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-white/5 backdrop-blur-sm p-8 md:p-12 rounded-3xl border border-white/10 mb-16"
        >
          <h3 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            What You Get
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-4"
              >
                <div className="flex-shrink-0 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                  <span className="text-green-900 text-sm font-bold">✓</span>
                </div>
                <span className="text-white/90">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4"
            >
              60 candles
            </motion.div>
            <h4 className="text-xl font-semibold mb-2">Advance Warning</h4>
            <p className="text-white/70">See market moves before they happen</p>
          </div>
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4"
            >
              100%
            </motion.div>
            <h4 className="text-xl font-semibold mb-2">Zone Accuracy</h4>
            <p className="text-white/70">Precision targeting with confidence</p>
          </div>
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4"
            >
              Decision
            </motion.div>
            <h4 className="text-xl font-semibold mb-2">Immediate Impact</h4>
            <p className="text-white/70">Real performance, real results</p>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-8 md:p-12 rounded-3xl">
            <h3 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to See the Future?
            </h3>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              Join the Waitlist now.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.a
                href="/waitlist"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
              >
                Request Access
                <ArrowRight className="w-5 h-5" />
              </motion.a>
              <motion.a
                 href="/demo"
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-purple-600 transition-colors inline-flex items-center gap-2"
               >
                 View Sample Forecasts
                 <Eye className="w-5 h-5" />
               </motion.a>
            </div>
            <p className="text-sm opacity-75 mt-6">
              Institutional partnerships only • Minimum AUM requirements apply
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OpportunitiesSection;