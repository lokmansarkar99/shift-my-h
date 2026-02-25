/**
 * Motorbike & Bicycle - Step 5: Review & Payment
 * Summary + Pricing Breakdown + Payment Modal
 * Styled like Store/Pickup Service Step 5
 */

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, Bike, MapPin, Calendar, CreditCard, ShoppingCart, Package, ShieldCheck, User, Home, Phone, Mail } from 'lucide-react';
import { MotorbikeQuote } from './motorbikeTypes';
import { MapView } from '../../MapView';
import { MoveSummaryCard } from '../../MoveSummaryCard';
import { PaymentModal } from '../../PaymentModal';
import { getPricingConfig } from '../../../../utils/pricingConfigService';

interface StepProps {
  data: MotorbikeQuote;
  onChange: (updates: Partial<MotorbikeQuote>) => void;
  onNext: () => void;
  onBack: () => void;
}

const FLOOR_OPTIONS = ['Basement', 'Ground floor', '1st', '2nd', '3rd', '4th', '5th+'];

export function MotorbikeStep5Review({ data, onChange, onNext, onBack }: StepProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState<number>(data.estimatedPrice || 0);
  const [isCalculating, setIsCalculating] = useState(true);
  const [priceBreakdown, setPriceBreakdown] = useState<{
    baseBikeFee: number;
    additionalItemsFee: number;
    securingFee: number;
    floorCharges: number;
    distanceCharge: number;
    finalPrice: number;
  }>({
    baseBikeFee: 0,
    additionalItemsFee: 0,
    securingFee: 0,
    floorCharges: 0,
    distanceCharge: 0,
    finalPrice: 0,
  });

  // Calculate pricing
  useEffect(() => {
    const calculatePrice = async () => {
      try {
        const config = await getPricingConfig();
        const items = data.items || [];
        const distance = data.distance || 0;
        const motorCharges = config.motorbikeTransportCharges;
        
        // 1. Determine Base Bike Fee (highest value item)
        let maxItemPrice = 0;
        let totalCount = 0;
        
        items.forEach(item => {
          totalCount += item.quantity;
          let itemPrice = motorCharges.bicycle; // Default
          
          const name = item.name.toLowerCase();
          const cat = (item.category || '').toLowerCase();
          
          if (name.includes('scooter') || name.includes('moped')) {
            itemPrice = motorCharges.scooter;
          } else if (name.includes('electric') || cat.includes('electric')) {
            itemPrice = motorCharges.electricBike;
          } else if (cat.includes('sport') || cat.includes('naked') || cat.includes('classic')) {
            itemPrice = motorCharges.standardMotorbike;
          } else if (cat.includes('cruiser') || name.includes('large') || name.includes('touring')) {
            itemPrice = motorCharges.largeMotorbike;
          } else if (name.includes('motorbike') || cat.includes('motorbike')) {
            itemPrice = motorCharges.standardMotorbike;
          }
          
          if (itemPrice > maxItemPrice) maxItemPrice = itemPrice;
        });

        const baseBikeFee = maxItemPrice || motorCharges.standardMotorbike;
        
        // 2. Additional Items Fee
        const additionalItemsFee = totalCount > 1 
          ? (totalCount - 1) * motorCharges.additionalBikeSurcharge 
          : 0;
          
        // 3. Securing Fee
        const securingFee = motorCharges.cargoSecuringFee;
        
        // 4. Floor charges
        const pickupFloorIndex = data.pickup.floor;
        const deliveryFloorIndex = data.dropoff.floor;
        const hasPickupLift = data.pickup.hasLift;
        const hasDeliveryLift = data.dropoff.hasLift;
        
        let floorCharges = 0;
        if (pickupFloorIndex > 1) {
          const floorRate = hasPickupLift ? config.accessCharges.stairsWithLiftPerFloor : config.accessCharges.stairsWithoutLiftPerFloor;
          floorCharges += floorRate * (pickupFloorIndex - 1);
        }
        if (deliveryFloorIndex > 1) {
          const floorRate = hasDeliveryLift ? config.accessCharges.stairsWithLiftPerFloor : config.accessCharges.stairsWithoutLiftPerFloor;
          floorCharges += floorRate * (deliveryFloorIndex - 1);
        }
        
        // 5. Distance charge (using £1.50/mile rate for consistency with Store/Pickup)
        const distanceCharge = distance * (config.otherDeliveryCharges?.perMileRate || 1.5);
        
        // 6. Calculate final price
        const finalPrice = baseBikeFee + additionalItemsFee + securingFee + floorCharges + distanceCharge;
        
        setPriceBreakdown({
          baseBikeFee,
          additionalItemsFee,
          securingFee,
          floorCharges,
          distanceCharge,
          finalPrice,
        });
        
        setEstimatedPrice(finalPrice);
        setIsCalculating(false);
        onChange({ estimatedPrice: finalPrice });
      } catch (error) {
        console.error('Error calculating motorbike price:', error);
        setIsCalculating(false);
      }
    };

    calculatePrice();
  }, [data.items, data.distance, data.pickup.floor, data.dropoff.floor, data.pickup.hasLift, data.dropoff.hasLift]);

  const pickupFloor = FLOOR_OPTIONS[data.pickup.floor] || 'Ground floor';
  const deliveryFloor = FLOOR_OPTIONS[data.dropoff.floor] || 'Ground floor';
  const moveDate = data.date && !data.dateUnsure
    ? (data.date instanceof Date ? data.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : data.date)
    : 'Flexible';

  const items = data.items || [];

  return (
    <>
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-6 lg:gap-8">
          {/* LEFT COLUMN - REVIEW (60%) */}
          <div className="space-y-6 order-last lg:order-first">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Review Your Quote
                </h2>
                <p className="text-slate-600">
                  Check your details and vehicle transport options
                </p>
              </div>

              {/* Items List */}
              <div className="mb-8">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Bike className="w-5 h-5 text-blue-600" />
                  Vehicles to Transport ({items.reduce((sum, i) => sum + i.quantity, 0)})
                </h3>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100"
                    >
                      <div className="flex-1">
                        <p className="font-bold text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                          {item.category}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-blue-600">x{item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Details Summary (Requested) */}
              <div className="mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Your Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <User className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</p>
                        <p className="font-semibold text-slate-900">{data.contactDetails?.name || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</p>
                        <p className="font-semibold text-slate-900">{data.contactDetails?.email || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone</p>
                        <p className="font-semibold text-slate-900">{data.contactDetails?.phone || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 text-sm">
                      <Home className="w-4 h-4 text-slate-400 mt-1" />
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Your Address</p>
                        <p className="font-semibold text-slate-900">
                          {data.contactDetails?.streetAddress}
                          {data.contactDetails?.addressLine2 && <><br />{data.contactDetails.addressLine2}</>}
                          <br />{data.contactDetails?.city}, {data.contactDetails?.postcode}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  Price Breakdown
                </h3>
                
                {isCalculating ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-sm text-slate-500 mt-4 font-medium tracking-wide">Calculating your fixed price...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-slate-700">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                        <span className="text-sm font-medium">Base transport fee:</span>
                      </div>
                      <span className="font-bold">£{priceBreakdown.baseBikeFee.toFixed(2)}</span>
                    </div>
                    
                    {priceBreakdown.additionalItemsFee > 0 && (
                      <div className="flex justify-between items-center text-slate-700">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                          <span className="text-sm font-medium">Additional vehicles:</span>
                        </div>
                        <span className="font-bold">£{priceBreakdown.additionalItemsFee.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center text-slate-700">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                        <span className="text-sm font-medium">Securing & Strapping gear:</span>
                      </div>
                      <span className="font-bold">£{priceBreakdown.securingFee.toFixed(2)}</span>
                    </div>

                    {priceBreakdown.floorCharges > 0 && (
                      <div className="flex justify-between items-center text-slate-700">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                          <span className="text-sm font-medium">Floor access charges:</span>
                        </div>
                        <span className="font-bold">£{priceBreakdown.floorCharges.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-slate-700 pb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                        <span className="text-sm font-medium">Distance charge ({data.distance?.toFixed(1)} miles):</span>
                      </div>
                      <span className="font-bold">£{priceBreakdown.distanceCharge.toFixed(2)}</span>
                    </div>
                    
                    <div className="pt-6 mt-2 border-t-2 border-dashed border-blue-200">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-1">Total Fixed Price</p>
                          <p className="text-xs text-slate-500 font-medium">Including all fees & VAT</p>
                        </div>
                        <div className="text-right">
                          <span className="text-4xl font-black text-slate-900 tracking-tighter">
                            £{priceBreakdown.finalPrice.toFixed(0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between gap-4 pt-8 border-t border-slate-100">
                <button
                  onClick={onBack}
                  className="flex items-center gap-2 px-6 py-4 rounded-2xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all active:scale-95"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
                <button
                  onClick={() => setShowPaymentModal(true)}
                  disabled={isCalculating}
                  className={`flex-1 flex items-center justify-center gap-3 px-10 py-4 rounded-2xl font-black text-lg transition-all shadow-xl active:scale-95 ${
                    isCalculating
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:shadow-2xl hover:-translate-y-0.5'
                  }`}
                >
                  <CreditCard className="w-6 h-6" />
                  Confirm & Book Now
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - SIDEBAR (40%) */}
          <div className="space-y-6 lg:sticky lg:top-4 lg:self-start order-first lg:order-last">
            {/* Quote Reference - Consistent with Step 2 */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl shadow-sm border border-blue-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-600 font-medium mb-1">Quote ref:</p>
                  <p className="text-xl font-bold text-slate-900">
                    {data.quoteReference || 'REF-82931'}
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
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden h-[300px] p-4">
              <MapView
                pickupLat={data.pickup.lat}
                pickupLng={data.pickup.lng}
                deliveryLat={data.dropoff.lat}
                deliveryLng={data.dropoff.lng}
                onRouteUpdate={() => {}}
              />
            </div>

            {/* Move Summary Card */}
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
              moveDate={moveDate === 'Flexible' ? undefined : moveDate}
              hasDateSelected={moveDate !== 'Flexible'}
              arrivalTimeFrom={480}
              arrivalTimeTo={600}
              selectedItems={items}
            />

            {/* Estimated Price Card */}
            {!isCalculating && estimatedPrice > 0 && (
              <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-3xl p-8 text-white shadow-2xl">
                <p className="text-xs font-black text-blue-200 uppercase tracking-widest mb-4">Total Quote</p>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-6xl font-black tracking-tighter">£{estimatedPrice.toFixed(0)}</span>
                  <span className="text-blue-200 font-bold">inc. VAT</span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-blue-100/80">
                    <ShieldCheck className="w-4 h-4 text-green-400" />
                    <span>Fixed price guarantee</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-blue-100/80">
                    <ShieldCheck className="w-4 h-4 text-green-400" />
                    <span>Specialist vehicle insurance</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={onNext}
          amount={estimatedPrice}
          quoteRef={data.quoteReference || ''}
        />
      )}
    </>
  );
}
