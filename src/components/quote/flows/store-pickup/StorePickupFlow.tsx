/**
 * Store/Pickup Flow
 * Complete multi-step quote flow for store pickup and delivery service
 */

import React, { useState } from 'react';
import { StoreQuote } from './storeTypes';
import { StoreStep1Address } from './StoreStep1Address';
import { StoreStep2Inventory } from './StoreStep2Inventory';
import { StoreStep5Review } from './StoreStep5Review';
import { QuoteHeader } from '../../QuoteHeader';
import { QuoteProgressBar } from '../../QuoteProgressBar';
import { saveQuoteData, loadQuoteData } from '../../../../utils/quoteStorage';

const TOTAL_STEPS = 3;

export function StorePickupFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [quoteData, setQuoteData] = useState<StoreQuote>(() => {
    const saved = loadQuoteData<StoreQuote>('store-pickup');
    return saved || {
      serviceType: 'store_pickup',
      pickup: { address: '', postcode: '', floor: 0, hasLift: false },
      dropoff: { address: '', postcode: '', floor: 0, hasLift: false },
      date: undefined,
      dateUnsure: false,
      items: [],
      distance: 0,
      quoteReference: '',
    };
  });

  const handleDataChange = (updates: Partial<StoreQuote>) => {
    const newData = { ...quoteData, ...updates };
    setQuoteData(newData);
    saveQuoteData('store-pickup', newData);
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StoreStep1Address
            data={quoteData}
            onChange={handleDataChange}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <StoreStep2Inventory
            data={quoteData}
            onChange={handleDataChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <StoreStep5Review
            data={quoteData}
            onChange={handleDataChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-slate-50">
      <QuoteHeader quoteRef={quoteData.quoteReference || ''} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <QuoteProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
        
        <div className="mt-8">
          {renderStep()}
        </div>
      </div>
    </div>
  );
}