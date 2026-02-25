import React, { useState, useEffect } from 'react';
import { X, Ruler, Weight } from 'lucide-react';

export interface ItemDetails {
  width?: number;
  height?: number;
  depth?: number;
  dimensionUnit: 'cm' | 'inches';
  weight?: number;
  weightUnit: 'kg' | 'lb';
}

interface ItemDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (itemId: string, details: ItemDetails) => void;
  itemId: string;
  itemName: string;
  initialDetails?: ItemDetails;
}

export function ItemDetailsModal({
  isOpen,
  onClose,
  onSubmit,
  itemId,
  itemName,
  initialDetails,
}: ItemDetailsModalProps) {
  const [width, setWidth] = useState(initialDetails?.width?.toString() || '');
  const [height, setHeight] = useState(initialDetails?.height?.toString() || '');
  const [depth, setDepth] = useState(initialDetails?.depth?.toString() || '');
  const [dimensionUnit, setDimensionUnit] = useState<'cm' | 'inches'>(initialDetails?.dimensionUnit || 'cm');
  const [weight, setWeight] = useState(initialDetails?.weight?.toString() || '');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>(initialDetails?.weightUnit || 'kg');

  useEffect(() => {
    if (initialDetails) {
      setWidth(initialDetails.width?.toString() || '');
      setHeight(initialDetails.height?.toString() || '');
      setDepth(initialDetails.depth?.toString() || '');
      setDimensionUnit(initialDetails.dimensionUnit);
      setWeight(initialDetails.weight?.toString() || '');
      setWeightUnit(initialDetails.weightUnit);
    }
  }, [initialDetails]);

  const handleSubmit = () => {
    const details: ItemDetails = {
      width: width ? parseFloat(width) : undefined,
      height: height ? parseFloat(height) : undefined,
      depth: depth ? parseFloat(depth) : undefined,
      dimensionUnit,
      weight: weight ? parseFloat(weight) : undefined,
      weightUnit,
    };
    onSubmit(itemId, details);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-bold text-slate-900">
            Tell us more about your {itemName}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Estimated Dimensions */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Ruler className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-slate-900">Estimated Dimensions</h3>
            </div>

            {/* Unit Selector */}
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => setDimensionUnit('cm')}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold text-sm transition-all ${
                  dimensionUnit === 'cm'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Centimeters (cm)
              </button>
              <button
                type="button"
                onClick={() => setDimensionUnit('inches')}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold text-sm transition-all ${
                  dimensionUnit === 'inches'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Inches (in)
              </button>
            </div>

            {/* Dimensions Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Width
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={width}
                    onChange={e => setWidth(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                    {dimensionUnit}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Height
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={height}
                    onChange={e => setHeight(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                    {dimensionUnit}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Depth
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={depth}
                    onChange={e => setDepth(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                    {dimensionUnit}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Estimated Weight */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Weight className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-slate-900">Estimated Weight</h3>
            </div>

            {/* Unit Selector */}
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => setWeightUnit('kg')}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold text-sm transition-all ${
                  weightUnit === 'kg'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Kilograms (kg)
              </button>
              <button
                type="button"
                onClick={() => setWeightUnit('lb')}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold text-sm transition-all ${
                  weightUnit === 'lb'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Pounds (lb)
              </button>
            </div>

            {/* Weight Input */}
            <div className="relative">
              <input
                type="number"
                value={weight}
                onChange={e => setWeight(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                {weightUnit}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 flex gap-3 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 px-6 rounded-xl hover:bg-slate-200 transition-all"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}