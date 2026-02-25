/**
 * House Move Inventory Database
 * ShiftMyHome - Complete item catalog with categories
 */

import { Bed, Sofa, Armchair, Lamp, Tv, UtensilsCrossed, ChefHat, Wine, Droplets, Bath, Package, Box, Archive, Shirt, Briefcase, Wrench, Dumbbell, Baby, LucideIcon, Table } from 'lucide-react';

export type HandlingType = 'standard' | 'fragile' | 'heavy' | 'bulky';

export interface InventoryItem {
  id: string;
  name: string;
  description?: string;
  category: string;
  icon: LucideIcon;
  defaultQuantity: number;
  volume: number; // cubic meters (m³)
  handling: HandlingType; // affects time calculation
}

export interface InventoryCategory {
  id: string;
  name: string;
  icon: LucideIcon;
  emoji: string;
}

export const INVENTORY_CATEGORIES: InventoryCategory[] = [
  { id: 'bedrooms', name: 'Bedrooms', icon: Bed, emoji: '🛏' },
  { id: 'living', name: 'Living areas', icon: Sofa, emoji: '🛋' },
  { id: 'kitchen', name: 'Kitchen', icon: UtensilsCrossed, emoji: '🍽' },
  { id: 'bathroom', name: 'Bathroom', icon: Droplets, emoji: '🚿' },
  { id: 'boxes', name: 'Boxes & storage', icon: Box, emoji: '📦' },
  { id: 'garden', name: 'Garden & Outdoor', icon: Dumbbell, emoji: '🌿' },
  { id: 'office', name: 'Office & Study', icon: Briefcase, emoji: '💼' },
  { id: 'electronics', name: 'Electronics', icon: Tv, emoji: '📺' },
  { id: 'garage', name: 'Garage & DIY', icon: Wrench, emoji: '🔧' },
  { id: 'children', name: 'Children\'s items', icon: Baby, emoji: '👶' },
  { id: 'sports', name: 'Sports & Hobbies', icon: Dumbbell, emoji: '⚽' },
];

