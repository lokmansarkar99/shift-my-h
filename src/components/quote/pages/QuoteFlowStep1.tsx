/**
 * Quote Flow - Step 1 Router
 * Detects service type and routes to correct Step 1 component
 */

import React, { useState, useEffect } from 'react';
import { loadQuoteData as loadServiceData, saveQuoteData as saveServiceData } from '../../../utils/quoteStorage';
import { Step1Address } from '../flows/house-move/HouseMoveStep1Address';
import { ClearanceStep1Address } from '../flows/clearance-removal/ClearanceStep1Address';
import { FurnitureStep1Address } from '../flows/furniture-items/FurnitureStep1Address';
import { MotorbikeStep1Address } from '../flows/motorbike-bicycle/MotorbikeStep1Address';
import { StoreStep1Address } from '../flows/store-pickup/StoreStep1Address';
import { OtherStep1Address } from '../flows/other-delivery/OtherStep1Address';
import { HouseMoveQuote, getDefaultHouseMoveQuote } from '../flows/house-move/houseMoveTypes';
import { ClearanceQuote, getDefaultClearanceQuote } from '../flows/clearance-removal/clearanceTypes';
import { FurnitureQuote, getDefaultFurnitureQuote } from '../flows/furniture-items/furnitureTypes';
import { MotorbikeQuote, getDefaultMotorbikeQuote } from '../flows/motorbike-bicycle/motorbikeTypes';
import { StoreQuote, getDefaultStoreQuote } from '../flows/store-pickup/storeTypes';
import { OtherQuote, getDefaultOtherQuote } from '../flows/other-delivery/otherTypes';
import { router } from '../../../utils/router';
import { Loader } from 'lucide-react';
import { QuoteHeader } from '../QuoteHeader';
import { QuoteProgressBar } from '../QuoteProgressBar';

// Generic Wrapper
function ServiceStep1Wrapper({ type, Component, getDefault }: { type: any, Component: any, getDefault: () => any }) {
  const [data, setData] = useState<any>(() => {
    const saved = loadServiceData<any>(type);
    return saved || getDefault();
  });

  const updateData = (updates: Partial<any>) => {
    const newData = { ...data, ...updates };
    setData(newData);
    saveServiceData(type, newData);
  };

  const handleNext = () => router.navigate({ page: 'quote-step', step: 2 });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <QuoteHeader quoteRef={data.quoteReference} />
      <QuoteProgressBar currentStep={1} />
      <div className="flex-1 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <Component data={data} onChange={updateData} onNext={handleNext} />
        </div>
      </div>
    </div>
  );
}

// Main Router Component
export function QuoteFlowStep1() {
  const [serviceType, setServiceType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const oldQuoteData = localStorage.getItem('shiftmyhome_quote_data');
    if (oldQuoteData) {
      const parsed = JSON.parse(oldQuoteData);
      setServiceType(parsed.serviceType || 'house-move');
    } else {
      setServiceType('house-move');
    }
    setIsLoading(false);
  }, []);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader className="w-8 h-8 animate-spin text-blue-600" /></div>;

  if (serviceType === 'house-move') return <ServiceStep1Wrapper type="house-move" Component={Step1Address} getDefault={getDefaultHouseMoveQuote} />;
  if (serviceType === 'clearance') return <ServiceStep1Wrapper type="clearance" Component={ClearanceStep1Address} getDefault={getDefaultClearanceQuote} />;
  if (serviceType === 'furniture') return <ServiceStep1Wrapper type="furniture" Component={FurnitureStep1Address} getDefault={getDefaultFurnitureQuote} />;
  if (serviceType === 'motorbike') return <ServiceStep1Wrapper type="motorbike" Component={MotorbikeStep1Address} getDefault={getDefaultMotorbikeQuote} />;
  if (serviceType === 'store-pickup') return <ServiceStep1Wrapper type="store-pickup" Component={StoreStep1Address} getDefault={getDefaultStoreQuote} />;
  if (serviceType === 'other') return <ServiceStep1Wrapper type="other" Component={OtherStep1Address} getDefault={getDefaultOtherQuote} />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-amber-200 text-center">
        <h2 className="text-xl font-bold text-amber-600 mb-2">Service Not Implemented</h2>
        <button onClick={() => router.navigate({ page: 'home' })} className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg">Back to Homepage</button>
      </div>
    </div>
  );
}
