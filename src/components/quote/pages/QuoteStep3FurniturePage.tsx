import React, { useState, useEffect } from 'react';
import { QuoteHeader } from '../QuoteHeader';
import { QuoteProgressBar } from '../QuoteProgressBar';
import { router } from '../../../utils/router';
import { getQuoteData, saveQuoteData, updateLastStep } from '../../../utils/quoteStorage';
import { ArrowLeft, ArrowRight, Check, Package, Shield, Sparkles, Truck } from 'lucide-react';
import { QuoteSummaryPanel } from '../QuoteSummaryPanel';

// 🪑 FURNITURE VOLUME CALCULATOR
const calculateTotalVolume = (items: any[]): number => {
  const FURNITURE_VOLUMES: Record<string, number> = {
    // Sofas
    'sofa-2-seater': 1.8,
    'sofa-3-seater': 2.5,
    'sofa-l-shaped': 3.2,
    'sofa-armchair': 0.8,
    'sofa-recliner': 1.2,
    // Wardrobes
    'wardrobe-single': 1.5,
    'wardrobe-double': 2.5,
    'wardrobe-sliding': 3.0,
    'wardrobe-fitted': 1.0,
    // Boxes
    'box-small': 0.027,
    'box-medium': 0.091,
    'box-large': 0.216,
    'box-xlarge': 0.421,
    // Beds
    'bed-single': 1.2,
    'bed-double': 1.8,
    'bed-king': 2.2,
    'bed-super-king': 2.6,
    'mattress-single': 0.6,
    'mattress-double': 0.9,
    'mattress-king': 1.1,
    'bed-frame': 0.8,
    // Tables
    'table-dining-4': 1.2,
    'table-dining-6': 1.8,
    'table-dining-8': 2.4,
    'table-coffee': 0.4,
    'table-side': 0.2,
    'table-desk': 0.8,
    // TVs
    'tv-small': 0.15,
    'tv-medium': 0.25,
    'tv-large': 0.35,
    'tv-stand': 0.6,
    // Clothing
    'clothing-suitcase': 0.1,
    'clothing-garment-bag': 0.05,
    'clothing-storage-box': 0.08,
    // Kitchen
    'kitchen-microwave': 0.05,
    'kitchen-toaster': 0.02,
    'kitchen-kettle': 0.015,
    'kitchen-pots-set': 0.03,
    'kitchen-plates-set': 0.025,
    // Appliances
    'appliance-washing-machine': 0.5,
    'appliance-dryer': 0.5,
    'appliance-dishwasher': 0.45,
    'appliance-fridge': 0.7,
    'appliance-freezer': 0.6,
    'appliance-oven': 0.4,
    // Other
    'misc-lamp': 0.1,
    'misc-mirror': 0.15,
    'misc-painting': 0.05,
    'misc-plant': 0.08,
    'misc-rug': 0.12,
  };

  let total = 0;
  items.forEach(item => {
    const volume = FURNITURE_VOLUMES[item.id] || 0.1; // Default 0.1m³ for unknown items
    total += volume * item.quantity;
  });

  return total;
};

// 🚚 FURNITURE PRICING BASED ON VOLUME
const calculateFurniturePricing = (volumeM3: number, distanceMiles: number): { basePrice: number; standardPrice: number; premiumPrice: number } => {
  // Base cost per m³ + distance
  const volumeCost = volumeM3 * 25; // £25 per m³
  const distanceCost = distanceMiles * 1.2; // £1.20 per mile
  const basePrice = volumeCost + distanceCost + 80; // +£80 base fee

  // Standard package (base price)
  const standardPrice = Math.round(basePrice);

  // Premium package (+35% with extras included)
  const premiumPrice = Math.round(basePrice * 1.35);

  return { basePrice, standardPrice, premiumPrice };
};

