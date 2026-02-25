import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QuoteHeader } from '../QuoteHeader';
import { QuoteProgressBar } from '../QuoteProgressBar';
import { router } from '../../../utils/router';
import { saveQuoteData, getQuoteData, updateLastStep } from '../../../utils/quoteStorage';
import { ArrowLeft, Search, Plus, Minus, Trash2, Package, Navigation, Copy, Check, ChevronDown, ChevronUp, Edit } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

// 🪑 FURNITURE CATEGORIES WITH VOLUME DATA
const FURNITURE_CATEGORIES = [
  {
    id: 'sofas',
    name: 'Sofas',
    icon: '🛋️',
    items: [
      { id: 'sofa-2-seater', name: 'Two Seater Sofa', size: 'Standard', volume: 1.8 },
      { id: 'sofa-3-seater', name: 'Three Seater Sofa', size: 'Large', volume: 2.5 },
      { id: 'sofa-l-shaped', name: 'L-Shaped Sofa', size: 'Extra Large', volume: 3.2 },
      { id: 'sofa-armchair', name: 'Armchair', size: 'Small', volume: 0.8 },
      { id: 'sofa-recliner', name: 'Recliner', size: 'Standard', volume: 1.2 },
    ],
  },
  {
    id: 'wardrobes',
    name: 'Wardrobes',
    icon: '🚪',
    items: [
      { id: 'wardrobe-single', name: 'Single Wardrobe', size: 'Small', volume: 1.5 },
      { id: 'wardrobe-double', name: 'Double Wardrobe', size: 'Medium', volume: 2.5 },
      { id: 'wardrobe-sliding', name: 'Sliding Wardrobe', size: 'Large', volume: 3.0 },
      { id: 'wardrobe-fitted', name: 'Fitted Wardrobe (per panel)', size: 'Standard', volume: 1.0 },
    ],
  },
  {
    id: 'boxes',
    name: 'Boxes',
    icon: '📦',
    items: [
      { id: 'box-small', name: 'Small Box', size: '30×30×30cm', volume: 0.027 },
      { id: 'box-medium', name: 'Medium Box', size: '45×45×45cm', volume: 0.091 },
      { id: 'box-large', name: 'Large Box', size: '60×60×60cm', volume: 0.216 },
      { id: 'box-xlarge', name: 'Extra Large Box', size: '75×75×75cm', volume: 0.421 },
    ],
  },
  {
    id: 'beds',
    name: 'Beds & Mattresses',
    icon: '🛏️',
    items: [
      { id: 'bed-single', name: 'Single Bed', size: 'Small', volume: 1.2 },
      { id: 'bed-double', name: 'Double Bed', size: 'Medium', volume: 1.8 },
      { id: 'bed-king', name: 'King Size Bed', size: 'Large', volume: 2.2 },
      { id: 'bed-super-king', name: 'Super King Bed', size: 'Extra Large', volume: 2.6 },
      { id: 'mattress-single', name: 'Single Mattress', size: 'Small', volume: 0.6 },
      { id: 'mattress-double', name: 'Double Mattress', size: 'Medium', volume: 0.9 },
      { id: 'mattress-king', name: 'King Mattress', size: 'Large', volume: 1.1 },
      { id: 'bed-frame', name: 'Bed Frame', size: 'Standard', volume: 0.8 },
    ],
  },
  {
    id: 'tables',
    name: 'Tables',
    icon: '🪑',
    items: [
      { id: 'table-dining-4', name: 'Dining Table (4 seater)', size: 'Small', volume: 1.2 },
      { id: 'table-dining-6', name: 'Dining Table (6 seater)', size: 'Medium', volume: 1.8 },
      { id: 'table-dining-8', name: 'Dining Table (8 seater)', size: 'Large', volume: 2.4 },
      { id: 'table-coffee', name: 'Coffee Table', size: 'Standard', volume: 0.4 },
      { id: 'table-side', name: 'Side Table', size: 'Small', volume: 0.2 },
      { id: 'table-desk', name: 'Desk', size: 'Standard', volume: 0.8 },
    ],
  },
  {
    id: 'televisions',
    name: 'Televisions',
    icon: '📺',
    items: [
      { id: 'tv-small', name: 'Small TV', size: '< 32"', volume: 0.15 },
      { id: 'tv-medium', name: 'Medium TV', size: '32"-50"', volume: 0.25 },
      { id: 'tv-large', name: 'Large TV', size: '> 50"', volume: 0.35 },
      { id: 'tv-stand', name: 'TV Stand', size: 'Standard', volume: 0.6 },
    ],
  },
  {
    id: 'chairs',
    name: 'Chairs',
    icon: '🪑',
    items: [
      { id: 'chair-dining', name: 'Dining Chair', size: 'Standard', volume: 0.3 },
      { id: 'chair-office', name: 'Office Chair', size: 'Standard', volume: 0.5 },
      { id: 'chair-folding', name: 'Folding Chair', size: 'Small', volume: 0.2 },
    ],
  },
  {
    id: 'clothing',
    name: 'Clothing',
    icon: '👕',
    items: [
      { id: 'clothing-box', name: 'Clothing Box', size: 'Standard', volume: 0.15 },
      { id: 'suitcase', name: 'Suitcase', size: 'Medium', volume: 0.08 },
      { id: 'garment-bag', name: 'Garment Bag', size: 'Large', volume: 0.12 },
    ],
  },
  {
    id: 'appliances',
    name: 'Appliances',
    icon: '🔌',
    items: [
      { id: 'fridge', name: 'Refrigerator', size: 'Large', volume: 1.8 },
      { id: 'washing-machine', name: 'Washing Machine', size: 'Medium', volume: 1.2 },
      { id: 'dishwasher', name: 'Dishwasher', size: 'Medium', volume: 0.9 },
      { id: 'microwave', name: 'Microwave', size: 'Small', volume: 0.1 },
    ],
  },
];

