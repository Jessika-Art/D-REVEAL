'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const MarketForecastingVisual = () => {
  const [dataPoints, setDataPoints] = useState<number[]>([]);

  // Generate dynamic market data points
  useEffect(() => {
    const generateDataPoints = () => {
      const points = [];
      let baseValue = 100;
      for (let i = 0; i < 20; i++) {
        const volatility = Math.sin(i * 0.3) * 15 + Math.random() * 10 - 5;
        baseValue += volatility;
        points.push(Math.max(50, Math.min(150, baseValue)));
      }
      return points;
    };

    setDataPoints(generateDataPoints());
    
    const interval = setInterval(() => {
      setDataPoints(generateDataPoints());
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const maxValue = Math.max(...dataPoints);
  const minValue = Math.min(...dataPoints);

  return (
    <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-1/2 h-full flex items-center justify-center">
      <div className="relative w-full max-w-2xl h-96 p-8">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-20">
          {/* Horizontal grid lines */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`h-${i}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ delay: i * 0.1 }}
              className="absolute w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
              style={{ top: `${(i / 5) * 100}%` }}
            />
          ))}
          {/* Vertical grid lines */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`v-${i}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              transition={{ delay: i * 0.05 }}
              className="absolute h-full w-px bg-gradient-to-b from-transparent via-blue-400 to-transparent"
              style={{ left: `${(i / 7) * 100}%` }}
            />
          ))}
        </div>

        {/* Market Chart Line */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200">
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          
          {/* Area under the curve */}
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, delay: 0.5 }}
            d={`M 20 ${200 - ((dataPoints[0] - minValue) / (maxValue - minValue)) * 160} 
                ${dataPoints.map((point, i) => 
                  `L ${20 + (i / (dataPoints.length - 1)) * 360} ${200 - ((point - minValue) / (maxValue - minValue)) * 160}`
                ).join(' ')} 
                L 380 200 L 20 200 Z`}
            fill="url(#areaGradient)"
          />
          
          {/* Main chart line */}
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.3 }}
            d={`M 20 ${200 - ((dataPoints[0] - minValue) / (maxValue - minValue)) * 160} 
                ${dataPoints.map((point, i) => 
                  `L ${20 + (i / (dataPoints.length - 1)) * 360} ${200 - ((point - minValue) / (maxValue - minValue)) * 160}`
                ).join(' ')}`}
            fill="none"
            stroke="url(#chartGradient)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          
          {/* Data points */}
          {dataPoints.map((point, i) => (
            <motion.circle
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.05, duration: 0.3 }}
              cx={20 + (i / (dataPoints.length - 1)) * 360}
              cy={200 - ((point - minValue) / (maxValue - minValue)) * 160}
              r="4"
              fill="#06b6d4"
              className="drop-shadow-lg"
            />
          ))}
        </svg>

        {/* Floating Data Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="absolute top-4 right-4 bg-black/40 backdrop-blur-md rounded-lg p-3 border border-cyan-400/30"
        >
          <div className="text-xs text-cyan-300 mb-1">Market Cap</div>
          <motion.div 
            key={dataPoints[dataPoints.length - 1]}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-lg font-bold text-white"
          >
            ${(dataPoints[dataPoints.length - 1] * 1.2).toFixed(1)}B
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md rounded-lg p-3 border border-purple-400/30"
        >
          <div className="text-xs text-purple-300 mb-1">Trend</div>
          <motion.div 
            className="text-lg font-bold text-green-400"
            animate={{ 
              color: dataPoints[dataPoints.length - 1] > dataPoints[dataPoints.length - 2] ? '#10b981' : '#ef4444'
            }}
          >
            {dataPoints[dataPoints.length - 1] > dataPoints[dataPoints.length - 2] ? '↗' : '↘'} 
            {Math.abs(((dataPoints[dataPoints.length - 1] - dataPoints[dataPoints.length - 2]) / dataPoints[dataPoints.length - 2]) * 100).toFixed(1)}%
          </motion.div>
        </motion.div>

        {/* Prediction Cone */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 0.6, scaleX: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 w-32 h-24 origin-left"
        >
          <div className="w-full h-full bg-gradient-to-r from-yellow-400/20 to-orange-500/10 transform skew-y-12 rounded-r-lg"></div>
          <div className="absolute top-1/2 left-0 transform -translate-y-1/2 text-xs text-yellow-400 font-semibold">
            Forecast
          </div>
        </motion.div>

        {/* Animated Particles */}
        {[...Array(8)].map((_, i) => {
          const positions = [
            { left: 20, top: 30 },
            { left: 70, top: 20 },
            { left: 40, top: 60 },
            { left: 80, top: 70 },
            { left: 15, top: 80 },
            { left: 60, top: 40 },
            { left: 90, top: 50 },
            { left: 30, top: 90 }
          ];
          const movements = [
            { x: 50, y: -30 },
            { x: -40, y: 60 },
            { x: 70, y: -50 },
            { x: -60, y: -40 },
            { x: 80, y: 30 },
            { x: -50, y: -60 },
            { x: 40, y: 70 },
            { x: -70, y: -30 }
          ];
          
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: [0, movements[i].x],
                y: [0, movements[i].y]
              }}
              transition={{
                duration: 3,
                delay: i * 0.3,
                repeat: Infinity,
                repeatDelay: 2
              }}
              className="absolute w-2 h-2 bg-cyan-400 rounded-full"
              style={{
                left: `${positions[i].left}%`,
                top: `${positions[i].top}%`
              }}
            />
          );
        })}

        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-purple-500/10 rounded-2xl blur-xl"></div>
      </div>
    </div>
  );
};

export default MarketForecastingVisual;