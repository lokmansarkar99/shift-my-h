/**
 * 💰 MARGIN SERVICE
 * Manages margin configuration and calculates driver prices from customer prices
 */

import { projectId, publicAnonKey } from './supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-94f26792`;

// ============================================================
// TYPES
// ============================================================

export interface MarginConfig {
  type: 'percentage' | 'fixed' | 'hybrid';
  percentageMargin: number; // %
  fixedMargin: number; // £
  minimumMargin: number; // £
  useDriverRateCards: boolean;
}

export const DEFAULT_MARGIN_CONFIG: MarginConfig = {
  type: 'percentage',
  percentageMargin: 30, // 30% margin (driver gets 70%)
  fixedMargin: 15,
  minimumMargin: 10,
  useDriverRateCards: false, // Use margin calculation by default
};

// ============================================================
// LOCAL CACHE
// ============================================================

let cachedMarginConfig: MarginConfig = DEFAULT_MARGIN_CONFIG;

/**
 * Get current margin configuration (from cache)
 */
export function getMarginConfig(): MarginConfig {
  return cachedMarginConfig;
}

/**
 * Set margin configuration (updates cache)
 */
export function setMarginConfig(config: MarginConfig): void {
  cachedMarginConfig = config;
}

// ============================================================
// API CALLS
// ============================================================

/**
 * Fetch margin configuration from backend
 */
export async function fetchMarginConfig(): Promise<MarginConfig> {
  try {
    const response = await fetch(`${API_BASE}/margin-config`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch margin config: ${response.statusText}`);
    }

    const config = await response.json();
    cachedMarginConfig = config;
    return config;
  } catch (error) {
    // Silently use default config if fetch fails (normal in preview mode)
    return DEFAULT_MARGIN_CONFIG;
  }
}

/**
 * Save margin configuration to backend
 */
export async function saveMarginConfig(config: MarginConfig): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/margin-config`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      throw new Error(`Failed to save margin config: ${response.statusText}`);
    }

    cachedMarginConfig = config;
    console.log('✅ Margin configuration saved successfully');
  } catch (error) {
    console.error('Error saving margin config:', error);
    throw error;
  }
}

// ============================================================
// PRICING CALCULATIONS
// ============================================================

export interface PriceBreakdown {
  customerPrice: number;
  driverPrice: number;
  platformMargin: number;
  marginPercentage: number;
  calculationMethod: string;
}

/**
 * Calculate driver price from customer price using margin configuration
 */
export function calculateDriverPrice(
  customerPrice: number,
  config: MarginConfig = cachedMarginConfig
): PriceBreakdown {
  // If using driver rate cards, return customer price as-is
  // (driver price should be calculated separately from rate cards)
  if (config.useDriverRateCards) {
    return {
      customerPrice,
      driverPrice: customerPrice, // Placeholder - should be calculated from rate cards
      platformMargin: 0,
      marginPercentage: 0,
      calculationMethod: 'Rate Cards (not implemented)',
    };
  }

  let platformMargin = 0;
  let calculationMethod = '';

  switch (config.type) {
    case 'percentage':
      platformMargin = (customerPrice * config.percentageMargin) / 100;
      calculationMethod = `Percentage (${config.percentageMargin}%)`;
      break;

    case 'fixed':
      platformMargin = config.fixedMargin;
      calculationMethod = `Fixed (£${config.fixedMargin})`;
      break;

    case 'hybrid':
      const percentageMargin = (customerPrice * config.percentageMargin) / 100;
      platformMargin = Math.max(percentageMargin, config.minimumMargin);
      calculationMethod = percentageMargin >= config.minimumMargin
        ? `Hybrid - Percentage (${config.percentageMargin}%)`
        : `Hybrid - Minimum (£${config.minimumMargin})`;
      break;
  }

  const driverPrice = Math.max(customerPrice - platformMargin, 0);
  const marginPercentage = customerPrice > 0 ? (platformMargin / customerPrice) * 100 : 0;

  return {
    customerPrice,
    driverPrice,
    platformMargin,
    marginPercentage,
    calculationMethod,
  };
}

/**
 * Calculate platform fee (alias for margin)
 */
export function calculatePlatformFee(
  customerPrice: number,
  config: MarginConfig = cachedMarginConfig
): number {
  const breakdown = calculateDriverPrice(customerPrice, config);
  return breakdown.platformMargin;
}

/**
 * Bulk calculate driver prices for multiple jobs
 */
export function calculateBulkDriverPrices(
  customerPrices: number[],
  config: MarginConfig = cachedMarginConfig
): PriceBreakdown[] {
  return customerPrices.map(price => calculateDriverPrice(price, config));
}

// ============================================================
// VALIDATION
// ============================================================

/**
 * Validate margin configuration
 */
export function validateMarginConfig(config: MarginConfig): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (config.type === 'percentage' || config.type === 'hybrid') {
    if (config.percentageMargin < 0 || config.percentageMargin > 100) {
      errors.push('Percentage margin must be between 0% and 100%');
    }
  }

  if (config.type === 'fixed' || config.type === 'hybrid') {
    if (config.fixedMargin < 0) {
      errors.push('Fixed margin cannot be negative');
    }
  }

  if (config.type === 'hybrid') {
    if (config.minimumMargin < 0) {
      errors.push('Minimum margin cannot be negative');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================
// INITIALIZATION
// ============================================================

/**
 * Initialize margin service (fetch config from backend)
 */
export async function initializeMarginService(): Promise<void> {
  try {
    await fetchMarginConfig();
    console.log('✅ Margin Service Initialized');
  } catch (error) {
    console.error('Failed to initialize margin service:', error);
  }
}