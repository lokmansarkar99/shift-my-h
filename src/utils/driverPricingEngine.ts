/**
 * Driver Pricing Engine
 * Simplified pricing for drivers to charge extra items on-site
 * Independent from main admin pricing - designed for quick on-the-spot calculations
 */

import { projectId, publicAnonKey } from './supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-94f26792`;

// 📦 Driver Item Categories (simplified for quick selection)
export interface DriverItemPrice {
  id: string;
  category: 'furniture' | 'appliance' | 'box' | 'specialty' | 'vehicle';
  name: string;
  basePrice: number; // Base price for the item
  lateAdditionSurcharge: number; // % surcharge for adding on-site (e.g., 0.15 = 15%)
  description?: string;
}

// 🎛️ Driver Pricing Config (simpler than admin config)
export interface DriverPricingConfig {
  items: DriverItemPrice[];
  lateAdditionMultiplier: number; // Global multiplier for late additions (e.g., 1.2 = +20%)
  minimumExtraCharge: number; // Minimum charge for any extra item (e.g., £25)
  cashPaymentDiscount: number; // Discount if customer pays cash on spot (e.g., 0.05 = 5% off)
  
  // 💰 REVENUE SPLIT (NEW)
  driverCommissionPercentage: number; // % that goes to driver (e.g., 0.70 = 70%)
  companyRevenuePercentage: number; // % that goes to company (e.g., 0.30 = 30%)
  // Note: driverCommission + companyRevenue should = 1.0 (100%)
  
  lastUpdated?: string;
}

