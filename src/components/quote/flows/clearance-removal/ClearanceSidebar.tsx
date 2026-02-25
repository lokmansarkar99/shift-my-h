/**
 * Clearance & Removal - Constant Sidebar
 * Used across all steps (2, 3, 4, 5) for consistent layout
 */

import React from 'react';
import { ClearanceQuote } from './clearanceTypes';
import { Package, MapPin, Trash2, PoundSterling, Calendar, User } from 'lucide-react';
import { MapView } from '../../MapView';
import { MoveSummaryCard } from '../../MoveSummaryCard';

interface SidebarProps {
  data: ClearanceQuote;
  currentStep: number;
}

// Floor options mapping (same as Step 1)
const FLOOR_OPTIONS = [
  'Basement',
  'Ground floor',
  '1st',
  '2nd',
  '3rd',
  '4th',
  '5th+',
];

export function ClearanceSidebar({ data, currentStep }: SidebarProps) {
  const selectedItems = data.inventory?.items || [];
  const totalItems = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalVolume = data.inventory?.totalVolume || 0;

  // Get floor label from index
  const getFloorLabel = (floorIndex: number | undefined): string => {
    if (floorIndex === undefined) return 'Not set';
    return FLOOR_OPTIONS[floorIndex] || `Floor ${floorIndex}`;
  };

  return (
    <div className="space-y-6 lg:sticky lg:top-4 lg:self-start">
      {/* Quote Reference */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-sm border border-green-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-600 font-medium mb-1">Quote ref:</p>
            <p className="text-xl font-bold text-slate-900">
              {data.quoteReference || 'SMH-' + Date.now().toString().slice(-6)}
            </p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <PoundSterling className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      {/* Map - MOVED HERE AFTER QUOTE REFERENCE */}
      {(data.pickup?.lat || data.delivery?.lat) && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
          <div className="mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-orange-600" />
            <h3 className="text-sm font-bold text-slate-900">
              {data.delivery?.lat ? 'Collection & Disposal' : 'Collection Location'}
            </h3>
          </div>
          <div className="h-48 rounded-lg overflow-hidden">
            <MapView
              pickupLat={data.pickup?.lat}
              pickupLng={data.pickup?.lng}
              deliveryLat={data.delivery?.lat}
              deliveryLng={data.delivery?.lng}
              onRouteUpdate={(dist, dur) => {
                // Route data available if needed
              }}
            />
          </div>
        </div>
      )}

      {/* Move Summary Card - REPLACE MANUAL COLLECTION DETAILS */}
      <MoveSummaryCard
        quoteRef={data.quoteReference}
        pickupAddress={data.pickupAddress?.addressLine1 || data.pickup?.address}
        pickupPostcode={data.pickupAddress?.postcode || data.pickup?.postcode}
        pickupFloor={getFloorLabel(data.pickup?.floor)}
        liftAvailableAtPickup={data.pickup?.hasLift}
        deliveryAddress={data.delivery?.address}
        deliveryPostcode={data.delivery?.postcode}
        distance={data.pricing?.distance}
        totalVolume={totalVolume}
        selectedItems={selectedItems}
        moveDate={data.pickupDate}
      />

      {/* Selected Items (Original list kept for detail) */}
      {selectedItems.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Package className="w-4 h-4 text-orange-600" />
              Selected Items
            </h3>
            <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-bold rounded-full">
              {totalItems} items
            </span>
          </div>
          
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {selectedItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <div className="flex items-center gap-2">
                  {item.quantity > 1 && (
                    <span className="w-6 h-6 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0">
                      {item.quantity}
                    </span>
                  )}
                  <span className="text-sm text-slate-700">{item.name}</span>
                </div>
                <span className="text-xs text-slate-500">{item.volume.toFixed(2)}m³</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t-2 border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900">Total Volume</span>
              <span className="text-lg font-bold text-orange-600">{totalVolume.toFixed(1)}m³</span>
            </div>
          </div>
        </div>
      )}

      {/* Price Summary - Show from Step 3 onwards */}
      {currentStep >= 3 && data.pricing && (
        <div className="bg-white rounded-2xl shadow-lg border-2 border-green-500 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <PoundSterling className="w-5 h-5 text-green-600" />
            Price Summary
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm text-blue-900 font-medium">Work Cost</span>
              <span className="text-base font-bold text-blue-900">£{data.pricing.workCost.toFixed(2)}</span>
            </div>

            <div className={`flex items-center justify-between p-3 rounded-lg ${
              data.pricing.disposalCost >= 0 ? 'bg-orange-50' : 'bg-green-50'
            }`}>
              <span className={`text-sm font-medium ${
                data.pricing.disposalCost >= 0 ? 'text-orange-900' : 'text-green-900'
              }`}>
                Disposal {data.pricing.disposalCost < 0 ? 'Credit' : 'Cost'}
              </span>
              <span className={`text-base font-bold ${
                data.pricing.disposalCost >= 0 ? 'text-orange-900' : 'text-green-900'
              }`}>
                {data.pricing.disposalCost >= 0 ? '' : '-'}£{Math.abs(data.pricing.disposalCost).toFixed(2)}
              </span>
            </div>

            {/* Calculate surcharges from breakdown */}
            {data.pricing.breakdown && 
              ((data.pricing.breakdown as any).floorSurcharge || 0) + ((data.pricing.breakdown as any).parkingSurcharge || 0) > 0 && (
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <span className="text-sm text-purple-900 font-medium">Surcharges</span>
                <span className="text-base font-bold text-purple-900">
                  £{(((data.pricing.breakdown as any).floorSurcharge || 0) + ((data.pricing.breakdown as any).parkingSurcharge || 0)).toFixed(2)}
                </span>
              </div>
            )}

            <div className="pt-3 border-t-2 border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-slate-900">TOTAL</span>
                <span className="text-2xl font-bold text-green-600">
                  £{data.pricing.totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Disposal Info */}
      {currentStep >= 2 && (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-green-600" />
            Disposal Method
          </h3>
          {data.hasSpecificDisposalLocation && data.delivery?.address ? (
            <div>
              <p className="text-sm text-green-700 font-medium mb-2">
                📍 Customer provides disposal location
              </p>
              <p className="text-xs text-slate-600">{data.delivery.address}</p>
            </div>
          ) : data.disposalSelected ? (
            <div>
              <p className="text-sm text-green-700 font-medium mb-2">
                🚛 We'll dispose at licensed facilities
              </p>
              <p className="text-xs text-slate-600">
                Professional disposal included in quote
              </p>
            </div>
          ) : (
            <p className="text-sm text-slate-600">No disposal service selected</p>
          )}
        </div>
      )}

      {/* Contact Info - Show from Step 4 onwards */}
      {currentStep >= 4 && data.contact && (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" />
            Contact Information
          </h3>
          <div className="text-sm text-slate-700 space-y-2">
            {data.contact.name && <p className="font-medium">{data.contact.name}</p>}
            {data.contact.email && <p className="text-xs text-slate-600">{data.contact.email}</p>}
            {data.contact.phone && <p className="text-xs text-slate-600">{data.contact.phone}</p>}
          </div>
        </div>
      )}

      {/* Date/Time - Show from Step 4 onwards */}
      {currentStep >= 4 && data.pickupDate && (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-600" />
            Scheduled Date
          </h3>
          <div className="text-sm text-slate-700">
            <p className="font-medium">{new Date(data.pickupDate).toLocaleDateString('en-GB', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
            {data.pickupTime && (
              <p className="text-xs text-slate-600 mt-1">{data.pickupTime}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}