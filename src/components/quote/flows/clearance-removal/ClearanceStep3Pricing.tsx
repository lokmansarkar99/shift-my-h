/**
 * Clearance & Removal - Step 3: Pricing & Quote
 * Calculate and display pricing breakdown (Work Cost + Disposal Cost + Surcharges)
 */

import React, { useState, useEffect, useMemo } from 'react';
import { ClearanceQuote } from './clearanceTypes';
import { ChevronRight, ArrowLeft, Package, MapPin, Trash2, PoundSterling, CheckCircle, Info, Users, Truck, Shield, Recycle, ShieldCheck, UserCheck, Timer, Zap } from 'lucide-react';
import { MapView } from '../../MapView';
import { getSelectedItemsList } from './inventories/inventoryItemsMapping';
import { calculateClearancePricing, DEFAULT_CLEARANCE_PRICING_CONFIG } from '../../../../utils/clearancePricingConfig';
import { ClearanceSidebar } from './ClearanceSidebar';

interface StepProps {
  data: ClearanceQuote;
  onChange: (updates: Partial<ClearanceQuote>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function ClearanceStep3Pricing({ data, onChange, onNext, onBack }: StepProps) {
  // Extract primitive values to prevent infinite loop
  const totalVolume = data.inventory?.totalVolume || 0;
  const serviceType = data.clearanceServiceType || 'House Clearance';
  const disposalSelected = data.disposalSelected !== false;
  const hasSpecificLocation = data.hasSpecificDisposalLocation || false;
  const disposalType = data.clearanceDetails?.disposalType || 'general';
  const floor = data.pickup?.floor || 0;
  const hasLift = data.pickup?.hasLift || false;
  const parkingDist = data.pickup?.parkingDistance || 0;

  // Calculate pricing using useMemo
  const pricingResult = useMemo(() => {
    try {
      const result = calculateClearancePricing({
        totalVolumeM3: totalVolume,
        clearanceServiceType: serviceType,
        disposalSelected,
        hasSpecificDisposalLocation: hasSpecificLocation,
        disposalType,
        pickupFloor: floor,
        pickupHasLift: hasLift,
        parkingDistance: parkingDist,
      });
      return result;
    } catch (error) {
      console.error('Error calculating pricing:', error);
      return null;
    }
  }, [totalVolume, serviceType, disposalSelected, hasSpecificLocation, disposalType, floor, hasLift, parkingDist]);

  const handleNext = () => {
    if (pricingResult) {
      const totalVolumeM3 = data.inventory?.totalVolume || 0;
      onChange({
        pricing: {
          workCost: pricingResult.workCost,
          disposalCost: pricingResult.disposalCost,
          totalPrice: pricingResult.totalPrice,
          breakdown: {
            totalVolumeM3: pricingResult.breakdown.totalVolumeM3,
            workRatePerM3: pricingResult.breakdown.workRatePerM3,
            disposalMode: pricingResult.breakdown.disposalMode,
            disposalFeeFixed: pricingResult.breakdown.disposalFeeFixed,
            disposalRatePerM3: pricingResult.breakdown.disposalRatePerM3,
            customerProvidesDisposalDiscount: pricingResult.breakdown.customerProvidesDisposalDiscount,
            floorSurcharge: pricingResult.breakdown.floorSurcharge,
            parkingSurcharge: pricingResult.breakdown.parkingSurcharge,
          },
        },
        totalVolumeM3,
      });
    }
    onNext();
  };

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
        
        {/* LEFT COLUMN - Main Content */}
        <div className="order-last lg:order-first space-y-8">
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-8 lg:p-10">
            
            {/* Header */}
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Recycle className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
                  Guaranteed Quote
                </h1>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Fixed price clearance & disposal for {serviceType}
                </p>
              </div>
            </div>

            {pricingResult ? (
              <div className="space-y-8">
                {/* Professional Price Banner */}
                <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden border-4 border-slate-800">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                   
                   <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                      <div className="text-center md:text-left">
                         <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full mb-4">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-200">ShiftMyHome Certified</span>
                         </div>
                         <div className="flex items-baseline justify-center md:justify-start gap-2">
                            <span className="text-3xl font-light text-slate-500">£</span>
                            <span className="text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">
                              {pricingResult.totalPrice.toFixed(2)}
                            </span>
                         </div>
                         <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mt-4">Inclusive of disposal fees & labor</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                         <div className="bg-white/5 rounded-2xl p-5 border border-white/5 text-center group hover:bg-white/10 transition-all">
                            <UserCheck className="w-6 h-6 text-emerald-400 mx-auto mb-3" />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Clearance Pro</p>
                            <p className="text-[11px] font-bold text-white mt-1 uppercase tracking-tight">INCLUDED</p>
                         </div>
                         <div className="bg-white/5 rounded-2xl p-5 border border-white/5 text-center group hover:bg-white/10 transition-all">
                            <Recycle className="w-6 h-6 text-blue-400 mx-auto mb-3" />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Licensed Site</p>
                            <p className="text-[11px] font-bold text-white mt-1 uppercase tracking-tight">INCLUDED</p>
                         </div>
                         <div className="bg-white/5 rounded-2xl p-5 border border-white/5 text-center group hover:bg-white/10 transition-all">
                            <Truck className="w-6 h-6 text-orange-400 mx-auto mb-3" />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Large Capacity</p>
                            <p className="text-[11px] font-bold text-white mt-1 uppercase tracking-tight">INCLUDED</p>
                         </div>
                         <div className={`bg-white/5 rounded-2xl p-5 border border-white/5 text-center group hover:bg-white/10 transition-all ${!disposalSelected ? 'opacity-30' : ''}`}>
                            <Shield className="w-6 h-6 text-purple-400 mx-auto mb-3" />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Insurance</p>
                            <p className="text-[11px] font-bold text-white mt-1 uppercase tracking-tight">INCLUDED</p>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Features / Service Detail */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm shrink-0">
                      <Zap className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-black text-slate-900 text-sm uppercase tracking-tight">Zero-Stress Disposal</p>
                      <p className="text-xs text-slate-500 leading-relaxed mt-1">We handle all the heavy lifting and transport to authorized recycling centers.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm shrink-0">
                      <Timer className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-black text-slate-900 text-sm uppercase tracking-tight">Same-Day Availability</p>
                      <p className="text-xs text-slate-500 leading-relaxed mt-1">Fast turnaround for urgent clearances across the ShiftMyHome network.</p>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between pt-8 border-t border-slate-100">
                  <button
                    onClick={onBack}
                    className="flex items-center gap-3 px-8 py-5 text-slate-400 font-black text-xs uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-all active:scale-95 border-2 border-slate-100"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                  </button>
                  <button
                    onClick={handleNext}
                    className="flex-1 max-w-sm flex items-center justify-center gap-3 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xl shadow-emerald-100 transition-all active:scale-95"
                  >
                    Accept & Continue
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="animate-spin w-16 h-16 border-4 border-slate-100 border-t-emerald-600 rounded-full mx-auto mb-6"></div>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Synchronizing with Scotland Network...</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN - Summary Sidebar */}
        <div className="lg:sticky lg:top-4 lg:self-start">
           <ClearanceSidebar data={data} currentStep={3} />
        </div>
      </div>
    </div>
  );
}
