import React from 'react';
import { Plus, Minus, Check } from 'lucide-react';

export interface SelectedItem {
  id: string;
  name: string;
  quantity: number;
}

interface InventoryListProps {
  items: Array<{ id: string; name: string }>;
  selectedItems: SelectedItem[];
  onAddItem: (id: string, name: string) => void;
  onRemoveItem: (id: string) => void;
  onIncreaseQuantity: (id: string) => void;
}

export function InventoryList({
  items,
  selectedItems,
  onAddItem,
  onRemoveItem,
  onIncreaseQuantity,
}: InventoryListProps) {
  const getItemQuantity = (itemId: string) => {
    return selectedItems.find(i => i.id === itemId)?.quantity || 0;
  };

  return (
    <div className="space-y-2">
      {items.map(item => {
        const quantity = getItemQuantity(item.id);
        const isSelected = quantity > 0;

        return (
          <div
            key={item.id}
            className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
              isSelected
                ? 'bg-blue-50 border-blue-200'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            {/* Item name */}
            <div className="flex items-center gap-3 flex-1">
              {isSelected && (
                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
              <span className={`font-medium ${isSelected ? 'text-blue-900' : 'text-slate-900'}`}>
                {item.name}
              </span>
            </div>

            {/* Add/Quantity controls */}
            <div className="flex items-center gap-2">
              {quantity === 0 ? (
                <button
                  type="button"
                  onClick={() => onAddItem(item.id, item.name)}
                  className="w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    className="w-8 h-8 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-full flex items-center justify-center transition-all"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-bold text-blue-900">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => onIncreaseQuantity(item.id)}
                    className="w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
