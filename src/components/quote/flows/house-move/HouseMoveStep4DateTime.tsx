/**
 * House Move - Step 4: Date, Time & Extras
 * UNIQUE DESIGN - ShiftMyHome Custom Style
 * Shows date selection, optional extras, and special requirements
 */

import React, { useState } from 'react';
import { HouseMoveQuote } from './houseMoveTypes';
import { ArrowRight, ArrowLeft, Calendar, Clock, Package, Shield, Plus, Minus, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { HouseMoveMapPanel } from './HouseMoveMapPanel';
import { MoveSummaryCard } from '../../MoveSummaryCard';
import { PricingCalendar } from '../../PricingCalendar';
import { TimeSelector } from '../../TimeSelector';

interface StepProps {
  data: HouseMoveQuote;
  onChange: (updates: Partial<HouseMoveQuote>) => void;
  onNext: () => void;
  onBack: () => void;
}

interface OptionalExtra {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: React.ReactNode;
  type: 'toggle' | 'quantity';
}

const OPTIONAL_EXTRAS: OptionalExtra[] = [
  {
    id: 'disassembly',
    name: 'Furniture Disassembly Service',
    description: 'Professional team dismantles your furniture for safe transport',
    price: 50,
    icon: <Package className="w-5 h-5" />,
    type: 'quantity',
  },
  {
    id: 'reassembly',
    name: 'Furniture Reassembly Service',
    description: 'Expert reconstruction and setup of furniture at destination',
    price: 50,
    icon: <Package className="w-5 h-5" />,
    type: 'quantity',
  },
  {
    id: 'protection-plus',
    name: 'Enhanced ShiftMyHome Protection',
    description: 'Extended coverage up to £50,000 for complete peace of mind',
    price: 45,
    icon: <Shield className="w-5 h-5" />,
    type: 'toggle',
  },
];

const PREMIUM_INCLUDED_SERVICES = [
  { text: 'Expert packing, loading & transport crew', icon: '🚚' },
  { text: 'Complete packing & wrapping assistance', icon: '📦' },
  { text: 'All protective materials included', icon: '🎁' },
  { text: 'Reserve now, settle on completion', icon: '💳' },
  { text: 'Furniture disassembly & reassembly service', icon: '🔧' },
  { text: 'Personal move coordinator assigned', icon: '👤' },
  { text: 'Enhanced ShiftMyHome Protection (£50k)', icon: '🛡️' },
  { text: 'Free cancellation up to 48 hours', icon: '✅' },
  { text: 'Extended waiting time (up to 2 hours)', icon: '⏰' },
  { text: 'Complimentary furniture arrangement service', icon: '🏠' },
];

export function Step4DateTime({ data, onChange, onNext, onBack }: StepProps) {
  const [selectedDate, setSelectedDate] = useState(data.date || '');
  const [selectedTime, setSelectedTime] = useState('08:00-10:00');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [needsStorage, setNeedsStorage] = useState(false);

  // Convert old array format to object for local state if needed
  const initialExtras: Record<string, number> = {};
  if (data.pricing?.extras) {
    data.pricing.extras.forEach(e => {
      initialExtras[e.id] = e.quantity || 1;
    });
  }
  const [extraQuantities, setExtraQuantities] = useState<Record<string, number>>(initialExtras);

  const isPremium = data.pricing?.packageType === 'premium';

  // Calculate total with extras
  const basePrice = data.pricing?.totalPrice || 0;
  
  // For Premium, disassembly and reassembly and protection are usually included.
  // We'll calculate the cost but set it to 0 if it's Premium.
  const extrasTotal = Object.entries(extraQuantities).reduce((sum, [extraId, quantity]) => {
    const extra = OPTIONAL_EXTRAS.find(e => e.id === extraId);
    if (!extra) return sum;
    
    // In Premium, these extras don't add to the price (they are already in the multiplier)
    if (isPremium) return sum;
    
    return sum + (extra.price * quantity);
  }, 0);
  
  const storageDiscount = (isPremium && needsStorage) ? basePrice * 0.1 : 0; // 10% discount only for Premium
  const totalPrice = basePrice + extrasTotal - storageDiscount;

  const updateQuantity = (extraId: string, delta: number) => {
    setExtraQuantities(prev => {
      const current = prev[extraId] || 0;
      const next = current + delta;
      
      if (next <= 0) {
        const { [extraId]: _, ...rest } = prev;
        return rest;
      }
      
      return { ...prev, [extraId]: next };
    });
  };

  const toggleExtra = (extraId: string) => {
    setExtraQuantities(prev => {
      if (prev[extraId]) {
        const { [extraId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [extraId]: 1 };
    });
  };

  const handleContinue = () => {
    onChange({
      date: selectedDate,
      moveTime: selectedTime,
      specialRequirements,
      pricing: {
        ...data.pricing!,
        extras: Object.entries(extraQuantities).map(([extraId, quantity]) => {
          const extra = OPTIONAL_EXTRAS.find(e => e.id === extraId);
          return {
            id: extraId,
            name: extra?.name || '',
            price: isPremium ? 0 : (extra?.price || 0),
            quantity,
          };
        }),
        totalPrice,
      },
    });
    onNext();
  };

  // Get minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      {/* 2 Column Layout - 60/40 split */}
      <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-6 lg:gap-8">
        {/* LEFT COLUMN - Date & Extras (60%) */}
        <div className="space-y-6 order-last lg:order-first">
          {/* Date & Time Selection */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:p-8">
            <div className="grid md:grid-cols-[65%_35%] gap-6">
              {/* Calendar - 65% */}
              <div>
                <PricingCalendar
                  basePrice={basePrice}
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                  minDate={minDate}
                />
              </div>

              {/* Time Selector - 35% */}
              <div>
                <TimeSelector
                  selectedTime={selectedTime}
                  onTimeSelect={setSelectedTime}
                />
              </div>
            </div>
          </div>

          {/* Optional Extras Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Optional Extras</h2>
                  <p className="text-sm text-slate-600">Enhance your move with additional services</p>
                </div>
              </div>
              {isPremium && (
                <div className="px-4 py-2 bg-emerald-100 border border-emerald-200 rounded-full flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">All Included</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {OPTIONAL_EXTRAS.map((extra) => {
                const quantity = extraQuantities[extra.id] || 0;
                const isSelected = quantity > 0;
                
                return (
                  <div
                    key={extra.id}
                    className={`border-2 rounded-2xl p-5 transition-all ${
                      isSelected
                        ? 'border-purple-500 bg-purple-50/50 shadow-md'
                        : 'border-slate-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Icon */}
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors ${
                          isSelected ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {extra.icon}
                      </div>

                      {/* Text Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h3 className="font-bold text-slate-900 truncate">{extra.name}</h3>
                          <div className="text-right">
                            {isPremium ? (
                              <span className="text-sm font-black text-emerald-600 uppercase tracking-widest">Included</span>
                            ) : (
                              <>
                                <span className="text-lg font-black text-purple-600">+£{extra.price}</span>
                                {extra.type === 'quantity' && <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Per item</span>}
                              </>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{extra.description}</p>
                      </div>

                      {/* Action Area */}
                      <div className="flex items-center gap-3 ml-4">
                        {extra.type === 'quantity' ? (
                          <div className="flex items-center bg-white rounded-xl border-2 border-slate-200 p-1 shadow-sm">
                            <button
                              onClick={() => updateQuantity(extra.id, -1)}
                              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                                quantity > 0 ? 'hover:bg-red-50 text-red-600' : 'text-slate-300'
                              }`}
                              disabled={quantity === 0}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-black text-slate-900">{quantity}</span>
                            <button
                              onClick={() => updateQuantity(extra.id, 1)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-emerald-50 text-emerald-600"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => toggleExtra(extra.id)}
                            className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all ${
                              isSelected 
                                ? 'border-purple-600 bg-purple-600 text-white shadow-lg shadow-purple-200' 
                                : 'border-slate-300 bg-white text-slate-300 hover:border-purple-400'
                            }`}
                          >
                            <CheckCircleIcon className={isSelected ? 'text-white' : 'text-slate-300'} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Special Requirements */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Special Requirements</h2>
                <p className="text-sm text-slate-600">Any additional notes or requests?</p>
              </div>
            </div>

            <textarea
              value={specialRequirements}
              onChange={(e) => setSpecialRequirements(e.target.value)}
              placeholder="e.g., Parking restrictions, narrow doorways, fragile items requiring extra care, or preferred entry/exit routes. The more details you provide, the better we can prepare!"
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 outline-none transition-all resize-none"
              rows={6}
            />
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
                disabled={!selectedDate}
                className="flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Contact Details
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Summary (40%) */}
        <div className="space-y-6 lg:sticky lg:top-4 lg:self-start order-first lg:order-last">
          {/* Quote Reference */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl shadow-sm border border-blue-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 font-medium mb-1">Quote ref:</p>
                <p className="text-xl font-bold text-slate-900">
                  {data.quoteReference || 'SMH-' + Date.now().toString().slice(-6)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Map */}
          <HouseMoveMapPanel data={data} />

          {/* Payment Protection Card */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-md border-2 border-blue-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-black text-blue-900">Secure Your Booking</h3>
                <p className="text-xs text-blue-700">Risk-free reservation</p>
              </div>
            </div>
            <p className="text-sm text-blue-900 mb-4 leading-relaxed">
              <span className="font-bold">Lock in your date with zero payment.</span> Card verification only – actual charges apply <span className="font-black">72 hours prior to moving day.</span>
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-xs text-blue-800">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                <span className="font-semibold">No charges today, guaranteed</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-blue-800">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                <span className="font-semibold">Modify or cancel until 48h before</span>
              </div>
            </div>
          </div>

          {/* Move Summary Card */}
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
            duration={data.duration}
            moveDate={selectedDate}
            hasDateSelected={!!selectedDate}
            arrivalTimeFrom={480}
            arrivalTimeTo={600}
            selectedItems={data.items?.map(item => ({
              id: item.id,
              name: item.name,
              quantity: item.quantity,
              volume: item.volume || 0.1,
            })) || []}
          />

          {/* Package Summary */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl shadow-sm border-2 border-emerald-300 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              {isPremium ? '⭐ Premium Package' : '📦 Standard Package'}
            </h3>
            
            {/* Price Breakdown */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Base price:</span>
                <span className="font-semibold text-slate-900">£{basePrice.toFixed(2)}</span>
              </div>
              
              {/* Show Extras Breakdown */}
              {Object.entries(extraQuantities).map(([id, quantity]) => {
                const extra = OPTIONAL_EXTRAS.find(e => e.id === id);
                if (!extra) return null;
                return (
                  <div key={id} className="flex justify-between text-sm">
                    <span className="text-slate-600">
                      {extra.name} {extra.type === 'quantity' && `(x${quantity})`}
                    </span>
                    <span className={`font-semibold ${isPremium ? 'text-emerald-600' : 'text-purple-600'}`}>
                      {isPremium ? 'Included' : `+£${(extra.price * quantity).toFixed(2)}`}
                    </span>
                  </div>
                );
              })}

              {isPremium && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Storage discount:</span>
                  <span className="font-semibold text-emerald-600">-£{storageDiscount.toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="pt-4 border-t-2 border-emerald-300">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-medium">Total:</span>
                <span className="text-3xl font-bold text-slate-900">£{totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={`w-6 h-6 ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
