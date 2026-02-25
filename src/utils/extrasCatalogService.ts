// ShiftMyHome - Extras Catalog Service
// Manages additional services and items with support for unit pricing and percentage-based fees

import { projectId, publicAnonKey } from './supabase/info';

// 🆕 EXTENDED EXTRAS INTERFACE - SUPPORTS 3 PRICING MODES
export interface ExtraServiceItem {
  id: string;
  name: string;
  description: string;
  category: string;
  active: boolean;
  
  // 🎯 PRICING MODE (determines how price is calculated)
  pricingMode: 'fixed' | 'per_unit' | 'percentage_of_booking';
  
  // For 'fixed' and 'per_unit' modes:
  price?: number;           // Fixed price or unit price
  unitType?: 'service' | 'item' | 'box' | 'roll' | 'meter'; // Type of unit
  
  // For 'per_unit' mode ONLY:
  defaultQty?: number;      // Default quantity shown in quote
  minQty?: number;          // Minimum quantity (default: 1)
  maxQty?: number;          // Maximum quantity (default: 99)
  step?: number;            // Increment step (default: 1)
  
  // For 'percentage_of_booking' mode ONLY:
  percentValue?: number;    // Percentage (e.g., 30 = 30%)
  minFee?: number;          // Optional minimum fee cap
  maxFee?: number;          // Optional maximum fee cap
  
  // Display
  icon?: string;            // Optional icon (emoji or lucide name)
  sortOrder?: number;       // For ordering in UI
}

