import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Package, 
  MapPin, 
  Calendar, 
  User, 
  Truck,
  Users,
  ChevronDown,
  ChevronUp,
  FileText,
  AlertCircle,
  CheckCircle,
  Send,
  Save,
  Archive,
  Edit2,
  Clock
} from 'lucide-react';

interface PricingResultDetailViewProps {
  result: any;
  onBack: () => void;
  onSave?: (data: any) => void;
  onSend?: (data: any) => void;
  onConvertToJob?: (data: any) => void;
  onArchive?: (data: any) => void;
}

export function PricingResultDetailView({ 
  result, 
  onBack,
  onSave,
  onSend,
  onConvertToJob,
  onArchive
}: PricingResultDetailViewProps) {
  const [showDetailedBreakdown, setShowDetailedBreakdown] = useState(false);
  const [editingCustomerNotice, setEditingCustomerNotice] = useState(false);
  const [customerNotice, setCustomerNotice] = useState(
    result.customerNotice || generateDefaultCustomerNotice()
  );

  // Extract pricing data
  const basePrice = result.baseFee || 0;
  const crewPrice = result.crewCost || 0;
  const distancePrice = result.distanceCost || 0;
  const volumePrice = result.volumeCost || 0;
  const accessPrice = result.accessCharges || 0;
  const datePrice = result.dateAdjustments || 0;
  const extrasPrice = result.extrasCost || 0;
  
  const subtotal = basePrice + crewPrice + distancePrice + volumePrice + accessPrice + datePrice + extrasPrice;
  const totalPrice = result.finalPriceStandard || 0;
  const minimumApplied = result.minChargeApplied || totalPrice > subtotal;
  
  const serviceType = result.serviceType || 'house-move';
  const distanceMiles = result.distanceMiles || 0;
  const finalVolume = result.finalM3Used || 0;
  const itemsCount = result.items?.length || 0;
  const crewSize = result.crewSize || 2;
  const vehicleType = result.vehicleType || 'Luton Van';
  
  // Generate special notices (internal only)
  const specialNotices = generateSpecialNotices(result);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Quote Details</h2>
          <p className="text-slate-600 mt-1">Complete audit and confirmation view</p>
        </div>
        <button
          onClick={onBack}
          className="px-6 py-2 bg-slate-600 text-white rounded-xl hover:bg-slate-700 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to List
        </button>
      </div>

      {/* ============================================ */}
      {/* 1️⃣ IDENTITY & CONTEXT */}
      {/* ============================================ */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Identity & Context
        </h3>
        
        <div className="grid md:grid-cols-5 gap-4">
          <div>
            <p className="text-xs text-slate-500 mb-1">Quote ID</p>
            <p className="font-semibold text-slate-900">{result.id?.substring(0, 8) || 'N/A'}</p>
          </div>
          
          <div>
            <p className="text-xs text-slate-500 mb-1">Service Type</p>
            <p className="font-semibold text-slate-900 capitalize">{serviceType.replace('-', ' ')}</p>
          </div>
          
          <div>
            <p className="text-xs text-slate-500 mb-1">Status</p>
            <span className="inline-flex px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
              {result.status || 'Draft'}
            </span>
          </div>
          
          <div>
            <p className="text-xs text-slate-500 mb-1">Created</p>
            <p className="font-semibold text-slate-900">
              {new Date(result.timestamp).toLocaleDateString('en-GB', { 
                day: '2-digit', 
                month: 'short', 
                year: 'numeric' 
              })}
            </p>
            <p className="text-xs text-slate-500">
              {new Date(result.timestamp).toLocaleTimeString('en-GB', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
          
          <div>
            <p className="text-xs text-slate-500 mb-1">Customer</p>
            <p className="font-semibold text-slate-900">{result.customerName || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* 2️⃣ COLLECTION & DELIVERY ADDRESSES */}
      {/* ============================================ */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Collection & Delivery Addresses
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Collection Address */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <h4 className="font-semibold text-blue-900">Collection Address</h4>
            </div>
            
            <div className="space-y-2">
              <div>
                <p className="font-semibold text-slate-900">{result.fromAddress || 'Not provided'}</p>
                <p className="text-sm text-slate-600">{result.fromPostcode || ''}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-blue-200">
                <div>
                  <p className="text-xs text-slate-500">Property Type</p>
                  <p className="text-sm font-medium text-slate-900 capitalize">
                    {result.fromPropertyType || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Floor Level</p>
                  <p className="text-sm font-medium text-slate-900">
                    {result.fromFloor !== undefined ? `Floor ${result.fromFloor}` : 'Ground'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Lift Available</p>
                  <p className="text-sm font-medium text-slate-900">
                    {result.fromLift ? 'Yes' : 'No'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Parking</p>
                  <p className="text-sm font-medium text-slate-900 capitalize">
                    {result.fromParking || 'N/A'}
                  </p>
                </div>
                {result.fromWalkingDistance && (
                  <div className="col-span-2">
                    <p className="text-xs text-slate-500">Walking Distance</p>
                    <p className="text-sm font-medium text-slate-900">
                      {result.fromWalkingDistance}m
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <h4 className="font-semibold text-green-900">Delivery Address</h4>
            </div>
            
            <div className="space-y-2">
              <div>
                <p className="font-semibold text-slate-900">{result.toAddress || 'Not provided'}</p>
                <p className="text-sm text-slate-600">{result.toPostcode || ''}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-green-200">
                <div>
                  <p className="text-xs text-slate-500">Property Type</p>
                  <p className="text-sm font-medium text-slate-900 capitalize">
                    {result.toPropertyType || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Floor Level</p>
                  <p className="text-sm font-medium text-slate-900">
                    {result.toFloor !== undefined ? `Floor ${result.toFloor}` : 'Ground'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Lift Available</p>
                  <p className="text-sm font-medium text-slate-900">
                    {result.toLift ? 'Yes' : 'No'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Parking</p>
                  <p className="text-sm font-medium text-slate-900 capitalize">
                    {result.toParking || 'N/A'}
                  </p>
                </div>
                {result.toWalkingDistance && (
                  <div className="col-span-2">
                    <p className="text-xs text-slate-500">Walking Distance</p>
                    <p className="text-sm font-medium text-slate-900">
                      {result.toWalkingDistance}m
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* 3️⃣ TECHNICAL SUMMARY (COMPACT ROW) */}
      {/* ============================================ */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Technical Summary</h3>
        
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-500" />
            <span className="text-slate-600">Distance:</span>
            <span className="font-semibold text-slate-900">{distanceMiles.toFixed(1)} mi</span>
          </div>
          
          {finalVolume > 0 && (
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-slate-500" />
              <span className="text-slate-600">Volume:</span>
              <span className="font-semibold text-slate-900">{finalVolume.toFixed(2)} m³</span>
            </div>
          )}
          
          {itemsCount > 0 && (
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-slate-500" />
              <span className="text-slate-600">Items:</span>
              <span className="font-semibold text-slate-900">{itemsCount}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-500" />
            <span className="text-slate-600">Crew:</span>
            <span className="font-semibold text-slate-900">{crewSize} {crewSize === 1 ? 'person' : 'people'}</span>
          </div>
          
          {result.estimatedTime && result.estimatedTime > 0 && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <span className="text-slate-600">Est. Time:</span>
              <span className="font-semibold text-slate-900">{result.estimatedTime.toFixed(1)}h</span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-slate-500" />
            <span className="text-slate-600">Vehicle:</span>
            <span className="font-semibold text-slate-900">{vehicleType}</span>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* 4️⃣ COST SUMMARY & 5️⃣ TOTAL PRICE */}
      {/* ============================================ */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Cost Summary</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center text-slate-700">
            <span>Base Price</span>
            <span className="font-semibold">£{basePrice.toFixed(2)}</span>
          </div>
          
          {distancePrice > 0 && (
            <div className="border-l-4 border-blue-500 bg-blue-50 p-3 rounded">
              <div className="flex justify-between items-center font-semibold text-blue-900 mb-1">
                <span>Distance Cost</span>
                <span>£{distancePrice.toFixed(2)}</span>
              </div>
              <div className="text-xs text-slate-600 mt-1">
                <span className="font-mono">{distanceMiles.toFixed(1)} mi × £{(result.distanceRatePerMile || 0).toFixed(2)}/mi</span>
                <span className="ml-2 text-green-700">[SOURCE: Service Type]</span>
              </div>
            </div>
          )}
          
          {volumePrice > 0 && (
            <div className="flex justify-between items-center text-slate-700">
              <span>Volume / Inventory Cost</span>
              <span className="font-semibold">£{volumePrice.toFixed(2)}</span>
            </div>
          )}
          
          {extrasPrice > 0 && (
            <div className="flex justify-between items-center text-slate-700">
              <span>Extras Cost</span>
              <span className="font-semibold">£{extrasPrice.toFixed(2)}</span>
            </div>
          )}
          
          {accessPrice > 0 && (
            <div className="flex justify-between items-center text-slate-700">
              <span>Access Charges</span>
              <span className="font-semibold">£{accessPrice.toFixed(2)}</span>
            </div>
          )}
          
          {datePrice !== 0 && (
            <div className="flex justify-between items-center text-slate-700">
              <span>Date / Time Surcharges</span>
              <span className="font-semibold">{datePrice >= 0 ? '+' : ''}£{datePrice.toFixed(2)}</span>
            </div>
          )}
          
          <div className="border-t border-slate-200 pt-3 mt-3">
            <div className="flex justify-between items-center text-slate-700">
              <span>Subtotal</span>
              <span className="font-semibold">£{subtotal.toFixed(2)}</span>
            </div>
          </div>
          
          {minimumApplied && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-sm text-yellow-800">
                <AlertCircle className="w-4 h-4" />
                <span className="font-semibold">Minimum Price Applied: Yes</span>
              </div>
            </div>
          )}
          
          {/* TOTAL PRICE - PROMINENT, ONE PLACE ONLY */}
          <div className="bg-slate-900 rounded-xl p-6 mt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">TOTAL PRICE</p>
                <p className="text-4xl font-bold text-white">£{totalPrice.toFixed(2)}</p>
              </div>
              
              <div className="flex flex-col gap-2 items-end">
                <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  AUTO CALCULATED
                </span>
                {minimumApplied && (
                  <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full">
                    MIN PRICE APPLIED
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* 6️⃣ CUSTOMER NOTICE (CLIENT-FACING) */}
      {/* ============================================ */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Customer Notice
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">CLIENT-FACING</span>
          </h3>
          
          {!editingCustomerNotice ? (
            <button
              onClick={() => setEditingCustomerNotice(true)}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm"
            >
              <Edit2 className="w-4 h-4" />
              Edit Notice
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditingCustomerNotice(false);
                  // Save logic here
                }}
                className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditingCustomerNotice(false);
                  setCustomerNotice(result.customerNotice || generateDefaultCustomerNotice());
                }}
                className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 text-sm"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
        
        {editingCustomerNotice ? (
          <textarea
            value={customerNotice}
            onChange={(e) => setCustomerNotice(e.target.value)}
            rows={8}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans">
              {customerNotice}
            </pre>
          </div>
        )}
      </div>

      {/* ============================================ */}
      {/* 7️⃣ SPECIAL NOTICE (INTERNAL ONLY) */}
      {/* ============================================ */}
      {specialNotices.length > 0 && (
        <div className="bg-orange-50 rounded-xl shadow-sm border-2 border-orange-300 p-6">
          <h3 className="font-semibold text-orange-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Special Notice (Internal Only)
            <span className="text-xs bg-orange-200 text-orange-900 px-2 py-1 rounded-full">NOT VISIBLE TO CUSTOMER</span>
          </h3>
          
          <ul className="space-y-2">
            {specialNotices.map((notice, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-orange-900">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{notice}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ============================================ */}
      {/* 8️⃣ DETAILED BREAKDOWN (COLLAPSIBLE) */}
      {/* ============================================ */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <button
          onClick={() => setShowDetailedBreakdown(!showDetailedBreakdown)}
          className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-slate-600" />
            <span className="font-semibold text-slate-900">Detailed Breakdown</span>
            <span className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded-full">ADMIN ONLY</span>
          </div>
          {showDetailedBreakdown ? (
            <ChevronUp className="w-5 h-5 text-slate-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-500" />
          )}
        </button>

        {showDetailedBreakdown && (
          <div className="border-t border-slate-200 p-6 space-y-4">
            {/* Volume Calculation */}
            {finalVolume > 0 && (
              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-3">Volume Calculation</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Base Volume (Items Library):</span>
                    <span className="font-mono">{(result.itemsTotalM3 || 0).toFixed(2)} m³</span>
                  </div>
                  {result.packingAddedM3 > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Packing Factor:</span>
                      <span className="font-mono">+{result.packingAddedM3.toFixed(2)} m³</span>
                    </div>
                  )}
                  {result.safetyAddedM3 > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Safety Margin:</span>
                      <span className="font-mono">+{result.safetyAddedM3.toFixed(2)} m³</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-slate-200 font-semibold">
                    <span>Final Volume:</span>
                    <span className="font-mono">{finalVolume.toFixed(2)} m³</span>
                  </div>
                </div>
              </div>
            )}

            {/* Handling Time Calculation */}
            {result.estimatedTime && result.estimatedTime > 0 && finalVolume > 0 && (
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Handling Time Calculation
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Volume to handle:</span>
                    <span className="font-mono">{finalVolume.toFixed(2)} m³</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Crew size:</span>
                    <span className="font-mono">{crewSize} {crewSize === 1 ? 'person' : 'people'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Handling speed:</span>
                    <span className="font-mono">4.5 m³/h per person</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-purple-200">
                    <span className="text-slate-600">Formula:</span>
                    <span className="font-mono text-xs">{finalVolume.toFixed(2)} ÷ ({crewSize} × 4.5)</span>
                  </div>
                  <div className="flex justify-between font-semibold text-purple-900">
                    <span>Handling Time:</span>
                    <span className="font-mono">{(finalVolume / (crewSize * 4.5)).toFixed(2)}h</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-purple-200 text-xs text-slate-600">
                    <span>Handling cost formula:</span>
                    <span className="font-mono">{(finalVolume / (crewSize * 4.5)).toFixed(2)}h × £25/h × {crewSize} crew</span>
                  </div>
                  <div className="flex justify-between font-semibold text-green-900 bg-green-100 p-2 rounded">
                    <span>Handling Cost:</span>
                    <span className="font-mono">£{((finalVolume / (crewSize * 4.5)) * 25 * crewSize).toFixed(2)}</span>
                  </div>
                  {distanceMiles > 0 && (
                    <>
                      <div className="flex justify-between pt-2 border-t border-purple-200">
                        <span className="text-slate-600">Travel time (round trip):</span>
                        <span className="font-mono">{((distanceMiles / 30) * 2).toFixed(2)}h</span>
                      </div>
                      <div className="flex justify-between font-semibold text-purple-900 bg-purple-100 p-2 rounded">
                        <span>Total Estimated Time:</span>
                        <span className="font-mono">{result.estimatedTime.toFixed(2)}h</span>
                      </div>
                    </>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-3 italic">
                  💡 Handling time is calculated using the speed rule: 4.5 m³ per hour per person
                </p>
              </div>
            )}

            {/* Inventory List */}
            {itemsCount > 0 && (
              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-3">Inventory List ({itemsCount} items)</h4>
                <div className="max-h-64 overflow-y-auto space-y-1">
                  {result.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-sm text-slate-700">
                      <span>{item.id}</span>
                      <span className="font-mono">×{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* System Flags */}
            <div className="bg-slate-50 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 mb-3">System Flags</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-slate-500">Min Price Applied:</span>
                  <span className="ml-2 font-semibold">{minimumApplied ? 'Yes' : 'No'}</span>
                </div>
                <div>
                  <span className="text-slate-500">Calculated At:</span>
                  <span className="ml-2 font-mono text-xs">
                    {new Date(result.timestamp).toISOString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ============================================ */}
      {/* 🔟 ACTIONS (BOTTOM) */}
      {/* ============================================ */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            {onSave && (
              <button
                onClick={() => onSave(result)}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2 font-medium"
              >
                <Save className="w-4 h-4" />
                Save Quote
              </button>
            )}
            
            {onSend && (
              <button
                onClick={() => onSend(result)}
                className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 flex items-center gap-2 font-medium"
              >
                <Send className="w-4 h-4" />
                Send to Customer
              </button>
            )}
            
            {onConvertToJob && (
              <button
                onClick={() => onConvertToJob(result)}
                className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 flex items-center gap-2 font-medium"
              >
                <CheckCircle className="w-4 h-4" />
                Convert to Job
              </button>
            )}
          </div>
          
          <div className="flex gap-3">
            {onArchive && (
              <button
                onClick={() => onArchive(result)}
                className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 flex items-center gap-2 font-medium"
              >
                <Archive className="w-4 h-4" />
                Archive
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function generateDefaultCustomerNotice(): string {
  return `IMPORTANT INFORMATION ABOUT YOUR QUOTE

This quote is based on the information you have provided. Please note:

• All items must be ready and accessible on the day of the move
• Waiting time includes 30 minutes at both addresses
• Additional items or access issues may affect the final price
• Payment is due upon completion of the service
• Cancellation must be made at least 48 hours in advance

If you have any questions about this quote, please contact us.`;
}

function generateSpecialNotices(result: any): string[] {
  const notices: string[] = [];
  
  // PoD required (if high value)
  if (result.finalPriceStandard > 500) {
    notices.push('⚠️ Proof of Delivery (PoD) required - high value job');
  }
  
  // 2 people required
  if (result.crewSize && result.crewSize >= 2) {
    notices.push(`👥 ${result.crewSize} people required for this job`);
  }
  
  // Call customer 24h before
  notices.push('📞 Call customer 24 hours before scheduled move');
  
  // Stairs / no lift
  if ((result.fromFloor > 0 && !result.fromLift) || (result.toFloor > 0 && !result.toLift)) {
    notices.push('🚶 Stairs without lift - extra physical effort required');
  }
  
  // Long carry / walking distance
  if (result.fromWalkingDistance > 50 || result.toWalkingDistance > 50) {
    notices.push('📏 Long walking distance from vehicle to property');
  }
  
  // Manual override applied
  if (result.manualOverride) {
    notices.push('✏️ Manual price override applied - check notes');
  }
  
  // Difficult parking
  if (result.fromParking === 'difficult' || result.toParking === 'difficult') {
    notices.push('🅿️ Difficult parking - may require permits or extra time');
  }
  
  return notices;
}