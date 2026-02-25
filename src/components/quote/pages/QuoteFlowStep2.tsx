/**
 * Quote Flow - Step 2 Router
 * Routes to the correct Step 2 implementation based on service type
 */

import React, { useState, useEffect } from 'react';
import { loadQuoteData, saveQuoteData, getActiveServiceType } from '../../../utils/quoteStorage';
import { Step2Inventory } from '../flows/house-move/HouseMoveStep2Inventory';
import { ClearanceStep2Inventory } from '../flows/clearance-removal/ClearanceStep2Inventory';
import { FurnitureStep2ItemsNew } from '../flows/furniture-items/FurnitureStep2ItemsNew';
import { MotorbikeStep2Inventory } from '../flows/motorbike-bicycle/MotorbikeStep2Inventory';
import { StoreStep2Inventory } from '../flows/store-pickup/StoreStep2Inventory';
import { OtherStep2Inventory } from '../flows/other-delivery/OtherStep2Inventory';
import { HouseMoveQuote } from '../flows/house-move/houseMoveTypes';
import { ClearanceQuote } from '../flows/clearance-removal/clearanceTypes';
import { FurnitureQuote } from '../flows/furniture-items/furnitureTypes';
import { MotorbikeQuote } from '../flows/motorbike-bicycle/motorbikeTypes';
import { StoreQuote } from '../flows/store-pickup/storeTypes';
import { OtherQuote } from '../flows/other-delivery/otherTypes';
import { router } from '../../../utils/router';
import { Loader } from 'lucide-react';
import { QuoteHeader } from '../QuoteHeader';
import { QuoteProgressBar } from '../QuoteProgressBar';

// Generic Wrapper for consistency
function ServiceStep2Wrapper({ type, Component }: { type: any, Component: any }) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const saved = loadQuoteData<any>(type);
    setData(saved);
  }, []);

  if (!data) return <div className="min-h-screen flex items-center justify-center"><Loader className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <QuoteHeader quoteRef={data.quoteReference} />
      <QuoteProgressBar currentStep={2} />
      <div className="flex-1 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <Component 
            data={data} 
            onChange={(u: any) => { const n = {...data, ...u}; setData(n); saveQuoteData(type, n); }} 
            onNext={() => router.navigate({ page: 'quote-step', step: 3 })} 
            onBack={() => router.navigate({ page: 'quote-step', step: 1 })} 
          />
        </div>
      </div>
    </div>
  );
}

// Main Router Component
export function QuoteFlowStep2() {
  const [serviceType, setServiceType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setServiceType(getActiveServiceType());
    setIsLoading(false);
  }, []);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader className="animate-spin" /></div>;

  if (serviceType === 'house-move') return <ServiceStep2Wrapper type="house-move" Component={Step2Inventory} />;
  if (serviceType === 'clearance') return <ServiceStep2Wrapper type="clearance" Component={ClearanceStep2Inventory} />;
  if (serviceType === 'furniture') return <ServiceStep2Wrapper type="furniture" Component={FurnitureStep2ItemsNew} />;
  if (serviceType === 'motorbike') return <ServiceStep2Wrapper type="motorbike" Component={MotorbikeStep2Inventory} />;
  if (serviceType === 'store-pickup') return <ServiceStep2Wrapper type="store-pickup" Component={StoreStep2Inventory} />;
  if (serviceType === 'other') return <ServiceStep2Wrapper type="other" Component={OtherStep2Inventory} />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 text-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-amber-200">
        <h2 className="text-xl font-bold text-amber-600 mb-2">Service Not Found</h2>
        <button onClick={() => router.navigate({ page: 'home' })} className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg">Back to Homepage</button>
      </div>
    </div>
  );
}
