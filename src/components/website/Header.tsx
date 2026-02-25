import React, { useState, useEffect } from 'react';
import { Truck, Menu, X, User, Phone } from 'lucide-react';
import { throttle } from '../../utils/performance';
import { router } from '../../utils/router';

interface HeaderProps {
  onGetPrice: () => void;
  onShowLogin: (tab: 'customer' | 'driver' | 'admin') => void;
  onShowCallback?: () => void;
}

export function Header({ onGetPrice, onShowLogin, onShowCallback }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [logoClickTimer, setLogoClickTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Throttled scroll handler for better performance
    const handleScroll = throttle(() => {
      setIsScrolled(window.scrollY > 10);
    }, 100);

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isMobileMenuOpen]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  // Triple-click on logo opens Admin login
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (logoClickTimer) {
      clearTimeout(logoClickTimer);
    }

    const newCount = logoClickCount + 1;
    setLogoClickCount(newCount);

    if (newCount === 3) {
      // Triple click detected - open Admin login
      onShowLogin('admin');
      setLogoClickCount(0);
      setLogoClickTimer(null);
    } else {
      // Wait for next click (within 500ms)
      const timer = setTimeout(() => {
        if (newCount === 1) {
          // Single click - scroll to home
          scrollToSection('home');
        }
        setLogoClickCount(0);
      }, 500);
      setLogoClickTimer(timer);
    }
  };

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-slate-900/95 backdrop-blur-lg shadow-2xl' 
          : 'bg-slate-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 flex-shrink-0 group" onClick={handleLogoClick}>
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Truck className="w-10 h-10 text-blue-400 relative z-10 transform group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-300 bg-clip-text text-transparent leading-tight">
                ShiftMyHome
              </span>
              <span className="text-xs text-slate-300 leading-tight text-center hidden sm:block">
                Your move made simple
              </span>
            </div>
          </a>

          {/* Desktop Navigation - Optimized */}
          <nav className="hidden lg:flex items-center gap-8">
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="text-white/90 hover:text-white transition-colors font-medium"
            >
              How it Works
            </button>
            <button 
              onClick={() => router.navigate({ page: 'about' })}
              className="text-white/90 hover:text-white transition-colors font-medium"
            >
              Our Story
            </button>
            <button 
              onClick={() => router.navigate({ page: 'coverage' })}
              className="text-white/90 hover:text-white transition-colors font-medium"
            >
              Coverage
            </button>
            <button 
              onClick={() => scrollToSection('partners')}
              className="text-white/90 hover:text-white transition-colors font-medium"
            >
              Become a Partner
            </button>
          </nav>

          {/* CTA Buttons - Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Phone Number - Premium Design - LONGER */}
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
            
            {/* Sign In - Secondary */}
            <button
              onClick={() => onShowLogin('customer')}
              className="flex items-center gap-2 px-4 py-2 text-white/80 hover:text-white transition-colors font-medium"
              aria-label="Customer Sign In"
            >
              <User className="w-4 h-4" />
              Sign In
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-3">
            {/* Phone Icon ONLY - Mobile Simplified */}
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
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-white"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-white/10">
            <nav className="flex flex-col gap-4">
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="text-white/90 hover:text-white transition-colors font-medium text-left"
              >
                How it Works
              </button>
              <button 
                onClick={() => {
                  router.navigate({ page: 'about' });
                  setIsMobileMenuOpen(false);
                }}
                className="text-white/90 hover:text-white transition-colors font-medium text-left"
              >
                Our Story
              </button>
              <button 
                onClick={() => {
                  router.navigate({ page: 'coverage' });
                  setIsMobileMenuOpen(false);
                }}
                className="text-white/90 hover:text-white transition-colors font-medium text-left"
              >
                Coverage
              </button>
              <button 
                onClick={() => {
                  scrollToSection('partners');
                  setIsMobileMenuOpen(false);
                }}
                className="text-white/90 hover:text-white transition-colors font-medium text-left"
              >
                Become a Partner
              </button>
              
              {/* Sign In Only */}
              <div className="pt-4 border-t border-white/10">
                <button
                  onClick={() => {
                    onShowLogin('customer');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-white border border-white/20 hover:bg-white/10 rounded-full transition-all font-medium"
                >
                  <User className="w-4 h-4" />
                  Sign In
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}