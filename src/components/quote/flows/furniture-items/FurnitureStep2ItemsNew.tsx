/**
 * Furniture & Items - Step 2: Item Selection
 * REDESIGNED - AnyVan-inspired elegant interface with category dropdowns and item details modal
 */

import React, { useState, useEffect } from 'react';
import { MoveSummaryCard } from '../../MoveSummaryCard';
import { FurnitureQuote } from './furnitureTypes';
import { 
  ArrowRight, 
  ArrowLeft, 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  Package, 
  Sofa, 
  Bed, 
  Table, 
  Tv, 
  Shirt, 
  Armchair, 
  Box, 
  ChevronDown, 
  Edit3, 
  Users 
} from 'lucide-react';
import { FurnitureMapPanel } from './FurnitureMapPanel';
import { FurnitureItemDetailsModal, ItemDetails } from './FurnitureItemDetailsModal';
import { INVENTORY_ITEMS, INVENTORY_CATEGORIES } from '../../../../utils/inventoryData';

interface StepProps {
  data: FurnitureQuote;
  onChange: (updates: Partial<FurnitureQuote>) => void;
  onNext: () => void;
  onBack: () => void;
}

interface SelectedItem {
  id: string;
  name: string;
  quantity: number;
  details?: ItemDetails;
}

// Category definitions with icons - Map from inventory categories
const CATEGORY_COLORS: Record<string, string> = {
  'bedrooms': 'text-purple-600',
  'living': 'text-blue-600',
  'kitchen': 'text-green-600',
  'bathroom': 'text-cyan-600',
  'boxes': 'text-amber-600',
  'garden': 'text-emerald-600',
  'office': 'text-indigo-600',
  'electronics': 'text-sky-600',
  'garage': 'text-orange-600',
  'children': 'text-pink-600',
  'sports': 'text-rose-600',
};

const CATEGORIES = INVENTORY_CATEGORIES.map(category => {
  const IconComponent = category.icon;
  return {
    id: category.id,
    name: category.name,
    icon: <IconComponent className="w-5 h-5" />,
    color: CATEGORY_COLORS[category.id] || 'text-slate-600',
  };
});

// Items per category
const ITEMS_BY_CATEGORY: Record<string, string[]> = INVENTORY_ITEMS.reduce((acc, item) => {
  if (!acc[item.category]) {
    acc[item.category] = [];
  }
  acc[item.category].push(item.name);
  return acc;
}, {} as Record<string, string[]>);

