/**
 * Store/Pickup - Step 5: Review & Payment
 * Final summary of the collection, items, and total price
 */

import React, { useState } from 'react';
import { ArrowLeft, Check, Package, MapPin, Calendar, CreditCard, ShoppingCart, ShieldCheck, Wrench, Clock, User, Hash } from 'lucide-react';
import { StoreQuote } from './storeTypes';
import { MapView } from '../../MapView';
import { MoveSummaryCard } from '../../MoveSummaryCard';
import { PaymentModal } from '../../PaymentModal';

interface StepProps {
  data: StoreQuote;
  onChange: (updates: Partial<StoreQuote>) => void;
  onNext: () => void;
  onBack: () => void;
}

const FLOOR_OPTIONS = ['Basement', 'Ground floor', '1st', '2nd', '3rd', '4th', '5th+'];

export function StoreStep5Review({ data, onChange, onNext, onBack }: StepProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const pickupFloor = FLOOR_OPTIONS[data.pickup.floor] || 'Ground floor';
  const deliveryFloor = FLOOR_OPTIONS[data.dropoff.floor] || 'Ground floor';
  
  const moveDate = data.date && !data.dateUnsure
    ? (data.date instanceof Date ? data.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : typeof data.date === 'string' ? data.date : '')
    : 'Date not selected';

  const items = data.items || [];
  const assemblyExtra = data.extras?.find(e => e.id === 'assembly');
  const urgencySurcharge = (data.estimatedPrice || 0) > 0 ? (data.extras?.reduce((sum, e) => sum + (e.id !== 'assembly' ? e.price * (e.quantity || 1) : 0), 0) || 0) : 0;
  
  // Actually, urgency surcharge logic was in Step 4's internal state. 
  // We should have saved it to extras if we wanted it here, or we can detect it again.
  const todayStr = new Date().toISOString().split('T')[0];
  const selectedDateStr = data.date ? (data.date instanceof Date ? data.date.toISOString().split('T')[0] : String(data.date).split('T')[0]) : '';
  const isUrgent = selectedDateStr === todayStr;

  return (
    <>
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-6 lg:gap-8">
          {/* LEFT COLUMN - REVIEW */}
          <div className="space-y-6 order-last lg:order-first">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:p-8">
              <div className="mb-8">
                <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">
                  Final Review
                </h2>
                <p className="text-slate-600">
                  Please confirm all details before proceeding to secure payment
                </p>
              </div>

              {/* SERVICE SUMMARY CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {/* Collection Reference */}
                <div className="bg-emerald-50 border-2 border-emerald-100 rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-3 text-emerald-700">
                    <Hash className="w-5 h-5" />
                    <span className="text-xs font-black uppercase tracking-widest">Collection Ref</span>
                  </div>
                  <p className="text-2xl font-black text-emerald-900 font-mono">
                    {data.orderNumber || 'N/A'}
                  </p>
                  <p className="text-xs text-emerald-600 mt-1">Order # for store pickup</p>
                </div>

                {/* Date & Time */}
                <div className="bg-blue-50 border-2 border-blue-100 rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-3 text-blue-700">
                    <Calendar className="w-5 h-5" />
                    <span className="text-xs font-black uppercase tracking-widest">Schedule</span>
                  </div>
                  <p className="text-xl font-bold text-blue-900">
                    {moveDate}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">Requested collection time</p>
                </div>
              </div>

              {/* CONTACT & BILLING */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-slate-500" />
                  Contact & Billing
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <p className="text-slate-500 mb-1 font-medium uppercase text-[10px]">Customer</p>
                    <p className="font-bold text-slate-900">{data.customerName}</p>
                    <p className="text-slate-600">{data.customerEmail}</p>
                    <p className="text-slate-600">{data.customerPhone}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 mb-1 font-medium uppercase text-[10px]">Billing Address</p>
                    <p className="font-bold text-slate-900">{data.customerAddressLine1}</p>
                    <p className="text-slate-600">{data.customerCity}, {data.customerPostcode}</p>
                  </div>
                </div>
              </div>

              {/* ITEM LIST */}
              <div className="border border-slate-200 rounded-2xl p-6 mb-8">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-blue-600" />
                  Items for Collection ({items.length})
                </h3>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex-1">
                        <p className="font-bold text-slate-900 text-sm">{item.name}</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">{item.category}</p>
                      </div>
                      <div className="text-right">
                        <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg font-bold text-slate-700 text-sm">x{item.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* EXTRAS & RECEIPT */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {assemblyExtra && (
                  <div className="bg-purple-50 border-2 border-purple-100 rounded-2xl p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-200">
                        <Wrench className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-purple-900">Assembly Active</h4>
                        <p className="text-[10px] text-purple-600 uppercase font-black">Building {assemblyExtra.quantity} items</p>
                      </div>
                    </div>
                  </div>
                )}

                {data.receiptUrl && (
                  <div className="bg-emerald-50 border-2 border-emerald-100 rounded-2xl p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-emerald-900">Receipt Attached</h4>
                        <p className="text-[10px] text-emerald-600 uppercase font-black">Ready for driver</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* PRICE BOX */}
              <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden shadow-2xl mb-8">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <p className="text-blue-400 font-bold uppercase tracking-widest text-[10px] mb-2">Total Amount Due</p>
                    <div className="flex items-center gap-1">
                      <span className="text-3xl font-light text-blue-300">£</span>
                      <span className="text-6xl font-black tracking-tighter">
                        {(data.estimatedPrice || 0).toFixed(2)}
                      </span>
                    </div>
                    <p className="text-slate-400 text-xs mt-2 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      Secure payment powered by Stripe
                    </p>
                  </div>
                  
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xl rounded-2xl shadow-xl shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
                  >
                    <CreditCard className="w-6 h-6" />
                    Book & Pay Now
                  </button>
                </div>
              </div>

              {/* NAVIGATION */}
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
                Return to details
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN - SIDEBAR */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-200" />
                Service Guarantee
              </h3>
              <ul className="space-y-3 text-sm text-blue-50">
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Real-time driver tracking link</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>£50,000 Goods in Transit insurance</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Verified 5-star courier network</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Zero hidden fees guaranteed</span>
                </li>
              </ul>
            </div>

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
              totalVolume={data.totalVolume}
            />

            {isUrgent && (
              <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5 text-amber-900 flex items-start gap-3 shadow-sm">
                <Clock className="w-6 h-6 text-amber-600 flex-shrink-0" />
                <div>
                  <p className="font-black uppercase tracking-widest text-[10px] mb-1">Priority Collection</p>
                  <p className="text-sm font-bold leading-tight">Your urgent same-day request has been prioritized in our network.</p>
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
          amount={data.estimatedPrice || 0}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={onNext}
          quoteData={data}
        />
      )}
    </>
  );
}
