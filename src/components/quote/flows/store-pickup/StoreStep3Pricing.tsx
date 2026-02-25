/**
 * Store/Pickup - Step 3: Pricing
 * Display calculated price based on inventory and courier pricing rules
 */

import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Package, Calculator, Clock, TrendingUp, ShieldCheck, Zap, Truck, MapPin, UserCheck, Shield } from 'lucide-react';
import { StoreQuote } from './storeTypes';
import { MapView } from '../../MapView';
import { MoveSummaryCard } from '../../MoveSummaryCard';
import { getPricingConfig } from '../../../../utils/pricingConfigService';
import { StoreItemListSummary } from './StoreItemListSummary';

interface StepProps {
  data: StoreQuote;
  onChange: (updates: Partial<StoreQuote>) => void;
  onNext: () => void;
  onBack: () => void;
}

const FLOOR_OPTIONS = ['Basement', 'Ground floor', '1st', '2nd', '3rd', '4th', '5th+'];

export function StoreStep3Pricing({ data, onChange, onNext, onBack }: StepProps) {
  const [isCalculating, setIsCalculating] = useState(true);
  const [priceBreakdown, setPriceBreakdown] = useState<{
    basePrice: number;
    volumeCharge: number;
    floorCharges: number;
    distanceCharge: number;
    urgencyCharge: number;
    finalPrice: number;
  }>({
    basePrice: 0,
    volumeCharge: 0,
    floorCharges: 0,
    distanceCharge: 0,
    urgencyCharge: 0,
    finalPrice: 0,
  });

  // Get data for sidebar
  const pickupFloor = FLOOR_OPTIONS[data.pickup.floor] || 'Ground floor';
  const deliveryFloor = FLOOR_OPTIONS[data.dropoff.floor] || 'Ground floor';
  const moveDate = data.date && !data.dateUnsure
    ? (data.date instanceof Date ? data.date.toISOString().split('T')[0] : typeof data.date === 'string' ? data.date : '')
    : undefined;

  const items = data.items || [];
  const totalVolume = data.totalVolume || 0;

  // Calculate pricing using Courier Rules (consistent with Step 5)
  useEffect(() => {
    const calculatePrice = async () => {
      setIsCalculating(true);

      try {
        const config = await getPricingConfig();
        const distance = data.distance || 0;
        
        // 1. Base Pickup Fee
        const basePrice = config.pickupServiceCharges.basePickupFee || 35;
        
        // 2. Item Handling Fee (Per item count)
        const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
        const volumeCharge = itemCount * (config.pickupServiceCharges.perItemHandling || 5);
        
        // 3. Floor charges (stairs)
        let floorCharges = 0;
        if (data.pickup.floor > 1) {
          const rate = data.pickup.hasLift ? config.accessCharges.stairsWithLiftPerFloor : config.accessCharges.stairsWithoutLiftPerFloor;
          floorCharges += rate * (data.pickup.floor - 1);
        }
        if (data.dropoff.floor > 1) {
          const rate = data.dropoff.hasLift ? config.accessCharges.stairsWithLiftPerFloor : config.accessCharges.stairsWithoutLiftPerFloor;
          floorCharges += rate * (data.dropoff.floor - 1);
        }
        
        // 4. Distance charge
        const distanceCharge = distance * (config.otherDeliveryCharges.perMileRate || 1.5);
        
        // 5. Urgency (Placeholder for now, can be expanded)
        const urgencyCharge = 0;

        // Final Total
        const finalPrice = basePrice + volumeCharge + floorCharges + distanceCharge + urgencyCharge;

        setPriceBreakdown({
          basePrice,
          volumeCharge,
          floorCharges,
          distanceCharge,
          urgencyCharge,
          finalPrice,
        });

        // Update quote data
        onChange({
          estimatedPrice: finalPrice,
        });
      } catch (error) {
        console.error('Error calculating price:', error);
      } finally {
        setIsCalculating(false);
      }
    };

    calculatePrice();
  }, [items, data.distance, data.pickup.floor, data.dropoff.floor, data.pickup.hasLift, data.dropoff.hasLift]);

  const handleNext = () => {
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* 2 Column Layout - 60/40 split */}
      <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-6 lg:gap-8">
        {/* LEFT COLUMN - PRICING (60%) */}
        <div className="space-y-6 order-last lg:order-first">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:p-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
                  Your Pickup Quote
                </h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Guaranteed pricing for your store collection
                </p>
              </div>
            </div>

            {/* Price Card */}
            <div className="bg-slate-900 rounded-3xl p-8 lg:p-10 mb-8 text-white relative overflow-hidden shadow-2xl border-4 border-slate-800">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-600/10 rounded-full -ml-24 -mb-24 blur-3xl"></div>
              
              {isCalculating ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-blue-200 text-sm font-bold uppercase tracking-widest">Optimizing logistics...</p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full mb-4 border border-white/5">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                      <p className="text-blue-200 font-black uppercase tracking-[0.2em] text-[10px]">Guaranteed Price</p>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-4xl font-light text-blue-400/50 -mt-4">£</span>
                      <span className="text-7xl font-black tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">
                        {priceBreakdown.finalPrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-2 mt-6">
                       <div className="h-px w-8 bg-slate-700"></div>
                       <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Fully Inclusive of all fees</p>
                       <div className="h-px w-8 bg-slate-700"></div>
                    </div>
                  </div>

                  {/* PROFESSIONAL SERVICE BREAKDOWN (REPLACING THE OLD FEE BREAKDOWN) */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-slate-800">
                    <div className="flex flex-col items-center text-center group">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center mb-3 border border-slate-700 transition-all group-hover:bg-blue-600 group-hover:border-blue-500">
                        <UserCheck className="w-5 h-5 text-slate-400 group-hover:text-white" />
                      </div>
                      <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Professional Crew</p>
                      <p className="text-[10px] font-bold text-blue-400">INCLUDED</p>
                    </div>
                    <div className="flex flex-col items-center text-center group">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center mb-3 border border-slate-700 transition-all group-hover:bg-blue-600 group-hover:border-blue-500">
                        <Shield className="w-5 h-5 text-slate-400 group-hover:text-white" />
                      </div>
                      <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Retail Protection</p>
                      <p className="text-[10px] font-bold text-blue-400">INCLUDED</p>
                    </div>
                    <div className="flex flex-col items-center text-center group">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center mb-3 border border-slate-700 transition-all group-hover:bg-blue-600 group-hover:border-blue-500">
                        <Truck className="w-5 h-5 text-slate-400 group-hover:text-white" />
                      </div>
                      <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Logistics & Fuel</p>
                      <p className="text-[10px] font-bold text-blue-400">INCLUDED</p>
                    </div>
                    <div className="flex flex-col items-center text-center group">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center mb-3 border border-slate-700 transition-all group-hover:bg-blue-600 group-hover:border-blue-500">
                        <MapPin className="w-5 h-5 text-slate-400 group-hover:text-white" />
                      </div>
                      <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Site Handling</p>
                      <p className="text-[10px] font-bold text-blue-400">INCLUDED</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Features / Why Choose Us */}
            <div className="grid md:grid-cols-2 gap-6 mb-10">
              <div className="flex items-start gap-4 p-5 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                  <Zap className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-black text-slate-900 text-sm uppercase tracking-tight">Store Specialists</p>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1">Expert team trained for IKEA, B&Q and high-value retail collections.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                  <Clock className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-black text-slate-900 text-sm uppercase tracking-tight">Real-time Tracking</p>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1">Live ETA links and SMS alerts sent directly to your mobile on delivery.</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-4 pt-8 border-t border-slate-100">
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-500 bg-slate-50 hover:bg-slate-100 transition-all border border-slate-200 active:scale-95"
              >
                <ArrowLeft className="w-5 h-5" />
                Review Items
              </button>
              <button
                onClick={handleNext}
                disabled={isCalculating}
                className={`flex-1 max-w-sm flex items-center justify-center gap-3 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 ${
                  isCalculating
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-slate-900 text-white hover:bg-black shadow-slate-200'
                }`}
              >
                Accept & Confirm Quote
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - SIDEBAR (40%) */}
        <div className="space-y-6">
          {/* Quote Reference */}
          {data.quoteReference && (
            <div className="bg-white rounded-3xl p-8 border-2 border-slate-100 shadow-sm">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-2">Service ID</p>
              <p className="text-3xl font-black text-slate-900 font-mono tracking-tighter">
                {data.quoteReference}
              </p>
            </div>
          )}

          {/* Map */}
          {data.pickup.lat && data.pickup.lng && data.dropoff.lat && data.dropoff.lng && (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden group">
              <MapView
                pickupLat={data.pickup.lat}
                pickupLng={data.pickup.lng}
                deliveryLat={data.dropoff.lat}
                deliveryLng={data.dropoff.lng}
                onRouteUpdate={(dist) => {
                  onChange({ distance: dist });
                }}
              />
            </div>
          )}

          {/* Move Summary */}
          <MoveSummaryCard
            pickupAddress={data.pickup.address}
            pickupPostcode={data.pickup.postcode}
            pickupFloor={pickupFloor}
            pickupLift={data.pickup.hasLift}
            deliveryAddress={data.dropoff.address}
            deliveryPostcode={data.dropoff.postcode}
            deliveryFloor={deliveryFloor}
            deliveryLift={data.dropoff.hasLift}
            moveDate={moveDate}
            distance={data.distance}
            totalVolume={totalVolume}
            pickupFloorNumber={data.pickup.floor}
            deliveryFloorNumber={data.dropoff.floor}
            selectedItems={items}
          />

          {/* Items Summary Component */}
          <StoreItemListSummary items={items} totalVolume={totalVolume} />
        </div>
      </div>
    </div>
  );
}
