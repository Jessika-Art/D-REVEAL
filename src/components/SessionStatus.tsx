'use client';

import { useState, useEffect } from 'react';
import { Clock, Shield, RotateCcw } from 'lucide-react';

interface SessionRotationInfo {
  lastRotated: string;
  nextRotationIn: string;
  rotationIntervalMinutes: number;
}

interface SessionStatusData {
  status: string;
  sessionRotation: SessionRotationInfo;
  message: string;
}

export default function SessionStatus() {
  const [sessionData, setSessionData] = useState<SessionStatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [forceRotating, setForceRotating] = useState(false);

  const fetchSessionStatus = async () => {
    try {
      const response = await fetch('/api/session-status');
      if (response.ok) {
        const data = await response.json();
        setSessionData(data);
      }
    } catch (error) {
      console.error('Failed to fetch session status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleForceRotation = async () => {
    if (!confirm('This will immediately log out all admin users. Continue?')) {
      return;
    }

    setForceRotating(true);
    try {
      const response = await fetch('/api/session-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'force-rotation' })
      });

      if (response.ok) {
        // Refresh the status after rotation
        setTimeout(() => {
          fetchSessionStatus();
          setForceRotating(false);
        }, 1000);
      }
    } catch (error) {
      console.error('Failed to force rotation:', error);
      setForceRotating(false);
    }
  };

  useEffect(() => {
    fetchSessionStatus();
    
    // Refresh status every 30 seconds
    const interval = setInterval(fetchSessionStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-blue-600 animate-spin" />
          <span className="text-sm text-blue-700">Loading session status...</span>
        </div>
      </div>
    );
  }

  if (!sessionData) {
    return null;
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <Shield className="h-5 w-5 text-amber-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-800">Auto Session Rotation</h3>
            <p className="text-sm text-amber-700 mt-1">
              {sessionData.message}
            </p>
            <div className="mt-2 space-y-1 text-xs text-amber-600">
              <div>Last rotated: {new Date(sessionData.sessionRotation.lastRotated).toLocaleString()}</div>
              <div>Next rotation: {sessionData.sessionRotation.nextRotationIn}</div>
              <div>Interval: {sessionData.sessionRotation.rotationIntervalMinutes} minutes</div>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleForceRotation}
          disabled={forceRotating}
          className="flex items-center space-x-1 px-3 py-1 text-xs bg-amber-100 hover:bg-amber-200 text-amber-800 rounded border border-amber-300 transition-colors disabled:opacity-50"
        >
          <RotateCcw className={`h-3 w-3 ${forceRotating ? 'animate-spin' : ''}`} />
          <span>{forceRotating ? 'Rotating...' : 'Force Rotate'}</span>
        </button>
      </div>
    </div>
  );
}