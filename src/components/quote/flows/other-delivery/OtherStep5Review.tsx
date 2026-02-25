/**
 * Other Delivery - Step 5: Review & Payment
 * Review details and pay via card
 */

import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, ShieldCheck, CreditCard, Truck, MapPin, Calendar, Boxes, User, Phone, Mail, Info } from 'lucide-react';
import { OtherQuote } from './otherTypes';
import { MoveSummaryCard } from '../../MoveSummaryCard';
import { PaymentModal, PaymentData } from '../../PaymentModal';

interface StepProps {
  data: OtherQuote;
  onChange: (updates: Partial<OtherQuote>) => void;
  onNext: () => void;
  onBack: () => void;
}

const FLOOR_OPTIONS = ['Basement', 'Ground floor', '1st', '2nd', '3rd', '4th', '5th+'];

export function OtherStep5Review({ data, onChange, onNext, onBack }: StepProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const pFloor = data.pickup?.floor || 0;
  const dFloor = data.dropoff?.floor || 0;
  const pickupFloor = FLOOR_OPTIONS[pFloor] || 'Ground floor';
  const deliveryFloor = FLOOR_OPTIONS[dFloor] || 'Ground floor';

  const moveDate = data.date && !data.dateUnsure
    ? (data.date instanceof Date ? data.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : typeof data.date === 'string' ? data.date : 'Not selected')
    : 'Date to be confirmed';

  const totalPrice = data.estimatedPrice || 0;

  const handlePayClick = () => {
    setShowPaymentModal(true);
  };

  const onPaymentSuccess = (paymentData: PaymentData) => {
    console.log('Other Delivery Payment Success:', paymentData);
    // You could save payment confirmation here if needed
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
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                  Review & Pay
                </h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">
                  Double check your details before booking
                </p>
              </div>
            </div>

            <div className="space-y-10">
              {/* Detailed Summary Section */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Logistics */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-5 bg-amber-500 rounded-full"></div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Logistics</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center shrink-0 border border-slate-100">
                        <MapPin className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pickup</p>
                        <p className="text-xs font-bold text-slate-700 leading-tight">
                          {data.contactDetails?.pickupLine1 ? 
                            `${data.contactDetails.pickupLine1}, ${data.contactDetails.pickupCity || ''} ${data.contactDetails.pickupPostcode || ''}` : 
                            data.pickup?.address}
                        </p>
                        <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tight">{pickupFloor} • {data.pickup?.hasLift ? 'Lift' : 'No Lift'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center shrink-0 border border-slate-100">
                        <MapPin className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Delivery</p>
                        <p className="text-xs font-bold text-slate-700 leading-tight">
                          {data.contactDetails?.deliveryLine1 ? 
                            `${data.contactDetails.deliveryLine1}, ${data.contactDetails.deliveryCity || ''} ${data.contactDetails.deliveryPostcode || ''}` : 
                            data.dropoff?.address}
                        </p>
                        <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tight">{deliveryFloor} • {data.dropoff?.hasLift ? 'Lift' : 'No Lift'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Service Info */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-5 bg-orange-500 rounded-full"></div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Service Date</h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center shrink-0 border border-slate-100">
                      <Calendar className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Scheduled Date</p>
                      <p className="text-xs font-bold text-slate-900">{moveDate}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Summary Card */}
              <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
                 <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                      <Boxes className="w-5 h-5 text-amber-600" />
                      Delivery Items
                    </h3>
                    <span className="px-3 py-1 bg-white rounded-lg border border-slate-200 text-[10px] font-black text-slate-400 uppercase">
                      {data.items?.length || 0} Total
                    </span>
                 </div>
                 <div className="flex flex-wrap gap-2">
                    {data.items?.map((item, idx) => (
                      <div key={idx} className="bg-white px-4 py-2 rounded-xl border border-slate-100 flex items-center gap-3 shadow-sm">
                        <span className="text-[10px] font-black text-amber-600">x{item.quantity}</span>
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight">{item.name}</span>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Contact Information */}
              <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-slate-100">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-5 bg-blue-500 rounded-full"></div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Customer Details</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-xs text-slate-600 font-bold">
                      <User className="w-4 h-4 text-slate-300" />
                      {data.contactDetails?.firstName} {data.contactDetails?.lastName}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-600 font-bold">
                      <Mail className="w-4 h-4 text-slate-300" />
                      {data.contactDetails?.email}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-600 font-bold">
                      <Phone className="w-4 h-4 text-slate-300" />
                      {data.contactDetails?.phone}
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-[2rem] p-6 border border-green-100 flex items-start gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-green-100">
                    <ShieldCheck className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-[11px] font-black text-green-900 uppercase tracking-tight">Fully Insured Delivery</p>
                    <p className="text-[10px] text-green-700/70 font-bold leading-relaxed mt-1 uppercase tracking-tighter">Your items are covered by our standard goods and transit insurance policy during the entire move.</p>
                  </div>
                </div>
              </div>

              {/* Navigation & Action */}
              <div className="flex items-center justify-between gap-6 pt-10 border-t border-slate-100">
                <button
                  onClick={onBack}
                  className="flex items-center gap-3 px-10 py-5 text-slate-400 font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-50 rounded-2xl transition-all border-2 border-slate-100 active:scale-95"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
                <button
                  onClick={handlePayClick}
                  className="flex-1 max-w-md flex items-center justify-center gap-4 px-12 py-6 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.25em] hover:bg-black transition-all shadow-[0_20px_50px_rgba(0,0,0,0.1)] active:scale-95"
                >
                  Pay & Book Now
                  <CreditCard className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6 lg:sticky lg:top-4 lg:self-start order-first lg:order-last">
          {/* Price Card (High Emphasis) */}
          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden border-4 border-slate-800">
             <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
             <div className="flex items-center justify-between mb-6">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Order Summary</p>
                <ShieldCheck className="w-5 h-5 text-amber-500" />
             </div>
             
             <div className="space-y-4 mb-8">
               <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                 <span>Subtotal</span>
                 <span>£{(totalPrice / 1.2).toFixed(2)}</span>
               </div>
               <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                 <span>VAT (20%)</span>
                 <span>£{(totalPrice - (totalPrice / 1.2)).toFixed(2)}</span>
               </div>
               <div className="pt-4 border-t border-slate-800 flex justify-between items-baseline">
                 <span className="text-sm font-black uppercase tracking-widest text-white">Total</span>
                 <div className="flex items-baseline gap-1">
                   <span className="text-xl font-light text-slate-500">£</span>
                   <span className="text-5xl font-black tracking-tighter text-white">{totalPrice.toFixed(2)}</span>
                 </div>
               </div>
             </div>

             <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <Info className="w-4 h-4 text-amber-500" />
                </div>
                <p className="text-[9px] font-bold text-slate-400 uppercase leading-relaxed tracking-wider">
                  Charges are only finalized 3 days before your delivery. Cancel for free up to 48h before.
                </p>
             </div>
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
            moveDate={data.date instanceof Date ? data.date.toISOString().split('T')[0] : (typeof data.date === 'string' ? data.date : undefined)}
            hasDateSelected={!data.dateUnsure}
            selectedItems={data.items || []}
          />
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onSubmit={onPaymentSuccess}
          totalPrice={totalPrice}
          moveDate={data.date instanceof Date ? data.date : (data.date ? new Date(data.date) : new Date())}
        />
      )}
    </div>
  );
}
