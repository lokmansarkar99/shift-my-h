import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  Search,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Home,
  Box,
  Truck,
  Sofa,
  Bike,
  ShoppingBag,
  Leaf,
  Hammer,
  Trash2,
  Recycle,
  Clock,
  Package,
  MapPin,
  Sparkles,
} from 'lucide-react';

import { QuoteRequest } from '../../../utils/pricingEngine';
import {
  INVENTORY_CATEGORIES,
  INVENTORY_ITEMS,
  QUICK_START_PRESETS,
} from '../../../utils/inventoryData';
import { getVehicleTypes } from '../../../utils/pricingEngine';
import { ClearanceInventoryStep, ClearanceStepData } from '../ClearanceInventoryStep';

// @ts-ignore
import mapboxgl from 'mapbox-gl';

interface StepProps {
  serviceType: string;
  data: QuoteRequest;
  onChange: (updates: Partial<QuoteRequest>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step2Inventory({ serviceType, data, onChange, onNext, onBack }: StepProps) {
  // ✅ CLEARANCE & REMOVAL: Use simplified inventory
  if (serviceType === 'clearance') {
    const handleClearanceNext = (clearanceData: ClearanceStepData) => {
      // Store clearance data in formData
      onChange({
        clearanceData,
        items: [], // Clearance doesn't use standard items
      });
      onNext();
    };

    return (
      <ClearanceInventoryStep
        onNext={handleClearanceNext}
        onBack={onBack}
        initialData={(data as any).clearanceData}
      />
    );
  }

  // ✅ STANDARD FLOW (House Move, Office Move, etc.)
  return <StandardInventoryStep data={data} onChange={onChange} onNext={onNext} onBack={onBack} />;
}

// ========================================
// STANDARD INVENTORY COMPONENT
// ========================================
interface StandardInventoryStepProps {
  data: QuoteRequest;
  onChange: (updates: Partial<QuoteRequest>) => void;
  onNext: () => void;
  onBack: () => void;
}

function StandardInventoryStep({ data, onChange, onNext, onBack }: StandardInventoryStepProps) {
  // UI state
  const [activeCategory, setActiveCategory] = useState('bedrooms');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);

  // Quantities
  const [itemQuantities, setItemQuantities] = useState<Record<string, number>>({});

  // Map refs
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const pickupMarker = useRef<any>(null);
  const dropoffMarker = useRef<any>(null);

  /** Sync selections from parent data.items so Back/Next keeps selections */
  useEffect(() => {
    const initial: Record<string, number> = {};
    (data.items || []).forEach((it: any) => {
      initial[it.id] = it.quantity;
    });
    setItemQuantities(initial);
  }, [data.items]);

  /** Init map once */
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const token = getMapboxToken();
    if (!token) return;

    mapboxgl.accessToken = token;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-3.435973, 55.378051],
      zoom: 6,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      pickupMarker.current?.remove?.();
      dropoffMarker.current?.remove?.();
      pickupMarker.current = null;
      dropoffMarker.current = null;

