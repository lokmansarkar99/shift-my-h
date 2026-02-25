import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Loader2, CheckCircle2, Shield, AlertCircle } from 'lucide-react';
import { PricingEngine, QuoteRequest, QuoteResponse } from '../../utils/pricingEngine';
import { QuoteSummaryPanel } from './QuoteSummaryPanel';
import { Step1Address } from './steps/Step1Address';
import { Step2Inventory } from './steps/Step2Inventory';
import { Step3Access } from './steps/Step3Access';
import { Step4Details } from './steps/Step4Details';
import { Step5Review } from './steps/Step5Review';
import { getServiceMetadata, getServiceTitle } from '../../utils/serviceMetadata';

interface QuoteWizardProps {
  serviceType: string;
  onClose: () => void;
}

export function QuoteWizard({ serviceType, onClose }: QuoteWizardProps) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [quote, setQuote] = useState<QuoteResponse | null>(null);

  // Get service metadata
  const serviceMetadata = getServiceMetadata(serviceType);
  const ServiceIcon = serviceMetadata?.icon;

  // Check if service is valid
  const hasValidService = !!serviceMetadata;

  // Form State
  const [formData, setFormData] = useState<QuoteRequest>({
    serviceType,
    pickup: { 
      address: '', 
      postcode: '', 
      hasLift: true, 
      floor: 0,
      hasStairs: false,
      stairFlights: 1,
      carryDistance: 'under10m',
      parkingRestrictions: {
        limitedParking: false,
        paidParking: false,
        loadingBayOnly: false
      },
      accessNotes: ''
    },
    dropoff: { 
      address: '', 
      postcode: '', 
      hasLift: true, 
      floor: 0,
      hasStairs: false,
      stairFlights: 1,
      carryDistance: 'under10m',
      parkingRestrictions: {
        limitedParking: false,
        paidParking: false,
        loadingBayOnly: false
      },
      accessNotes: ''
    },
    date: new Date(),
    items: [],
    selectedVehicle: 'medium',
    extras: { assembly: false, disassembly: false, packaging: false, helpers: 1 }
  });

  // Calculate quote whenever relevant form data changes
  useEffect(() => {
    // Debounce calculation
    const timer = setTimeout(() => {
      if (validateStep1()) {
        calculateQuote();
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [formData.pickup, formData.dropoff, formData.date, formData.items, formData.extras, formData.selectedVehicle]);

  const calculateQuote = async () => {
    setIsLoading(true);
    try {
      const response = await PricingEngine.calculateQuote(formData);
      setQuote(response);
    } catch (error) {
      console.error("Pricing error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateStep1 = () => {
    return formData.pickup.postcode.length > 3 && formData.dropoff.postcode.length > 3;
  };

  const handleNext = () => {
    setStep(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (step === 1) {
      onClose();
    } else {
      setStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const updateFormData = (updates: Partial<QuoteRequest>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  // Fallback UI when no service is selected
  if (!hasValidService) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-orange-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Please Choose a Service</h2>
          <p className="text-slate-600 mb-6">
            You need to select a service type before getting a quote.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={handleBack}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Get Instant Quote</h1>
              <div className="text-sm text-slate-600 flex items-center gap-2 mt-0.5">
                {ServiceIcon && (
                  <div className={`w-4 h-4 bg-gradient-to-r ${serviceMetadata.gradient} rounded flex items-center justify-center`}>
                    <ServiceIcon className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
                <span className="font-medium">{serviceMetadata?.title}</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500">Step {step} of 5</span>
              </div>
            </div>
          </div>
          
          <div className="hidden sm:flex items-center gap-2 text-green-600 text-sm font-medium bg-green-50 px-3 py-1.5 rounded-full">
            <Shield className="w-4 h-4" />
            <span className="hidden md:inline">Admin-Verified Pricing</span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="h-1 bg-slate-100 w-full">
          <motion.div 
            className="h-full bg-blue-600"
            initial={{ width: 0 }}
            animate={{ width: `${(step / 5) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 pb-32">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Content Area */}
          <div className={`flex-1 ${step === 3 || step === 2 ? 'w-full' : ''}`}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <Step1Address 
                  key="step1"
                  serviceType={serviceType}
                  data={formData} 
                  onChange={updateFormData} 
                  onNext={handleNext}
                />
              )}
              {step === 2 && (
                <Step2Inventory 
                  key="step2"
                  serviceType={serviceType}
                  data={formData} 
                  onChange={updateFormData} 
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )}
              {step === 3 && (
                <Step3Access 
                  key="step3"
                  data={formData} 
                  onChange={updateFormData} 
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )}
              {step === 4 && (
                <Step4Details 
                  key="step4"
                  serviceType={serviceType}
                  data={formData} 
                  onChange={updateFormData} 
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )}
              {step === 5 && (
                <Step5Review 
                  key="step5"
                  data={formData} 
                  quote={quote}
                  onBack={handleBack}
                  // Checkout flow integration passed here
                />
              )}
            </AnimatePresence>
          </div>

          {/* Sticky Summary Panel */}
          {step !== 3 && step !== 2 && (
            <div className="hidden lg:block w-96">
              <div className="sticky top-24">
                <QuoteSummaryPanel 
                  quote={quote} 
                  isLoading={isLoading} 
                  serviceType={serviceType}
                  pickupAddress={formData.pickup.address}
                  deliveryAddress={formData.dropoff.address}
                  pickupCoords={formData.pickup.lat && formData.pickup.lng ? { lat: formData.pickup.lat, lng: formData.pickup.lng } : undefined}
                  deliveryCoords={formData.dropoff.lat && formData.dropoff.lng ? { lat: formData.dropoff.lat, lng: formData.dropoff.lng } : undefined}
                  currentStep={step}
                  selectedItems={formData.items}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sticky Footer */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-40">
        <div className="flex items-center justify-between gap-4">
          <div>
             <p className="text-xs text-slate-500 uppercase font-bold">Total Estimate</p>
             {isLoading ? (
               <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
             ) : (
               <p className="text-xl font-bold text-blue-900">
                 {quote ? `£${quote.breakdown.total.toFixed(2)}` : '---'}
               </p>
             )}
          </div>
          <button
            onClick={handleNext}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            {step === 5 ? 'Pay Securely' : 'Next Step'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}