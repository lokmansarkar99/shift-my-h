/**
 * Quote Storage System
 * 
 * DUAL SYSTEM:
 * 1. NEW SYSTEM: Service-specific localStorage (quote-house-move, quote-clearance, etc.)
 * 2. OLD SYSTEM: Shared localStorage (shiftmyhome_quote_data) - for backwards compatibility
 */

// ==============================
// TYPES
// ==============================

export type ServiceCategory = 
  | 'house_move' 
  | 'furniture_items' 
  | 'clearance_removal' 
  | 'vehicle_delivery'
  | 'store_pickup'
  | 'other_delivery';

export type ServiceType = 
  | 'house-move' 
  | 'clearance' 
  | 'furniture' 
  | 'motorbike' 
  | 'store-pickup' 
  | 'other';

interface QuoteData {
  journeyId?: string;
  quoteRef?: string;
  serviceCategory?: ServiceCategory;
  serviceType?: string;
  lastStep?: number;
  [key: string]: any;
}

// ==============================
// NEW SYSTEM - Service-Specific Storage
// ==============================

const STORAGE_KEYS: Record<ServiceType, string> = {
  'house-move': 'quote-house-move',
  'clearance': 'quote-clearance',
  'furniture': 'quote-furniture',
  'motorbike': 'quote-motorbike',
  'store-pickup': 'quote-store-pickup',
  'other': 'quote-other',
};

export function saveQuoteData(serviceType: ServiceType, data: any): void;
export function saveQuoteData(data: Partial<QuoteData>): void;
export function saveQuoteData(serviceTypeOrData: ServiceType | Partial<QuoteData>, data?: any): void {
  // NEW SYSTEM: Service-specific storage
  if (typeof serviceTypeOrData === 'string' && data !== undefined) {
    try {
      const key = STORAGE_KEYS[serviceTypeOrData as ServiceType];
      const serialized = JSON.stringify({
        ...data,
        updatedAt: new Date().toISOString(),
      });
      localStorage.setItem(key, serialized);
      
      // CRITICAL: Save the active service type so we know which service to load
      localStorage.setItem('active-service-type', serviceTypeOrData);
      
      console.log(`✅ [NEW] Saved ${serviceTypeOrData} quote data to localStorage[${key}]`);
    } catch (error) {
      console.error(`❌ [NEW] Failed to save ${serviceTypeOrData} quote data:`, error);
    }
    return;
  }

  // OLD SYSTEM: Shared storage (backwards compatibility)
  try {
    const existing = getQuoteData();
    const merged = { ...existing, ...(serviceTypeOrData as Partial<QuoteData>) };
    const serialized = JSON.stringify(merged);
    localStorage.setItem('shiftmyhome_quote_data', serialized);
    console.log('✅ [OLD] Saved quote data to shiftmyhome_quote_data');
  } catch (error) {
    console.error('❌ [OLD] Failed to save quote data:', error);
  }
}

export function loadQuoteData<T>(serviceType: ServiceType): T | null {
  try {
    const key = STORAGE_KEYS[serviceType];
    const serialized = localStorage.getItem(key);
    
    if (!serialized) {
      console.log(`ℹ️ [NEW] No saved data for ${serviceType}`);
      return null;
    }
    
    const data = JSON.parse(serialized);
    console.log(`✅ [NEW] Loaded ${serviceType} quote data from localStorage[${key}]`);
    return data as T;
  } catch (error) {
    console.error(`❌ [NEW] Failed to load ${serviceType} quote data:`, error);
    return null;
  }
}

