/**
 * Furniture & Items - Step 2: Item Selection
 * UNIQUE SHIFTMYHOME DESIGN - Inspired by AnyVan but completely different
 * Card-based category selection with search functionality
 */

import React, { useState } from 'react';
import { FurnitureQuote } from './furnitureTypes';
import { ArrowRight, ArrowLeft, Search, Plus, Minus, Trash2, Package, Sofa, Bed, Table, Tv, Shirt, Armchair, Box, Edit3 } from 'lucide-react';
import { FurnitureMapPanel } from './FurnitureMapPanel';
import { MoveSummaryCard } from '../../MoveSummaryCard';

interface StepProps {
  data: FurnitureQuote;
  onChange: (updates: Partial<FurnitureQuote>) => void;
  onNext: () => void;
  onBack: () => void;
}

interface FurnitureItem {
  id: string;
  name: string;
  category: string;
  icon: React.ReactNode;
  volume: number;
}

// Comprehensive furniture library with volumes
const FURNITURE_LIBRARY: FurnitureItem[] = [
  // Sofas
  { id: 'two-seater-sofa', name: 'Two Seater Sofa', category: 'Sofas', icon: <Sofa className="w-5 h-5" />, volume: 1.5 },
  { id: 'three-seater-sofa', name: 'Three Seater Sofa', category: 'Sofas', icon: <Sofa className="w-5 h-5" />, volume: 2.0 },
  { id: 'four-seater-sofa', name: 'Four Seater Sofa', category: 'Sofas', icon: <Sofa className="w-5 h-5" />, volume: 2.5 },
  { id: 'corner-sofa', name: 'Corner Sofa', category: 'Sofas', icon: <Sofa className="w-5 h-5" />, volume: 3.5 },
  { id: 'sofa-bed', name: 'Sofa Bed', category: 'Sofas', icon: <Sofa className="w-5 h-5" />, volume: 2.2 },
  { id: 'recliner', name: 'Recliner', category: 'Sofas', icon: <Sofa className="w-5 h-5" />, volume: 1.2 },
  
  // Beds & Mattresses
  { id: 'single-bed', name: 'Single Bed Frame', category: 'Beds & Mattresses', icon: <Bed className="w-5 h-5" />, volume: 0.8 },
  { id: 'double-bed', name: 'Double Bed Frame', category: 'Beds & Mattresses', icon: <Bed className="w-5 h-5" />, volume: 1.2 },
  { id: 'king-bed', name: 'King Size Bed', category: 'Beds & Mattresses', icon: <Bed className="w-5 h-5" />, volume: 1.5 },
  { id: 'single-mattress', name: 'Single Mattress', category: 'Beds & Mattresses', icon: <Bed className="w-5 h-5" />, volume: 0.4 },
  { id: 'double-mattress', name: 'Double Mattress', category: 'Beds & Mattresses', icon: <Bed className="w-5 h-5" />, volume: 0.6 },
  { id: 'king-mattress', name: 'King Size Mattress', category: 'Beds & Mattresses', icon: <Bed className="w-5 h-5" />, volume: 0.8 },
  
  // Tables
  { id: 'dining-table-4', name: 'Dining Table (4 seater)', category: 'Tables', icon: <Table className="w-5 h-5" />, volume: 1.0 },
  { id: 'dining-table-6', name: 'Dining Table (6 seater)', category: 'Tables', icon: <Table className="w-5 h-5" />, volume: 1.5 },
  { id: 'coffee-table', name: 'Coffee Table', category: 'Tables', icon: <Table className="w-5 h-5" />, volume: 0.4 },
  { id: 'side-table', name: 'Side Table', category: 'Tables', icon: <Table className="w-5 h-5" />, volume: 0.2 },
  { id: 'desk', name: 'Desk', category: 'Tables', icon: <Table className="w-5 h-5" />, volume: 0.8 },
  
  // Chairs
  { id: 'dining-chair', name: 'Dining Chair', category: 'Chairs', icon: <Armchair className="w-5 h-5" />, volume: 0.2 },
  { id: 'office-chair', name: 'Office Chair', category: 'Chairs', icon: <Armchair className="w-5 h-5" />, volume: 0.3 },
  { id: 'armchair', name: 'Armchair', category: 'Chairs', icon: <Armchair className="w-5 h-5" />, volume: 0.8 },
  
  // Wardrobes
  { id: 'single-wardrobe', name: 'Single Wardrobe', category: 'Wardrobes', icon: <Package className="w-5 h-5" />, volume: 1.2 },
  { id: 'double-wardrobe', name: 'Double Wardrobe', category: 'Wardrobes', icon: <Package className="w-5 h-5" />, volume: 2.0 },
  { id: 'sliding-wardrobe', name: 'Sliding Door Wardrobe', category: 'Wardrobes', icon: <Package className="w-5 h-5" />, volume: 2.5 },
  
  // Electronics
  { id: 'tv-32', name: 'TV (32")', category: 'Electronics', icon: <Tv className="w-5 h-5" />, volume: 0.1 },
  { id: 'tv-50', name: 'TV (50")', category: 'Electronics', icon: <Tv className="w-5 h-5" />, volume: 0.2 },
  { id: 'tv-65', name: 'TV (65"+)', category: 'Electronics', icon: <Tv className="w-5 h-5" />, volume: 0.3 },
  
  // Clothings
  { id: 'wardrobe-box', name: 'Wardrobe Box with Clothes', category: 'Clothings', icon: <Shirt className="w-5 h-5" />, volume: 0.5 },
  { id: 'clothes-box-small', name: 'Small Clothes Box', category: 'Clothings', icon: <Shirt className="w-5 h-5" />, volume: 0.2 },
  { id: 'clothes-box-medium', name: 'Medium Clothes Box', category: 'Clothings', icon: <Shirt className="w-5 h-5" />, volume: 0.3 },
  { id: 'clothes-box-large', name: 'Large Clothes Box', category: 'Clothings', icon: <Shirt className="w-5 h-5" />, volume: 0.5 },
  { id: 'suitcase', name: 'Suitcase', category: 'Clothings', icon: <Shirt className="w-5 h-5" />, volume: 0.2 },
  { id: 'garment-bag', name: 'Garment Bag', category: 'Clothings', icon: <Shirt className="w-5 h-5" />, volume: 0.1 },
  
  // Boxes
  { id: 'small-box', name: 'Small Box', category: 'Boxes', icon: <Box className="w-5 h-5" />, volume: 0.1 },
  { id: 'medium-box', name: 'Medium Box', category: 'Boxes', icon: <Box className="w-5 h-5" />, volume: 0.2 },
  { id: 'large-box', name: 'Large Box', category: 'Boxes', icon: <Box className="w-5 h-5" />, volume: 0.4 },
];

