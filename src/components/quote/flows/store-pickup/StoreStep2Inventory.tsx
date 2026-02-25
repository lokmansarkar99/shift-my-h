import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Plus, Minus, Trash2, Package, Box, ShoppingCart, Store, Home, Clock, Users } from 'lucide-react';
import { StoreQuote, InventoryItem } from './storeTypes';
import { MapView } from '../../MapView';
import { MoveSummaryCard } from '../../MoveSummaryCard';

interface StepProps {
  data: StoreQuote;
  onChange: (updates: Partial<StoreQuote>) => void;
  onNext: () => void;
  onBack: () => void;
}

// 📦 STORE/PICKUP INVENTORY ITEMS
const STORE_PICKUP_ITEMS = [
  // IKEA FURNITURE
  { id: 'ikea-billy', name: 'BILLY Bookcase', category: 'IKEA Furniture', volume: 0.65, icon: '📚' },
  { id: 'ikea-kallax', name: 'KALLAX Shelving Unit', category: 'IKEA Furniture', volume: 0.85, icon: '📦' },
  { id: 'ikea-malm', name: 'MALM Bed Frame', category: 'IKEA Furniture', volume: 1.20, icon: '🛏️' },
  { id: 'ikea-hemnes', name: 'HEMNES Dresser', category: 'IKEA Furniture', volume: 1.00, icon: '🗄️' },
  { id: 'ikea-pax', name: 'PAX Wardrobe', category: 'IKEA Furniture', volume: 2.50, icon: '🚪' },
  { id: 'ikea-sofa', name: 'KIVIK Sofa', category: 'IKEA Furniture', volume: 2.00, icon: '🛋️' },
  { id: 'ikea-table', name: 'INGATORP Table', category: 'IKEA Furniture', volume: 0.80, icon: '🪑' },
  { id: 'ikea-desk', name: 'MICKE Desk', category: 'IKEA Furniture', volume: 0.70, icon: '🖥️' },
  { id: 'ikea-mattress', name: 'MORGEDAL Mattress', category: 'IKEA Furniture', volume: 0.60, icon: '🛏️' },
  { id: 'ikea-ektorp', name: 'EKTORP Armchair', category: 'IKEA Furniture', volume: 1.10, icon: '🛋️' },
  { id: 'ikea-brimnes', name: 'BRIMNES Cabinet', category: 'IKEA Furniture', volume: 0.90, icon: '🗄️' },
  
  // B&Q / HARDWARE
  { id: 'bq-timber', name: 'Timber Pack (2.4m)', category: 'B&Q / Hardware', volume: 0.50, icon: '🪵' },
  { id: 'bq-plasterboard', name: 'Plasterboard Sheets', category: 'B&Q / Hardware', volume: 0.80, icon: '📋' },
  { id: 'bq-paint', name: 'Paint Cans (5L x4)', category: 'B&Q / Hardware', volume: 0.25, icon: '🎨' },
  { id: 'bq-tiles', name: 'Tile Boxes', category: 'B&Q / Hardware', volume: 0.40, icon: '🔲' },
  { id: 'bq-flooring', name: 'Laminate Flooring Pack', category: 'B&Q / Hardware', volume: 0.70, icon: '🪵' },
  { id: 'bq-cement', name: 'Cement Bags (x10)', category: 'B&Q / Hardware', volume: 0.60, icon: '🏗️' },
  { id: 'bq-tools', name: 'Power Tools Box', category: 'B&Q / Hardware', volume: 0.30, icon: '🔧' },
  { id: 'bq-ladder', name: 'Step Ladder', category: 'B&Q / Hardware', volume: 0.40, icon: '🪜' },
  { id: 'bq-insulation', name: 'Insulation Roll', category: 'B&Q / Hardware', volume: 0.80, icon: '🧶' },
  
  // RETAIL APPLIANCES
  { id: 'appliance-fridge', name: 'Fridge (Retail Boxed)', category: 'Retail Appliances', volume: 1.20, icon: '❄️' },
  { id: 'appliance-washer', name: 'Washing Machine (Boxed)', category: 'Retail Appliances', volume: 1.00, icon: '🌊' },
  { id: 'appliance-tv-55', name: 'TV (Boxed 55")', category: 'Retail Appliances', volume: 0.50, icon: '📺' },
  { id: 'appliance-tv-75', name: 'TV (Boxed 75")', category: 'Retail Appliances', volume: 0.80, icon: '📺' },
  { id: 'appliance-microwave', name: 'Microwave (Boxed)', category: 'Retail Appliances', volume: 0.20, icon: '🔥' },
  { id: 'appliance-oven', name: 'Oven (Boxed)', category: 'Retail Appliances', volume: 0.80, icon: '🍳' },
  { id: 'appliance-dishwasher', name: 'Dishwasher (Boxed)', category: 'Retail Appliances', volume: 0.90, icon: '🍽️' },
  { id: 'appliance-dryer', name: 'Tumble Dryer (Boxed)', category: 'Retail Appliances', volume: 1.00, icon: '💨' },
  
  // GARDEN & OUTDOOR
  { id: 'garden-furniture', name: 'Garden Furniture Set', category: 'Garden & Outdoor', volume: 1.50, icon: '🪑' },
  { id: 'garden-bbq', name: 'BBQ Grill (Boxed)', category: 'Garden & Outdoor', volume: 0.80, icon: '🔥' },
  { id: 'garden-shed', name: 'Shed Kit (Flat Pack)', category: 'Garden & Outdoor', volume: 3.00, icon: '🏠' },
  { id: 'garden-plants', name: 'Plant Pots / Trees', category: 'Garden & Outdoor', volume: 0.60, icon: '🌳' },
  { id: 'garden-soil', name: 'Soil Bags (x10)', category: 'Garden & Outdoor', volume: 0.50, icon: '🪴' },
  { id: 'garden-mower', name: 'Lawn Mower', category: 'Garden & Outdoor', volume: 0.70, icon: '🚜' },
  { id: 'garden-trampoline', name: 'Trampoline (Boxed)', category: 'Garden & Outdoor', volume: 1.20, icon: '🤸' },
  
  // RETAIL BOXES & PACKAGES
  { id: 'box-small', name: 'Small Retail Box', category: 'Boxes & Packages', volume: 0.05, icon: '📦' },
  { id: 'box-medium', name: 'Medium Retail Box', category: 'Boxes & Packages', volume: 0.10, icon: '📦' },
  { id: 'box-large', name: 'Large Retail Box', category: 'Boxes & Packages', volume: 0.20, icon: '📦' },
  { id: 'box-bulky', name: 'Bulky Item (Custom)', category: 'Boxes & Packages', volume: 0.50, icon: '📦' },
  
  // COMMERCIAL SUPPLIES
  { id: 'commercial-stock', name: 'Commercial Stock Box', category: 'Commercial Supplies', volume: 0.40, icon: '📦' },
  { id: 'commercial-pallet', name: 'Standard Pallet', category: 'Commercial Supplies', volume: 1.20, icon: '🏗️' },
  { id: 'commercial-supplies', name: 'Office Supplies Box', category: 'Commercial Supplies', volume: 0.30, icon: '📋' },
  { id: 'commercial-printer', name: 'Industrial Printer', category: 'Commercial Supplies', volume: 0.80, icon: '🖨️' },
];

