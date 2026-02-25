/**
 * Other Delivery - Step 3: Pricing
 * Display calculated price based on inventory and distance
 */

import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowLeft, Boxes, ShieldCheck, UserCheck, Shield, Truck, MapPin, Zap, Clock } from 'lucide-react';
import { OtherQuote } from './otherTypes';
import { MapView } from '../../MapView';
import { MoveSummaryCard } from '../../MoveSummaryCard';
import { getPricingConfig, DEFAULT_PRICING_CONFIG } from '../../../../utils/pricingConfigService';

interface StepProps {
  data: OtherQuote;
  onChange: (updates: Partial<OtherQuote>) => void;
  onNext: () => void;
  onBack: () => void;
}

const FLOOR_OPTIONS = ['Basement', 'Ground floor', '1st', '2nd', '3rd', '4th', '5th+'];

export function OtherStep3Pricing({ data, onChange, onNext, onBack }: StepProps) {
  const [estimatedPrice, setEstimatedPrice] = useState<number>(data.estimatedPrice || 0);
  const [isCalculating, setIsCalculating] = useState(true);
  const [billableTime, setBillableTime] = useState<number>(0);

  const lastCalculatedPrice = useRef<number>(data.estimatedPrice || 0);

  const items = data.items || [];
  const totalVolume = data.totalVolume || 0;

  // Calculate pricing
  useEffect(() => {
    let isMounted = true;

    const calculatePrice = async () => {
      // If no items, we still calculate based on distance but min charge applies
      setIsCalculating(true);

      try {
        const config = await getPricingConfig().catch(() => DEFAULT_PRICING_CONFIG);
        const hourlyRate = config.timeBasedPricing?.baseHourlyRate || 60;

        // Base time from volume (minutes)
        // For general delivery, we use a slightly higher buffer per m3
        const baseLoadingTime = totalVolume * 20; 
        const baseUnloadingTime = totalVolume * 20;
        
        // Driving time (2.5 mins per mile for vans in traffic)
        const drivingTime = (data.distance || 0) * 2.5; 

        let baseTime = baseLoadingTime + baseUnloadingTime + drivingTime;

        // Adjust for floors
        const pFloor = data.pickup?.floor || 0;
        const dFloor = data.dropoff?.floor || 0;
        const pickupFloorAdjustment = pFloor * 8;
        const deliveryFloorAdjustment = dFloor * 8;
        baseTime += pickupFloorAdjustment + deliveryFloorAdjustment;

        // Minimum time check
        const estimatedHours = baseTime / 60;
        const minHours = config.timeBasedPricing?.minimumChargeableHours || 2;
        const billableHours = Math.max(estimatedHours, minHours);

        if (isMounted) {
          setBillableTime(billableHours);
          const finalPrice = Math.round(billableHours * hourlyRate);
          setEstimatedPrice(finalPrice);

          if (Math.abs(finalPrice - lastCalculatedPrice.current) > 0.01) {
            lastCalculatedPrice.current = finalPrice;
            onChange({ estimatedPrice: finalPrice });
          }
        }
      } catch (error) {
        console.error('Error calculating price in OtherStep3:', error);
      } finally {
        if (isMounted) {
          setIsCalculating(false);
        }
      }
    };

    calculatePrice();

    return () => {
      isMounted = false;
    };
  }, [totalVolume, items.length, data.distance, data.pickup?.floor, data.dropoff?.floor, data.pickup?.hasLift, data.dropoff?.hasLift]);

  const pickupFloor = FLOOR_OPTIONS[data.pickup?.floor || 0] || 'Ground floor';
  const deliveryFloor = FLOOR_OPTIONS[data.dropoff?.floor || 0] || 'Ground floor';
  const moveDate = data.date && !data.dateUnsure
    ? (data.date instanceof Date ? data.date.toISOString().split('T')[0] : typeof data.date === 'string' ? data.date : '')
    : undefined;

  const handleNext = () => {
    if (isCalculating) return;
    onChange({ estimatedPrice });
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-6 lg:gap-8">
        {/* LEFT COLUMN */}
        <div className="space-y-6 order-last lg:order-first">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 p-8 lg:p-12">
            <div className="flex items-center gap-5 mb-10">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-[1.25rem] flex items-center justify-center shadow-xl">
                <Boxes className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                  Delivery Quote
                </h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">
                  Professional item-by-item transport service
                </p>
              </div>
            </div>

            <div className="space-y-10">
              {/* Professional Price Card */}
              <div className="bg-slate-900 rounded-[3rem] p-12 text-white shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] relative overflow-hidden border-4 border-slate-800">
                <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full -mr-40 -mt-40 blur-[100px]"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-600/10 rounded-full -ml-32 -mb-32 blur-[100px]"></div>
                
                {isCalculating ? (
                  <div className="text-center py-16">
                    <div className="w-14 h-14 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                    <p className="text-amber-200 text-xs font-black uppercase tracking-[0.3em]">Calculating Best Rate...</p>
                  </div>
                ) : (
                  <>
                    <div className="text-center mb-12">
                      <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 rounded-full mb-6 backdrop-blur-md border border-white/5">
                        <ShieldCheck className="w-4 h-4 text-amber-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-200">Guaranteed Fixed Rate</span>
                      </div>
                      <div className="flex items-baseline justify-center gap-3">
                        <span className="text-4xl font-light text-slate-500">£</span>
                        <span className="text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">
                          {estimatedPrice.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mt-6">Fully inclusive of taxes and insurance</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-slate-800/50">
                      <div className="flex flex-col items-center text-center group">
                        <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mb-4 border border-slate-700 group-hover:bg-amber-500 group-hover:border-amber-400 transition-all duration-300">
                          <Truck className="w-6 h-6 text-slate-400 group-hover:text-white" />
                        </div>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Expert Team</p>
                        <p className="text-[11px] font-bold text-amber-400 uppercase">Included</p>
                      </div>
                      <div className="flex flex-col items-center text-center group">
                        <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mb-4 border border-slate-700 group-hover:bg-amber-500 group-hover:border-amber-400 transition-all duration-300">
                          <Shield className="w-6 h-6 text-slate-400 group-hover:text-white" />
                        </div>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Protection</p>
                        <p className="text-[11px] font-bold text-amber-400 uppercase">Included</p>
                      </div>
                      <div className="flex flex-col items-center text-center group">
                        <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mb-4 border border-slate-700 group-hover:bg-amber-500 group-hover:border-amber-400 transition-all duration-300">
                          <Clock className="w-6 h-6 text-slate-400 group-hover:text-white" />
                        </div>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">No Hidden Fees</p>
                        <p className="text-[11px] font-bold text-amber-400 uppercase">Included</p>
                      </div>
                      <div className="flex flex-col items-center text-center group">
                        <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mb-4 border border-slate-700 group-hover:bg-amber-500 group-hover:border-amber-400 transition-all duration-300">
                          <MapPin className="w-6 h-6 text-slate-400 group-hover:text-white" />
                        </div>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Fuel & Tolls</p>
                        <p className="text-[11px] font-bold text-amber-400 uppercase">Included</p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Service Detail Cards */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="flex items-start gap-5 p-8 bg-amber-50/50 rounded-[2rem] border border-amber-100/50 hover:bg-amber-50 transition-colors">
                  <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-md shrink-0">
                    <Zap className="w-7 h-7 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-black text-slate-900 text-base uppercase tracking-tight">Express Handling</p>
                    <p className="text-xs text-slate-500 leading-relaxed mt-2 font-medium">Prioritized loading and direct delivery routes for minimal transit time.</p>
                  </div>
                </div>
                <div className="flex items-start gap-5 p-8 bg-orange-50/50 rounded-[2rem] border border-orange-100/50 hover:bg-orange-50 transition-colors">
                  <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-md shrink-0">
                    <ShieldCheck className="w-7 h-7 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-black text-slate-900 text-base uppercase tracking-tight">Enterprise Safety</p>
                    <p className="text-xs text-slate-500 leading-relaxed mt-2 font-medium">Each item is protected with transit blankets and secured with industrial webbing.</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-6 pt-10 border-t border-slate-100">
                <button
                  onClick={onBack}
                  className="flex items-center gap-3 px-10 py-5 text-slate-400 font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-50 rounded-2xl transition-all border-2 border-slate-100 active:scale-95"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={isCalculating}
                  className={`flex-1 max-w-md flex items-center justify-center gap-4 px-12 py-6 rounded-2xl font-black text-xs uppercase tracking-[0.25em] transition-all shadow-[0_20px_50px_rgba(0,0,0,0.1)] active:scale-95 ${
                    isCalculating
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-slate-900 text-white hover:bg-black'
                  }`}
                >
                  Confirm & Continue
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6 lg:sticky lg:top-4 lg:self-start order-first lg:order-last">
          {/* Quote Reference */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl shadow-sm border border-amber-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-amber-700 font-black uppercase tracking-widest mb-1">Quote ref:</p>
                <p className="text-xl font-black text-slate-900 font-mono tracking-tighter">
                  {data.quoteReference || 'SMH-XXXXX-XXXX'}
                </p>
              </div>
              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                <Boxes className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 p-4">
            <MapView
              pickupLat={data.pickup?.lat}
              pickupLng={data.pickup?.lng}
              deliveryLat={data.dropoff?.lat}
              deliveryLng={data.dropoff?.lng}
              onRouteUpdate={(dist, dur) => {
                if (Math.abs(dist - (data.distance || 0)) > 0.1 || Math.abs(dur - (data.duration || 0)) > 1) {
                  onChange({ distance: dist, duration: dur });
                }
              }}
            />
          </div>

          <MoveSummaryCard
            quoteRef={data.quoteReference || ''}
            pickupAddress={data.pickup?.address}
            deliveryAddress={data.dropoff?.address}
            pickupPropertyType=""
            deliveryPropertyType=""
            pickupFloor={pickupFloor}
            deliveryFloor={deliveryFloor}
            liftAvailableAtPickup={data.pickup?.hasLift}
            liftAvailableAtDelivery={data.dropoff?.hasLift}
            distance={data.distance}
            duration={data.duration}
            moveDate={moveDate}
            hasDateSelected={!data.dateUnsure}
            selectedItems={items}
          />
        </div>
      </div>
    </div>
  );
}
