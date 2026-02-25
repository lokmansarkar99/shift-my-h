// Inventory items organized by category
import React, { useState, useMemo } from 'react';
import { Search, Package, X, ChevronRight } from 'lucide-react';
import { InventoryCardGrid, SelectedItemWithDetails } from './InventoryCardGrid';
import { ItemDetailsModal, ItemDetails } from './ItemDetailsModal';

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  volume?: number;
}

export const INVENTORY_CATEGORIES = [
  { id: 'bedrooms', name: 'Bedrooms', emoji: '🛏️' },
  { id: 'living', name: 'Living', emoji: '🛋️' },
  { id: 'kitchen', name: 'Kitchen', emoji: '🍳' },
  { id: 'bathroom', name: 'Bathroom', emoji: '🚿' },
  { id: 'boxes', name: 'Boxes & Packaging', emoji: '📦' },
  { id: 'garden', name: 'Garden & Garage', emoji: '🌿' },
];

export const INVENTORY_ITEMS: InventoryItem[] = [
  // Bedrooms
  { id: 'single-bed-frame', name: 'Single Bed', category: 'bedrooms', volume: 0.8 },
  { id: 'small-double-bed-frame', name: 'Small Double Bed (4ft)', category: 'bedrooms', volume: 1.0 },
  { id: 'double-bed-frame', name: 'Double Bed', category: 'bedrooms', volume: 1.2 },
  { id: 'king-bed-frame', name: 'King Size Bed', category: 'bedrooms', volume: 1.8 },
  { id: 'super-king-bed-frame', name: 'Super King Bed', category: 'bedrooms', volume: 2.2 },
  { id: 'bunk-bed', name: 'Bunk Bed', category: 'bedrooms', volume: 2.2 },
  { id: 'cot', name: 'Cot / Baby Bed', category: 'bedrooms', volume: 0.8 },
  { id: 'bed-frame-generic', name: 'Bed Frame (no mattress)', category: 'bedrooms', volume: 1.0 },
  { id: 'ottoman-storage-bed', name: 'Ottoman Bed / Storage Bed', category: 'bedrooms', volume: 2.0 },
  { id: 'single-mattress', name: 'Single Mattress', category: 'bedrooms', volume: 0.4 },
  { id: 'small-double-mattress', name: 'Small Double Mattress (4ft)', category: 'bedrooms', volume: 0.5 },
  { id: 'double-mattress', name: 'Double Mattress', category: 'bedrooms', volume: 0.8 },
  { id: 'king-mattress', name: 'King Size Mattress', category: 'bedrooms', volume: 1.0 },
  { id: 'super-king-mattress', name: 'Super King Mattress', category: 'bedrooms', volume: 1.2 },
  { id: 'single-bed', name: 'Single Bed & Mattress', category: 'bedrooms', volume: 1.2 },
  { id: 'small-double-bed', name: 'Small Double Bed & Mattress (4ft)', category: 'bedrooms', volume: 1.5 },
  { id: 'double-bed', name: 'Double Bed & Mattress', category: 'bedrooms', volume: 2.0 },
  { id: 'king-bed', name: 'King Size Bed & Mattress', category: 'bedrooms', volume: 2.5 },
  { id: 'super-king-bed', name: 'Super King Bed & Mattress', category: 'bedrooms', volume: 3.0 },
  { id: 'bedside-table', name: 'Bedside Table', category: 'bedrooms', volume: 0.3 },
  { id: 'chest-drawers', name: 'Chest of Drawers', category: 'bedrooms', volume: 0.8 },
  { id: 'tallboy', name: 'Tallboy / Drawer Unit (Tall Chest)', category: 'bedrooms', volume: 1.0 },
  { id: 'dressing-table', name: 'Dressing Table', category: 'bedrooms', volume: 1.0 },
  { id: 'wardrobe', name: 'Wardrobe (Small)', category: 'bedrooms', volume: 1.5 },
  { id: 'wardrobe-large', name: 'Wardrobe (Large)', category: 'bedrooms', volume: 2.5 },
  { id: 'headboard', name: 'Headboard (detachable)', category: 'bedrooms', volume: 0.2 },
  { id: 'mirror', name: 'Mirror (Large)', category: 'bedrooms', volume: 0.2 },
  { id: 'underbed-storage', name: 'Underbed Storage Drawer / Box', category: 'bedrooms', volume: 0.3 },
  { id: 'blanket-box', name: 'Blanket Box', category: 'bedrooms', volume: 0.6 },
  { id: 'laundry-hamper', name: 'Laundry Basket / Hamper', category: 'bedrooms', volume: 0.2 },
  { id: 'desk-bedroom', name: 'Desk (Bedroom)', category: 'bedrooms', volume: 0.9 },
  { id: 'office-chair-bedroom', name: 'Office Chair', category: 'bedrooms', volume: 0.4 },

  // Living
  { id: 'sofa-2-seater', name: '2 Seater Sofa', category: 'living', volume: 2.0 },
  { id: 'sofa-3-seater', name: '3 Seater Sofa', category: 'living', volume: 2.8 },
  { id: 'sofa-l-shape', name: 'L-Shape Sofa', category: 'living', volume: 4.5 },
  { id: 'corner-sofa', name: 'Corner Sofa', category: 'living', volume: 5.5 },
  { id: 'recliner-2-seater', name: '2 Seater Recliner', category: 'living', volume: 2.5 },
  { id: 'recliner-3-seater', name: '3 Seater Recliner', category: 'living', volume: 3.2 },
  { id: 'recliner', name: 'Recliner', category: 'living', volume: 1.2 },
  { id: 'armchair', name: 'Armchair', category: 'living', volume: 1.0 },
  { id: 'footstool-ottoman', name: 'Footstool / Ottoman', category: 'living', volume: 0.4 },
  { id: 'coffee-table', name: 'Coffee Table', category: 'living', volume: 0.5 },
  { id: 'side-table', name: 'Side Table', category: 'living', volume: 0.3 },
  { id: 'nest-of-tables', name: 'Nest of Tables', category: 'living', volume: 0.3 },
  { id: 'console-table', name: 'Console Table', category: 'living', volume: 0.6 },
  { id: 'bookshelf', name: 'Bookshelf', category: 'living', volume: 1.2 },
  { id: 'sideboard', name: 'Sideboard', category: 'living', volume: 1.5 },
  { id: 'display-cabinet', name: 'Display Cabinet', category: 'living', volume: 1.5 },
  { id: 'storage-bench', name: 'Storage Bench', category: 'living', volume: 0.6 },
  { id: 'tv-stand', name: 'TV Stand', category: 'living', volume: 0.8 },
  { id: 'tv-small', name: 'TV (up to 42\")', category: 'living', volume: 0.2 },
  { id: 'tv-medium', name: 'TV (43\" - 55\")', category: 'living', volume: 0.35 },
  { id: 'tv-60', name: 'TV (60\")', category: 'living', volume: 0.45 },
  { id: 'tv-75-85', name: 'TV (75\" - 85\")', category: 'living', volume: 0.6 },
  { id: 'tv-wall-unit', name: 'TV Wall Unit', category: 'living', volume: 2.0 },
  { id: 'sound-system', name: 'Sound System / Speakers', category: 'living', volume: 0.4 },
  { id: 'subwoofer', name: 'Subwoofer', category: 'living', volume: 0.1 },
  { id: 'gaming-console', name: 'Gaming Console', category: 'living', volume: 0.1 },
  { id: 'rug', name: 'Rug (Large)', category: 'living', volume: 0.2 },
  { id: 'lamp-floor', name: 'Floor Lamp', category: 'living', volume: 0.2 },
  { id: 'lamp-table', name: 'Table Lamp', category: 'living', volume: 0.1 },
  { id: 'large-wall-mirror', name: 'Large Wall Mirror', category: 'living', volume: 0.2 },
  { id: 'curtains-pole', name: 'Curtains & Curtain Pole', category: 'living', volume: 0.1 },
  { id: 'room-divider', name: 'Room Divider / Folding Screen', category: 'living', volume: 0.8 },
  { id: 'desk-living', name: 'Desk (Living / Home Office)', category: 'living', volume: 0.9 },
  { id: 'office-chair', name: 'Office Chair', category: 'living', volume: 0.4 },

  // Kitchen
  { id: 'fridge', name: 'Fridge', category: 'kitchen', volume: 0.5 },
  { id: 'fridge-freezer', name: 'Fridge Freezer', category: 'kitchen', volume: 1.2 },
  { id: 'american-fridge-freezer', name: 'American Fridge Freezer', category: 'kitchen', volume: 2.5 },
  { id: 'freezer-separate', name: 'Freezer (separate)', category: 'kitchen', volume: 0.5 },
  { id: 'chest-freezer', name: 'Chest Freezer', category: 'kitchen', volume: 1.5 },
  { id: 'washing-machine', name: 'Washing Machine', category: 'kitchen', volume: 0.8 },
  { id: 'tumble-dryer', name: 'Tumble Dryer', category: 'kitchen', volume: 0.8 },
  { id: 'dishwasher', name: 'Dishwasher', category: 'kitchen', volume: 0.8 },
  { id: 'oven', name: 'Cooker / Oven', category: 'kitchen', volume: 1.0 },
  { id: 'microwave', name: 'Microwave', category: 'kitchen', volume: 0.2 },
  { id: 'coffee-machine', name: 'Coffee Machine', category: 'kitchen', volume: 0.1 },
  { id: 'air-fryer', name: 'Air Fryer', category: 'kitchen', volume: 0.1 },
  { id: 'kitchen-cabinet', name: 'Kitchen Cabinet / Cupboard', category: 'kitchen', volume: 0.6 },
  { id: 'wall-cabinet', name: 'Wall Cabinet (removable)', category: 'kitchen', volume: 0.4 },
  { id: 'pantry-cabinet', name: 'Pantry Cabinet', category: 'kitchen', volume: 1.5 },
  { id: 'kitchen-trolley', name: 'Kitchen Trolley', category: 'kitchen', volume: 0.5 },
  { id: 'kitchen-island', name: 'Kitchen Island', category: 'kitchen', volume: 2.0 },
  { id: 'kitchen-table', name: 'Kitchen Table', category: 'kitchen', volume: 0.8 },
  { id: 'dining-table-small', name: 'Dining Table (Small)', category: 'kitchen', volume: 1.5 },
  { id: 'dining-table-large', name: 'Dining Table (Large)', category: 'kitchen', volume: 2.5 },
  { id: 'dining-chair', name: 'Dining Chair', category: 'kitchen', volume: 0.3 },
  { id: 'chair', name: 'Chair', category: 'kitchen', volume: 0.3 },
  { id: 'kitchen-stool', name: 'Kitchen Stool', category: 'kitchen', volume: 0.2 },
  { id: 'small-appliance-box', name: 'Small Appliance Box', category: 'kitchen', volume: 0.1 },
  { id: 'kitchen-bin', name: 'Kitchen Bin', category: 'kitchen', volume: 0.2 },

  // Bathroom
  { id: 'bathroom-cabinet', name: 'Bathroom Cabinet', category: 'bathroom', volume: 0.5 },
  { id: 'bathroom-mirror', name: 'Bathroom Mirror', category: 'bathroom', volume: 0.1 },
  { id: 'laundry-basket', name: 'Laundry Basket', category: 'bathroom', volume: 0.2 },
  { id: 'bathroom-shelf', name: 'Bathroom Shelf Unit', category: 'bathroom', volume: 0.4 },

  // Boxes & Packaging
  { id: 'small-box', name: 'Small Box', category: 'boxes', volume: 0.05 },
  { id: 'medium-box', name: 'Medium Box', category: 'boxes', volume: 0.1 },
  { id: 'large-box', name: 'Large Box', category: 'boxes', volume: 0.15 },
  { id: 'wardrobe-box', name: 'Wardrobe Box', category: 'boxes', volume: 0.12 },
  { id: 'bag', name: 'Suitcase', category: 'boxes', volume: 0.1 },
  { id: 'shopping-bag', name: 'Shopping Bag', category: 'boxes', volume: 0.05 },
  { id: 'black-bag', name: 'Black Bag', category: 'boxes', volume: 0.05 },
  { id: 'plastic-container', name: 'Plastic Storage Box', category: 'boxes', volume: 0.08 },
  { id: 'book-box', name: 'Book Box (small / heavy-duty)', category: 'boxes', volume: 0.05 },
  { id: 'archive-box', name: 'Archive Box', category: 'boxes', volume: 0.06 },
  { id: 'bubble-wrap', name: 'Bubble Wrap (roll)', category: 'boxes', volume: 0.1 },
  { id: 'packing-paper', name: 'Packing Paper', category: 'boxes', volume: 0.1 },
  { id: 'stretch-wrap', name: 'Stretch / Shrink Wrap', category: 'boxes', volume: 0.1 },
  { id: 'mattress-cover', name: 'Mattress Cover', category: 'boxes', volume: 0.05 },
  { id: 'sofa-cover', name: 'Sofa / Furniture Cover', category: 'boxes', volume: 0.05 },
  { id: 'moving-blankets', name: 'Moving Blankets / Furniture Blankets', category: 'boxes', volume: 0.1 },
  { id: 'packing-tape', name: 'Packing Tape', category: 'boxes', volume: 0.02 },
  { id: 'labels-markers', name: 'Labels / Marker Pens', category: 'boxes', volume: 0.01 },
  { id: 'heavy-duty-bin-bags', name: 'Heavy Duty Bin Bags (customer-provided)', category: 'boxes', volume: 0.05 },
  { id: 'vacuum-storage-bags', name: 'Vacuum Storage Bags (customer-provided)', category: 'boxes', volume: 0.05 },

  // Garden & Garage
  { id: 'garden-table', name: 'Garden Table', category: 'garden', volume: 1.0 },
  { id: 'garden-chair', name: 'Garden Chair', category: 'garden', volume: 0.3 },
  { id: 'bbq', name: 'BBQ', category: 'garden', volume: 0.8 },
  { id: 'lawnmower', name: 'Lawnmower', category: 'garden', volume: 0.5 },
  { id: 'bike', name: 'Bicycle', category: 'garden', volume: 0.5 },
  { id: 'tools', name: 'Tool Box / Tools', category: 'garden', volume: 0.5 },
  { id: 'storage-shed', name: 'Garden Storage Box', category: 'garden', volume: 1.5 },
  { id: 'plant-pot', name: 'Plant Pot (Large)', category: 'garden', volume: 0.3 },
  { id: 'garden-bench', name: 'Garden Bench', category: 'garden', volume: 1.2 },
  { id: 'sun-lounger', name: 'Sun Lounger / Deck Chair', category: 'garden', volume: 0.8 },
  { id: 'parasol', name: 'Parasol / Garden Umbrella', category: 'garden', volume: 0.4 },
  { id: 'outdoor-cushions', name: 'Outdoor Cushions (box / set)', category: 'garden', volume: 0.3 },
  { id: 'hose-reel', name: 'Hose Reel / Garden Hose', category: 'garden', volume: 0.2 },
  { id: 'wheelbarrow', name: 'Wheelbarrow', category: 'garden', volume: 0.6 },
  { id: 'ladder', name: 'Ladder', category: 'garden', volume: 0.6 },
  { id: 'water-butt', name: 'Water Butt / Water Barrel', category: 'garden', volume: 0.8 },
  { id: 'workbench', name: 'Workbench', category: 'garden', volume: 1.5 },
  { id: 'garage-shelving', name: 'Garage Shelving Unit', category: 'garden', volume: 0.8 },
  { id: 'tool-cabinet', name: 'Tool Cabinet (metal)', category: 'garden', volume: 1.0 },
  { id: 'bike-rack', name: 'Bike Rack', category: 'garden', volume: 0.4 },
  { id: 'pressure-washer', name: 'Pressure Washer / Compressor', category: 'garden', volume: 0.5 },
  { id: 'garden-shed-small', name: 'Garden Shed (Small)', category: 'garden', volume: 3.0 },
  { id: 'garden-shed-medium', name: 'Garden Shed (Medium)', category: 'garden', volume: 6.0 },
  { id: 'greenhouse-small', name: 'Greenhouse (Small)', category: 'garden', volume: 3.0 },
  { id: 'patio-heater', name: 'Patio Heater', category: 'garden', volume: 1.0 },
  { id: 'car-tyres', name: 'Car Tyres / Wheels (set of 4)', category: 'garden', volume: 0.8 },
  { id: 'childrens-outdoor-toys', name: 'Children\'s Outdoor Toys (trampoline / slide)', category: 'garden', volume: 2.0 },
];

