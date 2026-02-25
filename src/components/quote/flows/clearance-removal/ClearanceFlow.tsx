/**
 * Clearance & Removal Flow
 * Completely isolated from other services
 * Manages its own state, steps, and localStorage
 */

import React, { useState, useEffect } from 'react';
import { ClearanceQuote, getDefaultClearanceQuote } from './clearanceTypes';
import { saveQuoteData as saveServiceData, loadQuoteData as loadServiceData } from '../../../../utils/quoteStorage';
import { QuoteHeader } from '../../QuoteHeader';
import { QuoteProgressBar } from '../../QuoteProgressBar';
import { ClearanceStep1Address } from './ClearanceStep1Address';
import { ClearanceStep2Inventory } from './ClearanceStep2Inventory';
import { ClearanceStep3Access } from './ClearanceStep3Access';
import { ClearanceStep4Details } from './ClearanceStep4Details';
import { ClearanceStep5Review } from './ClearanceStep5Review';
import { ClearanceStep6Confirmation } from './ClearanceStep6Confirmation';

export function ClearanceFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [quoteData, setQuoteData] = useState<ClearanceQuote>(() => {
    const saved = loadServiceData<ClearanceQuote>('clearance');
    return saved || getDefaultClearanceQuote();
  });

  // Auto-save to localStorage whenever data changes
  useEffect(() => {
    saveServiceData('clearance', quoteData);
  }, [quoteData]);

  const updateQuoteData = (updates: Partial<ClearanceQuote>) => {
    setQuoteData(prev => ({
      ...prev,
      ...updates,
      updatedAt: new Date(),
    }));
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  console.log('🗑️ ClearanceFlow - Current Step:', currentStep);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <QuoteHeader />

      {/* Progress Bar */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <QuoteProgressBar currentStep={currentStep} totalSteps={6} />
      </div>

      {/* Step Content */}
      <div className="max-w-5xl mx-auto px-4 pb-12">
        {currentStep === 1 && (
          <ClearanceStep1Address
            data={quoteData}
            onChange={updateQuoteData}
            onNext={() => goToStep(2)}
          />
        )}

        {currentStep === 2 && (
          <ClearanceStep2Inventory
            data={quoteData}
            onChange={updateQuoteData}
            onNext={() => goToStep(3)}
            onBack={() => goToStep(1)}
          />
        )}

        {currentStep === 3 && (
          <ClearanceStep3Access
            data={quoteData}
            onChange={updateQuoteData}
            onNext={() => goToStep(4)}
            onBack={() => goToStep(2)}
          />
        )}

        {currentStep === 4 && (
          <ClearanceStep4Details
            data={quoteData}
            onChange={updateQuoteData}
            onNext={() => goToStep(5)}
            onBack={() => goToStep(3)}
          />
        )}

        {currentStep === 5 && (
          <ClearanceStep5Review
            data={quoteData}
            onChange={updateQuoteData}
            onNext={() => goToStep(6)}
            onBack={() => goToStep(4)}
          />
        )}

        {currentStep === 6 && (
          <ClearanceStep6Confirmation
            data={quoteData}
          />
        )}
      </div>
    </div>
  );
}