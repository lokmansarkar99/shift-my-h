/**
 * Clearance & Removal Pricing Engine
 * Specialized pricing for waste clearance and junk removal services
 * Uses volume-based pricing + service type multipliers + disposal charges
 */

import { getPricingConfig, PricingConfig } from './pricingConfigService';

export interface ClearancePricingInput {
  // Service Type
  serviceType: string; // "House Clearance", "Flat Clearance", etc.
  
  // Volume
  totalVolume: number; // Total m³ of waste
  
  // Disposal Method
  disposalMethod: 'we_dispose' | 'specific_location';
  
  // Location factors
  pickupFloor: number; // 0 = ground, 1 = first, 2 = second, etc.
  hasLift: boolean;
  
  // Optional
  bulkyItemsCount?: number; // Count of bulky items (sofas, fridges, etc.)
  hasHazardousWaste?: boolean; // Paint, chemicals, etc.
  
  // Distance (if delivery to specific location)
  distanceMiles?: number;
}

export interface ClearancePricingBreakdown {
  // Base Pricing
  baseVolumePrice: number; // Volume × price per m³
  serviceTypeMultiplier: number; // Multiplier for service type
  
  // Surcharges
  disposalFee: number; // Disposal charge (positive for we_dispose, negative for specific_location)
  perM3DisposalFee: number; // Additional per m³ disposal fee
  bulkyItemsFee: number; // Extra for bulky items
  hazardousWasteFee: number; // Extra for hazardous materials
  accessFee: number; // Floor + lift charges
  distanceFee: number; // If delivering to specific location
  
  // Totals
  subtotal: number; // Before adjustments
  finalPrice: number; // After minimum charge enforcement
  
  // Metadata
  volumeUsed: number; // Actual volume used (might be minimum)
  minimumVolumeApplied: boolean; // True if minimum was enforced
}

/**
 * Map user-friendly service type names to config keys
 */
function mapServiceTypeToConfigKey(serviceType: string): keyof PricingConfig['clearanceServiceTypeMultipliers'] {
  const map: Record<string, keyof PricingConfig['clearanceServiceTypeMultipliers']> = {
    'House Clearance': 'house-clearance',
    'Flat Clearance': 'flat-clearance',
    'Garden Clearance': 'garden-clearance',
    'Garage Clearance': 'garage-clearance',
    'Office Clearance': 'office-clearance',
    'Builders Waste': 'builders-waste',
    'General Junk Removal': 'general-junk-removal',
  };
  
  return map[serviceType] || 'general-junk-removal';
}

/**
 * Calculate access fee based on floor level and lift availability
 */
function calculateAccessFee(
  floor: number,
  hasLift: boolean,
  config: PricingConfig
): number {
  if (floor === 0) return 0; // Ground floor = no fee
  
  const chargePerFloor = hasLift 
    ? config.accessCharges.stairsWithLiftPerFloor 
    : config.accessCharges.stairsWithoutLiftPerFloor;
  
  return floor * chargePerFloor;
}

/**
 * Main Clearance Pricing Calculation
 */
