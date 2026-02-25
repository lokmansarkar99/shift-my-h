/**
 * Payment Modal - ShiftMyHome
 * Shows payment options based on booking timeframe:
 * - < 72 hours: Pay Now (immediate payment required)
 * - > 72 hours: Book Now, Pay Later (card validation only)
 */

import React, { useState } from 'react';
import { X, Lock, CreditCard } from 'lucide-react';

interface PaymentModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onSubmit?: (paymentData: PaymentData) => void;
  onSuccess?: () => void;
  totalPrice?: number;
  amount?: number;
  moveDate?: Date;
  quoteRef?: string;
  quoteData?: any;
}

export interface PaymentData {
  paymentMethod: 'pay-now' | 'pay-later';
  cardNumber: string;
  expiryDate: string;
  securityCode: string;
  country: string;
  postalCode: string;
}

export function PaymentModal({ isOpen, onClose, onSubmit, onSuccess, totalPrice, amount, moveDate, quoteRef, quoteData }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'pay-now' | 'pay-later'>('pay-later');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [country, setCountry] = useState('United Kingdom');
  const [postalCode, setPostalCode] = useState('');

  // If isOpen is explicitly false, don't render
  if (isOpen === false) return null;

  // Calculate if booking is within 72 hours
  const now = new Date();
  const hoursUntilMove = moveDate ? (moveDate.getTime() - now.getTime()) / (1000 * 60 * 60) : 999;
  const isWithin72Hours = hoursUntilMove < 72;

  // If within 72 hours, force pay-now
  const effectivePaymentMethod = isWithin72Hours ? 'pay-now' : paymentMethod;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({
      paymentMethod: effectivePaymentMethod,
      cardNumber,
      expiryDate,
      securityCode,
      country,
      postalCode,
    });
    onSuccess?.();
  };

  const isFormValid = cardNumber && expiryDate && securityCode && country && postalCode;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">
            {isWithin72Hours ? 'Enter your payment details' : 'How would you like to pay?'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Payment Method Options - Only show if > 72 hours */}
          {!isWithin72Hours && (
            <div className="space-y-3">
              {/* Pay Today Option */}
              <label className="flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-blue-300 hover:bg-blue-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="pay-now"
                  checked={paymentMethod === 'pay-now'}
                  onChange={() => setPaymentMethod('pay-now')}
                  className="mt-1 w-4 h-4 text-blue-600"
                />
                <div className="flex-1">
                  <div className="font-bold text-slate-900">Pay today</div>
                  <div className="text-sm text-slate-600">Pay full amount now</div>
                </div>
              </label>

              {/* Book Now, Pay Later Option */}
              <label className="flex items-start gap-3 p-4 border-2 border-blue-500 bg-blue-50 rounded-xl cursor-pointer transition-all">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="pay-later"
                  checked={paymentMethod === 'pay-later'}
                  onChange={() => setPaymentMethod('pay-later')}
                  className="mt-1 w-4 h-4 text-blue-600"
                />
                <div className="flex-1">
                  <div className="font-bold text-slate-900">Book now, pay later</div>
                  <div className="text-sm text-slate-600">Pay 72 hours before your move</div>
                </div>
              </label>
            </div>
          )}

          {/* Validation Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-900 font-semibold">
              {effectivePaymentMethod === 'pay-later'
                ? 'Please enter details for validation only'
                : 'Complete your payment to confirm booking'}
            </p>
          </div>

          {/* Secure Checkout Badge */}
          <div className="flex items-center gap-2 text-sm text-emerald-600 font-semibold">
            <Lock className="w-4 h-4" />
            <span>Secure, fast checkout with Link</span>
          </div>

          {/* Card Number */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Card number
            </label>
            <div className="relative">
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
                  setCardNumber(formatted);
                }}
                placeholder="1234 1234 1234 1234"
                maxLength={19}
                className="w-full px-4 py-3 pr-20 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono"
                required
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                <div className="w-8 h-5 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                  VISA
                </div>
                <div className="w-8 h-5 bg-red-600 rounded flex items-center justify-center text-white text-xs font-bold">
                  MC
                </div>
              </div>
            </div>
          </div>

          {/* Expiry Date & Security Code */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Expiry date
              </label>
              <input
                type="text"
                value={expiryDate}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  const formatted = value.length >= 2 ? `${value.slice(0, 2)} / ${value.slice(2, 4)}` : value;
                  setExpiryDate(formatted);
                }}
                placeholder="MM / YY"
                maxLength={7}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Security code
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={securityCode}
                  onChange={(e) => setSecurityCode(e.target.value.replace(/\D/g, '').slice(0, 3))}
                  placeholder="CVC"
                  maxLength={3}
                  className="w-full px-4 py-3 pr-10 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono"
                  required
                />
                <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Country
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              required
            >
              <option value="United Kingdom">United Kingdom</option>
              <option value="Ireland">Ireland</option>
              <option value="France">France</option>
              <option value="Germany">Germany</option>
              <option value="Spain">Spain</option>
            </select>
          </div>

          {/* Postal Code */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Postal code
            </label>
            <input
              type="text"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value.toUpperCase())}
              placeholder="WS11 1DB"
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              required
            />
          </div>

          {/* Terms Text */}
          <div className="text-xs text-slate-600 leading-relaxed">
            By providing your card information, you allow ShiftMyHome to charge your card for future payments in accordance with their terms.
          </div>

          {/* Total Price */}
          <div className="flex items-center justify-between py-4 border-t border-slate-200">
            <span className="text-sm font-semibold text-slate-700">Total Price</span>
            <span className="text-3xl font-black text-blue-600">£{totalPrice?.toFixed(2) || amount?.toFixed(2)}</span>
          </div>

          {/* Marketplace Disclaimer */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
            <h4 className="text-[9px] font-black text-slate-900 uppercase tracking-widest mb-2">Marketplace Disclaimer</h4>
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
              ShiftMyHome is a marketplace platform.
            </p>
            <p className="text-[10px] text-slate-500 font-medium leading-tight mt-1">
              Transport services are provided by independent Transport Partners.
            </p>
            <p className="text-[9px] text-slate-400 mt-2 leading-relaxed italic">
              By confirming this booking, you acknowledge that your transport contract is with the Transport Partner, not with ShiftMyHome.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid}
            className="w-full py-4 px-6 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-black text-lg rounded-xl hover:from-pink-600 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {effectivePaymentMethod === 'pay-later' ? 'Book Now' : 'Pay Now'}
          </button>

          {/* Privacy Policy Link */}
          <div className="text-center text-xs text-slate-600">
            By clicking {effectivePaymentMethod === 'pay-later' ? 'Book Now' : 'Pay Now'}, you agree with our{' '}
            <a href="#" className="text-blue-600 hover:underline font-semibold">Privacy policy</a>
            {' '}and{' '}
            <a href="#" className="text-blue-600 hover:underline font-semibold">Terms of use</a>.
          </div>
        </form>
      </div>
    </div>
  );
}