/**
 * Pricing Configuration Service
 * Manages pricing rules stored in Supabase KV store
 * All pricing calculations should read from this config
 */

import { projectId, publicAnonKey } from './supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-94f26792`;

// Types for Pricing Configuration
export interface PropertyTypeMultipliers {
  studio: number;
  flatshare: number;
  '1-bed-flat': number;
  '1-bed-house': number;
  '2-bed-flat': number;
  '2-bed-house': number;
  '3-bed-flat': number;
  '3-bed-house': number;
  '4-bed-flat': number;
  '4-bed-house': number;
  '5-bed-house': number;
  'storage-unit': number;
}

export interface InventoryHandlingRules {
  pricePerCubicMeter: number;
  handlingPricePerHour: number;
  handlingSpeedM3PerHourPerPerson: number; // m³ per hour per person (e.g., 4.5)
  weightThresholdKg: number;
  weightSurchargePerKg: number;
  disassemblyFee: number;
  fragileItemFee: number;
  // Volume calculation factors (DISABLED by default - must be explicitly enabled)
  packingFactor: number; // 1.0 = disabled (no packing adjustment)
  safetyMargin: number; // 1.0 = disabled (no safety margin)
  applyPackingFactor: boolean; // DISABLED by default
  applySafetyMargin: boolean; // DISABLED by default
}

export interface AccessCharges {
  stairsWithoutLiftPerFloor: number;
  stairsWithLiftPerFloor: number;
  parkingEasy: number;
  parkingModerate: number;
  parkingDifficult: number;
}

export interface DateSurcharges {
  weekendSurcharge: number;
  peakSeasonSurcharge: number;
  endOfMonthSurcharge: number;
  flexibleDateDiscount: number;
}

// 📅 NEW: Day of Week Multipliers (for price calendar)
export interface DayOfWeekMultipliers {
  sunday: number;    // 0
  monday: number;    // 1
  tuesday: number;   // 2
  wednesday: number; // 3
  thursday: number;  // 4
  friday: number;    // 5
  saturday: number;  // 6
}

export interface PackageMultiplier {
  id: string;
  name: string;
  subtitle: string;
  multiplier: number;
  includes: string[];
  popular?: boolean;
}

// ⏱️ NEW: Time-Based Pricing (connects time to price)
export interface TimeBasedPricing {
  baseHourlyRate: number;           // £60/hour (for 2-man crew baseline)
  minimumChargeableHours: number;   // e.g., 2 hours minimum
  billingIncrement: 15 | 30 | 60;   // Round up to nearest 15/30/60 mins
}

// 📦 NEW: Handling Time Rules (inventory → time)
export interface HandlingTimeRules {
  baseLoadingMinutes: number;       // e.g., 20 min
  baseUnloadingMinutes: number;     // e.g., 15 min
  minutesPerInventoryItem: number;  // e.g., 1.5 min/item
  minutesPerBox: number;            // e.g., 0.5 min/box
  minimumTotalMinutes: number;      // e.g., 30 min
  maximumTotalMinutes: number | null; // e.g., 240 min or null
}

// 📍 NEW: Location Multipliers (affect TIME, not price directly)
export interface LocationMultipliers {
  pickup: {
    floorLevel: {
      ground: number;      // 1.0
      first: number;       // 1.15
      second: number;      // 1.30
      thirdPlus: number;   // 1.50
    };
    noLift: number;              // 1.20
    longWalkDistance: number;    // 1.15 (50m+)
    parkingRestricted: number;   // 1.10
  };
  delivery: {
    floorLevel: {
      ground: number;
      first: number;
      second: number;
      thirdPlus: number;
    };
    noLift: number;
    longWalkDistance: number;
    parkingRestricted: number;
  };
}

