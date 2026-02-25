/**
 * Furniture & Items - Step 2: Inventory Selection
 * Same layout and sidebar as Step 1 for consistency
 */

import React, { useState, useEffect } from 'react';
import { FurnitureQuote } from './furnitureTypes';
import { 
  ArrowRight, 
  ArrowLeft, 
  Plus, 
  Minus, 
  Trash2, 
  Package, 
  ShoppingCart, 
  Armchair,
  Search,
  Users,
  LayoutGrid
} from 'lucide-react';
import { MapView } from '../../MapView';
import { MoveSummaryCard } from '../../MoveSummaryCard';
import { INVENTORY_ITEMS } from '../../../../utils/inventoryData';

interface StepProps {
  data: FurnitureQuote;
  onChange: (updates: Partial<FurnitureQuote>) => void;
  onNext: () => void;
  onBack: () => void;
}

const FLOOR_OPTIONS = ['Basement', 'Ground floor', '1st', '2nd', '3rd', '4th', '5th+'];

export function FurnitureStep2Inventory({ data, onChange, onNext, onBack }: StepProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<any[]>(data.items || []);
  const [crewSize, setCrewSize] = useState<1 | 2 | 3>(data.crewSize || 1);

  // Calculate totals
  const totalItems = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalVolume = selectedItems.reduce((sum, item) => sum + (item.volume * item.quantity), 0);

  // Sync with parent
  useEffect(() => {
    onChange({ 
      items: selectedItems,
      crewSize: crewSize
    });
  }, [selectedItems, crewSize]);

  const addItem = (item: any) => {
    const existing = selectedItems.find((i) => i.id === item.id);
    if (existing) {
      setSelectedItems(selectedItems.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)));
    } else {
      setSelectedItems([...selectedItems, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setSelectedItems(selectedItems.filter((item) => item.id !== id));
    } else {
      setSelectedItems(selectedItems.map((item) => (item.id === id ? { ...item, quantity } : item)));
    }
  };

  const removeItem = (id: string) => {
    setSelectedItems(selectedItems.filter((item) => item.id !== id));
  };

  // Filter items from global library
  const filteredItems = INVENTORY_ITEMS.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 20); // Limit results for UI performance

  const canProceed = selectedItems.length > 0;

  // Sidebar data
  const pickupFloor = FLOOR_OPTIONS[data.pickup?.floor || 0] || 'Ground floor';
  const deliveryFloor = FLOOR_OPTIONS[data.dropoff?.floor || 0] || 'Ground floor';
  const moveDate = data.date && !data.dateUnsure
    ? (data.date instanceof Date ? data.date.toISOString().split('T')[0] : typeof data.date === 'string' ? data.date : '')
    : undefined;

  return (
    <div className="space-y-6">
      {/* 2 Column Layout - 60/40 split - IDENTICAL TO STEP 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-6 lg:gap-8">
        
        {/* LEFT COLUMN - INVENTORY (60%) */}
        <div className="space-y-6 order-last lg:order-first">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:p-8">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shrink-0">
                  <Armchair className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    What are we moving?
                  </h2>
                  <p className="text-sm text-slate-500">Select the furniture items and boxes</p>
                </div>
              </div>

              {/* Crew Selection */}
              <div className="bg-slate-50 p-1.5 rounded-2xl border border-slate-200 flex items-center gap-1">
                {[
                  { size: 1, label: '1 Man', icon: <Users className="w-5 h-5" /> },
                  { size: 2, label: '2 Men', icon: <div className="flex -space-x-1.5"><Users className="w-5 h-5" /><Users className="w-5 h-5" /></div> },
                  { size: 3, label: '3 Men', icon: <div className="flex -space-x-2"><Users className="w-5 h-5" /><Users className="w-5 h-5" /><Users className="w-5 h-5" /></div> }
                ].map((sizeObj) => (
                  <button
                    key={sizeObj.size}
                    onClick={() => setCrewSize(sizeObj.size as 1 | 2 | 3)}
                    className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 min-w-[80px] ${
                      crewSize === sizeObj.size
                        ? 'bg-purple-600 text-white shadow-md border border-purple-500'
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

            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search furniture, appliances, boxes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-purple-500 focus:ring-0 transition-all font-bold text-slate-700"
              />
            </div>

            {/* Items Grid */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredItems.map((item) => {
                const selected = selectedItems.find((i) => i.id === item.id);
                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md ${
                      selected
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                    onClick={() => !selected && addItem(item)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                          <item.icon className="w-6 h-6 text-slate-500" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900">{item.name}</h3>
                          <p className="text-xs text-slate-500 uppercase tracking-tight">
                            {item.category} • {item.volume.toFixed(2)} m³
                          </p>
                        </div>
                      </div>
                      
                      {selected ? (
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => updateQuantity(item.id, selected.quantity - 1)}
                            className="w-8 h-8 rounded-lg bg-slate-200 hover:bg-slate-300 flex items-center justify-center transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-bold text-slate-900">
                            {selected.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, selected.quantity + 1)}
                            className="w-8 h-8 rounded-lg bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center transition-colors"
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
                          className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-widest transition-all"
                        >
                          Add
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Navigation */}
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
                className={`flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-black text-lg transition-all ${
                  canProceed
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-xl active:scale-95'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Next: Get Pricing
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - SIDEBAR (40%) - IDENTICAL TO STEP 1 */}
        <div className="space-y-6 lg:sticky lg:top-4 lg:self-start order-first lg:order-last">
          {/* Quote Reference */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl shadow-sm border border-purple-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 font-medium mb-1">Quote ref:</p>
                <p className="text-xl font-bold text-slate-900">
                  {data.quoteReference || 'Generating...'}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Map */}
          {data.pickup?.lat && data.pickup?.lng && data.dropoff?.lat && data.dropoff?.lng && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
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

          {/* Summary Card */}
          <MoveSummaryCard
            quoteRef={data.quoteReference}
            pickupAddress={data.pickup?.address}
            deliveryAddress={data.dropoff?.address}
            pickupFloor={pickupFloor}
            deliveryFloor={deliveryFloor}
            liftAvailableAtPickup={data.pickup?.hasLift}
            liftAvailableAtDelivery={data.dropoff?.hasLift}
            distance={data.distance}
            totalVolume={totalVolume}
            selectedItems={selectedItems}
            moveDate={moveDate}
          />

          {/* Mini Inventory List */}
          {selectedItems.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-purple-600" />
                Selected Items ({totalItems})
              </h3>
              <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {selectedItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl group">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 text-sm truncate">{item.name}</p>
                      <p className="text-[10px] text-slate-500 uppercase font-bold">{item.quantity}x • {(item.volume * item.quantity).toFixed(2)} m³</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 rounded-lg hover:bg-red-100 text-red-500 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-600 uppercase tracking-wider">Total Volume</span>
                  <span className="text-xl font-black text-purple-600">{totalVolume.toFixed(2)} m³</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
