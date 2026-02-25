/**
 * 🪑 FURNITURE & ITEMS PRICING ENGINE
 * 
 * Simplified pricing for individual furniture/item transport
 * NO property multipliers (doesn't make sense for 2-3 items)
 * 
 * FORMULA:
 * Base Price = Volume × £12/m³
 * + Access Charges (stairs, parking)
 * × Package Multiplier (Standard 1.0 / Premium 1.3)
 * × Quantity Discount (optional: 5-10% for multiple items)
 * + Date Surcharges (weekend, peak season)
 * = Final Price (min £120)
 */

import { PricingConfig } from './pricingConfigService';

export interface FurnitureItemsPricingInput {
  // Inventory
  totalVolume: number; // m³
  itemCount: number; // Number of items (for quantity discounts)
  
  // Access details (PICKUP)
  pickupFloors?: number; // 0 = ground, 1 = first floor, etc.
  pickupHasLift?: boolean;
  pickupParking?: 'easy' | 'moderate' | 'difficult';
  
  // Access details (DELIVERY)
  deliveryFloors?: number;
  deliveryHasLift?: boolean;
  deliveryParking?: 'easy' | 'moderate' | 'difficult';
  
  // Service package
  package?: 'standard' | 'premium';
  
  // Date
  moveDate?: Date;
  isWeekend?: boolean;
  isPeakSeason?: boolean;
  isEndOfMonth?: boolean;
  isFlexibleDate?: boolean;
}

export interface FurnitureItemsPricingResult {
  // Breakdown
  baseVolumeCharge: number;
  accessCharges: number;
  packageMultiplier: number;
  quantityDiscount: number; // 0.95 (5% off), 0.90 (10% off), 1.0 (no discount)
  dateSurcharges: number;
  
  // Subtotals
  subtotalBeforePackage: number;
  subtotalAfterPackage: number;
  subtotalAfterDiscount: number;
  
  // Final
  totalPrice: number;
  minimumApplied: boolean;
  
  // Breakdown for display
  breakdown: {
    label: string;
    value: number;
    type: 'base' | 'charge' | 'multiplier' | 'discount' | 'surcharge' | 'total';
  }[];
}

/**
 * Calculate Furniture & Items pricing
 */
