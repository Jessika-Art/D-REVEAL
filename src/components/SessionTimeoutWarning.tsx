'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, RefreshCw, LogOut } from 'lucide-react';

interface SessionTimeoutWarningProps {
  timeRemaining: number;
  onExtendSession: () => void;
  onLogout: () => void;
}

export default function SessionTimeoutWarning({ 
  timeRemaining, 
  onExtendSession, 
  onLogout 
}: SessionTimeoutWarningProps) {
  const [countdown, setCountdown] = useState(timeRemaining);

  useEffect(() => {
    setCountdown(timeRemaining);
    
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1000) {
          clearInterval(interval);
          onLogout(); // Auto logout when time runs out
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining, onLogout]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-4 right-4 z-50 bg-amber-500 text-white p-4 rounded-lg shadow-lg border border-amber-600 max-w-sm"
      >
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-amber-100 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-sm mb-1">Session Expiring Soon</h3>
            <p className="text-xs text-amber-100 mb-3">
              Your session will expire in <span className="font-mono font-bold">{formatTime(countdown)}</span>
            </p>
            <div className="flex gap-2">
              <button
                onClick={onExtendSession}
                className="flex items-center gap-1 bg-white text-amber-600 hover:bg-amber-50 px-3 py-1.5 rounded text-xs font-medium transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                Extend Session
              </button>
              <button
                onClick={onLogout}
                className="flex items-center gap-1 bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors"
              >
                <LogOut className="w-3 h-3" />
                Logout Now
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}