/**
 * House Move - Step 2: Inventory Selection
 * UNIQUE DESIGN - ShiftMyHome Custom Style
 */

import React, { useState, useMemo } from 'react';
import { HouseMoveQuote } from './houseMoveTypes';
import { ArrowRight, ArrowLeft, Plus, Minus, MapPin, Info, Edit3, Home, Package2, ChevronDown, ChevronUp, X, Search, Package } from 'lucide-react';
import { INVENTORY_METADATA } from '../../../../utils/pricingEngine';
import { HouseMoveMapPanel } from './HouseMoveMapPanel';
import { MoveSummaryCard } from '../../MoveSummaryCard';
import { INVENTORY_ITEMS } from '../../../../utils/inventoryData';

interface StepProps {
  data: HouseMoveQuote;
  onChange: (updates: Partial<HouseMoveQuote>) => void;
  onNext: () => void;
  onBack: () => void;
}

interface SelectedItem {
  id: string;
  quantity: number;
  dimensions?: { width: number; height: number; depth: number };
  weight?: number;
}

interface ItemDetailsModal {
  itemId: string;
  itemName: string;
}

interface CustomItemModal {
  isOpen: boolean;
  itemName: string;
}

// Categories with custom icons - map to centralized inventory
const CATEGORIES = [
  { id: 'bedrooms', name: 'Bedroom Furniture', emoji: '🛏️', color: 'from-purple-500 to-pink-500' },
  { id: 'living', name: 'Living Room', emoji: '🛋️', color: 'from-blue-500 to-cyan-500' },
  { id: 'kitchen', name: 'Kitchen & Appliances', emoji: '🍳', color: 'from-orange-500 to-red-500' },
  { id: 'bathroom', name: 'Bathroom Items', emoji: '🚿', color: 'from-teal-500 to-green-500' },
  { id: 'boxes', name: 'Boxes & Storage', emoji: '📦', color: 'from-amber-500 to-yellow-500' },
  { id: 'garden', name: 'Garden & Outdoor', emoji: '🌿', color: 'from-green-500 to-lime-500' },
  { id: 'office', name: 'Office & Study', emoji: '💼', color: 'from-indigo-500 to-blue-500' },
  { id: 'electronics', name: 'Electronics', emoji: '📺', color: 'from-sky-500 to-blue-500' },
  { id: 'garage', name: 'Garage & DIY', emoji: '🔧', color: 'from-orange-500 to-amber-500' },
  { id: 'children', name: 'Children\'s items', emoji: '👶', color: 'from-pink-500 to-rose-500' },
  { id: 'sports', name: 'Sports & Hobbies', emoji: '⚽', color: 'from-rose-500 to-red-500' },
];

// Use centralized inventory from inventoryData.ts
const ALL_ITEMS_LIBRARY = INVENTORY_ITEMS.map((item) => ({
  id: item.id,
  name: item.name,
  category: item.category,
  volume: item.volume,
}));

