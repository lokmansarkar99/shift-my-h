import React from 'react';
import { Home, LogIn } from 'lucide-react';
import { router } from '../../utils/router';

interface PageMovedProps {
  onShowLogin?: () => void;
}

/**
 * PageMoved Component
 * 
 * Displays a friendly error/404 message when a page has been moved or doesn't exist.
 * Provides clear CTAs to return to homepage or log in.
 * 
 * Design: Centered, clean, consistent with ShiftMyHome branding.
 */
export function PageMoved({ onShowLogin }: PageMovedProps) {
  const handleGoHome = () => {
    router.navigate('home');
  };

  const handleLogin = () => {
    if (onShowLogin) {
      onShowLogin();
    } else {
      // Fallback if no login handler provided
      router.navigate('home');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
              <Home className="w-12 h-12 text-blue-600" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">!</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
          This page has moved… but we've got you covered.
        </h1>

        {/* Description */}
        <p className="text-lg text-slate-600 mb-10 max-w-xl mx-auto">
          Return to the homepage or log in to continue planning your move.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* Primary Button - Go to homepage */}
          <button
            onClick={handleGoHome}
            className="group relative w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            <span>Go to homepage</span>
          </button>

          {/* Secondary Button - Log in */}
          <button
            onClick={handleLogin}
            className="group relative w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border-2 border-slate-300 rounded-lg font-semibold hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <LogIn className="w-5 h-5" />
            <span>Log in</span>
          </button>
        </div>

        {/* Additional help text */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <p className="text-sm text-slate-500">
            Need help? Contact us at{' '}
            <a 
              href="tel:+441234567890" 
              className="text-blue-600 hover:text-blue-700 font-medium underline"
            >
              +44 123 456 7890
            </a>
            {' '}or{' '}
            <a 
              href="mailto:support@shiftmyhome.co.uk" 
              className="text-blue-600 hover:text-blue-700 font-medium underline"
            >
              support@shiftmyhome.co.uk
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
