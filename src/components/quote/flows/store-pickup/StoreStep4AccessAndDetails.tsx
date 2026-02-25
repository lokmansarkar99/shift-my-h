/**
 * Store/Pickup - Step 4: Access Details + Customer Details (Combined)
 * UNIQUE DESIGN - Includes Order Number, Assembly Extras and Date/Time
 */

import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Info, User, Mail, Phone, MapPin, Package, Clock, ShieldCheck, Plus, Minus, Wrench, FileText, Upload, Check } from 'lucide-react';
import { StoreQuote } from './storeTypes';
import { MapView } from '../../MapView';
import { MoveSummaryCard } from '../../MoveSummaryCard';
import { StoreItemListSummary } from './StoreItemListSummary';
import { PricingCalendar } from '../../PricingCalendar';
import { TimeSelector } from '../../TimeSelector';
import { getPricingConfig } from '../../../../utils/pricingConfigService';
import { projectId, publicAnonKey } from '../../../../utils/supabase/info';

interface StepProps {
  data: StoreQuote;
  onChange: (updates: Partial<StoreQuote>) => void;
  onNext: () => void;
  onBack: () => void;
}

const FLOOR_OPTIONS = ['Basement', 'Ground floor', '1st', '2nd', '3rd', '4th', '5th+'];

