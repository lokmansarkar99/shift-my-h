/**
 * Other Delivery - Step 4: Access & Contact
 * Capture parking info, additional notes and structured contact/address details
 */

import React, { useEffect } from 'react';
import { ArrowRight, ArrowLeft, User, Phone, Mail, MessageSquare, Info, Car, Boxes, ShieldCheck, MapPin, Building2, Navigation } from 'lucide-react';
import { OtherQuote } from './otherTypes';
import { MoveSummaryCard } from '../../MoveSummaryCard';

interface StepProps {
  data: OtherQuote;
  onChange: (updates: Partial<OtherQuote>) => void;
  onNext: () => void;
  onBack: () => void;
}

const FLOOR_OPTIONS = ['Basement', 'Ground floor', '1st', '2nd', '3rd', '4th', '5th+'];

export function OtherStep4Access({ data, onChange, onNext, onBack }: StepProps) {
  // Initialize contact details if missing or partial
  useEffect(() => {
    if (!data.contactDetails || !data.contactDetails.pickupPostcode) {
      onChange({
        contactDetails: {
          firstName: data.contactDetails?.firstName || '',
          lastName: data.contactDetails?.lastName || '',
          email: data.contactDetails?.email || '',
          phone: data.contactDetails?.phone || '',
          pickupLine1: data.contactDetails?.pickupLine1 || '',
          pickupCity: data.contactDetails?.pickupCity || '',
          pickupPostcode: data.contactDetails?.pickupPostcode || data.pickup?.postcode || '',
          deliveryLine1: data.contactDetails?.deliveryLine1 || '',
          deliveryCity: data.contactDetails?.deliveryCity || '',
          deliveryPostcode: data.contactDetails?.deliveryPostcode || data.dropoff?.postcode || '',
        }
      });
    }
  }, []);

  const contact = {
    firstName: data.contactDetails?.firstName || '',
    lastName: data.contactDetails?.lastName || '',
    email: data.contactDetails?.email || '',
    phone: data.contactDetails?.phone || '',
    pickupLine1: data.contactDetails?.pickupLine1 || '',
    pickupCity: data.contactDetails?.pickupCity || '',
    pickupPostcode: data.contactDetails?.pickupPostcode || '',
    deliveryLine1: data.contactDetails?.deliveryLine1 || '',
    deliveryCity: data.contactDetails?.deliveryCity || '',
    deliveryPostcode: data.contactDetails?.deliveryPostcode || ''
  };
  
  const access = {
    pickupParking: data.accessDetails?.pickupParking || '',
    deliveryParking: data.accessDetails?.deliveryParking || '',
    additionalNotes: data.accessDetails?.additionalNotes || ''
  };

  const handleContactChange = (field: keyof typeof contact, value: string) => {
    const updatedContact = { ...contact, [field]: value };
    
    // Sync postcodes back to main pickup/dropoff for pricing/distance calculation
    const syncUpdates: any = { contactDetails: updatedContact };
    
    if (field === 'pickupPostcode') {
      syncUpdates.pickup = { ...data.pickup, postcode: value.toUpperCase() };
    }
    if (field === 'deliveryPostcode') {
      syncUpdates.dropoff = { ...data.dropoff, postcode: value.toUpperCase() };
    }
    
    onChange(syncUpdates);
  };

  const handleAccessChange = (field: keyof typeof access, value: string) => {
    onChange({
      accessDetails: { ...access, [field]: value }
    });
  };

  const canProceed = 
    (contact.firstName || '').trim() !== '' && 
    (contact.lastName || '').trim() !== '' && 
    (contact.email || '').trim() !== '' && 
    (contact.phone || '').trim() !== '' &&
    (contact.pickupLine1 || '').trim() !== '' &&
    (contact.pickupPostcode || '').trim() !== '' &&
    (contact.deliveryLine1 || '').trim() !== '' &&
    (contact.deliveryPostcode || '').trim() !== '';

  const pFloor = data.pickup?.floor || 0;
  const dFloor = data.dropoff?.floor || 0;
  const pickupFloor = FLOOR_OPTIONS[pFloor] || 'Ground floor';
  const deliveryFloor = FLOOR_OPTIONS[dFloor] || 'Ground floor';
  
  const moveDate = data.date && !data.dateUnsure
    ? (data.date instanceof Date ? data.date.toISOString().split('T')[0] : typeof data.date === 'string' ? data.date : '')
    : undefined;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-6 lg:gap-8">
        {/* LEFT COLUMN */}
        <div className="space-y-6 order-last lg:order-first">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 p-8 lg:p-12">
            <div className="flex items-center gap-5 mb-10">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-[1.25rem] flex items-center justify-center shadow-xl">
                <Navigation className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                  Final Logistics
                </h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">
                  Professional service details for your delivery
                </p>
              </div>
            </div>

            <div className="space-y-12">
              {/* Personal Information Section */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-slate-900 rounded-full"></div>
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Personal Information</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                    <div className="relative">
                      <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input
                        type="text"
                        value={contact.firstName}
                        onChange={(e) => handleContactChange('firstName', e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-amber-500 focus:bg-white transition-all font-bold"
                        placeholder="John"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                    <div className="relative">
                      <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input
                        type="text"
                        value={contact.lastName}
                        onChange={(e) => handleContactChange('lastName', e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-amber-500 focus:bg-white transition-all font-bold"
                        placeholder="Smith"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input
                        type="email"
                        value={contact.email}
                        onChange={(e) => handleContactChange('email', e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-amber-500 focus:bg-white transition-all font-bold"
                        placeholder="john.smith@email.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input
                        type="tel"
                        value={contact.phone}
                        onChange={(e) => handleContactChange('phone', e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-amber-500 focus:bg-white transition-all font-bold"
                        placeholder="07XXX XXXXXX"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Structured Address Section */}
              <section className="space-y-8 pt-6 border-t border-slate-100">
                {/* Pickup Address */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-amber-500 rounded-full"></div>
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Pickup Address Details</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">House/Flat Number & Street</label>
                      <div className="relative">
                        <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <input
                          type="text"
                          value={contact.pickupLine1}
                          onChange={(e) => handleContactChange('pickupLine1', e.target.value)}
                          className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-amber-500 focus:bg-white transition-all font-bold"
                          placeholder="e.g. Flat 4, 123 Baker St"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Postcode</label>
                      <input
                        type="text"
                        value={contact.pickupPostcode}
                        onChange={(e) => handleContactChange('pickupPostcode', e.target.value.toUpperCase())}
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-amber-500 focus:bg-white transition-all font-bold uppercase"
                        placeholder="NW1 6XE"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Town / City</label>
                    <input
                      type="text"
                      value={contact.pickupCity}
                      onChange={(e) => handleContactChange('pickupCity', e.target.value)}
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-amber-500 focus:bg-white transition-all font-bold"
                      placeholder="e.g. London"
                    />
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="space-y-6 pt-6 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-orange-500 rounded-full"></div>
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Delivery Address Details</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">House/Flat Number & Street</label>
                      <div className="relative">
                        <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <input
                          type="text"
                          value={contact.deliveryLine1}
                          onChange={(e) => handleContactChange('deliveryLine1', e.target.value)}
                          className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-amber-500 focus:bg-white transition-all font-bold"
                          placeholder="e.g. 456 Park Lane"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Postcode</label>
                      <input
                        type="text"
                        value={contact.deliveryPostcode}
                        onChange={(e) => handleContactChange('deliveryPostcode', e.target.value.toUpperCase())}
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-amber-500 focus:bg-white transition-all font-bold uppercase"
                        placeholder="W1K 1BN"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Town / City</label>
                    <input
                      type="text"
                      value={contact.deliveryCity}
                      onChange={(e) => handleContactChange('deliveryCity', e.target.value)}
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-amber-500 focus:bg-white transition-all font-bold"
                      placeholder="e.g. London"
                    />
                  </div>
                </div>
              </section>

              {/* Parking & Access Section */}
              <section className="space-y-6 pt-6 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-slate-900 rounded-full"></div>
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Access & Parking</h3>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                      <Car className="w-3 h-3" /> Pickup Parking
                    </label>
                    <select
                      value={access.pickupParking}
                      onChange={(e) => handleAccessChange('pickupParking', e.target.value)}
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-amber-500 focus:bg-white transition-all font-bold text-slate-700"
                    >
                      <option value="">Select option...</option>
                      <option value="private">Private Driveway / Loading Bay</option>
                      <option value="street_permit">Street - Permit Required</option>
                      <option value="street_paid">Street - Paid Parking</option>
                      <option value="street_free">Street - Free Parking</option>
                      <option value="red_route">Red Route / Main Road</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                      <Car className="w-3 h-3" /> Delivery Parking
                    </label>
                    <select
                      value={access.deliveryParking}
                      onChange={(e) => handleAccessChange('deliveryParking', e.target.value)}
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-amber-500 focus:bg-white transition-all font-bold text-slate-700"
                    >
                      <option value="">Select option...</option>
                      <option value="private">Private Driveway / Loading Bay</option>
                      <option value="street_permit">Street - Permit Required</option>
                      <option value="street_paid">Street - Paid Parking</option>
                      <option value="street_free">Street - Free Parking</option>
                      <option value="red_route">Red Route / Main Road</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                    <MessageSquare className="w-3 h-3" /> Additional Delivery Notes
                  </label>
                  <textarea
                    rows={4}
                    value={access.additionalNotes}
                    onChange={(e) => handleAccessChange('additionalNotes', e.target.value)}
                    placeholder="E.g. Code for the gate, fragility of items, or specific instructions for the driver..."
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-amber-500 focus:bg-white transition-all font-bold text-slate-700 resize-none"
                  />
                </div>
              </section>

              {/* Navigation */}
              <div className="flex items-center justify-between gap-6 pt-10 border-t border-slate-100">
                <button
                  onClick={onBack}
                  className="flex items-center gap-3 px-10 py-5 text-slate-400 font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-50 rounded-2xl transition-all border-2 border-slate-100 active:scale-95"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
                <button
                  onClick={onNext}
                  disabled={!canProceed}
                  className={`flex-1 max-w-md flex items-center justify-center gap-4 px-12 py-6 rounded-2xl font-black text-xs uppercase tracking-[0.25em] transition-all shadow-[0_20px_50px_rgba(0,0,0,0.1)] active:scale-95 ${
                    canProceed
                      ? 'bg-slate-900 text-white hover:bg-black'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Continue to Payment
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6 lg:sticky lg:top-4 lg:self-start order-first lg:order-last">
          {/* Quote Reference - Step 2 Style */}
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

          <MoveSummaryCard
            quoteRef={data.quoteReference || ''}
            pickupAddress={contact.pickupLine1 ? `${contact.pickupLine1}, ${contact.pickupCity} ${contact.pickupPostcode}` : data.pickup?.address}
            deliveryAddress={contact.deliveryLine1 ? `${contact.deliveryLine1}, ${contact.deliveryCity} ${contact.deliveryPostcode}` : data.dropoff?.address}
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
            selectedItems={data.items || []}
          />
          
          {/* Price Summary (Mini) */}
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl border-2 border-slate-800">
             <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Fixed Total</p>
                <ShieldCheck className="w-4 h-4 text-amber-500" />
             </div>
             <div className="flex items-baseline gap-2">
                <span className="text-xl font-light text-slate-500">£</span>
                <span className="text-5xl font-black tracking-tighter text-white">
                   {data.estimatedPrice?.toFixed(2) || '0.00'}
                </span>
             </div>
             <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-4">Inclusive of VAT & Insurance</p>
          </div>
        </div>
      </div>
    </div>
  );
}