export function FurnitureStep2ItemsNew({ data, onChange, onNext, onBack }: StepProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>(
    data.items?.map(item => ({ ...item, details: undefined })) || []
  );
  const [crewSize, setCrewSize] = useState<1 | 2 | 3>(data.crewSize || 1);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [detailsModal, setDetailsModal] = useState<{ item: string; index?: number } | null>(null);
  const [customItemName, setCustomItemName] = useState('');

  const handleAddItem = (itemName: string) => {
    // Add item directly to list without modal
    const itemId = `${itemName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    const newItem: SelectedItem = {
      id: itemId,
      name: itemName,
      quantity: 1,
    };
    setSelectedItems([...selectedItems, newItem]);
    setOpenCategory(null);
  };

  const handleSubmitDetails = (details: ItemDetails) => {
    if (!detailsModal) return;

    if (detailsModal.index !== undefined) {
      // Edit existing item
      const updated = [...selectedItems];
      updated[detailsModal.index].details = details;
      setSelectedItems(updated);
    } else {
      // Add new item
      const itemId = `${detailsModal.item.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
      const newItem: SelectedItem = {
        id: itemId,
        name: detailsModal.item,
        quantity: 1,
        details,
      };
      setSelectedItems([...selectedItems, newItem]);
    }

    setDetailsModal(null);
    setOpenCategory(null);
  };

  const handleUpdateQuantity = (index: number, delta: number) => {
    const updated = [...selectedItems];
    updated[index].quantity += delta;
    if (updated[index].quantity <= 0) {
      updated.splice(index, 1);
    }
    setSelectedItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    const updated = [...selectedItems];
    updated.splice(index, 1);
    setSelectedItems(updated);
  };

  const handleEditItem = (index: number) => {
    setDetailsModal({ item: selectedItems[index].name, index });
  };

  const handleContinue = () => {
    // Convert to simple format for storage
    const simpleItems = selectedItems.map(item => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
    }));
    
    onChange({ items: simpleItems, crewSize });
    onNext();
  };

  // Search functionality
  const searchResults = searchQuery.trim().length > 0
    ? INVENTORY_ITEMS.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-6 lg:gap-8">
        {/* LEFT COLUMN */}
        <div className="space-y-6 order-last lg:order-first">
          {/* Header & Crew Selection Integrated */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-1">
                  What are you moving?
                </h1>
                <p className="text-slate-600 text-sm">
                  Select items from categories below or search for specific items
                </p>
              </div>

              {/* Crew Selection - Slim & Bold Version */}
              <div className="bg-slate-50 p-1.5 rounded-2xl border border-slate-200 flex items-center gap-1 self-start md:self-center">
                {[
                  { size: 1, label: '1 Man', icon: <Users className="w-5 h-5" /> },
                  { size: 2, label: '2 Men', icon: <div className="flex -space-x-1.5"><Users className="w-5 h-5" /><Users className="w-5 h-5" /></div> },
                  { size: 3, label: '3 Men', icon: <div className="flex -space-x-2"><Users className="w-5 h-5" /><Users className="w-5 h-5" /><Users className="w-5 h-5" /></div> }
                ].map((item) => (
                  <button
                    key={item.size}
                    onClick={() => setCrewSize(item.size as 1 | 2 | 3)}
                    className={`flex flex-col items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl transition-all duration-200 min-w-[85px] ${
                      crewSize === item.size
                        ? 'bg-white text-purple-700 shadow-md border border-purple-100 ring-1 ring-purple-50'
                        : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
                    }`}
                  >
                    <div className={`${crewSize === item.size ? 'text-purple-600' : 'text-slate-300'}`}>
                      {item.icon}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for items... (e.g. Sofa, Bed, Table)"
                className="w-full pl-12 pr-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-slate-900"
              />
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-4 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-slate-700">
                    Found {searchResults.length} item{searchResults.length !== 1 ? 's' : ''}
                  </p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-xs text-slate-600 hover:text-slate-900 font-medium"
                  >
                    Clear search
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-2 max-h-80 overflow-y-auto">
                  {searchResults.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between px-4 py-3 bg-white rounded-xl hover:shadow-md transition-all duration-200 border border-slate-200 hover:border-purple-300"
                    >
                      <div className="flex-1 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                          <Package className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                          <p className="text-xs text-slate-500">
                            {CATEGORIES.find(c => c.id === item.category)?.name} • {item.handling}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          handleAddItem(item.name);
                          setSearchQuery('');
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg"
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Categories - Beautiful Grid */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-6">
              Browse by Category
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setOpenCategory(openCategory === category.id ? null : category.id)}
                  className={`relative group flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 ${
                    openCategory === category.id
                      ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg scale-105'
                      : 'border-slate-200 hover:border-purple-300 hover:shadow-md hover:scale-102'
                  }`}
                >
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 transition-all ${
                    openCategory === category.id 
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
                      : 'bg-slate-100 group-hover:bg-purple-100'
                  }`}>
                    <div className={openCategory === category.id ? 'text-white' : category.color}>
                      {category.icon}
                    </div>
                  </div>
                  
                  {/* Label */}
                  <span className={`text-sm font-semibold text-center transition-colors ${
                    openCategory === category.id ? 'text-purple-700' : 'text-slate-700 group-hover:text-purple-600'
                  }`}>
                    {category.name}
                  </span>
                  
                  {/* Active indicator */}
                  {openCategory === category.id && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                      <ChevronDown className="w-4 h-4 text-white rotate-180" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Items Dropdown - Full width elegant list */}
            {openCategory && ITEMS_BY_CATEGORY[openCategory] && ITEMS_BY_CATEGORY[openCategory].length > 0 && (
              <div className="mt-4 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200 shadow-inner animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-slate-900">
                    Select from {CATEGORIES.find(c => c.id === openCategory)?.name}
                  </h3>
                  <button
                    onClick={() => setOpenCategory(null)}
                    className="text-sm text-slate-600 hover:text-slate-900 font-medium"
                  >
                    Close
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {(ITEMS_BY_CATEGORY[openCategory] || []).map((itemName) => (
                    <button
                      key={itemName}
                      onClick={() => handleAddItem(itemName)}
                      className="flex items-center justify-between px-4 py-3 bg-white rounded-xl hover:bg-purple-100 hover:shadow-md transition-all duration-200 border border-slate-200 hover:border-purple-300 group"
                    >
                      <span className="text-sm font-medium text-slate-700 group-hover:text-purple-700">
                        {itemName}
                      </span>
                      <Plus className="w-5 h-5 text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
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

        {/* RIGHT COLUMN */}
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

          {/* My Item List */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              My Item List ({selectedItems.length})
            </h3>

            {selectedItems.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">
                No items added yet. Select from categories above.
              </p>
            ) : (
              <div className="space-y-2">
                {selectedItems.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex-1">
                      <span className="font-medium text-slate-900">{item.name}</span>
                      {item.details && (
                        <p className="text-xs text-slate-500 mt-0.5">
                          {item.details.width}×{item.details.height}×{item.details.depth} {item.details.unit}
                          {item.details.weight > 0 && ` • ${item.details.weight}${item.details.weightUnit}`}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateQuantity(index, -1)}
                        className="w-7 h-7 bg-white rounded-lg flex items-center justify-center hover:bg-slate-200 border border-slate-300"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-6 text-center font-bold text-slate-900">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(index, 1)}
                        className="w-7 h-7 bg-purple-100 rounded-lg flex items-center justify-center hover:bg-purple-200 border border-purple-300"
                      >
                        <Plus className="w-4 h-4 text-purple-600" />
                      </button>
                      <button
                        onClick={() => handleEditItem(index)}
                        className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center hover:bg-blue-200 border border-blue-300"
                      >
                        <Edit3 className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleRemoveItem(index)}
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

          {/* Summary Card */}
          <MoveSummaryCard
            quoteRef={data.quoteReference}
            pickupAddress={data.pickup?.address}
            deliveryAddress={data.dropoff?.address}
            pickupFloor={data.pickup?.floor !== undefined ? (data.pickup.floor === 0 ? 'Ground floor' : `${data.pickup.floor}`) : 'Ground floor'}
            deliveryFloor={data.dropoff?.floor !== undefined ? (data.dropoff.floor === 0 ? 'Ground floor' : `${data.dropoff.floor}`) : 'Ground floor'}
            liftAvailableAtPickup={data.pickup?.hasLift}
            liftAvailableAtDelivery={data.dropoff?.hasLift}
            distance={data.distance}
            totalVolume={selectedItems.reduce((sum, item) => {
              const meta = INVENTORY_ITEMS.find(i => i.name === item.name);
              return sum + (item.quantity * (meta?.volume || 0.5));
            }, 0)}
            selectedItems={selectedItems.map(item => {
              const meta = INVENTORY_ITEMS.find(i => i.name === item.name);
              return { ...item, volume: meta?.volume || 0.5 };
            })}
            moveDate={data.date ? (data.date instanceof Date ? data.date.toISOString() : String(data.date)) : undefined}
          />
        </div>
      </div>

      {/* Details Modal */}
      {detailsModal && (
        <FurnitureItemDetailsModal
          itemName={detailsModal.item}
          onSubmit={handleSubmitDetails}
          onCancel={() => setDetailsModal(null)}
        />
      )}
    </div>
  );
}
