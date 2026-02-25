/**
 * Time-Based Pricing Engine
 * 
 * Calculates job time and converts it to price:
 * STEP 1: Inventory → handling minutes
 * STEP 2: Crew factor → adjusted time
 * STEP 3: Travel time (if exists)
 * STEP 4: Waiting time (extra selected)
 * STEP 5: Total time → round to billing increment
 * STEP 6: Price = chargeable hours × hourly rate
 */

import { PricingConfig } from './pricingConfigService';

export interface TimeCalculationInput {
  // Inventory
  selectedItems: Array<{
    id: string;
    name: string;
    quantity: number;
    isBox?: boolean;
  }>;
  
  // Pickup conditions
  pickupFloorLevel: 'ground' | 'first' | 'second' | 'thirdPlus';
  pickupHasLift: boolean;
  pickupLongWalk: boolean; // 50m+
  pickupParkingRestricted: boolean;
  
  // Delivery conditions
  deliveryFloorLevel: 'ground' | 'first' | 'second' | 'thirdPlus';
  deliveryHasLift: boolean;
  deliveryLongWalk: boolean;
  deliveryParkingRestricted: boolean;
  
  // Crew
  crewSize: 1 | 2 | 3;
  
  // Optional: travel time (from distance/route calculation)
  travelMinutes?: number;
  
  // Optional: additional waiting time (manually selected)
  additionalWaitingMinutes?: number;
}

export interface TimePricingResult {
  // Time breakdown
  time: {
    handlingMins: number;      // loading + unloading (after adjustments)
    travelMins: number;         // travel time
    waitingMins: number;        // additional waiting time
    totalMins: number;          // sum of all
    chargeableMins: number;     // rounded to billing increment
  };
  
  // Rates used
  rates: {
    hourlyRate: number;         // crew hourly rate
    crewType: string;           // "1 Man", "2 Men", "3+ Men"
    billingIncrement: number;   // 15, 30, or 60
    minimumHours: number;       // minimum chargeable hours
  };
  
  // Price calculation
  totals: {
    labourCost: number;         // chargeable hours × hourly rate
    extrasCost: number;         // waiting time cost (if separate)
    totalPrice: number;         // total labour + extras
  };
  
  // Detailed breakdown (for admin/audit)
  breakdown: {
    baseLoadMins: number;
    baseUnloadMins: number;
    inventoryLoadMins: number;
    inventoryUnloadMins: number;
    pickupMultiplier: number;
    deliveryMultiplier: number;
    crewSpeedFactor: number;
    adjustedLoadMins: number;
    adjustedUnloadMins: number;
  };
  
  // Rules version
  rulesVersion: string;
}

/**
 * Calculate time and price based on time-based pricing rules
 */
