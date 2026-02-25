/**
 * Quote Flow - Step 3 Router
 * Routes to the correct Step 3 implementation based on service type
 */

import React, { useState, useEffect } from 'react';
import { loadQuoteData, saveQuoteData, getActiveServiceType } from '../../../utils/quoteStorage';
import { Step3Pricing } from '../flows/house-move/HouseMoveStep3Pricing';
import { FurnitureStep3PricingNew } from '../flows/furniture-items/FurnitureStep3PricingNew';
import { MotorbikeStep3Pricing } from '../flows/motorbike-bicycle/MotorbikeStep3Pricing';
import { StoreStep3Pricing } from '../flows/store-pickup/StoreStep3Pricing';
import { ClearanceStep3Pricing } from '../flows/clearance-removal/ClearanceStep3Pricing';
import { OtherStep3Pricing } from '../flows/other-delivery/OtherStep3Pricing';
import { HouseMoveQuote } from '../flows/house-move/houseMoveTypes';
import { ClearanceQuote } from '../flows/clearance-removal/clearanceTypes';
import { FurnitureQuote } from '../flows/furniture-items/furnitureTypes';
import { MotorbikeQuote } from '../flows/motorbike-bicycle/motorbikeTypes';
import { StoreQuote } from '../flows/store-pickup/storeTypes';
import { router } from '../../../utils/router';
import { Loader } from 'lucide-react';
import { QuoteHeader } from '../QuoteHeader';
import { QuoteProgressBar } from '../QuoteProgressBar';
import { QuoteGeneratingLoader } from '../QuoteGeneratingLoader';

// Generic Wrapper for consistency
function ServiceStep3Wrapper({ type, Component, showLoaderLogic }: { type: any, Component: any, showLoaderLogic?: boolean }) {
  const [data, setData] = useState<any>(null);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    const saved = loadQuoteData<any>(type);
    setData(saved);
    if (showLoaderLogic && saved && !saved.pricing && !saved.estimatedPrice) {
      setShowLoader(true);
    }
  }, []);

  if (showLoader) return <QuoteGeneratingLoader onComplete={() => setShowLoader(false)} />;
  if (!data) return <div className="min-h-screen flex items-center justify-center"><Loader className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <QuoteHeader quoteRef={data.quoteReference} />
      <QuoteProgressBar currentStep={3} />
      <div className="flex-1 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <Component 
            data={data} 
            onChange={(u: any) => saveQuoteData(type, {...data, ...u})} 
            onNext={() => router.navigate({ page: 'quote-step', step: 4 })} 
            onBack={() => router.navigate({ page: 'quote-step', step: 2 })} 
          />
        </div>
      </div>
    </div>
  );
}

// Main Router Component
export function QuoteFlowStep3() {
  const [serviceType, setServiceType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setServiceType(getActiveServiceType());
    setIsLoading(false);
  }, []);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader className="animate-spin text-blue-600" /></div>;

  if (serviceType === 'house-move') return <ServiceStep3Wrapper type="house-move" Component={Step3Pricing} showLoaderLogic={true} />;
  if (serviceType === 'clearance') return <ServiceStep3Wrapper type="clearance" Component={ClearanceStep3Pricing} />;
  if (serviceType === 'furniture') return <ServiceStep3Wrapper type="furniture" Component={FurnitureStep3PricingNew} />;
  if (serviceType === 'motorbike') return <ServiceStep3Wrapper type="motorbike" Component={MotorbikeStep3Pricing} />;
  if (serviceType === 'store-pickup') return <ServiceStep3Wrapper type="store-pickup" Component={StoreStep3Pricing} />;
  if (serviceType === 'other') return <ServiceStep3Wrapper type="other" Component={OtherStep3Pricing} />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 text-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-amber-200">
        <h2 className="text-xl font-bold text-amber-600 mb-2">Service Not Found</h2>
        <p className="text-slate-600">Unable to determine service type.</p>
        <button onClick={() => router.navigate({ page: 'home' })} className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg">Back to Homepage</button>
      </div>
    </div>
  );
}
