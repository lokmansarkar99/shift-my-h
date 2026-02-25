import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { getQuoteData, getServiceCategoryName, type ServiceCategory } from '../../utils/quoteStorage';

interface QuoteProgressBarProps {
  currentStep: number;
}

const TOTAL_STEPS = 5; // House Move has 5 steps total

export function QuoteProgressBar({ currentStep }: QuoteProgressBarProps) {
  const [serviceCategory, setServiceCategory] = useState<ServiceCategory | null>(null);

  useEffect(() => {
    const data = getQuoteData();
    if (data.serviceCategory) {
      setServiceCategory(data.serviceCategory);
    }
  }, []);

  const serviceName = serviceCategory ? getServiceCategoryName(serviceCategory) : 'Get Instant Quote';
  
  // Define step labels based on service category
  const getStepLabels = (): string[] => {
    if (serviceCategory === 'clearance_removal') {
      return ['Address', 'Inventory', 'Pricing', 'Details', 'Contact'];
    }
    // Default for house move, furniture, etc.
    return ['Address', 'Inventory', 'Package', 'Details', 'Contact'];
  };
  
  const stepLabels = getStepLabels();

  return (
    <div className="sticky top-[73px] z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Service Category Badge + Progress */}
        <div className="flex flex-col gap-3">
          {/* Title + Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-slate-900">Get Instant Quote</h2>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full">
                <span className="text-sm font-semibold text-blue-700">{serviceName}</span>
                <span className="text-xs text-slate-500">·</span>
                <span className="text-sm text-slate-600">Step {currentStep} of {TOTAL_STEPS}</span>
              </div>
            </div>
          </div>

          {/* Mobile Badge */}
          <div className="sm:hidden flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full w-fit">
            <span className="text-sm font-semibold text-blue-700">{serviceName}</span>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-sm text-slate-600">Step {currentStep}/{TOTAL_STEPS}</span>
          </div>

          {/* Progress bar */}
          <div className="relative w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
            />
          </div>

          {/* Step labels */}
          <div className="flex justify-between mt-2 text-xs text-slate-600">
            <span className={currentStep >= 1 ? 'text-red-600 font-semibold' : ''}>{stepLabels[0]}</span>
            <span className={currentStep >= 2 ? 'text-red-600 font-semibold' : ''}>{stepLabels[1]}</span>
            <span className={currentStep >= 3 ? 'text-red-600 font-semibold' : ''}>{stepLabels[2]}</span>
            <span className={currentStep >= 4 ? 'text-red-600 font-semibold' : ''}>{stepLabels[3]}</span>
            <span className={currentStep >= 5 ? 'text-red-600 font-semibold' : ''}>{stepLabels[4]}</span>
          </div>
        </div>
      </div>
    </div>
  );
}