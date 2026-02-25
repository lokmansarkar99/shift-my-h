/**
 * Furniture & Items - Step 6: Confirmation (Placeholder)
 */

import React from 'react';
import { FurnitureQuote } from './furnitureTypes';
import { CheckCircle, Home } from 'lucide-react';
import { router } from '../../../../utils/router';

interface StepProps {
  data: FurnitureQuote;
}

export function FurnitureStep6Confirmation({ data }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Quote Request Submitted!
        </h1>
        <p className="text-lg text-slate-600 mb-2">
          Thank you for your furniture delivery request
        </p>
        {data.quoteReference && (
          <p className="text-sm text-slate-500 mb-8">
            Reference: <span className="font-mono font-bold text-purple-600">{data.quoteReference}</span>
          </p>
        )}
        
        <div className="bg-purple-50 rounded-xl p-6 mb-8 border border-purple-200">
          <h3 className="font-bold text-purple-900 mb-2">What happens next?</h3>
          <ul className="text-sm text-purple-800 space-y-2 text-left max-w-md mx-auto">
            <li>✓ We'll review your furniture delivery requirements</li>
            <li>✓ You'll receive a detailed quote within 24 hours</li>
            <li>✓ Our team will contact you to confirm the details</li>
          </ul>
        </div>

        <button
          onClick={() => router.navigate({ page: 'home' })}
          className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all mx-auto"
        >
          <Home className="w-5 h-5" />
          Back to Home
        </button>
      </div>
    </div>
  );
}