const CATEGORIES = [
  'All Items',
  'IKEA Furniture',
  'B&Q / Hardware',
  'Retail Appliances',
  'Garden & Outdoor',
  'Boxes & Packages',
  'Commercial Supplies',
];

const FLOOR_OPTIONS = ['Basement', 'Ground floor', '1st', '2nd', '3rd', '4th', '5th+'];

export function StoreStep2Inventory({ data, onChange, onNext, onBack }: StepProps) {
  const [selectedCategory, setSelectedCategory] = useState('All Items');
  const [selectedItems, setSelectedItems] = useState<InventoryItem[]>(data.items || []);
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate total volume
  const totalVolume = selectedItems.reduce((sum, item) => sum + item.volume * item.quantity, 0);

  const [crewSize, setCrewSize] = useState<1 | 2 | 3>(data.crewSize || 1);

  // Update parent when items or crew size change
  useEffect(() => {
    onChange({ 
      items: selectedItems,
      totalVolume: totalVolume,
      crewSize: crewSize
    });
  }, [selectedItems, totalVolume, crewSize]);

  // Filter items
  const filteredItems = STORE_PICKUP_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === 'All Items' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Add item
  const addItem = (item: typeof STORE_PICKUP_ITEMS[0]) => {
    const existing = selectedItems.find((i) => i.id === item.id);
    if (existing) {
      setSelectedItems(selectedItems.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)));
    } else {
      setSelectedItems([...selectedItems, { ...item, quantity: 1 }]);
    }
  };

  // Update quantity
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setSelectedItems(selectedItems.filter((item) => item.id !== id));
    } else {
      setSelectedItems(selectedItems.map((item) => (item.id === id ? { ...item, quantity } : item)));
    }
  };

  // Remove item
  const removeItem = (id: string) => {
    setSelectedItems(selectedItems.filter((item) => item.id !== id));
  };

  // Get data for sidebar
  const pickupFloor = FLOOR_OPTIONS[data.pickup.floor] || 'Ground floor';
  const deliveryFloor = FLOOR_OPTIONS[data.dropoff.floor] || 'Ground floor';
  const moveDate = data.date && !data.dateUnsure
    ? (data.date instanceof Date ? data.date.toISOString().split('T')[0] : typeof data.date === 'string' ? data.date : '')
    : undefined;

  // Validation
  const canProceed = selectedItems.length > 0;

  return (
    <div className="space-y-6">
      {/* 2 Column Layout - 60/40 split */}
      <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-6 lg:gap-8">
        {/* LEFT COLUMN - INVENTORY SELECTION (60%) */}
        <div className="space-y-6 order-last lg:order-first">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:p-8 min-h-[800px]">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shrink-0">
                  <Store className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    What are we picking up?
                  </h2>
                  <p className="text-sm text-slate-500">Select items or boxes from retail stores</p>
                </div>
              </div>

              {/* Crew Selection - Bold Integrated Version */}
              <div className="bg-slate-50 p-1.5 rounded-2xl border border-slate-200 flex items-center gap-1">
                {[
                  { size: 1, label: '1 Man', icon: <Users className="w-5 h-5" /> },
                  { size: 2, label: '2 Men', icon: <div className="flex -space-x-1.5"><Users className="w-5 h-5" /><Users className="w-5 h-5" /></div> },
                  { size: 3, label: '3 Men', icon: <div className="flex -space-x-2"><Users className="w-5 h-5" /><Users className="w-5 h-5" /><Users className="w-5 h-5" /></div> }
                ].map((sizeObj) => (
                  <button
                    key={sizeObj.size}
                    onClick={() => {
                      setCrewSize(sizeObj.size as 1 | 2 | 3);
                      onChange({ crewSize: sizeObj.size as 1 | 2 | 3 });
                    }}
                    className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 min-w-[80px] ${
                      crewSize === sizeObj.size
                        ? 'bg-blue-600 text-white shadow-md border border-blue-500'
                        : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
                    }`}
                  >
                    <div className={`${crewSize === sizeObj.size ? 'text-white' : 'text-slate-300'}`}>
                      {sizeObj.icon}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider">{sizeObj.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Search & Category Filter */}
            <div className="mb-6 space-y-3">
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              />
              
              <div className="flex gap-2 flex-wrap">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Items Grid */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {filteredItems.map((item) => {
                const selectedItem = selectedItems.find((i) => i.id === item.id);
                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md ${
                      selectedItem
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                    onClick={() => !selectedItem && addItem(item)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="text-3xl">{item.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900">{item.name}</h3>
                          <p className="text-sm text-slate-600">
                            {item.category} • {item.volume.toFixed(2)} m³
                          </p>
                        </div>
                      </div>
                      
                      {selectedItem ? (
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => updateQuantity(item.id, selectedItem.quantity - 1)}
                            className="w-8 h-8 rounded-lg bg-slate-200 hover:bg-slate-300 flex items-center justify-center"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-bold text-slate-900">
                            {selectedItem.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, selectedItem.quantity + 1)}
                            className="w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addItem(item);
                          }}
                          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm"
                        >
                          Add
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 font-medium">No items found</p>
                <p className="text-sm text-slate-500 mt-1">Try a different search term or category</p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-slate-200">
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
              <button
                onClick={onNext}
                disabled={!canProceed}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all ${
                  canProceed
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - SIDEBAR (40%) */}
        <div className="space-y-6">
          {/* Quote Reference */}
          {data.quoteReference && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
              <p className="text-sm text-blue-700 font-medium mb-1">Quote Reference</p>
              <p className="text-2xl font-bold text-blue-900 font-mono tracking-tight">
                {data.quoteReference}
              </p>
            </div>
          )}

          {/* Map */}
          {data.pickup.lat && data.pickup.lng && data.dropoff.lat && data.dropoff.lng && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <MapView
                pickupLat={data.pickup.lat}
                pickupLng={data.pickup.lng}
                deliveryLat={data.dropoff.lat}
                deliveryLng={data.dropoff.lng}
                onRouteUpdate={(dist, dur) => {
                  onChange({ distance: dist });
                }}
              />
            </div>
          )}

          {/* Move Summary */}
          <MoveSummaryCard
            pickupAddress={data.pickup.address}
            pickupPostcode={data.pickup.postcode}
            pickupFloor={pickupFloor}
            pickupLift={data.pickup.hasLift}
            deliveryAddress={data.dropoff.address}
            deliveryPostcode={data.dropoff.postcode}
            deliveryFloor={deliveryFloor}
            deliveryLift={data.dropoff.hasLift}
            moveDate={moveDate}
            distance={data.distance}
            totalVolume={totalVolume}
            pickupFloorNumber={data.pickup.floor}
            deliveryFloorNumber={data.dropoff.floor}
            selectedItems={selectedItems}
          />

          {/* My Item List */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 min-h-[300px]">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-blue-600" />
              My Item List
            </h3>
            {selectedItems.length > 0 ? (
              <div className="space-y-3">
                {selectedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg group hover:bg-slate-100 transition-all"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 text-sm">{item.name}</p>
                      <p className="text-xs text-slate-600">
                        {item.quantity}x • {(item.volume * item.quantity).toFixed(2)} m³
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                <div className="pt-3 mt-3 border-t border-slate-200">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">Total Volume:</span>
                    <span className="font-bold text-blue-600 text-lg">{totalVolume.toFixed(2)} m³</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm text-slate-600">Total Items:</span>
                    <span className="text-sm font-semibold text-slate-900">
                      {selectedItems.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Box className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">No items selected yet</p>
                <p className="text-slate-400 text-xs mt-1">Add items from the list</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}