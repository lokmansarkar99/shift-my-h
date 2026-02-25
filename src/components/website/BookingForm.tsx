import React from 'react';
import { ServiceCards } from './ServiceCards';

interface BookingFormProps {
  selectedService: string | null;
  onSelectService: (service: string) => void;
  onShowTerms: () => void;
  onShowLogin: (tab: 'customer' | 'driver' | 'admin') => void;
  onViewPricing: () => void;
}

/**
 * BookingForm - Simple wrapper around ServiceCards
 * This component has been simplified to just show service cards
 * The actual booking flow is handled by the QuoteStep pages
 */
export function BookingForm({ selectedService, onSelectService, onShowTerms, onShowLogin, onViewPricing }: BookingFormProps) {
  return (
    <div className="py-20 px-4 bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Get Your Instant Quote
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Choose your service type below to start your instant online quote in seconds
          </p>
        </div>

        <ServiceCards 
          selectedService={selectedService}
          onSelectService={onSelectService}
        />

        <div className="mt-12 text-center">
          <p className="text-sm text-slate-500">
            By continuing, you agree to our{' '}
            <button onClick={onShowTerms} className="text-blue-600 hover:underline font-semibold">
              Terms & Conditions
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}