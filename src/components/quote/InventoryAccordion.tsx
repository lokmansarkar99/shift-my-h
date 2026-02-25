import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { SelectedItem } from './InventoryList';
import { INVENTORY_CATEGORIES, INVENTORY_ITEMS } from './InventoryCatalog';

interface InventoryAccordionProps {
  selectedItems: SelectedItem[];
}

export function InventoryAccordion({ selectedItems }: InventoryAccordionProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Group items by category
  const itemsByCategory = selectedItems.reduce((acc, item) => {
    const catalogItem = INVENTORY_ITEMS.find(i => i.id === item.id);
    const category = catalogItem?.category || 'other';
    
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, SelectedItem[]>);

  // Get category name
  const getCategoryName = (categoryId: string) => {
    const category = INVENTORY_CATEGORIES.find(c => c.id === categoryId);
    return category?.name || categoryId;
  };

  // Get total items in category
  const getCategoryTotal = (categoryId: string) => {
    const items = itemsByCategory[categoryId] || [];
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  // Toggle category
  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const totalItems = selectedItems.reduce((sum, item) => sum + item.quantity, 0);

  if (selectedItems.length === 0) {
    return <p className="text-sm text-slate-500">No items added yet</p>;
  }

  return (
    <div className="space-y-2">
      {/* Total Summary */}
      <div className="text-sm font-semibold text-slate-700 mb-3">
        Total: {totalItems} items
      </div>

      {/* Category Accordions */}
      {Object.keys(itemsByCategory).map(categoryId => {
        const items = itemsByCategory[categoryId];
        const isExpanded = expandedCategories.has(categoryId);
        const categoryTotal = getCategoryTotal(categoryId);

        return (
          <div key={categoryId} className="border border-slate-200 rounded-lg overflow-hidden">
            {/* Category Header */}
            <button
              onClick={() => toggleCategory(categoryId)}
              className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-900">
                  {getCategoryName(categoryId)}
                </span>
                <span className="text-xs text-slate-600">
                  ({categoryTotal} {categoryTotal === 1 ? 'item' : 'items'})
                </span>
              </div>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-slate-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-500" />
              )}
            </button>

            {/* Category Items */}
            {isExpanded && (
              <div className="p-2 bg-white space-y-1">
                {items.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-sm py-1.5 px-2 rounded hover:bg-slate-50"
                  >
                    <span className="text-slate-700">{item.name}</span>
                    <span className="text-slate-600 font-semibold">×{item.quantity}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
