import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ArrowLeft, Home } from 'lucide-react';
import { HouseMoveQuote } from './houseMoveTypes';
import { HouseMoveMapPanel } from './HouseMoveMapPanel';
import { MoveSummaryCard } from '../../MoveSummaryCard';

interface StepProps {
  data: HouseMoveQuote;
  onChange: (updates: Partial<HouseMoveQuote>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function HouseMoveStep4Details({ data, onChange, onNext, onBack }: StepProps) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <div className="space-y-6">
        {/* 2 Column Layout - 60/40 split - SAME AS STEP 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-6 lg:gap-8">
          {/* LEFT COLUMN - Main Content (60%) */}
          <div className="space-y-6 order-last lg:order-first">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:p-8">
              {/* Service Header with Icon */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">
                    Contact Details
                  </h1>
                  <p className="text-sm text-slate-600">Name, email, phone and any special instructions</p>
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-slate-600">Name, email, phone, notes...</p>
                
                <div className="flex justify-between pt-6 border-t border-slate-200">
                  <button onClick={onBack} className="flex items-center gap-2 px-6 py-3 text-slate-700 font-semibold hover:bg-slate-100 rounded-xl transition-colors">
                    <ArrowLeft className="w-5 h-5" /> Previous Step
                  </button>
                  <button onClick={onNext} className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transition-all">
                    Next Step <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - MAP + SUMMARY (40%) - SAME AS STEP 1 */}
          <div className="space-y-6 lg:sticky lg:top-4 lg:self-start order-first lg:order-last">
            {/* Quote Reference - SAME AS STEP 1 */}
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
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}