const CATEGORIES = [
  { id: 'Sofas', name: 'Sofas', icon: <Sofa className="w-6 h-6" />, color: 'from-blue-500 to-blue-600' },
  { id: 'Beds & Mattresses', name: 'Beds & Mattresses', icon: <Bed className="w-6 h-6" />, color: 'from-purple-500 to-purple-600' },
  { id: 'Tables', name: 'Tables', icon: <Table className="w-6 h-6" />, color: 'from-green-500 to-green-600' },
  { id: 'Chairs', name: 'Chairs', icon: <Armchair className="w-6 h-6" />, color: 'from-orange-500 to-orange-600' },
  { id: 'Wardrobes', name: 'Wardrobes', icon: <Package className="w-6 h-6" />, color: 'from-pink-500 to-pink-600' },
  { id: 'Electronics', name: 'Electronics', icon: <Tv className="w-6 h-6" />, color: 'from-cyan-500 to-cyan-600' },
  { id: 'Clothings', name: 'Clothings', icon: <Shirt className="w-6 h-6" />, color: 'from-indigo-500 to-indigo-600' },
  { id: 'Boxes', name: 'Boxes', icon: <Box className="w-6 h-6" />, color: 'from-amber-500 to-amber-600' },
];

export function FurnitureStep2Items({ data, onChange, onNext, onBack }: StepProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Array<{ id: string; name: string; quantity: number }>>(
    data.items || []
  );
  const [customItemName, setCustomItemName] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Filter items based on search and category
  const filteredItems = FURNITURE_LIBRARY.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddItem = (item: FurnitureItem) => {
    const existing = selectedItems.find(i => i.id === item.id);
    if (existing) {
      setSelectedItems(selectedItems.map(i => 
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      setSelectedItems([...selectedItems, { id: item.id, name: item.name, quantity: 1, volume: item.volume }]);
    }
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setSelectedItems(
      selectedItems
        .map(item => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity + delta };
          }
          return item;
        })
        .filter(item => item.quantity > 0)
    );
  };

  const handleRemoveItem = (id: string) => {
    setSelectedItems(selectedItems.filter(item => item.id !== id));
  };

  const handleAddCustomItem = () => {
    if (!customItemName.trim()) return;
    const customId = `custom-${Date.now()}`;
    setSelectedItems([...selectedItems, { id: customId, name: customItemName, quantity: 1, volume: 0.5 }]);
    setCustomItemName('');
    setShowCustomInput(false);
  };

  const handleContinue = () => {
    console.log('=== FURNITURE STEP 2 - HANDLE CONTINUE START ===');
    console.log('1. Current component data:', data);
    console.log('2. Selected items state:', selectedItems);
    
    // Build complete updated data object
    const updatedData = {
      ...data,
      items: selectedItems,
      updatedAt: new Date().toISOString()
    };
    
    console.log('3. Updated data to save:', updatedData);
    
    try {
      // Save to localStorage
      const serialized = JSON.stringify(updatedData);
      console.log('4. Serialized JSON:', serialized);
      
      localStorage.setItem('quote-furniture', serialized);
      localStorage.setItem('active-service-type', 'furniture');
      
      console.log('5. ✅ Saved to localStorage');
      
      // Verify save
      const verification = localStorage.getItem('quote-furniture');
      console.log('6. Verification read:', verification);
      
      if (verification) {
        const parsed = JSON.parse(verification);
        console.log('7. Parsed verification:', parsed);
        console.log('8. Items in localStorage:', parsed.items);
      }
      
    } catch (error) {
      console.error('❌ ERROR saving to localStorage:', error);
      alert('Error saving data! Check console.');
      return;
    }
    
    // Update parent (for UI state)
    console.log('9. Calling onChange...');
    onChange({ items: selectedItems });
    
    // Wait a bit then navigate
    console.log('10. Waiting 100ms before navigation...');
    setTimeout(() => {
      console.log('11. ✅ Navigating to Step 3...');
      onNext();
    }, 100);
    
    console.log('=== FURNITURE STEP 2 - HANDLE CONTINUE END ===');
  };

  return (
    <div className="space-y-6">
      {/* 2 Column Layout - 60/40 split */}
      <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-6 lg:gap-8">
        {/* LEFT COLUMN - Item Selection (60%) */}
        <div className="space-y-6 order-last lg:order-first">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  What are you moving?
                </h1>
              </div>
            </div>
            <p className="text-slate-600 text-sm">
              Search or select items from our categories below
            </p>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter your item(s) here e.g. Sofa"
                className="w-full pl-12 pr-4 py-4 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-slate-900 font-medium"
              />
            </div>
          </div>

          {/* Category Cards */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Quick add from categories:</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedCategory === category.id
                      ? 'border-purple-500 bg-purple-50 shadow-md'
                      : 'border-slate-200 hover:border-purple-300 hover:shadow-sm'
                  }`}
                >
                  <div className={`w-12 h-12 mx-auto mb-2 bg-gradient-to-br ${category.color} rounded-lg flex items-center justify-center text-white`}>
                    {category.icon}
                  </div>
                  <div className="text-sm font-semibold text-slate-900 text-center">
                    {category.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Items List */}
          {(searchQuery || selectedCategory) && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                {selectedCategory || 'Search Results'}
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredItems.map((item) => {
                  const selected = selectedItems.find(i => i.id === item.id);
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-purple-300 hover:bg-purple-50 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
                          {item.icon}
                        </div>
                        <span className="font-medium text-slate-900">{item.name}</span>
                      </div>
                      {selected ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, -1)}
                            className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-slate-200"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-bold">{selected.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, 1)}
                            className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center hover:bg-purple-200"
                          >
                            <Plus className="w-4 h-4 text-purple-600" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAddItem(item)}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors text-sm"
                        >
                          +add
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Custom Item */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            {!showCustomInput ? (
              <button
                onClick={() => setShowCustomInput(true)}
                className="w-full py-3 px-4 border-2 border-dashed border-slate-300 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all text-slate-700 font-semibold flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Your Own Item
              </button>
            ) : (
              <div className="space-y-3">
                <input
                  type="text"
                  value={customItemName}
                  onChange={(e) => setCustomItemName(e.target.value)}
                  placeholder="Enter custom item name"
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCustomItem()}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAddCustomItem}
                    className="flex-1 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700"
                  >
                    Add Item
                  </button>
                  <button
                    onClick={() => {
                      setShowCustomInput(false);
                      setCustomItemName('');
                    }}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onBack}
                className="flex items-center justify-center gap-2 px-6 py-3 text-slate-700 font-semibold hover:bg-slate-100 rounded-xl transition-colors border-2 border-slate-300"
              >
                <ArrowLeft className="w-5 h-5" />
                Previous Step
              </button>
              <button
                onClick={handleContinue}
                disabled={selectedItems.length === 0}
                className="flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Pricing
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Summary (40%) */}
        <div className="space-y-6 lg:sticky lg:top-4 lg:self-start order-first lg:order-last">
          {/* Quote Reference */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl shadow-sm border border-purple-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 font-medium mb-1">Quote ref:</p>
                <p className="text-xl font-bold text-slate-900">
                  {data.quoteReference || 'SMH-' + Date.now().toString().slice(-6)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Map */}
          <FurnitureMapPanel data={data} />

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
            selectedItems={selectedItems}
          />

          {/* Selected Items List */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-purple-600" />
              My Item List ({selectedItems.length})
            </h3>
            {selectedItems.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">
                No items added yet. Start by searching or selecting from categories.
              </p>
            ) : (
              <div className="space-y-2">
                {selectedItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex-1">
                      <span className="font-medium text-slate-900">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, -1)}
                        className="w-7 h-7 bg-white rounded-lg flex items-center justify-center hover:bg-slate-200 border border-slate-300"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-6 text-center font-bold text-slate-900">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, 1)}
                        className="w-7 h-7 bg-purple-100 rounded-lg flex items-center justify-center hover:bg-purple-200 border border-purple-300"
                      >
                        <Plus className="w-4 h-4 text-purple-600" />
                      </button>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="w-7 h-7 bg-red-100 rounded-lg flex items-center justify-center hover:bg-red-200 border border-red-300"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}