import React from 'react';
import { MapPin, CheckCircle2, Edit3, Search } from 'lucide-react';

/**
 * Visual guide for UK Address Lookup - can be shown as a tooltip or help modal
 */
export function AddressLookupGuide() {
  return (
    <div className="max-w-md">
      <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-blue-600" />
        How to use Address Lookup
      </h3>
      
      <div className="space-y-4">
        {/* Step 1 */}
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 font-bold text-blue-600">
            1
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Start typing</p>
            <p className="text-xs text-gray-500">Enter your postcode (e.g., "SW1A 1AA") or start of address</p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 font-bold text-purple-600">
            2
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Select from list</p>
            <p className="text-xs text-gray-500">Choose your address from the dropdown menu</p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Confirmed!</p>
            <p className="text-xs text-gray-500">Green checkmark means your address is saved</p>
          </div>
        </div>

        {/* Manual entry option */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-start gap-2 text-xs text-gray-600">
            <Edit3 className="w-3.5 h-3.5 mt-0.5 text-blue-500 flex-shrink-0" />
            <p>
              <strong>Can't find your address?</strong><br />
              Click "Enter manually" to type it yourself
            </p>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-4 bg-blue-50 rounded-lg p-3">
          <p className="text-xs font-medium text-blue-900 mb-1">💡 Tips:</p>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Type at least 3 characters</li>
            <li>• UK postcodes work best</li>
            <li>• Address must be selected, not just typed</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

/**
 * Inline help text component (smaller, can be placed under input)
 */
export function AddressLookupHint() {
  return (
    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
      <Search className="w-3 h-3" />
      Type your postcode or address, then select from the list
    </p>
  );
}

/**
 * Status indicator for address selection
 */
export function AddressSelectionStatus({ 
  isSelected, 
  postcode 
}: { 
  isSelected: boolean; 
  postcode?: string; 
}) {
  if (!isSelected) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
        <MapPin className="w-3 h-3" />
        Please select an address from the dropdown
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
      <CheckCircle2 className="w-3 h-3" />
      {postcode ? `Postcode: ${postcode}` : 'Address confirmed'}
    </div>
  );
}