export function QuoteStep2Page() {
  const [quoteData, setQuoteData] = useState<any>({});
  const [selectedItems, setSelectedItems] = useState<Array<{ id: string; name: string; quantity: number; volume: number }>>([]);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [quoteRef, setQuoteRef] = useState('');
  const [copied, setCopied] = useState(false);
  const [animatingItemId, setAnimatingItemId] = useState<string | null>(null);
  const [showAddCustomItem, setShowAddCustomItem] = useState(false);
  const [customItemName, setCustomItemName] = useState('');
  const [customItemQuantity, setCustomItemQuantity] = useState(1);

  // Load saved data on mount
  useEffect(() => {
    const savedData = getQuoteData();
    setQuoteData(savedData);
    
    if (savedData.quoteRef) {
      setQuoteRef(savedData.quoteRef);
    }
    
    if (savedData.selectedItems && savedData.selectedItems.length > 0) {
      const itemsWithVolume = savedData.selectedItems.map((item: any) => {
        let volume = 0.1;
        FURNITURE_CATEGORIES.forEach(cat => {
          const found = cat.items.find(i => i.id === item.id);
          if (found) volume = found.volume;
        });
        return { ...item, volume };
      });
      setSelectedItems(itemsWithVolume);
    }
  }, []);

  // Calculate total volume LIVE
  const totalVolume = selectedItems.reduce((sum, item) => sum + (item.volume * item.quantity), 0);
  const totalItemsCount = selectedItems.reduce((sum, item) => sum + item.quantity, 0);

  // Get volume recommendation
  const getVolumeRecommendation = (): { text: string; icon: string; color: string } => {
    if (totalVolume < 5) {
      return {
        text: 'Small move - Suitable for Small Van / 1 Man',
        icon: '🚐',
        color: 'text-green-700 bg-green-50 border-green-200',
      };
    } else if (totalVolume < 12) {
      return {
        text: 'Medium move - Suitable for Medium Van / 2 Men',
        icon: '🚚',
        color: 'text-amber-700 bg-amber-50 border-amber-200',
      };
    } else {
      return {
        text: 'Large move - Suitable for Large Van / 3+ Men',
        icon: '🚛',
        color: 'text-red-700 bg-red-50 border-red-200',
      };
    }
  };

  const volumeRec = getVolumeRecommendation();

  // Add item or increase quantity with animation
  const addItem = (itemId: string, itemName: string, volume: number) => {
    setAnimatingItemId(itemId);
    setTimeout(() => setAnimatingItemId(null), 600);

    const existing = selectedItems.find(i => i.id === itemId);
    if (existing) {
      setSelectedItems(selectedItems.map(i =>
        i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      setSelectedItems([...selectedItems, { id: itemId, name: itemName, quantity: 1, volume }]);
      toast.success(`Added: ${itemName}`, {
        duration: 2000,
        position: 'bottom-right',
      });
    }
  };

  // Decrease item quantity
  const decreaseItem = (itemId: string) => {
    const existing = selectedItems.find(i => i.id === itemId);
    if (existing && existing.quantity > 1) {
      setSelectedItems(selectedItems.map(i =>
        i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
      ));
    } else {
      setSelectedItems(selectedItems.filter(i => i.id !== itemId));
    }
  };

  // Remove item completely
  const removeItem = (itemId: string) => {
    setSelectedItems(selectedItems.filter(i => i.id !== itemId));
    toast.success('Item removed', {
      duration: 2000,
      position: 'bottom-right',
    });
  };

  // Get item quantity
  const getItemQuantity = (itemId: string): number => {
    const item = selectedItems.find(i => i.id === itemId);
    return item ? item.quantity : 0;
  };

  // Group selected items by category
  const groupItemsByCategory = () => {
    const grouped: Record<string, Array<any>> = {};

    selectedItems.forEach(item => {
      let categoryName = 'Other';
      FURNITURE_CATEGORIES.forEach(cat => {
        const found = cat.items.find(i => i.id === item.id);
        if (found) categoryName = cat.name;
      });

      if (!grouped[categoryName]) {
        grouped[categoryName] = [];
      }
      grouped[categoryName].push(item);
    });

    return grouped;
  };

  // Handle Back
  const handleBack = () => {
    saveQuoteData({ selectedItems });
    router.navigate({ page: 'quote-step', step: 1 });
  };

  // Handle Get Prices
  const handleGetPrices = () => {
    if (selectedItems.length === 0) {
      toast.error('Please select at least one item', {
        duration: 3000,
        position: 'bottom-right',
      });
      return;
    }

    saveQuoteData({
      selectedItems,
      furnitureTotalVolume: totalVolume,
    });
    updateLastStep(2);
    router.navigate({ page: 'quote-step', step: 3 });
  };

  // Add custom item
  const handleAddCustomItem = () => {
    if (!customItemName.trim()) {
      toast.error('Please enter an item name', {
        duration: 2000,
        position: 'bottom-right',
      });
      return;
    }

    const customId = `custom-${Date.now()}`;
    addItem(customId, customItemName.trim(), 0.5);
    
    // Reset form
    setCustomItemName('');
    setCustomItemQuantity(1);
    setShowAddCustomItem(false);
  };

  // Copy quote ref
  const handleCopyQuoteRef = async () => {
    if (!quoteRef) return;
    
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(quoteRef);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = quoteRef;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      
      setCopied(true);
      toast.success('Quote reference copied!', {
        duration: 2000,
        position: 'bottom-right',
      });
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy quote reference:', error);
      toast.error('Failed to copy. Please try again.', {
        duration: 2000,
        position: 'bottom-right',
      });
    }
  };

  // Get category item count
  const getCategoryItemCount = (categoryId: string): number => {
    const category = FURNITURE_CATEGORIES.find(c => c.id === categoryId);
    if (!category) return 0;
    
    return selectedItems
      .filter(item => category.items.some(i => i.id === item.id))
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <QuoteHeader />
      <QuoteProgressBar currentStep={2} />

      <div className="flex-1 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* 2 COLUMN LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-6">
            
            {/* ========================================
                LEFT COLUMN: ACCORDION CATEGORIES
            ======================================== */}
            <div className="space-y-6">
              {/* Search Bar */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search items (sofa, bed, TV…)"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 text-base border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* ACCORDION CATEGORIES - BIG ROWS */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {FURNITURE_CATEGORIES.map((category) => {
                  const isOpen = openCategory === category.id;
                  const categoryCount = getCategoryItemCount(category.id);
                  const hasItems = categoryCount > 0;

                  // Filter items based on search
                  const filteredItems = searchQuery.trim()
                    ? category.items.filter(item =>
                        item.name.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                    : category.items;

                  // Skip category if search doesn't match
                  if (searchQuery.trim() && filteredItems.length === 0) {
                    return null;
                  }

                  return (
                    <div key={category.id} className="border-b border-slate-200 last:border-b-0">
                      {/* CATEGORY HEADER - BIG CLICKABLE ROW */}
                      <button
                        onClick={() => setOpenCategory(isOpen ? null : category.id)}
                        className={`
                          w-full px-6 py-5 flex items-center justify-between
                          hover:bg-slate-50 transition-colors
                          ${isOpen ? 'bg-blue-50 border-l-4 border-l-blue-600' : hasItems ? 'bg-green-50/30' : ''}
                        `}
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-5xl">{category.icon}</span>
                          <div className="text-left">
                            <div className="text-lg font-bold text-slate-900">{category.name}</div>
                            <div className="text-sm text-slate-500">
                              {category.items.length} items available
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {hasItems && (
                            <div className="bg-blue-600 text-white px-4 py-2 rounded-full font-bold text-sm">
                              {categoryCount} selected
                            </div>
                          )}
                          {isOpen ? (
                            <ChevronUp className="w-6 h-6 text-slate-600" />
                          ) : (
                            <ChevronDown className="w-6 h-6 text-slate-600" />
                          )}
                        </div>
                      </button>

                      {/* ACCORDION CONTENT - ITEMS LIST */}
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden bg-slate-50"
                          >
                            <div className="p-6 space-y-3">
                              {filteredItems.map(item => {
                                const quantity = getItemQuantity(item.id);
                                const isAnimating = animatingItemId === item.id;

                                return (
                                  <motion.div
                                    key={item.id}
                                    initial={{ backgroundColor: 'rgb(255 255 255)' }}
                                    animate={{
                                      backgroundColor: isAnimating
                                        ? 'rgb(220 252 231)'
                                        : quantity > 0
                                        ? 'rgb(239 246 255)'
                                        : 'rgb(255 255 255)',
                                    }}
                                    className="bg-white rounded-xl p-4 border-2 border-slate-200 hover:border-blue-300 transition-all"
                                  >
                                    <div className="flex items-center justify-between gap-4">
                                      <div className="flex-1">
                                        <div className="text-base font-bold text-slate-900 mb-1">
                                          {item.name}
                                        </div>
                                        <div className="text-sm text-slate-500">{item.size}</div>
                                      </div>

                                      {/* CONTROLS - LARGE & CLEAR */}
                                      <div className="flex items-center gap-3">
                                        {quantity > 0 ? (
                                          <>
                                            <button
                                              onClick={() => decreaseItem(item.id)}
                                              className="w-12 h-12 rounded-xl bg-slate-200 hover:bg-slate-300 flex items-center justify-center transition-all active:scale-95"
                                            >
                                              <Minus className="w-5 h-5 text-slate-700" />
                                            </button>
                                            <span className="w-12 text-center font-bold text-xl text-blue-700">
                                              {quantity}
                                            </span>
                                            <button
                                              onClick={() => addItem(item.id, item.name, item.volume)}
                                              className="w-12 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-all active:scale-95"
                                            >
                                              <Plus className="w-5 h-5 text-white" />
                                            </button>
                                          </>
                                        ) : (
                                          <button
                                            onClick={() => addItem(item.id, item.name, item.volume)}
                                            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base transition-all active:scale-95"
                                          >
                                            Add Item
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}

                {/* ADD YOUR OWN ITEM - BIG ROW */}
                <div className="border-b border-slate-200 last:border-b-0">
                  <button
                    onClick={() => setShowAddCustomItem(!showAddCustomItem)}
                    className="w-full px-6 py-5 flex items-center justify-between hover:bg-purple-50 transition-colors bg-gradient-to-r from-purple-50/50 to-pink-50/50"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-5xl">➕</span>
                      <div className="text-left">
                        <div className="text-lg font-bold text-slate-900">Add Your Own Item</div>
                        <div className="text-sm text-slate-500">Can't find your item? Add it manually</div>
                      </div>
                    </div>
                    {showAddCustomItem ? (
                      <ChevronUp className="w-6 h-6 text-slate-600" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-slate-600" />
                    )}
                  </button>

                  {/* CUSTOM ITEM FORM */}
                  <AnimatePresence>
                    {showAddCustomItem && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden bg-purple-50"
                      >
                        <div className="p-6 space-y-4">
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                              Item Name
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Garden tools, Bicycle, etc."
                              value={customItemName}
                              onChange={e => setCustomItemName(e.target.value)}
                              className="w-full px-4 py-3 text-base border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                            />
                          </div>

                          <button
                            onClick={handleAddCustomItem}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg active:scale-95"
                          >
                            Add Custom Item
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* BOTTOM BUTTONS */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4">
                <button
                  onClick={handleBack}
                  className="px-6 py-4 text-slate-600 hover:text-slate-900 font-bold text-base flex items-center gap-2 justify-center sm:justify-start transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Edit Job Info
                </button>

                <button
                  onClick={handleGetPrices}
                  disabled={selectedItems.length === 0}
                  className="flex-1 sm:max-w-md bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-5 px-10 rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-lg active:scale-[0.98] text-lg"
                >
                  Get Prices →
                </button>
              </div>
            </div>

            {/* ========================================
                RIGHT COLUMN: STICKY SUMMARY
            ======================================== */}
            <div className="lg:sticky lg:top-4 lg:self-start space-y-4">
              {/* QUOTE REFERENCE */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl shadow-sm border border-blue-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-600 font-medium mb-1">Quote ref:</p>
                    <p className="text-xl font-bold text-slate-900">
                      {quoteRef || 'Loading...'}
                    </p>
                  </div>
                  <button
                    onClick={handleCopyQuoteRef}
                    disabled={!quoteRef}
                    className="w-12 h-12 bg-blue-100 hover:bg-blue-200 rounded-full flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
                    title="Copy quote reference"
                  >
                    {copied ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
                    )}
                  </button>
                </div>
              </div>

              {/* MAP CARD */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="h-48 bg-slate-100 relative">
                  {quoteData.pickupLat && quoteData.pickupLng && quoteData.deliveryLat && quoteData.deliveryLng ? (
                    <iframe
                      src={`https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&origin=${quoteData.pickupLat},${quoteData.pickupLng}&destination=${quoteData.deliveryLat},${quoteData.deliveryLng}&mode=driving`}
                      className="w-full h-full border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Route map"
                      onError={(e) => {
                        console.warn('Map iframe error:', e);
                        // Silently handle error - don't break UI
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <Navigation className="w-12 h-12" />
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Route</div>
                    <div className="text-sm font-medium text-slate-900">
                      {quoteData.pickupAddress?.split(',')[0] || 'Pickup'} → {quoteData.deliveryAddress?.split(',')[0] || 'Delivery'}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Distance</div>
                      <div className="text-sm font-bold text-slate-900">
                        {quoteData.distance ? `${quoteData.distance.toFixed(1)} miles` : '—'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Duration</div>
                      <div className="text-sm font-bold text-slate-900">
                        {quoteData.duration || '—'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* MY ITEM LIST (GREEN) */}
              <motion.div
                layout
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-sm border-2 border-green-200 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-5 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="w-5 h-5 text-white" />
                      <h3 className="font-bold text-white text-lg">My Item List</h3>
                    </div>
                    <motion.div
                      key={totalItemsCount}
                      initial={{ scale: 1.3 }}
                      animate={{ scale: 1 }}
                      className="text-white font-bold"
                    >
                      {totalItemsCount} items
                    </motion.div>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  {/* Total Volume */}
                  <div className="bg-white rounded-xl p-4 border border-green-200">
                    <div className="text-sm font-semibold text-slate-600 mb-1">Total Volume</div>
                    <motion.div
                      key={totalVolume.toFixed(2)}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      className="text-3xl font-bold text-green-700"
                    >
                      {totalVolume.toFixed(2)} m³
                    </motion.div>
                  </div>

                  {/* Volume Recommendation */}
                  <div className={`rounded-xl p-4 border-2 ${volumeRec.color}`}>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{volumeRec.icon}</span>
                      <div>
                        <div className="font-bold text-sm mb-1">
                          {totalVolume < 5 ? 'Small move' : totalVolume < 12 ? 'Medium move' : 'Large move'}
                        </div>
                        <div className="text-sm">{volumeRec.text}</div>
                      </div>
                    </div>
                  </div>

                  {/* Selected Items List */}
                  {selectedItems.length > 0 ? (
                    <div className="space-y-4">
                      <div className="text-sm font-semibold text-slate-700 uppercase">Selected Items</div>
                      <AnimatePresence>
                        {Object.entries(groupItemsByCategory()).map(([categoryName, items]) => (
                          <motion.div
                            key={categoryName}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-white rounded-xl p-4 border border-slate-200"
                          >
                            <div className="font-bold text-sm text-slate-900 mb-3">{categoryName}</div>
                            <div className="space-y-2">
                              {items.map((item: any) => (
                                <div key={item.id} className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="text-sm font-medium text-slate-900">{item.name}</div>
                                    <div className="text-xs text-slate-500">{item.volume} m³ × {item.quantity}</div>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => decreaseItem(item.id)}
                                      className="w-7 h-7 rounded bg-slate-200 hover:bg-slate-300 flex items-center justify-center transition-all active:scale-90"
                                    >
                                      <Minus className="w-3 h-3 text-slate-700" />
                                    </button>
                                    <span className="w-6 text-center font-bold text-sm text-slate-900">{item.quantity}</span>
                                    <button
                                      onClick={() => addItem(item.id, item.name, item.volume)}
                                      className="w-7 h-7 rounded bg-green-600 hover:bg-green-700 flex items-center justify-center transition-all active:scale-90"
                                    >
                                      <Plus className="w-3 h-3 text-white" />
                                    </button>
                                    <button
                                      onClick={() => removeItem(item.id)}
                                      className="ml-2 w-7 h-7 rounded bg-red-100 hover:bg-red-200 flex items-center justify-center transition-all active:scale-90"
                                    >
                                      <Trash2 className="w-3 h-3 text-red-600" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl p-6 border border-slate-200 text-center">
                      <Package className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                      <div className="text-sm text-slate-500">No items selected yet</div>
                      <div className="text-xs text-slate-400 mt-1">Start adding items from the left</div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}