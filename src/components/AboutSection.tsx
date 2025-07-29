'use client';

import { motion } from 'framer-motion';

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8">
            Market Direction — Made Obvious
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Forward-looking price forecasts for professionals who trade ahead, not behind.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                What This Is
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                We deliver high-confidence market forecasts — visually, clearly, and ahead of time — to institutions seeking precision without noise.
              </p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-8 rounded-2xl">
              <h4 className="text-2xl font-bold text-gray-900 mb-4">
                We show you the future, You take the decision
              </h4>
              <p className="text-lg text-gray-700 leading-relaxed">
                Forecasting tools today are built on indicators, guesswork, or consensus. Our platform is different. It gives you <strong>candlestick-level forecasts</strong> — not signals, not sentiment, but clear visual market direction.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 bg-white rounded-xl shadow-lg border border-gray-100"
              >
                <div className="text-3xl font-bold text-purple-600 mb-2">+180</div>
                <div className="text-sm text-gray-600">Pips EURUSD</div>
                <div className="text-xs text-gray-500 mt-1">July 8 Forecast</div>
              </motion.div> */}
              {/* <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-center p-6 bg-white rounded-xl shadow-lg border border-gray-100"
              >
                <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
                <div className="text-sm text-gray-600">Within Zone</div>
                <div className="text-xs text-gray-500 mt-1">Confidence Range</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="text-center p-6 bg-white rounded-xl shadow-lg border border-gray-100"
              >
                <div className="text-3xl font-bold text-cyan-600 mb-2">4H</div>
                <div className="text-sm text-gray-600">Timeframe</div>
                <div className="text-xs text-gray-500 mt-1">Multi-Frame</div>
              </motion.div> */}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative h-full flex items-center justify-center"
          >
            {/* Proportional Python List Logo */}
            <div className="relative w-full max-w-md h-64 flex items-center justify-center">
              {/* Outer glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-300 via-blue-400 to-purple-500 blur-xl opacity-20 rounded-3xl"></div>
              
              {/* Main container with subtle background */}
              <div className="relativebg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm rounded-2xl p-8 w-full h-full flex items-center justify-center">
                {/* Python List Syntax */}
                <div className="text-4xl md:text-[12rem] font-mono text-cyan-400 flex items-center justify-center gap-14">
                  {/* Opening bracket */}
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="text-cyan-300"
                  >
                    [
                  </motion.span>
                  
                  {/* Dots representing list items in 2x2 grid with Matrix effect */}
                  <div className="relative grid grid-cols-2 gap-[6rem] mt-6">
                    {/* Matrix-style scrolling code background */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      {/* Vertical code streams */}
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute text-xs font-mono text-black-900/50 whitespace-nowrap"
                          style={{
                            left: `${20 + i * 30}%`,
                            top: '-100%',
                          }}
                          animate={{
                            y: ['0%', '300%'],
                          }}
                          transition={{
                            duration: 3 + i * 0.5,
                            repeat: Infinity,
                            ease: "linear",
                            delay: i * 0.8,
                          }}
                        >
                          <div className="flex flex-col gap-1">
                            <span>def</span>
                            <span>for</span>
                            <span>()</span>
                            <span>map</span>
                            <span>lambda</span>
                            <span>if</span>
                            <span>in</span>
                            <span>[]</span>
                            <span>:</span>
                            <span>+=</span>
                            <span>==</span>
                            <span>!=</span>
                            <span>or</span>
                            <span>and</span>
                            <span>not</span>
                          </div>
                        </motion.div>
                      ))}
                      
                      {/* Horizontal code streams */}
                      {[...Array(2)].map((_, i) => (
                        <motion.div
                          key={`h-${i}`}
                          className="absolute text-xs font-mono text-black-900/80 whitespace-nowrap"
                          style={{
                            top: `${30 + i * 40}%`,
                            left: '-100%',
                          }}
                          animate={{
                            x: ['0%', '200%'],
                          }}
                          transition={{
                            duration: 4 + i * 0.7,
                            repeat: Infinity,
                            ease: "linear",
                            delay: i * 1.2,
                          }}
                        >
                          <span>import numpy as np • list.append() • range(10) • len(data)</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Dots with higher z-index to appear above Matrix effect */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ 
                        opacity: [0.4, 1, 0.4, 0.8, 1, 0.4, 0.8, 1],
                        scale: [0, 1, 1.1, 0.95, 1, 1.1, 0.95, 1],
                        y: [0, 0, -4, 2, 0, -4, 2, 0]
                      }}
                      transition={{ 
                        duration: 1.2, 
                        delay: 0.8,
                        opacity: {
                          duration: 6,
                          repeat: Infinity,
                          ease: "easeInOut",
                          times: [0, 0.1, 0.25, 0.4, 0.5, 0.75, 0.9, 1]
                        },
                        scale: {
                          duration: 6,
                          repeat: Infinity,
                          ease: "easeInOut",
                          times: [0, 0.1, 0.25, 0.4, 0.5, 0.75, 0.9, 1]
                        },
                        y: {
                          duration: 6,
                          repeat: Infinity,
                          ease: "easeInOut",
                          times: [0, 0.1, 0.25, 0.4, 0.5, 0.75, 0.9, 1]
                        }
                      }}
                      className="relative z-10 w-5 h-5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full shadow-lg shadow-cyan-400/50"
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ 
                        opacity: [0, 1, 1, 0.4, 0.8, 1, 0.4, 0.8],
                        scale: [0, 1, 1, 1.1, 0.95, 1, 1.1, 0.95],
                        y: [0, 0, 0, -4, 2, 0, -4, 2]
                      }}
                      transition={{ 
                        duration: 0.6, 
                        delay: 0.9,
                        opacity: {
                          duration: 6,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 1,
                          times: [0, 0.1, 0.25, 0.4, 0.5, 0.75, 0.9, 1]
                        },
                        scale: {
                          duration: 6,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 1,
                          times: [0, 0.1, 0.25, 0.4, 0.5, 0.75, 0.9, 1]
                        },
                        y: {
                          duration: 6,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 1,
                          times: [0, 0.1, 0.25, 0.4, 0.5, 0.75, 0.9, 1]
                        }
                      }}
                      className="relative z-10 w-5 h-5 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full shadow-lg shadow-blue-400/50"
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ 
                        opacity: [0, 1, 0.8, 1, 0.4, 0.8, 1, 0.4],
                        scale: [0, 1, 0.95, 1, 1.1, 0.95, 1, 1.1],
                        y: [0, 0, 2, 0, -4, 2, 0, -4]
                      }}
                      transition={{ 
                        duration: 0.6, 
                        delay: 1.1,
                        opacity: {
                          duration: 6,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 2,
                          times: [0, 0.1, 0.25, 0.4, 0.5, 0.75, 0.9, 1]
                        },
                        scale: {
                          duration: 6,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 2,
                          times: [0, 0.1, 0.25, 0.4, 0.5, 0.75, 0.9, 1]
                        },
                        y: {
                          duration: 6,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 2,
                          times: [0, 0.1, 0.25, 0.4, 0.5, 0.75, 0.9, 1]
                        }
                      }}
                      className="relative z-10 w-5 h-5 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full shadow-lg shadow-purple-400/50"
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ 
                        opacity: [0, 1, 0.4, 0.8, 1, 0.4, 0.8, 1],
                        scale: [0, 1, 1.1, 0.95, 1, 1.1, 0.95, 1],
                        y: [0, 0, -4, 2, 0, -4, 2, 0]
                      }}
                      transition={{ 
                        duration: 0.6, 
                        delay: 1.3,
                        opacity: {
                          duration: 6,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 3,
                          times: [0, 0.1, 0.25, 0.4, 0.5, 0.75, 0.9, 1]
                        },
                        scale: {
                          duration: 6,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 3,
                          times: [0, 0.1, 0.25, 0.4, 0.5, 0.75, 0.9, 1]
                        },
                        y: {
                          duration: 6,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 3,
                          times: [0, 0.1, 0.25, 0.4, 0.5, 0.75, 0.9, 1]
                        }
                      }}
                      className="relative z-10 w-5 h-5 bg-gradient-to-r from-pink-400 to-cyan-500 rounded-full shadow-lg shadow-pink-400/50"
                    />
                  </div>
                  
                  {/* Closing bracket */}
                  <motion.span
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1.0, delay: 0.6 }}
                    className="text-cyan-300"
                  >
                    ]
                  </motion.span>
                </div>
                
                {/* Subtle code-like background pattern */}
                <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-2xl"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;