import React, { useState } from 'react';
import { Loader2, MapPin, Clock, Info, ChevronDown, ChevronUp, Package, Copy, CheckCircle, Navigation } from 'lucide-react';
import { QuoteResponse, INVENTORY_METADATA } from '../../utils/pricingEngine';
import { MapPreview } from './MapPreview';

interface SelectedItem {
  id: string;
  quantity: number;
}

interface Extra {
  id: string;
  name: string;
  quantity?: number;
  enabled?: boolean;
}

interface QuoteSummaryPanelProps {
  quote: QuoteResponse | null;
  isLoading: boolean;
  serviceType: string;
  pickupAddress?: string;
  deliveryAddress?: string;
  pickupCoords?: { lat: number; lng: number };
  deliveryCoords?: { lat: number; lng: number };
  currentStep: number;
  selectedItems?: SelectedItem[];
  extras?: Extra[];
  quoteRef?: string;
}

export function QuoteSummaryPanel({ 
  quote, 
  isLoading, 
  serviceType, 
  pickupAddress, 
  deliveryAddress,
  pickupCoords,
  deliveryCoords,
  currentStep,
  selectedItems = [],
  extras = [],
  quoteRef
}: QuoteSummaryPanelProps) {
  const [showItemList, setShowItemList] = useState(false);
  const [copied, setCopied] = useState(false);

  const moveReference = quoteRef || 'SMH-PENDING';

  // Copy to clipboard with fallback
  const copyReference = async () => {
    try {
      // Try modern clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(moveReference);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        // Fallback for older browsers or restricted contexts
        const textArea = document.createElement('textarea');
        textArea.value = moveReference;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error('Fallback: Could not copy text', err);
        }
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
      // Still show copied state so UI doesn't break
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Calculate totals
  const totalItems = selectedItems.reduce((sum, i) => sum + i.quantity, 0);
  const totalVolume = selectedItems.reduce((sum, item) => {
    const itemData = INVENTORY_METADATA[item.id];
    return sum + (itemData?.volume || 0) * item.quantity;
  }, 0);

  // Format addresses (short format)
  const formatShortAddress = (address: string | undefined) => {
    if (!address) return 'Not set';
    const parts = address.split(',');
    if (parts.length > 2) {
      return `${parts[0].trim()}, ${parts[parts.length - 1].trim()}`;
    }
    return address;
  };

  // Check if we have extras
  const packingMaterials = extras.filter(e => e.id.includes('packing-material'));
  const packingServices = extras.find(e => e.id === 'packing-service')?.enabled || false;
  const specialistServices = extras.filter(e => e.id.includes('specialist') && e.enabled);
  const waitingTime = extras.find(e => e.id === 'waiting-time');
  const hasExtras = packingMaterials.length > 0 || packingServices || specialistServices.length > 0 || (waitingTime && waitingTime.quantity);

  // Step 1: Don't show summary (or show placeholder)
  if (currentStep === 1) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <h3 className="text-xl font-bold mb-1">Your Move Summary</h3>
          <p className="text-blue-100 text-sm">Enter addresses to continue</p>
        </div>
        <div className="p-6 text-center text-slate-400">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Your quote summary will appear here</p>
        </div>
      </div>
    );
  }

  // Step 2-6: Show full summary
  return (
    <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-200 overflow-hidden">
      {/* 1️⃣ HEADER (SUS – FIX) */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white">
        <h3 className="text-lg font-bold mb-3">Your Move Summary</h3>
        
        {/* Reference Number */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-blue-100 mb-1">Reference Number</p>
              <p className="text-base font-bold font-mono tracking-wide">{moveReference}</p>
            </div>
            <button
              onClick={copyReference}
              className="px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-xs font-semibold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span className="text-xs font-semibold">Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* 2️⃣ HARTĂ (IMEDIAT SUB REFERENCE) - COMPACTĂ */}
        {pickupAddress && deliveryAddress && pickupCoords && deliveryCoords && (
          <div className="rounded-xl overflow-hidden border-2 border-slate-200">
            <MapPreview
              pickupCoords={pickupCoords}
              deliveryCoords={deliveryCoords}
              pickupAddress={pickupAddress}
              deliveryAddress={deliveryAddress}
              distance={quote?.distance || 0}
              duration={quote?.estimatedDuration || '0 mins'}
            />
          </div>
        )}

        {/* 3️⃣ JOURNEY DETAILS */}
        {quote && (
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
              <div className="flex items-center gap-2 mb-1">
                <Navigation className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-600 uppercase">Distance</span>
              </div>
              <p className="text-lg font-bold text-slate-900">{quote.distance.toFixed(1)} mi</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-600 uppercase">Duration</span>
              </div>
              <p className="text-lg font-bold text-slate-900">{quote.estimatedDuration}</p>
            </div>
          </div>
        )}

        {/* 4️⃣ ADDRESSES */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-3 h-3 rounded-full bg-blue-500 mt-1.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-0.5">Pickup</p>
              <p className="text-sm font-bold text-slate-900">{formatShortAddress(pickupAddress)}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-3 h-3 rounded-full bg-green-500 mt-1.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-0.5">Delivery</p>
              <p className="text-sm font-bold text-slate-900">{formatShortAddress(deliveryAddress)}</p>
            </div>
          </div>
        </div>

        <div className="border-t-2 border-slate-100" />

        {/* 5️⃣ INVENTORY SUMMARY */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-bold text-slate-900">Inventory</span>
            </div>
          </div>

          {totalItems === 0 ? (
            <div className="bg-slate-50 rounded-lg p-4 text-center border border-slate-200">
              <p className="text-sm text-slate-500 font-medium">No items added yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Items added:</span>
                <span className="font-bold text-slate-900">{totalItems}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Total volume:</span>
                <span className="font-bold text-slate-900">{totalVolume.toFixed(2)} m³</span>
              </div>

              {/* View item list button */}
              <button
                onClick={() => setShowItemList(!showItemList)}
                className="w-full mt-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors flex items-center justify-between"
              >
                <span className="text-xs font-semibold text-slate-700">View item list</span>
                {showItemList ? (
                  <ChevronUp className="w-4 h-4 text-slate-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                )}
              </button>

              {/* Expandable item list */}
              {showItemList && (
                <div className="mt-2 bg-slate-50 rounded-lg border border-slate-200 max-h-48 overflow-y-auto">
                  {selectedItems.map((item) => {
                    const itemData = INVENTORY_METADATA[item.id];
                    if (!itemData) return null;
                    const itemName = item.id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                    const itemTotalVolume = itemData.volume * item.quantity;
                    return (
                      <div 
                        key={item.id} 
                        className="flex justify-between items-center p-2.5 text-xs border-b border-slate-200 last:border-0"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-700 rounded font-bold text-xs">
                            {item.quantity}
                          </span>
                          <span className="text-slate-900 font-medium">{itemName}</span>
                        </div>
                        <span className="text-slate-600 font-semibold">{itemTotalVolume.toFixed(2)} m³</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Edit link */}
              <button
                onClick={() => {
                  // Navigate to Step 2
                  if (typeof window !== 'undefined') {
                    window.location.hash = '#/quote-step/2';
                  }
                }}
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold hover:underline"
              >
                ← Edit inventory
              </button>
            </div>
          )}
        </div>

        {/* 6️⃣ EXTRAS SUMMARY (DOAR DACĂ EXISTĂ) */}
        {hasExtras && (
          <>
            <div className="border-t-2 border-slate-100" />
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-bold text-slate-900">Extras & Services</span>
              </div>

              <div className="space-y-2 text-sm">
                {/* Packing materials */}
                {packingMaterials.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Packing materials:</span>
                    <span className="font-semibold text-slate-900">
                      {packingMaterials.reduce((sum, m) => sum + (m.quantity || 0), 0)} items
                    </span>
                  </div>
                )}

                {/* Packing services */}
                {packingServices && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Packing services:</span>
                    <span className="font-semibold text-green-600">ON</span>
                  </div>
                )}

                {/* Specialist services */}
                {specialistServices.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-slate-600">Specialist services:</span>
                    {specialistServices.map(s => (
                      <div key={s.id} className="pl-4 text-slate-700 font-medium">• {s.name}</div>
                    ))}
                  </div>
                )}

                {/* Waiting time */}
                {waitingTime && waitingTime.quantity && waitingTime.quantity > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Waiting time:</span>
                    <span className="font-semibold text-slate-900">
                      {waitingTime.quantity} × 30 min
                    </span>
                  </div>
                )}

                {/* Edit links */}
                <div className="pt-2 space-y-1">
                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        window.location.hash = '#/quote-step/3';
                      }
                    }}
                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold hover:underline block"
                  >
                    ← Edit package
                  </button>
                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        window.location.hash = '#/quote-step/4';
                      }
                    }}
                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold hover:underline block"
                  >
                    ← Edit extras
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="border-t-2 border-slate-100" />

        {/* 7️⃣ PRICE (JOS) - FĂRĂ DETALII */}
        {isLoading && !quote ? (
          <div className="flex items-center justify-center py-8 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <p className="text-sm">Calculating price...</p>
          </div>
        ) : quote ? (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-200">
            <div className="text-center">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Total Price</p>
              <div className="text-4xl font-extrabold text-blue-900 flex items-center justify-center gap-1">
                <span className="text-xl text-blue-600">£</span>
                {quote.breakdown.total.toFixed(2)}
              </div>
              <div className="mt-3 flex items-center justify-center gap-1 text-xs text-blue-700">
                <Info className="w-3 h-3" />
                <span className="font-medium">Final price confirmed after review</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400">
            <Info className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Complete steps to see price</p>
          </div>
        )}
      </div>
    </div>
  );
}