      map.current?.remove?.();
      map.current = null;
    };
  }, []);

  /** Update markers + bounds when addresses/coords change */
  useEffect(() => {
    if (!map.current) return;

    const pickup = (data as any)?.pickup?.coordinates;
    const dropoff = (data as any)?.dropoff?.coordinates;

    // Pickup marker
    if (pickup) {
      if (!pickupMarker.current) {
        pickupMarker.current = new mapboxgl.Marker({ color: '#3b82f6' }).addTo(map.current);
      }
      pickupMarker.current
        .setLngLat([pickup.lng, pickup.lat])
        .setPopup(
          new mapboxgl.Popup().setHTML(
            `<strong>Pickup</strong><br/>${(data as any)?.pickup?.address || ''}`
          )
        );
    } else {
      pickupMarker.current?.remove?.();
      pickupMarker.current = null;
    }

    // Dropoff marker
    if (dropoff) {
      if (!dropoffMarker.current) {
        dropoffMarker.current = new mapboxgl.Marker({ color: '#10b981' }).addTo(map.current);
      }
      dropoffMarker.current
        .setLngLat([dropoff.lng, dropoff.lat])
        .setPopup(
          new mapboxgl.Popup().setHTML(
            `<strong>Delivery</strong><br/>${(data as any)?.dropoff?.address || ''}`
          )
        );
    } else {
      dropoffMarker.current?.remove?.();
      dropoffMarker.current = null;
    }

    // Fit bounds if both exist
    if (pickup && dropoff) {
      const bounds = new mapboxgl.LngLatBounds();
      bounds.extend([pickup.lng, pickup.lat]);
      bounds.extend([dropoff.lng, dropoff.lat]);
      map.current.fitBounds(bounds, { padding: 60, duration: 600 });
    }
  }, [
    (data as any)?.pickup?.coordinates?.lng,
    (data as any)?.pickup?.coordinates?.lat,
    (data as any)?.dropoff?.coordinates?.lng,
    (data as any)?.dropoff?.coordinates?.lat,
    (data as any)?.pickup?.address,
    (data as any)?.dropoff?.address,
  ]);

  /** Items list filter */
  const filteredItems = useMemo(() => {
    let items = INVENTORY_ITEMS.filter((item: any) => item.category === activeCategory);

    if (showSelectedOnly) {
      items = items.filter((i: any) => (itemQuantities[i.id] || 0) > 0);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        (item: any) =>
          item.name.toLowerCase().includes(query) ||
          (item.description?.toLowerCase() || '').includes(query)
      );
    }

    return items;
  }, [activeCategory, searchQuery, showSelectedOnly, itemQuantities]);

  const metrics = useMemo(() => calculateInventoryMetrics(itemQuantities), [itemQuantities]);

  /** Summary by category for sidebar (cards) */
  const selectedByCategory = useMemo(() => {
    const mapCat: Record<
      string,
      {
        name: string;
        emoji?: string;
        items: Array<{ id: string; name: string; qty: number; volume: number }>;
      }
    > = {};

    for (const [id, qty] of Object.entries(itemQuantities)) {
      if (!qty || qty <= 0) continue;
      const item: any = INVENTORY_ITEMS.find((i: any) => i.id === id);
      if (!item) continue;

      const cat = INVENTORY_CATEGORIES.find((c: any) => c.id === item.category);
      const key = item.category;

      if (!mapCat[key]) mapCat[key] = { name: cat?.name || key, emoji: cat?.emoji, items: [] };
      mapCat[key].items.push({ id, name: item.name, qty, volume: item.volume });
    }

    return Object.entries(mapCat)
      .map(([catId, obj]) => ({
        catId,
        ...obj,
        totalQty: obj.items.reduce((s, x) => s + x.qty, 0),
      }))
      .sort((a, b) => b.totalQty - a.totalQty);
  }, [itemQuantities]);

  /** Update qty with clean object (delete key when 0) */
  const updateQuantity = (itemId: string, newQty: number) => {
    const qty = Math.max(0, newQty);

    const next = { ...itemQuantities };
    if (qty <= 0) delete next[itemId];
    else next[itemId] = qty;

    setItemQuantities(next);

    onChange({
      items: Object.entries(next)
        .filter(([_, q]) => q > 0)
        .map(([id, quantity]) => ({ id, quantity })),
    });
  };

  /** Presets */
  const applyPreset = (presetId: string) => {
    const preset = QUICK_START_PRESETS.find((p: any) => p.id === presetId);
    if (!preset) return;

    setItemQuantities(preset.items);

    onChange({
      items: Object.entries(preset.items)
        .filter(([_, q]) => q > 0)
        .map(([id, quantity]) => ({ id, quantity })),
    });
  };

  const clearAll = () => {
    setItemQuantities({});
    onChange({ items: [] });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
        <div className="max-w-[1800px] mx-auto px-8 py-6">
          <div className="flex items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-1">What are you moving?</h1>
              <p className="text-slate-500">Select items from the categories below</p>
            </div>

            {/* Quick start */}
            <div className="flex items-center gap-3 flex-wrap justify-end">
              <span className="text-sm text-slate-500 font-medium">Quick start:</span>
              {QUICK_START_PRESETS.map((preset: any) => (
                <button
                  key={preset.id}
                  onClick={() => applyPreset(preset.id)}
                  className="px-5 py-2.5 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5"
                >
                  <Sparkles className="w-4 h-4 inline mr-1.5" />
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1">
            {INVENTORY_CATEGORIES.map((cat: any) => {
              const isActive = activeCategory === cat.id;

              const categoryCount = Object.entries(itemQuantities)
                .filter(([id, qty]) => {
                  const item: any = INVENTORY_ITEMS.find((i: any) => i.id === id);
                  return item?.category === cat.id && qty > 0;
                })
                .reduce((sum, [_, qty]) => sum + (qty as number), 0);

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`relative px-6 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span className="text-lg">{cat.emoji}</span>
                  <span>{cat.name}</span>
                  {categoryCount > 0 && (
                    <span
                      className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {categoryCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1800px] mx-auto px-8 py-8 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8">
          {/* Left */}
          <div>
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for items..."
                  className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-2xl text-base font-medium placeholder:text-slate-400 focus:outline-none transition-all shadow-sm"
                />
              </div>

              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => setShowSelectedOnly((v) => !v)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition ${
                    showSelectedOnly
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {showSelectedOnly ? 'Showing selected' : 'Selected only'}
                </button>

                <button
                  onClick={clearAll}
                  className="px-4 py-2 rounded-xl text-sm font-semibold border-2 border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  Clear all
                </button>
              </div>
            </div>

            {/* Items grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredItems.map((item: any) => {
                const Icon = item.icon;
                const quantity = itemQuantities[item.id] || 0;

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`relative bg-white rounded-2xl border-2 p-6 transition-all hover:shadow-xl ${
                      quantity > 0
                        ? 'border-blue-500 shadow-lg shadow-blue-500/10'
                        : 'border-slate-200 hover:border-slate-300 shadow-sm'
                    }`}
                  >
                    {/* Icon & name */}
                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shrink-0 ${
                          quantity > 0
                            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        <Icon className="w-7 h-7" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-base text-slate-900 mb-0.5">{item.name}</h4>
                        <p className="text-xs text-slate-500">{item.volume}m³ per item</p>
                      </div>
                    </div>

                    {/* Qty controls */}
                    <div className="flex items-center justify-between gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, quantity - 1)}
                        disabled={quantity === 0}
                        className="w-12 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                      >
                        <Minus className="w-5 h-5 text-slate-700" />
                      </button>

                      <div className="flex-1 h-12 rounded-xl bg-slate-50 flex items-center justify-center border-2 border-slate-200">
                        <span className="text-xl font-black text-slate-900">{quantity}</span>
                      </div>

                      <button
                        onClick={() => updateQuantity(item.id, quantity + 1)}
                        className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white flex items-center justify-center transition-all shadow-lg shadow-blue-500/25 hover:shadow-xl hover:scale-105 active:scale-95"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Selected badge */}
                    {quantity > 0 && (
                      <div className="absolute top-4 right-4">
                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                          <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {filteredItems.length === 0 && (
              <div className="py-20 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200">
                <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-lg font-semibold text-slate-400">No items found</p>
                <p className="text-sm text-slate-400 mt-1">Try a different search term</p>
              </div>
            )}
          </div>

          {/* Right: Summary */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-5 text-white">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Package className="w-6 h-6" />
                  Your Move Overview
                </h3>
                <p className="text-slate-300 text-sm mt-1">Live summary of your selection</p>
              </div>

              {/* Map */}
              <div className="relative">
                <div ref={mapContainer} className="w-full h-64" />
                {(!(data as any)?.pickup?.coordinates && !(data as any)?.dropoff?.coordinates) && (
                  <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm text-slate-500 font-medium">Route map will appear here</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Pickup / Delivery */}
              <div className="p-6 border-t border-slate-200">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-0.5">
                        Pickup
                      </p>
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {(data as any)?.pickup?.address || 'Not set'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 rounded-full bg-green-500 mt-1.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-0.5">
                        Delivery
                      </p>
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {(data as any)?.dropoff?.address || 'Not set'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Inventory cards by category */}
              {metrics.totalItems > 0 && (
                <div className="p-6 border-t border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                      Your inventory
                    </p>
                    <span className="text-xs font-bold text-slate-700">{Object.values(itemQuantities).reduce((a, b) => a + b, 0)} items</span>
                  </div>

                  <div className="space-y-3 max-h-64 overflow-auto pr-1">
                    {selectedByCategory.map((cat) => (
                      <div
                        key={cat.catId}
                        className="bg-slate-50 rounded-2xl p-4 border border-slate-200"
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-slate-900 text-sm">
                            <span className="mr-2">{cat.emoji}</span>
                            {cat.name}
                          </div>
                          <div className="text-xs font-bold text-slate-600">{cat.totalQty}</div>
                        </div>

                        <div className="mt-2 space-y-1">
                          {cat.items.slice(0, 6).map((it) => (
                            <div key={it.id} className="flex items-center justify-between text-xs">
                              <span className="text-slate-700 truncate pr-2">
                                {it.qty}× {it.name}
                              </span>
                              <span className="text-slate-500">{(it.volume * it.qty).toFixed(1)}m³</span>
                            </div>
                          ))}
                          {cat.items.length > 6 && (
                            <div className="text-xs text-slate-500 font-semibold mt-1">
                              +{cat.items.length - 6} more…
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats */}
              {metrics.totalItems > 0 ? (
                <div className="p-6 border-t border-slate-200 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-2xl p-4 text-center">
                      <div className="text-3xl font-black text-blue-600">{Object.values(itemQuantities).reduce((a, b) => a + b, 0)}</div>
                      <div className="text-xs font-bold text-blue-600/70 uppercase tracking-wide mt-1">
                        Items
                      </div>
                    </div>
                    <div className="bg-purple-50 rounded-2xl p-4 text-center">
                      <div className="text-3xl font-black text-purple-600">
                        {metrics.totalVolume.toFixed(1)}m³
                      </div>
                      <div className="text-xs font-bold text-purple-600/70 uppercase tracking-wide mt-1">
                        Volume
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 text-white">
                    <div className="flex items-center gap-3 mb-2">
                      <Truck className="w-5 h-5 text-blue-400" />
                      <p className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                        Recommended vehicle
                      </p>
                    </div>
                    <p className="text-2xl font-black">
                      {metrics.recommendedVehicle?.icon || '🚚'} {metrics.recommendedVehicle?.name || 'Vehicle'}
                    </p>
                    <p className="text-sm text-slate-400 mt-1">
                      {metrics.recommendedVehicle?.description || ''}
                    </p>
                  </div>

                  <div className="flex items-center justify-between py-3 px-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-500" />
                      <span className="text-sm font-semibold text-slate-600">Estimated duration</span>
                    </div>
                    <span className="text-lg font-black text-slate-900">{metrics.estimatedHours}h</span>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                    <Package className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-sm font-semibold text-slate-500">No items selected yet</p>
                  <p className="text-xs text-slate-400 mt-1">Start adding items to see your summary</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200 shadow-2xl">
        <div className="max-w-[1800px] mx-auto px-8 py-5">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="px-6 py-3 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold transition-all flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>

            <button
              onClick={onNext}
              disabled={metrics.totalItems === 0}
              className="px-10 py-4 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-bold shadow-xl shadow-blue-500/30 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-3 text-lg disabled:from-slate-300 disabled:to-slate-400 disabled:shadow-none hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Continue</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}