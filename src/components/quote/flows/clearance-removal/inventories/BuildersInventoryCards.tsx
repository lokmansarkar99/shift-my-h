/**
 * Builders Inventory - pentru Builders Waste
 * Afișează construction waste items
 */

import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';

interface Props {
  activeCard: string;
  items: Record<string, number>; // { itemId: quantity }
  onUpdateItem: (itemId: string, quantity: number) => void;
}

// Builders waste items per card
const BUILDERS_ITEMS: Record<string, Array<{ id: string; name: string }>> = {
  rubble: [
    { id: 'bricks-loose', name: 'Loose Bricks' },
    { id: 'concrete-rubble', name: 'Concrete Rubble' },
    { id: 'blocks', name: 'Blocks' },
    { id: 'hardcore', name: 'Hardcore' },
    { id: 'rubble-bag-builders', name: 'Rubble (bag)' },
  ],
  timber: [
    { id: 'timber-offcuts', name: 'Timber Offcuts' },
    { id: 'floorboards', name: 'Floorboards' },
    { id: 'joists', name: 'Joists' },
    { id: 'plywood-sheets', name: 'Plywood Sheets' },
    { id: 'mdf-sheets', name: 'MDF Sheets' },
  ],
  plasterboard: [
    { id: 'plasterboard-sheets', name: 'Plasterboard Sheets' },
    { id: 'plasterboard-offcuts', name: 'Plasterboard Offcuts' },
    { id: 'ceiling-tiles', name: 'Ceiling Tiles' },
  ],
  tiles: [
    { id: 'floor-tiles', name: 'Floor Tiles' },
    { id: 'wall-tiles', name: 'Wall Tiles' },
    { id: 'slate-tiles', name: 'Slate/Roof Tiles' },
  ],
  'mixed-bags': [
    { id: 'mixed-builders-bag', name: 'Mixed Builders Waste (bag)' },
    { id: 'insulation-bag', name: 'Insulation (bag)' },
    { id: 'packaging-bag', name: 'Packaging (bag)' },
  ],
};

export function BuildersInventoryCards({ activeCard, items, onUpdateItem }: Props) {
  const cardItems = BUILDERS_ITEMS[activeCard] || [];

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
                ? 'border-amber-500 bg-amber-50 shadow-md'
                : 'border-slate-200 bg-white hover:border-amber-300'
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
                <span className="text-lg font-bold text-amber-900 min-w-[2.5ch] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => handleAdd(item.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition-colors"
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
                className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all shadow-md hover:shadow-lg"
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
