import React, { useState } from 'react';
import { DollarSign, Info, ChevronDown, ChevronUp } from 'lucide-react';

interface PriceBreakdownPanelProps {
  pricingResult: any; // Full pricing result from calculatePrice()
}

export function PriceBreakdownPanel({ pricingResult }: PriceBreakdownPanelProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);

  if (!pricingResult) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-900">Price calculation not available</p>
            <p className="text-amber-700 mt-1">No pricing data provided for breakdown.</p>
          </div>
        </div>
      </div>
    );
  }

  // Map database fields to pricing result structure
  const basePrice = pricingResult.baseFee || 0;
  const crewPrice = pricingResult.crewCost || 0;
  const distancePrice = pricingResult.distanceCost || 0;
  const volumePrice = pricingResult.volumeCost || 0;
  const accessPrice = pricingResult.accessCharges || 0;
  const datePrice = pricingResult.dateAdjustments || 0;
  
  // Inventory detailed breakdown (from database or calculate from volumeCost)
  const inventoryDetailed = {
    volumePrice: pricingResult.volumeCost || 0,
    weightSurcharge: pricingResult.weightSurcharge || 0,
    handlingPrice: pricingResult.handlingCost || 0,
    disassemblyFee: pricingResult.disassemblyFee || 0,
    fragileFee: pricingResult.fragileFee || 0,
    total: (pricingResult.volumeCost || 0) + (pricingResult.weightSurcharge || 0) + (pricingResult.handlingCost || 0) + (pricingResult.disassemblyFee || 0) + (pricingResult.fragileFee || 0),
  };

  const inventoryPrice = inventoryDetailed.total;
  const coreSubtotal = basePrice + crewPrice + distancePrice;
  const subtotal = coreSubtotal + inventoryPrice + accessPrice + datePrice;
  const totalPrice = pricingResult.finalPriceStandard || 0;
  
  // Calculate if minimum charge was applied
  const minimumChargeApplied = pricingResult.minChargeApplied || totalPrice > subtotal;
  const minimumChargeValue = pricingResult.minChargeValue || (minimumChargeApplied ? totalPrice : 0);

  const serviceType = pricingResult.serviceType || 'house-move';
  const distanceMiles = pricingResult.distanceMiles || 0;
  const finalVolume = pricingResult.finalM3Used || 0;
  const itemsCount = pricingResult.items?.length || 0;

  return (
    <div className="space-y-4">
      {/* ============================================ */}
      {/* HEADER - Service Info & Total Price */}
      {/* ============================================ */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-lg font-semibold text-slate-900">{serviceType}</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-600">Standard</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-600">
              <span>Volume: <strong>{finalVolume.toFixed(2)} m³</strong></span>
              <span>|</span>
              <span>Distance: <strong>{distanceMiles.toFixed(1)} mi</strong></span>
              <span>|</span>
              <span>Items: <strong>{itemsCount}</strong></span>
            </div>
          </div>
          
          {/* Badges */}
          <div className="flex flex-col gap-2 items-end">
            {minimumChargeApplied && (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                MIN PRICE APPLIED
              </span>
            )}
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full uppercase">
              {serviceType}
            </span>
          </div>
        </div>

        {/* Total Price */}
        <div className="border-t border-slate-200 pt-4 mt-4">
          <p className="text-sm text-slate-500 mb-1">TOTAL PRICE</p>
          <p className="text-4xl font-bold text-slate-900">£{totalPrice.toFixed(2)}</p>
        </div>
      </div>

      {/* ============================================ */}
      {/* COST SUMMARY - Always Visible */}
      {/* ============================================ */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Cost Summary</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center text-slate-700">
            <span>Base + Crew + Distance</span>
            <span className="font-semibold">£{coreSubtotal.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between items-center text-slate-700">
            <span>Inventory Handling</span>
            <span className="font-semibold">£{inventoryPrice.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between items-center text-slate-700">
            <span>Access Charges</span>
            <span className="font-semibold">£{accessPrice.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between items-center text-slate-700">
            <span>Date Surcharges</span>
            <span className="font-semibold">{datePrice >= 0 ? '+' : ''}£{datePrice.toFixed(2)}</span>
          </div>
          
          <div className="border-t border-slate-200 pt-3 mt-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-900">Total</span>
              <span className="font-bold text-lg text-slate-900">£{totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {minimumChargeApplied && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
            <p className="text-yellow-800">
              <strong>⚠️ Minimum charge applied:</strong> Calculated subtotal (£{subtotal.toFixed(2)}) was below the minimum price of £{minimumChargeValue.toFixed(2)} for this service type.
            </p>
          </div>
        )}
      </div>

      {/* ============================================ */}
      {/* DETAILED BREAKDOWN - Collapsible */}
      {/* ============================================ */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <button
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors"
        >
          <span className="font-semibold text-slate-900">Detailed Breakdown</span>
          {showBreakdown ? (
            <ChevronUp className="w-5 h-5 text-slate-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-500" />
          )}
        </button>

        {showBreakdown && (
          <div className="border-t border-slate-200 p-6 space-y-6">
            {/* Core Service Cost */}
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Core Service Cost</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-1">Base Fee</p>
                  <p className="text-lg font-bold text-slate-900">£{basePrice.toFixed(2)}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-1">Crew Cost</p>
                  <p className="text-lg font-bold text-slate-900">£{crewPrice.toFixed(2)}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-1">Distance</p>
                  <p className="text-lg font-bold text-slate-900">£{distancePrice.toFixed(2)}</p>
                  <p className="text-xs text-slate-500 mt-1">{distanceMiles.toFixed(1)} mi</p>
                </div>
                <div className="bg-slate-100 rounded-lg p-3 border border-slate-200">
                  <p className="text-xs text-slate-600 font-semibold mb-1">Subtotal</p>
                  <p className="text-lg font-bold text-slate-900">£{coreSubtotal.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Inventory Handling */}
            {inventoryPrice > 0 && (
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Inventory Handling</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-500 mb-1">Volume</p>
                    <p className="text-lg font-bold text-slate-900">£{inventoryDetailed.volumePrice.toFixed(2)}</p>
                    <p className="text-xs text-slate-500 mt-1">{finalVolume.toFixed(2)} m³</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-500 mb-1">Weight</p>
                    <p className="text-lg font-bold text-slate-900">£{inventoryDetailed.weightSurcharge.toFixed(2)}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-500 mb-1">Handling</p>
                    <p className="text-lg font-bold text-slate-900">£{inventoryDetailed.handlingPrice.toFixed(2)}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-500 mb-1">Disassembly</p>
                    <p className="text-lg font-bold text-slate-900">£{inventoryDetailed.disassemblyFee.toFixed(2)}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-500 mb-1">Fragile Items</p>
                    <p className="text-lg font-bold text-slate-900">£{inventoryDetailed.fragileFee.toFixed(2)}</p>
                  </div>
                  <div className="bg-slate-100 rounded-lg p-3 border border-slate-200">
                    <p className="text-xs text-slate-600 font-semibold mb-1">Total</p>
                    <p className="text-lg font-bold text-slate-900">£{inventoryPrice.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Access & Date */}
            {(accessPrice > 0 || datePrice !== 0) && (
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Additional Charges</h4>
                <div className="grid grid-cols-2 gap-3">
                  {accessPrice > 0 && (
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-xs text-slate-500 mb-1">Access Charges</p>
                      <p className="text-lg font-bold text-slate-900">£{accessPrice.toFixed(2)}</p>
                      <p className="text-xs text-slate-500 mt-1">Stairs/Parking</p>
                    </div>
                  )}
                  {datePrice !== 0 && (
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-xs text-slate-500 mb-1">Date Adjustments</p>
                      <p className="text-lg font-bold text-slate-900">{datePrice >= 0 ? '+' : ''}£{datePrice.toFixed(2)}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {datePrice > 0 ? 'Weekend/Peak' : 'Flexible discount'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Calculation Formula */}
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-xs text-slate-500 mb-2">Calculation Formula:</p>
              <p className="text-sm font-mono text-slate-700">
                £{basePrice} (base) + £{crewPrice} (crew) + ��{distancePrice} (distance) + 
                £{inventoryPrice} (inventory) + £{accessPrice} (access) + 
                {datePrice >= 0 ? '+' : ''}£{datePrice} (date) = 
                <strong className="text-slate-900"> £{subtotal.toFixed(2)}</strong>
                {minimumChargeApplied && (
                  <span className="text-yellow-700"> → £{totalPrice.toFixed(2)} (min applied)</span>
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}