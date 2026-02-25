/**
 * Furniture & Items Flow
 * Complete flow implementation
 */

import React, { useState, useEffect } from 'react';
import { FurnitureQuote, getDefaultFurnitureQuote } from './furnitureTypes';
import { saveQuoteData as saveServiceData, loadQuoteData as loadServiceData } from '../../../../utils/quoteStorage';
import { QuoteHeader } from '../../QuoteHeader';
import { QuoteProgressBar } from '../../QuoteProgressBar';
import { FurnitureStep1Address } from './FurnitureStep1Address';
import { router } from '../../../../utils/router';

export function FurnitureFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [quoteData, setQuoteData] = useState<FurnitureQuote>(() => {
    const saved = loadServiceData<FurnitureQuote>('furniture');
    return saved || getDefaultFurnitureQuote();
  });

  const updateQuoteData = (updates: Partial<FurnitureQuote>) => {
    const newData = { ...quoteData, ...updates };
    setQuoteData(newData);
    saveServiceData('furniture', newData);
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
    window.scrollTo(0, 0);
  };

  const handleStep1Next = () => {
    router.navigate({ page: 'quote-step', step: 2 });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <QuoteHeader />
      <QuoteProgressBar currentStep={currentStep} />

      {/* Step Content */}
      <div className="flex-1 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {currentStep === 1 && (
            <FurnitureStep1Address
              data={quoteData}
              onChange={updateQuoteData}
              onNext={handleStep1Next}
            />
          )}

          {currentStep === 2 && (
            <div className="bg-white p-12 rounded-2xl shadow-xl border border-slate-200 max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Step 2: Select Furniture Items
              </h2>
              <p className="text-slate-600 mb-6">
                This step is coming soon! You'll be able to select which furniture items you need to move.
              </p>
              <button 
                onClick={() => goToStep(1)}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                Back to Step 1
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
