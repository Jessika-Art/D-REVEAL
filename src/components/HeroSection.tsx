'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { trackEvent } from './GoogleAnalytics';

const HeroSection = () => {
  return (
    <section className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-70"
      >
        <source src="/BG.mp4" type="video/mp4" />
      </video>
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30 z-5"></div>
      
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 pt-32">
        <div className="relative min-h-[calc(100vh-8rem)]">

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-20 max-w-none pt-16 lg:pt-24 flex flex-col justify-center min-h-[calc(100vh-12rem)]"
          >
            <h1 className="text-[4rem] sm:text-[5rem] md:text-[7rem] lg:text-[10rem] xl:text-[12rem] 2xl:text-[14rem] font-bold leading-[0.8] tracking-tight max-w-[90vw] sm:max-w-[85vw] md:max-w-[80vw] lg:max-w-none">
              Act before the market does
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-gray-300 leading-relaxed mt-6 sm:mt-8 lg:mt-12 max-w-[90vw] sm:max-w-[85vw] md:max-w-[75vw] lg:max-w-4xl">
              We go beyond analytics — we go beyond numbers and patterns. We use machine learning and AI to provide you with the most accurate and timely forecasts for the markets you care about.
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="pt-8 sm:pt-10 lg:pt-16"
            >
              <motion.a
                href="/demo"
                onClick={() => trackEvent('button_click', { button_name: 'launch_demo_hero' })}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-purple-600 transition-colors duration-[0.9s] inline-flex items-center gap-2"
              >
                Launch Demo
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </motion.a>
              {/* <button className="bg-white text-black px-6 py-3 sm:px-8 sm:py-4 lg:px-10 lg:py-5 rounded-full font-semibold flex items-center gap-2 sm:gap-3 hover:bg-gray-100 transition-colors text-base sm:text-lg tracking-wider uppercase">
                Launch Demo
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button> */}
            </motion.div>
          </motion.div>
        </div>
      </div>
      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 right-8 z-50"
      >
        <button
          className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center hover:border-white/40 transition-all duration-300 cursor-pointer group relative z-50 bg-black/20 backdrop-blur-sm"
          onClick={() => {
            console.log('Scroll button clicked!'); // Debug log
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
              const offsetTop = aboutSection.offsetTop;
              console.log('Scrolling to:', offsetTop); // Debug log
              window.scrollTo({
                top: offsetTop - 80,
                behavior: 'smooth'
              });
            } else {
              console.log('About section not found!'); // Debug log
            }
          }}
        >
          <ChevronDown className="w-5 h-5 text-white/60 group-hover:text-white/80 transition-colors" />
        </button>
      </motion.div>
    </section>
  );
};

export default HeroSection;