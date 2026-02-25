import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, MapPin, Info, FileText, Package } from 'lucide-react';
import { QuoteRequest, INVENTORY_METADATA } from '../../../../utils/pricingEngine';
import { MapboxMap } from '../../ui/MapboxMap';

interface StepProps {
  data: QuoteRequest;
  onChange: (updates: Partial<QuoteRequest>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step3Access({ data, onChange, onNext, onBack }: StepProps) {

  // Calculate total volume from inventory (100% Items Library)
  const totalVolume = (data.inventory || []).reduce((sum, item) => {
    const metadata = INVENTORY_METADATA[item.id];
    if (metadata) {
      return sum + (metadata.volume * item.quantity);
    }
    return sum;
  }, 0);

  const totalItems = (data.inventory || []).reduce((sum, item) => sum + item.quantity, 0);

  const updateLocation = (
    type: 'pickup' | 'dropoff',
    field: string,
    value: any
  ) => {
    onChange({
      [type]: {
        ...data[type],
        [field]: value
      }
    });
  };

  const LocationAccessForm = ({ 
    type,
    locationData
  }: { 
    type: 'pickup' | 'dropoff';
    locationData: QuoteRequest['pickup'] | QuoteRequest['dropoff'];
  }) => {
    const title = type === 'pickup' ? 'PICKUP ACCESS' : 'DELIVERY ACCESS';
    const isPickup = type === 'pickup';

    return (
      <div className="space-y-6">
        <h3 className="font-bold text-slate-900 uppercase tracking-wide text-sm border-b border-slate-200 pb-3">
          {title}
        </h3>

        {/* Floor Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Floor <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            {['Ground floor', '1st floor', '2nd floor', '3rd floor', '4th floor', '5th floor+'].map((label, idx) => (
              <label key={idx} className={`flex items-center gap-3 p-3 bg-white border-2 rounded-lg cursor-pointer transition-all ${
                locationData.floor === idx ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 hover:border-blue-400'
              }`}>
                <input
                  type="radio"
                  name={`${type}-floor`}
                  value={idx}
                  checked={locationData.floor === idx}
                  onChange={() => updateLocation(type, 'floor', idx)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className={`text-sm ${locationData.floor === idx ? 'text-blue-900 font-medium' : 'text-slate-700'}`}>
                  {label}
                </span>
              </label>
            ))}
          </div>

          {/* Floor Number Input for 5th+ */}
          {locationData.floor === 5 && (
            <div className="mt-3 ml-7">
              <label className="block text-xs text-slate-600 mb-1">Enter floor number:</label>
              <input
                type="number"
                min={5}
                value={locationData.floorNumber || 5}
                onChange={(e) => updateLocation(type, 'floorNumber', parseInt(e.target.value) || 5)}
                className="w-20 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>

        {/* Lift Available (only if floor >= 1) */}
        {locationData.floor >= 1 && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-300">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Lift available? <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              <label className={`flex items-center gap-3 p-3 bg-white border-2 rounded-lg cursor-pointer transition-all ${
                locationData.hasLift === true ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 hover:border-blue-400'
              }`}>
                <input
                  type="radio"
                  name={`${type}-lift`}
                  value="yes"
                  checked={locationData.hasLift === true}
                  onChange={() => updateLocation(type, 'hasLift', true)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">Yes</span>
              </label>
              <label className={`flex items-center gap-3 p-3 bg-white border-2 rounded-lg cursor-pointer transition-all ${
                locationData.hasLift === false ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 hover:border-blue-400'
              }`}>
                <input
                  type="radio"
                  name={`${type}-lift`}
                  value="no"
                  checked={locationData.hasLift === false}
                  onChange={() => updateLocation(type, 'hasLift', false)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">No</span>
              </label>
            </div>
          </div>
        )}

        {/* Stairs Inside Building */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Stairs inside building? <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            <label className={`flex items-center gap-3 p-3 bg-white border-2 rounded-lg cursor-pointer transition-all ${
              locationData.hasStairs === true ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 hover:border-blue-400'
            }`}>
              <input
                type="radio"
                name={`${type}-stairs`}
                value="yes"
                checked={locationData.hasStairs === true}
                onChange={() => updateLocation(type, 'hasStairs', true)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">Yes</span>
            </label>
            <label className={`flex items-center gap-3 p-3 bg-white border-2 rounded-lg cursor-pointer transition-all ${
              locationData.hasStairs === false ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 hover:border-blue-400'
            }`}>
              <input
                type="radio"
                name={`${type}-stairs`}
                value="no"
                checked={locationData.hasStairs === false}
                onChange={() => updateLocation(type, 'hasStairs', false)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">No</span>
            </label>
          </div>

          {/* Number of Stair Flights */}
          {locationData.hasStairs && (
            <div className="mt-3 ml-7 animate-in fade-in slide-in-from-top-2">
              <label className="block text-xs text-slate-600 mb-1">Number of stair flights</label>
              <select
                value={locationData.stairFlights}
                onChange={(e) => updateLocation(type, 'stairFlights', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num}{num === 5 ? '+' : ''}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Long Carry Distance */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Long carry distance <span className="text-slate-400">(optional)</span>
          </label>
          <div className="space-y-2">
            {[
              { value: 'under10m', label: 'Under 10m (standard)' },
              { value: '10-25m', label: '10–25m' },
              { value: '25-50m', label: '25–50m' },
              { value: '50m+', label: '50m+' }
            ].map((option) => (
              <label key={option.value} className={`flex items-center gap-3 p-3 bg-white border-2 rounded-lg cursor-pointer transition-all ${
                locationData.carryDistance === option.value ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 hover:border-blue-400'
              }`}>
                <input
                  type="radio"
                  name={`${type}-carry`}
                  value={option.value}
                  checked={locationData.carryDistance === option.value}
                  onChange={() => updateLocation(type, 'carryDistance', option.value)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Parking Restrictions */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Parking restrictions <span className="text-slate-400">(optional)</span>
          </label>
          <div className="space-y-2">
            {[
              { id: 'limitedParking', label: 'Limited parking' },
              { id: 'paidParking', label: 'Paid parking / permit required' },
              { id: 'loadingBayOnly', label: 'Loading bay only' }
            ].map((option) => (
              <label key={option.id} className="flex items-center gap-3 p-3 bg-white border-2 border-slate-200 rounded-lg hover:border-blue-400 cursor-pointer transition-all">
                <input
                  type="checkbox"
                  checked={(locationData.parkingRestrictions as any)[option.id]}
                  onChange={(e) => updateLocation(type, 'parkingRestrictions', {
                    ...locationData.parkingRestrictions,
                    [option.id]: e.target.checked
                  })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Access Details</h2>
        <p className="text-slate-600">Step 3 of 5</p>
      </div>

      {/* 2 COLUMN LAYOUT */}
      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* LEFT COLUMN - FORM */}
        <div className="space-y-8 bg-slate-50/50 p-1 rounded-xl">
          <LocationAccessForm type="pickup" locationData={data.pickup} />
          
          <div className="border-t border-slate-300 my-8"></div>
          
          <LocationAccessForm type="dropoff" locationData={data.dropoff} />
        </div>

        {/* RIGHT COLUMN - MAP & SUMMARY */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden sticky top-24 shadow-sm">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="font-bold text-slate-900">Route Overview</h3>
            </div>

            {/* Map Area */}
            <div className="h-[360px] w-full bg-slate-100 relative">
              {data.pickup.postcode && data.dropoff.postcode ? (
                <MapboxMap
                  pickup={{
                    lat: data.pickup.lat || 51.5074,
                    lng: data.pickup.lng || -0.1278,
                    address: data.pickup.address || data.pickup.postcode
                  }}
                  delivery={{
                    lat: data.dropoff.lat || 55.9533,
                    lng: data.dropoff.lng || -3.1883,
                    address: data.dropoff.address || data.dropoff.postcode
                  }}
                  showRoute={true}
                  className="w-full h-full"
                  height="360px"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                  <MapPin className="w-12 h-12 mb-3 text-slate-300" />
                  <p className="text-sm font-medium">Map details will appear here</p>
                  <p className="text-xs">Enter addresses in Step 1 to see the route</p>
                </div>
              )}
            </div>

            {/* Route Details */}
            <div className="p-6 space-y-6 bg-white">
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Pickup</p>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                    <p className="text-sm text-slate-900 leading-relaxed font-medium">
                      {data.pickup.address || data.pickup.postcode || 'Not set'}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Delivery</p>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                    <p className="text-sm text-slate-900 leading-relaxed font-medium">
                      {data.dropoff.address || data.dropoff.postcode || 'Not set'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Total Distance</p>
                    <p className="text-lg font-bold text-slate-900">
                       {data.distance ? `${data.distance.toFixed(1)} miles` : '--'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Est. Travel Time</p>
                    <p className="text-lg font-bold text-slate-900">
                       {data.duration ? 
                         `${Math.floor(data.duration / 60)}h ${Math.round(data.duration % 60)}m` : 
                         '--'}
                    </p>
                  </div>
                </div>
                
                {/* Inventory Volume Display */}
                {totalItems > 0 && (
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Package className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-purple-600 font-semibold mb-0.5">Inventory Volume</p>
                        <p className="text-xl font-bold text-purple-900">
                          {totalVolume.toFixed(2)} m³
                        </p>
                        <p className="text-xs text-purple-700 mt-0.5">
                          {totalItems} {totalItems === 1 ? 'item' : 'items'} from Step 2
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Info Message - NO PRICE */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <p className="text-xs text-blue-800 leading-relaxed">
                  Price will be calculated on the final step after all items and access details are completed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GLOBAL: Notes for Driver */}
      <div className="mt-8 bg-white rounded-2xl border-2 border-blue-200 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Notes for driver</h3>
            <p className="text-xs text-slate-500">Flat number, entry code, parking info, etc.</p>
          </div>
        </div>
        
        <textarea
          value={data.driverNotes || ''}
          onChange={(e) => onChange({ driverNotes: e.target.value })}
          rows={4}
          placeholder="e.g., Flat 2/1, entry code 1234, use side entrance, loading bay available 8am-10am, stairs to property, avoid main entrance..."
          className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        <div className="mt-3 flex items-start gap-2 text-xs text-slate-500">
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-500" />
          <p>
            This information will help our drivers plan the best approach and ensure smooth pickup and delivery.
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-8 border-t border-slate-200 mt-8">
        <button
          onClick={onBack}
          className="px-8 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 flex items-center gap-2 transition-colors border border-transparent hover:border-slate-200"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <button
          onClick={onNext}
          className="px-10 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
        >
          Next Step
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}