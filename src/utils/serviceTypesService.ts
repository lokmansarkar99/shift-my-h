import { projectId, publicAnonKey } from './supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-94f26792`;

/**
 * Service Types Configuration Service
 * Maps public quote cards to service-specific pricing rules
 */

export interface ServiceTypeConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  
  // Feature toggles
  use_items: boolean;
  useVolume: boolean; // ✅ RENAMED from use_m3 - when true, volume MUST affect price
  use_floors: boolean;
  use_property_type: boolean;
  use_waiting_time: boolean;
  use_weight_tiers: boolean;
  
  // Pricing
  min_price: number;
  price_per_m3: number; // ✅ REQUIRED when useVolume = true (must be > 0)
  price_per_mile: number;
  base_price: number;
  
  // 🆕 CREW LIMITS (business rules, NOT pricing)
  min_crew: number; // Minimum crew required (1-4)
  max_crew: number; // Maximum crew allowed (1-4)
  default_crew: number; // Default crew size shown in quote flow (min_crew <= default_crew <= max_crew)
  allow_customer_help?: boolean; // ✅ NEW: Allow "customer helps" option (reduces min_crew by 1)
  
  // Property type multipliers (only if use_property_type = true)
  property_multipliers?: {
    flat: number;
    house: number;
    office: number;
  };
  
  // Floor charges (only if use_floors = true)
  floor_charges?: {
    per_floor_collection: number;
    per_floor_delivery: number;
  };
  
  // Weight tiers (only if use_weight_tiers = true)
  weight_tiers?: Array<{
    max_kg: number;
    price_per_mile: number;
  }>;
  
  // Disposal pricing (for clearance)
  disposal_pricing?: {
    price_per_m3: number;
    heavy_item_surcharge: number;
  };
  
  // Enabled extras (array of extra IDs that are available for this service)
  enabled_extras: string[];
  
  // Active status
  active: boolean;
  
  // Display order
  sort_order: number;
}

export const DEFAULT_SERVICE_TYPES: ServiceTypeConfig[] = [
  {
    id: 'house-move',
    name: 'House Move',
    description: 'Complete home relocations with professional care',
    icon: 'Home',
    use_items: true,
    useVolume: true,
    use_floors: true,
    use_property_type: true,
    use_waiting_time: false,
    use_weight_tiers: false,
    min_price: 280,
    price_per_m3: 12,
    price_per_mile: 2.5,
    base_price: 0,
    min_crew: 2,
    max_crew: 4,
    default_crew: 3,
    property_multipliers: {
      flat: 1.0,
      house: 1.2,
      office: 1.3,
    },
    floor_charges: {
      per_floor_collection: 15,
      per_floor_delivery: 15,
    },
    enabled_extras: [
      'packing-service',
      'assembly-disassembly',
      'storage',
      'insurance-premium',
      'cleaning-service',
      'heavy-items',
    ],
    active: true,
    sort_order: 1,
  },
  {
    id: 'furniture',
    name: 'Furniture & Items',
    description: 'Sofas, beds, wardrobes delivered safely',
    icon: 'Armchair',
    use_items: true,
    useVolume: true,
    use_floors: false,
    use_property_type: false,
    use_waiting_time: false,
    use_weight_tiers: false,
    min_price: 180,
    price_per_m3: 10,
    price_per_mile: 2.2,
    base_price: 0,
    min_crew: 1,
    max_crew: 4,
    default_crew: 2,
    enabled_extras: [
      'assembly-disassembly',
      'packing-service',
      'insurance-premium',
      'heavy-items',
    ],
    active: true,
    sort_order: 2,
  },
  {
    id: 'clearance',
    name: 'Clearance & Removal',
    description: 'House, garden, builders and junk clearance',
    icon: 'Trash2',
    use_items: true,
    useVolume: true,
    use_floors: false,
    use_property_type: false,
    use_waiting_time: false,
    use_weight_tiers: false,
    min_price: 200,
    price_per_m3: 8,
    price_per_mile: 2.0,
    base_price: 0,
    min_crew: 2,
    max_crew: 4,
    default_crew: 3,
    disposal_pricing: {
      price_per_m3: 15,
      heavy_item_surcharge: 25,
    },
    enabled_extras: [
      'heavy-items',
      'hazardous-disposal',
    ],
    active: true,
    sort_order: 3,
  },
  {
    id: 'motorbike',
    name: 'Motorbike & Bicycle Transport',
    description: 'Secure transport for your vehicles',
    icon: 'Bike',
    use_items: false,
    useVolume: false,
    use_floors: false,
    use_property_type: false,
    use_waiting_time: false,
    use_weight_tiers: false,
    min_price: 220,
    price_per_m3: 0,
    price_per_mile: 3.5,
    base_price: 120,
    min_crew: 1,
    max_crew: 2,
    default_crew: 1,
    enabled_extras: [
      'insurance-premium',
    ],
    active: true,
    sort_order: 4,
  },
  {
    id: 'store-pickup',
    name: 'Store / Pickup Service',
    description: 'IKEA, B&Q, and retail pickups',
    icon: 'Store',
    use_items: true,
    useVolume: true,
    use_floors: false,
    use_property_type: false,
    use_waiting_time: true,
    use_weight_tiers: false,
    min_price: 150,
    price_per_m3: 8,
    price_per_mile: 2.0,
    base_price: 80,
    min_crew: 1,
    max_crew: 2,
    default_crew: 1,
    enabled_extras: [
      'waiting-time',
      'assembly-disassembly',
      'packing-service',
    ],
    active: true,
    sort_order: 5,
  },
  {
    id: 'other',
    name: 'Other Delivery',
    description: 'Custom solutions for any item',
    icon: 'Package',
    use_items: true,
    useVolume: true,
    use_floors: false,
    use_property_type: false,
    use_waiting_time: false,
    use_weight_tiers: false,
    min_price: 120,
    price_per_m3: 10,
    price_per_mile: 2.2,
    base_price: 60,
    min_crew: 1,
    max_crew: 2,
    default_crew: 1,
    enabled_extras: [
      'packing-service',
      'insurance-premium',
      'heavy-items',
      'waiting-time',
    ],
    active: true,
    sort_order: 6,
  },
];