// 👷 NEW: Crew Rules (size affects speed + hourly rate)
export interface CrewRule {
  size: 1 | 2 | 3;
  label: string;             // "1 Man", "2 Men", "3+ Men"
  speedFactor: number;       // 1.25 (slower) / 1.0 (baseline) / 0.85 (faster)
  hourlyRate: number;        // £45 / £60 / £85
}

export interface CrewRules {
  oneMAN: CrewRule;
  twoMEN: CrewRule;
  threePlusMEN: CrewRule;
}

// 🗑️ NEW: Clearance & Removal Specific Pricing
export interface ClearanceServiceTypeMultipliers {
  'house-clearance': number;       // e.g., 1.5
  'flat-clearance': number;        // e.g., 1.2
  'garden-clearance': number;      // e.g., 1.3
  'garage-clearance': number;      // e.g., 1.1
  'office-clearance': number;      // e.g., 1.4
  'builders-waste': number;        // e.g., 1.6
  'general-junk-removal': number;  // e.g., 1.0 (baseline)
}

export interface ClearanceDisposalCharges {
  disposal_enabled: boolean;           // Enable/disable disposal charges (default: true)
  disposal_mode: 'fixed_only' | 'per_m3_only' | 'fixed_plus_per_m3'; // Pricing mode
  disposal_fee_fixed: number;          // Fixed disposal fee (e.g., £50)
  disposal_rate_per_m3: number;        // Rate per cubic meter (e.g., £8/m³)
  customer_provides_disposal_discount: number; // Discount when customer provides location (e.g., -£30)
  
  // DEPRECATED (kept for backwards compatibility)
  weDispose?: number;                  // Old field (use disposal_fee_fixed instead)
  specificLocation?: number;           // Old field (use customer_provides_disposal_discount instead)
  perCubicMeterDisposal?: number;      // Old field (use disposal_rate_per_m3 instead)
}

export interface ClearanceVolumeRules {
  minimumChargeM3: number;        // Minimum volume to charge (e.g., 2m³)
  pricePerCubicMeter: number;     // Base price per m³ (e.g., £25/m³)
  bulkyItemSurcharge: number;     // Extra fee for bulky items (e.g., £15 per item)
  hazardousWasteSurcharge: number; // Extra for hazardous materials (e.g., £40)
}

// 🏍️ NEW: Motorbike/Bicycle Transport Pricing
export interface MotorbikeTransportCharges {
  standardMotorbike: number;      // Standard motorbike (e.g., £80)
  largeMotorbike: number;         // Large/touring bike (e.g., £120)
  scooter: number;                // Scooter/moped (e.g., £60)
  bicycle: number;                // Standard bicycle (e.g., £25)
  electricBike: number;           // E-bike (e.g., £35)
  cargoSecuringFee: number;       // Securing/strapping fee (e.g., £20)
  additionalBikeSurcharge: number; // Per additional bike after first (e.g., £15)
}

export interface MotorbikeDistanceMultipliers {
  'under-10-miles': number;       // e.g., 1.0 (baseline)
  '10-30-miles': number;          // e.g., 1.2
  '30-60-miles': number;          // e.g., 1.5
  'over-60-miles': number;        // e.g., 2.0
}

// 📦 NEW: Store/Pickup Service Pricing
export interface StorageCharges {
  perDayRate: number;             // e.g., £8/day
  perWeekRate: number;            // e.g., £45/week
  perMonthRate: number;           // e.g., £120/month
  minimumStorageDays: number;     // e.g., 3 days minimum
  accessFee: number;              // e.g., £15 per access visit
}

export interface PickupServiceCharges {
  basePickupFee: number;          // e.g., £35 base fee
  sameDay: number;                // e.g., +£40 (urgent)
  nextDay: number;                // e.g., +£20
  scheduled: number;              // e.g., £0 (no surcharge)
  perItemHandling: number;        // e.g., £5 per item
}

