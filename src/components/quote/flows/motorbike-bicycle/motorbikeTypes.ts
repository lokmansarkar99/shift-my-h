/**
 * Motorbike & Bicycle Quote Types
 */

export interface MotorbikeQuote {
  serviceType: 'motorbike_bicycle';
  
  // Step 1: Addresses
  pickup: {
    address: string;
    postcode: string;
    floor: number;
    hasLift: boolean;
    lat?: number;
    lng?: number;
  };
  dropoff: {
    address: string;
    postcode: string;
    floor: number;
    hasLift: boolean;
    lat?: number;
    lng?: number;
  };
  
  // Date
  date?: Date;
  dateUnsure?: boolean;
  
  // Step 2: Inventory
  items?: InventoryItem[];
  totalVolume?: number;
  
  // Distance
  distance?: number;
  duration?: number;
  
  // Reference
  quoteReference?: string;
  
  // Pricing
  estimatedPrice?: number;
  pricing?: {
    packageType: 'standard' | 'premium' | 'flexible';
    totalPrice: number;
  };

  // Step 4: Access & Contact Details
  accessDetails?: {
    pickupNotes?: string;
    deliveryNotes?: string;
    specialRequirements?: string;
  };
  contactDetails?: {
    name: string;
    email: string;
    phone: string;
    streetAddress?: string;
    addressLine2?: string;
    city?: string;
    postcode?: string;
  };
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  volume: number;
  category?: string;
}

export function getDefaultMotorbikeQuote(): MotorbikeQuote {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  
  return {
    serviceType: 'motorbike_bicycle',
    quoteReference: `SMH-${random}-${timestamp}`,
    pickup: {
      address: '',
      postcode: '',
      floor: 0,
      hasLift: false,
    },
    dropoff: {
      address: '',
      postcode: '',
      floor: 0,
      hasLift: false,
    },
  };
}