export function Step2Inventory({ data, onChange, onNext, onBack }: StepProps) {
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>(
    data.items?.map(item => ({ id: item.id, quantity: item.quantity })) || []
  );
  const [activeCategory, setActiveCategory] = useState<string>('bedrooms');
  const [expandedLocation, setExpandedLocation] = useState(false);
  const [expandedInventory, setExpandedInventory] = useState(false);
  const [itemDetailsModal, setItemDetailsModal] = useState<ItemDetailsModal | null>(null);
  const [modalDimensions, setModalDimensions] = useState({ width: 0, height: 0, depth: 0 });
  const [modalWeight, setModalWeight] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [customItemModal, setCustomItemModal] = useState<CustomItemModal>({ isOpen: false, itemName: '' });

  // Calculate totals
  const totalItems = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalVolume = selectedItems.reduce((sum, item) => {
    const itemData = ALL_ITEMS_LIBRARY.find(i => i.id === item.id);
    return sum + (itemData ? itemData.volume * item.quantity : 0);
  }, 0);

  const addItem = (itemId: string) => {
    const existing = selectedItems.find(i => i.id === itemId);
    const updated = existing
      ? selectedItems.map(i => i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i)
      : [...selectedItems, { id: itemId, quantity: 1 }];
    
    setSelectedItems(updated);
    updateParent(updated);
  };

  const removeItem = (itemId: string) => {
    const existing = selectedItems.find(i => i.id === itemId);
    if (!existing) return;

    const updated = existing.quantity > 1
      ? selectedItems.map(i => i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i)
      : selectedItems.filter(i => i.id !== itemId);
    
    setSelectedItems(updated);
    updateParent(updated);
  };

  const updateParent = (items: SelectedItem[]) => {
    onChange({
      items: items.map(item => {
        const itemData = ALL_ITEMS_LIBRARY.find(i => i.id === item.id);
        return {
          id: item.id,
          name: itemData?.name || item.id,
          quantity: item.quantity,
          volume: itemData?.volume || 0.1,
        };
      }),
    });
  };

  const openItemDetails = (itemId: string) => {
    const itemData = ALL_ITEMS_LIBRARY.find(i => i.id === itemId);
    if (itemData) {
      setItemDetailsModal({ itemId, itemName: itemData.name });
      setModalDimensions({ width: 0, height: 0, depth: 0 });
      setModalWeight(0);
    }
  };

  const submitItemDetails = () => {
    if (itemDetailsModal) {
      const updated = selectedItems.map(item =>
        item.id === itemDetailsModal.itemId
          ? { ...item, dimensions: modalDimensions, weight: modalWeight }
          : item
      );
      setSelectedItems(updated);
      updateParent(updated);
      setItemDetailsModal(null);
    }
  };

  // Group items by category
  const itemsByCategory = useMemo(() => {
    const grouped: Record<string, typeof ALL_ITEMS_LIBRARY> = {};
    CATEGORIES.forEach(cat => {
      grouped[cat.id] = ALL_ITEMS_LIBRARY.filter(item => item.category === cat.id);
    });
    return grouped;
  }, []);

  // Filter items based on search query
  const filteredItemsForCategory = useMemo(() => {
    if (!searchQuery.trim()) {
      return itemsByCategory[activeCategory] || [];
    }
    
    // Search across ALL items when search is active
    const allItems = ALL_ITEMS_LIBRARY.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    return allItems;
  }, [searchQuery, activeCategory, itemsByCategory]);

  const selectedByCategory = useMemo(() => {
    const grouped: Record<string, SelectedItem[]> = {};
    selectedItems.forEach(item => {
      const itemData = ALL_ITEMS_LIBRARY.find(i => i.id === item.id);
      if (itemData) {
        if (!grouped[itemData.category]) grouped[itemData.category] = [];
        grouped[itemData.category].push(item);
      }
    });
    return grouped;
  }, [selectedItems]);

  return (
    <>
      <div className="space-y-6">
        {/* 2 Column Layout - 60/40 split - SAME AS STEP 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-6 lg:gap-8">
          {/* LEFT COLUMN - Main Content (60%) */}
          <div className="space-y-6 order-last lg:order-first">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:p-8">
              {/* Service Header with Icon */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Package2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">
                    Select Your Items
                  </h1>
                  <p className="text-sm text-slate-600">Choose the items you're moving from each room category</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Categories Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {CATEGORIES.map((category) => {
                    const count = selectedByCategory[category.id]?.reduce((sum, item) => sum + item.quantity, 0) || 0;
                    const isActive = activeCategory === category.id;
                    
                    return (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`p-4 rounded-xl border-2 transition-all text-left relative overflow-hidden group ${
                          isActive
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-slate-200 hover:border-blue-300 hover:shadow-sm'
                        }`}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
                        <div className="relative">
                          <span className="text-2xl block mb-2">{category.emoji}</span>
                          <div className={`font-semibold text-sm ${isActive ? 'text-blue-900' : 'text-slate-700'}`}>
                            {category.name}
                          </div>
                          {count > 0 && (
                            <div className="text-xs text-blue-600 font-bold mt-1">
                              {count} {count === 1 ? 'item' : 'items'}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                  
                  {/* Add Custom Item Card */}
                  <button
                    onClick={() => setCustomItemModal({ isOpen: true, itemName: '' })}
                    className="p-4 rounded-xl border-2 border-dashed border-blue-400 transition-all text-left relative overflow-hidden group hover:border-blue-600 hover:shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50"
                  >
                    <div className="relative">
                      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 mb-2">
                        <Plus className="w-6 h-6 text-white" />
                      </div>
                      <div className="font-semibold text-sm text-blue-900">
                        Add Custom Item
                      </div>
                      <div className="text-xs text-blue-600 mt-1">
                        Can't find it?
                      </div>
                    </div>
                  </button>
                </div>

                {/* Search Bar */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for more items across all categories..."
                      className="w-full pl-10 pr-10 py-3 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all bg-white"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <Package2 className="w-4 h-4 text-slate-400" />
                    </div>
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded transition-colors"
                      >
                        <X className="w-4 h-4 text-slate-400" />
                      </button>
                    )}
                  </div>
                  {searchQuery && (
                    <div className="mt-2 text-xs text-slate-600">
                      Showing {filteredItemsForCategory.length} result{filteredItemsForCategory.length !== 1 ? 's' : ''} for "{searchQuery}"
                    </div>
                  )}
                </div>

                {/* Current Category Header */}
                <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
                  <span className="text-3xl">
                    {CATEGORIES.find(c => c.id === activeCategory)?.emoji}
                  </span>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {CATEGORIES.find(c => c.id === activeCategory)?.name}
                    </h2>
                    <p className="text-sm text-slate-600">
                      {filteredItemsForCategory.length} items available {searchQuery && `(filtered from search)`}
                    </p>
                  </div>
                </div>

                {/* Items Grid */}
                <div className="grid md:grid-cols-2 gap-4">
                  {filteredItemsForCategory.map((item) => {
                    const selected = selectedItems.find(i => i.id === item.id);
                    return (
                      <div
                        key={item.id}
                        className={`bg-white rounded-xl border-2 p-4 transition-all group ${
                          selected
                            ? 'border-emerald-500 shadow-md'
                            : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex-1">
                            <div className="font-semibold text-slate-900">{item.name}</div>
                            <div className="text-xs text-slate-500 mt-1">
                              Volume: {item.volume.toFixed(2)} m³
                            </div>
                          </div>
                          {selected && (
                            <button
                              onClick={() => openItemDetails(item.id)}
                              className="p-2 hover:bg-blue-50 rounded-lg transition-all opacity-70 hover:opacity-100 md:opacity-0 md:group-hover:opacity-100"
                              title="Edit item details"
                            >
                              <Edit3 className="w-4 h-4 text-blue-600" />
                            </button>
                          )}
                        </div>

                        {selected ? (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => removeItem(item.id)}
                                className="w-9 h-9 rounded-lg bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors"
                              >
                                <Minus className="w-4 h-4 text-red-700" />
                              </button>
                              <span className="w-12 text-center font-bold text-lg text-slate-900">
                                {selected.quantity}
                              </span>
                              <button
                                onClick={() => addItem(item.id)}
                                className="w-9 h-9 rounded-lg bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center transition-colors"
                              >
                                <Plus className="w-4 h-4 text-white" />
                              </button>
                            </div>
                            <div className="text-xs text-slate-500">
                              {selected.dimensions && selected.weight && (
                                <span className="text-emerald-600 font-semibold">✓ Details added</span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => addItem(item.id)}
                            className="w-full py-2 bg-slate-100 hover:bg-emerald-500 text-slate-600 hover:text-white rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Add to Move
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Navigation */}
                <div className="flex justify-between pt-6 border-t border-slate-200">
                  <button
                    onClick={onBack}
                    className="flex items-center gap-2 px-6 py-3 text-slate-700 font-semibold hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Previous Step
                  </button>
                  <button
                    onClick={onNext}
                    disabled={selectedItems.length === 0}
                    className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Get a Quote
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - MAP + SUMMARY (40%) - SAME AS STEP 1 */}
          <div className="space-y-6 lg:sticky lg:top-4 lg:self-start order-first lg:order-last">
            {/* Quote Reference - SAME AS STEP 1 */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl shadow-sm border border-blue-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-600 font-medium mb-1">Quote ref:</p>
                  <p className="text-xl font-bold text-slate-900">
                    {data.quoteReference || 'SMH-' + Date.now().toString().slice(-6)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Map */}
            <HouseMoveMapPanel data={data} />

            {/* Summary Card */}
            <MoveSummaryCard
              quoteRef={data.quoteReference || 'SMH-' + Date.now().toString().slice(-6)}
              pickupAddress={data.pickup?.address || ''}
              deliveryAddress={data.dropoff?.address || ''}
              pickupPropertyType={data.pickup?.propertyType || ''}
              deliveryPropertyType={data.dropoff?.propertyType || ''}
              pickupFloor={data.pickup?.floor ? (data.pickup.floor === 0 ? 'Ground floor' : `${data.pickup.floor}`) : 'Ground floor'}
              deliveryFloor={data.dropoff?.floor ? (data.dropoff.floor === 0 ? 'Ground floor' : `${data.dropoff.floor}`) : 'Ground floor'}
              liftAvailableAtPickup={data.pickup?.hasLift || false}
              liftAvailableAtDelivery={data.dropoff?.hasLift || false}
              distance={data.distance}
              duration={data.duration}
              moveDate={data.date ? new Date(data.date).toISOString().split('T')[0] : undefined}
              hasDateSelected={!!data.date}
              arrivalTimeFrom={480}
              arrivalTimeTo={600}
              selectedItems={selectedItems.map(item => {
                const itemData = ALL_ITEMS_LIBRARY.find(i => i.id === item.id);
                return {
                  id: item.id,
                  name: itemData?.name || item.id,
                  quantity: item.quantity,
                  volume: itemData?.volume || 0.1,
                };
              })}
            />
          </div>
        </div>
      </div>

      {/* Item Details Modal */}
      {itemDetailsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">
                  Tell us more about your {itemDetailsModal.itemName}
                </h3>
                <button
                  onClick={() => setItemDetailsModal(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Estimated Dimensions
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Width</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={modalDimensions.width || ''}
                        onChange={(e) => setModalDimensions({ ...modalDimensions, width: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                        placeholder="0"
                      />
                      <span className="absolute right-3 top-2 text-xs text-slate-400">cm</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Height</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={modalDimensions.height || ''}
                        onChange={(e) => setModalDimensions({ ...modalDimensions, height: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                        placeholder="0"
                      />
                      <span className="absolute right-3 top-2 text-xs text-slate-400">cm</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Depth</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={modalDimensions.depth || ''}
                        onChange={(e) => setModalDimensions({ ...modalDimensions, depth: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                        placeholder="0"
                      />
                      <span className="absolute right-3 top-2 text-xs text-slate-400">cm</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Estimated Weight
                </label>
                <p className="text-xs text-slate-500 mb-3">
                  If unsure, use your own weight to help you estimate.
                </p>
                <div className="relative">
                  <input
                    type="number"
                    value={modalWeight || ''}
                    onChange={(e) => setModalWeight(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                    placeholder="0"
                  />
                  <span className="absolute right-4 top-3 text-sm text-slate-400">kg</span>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex gap-3">
              <button
                onClick={() => setItemDetailsModal(null)}
                className="flex-1 px-4 py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={submitItemDetails}
                className="flex-1 px-4 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Item Modal */}
      {customItemModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">
                  Add a Custom Item
                </h3>
                <button
                  onClick={() => setCustomItemModal({ isOpen: false, itemName: '' })}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Item Name
                </label>
                <input
                  type="text"
                  value={customItemModal.itemName}
                  onChange={(e) => setCustomItemModal({ isOpen: true, itemName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                  placeholder="Enter item name"
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex gap-3">
              <button
                onClick={() => setCustomItemModal({ isOpen: false, itemName: '' })}
                className="flex-1 px-4 py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const customName = customItemModal.itemName.trim();
                  if (customName) {
                    const customId = `custom-${Date.now()}`;
                    const customItem = {
                      id: customId,
                      name: customName,
                      category: activeCategory,
                      volume: 0.5, // Default volume for custom items
                    };
                    // Add to ALL_ITEMS_LIBRARY temporarily
                    ALL_ITEMS_LIBRARY.push(customItem);
                    // Add to selected items
                    addItem(customId);
                    setCustomItemModal({ isOpen: false, itemName: '' });
                  }
                }}
                className="flex-1 px-4 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}