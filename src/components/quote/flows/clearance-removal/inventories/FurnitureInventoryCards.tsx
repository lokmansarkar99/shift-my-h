/**
 * Furniture Inventory - pentru House/Flat/Office Clearance
 * Afișează furniture items cu categorii
 */

import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
}

interface Props {
  activeCard: string;
  items: Record<string, number>; // { itemId: quantity }
  onUpdateItem: (itemId: string, quantity: number) => void;
}

// Furniture items per card
const FURNITURE_ITEMS: Record<string, Array<{ id: string; name: string }>> = {
  living: [
    { id: 'sofa-3-seater', name: '3-Seater Sofa' },
    { id: 'sofa-2-seater', name: '2-Seater Sofa' },
    { id: 'armchair', name: 'Armchair' },
    { id: 'coffee-table', name: 'Coffee Table' },
    { id: 'tv-unit', name: 'TV Unit' },
    { id: 'bookshelf', name: 'Bookshelf' },
    { id: 'sideboard', name: 'Sideboard' },
    { id: 'rug', name: 'Rug (rolled)' },
  ],
  bedroom: [
    { id: 'double-bed', name: 'Double Bed Frame' },
    { id: 'single-bed', name: 'Single Bed Frame' },
    { id: 'mattress-double', name: 'Double Mattress' },
    { id: 'mattress-single', name: 'Single Mattress' },
    { id: 'wardrobe-2door', name: '2-Door Wardrobe' },
    { id: 'wardrobe-3door', name: '3-Door Wardrobe' },
    { id: 'chest-drawers', name: 'Chest of Drawers' },
    { id: 'bedside-table', name: 'Bedside Table' },
    { id: 'dressing-table', name: 'Dressing Table' },
  ],
  kitchen: [
    { id: 'dining-table-4', name: 'Dining Table (4-seater)' },
    { id: 'dining-table-6', name: 'Dining Table (6-seater)' },
    { id: 'dining-chair', name: 'Dining Chair' },
    { id: 'kitchen-unit', name: 'Kitchen Unit' },
    { id: 'kitchen-cupboard', name: 'Kitchen Cupboard' },
  ],
  appliances: [
    { id: 'fridge', name: 'Fridge' },
    { id: 'fridge-freezer', name: 'Fridge-Freezer' },
    { id: 'washing-machine', name: 'Washing Machine' },
    { id: 'tumble-dryer', name: 'Tumble Dryer' },
    { id: 'dishwasher', name: 'Dishwasher' },
    { id: 'cooker', name: 'Cooker/Oven' },
    { id: 'microwave', name: 'Microwave' },
    { id: 'tv', name: 'TV' },
  ],
  boxes: [
    { id: 'small-box', name: 'Small Box' },
    { id: 'medium-box', name: 'Medium Box' },
    { id: 'large-box', name: 'Large Box' },
    { id: 'black-bag', name: 'Black Bag' },
  ],
  // Office specific
  desks: [
    { id: 'office-desk', name: 'Office Desk' },
    { id: 'office-chair', name: 'Office Chair' },
    { id: 'meeting-table', name: 'Meeting Table' },
    { id: 'visitor-chair', name: 'Visitor Chair' },
  ],
  storage: [
    { id: 'filing-cabinet-2', name: '2-Drawer Filing Cabinet' },
    { id: 'filing-cabinet-4', name: '4-Drawer Filing Cabinet' },
    { id: 'bookshelf-office', name: 'Bookshelf' },
    { id: 'storage-cupboard', name: 'Storage Cupboard' },
  ],
  electronics: [
    { id: 'computer', name: 'Computer/Monitor' },
    { id: 'printer', name: 'Printer' },
    { id: 'phone-system', name: 'Phone System' },
    { id: 'server-rack', name: 'Server Rack (small)' },
  ],
};

export function FurnitureInventoryCards({ activeCard, items, onUpdateItem }: Props) {
  const cardItems = FURNITURE_ITEMS[activeCard] || [];

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
                ? 'border-orange-500 bg-orange-50 shadow-md'
                : 'border-slate-200 bg-white hover:border-orange-300'
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
                <span className="text-lg font-bold text-orange-900 min-w-[2.5ch] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => handleAdd(item.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition-colors"
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
                className="px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-lg hover:from-orange-700 hover:to-red-700 transition-all shadow-md hover:shadow-lg"
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
