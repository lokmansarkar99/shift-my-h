/**
 * Motorbike & Bicycle - Step 3: Pricing
 * Display calculated price based on inventory
 */

import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowLeft, Bike, Calculator, Clock, ShieldCheck, Info, UserCheck, Shield, Truck, MapPin, Zap } from 'lucide-react';
import { MotorbikeQuote } from './motorbikeTypes';
import { MapView } from '../../MapView';
import { MoveSummaryCard } from '../../MoveSummaryCard';
import { getPricingConfig } from '../../../../utils/pricingConfigService';

interface StepProps {
  data: MotorbikeQuote;
  onChange: (updates: Partial<MotorbikeQuote>) => void;
  onNext: () => void;
  onBack: () => void;
}

const FLOOR_OPTIONS = ['Basement', 'Ground floor', '1st', '2nd', '3rd', '4th', '5th+'];

export function MotorbikeStep3Pricing({ data, onChange, onNext, onBack }: StepProps) {
  const [estimatedPrice, setEstimatedPrice] = useState<number>(data.estimatedPrice || 0);
  const [isCalculating, setIsCalculating] = useState(true);
  const [billableTime, setBillableTime] = useState<number>(0);

  const lastCalculatedPrice = useRef<number>(data.estimatedPrice || 0);

  // Get data for sidebar
  const pickupFloor = FLOOR_OPTIONS[data.pickup.floor] || 'Ground floor';
  const deliveryFloor = FLOOR_OPTIONS[data.dropoff.floor] || 'Ground floor';
  const moveDate = data.date && !data.dateUnsure
    ? (data.date instanceof Date ? data.date.toISOString().split('T')[0] : typeof data.date === 'string' ? data.date : '')
    : undefined;

  const items = data.items || [];
  const totalVolume = data.totalVolume || 0;

  // Calculate pricing
  useEffect(() => {
    const calculatePrice = async () => {
      if (totalVolume === 0 && items.length === 0) {
        setIsCalculating(false);
        return;
      }

      setIsCalculating(true);

      try {
        const config = await getPricingConfig();
        const hourlyRate = config.timeBasedPricing?.baseHourlyRate || 60;

        // Base time from volume (minutes)
        const baseLoadingTime = totalVolume * 15; // 15 min per m³
        const baseUnloadingTime = totalVolume * 15;
        const drivingTime = (data.distance || 0) * 2; // 2 min per mile

        let baseTime = baseLoadingTime + baseUnloadingTime + drivingTime;

        // Adjust for floors
        const pickupFloorAdjustment = data.pickup.floor * 10;
        const deliveryFloorAdjustment = data.dropoff.floor * 10;
        baseTime += pickupFloorAdjustment + deliveryFloorAdjustment;

        const estimatedHours = baseTime / 60;
        const minHours = config.timeBasedPricing?.minimumChargeableHours || 2;
        const billableHours = Math.max(estimatedHours, minHours);
        setBillableTime(billableHours);

        const finalPrice = Math.round(billableHours * hourlyRate);
        setEstimatedPrice(finalPrice);

        if (Math.abs(finalPrice - lastCalculatedPrice.current) > 0.01) {
          lastCalculatedPrice.current = finalPrice;
          onChange({ estimatedPrice: finalPrice });
        }
      } catch (error) {
        console.error('Error calculating price:', error);
      } finally {
        setIsCalculating(false);
      }
    };

    calculatePrice();
  }, [totalVolume, items.length, data.distance, data.pickup.floor, data.dropoff.floor, data.pickup.hasLift, data.dropoff.hasLift]);

  const handleNext = () => {
    onChange({ estimatedPrice });
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-6 lg:gap-8">
        {/* LEFT COLUMN */}
        <div className="space-y-6 order-last lg:order-first">
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-8 lg:p-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Bike className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
                  Transport Quote
                </h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Fixed price specialized vehicle transport
                </p>
              </div>
            </div>

            <div className="space-y-8">
              {/* Professional Price Card */}
              <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden border-4 border-slate-800">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-600/10 rounded-full -ml-24 -mb-24 blur-3xl"></div>
                
                {isCalculating ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-blue-200 text-xs font-black uppercase tracking-widest">Optimizing Logistics...</p>
                  </div>
                ) : (
                  <>
                    <div className="text-center mb-10">
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full mb-4">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-200">Guaranteed Price</span>
                      </div>
                      <div className="flex items-baseline justify-center gap-2">
                        <span className="text-3xl font-light text-slate-500">£</span>
                        <span className="text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">
                          {estimatedPrice.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-4">Inclusive of specialized chocks & gear</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-slate-800">
                      <div className="flex flex-col items-center text-center group">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center mb-3 border border-slate-700 group-hover:bg-blue-600 group-hover:border-blue-500 transition-all">
                          <UserCheck className="w-5 h-5 text-slate-400 group-hover:text-white" />
                        </div>
                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Bike Pro</p>
                        <p className="text-[10px] font-bold text-blue-400 uppercase">Included</p>
                      </div>
                      <div className="flex flex-col items-center text-center group">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center mb-3 border border-slate-700 group-hover:bg-blue-600 group-hover:border-blue-500 transition-all">
                          <Shield className="w-5 h-5 text-slate-400 group-hover:text-white" />
                        </div>
                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Securing Gear</p>
                        <p className="text-[10px] font-bold text-blue-400 uppercase">Included</p>
                      </div>
                      <div className="flex flex-col items-center text-center group">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center mb-3 border border-slate-700 group-hover:bg-blue-600 group-hover:border-blue-500 transition-all">
                          <Truck className="w-5 h-5 text-slate-400 group-hover:text-white" />
                        </div>
                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Logistics</p>
                        <p className="text-[10px] font-bold text-blue-400 uppercase">Included</p>
                      </div>
                      <div className="flex flex-col items-center text-center group">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center mb-3 border border-slate-700 group-hover:bg-blue-600 group-hover:border-blue-500 transition-all">
                          <MapPin className="w-5 h-5 text-slate-400 group-hover:text-white" />
                        </div>
                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Insurance</p>
                        <p className="text-[10px] font-bold text-blue-400 uppercase">Included</p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Service Detail Cards */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4 p-6 bg-blue-50/50 rounded-3xl border border-blue-100/50">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm shrink-0">
                    <Zap className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-black text-slate-900 text-sm uppercase tracking-tight">Specialist Transit</p>
                    <p className="text-xs text-slate-500 leading-relaxed mt-1">Vehicle equipped with specialized ramps and soft-tie strapping systems.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100/50">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm shrink-0">
                    <ShieldCheck className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-black text-slate-900 text-sm uppercase tracking-tight">£50k Goods in Transit</p>
                    <p className="text-xs text-slate-500 leading-relaxed mt-1">Full protection for your high-value vehicle throughout the entire journey.</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 pt-8 border-t border-slate-100">
                <button
                  onClick={onBack}
                  className="flex items-center gap-3 px-8 py-5 text-slate-400 font-black text-xs uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-all border-2 border-slate-100 active:scale-95"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={isCalculating}
                  className={`flex-1 max-w-sm flex items-center justify-center gap-3 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-2xl active:scale-95 ${
                    isCalculating
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-slate-900 text-white hover:bg-black shadow-slate-200'
                  }`}
                >
                  Continue to Details
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6 lg:sticky lg:top-4 lg:self-start order-first lg:order-last">
          {/* Quote Reference - RESTORED TO STEP 2 STYLE */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl shadow-sm border border-blue-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 font-medium mb-1">Quote ref:</p>
                <p className="text-xl font-bold text-slate-900">
                  {data.quoteReference || 'Generating...'}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-4">
            <MapView
              pickupLat={data.pickup.lat}
              pickupLng={data.pickup.lng}
              deliveryLat={data.dropoff.lat}
              deliveryLng={data.dropoff.lng}
              onRouteUpdate={(dist) => {
                if (Math.abs(dist - (data.distance || 0)) > 0.1) {
                  onChange({ distance: dist });
                }
              }}
            />
          </div>

          <MoveSummaryCard
            quoteRef={data.quoteReference || ''}
            pickupAddress={data.pickup.address}
            deliveryAddress={data.dropoff.address}
            pickupPropertyType=""
            deliveryPropertyType=""
            pickupFloor={pickupFloor}
            deliveryFloor={deliveryFloor}
            liftAvailableAtPickup={data.pickup.hasLift}
            liftAvailableAtDelivery={data.dropoff.hasLift}
            distance={data.distance}
            duration={data.duration}
            moveDate={moveDate}
            hasDateSelected={!data.dateUnsure}
            arrivalTimeFrom={480}
            arrivalTimeTo={600}
            selectedItems={items}
          />
        </div>
      </div>
    </div>
  );
}
