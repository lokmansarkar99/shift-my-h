/**
 * Other Delivery - Step 2: Inventory Selection
 * Select from general item categories or add custom delivery items
 */

import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Plus, Minus, X, Package, Truck, Boxes, ShoppingBag, LayoutGrid, Search, Users } from 'lucide-react';
import { OtherQuote, InventoryItem } from './otherTypes';
import { MapView } from '../../MapView';
import { MoveSummaryCard } from '../../MoveSummaryCard';

interface StepProps {
  data: OtherQuote;
  onChange: (updates: Partial<OtherQuote>) => void;
  onNext: () => void;
  onBack: () => void;
}

// Pre-defined general delivery items
const GENERAL_ITEMS = [
  { name: 'Small Box', category: 'Packaging', volume: 0.1 },
  { name: 'Medium Box', category: 'Packaging', volume: 0.2 },
  { name: 'Large Box', category: 'Packaging', volume: 0.35 },
  { name: 'Suitcase', category: 'Luggage', volume: 0.25 },
  { name: 'Rucksack / Bag', category: 'Luggage', volume: 0.1 },
  { name: 'Office Chair', category: 'Furniture', volume: 0.4 },
  { name: 'Small Desk', category: 'Furniture', volume: 0.6 },
  { name: 'Monitor', category: 'Electronics', volume: 0.15 },
  { name: 'Small Printer', category: 'Electronics', volume: 0.2 },
  { name: 'Coffee Table', category: 'Furniture', volume: 0.5 },
];

const FLOOR_OPTIONS = ['Basement', 'Ground floor', '1st', '2nd', '3rd', '4th', '5th+'];

