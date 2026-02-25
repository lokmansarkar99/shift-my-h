/**
 * Store/Pickup - Step 6: Confirmation
 */

import React from 'react';
import { StoreQuote } from './storeTypes';
import { CheckCircle, Home, Package } from 'lucide-react';
import { router } from '../../../../utils/router';

interface StepProps {
  data: StoreQuote;
}

export function StoreStep6Confirmation({ data }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center max-w-3xl mx-auto">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Booking Confirmed!
        </h1>
        <p className="text-lg text-slate-600 mb-2">
          Your store pickup & delivery service has been booked
        </p>
        {data.quoteReference && (
          <p className="text-sm text-slate-500 mb-8">
            Reference: <span className="font-mono font-bold text-blue-600">{data.quoteReference}</span>
          </p>
        )}
        
        <div className="bg-blue-50 rounded-xl p-6 mb-8 border border-blue-200">
          <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2 justify-center">
            <Package className="w-5 h-5" />
            What happens next?
          </h3>
          <ul className="text-sm text-blue-800 space-y-2 text-left max-w-md mx-auto">
            <li>✓ You'll receive a confirmation email shortly</li>
            <li>✓ Our team will contact you 24 hours before pickup</li>
            <li>✓ We'll collect from the store and deliver to your address</li>
            <li>✓ Track your delivery in real-time via SMS updates</li>
          </ul>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 mb-8 text-sm text-slate-700">
          <p className="font-semibold mb-2">Important:</p>
          <p>Please ensure items are ready for collection at the pickup location.</p>
          <p className="mt-1">Have your reference number ready when our driver arrives.</p>
        </div>

        <button
          onClick={() => router.navigate({ page: 'home' })}
          className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all mx-auto"
        >
          <Home className="w-5 h-5" />
          Back to Home
        </button>
      </div>
    </div>
  );
}
