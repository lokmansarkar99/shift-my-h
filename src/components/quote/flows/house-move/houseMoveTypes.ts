/**
 * House Move - Data Model
 * Completely independent from other services
 */

export interface HouseMoveQuote {
  serviceType: 'house-move';
  quoteReference?: string;
  
  // Step 1: Location & Property Details
  pickup?: {
    address: string;
    propertyType: string;
    floor: number;
    hasLift: boolean;
    parkingDistance?: number;
    lat?: number;
    lng?: number;
  };
  dropoff?: {
    address: string;
    propertyType: string;
    floor: number;
    hasLift: boolean;
    parkingDistance?: number;
    lat?: number;
    lng?: number;
  };
  distance?: number;
  duration?: number;
  
  // Step 2: Inventory
  items?: Array<{
    id: string;
    name: string;
    quantity: number;
    volume?: number;
  }>;
  
  // Step 3: Pricing
  pricing?: {
    basePrice: number;
    extras: Array<{
      id: string;
      name: string;
      price: number;
      quantity?: number;
    }>;
    totalPrice: number;
    packageType?: 'standard' | 'premium';
  };
  
  // Step 4: Date & Time
  moveTime?: string;
  specialRequirements?: string;
  
  // Additional fields
  date?: string;
  status?: string;
}

export function getDefaultHouseMoveQuote(): HouseMoveQuote {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  
  return {
    serviceType: 'house-move',
    quoteReference: `SMH-${random}-${timestamp}`,
    pickup: {
      address: '',
      propertyType: '',
      floor: 0,
      hasLift: false,
      parkingDistance: 0,
    },
    dropoff: {
      address: '',
      propertyType: '',
      floor: 0,
      hasLift: false,
      parkingDistance: 0,
    },
    items: [],
    pricing: {
      basePrice: 0,
      extras: [],
      totalPrice: 0,
    },
  };
}