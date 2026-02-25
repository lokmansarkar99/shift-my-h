/**
 * Modal for entering item details (dimensions, weight)
 * Similar to AnyVan's item details popup
 */

import React, { useState } from 'react';
import { X, Package } from 'lucide-react';

interface ItemDetailsModalProps {
  itemName: string;
  onSubmit: (details: ItemDetails) => void;
  onCancel: () => void;
}

export interface ItemDetails {
  width: number;
  height: number;
  depth: number;
  weight: number;
  unit: 'cm' | 'in';
  weightUnit: 'kg' | 'lbs';
}

export function FurnitureItemDetailsModal({ itemName, onSubmit, onCancel }: ItemDetailsModalProps) {
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [depth, setDepth] = useState('');
  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');

  const handleSubmit = () => {
    if (!width || !height || !depth) {
      alert('Please enter all dimensions');
      return;
    }

    onSubmit({
      width: parseFloat(width),
      height: parseFloat(height),
      depth: parseFloat(depth),
      weight: weight ? parseFloat(weight) : 0,
      unit,
      weightUnit,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Tell us more about your {itemName}</h3>
              <p className="text-xs text-slate-500">Help us calculate the best price</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          {/* Dimensions */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Estimated Dimensions
            </label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <input
                  type="number"
                  placeholder="Width"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-center"
                />
                <p className="text-xs text-slate-500 mt-1 text-center">Width</p>
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Height"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-center"
                />
                <p className="text-xs text-slate-500 mt-1 text-center">Height</p>
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Depth"
                  value={depth}
                  onChange={(e) => setDepth(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-center"
                />
                <p className="text-xs text-slate-500 mt-1 text-center">Depth</p>
              </div>
            </div>
            <div className="mt-2">
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as 'cm' | 'in')}
                className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              >
                <option value="cm">Centimeters (cm)</option>
                <option value="in">Inches (in)</option>
              </select>
            </div>
          </div>

          {/* Weight */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Estimated Weight
              <span className="text-slate-400 font-normal ml-1">(optional)</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="px-3 py-2 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              />
              <select
                value={weightUnit}
                onChange={(e) => setWeightUnit(e.target.value as 'kg' | 'lbs')}
                className="px-3 py-2 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              >
                <option value="kg">Kilograms (kg)</option>
                <option value="lbs">Pounds (lbs)</option>
              </select>
            </div>
            <p className="text-xs text-slate-500 mt-1">If unsure, use your own weight to help you estimate!</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-slate-200">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 border-2 border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
