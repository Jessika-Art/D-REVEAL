'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'WHAT', href: '#about' },
    // { name: 'SERVICES', href: '#companies' },
    { name: 'SERVICES', href: '#how-it-works' },
    { name: 'WHY', href: '#opportunities' },
    // { name: 'INVESTMENT', href: '#careers' },
    // { name: 'CONTACT', href: '#community' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center -ml-2 xl:-ml-32 2xl:-ml-80"
          >
            {/* D-REVEAL logo */}
            <img 
              src="/D-REVEAL full w1.png" 
              alt="D-REVEAL Logo" 
              className="h-8 w-auto md:h-10 xl:h-14 2xl:h-16 object-contain"
            />
          </motion.div>

          {/* Centered Desktop Navigation */}
          <div className="hidden xl:flex items-center justify-center flex-1">
            <div className="flex items-center gap-12">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-white/90 hover:text-white transition-colors text-sm font-medium tracking-wider"
                >
                  {item.name}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Apply Button */}
          <motion.a
            href="/waitlist"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="hidden xl:flex bg-white text-black px-8 py-3 rounded-full font-medium transition-colors hover:bg-gray-100 items-center gap-2 text-sm tracking-wider"
          >
            GET STARTED
            <ArrowRight className="w-4 h-4" />
          </motion.a>

          {/* Mobile and Tablet Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="xl:hidden p-2 rounded-lg text-white"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile and Tablet Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden bg-black/95 rounded-lg mt-2 py-4"
          >
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-white/80 hover:text-white text-sm font-medium tracking-wide"
              >
                {item.name}
              </a>
            ))}
            <div className="px-4 pt-2">
              <a 
                href="/waitlist"
                onClick={() => setIsOpen(false)}
                className="w-full bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-gray-100 flex items-center justify-center gap-2 text-sm tracking-wide"
              >
                GET STARTED
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;