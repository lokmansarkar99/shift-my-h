/**
 * Mixed Inventory - pentru Garage Clearance
 * Afișează mixed items (tools, storage, etc.)
 */

import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';

interface Props {
  activeCard: string;
  items: Record<string, number>; // { itemId: quantity }
  onUpdateItem: (itemId: string, quantity: number) => void;
}

// Mixed items per card (Garage specific)
const MIXED_ITEMS: Record<string, Array<{ id: string; name: string }>> = {
  tools: [
    { id: 'toolbox', name: 'Toolbox' },
    { id: 'power-tools', name: 'Power Tools' },
    { id: 'garden-tools', name: 'Garden Tools' },
    { id: 'ladder', name: 'Ladder' },
    { id: 'workbench', name: 'Workbench' },
  ],
  shelves: [
    { id: 'metal-shelving', name: 'Metal Shelving Unit' },
    { id: 'plastic-shelving', name: 'Plastic Shelving Unit' },
    { id: 'storage-cupboard-garage', name: 'Storage Cupboard' },
    { id: 'storage-boxes', name: 'Storage Boxes' },
  ],
  tyres: [
    { id: 'car-tyres', name: 'Car Tyres' },
    { id: 'bike-tyres', name: 'Bike/Motorcycle Tyres' },
    { id: 'car-parts', name: 'Car Parts' },
    { id: 'bike-parts', name: 'Bike Parts' },
  ],
  boxes: [
    { id: 'small-box-garage', name: 'Small Box' },
    { id: 'medium-box-garage', name: 'Medium Box' },
    { id: 'large-box-garage', name: 'Large Box' },
    { id: 'black-bag-garage', name: 'Black Bag' },
  ],
};

export function MixedInventoryCards({ activeCard, items, onUpdateItem }: Props) {
  const cardItems = MIXED_ITEMS[activeCard] || [];

  const handleAdd = (itemId: string) => {
    const currentQty = items[itemId] || 0;
    onUpdateItem(itemId, currentQty + 1);
  };

  const handleRemove = (itemId: string) => {
    const currentQty = items[itemId] || 0;
    if (currentQty > 0) {
      onUpdateItem(itemId, currentQty - 1);
    }
  };

  return (
    <div className="space-y-2">
      {cardItems.map((item) => {
        const quantity = items[item.id] || 0;
        const isSelected = quantity > 0;

        return (
          <div
            key={item.id}
            className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
              isSelected
                ? 'border-indigo-500 bg-indigo-50 shadow-md'
                : 'border-slate-200 bg-white hover:border-indigo-300'
            }`}
          >
            <div className="flex-1">
              <span className="font-medium text-slate-900">{item.name}</span>
            </div>

            {isSelected ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRemove(item.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-lg font-bold text-indigo-900 min-w-[2.5ch] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => handleAdd(item.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onUpdateItem(item.id, 0)}
                  className="ml-2 w-8 h-8 flex items-center justify-center rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleAdd(item.id)}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
              >
                Add
              </button>
            )}
          </div>
        );
      })}

      {cardItems.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          <p className="text-sm">No items available in this category</p>
        </div>
      )}
    </div>
  );
}
