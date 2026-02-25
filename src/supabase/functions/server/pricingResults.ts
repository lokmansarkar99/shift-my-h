// Pricing Results API
// Saves and retrieves detailed pricing calculation breakdowns for audit/debugging

import * as kv from './kv_store.tsx';

export interface PricingResultRecord {
  id: string; // Unique ID for this pricing result
  quoteId?: string; // Optional link to quote
  jobId?: string; // Optional link to job
  timestamp: string;
  
  // Input summary
  customerName?: string;
  serviceType?: string;
  pickupAddress?: string;
  deliveryAddress?: string;
  
  // Complete breakdown (from PricingResult.auditData)
  distanceMiles: number;
  distanceRatePerMile: number;
  distanceCost: number;
  baseFee: number;
  minChargeApplied: boolean;
  minChargeValue: number;
  
  // Volume details (100% transparent)
  items: Array<{
    id: string;
    name?: string;
    quantity: number;
    volumePerUnit: number; // m³
    totalVolume: number; // m³
  }>;
  itemsTotalM3: number;
  packingFactorValue: number;
  packingAddedM3: number;
  safetyMarginValue: number;
  safetyAddedM3: number;
  finalM3Used: number;
  pricePerCubicMeter: number;
  volumeCost: number;
  
  // Extras & adjustments
  extrasApplied: string[];
  accessCharges: number;
  dateAdjustments: number;
  
  // Package
  packageMultiplier: number;
  finalPriceStandard: number;
  finalPricePremium: number;
  
  // Total price
  totalPrice: number;
}

const PRICING_RESULTS_PREFIX = 'pricing_result:';

/**
 * Save a pricing result to KV store
 */
export async function savePricingResult(data: Omit<PricingResultRecord, 'id' | 'timestamp'>): Promise<PricingResultRecord> {
  const id = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const timestamp = new Date().toISOString();
  
  const record: PricingResultRecord = {
    id,
    timestamp,
    ...data,
  };
  
  await kv.set(`${PRICING_RESULTS_PREFIX}${id}`, record);
  
  console.log(`✅ Pricing result saved: ${id}`);
  return record;
}

/**
 * Get a pricing result by ID
 */
export async function getPricingResult(id: string): Promise<PricingResultRecord | null> {
  const result = await kv.get(`${PRICING_RESULTS_PREFIX}${id}`);
  return result as PricingResultRecord | null;
}

/**
 * Get all pricing results (sorted by timestamp, newest first)
 */
export async function getAllPricingResults(): Promise<PricingResultRecord[]> {
  const results = await kv.getByPrefix(PRICING_RESULTS_PREFIX);
  
  // Sort by timestamp descending (newest first)
  return results
    .map(r => r as PricingResultRecord)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

/**
 * Get pricing results by quote ID
 */
export async function getPricingResultsByQuoteId(quoteId: string): Promise<PricingResultRecord[]> {
  const allResults = await getAllPricingResults();
  return allResults.filter(r => r.quoteId === quoteId);
}

/**
 * Get pricing results by job ID
 */
export async function getPricingResultsByJobId(jobId: string): Promise<PricingResultRecord[]> {
  const allResults = await getAllPricingResults();
  return allResults.filter(r => r.jobId === jobId);
}

/**
 * Delete a pricing result
 */
export async function deletePricingResult(id: string): Promise<void> {
  await kv.del(`${PRICING_RESULTS_PREFIX}${id}`);
  console.log(`🗑️ Pricing result deleted: ${id}`);
}
