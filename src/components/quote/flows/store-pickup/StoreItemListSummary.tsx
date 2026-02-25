/**
 * Store/Pickup - Shared Item List Summary Component
 * Display selected items with categories
 */

import React from 'react';
import { Package } from 'lucide-react';

interface Item {
  name: string;
  quantity: number;
  volume: number;
}

interface ItemListSummaryProps {
  items: Item[];
  totalVolume: number;
}

export function StoreItemListSummary({ items, totalVolume }: ItemListSummaryProps) {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Group items by category
  const categories = {
    'Living Room': ['Sofa', 'Armchair', 'Coffee table', 'TV stand', 'Bookshelf', 'Rug'],
    'Bedroom': ['Bed (single)', 'Bed (double)', 'Bed (king)', 'Wardrobe', 'Chest of drawers', 'Nightstand', 'Mattress (single)', 'Mattress (double)', 'Mattress (king)'],
    'Dining Room': ['Dining table', 'Dining chair', 'Sideboard'],
    'Kitchen': ['Fridge', 'Washing machine', 'Dishwasher', 'Microwave', 'Kitchen cart'],
    'Home Office': ['Desk', 'Office chair', 'Filing cabinet'],
    'Outdoor': ['Garden chair', 'BBQ grill', 'Bicycle'],
    'Other': ['Box (small)', 'Box (medium)', 'Box (large)', 'Lamp', 'Mirror', 'Suitcase', 'Sports equipment']
  };

  const groupedItems: { [category: string]: Item[] } = {};
  
  items.forEach(item => {
    let categoryFound = false;
    for (const [category, categoryItems] of Object.entries(categories)) {
      if (categoryItems.includes(item.name)) {
        if (!groupedItems[category]) {
          groupedItems[category] = [];
        }
        groupedItems[category].push(item);
        categoryFound = true;
        break;
      }
    }
    if (!categoryFound) {
      if (!groupedItems['Other']) {
        groupedItems['Other'] = [];
      }
      groupedItems['Other'].push(item);
    }
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
        <Package className="w-5 h-5 text-blue-600" />
        Your Items
      </h3>

      {/* Summary Stats */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 mb-4 border border-blue-200">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-blue-700 font-medium mb-0.5">Total Items</p>
            <p className="text-2xl font-black text-blue-900">{totalItems}</p>
          </div>
          <div>
            <p className="text-xs text-blue-700 font-medium mb-0.5">Total Volume</p>
            <p className="text-2xl font-black text-blue-900">{totalVolume.toFixed(2)} m³</p>
          </div>
        </div>
      </div>

      {/* Items by Category */}
      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {Object.entries(groupedItems).map(([category, categoryItems]) => (
          <div key={category}>
            <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-600"></div>
              {category}
            </h4>
            <div className="space-y-2 ml-4">
              {categoryItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <span className="text-slate-700">{item.name}</span>
                  <span className="font-semibold text-slate-900">×{item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
