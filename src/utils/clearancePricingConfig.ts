/**
 * Clearance & Removal - Pricing Configuration
 * Separate pricing logic for work cost vs disposal cost
 */

export type DisposalMode = 'fixed_only' | 'per_m3_only' | 'fixed_plus_per_m3';

export interface ClearancePricingConfig {
  // Work cost (handling, loading, transport)
  workRatePerM3: number; // £ per m³ for work/handling ONLY (not disposal)
  
  // Service type multipliers
  serviceTypeMultipliers: {
    'House Clearance': number;
    'Flat Clearance': number;
    'Office Clearance': number;
    'Garden Clearance': number;
    'Garage Clearance': number;
    'Builders Waste': number;
    'General Junk Removal': number;
  };
  
  // Disposal cost settings
  disposal: {
    enabled: boolean; // Enable disposal cost calculation
    mode: DisposalMode; // How to calculate disposal cost
    feeFixed: number; // Fixed disposal fee (£)
    ratePerM3: number; // Disposal rate per m³ (£)
    customerProvidesDisposalDiscount: number; // Discount/credit if customer provides disposal location (£)
  };
  
  // Disposal type multipliers (recyclable vs general vs restricted)
  disposalTypeMultipliers: {
    recyclable: number; // 0.8 (cheaper - eco-friendly)
    general: number; // 1.0 (standard)
    restricted: number; // 1.5 (more expensive)
    hazardous: number; // 2.0 (most expensive, may require special handling)
  };
  
  // Surcharges
  surcharges: {
    noLiftPerFloor: number; // £ per floor without lift
    parkingDistancePer10m: number; // £ per 10m parking distance
  };
  
  // Minimum charge
  minimumCharge: number; // Minimum total charge (£)
}

// Default configuration (recommended settings)
export const DEFAULT_CLEARANCE_PRICING_CONFIG: ClearancePricingConfig = {
  // Work cost
  workRatePerM3: 25, // £25 per m³ for work/handling only
  
  // Service type multipliers
  serviceTypeMultipliers: {
    'House Clearance': 1.0,
    'Flat Clearance': 0.95,
    'Office Clearance': 1.1,
    'Garden Clearance': 0.9,
    'Garage Clearance': 0.95,
    'Builders Waste': 1.2, // Higher due to heavier materials
    'General Junk Removal': 1.0,
  },
  
  // Disposal settings (RECOMMENDED: per_m3_only)
  disposal: {
    enabled: true,
    mode: 'per_m3_only', // Cleanest approach
    feeFixed: 0, // No fixed fee when using per_m3_only
    ratePerM3: 8, // £8 per m³ for disposal
    customerProvidesDisposalDiscount: -30, // £30 credit if customer provides disposal location
  },
  
  // Disposal type multipliers
  disposalTypeMultipliers: {
    recyclable: 0.75, // 25% discount for recyclable waste
    general: 1.0, // Standard rate
    restricted: 1.5, // 50% surcharge for restricted items
    hazardous: 2.0, // 100% surcharge (or reject quote)
  },
  
  // Surcharges
  surcharges: {
    noLiftPerFloor: 15, // £15 per floor without lift
    parkingDistancePer10m: 5, // £5 per 10m parking distance
  },
  
  // Minimum charge
  minimumCharge: 80, // £80 minimum
};

/**
 * Calculate Clearance & Removal Pricing
 */
