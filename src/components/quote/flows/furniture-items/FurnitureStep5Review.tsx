/**
 * Furniture & Items - Step 5: Review & Quote
 */

import React, { useState, useEffect } from 'react';
import { FurnitureQuote } from './furnitureTypes';
import { ArrowRight, ArrowLeft, Package, MapPin, Calendar, CheckCircle2, Info, Plus } from 'lucide-react';
import { calculateFurnitureItemsPrice, FurnitureItemsPricingResult } from '../../../../utils/furnitureItemsPricingEngine';
import { getPricingConfig } from '../../../../utils/pricingConfigService';
import { toast } from 'sonner@2.0.3';

interface StepProps {
  data: FurnitureQuote;
  onChange: (updates: Partial<FurnitureQuote>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function FurnitureStep5Review({ data, onChange, onNext, onBack }: StepProps) {
  const [pricingResult, setPricingResult] = useState<FurnitureItemsPricingResult | null>(null);
  const [loading, setLoading] = useState(true);

  // Use items array (new format) or fallback to inventory (old format)
  const items = data.items || data.inventory?.items || [];
  const totalVolume = data.inventory?.totalVolume || 0;
  const itemCount = items.length > 0 ? items.reduce((sum, item) => sum + (item.quantity || 0), 0) : 0;

  useEffect(() => {
    calculatePricing();
  }, [data]);

  async function calculatePricing() {
    try {
      setLoading(true);
      const config = await getPricingConfig();

      // Prepare pricing input
      const result = calculateFurnitureItemsPrice(
        {
          totalVolume,
          itemCount,
          pickupFloors: data.pickup?.floor || 0,
          pickupHasLift: data.pickup?.hasLift || false,
          pickupParking: 'easy', // Default or from data
          deliveryFloors: data.dropoff?.floor || 0,
          deliveryHasLift: data.dropoff?.hasLift || false,
          deliveryParking: 'easy', // Default or from data
          package: 'standard',
          isWeekend: data.date ? isWeekend(data.date) : false,
          isPeakSeason: data.date ? isPeakSeason(data.date) : false,
          isEndOfMonth: data.date ? isEndOfMonth(data.date) : false,
          isFlexibleDate: data.dateUnsure || false,
        },
        config
      );

      // Add extras from Step 4
      if (data.pricing?.extras && data.pricing.extras.length > 0) {
        let extrasTotal = 0;
        data.pricing.extras.forEach(extra => {
          const quantity = extra.quantity || 1;
          const cost = extra.price * quantity;
          extrasTotal += cost;
          
          // Add to breakdown (insert before the total)
          const totalIdx = result.breakdown.findIndex(b => b.type === 'total');
          result.breakdown.splice(totalIdx, 0, {
            label: `${extra.name} ${quantity > 1 ? `(x${quantity})` : ''}`,
            value: cost,
            type: 'charge'
          });
        });
        
        // Update totals
        result.totalPrice += extrasTotal;
        const totalItem = result.breakdown.find(b => b.type === 'total');
        if (totalItem) totalItem.value = result.totalPrice;
      }

      setPricingResult(result);
    } catch (error) {
      console.error('Error calculating pricing:', error);
      toast.error('Failed to calculate pricing');
    } finally {
      setLoading(false);
    }
  }

  // Helper functions
  function isWeekend(date: Date | string): boolean {
    const day = new Date(date).getDay();
    return day === 0 || day === 6;
  }

  function isPeakSeason(date: Date | string): boolean {
    const month = new Date(date).getMonth();
    return month === 11 || month === 0 || (month >= 5 && month <= 7);
  }

  function isEndOfMonth(date: Date | string): boolean {
    const d = new Date(date);
    const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    return d.getDate() >= lastDay - 4;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          Review Your Quote
        </h2>
        <p className="text-slate-600">
          Check all details and see your instant price
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Addresses */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-bold text-slate-900">Locations</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-sm font-semibold text-slate-500 mb-1">Pickup</div>
                <div className="text-slate-900">{data.pickup?.address || 'Not set'}</div>
                {data.pickup?.floor !== undefined && (
                  <div className="text-sm text-slate-600 mt-1">
                    Floor {data.pickup.floor === 0 ? 'Ground' : data.pickup.floor} • {data.pickup.hasLift ? 'Lift available' : 'No lift'}
                  </div>
                )}
              </div>
              <div className="border-t border-slate-200 pt-3">
                <div className="text-sm font-semibold text-slate-500 mb-1">Delivery</div>
                <div className="text-slate-900">{data.dropoff?.address || 'Not set'}</div>
                {data.dropoff?.floor !== undefined && (
                  <div className="text-sm text-slate-600 mt-1">
                    Floor {data.dropoff.floor === 0 ? 'Ground' : data.dropoff.floor} • {data.dropoff.hasLift ? 'Lift available' : 'No lift'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-bold text-slate-900">Items</h3>
            </div>
            <div className="space-y-2">
              {items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <span className="text-slate-700">
                    {item.quantity}× {item.name}
                  </span>
                </div>
              ))}
              <div className="border-t border-slate-200 pt-2 mt-3 flex justify-between font-semibold">
                <span className="text-slate-900">{itemCount} items total</span>
                {totalVolume > 0 && (
                  <span className="text-slate-900">{totalVolume.toFixed(2)} m³</span>
                )}
              </div>
            </div>
          </div>

          {/* Date & Package */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-bold text-slate-900">Service Details</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Move Date</span>
                <span className="font-semibold text-slate-900">
                  {data.date ? new Date(data.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Not selected'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Service Package</span>
                <span className="font-semibold text-slate-900 capitalize">
                  Standard
                </span>
              </div>
              {data.dateUnsure && (
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  Flexible date discount applied
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Price Breakdown */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg border border-purple-200 p-6 sticky top-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Price Breakdown</h3>

            {loading ? (
              <div className="space-y-3">
                <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded animate-pulse w-1/2"></div>
              </div>
            ) : pricingResult ? (
              <div className="space-y-3">
                {pricingResult.breakdown.map((item, idx) => {
                  if (item.type === 'total') {
                    return (
                      <div key={idx} className="border-t-2 border-purple-300 pt-4 mt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-slate-900">{item.label}</span>
                          <span className="text-2xl font-bold text-purple-600">
                            £{item.value.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <span className={`${
                        item.type === 'discount' ? 'text-green-600' : 'text-slate-600'
                      }`}>
                        {item.label}
                      </span>
                      <span className={`font-semibold ${
                        item.type === 'discount' ? 'text-green-600' : 'text-slate-900'
                      }`}>
                        {item.value >= 0 ? '+' : ''}£{item.value.toFixed(2)}
                      </span>
                    </div>
                  );
                })}

                {/* Info box */}
                <div className="bg-white/50 rounded-lg p-3 mt-4">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-slate-600">
                      <span className="font-semibold">Simplified pricing for furniture & items.</span>
                      {' '}No property multipliers - just volume-based pricing with quantity discounts.
                    </div>
                  </div>
                </div>

                {pricingResult.minimumApplied && (
                  <div className="bg-purple-100 rounded-lg p-3 mt-2">
                    <div className="text-xs text-purple-800 font-semibold">
                      Minimum charge applied (£120)
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-slate-500 py-8">
                Failed to calculate price
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 text-slate-700 font-semibold hover:bg-slate-100 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Step 4
        </button>
        <button
          onClick={onNext}
          disabled={loading || !pricingResult}
          className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Confirm Quote
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
