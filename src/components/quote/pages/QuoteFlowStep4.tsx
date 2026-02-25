/**
 * Quote Flow - Step 4 Router
 * Routes to the correct Step 4 implementation based on service type
 */

import React, { useState, useEffect } from 'react';
import { loadQuoteData as loadServiceData, saveQuoteData as saveServiceData, getActiveServiceType } from '../../../utils/quoteStorage';
import { HouseMoveStep4Access } from '../flows/house-move/HouseMoveStep4Access';
import { ClearanceStep4Details } from '../flows/clearance-removal/ClearanceStep4Details';
import { FurnitureStep4Details } from '../flows/furniture-items/FurnitureStep4Details';
import { MotorbikeStep4Access } from '../flows/motorbike-bicycle/MotorbikeStep4Access';
import { StoreStep4AccessAndDetails } from '../flows/store-pickup/StoreStep4AccessAndDetails';
import { OtherStep4Access } from '../flows/other-delivery/OtherStep4Access';
import { router } from '../../../utils/router';
import { Loader } from 'lucide-react';
import { QuoteHeader } from '../QuoteHeader';
import { QuoteProgressBar } from '../QuoteProgressBar';

// Generic Wrapper for consistency
function ServiceStep4Wrapper({ type, Component, maxWidth = "max-w-7xl" }: { type: any, Component: any, maxWidth?: string }) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const saved = loadServiceData<any>(type);
    setData(saved);
  }, []);

  if (!data) return <div className="min-h-screen flex items-center justify-center"><Loader className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <QuoteHeader quoteRef={data.quoteReference} />
      <QuoteProgressBar currentStep={4} />
      <div className="flex-1 py-8 px-4">
        <div className={maxWidth + " mx-auto"}>
          <Component 
            data={data} 
            onChange={(u: any) => { const n = {...data, ...u}; setData(n); saveServiceData(type, n); }} 
            onNext={() => router.navigate({ page: 'quote-step', step: 5 })} 
            onBack={() => router.navigate({ page: 'quote-step', step: 3 })} 
          />
        </div>
      </div>
    </div>
  );
}

// Main Router Component
export function QuoteFlowStep4() {
  const [serviceType, setServiceType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setServiceType(getActiveServiceType());
    setIsLoading(false);
  }, []);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader className="animate-spin text-blue-600" /></div>;

  if (serviceType === 'house-move') return <ServiceStep4Wrapper type="house-move" Component={HouseMoveStep4Access} />;
  if (serviceType === 'clearance') return <ServiceStep4Wrapper type="clearance" Component={ClearanceStep4Details} maxWidth="max-w-[1600px]" />;
  if (serviceType === 'furniture') return <ServiceStep4Wrapper type="furniture" Component={FurnitureStep4Details} maxWidth="max-w-[1600px]" />;
  if (serviceType === 'motorbike') return <ServiceStep4Wrapper type="motorbike" Component={MotorbikeStep4Access} />;
  if (serviceType === 'store-pickup') return <ServiceStep4Wrapper type="store-pickup" Component={StoreStep4AccessAndDetails} />;
  if (serviceType === 'other') return <ServiceStep4Wrapper type="other" Component={OtherStep4Access} />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 text-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-amber-200">
        <h2 className="text-xl font-bold text-amber-600 mb-2">Service Not Found</h2>
        <button onClick={() => router.navigate({ page: 'home' })} className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg">Back to Homepage</button>
      </div>
    </div>
  );
}
