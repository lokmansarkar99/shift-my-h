/**
 * Motorbike & Bicycle Flow
 * Complete multi-step quote flow for motorbike and bicycle transport
 */

import React, { useState } from 'react';
import { MotorbikeQuote } from './motorbikeTypes';
import { MotorbikeStep1Address } from './MotorbikeStep1Address';
import { MotorbikeStep2Inventory } from './MotorbikeStep2Inventory';
import { MotorbikeStep3Pricing } from './MotorbikeStep3Pricing';
import { MotorbikeStep4Access } from './MotorbikeStep4Access';
import { MotorbikeStep5Review } from './MotorbikeStep5Review';
import { MotorbikeStep6Confirmation } from './MotorbikeStep6Confirmation';
import { QuoteHeader } from '../../QuoteHeader';
import { QuoteProgressBar } from '../../QuoteProgressBar';
import { saveQuoteData, loadQuoteData } from '../../../../utils/quoteStorage';

const TOTAL_STEPS = 6;

export function MotorbikeFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [quoteData, setQuoteData] = useState<MotorbikeQuote>(() => {
    const saved = loadQuoteData<MotorbikeQuote>('motorbike');
    return saved || {
      serviceType: 'motorbike_bicycle',
      pickup: { address: '', postcode: '', floor: 0, hasLift: false },
      dropoff: { address: '', postcode: '', floor: 0, hasLift: false },
      date: undefined,
      dateUnsure: false,
      items: [],
      distance: 0,
      quoteReference: '',
    };
  });

  const handleDataChange = (updates: Partial<MotorbikeQuote>) => {
    const newData = { ...quoteData, ...updates };
    setQuoteData(newData);
    saveQuoteData('motorbike', newData);
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
          <MotorbikeStep1Address
            data={quoteData}
            onChange={handleDataChange}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <MotorbikeStep2Inventory
            data={quoteData}
            onChange={handleDataChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <MotorbikeStep3Pricing
            data={quoteData}
            onChange={handleDataChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <MotorbikeStep4Access
            data={quoteData}
            onChange={handleDataChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 5:
        return (
          <MotorbikeStep5Review
            data={quoteData}
            onChange={handleDataChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 6:
        return (
          <MotorbikeStep6Confirmation
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
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