// 📬 NEW: Other Delivery Service Pricing
export interface OtherDeliveryCharges {
  smallItem: number;              // e.g., £25 (< 0.5m³)
  mediumItem: number;             // e.g., £45 (0.5-1.5m³)
  largeItem: number;              // e.g., £75 (1.5-3m³)
  bulkyItem: number;              // e.g., £120 (> 3m³)
  urgentDeliverySurcharge: number; // e.g., +£35 for same-day
  perMileRate: number;            // e.g., £1.50/mile
}

export interface OtherDeliveryUrgencyMultipliers {
  'same-day': number;             // e.g., 2.0
  'next-day': number;             // e.g., 1.5
  'within-3-days': number;        // e.g., 1.2
  'standard': number;             // e.g., 1.0 (baseline)
}

export interface PlatformMarginConfig {
  marginType: 'percentage' | 'fixed' | 'hybrid';
  percentageValue: number;         // e.g., 30 for 30%
  fixedValue: number;              // e.g., 30 for £30
  hybridMinimumValue: number;      // e.g., 25 for £25
}

export interface PricingConfig {
  propertyTypeMultipliers: PropertyTypeMultipliers;
  inventoryHandlingRules: InventoryHandlingRules;
  accessCharges: AccessCharges;
  dateSurcharges: DateSurcharges;
  dayOfWeekMultipliers: DayOfWeekMultipliers;
  packageMultipliers: PackageMultiplier[];
  timeBasedPricing: TimeBasedPricing; // ✅ NEW: Time-based pricing
  handlingTimeRules: HandlingTimeRules; // ✅ NEW: Handling time rules
  locationMultipliers: LocationMultipliers; // ✅ NEW: Location multipliers
  crewRules: CrewRules; // ✅ NEW: Crew rules
  globalMinCharge: number;
  platformMargin: PlatformMarginConfig; // ✅ NEW: Business Margin
  // ✅ NEW: Default base fees (used when vehicle is not specified)
  defaultBaseFee: number; // Default vehicle base fee
  defaultCrewCost: number; // Default crew cost (2 men)
  defaultDistanceRate: number; // Default price per mile
  lastUpdated?: string;
  // 🗑️ NEW: Clearance & Removal Specific Pricing
  clearanceServiceTypeMultipliers: ClearanceServiceTypeMultipliers;
  clearanceDisposalCharges: ClearanceDisposalCharges;
  clearanceVolumeRules: ClearanceVolumeRules;
  // 🏍️ NEW: Motorbike/Bicycle Transport Pricing
  motorbikeTransportCharges: MotorbikeTransportCharges;
  motorbikeDistanceMultipliers: MotorbikeDistanceMultipliers;
  // 📦 NEW: Store/Pickup Service Pricing
  storageCharges: StorageCharges;
  pickupServiceCharges: PickupServiceCharges;
  // 📬 NEW: Other Delivery Service Pricing
  otherDeliveryCharges: OtherDeliveryCharges;
  otherDeliveryUrgencyMultipliers: OtherDeliveryUrgencyMultipliers;
}

