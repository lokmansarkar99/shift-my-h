import React, { useState } from 'react';
import { Truck, Phone, HelpCircle, X } from 'lucide-react';
import { router } from '../../utils/router';

interface QuoteHeaderProps {
  onShowHelp?: () => void;
  quoteRef?: string;
}

export function QuoteHeader({ onShowHelp, quoteRef }: QuoteHeaderProps) {
  const [showHelpDialog, setShowHelpDialog] = useState(false);

  const handleLogoClick = () => {
    // Navigate to home
    router.navigate({ page: 'home' });
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-lg shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo - Same as main header */}
            <button 
              onClick={handleLogoClick}
              className="flex items-center gap-3 flex-shrink-0 group"
            >
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Truck className="w-10 h-10 text-blue-400 relative z-10 transform group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-300 bg-clip-text text-transparent leading-tight">
                  ShiftMyHome
                </span>
                {quoteRef ? (
                  <span className="text-[10px] font-mono font-bold text-blue-300 bg-blue-900/50 px-2 py-0.5 rounded border border-blue-500/30 uppercase tracking-widest mt-1">
                    Ref: {quoteRef}
                  </span>
                ) : (
                  <span className="text-xs text-slate-300 leading-tight text-center hidden sm:block">
                    Your move made simple
                  </span>
                )}
              </div>
            </button>

            {/* Right side - Phone + Help */}
            <div className="hidden lg:flex items-center gap-4">
              {/* Phone Number - Premium Design - Same as main header */}
              <a 
                href="tel:+442045388515"
                className="group relative flex items-center gap-4 px-8 py-3.5 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white rounded-full transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105 overflow-hidden"
              >
                {/* Animated background shine */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                
                {/* Pulse ring */}
                <div className="absolute inset-0 rounded-full bg-blue-400/30 animate-ping opacity-0 group-hover:opacity-100"></div>
                
                {/* Phone icon with animation */}
                <div className="relative z-10 p-2 bg-white/20 rounded-full group-hover:rotate-12 transition-transform duration-300">
                  <Phone className="w-5 h-5" />
                </div>
                
                {/* Number with better typography */}
                <div className="relative z-10 flex flex-col items-start pr-2">
                  <span className="text-[10px] uppercase tracking-widest text-white/80 font-medium leading-none mb-1">Call us now</span>
                  <span className="text-2xl font-bold tracking-wider">020 4538 8515</span>
                </div>
              </a>

              {/* Help Button */}
              <button
                onClick={() => setShowHelpDialog(true)}
                className="flex items-center gap-2 px-4 py-2 text-white/80 hover:text-white transition-colors font-medium"
              >
                <HelpCircle className="w-5 h-5" />
                Help
              </button>
            </div>

            {/* Mobile - Phone Icon + Help */}
            <div className="lg:hidden flex items-center gap-3">
              {/* Phone Icon ONLY - Mobile */}
              <a 
                href="tel:+442045388515"
                className="group relative flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 bg-size-200 bg-pos-0 active:bg-pos-100 text-white rounded-full shadow-lg active:scale-95 transition-all duration-300 overflow-hidden"
                aria-label="Call us now: 020 4538 8515"
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-active:translate-x-[100%] transition-transform duration-700"></div>
                
                <div className="relative z-10">
                  <Phone className="w-5 h-5" />
                </div>
              </a>

              {/* Help Icon */}
              <button
                onClick={() => setShowHelpDialog(true)}
                className="p-2 text-white/80 hover:text-white transition-colors"
                aria-label="Get help"
              >
                <HelpCircle className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Help Dialog - Simple Modal */}
      {showHelpDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowHelpDialog(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <HelpCircle className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Need Help?</h3>
            </div>

            <p className="text-slate-600 mb-6">
              Our team is here to help you with your quote. You can:
            </p>

            <div className="space-y-3">
              <a
                href="tel:+442045388515"
                className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
              >
                <Phone className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-semibold text-slate-900">Call us</div>
                  <div className="text-sm text-slate-600">020 4538 8515</div>
                </div>
              </a>

              <button
                onClick={() => {
                  setShowHelpDialog(false);
                  router.navigate({ page: 'home' });
                }}
                className="w-full text-left flex items-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <Truck className="w-5 h-5 text-slate-600" />
                <div>
                  <div className="font-semibold text-slate-900">Go to Homepage</div>
                  <div className="text-sm text-slate-600">Start a new quote</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
