/**
 * Motorbike & Bicycle - Step 2: Inventory Selection
 * Select from pre-defined motorbikes/bicycles or add custom ones
 */

import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Plus, X, Bike, Bike as MotorbikeIcon, Users } from 'lucide-react';
import { MotorbikeQuote, InventoryItem } from './motorbikeTypes';
import { MapView } from '../../MapView';
import { MoveSummaryCard } from '../../MoveSummaryCard';

interface StepProps {
  data: MotorbikeQuote;
  onChange: (updates: Partial<MotorbikeQuote>) => void;
  onNext: () => void;
  onBack: () => void;
}

// Pre-defined motorbike types
const MOTORBIKE_LIST = [
  { name: 'Honda CBR600RR', category: 'Sport Bike', volume: 0.8 },
  { name: 'Yamaha YZF-R6', category: 'Sport Bike', volume: 0.8 },
  { name: 'Kawasaki Ninja 650', category: 'Sport Bike', volume: 0.8 },
  { name: 'Suzuki GSX-R750', category: 'Sport Bike', volume: 0.9 },
  { name: 'Ducati Panigale V2', category: 'Sport Bike', volume: 0.8 },
  { name: 'BMW S1000RR', category: 'Sport Bike', volume: 0.9 },
  { name: 'Harley-Davidson Street 750', category: 'Cruiser', volume: 1.2 },
  { name: 'Triumph Street Triple', category: 'Naked', volume: 0.9 },
  { name: 'KTM Duke 390', category: 'Naked', volume: 0.7 },
  { name: 'Royal Enfield Classic 350', category: 'Classic', volume: 1.0 },
];

// Pre-defined bicycle types
const BICYCLE_LIST = [
  { name: 'Mountain Bike', category: 'Off-road', volume: 0.3 },
  { name: 'Road Bike', category: 'Racing', volume: 0.25 },
  { name: 'Hybrid Bike', category: 'Commuter', volume: 0.3 },
  { name: 'Electric Bike (E-bike)', category: 'Electric', volume: 0.4 },
  { name: 'BMX', category: 'Stunt', volume: 0.2 },
  { name: 'Folding Bike', category: 'Portable', volume: 0.15 },
  { name: 'Touring Bike', category: 'Long-distance', volume: 0.35 },
  { name: 'Cruiser Bike', category: 'Leisure', volume: 0.3 },
  { name: 'Gravel Bike', category: 'Adventure', volume: 0.3 },
  { name: 'Kids Bike', category: 'Children', volume: 0.2 },
];

const FLOOR_OPTIONS = ['Basement', 'Ground floor', '1st', '2nd', '3rd', '4th', '5th+'];