// 🎁 DEFAULT EXTRAS CATALOG - PRE-CONFIGURED ITEMS
export const DEFAULT_EXTRAS_CATALOG: ExtraServiceItem[] = [
  // ===================================================================
  // PACKING MATERIALS (UNIT PRICING - PER BOX/ROLL)
  // ===================================================================
  {
    id: 'packing-small-box',
    name: 'Small Box',
    description: 'Small cardboard box (30×30×30cm) - ideal for books, DVDs, small items',
    category: 'Packing Materials',
    active: true,
    pricingMode: 'per_unit',
    price: 3.50,
    unitType: 'box',
    defaultQty: 5,
    minQty: 1,
    maxQty: 50,
    step: 1,
    icon: '📦',
    sortOrder: 1,
  },
  {
    id: 'packing-medium-box',
    name: 'Medium Box',
    description: 'Medium cardboard box (45×45×45cm) - ideal for clothes, kitchenware',
    category: 'Packing Materials',
    active: true,
    pricingMode: 'per_unit',
    price: 4.50,
    unitType: 'box',
    defaultQty: 10,
    minQty: 1,
    maxQty: 50,
    step: 1,
    icon: '📦',
    sortOrder: 2,
  },
  {
    id: 'packing-large-box',
    name: 'Large Box',
    description: 'Large cardboard box (60×60×60cm) - ideal for bedding, cushions, lampshades',
    category: 'Packing Materials',
    active: true,
    pricingMode: 'per_unit',
    price: 5.50,
    unitType: 'box',
    defaultQty: 8,
    minQty: 1,
    maxQty: 50,
    step: 1,
    icon: '📦',
    sortOrder: 3,
  },
  {
    id: 'packing-xlarge-box',
    name: 'Extra Large Box',
    description: 'Extra large cardboard box (75×75×75cm) - ideal for large lightweight items',
    category: 'Packing Materials',
    active: true,
    pricingMode: 'per_unit',
    price: 7.00,
    unitType: 'box',
    defaultQty: 5,
    minQty: 1,
    maxQty: 30,
    step: 1,
    icon: '📦',
    sortOrder: 4,
  },
  {
    id: 'packing-bubble-wrap-50m',
    name: 'Bubble Wrap (50m roll)',
    description: 'Large bubble wrap roll - 50 meters, 500mm width',
    category: 'Packing Materials',
    active: true,
    pricingMode: 'per_unit',
    price: 18.00,
    unitType: 'roll',
    defaultQty: 1,
    minQty: 1,
    maxQty: 10,
    step: 1,
    icon: '🫧',
    sortOrder: 5,
  },
  {
    id: 'packing-bubble-wrap-100m',
    name: 'Bubble Wrap (100m roll)',
    description: 'Extra large bubble wrap roll - 100 meters, 500mm width (BEST VALUE)',
    category: 'Packing Materials',
    active: true,
    pricingMode: 'per_unit',
    price: 32.00,
    unitType: 'roll',
    defaultQty: 1,
    minQty: 1,
    maxQty: 5,
    step: 1,
    icon: '🫧',
    sortOrder: 6,
  },
  {
    id: 'packing-tape-roll',
    name: 'Packing Tape Roll',
    description: 'Heavy-duty packing tape (50mm × 66m)',
    category: 'Packing Materials',
    active: true,
    pricingMode: 'per_unit',
    price: 3.00,
    unitType: 'roll',
    defaultQty: 3,
    minQty: 1,
    maxQty: 20,
    step: 1,
    icon: '🎗️',
    sortOrder: 7,
  },
  
  // ===================================================================
  // PACKING SERVICES (FIXED PRICING)
  // ===================================================================
  {
    id: 'packing-service-full',
    name: 'Full Packing Service',
    description: 'Professional packing of all items by our team',
    category: 'Packing Services',
    active: true,
    pricingMode: 'fixed',
    price: 250,
    unitType: 'service',
    icon: '📦',
    sortOrder: 10,
  },
  {
    id: 'packing-service-partial',
    name: 'Partial Packing Service',
    description: 'Professional packing of fragile/specialist items only',
    category: 'Packing Services',
    active: true,
    pricingMode: 'fixed',
    price: 120,
    unitType: 'service',
    icon: '📦',
    sortOrder: 11,
  },
  
  // ===================================================================
  // SPECIALIST SERVICES (FIXED PRICING)
  // ===================================================================
  {
    id: 'piano-moving',
    name: 'Piano Moving',
    description: 'Specialist piano transport with trained movers',
    category: 'Specialist Services',
    active: true,
    pricingMode: 'fixed',
    price: 200,
    unitType: 'item',
    icon: '🎹',
    sortOrder: 20,
  },
  {
    id: 'furniture-dismantling',
    name: 'Furniture Dismantling & Reassembly',
    description: 'Professional furniture disassembly and reassembly',
    category: 'Specialist Services',
    active: true,
    pricingMode: 'fixed',
    price: 50,
    unitType: 'service',
    icon: '🔧',
    sortOrder: 21,
  },
  {
    id: 'extra-heavy-item',
    name: 'Extra Heavy Item Handling',
    description: 'Additional charge for exceptionally heavy items (150kg+)',
    category: 'Specialist Services',
    active: true,
    pricingMode: 'fixed',
    price: 40,
    unitType: 'item',
    icon: '🏋️',
    sortOrder: 22,
  },
  
  // ===================================================================
  // STORAGE & INSURANCE (FIXED PRICING)
  // ===================================================================
  {
    id: 'storage-1month',
    name: 'Storage (1 Month)',
    description: 'Secure storage for 1 month',
    category: 'Storage',
    active: true,
    pricingMode: 'fixed',
    price: 100,
    unitType: 'service',
    icon: '🏢',
    sortOrder: 30,
  },
  {
    id: 'insurance-premium',
    name: 'Premium Insurance',
    description: 'Extended coverage up to £50,000',
    category: 'Insurance',
    active: true,
    pricingMode: 'fixed',
    price: 75,
    unitType: 'service',
    icon: '🛡️',
    sortOrder: 31,
  },
  
  // ===================================================================
  // ADDITIONAL SERVICES (FIXED PRICING)
  // ===================================================================
  {
    id: 'waiting-time',
    name: 'Waiting Time',
    description: 'Per 30 minutes (when delays occur)',
    category: 'Additional Services',
    active: true,
    pricingMode: 'fixed',
    price: 25,
    unitType: 'service',
    icon: '⏰',
    sortOrder: 40,
  },
  
  // ===================================================================
  // FEES (PERCENTAGE-BASED & FIXED)
  // ===================================================================
  {
    id: 'late-cancellation',
    name: 'Late Cancellation Fee',
    description: 'Charged for cancellations within 24 hours of scheduled move',
    category: 'Fees',
    active: true,
    pricingMode: 'percentage_of_booking',
    percentValue: 30,        // 30% of booking value
    minFee: 50,              // Minimum £50
    maxFee: 300,             // Maximum £300
    unitType: 'service',
    icon: '⚠️',
    sortOrder: 50,
  },
  {
    id: 'no-access-aborted',
    name: 'No Access / Job Aborted',
    description: 'Charged when job cannot be completed due to access issues or customer fault',
    category: 'Fees',
    active: true,
    pricingMode: 'fixed',
    price: 120,
    unitType: 'service',
    icon: '🚫',
    sortOrder: 51,
  },
  {
    id: 'congestion-tolls',
    name: 'Congestion / Tolls Charge',
    description: 'Pass-through charges for congestion zones and toll roads',
    category: 'Fees',
    active: true,
    pricingMode: 'fixed',
    price: 20,
    unitType: 'service',
    icon: '🚦',
    sortOrder: 52,
  },
];

