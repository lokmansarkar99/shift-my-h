/**
 * Clearance Inventory Configuration
 * Maps service types to inventory modes and card structures
 */

export type InventoryMode = 'furniture' | 'waste' | 'builders' | 'mixed';

export interface InventoryCard {
  id: string;
  name: string;
  icon: string;
}

export interface ServiceTypeConfig {
  inventoryMode: InventoryMode;
  cards: InventoryCard[];
}

// Service Type → Inventory Mode Mapping
export const SERVICE_TYPE_MAPPING: Record<string, ServiceTypeConfig> = {
  // A) Clearance cu mobilă (Furniture Inventory)
  'House Clearance': {
    inventoryMode: 'furniture',
    cards: [
      { id: 'living', name: 'Living Room', icon: '🛋️' },
      { id: 'bedroom', name: 'Bedroom', icon: '🛏️' },
      { id: 'kitchen', name: 'Kitchen', icon: '🍽️' },
      { id: 'appliances', name: 'Appliances', icon: '📺' },
      { id: 'boxes', name: 'Boxes', icon: '📦' },
    ],
  },
  'Flat Clearance': {
    inventoryMode: 'furniture',
    cards: [
      { id: 'living', name: 'Living Room', icon: '🛋️' },
      { id: 'bedroom', name: 'Bedroom', icon: '🛏️' },
      { id: 'kitchen', name: 'Kitchen', icon: '🍽️' },
      { id: 'appliances', name: 'Appliances', icon: '📺' },
      { id: 'boxes', name: 'Boxes', icon: '📦' },
    ],
  },
  'Office Clearance': {
    inventoryMode: 'furniture',
    cards: [
      { id: 'desks', name: 'Desks & Chairs', icon: '💼' },
      { id: 'storage', name: 'Storage', icon: '🗄️' },
      { id: 'electronics', name: 'Electronics', icon: '💻' },
      { id: 'boxes', name: 'Boxes', icon: '📦' },
    ],
  },

  // B) Waste / Junk (Waste Inventory)
  'Garden Clearance': {
    inventoryMode: 'waste',
    cards: [
      { id: 'bags', name: 'Bags', icon: '🛍️' },
      { id: 'bulky', name: 'Bulky Items', icon: '🪑' },
      { id: 'green-waste', name: 'Green Waste', icon: '🌿' },
      { id: 'soil', name: 'Soil/Rubble', icon: '⛰️' },
    ],
  },
  'General Junk Removal': {
    inventoryMode: 'waste',
    cards: [
      { id: 'bags', name: 'Bags', icon: '🛍️' },
      { id: 'bulky', name: 'Bulky Items', icon: '🪑' },
      { id: 'mixed', name: 'Mixed Waste', icon: '♻️' },
      { id: 'wood-metal', name: 'Wood/Metal', icon: '🪵' },
    ],
  },

  // C) Builders Waste (Builders Inventory)
  'Builders Waste': {
    inventoryMode: 'builders',
    cards: [
      { id: 'rubble', name: 'Rubble & Bricks', icon: '🧱' },
      { id: 'timber', name: 'Timber', icon: '🪵' },
      { id: 'plasterboard', name: 'Plasterboard', icon: '🔲' },
      { id: 'tiles', name: 'Tiles', icon: '🔶' },
      { id: 'mixed-bags', name: 'Mixed Bags', icon: '📦' },
    ],
  },

  // D) Garage Clearance (Mixed/Furniture)
  'Garage Clearance': {
    inventoryMode: 'mixed',
    cards: [
      { id: 'tools', name: 'Tools', icon: '🔧' },
      { id: 'shelves', name: 'Shelves/Storage', icon: '🗄️' },
      { id: 'tyres', name: 'Tyres/Parts', icon: '🛞' },
      { id: 'boxes', name: 'Boxes', icon: '📦' },
    ],
  },
};

// Default config if service type not found
export const DEFAULT_CONFIG: ServiceTypeConfig = {
  inventoryMode: 'waste',
  cards: [
    { id: 'bags', name: 'Bags', icon: '🛍️' },
    { id: 'bulky', name: 'Bulky Items', icon: '🪑' },
    { id: 'mixed', name: 'Mixed Items', icon: '♻️' },
  ],
};

// Get config for a service type
export function getInventoryConfig(serviceType: string): ServiceTypeConfig {
  return SERVICE_TYPE_MAPPING[serviceType] || DEFAULT_CONFIG;
}
