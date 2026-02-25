/**
 * Waste Inventory - pentru Garden/Junk Removal
 * Afișează waste items simple cu quantity
 */

import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';

interface Props {
  activeCard: string;
  items: Record<string, number>; // { itemId: quantity }
  onUpdateItem: (itemId: string, quantity: number) => void;
}

// Waste items per card
const WASTE_ITEMS: Record<string, Array<{ id: string; name: string }>> = {
  bags: [
    { id: 'black-bag', name: 'Black Bag' },
    { id: 'rubble-bag', name: 'Rubble Bag' },
    { id: 'garden-bag', name: 'Garden Waste Bag' },
  ],
  bulky: [
    { id: 'mattress', name: 'Mattress' },
    { id: 'old-sofa', name: 'Old Sofa' },
    { id: 'old-armchair', name: 'Old Armchair' },
    { id: 'old-table', name: 'Old Table' },
    { id: 'old-carpet', name: 'Old Carpet (rolled)' },
    { id: 'old-wardrobe', name: 'Old Wardrobe' },
  ],
  'green-waste': [
    { id: 'branches-bundle', name: 'Branches (bundle)' },
    { id: 'grass-cuttings-bag', name: 'Grass Cuttings (bag)' },
    { id: 'leaves-bag', name: 'Leaves (bag)' },
    { id: 'hedge-trimmings-bag', name: 'Hedge Trimmings (bag)' },
    { id: 'small-tree', name: 'Small Tree/Shrub' },
  ],
  soil: [
    { id: 'soil-bag', name: 'Soil (bag)' },
    { id: 'turf-roll', name: 'Turf (roll)' },
    { id: 'paving-slabs', name: 'Paving Slabs' },
    { id: 'rubble-small', name: 'Rubble (small amount)' },
  ],
  mixed: [
    { id: 'general-junk-small', name: 'General Junk (small items)' },
    { id: 'general-junk-medium', name: 'General Junk (medium items)' },
    { id: 'general-junk-large', name: 'General Junk (large items)' },
    { id: 'mixed-waste-bag', name: 'Mixed Waste (bag)' },
  ],
  'wood-metal': [
    { id: 'timber-small', name: 'Timber (small pieces)' },
    { id: 'timber-large', name: 'Timber (large pieces)' },
    { id: 'metal-scrap-small', name: 'Metal Scrap (small)' },
    { id: 'old-fence-panel', name: 'Old Fence Panel' },
  ],
};

export function WasteInventoryCards({ activeCard, items, onUpdateItem }: Props) {
  const cardItems = WASTE_ITEMS[activeCard] || [];

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
                ? 'border-green-500 bg-green-50 shadow-md'
                : 'border-slate-200 bg-white hover:border-green-300'
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
                <span className="text-lg font-bold text-green-900 min-w-[2.5ch] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => handleAdd(item.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
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
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
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
