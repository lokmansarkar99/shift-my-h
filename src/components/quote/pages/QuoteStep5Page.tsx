import React, { useState, useEffect } from 'react';
import { QuoteHeader } from '../QuoteHeader';
import { QuoteProgressBar } from '../QuoteProgressBar';
import { router } from '../../../utils/router';
import { getQuoteData, saveQuoteData } from '../../../utils/quoteStorage';
import { ArrowLeft, User, Mail, Phone, MapPin, Shield, AlertCircle, Clock } from 'lucide-react';
import { formatDuration } from '../../../utils/timeFormatters';
import { QuoteSummaryPanel } from '../QuoteSummaryPanel';

export function QuoteStep5Page() {
  const [quoteData, setQuoteData] = useState(getQuoteData());
  
  // Customer details
  const [firstName, setFirstName] = useState(quoteData.firstName || '');
  const [lastName, setLastName] = useState(quoteData.lastName || '');
  const [email, setEmail] = useState(quoteData.email || '');
  const [phone, setPhone] = useState(quoteData.phone || '');
  
  // Pickup contact
  const [useSameForPickup, setUseSameForPickup] = useState(true);
  const [pickupContactName, setPickupContactName] = useState(quoteData.pickupContactName || '');
  const [pickupContactPhone, setPickupContactPhone] = useState(quoteData.pickupContactPhone || '');
  
  // Delivery contact
  const [useSameForDelivery, setUseSameForDelivery] = useState(true);
  const [deliveryContactName, setDeliveryContactName] = useState(quoteData.deliveryContactName || '');
  const [deliveryContactPhone, setDeliveryContactPhone] = useState(quoteData.deliveryContactPhone || '');

  // 🕐 Calculate if move is within 72 hours (URGENT BOOKING)
  const isUrgentBooking = () => {
    if (!quoteData.moveDate) return false;
    
    const now = new Date();
    const moveDate = new Date(quoteData.moveDate);
    
    // If arrivalTimeFrom exists, use it to get more precise timing
    if (quoteData.arrivalTimeFrom !== undefined) {
      const hours = Math.floor(quoteData.arrivalTimeFrom / 60);
      const minutes = quoteData.arrivalTimeFrom % 60;
      moveDate.setHours(hours, minutes, 0, 0);
    } else {
      // Default to 8:00 AM if no time specified
      moveDate.setHours(8, 0, 0, 0);
    }
    
    const timeDifferenceMs = moveDate.getTime() - now.getTime();
    const timeDifferenceHours = timeDifferenceMs / (1000 * 60 * 60);
    
    return timeDifferenceHours < 72;
  };

  const urgentBooking = isUrgentBooking();
  const paymentMode = urgentBooking ? 'immediate_charge' : 'card_validation_only';

  useEffect(() => {
    setQuoteData(getQuoteData());
  }, []);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save contact details + payment mode
    saveQuoteData({
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      email,
      phone,
      pickupContactName: useSameForPickup ? `${firstName} ${lastName}` : pickupContactName,
      pickupContactPhone: useSameForPickup ? phone : pickupContactPhone,
      deliveryContactName: useSameForDelivery ? `${firstName} ${lastName}` : deliveryContactName,
      deliveryContactPhone: useSameForDelivery ? phone : deliveryContactPhone,
      paymentMode, // ✅ Save payment mode for Step 6
    });
    
    // Navigate to Step 6 (Payment)
    router.navigate({ page: 'quote-step', step: 6 });
  };

  const handleBack = () => {
    router.navigate({ page: 'quote-step', step: 4 });
  };

  const totalPrice = quoteData.finalTotalPrice || quoteData.selectedPackagePrice || 0;
  const itemsCount = quoteData.selectedItems?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <QuoteHeader />
      <QuoteProgressBar currentStep={5} />

      <div className="flex-1 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT CONTENT: Contact Details Form (60%) */}
            <div className="lg:col-span-7">
              <form onSubmit={handleNext} className="space-y-6">
                {/* Your Booking Details */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
                  <h2 className="text-xl font-bold text-slate-900 mb-6">Your Booking Details</h2>
                  
                  <div className="space-y-4">
                    {/* First and Last Name */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        First and Last Name
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="First name"
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-red-500 focus:outline-none"
                          required
                        />
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Last name"
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-red-500 focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    {/* Email and Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your.email@example.com"
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-red-500 focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="07700 900000"
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-red-500 focus:outline-none"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pickup Details */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
                  <div className="flex items-center gap-2 mb-6">
                    <MapPin className="w-5 h-5 text-red-600" />
                    <h2 className="text-xl font-bold text-slate-900">Pickup Contact</h2>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Address display */}
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <p className="text-sm font-medium text-slate-900">
                        {quoteData.pickupAddress || 'Not specified'}
                      </p>
                    </div>

                    {/* Use my contact details checkbox */}
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useSameForPickup}
                        onChange={(e) => setUseSameForPickup(e.target.checked)}
                        className="mt-1"
                      />
                      <span className="text-sm text-slate-700">Use my contact details</span>
                    </label>

                    {!useSameForPickup && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Contact Name at Pickup
                          </label>
                          <input
                            type="text"
                            value={pickupContactName}
                            onChange={(e) => setPickupContactName(e.target.value)}
                            placeholder="Full name"
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-red-500 focus:outline-none"
                            required={!useSameForPickup}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Pickup Contact Number
                          </label>
                          <input
                            type="tel"
                            value={pickupContactPhone}
                            onChange={(e) => setPickupContactPhone(e.target.value)}
                            placeholder="07700 900000"
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-red-500 focus:outline-none"
                            required={!useSameForPickup}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Delivery Details */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
                  <div className="flex items-center gap-2 mb-6">
                    <MapPin className="w-5 h-5 text-green-600" />
                    <h2 className="text-xl font-bold text-slate-900">Delivery Contact</h2>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Address display */}
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <p className="text-sm font-medium text-slate-900">
                        {quoteData.deliveryAddress || 'Not specified'}
                      </p>
                    </div>

                    {/* Use my contact details checkbox */}
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useSameForDelivery}
                        onChange={(e) => setUseSameForDelivery(e.target.checked)}
                        className="mt-1"
                      />
                      <span className="text-sm text-slate-700">Use my contact details</span>
                    </label>

                    {!useSameForDelivery && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Contact Name at Delivery
                          </label>
                          <input
                            type="text"
                            value={deliveryContactName}
                            onChange={(e) => setDeliveryContactName(e.target.value)}
                            placeholder="Full name"
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-red-500 focus:outline-none"
                            required={!useSameForDelivery}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Delivery Contact Number
                          </label>
                          <input
                            type="tel"
                            value={deliveryContactPhone}
                            onChange={(e) => setDeliveryContactPhone(e.target.value)}
                            placeholder="07700 900000"
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-red-500 focus:outline-none"
                            required={!useSameForDelivery}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="w-full sm:flex-1 bg-slate-100 text-slate-700 font-bold py-4 px-6 rounded-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-4 px-6 rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-lg"
                  >
                    Continue to Payment
                  </button>
                </div>
              </form>
            </div>

            {/* RIGHT SIDEBAR: Move Summary (40%) */}
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-4 space-y-4">
                {/* Payment Banner - Dynamic based on 72h rule */}
                {urgentBooking ? (
                  // ⚠️ URGENT BOOKING: < 72 hours - PAYMENT REQUIRED NOW
                  <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-300 rounded-2xl p-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-block px-2 py-1 bg-red-600 text-white text-xs font-bold rounded uppercase">
                            Urgent Booking
                          </span>
                        </div>
                        <h3 className="font-bold text-red-900 mb-2">Payment required now</h3>
                        <p className="text-sm text-red-800">
                          Your move is scheduled within 72 hours, so full payment is required immediately to confirm the booking.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  // ✅ STANDARD BOOKING: >= 72 hours - CARD VALIDATION ONLY
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-6">
                    <div className="flex items-start gap-3">
                      <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-bold text-blue-900 mb-2">Pay nothing now!</h3>
                        <p className="text-sm text-blue-800">
                          We only validate your card to secure the booking. We won't charge your card until 72 hours before your move.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Move Summary */}
                <QuoteSummaryPanel
                  quote={{
                    breakdown: {
                      total: totalPrice,
                      base: quoteData.selectedPackagePrice || 0,
                      distance: 0,
                      crew: 0,
                      inventory: 0,
                      access: 0,
                      extrasPrice: (quoteData.finalTotalPrice || 0) - (quoteData.selectedPackagePrice || 0),
                      date: 0,
                      deposit: 0,
                    },
                    distance: quoteData.distance || 0,
                    estimatedDuration: quoteData.duration || '0 mins',
                    estimatedVolume: quoteData.furnitureTotalVolume || 0,
                    recommendedVehicle: quoteData.furnitureTotalVolume < 5 ? 'Small Van' : quoteData.furnitureTotalVolume < 12 ? 'Medium Van' : 'Large Van',
                  }}
                  isLoading={false}
                  serviceType={quoteData.serviceCategory || 'furniture_items'}
                  pickupAddress={quoteData.pickupAddress}
                  deliveryAddress={quoteData.deliveryAddress}
                  pickupCoords={quoteData.pickupLat && quoteData.pickupLng ? { lat: quoteData.pickupLat, lng: quoteData.pickupLng } : undefined}
                  deliveryCoords={quoteData.deliveryLat && quoteData.deliveryLng ? { lat: quoteData.deliveryLat, lng: quoteData.deliveryLng } : undefined}
                  currentStep={5}
                  selectedItems={quoteData.selectedItems || []}
                  extras={Object.entries(quoteData.furnitureExtras || {}).map(([key, value]) => ({
                    id: key,
                    name: key.replace(/([A-Z])/g, ' $1').trim(),
                    quantity: typeof value === 'number' ? value : 0,
                    enabled: typeof value === 'boolean' ? value : false,
                  }))}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}