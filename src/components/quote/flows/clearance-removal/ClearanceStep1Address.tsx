/**
 * Clearance & Removal - Step 1: Address
 * Collection address ONLY + Service Type + Floor + Lift + Date
 */

import React, { useState, useEffect } from 'react';
import { ClearanceQuote } from './clearanceTypes';
import { MapView } from '../../MapView';
import { MapboxAddressAutocomplete } from '../../../ui/MapboxAddressAutocomplete';
import { CustomDatePicker } from '../../../ui/CustomDatePicker';
import { TimeRangeSlider } from '../../TimeRangeSlider';
import { ArrowRight, CheckCircle, Trash2, MapPin } from 'lucide-react';
import { MAPBOX_PUBLIC_TOKEN } from '../../../../utils/mapboxConfig';
import { generateQuoteRef } from '../../../../utils/quoteStorage';
import { projectId, publicAnonKey } from '../../../../utils/supabase/info';

interface StepProps {
  data: ClearanceQuote;
  onChange: (updates: Partial<ClearanceQuote>) => void;
  onNext: () => void;
}

const SERVICE_TYPES = [
  'House Clearance',
  'Flat Clearance',
  'Garden Clearance',
  'Garage Clearance',
  'Office Clearance',
  'Builders Waste',
  'General Junk Removal',
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

export function ClearanceStep1Address({ data, onChange, onNext }: StepProps) {
  // Local state for form fields
  const [pickupAddress, setPickupAddress] = useState(data.pickup.address || '');
  const [pickupPostcode, setPickupPostcode] = useState(data.pickup.postcode || '');
  const [serviceType, setServiceType] = useState(''); // Service Type instead of Property Type
  const [pickupFloor, setPickupFloor] = useState<string>('Ground floor');
  const [liftAvailableAtPickup, setLiftAvailableAtPickup] = useState(data.pickup.hasLift || false);

  const [pickupLat, setPickupLat] = useState(data.pickup.lat);
  const [pickupLng, setPickupLng] = useState(data.pickup.lng);

  // Disposal location state
  const [hasSpecificDisposalLocation, setHasSpecificDisposalLocation] = useState(!!data.delivery?.address);
  const [deliveryAddress, setDeliveryAddress] = useState(data.delivery?.address || '');
  const [deliveryPostcode, setDeliveryPostcode] = useState(data.delivery?.postcode || '');
  const [deliveryLat, setDeliveryLat] = useState(data.delivery?.lat);
  const [deliveryLng, setDeliveryLng] = useState(data.delivery?.lng);

  const [hasDateSelected, setHasDateSelected] = useState(!data.dateUnsure);
  const [moveDate, setMoveDate] = useState(() => {
    if (!data.date) return '';
    // Handle both Date objects and ISO strings from localStorage
    const dateObj = data.date instanceof Date ? data.date : new Date(data.date);
    return dateObj.toISOString().split('T')[0];
  });
  const [arrivalTimeFrom, setArrivalTimeFrom] = useState(480); // 08:00 default
  const [arrivalTimeTo, setArrivalTimeTo] = useState(600);     // 10:00 default

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
          serviceCategory: 'clearance_removal',
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
    if (hasSpecificDisposalLocation && deliveryAddress && deliveryPostcode) {
      geocodeAddress(`${deliveryAddress}, ${deliveryPostcode}`).then((coords) => {
        if (coords) {
          setDeliveryLat(coords.lat);
          setDeliveryLng(coords.lng);
        }
      });
    }
  }, [hasSpecificDisposalLocation, deliveryAddress, deliveryPostcode]);

  // Show availability message when date is selected
  useEffect(() => {
    if (hasDateSelected && moveDate && pickupAddress) {
      const city = pickupAddress.split(',')[0] || 'your area';
      const formattedDate = new Date(moveDate).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      setAvailabilityMessage(`Great! We have clearance availability in ${city} on ${formattedDate}`);
    } else {
      setAvailabilityMessage('');
    }
  }, [hasDateSelected, moveDate, pickupAddress]);

  const isFormValid = 
    pickupAddress && 
    serviceType &&
    pickupFloor &&
    (!hasSpecificDisposalLocation || (hasSpecificDisposalLocation && deliveryAddress));

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
      delivery: hasSpecificDisposalLocation ? {
        address: deliveryAddress,
        postcode: deliveryPostcode,
        floor: 0, // Not relevant for disposal location
        hasLift: false, // Not relevant for disposal location
        lat: deliveryLat,
        lng: deliveryLng,
      } : undefined,
      date: hasDateSelected && moveDate ? new Date(moveDate) : undefined,
      dateUnsure: !hasDateSelected,
      // NEW: Save clearance service type and disposal settings
      clearanceServiceType: serviceType,
      disposalSelected: !hasSpecificDisposalLocation, // true if "We'll dispose"
      hasSpecificDisposalLocation: hasSpecificDisposalLocation, // true if specific location provided
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
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                <Trash2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Clearance & Removal Service
                </h1>
                <p className="text-sm text-slate-600">Where do you need waste collection?</p>
              </div>
            </div>

            <form onSubmit={handleNext} className="space-y-6">
              {/* ROW 1 - COLLECTION ADDRESS (Full width) */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Collection address
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
                  badgeType="📍"
                />
                <p className="text-sm text-slate-500 mt-2 ml-1">
                  💡 We'll collect the waste from this location
                </p>
              </div>

              {/* ROW 2 - SERVICE TYPE (Full width) */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Service type
                </label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none bg-white"
                >
                  <option value="">Choose service type</option>
                  {SERVICE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* ROW 2.5 - DISPOSAL LOCATION CHOICE */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
                <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Trash2 className="w-5 h-5 text-orange-600" />
                  Where should we dispose of the waste?
                </h3>
                
                <div className="space-y-3">
                  {/* Option 1: We dispose */}
                  <label className={`flex items-start gap-4 cursor-pointer p-4 rounded-xl border-2 transition-all ${ 
                    !hasSpecificDisposalLocation 
                      ? 'border-orange-500 bg-orange-50' 
                      : 'border-slate-300 bg-white hover:border-orange-300'
                  }`}>
                    <input
                      type="radio"
                      checked={!hasSpecificDisposalLocation}
                      onChange={() => {
                        setHasSpecificDisposalLocation(false);
                        setDeliveryAddress('');
                        setDeliveryPostcode('');
                        setDeliveryLat(undefined);
                        setDeliveryLng(undefined);
                      }}
                      className="w-5 h-5 text-orange-600 focus:ring-orange-500 mt-0.5 flex-shrink-0"
                    />
                    <div>
                      <div className="font-semibold text-slate-900 mb-1">
                        🚛 We'll dispose of it for you (Recommended)
                      </div>
                      <div className="text-sm text-slate-600">
                        We'll take care of proper waste disposal at licensed facilities. Included in the quote.
                      </div>
                    </div>
                  </label>

                  {/* Option 2: Specific location */}
                  <label className={`flex items-start gap-4 cursor-pointer p-4 rounded-xl border-2 transition-all ${ 
                    hasSpecificDisposalLocation 
                      ? 'border-orange-500 bg-orange-50' 
                      : 'border-slate-300 bg-white hover:border-orange-300'
                  }`}>
                    <input
                      type="radio"
                      checked={hasSpecificDisposalLocation}
                      onChange={() => setHasSpecificDisposalLocation(true)}
                      className="w-5 h-5 text-orange-600 focus:ring-orange-500 mt-0.5 flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-slate-900 mb-1">
                        📍 I have a specific disposal location
                      </div>
                      <div className="text-sm text-slate-600 mb-3">
                        Deliver the waste to a location you specify (e.g., your own waste facility, skip, etc.)
                      </div>
                      
                      {/* Conditional Address Field */}
                      {hasSpecificDisposalLocation && (
                        <div className="mt-3 pt-3 border-t border-slate-200">
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Disposal/Delivery address
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
                            placeholder="e.g., Waste facility address"
                            required={hasSpecificDisposalLocation}
                            badgeType="🗑️"
                          />
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              {/* ROW 3 - FLOOR & LIFT (2 columns) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Floor */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Collection floor
                  </label>
                  <select
                    value={pickupFloor}
                    onChange={(e) => setPickupFloor(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none bg-white"
                  >
                    <option value="">Choose floor</option>
                    {FLOOR_OPTIONS.map((floor) => (
                      <option key={floor} value={floor}>
                        {floor}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Lift Available */}
                <div className="flex items-end">
                  <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border border-slate-300 hover:border-orange-400 hover:bg-orange-50 transition-all w-full">
                    <input
                      type="checkbox"
                      checked={liftAvailableAtPickup}
                      onChange={(e) => setLiftAvailableAtPickup(e.target.checked)}
                      className="w-5 h-5 text-orange-600 focus:ring-orange-500 rounded"
                    />
                    <span className="text-sm font-semibold text-slate-700">
                      Lift available at location
                    </span>
                  </label>
                </div>
              </div>

              {/* ROW 4 - DATE & TIME */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-200">
                {/* LEFT COLUMN - Collection DATE */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Collection Date
                  </h3>

                  {/* Radio Buttons */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        checked={hasDateSelected}
                        onChange={() => setHasDateSelected(true)}
                        className="w-5 h-5 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-slate-700 font-medium">Select a collection date</span>
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
                          className="w-5 h-5 text-orange-600 focus:ring-orange-500"
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
                      Preferred Collection Time
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
                    ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-orange-700 hover:to-red-700 shadow-lg hover:shadow-xl'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                Next: Add Waste Items
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN - MAP + SUMMARY (40%) */}
        <div className="space-y-6 lg:sticky lg:top-4 lg:self-start order-first lg:order-last">
          {/* Quote Reference */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl shadow-sm border border-orange-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 font-medium mb-1">Quote ref:</p>
                <p className="text-xl font-bold text-slate-900">
                  {quoteRef || 'Generating...'}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Map - Single Point */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
            <div className="mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-600" />
              <h3 className="text-sm font-bold text-slate-900">
                {hasSpecificDisposalLocation && deliveryAddress ? 'Collection → Disposal Route' : 'Collection Location'}
              </h3>
            </div>
            <MapView
              pickupLat={pickupLat}
              pickupLng={pickupLng}
              deliveryLat={hasSpecificDisposalLocation ? deliveryLat : undefined}
              deliveryLng={hasSpecificDisposalLocation ? deliveryLng : undefined}
              onRouteUpdate={(dist, dur) => {
                // Route data available if needed
              }}
            />
          </div>

          {/* Summary Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-orange-600" />
              Clearance Summary
            </h3>

            {!pickupAddress ? (
              <div className="text-center py-8 text-slate-500">
                <p className="text-sm">Enter collection address to see summary</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Collection Location */}
                <div className="pb-4 border-b border-slate-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <MapPin className="w-4 h-4 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-slate-500 uppercase mb-1">
                        Collection Location
                      </div>
                      <div className="font-semibold text-slate-900 text-sm mb-1">
                        {pickupAddress}
                      </div>
                      {serviceType && (
                        <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
                          <Trash2 className="w-3 h-3" />
                          {serviceType}
                        </div>
                      )}
                      {pickupFloor && (
                        <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
                          <span className="font-medium">Floor:</span> {pickupFloor}
                        </div>
                      )}
                      {liftAvailableAtPickup !== undefined && (
                        <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
                          <span className="font-medium">Lift:</span> {liftAvailableAtPickup ? 'Yes' : 'No'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Disposal Location */}
                {hasSpecificDisposalLocation && deliveryAddress && (
                  <div className="pb-4 border-b border-slate-200">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Trash2 className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-semibold text-slate-500 uppercase mb-1">
                          Disposal Location
                        </div>
                        <div className="font-semibold text-slate-900 text-sm mb-1">
                          {deliveryAddress}
                        </div>
                        <div className="text-xs text-green-600 mt-1">
                          ✓ Custom disposal location selected
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Disposal Method (if we dispose) */}
                {!hasSpecificDisposalLocation && (
                  <div className="pb-4 border-b border-slate-200">
                    <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                      <div className="text-xs font-semibold text-green-600 uppercase mb-1">
                        Disposal Method
                      </div>
                      <div className="text-sm text-green-800 font-medium">
                        🚛 We'll dispose at licensed facilities
                      </div>
                      <div className="text-xs text-green-700 mt-1">
                        Included in quote • Eco-friendly disposal
                      </div>
                    </div>
                  </div>
                )}

                {/* Collection Date */}
                {moveDate && hasDateSelected && (
                  <div className="pb-4 border-b border-slate-200">
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border border-orange-200">
                      <div className="text-xs font-semibold text-orange-600 uppercase mb-2">
                        Collection Date
                      </div>
                      <div className="text-lg font-bold text-slate-900">
                        {new Date(moveDate).toLocaleDateString('en-GB', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </div>
                      <div className="text-sm text-slate-600 mt-1">
                        {`${Math.floor(arrivalTimeFrom / 60).toString().padStart(2, '0')}:${(arrivalTimeFrom % 60).toString().padStart(2, '0')}`} - {`${Math.floor(arrivalTimeTo / 60).toString().padStart(2, '0')}:${(arrivalTimeTo % 60).toString().padStart(2, '0')}`}
                      </div>
                    </div>
                  </div>
                )}

                {!hasDateSelected && (
                  <div className="pb-4 border-b border-slate-200">
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                      <div className="text-xs font-semibold text-blue-600 uppercase mb-1">
                        Collection Date
                      </div>
                      <div className="text-sm text-blue-800 font-medium">
                        Flexible - to be confirmed
                      </div>
                    </div>
                  </div>
                )}

                {/* Next Steps */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="text-xs font-semibold text-slate-500 uppercase mb-2">
                    Next Steps
                  </div>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      Add items to be collected
                    </li>
                    <li className="flex items-center gap-2 text-slate-400">
                      <div className="w-4 h-4 rounded-full border-2 border-slate-300 flex-shrink-0"></div>
                      Review and confirm
                    </li>
                    <li className="flex items-center gap-2 text-slate-400">
                      <div className="w-4 h-4 rounded-full border-2 border-slate-300 flex-shrink-0"></div>
                      Get instant quote
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}