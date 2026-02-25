import React, { useState, useEffect } from 'react';
import { QuoteHeader } from '../QuoteHeader';
import { QuoteProgressBar } from '../QuoteProgressBar';
import { router } from '../../../utils/router';
import { saveQuoteData, getQuoteData, updateLastStep } from '../../../utils/quoteStorage';
import { ArrowRight, ArrowLeft, Calendar, Clock, Wrench, Shield, FileText, Plus, Minus, Package, Lock } from 'lucide-react';
import { QuoteSummaryPanel } from '../QuoteSummaryPanel';
import { TimeRangeSlider } from '../TimeRangeSlider';
import { CustomDatePicker } from '../../ui/CustomDatePicker';
import { PriceCalendar } from '../PriceCalendar';
import { getPricingConfig, ExtraServicesPricing } from '../../../utils/pricingConfigService';

export function QuoteStep4Page() {
  const [quoteData, setQuoteData] = useState<any>({});
  
  // 💰 DYNAMIC PRICING FROM ADMIN CONFIG (NO HARDCODED PRICES!)
  const [extrasPricing, setExtrasPricing] = useState<ExtraServicesPricing | null>(null);
  const [pricingLoading, setPricingLoading] = useState(true);
  
  // Move date
  const [moveDate, setMoveDate] = useState('');
  const [arrivalTimeFrom, setArrivalTimeFrom] = useState(480); // 08:00 default
  const [arrivalTimeTo, setArrivalTimeTo] = useState(600);     // 10:00 default
  const [isFlexibleDate, setIsFlexibleDate] = useState(false);
  
  // Optional services (Standard only)
  const [dismantlingEnabled, setDismantlingEnabled] = useState(false);
  const [dismantlingCount, setDismantlingCount] = useState(0);
  const [reassemblyEnabled, setReassemblyEnabled] = useState(false);
  const [reassemblyCount, setReassemblyCount] = useState(0);
  
  const [extendedProtection, setExtendedProtection] = useState(false);
  const [packingService, setPackingService] = useState(false);
  
  const [specialNotes, setSpecialNotes] = useState('');

  // 🪑 FURNITURE & ITEMS EXTRAS (NO PRICES DISPLAYED)
  // Packing Materials (with quantity)
  const [smallBoxQty, setSmallBoxQty] = useState(0);
  const [mediumBoxQty, setMediumBoxQty] = useState(0);
  const [largeBoxQty, setLargeBoxQty] = useState(0);
  const [xlBoxQty, setXlBoxQty] = useState(0);
  const [bubbleWrapQty, setBubbleWrapQty] = useState(0);
  const [packingTapeQty, setPackingTapeQty] = useState(0);
  
  // Packing Services (toggle)
  const [fullPackingService, setFullPackingService] = useState(false);
  const [partialPackingService, setPartialPackingService] = useState(false);
  
  // Specialist Services (toggle)
  const [pianoMoving, setPianoMoving] = useState(false);
  const [furnitureDismantling, setFurnitureDismantling] = useState(false);
  const [heavyItemHandling, setHeavyItemHandling] = useState(false);
  
  // Storage
  const [storageOneMonth, setStorageOneMonth] = useState(false);
  
  // Insurance
  const [premiumInsurance, setPremiumInsurance] = useState(false); // Basic is always included
  
  // Additional Services
  const [waitingTimeQty, setWaitingTimeQty] = useState(0); // per 30 min units

  // 🔥 LOAD PRICING CONFIG FROM ADMIN (CRITICAL!)
  useEffect(() => {
    const loadPricing = async () => {
      try {
        const config = await getPricingConfig();
        setExtrasPricing(config.extraServices);
        setPricingLoading(false);
      } catch (error) {
        console.error('❌ Failed to load extras pricing config:', error);
        setPricingLoading(false);
        // Pricing will be null - UI should handle gracefully
      }
    };
    loadPricing();
  }, []);

  // Load saved data on mount - SEPARATE BY PACKAGE
  useEffect(() => {
    const savedData = getQuoteData();
    setQuoteData(savedData);
    
    const isPremium = savedData.isPremium || false;
    const packageType = isPremium ? 'premium' : 'standard';
    const isFurnitureMove = savedData.serviceCategory === 'furniture_items';
    
    // Load common data
    if (savedData.moveDate) setMoveDate(savedData.moveDate);
    if (savedData.arrivalTimeFrom !== undefined) setArrivalTimeFrom(savedData.arrivalTimeFrom);
    if (savedData.arrivalTimeTo !== undefined) setArrivalTimeTo(savedData.arrivalTimeTo);
    if (savedData.isFlexibleDate) setIsFlexibleDate(savedData.isFlexibleDate);
    if (savedData.specialNotes) setSpecialNotes(savedData.specialNotes);
    
    // 🪑 Load Furniture & Items extras
    if (isFurnitureMove && savedData.furnitureExtras) {
      const extras = savedData.furnitureExtras;
      
      // Packing materials
      if (extras.smallBoxQty !== undefined) setSmallBoxQty(extras.smallBoxQty);
      if (extras.mediumBoxQty !== undefined) setMediumBoxQty(extras.mediumBoxQty);
      if (extras.largeBoxQty !== undefined) setLargeBoxQty(extras.largeBoxQty);
      if (extras.xlBoxQty !== undefined) setXlBoxQty(extras.xlBoxQty);
      if (extras.bubbleWrapQty !== undefined) setBubbleWrapQty(extras.bubbleWrapQty);
      if (extras.packingTapeQty !== undefined) setPackingTapeQty(extras.packingTapeQty);
      
      // Packing services
      if (extras.fullPackingService !== undefined) setFullPackingService(extras.fullPackingService);
      if (extras.partialPackingService !== undefined) setPartialPackingService(extras.partialPackingService);
      
      // Specialist services
      if (extras.pianoMoving !== undefined) setPianoMoving(extras.pianoMoving);
      if (extras.furnitureDismantling !== undefined) setFurnitureDismantling(extras.furnitureDismantling);
      if (extras.heavyItemHandling !== undefined) setHeavyItemHandling(extras.heavyItemHandling);
      
      // Storage
      if (extras.storageOneMonth !== undefined) setStorageOneMonth(extras.storageOneMonth);
      
      // Insurance
      if (extras.premiumInsurance !== undefined) setPremiumInsurance(extras.premiumInsurance);
      
      // Additional services
      if (extras.waitingTimeQty !== undefined) setWaitingTimeQty(extras.waitingTimeQty);
    }
    
    // Load extras from extrasByPackage if available
    if (savedData.extrasByPackage && savedData.extrasByPackage[packageType]) {
      const extras = savedData.extrasByPackage[packageType];
      
      // Extended protection is available for both packages
      if (extras.extendedProtection !== undefined) {
        setExtendedProtection(extras.extendedProtection);
      }
      
      // Standard-only extras
      if (!isPremium) {
        if (extras.packingService !== undefined) setPackingService(extras.packingService);
        if (extras.dismantlingEnabled !== undefined) setDismantlingEnabled(extras.dismantlingEnabled);
        if (extras.dismantlingCount !== undefined) setDismantlingCount(extras.dismantlingCount);
        if (extras.reassemblyEnabled !== undefined) setReassemblyEnabled(extras.reassemblyEnabled);
        if (extras.reassemblyCount !== undefined) setReassemblyCount(extras.reassemblyCount);
      }
    }
    // Fallback: load from top-level (for backwards compatibility)
    else {
      if (!isPremium) {
        if (savedData.packingService) setPackingService(savedData.packingService);
        if (savedData.dismantlingEnabled) setDismantlingEnabled(savedData.dismantlingEnabled);
        if (savedData.dismantlingCount) setDismantlingCount(savedData.dismantlingCount);
        if (savedData.reassemblyEnabled) setReassemblyEnabled(savedData.reassemblyEnabled);
        if (savedData.reassemblyCount) setReassemblyCount(savedData.reassemblyCount);
      }
      if (savedData.extendedProtection) setExtendedProtection(savedData.extendedProtection);
    }
  }, []);

  // Calculate extras - PREMIUM INCLUDES PACKING + DISMANTLING FOR FREE
  const calculateExtras = () => {
    let total = 0;
    const isPremium = quoteData.isPremium || false;
    
    // ✅ USE DYNAMIC PRICING (NO HARDCODED VALUES!)
    if (!extrasPricing) {
      console.warn('⚠️ Extras pricing not loaded yet, cannot calculate');
      return 0;
    }
    
    // Premium: packing and dismantling are INCLUDED (no extra cost)
    if (!isPremium) {
      if (dismantlingEnabled && dismantlingCount > 0) {
        total += dismantlingCount * extrasPricing.dismantlingPerItem;
      }
      
      if (reassemblyEnabled && reassemblyCount > 0) {
        total += reassemblyCount * extrasPricing.reassemblyPerItem;
      }
      
      if (packingService) {
        total += extrasPricing.packingServiceFlat;
      }
    }
    
    // Extended protection available for both
    if (extendedProtection) {
      total += extrasPricing.extendedProtection;
    }
    
    return total;
  };

  const extrasTotal = calculateExtras();
  const basePrice = quoteData.selectedPackagePrice || 0;
  const finalPrice = basePrice + extrasTotal;

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isPremium = quoteData.isPremium || false;
    const packageType = isPremium ? 'premium' : 'standard';
    const isFurnitureMove = quoteData.serviceCategory === 'furniture_items';
    
    // 🪑 Save Furniture & Items extras separately
    if (isFurnitureMove) {
      const furnitureExtras = {
        smallBoxQty,
        mediumBoxQty,
        largeBoxQty,
        xlBoxQty,
        bubbleWrapQty,
        packingTapeQty,
        fullPackingService,
        partialPackingService,
        pianoMoving,
        furnitureDismantling,
        heavyItemHandling,
        storageOneMonth,
        premiumInsurance,
        waitingTimeQty,
      };
      
      saveQuoteData({
        moveDate,
        arrivalTimeFrom,
        arrivalTimeTo,
        isFlexibleDate,
        specialNotes,
        furnitureExtras,
      });
      updateLastStep(4);
      router.navigate({ page: 'quote-step', step: 5 });
      return;
    }
    
    // Standard/Premium package logic (existing)
    const currentExtras: any = {
      extendedProtection,
    };
    
    if (!isPremium) {
      currentExtras.packingService = packingService;
      currentExtras.dismantlingEnabled = dismantlingEnabled;
      currentExtras.dismantlingCount = dismantlingCount;
      currentExtras.reassemblyEnabled = reassemblyEnabled;
      currentExtras.reassemblyCount = reassemblyCount;
    }
    
    const existingExtrasByPackage = quoteData.extrasByPackage || {};
    const updatedExtrasByPackage = {
      ...existingExtrasByPackage,
      [packageType]: currentExtras,
    };
    
    saveQuoteData({
      moveDate,
      arrivalTimeFrom,
      arrivalTimeTo,
      isFlexibleDate,
      specialNotes,
      extrasTotal,
      finalTotalPrice: finalPrice,
      extrasByPackage: updatedExtrasByPackage,
      packingService: !isPremium ? packingService : false,
      dismantlingEnabled: !isPremium ? dismantlingEnabled : false,
      dismantlingCount: !isPremium ? dismantlingCount : 0,
      reassemblyEnabled: !isPremium ? reassemblyEnabled : false,
      reassemblyCount: !isPremium ? reassemblyCount : 0,
      extendedProtection,
    });
    updateLastStep(4);
    router.navigate({ page: 'quote-step', step: 5 });
  };

  const handleBack = () => {
    // Save current state before going back (same logic as handleNext)
    const isPremium = quoteData.isPremium || false;
    const packageType = isPremium ? 'premium' : 'standard';
    const isFurnitureMove = quoteData.serviceCategory === 'furniture_items';
    
    // 🪑 Save Furniture & Items extras separately
    if (isFurnitureMove) {
      const furnitureExtras = {
        smallBoxQty,
        mediumBoxQty,
        largeBoxQty,
        xlBoxQty,
        bubbleWrapQty,
        packingTapeQty,
        fullPackingService,
        partialPackingService,
        pianoMoving,
        furnitureDismantling,
        heavyItemHandling,
        storageOneMonth,
        premiumInsurance,
        waitingTimeQty,
      };
      
      saveQuoteData({
        moveDate,
        arrivalTimeFrom,
        arrivalTimeTo,
        isFlexibleDate,
        specialNotes,
        furnitureExtras,
      });
      router.navigate({ page: 'quote-step', step: 3 });
      return;
    }
    
    const currentExtras: any = {
      extendedProtection,
    };
    
    if (!isPremium) {
      currentExtras.packingService = packingService;
      currentExtras.dismantlingEnabled = dismantlingEnabled;
      currentExtras.dismantlingCount = dismantlingCount;
      currentExtras.reassemblyEnabled = reassemblyEnabled;
      currentExtras.reassemblyCount = reassemblyCount;
    }
    
    const existingExtrasByPackage = quoteData.extrasByPackage || {};
    const updatedExtrasByPackage = {
      ...existingExtrasByPackage,
      [packageType]: currentExtras,
    };
    
    saveQuoteData({
      moveDate,
      arrivalTimeFrom,
      arrivalTimeTo,
      isFlexibleDate,
      specialNotes,
      extrasTotal,
      finalTotalPrice: finalPrice,
      extrasByPackage: updatedExtrasByPackage,
      packingService: !isPremium ? packingService : false,
      dismantlingEnabled: !isPremium ? dismantlingEnabled : false,
      dismantlingCount: !isPremium ? dismantlingCount : 0,
      reassemblyEnabled: !isPremium ? reassemblyEnabled : false,
      reassemblyCount: !isPremium ? reassemblyCount : 0,
      extendedProtection,
    });
    
    router.navigate({ page: 'quote-step', step: 3 });
  };

  // Set minimum date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const isPremium = quoteData.isPremium || false;

  // 🪑 Check if this is Furniture Move
  const isFurnitureMove = quoteData.serviceCategory === 'furniture_items';

  // 🪑 Calendar modal state
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

  // 🪑 Calculate context info for price calendar
  const getTotalVolume = () => {
    const items = quoteData.selectedItems || [];
    // This would need the FURNITURE_CATEGORIES data from Step 2
    // For now, return a placeholder
    return 0; // TODO: calculate from inventory
  };

  const getRouteInfo = () => {
    if (quoteData.pickupAddress && quoteData.deliveryAddress) {
      // Extract city names from addresses (simplified)
      const pickupParts = quoteData.pickupAddress.split(',');
      const deliveryParts = quoteData.deliveryAddress.split(',');
      const pickup = pickupParts[pickupParts.length - 2]?.trim() || 'Pickup';
      const delivery = deliveryParts[deliveryParts.length - 2]?.trim() || 'Delivery';
      return `${pickup} → ${delivery}`;
    }
    return undefined;
  };

  const handleDateSelect = (date: string, price: number) => {
    // ✅ ONLY set date - DO NOT auto-navigate to Step 5
    // User must click "Next" button to proceed
    setMoveDate(date);
    setIsFlexibleDate(false);
    
    // Optionally update the base price based on selected date
    // saveQuoteData({ selectedPackagePrice: price });
    
    // ❌ DO NOT NAVIGATE HERE - Let user control flow with "Next" button
    // The calendar modal will auto-close via onClose() in PriceCalendar
  };

  // 🪑 Day multipliers for price calculation
  const dayMultipliers = {
    0: 1.2, // Sunday
    1: 1.0, // Monday
    2: 1.0, // Tuesday
    3: 1.0, // Wednesday
    4: 1.0, // Thursday
    5: 1.0, // Friday
    6: 1.2  // Saturday
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <QuoteHeader />
      <QuoteProgressBar currentStep={4} />

      {/* 🔥 LOADING STATE - Wait for pricing to load */}
      {pricingLoading ? (
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <div className="text-slate-600">Loading pricing configuration...</div>
          </div>
        </div>
      ) : !extrasPricing ? (
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="text-red-600 text-5xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Pricing Configuration Error</h3>
            <p className="text-slate-600 mb-4">
              Unable to load pricing configuration. Please contact support or try again later.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      ) : (
        /* MAIN CONTENT */

      <div className="flex-1 py-8 px-4">
        {/* DESKTOP: 60% / 40% Split Layout - IDENTICAL TO STEP 3 */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT CONTENT: Additional Options (60%) */}
            <div className="lg:col-span-7">
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                    Additional Options
                  </h1>
                  <p className="text-slate-600">
                    Customize your move with optional extras
                  </p>
                </div>

                <form onSubmit={handleNext} className="space-y-6">
                  {/* MOVE DATE CARD */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    {isFurnitureMove ? (
                      // 🪑 FURNITURE MOVE: Price Calendar Button + Compact Summary
                      <>
                        <div className="flex items-center gap-2 mb-4">
                          <Calendar className="w-5 h-5 text-red-600" />
                          <h3 className="text-lg font-semibold text-slate-900">Choose Your Move Date</h3>
                        </div>

                        {moveDate ? (
                          // ✅ Date Selected: Show compact summary
                          <div className="space-y-4">
                            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="text-xs text-green-700 font-semibold mb-1">Selected Move Date</p>
                                  <p className="text-xl font-bold text-slate-900">
                                    {new Date(moveDate).toLocaleDateString('en-GB', {
                                      weekday: 'short',
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric'
                                    })}
                                  </p>
                                  <p className="text-xs text-slate-600 mt-1">
                                    Estimated price: <strong className="text-green-700">£{Math.round(basePrice * (dayMultipliers[(new Date(moveDate).getDay()) as keyof typeof dayMultipliers] || 1.0))}</strong>
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setIsCalendarModalOpen(true)}
                                  className="text-sm text-blue-600 hover:text-blue-700 font-semibold underline"
                                >
                                  Change date
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          //  No Date: Show button to open calendar
                          <button
                            type="button"
                            onClick={() => setIsCalendarModalOpen(true)}
                            className="w-full py-6 px-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                          >
                            <Calendar className="w-6 h-6" />
                            Select a Move Date
                          </button>
                        )}

                        {/* Price Calendar Modal */}
                        <PriceCalendar
                          basePrice={basePrice}
                          selectedDate={moveDate}
                          onDateSelect={handleDateSelect}
                          minDate={tomorrow}
                          contextInfo={{
                            route: getRouteInfo(),
                            distance: quoteData.distance,
                            itemCount: (quoteData.selectedItems || []).length,
                            volume: getTotalVolume(),
                            package: isPremium ? 'Premium' : 'Standard',
                          }}
                          isOpen={isCalendarModalOpen}
                          onClose={() => setIsCalendarModalOpen(false)}
                        />
                      </>
                    ) : (
                      //  OTHER SERVICES: Standard date picker
                      <>
                        <div className="flex items-center gap-2 mb-4">
                          <Calendar className="w-5 h-5 text-red-600" />
                          <h3 className="text-lg font-semibold text-slate-900">Choose Your Move Date</h3>
                        </div>

                        {!isFlexibleDate && (
                          <div className="mb-4">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                              Select exact date
                            </label>
                            <CustomDatePicker
                              value={moveDate}
                              onChange={(date) => setMoveDate(date)}
                            />
                          </div>
                        )}

                        {!isFlexibleDate && (
                          <div className="mb-4">
                            <label className="block text-sm font-semibold text-slate-700 mb-3">
                              Select arrival time window
                            </label>
                            <TimeRangeSlider
                              startTime={arrivalTimeFrom}
                              endTime={arrivalTimeTo}
                              onChange={(start, end) => {
                                setArrivalTimeFrom(start);
                                setArrivalTimeTo(end);
                              }}
                              minGap={isPremium ? 120 : 60}
                            />
                          </div>
                        )}

                        {/* Informational message about arrival window */}
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                          <div className="flex gap-3">
                            <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 text-sm text-slate-700 leading-relaxed">
                              <p className="mb-2">
                                <strong className="text-slate-900">Your dedicated ShiftMyHome team will contact you</strong> ahead of your move to agree on the arrival window and prepare everything in advance.
                              </p>
                              <p className="mb-2">
                                If an exact move-out time is required, please include it in the <strong className="text-slate-900">Special Instructions</strong> section below.
                              </p>
                              <p className="text-blue-700 font-medium">
                                📅 You can amend your move date up to 48 hours before the move without any issues.
                              </p>
                            </div>
                          </div>
                        </div>

                        <label className="flex items-start gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={isFlexibleDate}
                            onChange={(e) => {
                              setIsFlexibleDate(e.target.checked);
                              if (e.target.checked) {
                                setMoveDate('');
                              }
                            }}
                            className="mt-1 w-5 h-5 rounded border-slate-300 text-red-600 focus:ring-2 focus:ring-red-200"
                          />
                          <div className="flex-1">
                            <div className="font-semibold text-slate-900 group-hover:text-red-600 transition-colors">
                              I'm flexible on the date
                            </div>
                            <div className="text-sm text-slate-600 mt-1">
                              No problem – you can confirm the date later
                            </div>
                          </div>
                        </label>
                      </>
                    )}
                  </div>

                  {/* OPTIONAL SERVICES */}
                  {isFurnitureMove ? (
                    // 🪑 FURNITURE & ITEMS EXTRAS
                    <>
                      {/* PACKING MATERIALS */}
                      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <Package className="w-5 h-5 text-blue-600" />
                          <h3 className="text-lg font-semibold text-slate-900">Packing Materials</h3>
                        </div>
                        
                        <div className="space-y-3">
                          {/* Small Box */}
                          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                            <div className="flex-1">
                              <p className="font-semibold text-slate-900">Small Box</p>
                              <p className="text-xs text-slate-600">30×30×30cm</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button type="button" onClick={() => setSmallBoxQty(Math.max(0, smallBoxQty - 1))} className="w-8 h-8 rounded-lg bg-white border-2 border-slate-300 hover:border-slate-400 flex items-center justify-center">
                                <Minus className="w-4 h-4 text-slate-700" />
                              </button>
                              <div className="w-14 text-center py-1.5 bg-white border-2 border-slate-300 rounded-lg">
                                <span className="text-base font-bold text-slate-900">{smallBoxQty}</span>
                              </div>
                              <button type="button" onClick={() => setSmallBoxQty(smallBoxQty + 1)} className="w-8 h-8 rounded-lg bg-white border-2 border-blue-500 hover:bg-blue-50 flex items-center justify-center">
                                <Plus className="w-4 h-4 text-blue-600" />
                              </button>
                            </div>
                          </div>

                          {/* Medium Box */}
                          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                            <div className="flex-1">
                              <p className="font-semibold text-slate-900">Medium Box</p>
                              <p className="text-xs text-slate-600">40×40×40cm</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button type="button" onClick={() => setMediumBoxQty(Math.max(0, mediumBoxQty - 1))} className="w-8 h-8 rounded-lg bg-white border-2 border-slate-300 hover:border-slate-400 flex items-center justify-center">
                                <Minus className="w-4 h-4 text-slate-700" />
                              </button>
                              <div className="w-14 text-center py-1.5 bg-white border-2 border-slate-300 rounded-lg">
                                <span className="text-base font-bold text-slate-900">{mediumBoxQty}</span>
                              </div>
                              <button type="button" onClick={() => setMediumBoxQty(mediumBoxQty + 1)} className="w-8 h-8 rounded-lg bg-white border-2 border-blue-500 hover:bg-blue-50 flex items-center justify-center">
                                <Plus className="w-4 h-4 text-blue-600" />
                              </button>
                            </div>
                          </div>

                          {/* Large Box */}
                          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                            <div className="flex-1">
                              <p className="font-semibold text-slate-900">Large Box</p>
                              <p className="text-xs text-slate-600">50×50×50cm</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button type="button" onClick={() => setLargeBoxQty(Math.max(0, largeBoxQty - 1))} className="w-8 h-8 rounded-lg bg-white border-2 border-slate-300 hover:border-slate-400 flex items-center justify-center">
                                <Minus className="w-4 h-4 text-slate-700" />
                              </button>
                              <div className="w-14 text-center py-1.5 bg-white border-2 border-slate-300 rounded-lg">
                                <span className="text-base font-bold text-slate-900">{largeBoxQty}</span>
                              </div>
                              <button type="button" onClick={() => setLargeBoxQty(largeBoxQty + 1)} className="w-8 h-8 rounded-lg bg-white border-2 border-blue-500 hover:bg-blue-50 flex items-center justify-center">
                                <Plus className="w-4 h-4 text-blue-600" />
                              </button>
                            </div>
                          </div>

                          {/* XL Box */}
                          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                            <div className="flex-1">
                              <p className="font-semibold text-slate-900">XL Box</p>
                              <p className="text-xs text-slate-600">60×60×60cm</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button type="button" onClick={() => setXlBoxQty(Math.max(0, xlBoxQty - 1))} className="w-8 h-8 rounded-lg bg-white border-2 border-slate-300 hover:border-slate-400 flex items-center justify-center">
                                <Minus className="w-4 h-4 text-slate-700" />
                              </button>
                              <div className="w-14 text-center py-1.5 bg-white border-2 border-slate-300 rounded-lg">
                                <span className="text-base font-bold text-slate-900">{xlBoxQty}</span>
                              </div>
                              <button type="button" onClick={() => setXlBoxQty(xlBoxQty + 1)} className="w-8 h-8 rounded-lg bg-white border-2 border-blue-500 hover:bg-blue-50 flex items-center justify-center">
                                <Plus className="w-4 h-4 text-blue-600" />
                              </button>
                            </div>
                          </div>

                          {/* Bubble Wrap */}
                          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                            <div className="flex-1">
                              <p className="font-semibold text-slate-900">Bubble Wrap</p>
                              <p className="text-xs text-slate-600">1m x 1m</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button type="button" onClick={() => setBubbleWrapQty(Math.max(0, bubbleWrapQty - 1))} className="w-8 h-8 rounded-lg bg-white border-2 border-slate-300 hover:border-slate-400 flex items-center justify-center">
                                <Minus className="w-4 h-4 text-slate-700" />
                              </button>
                              <div className="w-14 text-center py-1.5 bg-white border-2 border-slate-300 rounded-lg">
                                <span className="text-base font-bold text-slate-900">{bubbleWrapQty}</span>
                              </div>
                              <button type="button" onClick={() => setBubbleWrapQty(bubbleWrapQty + 1)} className="w-8 h-8 rounded-lg bg-white border-2 border-blue-500 hover:bg-blue-50 flex items-center justify-center">
                                <Plus className="w-4 h-4 text-blue-600" />
                              </button>
                            </div>
                          </div>

                          {/* Packing Tape */}
                          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                            <div className="flex-1">
                              <p className="font-semibold text-slate-900">Packing Tape</p>
                              <p className="text-xs text-slate-600">10m</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button type="button" onClick={() => setPackingTapeQty(Math.max(0, packingTapeQty - 1))} className="w-8 h-8 rounded-lg bg-white border-2 border-slate-300 hover:border-slate-400 flex items-center justify-center">
                                <Minus className="w-4 h-4 text-slate-700" />
                              </button>
                              <div className="w-14 text-center py-1.5 bg-white border-2 border-slate-300 rounded-lg">
                                <span className="text-base font-bold text-slate-900">{packingTapeQty}</span>
                              </div>
                              <button type="button" onClick={() => setPackingTapeQty(packingTapeQty + 1)} className="w-8 h-8 rounded-lg bg-white border-2 border-blue-500 hover:bg-blue-50 flex items-center justify-center">
                                <Plus className="w-4 h-4 text-blue-600" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* SERVICES */}
                      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <Wrench className="w-5 h-5 text-blue-600" />
                          <h3 className="text-lg font-semibold text-slate-900">Services</h3>
                        </div>
                        <div className="space-y-2">
                          <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100">
                            <input type="checkbox" checked={fullPackingService} onChange={(e) => { setFullPackingService(e.target.checked); if (e.target.checked) setPartialPackingService(false); }} className="w-4 h-4 rounded border-slate-300 text-blue-600" />
                            <div className="flex-1">
                              <p className="font-semibold text-slate-900 text-sm">Full Packing Service</p>
                              <p className="text-xs text-slate-600">Professional packing of all items</p>
                            </div>
                          </label>
                          <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100">
                            <input type="checkbox" checked={partialPackingService} onChange={(e) => { setPartialPackingService(e.target.checked); if (e.target.checked) setFullPackingService(false); }} className="w-4 h-4 rounded border-slate-300 text-blue-600" />
                            <div className="flex-1">
                              <p className="font-semibold text-slate-900 text-sm">Partial Packing Service</p>
                              <p className="text-xs text-slate-600">Professional packing of selected items</p>
                            </div>
                          </label>
                          <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100">
                            <input type="checkbox" checked={pianoMoving} onChange={(e) => setPianoMoving(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-blue-600" />
                            <div className="flex-1">
                              <p className="font-semibold text-slate-900 text-sm">Piano Moving</p>
                              <p className="text-xs text-slate-600">Specialist handling for pianos</p>
                            </div>
                          </label>
                          <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100">
                            <input type="checkbox" checked={furnitureDismantling} onChange={(e) => setFurnitureDismantling(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-blue-600" />
                            <div className="flex-1">
                              <p className="font-semibold text-slate-900 text-sm">Furniture Dismantling</p>
                              <p className="text-xs text-slate-600">Disassembly of furniture</p>
                            </div>
                          </label>
                          <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100">
                            <input type="checkbox" checked={heavyItemHandling} onChange={(e) => setHeavyItemHandling(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-blue-600" />
                            <div className="flex-1">
                              <p className="font-semibold text-slate-900 text-sm">Heavy Item Handling</p>
                              <p className="text-xs text-slate-600">Specialist handling for heavy items</p>
                            </div>
                          </label>
                          <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100">
                            <input type="checkbox" checked={storageOneMonth} onChange={(e) => setStorageOneMonth(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-blue-600" />
                            <div className="flex-1">
                              <p className="font-semibold text-slate-900 text-sm">Storage for 1 Month</p>
                              <p className="text-xs text-slate-600">Storage space for 1 month</p>
                            </div>
                          </label>
                          <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100">
                            <input type="checkbox" checked={premiumInsurance} onChange={(e) => setPremiumInsurance(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-blue-600" />
                            <div className="flex-1">
                              <p className="font-semibold text-slate-900 text-sm">Premium Insurance</p>
                              <p className="text-xs text-slate-600">Enhanced insurance coverage</p>
                            </div>
                          </label>
                        </div>
                      </div>
                    </>
                  ) : (
                    // 📦 HOUSE MOVE EXTRAS
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">Optional Services</h3>
                      <div className="space-y-4">
                        {/* PACKING SERVICE - PREMIUM = INCLUDED, STANDARD = OPTIONAL */}
                        <div className="border border-slate-200 rounded-xl p-4">
                          <div className="flex items-start gap-2 mb-3">
                            <Package className="w-5 h-5 text-slate-700 mt-0.5" />
                            <div className="flex-1">
                              <h4 className="font-semibold text-slate-900">Packing Service</h4>
                              <p className="text-xs text-slate-600 mt-1">
                                Professional packing of all your belongings
                              </p>
                            </div>
                          </div>

                          {isPremium ? (
                            // PREMIUM: INCLUDED (locked)
                            <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center">
                                  <span className="text-white text-sm font-bold">✓</span>
                                </div>
                                <span className="font-bold text-slate-900">Full Packing Service (Included)</span>
                                <Lock className="w-4 h-4 text-green-600 ml-auto" />
                              </div>
                              <p className="text-xs text-slate-600 ml-8">
                                All packing materials and professional packing included with Premium package
                              </p>
                            </div>
                          ) : (
                            // STANDARD: OPTIONAL
                            <div className="bg-slate-50 rounded-lg p-3">
                              <label className="flex items-start gap-2 cursor-pointer group">
                                <input
                                  type="checkbox"
                                  checked={packingService}
                                  onChange={(e) => setPackingService(e.target.checked)}
                                  className="mt-1 w-4 h-4 rounded border-slate-300 text-red-600 focus:ring-2 focus:ring-red-200"
                                />
                                <div className="flex-1">
                                  <div className="font-semibold text-slate-900 group-hover:text-red-600 transition-colors">
                                    Add Packing Service (+£{extrasPricing?.packingServiceFlat || 0})
                                  </div>
                                  <p className="text-xs text-slate-600 mt-1">
                                    We'll pack all your items carefully with professional materials
                                  </p>
                                </div>
                              </label>
                            </div>
                          )}
                        </div>

                        {/* DISMANTLING & REASSEMBLY - PREMIUM = INCLUDED, STANDARD = OPTIONAL */}
                        <div className="border border-slate-200 rounded-xl p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-start gap-2">
                              <Wrench className="w-5 h-5 text-slate-700 mt-0.5" />
                              <div>
                                <h4 className="font-semibold text-slate-900">Dismantling & Reassembly</h4>
                                <p className="text-xs text-slate-600 mt-1">
                                  For beds, wardrobes, large furniture
                                </p>
                              </div>
                            </div>
                          </div>

                          {isPremium ? (
                            // PREMIUM: INCLUDED (locked)
                            <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center">
                                  <span className="text-white text-sm font-bold">✓</span>
                                </div>
                                <span className="font-bold text-slate-900">Dismantling & Reassembly (Included)</span>
                                <Lock className="w-4 h-4 text-green-600 ml-auto" />
                              </div>
                              <p className="text-xs text-slate-600 ml-8">
                                Furniture disassembly and reassembly included with Premium package
                              </p>
                            </div>
                          ) : (
                            // STANDARD: OPTIONAL
                            <>
                              {/* Dismantling */}
                              <div className="bg-slate-50 rounded-lg p-3 mb-2">
                                <div className="flex items-center justify-between mb-2">
                                  <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={dismantlingEnabled}
                                      onChange={(e) => {
                                        setDismantlingEnabled(e.target.checked);
                                        if (!e.target.checked) {
                                          setDismantlingCount(0);
                                        } else if (dismantlingCount === 0) {
                                          setDismantlingCount(1);
                                        }
                                      }}
                                      className="w-4 h-4 rounded border-slate-300 text-red-600 focus:ring-2 focus:ring-red-200"
                                    />
                                    <span className="text-sm font-semibold text-slate-900">
                                      Dismantling (+£{extrasPricing?.dismantlingPerItem || 0} per item)
                                    </span>
                                  </label>
                                </div>

                                {dismantlingEnabled && (
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => setDismantlingCount(Math.max(0, dismantlingCount - 1))}
                                      className="w-8 h-8 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 transition-colors flex items-center justify-center"
                                    >
                                      <Minus className="w-4 h-4 text-slate-700" />
                                    </button>
                                    <input
                                      type="number"
                                      min="0"
                                      value={dismantlingCount}
                                      onChange={(e) => setDismantlingCount(Math.max(0, parseInt(e.target.value) || 0))}
                                      className="w-16 px-2 py-1 text-center rounded-lg border border-slate-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setDismantlingCount(dismantlingCount + 1)}
                                      className="w-8 h-8 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 transition-colors flex items-center justify-center"
                                    >
                                      <Plus className="w-4 h-4 text-slate-700" />
                                    </button>
                                    <span className="text-sm text-slate-600 ml-2">
                                      items (£{dismantlingCount * (extrasPricing?.dismantlingPerItem || 0)})
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Reassembly */}
                              <div className="bg-slate-50 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={reassemblyEnabled}
                                      onChange={(e) => {
                                        setReassemblyEnabled(e.target.checked);
                                        if (!e.target.checked) {
                                          setReassemblyCount(0);
                                        } else if (reassemblyCount === 0) {
                                          setReassemblyCount(1);
                                        }
                                      }}
                                      className="w-4 h-4 rounded border-slate-300 text-red-600 focus:ring-2 focus:ring-red-200"
                                    />
                                    <span className="text-sm font-semibold text-slate-900">
                                      Reassembly (+£{extrasPricing?.reassemblyPerItem || 0} per item)
                                    </span>
                                  </label>
                                </div>

                                {reassemblyEnabled && (
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => setReassemblyCount(Math.max(0, reassemblyCount - 1))}
                                      className="w-8 h-8 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 transition-colors flex items-center justify-center"
                                    >
                                      <Minus className="w-4 h-4 text-slate-700" />
                                    </button>
                                    <input
                                      type="number"
                                      min="0"
                                      value={reassemblyCount}
                                      onChange={(e) => setReassemblyCount(Math.max(0, parseInt(e.target.value) || 0))}
                                      className="w-16 px-2 py-1 text-center rounded-lg border border-slate-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setReassemblyCount(reassemblyCount + 1)}
                                      className="w-8 h-8 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 transition-colors flex items-center justify-center"
                                    >
                                      <Plus className="w-4 h-4 text-slate-700" />
                                    </button>
                                    <span className="text-sm text-slate-600 ml-2">
                                      items (£{reassemblyCount * (extrasPricing?.reassemblyPerItem || 0)})
                                    </span>
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </div>

                        {/* PROTECTION / INSURANCE - AVAILABLE FOR BOTH */}
                        <div className="border border-slate-200 rounded-xl p-4">
                          <div className="flex items-start gap-2 mb-3">
                            <Shield className="w-5 h-5 text-slate-700 mt-0.5" />
                            <div className="flex-1">
                              <h4 className="font-semibold text-slate-900">Protection & Insurance</h4>
                            </div>
                          </div>

                          <div className="space-y-3">
                            {/* Basic Cover */}
                            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center">
                                  <span className="text-white text-xs">✓</span>
                                </div>
                                <span className="font-semibold text-slate-900">Basic Cover (Included)</span>
                              </div>
                              <p className="text-xs text-slate-600 ml-7">
                                Covers up to £50,000 total, plus damage to your goods
                              </p>
                            </div>

                            {/* Extended Protection - AVAILABLE FOR BOTH PACKAGES */}
                            <div className="bg-slate-50 rounded-lg p-3">
                              <label className="flex items-start gap-2 cursor-pointer group">
                                <input
                                  type="checkbox"
                                  checked={extendedProtection}
                                  onChange={(e) => setExtendedProtection(e.target.checked)}
                                  className="mt-1 w-4 h-4 rounded border-slate-300 text-red-600 focus:ring-2 focus:ring-red-200"
                                />
                                <div className="flex-1">
                                  <div className="font-semibold text-slate-900 group-hover:text-red-600 transition-colors">
                                    Extended Protection (+£{extrasPricing?.extendedProtection || 0})
                                  </div>
                                  <p className="text-xs text-slate-600 mt-1">
                                    Covers loss, fire and theft up to £50,000, plus damage to your goods whilst in transit
                                  </p>
                                </div>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* RIGHT SIDEBAR: IDENTICAL TO STEP 3 (40%) */}
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-4 order-first lg:order-last">
                <QuoteSummaryPanel
                  quote={{
                    breakdown: {
                      total: finalPrice,
                      base: basePrice,
                      distance: 0,
                      crew: 0,
                      inventory: 0,
                      access: 0,
                      extrasPrice: extrasTotal,
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
                  currentStep={4}
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
      )} {/* Close conditional rendering */}
    </div>
  );
}