export function StoreStep4AccessAndDetails({ data, onChange, onNext, onBack }: StepProps) {
  // Store Details
  const [orderNumber, setOrderNumber] = useState(data.orderNumber || '');
  const [pickupNotes, setPickupNotes] = useState(data.pickupNotes || '');
  const [deliveryNotes, setDeliveryNotes] = useState(data.deliveryNotes || '');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [receiptUrl, setReceiptUrl] = useState(data.receiptUrl || '');

  // Date & Time
  const [selectedDate, setSelectedDate] = useState<string>(
    data.date ? (data.date instanceof Date ? data.date.toISOString().split('T')[0] : typeof data.date === 'string' ? data.date : '') : ''
  );
  const [selectedTime, setSelectedTime] = useState('08:00-10:00');

  // Extras
  const [assemblyQuantity, setAssemblyQuantity] = useState(
    data.extras?.find(e => e.id === 'assembly')?.quantity || 0
  );

  // Customer Details
  const [name, setName] = useState(data.customerName || '');
  const [email, setEmail] = useState(data.customerEmail || '');
  const [phone, setPhone] = useState(data.customerPhone || '');
  const [addressLine1, setAddressLine1] = useState(data.customerAddressLine1 || '');
  const [addressLine2, setAddressLine2] = useState(data.customerAddressLine2 || '');
  const [city, setCity] = useState(data.customerCity || '');
  const [postcode, setPostcode] = useState(data.customerPostcode || '');

  // Pricing state
  const [pricingExtras, setPricingExtras] = useState<number>(0);
  const [urgencySurcharge, setUrgencySurcharge] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(data.estimatedPrice || 0);

  const isFormValid = name.trim() && email.trim() && phone.trim() && addressLine1.trim() && city.trim() && postcode.trim() && selectedDate;

  // Handle price recalculation when date or extras change
  useEffect(() => {
    const updatePrice = async () => {
      const config = await getPricingConfig();
      let extraCost = 0;
      let urgencyCost = 0;

      // 1. Assembly Service (£25 per item for flat-pack)
      if (assemblyQuantity > 0) {
        extraCost = assemblyQuantity * 25;
      }

      // 2. Urgent / Same Day Pickup
      const today = new Date().toISOString().split('T')[0];
      if (selectedDate === today) {
        urgencyCost = config.pickupServiceCharges.sameDay || 40;
      } else {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];
        if (selectedDate === tomorrowStr) {
          urgencyCost = config.pickupServiceCharges.nextDay || 20;
        }
      }

      setPricingExtras(extraCost);
      setUrgencySurcharge(urgencyCost);
      
      const basePrice = data.estimatedPrice || 0;
      setTotalPrice(basePrice + extraCost + urgencyCost);
    };

    updatePrice();
  }, [selectedDate, assemblyQuantity, data.estimatedPrice]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setReceiptFile(file);
    setIsUploading(true);

    // Simulate upload or implement actual Supabase Storage call via server
    setTimeout(() => {
      setReceiptUrl(`https://storage.shiftmyhome.com/receipts/${file.name}`);
      setIsUploading(false);
    }, 1500);
  };

  const handleNext = () => {
    if (!isFormValid) return;
    
    onChange({
      orderNumber,
      pickupNotes,
      deliveryNotes,
      receiptUrl,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      customerAddressLine1: addressLine1,
      customerAddressLine2: addressLine2,
      customerCity: city,
      customerPostcode: postcode,
      date: new Date(selectedDate),
      estimatedPrice: totalPrice,
      extras: assemblyQuantity > 0 ? [
        { id: 'assembly', name: 'Furniture Assembly Service', price: 25, quantity: assemblyQuantity }
      ] : [],
    });
    
    onNext();
  };

  const pickupFloor = FLOOR_OPTIONS[data.pickup.floor] || 'Ground floor';
  const deliveryFloor = FLOOR_OPTIONS[data.dropoff.floor] || 'Ground floor';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-6 lg:gap-8">
        {/* LEFT COLUMN */}
        <div className="space-y-6 order-last lg:order-first">
          {/* STORE & ORDER INFO */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Collection Details</h2>
                <p className="text-sm text-slate-600">Provide order information for the store pickup</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Order Number / Collection Reference
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                    placeholder="e.g. IKEA-123456789 or B&Q-98765"
                    className="w-full pl-4 pr-12 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-0 transition-all font-mono text-lg font-bold uppercase"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <ShieldCheck className="w-6 h-6 text-emerald-500" />
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Our driver will use this reference to identify and collect your items from the store.
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Pickup Notes</label>
                <textarea
                  value={pickupNotes}
                  onChange={(e) => setPickupNotes(e.target.value)}
                  placeholder="e.g. Collection at Customer Service Desk, heavy items..."
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-emerald-500 outline-none transition-all resize-none text-sm"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Delivery Notes</label>
                <textarea
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  placeholder="e.g. Narrow driveway, please call 10 mins before arrival..."
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none transition-all resize-none text-sm"
                  rows={3}
                />
              </div>

              {/* RECEIPT UPLOAD */}
              <div className="md:col-span-2 pt-4 border-t border-slate-100">
                <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  Upload Collection Receipt / Invoice (Optional)
                </label>
                
                <div className={`relative border-2 border-dashed rounded-2xl p-6 transition-all ${receiptUrl ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-300 bg-slate-50 hover:border-emerald-400'}`}>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    accept="image/*,.pdf"
                  />
                  
                  <div className="flex flex-col items-center justify-center text-center">
                    {isUploading ? (
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                        <p className="text-sm font-bold text-emerald-700">Uploading receipt...</p>
                      </div>
                    ) : receiptUrl ? (
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
                          <Check className="w-6 h-6 text-emerald-600" />
                        </div>
                        <p className="text-sm font-bold text-emerald-900">Receipt Uploaded Successfully!</p>
                        <p className="text-xs text-emerald-600 mt-1 truncate max-w-[250px]">{receiptFile?.name || 'receipt.pdf'}</p>
                        <button 
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setReceiptUrl(''); setReceiptFile(null); }}
                          className="mt-3 text-xs font-bold text-red-500 hover:underline relative z-20"
                        >
                          Remove and replace
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center mb-3">
                          <Upload className="w-6 h-6 text-slate-400" />
                        </div>
                        <p className="text-sm font-bold text-slate-900">Click or drag receipt here</p>
                        <p className="text-xs text-slate-500 mt-1">Supports PDF, JPG, PNG (Max 5MB)</p>
                      </>
                    )}
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-1 italic">
                  <Info className="w-3 h-3" />
                  Highly recommended for smooth IKEA/B&Q collections.
                </p>
              </div>
            </div>
          </div>

          {/* DATE & TIME SELECTION */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Schedule Pickup</h2>
                <p className="text-sm text-slate-600">When should we collect your items?</p>
              </div>
            </div>

            <div className="grid md:grid-cols-[65%_35%] gap-6">
              <PricingCalendar
                basePrice={data.estimatedPrice || 0}
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
              />
              <TimeSelector
                selectedTime={selectedTime}
                onTimeSelect={setSelectedTime}
              />
            </div>

            {urgencySurcharge > 0 && (
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-amber-900">Urgent Pickup Surcharge Applied</p>
                  <p className="text-xs text-amber-700">A fee of +£{urgencySurcharge} has been added for {selectedDate === new Date().toISOString().split('T')[0] ? 'Same-Day' : 'Next-Day'} service.</p>
                </div>
              </div>
            )}
          </div>

          {/* ASSEMBLY EXTRAS */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <Wrench className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Assembly Service</h2>
                <p className="text-sm text-slate-600">Do you need help building your flat-pack furniture?</p>
              </div>
            </div>

            <div className={`border-2 rounded-2xl p-6 transition-all ${assemblyQuantity > 0 ? 'border-purple-500 bg-purple-50/50 shadow-md' : 'border-slate-200'}`}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${assemblyQuantity > 0 ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    <Package className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900">Flat-pack Assembly</h3>
                    <p className="text-xs text-slate-500">Expert assembly of IKEA/retail furniture at your home</p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="text-right">
                    <span className="text-xl font-black text-purple-600">£25</span>
                    <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Per Item</span>
                  </div>
                  
                  <div className="flex items-center bg-white rounded-xl border-2 border-slate-200 p-1">
                    <button
                      onClick={() => setAssemblyQuantity(Math.max(0, assemblyQuantity - 1))}
                      className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 text-red-600 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-black text-slate-900">{assemblyQuantity}</span>
                    <button
                      onClick={() => setAssemblyQuantity(assemblyQuantity + 1)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-emerald-50 text-emerald-600 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CUSTOMER CONTACT DETAILS */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Your Contact Details</h2>
                <p className="text-sm text-slate-600">Where should we send the booking confirmation?</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Smith"
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="07xxx xxxxxx"
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-4">Billing Address</h4>
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      placeholder="Address Line 1"
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="City"
                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none"
                      />
                      <input
                        type="text"
                        value={postcode}
                        onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                        placeholder="Postcode"
                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4 pt-6">
            <button
              onClick={onBack}
              className="px-8 py-4 rounded-xl font-bold text-slate-700 bg-white border-2 border-slate-200 hover:bg-slate-50 transition-all"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!isFormValid}
              className={`flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-black text-lg transition-all ${
                isFormValid
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:shadow-xl'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              Continue to Review
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN - SIDEBAR */}
        <div className="space-y-6">
          {/* FINAL PRICE SUMMARY CARD */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-xl sticky top-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Final Quote Summary
            </h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm text-slate-400">
                <span>Base Collection:</span>
                <span className="text-white font-medium">£{(data.estimatedPrice || 0).toFixed(2)}</span>
              </div>
              
              {pricingExtras > 0 && (
                <div className="flex justify-between text-sm text-purple-300">
                  <span>Assembly ({assemblyQuantity} items):</span>
                  <span className="font-bold">+£{pricingExtras.toFixed(2)}</span>
                </div>
              )}

              {urgencySurcharge > 0 && (
                <div className="flex justify-between text-sm text-amber-300">
                  <span>Urgency Surcharge:</span>
                  <span className="font-bold">+£{urgencySurcharge.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-700">
              <div className="flex justify-between items-center">
                <span className="text-slate-300 font-medium">Total:</span>
                <span className="text-4xl font-black text-white">£{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 bg-white/5 rounded-xl p-3 border border-white/10">
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">Selected Items</p>
              <div className="max-h-32 overflow-y-auto space-y-1 custom-scrollbar pr-2">
                {data.items?.map(item => (
                  <div key={item.id} className="flex justify-between text-[11px]">
                    <span className="truncate flex-1 pr-2">{item.quantity}x {item.name}</span>
                    <span className="text-slate-500">{(item.volume * item.quantity).toFixed(2)}m³</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Map */}
          {data.pickup.lat && data.pickup.lng && data.dropoff.lat && data.dropoff.lng && (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden group">
              <MapView
                pickupLat={data.pickup.lat}
                pickupLng={data.pickup.lng}
                deliveryLat={data.dropoff.lat}
                deliveryLng={data.dropoff.lng}
                onRouteUpdate={(dist) => {
                  onChange({ distance: dist });
                }}
              />
            </div>
          )}

          <MoveSummaryCard
            pickupAddress={data.pickup.address}
            pickupPostcode={data.pickup.postcode}
            pickupFloor={pickupFloor}
            pickupLift={data.pickup.hasLift}
            deliveryAddress={data.dropoff.address}
            deliveryPostcode={data.dropoff.postcode}
            deliveryFloor={deliveryFloor}
            deliveryLift={data.dropoff.hasLift}
            moveDate={selectedDate}
            distance={data.distance}
            totalVolume={data.totalVolume}
          />
        </div>
      </div>
    </div>
  );
}
