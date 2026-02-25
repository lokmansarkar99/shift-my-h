/**
 * House Move - Step 3: Package Selection (Standard vs Premium)
 * UNIQUE DESIGN - ShiftMyHome Custom Style
 * Based on reference images but with unique ShiftMyHome branding
 */

import React, { useState, useMemo } from 'react';
import { HouseMoveQuote } from './houseMoveTypes';
import { ArrowRight, ArrowLeft, Check, Shield, Package, Truck, Clock, Star, Zap } from 'lucide-react';
import { HouseMoveMapPanel } from './HouseMoveMapPanel';
import { MoveSummaryCard } from '../../MoveSummaryCard';
import { calculatePrice } from '../../../../utils/pricingEngine';

interface StepProps {
  data: HouseMoveQuote;
  onChange: (updates: Partial<HouseMoveQuote>) => void;
  onNext: () => void;
  onBack: () => void;
}

type PackageType = 'standard' | 'premium';

export function Step3Pricing({ data, onChange, onNext, onBack }: StepProps) {
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(null);

  // Calculate base price from inventory
  const pricingResult = useMemo(() => {
    if (!data.items || data.items.length === 0) {
      return null;
    }

    const inventoryForPricing = data.items.map(item => ({
      id: item.id,
      quantity: item.quantity,
    }));

    return calculatePrice({
      serviceType: 'house-move',
      inventory: inventoryForPricing,
      distance: data.distance || 0,
      pickupFloor: data.pickup?.floor || 0,
      deliveryFloor: data.dropoff?.floor || 0,
      hasLift: data.pickup?.hasLift || data.dropoff?.hasLift || false,
    });
  }, [data.items, data.distance, data.pickup, data.dropoff]);

  const basePrice = pricingResult?.totalPrice || 0;

  // Package definitions
  const packages = {
    standard: {
      id: 'standard',
      name: 'Standard',
      subtitle: 'Essential moving service',
      price: basePrice,
      icon: <Package className="w-8 h-8" />,
      color: 'blue',
      gradient: 'from-blue-500 to-cyan-500',
      features: [
        { text: 'Professional loading & transport team', included: true },
        { text: 'Flexible payment - pay on completion', included: true },
        { text: 'Basic insurance coverage included', included: true },
        { text: 'Free cancellation up to 48 hours', included: true },
        { text: '30 minutes waiting time included', included: true },
        { text: 'Basic furniture placement service', included: true },
        { text: 'Complete packing & wrapping assistance', included: false },
        { text: 'All protective materials included', included: false },
        { text: 'Furniture disassembly & reassembly', included: false },
        { text: 'Personal move coordinator assigned', included: false },
      ],
    },
    premium: {
      id: 'premium',
      name: 'Premium',
      subtitle: 'Complete peace of mind',
      price: basePrice * 1.45, // 45% premium
      icon: <Star className="w-8 h-8" />,
      color: 'emerald',
      gradient: 'from-emerald-500 to-teal-500',
      badge: 'MOST POPULAR',
      features: [
        { text: 'Expert packing, loading & transport crew', included: true },
        { text: 'Complete packing & wrapping assistance', included: true },
        { text: 'All protective materials included', included: true },
        { text: 'Reserve now, settle on completion', included: true },
        { text: 'Furniture disassembly & reassembly service', included: true },
        { text: 'Personal move coordinator assigned', included: true },
        { text: 'Enhanced ShiftMyHome Protection (£50k)', included: true },
        { text: 'Free cancellation up to 48 hours', included: true },
        { text: 'Extended waiting time (up to 2 hours)', included: true },
        { text: 'Complimentary furniture arrangement service', included: true },
      ],
    },
  };

  const handleContinue = () => {
    if (!selectedPackage) return;

    const selectedPkg = packages[selectedPackage];
    
    onChange({
      pricing: {
        basePrice: selectedPkg.price,
        extras: [],
        totalPrice: selectedPkg.price,
        packageType: selectedPackage,
      },
    });
    onNext();
  };

  if (!pricingResult) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Unable to calculate pricing. Please go back and add items.</p>
        <button
          onClick={onBack}
          className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
        >
          Go Back
        </button>
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
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Choose Your Package
                </h1>
              </div>
            </div>
            <p className="text-slate-600 text-sm">
              Select the package that best suits your needs. All packages include professional service and insurance.
            </p>
          </div>

          {/* Package Cards Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* STANDARD PACKAGE */}
            <div
              onClick={() => setSelectedPackage('standard')}
              className={`bg-white rounded-2xl shadow-lg border-2 transition-all cursor-pointer ${
                selectedPackage === 'standard'
                  ? 'border-blue-500 ring-4 ring-blue-100'
                  : 'border-slate-200 hover:border-blue-300 hover:shadow-xl'
              }`}
            >
              {/* Package Header */}
              <div className={`bg-gradient-to-r ${packages.standard.gradient} p-6 rounded-t-2xl text-white`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {packages.standard.icon}
                    <div>
                      <h3 className="text-2xl font-bold">{packages.standard.name}</h3>
                      <p className="text-blue-100 text-sm">{packages.standard.subtitle}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-4xl font-bold">£{packages.standard.price.toFixed(2)}</div>
                  <p className="text-blue-100 text-sm mt-1">Total move cost</p>
                </div>
              </div>

              {/* Features List */}
              <div className="p-6">
                <div className="space-y-3">
                  {packages.standard.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      {feature.included ? (
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-green-600" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-0.5 bg-slate-400"></div>
                        </div>
                      )}
                      <span className={`text-sm ${feature.included ? 'text-slate-900' : 'text-slate-400'}`}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Select Button */}
                <button
                  onClick={() => setSelectedPackage('standard')}
                  className={`w-full mt-6 py-3 px-4 rounded-xl font-bold transition-all ${
                    selectedPackage === 'standard'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                >
                  {selectedPackage === 'standard' ? (
                    <span className="flex items-center justify-center gap-2">
                      <Check className="w-5 h-5" />
                      Selected
                    </span>
                  ) : (
                    'Select Standard'
                  )}
                </button>
              </div>
            </div>

            {/* PREMIUM PACKAGE */}
            <div
              onClick={() => setSelectedPackage('premium')}
              className={`bg-white rounded-2xl shadow-lg border-2 transition-all cursor-pointer relative ${
                selectedPackage === 'premium'
                  ? 'border-emerald-500 ring-4 ring-emerald-100'
                  : 'border-slate-200 hover:border-emerald-300 hover:shadow-xl'
              }`}
            >
              {/* Most Popular Badge */}
              {packages.premium.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                    {packages.premium.badge}
                  </div>
                </div>
              )}

              {/* Package Header */}
              <div className={`bg-gradient-to-r ${packages.premium.gradient} p-6 rounded-t-2xl text-white`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {packages.premium.icon}
                    <div>
                      <h3 className="text-2xl font-bold">{packages.premium.name}</h3>
                      <p className="text-emerald-100 text-sm">{packages.premium.subtitle}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-4xl font-bold">£{packages.premium.price.toFixed(2)}</div>
                  <p className="text-emerald-100 text-sm mt-1">Total move cost</p>
                </div>
              </div>

              {/* Features List */}
              <div className="p-6">
                <div className="space-y-3">
                  {packages.premium.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-emerald-600" />
                      </div>
                      <span className="text-sm text-slate-900 font-medium">
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Select Button */}
                <button
                  onClick={() => setSelectedPackage('premium')}
                  className={`w-full mt-6 py-3 px-4 rounded-xl font-bold transition-all ${
                    selectedPackage === 'premium'
                      ? 'bg-emerald-600 text-white shadow-lg'
                      : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
                  }`}
                >
                  {selectedPackage === 'premium' ? (
                    <span className="flex items-center justify-center gap-2">
                      <Check className="w-5 h-5" />
                      Selected
                    </span>
                  ) : (
                    'Select Premium'
                  )}
                </button>
              </div>
            </div>
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
                className="flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Contact Details
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - MAP + SUMMARY (40%) */}
        <div className="space-y-6 lg:sticky lg:top-4 lg:self-start order-first lg:order-last">
          {/* Payment Protection Card - FIRST POSITION! */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl shadow-md border-2 border-emerald-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-black text-emerald-900">Zero Upfront Payment</h3>
                <p className="text-xs text-emerald-700">Book now, pay later</p>
              </div>
            </div>
            <p className="text-sm text-emerald-900 mb-4 leading-relaxed">
              <span className="font-bold">Reserve your move today at no cost.</span> Your card details secure the booking, but we only process payment <span className="font-black">3 days before your scheduled date.</span>
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-xs text-emerald-800">
                <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-600" />
                <span className="font-semibold">Cancel free of charge anytime before 48 hours</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-emerald-800">
                <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-600" />
                <span className="font-semibold">Card details verified instantly</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-emerald-800">
                <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-600" />
                <span className="font-semibold">Fully protected by ShiftMyHome guarantee</span>
              </div>
            </div>
          </div>

          {/* Quote Reference - AFTER PAYMENT */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl shadow-sm border border-blue-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 font-medium mb-1">Quote ref:</p>
                <p className="text-xl font-bold text-slate-900">
                  {data.quoteReference || 'SMH-' + Date.now().toString().slice(-6)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Map */}
          <HouseMoveMapPanel data={data} />

          {/* Summary Card */}
          <MoveSummaryCard
            quoteRef={data.quoteReference || 'SMH-' + Date.now().toString().slice(-6)}
            pickupAddress={data.pickup?.address || ''}
            deliveryAddress={data.dropoff?.address || ''}
            pickupPropertyType={data.pickup?.propertyType || ''}
            deliveryPropertyType={data.dropoff?.propertyType || ''}
            pickupFloor={data.pickup?.floor ? (data.pickup.floor === 0 ? 'Ground floor' : `${data.pickup.floor}`) : 'Ground floor'}
            deliveryFloor={data.dropoff?.floor ? (data.dropoff.floor === 0 ? 'Ground floor' : `${data.dropoff.floor}`) : 'Ground floor'}
            liftAvailableAtPickup={data.pickup?.hasLift || false}
            liftAvailableAtDelivery={data.dropoff?.hasLift || false}
            distance={data.distance}
            duration={undefined}
            moveDate={data.date ? new Date(data.date).toISOString().split('T')[0] : undefined}
            hasDateSelected={!!data.date}
            arrivalTimeFrom={480}
            arrivalTimeTo={600}
            selectedItems={data.items?.map(item => ({
              id: item.id,
              name: item.name,
              quantity: item.quantity,
            })) || []}
          />
        </div>
      </div>
    </div>
  );
}