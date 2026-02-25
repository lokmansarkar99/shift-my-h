import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ArrowLeft, Trash2, MapPin, Package, DollarSign, CheckCircle, AlertCircle, User, Mail, Phone, Calendar } from 'lucide-react';
import { ClearanceQuote } from './clearanceTypes';
import { calculateClearancePrice, ClearancePricingBreakdown } from '../../../../utils/clearancePricingEngine';
import { PaymentModal, PaymentData } from '../../PaymentModal';

interface StepProps {
  data: ClearanceQuote;
  onChange: (updates: Partial<ClearanceQuote>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function ClearanceStep5Review({ data, onChange, onNext, onBack }: StepProps) {
  const [pricing, setPricing] = useState<ClearancePricingBreakdown | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  // Calculate pricing on mount
  useEffect(() => {
    async function loadPricing() {
      setLoading(true);
      try {
        // Calculate distance if specific disposal location
        let distanceMiles = 0;
        if (data.delivery && data.pickup.lat && data.pickup.lng && data.delivery.lat && data.delivery.lng) {
          // Simple Haversine distance calculation
          const R = 3959; // Earth's radius in miles
          const dLat = (data.delivery.lat - data.pickup.lat) * Math.PI / 180;
          const dLon = (data.delivery.lng - data.pickup.lng) * Math.PI / 180;
          const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(data.pickup.lat * Math.PI / 180) * Math.cos(data.delivery.lat * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          distanceMiles = R * c;
        }

        const result = await calculateClearancePrice({
          serviceType: data.serviceType || 'General Junk Removal',
          totalVolume: data.totalVolume || 0,
          disposalMethod: data.delivery ? 'specific_location' : 'we_dispose',
          pickupFloor: data.pickup.floor || 0,
          hasLift: data.pickup.hasLift || false,
          bulkyItemsCount: data.bulkyItemsCount || 0,
          hasHazardousWaste: data.hasHazardousWaste || false,
          distanceMiles: distanceMiles,
        });

        setPricing(result);
        
        // Update quote with pricing
        onChange({
          estimatedPrice: result.finalPrice,
        });
      } catch (error) {
        console.error('Pricing calculation error:', error);
      } finally {
        setLoading(false);
      }
    }

    loadPricing();
  }, [data.pickup, data.delivery, data.serviceType, data.totalVolume, data.bulkyItemsCount, data.hasHazardousWaste]);

  const handlePaymentSubmit = (paymentData: PaymentData) => {
    // Save payment data
    onChange({
      paymentMethod: paymentData.paymentMethod as 'pay_today' | 'pay_later',
      paymentDetails: {
        paymentMethod: paymentData.paymentMethod as 'pay_today' | 'pay_later',
        cardNumber: paymentData.cardNumber,
        expiryDate: paymentData.expiryDate,
        securityCode: paymentData.securityCode,
        country: paymentData.country,
        postalCode: paymentData.postalCode,
      },
    });
    
    // Close modal and proceed to confirmation
    setPaymentModalOpen(false);
    onNext();
  };

  // Get move date - use pickupDate or default to 7 days from now
  const getMoveDate = (): Date => {
    if (data.pickupDate) {
      return new Date(data.pickupDate);
    }
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 7);
    return defaultDate;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }} 
      className="space-y-6"
    >
      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onSubmit={handlePaymentSubmit}
        totalPrice={pricing?.finalPrice || 0}
        moveDate={getMoveDate()}
      />

      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Review Your Quote</h2>
        <p className="text-orange-100">Please review your clearance details and pricing</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Quote Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Collection Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Collection Location
            </h3>
            <div className="space-y-3">
              {data.pickupAddress ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Address:</span>
                    <span className="font-semibold text-slate-900 text-right">
                      {data.pickupAddress.addressLine1}
                      {data.pickupAddress.addressLine2 && `, ${data.pickupAddress.addressLine2}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">City:</span>
                    <span className="font-semibold text-slate-900">{data.pickupAddress.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Postcode:</span>
                    <span className="font-semibold text-slate-900">{data.pickupAddress.postcode}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between">
                  <span className="text-slate-600">Address:</span>
                  <span className="font-semibold text-slate-900 text-right">{data.pickup.address}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-600">Service Type:</span>
                <span className="font-semibold text-orange-600">{data.serviceType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Floor:</span>
                <span className="font-semibold text-slate-900">
                  {['Basement', 'Ground', '1st', '2nd', '3rd', '4th', '5th+'][data.pickup.floor || 1]}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Lift Available:</span>
                <span className={`font-semibold ${data.pickup.hasLift ? 'text-green-600' : 'text-red-600'}`}>
                  {data.pickup.hasLift ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          {data.contact && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">Name:</span>
                  <span className="font-semibold text-slate-900">{data.contact.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">Email:</span>
                  <span className="font-semibold text-slate-900">{data.contact.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">Phone:</span>
                  <span className="font-semibold text-slate-900">{data.contact.phone}</span>
                </div>
                {data.pickupDate && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600">Preferred Date:</span>
                    <span className="font-semibold text-slate-900">{new Date(data.pickupDate).toLocaleDateString('en-GB')}</span>
                  </div>
                )}
                {data.pickupTime && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600">Preferred Time:</span>
                    <span className="font-semibold text-slate-900">{data.pickupTime}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Disposal Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-green-600" />
              Disposal Method
            </h3>
            {data.delivery ? (
              <div className="space-y-3">
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <p className="text-sm font-semibold text-blue-800">📍 Specific Disposal Location</p>
                  <p className="text-xs text-blue-600 mt-1">{data.delivery.address}</p>
                </div>
              </div>
            ) : (
              <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                <p className="text-sm font-semibold text-green-800">🚛 We'll dispose at licensed facilities</p>
                <p className="text-xs text-green-600 mt-1">Eco-friendly disposal included in quote</p>
              </div>
            )}
          </div>

          {/* Volume & Items */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-purple-600" />
              Items & Volume
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Total Volume:</span>
                <span className="font-bold text-slate-900 text-xl">{data.totalVolume?.toFixed(2) || '0.00'}m³</span>
              </div>
              {data.bulkyItemsCount && data.bulkyItemsCount > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Bulky Items:</span>
                  <span className="font-semibold text-slate-900">{data.bulkyItemsCount} items</span>
                </div>
              )}
              {data.hasHazardousWaste && (
                <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                  <p className="text-sm font-semibold text-orange-800">⚠️ Hazardous waste included</p>
                  <p className="text-xs text-orange-600 mt-1">Additional disposal fee applies</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: Pricing Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border-2 border-orange-200 sticky top-6">
            <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-4 rounded-t-2xl">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Quote Summary
              </h3>
            </div>

            <div className="p-6 space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full mx-auto mb-3"></div>
                  <p className="text-sm text-slate-600">Calculating pricing...</p>
                </div>
              ) : pricing ? (
                <>
                  {/* Breakdown */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Base Volume ({pricing.volumeUsed}m³)</span>
                      <span className="font-semibold">£{pricing.baseVolumePrice.toFixed(2)}</span>
                    </div>
                    
                    {pricing.serviceTypeMultiplier !== 1.0 && (
                      <div className="flex justify-between text-orange-600">
                        <span>Service Type ({pricing.serviceTypeMultiplier}x)</span>
                        <span className="font-semibold">Applied</span>
                      </div>
                    )}
                    
                    {pricing.disposalFee !== 0 && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Disposal Fee</span>
                        <span className={`font-semibold ${pricing.disposalFee > 0 ? '' : 'text-green-600'}`}>
                          {pricing.disposalFee > 0 ? '+' : ''}£{pricing.disposalFee.toFixed(2)}
                        </span>
                      </div>
                    )}
                    
                    {pricing.perM3DisposalFee > 0 && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Per-m³ Disposal</span>
                        <span className="font-semibold">+£{pricing.perM3DisposalFee.toFixed(2)}</span>
                      </div>
                    )}
                    
                    {pricing.bulkyItemsFee > 0 && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Bulky Items</span>
                        <span className="font-semibold">+£{pricing.bulkyItemsFee.toFixed(2)}</span>
                      </div>
                    )}
                    
                    {pricing.hazardousWasteFee > 0 && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Hazardous Waste</span>
                        <span className="font-semibold">+£{pricing.hazardousWasteFee.toFixed(2)}</span>
                      </div>
                    )}
                    
                    {pricing.accessFee > 0 && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Access Fee</span>
                        <span className="font-semibold">+£{pricing.accessFee.toFixed(2)}</span>
                      </div>
                    )}
                    
                    {pricing.distanceFee > 0 && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Distance Fee</span>
                        <span className="font-semibold">+£{pricing.distanceFee.toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t-2 border-slate-200 pt-4 mt-4">
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="text-slate-600 font-medium">Subtotal:</span>
                      <span className="text-lg font-bold text-slate-900">£{pricing.subtotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {pricing.minimumVolumeApplied && (
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                      <p className="text-xs text-blue-700">
                        <AlertCircle className="w-3 h-3 inline mr-1" />
                        Minimum {pricing.volumeUsed}m³ charge applied
                      </p>
                    </div>
                  )}

                  <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border-2 border-orange-300">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-orange-900">Total Price:</span>
                      <span className="text-3xl font-bold text-orange-600">£{pricing.finalPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                    <p className="text-xs text-green-700 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Price includes VAT and all fees
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-red-300 mx-auto mb-3" />
                  <p className="text-sm text-red-600">Unable to calculate pricing</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <button 
          onClick={onBack} 
          className="px-6 py-3 rounded-xl font-semibold text-slate-700 bg-white border-2 border-slate-200 hover:bg-slate-50 flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <button 
          onClick={() => setPaymentModalOpen(true)} 
          disabled={loading || !pricing}
          className="px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg transition-all"
        >
          Continue to Payment <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}