import React, { useEffect, useState } from 'react';
import { MapPin, Phone, Mail, CheckCircle2, TrendingUp, Clock, Shield, Star, MessageSquare, ArrowRight, ChevronDown } from 'lucide-react';
import { SeoService } from '../../../config/seoServices';
import { SeoCity } from '../../../config/seoCities';
import { generateSeoContent, generateSchemaMarkup } from '../../../utils/seoContentGenerator';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { TrustBadges } from '../TrustBadges';
import { LoginModal } from '../LoginModal';
import { CallbackModal } from '../CallbackModal';
import { TermsModal } from '../TermsModal';
import { PrivacyModal } from '../PrivacyModal';
import { SitemapModal } from '../SitemapModal';
import { router } from '../../../utils/router';

interface SeoServiceCityPageProps {
  service: SeoService;
  city: SeoCity;
}

export function SeoServiceCityPage({ service, city }: SeoServiceCityPageProps) {
  const content = generateSeoContent(service, city);
  const schema = generateSchemaMarkup(service, city);
  const [showLogin, setShowLogin] = useState(false);
  const [loginTab, setLoginTab] = useState<'customer' | 'driver' | 'admin'>('customer');
  const [showCallback, setShowCallback] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showSitemap, setShowSitemap] = useState(false);

  // Set meta tags for SEO
  useEffect(() => {
    document.title = content.metaTitle;
    
    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', content.metaDescription);

    // Add canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `https://shiftmyhome.co.uk/${service.slug}/${city.slug}`);

    // Add structured data
    let script = document.querySelector('script[type="application/ld+json"]');
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schema);

    // Cleanup
    return () => {
      if (metaDesc) metaDesc.remove();
      if (canonical) canonical.remove();
      if (script) script.remove();
    };
  }, [service, city, content, schema]);

  const scrollToBooking = () => {
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.hash = '#booking';
    }
  };

  const openLogin = (tab: 'customer' | 'driver' | 'admin' = 'customer') => {
    setLoginTab(tab);
    setShowLogin(true);
  };

  const handleAdminLogin = (email: string, pass: string) => {
    if (email === 'admin@shiftmyhome.com' && pass === 'admin123') {
      router.navigate({ page: 'admin' });
      return true;
    }
    return false;
  };

  const handleCustomerLogin = (email: string, pass: string) => {
    if (email === 'customer@shiftmyhome.com' && pass === 'customer123') {
      setShowLogin(false);
      return true;
    }
    return false;
  };

  const handleDriverLogin = (email: string, pass: string) => {
    if (email === 'driver@shiftmyhome.com' && pass === 'driver123') {
      setShowLogin(false);
      return true;
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-white">
      <Header 
        onGetPrice={scrollToBooking}
        onShowLogin={openLogin}
        onShowCallback={() => setShowCallback(true)}
      />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Breadcrumb */}
            <div className="flex items-center justify-center gap-2 text-sm text-blue-100 mb-6">
              <a href="/#home" className="hover:text-white transition-colors">Home</a>
              <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
              <a href={`/#services`} className="hover:text-white transition-colors">Services</a>
              <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
              <span className="text-white font-medium">{service.name} in {city.name}</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {content.h1}
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              {content.intro}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button 
                onClick={scrollToBooking}
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
              >
                Get Free Quote
                <ArrowRight className="w-5 h-5" />
              </button>
              <a 
                href="tel:08001234567"
                className="bg-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-400 transition-all shadow-lg flex items-center gap-2 border-2 border-white/20"
              >
                <Phone className="w-5 h-5" />
                0800 123 4567
              </a>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold mb-1">£{service.priceRange.min}+</div>
                <div className="text-sm text-blue-100">From</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold mb-1">24hr</div>
                <div className="text-sm text-blue-100">Response</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold mb-1">4.9★</div>
                <div className="text-sm text-blue-100">Rating</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold mb-1">100%</div>
                <div className="text-sm text-blue-100">Insured</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-8 border-b bg-slate-50">
        <div className="container mx-auto px-6">
          <TrustBadges />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-center">
              Why Choose Us for {service.name} in {city.name}?
            </h2>
            <p className="text-lg text-slate-600 mb-12 text-center max-w-3xl mx-auto">
              Local experts committed to delivering exceptional service throughout {city.description}
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.benefits.map((benefit, index) => (
                <div key={index} className="flex gap-4 p-6 bg-slate-50 rounded-xl hover:bg-blue-50 transition-colors group">
                  <div className="flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <p className="text-slate-700 font-medium">{benefit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Service Areas Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-8 justify-center">
              <MapPin className="w-8 h-8 text-blue-600" />
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                Areas We Serve in {city.name}
              </h2>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <p className="text-lg text-slate-600 mb-8 text-center">
                We provide {service.name.toLowerCase()} across {city.name} and surrounding areas
              </p>
              
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {content.serviceAreas.map((area, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg hover:bg-blue-50 transition-colors">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span className="text-slate-700 text-sm font-medium">{area}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-slate-700 text-center">
                  <strong>Not sure if we cover your area?</strong> We serve all {city.postcodeArea.slice(0, 5).join(', ')} postcodes and beyond. 
                  <a href="tel:08001234567" className="text-blue-600 hover:text-blue-700 font-semibold ml-1">Call us to check</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Common Jobs Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-center">
              Popular {service.name} Jobs in {city.name}
            </h2>
            <p className="text-lg text-slate-600 mb-12 text-center">
              We handle all types of {service.name.toLowerCase()} requirements
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {content.commonJobs.map((job, index) => (
                <div key={index} className="flex items-start gap-4 p-6 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border border-slate-200 hover:shadow-lg transition-all">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">{job}</h3>
                    <p className="text-sm text-slate-600">Professional service with transparent pricing</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <TrendingUp className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Transparent Pricing for {city.name}
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              {content.priceInfo}
            </p>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-8">
              <div className="text-5xl font-bold mb-2">
                £{service.priceRange.min} - £{service.priceRange.max}
              </div>
              <div className="text-xl text-blue-100">
                Typical price range per {service.priceRange.unit}
              </div>
            </div>

            <button 
              onClick={scrollToBooking}
              className="bg-white text-blue-600 px-10 py-5 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-xl hover:scale-105"
            >
              Get Your Free Quote Now
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-center">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-slate-600 mb-12 text-center">
              Common questions about {service.name.toLowerCase()} in {city.name}
            </p>

            <div className="space-y-6">
              {content.faqs.map((faq, index) => (
                <details 
                  key={index} 
                  className="group bg-slate-50 rounded-xl p-6 hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  <summary className="font-semibold text-lg text-slate-900 flex items-center justify-between cursor-pointer list-none">
                    <span className="flex-1 pr-4">{faq.question}</span>
                    <ChevronDown className="w-5 h-5 text-blue-600 group-open:rotate-180 transition-transform flex-shrink-0" />
                  </summary>
                  <p className="mt-4 text-slate-600 leading-relaxed pl-0">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Book {service.name} in {city.name}?
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Get your free quote in minutes. No obligation, no hidden fees.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={scrollToBooking}
                className="bg-blue-600 text-white px-10 py-5 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl hover:scale-105 flex items-center gap-2"
              >
                Get Instant Quote
                <ArrowRight className="w-5 h-5" />
              </button>
              <a 
                href="tel:08001234567"
                className="bg-white text-slate-900 px-10 py-5 rounded-xl font-bold text-lg hover:bg-slate-100 transition-all shadow-xl flex items-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Call Now
              </a>
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>Fully Insured</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                <span>4.9★ Rated</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>24hr Service</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer 
        onShowTerms={() => setShowTerms(true)}
        onShowPrivacy={() => setShowPrivacy(true)}
        onShowSitemap={() => setShowSitemap(true)}
      />
      
      {/* Modals */}
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
      {showCallback && (
        <CallbackModal 
          isOpen={showCallback} 
          onClose={() => setShowCallback(false)} 
        />
      )}
      {showTerms && (
        <TermsModal 
          isOpen={showTerms} 
          onClose={() => setShowTerms(false)} 
        />
      )}
      {showPrivacy && (
        <PrivacyModal 
          isOpen={showPrivacy} 
          onClose={() => setShowPrivacy(false)} 
        />
      )}
      {showSitemap && (
        <SitemapModal 
          isOpen={showSitemap} 
          onClose={() => setShowSitemap(false)} 
        />
      )}
    </div>
  );
}