export const INVENTORY_ITEMS: InventoryItem[] = [
  // BEDROOMS - BEDS & MATTRESSES
  { id: 'single-bed-mattress', name: 'Single Bed & Mattress', category: 'bedrooms', icon: Bed, defaultQuantity: 0, volume: 1.2, handling: 'bulky' },
  { id: 'double-bed-mattress', name: 'Double Bed & Mattress', category: 'bedrooms', icon: Bed, defaultQuantity: 0, volume: 2.0, handling: 'bulky' },
  { id: 'kingsize-bed-mattress', name: 'Kingsize Bed & Mattress', category: 'bedrooms', icon: Bed, defaultQuantity: 0, volume: 2.5, handling: 'bulky' },
  { id: 'single-bed-frame', name: 'Single Bed Frame', category: 'bedrooms', icon: Bed, defaultQuantity: 0, volume: 0.8, handling: 'bulky' },
  { id: 'double-bed-frame', name: 'Double Bed Frame', category: 'bedrooms', icon: Bed, defaultQuantity: 0, volume: 1.2, handling: 'bulky' },
  { id: 'kingsize-bed-frame', name: 'Kingsize Bed Frame', category: 'bedrooms', icon: Bed, defaultQuantity: 0, volume: 1.8, handling: 'bulky' },
  { id: 'bunk-bed', name: 'Bunk Bed', category: 'bedrooms', icon: Bed, defaultQuantity: 0, volume: 2.2, handling: 'bulky' },
  { id: 'sofa-bed', name: 'Sofa Bed', category: 'bedrooms', icon: Sofa, defaultQuantity: 0, volume: 2.5, handling: 'bulky' },
  { id: 'single-mattress', name: 'Single Mattress', category: 'bedrooms', icon: Bed, defaultQuantity: 0, volume: 0.4, handling: 'bulky' },
  { id: 'double-mattress', name: 'Double Mattress', category: 'bedrooms', icon: Bed, defaultQuantity: 0, volume: 0.8, handling: 'bulky' },
  { id: 'kingsize-mattress', name: 'Kingsize Mattress', category: 'bedrooms', icon: Bed, defaultQuantity: 0, volume: 1.0, handling: 'bulky' },
  
  // BEDROOMS - WARDROBES & STORAGE
  { id: 'single-wardrobe', name: 'Single Wardrobe', category: 'bedrooms', icon: Shirt, defaultQuantity: 0, volume: 1.5, handling: 'bulky' },
  { id: 'double-wardrobe', name: 'Double Wardrobe', category: 'bedrooms', icon: Shirt, defaultQuantity: 0, volume: 2.5, handling: 'heavy' },
  { id: 'triple-wardrobe', name: 'Triple Wardrobe', category: 'bedrooms', icon: Shirt, defaultQuantity: 0, volume: 3.5, handling: 'heavy' },
  { id: 'flat-packed-wardrobe', name: 'Flat Packed Wardrobe', category: 'bedrooms', icon: Package, defaultQuantity: 0, volume: 0.6, handling: 'standard' },
  { id: 'chest-of-drawers', name: 'Chest Of Drawers', category: 'bedrooms', icon: Archive, defaultQuantity: 0, volume: 0.8, handling: 'standard' },
  { id: 'bookcase', name: 'Bookcase', category: 'bedrooms', icon: Archive, defaultQuantity: 0, volume: 1.2, handling: 'heavy' },
  { id: 'shelf', name: 'Shelf', category: 'bedrooms', icon: Archive, defaultQuantity: 0, volume: 0.3, handling: 'standard' },
  
  // BEDROOMS - TABLES
  { id: 'bedside-table', name: 'Bedside Table', category: 'bedrooms', icon: Table, defaultQuantity: 0, volume: 0.3, handling: 'standard' },
  { id: 'dressing-table', name: 'Dressing Table', category: 'bedrooms', icon: Table, defaultQuantity: 0, volume: 1.0, handling: 'standard' },

  // LIVING AREAS - SOFAS
  { id: 'two-seater-sofa', name: 'Two Seater Sofa', category: 'living', icon: Sofa, defaultQuantity: 0, volume: 2.0, handling: 'bulky' },
  { id: 'three-seater-sofa', name: 'Three Seater Sofa', category: 'living', icon: Sofa, defaultQuantity: 0, volume: 2.8, handling: 'bulky' },
  { id: 'four-seater-sofa', name: 'Four Seater Sofa', category: 'living', icon: Sofa, defaultQuantity: 0, volume: 3.5, handling: 'heavy' },
  { id: 'l-shaped-sofa', name: 'L Shaped Sofa', category: 'living', icon: Sofa, defaultQuantity: 0, volume: 4.5, handling: 'heavy' },
  { id: 'two-seater-reclining-sofa', name: 'Two Seater Reclining Sofa', category: 'living', icon: Sofa, defaultQuantity: 0, volume: 2.5, handling: 'heavy' },
  { id: 'three-seater-reclining-sofa', name: 'Three Seater Reclining Sofa', category: 'living', icon: Sofa, defaultQuantity: 0, volume: 3.2, handling: 'heavy' },
  { id: 'two-seater-sofa-bed', name: 'Two Seater Sofa Bed', category: 'living', icon: Sofa, defaultQuantity: 0, volume: 2.3, handling: 'bulky' },
  { id: 'three-seater-sofa-bed', name: 'Three Seater Sofa Bed', category: 'living', icon: Sofa, defaultQuantity: 0, volume: 3.0, handling: 'bulky' },
  { id: 'corner-sofa-bed', name: 'Corner Sofa Bed', category: 'living', icon: Sofa, defaultQuantity: 0, volume: 4.2, handling: 'heavy' },

  // LIVING AREAS - CHAIRS
  { id: 'armchair', name: 'Armchair', category: 'living', icon: Armchair, defaultQuantity: 0, volume: 1.0, handling: 'standard' },
  { id: 'dining-chair', name: 'Dining Chair', category: 'living', icon: Armchair, defaultQuantity: 0, volume: 0.3, handling: 'standard' },
  { id: 'office-chair', name: 'Office Chair', category: 'living', icon: Armchair, defaultQuantity: 0, volume: 0.4, handling: 'standard' },
  { id: 'desk-chair', name: 'Desk Chair', category: 'living', icon: Armchair, defaultQuantity: 0, volume: 0.4, handling: 'standard' },
  { id: 'folding-chair', name: 'Folding Chair', category: 'living', icon: Armchair, defaultQuantity: 0, volume: 0.2, handling: 'standard' },
  { id: 'rocking-chair', name: 'Rocking Chair', category: 'living', icon: Armchair, defaultQuantity: 0, volume: 0.8, handling: 'bulky' },
  { id: 'sofa-chair', name: 'Sofa Chair', category: 'living', icon: Armchair, defaultQuantity: 0, volume: 0.9, handling: 'standard' },
  
  // LIVING AREAS - TABLES
  { id: 'coffee-table', name: 'Coffee Table', category: 'living', icon: Table, defaultQuantity: 0, volume: 0.5, handling: 'standard' },
  { id: '4-seater-dining-table-chairs', name: '4 Seater Dining Table & Chairs', category: 'living', icon: Table, defaultQuantity: 0, volume: 2.0, handling: 'heavy' },
  { id: '6-seater-dining-table-chairs', name: '6 Seater Dining Table & Chairs', category: 'living', icon: Table, defaultQuantity: 0, volume: 2.8, handling: 'heavy' },
  { id: '4-seater-dining-table', name: '4 Seater Dining Table', category: 'living', icon: Table, defaultQuantity: 0, volume: 1.5, handling: 'standard' },
  { id: '6-seater-dining-table', name: '6 Seater Dining Table', category: 'living', icon: Table, defaultQuantity: 0, volume: 2.0, handling: 'heavy' },
  { id: 'small-desk', name: 'Small Desk', category: 'living', icon: Table, defaultQuantity: 0, volume: 0.8, handling: 'standard' },
  
  // LIVING AREAS - OTHER
  { id: 'tv-unit', name: 'TV unit', category: 'living', icon: Tv, defaultQuantity: 0, volume: 0.8, handling: 'standard' },
  { id: 'lamp-floor', name: 'Floor lamp', category: 'living', icon: Lamp, defaultQuantity: 0, volume: 0.2, handling: 'fragile' },

  // KITCHEN
  { id: 'fridge-small', name: 'Fridge (under-counter)', category: 'kitchen', icon: ChefHat, defaultQuantity: 0, volume: 0.5, handling: 'heavy' },
  { id: 'fridge-large', name: 'Fridge-freezer', category: 'kitchen', icon: ChefHat, defaultQuantity: 0, volume: 1.2, handling: 'heavy' },
  { id: 'washing-machine', name: 'Washing machine', category: 'kitchen', icon: Droplets, defaultQuantity: 0, volume: 0.8, handling: 'heavy' },
  { id: 'dishwasher', name: 'Dishwasher', category: 'kitchen', icon: Droplets, defaultQuantity: 0, volume: 0.8, handling: 'heavy' },
  { id: 'oven', name: 'Oven / cooker', category: 'kitchen', icon: ChefHat, defaultQuantity: 0, volume: 1.0, handling: 'heavy' },
  { id: 'microwave', name: 'Microwave', category: 'kitchen', icon: ChefHat, defaultQuantity: 0, volume: 0.2, handling: 'fragile' },
  { id: 'kitchen-table', name: 'Kitchen table', category: 'kitchen', icon: UtensilsCrossed, defaultQuantity: 0, volume: 0.8, handling: 'standard' },
  { id: 'wine-rack', name: 'Wine rack', category: 'kitchen', icon: Wine, defaultQuantity: 0, volume: 0.3, handling: 'fragile' },
  { id: 'tumble-dryer', name: 'Tumble dryer', category: 'kitchen', icon: Droplets, defaultQuantity: 0, volume: 0.8, handling: 'heavy' },
  { id: 'kitchen-cabinet', name: 'Kitchen cabinet', category: 'kitchen', icon: Archive, defaultQuantity: 0, volume: 0.6, handling: 'standard' },

  // BATHROOM
  { id: 'mirror-large', name: 'Large mirror', category: 'bathroom', icon: Droplets, defaultQuantity: 0, volume: 0.2, handling: 'fragile' },
  { id: 'cabinet-bathroom', name: 'Bathroom cabinet', category: 'bathroom', icon: Archive, defaultQuantity: 0, volume: 0.5, handling: 'standard' },
  { id: 'laundry-basket', name: 'Laundry basket', category: 'bathroom', icon: Shirt, defaultQuantity: 0, volume: 0.2, handling: 'standard' },
  { id: 'bathroom-shelves', name: 'Bathroom shelving unit', category: 'bathroom', icon: Archive, defaultQuantity: 0, volume: 0.4, handling: 'standard' },
  { id: 'towel-rail', name: 'Towel rail', category: 'bathroom', icon: Droplets, defaultQuantity: 0, volume: 0.1, handling: 'standard' },

  // BOXES & STORAGE
  { id: 'small-box', name: 'Small Box', category: 'boxes', icon: Box, defaultQuantity: 0, volume: 0.05, handling: 'standard' },
  { id: 'medium-box', name: 'Medium Box', category: 'boxes', icon: Box, defaultQuantity: 0, volume: 0.1, handling: 'standard' },
  { id: 'large-box', name: 'Large Box', category: 'boxes', icon: Box, defaultQuantity: 0, volume: 0.15, handling: 'standard' },
  { id: 'suitcase', name: 'Suitcase', category: 'boxes', icon: Briefcase, defaultQuantity: 0, volume: 0.1, handling: 'standard' },
  { id: 'plastic-storage', name: 'Plastic storage box', category: 'boxes', icon: Archive, defaultQuantity: 0, volume: 0.08, handling: 'standard' },
  { id: 'wardrobe-box', name: 'Wardrobe box (hanging clothes)', category: 'boxes', icon: Shirt, defaultQuantity: 0, volume: 0.12, handling: 'standard' },
  { id: 'archive-box', name: 'Archive box', category: 'boxes', icon: Archive, defaultQuantity: 0, volume: 0.06, handling: 'standard' },
  { id: 'trunk', name: 'Storage trunk', category: 'boxes', icon: Box, defaultQuantity: 0, volume: 0.3, handling: 'standard' },

  // GARDEN & OUTDOOR
  { id: 'garden-table', name: 'Garden Table', category: 'garden', icon: Table, defaultQuantity: 0, volume: 1.0, handling: 'standard' },
  { id: 'garden-chair', name: 'Garden Chair', category: 'garden', icon: Armchair, defaultQuantity: 0, volume: 0.3, handling: 'standard' },
  { id: 'garden-bench', name: 'Garden bench', category: 'garden', icon: Sofa, defaultQuantity: 0, volume: 1.2, handling: 'heavy' },
  { id: 'bbq-grill', name: 'BBQ / Grill', category: 'garden', icon: ChefHat, defaultQuantity: 0, volume: 0.8, handling: 'heavy' },
  { id: 'lawnmower', name: 'Lawnmower', category: 'garden', icon: Wrench, defaultQuantity: 0, volume: 0.5, handling: 'heavy' },
  { id: 'parasol', name: 'Garden parasol', category: 'garden', icon: Lamp, defaultQuantity: 0, volume: 0.4, handling: 'bulky' },
  { id: 'plant-pots', name: 'Plant pots (set of 5)', category: 'garden', icon: Package, defaultQuantity: 0, volume: 0.3, handling: 'fragile' },
  { id: 'garden-tools', name: 'Garden tools (set)', category: 'garden', icon: Wrench, defaultQuantity: 0, volume: 0.2, handling: 'standard' },
  { id: 'sunlounger', name: 'Sun lounger', category: 'garden', icon: Bed, defaultQuantity: 0, volume: 0.8, handling: 'bulky' },
  { id: 'hammock', name: 'Hammock', category: 'garden', icon: Bed, defaultQuantity: 0, volume: 0.3, handling: 'standard' },

  // OFFICE & STUDY
  { id: 'office-desk-large', name: 'Office Desk (large)', category: 'office', icon: Briefcase, defaultQuantity: 0, volume: 1.5, handling: 'heavy' },
  { id: 'office-desk', name: 'Office Desk', category: 'office', icon: Briefcase, defaultQuantity: 0, volume: 0.9, handling: 'standard' },
  { id: 'ergonomic-chair', name: 'Ergonomic office chair', category: 'office', icon: Armchair, defaultQuantity: 0, volume: 0.5, handling: 'standard' },
  { id: 'filing-cabinet-2drawer', name: 'Filing cabinet (2 drawer)', category: 'office', icon: Archive, defaultQuantity: 0, volume: 0.4, handling: 'heavy' },
  { id: 'filing-cabinet-4drawer', name: 'Filing cabinet (4 drawer)', category: 'office', icon: Archive, defaultQuantity: 0, volume: 0.8, handling: 'heavy' },
  { id: 'bookcase-office', name: 'Office bookcase', category: 'office', icon: Archive, defaultQuantity: 0, volume: 1.0, handling: 'heavy' },
  { id: 'printer-stand', name: 'Printer stand', category: 'office', icon: Tv, defaultQuantity: 0, volume: 0.3, handling: 'standard' },
  { id: 'whiteboard', name: 'Whiteboard', category: 'office', icon: Package, defaultQuantity: 0, volume: 0.2, handling: 'fragile' },
  { id: 'desk-lamp', name: 'Desk lamp', category: 'office', icon: Lamp, defaultQuantity: 0, volume: 0.1, handling: 'fragile' },
  { id: 'monitor-stand', name: 'Monitor stand', category: 'office', icon: Tv, defaultQuantity: 0, volume: 0.2, handling: 'standard' },

  // ELECTRONICS
  { id: 'tv-32', name: 'TV (32")', category: 'electronics', icon: Tv, defaultQuantity: 0, volume: 0.2, handling: 'fragile' },
  { id: 'tv-50', name: 'TV (50")', category: 'electronics', icon: Tv, defaultQuantity: 0, volume: 0.35, handling: 'fragile' },
  { id: 'tv-65plus', name: 'TV (65"+)', category: 'electronics', icon: Tv, defaultQuantity: 0, volume: 0.5, handling: 'fragile' },
  { id: 'computer-desktop', name: 'Desktop computer', category: 'electronics', icon: Tv, defaultQuantity: 0, volume: 0.3, handling: 'fragile' },
  { id: 'laptop', name: 'Laptop', category: 'electronics', icon: Briefcase, defaultQuantity: 0, volume: 0.05, handling: 'fragile' },
  { id: 'monitor', name: 'Computer monitor', category: 'electronics', icon: Tv, defaultQuantity: 0, volume: 0.15, handling: 'fragile' },
  { id: 'printer', name: 'Printer', category: 'electronics', icon: Package, defaultQuantity: 0, volume: 0.2, handling: 'fragile' },
  { id: 'speakers', name: 'Speaker system', category: 'electronics', icon: Tv, defaultQuantity: 0, volume: 0.3, handling: 'fragile' },
  { id: 'gaming-console', name: 'Gaming console', category: 'electronics', icon: Tv, defaultQuantity: 0, volume: 0.1, handling: 'fragile' },
  { id: 'sound-system', name: 'Home cinema / sound system', category: 'electronics', icon: Tv, defaultQuantity: 0, volume: 0.4, handling: 'fragile' },
  { id: 'router', name: 'Wi-Fi router', category: 'electronics', icon: Package, defaultQuantity: 0, volume: 0.05, handling: 'fragile' },

  // GARAGE & DIY
  { id: 'bike', name: 'Bicycle', category: 'garage', icon: Dumbbell, defaultQuantity: 0, volume: 0.5, handling: 'bulky' },
  { id: 'tools-diy', name: 'Tools / DIY equipment', category: 'garage', icon: Wrench, defaultQuantity: 0, volume: 0.5, handling: 'standard' },
  { id: 'toolbox', name: 'Toolbox', category: 'garage', icon: Wrench, defaultQuantity: 0, volume: 0.2, handling: 'heavy' },
  { id: 'workbench', name: 'Workbench', category: 'garage', icon: Briefcase, defaultQuantity: 0, volume: 1.5, handling: 'heavy' },
  { id: 'ladder', name: 'Ladder', category: 'garage', icon: Wrench, defaultQuantity: 0, volume: 0.6, handling: 'bulky' },
  { id: 'stepladder', name: 'Step ladder', category: 'garage', icon: Wrench, defaultQuantity: 0, volume: 0.3, handling: 'standard' },
  { id: 'power-tools', name: 'Power tools (set)', category: 'garage', icon: Wrench, defaultQuantity: 0, volume: 0.3, handling: 'heavy' },
  { id: 'paint-cans', name: 'Paint cans (set)', category: 'garage', icon: Package, defaultQuantity: 0, volume: 0.2, handling: 'heavy' },
  { id: 'garage-shelving', name: 'Garage shelving unit', category: 'garage', icon: Archive, defaultQuantity: 0, volume: 0.8, handling: 'heavy' },
  { id: 'car-parts', name: 'Car parts / accessories', category: 'garage', icon: Package, defaultQuantity: 0, volume: 0.4, handling: 'heavy' },

  // CHILDREN'S ITEMS
  { id: 'baby-cot', name: 'Baby cot', category: 'children', icon: Baby, defaultQuantity: 0, volume: 1.0, handling: 'bulky' },
  { id: 'crib', name: 'Crib / cradle', category: 'children', icon: Baby, defaultQuantity: 0, volume: 0.8, handling: 'standard' },
  { id: 'changing-table', name: 'Changing table', category: 'children', icon: Baby, defaultQuantity: 0, volume: 0.6, handling: 'standard' },
  { id: 'high-chair', name: 'High chair', category: 'children', icon: Armchair, defaultQuantity: 0, volume: 0.4, handling: 'standard' },
  { id: 'toy-box', name: 'Toy box', category: 'children', icon: Box, defaultQuantity: 0, volume: 0.3, handling: 'standard' },
  { id: 'kids-desk', name: 'Kids desk', category: 'children', icon: Briefcase, defaultQuantity: 0, volume: 0.6, handling: 'standard' },
  { id: 'kids-bookshelf', name: 'Kids bookshelf', category: 'children', icon: Archive, defaultQuantity: 0, volume: 0.5, handling: 'standard' },
  { id: 'rocking-horse', name: 'Rocking horse', category: 'children', icon: Baby, defaultQuantity: 0, volume: 0.4, handling: 'bulky' },
  { id: 'play-mat', name: 'Play mat', category: 'children', icon: Package, defaultQuantity: 0, volume: 0.2, handling: 'standard' },
  { id: 'pushchair', name: 'Pushchair / stroller', category: 'children', icon: Baby, defaultQuantity: 0, volume: 0.5, handling: 'bulky' },

  // SPORTS & HOBBIES
  { id: 'gym-equipment', name: 'Gym equipment', category: 'sports', icon: Dumbbell, defaultQuantity: 0, volume: 1.0, handling: 'heavy' },
  { id: 'treadmill', name: 'Treadmill', category: 'sports', icon: Dumbbell, defaultQuantity: 0, volume: 2.0, handling: 'heavy' },
  { id: 'exercise-bike', name: 'Exercise bike', category: 'sports', icon: Dumbbell, defaultQuantity: 0, volume: 1.2, handling: 'heavy' },
  { id: 'weights-set', name: 'Weights set', category: 'sports', icon: Dumbbell, defaultQuantity: 0, volume: 0.4, handling: 'heavy' },
  { id: 'yoga-mat', name: 'Yoga mat', category: 'sports', icon: Package, defaultQuantity: 0, volume: 0.05, handling: 'standard' },
  { id: 'golf-clubs', name: 'Golf clubs (set)', category: 'sports', icon: Dumbbell, defaultQuantity: 0, volume: 0.3, handling: 'standard' },
  { id: 'tennis-rackets', name: 'Tennis rackets (set)', category: 'sports', icon: Dumbbell, defaultQuantity: 0, volume: 0.2, handling: 'standard' },
  { id: 'skateboard', name: 'Skateboard', category: 'sports', icon: Dumbbell, defaultQuantity: 0, volume: 0.1, handling: 'standard' },
  { id: 'surfboard', name: 'Surfboard', category: 'sports', icon: Dumbbell, defaultQuantity: 0, volume: 0.6, handling: 'bulky' },
  { id: 'musical-instrument', name: 'Musical instrument', category: 'sports', icon: Package, defaultQuantity: 0, volume: 0.5, handling: 'fragile' },
  { id: 'piano-upright', name: 'Upright piano', category: 'sports', icon: Package, defaultQuantity: 0, volume: 2.5, handling: 'heavy' },
  { id: 'guitar', name: 'Guitar', category: 'sports', icon: Package, defaultQuantity: 0, volume: 0.2, handling: 'fragile' },
];

