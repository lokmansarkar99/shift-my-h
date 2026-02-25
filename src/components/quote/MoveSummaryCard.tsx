import React from 'react';
import { MapPin, Home, Calendar, Navigation, Clock } from 'lucide-react';

interface MoveSummaryCardProps {
  quoteRef?: string;
  pickupAddress?: string;
  deliveryAddress?: string;
  pickupPropertyType?: string;
  deliveryPropertyType?: string;
  pickupFloor?: string;
  deliveryFloor?: string;
  liftAvailableAtPickup?: boolean;
  liftAvailableAtDelivery?: boolean;
  pickupLift?: boolean; // Store/Pickup format
  deliveryLift?: boolean; // Store/Pickup format
  pickupPostcode?: string;
  deliveryPostcode?: string;
  distance?: number;
  duration?: number;
  moveDate?: string;
  hasDateSelected?: boolean;
  arrivalTimeFrom?: number;
  arrivalTimeTo?: number;
  selectedItems?: Array<{ id: string; name: string; quantity: number; volume?: number }>;
  totalVolume?: number;
  pickupFloorNumber?: number;
  deliveryFloorNumber?: number;
}

// Convert minutes to HH:MM format
function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

export function MoveSummaryCard({
  quoteRef,
  pickupAddress,
  deliveryAddress,
  pickupPropertyType,
  deliveryPropertyType,
  pickupFloor,
  deliveryFloor,
  liftAvailableAtPickup,
  liftAvailableAtDelivery,
  pickupLift,
  deliveryLift,
  pickupPostcode,
  deliveryPostcode,
  distance,
  duration,
  moveDate,
  hasDateSelected,
  arrivalTimeFrom,
  arrivalTimeTo,
  selectedItems,
  totalVolume: propTotalVolume,
  pickupFloorNumber,
  deliveryFloorNumber,
}: MoveSummaryCardProps) {
  const hasData = pickupAddress || deliveryAddress || distance;

  // Calculate total volume from items if propTotalVolume is not provided
  const calculatedVolume = selectedItems?.reduce((sum, item) => sum + (item.volume || 0.1) * item.quantity, 0) || 0;
  const totalVolume = propTotalVolume || calculatedVolume || 0;

  // Helper to get floor index from floor string
  const getFloorIndex = (floorStr?: string) => {
    if (!floorStr) return 0;
    const options = ['Basement', 'Ground floor', '1st', '2nd', '3rd', '4th', '5th+'];
    const idx = options.indexOf(floorStr);
    return idx === -1 ? 0 : idx;
  };

  const pFloorIdx = pickupFloorNumber !== undefined ? pickupFloorNumber : getFloorIndex(pickupFloor);
  const dFloorIdx = deliveryFloorNumber !== undefined ? deliveryFloorNumber : getFloorIndex(deliveryFloor);
  const pHasLift = (pickupLift !== undefined ? pickupLift : liftAvailableAtPickup) !== false;
  const dHasLift = (deliveryLift !== undefined ? deliveryLift : liftAvailableAtDelivery) !== false;

  // Pricing/Time calculations (Mirroring screenshot logic)
  const dist = distance || 0;
  const drivingHours = dist / 30; // 30 mph as per screenshot
  
  // Loading/Unloading calculation
  // Base: ~15 mins per m3 loading + ~15 mins per m3 unloading = 30 mins per m3
  // Plus floor/lift adjustments
  const baseMins = totalVolume * 16; // Using 16 mins per m3 for total load/unload to match screenshot-like values
  let accessMins = (pFloorIdx * 5) + (dFloorIdx * 5);
  if (!pHasLift && pFloorIdx > 0) accessMins += pFloorIdx * 3;
  if (!dHasLift && dFloorIdx > 0) accessMins += dFloorIdx * 3;
  
  const totalLoadUnloadHours = (baseMins + accessMins) / 60;

  const totalItemCount = selectedItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4">
      <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
        <Navigation className="w-4 h-4 text-blue-600" />
        Move Summary
      </h3>

      {!hasData ? (
        <div className="text-center py-8 text-slate-500">
          <p className="text-sm">Enter your addresses to see the move summary</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Pickup */}
          {pickupAddress && (
            <div className="pb-3 border-b border-slate-100">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-50 rounded-full border border-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">A</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    Pickup Location
                  </div>
                  <div className="font-bold text-slate-900 text-xs leading-tight mb-1">
                    {pickupAddress}
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-500 font-medium">
                    {pickupPropertyType && <span className="flex items-center gap-1"><Home className="w-2.5 h-2.5" />{pickupPropertyType}</span>}
                    {pickupFloor && <span>Floor: {pickupFloor}</span>}
                    <span>Lift: {pHasLift ? 'Yes' : 'No'}</span>
                    {pickupFloorNumber !== undefined && <span>Floor Number: {pickupFloorNumber}</span>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Delivery */}
          {deliveryAddress && (
            <div className="pb-3 border-b border-slate-100">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-red-50 rounded-full border border-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-red-600">B</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    Delivery Location
                  </div>
                  <div className="font-bold text-slate-900 text-xs leading-tight mb-1">
                    {deliveryAddress}
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-500 font-medium">
                    {deliveryPropertyType && <span className="flex items-center gap-1"><Home className="w-2.5 h-2.5" />{deliveryPropertyType}</span>}
                    {deliveryFloor && <span>Floor: {deliveryFloor}</span>}
                    <span>Lift: {dHasLift ? 'Yes' : 'No'}</span>
                    {deliveryFloorNumber !== undefined && <span>Floor Number: {deliveryFloorNumber}</span>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Metrics Grid (Image Requested) */}
          {dist > 0 && (
            <div className="grid grid-cols-3 gap-2 py-2">
              {/* Distance */}
              <div className="bg-emerald-50 rounded-xl p-2.5 border border-emerald-100 flex flex-col justify-between">
                <div className="text-[9px] font-bold text-emerald-600 uppercase tracking-tighter flex items-center gap-1 mb-1">
                  <CheckCircleIcon />
                  Distance
                </div>
                <div>
                  <div className="text-sm font-black text-slate-900">
                    {dist.toFixed(1)}
                  </div>
                  <div className="text-[10px] text-slate-500 font-bold">miles</div>
                </div>
              </div>

              {/* Driving Time */}
              <div className="bg-blue-50 rounded-xl p-2.5 border border-blue-100 flex flex-col justify-between">
                <div className="text-[9px] font-bold text-blue-600 uppercase tracking-tighter flex items-center gap-1 mb-1">
                  <Clock className="w-2.5 h-2.5" />
                  Driving Time
                </div>
                <div>
                  <div className="text-sm font-black text-slate-900">
                    {drivingHours.toFixed(1)} <span className="text-[10px] font-bold text-slate-500">hours</span>
                  </div>
                  <div className="text-[8px] text-blue-700/70 font-medium leading-tight mt-0.5">
                    Based on {dist.toFixed(1)} mi @ 30 mph
                  </div>
                </div>
              </div>

              {/* Loading & Unloading */}
              <div className="bg-purple-50 rounded-xl p-2.5 border border-purple-100 flex flex-col justify-between">
                <div className="text-[9px] font-bold text-purple-600 uppercase tracking-tighter flex items-center gap-1 mb-1">
                  <Clock className="w-2.5 h-2.5" />
                  Loading & Unloading
                </div>
                <div>
                  <div className="text-sm font-black text-slate-900">
                    {totalLoadUnloadHours.toFixed(1)} <span className="text-[10px] font-bold text-slate-500">hours</span>
                  </div>
                  <div className="text-[8px] text-purple-700/70 font-medium leading-tight mt-0.5">
                    Based on {totalVolume > 0 ? totalVolume.toFixed(2) : '0.00'} m³, volume, and access
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Move Date & Arrival */}
          <div className="space-y-1.5 pt-2">
            {moveDate ? (
              <div className="flex items-center gap-2 text-[11px]">
                <Calendar className="w-3 h-3 text-green-600" />
                <span className="font-bold text-slate-700">Move Date:</span>
                <span className="text-slate-900 font-medium">
                  {new Date(moveDate).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
            ) : hasDateSelected === false ? (
              <div className="flex items-center gap-2 text-[11px]">
                <Calendar className="w-3 h-3 text-blue-600" />
                <span className="font-bold text-slate-700">Move Date:</span>
                <span className="text-slate-900 font-medium">Flexible</span>
              </div>
            ) : null}

            {arrivalTimeFrom !== undefined && arrivalTimeTo !== undefined && (
              <div className="flex items-center gap-2 text-[11px]">
                <Clock className="w-3 h-3 text-blue-600" />
                <span className="font-bold text-slate-700">Arrival:</span>
                <span className="text-slate-900 font-medium">
                  {minutesToTime(arrivalTimeFrom)} - {minutesToTime(arrivalTimeTo)}
                </span>
              </div>
            )}
          </div>

          {/* Selected Items List (Compact) */}
          {selectedItems && selectedItems.length > 0 && (
            <div className="pt-3 mt-3 border-t border-slate-100">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Inventory ({totalItemCount})
              </div>
              <div className="space-y-1 max-h-[120px] overflow-y-auto pr-1 custom-scrollbar">
                {selectedItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-[10px] bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-100/50">
                    <span className="text-slate-700 font-medium truncate pr-2">{item.name}</span>
                    <span className="font-bold text-blue-600 flex-shrink-0">×{item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CheckCircleIcon() {
  return (
    <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
