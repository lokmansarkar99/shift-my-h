/**
 * Other Delivery - Step 1: Address
 * Pickup + Delivery addresses (NO property types) + Floors + Lift + Date
 * IDENTICAL to Furniture & Items Step 1
 */

import React, { useState, useEffect } from 'react';
import { OtherQuote } from './otherTypes';
import { MapView } from '../../MapView';
import { MoveSummaryCard } from '../../MoveSummaryCard';
import { MapboxAddressAutocomplete } from '../../../ui/MapboxAddressAutocomplete';
import { CustomDatePicker } from '../../../ui/CustomDatePicker';
import { TimeRangeSlider } from '../../TimeRangeSlider';
import { ArrowRight, CheckCircle, Package } from 'lucide-react';
import { MAPBOX_PUBLIC_TOKEN } from '../../../../utils/mapboxConfig';
import { generateQuoteRef } from '../../../../utils/quoteStorage';
import { projectId, publicAnonKey } from '../../../../utils/supabase/info';

interface StepProps {
  data: OtherQuote;
  onChange: (updates: Partial<OtherQuote>) => void;
  onNext: () => void;
}

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

export function OtherStep1Address({ data, onChange, onNext }: StepProps) {
  // Local state for form fields
  const [pickupAddress, setPickupAddress] = useState(data.pickup.address || '');
  const [pickupPostcode, setPickupPostcode] = useState(data.pickup.postcode || '');
  const [pickupFloor, setPickupFloor] = useState<string>('Ground floor');
  const [liftAvailableAtPickup, setLiftAvailableAtPickup] = useState(data.pickup.hasLift || false);

  const [deliveryAddress, setDeliveryAddress] = useState(data.dropoff.address || '');
  const [deliveryPostcode, setDeliveryPostcode] = useState(data.dropoff.postcode || '');
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
          serviceCategory: 'other_delivery',
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

  // Only addresses + floors required (NO property types)
  const isFormValid = 
    pickupAddress && 
    deliveryAddress && 
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
        floor: FLOOR_OPTIONS.indexOf(pickupFloor),
        hasLift: liftAvailableAtPickup,
        lat: pickupLat,
        lng: pickupLng,
      },
      dropoff: {
        address: deliveryAddress,
        postcode: deliveryPostcode,
        floor: FLOOR_OPTIONS.indexOf(deliveryFloor),
        hasLift: liftAvailableAtDelivery,
        lat: deliveryLat,
        lng: deliveryLng,
      },
      date: hasDateSelected && moveDate ? new Date(moveDate) : undefined,
      dateUnsure: !hasDateSelected,
      distance,
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
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Other Delivery Service
                </h1>
                <p className="text-sm text-slate-600">Where are we picking up and delivering?</p>
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

              {/* ROW 2 - FLOORS (2 columns on desktop, 1 on mobile) */}
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
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none bg-white"
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
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none bg-white"
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

              {/* ROW 3 - LIFT */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Lift Available at Pickup */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border border-slate-300 hover:border-amber-400 hover:bg-amber-50 transition-all">
                    <input
                      type="checkbox"
                      checked={liftAvailableAtPickup}
                      onChange={(e) => setLiftAvailableAtPickup(e.target.checked)}
                      className="w-5 h-5 text-amber-600 focus:ring-amber-500 rounded"
                    />
                    <span className="text-sm font-semibold text-slate-700">
                      Lift available at pickup location
                    </span>
                  </label>
                </div>

                {/* Lift Available at Delivery */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border border-slate-300 hover:border-amber-400 hover:bg-amber-50 transition-all">
                    <input
                      type="checkbox"
                      checked={liftAvailableAtDelivery}
                      onChange={(e) => setLiftAvailableAtDelivery(e.target.checked)}
                      className="w-5 h-5 text-amber-600 focus:ring-amber-500 rounded"
                    />
                    <span className="text-sm font-semibold text-slate-700">
                      Lift available at delivery location
                    </span>
                  </label>
                </div>
              </div>

              {/* ROW 4 - DATE & TIME */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-slate-200">
                {/* LEFT COLUMN - MOVE DATE */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Delivery Date
                  </h3>

                  {/* Radio Buttons */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        checked={hasDateSelected}
                        onChange={() => setHasDateSelected(true)}
                        className="w-5 h-5 text-amber-600 focus:ring-amber-500"
                      />
                      <span className="text-slate-700 font-medium">Select a delivery date</span>
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
                          className="w-5 h-5 text-amber-600 focus:ring-amber-500"
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
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700 shadow-lg hover:shadow-xl'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                Next: Select Items
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN - MAP + SUMMARY (40%) */}
        <div className="space-y-6 lg:sticky lg:top-4 lg:self-start order-first lg:order-last">
          {/* Quote Reference */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl shadow-sm border border-amber-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 font-medium mb-1">Quote ref:</p>
                <p className="text-xl font-bold text-slate-900">
                  {quoteRef || 'Generating...'}
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            pickupPropertyType="" // No property type
            deliveryPropertyType="" // No property type
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