// ===================================================================
// API FUNCTIONS - FETCH & UPDATE EXTRAS
// ===================================================================

/**
 * Fetch extras catalog from backend
 */
export async function fetchExtrasCatalog(): Promise<ExtraServiceItem[]> {
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-94f26792/extras-catalog`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch extras catalog: ${response.status}`);
    }

    const data = await response.json();
    
    // If no data or empty array, return defaults
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.log('📦 No extras catalog found, using defaults');
      return DEFAULT_EXTRAS_CATALOG;
    }

    return data;
  } catch (error) {
    console.error('Error fetching extras catalog:', error);
    // Return defaults on error
    return DEFAULT_EXTRAS_CATALOG;
  }
}

/**
 * Update extras catalog in backend
 */
export async function updateExtrasCatalog(extras: ExtraServiceItem[]): Promise<void> {
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-94f26792/extras-catalog`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(extras),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update extras catalog: ${response.status}`);
    }

    console.log('✅ Extras catalog updated successfully');
  } catch (error) {
    console.error('Error updating extras catalog:', error);
    throw error;
  }
}

/**
 * Calculate price for an extra based on its pricing mode
 */
export function calculateExtraPrice(
  extra: ExtraServiceItem,
  quantity: number,
  bookingSubtotal?: number
): number {
  switch (extra.pricingMode) {
    case 'fixed':
      return extra.price || 0;

    case 'per_unit':
      return (extra.price || 0) * quantity;

    case 'percentage_of_booking':
      if (!bookingSubtotal) {
        console.warn(`⚠️ Cannot calculate percentage-based fee for ${extra.name}: bookingSubtotal not provided`);
        return 0;
      }
      
      let fee = Math.round((bookingSubtotal * (extra.percentValue || 0)) / 100);
      
      // Apply caps
      if (extra.minFee && fee < extra.minFee) {
        fee = extra.minFee;
      }
      if (extra.maxFee && fee > extra.maxFee) {
        fee = extra.maxFee;
      }
      
      return fee;

    default:
      console.error(`Unknown pricing mode: ${extra.pricingMode}`);
      return 0;
  }
}

/**
 * Get extras by category
 */
export function getExtrasByCategory(extras: ExtraServiceItem[]): Record<string, ExtraServiceItem[]> {
  const categorized: Record<string, ExtraServiceItem[]> = {};
  
  extras
    .filter(extra => extra.active)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
    .forEach(extra => {
      if (!categorized[extra.category]) {
        categorized[extra.category] = [];
      }
      categorized[extra.category].push(extra);
    });
  
  return categorized;
}

/**
 * Format unit type for display
 */
export function formatUnitType(unitType: string, quantity?: number): string {
  const qty = quantity || 1;
  
  switch (unitType) {
    case 'box':
      return qty === 1 ? 'box' : 'boxes';
    case 'roll':
      return qty === 1 ? 'roll' : 'rolls';
    case 'meter':
      return qty === 1 ? 'meter' : 'meters';
    case 'item':
      return qty === 1 ? 'item' : 'items';
    case 'service':
      return 'service';
    default:
      return unitType;
  }
}

/**
 * Format price display for extra
 */
export function formatExtraPrice(extra: ExtraServiceItem): string {
  switch (extra.pricingMode) {
    case 'fixed':
      return `£${(extra.price || 0).toFixed(2)}`;
    
    case 'per_unit':
      return `£${(extra.price || 0).toFixed(2)} per ${extra.unitType || 'unit'}`;
    
    case 'percentage_of_booking':
      return `${extra.percentValue || 0}% of booking`;
    
    default:
      return '£0.00';
  }
}

/**
 * Get active extras from localStorage cache (synchronous)
 * Use this for immediate access in UI components
 */
export function getActiveExtras(): ExtraServiceItem[] {
  try {
    const cached = localStorage.getItem('smh_extras_catalog');
    if (cached) {
      const extras = JSON.parse(cached);
      return extras.filter((e: ExtraServiceItem) => e.active);
    }
  } catch (error) {
    console.warn('Failed to get cached extras:', error);
  }
  
  // Fallback to defaults
  return DEFAULT_EXTRAS_CATALOG.filter(e => e.active);
}

/**
 * Get all extras (including inactive)
 */
export function getAllExtras(): ExtraServiceItem[] {
  try {
    const cached = localStorage.getItem('smh_extras_catalog');
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (error) {
    console.warn('Failed to get cached extras:', error);
  }
  
  return DEFAULT_EXTRAS_CATALOG;
}

/**
 * Get extra by ID
 */
export function getExtraById(id: string): ExtraServiceItem | undefined {
  return getAllExtras().find(e => e.id === id);
}