export function calculateTimeBasedPrice(
  input: TimeCalculationInput,
  pricingConfig: PricingConfig
): TimePricingResult {
  const { 
    handlingTimeRules, 
    locationMultipliers, 
    crewRules, 
    timeBasedPricing 
  } = pricingConfig;
  
  // STEP 1: Calculate time from inventory
  let inventoryLoadMins = 0;
  let inventoryUnloadMins = 0;
  
  for (const item of input.selectedItems) {
    const qty = item.quantity;
    
    // TODO: Check for item-specific overrides (future feature)
    // For now, use global defaults
    if (item.isBox) {
      inventoryLoadMins += handlingTimeRules.minutesPerBox * qty;
      inventoryUnloadMins += handlingTimeRules.minutesPerBox * qty;
    } else {
      inventoryLoadMins += handlingTimeRules.minutesPerInventoryItem * qty;
      inventoryUnloadMins += handlingTimeRules.minutesPerInventoryItem * qty;
    }
  }
  
  // Add base times
  const baseLoadMins = handlingTimeRules.baseLoadingMinutes;
  const baseUnloadMins = handlingTimeRules.baseUnloadingMinutes;
  
  let loadMins = baseLoadMins + inventoryLoadMins;
  let unloadMins = baseUnloadMins + inventoryUnloadMins;
  
  // STEP 2: Apply location multipliers
  
  // Pickup multipliers
  let pickupMultiplier = 1.0;
  pickupMultiplier *= locationMultipliers.pickup.floorLevel[input.pickupFloorLevel];
  if (!input.pickupHasLift && input.pickupFloorLevel !== 'ground') {
    pickupMultiplier *= locationMultipliers.pickup.noLift;
  }
  if (input.pickupLongWalk) {
    pickupMultiplier *= locationMultipliers.pickup.longWalkDistance;
  }
  if (input.pickupParkingRestricted) {
    pickupMultiplier *= locationMultipliers.pickup.parkingRestricted;
  }
  
  loadMins *= pickupMultiplier;
  
  // Delivery multipliers
  let deliveryMultiplier = 1.0;
  deliveryMultiplier *= locationMultipliers.delivery.floorLevel[input.deliveryFloorLevel];
  if (!input.deliveryHasLift && input.deliveryFloorLevel !== 'ground') {
    deliveryMultiplier *= locationMultipliers.delivery.noLift;
  }
  if (input.deliveryLongWalk) {
    deliveryMultiplier *= locationMultipliers.delivery.longWalkDistance;
  }
  if (input.deliveryParkingRestricted) {
    deliveryMultiplier *= locationMultipliers.delivery.parkingRestricted;
  }
  
  unloadMins *= deliveryMultiplier;
  
  // STEP 3: Apply crew speed factor
  let crewRule = crewRules.twoMEN; // default
  if (input.crewSize === 1) {
    crewRule = crewRules.oneMAN;
  } else if (input.crewSize >= 3) {
    crewRule = crewRules.threePlusMEN;
  }
  
  const crewSpeedFactor = crewRule.speedFactor;
  loadMins *= crewSpeedFactor;
  unloadMins *= crewSpeedFactor;
  
  // STEP 4: Clamp to min/max (optional)
  const totalHandlingMins = loadMins + unloadMins;
  
  let finalLoadMins = loadMins;
  let finalUnloadMins = unloadMins;
  
  if (totalHandlingMins < handlingTimeRules.minimumTotalMinutes) {
    // Scale up proportionally
    const scale = handlingTimeRules.minimumTotalMinutes / totalHandlingMins;
    finalLoadMins *= scale;
    finalUnloadMins *= scale;
  }
  
  if (handlingTimeRules.maximumTotalMinutes !== null) {
    const newTotal = finalLoadMins + finalUnloadMins;
    if (newTotal > handlingTimeRules.maximumTotalMinutes) {
      // Scale down proportionally
      const scale = handlingTimeRules.maximumTotalMinutes / newTotal;
      finalLoadMins *= scale;
      finalUnloadMins *= scale;
    }
  }
  
  // Round to nearest minute
  finalLoadMins = Math.round(finalLoadMins);
  finalUnloadMins = Math.round(finalUnloadMins);
  
  const handlingMins = finalLoadMins + finalUnloadMins;
  
  // STEP 5: Add travel time and waiting time
  const travelMins = input.travelMinutes || 0;
  const waitingMins = input.additionalWaitingMinutes || 0;
  
  const totalMins = handlingMins + travelMins + waitingMins;
  
  // STEP 6: Round to billing increment
  const billingIncrement = timeBasedPricing.billingIncrement;
  let chargeableMins = Math.ceil(totalMins / billingIncrement) * billingIncrement;
  
  // STEP 7: Apply minimum chargeable hours
  const minimumMins = timeBasedPricing.minimumChargeableHours * 60;
  if (chargeableMins < minimumMins) {
    chargeableMins = minimumMins;
  }
  
  // STEP 8: Calculate price
  const chargeableHours = chargeableMins / 60;
  const hourlyRate = crewRule.hourlyRate;
  const labourCost = chargeableHours * hourlyRate;
  
  // Extras cost (waiting time is already included in labour cost)
  const extrasCost = 0;
  
  const totalPrice = labourCost + extrasCost;
  
  return {
    time: {
      handlingMins,
      travelMins,
      waitingMins,
      totalMins,
      chargeableMins,
    },
    rates: {
      hourlyRate,
      crewType: crewRule.label,
      billingIncrement,
      minimumHours: timeBasedPricing.minimumChargeableHours,
    },
    totals: {
      labourCost,
      extrasCost,
      totalPrice,
    },
    breakdown: {
      baseLoadMins,
      baseUnloadMins,
      inventoryLoadMins,
      inventoryUnloadMins,
      pickupMultiplier,
      deliveryMultiplier,
      crewSpeedFactor,
      adjustedLoadMins: finalLoadMins,
      adjustedUnloadMins: finalUnloadMins,
    },
    rulesVersion: '1.0.0',
  };
}

/**
 * Format minutes to human-readable string
 */
export function formatMinutesToHoursAndMinutes(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} mins`;
  }
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (mins === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${mins}m`;
}

/**
 * Format hours to human-readable string
 */
export function formatHours(hours: number): string {
  if (hours < 1) {
    return `${Math.round(hours * 60)} mins`;
  }
  
  const wholeHours = Math.floor(hours);
  const mins = Math.round((hours - wholeHours) * 60);
  
  if (mins === 0) {
    return `${wholeHours}h`;
  }
  
  return `${wholeHours}h ${mins}m`;
}
