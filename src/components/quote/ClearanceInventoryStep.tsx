import React, { useState } from 'react';
import { Trash2, Leaf, HardHat, ChevronRight, Plus, Minus } from 'lucide-react';

interface ClearanceItem {
  id: string;
  category: 'household' | 'garden' | 'builders';
  type: string;
  quantity: number;
  estimatedVolume: number; // m³ per unit
  loadingMinutes: number; // minutes per unit
}

interface ClearanceInventoryStepProps {
  onNext: (data: ClearanceStepData) => void;
  onBack: () => void;
  initialData?: ClearanceStepData;
}

export interface ClearanceStepData {
  items: ClearanceItem[];
  disposalType: 'recyclable' | 'general' | 'restricted' | 'hazardous';
  totalVolume: number;
  estimatedLoadingTime: number;
  vehicleSize: string;
  crewSize: number;
}

export function ClearanceInventoryStep({ onNext, onBack, initialData }: ClearanceInventoryStepProps) {
  const [items, setItems] = useState<ClearanceItem[]>(initialData?.items || []);
  const [disposalType, setDisposalType] = useState<ClearanceStepData['disposalType']>(
    initialData?.disposalType || 'general'
  );

  // Predefined item templates
  const itemTemplates: Record<string, { category: ClearanceItem['category']; type: string; volume: number; loadingMinutes: number }> = {
    // HOUSEHOLD
    'household-small': { category: 'household', type: 'Small items (bags / boxes)', volume: 0.05, loadingMinutes: 2 },
    'household-medium': { category: 'household', type: 'Medium items (chairs, small tables)', volume: 0.30, loadingMinutes: 5 },
    'household-large': { category: 'household', type: 'Large items (wardrobes, sofas, fridges)', volume: 1.50, loadingMinutes: 15 },
    'household-mixed': { category: 'household', type: 'Mixed household clearance (general clutter)', volume: 2.00, loadingMinutes: 30 },
    
    // GARDEN
    'garden-green': { category: 'garden', type: 'Green waste (branches, leaves)', volume: 1.00, loadingMinutes: 20 },
    'garden-soil': { category: 'garden', type: 'Soil / turf', volume: 1.50, loadingMinutes: 25 },
    'garden-furniture': { category: 'garden', type: 'Garden furniture', volume: 0.80, loadingMinutes: 10 },
    'garden-sheds': { category: 'garden', type: 'Sheds / panels (dismantled)', volume: 3.00, loadingMinutes: 40 },
    
    // BUILDERS
    'builders-rubble': { category: 'builders', type: 'Rubble / bricks / concrete', volume: 0.50, loadingMinutes: 15 },
    'builders-wood': { category: 'builders', type: 'Wood / timber', volume: 0.80, loadingMinutes: 12 },
    'builders-plasterboard': { category: 'builders', type: 'Plasterboard', volume: 0.60, loadingMinutes: 10 },
    'builders-mixed': { category: 'builders', type: 'Mixed construction waste', volume: 1.20, loadingMinutes: 20 },
  };

  const addItem = (templateKey: string) => {
    const template = itemTemplates[templateKey];
    const existingItem = items.find((i) => i.type === template.type);

    if (existingItem) {
      // Increase quantity
      setItems(items.map((i) =>
        i.type === template.type ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      // Add new item
      const newItem: ClearanceItem = {
        id: Date.now().toString(),
        category: template.category,
        type: template.type,
        quantity: 1,
        estimatedVolume: template.volume,
        loadingMinutes: template.loadingMinutes,
      };
      setItems([...items, newItem]);
    }
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setItems(items.map((item) => {
      if (item.id === itemId) {
        const newQty = Math.max(0, item.quantity + delta);
        return newQty === 0 ? null : { ...item, quantity: newQty };
      }
      return item;
    }).filter(Boolean) as ClearanceItem[]);
  };

  const removeItem = (itemId: string) => {
    setItems(items.filter((i) => i.id !== itemId));
  };

  // Calculate totals
  const totalVolume = items.reduce((sum, item) => sum + (item.estimatedVolume * item.quantity), 0);
  const estimatedLoadingTime = items.reduce((sum, item) => sum + (item.loadingMinutes * item.quantity), 0);
  
  // Determine vehicle size
  const getVehicleSize = (volume: number): string => {
    if (volume <= 3) return 'Small van';
    if (volume <= 6) return 'Medium van';
    if (volume <= 10) return 'Large van';
    return 'Luton van';
  };

  // Determine crew size
  const getCrewSize = (volume: number, hasLargeItems: boolean): number => {
    if (hasLargeItems || volume > 5) return 2;
    return 1;
  };

  const vehicleSize = getVehicleSize(totalVolume);
  const hasLargeItems = items.some((i) => i.type.includes('Large') || i.type.includes('wardrobes') || i.type.includes('Sheds'));
  const crewSize = getCrewSize(totalVolume, hasLargeItems);

  const handleNext = () => {
    if (items.length === 0) {
      alert('Please select at least one item to remove');
      return;
    }

    onNext({
      items,
      disposalType,
      totalVolume,
      estimatedLoadingTime,
      vehicleSize,
      crewSize,
    });
  };

  const largeItemsCount = items.filter((i) => i.type.includes('Large') || i.type.includes('Sheds')).reduce((sum, i) => sum + i.quantity, 0);
  const smallItemsCount = items.filter((i) => i.type.includes('Small') || i.type.includes('bags')).reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 mb-3">Select what you need removed</h2>
        <p className="text-slate-600 text-lg">
          You don't need to list every item.<br />
          Just choose the type and amount, and we'll handle the rest.
        </p>
      </div>

      {/* 🏠 HOUSEHOLD CLEARANCE */}
      <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-blue-200">
          <div className="flex items-center gap-3">
            <Trash2 className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold text-blue-900">🏠 Household clearance</h3>
          </div>
        </div>
        <div className="p-6">
          <div className="grid sm:grid-cols-2 gap-4">
            {['household-small', 'household-medium', 'household-large', 'household-mixed'].map((key) => {
              const template = itemTemplates[key];
              const existingItem = items.find((i) => i.type === template.type);
              const quantity = existingItem?.quantity || 0;

              return (
                <div
                  key={key}
                  className={`relative p-5 rounded-xl border-2 transition-all cursor-pointer ${
                    quantity > 0
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-slate-900 text-sm leading-snug">{template.type}</h4>
                    {quantity === 0 && (
                      <button
                        onClick={() => addItem(key)}
                        className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Add
                      </button>
                    )}
                  </div>

                  {quantity > 0 && (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(existingItem!.id, -1)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border-2 border-blue-500 text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-xl font-bold text-blue-900 min-w-[3ch] text-center">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(existingItem!.id, 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeItem(existingItem!.id)}
                        className="ml-auto text-xs text-red-600 hover:text-red-700 underline"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 🌿 GARDEN CLEARANCE */}
      <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-green-200">
          <div className="flex items-center gap-3">
            <Leaf className="w-6 h-6 text-green-600" />
            <h3 className="text-xl font-bold text-green-900">🌿 Garden clearance</h3>
          </div>
        </div>
        <div className="p-6">
          <div className="grid sm:grid-cols-2 gap-4">
            {['garden-green', 'garden-soil', 'garden-furniture', 'garden-sheds'].map((key) => {
              const template = itemTemplates[key];
              const existingItem = items.find((i) => i.type === template.type);
              const quantity = existingItem?.quantity || 0;

              return (
                <div
                  key={key}
                  className={`relative p-5 rounded-xl border-2 transition-all cursor-pointer ${
                    quantity > 0
                      ? 'border-green-500 bg-green-50 shadow-md'
                      : 'border-slate-200 bg-white hover:border-green-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-slate-900 text-sm leading-snug">{template.type}</h4>
                    {quantity === 0 && (
                      <button
                        onClick={() => addItem(key)}
                        className="px-3 py-1 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Add
                      </button>
                    )}
                  </div>

                  {quantity > 0 && (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(existingItem!.id, -1)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border-2 border-green-500 text-green-600 hover:bg-green-50 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-xl font-bold text-green-900 min-w-[3ch] text-center">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(existingItem!.id, 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeItem(existingItem!.id)}
                        className="ml-auto text-xs text-red-600 hover:text-red-700 underline"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 🧱 BUILDERS WASTE */}
      <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-4 border-b border-orange-200">
          <div className="flex items-center gap-3">
            <HardHat className="w-6 h-6 text-orange-600" />
            <h3 className="text-xl font-bold text-orange-900">🧱 Builders waste</h3>
          </div>
          <p className="text-xs text-orange-700 mt-1 font-medium">⚠️ Different legal requirements & disposal costs</p>
        </div>
        <div className="p-6">
          <div className="grid sm:grid-cols-2 gap-4">
            {['builders-rubble', 'builders-wood', 'builders-plasterboard', 'builders-mixed'].map((key) => {
              const template = itemTemplates[key];
              const existingItem = items.find((i) => i.type === template.type);
              const quantity = existingItem?.quantity || 0;

              return (
                <div
                  key={key}
                  className={`relative p-5 rounded-xl border-2 transition-all cursor-pointer ${
                    quantity > 0
                      ? 'border-orange-500 bg-orange-50 shadow-md'
                      : 'border-slate-200 bg-white hover:border-orange-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-slate-900 text-sm leading-snug">{template.type}</h4>
                    {quantity === 0 && (
                      <button
                        onClick={() => addItem(key)}
                        className="px-3 py-1 bg-orange-600 text-white text-xs font-medium rounded-lg hover:bg-orange-700 transition-colors"
                      >
                        Add
                      </button>
                    )}
                  </div>

                  {quantity > 0 && (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(existingItem!.id, -1)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border-2 border-orange-500 text-orange-600 hover:bg-orange-50 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-xl font-bold text-orange-900 min-w-[3ch] text-center">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(existingItem!.id, 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeItem(existingItem!.id)}
                        className="ml-auto text-xs text-red-600 hover:text-red-700 underline"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 🗑️ DISPOSAL TYPE (OBLIGATORIU) */}
      <div className="bg-white rounded-2xl shadow-lg border-2 border-purple-200 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-purple-200">
          <h3 className="text-xl font-bold text-purple-900">🗑️ Disposal type</h3>
          <p className="text-sm text-purple-700 mt-1">Select one option (affects pricing)</p>
        </div>
        <div className="p-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <label
              className={`flex items-start gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all ${
                disposalType === 'recyclable'
                  ? 'border-green-500 bg-green-50 shadow-md'
                  : 'border-slate-200 hover:border-green-300'
              }`}
            >
              <input
                type="radio"
                name="disposalType"
                value="recyclable"
                checked={disposalType === 'recyclable'}
                onChange={(e) => setDisposalType(e.target.value as any)}
                className="mt-1 w-5 h-5 text-green-600"
              />
              <div>
                <div className="font-semibold text-slate-900">♻️ Recyclable</div>
                <p className="text-xs text-slate-600 mt-1">Lower cost, eco-friendly</p>
              </div>
            </label>

            <label
              className={`flex items-start gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all ${
                disposalType === 'general'
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-slate-200 hover:border-blue-300'
              }`}
            >
              <input
                type="radio"
                name="disposalType"
                value="general"
                checked={disposalType === 'general'}
                onChange={(e) => setDisposalType(e.target.value as any)}
                className="mt-1 w-5 h-5 text-blue-600"
              />
              <div>
                <div className="font-semibold text-slate-900">🚮 General waste</div>
                <p className="text-xs text-slate-600 mt-1">Standard disposal</p>
              </div>
            </label>

            <label
              className={`flex items-start gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all ${
                disposalType === 'restricted'
                  ? 'border-orange-500 bg-orange-50 shadow-md'
                  : 'border-slate-200 hover:border-orange-300'
              }`}
            >
              <input
                type="radio"
                name="disposalType"
                value="restricted"
                checked={disposalType === 'restricted'}
                onChange={(e) => setDisposalType(e.target.value as any)}
                className="mt-1 w-5 h-5 text-orange-600"
              />
              <div>
                <div className="font-semibold text-slate-900">⚠️ Restricted items</div>
                <p className="text-xs text-slate-600 mt-1">Extra cost applies</p>
              </div>
            </label>

            <label
              className="flex items-start gap-4 p-5 rounded-xl border-2 border-red-300 bg-red-50 opacity-60 cursor-not-allowed"
            >
              <input
                type="radio"
                name="disposalType"
                value="hazardous"
                disabled
                className="mt-1 w-5 h-5"
              />
              <div>
                <div className="font-semibold text-red-900">❌ Hazardous</div>
                <p className="text-xs text-red-700 mt-1">Contact required</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* 🧾 SUMMARY (if items selected) */}
      {items.length > 0 && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-xl border-2 border-indigo-200 p-6">
          <h3 className="text-2xl font-bold text-indigo-900 mb-4">🧾 Your Clearance Summary</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 border border-indigo-200">
              <p className="text-xs text-slate-600 mb-1">Clearance type</p>
              <p className="text-lg font-bold text-slate-900">
                {items.some((i) => i.category === 'household') && '🏠 House'}
                {items.some((i) => i.category === 'garden') && ' 🌿 Garden'}
                {items.some((i) => i.category === 'builders') && ' 🧱 Builders'}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-indigo-200">
              <p className="text-xs text-slate-600 mb-1">Estimated load</p>
              <p className="text-lg font-bold text-slate-900">{vehicleSize}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-indigo-200">
              <p className="text-xs text-slate-600 mb-1">Waste type</p>
              <p className="text-lg font-bold text-slate-900 capitalize">{disposalType}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-indigo-200">
              <p className="text-xs text-slate-600 mb-1">Large items</p>
              <p className="text-lg font-bold text-slate-900">{largeItemsCount}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-indigo-200">
              <p className="text-xs text-slate-600 mb-1">Small items</p>
              <p className="text-lg font-bold text-slate-900">{smallItemsCount}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-indigo-200">
              <p className="text-xs text-slate-600 mb-1">Estimated loading time</p>
              <p className="text-lg font-bold text-slate-900">
                {Math.floor(estimatedLoadingTime / 60)}h {estimatedLoadingTime % 60}m
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-200">
        <button
          onClick={onBack}
          className="px-6 py-3 text-slate-600 hover:text-slate-900 font-medium transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={handleNext}
          disabled={items.length === 0}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all ${
            items.length === 0
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-xl'
          }`}
        >
          Continue
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
