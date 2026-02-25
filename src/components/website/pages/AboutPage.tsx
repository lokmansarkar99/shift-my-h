import React from 'react';
import { ArrowLeft, Heart } from 'lucide-react';
import { Header } from '../Header';
import { Footer } from '../Footer';

interface AboutPageProps {
  onGoBack: () => void;
  onShowLogin: (tab: 'customer' | 'driver' | 'admin') => void;
  onShowCallback: () => void;
  onShowTerms: () => void;
  onShowPrivacy: () => void;
  onShowSitemap: () => void;
  onShowAdminLogin?: () => void;
  onShowCookieSettings?: () => void;
}

export default function AboutPage({ 
  onGoBack, 
  onShowLogin, 
  onShowCallback,
  onShowTerms,
  onShowPrivacy,
  onShowSitemap,
  onShowAdminLogin,
  onShowCookieSettings
}: AboutPageProps) {
  const scrollToBooking = () => {
    onGoBack();
    setTimeout(() => {
      const bookingSection = document.getElementById('booking');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <Header 
        onGetPrice={scrollToBooking}
        onShowLogin={onShowLogin}
        onShowCallback={onShowCallback}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white py-20 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Back Button */}
          <button
            onClick={onGoBack}
            className="group flex items-center gap-2 text-blue-200 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </button>

          {/* Page Header */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full mb-6">
              <Heart className="w-4 h-4 text-cyan-400" />
              <span className="text-blue-200 text-sm tracking-wider uppercase">About ShiftMyHome</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Our{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400">
                Story
              </span>
            </h1>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="backdrop-blur-xl bg-white/80 border border-slate-200 rounded-3xl p-8 md:p-16 shadow-2xl">
            <div className="prose prose-lg max-w-none">
              <div className="space-y-6 text-slate-700 leading-relaxed text-lg">
                <p>
                  Moving is more than transporting items from one place to another. It's about change, trust, and starting something new.
                </p>
                
                <p>
                  ShiftMyHome was created to make that moment easier. We saw how stressful moving can become when prices are unclear, plans change, or communication breaks down. We believed there had to be a better way — one that puts people first and removes unnecessary worry from the process.
                </p>
                
                <p>
                  Every move carries its own story. A new home, a growing family, a fresh start, or simply something important that needs to arrive safely. That's why ShiftMyHome is built around flexibility, care, and understanding, adapting to each customer's needs instead of forcing them into fixed solutions.
                </p>
                
                <p>
                  Our approach is simple: clarity, honesty, and respect for what matters to you. From the first step to the final delivery, we focus on keeping things transparent and easy to follow, so you always know what to expect.
                </p>
                
                <p>
                  As ShiftMyHome continues to grow, our purpose remains the same — helping people move forward with confidence, knowing their move is in safe hands.
                </p>
                
                <p className="font-semibold text-slate-900">
                  Because every move is a step forward — and we're here to move it with you.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <div className="backdrop-blur-xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 border border-slate-200 rounded-3xl p-12 shadow-xl">
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Ready to Move with Confidence?
              </h3>
              <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
                Experience the simplicity and reliability of ShiftMyHome.
              </p>
              <button
                onClick={scrollToBooking}
                className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-10 py-5 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-blue-500/50"
              >
                <span className="text-lg font-semibold">Get Your Quote</span>
                <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform duration-300" />
                <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer 
        onShowTerms={onShowTerms}
        onShowPrivacy={onShowPrivacy}
        onShowSitemap={onShowSitemap}
        onShowAdminLogin={onShowAdminLogin}
        onShowCookieSettings={onShowCookieSettings}
      />

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -50px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(50px, 50px) scale(1.05);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}