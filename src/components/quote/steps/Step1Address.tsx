import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MapPin, Calendar, ArrowRight, Loader2, Info } from 'lucide-react';
import { QuoteRequest } from '../../../utils/pricingEngine';
import { UKAddressAutocomplete } from '../../ui/UKAddressAutocomplete';
import { MapPreview } from '../MapPreview';
import { mapService } from '../../../utils/mapService';
import { PropertyTypeSelector } from '../PropertyTypeSelector';

interface StepProps {
  data: QuoteRequest;
  onChange: (updates: Partial<QuoteRequest>) => void;
  onNext: () => void;
  serviceType?: string; // ✅ NEW: to conditionally hide property type for Clearance
}

export function Step1Address({ data, onChange, onNext, serviceType }: StepProps) {
  const [routeStats, setRouteStats] = useState<{dist: number, time: number} | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [pickupSelected, setPickupSelected] = useState(false);
  const [dropoffSelected, setDropoffSelected] = useState(false);
  const [coords, setCoords] = useState<{
    pickup: { lat: number, lng: number } | null,
    dropoff: { lat: number, lng: number } | null
  }>({
    pickup: null,
    dropoff: null
  });

  // Effect to calculate route when coords change
  useEffect(() => {
    async function updateRoute() {
      if (coords.pickup && coords.dropoff) {
        setIsCalculating(true);
        try {
          const result = await mapService.calculateRoute(
            { ...coords.pickup, address: '', lat: coords.pickup.lat, lng: coords.pickup.lng },
            { ...coords.dropoff, address: '', lat: coords.dropoff.lat, lng: coords.dropoff.lng }
          );
          
          setRouteStats({ dist: result.distanceMiles, time: result.durationMinutes });
          
          // Update parent state with real distance
          onChange({ distance: result.distanceMiles });
        } catch (e) {
          console.error("Failed to calc route", e);
        } finally {
          setIsCalculating(false);
        }
      }
    }

    if (coords.pickup && coords.dropoff) {
      updateRoute();
    }
  }, [coords.pickup?.lat, coords.pickup?.lng, coords.dropoff?.lat, coords.dropoff?.lng]);

  const handlePickupSelect = (parsedAddress: any) => {
    const { fullAddress, postcode, latitude, longitude, houseNumber, street, city } = parsedAddress;
    
    console.log('📍 Pickup Address Selected:', {
      fullAddress,
      postcode,
      latitude,
      longitude,
      houseNumber,
      street,
      city
    });
    
    // Set coordinates if available
    if (latitude && longitude) {
      setCoords(prev => ({ ...prev, pickup: { lat: latitude, lng: longitude } }));
      console.log('✅ Pickup Coordinates Set:', { lat: latitude, lng: longitude });
    } else {
      console.log('️ No coordinates available for pickup address');
    }
    
    // Update form data with parsed address
    onChange({
      pickup: { 
        ...data.pickup, 
        address: fullAddress,
        postcode: postcode || 'UNKNOWN',
        lat: latitude, // Keep undefined if not available
        lng: longitude, // Keep undefined if not available
        street: street,
        houseNumber: houseNumber,
        city: city
      } as any
    });
    
    setPickupSelected(true);
  };

  const handleDropoffSelect = (parsedAddress: any) => {
    const { fullAddress, postcode, latitude, longitude, houseNumber, street, city } = parsedAddress;
    
    console.log('📍 Delivery Address Selected:', {
      fullAddress,
      postcode,
      latitude,
      longitude,
      houseNumber,
      street,
      city
    });
    
    // Set coordinates if available
    if (latitude && longitude) {
      setCoords(prev => ({ ...prev, dropoff: { lat: latitude, lng: longitude } }));
      console.log('✅ Delivery Coordinates Set:', { lat: latitude, lng: longitude });
    } else {
      console.log('⚠️ No coordinates available for delivery address');
    }
    
    // Update form data with parsed address
    onChange({
      dropoff: { 
        ...data.dropoff, 
        address: fullAddress,
        postcode: postcode || 'UNKNOWN',
        lat: latitude, // Keep undefined if not available
        lng: longitude, // Keep undefined if not available
        street: street,
        houseNumber: houseNumber,
        city: city
      } as any
    });
    
    setDropoffSelected(true);
  };

  // Validation logic - Allow "not sure" for date
  const isValid = 
    pickupSelected && 
    dropoffSelected && 
    data.pickup.address.length > 5 && 
    data.dropoff.address.length > 5 && 
    (data.date || data.dateUnsure); // Date OR "not sure" checkbox

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* HEADER - ULTRA BOLD */}
      <div className="mb-6">
        <h2 className="text-[22px] font-bold text-slate-900 mb-2">Where are we moving?</h2>
        <p className="text-[15px] font-semibold text-slate-700">Enter your pickup and delivery locations to start.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Pickup - BOLD LABELS */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative z-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">A</div>
            <h3 className="text-lg font-bold text-slate-900">Pickup Location</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-[15px] font-semibold text-slate-800 mb-2">Pickup address</label>
              <UKAddressAutocomplete 
                placeholder="Enter postcode or address"
                defaultValue={data.pickup.address}
                onSelect={handlePickupSelect}
                className="w-full"
                label=""
              />
            </div>

            {/* Property Type Selector - Always visible EXCEPT for Clearance */}
            {(!serviceType || serviceType !== 'clearance') && (
              <div>
                <label className="block text-[15px] font-semibold text-slate-800 mb-2">Select Home Type</label>
                <PropertyTypeSelector
                  value={data.pickup.propertyType}
                  onChange={(value) => onChange({ pickup: { ...data.pickup, propertyType: value } })}
                  placeholder="Select Home Type"
                />
              </div>
            )}
          </div>
        </div>

        {/* Dropoff - BOLD LABELS */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">B</div>
            <h3 className="text-lg font-bold text-slate-900">Delivery Location</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-[15px] font-semibold text-slate-800 mb-2">Delivery address</label>
              <UKAddressAutocomplete 
                placeholder="Enter postcode or address"
                defaultValue={data.dropoff.address}
                onSelect={handleDropoffSelect}
                className="w-full"
                label=""
              />
            </div>

            {/* Property Type Selector - Always visible EXCEPT for Clearance */}
            {(!serviceType || serviceType !== 'clearance') && (
              <div>
                <label className="block text-[15px] font-semibold text-slate-800 mb-2">Select Home Type</label>
                <PropertyTypeSelector
                  value={data.dropoff.propertyType}
                  onChange={(value) => onChange({ dropoff: { ...data.dropoff, propertyType: value } })}
                  placeholder="Select Home Type"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Date & Flexibility - SIMPLIFIED SECTION */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-slate-200 space-y-5">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-600" />
          When is the move?
        </h3>
        
        {/* TWO COLUMN LAYOUT: Move Date + Flexibility */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* LEFT COLUMN: Move Date */}
          <div className="space-y-3">
            <label className="block text-[15px] font-bold text-slate-800">Move Date</label>
            <div className="relative">
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                disabled={data.dateUnsure}
                className={`w-full px-4 py-3 pr-12 rounded-xl border-2 focus:ring-2 focus:ring-blue-200 outline-none text-[15px] font-semibold ${
                  data.dateUnsure 
                    ? 'bg-slate-100 border-slate-300 text-slate-400 cursor-not-allowed' 
                    : 'border-slate-300 focus:border-blue-500 text-slate-900'
                }`}
                value={data.date ? new Date(data.date).toISOString().split('T')[0] : ''}
                onChange={(e) => onChange({ date: new Date(e.target.value) })}
              />
              <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
            
            {/* "I'm not sure yet" Checkbox - stays in left column */}
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={data.dateUnsure || false}
                onChange={(e) => onChange({ dateUnsure: e.target.checked })}
                className="w-5 h-5 rounded border-2 border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-200 cursor-pointer"
              />
              <span className="text-[15px] font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">
                I'm not sure yet
              </span>
            </label>
          </div>

          {/* RIGHT COLUMN: Flexibility */}
          <div className="space-y-3">
            <label className="block text-[15px] font-bold text-slate-800">Flexibility</label>
            <select
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-[15px] font-semibold text-slate-900 bg-white h-[52px]"
              value={data.flexibility || 'exact'}
              onChange={(e) => onChange({ flexibility: e.target.value as any })}
            >
              <option value="exact">Exact date</option>
              <option value="plus-minus-1">± 1 day</option>
              <option value="plus-minus-3">± 3 days</option>
              <option value="plus-minus-3">± 3 days</option>
              <option value="within-week">Within 1 week</option>
              <option value="not-sure">Not sure</option>
            </select>
            <p className="text-sm font-medium text-slate-600">
              💡 More flexibility may help us find you better availability
            </p>
          </div>
        </div>

        {/* Conditional Message - Full Width Below Both Columns */}
        {data.dateUnsure && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 animate-in fade-in slide-in-from-top-2">
            <p className="text-[15px] font-bold text-blue-900 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" />
              No problem — you can confirm the exact date later.
            </p>
          </div>
        )}
      </div>

      {/* Map Preview - BOLD TEXT */}
      {coords.pickup && coords.dropoff && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden p-4 animate-in fade-in slide-in-from-bottom-4">
           <div className="flex items-center justify-between mb-3">
             <h4 className="font-bold text-slate-800 text-[15px] flex items-center gap-2">
               <MapPin className="w-4 h-4 text-blue-500" /> Route Preview
             </h4>
             {isCalculating ? (
               <span className="text-sm text-blue-700 font-semibold flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Calculating...</span>
             ) : routeStats ? (
               <span className="text-sm font-bold text-green-800 bg-green-100 px-3 py-1 rounded">
                 {routeStats.dist} miles • ~{routeStats.time} mins
               </span>
             ) : null}
           </div>
           
           <MapPreview 
             pickupCoords={coords.pickup ? { lat: coords.pickup.lat, lng: coords.pickup.lng } : undefined}
             deliveryCoords={coords.dropoff ? { lat: coords.dropoff.lat, lng: coords.dropoff.lng } : undefined}
             pickupAddress={data.pickup.address}
             deliveryAddress={data.dropoff.address}
             distance={routeStats?.dist}
             duration={routeStats?.time}
           />
        </div>
      )}

      {/* VALIDATION MESSAGE - ULTRA BOLD & VISIBLE */}
      <div className="flex justify-end pt-6">
        {!isValid && (
          <div className="mr-auto flex items-center gap-2 text-[15px] font-semibold text-amber-700 bg-amber-50 px-4 py-3 rounded-lg border border-amber-300">
            <Info className="w-5 h-5" />
            <span>
              {!pickupSelected || !dropoffSelected 
                ? 'Please select both pickup and delivery addresses from the dropdown' 
                : !data.date && !data.dateUnsure
                ? 'Please select a date for your move' 
                : 'Complete all required fields'}
            </span>
          </div>
        )}
        
        {/* BUTTON - ULTRA BOLD */}
        <button
          onClick={onNext}
          disabled={!isValid || isCalculating}
          className={`px-8 py-4 rounded-xl font-bold text-base flex items-center gap-2 transition-all ${
            isValid 
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl hover:-translate-y-1' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          Next Step <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}