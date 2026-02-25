/**
 * Quote Flow - Step 6 Router (Confirmation)
 * Routes to the correct Step 6 implementation based on service type
 */

import React, { useState, useEffect } from 'react';
import { loadQuoteData as loadServiceData, getActiveServiceType } from '../../../utils/quoteStorage';
import { HouseMoveStep6Confirmation } from '../flows/house-move/HouseMoveStep6Confirmation';
import { ClearanceStep6Confirmation } from '../flows/clearance-removal/ClearanceStep6Confirmation';
import { FurnitureStep6Confirmation } from '../flows/furniture-items/FurnitureStep6Confirmation';
import { StoreStep6Confirmation } from '../flows/store-pickup/StoreStep6Confirmation';
import { MotorbikeStep6Confirmation } from '../flows/motorbike-bicycle/MotorbikeStep6Confirmation';
import { OtherStep5Confirmation } from '../flows/other-delivery/OtherStep5Confirmation';
import { HouseMoveQuote } from '../flows/house-move/houseMoveTypes';
import { ClearanceQuote } from '../flows/clearance-removal/clearanceTypes';
import { FurnitureQuote } from '../flows/furniture-items/furnitureTypes';
import { StoreQuote } from '../flows/store-pickup/storeTypes';
import { MotorbikeQuote } from '../flows/motorbike-bicycle/motorbikeTypes';
import { OtherQuote } from '../flows/other-delivery/otherTypes';
import { router } from '../../../utils/router';
import { Loader } from 'lucide-react';
import { QuoteHeader } from '../QuoteHeader';
import { QuoteProgressBar } from '../QuoteProgressBar';

// Confirmation Router Component
export function QuoteFlowStep6() {
  const [serviceType, setServiceType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quoteRef, setQuoteRef] = useState<string | undefined>(undefined);

  useEffect(() => {
    const service = getActiveServiceType();
    setServiceType(service);
    if (service) {
      const data = loadServiceData<any>(service);
      if (data?.quoteReference) {
        setQuoteRef(data.quoteReference);
      }
    }
    setIsLoading(false);
  }, []);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader className="animate-spin text-blue-600" /></div>;

  const renderContent = () => {
    if (serviceType === 'house-move') return <HouseMoveStep6Confirmation data={loadServiceData<HouseMoveQuote>('house-move')!} />;
    if (serviceType === 'clearance') return <ClearanceStep6Confirmation data={loadServiceData<ClearanceQuote>('clearance')!} />;
    if (serviceType === 'furniture') return <FurnitureStep6Confirmation data={loadServiceData<FurnitureQuote>('furniture')!} />;
    if (serviceType === 'motorbike') return <MotorbikeStep6Confirmation data={loadServiceData<MotorbikeQuote>('motorbike')!} />;
    if (serviceType === 'store-pickup') return <StoreStep6Confirmation data={loadServiceData<StoreQuote>('store-pickup')!} />;
    if (serviceType === 'other') return <OtherStep5Confirmation data={loadServiceData<OtherQuote>('other')!} onNext={() => {}} onBack={() => {}} />;
    
    // For services without Step 6, or unknown
    return (
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-amber-200 text-center">
        <h2 className="text-xl font-bold text-amber-600 mb-2">Confirmation Page Not Found</h2>
        <p className="text-slate-600">Please contact support or try again from the start.</p>
        <button onClick={() => router.navigate({ page: 'home' })} className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold">Back to Homepage</button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <QuoteHeader quoteRef={quoteRef} />
      <QuoteProgressBar currentStep={6} />
      <div className="flex-1 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
