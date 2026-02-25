import React, { useState, useEffect } from 'react';
import { QuoteHeader } from '../QuoteHeader';
import { QuoteProgressBar } from '../QuoteProgressBar';
import { router } from '../../../utils/router';
import { getQuoteData, saveQuoteData, clearQuoteData } from '../../../utils/quoteStorage';
import { ArrowLeft, CreditCard, Check, Clock, MapPin, Package, Home, Calendar, User, Phone, Mail, X, ChevronDown, ChevronUp, TruckIcon, Shield, Zap, Info } from 'lucide-react';
import { calculatePrice } from '../../../utils/pricingEngine';
import { savePricingResult } from '../../../utils/pricingResultsService';
import { formatDuration } from '../../../utils/timeFormatters';
import { QuoteSummaryPanel } from '../QuoteSummaryPanel';

export function QuoteStep6Page() {
  const [quoteData, setQuoteData] = useState(getQuoteData());
  const [submitted, setSubmitted] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  // 🕐 Get payment mode from Step 5 (set by 72h rule)
  const paymentMode = quoteData.paymentMode || 'card_validation_only';
  const isUrgentBooking = paymentMode === 'immediate_charge';
  
  // Payment option - forced based on payment mode
  const [paymentOption, setPaymentOption] = useState<'pay-today' | 'book-later'>(
    isUrgentBooking ? 'pay-today' : 'book-later'
  );
  
  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [country, setCountry] = useState('United Kingdom');
  const [postalCode, setPostalCode] = useState('');
  const [agreedToMarketplace, setAgreedToMarketplace] = useState(false);

  // 🎯 NEW: Inventory view state
  const [isInventoryExpanded, setIsInventoryExpanded] = useState(false);

  useEffect(() => {
    setQuoteData(getQuoteData());
  }, []);

  const totalPrice = quoteData.finalTotalPrice || quoteData.selectedPackagePrice || 0;
  const itemsCount = quoteData.selectedItems?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('📤 [QuoteStep6] Submitting booking:', quoteData);
    
    try {
      // ✅ RECALCULATE FULL PRICING WITH AUDIT DATA
      if (quoteData.selectedItems && quoteData.selectedItems.length > 0) {
        const inventory = quoteData.selectedItems.map((item: any) => ({
          id: item.id,
          quantity: item.quantity,
        }));
        
        const packageMultiplier = quoteData.selectedPackageId === 'premium' ? 1.2 : 1.0;
        
        console.log('💰 [QuoteStep6] Calculating final pricing...', {
          inventory,
          distance: quoteData.distance,
          packageMultiplier,
        });
        
        const fullPricing = calculatePrice({
          distanceMiles: quoteData.distance || 0,
          inventory,
          propertyType: quoteData.pickupPropertyType,
          moveDate: quoteData.moveDate ? new Date(quoteData.moveDate) : undefined,
          flexibleDate: quoteData.isFlexibleDate,
          fromFloor: quoteData.pickupFloor,
          toFloor: quoteData.deliveryFloor,
          fromLift: quoteData.liftAvailableAtPickup,
          toLift: quoteData.liftAvailableAtDelivery,
          fromParking: quoteData.parkingAtPickup,
          toParking: quoteData.parkingAtDelivery,
          packageMultiplier,
        });
        
        console.log('📊 [QuoteStep6] Full pricing calculated:', {
          hasAuditData: !!fullPricing.auditData,
          hasVolumeBreakdown: !!fullPricing.volumeBreakdown,
          totalPrice: fullPricing.totalPrice,
        });
        
        const saveResult = await savePricingResult({
          customerName: quoteData.name || 'Website Customer',
          customerEmail: quoteData.email || '',
          serviceType: `${quoteData.selectedPackageId === 'premium' ? 'Premium' : 'Standard'} - ${quoteData.serviceType || 'House Move'}`,
          pricingResult: fullPricing,
          quoteReference: quoteData.quoteRef,
          metadata: {
            pickupAddress: quoteData.pickupAddress,
            deliveryAddress: quoteData.deliveryAddress,
            moveDate: quoteData.moveDate,
            phone: quoteData.phone,
            specialNotes: quoteData.specialNotes,
            paymentOption,
            cardLast4: cardNumber.slice(-4),
          },
        });
        
        if (saveResult) {
          console.log('✅ [QuoteStep6] Pricing result saved successfully:', saveResult.id);
        } else {
          console.warn('⚠️ [QuoteStep6] Pricing result save returned null');
        }
      }
    } catch (error) {
      console.error('❌ [QuoteStep6] Error saving pricing result:', error);
    }
    
    // Save payment info
    saveQuoteData({
      paymentOption,
      cardLast4: cardNumber.slice(-4),
    });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setShowPaymentModal(false);
    setSubmitted(true);
    
    // Clear data after submission
    setTimeout(() => {
      clearQuoteData();
      router.navigate({ page: 'home' });
    }, 3000);
  };

  const handleBack = () => {
    router.navigate({ page: 'quote-step', step: 5 });
  };

  // Format card number (XXXX XXXX XXXX XXXX)
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(' ');
  };

  // Format expiry (MM/YY)
  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + ' / ' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  // 🎯 Helper function to group inventory by category
  const groupInventoryByCategory = () => {
    if (!quoteData.selectedItems || quoteData.selectedItems.length === 0) {
      return {};
    }
    
    const grouped: Record<string, any[]> = {};
    
    quoteData.selectedItems.forEach((item: any) => {
      let category = 'Other';
      
      const itemNameLower = item.name.toLowerCase();
      
      // Categorize based on item name keywords
      if (itemNameLower.includes('sofa') || itemNameLower.includes('tv') || itemNameLower.includes('coffee') || itemNameLower.includes('table') || itemNameLower.includes('chair')) {
        category = 'Living';
      } else if (itemNameLower.includes('bed') || itemNameLower.includes('mattress') || itemNameLower.includes('wardrobe') || itemNameLower.includes('dresser')) {
        category = 'Bedroom';
      } else if (itemNameLower.includes('box') || itemNameLower.includes('clothing') || itemNameLower.includes('suitcase')) {
        category = 'Boxes & Items';
      }
      
      if (!grouped[category]) {
        grouped[category] = [];
      }
      
      grouped[category].push(item);
    });
    
    return grouped;
  };

  // Extract city name from full address
  const getCityFromAddress = (address: string) => {
    if (!address) return '';
    // Try to extract city (usually after first comma)
    const parts = address.split(',');
    if (parts.length >= 2) {
      return parts[parts.length - 2].trim();
    }
    return address.split(',')[0].trim();
  };

  // Success screen
  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <QuoteHeader />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center border-2 border-green-200">
            <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">
              Booking Confirmed!
            </h2>
            <p className="text-slate-600 mb-2 text-lg">
              Thank you for choosing ShiftMyHome
            </p>
            <p className="text-slate-600 mb-6">
              You'll receive a confirmation email shortly.
            </p>
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <p className="text-sm font-semibold text-slate-700 mb-1">
                Your Booking Reference:
              </p>
              <p className="text-lg font-bold text-red-600">
                {quoteData.quoteRef}
              </p>
            </div>
            <p className="text-sm text-slate-500 mt-6 flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" />
              Redirecting to homepage...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <QuoteHeader />
      <QuoteProgressBar currentStep={6} />

      <div className="flex-1 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT: Review Summary (60%) */}
            <div className="lg:col-span-7">
              <div className="space-y-6">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                    Review Your Booking
                  </h1>
                  <p className="text-slate-600">
                    Please check all details before confirming your move
                  </p>
                </div>

                {/* Quote Reference */}
                <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 border-2 border-red-200">
                  <div className="text-sm font-semibold text-red-700 uppercase mb-1">
                    Your Booking Reference
                  </div>
                  <div className="text-2xl font-bold text-slate-900">
                    {quoteData.quoteRef || 'SMH-XXXXXXXX'}
                  </div>
                </div>

                {/* Addresses */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-red-600" />
                    Route Details
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Pickup Address</div>
                      <div className="text-slate-900 font-medium">{quoteData.pickupAddress || '—'}</div>
                      {quoteData.pickupPropertyType && (
                        <div className="text-sm text-slate-600 mt-1">
                          Property: {quoteData.pickupPropertyType} • Floor: {quoteData.pickupFloor || 'Ground'}
                        </div>
                      )}
                    </div>

                    <div className="border-t border-slate-200 pt-4">
                      <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Delivery Address</div>
                      <div className="text-slate-900 font-medium">{quoteData.deliveryAddress || '—'}</div>
                      {quoteData.deliveryPropertyType && (
                        <div className="text-sm text-slate-600 mt-1">
                          Property: {quoteData.deliveryPropertyType} • Floor: {quoteData.deliveryFloor || 'Ground'}
                        </div>
                      )}
                    </div>

                    {quoteData.distance && (
                      <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-slate-700">Distance</span>
                          <span className="text-sm font-bold text-slate-900">
                            {quoteData.distance.toFixed(1)} miles • {quoteData.duration ? formatDuration(quoteData.duration) : '—'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Customer Details */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-red-600" />
                    Contact Information
                  </h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Full Name</div>
                      <div className="text-slate-900 font-medium">{quoteData.name || '—'}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Phone</div>
                      <div className="text-slate-900 font-medium flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-400" />
                        {quoteData.phone || '—'}
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Email</div>
                      <div className="text-slate-900 font-medium flex items-center gap-2">
                        <Mail className="w-4 h-4 text-slate-400" />
                        {quoteData.email || '—'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Move Details */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-red-600" />
                    Move Details
                  </h2>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                      <span className="text-sm text-slate-600">Package</span>
                      <span className="font-bold text-slate-900">
                        {quoteData.selectedPackageId === 'premium' ? 'Premium - Full Pack & Move' : 'Standard Removal'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                      <span className="text-sm text-slate-600">Inventory Items</span>
                      <span className="font-bold text-slate-900">{itemsCount} items</span>
                    </div>

                    {quoteData.moveDate && (
                      <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                        <span className="text-sm text-slate-600">Move Date</span>
                        <span className="font-bold text-slate-900 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          {new Date(quoteData.moveDate).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    )}

                    {quoteData.specialNotes && (
                      <div>
                        <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Special Notes</div>
                        <div className="text-sm text-slate-700 bg-slate-50 rounded-lg p-3 border border-slate-200">
                          {quoteData.specialNotes}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex flex-col-reverse sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="w-full sm:w-auto text-slate-600 hover:text-slate-900 font-semibold py-4 px-6 transition-all flex items-center justify-center sm:justify-start gap-2 underline"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(true)}
                    className="w-full sm:flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-5 px-8 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <CreditCard className="w-6 h-6" />
                    Continue to Payment
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT: Your Move Summary (40%) */}
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-4 space-y-4">
                {/* 🎯 Payment Safety Message - VERY IMPORTANT */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-300">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-blue-900 text-lg mb-2">
                        Pay nothing now!
                      </h3>
                      <p className="text-sm text-blue-800 leading-relaxed">
                        We only validate your card to secure the booking.
                        <strong className="block mt-1">Your card will NOT be charged until 72 hours before your move.</strong>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Your Move Summary */}
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
                  currentStep={6}
                  selectedItems={quoteData.selectedItems || []}
                  extras={Object.entries(quoteData.furnitureExtras || {}).map(([key, value]) => ({
                    id: key,
                    name: key.replace(/([A-Z])/g, ' $1').trim(),
                    quantity: typeof value === 'number' ? value : 0,
                    enabled: typeof value === 'boolean' ? value : false,
                  }))}
                />

                {/* Payment Icons & Helper Text */}
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <svg className="w-10 h-6" viewBox="0 0 32 20" fill="none">
                      <rect width="32" height="20" rx="3" fill="#1434CB"/>
                      <path d="M12.5 5h7v10h-7z" fill="#FF9800"/>
                      <circle cx="12" cy="10" r="5" fill="#EB001B"/>
                      <circle cx="20" cy="10" r="5" fill="#FF9800"/>
                    </svg>
                    <svg className="w-10 h-6" viewBox="0 0 32 20" fill="none">
                      <rect width="32" height="20" rx="3" fill="#00579F"/>
                      <path d="M18 6l-2 4h4l-2 4" fill="#FFA500"/>
                    </svg>
                    <svg className="w-12 h-8" viewBox="0 0 48 32" fill="none">
                      <rect width="48" height="32" rx="4" fill="#000"/>
                      <text x="24" y="20" fontSize="14" fill="#fff" textAnchor="middle" fontWeight="bold">Pay</text>
                    </svg>
                  </div>
                  <p className="text-xs text-center text-slate-600 font-semibold">
                    Payment details will be requested on the next step
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PAYMENT MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-6 flex justify-between items-center rounded-t-3xl">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Payment Details</h2>
                <p className="text-base text-slate-600 mt-2">Complete your booking securely</p>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handlePaymentSubmit} className="px-8 py-8">
              <div className="space-y-8">
                {/* Total Amount Display */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl px-6 py-5 border-2 border-green-300">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-slate-800 uppercase tracking-wide">Total Amount</span>
                    <span className="text-4xl font-bold text-green-600">£{totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                {/* Payment Options */}
                <div>
                  <h3 className="text-base font-bold text-slate-800 uppercase tracking-wide mb-4">Payment Option</h3>
                  
                  {isUrgentBooking ? (
                    // ⚠️ URGENT BOOKING: Only "Pay Today" option (forced)
                    <div className="space-y-3">
                      {/* Urgent Booking Warning Banner */}
                      <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-300 rounded-xl p-4 mb-4">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <Clock className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-red-900 mb-1">Urgent Booking - Payment Required Now</p>
                            <p className="text-sm text-red-800">
                              Your move is within 72 hours. Full payment must be taken immediately to secure your booking.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Pay Today - ONLY OPTION */}
                      <label className="relative border-2 border-red-400 bg-red-50 rounded-2xl px-6 py-5 block cursor-default">
                        <input
                          type="radio"
                          name="payment-option"
                          value="pay-today"
                          checked={true}
                          disabled={true}
                          className="sr-only"
                        />
                        
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="font-bold text-red-900 text-lg">
                                Pay now (required)
                              </div>
                              <div className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                MANDATORY
                              </div>
                            </div>
                            <div className="text-base text-red-800 font-semibold">
                              Full amount will be charged immediately
                            </div>
                            <div className="text-sm text-red-700 mt-1">
                              This is required for all moves within 72 hours
                            </div>
                          </div>
                          <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 ml-4">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </label>
                    </div>
                  ) : (
                    // ✅ STANDARD BOOKING: Both options available
                    <div className="space-y-3">
                      {/* Book now, pay later - RECOMMENDED */}
                      <label
                        className={`relative border-2 rounded-2xl px-6 py-5 cursor-pointer transition-all block ${
                          paymentOption === 'book-later'
                            ? 'border-green-500 bg-green-50 shadow-md'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment-option"
                          value="book-later"
                          checked={paymentOption === 'book-later'}
                          onChange={() => setPaymentOption('book-later')}
                          className="sr-only"
                        />
                        
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="font-bold text-slate-900 text-lg">
                                Book now, pay later
                              </div>
                              <div className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                RECOMMENDED
                              </div>
                            </div>
                            <div className="text-base text-slate-700 font-semibold">
                              No payment taken today. Card authorised only.
                            </div>
                            <div className="text-sm text-slate-600 mt-1">
                              You'll be charged 72 hours before your move date
                            </div>
                          </div>
                          {paymentOption === 'book-later' && (
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 ml-4">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                      </label>

                      {/* Pay today */}
                      <label
                        className={`relative border-2 rounded-2xl px-6 py-5 cursor-pointer transition-all block ${
                          paymentOption === 'pay-today'
                            ? 'border-green-500 bg-green-50 shadow-md'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment-option"
                          value="pay-today"
                          checked={paymentOption === 'pay-today'}
                          onChange={() => setPaymentOption('pay-today')}
                          className="sr-only"
                        />
                        
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-bold text-slate-900 text-lg mb-2">
                              Pay today
                            </div>
                            <div className="text-base text-slate-700 font-semibold">
                              Full amount charged immediately
                            </div>
                          </div>
                          {paymentOption === 'pay-today' && (
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 ml-4">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                      </label>
                    </div>
                  )}
                </div>

                {/* Card Details */}
                <div>
                  <h3 className="text-base font-bold text-slate-800 uppercase tracking-wide mb-5">Card Details</h3>
                  <div className="space-y-5">
                    {/* Card Number with Brand Icons */}
                    <div>
                      <label className="block text-base font-semibold text-slate-800 mb-3">
                        Card number
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => {
                            const formatted = formatCardNumber(e.target.value);
                            if (formatted.replace(/\s/g, '').length <= 16) {
                              setCardNumber(formatted);
                            }
                          }}
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-5 py-4 text-base border-2 border-slate-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none font-medium transition-all"
                          required
                        />
                        {/* Card Brand Icons */}
                        <div className="absolute right-4 top-4 flex items-center gap-2">
                          <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded border border-slate-200">
                            <svg className="w-8 h-5" viewBox="0 0 32 20" fill="none">
                              <rect width="32" height="20" rx="3" fill="#1434CB"/>
                              <path d="M12.5 5h7v10h-7z" fill="#FF9800"/>
                              <circle cx="12" cy="10" r="5" fill="#EB001B"/>
                              <circle cx="20" cy="10" r="5" fill="#FF9800"/>
                            </svg>
                            <svg className="w-8 h-5" viewBox="0 0 32 20" fill="none">
                              <rect width="32" height="20" rx="3" fill="#00579F"/>
                              <path d="M18 6l-2 4h4l-2 4" fill="#FFA500"/>
                            </svg>
                            <svg className="w-8 h-5" viewBox="0 0 32 20" fill="none">
                              <rect width="32" height="20" rx="3" fill="#0066B2"/>
                              <rect x="8" y="6" width="16" height="8" fill="white"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expiry, CVC, Postcode */}
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-base font-semibold text-slate-800 mb-3">
                          Expiry date
                        </label>
                        <input
                          type="text"
                          value={expiryDate}
                          onChange={(e) => {
                            const formatted = formatExpiry(e.target.value);
                            setExpiryDate(formatted);
                          }}
                          placeholder="MM / YY"
                          className="w-full px-4 py-4 text-base border-2 border-slate-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none font-medium transition-all"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-base font-semibold text-slate-800 mb-3">
                          CVC
                        </label>
                        <input
                          type="text"
                          value={securityCode}
                          onChange={(e) => {
                            if (/^\d{0,3}$/.test(e.target.value)) {
                              setSecurityCode(e.target.value);
                            }
                          }}
                          placeholder="123"
                          className="w-full px-4 py-4 text-base border-2 border-slate-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none font-medium transition-all"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-base font-semibold text-slate-800 mb-3">
                          Postcode
                        </label>
                        <input
                          type="text"
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value.toUpperCase())}
                          placeholder="SW1A 1AA"
                          className="w-full px-4 py-4 text-base border-2 border-slate-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none font-medium transition-all"
                          required
                        />
                      </div>
                    </div>

                    {/* Country */}
                    <div>
                      <label className="block text-base font-semibold text-slate-800 mb-3">
                        Country
                      </label>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full px-5 py-4 text-base border-2 border-slate-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none bg-white font-medium transition-all"
                        required
                      >
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Ireland">Ireland</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Trust & Security Badge */}
                <div className="bg-slate-50 rounded-xl px-5 py-4 border border-slate-200">
                  <div className="flex items-center justify-center gap-2 text-sm text-slate-700 font-semibold">
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Secure payment</span>
                    <span className="text-slate-400">•</span>
                    <span>Encrypted</span>
                    <span className="text-slate-400">•</span>
                    <span>PCI compliant</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(false)}
                    className="flex-1 bg-white border-2 border-slate-300 text-slate-700 font-bold text-base py-4 px-6 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!agreedToMarketplace}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-base py-4 px-6 rounded-xl hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Check className="w-5 h-5" />
                    Confirm Booking
                  </button>
                </div>

                {/* Marketplace Disclaimer */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
                  <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-2">Marketplace Disclaimer</h4>
                  <p className="text-[11px] font-bold text-slate-600 uppercase tracking-tight">
                    ShiftMyHome is a marketplace platform.
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium leading-tight mt-1">
                    Transport services are provided by independent Transport Partners.
                  </p>
                  
                  <div className="mt-4 p-3 bg-white rounded-lg border border-red-100 flex items-start gap-3 text-left">
                    <input 
                      type="checkbox"
                      id="agreedToMarketplace"
                      checked={agreedToMarketplace}
                      onChange={(e) => setAgreedToMarketplace(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
                      required
                    />
                    <label htmlFor="agreedToMarketplace" className="text-[10px] text-slate-600 leading-relaxed cursor-pointer font-medium">
                      By confirming this booking, I acknowledge that my transport contract is with the Transport Partner, not with ShiftMyHome. I have read and agree to the <button type="button" onClick={() => window.open('/terms', '_blank')} className="text-red-600 hover:underline">Terms & Conditions</button>.
                    </label>
                  </div>
                </div>

                {/* Legal Text with Links */}
                <p className="text-sm text-center text-slate-600 leading-relaxed">
                  By confirming, you agree to our{' '}
                  <button
                    type="button"
                    onClick={() => window.open('/terms', '_blank')}
                    className="font-semibold text-slate-800 hover:text-green-600 underline transition-colors"
                  >
                    Terms & Conditions
                  </button>
                  {' '}and{' '}
                  <button
                    type="button"
                    onClick={() => window.open('/privacy', '_blank')}
                    className="font-semibold text-slate-800 hover:text-green-600 underline transition-colors"
                  >
                    Privacy Policy
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}