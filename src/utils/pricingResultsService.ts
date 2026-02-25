// Pricing Results Service
// Handles saving and fetching pricing calculation results for audit

import { projectId, publicAnonKey } from './supabase/info';
import { PricingResult } from './pricingEngine';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-94f26792`;

export interface SavePricingResultParams {
  quoteId?: string;
  jobId?: string;
  customerName?: string;
  serviceType?: string;
  
  // Address fields (detailed)
  fromAddress?: string;
  fromPostcode?: string;
  toAddress?: string;
  toPostcode?: string;
  fromPropertyType?: string;
  toPropertyType?: string;
  fromFloor?: number;
  toFloor?: number;
  fromLift?: boolean;
  toLift?: boolean;
  fromParking?: string;
  toParking?: string;
  fromWalkingDistance?: number;
  toWalkingDistance?: number;
  
  // Crew & vehicle
  crewSize?: number;
  vehicleType?: string;
  
  pricingResult: PricingResult;
}

/**
 * Save a pricing result to backend for audit/debugging
 */
export async function savePricingResult(params: SavePricingResultParams) {
  const { pricingResult, ...metadata } = params;
  
  console.log('📊 [savePricingResult] Starting save...', {
    hasAuditData: !!pricingResult.auditData,
    hasVolumeBreakdown: !!pricingResult.volumeBreakdown,
    pricingResult,
  });
  
  if (!pricingResult.auditData || !pricingResult.volumeBreakdown) {
    console.warn('⚠️ Pricing result missing audit data - cannot save', {
      auditData: pricingResult.auditData,
      volumeBreakdown: pricingResult.volumeBreakdown,
    });
    return null;
  }
  
  const payload = {
    ...metadata,
    
    // Distance & rate
    distanceMiles: pricingResult.auditData.distanceMiles,
    distanceRatePerMile: pricingResult.auditData.distanceRatePerMile,
    distanceCost: pricingResult.auditData.distanceCost,
    baseFee: pricingResult.auditData.baseFee,
    minChargeApplied: pricingResult.auditData.minChargeApplied,
    minChargeValue: pricingResult.auditData.minChargeValue,
    
    // ✅ NEW: Core pricing components
    crewCost: pricingResult.crewPrice || 0,
    
    // Volume details (100% transparent)
    items: pricingResult.volumeBreakdown.itemDetails || [],
    itemsTotalM3: pricingResult.auditData.itemsTotalM3,
    packingFactorValue: pricingResult.auditData.packingFactorValue,
    packingAddedM3: pricingResult.auditData.packingAddedM3,
    safetyMarginValue: pricingResult.auditData.safetyMarginValue,
    safetyAddedM3: pricingResult.auditData.safetyAddedM3,
    finalM3Used: pricingResult.auditData.finalM3Used,
    pricePerCubicMeter: pricingResult.volumeBreakdown.pricePerCubicMeter,
    volumeCost: pricingResult.volumeBreakdown.volumeCharge,
    
    // ✅ NEW: Detailed inventory breakdown
    weightSurcharge: pricingResult.breakdown?.inventoryDetailed?.weightSurcharge || 0,
    handlingCost: pricingResult.breakdown?.inventoryDetailed?.handlingPrice || 0,
    disassemblyFee: pricingResult.breakdown?.inventoryDetailed?.disassemblyFee || 0,
    fragileFee: pricingResult.breakdown?.inventoryDetailed?.fragileFee || 0,
    
    // Extras
    extrasApplied: pricingResult.auditData.extrasApplied,
    accessCharges: pricingResult.auditData.accessCharges,
    dateAdjustments: pricingResult.auditData.dateAdjustments,
    
    // Package
    packageMultiplier: pricingResult.auditData.packageMultiplier,
    finalPriceStandard: pricingResult.auditData.finalPriceStandard,
    finalPricePremium: pricingResult.auditData.finalPricePremium,
    
    // Total
    totalPrice: pricingResult.totalPrice,
  };
  
  console.log('📦 [savePricingResult] Payload prepared:', payload);
  
  try {
    const url = `${API_BASE}/pricing-results`;
    console.log('🌐 [savePricingResult] Sending to:', url);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify(payload),
    });
    
    console.log('📡 [savePricingResult] Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [savePricingResult] Error response:', errorText);
      throw new Error(`Failed to save pricing result: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ [savePricingResult] Success:', data.result.id);
    return data.result;
  } catch (error) {
    console.error('❌ [savePricingResult] Exception:', error);
    return null;
  }
}

/**
 * Get all pricing results
 */
export async function getAllPricingResults() {
  console.log('🔍 [getAllPricingResults] Fetching all pricing results...');
  
  try {
    const url = `${API_BASE}/pricing-results`;
    console.log('🌐 [getAllPricingResults] URL:', url);
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });
    
    console.log('📡 [getAllPricingResults] Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [getAllPricingResults] Error response:', errorText);
      throw new Error(`Failed to fetch pricing results: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ [getAllPricingResults] Received:', data.results?.length || 0, 'results', data);
    return data.results || [];
  } catch (error) {
    console.error('❌ [getAllPricingResults] Exception:', error);
    return [];
  }
}

/**
 * Get a specific pricing result by ID
 */
export async function getPricingResult(id: string) {
  try {
    const response = await fetch(`${API_BASE}/pricing-results/${id}`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch pricing result: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('❌ Error fetching pricing result:', error);
    return null;
  }
}

/**
 * Delete a pricing result
 */
export async function deletePricingResult(id: string) {
  try {
    const response = await fetch(`${API_BASE}/pricing-results/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete pricing result: ${response.statusText}`);
    }
    
    console.log('✅ Pricing result deleted:', id);
    return true;
  } catch (error) {
    console.error('❌ Error deleting pricing result:', error);
    return false;
  }
}