// 🚚 Default Driver Pricing (can be overridden by admin)
export const DEFAULT_DRIVER_PRICING: DriverPricingConfig = {
  lateAdditionMultiplier: 1.2, // +20% for items added on-site
  minimumExtraCharge: 25, // Minimum £25 for any extra item
  cashPaymentDiscount: 0.05, // 5% discount for cash payment
  driverCommissionPercentage: 0.70, // 70% goes to driver
  companyRevenuePercentage: 0.30, // 30% goes to company
  items: [
    // 🪑 FURNITURE
    { id: 'chair', category: 'furniture', name: 'Chair', basePrice: 40, lateAdditionSurcharge: 0.15, description: 'Dining/office chair' },
    { id: 'small-table', category: 'furniture', name: 'Small Table', basePrice: 50, lateAdditionSurcharge: 0.15, description: 'Coffee/side table' },
    { id: 'dining-table', category: 'furniture', name: 'Dining Table', basePrice: 80, lateAdditionSurcharge: 0.20, description: '4-6 seater' },
    { id: 'bookshelf', category: 'furniture', name: 'Bookshelf', basePrice: 60, lateAdditionSurcharge: 0.15 },
    { id: '2-seater-sofa', category: 'furniture', name: '2-Seater Sofa', basePrice: 100, lateAdditionSurcharge: 0.20 },
    { id: '3-seater-sofa', category: 'furniture', name: '3-Seater Sofa', basePrice: 120, lateAdditionSurcharge: 0.20 },
    { id: 'single-bed', category: 'furniture', name: 'Single Bed', basePrice: 90, lateAdditionSurcharge: 0.20, description: 'Frame + mattress' },
    { id: 'double-bed', category: 'furniture', name: 'Double Bed', basePrice: 120, lateAdditionSurcharge: 0.20, description: 'Frame + mattress' },
    { id: 'king-bed', category: 'furniture', name: 'King Bed', basePrice: 150, lateAdditionSurcharge: 0.25, description: 'Frame + mattress' },
    { id: 'wardrobe-small', category: 'furniture', name: 'Small Wardrobe', basePrice: 80, lateAdditionSurcharge: 0.20, description: '2 door' },
    { id: 'wardrobe-large', category: 'furniture', name: 'Large Wardrobe', basePrice: 130, lateAdditionSurcharge: 0.25, description: '3+ door' },
    { id: 'chest-drawers', category: 'furniture', name: 'Chest of Drawers', basePrice: 60, lateAdditionSurcharge: 0.15 },
    { id: 'desk', category: 'furniture', name: 'Desk', basePrice: 70, lateAdditionSurcharge: 0.15 },
    { id: 'tv-stand', category: 'furniture', name: 'TV Stand', basePrice: 50, lateAdditionSurcharge: 0.15 },

    // 🔌 APPLIANCES
    { id: 'fridge', category: 'appliance', name: 'Fridge', basePrice: 60, lateAdditionSurcharge: 0.20, description: 'Standard fridge' },
    { id: 'fridge-freezer', category: 'appliance', name: 'Fridge-Freezer', basePrice: 80, lateAdditionSurcharge: 0.20, description: 'Tall unit' },
    { id: 'washing-machine', category: 'appliance', name: 'Washing Machine', basePrice: 70, lateAdditionSurcharge: 0.20 },
    { id: 'tumble-dryer', category: 'appliance', name: 'Tumble Dryer', basePrice: 70, lateAdditionSurcharge: 0.20 },
    { id: 'dishwasher', category: 'appliance', name: 'Dishwasher', basePrice: 60, lateAdditionSurcharge: 0.20 },
    { id: 'oven', category: 'appliance', name: 'Oven', basePrice: 80, lateAdditionSurcharge: 0.25, description: 'Built-in or standalone' },
    { id: 'microwave', category: 'appliance', name: 'Microwave', basePrice: 30, lateAdditionSurcharge: 0.10 },
    { id: 'tv-small', category: 'appliance', name: 'TV (Small)', basePrice: 35, lateAdditionSurcharge: 0.10, description: 'Under 40"' },
    { id: 'tv-large', category: 'appliance', name: 'TV (Large)', basePrice: 60, lateAdditionSurcharge: 0.15, description: '40"+ or heavy' },

    // 📦 BOXES & BAGS
    { id: 'small-box', category: 'box', name: 'Small Box', basePrice: 5, lateAdditionSurcharge: 0.10, description: 'Books/kitchen items' },
    { id: 'medium-box', category: 'box', name: 'Medium Box', basePrice: 8, lateAdditionSurcharge: 0.10, description: 'Standard moving box' },
    { id: 'large-box', category: 'box', name: 'Large Box', basePrice: 12, lateAdditionSurcharge: 0.10, description: 'Bedding/clothes' },
    { id: 'plastic-bin', category: 'box', name: 'Plastic Storage Bin', basePrice: 10, lateAdditionSurcharge: 0.10 },
    { id: 'suitcase', category: 'box', name: 'Suitcase/Luggage', basePrice: 8, lateAdditionSurcharge: 0.10 },
    { id: 'bin-bag', category: 'box', name: 'Bin Bag (filled)', basePrice: 5, lateAdditionSurcharge: 0.10 },

    // ✨ SPECIALTY ITEMS
    { id: 'piano', category: 'specialty', name: 'Piano', basePrice: 180, lateAdditionSurcharge: 0.30, description: 'Upright or grand' },
    { id: 'pool-table', category: 'specialty', name: 'Pool Table', basePrice: 200, lateAdditionSurcharge: 0.30 },
    { id: 'treadmill', category: 'specialty', name: 'Treadmill/Gym Equipment', basePrice: 90, lateAdditionSurcharge: 0.25 },
    { id: 'bike', category: 'specialty', name: 'Bicycle', basePrice: 30, lateAdditionSurcharge: 0.15 },
    { id: 'lawnmower', category: 'specialty', name: 'Lawnmower', basePrice: 40, lateAdditionSurcharge: 0.20 },
    { id: 'bbq', category: 'specialty', name: 'BBQ Grill', basePrice: 50, lateAdditionSurcharge: 0.20 },
    { id: 'mirror-large', category: 'specialty', name: 'Large Mirror', basePrice: 60, lateAdditionSurcharge: 0.25, description: 'Fragile, needs extra care' },
    { id: 'artwork', category: 'specialty', name: 'Artwork/Painting', basePrice: 45, lateAdditionSurcharge: 0.20, description: 'Per piece' },
    { id: 'chandelier', category: 'specialty', name: 'Chandelier', basePrice: 80, lateAdditionSurcharge: 0.25 },

    // 🚲 VEHICLES
    { id: 'motorbike', category: 'vehicle', name: 'Motorbike', basePrice: 100, lateAdditionSurcharge: 0.25 },
    { id: 'scooter', category: 'vehicle', name: 'Scooter/Moped', basePrice: 70, lateAdditionSurcharge: 0.20 },
  ],
};

// In-memory cache
let cachedDriverConfig: DriverPricingConfig | null = null;

/**
 * Fetch driver pricing config from backend
 */