// Default fallback values (if backend is empty or fails)
export const DEFAULT_PRICING_CONFIG: PricingConfig = {
  propertyTypeMultipliers: {
    'studio': 1.0,
    'flatshare': 1.05,
    '1-bed-flat': 1.15,
    '1-bed-house': 1.25,
    '2-bed-flat': 1.35,
    '2-bed-house': 1.50,
    '3-bed-flat': 1.60,
    '3-bed-house': 1.85,
    '4-bed-flat': 2.00,
    '4-bed-house': 2.30,
    '5-bed-house': 2.70,
    'storage-unit': 1.0,
  },
  inventoryHandlingRules: {
    pricePerCubicMeter: 12.0, // £12/m³ - volume pricing
    handlingPricePerHour: 25,
    handlingSpeedM3PerHourPerPerson: 4.5, // m³ per hour per person
    weightThresholdKg: 500,
    weightSurchargePerKg: 0.2,
    disassemblyFee: 50,
    fragileItemFee: 8,
    // Volume calculation factors (DISABLED by default - must be explicitly enabled)
    packingFactor: 1.0, // 1.0 = disabled (no packing adjustment)
    safetyMargin: 1.0, // 1.0 = disabled (no safety margin)
    applyPackingFactor: false, // DISABLED by default
    applySafetyMargin: false, // DISABLED by default
  },
  accessCharges: {
    stairsWithoutLiftPerFloor: 15,
    stairsWithLiftPerFloor: 5,
    parkingEasy: 0,
    parkingModerate: 25,
    parkingDifficult: 50,
  },
  dateSurcharges: {
    weekendSurcharge: 40,
    peakSeasonSurcharge: 60,
    endOfMonthSurcharge: 25,
    flexibleDateDiscount: 20,
  },
  dayOfWeekMultipliers: {
    sunday: 1.0,
    monday: 1.0,
    tuesday: 1.0,
    wednesday: 1.0,
    thursday: 1.0,
    friday: 1.0,
    saturday: 1.0,
  },
  packageMultipliers: [
    {
      id: 'standard',
      name: 'Standard Move',
      subtitle: 'Load & Move',
      multiplier: 1.0,
      includes: [
        'Professional removal team',
        'All transport & fuel costs',
        'Loading & unloading',
        'Basic furniture protection',
        'Fully insured service',
        'Standard transit time',
        'Basic liability coverage'
      ],
    },
    {
      id: 'premium',
      name: 'Premium',
      subtitle: 'Full Pack & Move',
      multiplier: 1.3,
      popular: true,
      includes: [
        'Everything in Standard +',
        'Full professional packing service',
        'All packing materials included',
        'Furniture disassembly & reassembly',
        'Extended insurance coverage',
        'Dedicated move coordinator',
        'Priority booking & support',
        'White glove service',
        'Post-move cleanup',
        'Free 48-hour cancellation'
      ],
    },
  ],
  timeBasedPricing: {
    baseHourlyRate: 60,
    minimumChargeableHours: 2,
    billingIncrement: 30,
  },
  handlingTimeRules: {
    baseLoadingMinutes: 20,
    baseUnloadingMinutes: 15,
    minutesPerInventoryItem: 1.5,
    minutesPerBox: 0.5,
    minimumTotalMinutes: 30,
    maximumTotalMinutes: 240,
  },
  locationMultipliers: {
    pickup: {
      floorLevel: {
        ground: 1.0,
        first: 1.15,
        second: 1.30,
        thirdPlus: 1.50,
      },
      noLift: 1.20,
      longWalkDistance: 1.15,
      parkingRestricted: 1.10,
    },
    delivery: {
      floorLevel: {
        ground: 1.0,
        first: 1.15,
        second: 1.30,
        thirdPlus: 1.50,
      },
      noLift: 1.20,
      longWalkDistance: 1.15,
      parkingRestricted: 1.10,
    },
  },
  crewRules: {
    oneMAN: {
      size: 1,
      label: '1 Man',
      speedFactor: 1.25,
      hourlyRate: 45,
    },
    twoMEN: {
      size: 2,
      label: '2 Men',
      speedFactor: 1.0,
      hourlyRate: 60,
    },
    threePlusMEN: {
      size: 3,
      label: '3+ Men',
      speedFactor: 0.85,
      hourlyRate: 85,
    },
  },
  globalMinCharge: 120,
  platformMargin: {
    marginType: 'percentage',
    percentageValue: 30,
    fixedValue: 30,
    hybridMinimumValue: 25,
  },
  // ✅ NEW: Default base fees (used when vehicle is not specified)
  defaultBaseFee: 150, // Default vehicle base fee
  defaultCrewCost: 100, // Default crew cost (2 men)
  defaultDistanceRate: 0.5, // Default price per mile
  // 🗑️ NEW: Clearance & Removal Specific Pricing
  clearanceServiceTypeMultipliers: {
    'house-clearance': 1.5,
    'flat-clearance': 1.2,
    'garden-clearance': 1.3,
    'garage-clearance': 1.1,
    'office-clearance': 1.4,
    'builders-waste': 1.6,
    'general-junk-removal': 1.0,
  },
  clearanceDisposalCharges: {
    disposal_enabled: true,
    disposal_mode: 'per_m3_only',
    disposal_fee_fixed: 50,
    disposal_rate_per_m3: 8,
    customer_provides_disposal_discount: -30,
    // Backwards compatibility
    weDispose: 50,
    specificLocation: -30,
    perCubicMeterDisposal: 8,
  },
  clearanceVolumeRules: {
    minimumChargeM3: 2,
    pricePerCubicMeter: 25,
    bulkyItemSurcharge: 15,
    hazardousWasteSurcharge: 40,
  },
  // 🏍️ NEW: Motorbike/Bicycle Transport Pricing
  motorbikeTransportCharges: {
    standardMotorbike: 80,
    largeMotorbike: 120,
    scooter: 60,
    bicycle: 25,
    electricBike: 35,
    cargoSecuringFee: 20,
    additionalBikeSurcharge: 15,
  },
  motorbikeDistanceMultipliers: {
    'under-10-miles': 1.0,
    '10-30-miles': 1.2,
    '30-60-miles': 1.5,
    'over-60-miles': 2.0,
  },
  // 📦 NEW: Store/Pickup Service Pricing
  storageCharges: {
    perDayRate: 8,
    perWeekRate: 45,
    perMonthRate: 120,
    minimumStorageDays: 3,
    accessFee: 15,
  },
  pickupServiceCharges: {
    basePickupFee: 35,
    sameDay: 40,
    nextDay: 20,
    scheduled: 0,
    perItemHandling: 5,
  },
  // 📬 NEW: Other Delivery Service Pricing
  otherDeliveryCharges: {
    smallItem: 25,
    mediumItem: 45,
    largeItem: 75,
    bulkyItem: 120,
    urgentDeliverySurcharge: 35,
    perMileRate: 1.50,
  },
  otherDeliveryUrgencyMultipliers: {
    'same-day': 2.0,
    'next-day': 1.5,
    'within-3-days': 1.2,
    'standard': 1.0,
  },
};