interface InventoryCatalogProps {
  selectedItems: any[];
  onItemsChange: (items: any[]) => void;
}

export function InventoryCatalog({ selectedItems, onItemsChange }: InventoryCatalogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('bedrooms');
  const [modalState, setModalState] = useState<{ isOpen: boolean; itemId: string; itemName: string; initialDetails?: ItemDetails } | null>(null);

  // Convert selectedItems to the format expected by InventoryCardGrid
  const mappedSelectedItems: SelectedItemWithDetails[] = useMemo(() => {
    return selectedItems.map(item => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      details: item.details
    }));
  }, [selectedItems]);

  // Filter items based on category and search
  const filteredItems = useMemo(() => {
    return INVENTORY_ITEMS.filter(item => {
      const matchesCategory = item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (searchQuery) {
        return matchesSearch;
      }
      return matchesCategory;
    });
  }, [activeCategory, searchQuery]);

  const handleAddItem = (id: string, name: string) => {
    const itemData = INVENTORY_ITEMS.find(i => i.id === id);
    const existing = selectedItems.find(i => i.id === id);
    
    if (existing) {
      onItemsChange(selectedItems.map(i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      onItemsChange([...selectedItems, { 
        id, 
        name, 
        quantity: 1, 
        volume: itemData?.volume || 0.5,
        category: itemData?.category 
      }]);
    }
  };

  const handleRemoveItem = (id: string) => {
    const existing = selectedItems.find(i => i.id === id);
    if (!existing) return;

    if (existing.quantity > 1) {
      onItemsChange(selectedItems.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i));
    } else {
      onItemsChange(selectedItems.filter(i => i.id !== id));
    }
  };

  const handleIncreaseQuantity = (id: string) => {
    onItemsChange(selectedItems.map(i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i));
  };

  const handleOpenModal = (id: string, name: string) => {
    const item = selectedItems.find(i => i.id === id);
    setModalState({
      isOpen: true,
      itemId: id,
      itemName: name,
      initialDetails: item?.details
    });
  };

  const handleModalSubmit = (itemId: string, details: ItemDetails) => {
    onItemsChange(selectedItems.map(i => i.id === itemId ? { ...i, details } : i));
  };

  return (
    <div className="space-y-6">
      {/* Search & Category Header */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for items..."
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 rounded-full"
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      {!searchQuery && (
        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
          {INVENTORY_CATEGORIES.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all ${
                activeCategory === category.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300'
              }`}
            >
              <span>{category.emoji}</span>
              {category.name}
            </button>
          ))}
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">
          {searchQuery ? `Search Results (${filteredItems.length})` : INVENTORY_CATEGORIES.find(c => c.id === activeCategory)?.name}
        </h3>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Clear Search
          </button>
        )}
      </div>

      {/* Card Grid */}
      {filteredItems.length > 0 ? (
        <InventoryCardGrid
          items={filteredItems}
          selectedItems={mappedSelectedItems}
          onAddItem={handleAddItem}
          onRemoveItem={handleRemoveItem}
          onIncreaseQuantity={handleIncreaseQuantity}
          onOpenModal={handleOpenModal}
        />
      ) : (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-slate-400" />
          </div>
          <h4 className="text-lg font-bold text-slate-900 mb-1">No items found</h4>
          <p className="text-slate-500">Try searching for something else or browse categories.</p>
        </div>
      )}

      {/* Item Details Modal */}
      {modalState && (
        <ItemDetailsModal
          isOpen={modalState.isOpen}
          onClose={() => setModalState(null)}
          onSubmit={handleModalSubmit}
          itemId={modalState.itemId}
          itemName={modalState.itemName}
          initialDetails={modalState.initialDetails}
        />
      )}
    </div>
  );
}
