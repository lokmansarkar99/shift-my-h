/**
 * Clearance & Removal - Step 2: Inventory Selection
 * SMART ROUTING - Un singur Step 2 cu componente diferite per service type
 */

import React, { useState, useEffect } from 'react';
import { ClearanceQuote } from './clearanceTypes';
import { ChevronRight, ArrowLeft, Package, MapPin, Trash2, Users } from 'lucide-react';
import { MapView } from '../../MapView';
import { getInventoryConfig, type InventoryMode } from './clearanceInventoryConfig';
import { FurnitureInventoryCards } from './inventories/FurnitureInventoryCards';
import { WasteInventoryCards } from './inventories/WasteInventoryCards';
import { BuildersInventoryCards } from './inventories/BuildersInventoryCards';
import { MixedInventoryCards } from './inventories/MixedInventoryCards';
import { getSelectedItemsList } from './inventories/inventoryItemsMapping';
import { calculateClearancePricing } from '../../../../utils/clearancePricingService';
import { loadPricingConfig } from '../../../../utils/pricingConfigService';
import { ClearanceSidebar } from './ClearanceSidebar';

interface StepProps {
  data: ClearanceQuote;
  onChange: (updates: Partial<ClearanceQuote>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function ClearanceStep2Inventory({ data, onChange, onNext, onBack }: StepProps) {
  // Get config based on service type from Step 1
  const serviceType = data.clearanceServiceType || 'House Clearance'; // Use from data or fallback
  const config = getInventoryConfig(serviceType);
  
  // State
  const [activeCard, setActiveCard] = useState(config.cards[0]?.id || '');
  const [items, setItems] = useState<Record<string, number>>({});
  const [disposalType, setDisposalType] = useState<'recyclable' | 'general' | 'restricted' | 'hazardous'>(
    data.clearanceDetails?.disposalType || 'general'
  );

  // Load existing items
  useEffect(() => {
    if (data.inventory?.items) {
      const itemsMap: Record<string, number> = {};
      data.inventory.items.forEach(item => {
        itemsMap[item.id] = item.quantity;
      });
      setItems(itemsMap);
    }
  }, [data]);

  const [crewSize, setCrewSize] = useState<1 | 2 | 3>(data.crewSize || 1);

  // Handle item update
  const handleUpdateItem = (itemId: string, quantity: number) => {
    const newItems = { ...items };
    if (quantity === 0) {
      delete newItems[itemId];
    } else {
      newItems[itemId] = quantity;
    }
    setItems(newItems);
    
    // Update parent data
    const inventoryItems = Object.entries(newItems).map(([id, qty]) => ({
      id,
      name: id, // TODO: Get actual name from item definitions
      quantity: qty,
      volume: 0.5 * qty, // Placeholder volume calculation
      loadTime: 5 * qty, // Placeholder time calculation
      unloadTime: 0,
    }));

    const totalVolume = inventoryItems.reduce((sum, item) => sum + item.volume, 0);
    const totalItems = Object.values(newItems).reduce((sum, qty) => sum + qty, 0);

    onChange({
      inventory: {
        items: inventoryItems,
        totalVolume,
        totalItems,
      },
      crewSize: crewSize
    });
  };

  // Calculate totals for summary
  const totalItems = Object.values(items).reduce((sum, qty) => sum + qty, 0);
  const totalVolume = totalItems * 0.5; // Placeholder calculation
  const estimatedLoadingTime = totalItems * 5; // Placeholder calculation
  
  const getVehicleSize = (volume: number): string => {
    if (volume <= 3) return 'Small van';
    if (volume <= 6) return 'Medium van';
    if (volume <= 10) return 'Large van';
    return 'Luton van';
  };

  const vehicleSize = getVehicleSize(totalVolume);

  const handleNext = () => {
    if (totalItems === 0) {
      alert('Please select at least one item');
      return;
    }
    onNext();
  };

  // Render appropriate inventory component based on mode
  const renderInventoryComponent = () => {
    const props = {
      activeCard,
      items,
      onUpdateItem: handleUpdateItem,
    };

    switch (config.inventoryMode) {
      case 'furniture':
        return <FurnitureInventoryCards {...props} />;
      case 'waste':
        return <WasteInventoryCards {...props} />;
      case 'builders':
        return <BuildersInventoryCards {...props} />;
      case 'mixed':
        return <MixedInventoryCards {...props} />;
      default:
        return <WasteInventoryCards {...props} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* 60/40 Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-6 lg:gap-8">
        
        {/* LEFT COLUMN - Main Content (60%) */}
        <div className="space-y-6 order-last lg:order-first">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:p-8">
            
            {/* Integrated Header & Crew Selection */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-slate-100 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shrink-0">
                  <Trash2 className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">
                    {serviceType}
                  </h1>
                  <p className="text-sm text-slate-500">Select items for removal</p>
                </div>
              </div>

              {/* Crew Selection - Bold Integrated Version */}
              <div className="bg-slate-50 p-1.5 rounded-2xl border border-slate-200 flex items-center gap-1">
                {[
                  { size: 1, label: '1 Man', icon: <Users className="w-5 h-5" /> },
                  { size: 2, label: '2 Men', icon: <div className="flex -space-x-1.5"><Users className="w-5 h-5" /><Users className="w-5 h-5" /></div> },
                  { size: 3, label: '3 Men', icon: <div className="flex -space-x-2"><Users className="w-5 h-5" /><Users className="w-5 h-5" /><Users className="w-5 h-5" /></div> }
                ].map((item) => (
                  <button
                    key={item.size}
                    onClick={() => {
                      setCrewSize(item.size as 1 | 2 | 3);
                      onChange({ crewSize: item.size as 1 | 2 | 3 });
                    }}
                    className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 min-w-[80px] ${
                      crewSize === item.size
                        ? 'bg-red-600 text-white shadow-md border border-red-500'
                        : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
                    }`}
                  >
                    <div className={`${crewSize === item.size ? 'text-white' : 'text-slate-300'}`}>
                      {item.icon}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Card Selector (Tabs) */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {config.cards.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => setActiveCard(card.id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
                      activeCard === card.id
                        ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span className="text-lg">{card.icon}</span>
                    <span>{card.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Inventory Component (changes based on mode) */}
            <div className="max-h-[600px] overflow-y-auto pr-2">
              {renderInventoryComponent()}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-200">
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-6 py-3 text-slate-700 font-semibold hover:bg-slate-100 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Previous Step
              </button>
              <button
                onClick={handleNext}
                disabled={totalItems === 0}
                className={`flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all ${
                  totalItems === 0
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-red-600 to-orange-600 text-white hover:shadow-xl'
                }`}
              >
                Continue
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Map & Summary (40%) - CONSISTENT SIDEBAR */}
        <ClearanceSidebar data={data} currentStep={2} />
      </div>
    </div>
  );
}