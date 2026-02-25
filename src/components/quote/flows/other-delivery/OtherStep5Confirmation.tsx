/**
 * Other Delivery - Step 6: Confirmation (Success)
 * Order success screen with summary and reference
 */

import React from 'react';
import { CheckCircle, Calendar, MapPin, Truck, Phone, Mail, Boxes, Download, Share2 } from 'lucide-react';
import { OtherQuote } from './otherTypes';

interface StepProps {
  data: OtherQuote;
  onChange?: (updates: Partial<OtherQuote>) => void;
  onNext?: () => void;
  onBack?: () => void;
}

const FLOOR_OPTIONS = ['Basement', 'Ground floor', '1st', '2nd', '3rd', '4th', '5th+'];

export function OtherStep5Confirmation({ data }: StepProps) {
  const pFloor = data.pickup?.floor || 0;
  const dFloor = data.dropoff?.floor || 0;
  const pickupFloor = FLOOR_OPTIONS[pFloor] || 'Ground floor';
  const deliveryFloor = FLOOR_OPTIONS[dFloor] || 'Ground floor';

  const moveDate = data.date && !data.dateUnsure
    ? (data.date instanceof Date ? data.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : typeof data.date === 'string' ? data.date : 'Not selected')
    : 'Date to be confirmed';

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      {/* Success Hero */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-emerald-100 rounded-[2.5rem] mb-8 relative animate-bounce">
          <CheckCircle className="w-12 h-12 text-emerald-600" />
          <div className="absolute -inset-4 bg-emerald-100/50 rounded-[3rem] -z-10 animate-pulse"></div>
        </div>
        <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase mb-4">
          Order Confirmed!
        </h1>
        <p className="text-slate-500 font-bold uppercase text-xs tracking-[0.3em] mb-8">
          Your delivery request has been received and scheduled
        </p>
        
        <div className="inline-flex items-center gap-4 px-8 py-4 bg-slate-900 rounded-2xl shadow-2xl">
          <div>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest text-left">Order Reference</p>
            <p className="text-2xl font-black text-white font-mono tracking-tighter">{data.quoteReference}</p>
          </div>
          <div className="w-px h-10 bg-slate-800 mx-2"></div>
          <div className="text-left">
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Total Paid</p>
            <p className="text-2xl font-black text-amber-500 tracking-tighter">£{data.estimatedPrice?.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Logistics Summary */}
        <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-200">
           <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-3">
             <Truck className="w-5 h-5 text-amber-500" />
             Logistics Summary
           </h3>
           
           <div className="space-y-8 relative">
              <div className="absolute left-[11px] top-4 bottom-4 w-0.5 bg-slate-100"></div>
              
              <div className="relative pl-10">
                <div className="absolute left-0 top-0 w-6 h-6 bg-amber-500 rounded-full border-4 border-white shadow-sm flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pickup From</p>
                <p className="text-sm font-bold text-slate-700 leading-tight">
                  {data.contactDetails?.pickupLine1 ? 
                    `${data.contactDetails.pickupLine1}, ${data.contactDetails.pickupCity || ''} ${data.contactDetails.pickupPostcode || ''}` : 
                    data.pickup?.address}
                </p>
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight">{pickupFloor} • {data.pickup?.hasLift ? 'Lift Access' : 'No Lift'}</p>
              </div>

              <div className="relative pl-10">
                <div className="absolute left-0 top-0 w-6 h-6 bg-slate-900 rounded-full border-4 border-white shadow-sm flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Delivery To</p>
                <p className="text-sm font-bold text-slate-700 leading-tight">
                  {data.contactDetails?.deliveryLine1 ? 
                    `${data.contactDetails.deliveryLine1}, ${data.contactDetails.deliveryCity || ''} ${data.contactDetails.deliveryPostcode || ''}` : 
                    data.dropoff?.address}
                </p>
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight">{deliveryFloor} • {data.dropoff?.hasLift ? 'Lift Access' : 'No Lift'}</p>
              </div>

              <div className="relative pl-10">
                 <div className="absolute left-0 top-0 w-6 h-6 bg-white border-2 border-slate-200 rounded-full flex items-center justify-center">
                   <Calendar className="w-3 h-3 text-slate-400" />
                 </div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Service Date</p>
                 <p className="text-sm font-bold text-slate-900">{moveDate}</p>
              </div>
           </div>
        </div>

        {/* Customer & Items */}
        <div className="space-y-8">
           <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-200">
             <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
               <Boxes className="w-5 h-5 text-orange-500" />
               Items to Deliver
             </h3>
             <div className="flex flex-wrap gap-2">
                {data.items?.slice(0, 5).map((item, idx) => (
                  <span key={idx} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black text-slate-600 uppercase tracking-tight">
                    {item.quantity}x {item.name}
                  </span>
                ))}
                {(data.items?.length || 0) > 5 && (
                  <span className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black text-slate-400 uppercase">
                    +{(data.items?.length || 0) - 5} more
                  </span>
                )}
             </div>
           </div>

           <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-200">
             <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
               <Phone className="w-5 h-5 text-blue-500" />
               Contact Info
             </h3>
             <div className="space-y-4">
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                   <Mail className="w-5 h-5 text-blue-600" />
                 </div>
                 <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
                   <p className="text-sm font-bold text-slate-700">{data.contactDetails?.email}</p>
                 </div>
               </div>
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                   <Phone className="w-5 h-5 text-emerald-600" />
                 </div>
                 <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number</p>
                   <p className="text-sm font-bold text-slate-700">{data.contactDetails?.phone}</p>
                 </div>
               </div>
             </div>
           </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button className="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl">
          <Download className="w-5 h-5" /> Download PDF Receipt
        </button>
        <button className="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-white text-slate-900 border-2 border-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">
          <Share2 className="w-5 h-5" /> Share Order
        </button>
        <button 
          onClick={() => window.location.hash = '#/'}
          className="flex items-center justify-center gap-3 px-10 py-5 bg-amber-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-amber-600 transition-all shadow-xl shadow-amber-200"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}