export function clearQuoteData(serviceType?: ServiceType): void {
  // NEW SYSTEM: Clear specific service
  if (serviceType) {
    try {
      const key = STORAGE_KEYS[serviceType];
      localStorage.removeItem(key);
      console.log(`✅ [NEW] Cleared ${serviceType} quote data from localStorage[${key}]`);
    } catch (error) {
      console.error(`❌ [NEW] Failed to clear ${serviceType} quote data:`, error);
    }
    return;
  }

  // OLD SYSTEM: Clear shared storage
  try {
    localStorage.removeItem('shiftmyhome_quote_data');
    console.log('✅ [OLD] Cleared quote data from shiftmyhome_quote_data');
  } catch (error) {
    console.error('❌ [OLD] Failed to clear quote data:', error);
  }
}

export function hasQuoteData(serviceType: ServiceType): boolean {
  const key = STORAGE_KEYS[serviceType];
  return localStorage.getItem(key) !== null;
}

// ==============================
// OLD SYSTEM - Backwards Compatibility
// ==============================

export function getQuoteData(): QuoteData {
  try {
    const serialized = localStorage.getItem('shiftmyhome_quote_data');
    if (!serialized) {
      return {};
    }
    return JSON.parse(serialized);
  } catch (error) {
    console.error('❌ [OLD] Failed to get quote data:', error);
    return {};
  }
}

export function updateLastStep(step: number): void {
  try {
    const existing = getQuoteData();
    const updated = { ...existing, lastStep: step };
    localStorage.setItem('shiftmyhome_quote_data', JSON.stringify(updated));
    console.log(`✅ [OLD] Updated last step to ${step}`);
  } catch (error) {
    console.error('❌ [OLD] Failed to update last step:', error);
  }
}

export function generateJourneyId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `JID-${timestamp}-${random}`;
}

export function generateQuoteRef(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `SMH-${random}-${timestamp.toString().slice(-6)}`;
}

export function getServiceCategoryName(category: ServiceCategory): string {
  const names: Record<ServiceCategory, string> = {
    'house_move': 'House Move',
    'furniture_items': 'Furniture & Items',
    'clearance_removal': 'Clearance & Removal',
    'vehicle_delivery': 'Motorbike & Bicycle Transport',
    'store_pickup': 'Store/Pickup Service',
    'other_delivery': 'Other Delivery Service',
  };
  return names[category] || 'Quote';
}

// ==============================
// UTILITY FUNCTIONS
// ==============================

export function getServiceTypeFromCategory(category: ServiceCategory): ServiceType {
  const mapping: Record<ServiceCategory, ServiceType> = {
    'house_move': 'house-move',
    'furniture_items': 'furniture',
    'clearance_removal': 'clearance',
    'vehicle_delivery': 'motorbike',
    'store_pickup': 'store-pickup',
    'other_delivery': 'other',
  };
  return mapping[category] || 'house-move';
}

export function getCategoryFromServiceType(serviceType: string): ServiceCategory {
  const mapping: Record<string, ServiceCategory> = {
    'house-move': 'house_move',
    'furniture': 'furniture_items',
    'clearance': 'clearance_removal',
    'motorbike': 'vehicle_delivery',
    'store-pickup': 'store_pickup',
    'other': 'other_delivery',
  };
  return mapping[serviceType] || 'house_move';
}

export function getActiveServiceType(): ServiceType | null {
  // CRITICAL: Check the active service type key first (most recent selection)
  const activeService = localStorage.getItem('active-service-type');
  if (activeService && STORAGE_KEYS[activeService as ServiceType]) {
    console.log(`✅ Found active service from marker: ${activeService}`);
    return activeService as ServiceType;
  }
  
  // Fallback: check which service has data in localStorage
  for (const [serviceType, key] of Object.entries(STORAGE_KEYS)) {
    if (localStorage.getItem(key)) {
      console.log(`✅ Found active service by scanning: ${serviceType}`);
      return serviceType as ServiceType;
    }
  }
  
  // Fallback: check old system
  const oldData = getQuoteData();
  if (oldData.serviceType) {
    console.log(`✅ Found service from old system: ${oldData.serviceType}`);
    return oldData.serviceType as ServiceType;
  }
  
  console.log('⚠️ No active service found');
  return null;
}