export async function fetchDriverPricingConfig(): Promise<DriverPricingConfig> {
  try {
    const response = await fetch(`${API_BASE}/driver-pricing-config`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    if (!response.ok) {
      console.warn('Failed to fetch driver pricing config, using defaults');
      return DEFAULT_DRIVER_PRICING;
    }

    const data = await response.json();
    const config = data.config || DEFAULT_DRIVER_PRICING;
    cachedDriverConfig = config;
    return config;
  } catch (error) {
    console.error('Error fetching driver pricing config:', error);
    return DEFAULT_DRIVER_PRICING;
  }
}

/**
 * Save driver pricing config (Admin only)
 */
export async function saveDriverPricingConfig(config: DriverPricingConfig): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE}/driver-pricing-config`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ config }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.error || 'Failed to save config' };
    }

    cachedDriverConfig = config;
    return { success: true };
  } catch (error) {
    console.error('Error saving driver pricing config:', error);
    return { success: false, error: 'Network error' };
  }
}

/**
 * Calculate price for a driver-added extra item
 */
export interface ExtraItemCalculation {
  item: DriverItemPrice;
  quantity: number;
  baseTotal: number; // base price × quantity
  surchargeAmount: number; // late addition surcharge
  subtotal: number; // base + surcharge
  finalPrice: number; // after global multiplier + minimum charge
  cashDiscount?: number; // if paying cash
  finalWithCashDiscount?: number; // final price with cash discount
}

export function calculateExtraItem(
  itemId: string,
  quantity: number,
  config: DriverPricingConfig = DEFAULT_DRIVER_PRICING,
  payingCash: boolean = false
): ExtraItemCalculation | null {
  const item = config.items.find(i => i.id === itemId);
  if (!item) return null;

  // Step 1: Base total
  const baseTotal = item.basePrice * quantity;

  // Step 2: Late addition surcharge (per item)
  const surchargeAmount = baseTotal * item.lateAdditionSurcharge;

  // Step 3: Subtotal
  const subtotal = baseTotal + surchargeAmount;

  // Step 4: Apply global late addition multiplier
  let finalPrice = subtotal * config.lateAdditionMultiplier;

  // Step 5: Enforce minimum charge
  if (finalPrice < config.minimumExtraCharge) {
    finalPrice = config.minimumExtraCharge;
  }

  // Step 6: Cash discount (if applicable)
  let cashDiscount: number | undefined;
  let finalWithCashDiscount: number | undefined;
  
  if (payingCash) {
    cashDiscount = finalPrice * config.cashPaymentDiscount;
    finalWithCashDiscount = finalPrice - cashDiscount;
  }

  return {
    item,
    quantity,
    baseTotal,
    surchargeAmount,
    subtotal,
    finalPrice,
    cashDiscount,
    finalWithCashDiscount,
  };
}

/**
 * Calculate total for multiple extra items
 */
export interface MultiItemCalculation {
  items: ExtraItemCalculation[];
  totalBeforeCash: number;
  cashDiscount?: number;
  totalAfterCash?: number;
  
  // 💰 REVENUE SPLIT (NEW)
  revenueSplit?: {
    totalCustomerPaid: number; // What customer actually paid
    driverEarnings: number; // What driver receives (commission)
    companyRevenue: number; // What company receives
    driverPercentage: number; // % that driver gets
    companyPercentage: number; // % that company gets
  };
}

export function calculateMultipleExtraItems(
  selections: { itemId: string; quantity: number }[],
  config: DriverPricingConfig = DEFAULT_DRIVER_PRICING,
  payingCash: boolean = false
): MultiItemCalculation {
  const items: ExtraItemCalculation[] = [];
  let totalBeforeCash = 0;

  for (const selection of selections) {
    const calc = calculateExtraItem(selection.itemId, selection.quantity, config, false);
    if (calc) {
      items.push(calc);
      totalBeforeCash += calc.finalPrice;
    }
  }

  // Apply cash discount to total (not per item)
  let cashDiscount: number | undefined;
  let totalAfterCash: number | undefined;

  if (payingCash) {
    cashDiscount = totalBeforeCash * config.cashPaymentDiscount;
    totalAfterCash = totalBeforeCash - cashDiscount;
  }

  // 💰 Calculate revenue split
  const totalCustomerPaid = payingCash ? (totalAfterCash || totalBeforeCash) : totalBeforeCash;
  const driverEarnings = totalCustomerPaid * config.driverCommissionPercentage;
  const companyRevenue = totalCustomerPaid * config.companyRevenuePercentage;

  return {
    items,
    totalBeforeCash,
    cashDiscount,
    totalAfterCash,
    revenueSplit: {
      totalCustomerPaid,
      driverEarnings,
      companyRevenue,
      driverPercentage: config.driverCommissionPercentage,
      companyPercentage: config.companyRevenuePercentage,
    },
  };
}

/**
 * Get config from cache or fetch
 */
export async function getDriverPricingConfig(): Promise<DriverPricingConfig> {
  if (cachedDriverConfig) {
    return cachedDriverConfig;
  }
  return await fetchDriverPricingConfig();
}

/**
 * Clear cache
 */
export function clearDriverPricingCache(): void {
  cachedDriverConfig = null;
}