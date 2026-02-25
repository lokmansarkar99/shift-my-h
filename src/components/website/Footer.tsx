import React from 'react';
import { Truck, Mail, Phone, MapPin, Shield, Facebook, Instagram, Twitter, Linkedin, Youtube, MessageCircle } from 'lucide-react';
import { Logo } from './Logo';
import { router } from '../../utils/router';

interface FooterProps {
  onShowTerms: () => void;
  onShowSitemap: () => void;
  onShowPrivacy?: () => void;
  onShowAdminLogin?: () => void;
  onShowCookieSettings?: () => void;
}

export function Footer({ onShowTerms, onShowSitemap, onShowPrivacy, onShowAdminLogin, onShowCookieSettings }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-300 pt-16 pb-8 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* About Us */}
          <div>
            <h4 className="text-white mb-4 font-semibold">About Us</h4>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">
              ShiftMyHome provides professional removal and delivery services across Scotland and the UK. We connect customers with experienced movers for house relocations, furniture delivery, and more.
            </p>
            <button 
              onClick={() => router.navigate({ page: 'about' })}
              className="text-sm text-sky-400 hover:text-sky-300 transition-colors font-medium inline-flex items-center gap-1 group mb-6"
            >
              Read our story
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div className="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-slate-400 hover:text-blue-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-slate-400 hover:text-pink-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-slate-400 hover:text-sky-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-slate-400 hover:text-blue-700 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white mb-4 font-semibold">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a href="#services" className="text-sm hover:text-sky-400 transition-colors">
                  Services
                </a>
              </li>
              <li>
                <button 
                  onClick={() => router.navigate({ page: 'coverage' })}
                  className="text-sm hover:text-sky-400 transition-colors text-left"
                >
                  Coverage
                </button>
              </li>
              <li>
                <button 
                  onClick={() => router.navigate({ page: 'our-work' })}
                  className="text-sm hover:text-sky-400 transition-colors text-left"
                >
                  Our Work
                </button>
              </li>
              <li>
                <button 
                  onClick={() => router.navigate({ page: 'reviews' })}
                  className="text-sm hover:text-sky-400 transition-colors text-left"
                >
                  Reviews
                </button>
              </li>
              <li>
                <button 
                  onClick={() => router.navigate({ page: 'blog' })}
                  className="text-sm hover:text-sky-400 transition-colors text-left"
                >
                  Blog
                </button>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white mb-4">Legal</h4>
            <ul className="space-y-3">
              <li>
                <button onClick={onShowTerms} className="text-sm hover:text-sky-400 transition-colors text-left">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={onShowPrivacy} className="text-sm hover:text-sky-400 transition-colors text-left">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={onShowCookieSettings} className="text-sm hover:text-sky-400 transition-colors text-left">
                  Cookie Preferences
                </button>
              </li>
              <li>
                <button onClick={onShowSitemap} className="text-sm hover:text-sky-400 transition-colors text-left">
                  Sitemap
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-slate-400">
                <Phone className="w-4 h-4 text-sky-400" />
                <span>0800 123 4567</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-400">
                <Mail className="w-4 h-4 text-sky-400" />
                <a href="mailto:support@shiftmyhome.co.uk" className="hover:text-sky-400 transition-colors">support@shiftmyhome.co.uk</a>
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-400">
                <MapPin className="w-4 h-4 text-sky-400" />
                <span>Edinburgh, Scotland</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex items-center justify-between text-sm text-slate-500">
          <p>© {currentYear} ShiftMyHome. All rights reserved.</p>
          
          {/* Private Admin Login - Discreet */}
          {onShowAdminLogin && (
            <button 
              onClick={onShowAdminLogin} 
              className="flex items-center gap-1.5 text-xs hover:text-slate-400 transition-colors group opacity-30 hover:opacity-100"
              title="Admin Access"
            >
              <Shield className="w-3 h-3 text-slate-500 group-hover:text-slate-400" />
              <span></span>
            </button>
          )}
        </div>
      </div>
    </footer>
  );
}
