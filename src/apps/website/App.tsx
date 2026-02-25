import React, { useState, lazy, Suspense, useEffect } from 'react';
import { Header } from '../../components/website/Header';
import { Hero } from '../../components/website/Hero';
import { CallbackModal } from '../../components/website/CallbackModal';
import { TrustBadges } from '../../components/website/TrustBadges';
import { Footer } from '../../components/website/Footer';
import { TermsModal } from '../../components/website/TermsModal';
import { PrivacyModal } from '../../components/website/PrivacyModal';
import { SitemapModal } from '../../components/website/SitemapModal';
import { LoginModal } from '../../components/website/LoginModal';
import { CookiePolicyModal } from '../../components/website/CookiePolicyModal';
import { LiveChat } from '../../components/website/LiveChat';
import { CallMeButton } from '../../components/website/CallMeButton';
import { CookieConsent } from '../../components/ui/cookie-consent';
import { QuoteFlowOrchestrator } from '../../components/quote/QuoteFlowOrchestrator';
import { PageMoved } from '../../components/website/PageMoved';
import { Loader } from 'lucide-react';
import { generateJourneyId, clearQuoteData, saveQuoteData } from '../../utils/quoteStorage';
import type { ServiceCategory } from '../../utils/quoteStorage';

import { router, Route } from '../../utils/router';
import { getServiceBySlug } from '../../config/seoServices';
import { getCityBySlug } from '../../config/seoCities';
import { SeoServiceCityPage } from '../../components/website/pages/SeoServiceCityPage';

// Lazy load sections - Using default exports now
const HowItWorks = lazy(() => import('../../components/website/HowItWorks'));
const WhyShiftMyHome = lazy(() => import('../../components/website/WhyShiftMyHome'));
const Contact = lazy(() => import('../../components/website/Contact'));
const FAQ = lazy(() => import('../../components/website/FAQ'));

// Pages - Using default exports now
const PricingPage = lazy(() => import('../../components/website/pages/PricingPage'));
const BlogPage = lazy(() => import('../../components/website/pages/BlogPage'));
const TrackingPage = lazy(() => import('../../components/website/pages/TrackingPage'));
const CoveragePage = lazy(() => import('../../components/website/pages/CoveragePage'));
const OurWorkPage = lazy(() => import('../../components/website/pages/OurWorkPage'));
const ReviewsPage = lazy(() => import('../../components/website/pages/ReviewsPage'));
const AboutPage = lazy(() => import('../../components/website/pages/AboutPage'));

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
    <div className="text-center">
      <Loader className="w-16 h-16 text-white animate-spin mx-auto mb-4" />
      <p className="text-white text-lg">Loading ShiftMyHome...</p>
    </div>
  </div>
);

