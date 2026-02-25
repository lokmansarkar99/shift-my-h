import { ServiceTypeConfig } from './serviceTypesService';
import { getCurrentPricingConfig } from './pricingEngine';

/**
 * ✅ HARD VALIDATION - NO SILENT FAILURES!
 * Validates quote generation inputs before calling pricing engine
 */

export interface QuoteValidationInput {
  serviceConfig: ServiceTypeConfig | undefined;
  distance: number;
  crewSize: number;
  selectedItems: Array<{ id: string; quantity: number }>;
  customerPhone?: string;
  pickupAddress?: string;
  deliveryAddress?: string;
  checkCustomerData?: boolean; // ✅ NEW: Only validate customer data if this is true (for job conversion)
}

export interface QuoteValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate quote generation inputs
 * Returns validation result with errors and warnings
 */
export function validateQuoteGeneration(input: QuoteValidationInput): QuoteValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // ============================================================
  // 1. SERVICE TYPE VALIDATION
  // ============================================================
  if (!input.serviceConfig) {
    errors.push('❌ Service Type is required. Please select a service type.');
    return { valid: false, errors, warnings }; // HARD STOP - cannot continue without service type
  }
  
  // ✅ CRITICAL: If useVolume = true, price_per_m3 MUST be > 0
  if (input.serviceConfig.useVolume) {
    if (!input.serviceConfig.price_per_m3 || input.serviceConfig.price_per_m3 <= 0) {
      errors.push(
        `❌ CONFIGURATION ERROR: Service "${input.serviceConfig.name}" has useVolume=true but price_per_m3 is ${input.serviceConfig.price_per_m3}. ` +
        'Volume MUST affect price when useVolume is enabled. Please contact administrator to fix service type configuration.'
      );
    }
  }
  
  // ✅ CRITICAL: price_per_mile MUST be > 0 (distance should always affect price)
  if (!input.serviceConfig.price_per_mile || input.serviceConfig.price_per_mile <= 0) {
    errors.push(
      `❌ CONFIGURATION ERROR: Service "${input.serviceConfig.name}" has invalid price_per_mile (${input.serviceConfig.price_per_mile}). ` +
      'Distance pricing is required. Please contact administrator to fix service type configuration.'
    );
  }
  
  // ============================================================
  // 2. CREW SIZE VALIDATION
  // ============================================================
  if (!input.crewSize || input.crewSize < 1 || input.crewSize > 4) {
    errors.push('❌ Crew size must be between 1 and 4 people.');
  }
  
  // Crew size within service limits
  if (input.crewSize < input.serviceConfig.min_crew || input.crewSize > input.serviceConfig.max_crew) {
    errors.push(
      `❌ Crew size (${input.crewSize}) is outside allowed range for ${input.serviceConfig.name}. ` +
      `Must be between ${input.serviceConfig.min_crew} and ${input.serviceConfig.max_crew}.`
    );
  }
  
  // ============================================================
  // 3. DISTANCE VALIDATION
  // ============================================================
  if (!input.distance || input.distance <= 0) {
    errors.push('❌ Distance must be greater than 0 miles.');
  }
  
  if (input.distance > 500) {
    warnings.push('⚠️ Distance is over 500 miles. This may require special arrangements.');
  }
  
  // ============================================================
  // 4. ITEMS VALIDATION
  // ============================================================
  if (!input.selectedItems || input.selectedItems.length === 0) {
    errors.push('❌ At least one item must be selected.');
  }
  
  // Validate each item has valid quantity
  input.selectedItems.forEach((item, index) => {
    if (!item.quantity || item.quantity < 1) {
      errors.push(`❌ Item ${index + 1} has invalid quantity: ${item.quantity}`);
    }
    if (!Number.isFinite(item.quantity)) {
      errors.push(`❌ Item ${index + 1} quantity is not a valid number`);
    }
  });
  
  // ============================================================
  // 5. PRICING RULES VALIDATION
  // ============================================================
  const pricingConfig = getCurrentPricingConfig();
  
  // If handling is enabled, validate handling speed
  if (input.serviceConfig.useVolume) {
    const handlingSpeed = pricingConfig.inventoryHandlingRules.handlingSpeedM3PerHourPerPerson;
    
    if (!handlingSpeed || handlingSpeed <= 0) {
      errors.push(
        `❌ CONFIGURATION ERROR: Handling speed (${handlingSpeed}) is invalid. ` +
        'Pricing Rules must have handlingSpeedM3PerHourPerPerson > 0 when volume pricing is enabled.'
      );
    }
    
    const handlingPricePerHour = pricingConfig.inventoryHandlingRules.handlingPricePerHour;
    if (!handlingPricePerHour || handlingPricePerHour <= 0) {
      errors.push(
        `❌ CONFIGURATION ERROR: Handling price per hour (${handlingPricePerHour}) is invalid. ` +
        'Pricing Rules must have handlingPricePerHour > 0 when volume pricing is enabled.'
      );
    }
  }
  
  // ============================================================
  // 6. CUSTOMER DATA VALIDATION (WARNINGS ONLY)
  // ============================================================
  if (input.checkCustomerData) {
    if (!input.customerPhone || input.customerPhone.trim() === '') {
      warnings.push('⚠️ Customer phone number is missing. Required for quote conversion to job.');
    }
    
    if (!input.pickupAddress || input.pickupAddress.trim() === '') {
      warnings.push('⚠️ Pickup address is missing. Required for quote conversion to job.');
    }
    
    if (!input.deliveryAddress || input.deliveryAddress.trim() === '') {
      warnings.push('⚠️ Delivery address is missing. Required for quote conversion to job.');
    }
  }
  
  // ============================================================
  // RETURN RESULT
  // ============================================================
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate numeric field (prevent NaN)
 */
export function validateNumeric(value: any, fieldName: string, min?: number, max?: number): string | null {
  if (value === null || value === undefined) {
    return `${fieldName} is required`;
  }
  
  const num = typeof value === 'string' ? parseFloat(value) : Number(value);
  
  if (!Number.isFinite(num)) {
    return `${fieldName} must be a valid number`;
  }
  
  if (min !== undefined && num < min) {
    return `${fieldName} must be at least ${min}`;
  }
  
  if (max !== undefined && num > max) {
    return `${fieldName} must be at most ${max}`;
  }
  
  return null;
}

/**
 * Prevent NaN helper - returns safe number or default
 */
export function safeNumber(value: any, defaultValue: number = 0): number {
  if (value === null || value === undefined) return defaultValue;
  const num = typeof value === 'string' ? parseFloat(value) : Number(value);
  return Number.isFinite(num) ? num : defaultValue;
}