import React, { useState, useEffect } from 'react';
import { QuoteHeader } from '../QuoteHeader';
import { QuoteProgressBar } from '../QuoteProgressBar';
import { router } from '../../../utils/router';
import { getQuoteData, saveQuoteData, updateLastStep } from '../../../utils/quoteStorage';
import { ArrowLeft, Check } from 'lucide-react';
import { QuoteMoveSummary } from '../QuoteMoveSummary';
import { calculatePrice, getPackageMultipliers } from '../../../utils/pricingEngine';
import { SelectedItem } from '../InventoryList';

export function QuoteStep3Page() {
  const [quoteData, setQuoteData] = useState<any>({});
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [basePricing, setBasePricing] = useState<any>(null);
  const [currentTotalPrice, setCurrentTotalPrice] = useState<number | undefined>(undefined);
  
  // ✅ Load packages from admin config
  const PACKAGES = getPackageMultipliers();

  useEffect(() => {
    const savedData = getQuoteData();
    setQuoteData(savedData);

    // Calculate base pricing
    if (savedData.selectedItems && savedData.selectedItems.length > 0) {
      const inventory = savedData.selectedItems.map((item: SelectedItem) => ({
        id: item.id,
        quantity: item.quantity,
      }));

      const pricing = calculatePrice({
        distanceMiles: savedData.distance || 0,
        inventory,
        moveDate: savedData.moveDate ? new Date(savedData.moveDate) : undefined,
        flexibleDate: savedData.hasDateSelected === false,
        propertyType: savedData.pickupPropertyType,
        packageMultiplier: 1.0, // Always calculate BASE pricing without package multiplier first
      });

      setBasePricing(pricing);
      
      // If package already selected, calculate and set price WITH package multiplier
      if (savedData.selectedPackageId) {
        const pkg = PACKAGES.find(p => p.id === savedData.selectedPackageId);
        if (pkg) {
          // Recalculate with package multiplier applied in pricing engine
          const pricingWithPackage = calculatePrice({
            distanceMiles: savedData.distance || 0,
            inventory,
            moveDate: savedData.moveDate ? new Date(savedData.moveDate) : undefined,
            flexibleDate: savedData.hasDateSelected === false,
            propertyType: savedData.pickupPropertyType,
            packageMultiplier: pkg.multiplier, // Apply package multiplier in engine
          });
          setCurrentTotalPrice(pricingWithPackage.totalPrice);
        }
      }
    }

    // Load previously selected package
    if (savedData.selectedPackageId) {
      setSelectedPackageId(savedData.selectedPackageId);
    }
  }, []);

  const handleSelectPackage = (packageId: string) => {
    const pkg = PACKAGES.find(p => p.id === packageId);
    if (!pkg || !quoteData.selectedItems) return;

    // Recalculate pricing WITH package multiplier
    const inventory = quoteData.selectedItems.map((item: SelectedItem) => ({
      id: item.id,
      quantity: item.quantity,
    }));

    const pricingWithPackage = calculatePrice({
      distanceMiles: quoteData.distance || 0,
      inventory,
      moveDate: quoteData.moveDate ? new Date(quoteData.moveDate) : undefined,
      flexibleDate: quoteData.hasDateSelected === false,
      propertyType: quoteData.pickupPropertyType,
      packageMultiplier: pkg.multiplier, // Apply package multiplier in pricing engine
    });

    const finalPrice = pricingWithPackage.totalPrice;
    const isPremium = packageId === 'premium';

    // CRITICAL: Reset extras when switching packages
    // This prevents Standard extras from bleeding into Premium and vice versa
    saveQuoteData({
      selectedPackageId: packageId,
      selectedPackagePrice: finalPrice,
      isPremium: isPremium,
      // Clear all extras when switching packages - they'll be loaded from extrasByPackage if they exist
      packingService: false,
      dismantlingEnabled: false,
      dismantlingCount: 0,
      reassemblyEnabled: false,
      reassemblyCount: 0,
      extendedProtection: false,
      extrasTotal: 0,
      finalTotalPrice: finalPrice, // Reset to base package price
    });
    updateLastStep(3);

    setSelectedPackageId(packageId);
    setCurrentTotalPrice(finalPrice);

    // Navigate to Step 4
    setTimeout(() => {
      router.navigate({ page: 'quote-step', step: 4 });
    }, 300);
  };

  const handleBack = () => {
    router.navigate({ page: 'quote-step', step: 2 });
  };

  const getPackagePrice = (pkg: any) => {
    if (!quoteData.selectedItems) return 0;
    
    // Calculate price WITH package multiplier for display
    const inventory = quoteData.selectedItems.map((item: SelectedItem) => ({
      id: item.id,
      quantity: item.quantity,
    }));

    const pricing = calculatePrice({
      distanceMiles: quoteData.distance || 0,
      inventory,
      moveDate: quoteData.moveDate ? new Date(quoteData.moveDate) : undefined,
      flexibleDate: quoteData.hasDateSelected === false,
      propertyType: quoteData.pickupPropertyType,
      packageMultiplier: pkg.multiplier,
    });

    return pricing.totalPrice;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <QuoteHeader />
      <QuoteProgressBar currentStep={3} />

      <div className="flex-1 py-8 px-4">
        {/* DESKTOP: 60% / 40% Split Layout - IDENTICAL TO STEP 2 */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT CONTENT: Package Selection (60%) */}
            <div className="lg:col-span-7">
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                  Select a Package
                </h1>
                <p className="text-slate-600">
                  Choose the service level that best fits your needs
                </p>
              </div>

              {/* PACKAGE CARDS */}
              <div className="space-y-4">
                {PACKAGES.map((pkg) => {
                  const price = getPackagePrice(pkg);
                  const isSelected = selectedPackageId === pkg.id;

                  return (
                    <div
                      key={pkg.id}
                      className={`bg-white rounded-2xl border-2 transition-all ${
                        isSelected
                          ? 'border-green-500 shadow-lg'
                          : 'border-slate-200 hover:border-slate-300'
                      } ${pkg.popular ? 'relative' : ''}`}
                    >
                      {/* Popular Badge */}
                      {pkg.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-bold px-4 py-1 rounded-full shadow-md">
                            MOST POPULAR
                          </div>
                        </div>
                      )}

                      <div className="p-6 sm:p-8">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-6">
                          <div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-1">
                              {pkg.name}
                            </h3>
                            <p className="text-slate-600 font-medium">{pkg.subtitle}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl sm:text-4xl font-bold text-slate-900">
                              £{price.toLocaleString()}
                            </div>
                            <div className="text-xs text-slate-500 mt-1">estimated total</div>
                          </div>
                        </div>

                        {/* Includes List */}
                        <div className="mb-6">
                          <div className="text-sm font-bold text-slate-700 uppercase mb-3">
                            What's Included:
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {pkg.includes.map((item, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-slate-700">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Select Button */}
                        <button
                          onClick={() => handleSelectPackage(pkg.id)}
                          disabled={!basePricing}
                          className={`w-full font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 ${
                            isSelected
                              ? 'bg-green-600 text-white hover:bg-green-700'
                              : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {isSelected ? (
                            <>
                              <Check className="w-5 h-5" />
                              Selected
                            </>
                          ) : (
                            'Select Package'
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Back Button */}
              <div className="mt-6">
                <button
                  onClick={handleBack}
                  className="w-full sm:w-auto bg-slate-100 text-slate-700 font-bold py-4 px-6 rounded-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to Inventory
                </button>
              </div>
            </div>

            {/* RIGHT SIDEBAR: IDENTICAL TO STEP 2 (40%) */}
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-4 order-first lg:order-last">
                <QuoteMoveSummary
                  quoteRef={quoteData.quoteRef || ''}
                  pickupAddress={quoteData.pickupAddress}
                  deliveryAddress={quoteData.deliveryAddress}
                  pickupLat={quoteData.pickupLat}
                  pickupLng={quoteData.pickupLng}
                  deliveryLat={quoteData.deliveryLat}
                  deliveryLng={quoteData.deliveryLng}
                  distance={quoteData.distance}
                  duration={quoteData.duration}
                  moveDate={quoteData.moveDate}
                  hasDateSelected={quoteData.hasDateSelected}
                  selectedItems={quoteData.selectedItems || []}
                  pickupPropertyType={quoteData.pickupPropertyType}
                  deliveryPropertyType={quoteData.deliveryPropertyType}
                  totalPrice={currentTotalPrice}
                  arrivalTimeFrom={quoteData.arrivalTimeFrom}
                  arrivalTimeTo={quoteData.arrivalTimeTo}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}