export async function calculateClearancePrice(
  input: ClearancePricingInput
): Promise<ClearancePricingBreakdown> {
  const config = await getPricingConfig();
  
  // 1. VOLUME PRICING (with minimum enforcement)
  const volumeRules = config.clearanceVolumeRules;
  const volumeUsed = Math.max(input.totalVolume, volumeRules.minimumChargeM3);
  const minimumVolumeApplied = input.totalVolume < volumeRules.minimumChargeM3;
  
  const baseVolumePrice = volumeUsed * volumeRules.pricePerCubicMeter;
  
  // 2. SERVICE TYPE MULTIPLIER
  const serviceTypeKey = mapServiceTypeToConfigKey(input.serviceType);
  const serviceTypeMultiplier = config.clearanceServiceTypeMultipliers[serviceTypeKey] || 1.0;
  
  // 3. DISPOSAL CHARGES
  const disposalCharges = config.clearanceDisposalCharges;
  const disposalFee = input.disposalMethod === 'we_dispose' 
    ? disposalCharges.weDispose 
    : disposalCharges.specificLocation; // Negative = discount
  
  const perM3DisposalFee = volumeUsed * disposalCharges.perCubicMeterDisposal;
  
  // 4. BULKY ITEMS SURCHARGE
  const bulkyItemsFee = (input.bulkyItemsCount || 0) * volumeRules.bulkyItemSurcharge;
  
  // 5. HAZARDOUS WASTE SURCHARGE
  const hazardousWasteFee = input.hasHazardousWaste ? volumeRules.hazardousWasteSurcharge : 0;
  
  // 6. ACCESS FEE (floor + lift)
  const accessFee = calculateAccessFee(input.pickupFloor, input.hasLift, config);
  
  // 7. DISTANCE FEE (only if specific location delivery)
  const distanceFee = input.disposalMethod === 'specific_location' && input.distanceMiles 
    ? input.distanceMiles * config.defaultDistanceRate 
    : 0;
  
  // CALCULATE SUBTOTAL
  const subtotal = 
    (baseVolumePrice * serviceTypeMultiplier) + // Base volume × service multiplier
    disposalFee + 
    perM3DisposalFee + 
    bulkyItemsFee + 
    hazardousWasteFee + 
    accessFee + 
    distanceFee;
  
  // APPLY MINIMUM CHARGE
  const finalPrice = Math.max(subtotal, config.globalMinCharge);
  
  return {
    baseVolumePrice,
    serviceTypeMultiplier,
    disposalFee,
    perM3DisposalFee,
    bulkyItemsFee,
    hazardousWasteFee,
    accessFee,
    distanceFee,
    subtotal,
    finalPrice,
    volumeUsed,
    minimumVolumeApplied,
  };
}

/**
 * Helper: Format pricing breakdown for display
 */
export function formatClearancePriceBreakdown(breakdown: ClearancePricingBreakdown): string[] {
  const lines: string[] = [];
  
  lines.push(`Base Volume Charge: £${breakdown.baseVolumePrice.toFixed(2)} (${breakdown.volumeUsed}m³ × £${(breakdown.baseVolumePrice / breakdown.volumeUsed).toFixed(2)}/m³)`);
  
  if (breakdown.serviceTypeMultiplier !== 1.0) {
    lines.push(`Service Type Multiplier: ${breakdown.serviceTypeMultiplier}x`);
  }
  
  if (breakdown.disposalFee !== 0) {
    lines.push(`Disposal Fee: ${breakdown.disposalFee > 0 ? '+' : ''}£${breakdown.disposalFee.toFixed(2)}`);
  }
  
  if (breakdown.perM3DisposalFee > 0) {
    lines.push(`Per-m³ Disposal: +£${breakdown.perM3DisposalFee.toFixed(2)}`);
  }
  
  if (breakdown.bulkyItemsFee > 0) {
    lines.push(`Bulky Items: +£${breakdown.bulkyItemsFee.toFixed(2)}`);
  }
  
  if (breakdown.hazardousWasteFee > 0) {
    lines.push(`Hazardous Waste: +£${breakdown.hazardousWasteFee.toFixed(2)}`);
  }
  
  if (breakdown.accessFee > 0) {
    lines.push(`Access Fee: +£${breakdown.accessFee.toFixed(2)}`);
  }
  
  if (breakdown.distanceFee > 0) {
    lines.push(`Distance Fee: +£${breakdown.distanceFee.toFixed(2)}`);
  }
  
  lines.push(`───────────────────────`);
  lines.push(`Subtotal: £${breakdown.subtotal.toFixed(2)}`);
  
  if (breakdown.minimumVolumeApplied) {
    lines.push(`⚠️ Minimum charge applied (${breakdown.volumeUsed}m³ minimum)`);
  }
  
  lines.push(`**TOTAL: £${breakdown.finalPrice.toFixed(2)}**`);
  
  return lines;
}
