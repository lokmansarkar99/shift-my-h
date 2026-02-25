/**
 * Furniture & Items - Step 3: Package Selection (Standard vs Premium)
 * Based on HouseMoveStep3Pricing but adapted for item-based pricing
 */

import React, { useState, useMemo } from 'react';
import { FurnitureQuote } from './furnitureTypes';
import { ArrowRight, ArrowLeft, Check, Shield, Package, Truck, Star, Users } from 'lucide-react';
import { FurnitureMapPanel } from './FurnitureMapPanel';
import { MoveSummaryCard } from '../../MoveSummaryCard';

interface StepProps {
  data: FurnitureQuote;
  onChange: (updates: Partial<FurnitureQuote>) => void;
  onNext: () => void;
  onBack: () => void;
}

type PackageType = 'standard' | 'premium';

export function FurnitureStep3PricingNew({ data, onChange, onNext, onBack }: StepProps) {
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(null);

  console.log('🟣 FurnitureStep3PricingNew - Received data:', data);
  console.log('🟣 FurnitureStep3PricingNew - Items:', data.items);

  // Calculate base price from items
  const pricingResult = useMemo(() => {
    if (!data.items || data.items.length === 0) {
      console.log('⚠️ No items found in data');
      return null;
    }

    console.log('✅ Calculating price for items:', data.items);

    const itemCount = data.items.reduce((sum, item) => sum + item.quantity, 0);
    
    // Crew Multiplier
    const crewSize = data.crewSize || 1;
    const crewMult = crewSize === 2 ? 1.6 : (crewSize === 3 ? 2.2 : 1.0);
    
    const itemsPrice = (itemCount * 15) * crewMult; // £15 per item base * crew multiplier
    const distancePrice = (data.distance || 0) * 1.5; // £1.50 per mile
    const floorPrice = ((data.pickup?.floor || 0) + (data.dropoff?.floor || 0)) * 10 * crewSize; // £10 per floor per man
    const liftDiscount = (data.pickup?.hasLift || data.dropoff?.hasLift) ? -20 : 0;
    
    const totalPrice = Math.max(120, itemsPrice + distancePrice + floorPrice + liftDiscount); // Min £120

    const result = {
      totalPrice,
      itemsPrice,
      distancePrice,
      floorPrice,
      liftDiscount,
      itemCount,
      crewSize,
    };

    console.log('✅ Pricing result:', result);

    return result;
  }, [data.items, data.distance, data.pickup, data.dropoff, data.crewSize]);

  const basePrice = pricingResult?.totalPrice || 120;

  // Package definitions
  const packages = {
    standard: {
      id: 'standard',
      name: 'Standard',
      subtitle: 'Essential delivery service',
      price: basePrice,
      icon: <Package className="w-8 h-8" />,
      gradient: 'from-blue-500 to-cyan-500',
      features: [
        { text: 'Professional loading & transport', included: true },
        { text: 'Flexible payment - pay on completion', included: true },
        { text: 'Basic transit insurance included', included: true },
        { text: 'Free cancellation up to 48 hours', included: true },
        { text: '30 minutes waiting time included', included: true },
        { text: 'Basic item placement', included: true },
        { text: 'Complete wrapping & protection', included: false },
        { text: 'Furniture disassembly & reassembly', included: false },
        { text: 'Personal coordinator assigned', included: false },
        { text: 'Premium white-glove handling', included: false },
      ],
    },
    premium: {
      id: 'premium',
      name: 'Premium',
      subtitle: 'Complete peace of mind',
      price: basePrice * 1.45, // 45% premium
      icon: <Star className="w-8 h-8" />,
      gradient: 'from-emerald-500 to-teal-500',
      badge: 'MOST POPULAR',
      features: [
        { text: 'Professional loading & transport', included: true },
        { text: 'Flexible payment - pay on completion', included: true },
        { text: 'Basic transit insurance included', included: true },
        { text: 'Free cancellation up to 48 hours', included: true },
        { text: '30 minutes waiting time included', included: true },
        { text: 'Basic item placement', included: true },
        { text: 'Complete wrapping & protection', included: true },
        { text: 'Furniture disassembly & reassembly', included: true },
        { text: 'Personal coordinator assigned', included: true },
        { text: 'Premium white-glove handling', included: true },
      ],
    },
  };

  const handleContinue = () => {
    if (!selectedPackage) return;
    
    const pkg = packages[selectedPackage];
    
    console.log('🟣 Saving package selection:', selectedPackage, pkg.price);
    
    onChange({
      package: selectedPackage,
      estimatedPrice: pkg.price,
    });
    
    onNext();
  };

  // If no items, show error
  if (!pricingResult) {
    return (
      <div className="min-h-[600px] flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-amber-600" />
          </div>
          <h2 className="text-xl font-bold text-amber-600 mb-2">No Items Found</h2>
          <p className="text-slate-600 mb-6">
            Unable to calculate pricing. Please go back and add items.
          </p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700"
          >
            Back to Step 2
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 2 Column Layout - 60/40 split */}
      <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-6 lg:gap-8">
        {/* LEFT COLUMN - Package Selection (60%) */}
        <div className="space-y-6 order-last lg:order-first">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Choose Your Package
                </h1>
              </div>
            </div>
            <p className="text-slate-600 text-sm">
              Select the service level that best fits your needs
            </p>
          </div>

          {/* Package Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.values(packages).map((pkg) => (
              <div
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg.id as PackageType)}
                className={`relative bg-white rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedPackage === pkg.id
                    ? pkg.id === 'standard' 
                      ? 'border-blue-500 shadow-lg scale-105'
                      : 'border-emerald-500 shadow-lg scale-105'
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                {pkg.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                      {pkg.badge}
                    </div>
                  </div>
                )}

                <div className="p-6">
                  {/* Package Header */}
                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 mx-auto mb-3 bg-gradient-to-br ${pkg.gradient} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                      {pkg.icon}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">{pkg.name}</h3>
                    <p className="text-sm text-slate-600">{pkg.subtitle}</p>
                  </div>

                  {/* Price */}
                  <div className="text-center mb-6 pb-6 border-b border-slate-200">
                    <div className="text-4xl font-bold text-slate-900">
                      £{pkg.price.toFixed(2)}
                    </div>
                    <div className="text-sm text-slate-600 mt-1">All inclusive</div>
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    {pkg.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        {feature.included ? (
                          <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                            pkg.id === 'standard' ? 'text-blue-600' : 'text-emerald-600'
                          }`} />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex-shrink-0 mt-0.5" />
                        )}
                        <span className={`text-sm ${feature.included ? 'text-slate-900' : 'text-slate-400'}`}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selected Indicator */}
                {selectedPackage === pkg.id && (
                  <div className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center ${
                    pkg.id === 'standard' ? 'bg-blue-600' : 'bg-emerald-600'
                  }`}>
                    <Check className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onBack}
                className="flex items-center justify-center gap-2 px-6 py-3 text-slate-700 font-semibold hover:bg-slate-100 rounded-xl transition-colors border-2 border-slate-300"
              >
                <ArrowLeft className="w-5 h-5" />
                Previous Step
              </button>
              <button
                onClick={handleContinue}
                disabled={!selectedPackage}
                className="flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Date & Time
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Summary (40%) */}
        <div className="space-y-6 lg:sticky lg:top-4 lg:self-start order-first lg:order-last">
          {/* Quote Reference */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl shadow-sm border border-purple-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 font-medium mb-1">Quote ref:</p>
                <p className="text-xl font-bold text-slate-900">
                  {data.quoteReference || 'SMH-' + Date.now().toString().slice(-6)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Map */}
          <FurnitureMapPanel data={data} />

          {/* Summary Card */}
          <MoveSummaryCard
            quoteRef={data.quoteReference || 'SMH-' + Date.now().toString().slice(-6)}
            pickupAddress={data.pickup?.address || ''}
            deliveryAddress={data.dropoff?.address || ''}
            pickupPropertyType="" 
            deliveryPropertyType=""
            pickupFloor={data.pickup?.floor ? (data.pickup.floor === 0 ? 'Ground floor' : `${data.pickup.floor}`) : 'Ground floor'}
            deliveryFloor={data.dropoff?.floor ? (data.dropoff.floor === 0 ? 'Ground floor' : `${data.dropoff.floor}`) : 'Ground floor'}
            liftAvailableAtPickup={data.pickup?.hasLift || false}
            liftAvailableAtDelivery={data.dropoff?.hasLift || false}
            distance={data.distance}
            duration={data.duration}
            selectedItems={data.items}
          />

          {/* Crew & Items Summary */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Service Details
            </h3>
            
            <div className="space-y-4">
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                <p className="text-[10px] font-black uppercase text-purple-600 tracking-widest mb-1">Selected Crew</p>
                <p className="text-sm font-bold text-slate-900">
                  {data.crewSize || 1} {data.crewSize === 1 ? 'Man' : 'Men'} Service
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Your Items ({data.items?.length || 0})</p>
                {data.items && data.items.length > 0 ? (
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                    {data.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg text-xs">
                        <span className="font-medium text-slate-900">{item.name}</span>
                        <span className="font-bold text-slate-600">x{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 text-center py-2">No items selected</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