// Quick start presets
export interface QuickStartPreset {
  id: string;
  name: string;
  description: string;
  items: Record<string, number>; // item_id -> quantity
}

export const QUICK_START_PRESETS: QuickStartPreset[] = [
  {
    id: 'empty',
    name: 'Start empty',
    description: 'Build from scratch',
    items: {}
  },
  {
    id: 'studio',
    name: 'Studio',
    description: 'Single room with kitchenette',
    items: {
      'single-bed': 1,
      'wardrobe-small': 1,
      'bedside-table': 1,
      'desk': 1,
      'office-chair': 1,
      'sofa-2seater': 1,
      'coffee-table': 1,
      'tv-large': 1,
      'box-small': 5,
      'box-medium': 8,
      'box-large': 4,
    }
  },
  {
    id: '1-bedroom',
    name: '1 Bedroom',
    description: 'Flat with separate bedroom',
    items: {
      'double-bed': 1,
      'wardrobe-large': 1,
      'bedside-table': 2,
      'chest-drawers': 1,
      'sofa-3seater': 1,
      'armchair': 1,
      'coffee-table': 1,
      'tv-unit': 1,
      'tv-large': 1,
      'dining-table-4': 1,
      'dining-chair': 4,
      'fridge-large': 1,
      'washing-machine': 1,
      'microwave': 1,
      'box-small': 10,
      'box-medium': 15,
      'box-large': 8,
    }
  },
  {
    id: '2-bedroom',
    name: '2 Bedroom',
    description: 'Standard family flat',
    items: {
      'double-bed': 1,
      'single-bed': 1,
      'wardrobe-large': 2,
      'bedside-table': 2,
      'chest-drawers': 2,
      'desk': 1,
      'sofa-3seater': 1,
      'armchair': 2,
      'coffee-table': 1,
      'tv-unit': 1,
      'tv-large': 1,
      'bookshelf': 1,
      'dining-table-6': 1,
      'dining-chair': 6,
      'fridge-large': 1,
      'washing-machine': 1,
      'dishwasher': 1,
      'oven': 1,
      'microwave': 1,
      'box-small': 15,
      'box-medium': 25,
      'box-large': 12,
    }
  },
  {
    id: '3-bedroom',
    name: '3+ Bedroom',
    description: 'Large house or flat',
    items: {
      'king-bed': 1,
      'double-bed': 1,
      'single-bed': 1,
      'wardrobe-large': 3,
      'bedside-table': 4,
      'chest-drawers': 3,
      'desk': 2,
      'corner-sofa': 1,
      'armchair': 2,
      'coffee-table': 1,
      'tv-unit': 1,
      'tv-large': 2,
      'bookshelf': 2,
      'dining-table-6': 1,
      'dining-chair': 6,
      'fridge-large': 1,
      'washing-machine': 1,
      'dishwasher': 1,
      'oven': 1,
      'microwave': 1,
      'kitchen-table': 1,
      'box-small': 25,
      'box-medium': 35,
      'box-large': 20,
    }
  },
];