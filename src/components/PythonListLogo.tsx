'use client';

import { motion } from 'framer-motion';

const PythonListLogo = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, x: 50 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      transition={{ duration: 1, delay: 0.2 }}
      className="absolute top-1/2 right-0 transform -translate-y-1/2 md:right-4 lg:right-8 xl:right-16 2xl:right-24"
    >
      {/* Python List Container - Much bigger sizes */}
      <div className="relative w-[32rem] h-[32rem] md:w-[40rem] md:h-[40rem] lg:w-[48rem] lg:h-[48rem] xl:w-[56rem] xl:h-[56rem] 2xl:w-[64rem] 2xl:h-[64rem] flex items-center justify-center">
        {/* Outer glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-300 via-blue-400 to-purple-500 blur-[6vw] opacity-20 rounded-[6vw]"></div>
        
        {/* Main container with subtle background */}
        <div className="relative bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-[6vw] rounded-[4vw] p-12 md:p-16 lg:p-20 xl:p-24 2xl:p-28">
          {/* Python List Syntax - Much bigger text */}
          <div className="text-8xl md:text-[10rem] lg:text-[12rem] xl:text-[14rem] 2xl:text-[16rem] font-mono text-cyan-400 flex items-center justify-center gap-4 md:gap-6 lg:gap-8 xl:gap-10 2xl:gap-12">
            {/* Opening bracket */}
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-cyan-300"
            >
              [
            </motion.span>
            
            {/* Dots representing list items in 2x2 grid - Proportionally bigger */}
            <div className="grid grid-cols-2 gap-8 md:gap-10 lg:gap-12 xl:gap-14 2xl:gap-16 mt-4 md:mt-6 lg:mt-8">
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0.4, 0.8, 1, 0.4, 0.8, 1],
                  scale: [0, 1, 1.1, 0.95, 1, 1.1, 0.95, 1],
                  y: [0, 0, -8, 4, 0, -8, 4, 0]
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
                className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 1, 0.4, 0.8, 1, 0.4, 0.8],
                  scale: [0, 1, 1, 1.1, 0.95, 1, 1.1, 0.95],
                  y: [0, 0, 0, -8, 4, 0, -8, 4]
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
                className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0.8, 1, 0.4, 0.8, 1, 0.4],
                  scale: [0, 1, 0.95, 1, 1.1, 0.95, 1, 1.1],
                  y: [0, 0, 4, 0, -8, 4, 0, -8]
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
                className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0.4, 0.8, 1, 0.4, 0.8, 1],
                  scale: [0, 1, 1.1, 0.95, 1, 1.1, 0.95, 1],
                  y: [0, 0, -8, 4, 0, -8, 4, 0]
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
                className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 bg-gradient-to-r from-pink-400 to-cyan-500 rounded-full"
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
          <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-[4vw]"></div>
        </div>
      </div>
    </motion.div>
  );
};

export default PythonListLogo;