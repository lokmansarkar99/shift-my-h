// ShiftMyHome Pricing Engine - FINAL REFINED VERSION
// Logic branched for 6 separate service flows with advanced admin rules integration

import {
  DEFAULT_PRICING_CONFIG,
  PricingConfig,
} from './pricingConfigService';

import {
  ServiceTypeConfig,
  getServiceTypes,
} from './serviceTypesService';

import {
  calculateTimeBasedPrice,
  TimeCalculationInput
} from './timeBasedPricingEngine';

// Helper to ensure we always have a number
export function num(value: any, defaultValue: number = 0): number {
  if (value === null || value === undefined) return defaultValue;
  const parsed = typeof value === 'string' ? parseFloat(value) : Number(value);
  return Number.isFinite(parsed) ? parsed : defaultValue;
}

let cachedPricingConfig: PricingConfig = DEFAULT_PRICING_CONFIG;

export function setPricingConfig(config: PricingConfig) {
  cachedPricingConfig = config;
}

export function getCurrentPricingConfig(): PricingConfig {
  return cachedPricingConfig;
}

export function getServiceTypeConfig(serviceTypeId: string): ServiceTypeConfig {
  const serviceTypes = getServiceTypes();
  const serviceType = serviceTypes.find((st) => st.id === serviceTypeId);
  return serviceType || serviceTypes[0];
}

// Metadata for items (shared library but interpreted differently per service)
export const INVENTORY_METADATA: Record<string, { volume: number; weight: number }> = {
  'single-bed': { volume: 1.2, weight: 50 },
  'double-bed': { volume: 2.0, weight: 70 },
  'king-bed': { volume: 2.5, weight: 90 },
  'sofa-2seater': { volume: 2.0, weight: 60 },
  'sofa-3seater': { volume: 2.8, weight: 80 },
  'box-small': { volume: 0.05, weight: 8 },
  'box-medium': { volume: 0.1, weight: 12 },
  'box-large': { volume: 0.15, weight: 15 },
  'washing-machine': { volume: 0.8, weight: 70 },
  'fridge-large': { volume: 1.2, weight: 80 },
  // Other Delivery Specialized Items
  'other-pallet-large': { volume: 1.5, weight: 150 },
  'other-crate-oversized': { volume: 2.0, weight: 120 },
  'other-machine-small': { volume: 1.2, weight: 200 },
  'other-gym-equipment': { volume: 1.8, weight: 130 },
  'other-exhibition-stand': { volume: 0.8, weight: 45 },
  'other-heavy-parcel': { volume: 0.25, weight: 40 },
  'other-medical-fragile': { volume: 0.6, weight: 35 },
  'other-commercial-printer': { volume: 1.4, weight: 95 },
  'other-commercial-package': { volume: 0.15, weight: 12 },
  'other-bulky-special': { volume: 1.0, weight: 55 },
  // ... rest of library is accessed via dynamic lookups
};

export interface PricingInput {
  serviceType?: string;
  distanceMiles?: number;
  inventory: Array<{ id: string; quantity: number }>;
  propertyType?: string;
  fromFloor?: number;
  toFloor?: number;
  fromLift?: boolean;
  toLift?: boolean;
  moveDate?: Date;
  crewSize?: 1 | 2 | 3;
  disposalMethod?: 'we_dispose' | 'specific_location';
  bikeType?: 'standard' | 'large' | 'bicycle';
  urgency?: 'same-day' | 'next-day' | 'scheduled';
}

