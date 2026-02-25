import React, { useState } from 'react';
import { MapPin, Calendar, Package, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { SelectedItem } from './InventoryList';
import { MiniMapView } from './MiniMapView';
import { QuoteReferenceDisplay } from './QuoteReferenceDisplay';
import { INVENTORY_CATEGORIES } from './InventoryCatalog';
import { InventoryAccordion } from './InventoryAccordion';
import { PaymentMethods } from './PaymentMethods';
import { formatDuration } from '../../utils/timeFormatters';

interface QuoteMoveSummaryProps {
  quoteRef: string;
  pickupAddress?: string;
  deliveryAddress?: string;
  pickupLat?: number;
  pickupLng?: number;
  deliveryLat?: number;
  deliveryLng?: number;
  distance?: number;
  duration?: number;
  moveDate?: string;
  hasDateSelected?: boolean;
  selectedItems: SelectedItem[];
  pickupPropertyType?: string;
  deliveryPropertyType?: string;
  totalPrice?: number; // Final total price
  basePrice?: number; // Base package price (for breakdown)
  extrasPrice?: number; // Extras price (for breakdown)
  arrivalTimeFrom?: number;
  arrivalTimeTo?: number;
}

// Convert minutes to HH:MM format
function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

export function QuoteMoveSummary({
  quoteRef,
  pickupAddress,
  deliveryAddress,
  pickupLat,
  pickupLng,
  deliveryLat,
  deliveryLng,
  distance,
  duration,
  moveDate,
  hasDateSelected,
  selectedItems,
  pickupPropertyType,
  deliveryPropertyType,
  totalPrice, // Final total price
  basePrice, // Base package price (for breakdown)
  extrasPrice, // Extras price (for breakdown)
  arrivalTimeFrom,
  arrivalTimeTo,
}: QuoteMoveSummaryProps) {
  const [isLocationOpen, setIsLocationOpen] = useState(true);
  const [isInventoryOpen, setIsInventoryOpen] = useState(true);

  const totalItems = selectedItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 space-y-6">
      {/* Quote Reference */}
      <QuoteReferenceDisplay quoteRef={quoteRef} />

      {/* Mini Mapbox - IMMEDIATELY UNDER REFERENCE */}
      {pickupLat && pickupLng && deliveryLat && deliveryLng && (
        <div className="pb-4 border-b border-slate-200">
          <MiniMapView
            pickupLat={pickupLat}
            pickupLng={pickupLng}
            deliveryLat={deliveryLat}
            deliveryLng={deliveryLng}
          />
        </div>
      )}

      {/* Distance & Duration */}
      {distance && duration && (
        <div className="pb-4 border-b border-slate-200">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-3 border border-blue-200">
              <div className="text-xs font-semibold text-blue-600 uppercase mb-1">Distance</div>
              <div className="text-xl font-bold text-slate-900">
                {distance.toFixed(1)} <span className="text-xs text-slate-600">mi</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-3 border border-purple-200">
              <div className="text-xs font-semibold text-purple-600 uppercase mb-1">Duration</div>
              <div className="text-xl font-bold text-slate-900">
                {formatDuration(duration)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Location Information Accordion */}
      <div className="border-b border-slate-200 pb-4">
        <button
          type="button"
          onClick={() => setIsLocationOpen(!isLocationOpen)}
          className="w-full flex items-center justify-between text-left group"
        >
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-slate-900">Location Information</span>
          </div>
          {isLocationOpen ? (
            <ChevronUp className="w-4 h-4 text-slate-500 group-hover:text-slate-700" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-slate-700" />
          )}
        </button>

        {isLocationOpen && (
          <div className="mt-4 space-y-3">
            {/* Pickup */}
            {pickupAddress && (
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Pickup</div>
                <div className="text-sm font-medium text-slate-900">{pickupAddress}</div>
                {pickupPropertyType && (
                  <div className="text-xs text-slate-600 mt-0.5">{pickupPropertyType}</div>
                )}
              </div>
            )}

            {/* Delivery */}
            {deliveryAddress && (
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Delivery</div>
                <div className="text-sm font-medium text-slate-900">{deliveryAddress}</div>
                {deliveryPropertyType && (
                  <div className="text-xs text-slate-600 mt-0.5">{deliveryPropertyType}</div>
                )}
              </div>
            )}

            {/* Move Date */}
            {moveDate && (
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Move Date</div>
                <div className="text-sm font-medium text-slate-900">
                  {new Date(moveDate).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </div>
              </div>
            )}

            {hasDateSelected === false && (
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Move Date</div>
                <div className="text-sm font-medium text-slate-900">Flexible</div>
              </div>
            )}

            {/* Arrival Time */}
            {arrivalTimeFrom !== undefined && arrivalTimeTo !== undefined && (
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Arrival Time</div>
                <div className="text-sm font-medium text-slate-900">
                  {minutesToTime(arrivalTimeFrom)} - {minutesToTime(arrivalTimeTo)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Inventory Accordion */}
      <div>
        <button
          type="button"
          onClick={() => setIsInventoryOpen(!isInventoryOpen)}
          className="w-full flex items-center justify-between text-left group"
        >
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-slate-900">Your Inventory</span>
            {totalItems > 0 && (
              <span className="ml-1 text-sm text-slate-600">({totalItems} items)</span>
            )}
          </div>
          {isInventoryOpen ? (
            <ChevronUp className="w-4 h-4 text-slate-500 group-hover:text-slate-700" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-slate-700" />
          )}
        </button>

        {isInventoryOpen && (
          <div className="mt-4">
            {selectedItems.length === 0 ? (
              <p className="text-sm text-slate-500">No items added yet</p>
            ) : (
              <InventoryAccordion selectedItems={selectedItems} />
            )}
          </div>
        )}
      </div>

      {/* Total Price with Breakdown */}
      {totalPrice !== undefined && (
        <div className="border-t-2 border-slate-300 pt-4">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200">
            {/* Show breakdown if we have basePrice and extrasPrice */}
            {basePrice !== undefined && extrasPrice !== undefined ? (
              <>
                <div className="text-xs font-semibold text-green-700 uppercase mb-3">Price Breakdown</div>
                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-700">Base Package Price:</span>
                    <span className="font-semibold text-slate-900">£{basePrice.toLocaleString()}</span>
                  </div>
                  {extrasPrice > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-700">+ Optional Extras:</span>
                      <span className="font-semibold text-slate-900">£{extrasPrice.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t border-green-300 my-2"></div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-green-700 uppercase">Total Price</div>
                  <div className="text-3xl font-bold text-slate-900">
                    £{totalPrice.toLocaleString()}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="text-xs font-semibold text-green-700 uppercase mb-1">Total Price</div>
                <div className="text-3xl font-bold text-slate-900">
                  £{totalPrice.toLocaleString()}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Payment Methods */}
      <PaymentMethods />
    </div>
  );
}