/**
 * Quote Flow - Step 5 Router
 * Routes to the correct Step 5 implementation based on service type
 */

import React, { useState, useEffect } from 'react';
import { loadQuoteData as loadServiceData, saveQuoteData as saveServiceData, getActiveServiceType } from '../../../utils/quoteStorage';
import { Step5Contact } from '../flows/house-move/HouseMoveStep5Contact';
import { ClearanceStep5Review } from '../flows/clearance-removal/ClearanceStep5Review';
import { FurnitureStep5Contact } from '../flows/furniture-items/FurnitureStep5Contact';
import { MotorbikeStep5Review } from '../flows/motorbike-bicycle/MotorbikeStep5Review';
import { StoreStep5Review } from '../flows/store-pickup/StoreStep5Review';
import { OtherStep5Review } from '../flows/other-delivery/OtherStep5Review';
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

// House Move Wrapper
function HouseMoveStep5() {
  const [data, setData] = useState<HouseMoveQuote | null>(null);
  useEffect(() => { setData(loadServiceData<HouseMoveQuote>('house-move')); }, []);
  const updateData = (u: Partial<HouseMoveQuote>) => { if (data) { const n = { ...data, ...u }; setData(n); saveServiceData('house-move', n); } };
  const handleNext = () => router.navigate({ page: 'quote-step', step: 6 });
  const handleBack = () => router.navigate({ page: 'quote-step', step: 4 });
  if (!data) return <div className="min-h-screen flex items-center justify-center"><Loader className="animate-spin" /></div>;
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <QuoteHeader quoteRef={data.quoteReference} />
      <QuoteProgressBar currentStep={5} />
      <div className="flex-1 py-8 px-4"><div className="max-w-7xl mx-auto"><Step5Contact data={data} onChange={updateData} onNext={handleNext} onBack={handleBack} /></div></div>
    </div>
  );
}

// Motorbike Wrapper
function MotorbikeStep5() {
  const [data, setData] = useState<MotorbikeQuote | null>(null);
  useEffect(() => { setData(loadServiceData<MotorbikeQuote>('motorbike')); }, []);
  const updateData = (u: Partial<MotorbikeQuote>) => { if (data) { const n = { ...data, ...u }; setData(n); saveServiceData('motorbike', n); } };
  const handleNext = () => router.navigate({ page: 'quote-step', step: 6 });
  const handleBack = () => router.navigate({ page: 'quote-step', step: 4 });
  if (!data) return <div className="min-h-screen flex items-center justify-center"><Loader className="animate-spin" /></div>;
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <QuoteHeader quoteRef={data.quoteReference} />
      <QuoteProgressBar currentStep={5} />
      <div className="flex-1 py-8 px-4"><div className="max-w-7xl mx-auto"><MotorbikeStep5Review data={data} onChange={updateData} onNext={handleNext} onBack={handleBack} /></div></div>
    </div>
  );
}

// Main Router Component
export function QuoteFlowStep5() {
  const [serviceType, setServiceType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const service = getActiveServiceType();
    setServiceType(service);
    setIsLoading(false);
  }, []);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader className="animate-spin text-blue-600" /></div>;

  if (serviceType === 'house-move') return <HouseMoveStep5 />;
  
  // Generic wrapper for other services
  const renderServiceStep = (type: any, Component: any, label: string) => {
    const data = loadServiceData<any>(type);
    if (!data) return <div className="min-h-screen flex items-center justify-center"><Loader className="animate-spin" /></div>;
    return (
      <div className="min-h-screen flex flex-col">
        <QuoteHeader quoteRef={data.quoteReference} />
        <QuoteProgressBar currentStep={5}/>
        <div className="flex-1 py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <Component 
              data={data} 
              onChange={(u: any)=>saveServiceData(type,{...data,...u})} 
              onNext={()=>router.navigate({page:'quote-step',step:6})} 
              onBack={()=>router.navigate({page:'quote-step',step:4})}
            />
          </div>
        </div>
      </div>
    );
  };

  if (serviceType === 'clearance') return renderServiceStep('clearance', ClearanceStep5Review, 'clearance');
  if (serviceType === 'furniture') return renderServiceStep('furniture', FurnitureStep5Contact, 'furniture');
  if (serviceType === 'motorbike') return <MotorbikeStep5 />;
  if (serviceType === 'store-pickup') return renderServiceStep('store-pickup', StoreStep5Review, 'store-pickup');
  if (serviceType === 'other') return renderServiceStep('other', OtherStep5Review, 'other');

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-amber-200 text-center">
        <h2 className="text-xl font-bold text-amber-600 mb-2">Service Not Found</h2>
        <p className="text-slate-600">Unable to determine service type. Please start from the beginning.</p>
        <button onClick={() => router.navigate({ page: 'home' })} className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold">Back to Homepage</button>
      </div>
    </div>
  );
}
