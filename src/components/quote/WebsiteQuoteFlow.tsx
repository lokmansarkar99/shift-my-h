import React, { useState } from 'react';
import { QuoteFlowStep1ServiceType } from './QuoteFlowStep1ServiceType';
import { QuoteFlowStep4CrewVehicle } from './QuoteFlowStep4CrewVehicle';
import { QuoteFlowStep5Extras } from './QuoteFlowStep5Extras';
import { QuoteFlowStep6PricingResults } from './QuoteFlowStep6PricingResults';
import { calculatePrice, PricingResult } from '../../utils/pricingEngine';

type QuoteFlowStep = 1 | 2 | 3 | 4 | 5 | 6;

interface QuoteData {
  // Step 1
  serviceTypeId: string;
  moveDate?: Date;
  customerHelps: boolean;

  // Step 2 (placeholder - will be implemented)
  fromAddress: string;
  toAddress: string;
  distanceMiles: number;
  fromFloor: number;
  fromLift: boolean;
  toFloor: number;
  toLift: boolean;
  fromParking: 'easy' | 'moderate' | 'difficult';
  toParking: 'easy' | 'moderate' | 'difficult';

  // Step 3 (placeholder - will be implemented)
  inventory: Array<{ id: string; quantity: number }>;
  estimatedVolume: number;

  // Step 4
  crewSize: number;
  vehicleId?: string;

  // Step 5
  selectedExtras: Array<{ id: string; quantity: number }>;
}

