/**
 * Motorbike & Bicycle - Step 4: Access Details & Contact Information
 * Combined: pickup/delivery details + contact form + customer address
 */

import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Info, Bike, User, Mail, Phone, ShieldCheck, MapPin, Home } from 'lucide-react';
import { MotorbikeQuote } from './motorbikeTypes';
import { MapView } from '../../MapView';
import { MoveSummaryCard } from '../../MoveSummaryCard';

interface StepProps {
  data: MotorbikeQuote;
  onChange: (updates: Partial<MotorbikeQuote>) => void;
  onNext: () => void;
  onBack: () => void;
}

const FLOOR_OPTIONS = ['Basement', 'Ground floor', '1st', '2nd', '3rd', '4th', '5th+'];

export function MotorbikeStep4Access({ data, onChange, onNext, onBack }: StepProps) {
  // Access Notes
  const [pickupNotes, setPickupNotes] = useState(data.accessDetails?.pickupNotes || '');
  const [deliveryNotes, setDeliveryNotes] = useState(data.accessDetails?.deliveryNotes || '');
  const [specialRequirements, setSpecialRequirements] = useState(data.accessDetails?.specialRequirements || '');
  
  // Contact Info
  const [name, setName] = useState(data.contactDetails?.name || '');
  const [email, setEmail] = useState(data.contactDetails?.email || '');
  const [phone, setPhone] = useState(data.contactDetails?.phone || '');
  
  // Customer Address (Requested by user)
  const [streetAddress, setStreetAddress] = useState(data.contactDetails?.streetAddress || '43 Kingswood Drive, Glasgow, G44 4RF, Scotland');
  const [addressLine2, setAddressLine2] = useState(data.contactDetails?.addressLine2 || 'Apartment 4B');
  const [city, setCity] = useState(data.contactDetails?.city || 'Glasgow');
  const [postcode, setPostcode] = useState(data.contactDetails?.postcode || 'G44 4RF');

  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    const newErrors = [];
    if (!name.trim()) newErrors.push('Full name is required');
    if (!email.trim() || !email.includes('@')) newErrors.push('A valid email is required');
    if (!phone.trim() || phone.length < 10) newErrors.push('A valid phone number is required');
    if (!streetAddress.trim()) newErrors.push('Street address is required');
    if (!city.trim()) newErrors.push('City is required');
    if (!postcode.trim()) newErrors.push('Postcode is required');
    setErrors(newErrors);
  }, [name, email, phone, streetAddress, city, postcode]);

  const isFormValid = errors.length === 0;

  const handleNext = () => {
    if (!isFormValid) return;
    
    onChange({
      contactDetails: { 
        name, 
        email, 
        phone,
        streetAddress,
        addressLine2,
        city,
        postcode
      },
      accessDetails: { pickupNotes, deliveryNotes, specialRequirements }
    });
    
    onNext();
  };

  const pickupFloor = FLOOR_OPTIONS[data.pickup.floor] || 'Ground floor';
  const deliveryFloor = FLOOR_OPTIONS[data.dropoff.floor] || 'Ground floor';
  const moveDate = data.date && !data.dateUnsure
    ? (data.date instanceof Date ? data.date.toISOString().split('T')[0] : typeof data.date === 'string' ? data.date : '')
    : undefined;

  const items = data.items || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-6 lg:gap-8">
        <div className="space-y-6 order-last lg:order-first">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:p-8">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <User className="w-6 h-6 text-blue-600" />
                Contact & Your Details
              </h2>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full border border-blue-100">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Step 4 of 6</span>
              </div>
            </div>

            <div className="space-y-8">
              {/* 1. Access Instructions */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-sm">1</div>
                  <h3 className="text-lg font-bold text-slate-900">Access Instructions</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Pickup Access Notes</label>
                    <textarea
                      value={pickupNotes}
                      onChange={(e) => setPickupNotes(e.target.value)}
                      placeholder="e.g. Entrance is around the back, tight turn..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all resize-none text-sm"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Delivery Access Notes</label>
                    <textarea
                      value={deliveryNotes}
                      onChange={(e) => setDeliveryNotes(e.target.value)}
                      placeholder="e.g. Buzz flat 4, second floor..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all resize-none text-sm"
                      rows={2}
                    />
                  </div>
                </div>
              </section>

              {/* 2. Your Information */}
              <section className="space-y-6 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-sm">2</div>
                  <h3 className="text-lg font-bold text-slate-900">Your Information</h3>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Your Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-300 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address *</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="john@example.com"
                          className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-300 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number *</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="07123 456789"
                          className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-300 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 3. Your Address (Requested) */}
              <section className="space-y-6 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-sm">3</div>
                  <h3 className="text-lg font-bold text-slate-900">Your Address</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Street Address *</label>
                    <div className="relative">
                      <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={streetAddress}
                        onChange={(e) => setStreetAddress(e.target.value)}
                        placeholder="Street Address"
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-300 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Address Line 2 (Optional)</label>
                    <input
                      type="text"
                      value={addressLine2}
                      onChange={(e) => setAddressLine2(e.target.value)}
                      placeholder="Apartment, suite, etc."
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">City *</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="City"
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Postcode *</label>
                      <input
                        type="text"
                        value={postcode}
                        onChange={(e) => setPostcode(e.target.value)}
                        placeholder="Postcode"
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Error List */}
            {!isFormValid && errors.length > 0 && (
              <div className="mt-8 p-4 bg-red-50 border border-red-100 rounded-xl">
                <p className="text-xs font-bold text-red-600 mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Please complete:
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                  {errors.map((err, i) => (
                    <li key={i} className="text-[10px] text-red-500 flex items-center gap-1.5 font-medium">
                      <span className="w-1 h-1 rounded-full bg-red-400"></span>
                      {err}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center justify-between gap-4 pt-8 mt-10 border-t border-slate-100">
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all border border-transparent"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!isFormValid}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-10 py-4 rounded-xl font-black text-lg transition-all ${
                  !isFormValid
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-xl hover:-translate-y-0.5 shadow-lg active:translate-y-0'
                }`}
              >
                Review Quote
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:sticky lg:top-4 lg:self-start order-first lg:order-last">
          {/* Quote Reference - Consistent with Step 2 */}
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

          {/* Map - Consistent with Step 2 */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
            <MapView
              pickupLat={data.pickup.lat}
              pickupLng={data.pickup.lng}
              deliveryLat={data.dropoff.lat}
              deliveryLng={data.dropoff.lng}
              onRouteUpdate={() => {}}
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
          
          <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-xl">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              Professional Care
            </h3>
            <p className="text-xs text-blue-100 leading-relaxed">
              We use specialized ramps and straps to ensure your motorbike or bicycle is transported with maximum security. All vehicles are covered by our comprehensive insurance policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
