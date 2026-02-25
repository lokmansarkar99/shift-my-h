/**
 * Quote Generating Loader
 * Shows while calculating quote (6 seconds)
 */

import React, { useEffect, useState } from 'react';
import { Truck, Sparkles } from 'lucide-react';

interface QuoteGeneratingLoaderProps {
  onComplete: () => void;
}

export function QuoteGeneratingLoader({ onComplete }: QuoteGeneratingLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('Analyzing your items...');

  useEffect(() => {
    const messages = [
      'Analyzing your items...',
      'Calculating optimal route...',
      'Estimating move duration...',
      'Preparing your quote...',
      'Almost ready...',
    ];

    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % messages.length;
      setMessage(messages[messageIndex]);
    }, 1200);

    // Progress animation (0 to 100 in 6 seconds)
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(messageInterval);
          return 100;
        }
        return prev + 1.67; // ~60 steps in 6 seconds
      });
    }, 100);

    // Complete after 6 seconds
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 6000);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-600 z-50 flex items-center justify-center">
      {/* Animated Background Circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        {/* Spinning Logo Container */}
        <div className="relative mb-8">
          {/* Outer Spinning Ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 rounded-full border-4 border-white/20 border-t-white animate-spin"></div>
          </div>

          {/* Inner Logo */}
          <div className="relative flex items-center justify-center">
            <div className="w-48 h-48 flex items-center justify-center">
              <div className="relative">
                {/* ShiftMyHome Logo - Truck Icon */}
                <div className="w-24 h-24 bg-white rounded-2xl shadow-2xl flex items-center justify-center transform hover:scale-105 transition-transform">
                  <Truck className="w-14 h-14 text-blue-600" />
                </div>
                
                {/* Sparkle Effect */}
                <div className="absolute -top-2 -right-2 animate-bounce">
                  <Sparkles className="w-8 h-8 text-yellow-300" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-white mb-2">
          Generating Your Quote
        </h2>

        {/* Animated Message */}
        <p className="text-xl text-white/90 mb-8 min-h-[2rem] transition-all">
          {message}
        </p>

        {/* Progress Bar */}
        <div className="max-w-md mx-auto">
          <div className="bg-white/20 rounded-full h-3 overflow-hidden backdrop-blur-sm">
            <div 
              className="h-full bg-gradient-to-r from-white to-cyan-200 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-white/80 text-sm mt-3">{Math.round(progress)}%</p>
        </div>

        {/* Pulsing Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
}
