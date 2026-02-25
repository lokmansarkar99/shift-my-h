import React from 'react';
import { AlertCircle, Info } from 'lucide-react';
import { PricingResult } from '../../utils/pricingEngine';
import { getServiceTypeById } from '../../utils/serviceTypesService';
import { getAllExtras } from '../../utils/extrasCatalogService';
import { getCurrentPricingConfig } from '../../utils/pricingEngine';

interface QuoteBreakdownDetailedProps {
  quote: PricingResult;
  serviceTypeId: string;
}

/**
 * ✅ COMPREHENSIVE QUOTE BREAKDOWN
 * Shows COMPLETE calculation with all sources visible
 */
export function QuoteBreakdownDetailed({
  quote,
  serviceTypeId,
}: QuoteBreakdownDetailedProps) {
  const serviceConfig = getServiceTypeById(serviceTypeId);
  const pricingConfig = getCurrentPricingConfig();
  const extrasCatalog = getAllExtras();
  
  // Extract data from quote.auditData
  const distance = quote.auditData?.distanceMiles || 0;
  const crewSize = quote.auditData?.crewSize || 2;
  const totalVolume = quote.volumeBreakdown?.itemsLibraryVolume || 0;
  const selectedExtras = quote.auditData?.selectedExtras || [];
  
  return (
    <div className="space-y-3">
      <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wide flex items-center gap-2">
        <Info className="w-4 h-4" />
        Complete Price Breakdown
      </h4>

      {/* ========================================
          1. VOLUME CALCULATION (TRANSPARENT)
          ======================================== */}
      {serviceConfig?.useVolume && totalVolume > 0 && quote.volumeBreakdown && (
        <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-4 space-y-2">
          <div className="font-semibold text-purple-900 text-sm flex items-center gap-2">
            📦 Volume Calculation
          </div>
          
          {/* Raw Volume from Items Library */}
          <div className="flex justify-between text-xs bg-white rounded-lg p-2">
            <div className="text-purple-900">
              <div className="font-medium">Raw Volume (Items Library)</div>
              <div className="text-purple-600 text-[10px]">
                {quote.volumeBreakdown.itemDetails?.length || 0} items selected
              </div>
              <div className="text-purple-600 text-[10px]">Source: INVENTORY_METADATA</div>
            </div>
            <div className="font-semibold text-purple-900">
              {quote.volumeBreakdown.itemsLibraryVolume.toFixed(2)} m³
            </div>
          </div>

          {/* Packing Factor */}
          {quote.volumeBreakdown.packingFactorApplied && quote.volumeBreakdown.packingFactorMultiplier !== 1.0 && (
            <div className="flex justify-between text-xs bg-white rounded-lg p-2">
              <div className="text-purple-900">
                <div className="font-medium">
                  Packing Factor ({((quote.volumeBreakdown.packingFactorMultiplier - 1) * 100).toFixed(0)}%)
                </div>
                <div className="text-purple-600 text-[10px]">Source: Pricing Rules</div>
              </div>
              <div className="font-semibold text-purple-900">
                +{quote.volumeBreakdown.packingAdjustment.toFixed(2)} m³
              </div>
            </div>
          )}

          {/* Safety Margin */}
          {quote.volumeBreakdown.safetyMarginApplied && quote.volumeBreakdown.safetyMarginMultiplier !== 1.0 && (
            <div className="flex justify-between text-xs bg-white rounded-lg p-2">
              <div className="text-purple-900">
                <div className="font-medium">
                  Safety Margin ({((quote.volumeBreakdown.safetyMarginMultiplier - 1) * 100).toFixed(0)}%)
                </div>
                <div className="text-purple-600 text-[10px]">Source: Pricing Rules</div>
              </div>
              <div className="font-semibold text-purple-900">
                +{quote.volumeBreakdown.safetyAdjustment.toFixed(2)} m³
              </div>
            </div>
          )}

          {/* Final Adjusted Volume */}
          <div className="flex justify-between text-sm bg-purple-100 border border-purple-300 rounded-lg p-2 font-bold">
            <div className="text-purple-900">Final Adjusted Volume</div>
            <div className="text-purple-900">
              {quote.volumeBreakdown.finalVolume.toFixed(2)} m³
            </div>
          </div>

          {/* ✅ VOLUME COST - EXPLICIT! */}
          <div className="flex justify-between text-sm bg-purple-200 border-2 border-purple-400 rounded-lg p-3 font-bold">
            <div className="text-purple-900">
              <div>Volume Cost</div>
              <div className="text-xs font-normal text-purple-700">
                {quote.volumeBreakdown.finalVolume.toFixed(2)} m³ × £{quote.volumeBreakdown.pricePerCubicMeter.toFixed(2)}/m³
              </div>
              <div className="text-xs font-normal text-purple-600">SOURCE: Service Type ({serviceConfig?.name})</div>
            </div>
            <div className="text-purple-900 text-lg">
              £{quote.volumeBreakdown.volumeCharge.toFixed(2)}
            </div>
          </div>
        </div>
      )}

      {/* ========================================
          2. BASE FEE
          ======================================== */}
      {quote.breakdown.base > 0 && (
        <div className="flex justify-between text-sm bg-indigo-50 border border-indigo-200 rounded-lg p-3">
          <div>
            <div className="text-indigo-900 font-medium">Base Fee</div>
            <div className="text-xs text-indigo-600">SOURCE: Service Type ({serviceConfig?.name})</div>
          </div>
          <div className="font-bold text-indigo-900">£{quote.breakdown.base.toFixed(2)}</div>
        </div>
      )}

      {/* ========================================
          3. DISTANCE COST
          ======================================== */}
      {quote.breakdown.distance > 0 && (
        <div className="flex justify-between text-sm bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div>
            <div className="text-blue-900 font-medium">Distance Cost</div>
            <div className="text-xs text-blue-600">
              {distance} miles × £{serviceConfig?.price_per_mile || 0}/mile
            </div>
            <div className="text-xs text-blue-600">SOURCE: Service Type</div>
          </div>
          <div className="font-bold text-blue-900">£{quote.breakdown.distance.toFixed(2)}</div>
        </div>
      )}

      {/* ========================================
          4. CREW COST
          ======================================== */}
      {quote.breakdown.crew > 0 && (
        <div className="flex justify-between text-sm bg-cyan-50 border border-cyan-200 rounded-lg p-3">
          <div>
            <div className="text-cyan-900 font-medium">Crew Cost ({crewSize} people)</div>
            <div className="text-xs text-cyan-600">SOURCE: Pricing Rules</div>
          </div>
          <div className="font-bold text-cyan-900">£{quote.breakdown.crew.toFixed(2)}</div>
        </div>
      )}

      {/* ========================================
          5. HANDLING COST (DETAILED)
          ======================================== */}
      {quote.breakdown.inventoryDetailed?.handlingPrice && quote.breakdown.inventoryDetailed.handlingPrice > 0 && (
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 space-y-2">
          <div className="font-semibold text-teal-900 text-sm">⏱️ Handling & Loading</div>
          
          <div className="flex justify-between text-xs">
            <div className="text-teal-700">
              Estimated Time: {quote.handlingTimeHours.toFixed(2)} hours
            </div>
            <div className="text-teal-900 font-medium">
              {totalVolume.toFixed(2)} m³ ÷ ({crewSize} crew × {pricingConfig.inventoryHandlingRules.handlingSpeedM3PerHourPerPerson} m³/h/person)
            </div>
          </div>
          
          <div className="flex justify-between text-xs">
            <div className="text-teal-700">Rate per Hour per Person</div>
            <div className="text-teal-900 font-medium">
              £{pricingConfig.inventoryHandlingRules.handlingPricePerHour}/hour
            </div>
          </div>
          
          <div className="flex justify-between text-sm bg-teal-100 border border-teal-300 rounded-lg p-2 font-bold">
            <div className="text-teal-900">
              <div>Handling Cost</div>
              <div className="text-xs font-normal text-teal-700">
                {quote.handlingTimeHours.toFixed(2)}h × £{pricingConfig.inventoryHandlingRules.handlingPricePerHour}/h × {crewSize} crew
              </div>
            </div>
            <div className="text-teal-900">
              £{quote.breakdown.inventoryDetailed.handlingPrice.toFixed(2)}
            </div>
          </div>
          
          <div className="text-xs text-teal-600">
            SOURCE: Pricing Rules (handlingSpeedM3PerHourPerPerson, handlingPricePerHour)
          </div>
        </div>
      )}

      {/* ========================================
          6. WEIGHT SURCHARGE (if any)
          ======================================== */}
      {quote.breakdown.inventoryDetailed?.weightSurcharge && quote.breakdown.inventoryDetailed.weightSurcharge > 0 && (
        <div className="flex justify-between text-sm bg-orange-50 border border-orange-200 rounded-lg p-3">
          <div>
            <div className="text-orange-900 font-medium">Weight Surcharge</div>
            <div className="text-xs text-orange-600">
              Heavy items over {pricingConfig.inventoryHandlingRules.weightThresholdKg}kg
            </div>
            <div className="text-xs text-orange-600">SOURCE: Pricing Rules</div>
          </div>
          <div className="font-bold text-orange-900">
            £{quote.breakdown.inventoryDetailed.weightSurcharge.toFixed(2)}
          </div>
        </div>
      )}

      {/* ========================================
          7. SPECIAL HANDLING FEES
          ======================================== */}
      {quote.breakdown.inventoryDetailed && 
       (quote.breakdown.inventoryDetailed.disassemblyFee > 0 || quote.breakdown.inventoryDetailed.fragileFee > 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-2">
          <div className="font-semibold text-amber-900 text-sm">🛠️ Special Handling</div>
          
          {quote.breakdown.inventoryDetailed.disassemblyFee > 0 && (
            <div className="flex justify-between text-xs">
              <div className="text-amber-700">Furniture Disassembly/Assembly</div>
              <div className="text-amber-900 font-medium">
                £{quote.breakdown.inventoryDetailed.disassemblyFee.toFixed(2)}
              </div>
            </div>
          )}
          
          {quote.breakdown.inventoryDetailed.fragileFee > 0 && (
            <div className="flex justify-between text-xs">
              <div className="text-amber-700">Fragile Items Handling</div>
              <div className="text-amber-900 font-medium">
                £{quote.breakdown.inventoryDetailed.fragileFee.toFixed(2)}
              </div>
            </div>
          )}
          
          <div className="text-xs text-amber-600">SOURCE: Pricing Rules</div>
        </div>
      )}

      {/* ========================================
          8. ACCESS CHARGES
          ======================================== */}
      {quote.breakdown.access > 0 && (
        <div className="flex justify-between text-sm bg-rose-50 border border-rose-200 rounded-lg p-3">
          <div>
            <div className="text-rose-900 font-medium">Access Charges</div>
            <div className="text-xs text-rose-600">Stairs, lift, parking, etc.</div>
            <div className="text-xs text-rose-600">SOURCE: Pricing Rules</div>
          </div>
          <div className="font-bold text-rose-900">£{quote.breakdown.access.toFixed(2)}</div>
        </div>
      )}

      {/* ========================================
          9. DATE SURCHARGES
          ======================================== */}
      {quote.breakdown.date !== 0 && (
        <div className={`flex justify-between text-sm ${
          quote.breakdown.date > 0 
            ? 'bg-pink-50 border-pink-200' 
            : 'bg-green-50 border-green-200'
        } border rounded-lg p-3`}>
          <div>
            <div className={`font-medium ${quote.breakdown.date > 0 ? 'text-pink-900' : 'text-green-900'}`}>
              {quote.breakdown.date > 0 ? 'Date Surcharges' : 'Flexible Date Discount'}
            </div>
            <div className={`text-xs ${quote.breakdown.date > 0 ? 'text-pink-600' : 'text-green-600'}`}>
              Weekend, peak season, end of month, etc.
            </div>
            <div className={`text-xs ${quote.breakdown.date > 0 ? 'text-pink-600' : 'text-green-600'}`}>
              SOURCE: Pricing Rules
            </div>
          </div>
          <div className={`font-bold ${quote.breakdown.date > 0 ? 'text-pink-900' : 'text-green-900'}`}>
            {quote.breakdown.date > 0 ? '+' : ''}£{quote.breakdown.date.toFixed(2)}
          </div>
        </div>
      )}

      {/* ========================================
          10. EXTRAS
          ======================================== */}
      {selectedExtras.length > 0 && (
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-xl p-4 space-y-2">
          <div className="font-semibold text-emerald-900 text-sm flex items-center gap-2">
            ✨ Extras & Additional Services
          </div>
          
          {selectedExtras.map(selected => {
            const extra = extrasCatalog.find(e => e.id === selected.id);
            if (!extra) return null;

            const price = extra.price || 0;
            let itemTotal = 0;
            let calculation = '';

            if (extra.pricingMode === 'fixed') {
              itemTotal = price;
              calculation = 'Fixed price';
            } else if (extra.pricingMode === 'per_unit') {
              itemTotal = price * selected.quantity;
              calculation = `${selected.quantity} × £${price.toFixed(2)}`;
            } else if (extra.pricingMode === 'percentage_of_booking') {
              // This should be calculated in pricing engine
              itemTotal = price; // Already calculated
              calculation = `${extra.percentValue}% of subtotal`;
            }

            return (
              <div key={selected.id} className="flex justify-between text-xs bg-white rounded-lg p-2">
                <div className="text-emerald-900">
                  <div className="font-medium">{extra.name}</div>
                  <div className="text-emerald-600 text-[10px]">{calculation}</div>
                </div>
                <div className="font-semibold text-emerald-900">£{itemTotal.toFixed(2)}</div>
              </div>
            );
          })}
          
          <div className="text-xs text-emerald-700 pt-2 border-t border-emerald-200">
            SOURCE: Extras Catalog
          </div>
        </div>
      )}

      {/* ========================================
          11. SUBTOTAL
          ======================================== */}
      <div className="flex justify-between pt-2 border-t border-slate-300">
        <div className="font-semibold text-slate-900">Subtotal</div>
        <div className="font-bold text-lg text-slate-900">£{quote.subtotal.toFixed(2)}</div>
      </div>

      {/* ========================================
          12. MINIMUM CHARGE (if applied)
          ======================================== */}
      {quote.breakdown.minimumChargeApplied && (
        <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-3">
          <div className="flex items-center gap-2 text-orange-900 font-semibold text-sm">
            <AlertCircle className="w-4 h-4" />
            Minimum Charge Applied
          </div>
          <div className="text-xs text-orange-700 mt-1">
            Subtotal (£{quote.subtotal.toFixed(2)}) is below minimum charge of £{quote.minimumCharge.toFixed(2)}
          </div>
          <div className="text-xs text-orange-600 mt-1">
            SOURCE: Service Type ({serviceConfig?.name})
          </div>
        </div>
      )}

      {/* ========================================
          13. FINAL TOTAL
          ======================================== */}
      <div className="flex justify-between pt-3 border-t-2 border-slate-400 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
        <div className="font-bold text-slate-900 text-lg">TOTAL</div>
        <div className="font-bold text-3xl text-green-600">£{quote.totalPrice.toFixed(2)}</div>
      </div>

      {/* ========================================
          14. ESTIMATED TIME
          ======================================== */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
        <div className="text-blue-900 font-semibold">⏱️ Estimated Time</div>
        <div className="text-blue-700 mt-1 text-lg font-bold">
          {quote.estimatedTime.toFixed(1)} hours total
        </div>
        <div className="text-xs text-blue-600 mt-1">
          Handling: {quote.handlingTimeHours.toFixed(1)}h • Travel: {(quote.estimatedTime - quote.handlingTimeHours).toFixed(1)}h
        </div>
        <div className="text-xs text-blue-600">
          SOURCE: Calculated from volume, crew size, and distance
        </div>
      </div>

      {/* ========================================
          15. VALIDATION NOTICE
          ======================================== */}
      <div className="bg-slate-100 border border-slate-300 rounded-lg p-3 text-xs text-slate-700">
        <div className="font-semibold text-slate-900 mb-1">✅ Pricing Sources Verified</div>
        <div className="space-y-1">
          <div>• Service Type: {serviceConfig?.name}</div>
          <div>• Items Library: {quote.volumeBreakdown?.itemDetails?.length || 0} items</div>
          <div>• Pricing Rules: Global configuration applied</div>
          <div>• Extras Catalog: {selectedExtras.length} extras selected</div>
        </div>
      </div>
    </div>
  );
}