export function calculatePrice(input: PricingInput) {
  const config = getCurrentPricingConfig();
  const serviceType = input.serviceType || 'house-move';
  const serviceConfig = getServiceTypeConfig(serviceType);

  // 1. Calculate RAW stats
  let rawVolume = 0;
  let rawWeight = 0;
  for (const item of input.inventory) {
    const meta = INVENTORY_METADATA[item.id] || { volume: 0.1, weight: 10 }; // Fallback
    rawVolume += meta.volume * item.quantity;
    rawWeight += meta.weight * item.quantity;
  }

  // 2. Apply ADVANCED VOLUME FACTORS (Packing & Safety)
  const packingFactor = num(config.inventoryHandlingRules?.packingFactor, 1.1);
  const safetyMargin = num(config.inventoryHandlingRules?.safetyMargin, 1.1);
  const adjustedVolume = rawVolume * packingFactor * safetyMargin;

  // 3. BRANCH LOGIC (Completely Isolated)
  let baseLabourCost = 0;
  let serviceSpecificExtra = 0;
  let estTimeHours = 0;

  switch (serviceType) {
    case 'house-move': {
      // Logic: Time-Based (Hourly x Adjusted Time)
      const timeInput: TimeCalculationInput = {
        selectedItems: input.inventory.map(i => ({ id: i.id, name: i.id, quantity: i.quantity, isBox: i.id.includes('box') })),
        pickupFloorLevel: mapFloor(input.fromFloor),
        deliveryFloorLevel: mapFloor(input.toFloor),
        pickupHasLift: !!input.fromLift,
        deliveryHasLift: !!input.toLift,
        crewSize: input.crewSize || serviceConfig.default_crew || 2,
        travelMinutes: (input.distanceMiles || 0) * 2,
      };
      const timeResult = calculateTimeBasedPrice(timeInput, config);
      baseLabourCost = timeResult.totals.labourCost;
      estTimeHours = timeResult.time.totalMins / 60;
      break;
    }

    case 'furniture': {
      // Logic: Volumetric (Adjusted Volume x Rate)
      const rate = num(serviceConfig.price_per_m3, 12);
      baseLabourCost = adjustedVolume * rate;
      estTimeHours = adjustedVolume / 4; 
      break;
    }

    case 'clearance': {
      // Logic: Volume + Disposal Fees
      const rate = num(serviceConfig.price_per_m3, 10);
      baseLabourCost = adjustedVolume * rate;
      
      if (input.disposalMethod === 'we_dispose') {
        const fixed = num(config.clearanceDisposalCharges?.disposal_fee_fixed, 50);
        const perM3 = num(config.clearanceDisposalCharges?.disposal_rate_per_m3, 8);
        serviceSpecificExtra = fixed + (adjustedVolume * perM3);
      }
      estTimeHours = adjustedVolume / 3;
      break;
    }

    case 'motorbike': {
      // Logic: Fixed Bike Tier
      const bikeKey = input.bikeType === 'large' ? 'largeMotorbike' : (input.bikeType === 'bicycle' ? 'bicycle' : 'standardMotorbike');
      baseLabourCost = num((config.motorbikeTransportCharges as any)?.[bikeKey], 80);
      estTimeHours = 1.5;
      break;
    }

    case 'store-pickup': {
      // Logic: Retail Base + Item Fee
      const base = num(config.pickupServiceCharges?.basePickupFee, 35);
      const perItem = num(config.pickupServiceCharges?.perItemHandling, 5);
      const totalItems = input.inventory.reduce((sum, i) => sum + i.quantity, 0);
      
      baseLabourCost = base + (totalItems * perItem);
      if (input.urgency === 'same-day') serviceSpecificExtra = num(config.pickupServiceCharges?.sameDay, 40);
      else if (input.urgency === 'next-day') serviceSpecificExtra = num(config.pickupServiceCharges?.nextDay, 20);
      estTimeHours = 1.0;
      break;
    }

    case 'other': {
      // Logic: Tiered Sizing
      if (adjustedVolume > 3.0) baseLabourCost = num(config.otherDeliveryCharges?.bulkyItem, 120);
      else if (adjustedVolume > 1.5) baseLabourCost = num(config.otherDeliveryCharges?.largeItem, 75);
      else if (adjustedVolume > 0.5) baseLabourCost = num(config.otherDeliveryCharges?.mediumItem, 45);
      else baseLabourCost = num(config.otherDeliveryCharges?.smallItem, 25);
      estTimeHours = 1.0;
      break;
    }
  }

  // 4. GLOBAL ADJUSTMENTS (Property Multipliers & Day Multipliers)
  // Property Type Multiplier
  if (input.propertyType) {
    const propMult = num((config.propertyTypeMultipliers as any)?.[input.propertyType], 1.0);
    baseLabourCost *= propMult;
  }

  // Day of Week Multiplier (The "Wise" update)
  if (input.moveDate) {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = days[input.moveDate.getDay()];
    const dayMult = num((config.dayOfWeekMultipliers as any)?.[dayName], 1.0);
    baseLabourCost *= dayMult;
  }

  // Distance Calculation
  const distanceCost = (input.distanceMiles || 0) * num(serviceConfig.price_per_mile, 2.5);

  // Global Surcharges (Fixed)
  let surcharges = 0;
  if (input.moveDate) {
    const isWeekend = input.moveDate.getDay() === 0 || input.moveDate.getDay() === 6;
    if (isWeekend) surcharges += num(config.dateSurcharges?.weekendSurcharge, 40);
  }

  // Stairs Calculation (Global Rule)
  const totalFloors = (input.fromFloor || 0) + (input.toFloor || 0);
  const stairCharge = totalFloors * num(config.accessCharges?.stairsWithoutLiftPerFloor, 15);

  // 5. FINAL ASSEMBLY
  const subtotal = baseLabourCost + distanceCost + surcharges + stairCharge + serviceSpecificExtra;
  const minPrice = num(serviceConfig.min_price, 120);
  const finalPrice = Math.max(subtotal, minPrice);

  return {
    totalPrice: Math.round(finalPrice),
    breakdown: {
      labour: Math.round(baseLabourCost),
      distance: Math.round(distanceCost),
      access: Math.round(stairCharge),
      extras: Math.round(serviceSpecificExtra),
      adjustments: Math.round(surcharges),
      subtotal: Math.round(subtotal)
    },
    stats: {
      volume: Math.round(adjustedVolume * 10) / 10,
      weight: Math.round(rawWeight),
      time: Math.round(estTimeHours * 10) / 10,
      minApplied: finalPrice > subtotal
    }
  };
}

function mapFloor(f?: number): any {
  if (!f || f <= 0) return 'ground';
  if (f === 1) return 'first';
  if (f === 2) return 'second';
  return 'thirdPlus';
}