export function calculateClearancePricing(params: {
  totalVolumeM3: number;
  clearanceServiceType: string;
  disposalSelected: boolean; // true if "We'll dispose", false if customer provides location
  hasSpecificDisposalLocation: boolean; // true if customer provides disposal location
  disposalType: 'recyclable' | 'general' | 'restricted' | 'hazardous';
  pickupFloor: number;
  pickupHasLift: boolean;
  parkingDistance: number;
  config?: Partial<ClearancePricingConfig>;
}): {
  workCost: number;
  disposalCost: number;
  surcharges: number;
  totalPrice: number;
  breakdown: {
    totalVolumeM3: number;
    workRatePerM3: number;
    serviceTypeMultiplier: number;
    disposalMode: DisposalMode;
    disposalFeeFixed?: number;
    disposalRatePerM3?: number;
    disposalTypeMultiplier: number;
    customerProvidesDisposalDiscount?: number;
    floorSurcharge: number;
    parkingSurcharge: number;
  };
} {
  // Merge with default config
  const fullConfig: ClearancePricingConfig = {
    ...DEFAULT_CLEARANCE_PRICING_CONFIG,
    ...params.config,
    disposal: {
      ...DEFAULT_CLEARANCE_PRICING_CONFIG.disposal,
      ...(params.config?.disposal || {}),
    },
    serviceTypeMultipliers: {
      ...DEFAULT_CLEARANCE_PRICING_CONFIG.serviceTypeMultipliers,
      ...(params.config?.serviceTypeMultipliers || {}),
    },
    disposalTypeMultipliers: {
      ...DEFAULT_CLEARANCE_PRICING_CONFIG.disposalTypeMultipliers,
      ...(params.config?.disposalTypeMultipliers || {}),
    },
    surcharges: {
      ...DEFAULT_CLEARANCE_PRICING_CONFIG.surcharges,
      ...(params.config?.surcharges || {}),
    },
  };

  // Get multipliers
  const serviceTypeMultiplier = fullConfig.serviceTypeMultipliers[params.clearanceServiceType as keyof typeof fullConfig.serviceTypeMultipliers] || 1.0;
  const disposalTypeMultiplier = fullConfig.disposalTypeMultipliers[params.disposalType] || 1.0;

  // 1. WORK COST (handling, loading, transport)
  const workCost = params.totalVolumeM3 * fullConfig.workRatePerM3 * serviceTypeMultiplier;

  // 2. DISPOSAL COST
  let disposalCost = 0;

  if (!params.disposalSelected) {
    // Customer doesn't want disposal service
    disposalCost = 0;
  } else if (params.hasSpecificDisposalLocation) {
    // Customer provides specific disposal location
    // Apply discount/credit (could make disposal cost negative or zero)
    disposalCost = fullConfig.disposal.customerProvidesDisposalDiscount;
  } else {
    // We dispose of it - calculate based on mode
    if (fullConfig.disposal.enabled) {
      let baseDisposalCost = 0;

      switch (fullConfig.disposal.mode) {
        case 'fixed_only':
          baseDisposalCost = fullConfig.disposal.feeFixed;
          break;

        case 'per_m3_only':
          baseDisposalCost = params.totalVolumeM3 * fullConfig.disposal.ratePerM3;
          break;

        case 'fixed_plus_per_m3':
          baseDisposalCost = fullConfig.disposal.feeFixed + (params.totalVolumeM3 * fullConfig.disposal.ratePerM3);
          break;
      }

      // Apply disposal type multiplier
      disposalCost = baseDisposalCost * disposalTypeMultiplier;
    }
  }

  // 3. SURCHARGES
  let floorSurcharge = 0;
  if (!params.pickupHasLift && params.pickupFloor > 0) {
    floorSurcharge = params.pickupFloor * fullConfig.surcharges.noLiftPerFloor;
  }

  const parkingSurcharge = Math.floor(params.parkingDistance / 10) * fullConfig.surcharges.parkingDistancePer10m;
  const totalSurcharges = floorSurcharge + parkingSurcharge;

  // 4. TOTAL
  let totalPrice = workCost + disposalCost + totalSurcharges;

  // Apply minimum charge
  if (totalPrice < fullConfig.minimumCharge) {
    totalPrice = fullConfig.minimumCharge;
  }

  // Round to 2 decimals
  const round = (n: number) => Math.round(n * 100) / 100;

  return {
    workCost: round(workCost),
    disposalCost: round(disposalCost),
    surcharges: round(totalSurcharges),
    totalPrice: round(totalPrice),
    breakdown: {
      totalVolumeM3: params.totalVolumeM3,
      workRatePerM3: fullConfig.workRatePerM3,
      serviceTypeMultiplier,
      disposalMode: fullConfig.disposal.mode,
      disposalFeeFixed: fullConfig.disposal.feeFixed,
      disposalRatePerM3: fullConfig.disposal.ratePerM3,
      disposalTypeMultiplier,
      customerProvidesDisposalDiscount: params.hasSpecificDisposalLocation ? fullConfig.disposal.customerProvidesDisposalDiscount : undefined,
      floorSurcharge: round(floorSurcharge),
      parkingSurcharge: round(parkingSurcharge),
    },
  };
}

/**
 * Format price for display
 */
export function formatPrice(price: number): string {
  return `£${price.toFixed(2)}`;
}