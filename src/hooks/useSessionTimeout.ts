import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface UseSessionTimeoutOptions {
  checkInterval?: number; // How often to check session (in ms)
  warningTime?: number; // Show warning when this many ms remain
  onWarning?: (timeRemaining: number) => void;
  onTimeout?: () => void;
}

export const useSessionTimeout = (options: UseSessionTimeoutOptions = {}) => {
  const {
    checkInterval = 30000, // Check every 30 seconds
    warningTime = 2 * 60 * 1000, // Warn when 2 minutes remain
    onWarning,
    onTimeout
  } = options;

  const router = useRouter();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const warningShownRef = useRef(false);

  const checkSession = useCallback(async () => {
    try {
      const response = await fetch('/api/auth', {
        credentials: 'include'
      });
      const data = await response.json();

      if (!data.authenticated) {
        // Session expired, redirect to login
        if (onTimeout) {
          onTimeout();
        }
        router.push('/admin/login');
        return;
      }

      // Check if we should show warning
      if (data.timeRemaining && data.timeRemaining <= warningTime && !warningShownRef.current) {
        warningShownRef.current = true;
        if (onWarning) {
          onWarning(data.timeRemaining);
        }
      }

      // Reset warning flag if we have more time
      if (data.timeRemaining && data.timeRemaining > warningTime) {
        warningShownRef.current = false;
      }

    } catch (error) {
      console.error('Session check failed:', error);
      // On error, redirect to login
      if (onTimeout) {
        onTimeout();
      }
      router.push('/admin/login');
    }
  }, [router, warningTime, onWarning, onTimeout]);

  const startSessionCheck = useCallback(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Start new interval
    intervalRef.current = setInterval(checkSession, checkInterval);

    // Check immediately
    checkSession();
  }, [checkSession, checkInterval]);

  const stopSessionCheck = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const refreshSession = useCallback(async () => {
    // Reset warning flag when manually refreshing
    warningShownRef.current = false;
    await checkSession();
  }, [checkSession]);

  useEffect(() => {
    startSessionCheck();

    // Cleanup on unmount
    return () => {
      stopSessionCheck();
    };
  }, [startSessionCheck, stopSessionCheck]);

  return {
    refreshSession,
    stopSessionCheck,
    startSessionCheck
  };
};