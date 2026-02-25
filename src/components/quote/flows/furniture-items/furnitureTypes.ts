/**
 * Furniture & Items - Data Model
 * Completely independent from other services
 */

export interface FurnitureAddress {
  address: string;
  postcode: string;
  floor?: number;
  hasLift?: boolean;
  parkingDistance?: number;
  lat?: number;
  lng?: number;
  street?: string;
  houseNumber?: string;
  city?: string;
}

export interface FurnitureInventory {
  items: {
    id: string;
    name: string;
    quantity: number;
    volume: number;
    loadTime: number;
    unloadTime: number;
  }[];
  totalVolume: number;
  totalItems: number;
}

export interface FurnitureAccessDetails {
  pickupFloor: number;
  pickupHasLift: boolean;
  pickupParkingDistance: number;
  dropoffFloor: number;
  dropoffHasLift: boolean;
  dropoffParkingDistance: number;
}

export interface FurnitureQuote {
  serviceType: 'furniture';
  
  // Step 1: Address (pickup + delivery, NO property types)
  pickup?: FurnitureAddress;
  dropoff?: FurnitureAddress;
  date?: Date | string;
  dateUnsure?: boolean;
  flexibility?: string;
  distance?: number;
  duration?: number;
  
  // Step 2: Inventory (furniture items) - NEW SIMPLIFIED FORMAT
  items?: Array<{ id: string; name: string; quantity: number; volume?: number }>;
  crewSize?: 1 | 2 | 3; // ✅ NEW: Crew selection
  
  // Step 2: Inventory (OLD FORMAT - keeping for backwards compatibility)
  inventory?: FurnitureInventory;
  
  // Step 3: Access
  access?: FurnitureAccessDetails;
  
  // Step 4: Details
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  notes?: string;
  
  // Step 5: Review
  agreedToTerms?: boolean;
  
  // Metadata
  quoteReference?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export function getDefaultFurnitureQuote(): FurnitureQuote {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  
  return {
    serviceType: 'furniture',
    quoteReference: `SMH-${random}-${timestamp}`,
    items: [],
  };
}