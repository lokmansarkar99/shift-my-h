/**
 * House Move - Step 5: Contact Details & Review
 * COMPLETELY UNIQUE SHIFTMYHOME DESIGN - NOT AnyVan Copy
 * All logic preserved, completely different visual design
 */

import React, { useState } from 'react';
import { HouseMoveQuote } from './houseMoveTypes';
import { ArrowRight, ArrowLeft, User, Phone, Mail, MapPin, Shield, CreditCard, CheckCircle, Building2, MessageSquare, Sparkles } from 'lucide-react';
import { HouseMoveMapPanel } from './HouseMoveMapPanel';
import { MoveSummaryCard } from '../../MoveSummaryCard';
import { PaymentModal, PaymentData } from '../../PaymentModal';

interface StepProps {
  data: HouseMoveQuote;
  onChange: (updates: Partial<HouseMoveQuote>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step5Contact({ data, onChange, onNext, onBack }: StepProps) {
  // Booking Details
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isBusinessCustomer, setIsBusinessCustomer] = useState(false);
  const [companyName, setCompanyName] = useState('');

  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Pickup Contact
  const [useMyDetailsPickup, setUseMyDetailsPickup] = useState(false);
  const [pickupContactName, setPickupContactName] = useState('');
  const [pickupContactPhone, setPickupContactPhone] = useState('');
  const [pickupInstructions, setPickupInstructions] = useState('');

  // Delivery Contact
  const [useMyDetailsDelivery, setUseMyDetailsDelivery] = useState(false);
  const [deliveryContactName, setDeliveryContactName] = useState('');
  const [deliveryContactPhone, setDeliveryContactPhone] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');

  // Auto-fill from main contact
  const handleUseMyDetailsPickup = (use: boolean) => {
    setUseMyDetailsPickup(use);
    if (use) {
      setPickupContactName(`${firstName} ${lastName}`.trim());
      setPickupContactPhone(phone);
    } else {
      setPickupContactName('');
      setPickupContactPhone('');
    }
  };

  const handleUseMyDetailsDelivery = (use: boolean) => {
    setUseMyDetailsDelivery(use);
    if (use) {
      setDeliveryContactName(`${firstName} ${lastName}`.trim());
      setDeliveryContactPhone(phone);
    } else {
      setDeliveryContactName('');
      setDeliveryContactPhone('');
    }
  };

  const isFormValid = 
    firstName && 
    lastName && 
    email && 
    phone && 
    pickupContactName && 
    pickupContactPhone && 
    deliveryContactName && 
    deliveryContactPhone;

  const handleSubmit = () => {
    if (!isFormValid) return;
    onChange({
      // Store contact details (will be added to type later)
    });
    setShowPaymentModal(true);
  };

  const totalPrice = data.pricing?.totalPrice || 0;
  const isPremium = data.pricing?.packageType === 'premium';

  return (
    <div className="space-y-6">
      {/* 2 Column Layout - 60/40 split */}
      <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-6 lg:gap-8">
        {/* LEFT COLUMN - Form (60%) */}
        <div className="space-y-6 order-last lg:order-first">
          
          {/* Step Title */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <User className="w-7 h-7" />
              <h1 className="text-3xl font-black">Almost There!</h1>
            </div>
            <p className="text-blue-100 text-sm">Just a few details to complete your booking</p>
          </div>

          {/* Main Contact Card - Single Column Design */}
          <div className="bg-white rounded-2xl shadow-md border-2 border-slate-200 p-8">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b-2 border-slate-100">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-md">
                <User className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900">Your Details</h2>
                <p className="text-slate-600 text-sm">How can we reach you?</p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Name Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    className="w-full px-4 py-3.5 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Smith"
                    className="w-full px-4 py-3.5 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 font-medium"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john.smith@email.com"
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 font-medium"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="07123 456789"
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 font-medium"
                    required
                  />
                </div>
              </div>

              {/* Business Customer Toggle */}
              <div className="pt-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={isBusinessCustomer}
                      onChange={(e) => setIsBusinessCustomer(e.target.checked)}
                      className="w-6 h-6 text-blue-600 focus:ring-blue-500 rounded-md border-2 border-slate-300"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                      I'm booking for my business
                    </span>
                  </div>
                </label>

                {isBusinessCustomer && (
                  <div className="mt-4 pl-9">
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Company Name"
                      className="w-full px-4 py-3 border-2 border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-blue-50 text-slate-900 font-medium"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Points - Side by Side Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Pickup Contact */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-md border-2 border-green-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shadow-sm">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-green-900">Pickup Contact</h3>
                  <p className="text-xs text-green-700">Who will be there?</p>
                </div>
              </div>

              <div className="space-y-3">
                {/* Quick Fill Button */}
                <button
                  type="button"
                  onClick={() => handleUseMyDetailsPickup(!useMyDetailsPickup)}
                  className={`w-full py-2.5 px-4 rounded-lg font-bold text-sm transition-all ${
                    useMyDetailsPickup
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-white text-green-700 border-2 border-green-300 hover:bg-green-100'
                  }`}
                >
                  {useMyDetailsPickup ? '✓ Using My Details' : 'Use My Details'}
                </button>

                <input
                  type="text"
                  value={pickupContactName}
                  onChange={(e) => setPickupContactName(e.target.value)}
                  placeholder="Contact Name *"
                  disabled={useMyDetailsPickup}
                  className="w-full px-4 py-3 border-2 border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-white text-slate-900 font-medium disabled:bg-green-100 disabled:text-slate-600"
                  required
                />

                <input
                  type="tel"
                  value={pickupContactPhone}
                  onChange={(e) => setPickupContactPhone(e.target.value)}
                  placeholder="Phone Number *"
                  disabled={useMyDetailsPickup}
                  className="w-full px-4 py-3 border-2 border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-white text-slate-900 font-medium disabled:bg-green-100 disabled:text-slate-600"
                  required
                />

                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-green-600" />
                  <textarea
                    value={pickupInstructions}
                    onChange={(e) => setPickupInstructions(e.target.value)}
                    placeholder="Special instructions (gate code, parking, etc.)"
                    className="w-full pl-10 pr-4 py-3 border-2 border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all resize-none bg-white text-slate-900"
                    rows={2}
                  />
                </div>
              </div>
            </div>

            {/* Delivery Contact */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-md border-2 border-purple-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-sm">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-purple-900">Delivery Contact</h3>
                  <p className="text-xs text-purple-700">Who will be there?</p>
                </div>
              </div>

              <div className="space-y-3">
                {/* Quick Fill Button */}
                <button
                  type="button"
                  onClick={() => handleUseMyDetailsDelivery(!useMyDetailsDelivery)}
                  className={`w-full py-2.5 px-4 rounded-lg font-bold text-sm transition-all ${
                    useMyDetailsDelivery
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-white text-purple-700 border-2 border-purple-300 hover:bg-purple-100'
                  }`}
                >
                  {useMyDetailsDelivery ? '✓ Using My Details' : 'Use My Details'}
                </button>

                <input
                  type="text"
                  value={deliveryContactName}
                  onChange={(e) => setDeliveryContactName(e.target.value)}
                  placeholder="Contact Name *"
                  disabled={useMyDetailsDelivery}
                  className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-white text-slate-900 font-medium disabled:bg-purple-100 disabled:text-slate-600"
                  required
                />

                <input
                  type="tel"
                  value={deliveryContactPhone}
                  onChange={(e) => setDeliveryContactPhone(e.target.value)}
                  placeholder="Phone Number *"
                  disabled={useMyDetailsDelivery}
                  className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-white text-slate-900 font-medium disabled:bg-purple-100 disabled:text-slate-600"
                  required
                />

                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-purple-600" />
                  <textarea
                    value={deliveryInstructions}
                    onChange={(e) => setDeliveryInstructions(e.target.value)}
                    placeholder="Special instructions (gate code, parking, etc.)"
                    className="w-full pl-10 pr-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all resize-none bg-white text-slate-900"
                    rows={2}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={onBack}
              className="px-6 py-4 text-slate-700 font-bold hover:bg-slate-100 rounded-xl transition-colors border-2 border-slate-300 flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isFormValid}
              className="flex-1 px-8 py-4 rounded-xl font-black text-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Continue to Confirmation
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN - Summary (40%) */}
        <div className="space-y-6 lg:sticky lg:top-4 lg:self-start order-first lg:order-last">
          {/* Payment Protection - FIRST POSITION! */}
          <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl shadow-md border-2 border-green-300 p-6">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-10 h-10 text-green-700" />
              <h3 className="text-lg font-black text-green-900">Commitment-Free Booking</h3>
            </div>
            <p className="text-sm text-green-800 mb-3 font-medium leading-relaxed">
              <span className="font-black">No payment required right now.</span> We simply verify your card for security. <span className="font-bold">Charges only happen 3 days before</span> your scheduled move date.
            </p>
            <div className="flex items-center gap-2 text-xs text-green-700 font-bold">
              <CheckCircle className="w-4 h-4" />
              <span>Change your mind? Cancel anytime before 48 hours</span>
            </div>
          </div>

          {/* Quote Reference - AFTER PAYMENT */}
          <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl shadow-lg p-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-100 font-semibold mb-1">Your Quote Reference</p>
                <p className="text-2xl font-black tracking-tight">
                  {data.quoteReference || 'SMH-' + Date.now().toString().slice(-6)}
                </p>
              </div>
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
            duration={data.duration}
            moveDate={data.date ? new Date(data.date).toISOString().split('T')[0] : undefined}
            hasDateSelected={!!data.date}
            arrivalTimeFrom={480}
            arrivalTimeTo={600}
            selectedItems={data.items?.map(item => ({
              id: item.id,
              name: item.name,
              quantity: item.quantity,
              volume: item.volume || 0.1,
            })) || []}
          />

          {/* Package Badge */}
          <div className={`rounded-2xl shadow-lg p-6 ${isPremium ? 'bg-gradient-to-br from-amber-400 to-orange-500' : 'bg-gradient-to-br from-blue-500 to-cyan-600'}`}>
            <div className="flex items-center gap-3 mb-3">
              {isPremium ? (
                <Sparkles className="w-8 h-8 text-white" />
              ) : (
                <CheckCircle className="w-8 h-8 text-white" />
              )}
              <div>
                <h3 className="text-xl font-black text-white">
                  {isPremium ? 'Premium Service' : 'Standard Service'}
                </h3>
                <p className="text-xs text-white/80">
                  {isPremium ? 'White-glove experience' : 'Professional & reliable'}
                </p>
              </div>
            </div>
            <div className="space-y-1.5">
              {isPremium ? (
                <>
                  <div className="flex items-center gap-2 text-sm text-white/95">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    <span>Full packing & unpacking</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/95">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    <span>Furniture assembly service</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/95">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    <span>Premium materials included</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/95">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    <span>Priority support</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-sm text-white/95">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    <span>Experienced team</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/95">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    <span>Safe transport</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/95">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    <span>Fully insured</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Total Price */}
          <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-300 p-6">
            <div className="text-sm text-slate-600 mb-2 font-semibold">Total Price</div>
            <div className="text-5xl font-black text-slate-900 mb-4">
              £{totalPrice.toFixed(2)}
            </div>
            <div className="flex flex-wrap gap-2 pt-4 border-t-2 border-slate-200">
              <div className="px-3 py-2 bg-slate-100 rounded-lg">
                <svg className="h-5" viewBox="0 0 40 26" fill="none">
                  <rect width="40" height="26" rx="4" fill="#1434CB"/>
                  <path d="M16 13L14 11H12V15H14L16 13Z" fill="white"/>
                </svg>
              </div>
              <div className="px-3 py-2 bg-slate-100 rounded-lg">
                <svg className="h-5" viewBox="0 0 40 26" fill="none">
                  <rect width="40" height="26" rx="4" fill="#EB001B"/>
                  <circle cx="20" cy="13" r="8" fill="#F79E1B"/>
                </svg>
              </div>
              <div className="px-3 py-2 bg-slate-100 rounded-lg flex items-center">
                <CreditCard className="w-5 h-5 text-slate-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && data.date && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onSubmit={(paymentData: PaymentData) => {
            console.log('Payment submitted:', paymentData);
            // Here you would typically save payment data and proceed to confirmation
            onNext();
          }}
          totalPrice={totalPrice}
          moveDate={typeof data.date === 'string' ? new Date(data.date) : data.date}
        />
      )}
    </div>
  );
}