export function OtherStep2Inventory({ data, onChange, onNext, onBack }: StepProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [customName, setCustomName] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const items = data.items || [];
  const totalVolume = data.totalVolume || 0;

  const [crewSize, setCrewSize] = useState<1 | 2 | 3>(data.crewSize || 1);

  const addItem = (name: string, volume: number, category?: string) => {
    const newItem: InventoryItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      quantity: 1,
      volume,
      category,
    };

    const updatedItems = [...items, newItem];
    const updatedVolume = totalVolume + volume;

    onChange({
      items: updatedItems,
      totalVolume: updatedVolume,
      crewSize: crewSize
    });

    setCustomName('');
    setShowCustomInput(false);
  };

  const removeItem = (id: string) => {
    const itemToRemove = items.find(item => item.id === id);
    if (!itemToRemove) return;

    const updatedItems = items.filter(item => item.id !== id);
    const updatedVolume = totalVolume - (itemToRemove.volume * itemToRemove.quantity);

    onChange({
      items: updatedItems,
      totalVolume: Math.max(0, updatedVolume),
      crewSize: crewSize
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;

    const item = items.find(i => i.id === id);
    if (!item) return;

    const volumeDiff = (quantity - item.quantity) * item.volume;
    const updatedItems = items.map(i => 
      i.id === id ? { ...i, quantity } : i
    );

    onChange({
      items: updatedItems,
      totalVolume: totalVolume + volumeDiff,
      crewSize: crewSize
    });
  };

  const handleCrewChange = (size: 1 | 2 | 3) => {
    setCrewSize(size);
    onChange({ crewSize: size });
  };

  const handleAddCustom = () => {
    if (customName.trim()) {
      addItem(customName, 0.3, 'Custom Item');
    }
  };

  const filteredItems = GENERAL_ITEMS.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const canProceed = items.length > 0;

  // Get data for sidebar
  const pFloor = data.pickup?.floor || 0;
  const dFloor = data.dropoff?.floor || 0;
  const pickupFloor = FLOOR_OPTIONS[pFloor] || 'Ground floor';
  const deliveryFloor = FLOOR_OPTIONS[dFloor] || 'Ground floor';
  
  const moveDate = data.date && !data.dateUnsure
    ? (data.date instanceof Date ? data.date.toISOString().split('T')[0] : typeof data.date === 'string' ? data.date : '')
    : undefined;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-6 lg:gap-8">
        {/* LEFT COLUMN */}
        <div className="space-y-6 order-last lg:order-first">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 lg:p-8">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shrink-0">
                  <Boxes className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
                    Inventory
                  </h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                    What items for delivery?
                  </p>
                </div>
              </div>

              {/* Crew Selection - Bold Integrated Version */}
              <div className="bg-slate-900 rounded-3xl p-2 flex items-center gap-1.5 border border-slate-800 shadow-2xl self-start md:self-center">
                {[
                  { size: 1, label: '1 Man', icon: <Users className="w-5 h-5" /> },
                  { size: 2, label: '2 Men', icon: <div className="flex -space-x-1.5"><Users className="w-5 h-5" /><Users className="w-5 h-5" /></div> },
                  { size: 3, label: '3 Men', icon: <div className="flex -space-x-2"><Users className="w-5 h-5" /><Users className="w-5 h-5" /><Users className="w-5 h-5" /></div> }
                ].map((sizeObj) => (
                  <button
                    key={sizeObj.size}
                    onClick={() => handleCrewChange(sizeObj.size as 1 | 2 | 3)}
                    className={`flex flex-col items-center justify-center gap-1.5 px-5 py-3 rounded-2xl transition-all duration-200 min-w-[85px] ${
                      crewSize === sizeObj.size
                        ? 'bg-amber-500 text-slate-900 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                        : 'text-slate-500 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <div className={`${crewSize === sizeObj.size ? 'text-slate-900' : 'text-slate-600'}`}>
                      {sizeObj.icon}
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest">{sizeObj.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Search */}
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search items or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-amber-500 focus:ring-0 transition-all font-bold text-slate-700"
              />
            </div>

            {/* General Items Grid */}
            <div className="mb-10">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Popular Delivery Items</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => addItem(item.name, item.volume, item.category)}
                    className="flex items-center justify-between p-4 border-2 border-slate-100 rounded-2xl hover:border-amber-500 hover:bg-amber-50/50 transition-all group text-left active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-white transition-colors">
                        <Package className="w-5 h-5 text-slate-400 group-hover:text-amber-600" />
                      </div>
                      <div>
                        <span className="text-sm font-black text-slate-700 group-hover:text-amber-900 block">
                          {item.name}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.category}</span>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-all shadow-sm">
                       <Plus className="w-4 h-4" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input */}
            <div className="bg-slate-50 rounded-[2rem] p-8 mb-10 border border-slate-200">
               <div className="flex items-center gap-3 mb-6">
                 <LayoutGrid className="w-5 h-5 text-amber-600" />
                 <h3 className="font-black text-slate-900 uppercase tracking-tight">Add Custom Item</h3>
               </div>
               
               <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Describe your item..."
                    className="flex-1 px-6 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:border-amber-500 focus:ring-0 transition-all font-bold"
                  />
                  <button
                    onClick={handleAddCustom}
                    disabled={!customName.trim()}
                    className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-black disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-xl active:scale-95"
                  >
                    Add to List
                  </button>
               </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-4 pt-8 border-t border-slate-100">
              <button
                onClick={onBack}
                className="flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-400 bg-slate-50 hover:bg-slate-100 transition-all border border-slate-200 active:scale-95"
              >
                <ArrowLeft className="w-5 h-5" /> Back
              </button>
              <button
                onClick={onNext}
                disabled={!canProceed}
                className={`flex-1 max-w-sm flex items-center justify-center gap-3 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-2xl active:scale-95 ${
                  canProceed
                    ? 'bg-slate-900 text-white hover:bg-black shadow-slate-200'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
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
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl shadow-sm border border-amber-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-amber-700 font-black uppercase tracking-widest mb-1">Quote ref:</p>
                <p className="text-xl font-black text-slate-900 font-mono tracking-tighter">
                  {data.quoteReference || 'SMH-XXXXX-XXXX'}
                </p>
              </div>
              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                <LayoutGrid className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-4">
            <MapView
              pickupLat={data.pickup?.lat}
              pickupLng={data.pickup?.lng}
              deliveryLat={data.dropoff?.lat}
              deliveryLng={data.dropoff?.lng}
              onRouteUpdate={(dist) => {
                onChange({ distance: dist });
              }}
            />
          </div>

          {/* Current Inventory Card */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-between">
              <span>Current Inventory ({items.reduce((sum, i) => sum + i.quantity, 0)})</span>
              <span className="text-slate-900">{totalVolume.toFixed(2)} m³</span>
            </h3>
            
            {items.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <ShoppingBag className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                <p className="text-xs font-bold text-slate-500 uppercase">Your list is empty</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 group"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0 border border-slate-100 shadow-sm">
                        <Package className="w-4 h-4 text-amber-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-slate-900 truncate uppercase tracking-tight">
                          {item.name}
                        </p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">{item.category}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex items-center bg-white rounded-lg border border-slate-200 p-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-md hover:bg-red-50 text-red-600 flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-3 h-3 stroke-[3]" />
                        </button>
                        <span className="w-6 text-center text-xs font-black text-slate-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-md hover:bg-emerald-50 text-emerald-600 flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-3 h-3 stroke-[3]" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 hover:bg-red-100 rounded-lg text-red-500 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Move Summary Card */}
          <MoveSummaryCard
            quoteRef={data.quoteReference || ''}
            pickupAddress={data.pickup?.address}
            deliveryAddress={data.dropoff?.address}
            pickupPropertyType=""
            deliveryPropertyType=""
            pickupFloor={pickupFloor}
            deliveryFloor={deliveryFloor}
            liftAvailableAtPickup={data.pickup?.hasLift}
            liftAvailableAtDelivery={data.dropoff?.hasLift}
            distance={data.distance}
            duration={data.duration}
            moveDate={moveDate}
            hasDateSelected={!data.dateUnsure}
            selectedItems={items}
          />
        </div>
      </div>
    </div>
  );
}
