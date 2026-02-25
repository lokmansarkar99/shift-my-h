import React, { useState, useEffect } from 'react';
import { Loader2, Navigation, Package, Clock, CheckCircle2 } from 'lucide-react';

interface LoadingQuoteModalProps {
  isOpen: boolean;
  onComplete: () => void;
  onError: (error: string) => void;
  onClose?: () => void;
}

const STATUS_MESSAGES = [
  "Calculating distance & route",
  "Estimating loading time",
  "Checking availability",
  "Finalising price"
];

export function LoadingQuoteModal({ isOpen, onComplete, onError, onClose }: LoadingQuoteModalProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setCurrentMessageIndex(0);
      setProgress(0);
      return;
    }

    console.log('[LoadingQuoteModal] Starting 5-second loading sequence...');
    const startTime = Date.now();

    // Rotate status messages every 1.25s (4 messages in 5 seconds)
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prev) => {
        const next = (prev + 1) % STATUS_MESSAGES.length;
        console.log(`[LoadingQuoteModal] Message ${next + 1}/4:`, STATUS_MESSAGES[next]);
        return next;
      });
    }, 1250);

    // Update progress bar smoothly (0 → 100% over 5 seconds)
    // Update every 50ms for smooth animation (100 updates total)
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const percentage = Math.min(100, (elapsed / 5000) * 100);
      setProgress(percentage);
    }, 50);

    // Auto-complete after EXACTLY 5 seconds
    const completeTimer = setTimeout(() => {
      console.log('[LoadingQuoteModal] ✅ 5 seconds elapsed - completing now!');
      setProgress(100);
      
      // Small delay to show 100% before closing
      setTimeout(() => {
        onComplete();
      }, 200);
    }, 5000);

    return () => {
      console.log('[LoadingQuoteModal] Cleanup');
      clearInterval(messageInterval);
      clearInterval(progressInterval);
      clearTimeout(completeTimer);
    };
  }, [isOpen, onComplete]);

  // Handle ESC key to cancel (optional)
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        console.log('[LoadingQuoteModal] User pressed ESC - cancelling');
        onError('Quote generation cancelled');
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onError]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="loading-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-8 max-w-md w-full animate-[fadeIn_0.3s_ease-out]">
        {/* Spinner + Icon */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            {/* Rotating spinner */}
            <Loader2 className="w-16 h-16 text-red-600 animate-spin" />
            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Package className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 
          id="loading-title"
          className="text-2xl font-bold text-slate-900 text-center mb-2"
        >
          Generating your quote…
        </h2>

        {/* Rotating status message */}
        <div className="h-6 mb-4 flex items-center justify-center">
          <p 
            key={currentMessageIndex}
            className="text-sm text-slate-600 text-center animate-[fadeIn_0.3s_ease-out]"
          >
            {STATUS_MESSAGES[currentMessageIndex]}
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-300 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 text-center mt-2">
            {Math.round(progress)}% complete
          </p>
        </div>

        {/* Status icons */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className={`flex flex-col items-center gap-1 transition-all duration-300 ${currentMessageIndex >= 0 ? 'opacity-100' : 'opacity-30'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentMessageIndex >= 0 ? 'bg-green-100' : 'bg-slate-100'}`}>
              {currentMessageIndex > 0 ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <Navigation className="w-5 h-5 text-blue-600" />
              )}
            </div>
            <span className="text-[10px] text-slate-600 text-center">Route</span>
          </div>

          <div className={`flex flex-col items-center gap-1 transition-all duration-300 ${currentMessageIndex >= 1 ? 'opacity-100' : 'opacity-30'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentMessageIndex >= 1 ? 'bg-green-100' : 'bg-slate-100'}`}>
              {currentMessageIndex > 1 ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <Package className="w-5 h-5 text-purple-600" />
              )}
            </div>
            <span className="text-[10px] text-slate-600 text-center">Loading</span>
          </div>

          <div className={`flex flex-col items-center gap-1 transition-all duration-300 ${currentMessageIndex >= 2 ? 'opacity-100' : 'opacity-30'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentMessageIndex >= 2 ? 'bg-green-100' : 'bg-slate-100'}`}>
              {currentMessageIndex > 2 ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <Clock className="w-5 h-5 text-orange-600" />
              )}
            </div>
            <span className="text-[10px] text-slate-600 text-center">Availability</span>
          </div>

          <div className={`flex flex-col items-center gap-1 transition-all duration-300 ${currentMessageIndex >= 3 ? 'opacity-100' : 'opacity-30'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentMessageIndex >= 3 ? 'bg-green-100' : 'bg-slate-100'}`}>
              {progress >= 100 ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <span className="text-[10px] text-slate-600 text-center">Price</span>
          </div>
        </div>

        {/* Small note */}
        <p className="text-xs text-slate-500 text-center">
          This usually takes a few seconds.
        </p>

        {/* Optional: Cancel hint */}
        <p className="text-[10px] text-slate-400 text-center mt-4">
          Press ESC to cancel
        </p>
      </div>
    </div>
  );
}