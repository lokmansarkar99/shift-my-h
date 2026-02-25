import React, { useState, useEffect } from 'react';
import { HouseMoveQuote } from './houseMoveTypes';
import { MapView } from '../../MapView';
import { MoveSummaryCard } from '../../MoveSummaryCard';
import { MapboxAddressAutocomplete } from '../../../ui/MapboxAddressAutocomplete';
import { CustomDatePicker } from '../../../ui/CustomDatePicker';
import { TimeSelector } from '../../TimeSelector';
import { ArrowRight, CheckCircle, Home } from 'lucide-react';
import { MAPBOX_PUBLIC_TOKEN } from '../../../../utils/mapboxConfig';
import { generateQuoteRef } from '../../../../utils/quoteStorage';
import { projectId, publicAnonKey } from '../../../../utils/supabase/info';

interface StepProps {
  data: HouseMoveQuote;
  onChange: (updates: Partial<HouseMoveQuote>) => void;
  onNext: () => void;
  serviceType?: string;
}

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

export function Step1Address({ data, onChange, onNext }: StepProps) {
  // Local state for form fields
  const [pickupAddress, setPickupAddress] = useState(data.pickup.address || '');
  const [pickupPostcode, setPickupPostcode] = useState(data.pickup.postcode || '');
  const [pickupPropertyType, setPickupPropertyType] = useState(data.pickup.propertyType || '');
  const [pickupFloor, setPickupFloor] = useState<string>('Ground floor');
  const [liftAvailableAtPickup, setLiftAvailableAtPickup] = useState(data.pickup.hasLift || false);

  const [deliveryAddress, setDeliveryAddress] = useState(data.dropoff.address || '');
  const [deliveryPostcode, setDeliveryPostcode] = useState(data.dropoff.postcode || '');
  const [deliveryPropertyType, setDeliveryPropertyType] = useState(data.dropoff.propertyType || '');
  const [deliveryFloor, setDeliveryFloor] = useState<string>('Ground floor');
  const [liftAvailableAtDelivery, setLiftAvailableAtDelivery] = useState(data.dropoff.hasLift || false);

  const [pickupLat, setPickupLat] = useState(data.pickup.lat);
  const [pickupLng, setPickupLng] = useState(data.pickup.lng);
  const [deliveryLat, setDeliveryLat] = useState(data.dropoff.lat);
  const [deliveryLng, setDeliveryLng] = useState(data.dropoff.lng);

  const [hasDateSelected, setHasDateSelected] = useState(!data.dateUnsure);
  const [moveDate, setMoveDate] = useState(
    data.date 
      ? (data.date instanceof Date ? data.date.toISOString().split('T')[0] : typeof data.date === 'string' ? data.date : '')
      : ''
  );
  const [arrivalTimeFrom, setArrivalTimeFrom] = useState(480); // 08:00 default
  const [arrivalTimeTo, setArrivalTimeTo] = useState(600);     // 10:00 default
  const [hasTimeSelected, setHasTimeSelected] = useState(false);

  const [distance, setDistance] = useState(data.distance);
  const [duration, setDuration] = useState<number | undefined>();
  const [availabilityMessage, setAvailabilityMessage] = useState('');
  const [quoteRef, setQuoteRef] = useState(data.quoteReference || '');

  // Generate quote reference on mount
  useEffect(() => {
    if (!data.quoteReference) {
      const newQuoteRef = generateQuoteRef();
      setQuoteRef(newQuoteRef);
      onChange({ quoteReference: newQuoteRef });
      
      // Save to database
      fetch(`https://${projectId}.supabase.co/functions/v1/make-server-94f26792/save-quote-ref`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quoteRef: newQuoteRef,
          serviceCategory: 'house_move',
        }),
      }).catch(error => console.error('Failed to save quote ref to DB:', error));
    }
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

  const isFormValid = 
    pickupAddress && 
    deliveryAddress && 
    pickupPropertyType && 
    deliveryPropertyType &&
    pickupFloor &&
    deliveryFloor;

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) {
      console.log('Form validation failed');
      return;
    }

    // Update data with all fields
    onChange({
      pickup: {
        address: pickupAddress,
        postcode: pickupPostcode,
        propertyType: pickupPropertyType,
        floor: FLOOR_OPTIONS.indexOf(pickupFloor),
        hasLift: liftAvailableAtPickup,
        lat: pickupLat,
        lng: pickupLng,
      },
      dropoff: {
        address: deliveryAddress,
        postcode: deliveryPostcode,
        propertyType: deliveryPropertyType,
        floor: FLOOR_OPTIONS.indexOf(deliveryFloor),
        hasLift: liftAvailableAtDelivery,
        lat: deliveryLat,
        lng: deliveryLng,
      },
      date: hasDateSelected && moveDate ? new Date(moveDate) : undefined,
      dateUnsure: !hasDateSelected,
      distance,
      duration,
    });

    onNext();
  };

  // Set minimum date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      {/* 2 Column Layout - 60/40 split */}
      <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-6 lg:gap-8">
        {/* LEFT COLUMN - FORM (60%) */}
        <div className="space-y-6 order-last lg:order-first">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:p-8">
            {/* Service Header with Icon */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  House Move
                </h1>
                <p className="text-sm text-slate-600">Where are we collecting and delivering your household move?</p>
              </div>
            </div>

            <form onSubmit={handleNext} className="space-y-6">
              {/* ROW 1 - ADDRESSES (2 columns on desktop, 1 on mobile) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Pickup Address */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Pickup address
                  </label>
                  <MapboxAddressAutocomplete
                    value={pickupAddress}
                    onChange={setPickupAddress}
                    onSelect={(parsedAddress) => {
                      setPickupAddress(parsedAddress.fullAddress || parsedAddress.street);
                      setPickupPostcode(parsedAddress.postcode);
                      if (parsedAddress.latitude && parsedAddress.longitude) {
                        setPickupLat(parsedAddress.latitude);
                        setPickupLng(parsedAddress.longitude);
                      }
                    }}
                    placeholder="e.g., 10 Downing Street, SW1A 2AA"
                    required
                    badgeType="A"
                  />
                </div>

                {/* Delivery Address */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Delivery address
                  </label>
                  <MapboxAddressAutocomplete
                    value={deliveryAddress}
                    onChange={setDeliveryAddress}
                    onSelect={(parsedAddress) => {
                      setDeliveryAddress(parsedAddress.fullAddress || parsedAddress.street);
                      setDeliveryPostcode(parsedAddress.postcode);
                      if (parsedAddress.latitude && parsedAddress.longitude) {
                        setDeliveryLat(parsedAddress.latitude);
                        setDeliveryLng(parsedAddress.longitude);
                      }
                    }}
                    placeholder="e.g., Edinburgh Castle, EH1 2NG"
                    required
                    badgeType="B"
                  />
                </div>
              </div>

              {/* ROW 2 - PROPERTY TYPES */}
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

              {/* ROW 3 - FLOORS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Pickup Floor */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Pickup floor
                  </label>
                  <select
                    value={pickupFloor}
                    onChange={(e) => setPickupFloor(e.target.value)}
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
                    onChange={(e) => setDeliveryFloor(e.target.value)}
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

              {/* ROW 4 - LIFT */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Lift Available at Pickup */}
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

                {/* Lift Available at Delivery */}
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

              {/* ROW 5 - DATE & TIME */}
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

                    {/* Radio Buttons */}
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          checked={hasTimeSelected}
                          onChange={() => setHasTimeSelected(true)}
                          className="w-5 h-5 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-slate-700 font-medium">Select a preferred time</span>
                      </label>

                      <div>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            checked={!hasTimeSelected}
                            onChange={() => setHasTimeSelected(false)}
                            className="w-5 h-5 text-purple-600 focus:ring-purple-500"
                          />
                          <span className="text-slate-700 font-medium">I'm flexible on the time</span>
                        </label>
                        {!hasTimeSelected && (
                          <p className="text-sm text-green-600 font-medium mt-2 ml-8">
                            No problem — you can confirm the time later.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Time Selector */}
                    {hasTimeSelected && (
                      <div>
                        <TimeSelector
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
  );
}