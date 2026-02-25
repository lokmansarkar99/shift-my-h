import React, { useState, useEffect } from 'react';
import { QuoteHeader } from '../QuoteHeader';
import { QuoteProgressBar } from '../QuoteProgressBar';
import { MapView } from '../MapView';
import { MoveSummaryCard } from '../MoveSummaryCard';
import { router } from '../../../utils/router';
import { saveQuoteData, getQuoteData, updateLastStep, generateJourneyId, generateQuoteRef } from '../../../utils/quoteStorage';
import { MapboxAddressAutocomplete } from '../../ui/MapboxAddressAutocomplete';
import { CustomDatePicker } from '../../ui/CustomDatePicker';
import { TimeRangeSlider } from '../TimeRangeSlider';
import { ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { MAPBOX_PUBLIC_TOKEN } from '../../../utils/mapboxConfig';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

const PROPERTY_TYPES = [
  'Studio',
  '1 Bed Flat',
  '1 Bed House',
  '2 Bed House',
  '3 Bed House',
  '4+ Bed House',
];

const FLOOR_OPTIONS = [
  'Basement',
  'Ground floor',
  '1st',
  '2nd',
  '3rd',
  '4th',
  '5th+',
];

// Geocoding function using Mapbox
async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${MAPBOX_PUBLIC_TOKEN}&country=GB`
    );
    const data = await response.json();
    if (data.features && data.features.length > 0) {
      const [lng, lat] = data.features[0].center;
      return { lat, lng };
    }
  } catch (error) {
    console.error('Geocoding error:', error);
  }
  return null;
}

export function QuoteStep1Page() {
  // Check if service category exists - Guard
  const [hasServiceCategory, setHasServiceCategory] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [quoteRef, setQuoteRef] = useState('');
  const [serviceCategory, setServiceCategory] = useState('');

  useEffect(() => {
    const savedData = getQuoteData();
    if (!savedData.serviceCategory) {
      // No service category - redirect to home
      setHasServiceCategory(false);
      setIsChecking(false);
    } else {
      setHasServiceCategory(true);
      setServiceCategory(savedData.serviceCategory);
      setIsChecking(false);
    }
  }, []);

  // Form state
  const [pickupAddress, setPickupAddress] = useState('');
  const [pickupPostcode, setPickupPostcode] = useState('');
  const [pickupPropertyType, setPickupPropertyType] = useState('');
  const [pickupFloor, setPickupFloor] = useState('Ground floor'); // ✅ DEFAULT: Ground floor
  const [liftAvailableAtPickup, setLiftAvailableAtPickup] = useState(false);
  const [pickupLat, setPickupLat] = useState<number | undefined>();
  const [pickupLng, setPickupLng] = useState<number | undefined>();

  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryPostcode, setDeliveryPostcode] = useState('');
  const [deliveryPropertyType, setDeliveryPropertyType] = useState('');
  const [deliveryFloor, setDeliveryFloor] = useState('Ground floor'); // ✅ DEFAULT: Ground floor
  const [liftAvailableAtDelivery, setLiftAvailableAtDelivery] = useState(false);
  const [deliveryLat, setDeliveryLat] = useState<number | undefined>();
  const [deliveryLng, setDeliveryLng] = useState<number | undefined>();

  // 🧠 Track if user manually changed floor (prevent auto-reset)
  const [pickupFloorUserEdited, setPickupFloorUserEdited] = useState(false);
  const [deliveryFloorUserEdited, setDeliveryFloorUserEdited] = useState(false);

  const [hasDateSelected, setHasDateSelected] = useState(true);
  const [moveDate, setMoveDate] = useState('');
  const [arrivalTimeFrom, setArrivalTimeFrom] = useState(480); // 08:00 default
  const [arrivalTimeTo, setArrivalTimeTo] = useState(600);     // 10:00 default

  const [distance, setDistance] = useState<number | undefined>();
  const [duration, setDuration] = useState<number | undefined>();
  const [availabilityMessage, setAvailabilityMessage] = useState('');

  // Load saved data on mount
  useEffect(() => {
    const savedData = getQuoteData();
    
    // Generate journey ID if not exists
    if (!savedData.journeyId) {
      const journeyId = generateJourneyId();
      saveQuoteData({ journeyId });
    }

    // Generate quote reference if not exists
    if (!savedData.quoteRef) {
      const newQuoteRef = generateQuoteRef();
      setQuoteRef(newQuoteRef);
      saveQuoteData({ quoteRef: newQuoteRef });
      
      // Save to database
      fetch(`https://${projectId}.supabase.co/functions/v1/make-server-94f26792/save-quote-ref`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quoteRef: newQuoteRef,
          journeyId: savedData.journeyId,
          serviceCategory: savedData.serviceCategory,
        }),
      }).catch(error => console.error('Failed to save quote ref to DB:', error));
    } else {
      setQuoteRef(savedData.quoteRef);
    }

    if (savedData.pickupAddress) setPickupAddress(savedData.pickupAddress);
    if (savedData.pickupPostcode) setPickupPostcode(savedData.pickupPostcode);
    if (savedData.pickupPropertyType) setPickupPropertyType(savedData.pickupPropertyType);
    if (savedData.pickupFloor) setPickupFloor(savedData.pickupFloor);
    if (savedData.liftAvailableAtPickup) setLiftAvailableAtPickup(savedData.liftAvailableAtPickup);
    if (savedData.pickupLat) setPickupLat(savedData.pickupLat);
    if (savedData.pickupLng) setPickupLng(savedData.pickupLng);

    if (savedData.deliveryAddress) setDeliveryAddress(savedData.deliveryAddress);
    if (savedData.deliveryPostcode) setDeliveryPostcode(savedData.deliveryPostcode);
    if (savedData.deliveryPropertyType) setDeliveryPropertyType(savedData.deliveryPropertyType);
    if (savedData.deliveryFloor) setDeliveryFloor(savedData.deliveryFloor);
    if (savedData.liftAvailableAtDelivery) setLiftAvailableAtDelivery(savedData.liftAvailableAtDelivery);
    if (savedData.deliveryLat) setDeliveryLat(savedData.deliveryLat);
    if (savedData.deliveryLng) setDeliveryLng(savedData.deliveryLng);

    if (savedData.hasDateSelected !== undefined) setHasDateSelected(savedData.hasDateSelected);
    if (savedData.moveDate) setMoveDate(savedData.moveDate);
    if (savedData.arrivalTimeFrom !== undefined) setArrivalTimeFrom(savedData.arrivalTimeFrom);
    if (savedData.arrivalTimeTo !== undefined) setArrivalTimeTo(savedData.arrivalTimeTo);
    if (savedData.distance) setDistance(savedData.distance);
    if (savedData.duration) setDuration(savedData.duration);
  }, []);

  // Geocode pickup address
  useEffect(() => {
    if (pickupAddress && pickupPostcode) {
      geocodeAddress(`${pickupAddress}, ${pickupPostcode}`).then((coords) => {
        if (coords) {
          setPickupLat(coords.lat);
          setPickupLng(coords.lng);
        }
      });
    }
  }, [pickupAddress, pickupPostcode]);

  // Geocode delivery address
  useEffect(() => {
    if (deliveryAddress && deliveryPostcode) {
      geocodeAddress(`${deliveryAddress}, ${deliveryPostcode}`).then((coords) => {
        if (coords) {
          setDeliveryLat(coords.lat);
          setDeliveryLng(coords.lng);
        }
      });
    }
  }, [deliveryAddress, deliveryPostcode]);

  // Distance and duration will be calculated by MapView via Mapbox Directions API
  // and returned via onRouteUpdate callback

  // Show availability message when date is selected
  useEffect(() => {
    if (hasDateSelected && moveDate && deliveryAddress) {
      const city = deliveryAddress.split(',')[0] || 'your area';
      const formattedDate = new Date(moveDate).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      setAvailabilityMessage(`Great! We have availability in ${city} on ${formattedDate}`);
    } else {
      setAvailabilityMessage('');
    }
  }, [hasDateSelected, moveDate, deliveryAddress]);

  // 🪑 FURNITURE MOVE: Skip property/floor validation in Step 1
  const isFurnitureMove = serviceCategory === 'furniture_items';

  const isFormValid = isFurnitureMove
    ? pickupAddress && deliveryAddress && pickupFloor && deliveryFloor // Furniture: Addresses + Floors required
    : pickupAddress && 
      deliveryAddress && 
      pickupPropertyType && 
      deliveryPropertyType &&
      pickupFloor &&
      deliveryFloor; // Other services: Full validation

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) {
      console.log('Form validation failed:', {
        isFurnitureMove,
        pickupAddress,
        deliveryAddress,
        pickupFloor,
        deliveryFloor,
        pickupPropertyType,
        deliveryPropertyType
      });
      return;
    }

    // Save all data (for furniture move, property types might be empty - that's OK)
    saveQuoteData({
      pickupAddress,
      pickupPostcode,
      pickupPropertyType: isFurnitureMove && !pickupPropertyType ? 'Not specified' : pickupPropertyType,
      pickupFloor,
      liftAvailableAtPickup,
      pickupLat,
      pickupLng,
      deliveryAddress,
      deliveryPostcode,
      deliveryPropertyType: isFurnitureMove && !deliveryPropertyType ? 'Not specified' : deliveryPropertyType,
      deliveryFloor,
      liftAvailableAtDelivery,
      deliveryLat,
      deliveryLng,
      distance,
      duration,
      hasDateSelected,
      moveDate: hasDateSelected ? moveDate : undefined,
      arrivalTimeFrom,
      arrivalTimeTo,
    });
    updateLastStep(1);

    console.log('Navigating to step 2...');
    // Navigate to step 2
    router.navigate({ page: 'quote-step', step: 2 });
  };

  // Set minimum date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  // Show guard screen if no service category
  if (isChecking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!hasServiceCategory) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <QuoteHeader />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              Please Choose a Service First
            </h2>
            <p className="text-slate-600 mb-6">
              To get a quote, you need to select which type of service you need from our homepage.
            </p>
            <button
              onClick={() => router.navigate({ page: 'home' })}
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl"
            >
              Back to Services
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <QuoteHeader />
      <QuoteProgressBar currentStep={1} />

      <div className="flex-1 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* 2 Column Layout - 60/40 split */}
          <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-6 lg:gap-8">
            {/* LEFT COLUMN - FORM (60%) */}
            <div className="space-y-6 order-last lg:order-first">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:p-8">
                <h1 className="text-2xl font-bold text-slate-900 mb-6">
                  Where are you moving from and to?
                </h1>

                <form onSubmit={handleNext} className="space-y-6">
                  {/* ROW 1 - ADDRESSES (2 columns on desktop, 1 on mobile) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Pickup Address */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                        {/* ❌ Removed old circular badge - now integrated in input */}
                        Pickup address
                      </label>
                      <MapboxAddressAutocomplete
                        value={pickupAddress}
                        onChange={setPickupAddress}
                        onSelect={(parsedAddress) => {
                          setPickupAddress(parsedAddress.fullAddress || parsedAddress.street);
                          setPickupPostcode(parsedAddress.postcode);
                          // Use coordinates from Mapbox directly
                          if (parsedAddress.latitude && parsedAddress.longitude) {
                            setPickupLat(parsedAddress.latitude);
                            setPickupLng(parsedAddress.longitude);
                          }
                        }}
                        placeholder="e.g., 10 Downing Street, SW1A 2AA"
                        required
                        badgeType="A" // ✅ Rounded square badge with "A"
                      />
                    </div>

                    {/* Delivery Address */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                        {/* ❌ Removed old circular badge - now integrated in input */}
                        Delivery address
                      </label>
                      <MapboxAddressAutocomplete
                        value={deliveryAddress}
                        onChange={setDeliveryAddress}
                        onSelect={(parsedAddress) => {
                          setDeliveryAddress(parsedAddress.fullAddress || parsedAddress.street);
                          setDeliveryPostcode(parsedAddress.postcode);
                          // Use coordinates from Mapbox directly
                          if (parsedAddress.latitude && parsedAddress.longitude) {
                            setDeliveryLat(parsedAddress.latitude);
                            setDeliveryLng(parsedAddress.longitude);
                          }
                        }}
                        placeholder="e.g., Edinburgh Castle, EH1 2NG"
                        required
                        badgeType="B" // ✅ Rounded square badge with "B"
                      />
                    </div>
                  </div>

                  {/* ROW 2 - PROPERTY TYPES (2 columns on desktop, 1 on mobile) - HIDDEN FOR FURNITURE MOVE */}
                  {!isFurnitureMove && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Pickup Property Type */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Pickup property type
                        </label>
                        <select
                          value={pickupPropertyType}
                          onChange={(e) => setPickupPropertyType(e.target.value)}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-white"
                        >
                          <option value="">Choose property type</option>
                          {PROPERTY_TYPES.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Delivery Property Type */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Delivery property type
                        </label>
                        <select
                          value={deliveryPropertyType}
                          onChange={(e) => setDeliveryPropertyType(e.target.value)}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-white"
                        >
                          <option value="">Choose property type</option>
                          {PROPERTY_TYPES.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {/* ROW 3 - FLOORS (2 columns on desktop, 1 on mobile) - VISIBLE FOR ALL SERVICES */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Pickup Floor */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Pickup floor
                      </label>
                      <select
                        value={pickupFloor}
                        onChange={(e) => {
                          setPickupFloor(e.target.value);
                          setPickupFloorUserEdited(true);
                        }}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-white"
                      >
                        <option value="">Choose floor</option>
                        {FLOOR_OPTIONS.map((floor) => (
                          <option key={floor} value={floor}>
                            {floor}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Delivery Floor */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Delivery floor
                      </label>
                      <select
                        value={deliveryFloor}
                        onChange={(e) => {
                          setDeliveryFloor(e.target.value);
                          setDeliveryFloorUserEdited(true);
                        }}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-white"
                      >
                        <option value="">Choose floor</option>
                        {FLOOR_OPTIONS.map((floor) => (
                          <option key={floor} value={floor}>
                            {floor}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* ROW 4 - LIFT (2 columns on desktop, 1 on mobile) - VISIBLE FOR ALL SERVICES */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Lift Available at Pickup (left column) */}
                    <div>
                      <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border border-slate-300 hover:border-blue-400 hover:bg-blue-50 transition-all">
                        <input
                          type="checkbox"
                          checked={liftAvailableAtPickup}
                          onChange={(e) => setLiftAvailableAtPickup(e.target.checked)}
                          className="w-5 h-5 text-blue-600 focus:ring-blue-500 rounded"
                        />
                        <span className="text-sm font-semibold text-slate-700">
                          Lift available at pickup location
                        </span>
                      </label>
                    </div>

                    {/* Lift Available at Delivery (right column) */}
                    <div>
                      <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border border-slate-300 hover:border-blue-400 hover:bg-blue-50 transition-all">
                        <input
                          type="checkbox"
                          checked={liftAvailableAtDelivery}
                          onChange={(e) => setLiftAvailableAtDelivery(e.target.checked)}
                          className="w-5 h-5 text-blue-600 focus:ring-blue-500 rounded"
                        />
                        <span className="text-sm font-semibold text-slate-700">
                          Lift available at delivery location
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* ROW 5 - DATE & TIME (2 columns on desktop, 1 on mobile) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-slate-200">
                    {/* LEFT COLUMN - MOVE DATE */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-slate-900">
                        Estimated Move Date
                      </h3>

                      {/* Radio Buttons */}
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            checked={hasDateSelected}
                            onChange={() => setHasDateSelected(true)}
                            className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-slate-700 font-medium">Select a move date</span>
                        </label>

                        <div>
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="radio"
                              checked={!hasDateSelected}
                              onChange={() => {
                                setHasDateSelected(false);
                                setMoveDate('');
                              }}
                              className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-slate-700 font-medium">I'm flexible on the date</span>
                          </label>
                          {!hasDateSelected && (
                            <p className="text-sm text-green-600 font-medium mt-2 ml-8">
                              No problem — you can confirm the date later.
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Date Picker */}
                      {hasDateSelected && (
                        <div>
                          <CustomDatePicker
                            value={moveDate}
                            onChange={setMoveDate}
                            minDate={minDate}
                            disabled={!hasDateSelected}
                          />
                        </div>
                      )}

                      {/* Availability Message */}
                      {availabilityMessage && (
                        <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-green-800 font-medium">
                            {availabilityMessage}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* RIGHT COLUMN - TIME RANGE */}
                    {hasDateSelected && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-900">
                          Preferred Arrival Time
                        </h3>

                        <TimeRangeSlider
                          startTime={arrivalTimeFrom}
                          endTime={arrivalTimeTo}
                          onChange={(start, end) => {
                            setArrivalTimeFrom(start);
                            setArrivalTimeTo(end);
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* NEXT BUTTON */}
                  <button
                    type="submit"
                    disabled={!isFormValid}
                    className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                      isFormValid
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-xl'
                        : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    Next Step
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>

            {/* RIGHT COLUMN - MAP + SUMMARY (40%) */}
            <div className="space-y-6 lg:sticky lg:top-4 lg:self-start order-first lg:order-last">
              {/* Quote Reference */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl shadow-sm border border-blue-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-600 font-medium mb-1">Quote ref:</p>
                    <p className="text-xl font-bold text-slate-900">
                      {quoteRef || 'Generating...'}
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
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
                <MapView
                  pickupLat={pickupLat}
                  pickupLng={pickupLng}
                  deliveryLat={deliveryLat}
                  deliveryLng={deliveryLng}
                  onRouteUpdate={(dist, dur) => {
                    setDistance(dist);
                    setDuration(dur);
                    saveQuoteData({ distance: dist, duration: dur });
                  }}
                />
              </div>

              {/* Summary Card */}
              <MoveSummaryCard
                quoteRef={quoteRef}
                pickupAddress={pickupAddress}
                deliveryAddress={deliveryAddress}
                pickupPropertyType={pickupPropertyType}
                deliveryPropertyType={deliveryPropertyType}
                pickupFloor={pickupFloor}
                deliveryFloor={deliveryFloor}
                liftAvailableAtPickup={liftAvailableAtPickup}
                liftAvailableAtDelivery={liftAvailableAtDelivery}
                distance={distance}
                duration={duration}
                moveDate={hasDateSelected ? moveDate : undefined}
                hasDateSelected={hasDateSelected}
                arrivalTimeFrom={arrivalTimeFrom}
                arrivalTimeTo={arrivalTimeTo}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}