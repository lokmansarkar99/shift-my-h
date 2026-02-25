/**
 * Other Delivery Flow
 * Complete multi-step quote flow for other delivery services
 */

import React, { useState } from 'react';
import { OtherQuote } from './otherTypes';
import { OtherStep1Address } from './OtherStep1Address';
import { OtherStep2Inventory } from './OtherStep2Inventory';
import { OtherStep3Pricing } from './OtherStep3Pricing';
import { OtherStep4Access } from './OtherStep4Access';
import { OtherStep5Confirmation } from './OtherStep5Confirmation';
import { QuoteHeader } from '../../QuoteHeader';
import { QuoteProgressBar } from '../../QuoteProgressBar';
import { saveQuoteData, loadQuoteData } from '../../../../utils/quoteStorage';

const TOTAL_STEPS = 5;

export function OtherDeliveryFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [quoteData, setQuoteData] = useState<OtherQuote>(() => {
    const saved = loadQuoteData<OtherQuote>('other');
    return saved || {
      serviceType: 'other_delivery',
      pickup: { address: '', postcode: '', floor: 0, hasLift: false },
      dropoff: { address: '', postcode: '', floor: 0, hasLift: false },
      date: undefined,
      dateUnsure: false,
      items: [],
      distance: 0,
      quoteReference: '',
    };
  });

  const handleDataChange = (updates: Partial<OtherQuote>) => {
    const newData = { ...quoteData, ...updates };
    setQuoteData(newData);
    saveQuoteData('other', newData);
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
          <OtherStep1Address
            data={quoteData}
            onChange={handleDataChange}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <OtherStep2Inventory
            data={quoteData}
            onChange={handleDataChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <OtherStep3Pricing
            data={quoteData}
            onChange={handleDataChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <OtherStep4Access
            data={quoteData}
            onChange={handleDataChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 5:
        return (
          <OtherStep5Confirmation
            data={quoteData}
            onChange={handleDataChange}
            onNext={() => {}} // Final step
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-slate-50">
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