// In-memory cache
let cachedConfig: PricingConfig | null = null;

/**
 * Fetch pricing config from backend
 */
export async function fetchPricingConfig(): Promise<PricingConfig> {
  try {
    const response = await fetch(`${API_BASE}/pricing-config`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    if (!response.ok) {
      console.warn('Failed to fetch pricing config from backend, using defaults');
      return DEFAULT_PRICING_CONFIG;
    }

    const data = await response.json();
    const loadedConfig = data.config || DEFAULT_PRICING_CONFIG;
    
    // ✅ MIGRATION: Ensure new fields exist (backwards compatibility)
    const migratedConfig: PricingConfig = {
      ...loadedConfig,
      defaultBaseFee: loadedConfig.defaultBaseFee ?? 150,
      defaultCrewCost: loadedConfig.defaultCrewCost ?? 100,
      defaultDistanceRate: loadedConfig.defaultDistanceRate ?? 0.5,
      dayOfWeekMultipliers: loadedConfig.dayOfWeekMultipliers ?? {
        sunday: 1.15,
        monday: 1.0,
        tuesday: 0.95,
        wednesday: 0.95,
        thursday: 1.0,
        friday: 1.10,
        saturday: 1.15,
      },
      // 🗑️ NEW: Clearance & Removal Specific Pricing
      clearanceServiceTypeMultipliers: loadedConfig.clearanceServiceTypeMultipliers ?? {
        'house-clearance': 1.5,
        'flat-clearance': 1.2,
        'garden-clearance': 1.3,
        'garage-clearance': 1.1,
        'office-clearance': 1.4,
        'builders-waste': 1.6,
        'general-junk-removal': 1.0,
      },
      clearanceDisposalCharges: loadedConfig.clearanceDisposalCharges ?? {
        disposal_enabled: true,
        disposal_mode: 'per_m3_only',
        disposal_fee_fixed: 50,
        disposal_rate_per_m3: 8,
        customer_provides_disposal_discount: -30,
        // Backwards compatibility
        weDispose: 50,
        specificLocation: -30,
        perCubicMeterDisposal: 8,
      },
      clearanceVolumeRules: loadedConfig.clearanceVolumeRules ?? {
        minimumChargeM3: 2,
        pricePerCubicMeter: 25,
        bulkyItemSurcharge: 15,
        hazardousWasteSurcharge: 40,
      },
      // 🏍️ NEW: Motorbike/Bicycle Transport Pricing
      motorbikeTransportCharges: loadedConfig.motorbikeTransportCharges ?? {
        standardMotorbike: 80,
        largeMotorbike: 120,
        scooter: 60,
        bicycle: 25,
        electricBike: 35,
        cargoSecuringFee: 20,
        additionalBikeSurcharge: 15,
      },
      motorbikeDistanceMultipliers: loadedConfig.motorbikeDistanceMultipliers ?? {
        'under-10-miles': 1.0,
        '10-30-miles': 1.2,
        '30-60-miles': 1.5,
        'over-60-miles': 2.0,
      },
      // 📦 NEW: Store/Pickup Service Pricing
      storageCharges: loadedConfig.storageCharges ?? {
        perDayRate: 8,
        perWeekRate: 45,
        perMonthRate: 120,
        minimumStorageDays: 3,
        accessFee: 15,
      },
      pickupServiceCharges: loadedConfig.pickupServiceCharges ?? {
        basePickupFee: 35,
        sameDay: 40,
        nextDay: 20,
        scheduled: 0,
        perItemHandling: 5,
      },
      // 📬 NEW: Other Delivery Service Pricing
      otherDeliveryCharges: loadedConfig.otherDeliveryCharges ?? {
        smallItem: 25,
        mediumItem: 45,
        largeItem: 75,
        bulkyItem: 120,
        urgentDeliverySurcharge: 35,
        perMileRate: 1.50,
      },
      otherDeliveryUrgencyMultipliers: loadedConfig.otherDeliveryUrgencyMultipliers ?? {
        'same-day': 2.0,
        'next-day': 1.5,
        'within-3-days': 1.2,
        'standard': 1.0,
      },
      platformMargin: loadedConfig.platformMargin ?? {
        marginType: 'percentage',
        percentageValue: 30,
        fixedValue: 30,
        hybridMinimumValue: 25,
      },
    };
    
    cachedConfig = migratedConfig;
    return cachedConfig;
  } catch (error) {
    console.error('Error fetching pricing config:', error);
    return DEFAULT_PRICING_CONFIG;
  }
}

/**
 * Save pricing config to backend (Admin only)
 */
export async function savePricingConfig(config: PricingConfig): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE}/pricing-config`, {
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

    // Update cache immediately
    cachedConfig = config;
    
    // Notify pricing engine to update its cache
    if (typeof window !== 'undefined') {
      const { setPricingConfig } = await import('./pricingEngine');
      setPricingConfig(config);
      
      // Dispatch event for other components
      window.dispatchEvent(new CustomEvent('pricingConfigUpdated', { detail: config }));
    }

    console.log('✅ Pricing configuration saved and cache updated');

    return { success: true };
  } catch (error) {
    console.error('Error saving pricing config:', error);
    return { success: false, error: 'Network error' };
  }
}

/**
 * Get config from cache or fetch if not available
 */
export async function getPricingConfig(): Promise<PricingConfig> {
  if (cachedConfig) {
    return cachedConfig;
  }
  return await fetchPricingConfig();
}

/**
 * Clear cache (useful after updates)
 */
export function clearPricingConfigCache(): void {
  cachedConfig = null;
}