export function MotorbikeStep2Inventory({ data, onChange, onNext, onBack }: StepProps) {
  const [selectedType, setSelectedType] = useState<'motorbike' | 'bicycle'>('motorbike');
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
    const updatedVolume = totalVolume - itemToRemove.volume;

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
      const volume = selectedType === 'motorbike' ? 0.8 : 0.3;
      addItem(customName, volume, 'Custom');
    }
  };

  const canProceed = items.length > 0;

  // Get data for sidebar
  const pickupFloor = FLOOR_OPTIONS[data.pickup.floor] || 'Ground floor';
  const deliveryFloor = FLOOR_OPTIONS[data.dropoff.floor] || 'Ground floor';
  const moveDate = data.date && !data.dateUnsure
    ? (data.date instanceof Date ? data.date.toISOString().split('T')[0] : typeof data.date === 'string' ? data.date : '')
    : undefined;

  return (
    <div className="space-y-6">
      {/* 2 Column Layout - 60/40 split */}
      <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-6 lg:gap-8">
        {/* LEFT COLUMN - FORM (60%) */}
        <div className="space-y-6 order-last lg:order-first">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:p-8">
            {/* Integrated Header & Crew Selection */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg shrink-0">
                  <MotorbikeIcon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    What are you transporting?
                  </h2>
                  <p className="text-sm text-slate-500">Select motorbikes or bicycles</p>
                </div>
              </div>

              {/* Crew Selection - Bold Integrated Version */}
              <div className="bg-slate-50 p-1.5 rounded-2xl border border-slate-200 flex items-center gap-1 self-start md:self-center">
                {[
                  { size: 1, label: '1 Man', icon: <Users className="w-5 h-5" /> },
                  { size: 2, label: '2 Men', icon: <div className="flex -space-x-1.5"><Users className="w-5 h-5" /><Users className="w-5 h-5" /></div> },
                  { size: 3, label: '3 Men', icon: <div className="flex -space-x-2"><Users className="w-5 h-5" /><Users className="w-5 h-5" /><Users className="w-5 h-5" /></div> }
                ].map((item) => (
                  <button
                    key={item.size}
                    onClick={() => handleCrewChange(item.size as 1 | 2 | 3)}
                    className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 min-w-[80px] ${
                      crewSize === item.size
                        ? 'bg-white text-blue-600 shadow-md border border-blue-100 ring-1 ring-blue-50'
                        : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
                    }`}
                  >
                    <div className={`${crewSize === item.size ? 'text-blue-600' : 'text-slate-300'}`}>
                      {item.icon}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Type Selector */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setSelectedType('motorbike')}
                className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                  selectedType === 'motorbike'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-slate-200 bg-white hover:border-blue-300'
                }`}
              >
                <div className="flex items-center justify-center gap-3">
                  <MotorbikeIcon className={`w-6 h-6 ${selectedType === 'motorbike' ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span className={`font-semibold ${selectedType === 'motorbike' ? 'text-blue-600' : 'text-slate-600'}`}>
                    Motorbike
                  </span>
                </div>
              </button>

              <button
                onClick={() => setSelectedType('bicycle')}
                className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                  selectedType === 'bicycle'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-slate-200 bg-white hover:border-blue-300'
                }`}
              >
                <div className="flex items-center justify-center gap-3">
                  <Bike className={`w-6 h-6 ${selectedType === 'bicycle' ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span className={`font-semibold ${selectedType === 'bicycle' ? 'text-blue-600' : 'text-slate-600'}`}>
                    Bicycle
                  </span>
                </div>
              </button>
            </div>

            {/* Selected Items */}
            {items.length > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200 p-6 mb-6">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center justify-between">
                  <span>Selected Items ({items.reduce((sum, i) => sum + i.quantity, 0)})</span>
                  <span className="text-sm text-slate-600">Total Volume: {totalVolume.toFixed(2)} m³</span>
                </h3>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        {item.category?.includes('Bike') || item.name.includes('Bike') ? (
                          <Bike className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        ) : (
                          <MotorbikeIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <span className="font-medium text-slate-900">{item.name}</span>
                          {item.category && (
                            <span className="text-xs text-slate-500 ml-2">({item.category})</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-700"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-700"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 hover:bg-red-100 rounded transition-colors"
                        >
                          <X className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Motorbike List */}
            {selectedType === 'motorbike' && (
              <div className="mb-6">
                <h3 className="font-semibold text-slate-900 mb-4">Popular Motorbikes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {MOTORBIKE_LIST.map((bike, index) => (
                    <button
                      key={index}
                      onClick={() => addItem(bike.name, bike.volume, bike.category)}
                      className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all group text-left"
                    >
                      <div className="flex items-center gap-3">
                        <MotorbikeIcon className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
                        <div>
                          <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600 block">
                            {bike.name}
                          </span>
                          <span className="text-xs text-slate-500">{bike.category}</span>
                        </div>
                      </div>
                      <Plus className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Bicycle List */}
            {selectedType === 'bicycle' && (
              <div className="mb-6">
                <h3 className="font-semibold text-slate-900 mb-4">Bicycle Types</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {BICYCLE_LIST.map((bike, index) => (
                    <button
                      key={index}
                      onClick={() => addItem(bike.name, bike.volume, bike.category)}
                      className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all group text-left"
                    >
                      <div className="flex items-center gap-3">
                        <Bike className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
                        <div>
                          <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600 block">
                            {bike.name}
                          </span>
                          <span className="text-xs text-slate-500">{bike.category}</span>
                        </div>
                      </div>
                      <Plus className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Input */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">
                  Add Custom {selectedType === 'motorbike' ? 'Motorbike' : 'Bicycle'}
                </h3>
                <button
                  onClick={() => setShowCustomInput(!showCustomInput)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  {showCustomInput ? 'Hide' : 'Show'} Form
                </button>
              </div>

              {showCustomInput && (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder={`e.g., ${selectedType === 'motorbike' ? 'Custom Sport Bike' : 'Custom Mountain Bike'}`}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && customName.trim()) {
                        handleAddCustom();
                      }
                    }}
                  />
                  <button
                    onClick={handleAddCustom}
                    disabled={!customName.trim()}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Plus className="w-5 h-5" />
                      Add Custom {selectedType === 'motorbike' ? 'Motorbike' : 'Bicycle'}
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex gap-4">
              <button
                onClick={onBack}
                className="flex-1 px-6 py-3 rounded-lg font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" /> Back
              </button>
              <button
                onClick={onNext}
                disabled={!canProceed}
                className="flex-1 px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                Next <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {!canProceed && (
              <p className="text-center text-sm text-amber-600 mt-4">
                Please add at least one item to continue
              </p>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN - MAP + SUMMARY (40%) */}
        <div className="space-y-6 lg:sticky lg:top-4 lg:self-start order-first lg:order-last">
          {/* Quote Reference */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl shadow-sm border border-blue-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 font-medium mb-1">Quote ref:</p>
                <p className="text-xl font-bold text-slate-900">
                  {data.quoteReference || 'Generating...'}
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

          {/* My Item List */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-900 mb-2 flex items-center justify-between text-sm">
              <span>My Item List ({items.reduce((sum, i) => sum + i.quantity, 0)})</span>
              {items.length > 0 && (
                <span className="text-xs text-slate-500">{totalVolume.toFixed(2)} m³</span>
              )}
            </h3>
            
            {items.length === 0 ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Bike className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-xs text-slate-600 font-medium mb-0.5">
                  No items added yet
                </p>
                <p className="text-[10px] text-slate-500">
                  Go back to add items
                </p>
              </div>
            ) : (
              <div className="space-y-1.5 max-h-[280px] overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-200"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {item.category?.includes('Bike') || item.name.includes('Bike') ? (
                        <Bike className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                      ) : (
                        <MotorbikeIcon className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-900 truncate">
                          {item.name}
                        </p>
                        {item.category && (
                          <p className="text-[10px] text-slate-500 truncate">{item.category}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[10px] font-semibold text-slate-600 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                        ×{item.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Summary Card */}
          <MoveSummaryCard
            quoteRef={data.quoteReference || ''}
            pickupAddress={data.pickup.address}
            deliveryAddress={data.dropoff.address}
            pickupPropertyType=""
            deliveryPropertyType=""
            pickupFloor={pickupFloor}
            deliveryFloor={deliveryFloor}
            liftAvailableAtPickup={data.pickup.hasLift}
            liftAvailableAtDelivery={data.dropoff.hasLift}
            distance={data.distance}
            duration={data.duration}
            moveDate={moveDate}
            hasDateSelected={!data.dateUnsure}
            arrivalTimeFrom={480}
            arrivalTimeTo={600}
            selectedItems={items}
          />
        </div>
      </div>
    </div>
  );
}