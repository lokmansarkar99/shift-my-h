import React from 'react';
import { CheckCircle, MapPin, Calendar, Users, Package, Truck, ArrowRight, Download, Mail, Edit } from 'lucide-react';
import { PricingResult } from '../../utils/pricingEngine';
import { getServiceTypeConfig } from '../../utils/pricingEngine';
import { getActiveExtras } from '../../utils/extrasCatalogService';

interface QuoteFlowStep6Props {
  quoteId: string;
  pricingResult: PricingResult;
  quoteData: {
    serviceTypeId: string;
    fromAddress: string;
    toAddress: string;
    moveDate?: Date;
    distanceMiles: number;
    estimatedVolume: number;
    crewSize: number;
    customerHelps: boolean;
    selectedExtras: Array<{ id: string; quantity: number }>;
  };
  onEdit: () => void;
  onConfirm: () => void;
}

export function QuoteFlowStep6PricingResults({
  quoteId,
  pricingResult,
  quoteData,
  onEdit,
  onConfirm,
}: QuoteFlowStep6Props) {
  const serviceConfig = getServiceTypeConfig(quoteData.serviceTypeId);
  const extras = getActiveExtras();

  const formatCurrency = (amount: number) => `£${amount.toFixed(2)}`;
  const formatDate = (date?: Date) => {
    if (!date) return 'Flexible';
    return date.toLocaleDateString('en-GB', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Success Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-full mb-4 shadow-lg">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Your Quote is Ready!</h2>
        <p className="text-slate-600 text-lg">
          Quote ID: <span className="font-mono font-bold text-indigo-600">{quoteId}</span>
        </p>
      </div>

      {/* Price Summary Card */}
      <div className="bg-gradient-to-br from-indigo-600 to-blue-600 text-white rounded-2xl shadow-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-indigo-100 text-sm font-medium uppercase tracking-wider mb-1">
              Total Estimate
            </p>
            <h3 className="text-5xl font-bold">
              {formatCurrency(pricingResult.totalPrice)}
            </h3>
            {pricingResult.minimumCharge && pricingResult.totalPrice === pricingResult.minimumCharge && (
              <p className="text-indigo-100 text-sm mt-2">
                ⭐ Minimum charge applied (£{pricingResult.minimumCharge})
              </p>
            )}
          </div>
          <div className="text-right">
            <div className="text-indigo-100 text-sm mb-1">Service Type</div>
            <div className="font-bold text-xl">{serviceConfig.name}</div>
            <div className="text-indigo-100 text-sm mt-2">
              Est. Time: {pricingResult.estimatedTime?.toFixed(1) || 'N/A'} hours
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 bg-white text-indigo-600 font-bold rounded-xl shadow-lg hover:bg-indigo-50 transition-all"
          >
            Confirm & Book →
          </button>
          <button
            onClick={onEdit}
            className="px-6 py-3 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all"
          >
            <Edit className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Technical Summary */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200">
          <h3 className="font-bold text-slate-900">📋 Quote Summary</h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* From */}
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase">Pickup</div>
              <div className="text-slate-900 font-medium">{quoteData.fromAddress}</div>
            </div>
          </div>

          {/* To */}
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase">Delivery</div>
              <div className="text-slate-900 font-medium">{quoteData.toAddress}</div>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase">Move Date</div>
              <div className="text-slate-900 font-medium">{formatDate(quoteData.moveDate)}</div>
            </div>
          </div>

          {/* Distance */}
          <div className="flex items-start gap-3">
            <ArrowRight className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase">Distance</div>
              <div className="text-slate-900 font-medium">{quoteData.distanceMiles.toFixed(1)} miles</div>
            </div>
          </div>

          {/* Volume */}
          <div className="flex items-start gap-3">
            <Package className="w-5 h-5 text-orange-600 flex-shrink-0 mt-1" />
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase">Estimated Volume</div>
              <div className="text-slate-900 font-medium">{quoteData.estimatedVolume.toFixed(2)} m³</div>
            </div>
          </div>

          {/* Crew */}
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-1" />
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase">Crew Size</div>
              <div className="text-slate-900 font-medium">
                {quoteData.crewSize} {quoteData.crewSize === 1 ? 'person' : 'people'}
                {quoteData.customerHelps && (
                  <span className="ml-2 text-xs text-green-600 font-semibold">+ You Help</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200">
          <h3 className="font-bold text-slate-900">💰 Transparent Price Breakdown</h3>
        </div>
        <div className="p-6 space-y-3">
          {/* Base Price */}
          {pricingResult.breakdown.base > 0 && (
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <div>
                <div className="font-medium text-slate-900">Base Service Fee</div>
                <div className="text-xs text-slate-500">
                  SOURCE: <span className="font-semibold text-indigo-600">Service Type ({serviceConfig.name})</span>
                </div>
              </div>
              <div className="font-bold text-slate-900">{formatCurrency(pricingResult.breakdown.base)}</div>
            </div>
          )}

          {/* Crew */}
          {pricingResult.breakdown.crew > 0 && (
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <div>
                <div className="font-medium text-slate-900">
                  Crew Cost ({quoteData.crewSize} {quoteData.crewSize === 1 ? 'person' : 'people'})
                </div>
                <div className="text-xs text-slate-500">
                  SOURCE: <span className="font-semibold text-indigo-600">Service Type (crew increment)</span>
                  {quoteData.customerHelps && (
                    <span className="ml-2 text-green-600 font-semibold">✓ Customer help enabled</span>
                  )}
                </div>
              </div>
              <div className="font-bold text-slate-900">{formatCurrency(pricingResult.breakdown.crew)}</div>
            </div>
          )}

          {/* Distance */}
          {pricingResult.breakdown.distance > 0 && (
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <div>
                <div className="font-medium text-slate-900">Distance Cost</div>
                <div className="text-xs text-slate-500">
                  {quoteData.distanceMiles.toFixed(1)} mi × £{pricingResult.auditData?.distanceRatePerMile?.toFixed(2) || '0.00'}/mi
                  <br />
                  SOURCE: <span className="font-semibold text-indigo-600">Service Type ({serviceConfig.name})</span>
                </div>
              </div>
              <div className="font-bold text-slate-900">{formatCurrency(pricingResult.breakdown.distance)}</div>
            </div>
          )}

          {/* Inventory/Volume */}
          {pricingResult.breakdown.inventory > 0 && (
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <div>
                <div className="font-medium text-slate-900">Volume & Handling</div>
                <div className="text-xs text-slate-500">
                  {pricingResult.auditData?.finalM3Used?.toFixed(2) || '0.00'} m³ × £{serviceConfig.price_per_m3}/m³
                  {pricingResult.handlingTimeHours && (
                    <>
                      <br />+ Handling time: {pricingResult.handlingTimeHours.toFixed(1)}h
                    </>
                  )}
                  <br />
                  SOURCE: <span className="font-semibold text-indigo-600">Service Type + Pricing Rules</span>
                </div>
              </div>
              <div className="font-bold text-slate-900">{formatCurrency(pricingResult.breakdown.inventory)}</div>
            </div>
          )}

          {/* Access Charges */}
          {pricingResult.breakdown.access > 0 && (
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <div>
                <div className="font-medium text-slate-900">Access Charges</div>
                <div className="text-xs text-slate-500">
                  Stairs, parking, long carry
                  <br />
                  SOURCE: <span className="font-semibold text-purple-600">Pricing Rules</span>
                </div>
              </div>
              <div className="font-bold text-slate-900">{formatCurrency(pricingResult.breakdown.access)}</div>
            </div>
          )}

          {/* Date Surcharges */}
          {pricingResult.breakdown.date > 0 && (
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <div>
                <div className="font-medium text-slate-900">Date Surcharges</div>
                <div className="text-xs text-slate-500">
                  Weekend/peak season/end of month
                  <br />
                  SOURCE: <span className="font-semibold text-purple-600">Pricing Rules</span>
                </div>
              </div>
              <div className="font-bold text-slate-900">{formatCurrency(pricingResult.breakdown.date)}</div>
            </div>
          )}

          {/* Extras */}
          {quoteData.selectedExtras.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mt-3">
              <div className="font-medium text-green-900 mb-3 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Additional Services & Materials
              </div>
              <div className="space-y-2">
                {quoteData.selectedExtras.map(selectedExtra => {
                  const extra = extras.find(e => e.id === selectedExtra.id);
                  if (!extra) return null;

                  const itemTotal = extra.pricingMode === 'per_unit'
                    ? extra.basePrice * selectedExtra.quantity
                    : extra.basePrice;

                  return (
                    <div key={selectedExtra.id} className="flex items-center justify-between text-sm">
                      <div className="text-green-900">
                        {extra.name}
                        {extra.pricingMode === 'per_unit' && selectedExtra.quantity > 1 && (
                          <span className="text-green-700 ml-2">× {selectedExtra.quantity}</span>
                        )}
                      </div>
                      <div className="font-semibold text-green-900">
                        {formatCurrency(itemTotal)}
                      </div>
                    </div>
                  );
                })}
                <div className="pt-2 border-t border-green-200 text-xs text-green-700">
                  SOURCE: <span className="font-semibold text-green-800">Extras Catalog</span>
                </div>
              </div>
            </div>
          )}

          {/* Total */}
          <div className="flex items-center justify-between py-4 border-t-2 border-slate-300 mt-4">
            <div className="font-bold text-xl text-slate-900">Total Estimate</div>
            <div className="font-bold text-3xl text-indigo-600">
              {formatCurrency(pricingResult.totalPrice)}
            </div>
          </div>
        </div>
      </div>

      {/* Important Notes */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <h4 className="font-bold text-yellow-900 mb-3">📌 Important Information</h4>
        <ul className="space-y-2 text-sm text-yellow-800">
          <li>✓ This is an estimate based on the information provided</li>
          <li>✓ Final price may vary if actual volume or access differs significantly</li>
          <li>✓ Quote valid for 30 days from {new Date().toLocaleDateString('en-GB')}</li>
          <li>✓ All prices include VAT</li>
          {quoteData.customerHelps && (
            <li className="font-semibold text-green-700">
              ✓ You've agreed to help - please ensure you're available and able to assist on the day
            </li>
          )}
        </ul>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onEdit}
          className="flex-1 px-6 py-4 border-2 border-slate-300 text-slate-700 font-bold text-lg rounded-xl hover:bg-slate-50 transition-all"
        >
          ← Edit Quote
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-lg rounded-xl shadow-xl hover:from-green-700 hover:to-emerald-700 transition-all"
        >
          Confirm & Book Now →
        </button>
      </div>

      {/* Footer Actions */}
      <div className="flex justify-center gap-6 text-sm">
        <button className="flex items-center gap-2 text-indigo-600 hover:underline font-semibold">
          <Download className="w-4 h-4" />
          Download PDF
        </button>
        <button className="flex items-center gap-2 text-indigo-600 hover:underline font-semibold">
          <Mail className="w-4 h-4" />
          Email Quote
        </button>
      </div>
    </div>
  );
}
