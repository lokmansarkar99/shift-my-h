import React, { useState } from 'react';
import { Package, Info, CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface VolumeBreakdownPanelProps {
  volumeBreakdown?: {
    itemsLibraryVolume: number;
    packingFactorApplied: boolean;
    packingFactorMultiplier: number;
    packingAdjustment: number;
    safetyMarginApplied: boolean;
    safetyMarginMultiplier: number;
    safetyAdjustment: number;
    finalVolume: number;
    pricePerCubicMeter: number;
    volumeCharge: number;
    itemDetails?: Array<{
      id: string;
      name?: string;
      quantity: number;
      volumePerUnit: number;
      totalVolume: number;
    }>;
  };
  showItemDetails?: boolean;
}

export function VolumeBreakdownPanel({ volumeBreakdown, showItemDetails = false }: VolumeBreakdownPanelProps) {
  const [showDetails, setShowDetails] = useState(false);

  if (!volumeBreakdown) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-900">Volume calculation not available</p>
            <p className="text-amber-700 mt-1">No inventory data provided for volume breakdown.</p>
          </div>
        </div>
      </div>
    );
  }

  const {
    itemsLibraryVolume = 0,
    packingFactorApplied = false,
    packingFactorMultiplier = 1.0,
    packingAdjustment = 0,
    safetyMarginApplied = false,
    safetyMarginMultiplier = 1.0,
    safetyAdjustment = 0,
    finalVolume = 0,
    pricePerCubicMeter = 0,
    volumeCharge = 0,
    itemDetails = [],
  } = volumeBreakdown;

  return (
    <div className="space-y-4">
      {/* ============================================ */}
      {/* SUMMARY CARD - Always Visible */}
      {/* ============================================ */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Volume Calculation</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-xs text-slate-500 mb-1">Base Volume</p>
            <p className="text-lg font-bold text-slate-900">{itemsLibraryVolume.toFixed(2)} m³</p>
            <p className="text-xs text-slate-500 mt-1">Items Library</p>
          </div>
          
          {packingFactorApplied && (
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Packing Factor</p>
              <p className="text-lg font-bold text-slate-900">+{packingAdjustment.toFixed(2)} m³</p>
              <p className="text-xs text-slate-500 mt-1">{((packingFactorMultiplier - 1.0) * 100).toFixed(0)}% increase</p>
            </div>
          )}
          
          {safetyMarginApplied && (
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Safety Margin</p>
              <p className="text-lg font-bold text-slate-900">+{safetyAdjustment.toFixed(2)} m³</p>
              <p className="text-xs text-slate-500 mt-1">{((safetyMarginMultiplier - 1.0) * 100).toFixed(0)}% increase</p>
            </div>
          )}
          
          <div className="bg-slate-100 rounded-lg p-3 border border-slate-200">
            <p className="text-xs text-slate-600 font-semibold mb-1">Final Volume</p>
            <p className="text-lg font-bold text-slate-900">{finalVolume.toFixed(2)} m³</p>
            <p className="text-xs text-slate-500 mt-1">£{pricePerCubicMeter.toFixed(2)}/m³</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600">Volume Charge:</span>
            <span className="text-xl font-bold text-slate-900">£{volumeCharge.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* DETAILED BREAKDOWN - Collapsible */}
      {/* ============================================ */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors"
        >
          <span className="font-semibold text-slate-900">Volume Calculation Details</span>
          {showDetails ? (
            <ChevronUp className="w-5 h-5 text-slate-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-500" />
          )}
        </button>

        {showDetails && (
          <div className="border-t border-slate-200 p-6 space-y-6">
            {/* STEP 1: Base Volume */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-slate-900">Base Volume (Items Library)</h4>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-green-700">Calculated from Items Library</span>
                  <span className="text-2xl font-bold text-green-900">{itemsLibraryVolume.toFixed(2)} m³</span>
                </div>
                {showItemDetails && itemDetails && itemDetails.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-green-200">
                    <p className="text-xs font-semibold text-green-800 mb-2">Item breakdown:</p>
                    <div className="max-h-64 overflow-y-auto space-y-1">
                      {itemDetails.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-xs text-green-700">
                          <span className="flex-1">{item.id}</span>
                          <span className="text-right font-mono">
                            {item.volumePerUnit.toFixed(2)} m³ × {item.quantity} = {item.totalVolume.toFixed(2)} m³
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* STEP 2: Packing Factor */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                {packingFactorApplied ? (
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-slate-400" />
                )}
                <h4 className={`font-semibold ${packingFactorApplied ? 'text-slate-900' : 'text-slate-500'}`}>
                  Packing Factor
                </h4>
              </div>
              <div className={`rounded-lg p-4 ${packingFactorApplied ? 'bg-purple-50' : 'bg-slate-50'}`}>
                {packingFactorApplied ? (
                  <>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-purple-700">
                        Multiplier: {packingFactorMultiplier.toFixed(2)} ({((packingFactorMultiplier - 1.0) * 100).toFixed(0)}%)
                      </span>
                      <span className="text-2xl font-bold text-purple-900">+{packingAdjustment.toFixed(2)} m³</span>
                    </div>
                    <p className="text-xs text-purple-600 font-mono">
                      {itemsLibraryVolume.toFixed(2)} m³ × {((packingFactorMultiplier - 1.0) * 100).toFixed(0)}% = +{packingAdjustment.toFixed(2)} m³
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-slate-500">Disabled (configure in Admin Panel)</p>
                )}
              </div>
            </div>

            {/* STEP 3: Safety Margin */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                {safetyMarginApplied ? (
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-slate-400" />
                )}
                <h4 className={`font-semibold ${safetyMarginApplied ? 'text-slate-900' : 'text-slate-500'}`}>
                  Safety Margin
                </h4>
              </div>
              <div className={`rounded-lg p-4 ${safetyMarginApplied ? 'bg-blue-50' : 'bg-slate-50'}`}>
                {safetyMarginApplied ? (
                  <>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-blue-700">
                        Multiplier: {safetyMarginMultiplier.toFixed(2)} ({((safetyMarginMultiplier - 1.0) * 100).toFixed(0)}%)
                      </span>
                      <span className="text-2xl font-bold text-blue-900">+{safetyAdjustment.toFixed(2)} m³</span>
                    </div>
                    <p className="text-xs text-blue-600 font-mono">
                      {itemsLibraryVolume.toFixed(2)} m³ × {((safetyMarginMultiplier - 1.0) * 100).toFixed(0)}% = +{safetyAdjustment.toFixed(2)} m³
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-slate-500">Disabled (configure in Admin Panel)</p>
                )}
              </div>
            </div>

            {/* Final Calculation */}
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-xs text-slate-500 mb-2">Final Calculation:</p>
              <p className="text-sm font-mono text-slate-700">
                {itemsLibraryVolume.toFixed(2)} m³ (base)
                {packingFactorApplied && ` + ${packingAdjustment.toFixed(2)} m³ (packing)`}
                {safetyMarginApplied && ` + ${safetyAdjustment.toFixed(2)} m³ (safety)`}
                {' = '}
                <strong className="text-slate-900">{finalVolume.toFixed(2)} m³</strong>
              </p>
              <p className="text-sm font-mono text-slate-700 mt-2">
                {finalVolume.toFixed(2)} m³ × £{pricePerCubicMeter.toFixed(2)}/m³ = 
                <strong className="text-slate-900"> £{volumeCharge.toFixed(2)}</strong>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}