const SERVICE_TYPES_KEY = 'service_types_config';

/**
 * Fetch all service types
 */
export async function fetchServiceTypes(): Promise<ServiceTypeConfig[]> {
  try {
    const response = await fetch(`${API_BASE}/api/service-types`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch service types: ${response.statusText}`);
    }

    const data = await response.json();
    const serviceTypes = data.serviceTypes || DEFAULT_SERVICE_TYPES;
    
    // ✅ SAVE TO LOCALSTORAGE CACHE for synchronous access
    try {
      localStorage.setItem(SERVICE_TYPES_KEY, JSON.stringify(serviceTypes));
      console.log('💾 Service types cached to localStorage');
    } catch (err) {
      console.warn('Failed to cache service types to localStorage:', err);
    }
    
    return serviceTypes;
  } catch (error) {
    // Silently use default service types if fetch fails (normal in preview mode)
    return DEFAULT_SERVICE_TYPES;
  }
}

/**
 * Fetch a single service type by ID
 */
export async function fetchServiceType(id: string): Promise<ServiceTypeConfig | null> {
  const serviceTypes = await fetchServiceTypes();
  return serviceTypes.find(st => st.id === id) || null;
}

/**
 * Update all service types
 */
export async function updateServiceTypes(serviceTypes: ServiceTypeConfig[]): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/api/service-types`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ serviceTypes }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update service types');
    }
    
    // ✅ UPDATE LOCALSTORAGE CACHE after successful save
    try {
      localStorage.setItem(SERVICE_TYPES_KEY, JSON.stringify(serviceTypes));
      console.log('💾 Service types cache updated');
    } catch (err) {
      console.warn('Failed to update service types cache:', err);
    }
  } catch (error) {
    console.error('Error updating service types:', error);
    throw error;
  }
}

/**
 * Update a single service type
 */
export async function updateServiceType(id: string, updates: Partial<ServiceTypeConfig>): Promise<void> {
  const serviceTypes = await fetchServiceTypes();
  const index = serviceTypes.findIndex(st => st.id === id);
  
  if (index === -1) {
    throw new Error(`Service type ${id} not found`);
  }
  
  serviceTypes[index] = { ...serviceTypes[index], ...updates };
  await updateServiceTypes(serviceTypes);
}

/**
 * Initialize service types with defaults (if not exists)
 */
export async function initializeServiceTypes(): Promise<void> {
  try {
    const existing = await fetchServiceTypes();
    
    // If no service types exist, initialize with defaults
    if (!existing || existing.length === 0) {
      await updateServiceTypes(DEFAULT_SERVICE_TYPES);
      console.log('✅ Service types initialized with defaults');
    }
  } catch (error) {
    console.error('Failed to initialize service types:', error);
  }
}

/**
 * Get service types synchronously from localStorage cache
 * Use this for immediate access (admin UI, calculators)
 */
export function getServiceTypes(): ServiceTypeConfig[] {
  try {
    const cached = localStorage.getItem(SERVICE_TYPES_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (error) {
    console.warn('Failed to get cached service types:', error);
  }
  
  // Fallback to defaults if cache empty
  return DEFAULT_SERVICE_TYPES;
}

/**
 * Get active service types only
 */
export function getActiveServiceTypes(): ServiceTypeConfig[] {
  return getServiceTypes().filter(st => st.active);
}

/**
 * Get single service type by ID (synchronous)
 */
export function getServiceTypeById(id: string): ServiceTypeConfig | undefined {
  return getServiceTypes().find(st => st.id === id);
}

/**
 * ✅ VALIDATE SERVICE TYPE CONFIGURATION
 * Hard validation - no silent failures!
 */
export function validateServiceType(config: ServiceTypeConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // ✅ CRITICAL: If useVolume = true, price_per_m3 MUST be > 0
  if (config.useVolume && (!config.price_per_m3 || config.price_per_m3 <= 0)) {
    errors.push('Price per m³ is required and must be greater than 0 when Use Volume is enabled.');
  }
  
  // Basic validations
  if (!config.name || config.name.trim() === '') {
    errors.push('Service name is required.');
  }
  
  if (config.min_price < 0) {
    errors.push('Minimum price cannot be negative.');
  }
  
  if (config.base_price < 0) {
    errors.push('Base price cannot be negative.');
  }
  
  if (config.price_per_mile < 0) {
    errors.push('Price per mile cannot be negative.');
  }
  
  // Crew validation
  if (config.min_crew < 1 || config.min_crew > 4) {
    errors.push('Minimum crew must be between 1 and 4.');
  }
  
  if (config.max_crew < 1 || config.max_crew > 4) {
    errors.push('Maximum crew must be between 1 and 4.');
  }
  
  if (config.min_crew > config.max_crew) {
    errors.push('Minimum crew cannot be greater than maximum crew.');
  }
  
  if (config.default_crew < config.min_crew || config.default_crew > config.max_crew) {
    errors.push('Default crew must be between minimum and maximum crew.');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}