export function calculateFurnitureItemsPrice(
  input: FurnitureItemsPricingInput,
  config: PricingConfig
): FurnitureItemsPricingResult {
  const breakdown: FurnitureItemsPricingResult['breakdown'] = [];
  
  // 1️⃣ BASE VOLUME CHARGE
  const baseVolumeCharge = input.totalVolume * config.inventoryHandlingRules.pricePerCubicMeter;
  breakdown.push({
    label: `Volume Charge (${input.totalVolume.toFixed(2)} m³ × £${config.inventoryHandlingRules.pricePerCubicMeter}/m³)`,
    value: baseVolumeCharge,
    type: 'base'
  });
  
  // 2️⃣ ACCESS CHARGES
  let accessCharges = 0;
  
  // Pickup stairs
  if (input.pickupFloors && input.pickupFloors > 0) {
    const stairCharge = input.pickupHasLift
      ? input.pickupFloors * config.accessCharges.stairsWithLiftPerFloor
      : input.pickupFloors * config.accessCharges.stairsWithoutLiftPerFloor;
    accessCharges += stairCharge;
    breakdown.push({
      label: `Pickup - ${input.pickupFloors} floor${input.pickupFloors > 1 ? 's' : ''} (${input.pickupHasLift ? 'with lift' : 'no lift'})`,
      value: stairCharge,
      type: 'charge'
    });
  }
  
  // Pickup parking
  if (input.pickupParking && input.pickupParking !== 'easy') {
    const parkingCharge = input.pickupParking === 'moderate'
      ? config.accessCharges.parkingModerate
      : config.accessCharges.parkingDifficult;
    accessCharges += parkingCharge;
    breakdown.push({
      label: `Pickup - ${input.pickupParking} parking`,
      value: parkingCharge,
      type: 'charge'
    });
  }
  
  // Delivery stairs
  if (input.deliveryFloors && input.deliveryFloors > 0) {
    const stairCharge = input.deliveryHasLift
      ? input.deliveryFloors * config.accessCharges.stairsWithLiftPerFloor
      : input.deliveryFloors * config.accessCharges.stairsWithoutLiftPerFloor;
    accessCharges += stairCharge;
    breakdown.push({
      label: `Delivery - ${input.deliveryFloors} floor${input.deliveryFloors > 1 ? 's' : ''} (${input.deliveryHasLift ? 'with lift' : 'no lift'})`,
      value: stairCharge,
      type: 'charge'
    });
  }
  
  // Delivery parking
  if (input.deliveryParking && input.deliveryParking !== 'easy') {
    const parkingCharge = input.deliveryParking === 'moderate'
      ? config.accessCharges.parkingModerate
      : config.accessCharges.parkingDifficult;
    accessCharges += parkingCharge;
    breakdown.push({
      label: `Delivery - ${input.deliveryParking} parking`,
      value: parkingCharge,
      type: 'charge'
    });
  }
  
  // 3️⃣ SUBTOTAL BEFORE PACKAGE
  const subtotalBeforePackage = baseVolumeCharge + accessCharges;
  
  // 4️⃣ PACKAGE MULTIPLIER
  const packageMultiplier = input.package === 'premium' ? 1.3 : 1.0;
  const subtotalAfterPackage = subtotalBeforePackage * packageMultiplier;
  
  if (packageMultiplier > 1.0) {
    breakdown.push({
      label: `Premium Package (×${packageMultiplier})`,
      value: subtotalAfterPackage - subtotalBeforePackage,
      type: 'multiplier'
    });
  }
  
  // 5️⃣ QUANTITY DISCOUNT (based on item count)
  let quantityDiscount = 1.0; // No discount by default
  
  if (input.itemCount >= 10) {
    quantityDiscount = 0.85; // 15% off for 10+ items
  } else if (input.itemCount >= 5) {
    quantityDiscount = 0.90; // 10% off for 5-9 items
  } else if (input.itemCount >= 2) {
    quantityDiscount = 0.95; // 5% off for 2-4 items
  }
  
  const subtotalAfterDiscount = subtotalAfterPackage * quantityDiscount;
  
  if (quantityDiscount < 1.0) {
    const discountPercent = Math.round((1 - quantityDiscount) * 100);
    breakdown.push({
      label: `Quantity Discount - ${input.itemCount} items (-${discountPercent}%)`,
      value: -(subtotalAfterPackage - subtotalAfterDiscount),
      type: 'discount'
    });
  }
  
  // 6️⃣ DATE SURCHARGES
  let dateSurcharges = 0;
  
  if (input.isWeekend) {
    dateSurcharges += config.dateSurcharges.weekendSurcharge;
    breakdown.push({
      label: 'Weekend Surcharge',
      value: config.dateSurcharges.weekendSurcharge,
      type: 'surcharge'
    });
  }
  
  if (input.isPeakSeason) {
    dateSurcharges += config.dateSurcharges.peakSeasonSurcharge;
    breakdown.push({
      label: 'Peak Season Surcharge',
      value: config.dateSurcharges.peakSeasonSurcharge,
      type: 'surcharge'
    });
  }
  
  if (input.isEndOfMonth) {
    dateSurcharges += config.dateSurcharges.endOfMonthSurcharge;
    breakdown.push({
      label: 'End of Month Surcharge',
      value: config.dateSurcharges.endOfMonthSurcharge,
      type: 'surcharge'
    });
  }
  
  if (input.isFlexibleDate) {
    dateSurcharges -= config.dateSurcharges.flexibleDateDiscount;
    breakdown.push({
      label: 'Flexible Date Discount',
      value: -config.dateSurcharges.flexibleDateDiscount,
      type: 'discount'
    });
  }
  
  // 7️⃣ TOTAL BEFORE MINIMUM
  let totalPrice = subtotalAfterDiscount + dateSurcharges;
  
  // 8️⃣ APPLY GLOBAL MINIMUM
  const minimumApplied = totalPrice < config.globalMinCharge;
  if (minimumApplied) {
    breakdown.push({
      label: `Minimum Charge Applied (was £${totalPrice.toFixed(2)})`,
      value: config.globalMinCharge - totalPrice,
      type: 'charge'
    });
    totalPrice = config.globalMinCharge;
  }
  
  // Final total
  breakdown.push({
    label: 'Total Price',
    value: totalPrice,
    type: 'total'
  });
  
  return {
    baseVolumeCharge,
    accessCharges,
    packageMultiplier,
    quantityDiscount,
    dateSurcharges,
    subtotalBeforePackage,
    subtotalAfterPackage,
    subtotalAfterDiscount,
    totalPrice,
    minimumApplied,
    breakdown
  };
}

/**
 * 📅 Calculate price for each day in calendar (with day-of-week multipliers)
 */
export function calculateFurnitureItemsCalendarPrices(
  input: Omit<FurnitureItemsPricingInput, 'moveDate' | 'isWeekend'>,
  dates: Date[],
  config: PricingConfig
): Map<string, { price: number; multiplier: number; dayName: string }> {
  const calendar = new Map<string, { price: number; multiplier: number; dayName: string }>();
  
  // First calculate base price (without date-specific factors)
  const baseInput: FurnitureItemsPricingInput = {
    ...input,
    isWeekend: false,
    isPeakSeason: false,
    isEndOfMonth: false
  };
  
  const baseResult = calculateFurnitureItemsPrice(baseInput, config);
  const basePrice = baseResult.totalPrice;
  
  // Apply day-of-week multipliers for each date
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const multiplierKeys: (keyof typeof config.dayOfWeekMultipliers)[] = [
    'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'
  ];
  
  for (const date of dates) {
    const dayOfWeek = date.getDay();
    const multiplierKey = multiplierKeys[dayOfWeek];
    const multiplier = config.dayOfWeekMultipliers[multiplierKey];
    const price = basePrice * multiplier;
    
    const dateKey = date.toISOString().split('T')[0];
    calendar.set(dateKey, {
      price: Math.round(price * 100) / 100, // Round to 2 decimals
      multiplier,
      dayName: dayNames[dayOfWeek]
    });
  }
  
  return calendar;
}

/**
 * 🎯 Get best price day from calendar
 */
export function getBestPriceDay(
  calendar: Map<string, { price: number; multiplier: number; dayName: string }>
): { date: string; price: number; dayName: string } | null {
  let bestDate: string | null = null;
  let bestPrice = Infinity;
  let bestDayName = '';
  
  for (const [date, data] of calendar.entries()) {
    if (data.price < bestPrice) {
      bestPrice = data.price;
      bestDate = date;
      bestDayName = data.dayName;
    }
  }
  
  if (!bestDate) return null;
  
  return {
    date: bestDate,
    price: bestPrice,
    dayName: bestDayName
  };
}