export function WebsiteQuoteFlow() {
  const [currentStep, setCurrentStep] = useState<QuoteFlowStep>(1);
  const [quoteData, setQuoteData] = useState<Partial<QuoteData>>({});
  const [pricingResult, setPricingResult] = useState<PricingResult | null>(null);
  const [quoteId, setQuoteId] = useState<string>('');

  const handleStep1Continue = (data: {
    serviceTypeId: string;
    moveDate?: Date;
    customerHelps: boolean;
  }) => {
    setQuoteData(prev => ({
      ...prev,
      ...data,
    }));
    setCurrentStep(2);
  };

  const handleStep2Continue = (data: {
    fromAddress: string;
    toAddress: string;
    distanceMiles: number;
    fromFloor: number;
    fromLift: boolean;
    toFloor: number;
    toLift: boolean;
    fromParking: 'easy' | 'moderate' | 'difficult';
    toParking: 'easy' | 'moderate' | 'difficult';
  }) => {
    setQuoteData(prev => ({
      ...prev,
      ...data,
    }));
    setCurrentStep(3);
  };

  const handleStep3Continue = (data: {
    inventory: Array<{ id: string; quantity: number }>;
    estimatedVolume: number;
  }) => {
    setQuoteData(prev => ({
      ...prev,
      ...data,
    }));
    setCurrentStep(4);
  };

  const handleStep4Continue = (data: {
    crewSize: number;
    vehicleId?: string;
  }) => {
    setQuoteData(prev => ({
      ...prev,
      ...data,
    }));
    setCurrentStep(5);
  };

  const handleStep5Continue = (data: {
    selectedExtras: Array<{ id: string; quantity: number }>;
  }) => {
    const updatedData = {
      ...quoteData,
      ...data,
    } as QuoteData;

    setQuoteData(updatedData);

    // Calculate pricing
    try {
      const result = calculatePrice({
        serviceType: updatedData.serviceTypeId,
        distanceMiles: updatedData.distanceMiles,
        inventory: updatedData.inventory,
        crewSize: updatedData.crewSize,
        fromFloor: updatedData.fromFloor,
        fromLift: updatedData.fromLift,
        toFloor: updatedData.toFloor,
        toLift: updatedData.toLift,
        fromParking: updatedData.fromParking,
        toParking: updatedData.toParking,
        moveDate: updatedData.moveDate,
        customerHelps: updatedData.customerHelps,
        selectedExtras: updatedData.selectedExtras,
      });

      setPricingResult(result);
      setQuoteId(`QT-${Date.now()}`);
      setCurrentStep(6);
    } catch (error) {
      console.error('Pricing calculation error:', error);
      alert('Error calculating price. Please try again.');
    }
  };

  const handleEditQuote = () => {
    setCurrentStep(1);
  };

  const handleConfirmQuote = () => {
    // Save quote to localStorage or send to backend
    console.log('Quote confirmed:', {
      quoteId,
      quoteData,
      pricingResult,
    });

    alert(`Quote ${quoteId} confirmed! We'll contact you shortly.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            {[
              { step: 1, label: 'Service' },
              { step: 2, label: 'Addresses' },
              { step: 3, label: 'Inventory' },
              { step: 4, label: 'Crew' },
              { step: 5, label: 'Extras' },
              { step: 6, label: 'Quote' },
            ].map((item, index) => (
              <React.Fragment key={item.step}>
                <div className="flex flex-col items-center">
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300
                      ${currentStep >= item.step
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : 'bg-slate-200 text-slate-500'
                      }
                    `}
                  >
                    {currentStep > item.step ? '✓' : item.step}
                  </div>
                  <div className={`text-xs mt-2 font-semibold ${currentStep >= item.step ? 'text-indigo-600' : 'text-slate-500'}`}>
                    {item.label}
                  </div>
                </div>
                {index < 5 && (
                  <div className="flex-1 h-1 mx-2 rounded-full bg-slate-200">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        currentStep > item.step ? 'bg-indigo-600' : 'bg-slate-200'
                      }`}
                      style={{ width: currentStep > item.step ? '100%' : '0%' }}
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-4xl mx-auto">
        {currentStep === 1 && (
          <QuoteFlowStep1ServiceType
            onContinue={handleStep1Continue}
            initialData={{
              serviceTypeId: quoteData.serviceTypeId,
              moveDate: quoteData.moveDate,
              customerHelps: quoteData.customerHelps,
            }}
          />
        )}

        {currentStep === 2 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Step 2: Addresses (Placeholder)</h2>
            <p className="text-slate-600 mb-6">
              This step will contain address input, property details, and map preview.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-6 py-3 border-2 border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all"
              >
                ← Back
              </button>
              <button
                onClick={() => {
                  // Mock data for testing
                  handleStep2Continue({
                    fromAddress: 'Glasgow, Scotland',
                    toAddress: 'Edinburgh, Scotland',
                    distanceMiles: 47,
                    fromFloor: 2,
                    fromLift: false,
                    toFloor: 1,
                    toLift: true,
                    fromParking: 'moderate',
                    toParking: 'easy',
                  });
                }}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:from-indigo-700 hover:to-blue-700 transition-all"
              >
                Continue (Mock Data) →
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Step 3: Inventory (Placeholder)</h2>
            <p className="text-slate-600 mb-6">
              This step will contain items library selector and volume calculator.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-6 py-3 border-2 border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all"
              >
                ← Back
              </button>
              <button
                onClick={() => {
                  // Mock data for testing
                  handleStep3Continue({
                    inventory: [
                      { id: 'double-bed', quantity: 1 },
                      { id: 'sofa-3-seater', quantity: 1 },
                      { id: 'wardrobe', quantity: 2 },
                    ],
                    estimatedVolume: 10.5,
                  });
                }}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:from-indigo-700 hover:to-blue-700 transition-all"
              >
                Continue (Mock Data) →
              </button>
            </div>
          </div>
        )}

        {currentStep === 4 && quoteData.serviceTypeId && (
          <QuoteFlowStep4CrewVehicle
            serviceTypeId={quoteData.serviceTypeId}
            customerHelps={quoteData.customerHelps || false}
            estimatedVolume={quoteData.estimatedVolume || 0}
            onContinue={handleStep4Continue}
            onBack={() => setCurrentStep(3)}
            initialData={{
              crewSize: quoteData.crewSize,
              vehicleId: quoteData.vehicleId,
            }}
          />
        )}

        {currentStep === 5 && (
          <QuoteFlowStep5Extras
            onContinue={handleStep5Continue}
            onBack={() => setCurrentStep(4)}
            initialData={{
              selectedExtras: quoteData.selectedExtras,
            }}
          />
        )}

        {currentStep === 6 && pricingResult && quoteData.serviceTypeId && (
          <QuoteFlowStep6PricingResults
            quoteId={quoteId}
            pricingResult={pricingResult}
            quoteData={quoteData as QuoteData}
            onEdit={handleEditQuote}
            onConfirm={handleConfirmQuote}
          />
        )}
      </div>
    </div>
  );
}
