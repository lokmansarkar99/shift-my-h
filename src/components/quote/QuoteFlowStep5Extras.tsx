import React, { useState } from 'react';
import { Package, Plus, Minus, Info, ShoppingCart, Shield, Clock } from 'lucide-react';
import { getActiveExtras, formatExtraPrice, ExtraServiceItem } from '../../utils/extrasCatalogService';

interface SelectedExtra {
  id: string;
  quantity: number;
}

interface QuoteFlowStep5Props {
  onContinue: (data: {
    selectedExtras: SelectedExtra[];
  }) => void;
  onBack: () => void;
  initialData?: {
    selectedExtras?: SelectedExtra[];
  };
}

export function QuoteFlowStep5Extras({ onContinue, onBack, initialData }: QuoteFlowStep5Props) {
  const [selectedExtras, setSelectedExtras] = useState<SelectedExtra[]>(
    initialData?.selectedExtras || []
  );

  const extras = getActiveExtras();

  // Group extras by category
  const categories = Array.from(new Set(extras.map(e => e.category)));

  const handleToggleExtra = (extraId: string) => {
    const extra = extras.find(e => e.id === extraId);
    if (!extra) return;

    const isSelected = selectedExtras.some(e => e.id === extraId);

    if (isSelected) {
      // Remove
      setSelectedExtras(prev => prev.filter(e => e.id !== extraId));
    } else {
      // Add with default quantity
      const defaultQty = extra.pricingMode === 'per_unit' ? 1 : 1;
      setSelectedExtras(prev => [...prev, { id: extraId, quantity: defaultQty }]);
    }
  };

  const handleUpdateQuantity = (extraId: string, delta: number) => {
    setSelectedExtras(prev =>
      prev.map(e => {
        if (e.id === extraId) {
          const newQty = Math.max(1, e.quantity + delta);
          return { ...e, quantity: newQty };
        }
        return e;
      })
    );
  };

  const handleContinue = () => {
    onContinue({
      selectedExtras,
    });
  };

  const categoryIcons: Record<string, any> = {
    'Packing Materials': Package,
    'Additional Services': ShoppingCart,
    'Insurance & Protection': Shield,
    'Fees': Clock,
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-3">Additional Services & Materials</h2>
        <p className="text-slate-600 text-lg">
          Enhance your move with packing materials, insurance, and premium services
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-900">
          <p className="font-semibold mb-1">💡 Optional extras to make your move easier</p>
          <p className="text-blue-800">
            All extras are optional. Select only what you need - you can always add more later.
          </p>
        </div>
      </div>

      {/* Extras by Category */}
      {categories.map(category => {
        const categoryExtras = extras.filter(e => e.category === category);
        const CategoryIcon = categoryIcons[category] || Package;

        // Don't show percentage-based fees in customer flow (they're applied automatically)
        const visibleExtras = categoryExtras.filter(e => e.pricingMode !== 'percentage_of_booking');

        if (visibleExtras.length === 0) return null;

        return (
          <div key={category} className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            {/* Category Header */}
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <CategoryIcon className="w-5 h-5 text-indigo-600" />
                {category}
              </h3>
            </div>

            {/* Extras List */}
            <div className="p-4 space-y-3">
              {visibleExtras.map(extra => {
                const isSelected = selectedExtras.some(e => e.id === extra.id);
                const selectedExtra = selectedExtras.find(e => e.id === extra.id);
                const quantity = selectedExtra?.quantity || 1;

                return (
                  <div
                    key={extra.id}
                    className={`
                      p-4 rounded-xl border-2 transition-all duration-200
                      ${isSelected
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-slate-200 bg-white hover:border-indigo-300'
                      }
                    `}
                  >
                    <div className="flex items-start gap-4">
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleExtra(extra.id)}
                        className="mt-1 w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className={`font-bold ${isSelected ? 'text-indigo-900' : 'text-slate-900'}`}>
                              {extra.name}
                            </h4>
                            <p className={`text-sm mt-1 ${isSelected ? 'text-indigo-700' : 'text-slate-600'}`}>
                              {extra.description}
                            </p>
                          </div>

                          {/* Price */}
                          <div className="text-right shrink-0">
                            <div className={`font-bold text-lg ${isSelected ? 'text-indigo-900' : 'text-slate-900'}`}>
                              {formatExtraPrice(extra)}
                            </div>
                            {extra.pricingMode === 'per_unit' && extra.unit_label && (
                              <div className="text-xs text-slate-500 mt-0.5">
                                per {extra.unit_label}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Quantity Selector (for per_unit items) */}
                        {isSelected && extra.pricingMode === 'per_unit' && (
                          <div className="mt-3 flex items-center gap-3">
                            <span className="text-sm font-semibold text-slate-700">Quantity:</span>
                            <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-lg">
                              <button
                                onClick={() => handleUpdateQuantity(extra.id, -1)}
                                disabled={quantity <= 1}
                                className="p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-lg transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <div className="px-4 font-bold text-slate-900 min-w-[3rem] text-center">
                                {quantity}
                              </div>
                              <button
                                onClick={() => handleUpdateQuantity(extra.id, 1)}
                                className="p-2 text-slate-600 hover:bg-slate-50 rounded-r-lg transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="text-sm text-slate-600">
                              = <span className="font-bold text-indigo-600">£{(extra.basePrice * quantity).toFixed(2)}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Selected Summary */}
      {selectedExtras.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
          <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Selected Extras ({selectedExtras.length})
          </h3>
          <div className="space-y-2">
            {selectedExtras.map(selected => {
              const extra = extras.find(e => e.id === selected.id);
              if (!extra) return null;

              const itemTotal = extra.pricingMode === 'per_unit'
                ? extra.basePrice * selected.quantity
                : extra.basePrice;

              return (
                <div key={selected.id} className="flex items-center justify-between text-sm">
                  <div className="text-green-900">
                    <span className="font-semibold">{extra.name}</span>
                    {extra.pricingMode === 'per_unit' && selected.quantity > 1 && (
                      <span className="text-green-700 ml-2">× {selected.quantity}</span>
                    )}
                  </div>
                  <div className="font-bold text-green-900">
                    £{itemTotal.toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 pt-3 border-t border-green-200 flex items-center justify-between">
            <div className="font-bold text-green-900">Extras Subtotal:</div>
            <div className="font-bold text-xl text-green-900">
              £{selectedExtras.reduce((sum, selected) => {
                const extra = extras.find(e => e.id === selected.id);
                if (!extra) return sum;
                const itemTotal = extra.pricingMode === 'per_unit'
                  ? extra.basePrice * selected.quantity
                  : extra.basePrice;
                return sum + itemTotal;
              }, 0).toFixed(2)}
            </div>
          </div>
        </div>
      )}

      {/* Skip Option */}
      {selectedExtras.length === 0 && (
        <div className="text-center py-6">
          <p className="text-slate-600 mb-3">Don't need any extras? That's fine!</p>
          <button
            onClick={handleContinue}
            className="text-indigo-600 font-semibold hover:underline"
          >
            Skip and continue to quote →
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all"
        >
          ← Back
        </button>
        <button
          onClick={handleContinue}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:from-indigo-700 hover:to-blue-700 transition-all"
        >
          Get My Quote →
        </button>
      </div>
    </div>
  );
}