export function QuoteStep3FurniturePage() {
  const [quoteData, setQuoteData] = useState<any>({});
  const [selectedPackageId, setSelectedPackageId] = useState<string>('standard');
  const [totalVolume, setTotalVolume] = useState<number>(0);
  const [pricing, setPricing] = useState<any>(null);

  useEffect(() => {
    const savedData = getQuoteData();
    setQuoteData(savedData);

    // Calculate total volume
    if (savedData.selectedItems && savedData.selectedItems.length > 0) {
      const volume = calculateTotalVolume(savedData.selectedItems);
      setTotalVolume(volume);

      // Calculate pricing
      const furniturePricing = calculateFurniturePricing(
        volume,
        savedData.distance || 0
      );
      setPricing(furniturePricing);

      console.log('[Furniture Pricing] Volume:', volume, 'm³');
      console.log('[Furniture Pricing] Pricing:', furniturePricing);
    }

    // Load previously selected package
    if (savedData.selectedPackageId) {
      setSelectedPackageId(savedData.selectedPackageId);
    }
  }, []);

  const handleSelectPackage = (packageId: string) => {
    setSelectedPackageId(packageId);

    const isPremium = packageId === 'premium';
    const selectedPrice = isPremium ? pricing.premiumPrice : pricing.standardPrice;

    saveQuoteData({
      selectedPackageId: packageId,
      selectedPackagePrice: selectedPrice,
      isPremium: isPremium,
      furnitureTotalVolume: totalVolume,
      // Reset extras when switching packages
      furnitureExtras: {
        smallBoxQty: 0,
        mediumBoxQty: 0,
        largeBoxQty: 0,
        xlBoxQty: 0,
        bubbleWrapQty: 0,
        packingTapeQty: 0,
        fullPackingService: false,
        partialPackingService: false,
        pianoMoving: false,
        furnitureDismantling: false,
        heavyItemHandling: false,
        storageOneMonth: false,
        premiumInsurance: false,
        waitingTimeQty: 0,
      },
    });
  };

  const handleNext = () => {
    if (!selectedPackageId) {
      return;
    }

    const isPremium = selectedPackageId === 'premium';
    const selectedPrice = isPremium ? pricing.premiumPrice : pricing.standardPrice;

    saveQuoteData({
      selectedPackageId: selectedPackageId,
      selectedPackagePrice: selectedPrice,
      isPremium: isPremium,
      furnitureTotalVolume: totalVolume,
    });
    updateLastStep(3);
    router.navigate({ page: 'quote-step', step: 4 });
  };

  const handleBack = () => {
    router.navigate({ page: 'quote-step', step: 2 });
  };

  const getVolumeDescription = () => {
    if (totalVolume < 5) return { text: 'Small Move', icon: '🚐', color: 'text-green-600' };
    if (totalVolume < 12) return { text: 'Medium Move', icon: '🚚', color: 'text-amber-600' };
    return { text: 'Large Move', icon: '🚛', color: 'text-red-600' };
  };

  const volumeDesc = getVolumeDescription();

  if (!pricing) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Calculating your quote...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <QuoteHeader />
      <QuoteProgressBar currentStep={3} />

      <div className="flex-1 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-6">
            {/* LEFT: Package Selection */}
            <div className="space-y-6">
              {/* Volume Summary Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Your Move Volume</h2>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                  <span className="text-4xl">{volumeDesc.icon}</span>
                  <div className="flex-1">
                    <p className={`text-2xl font-bold ${volumeDesc.color}`}>{totalVolume.toFixed(1)} m³</p>
                    <p className="text-sm text-slate-600">{volumeDesc.text}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500">Total Items</p>
                    <p className="text-xl font-bold text-slate-900">
                      {quoteData.selectedItems?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Package Cards */}
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Choose Your Package</h1>
                <p className="text-slate-600 mb-6">Select the service level that best suits your needs</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* STANDARD PACKAGE */}
                  <button
                    type="button"
                    onClick={() => handleSelectPackage('standard')}
                    className={`relative text-left p-6 rounded-2xl border-2 transition-all ${
                      selectedPackageId === 'standard'
                        ? 'border-blue-500 bg-blue-50 shadow-lg scale-[1.02]'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                    }`}
                  >
                    {selectedPackageId === 'standard' && (
                      <div className="absolute -top-3 -right-3 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
                        <Check className="w-5 h-5" />
                      </div>
                    )}

                    <div className="flex items-center gap-3 mb-4">
                      <Package className="w-8 h-8 text-blue-600" />
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">Standard</h3>
                        <p className="text-sm text-slate-600">Essential moving service</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <p className="text-4xl font-bold text-slate-900">£{pricing.standardPrice}</p>
                      <p className="text-xs text-slate-500 mt-1">Base price for {totalVolume.toFixed(1)}m³</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-slate-700">Professional movers</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-slate-700">Basic insurance (£50k)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-slate-700">Loading & unloading</span>
                      </div>
                    </div>
                  </button>

                  {/* PREMIUM PACKAGE */}
                  <button
                    type="button"
                    onClick={() => handleSelectPackage('premium')}
                    className={`relative text-left p-6 rounded-2xl border-2 transition-all ${
                      selectedPackageId === 'premium'
                        ? 'border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50 shadow-lg scale-[1.02]'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                    }`}
                  >
                    {selectedPackageId === 'premium' && (
                      <div className="absolute -top-3 -right-3 bg-amber-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
                        <Check className="w-5 h-5" />
                      </div>
                    )}

                    <div className="absolute top-4 right-4">
                      <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        RECOMMENDED
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      <Sparkles className="w-8 h-8 text-amber-600" />
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">Premium</h3>
                        <p className="text-sm text-slate-600">Full-service moving</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <p className="text-4xl font-bold text-slate-900">£{pricing.premiumPrice}</p>
                      <p className="text-xs text-slate-500 mt-1">All-inclusive service</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-amber-600" />
                        <span className="text-sm font-semibold text-slate-900">Everything in Standard, plus:</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-amber-600" />
                        <span className="text-sm text-slate-700">Packing service included</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-amber-600" />
                        <span className="text-sm text-slate-700">Furniture disassembly/reassembly</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-amber-600" />
                        <span className="text-sm text-slate-700">Premium insurance</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-amber-600" />
                        <span className="text-sm text-slate-700">Priority scheduling</span>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-3 text-slate-600 hover:text-slate-900 font-semibold underline transition-colors flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!selectedPackageId}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-4 px-8 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center gap-3 shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continue to Extras
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* RIGHT: Move Summary */}
            <div className="lg:sticky lg:top-4 lg:self-start">
              <QuoteSummaryPanel
                quote={pricing ? {
                  breakdown: {
                    total: selectedPackageId === 'premium' ? pricing.premiumPrice : pricing.standardPrice,
                    base: 0,
                    distance: 0,
                    crew: 0,
                    inventory: 0,
                    access: 0,
                    extrasPrice: 0,
                    date: 0,
                    deposit: 0,
                  },
                  distance: quoteData.distance || 0,
                  estimatedDuration: quoteData.duration || '0 mins',
                  estimatedVolume: totalVolume,
                  recommendedVehicle: totalVolume < 5 ? 'Small Van' : totalVolume < 12 ? 'Medium Van' : 'Large Van',
                } : null}
                isLoading={!pricing}
                serviceType={quoteData.serviceCategory || 'furniture_items'}
                pickupAddress={quoteData.pickupAddress}
                deliveryAddress={quoteData.deliveryAddress}
                pickupCoords={quoteData.pickupLat && quoteData.pickupLng ? { lat: quoteData.pickupLat, lng: quoteData.pickupLng } : undefined}
                deliveryCoords={quoteData.deliveryLat && quoteData.deliveryLng ? { lat: quoteData.deliveryLat, lng: quoteData.deliveryLng } : undefined}
                currentStep={3}
                selectedItems={quoteData.selectedItems || []}
                extras={[]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
