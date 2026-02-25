import React from 'react';
import { Plus, Minus, Edit2, Package, Check } from 'lucide-react';

export interface SelectedItemWithDetails {
  id: string;
  name: string;
  quantity: number;
  details?: {
    width?: number;
    height?: number;
    depth?: number;
    dimensionUnit: 'cm' | 'inches';
    weight?: number;
    weightUnit: 'kg' | 'lb';
  };
}

interface InventoryCardGridProps {
  items: Array<{ id: string; name: string }>;
  selectedItems: SelectedItemWithDetails[];
  onAddItem: (id: string, name: string) => void;
  onRemoveItem: (id: string) => void;
  onIncreaseQuantity: (id: string) => void;
  onOpenModal: (id: string, name: string) => void;
}

export function InventoryCardGrid({
  items,
  selectedItems,
  onAddItem,
  onRemoveItem,
  onIncreaseQuantity,
  onOpenModal,
}: InventoryCardGridProps) {
  const getItemData = (itemId: string) => {
    return selectedItems.find(i => i.id === itemId);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {items.map(item => {
        const selectedItem = getItemData(item.id);
        const quantity = selectedItem?.quantity || 0;
        const hasDetails = selectedItem?.details && (
          selectedItem.details.width || 
          selectedItem.details.height || 
          selectedItem.details.depth || 
          selectedItem.details.weight
        );

        return (
          <div
            key={item.id}
            className={`bg-white border-2 rounded-xl p-4 transition-all ${
              quantity > 0
                ? 'border-blue-500 shadow-md'
                : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
            }`}
          >
            {/* Header with icon and name */}
            <div className="flex items-start gap-3 mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                quantity > 0 ? 'bg-blue-100' : 'bg-slate-100'
              }`}>
                <Package className={`w-5 h-5 ${quantity > 0 ? 'text-blue-600' : 'text-slate-500'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900 text-sm leading-tight">
                  {item.name}
                </h3>
                {hasDetails && (
                  <div className="flex items-center gap-1 mt-1">
                    <Check className="w-3 h-3 text-green-600" />
                    <span className="text-xs text-green-600 font-medium">Details added</span>
                  </div>
                )}
              </div>
            </div>

            {/* Controls */}
            {quantity === 0 ? (
              <button
                type="button"
                onClick={() => onAddItem(item.id, item.name)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            ) : (
              <div className="space-y-2">
                {/* Quantity Stepper */}
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    className="w-9 h-9 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center justify-center transition-all"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="flex-1 text-center">
                    <span className="text-lg font-bold text-slate-900">{quantity}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onIncreaseQuantity(item.id)}
                    className="w-9 h-9 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Edit Details Button */}
                <button
                  type="button"
                  onClick={() => onOpenModal(item.id, item.name)}
                  className="w-full border-2 border-slate-200 hover:border-blue-600 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-semibold py-2 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  {hasDetails ? 'Edit Details' : 'Add Details'}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}