// Service ID to Category mapping
const SERVICE_CATEGORY_MAP: Record<string, ServiceCategory> = {
  'house-move': 'house_move',
  'furniture': 'furniture_items',
  'clearance': 'clearance_removal',
  'motorbike': 'vehicle_delivery',
  'store-pickup': 'store_pickup',
  'other': 'other_delivery',
};

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showCookiePolicy, setShowCookiePolicy] = useState(false);
  const [showSitemap, setShowSitemap] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginTab, setLoginTab] = useState<'customer' | 'driver' | 'admin'>('customer');
  const [showCallback, setShowCallback] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [route, setRoute] = useState<Route>(router.getCurrentRoute());

  // Listen to route changes
  useEffect(() => {
    const unsubscribe = router.onChange((newRoute) => {
      setRoute(newRoute);
    });
    return unsubscribe;
  }, []);

  // Define functions before they are used
  const handleSelectService = (serviceId: string) => {
    setSelectedService(serviceId);
    
    // Map service ID to category
    const category = SERVICE_CATEGORY_MAP[serviceId] || 'house_move';
    
    // Clear old data and start fresh
    clearQuoteData();
    
    // Save service category and generate journey ID
    const journeyId = generateJourneyId();
    saveQuoteData({ 
      journeyId,
      serviceCategory: category,
      serviceType: serviceId,
    });
    
    // Navigate directly to quote step 1
    router.navigate({ page: 'quote-step', step: 1 });
  };

  const openLogin = (tab: 'customer' | 'driver' | 'admin' = 'customer') => {
    setLoginTab(tab);
    setShowLogin(true);
  };

  const handleAdminLogin = (email: string, pass: string) => {
    // Simple validation for demo purposes
    if (email === 'admin@shiftmyhome.com' && pass === 'admin123') {
      router.navigate({ page: 'admin' });
      return true;
    }
    return false;
  };

  const handleCustomerLogin = (email: string, pass: string) => {
    // Simple validation for demo purposes
    if (email === 'customer@shiftmyhome.com' && pass === 'customer123') {
      router.navigate({ page: 'home' });
      return true;
    }
    return false;
  };

  const handleDriverLogin = (email: string, pass: string) => {
    // Simple validation for demo purposes
    if (email === 'driver@shiftmyhome.com' && pass === 'driver123') {
      router.navigate({ page: 'home' });
      return true;
    }
    return false;
  };

  // Check if this is an SEO service/city page
  if (route.page === 'seo-service-city') {
    const service = getServiceBySlug(route.service);
    const city = getCityBySlug(route.city);
    
    if (service && city) {
      return <SeoServiceCityPage service={service} city={city} />;
    } else {
      // Invalid service/city combination - redirect to home
      router.navigate({ page: 'home' });
      return <LoadingSpinner />;
    }
  }

  // Check if this is a quote step page
  if (route.page === 'quote-step') {
    // Lazy load quote step pages
    const QuoteFlowStep1 = lazy(() => import('../../components/quote/pages/QuoteFlowStep1').then(m => ({ default: m.QuoteFlowStep1 })));
    const QuoteFlowStep2 = lazy(() => import('../../components/quote/pages/QuoteFlowStep2').then(m => ({ default: m.QuoteFlowStep2 })));
    const QuoteFlowStep3 = lazy(() => import('../../components/quote/pages/QuoteFlowStep3').then(m => ({ default: m.QuoteFlowStep3 })));
    const QuoteFlowStep4 = lazy(() => import('../../components/quote/pages/QuoteFlowStep4').then(m => ({ default: m.QuoteFlowStep4 })));
    const QuoteFlowStep5 = lazy(() => import('../../components/quote/pages/QuoteFlowStep5').then(m => ({ default: m.QuoteFlowStep5 })));
    const QuoteFlowStep6 = lazy(() => import('../../components/quote/pages/QuoteFlowStep6').then(m => ({ default: m.QuoteFlowStep6 })));

    return (
      <Suspense fallback={<LoadingSpinner />}>
        {route.step === 1 && <QuoteFlowStep1 />}
        {route.step === 2 && <QuoteFlowStep2 />}
        {route.step === 3 && <QuoteFlowStep3 />}
        {route.step === 4 && <QuoteFlowStep4 />}
        {route.step === 5 && <QuoteFlowStep5 />}
        {route.step === 6 && <QuoteFlowStep6 />}
      </Suspense>
    );
  }

  // Check if this is the Coverage page
  if (route.page === 'coverage') {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <CoveragePage 
          onGoBack={() => router.navigate({ page: 'home' })}
          onShowLogin={openLogin}
          onShowCallback={() => setShowCallback(true)}
          onShowTerms={() => setShowTerms(true)}
          onShowPrivacy={() => setShowPrivacy(true)}
          onShowCookieSettings={() => setShowCookiePolicy(true)}
          onShowSitemap={() => setShowSitemap(true)}
        />
      </Suspense>
    );
  }

  // Check if this is the Our Work page
  if (route.page === 'our-work') {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <OurWorkPage 
          onGoBack={() => router.navigate({ page: 'home' })}
          onShowLogin={openLogin}
          onShowCallback={() => setShowCallback(true)}
          onShowTerms={() => setShowTerms(true)}
          onShowPrivacy={() => setShowPrivacy(true)}
          onShowCookieSettings={() => setShowCookiePolicy(true)}
          onShowSitemap={() => setShowSitemap(true)}
        />
      </Suspense>
    );
  }

  // Check if this is the Reviews page
  if (route.page === 'reviews') {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <ReviewsPage 
          onGoBack={() => router.navigate({ page: 'home' })}
          onShowLogin={openLogin}
          onShowCallback={() => setShowCallback(true)}
          onShowTerms={() => setShowTerms(true)}
          onShowPrivacy={() => setShowPrivacy(true)}
          onShowCookieSettings={() => setShowCookiePolicy(true)}
          onShowSitemap={() => setShowSitemap(true)}
        />
      </Suspense>
    );
  }

  // Check if this is the Blog page
  if (route.page === 'blog') {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <BlogPage 
          onGoBack={() => router.navigate({ page: 'home' })}
          onShowLogin={openLogin}
          onShowCallback={() => setShowCallback(true)}
          onShowTerms={() => setShowTerms(true)}
          onShowPrivacy={() => setShowPrivacy(true)}
          onShowCookieSettings={() => setShowCookiePolicy(true)}
          onShowSitemap={() => setShowSitemap(true)}
        />
      </Suspense>
    );
  }

  // Check if this is the About page
  if (route.page === 'about') {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <AboutPage 
          onGoBack={() => router.navigate({ page: 'home' })}
          onShowLogin={openLogin}
          onShowCallback={() => setShowCallback(true)}
          onShowTerms={() => setShowTerms(true)}
          onShowPrivacy={() => setShowPrivacy(true)}
          onShowCookieSettings={() => setShowCookiePolicy(true)}
          onShowSitemap={() => setShowSitemap(true)}
          onShowAdminLogin={() => openLogin('admin')}
        />
      </Suspense>
    );
  }

  // Check for unknown/invalid routes - show PageMoved error page
  const validRoutes = ['home', 'booking', 'pricing', 'furniture-booking', 'messaging', 'reports', 'tracking'];
  if (route.page && !validRoutes.includes(route.page)) {
    return <PageMoved onShowLogin={() => openLogin('customer')} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'pricing':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <PricingPage selectedService={selectedService} onGoBack={() => setCurrentPage('home')} />
          </Suspense>
        );
      case 'quote':
        return <QuoteFlowOrchestrator serviceType={selectedService || 'house-move'} onClose={() => {
          setCurrentPage('home');
          setSelectedService(null);
        }} />;
      case 'tracking':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <TrackingPage />
          </Suspense>
        );
      default:
        return (
          <>
            <Hero 
              onGetStarted={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })} 
              onSelectService={handleSelectService}
              selectedService={selectedService}
            />
            <TrustBadges />
            <Suspense fallback={<div className="py-20 text-center">Loading...</div>}>
              <HowItWorks />
              <WhyShiftMyHome />
              <Contact />
              <FAQ />
            </Suspense>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header 
        onGetPrice={() => setCurrentPage('quote')}
        onShowLogin={(tab) => openLogin(tab)}
        onShowCallback={() => setShowCallback(true)}
      />
      
      {renderPage()}
      
      <Footer 
        onShowTerms={() => setShowTerms(true)}
        onShowPrivacy={() => setShowPrivacy(true)}
        onShowCookieSettings={() => setShowCookiePolicy(true)}
        onShowSitemap={() => setShowSitemap(true)}
      />

      {/* Modals */}
      {showTerms && <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />}
      {showPrivacy && <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />}
      {showCookiePolicy && <CookiePolicyModal isOpen={showCookiePolicy} onClose={() => setShowCookiePolicy(false)} />}
      {showSitemap && <SitemapModal isOpen={showSitemap} onClose={() => setShowSitemap(false)} />}
      {showLogin && (
        <LoginModal 
          isOpen={showLogin} 
          onClose={() => setShowLogin(false)} 
          initialTab={loginTab}
          onAdminLogin={handleAdminLogin}
          onCustomerLogin={handleCustomerLogin}
          onDriverLogin={handleDriverLogin}
        />
      )}
      {showCallback && <CallbackModal isOpen={showCallback} onClose={() => setShowCallback(false)} />}

      {/* Global Widgets - Only visible on homepage */}
      {route.page === 'home' && currentPage === 'home' && (
        <>
          <LiveChat />
          <CallMeButton onClick={() => setShowCallback(true)} />
        </>
      )}
      <CookieConsent />
    </div>
  );
}

export default App;