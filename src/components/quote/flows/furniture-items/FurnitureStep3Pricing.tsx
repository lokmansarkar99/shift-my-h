/**
 * Furniture & Items - Step 3: Package Selection
 * UNIQUE FOR FURNITURE - No property types, item-based pricing
 */

import React, { useState, useMemo } from 'react';
import { FurnitureQuote } from './furnitureTypes';
import { ArrowRight, ArrowLeft, Check, Shield, Package, Star, Zap, Truck, ShieldCheck, UserCheck, MapPin, Info } from 'lucide-react';
import { FurnitureMapPanel } from './FurnitureMapPanel';
import { MoveSummaryCard } from '../../MoveSummaryCard';

interface StepProps {
  data: FurnitureQuote;
  onChange: (updates: Partial<FurnitureQuote>) => void;
  onNext: () => void;
  onBack: () => void;
}

type PackageType = 'standard' | 'premium';

export function FurnitureStep3Pricing({ data, onChange, onNext, onBack }: StepProps) {
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(null);

  // Calculate base price from items
  const pricingResult = useMemo(() => {
    if (!data.items || data.items.length === 0) {
      return null;
    }

    const itemCount = data.items.reduce((sum, item) => sum + item.quantity, 0);
    const itemsPrice = itemCount * 15; // £15 per item base
    const distancePrice = (data.distance || 0) * 1.5; // £1.50 per mile
    const floorPrice = ((data.pickup?.floor || 0) + (data.dropoff?.floor || 0)) * 10; // £10 per floor
    const liftDiscount = (data.pickup?.hasLift || data.dropoff?.hasLift) ? -20 : 0;
    
    const totalPrice = Math.max(120, itemsPrice + distancePrice + floorPrice + liftDiscount); // Min £120

    return {
      totalPrice,
      itemsPrice,
      distancePrice,
      floorPrice,
      liftDiscount,
      itemCount,
    };
  }, [data.items, data.distance, data.pickup, data.dropoff]);

  const basePrice = pricingResult?.totalPrice || 120;

  // Package definitions
  const packages = {
    standard: {
      id: 'standard',
      name: 'Standard',
      subtitle: 'Essential delivery service',
      price: basePrice,
      icon: <Package className="w-8 h-8" />,
      color: 'purple',
      gradient: 'from-purple-500 to-pink-500',
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
      color: 'emerald',
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
    onChange({
      package: selectedPackage,
      estimatedPrice: pkg.price,
    });
    
    onNext();
  };

  if (!pricingResult) {
    return (
      <div className="min-h-[600px] flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-lg border border-amber-200 p-10 max-w-md text-center">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-amber-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">No Items Selected</h2>
          <p className="text-slate-500 mb-8 font-medium">
            We need to know what you're moving to calculate an accurate quote.
          </p>
          <button
            onClick={onBack}
            className="w-full px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200"
          >
            Return to Inventory
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-6 lg:gap-8">
        {/* LEFT COLUMN */}
        <div className="space-y-6 order-last lg:order-first">
          {/* Header */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 lg:p-10">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Truck className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
                  Service Selection
                </h1>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Choose the care level for your furniture delivery
                </p>
              </div>
            </div>
          </div>

          {/* New Professional Price Banner */}
          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden border-4 border-slate-800">
             <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
             
             <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left">
                   <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full mb-3">
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-purple-200">Guaranteed Quote</span>
                   </div>
                   <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-light text-slate-500">£</span>
                      <span className="text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">
                        {basePrice.toFixed(2)}
                      </span>
                   </div>
                   <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mt-2 italic">Standard inclusive rate</p>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                   <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-center group hover:bg-white/10 transition-all">
                      <UserCheck className="w-5 h-5 text-purple-400 mx-auto mb-2" />
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Expert Crew</p>
                      <p className="text-[10px] font-bold text-white mt-1">INCLUDED</p>
                   </div>
                   <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-center group hover:bg-white/10 transition-all">
                      <ShieldCheck className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Full Insurance</p>
                      <p className="text-[10px] font-bold text-white mt-1">INCLUDED</p>
                   </div>
                   <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-center group hover:bg-white/10 transition-all">
                      <Truck className="w-5 h-5 text-blue-400 mx-auto mb-2" />
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Live GPS</p>
                      <p className="text-[10px] font-bold text-white mt-1">INCLUDED</p>
                   </div>
                   <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-center group hover:bg-white/10 transition-all">
                      <MapPin className="w-5 h-5 text-orange-400 mx-auto mb-2" />
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Site Access</p>
                      <p className="text-[10px] font-bold text-white mt-1">INCLUDED</p>
                   </div>
                </div>
             </div>
          </div>

          {/* Package Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.values(packages).map((pkg) => (
              <div
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg.id as PackageType)}
                className={`relative bg-white rounded-[2.5rem] border-4 cursor-pointer transition-all active:scale-[0.98] ${
                  selectedPackage === pkg.id
                    ? pkg.id === 'standard' 
                      ? 'border-purple-600 shadow-2xl shadow-purple-100 ring-8 ring-purple-50'
                      : 'border-emerald-600 shadow-2xl shadow-emerald-100 ring-8 ring-emerald-50'
                    : 'border-slate-100 hover:border-slate-200 hover:shadow-xl'
                }`}
              >
                {pkg.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                      {pkg.badge}
                    </div>
                  </div>
                )}

                <div className="p-10">
                  <div className="text-center mb-8">
                    <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br ${pkg.gradient} rounded-3xl flex items-center justify-center text-white shadow-2xl`}>
                      {pkg.icon}
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">{pkg.name}</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{pkg.subtitle}</p>
                  </div>

                  <div className="text-center mb-10 pb-10 border-b border-slate-50">
                    <div className="text-5xl font-black text-slate-900 tracking-tighter">
                      £{pkg.price.toFixed(2)}
                    </div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Guaranteed Total</div>
                  </div>

                  <div className="space-y-4">
                    {pkg.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-4">
                        {feature.included ? (
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            pkg.id === 'standard' ? 'bg-purple-100 text-purple-600' : 'bg-emerald-100 text-emerald-600'
                          }`}>
                             <Check className="w-3 h-3 stroke-[4]" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-slate-100 flex-shrink-0 mt-0.5" />
                        )}
                        <span className={`text-xs font-bold leading-tight ${feature.included ? 'text-slate-800' : 'text-slate-300'}`}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={onBack}
                className="flex items-center justify-center gap-3 px-8 py-5 text-slate-400 font-black text-xs uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-all active:scale-95"
              >
                <ArrowLeft className="w-5 h-5" />
                Previous Step
              </button>
              <button
                onClick={handleContinue}
                disabled={!selectedPackage}
                className="flex-1 flex items-center justify-center gap-3 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] bg-slate-900 text-white hover:bg-black shadow-2xl shadow-slate-200 transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Continue to Contact
                <ArrowRight className="w-5 h-5" />
              </button>
          </div>
        </div>

        {/* RIGHT COLUMN - SIDEBAR (40%) - IDENTICAL TO STEP 1 */}
        <div className="space-y-6 lg:sticky lg:top-4 lg:self-start order-first lg:order-last">
          {/* Quote Reference */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl shadow-sm border border-purple-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 font-medium mb-1">Quote ref:</p>
                <p className="text-xl font-bold text-slate-900">
                  {data.quoteReference || 'Generating...'}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <FurnitureMapPanel data={data} />

          <MoveSummaryCard
            quoteRef={data.quoteReference}
            pickupAddress={data.pickup?.address}
            deliveryAddress={data.dropoff?.address}
            pickupFloor={data.pickup?.floor !== undefined ? (data.pickup.floor === 0 ? 'Ground floor' : `${data.pickup.floor}`) : 'Ground floor'}
            deliveryFloor={data.dropoff?.floor !== undefined ? (data.dropoff.floor === 0 ? 'Ground floor' : `${data.dropoff.floor}`) : 'Ground floor'}
            liftAvailableAtPickup={data.pickup?.hasLift}
            liftAvailableAtDelivery={data.dropoff?.hasLift}
            distance={data.distance}
            selectedItems={data.items}
            moveDate={data.date ? (data.date instanceof Date ? data.date.toISOString() : String(data.date)) : undefined}
          />
        </div>
      </div>
    </div>
  );
}
