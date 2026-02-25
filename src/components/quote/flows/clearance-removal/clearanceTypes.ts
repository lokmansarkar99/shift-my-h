/**
 * Clearance & Removal - Data Model
 * Completely independent from other services
 */

export interface ClearanceAddress {
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
  addressLine1?: string;
  addressLine2?: string;
}

export interface ClearanceInventory {
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

export interface ClearanceAccessDetails {
  pickupFloor: number;
  pickupHasLift: boolean;
  pickupParkingDistance: number;
}

export interface ClearanceClearanceDetails {
  disposalType: 'recyclable' | 'general' | 'restricted' | 'hazardous';
  estimatedLoadingTime: number;
  categories: {
    household: boolean;
    garden: boolean;
    builders: boolean;
  };
}

export interface ClearancePricing {
  workCost: number;
  disposalCost: number;
  totalPrice: number;
  breakdown?: {
    totalVolumeM3: number;
    workRatePerM3: number;
    disposalMode: 'fixed_only' | 'per_m3_only' | 'fixed_plus_per_m3';
    disposalFeeFixed?: number;
    disposalRatePerM3?: number;
    customerProvidesDisposalDiscount?: number;
  };
}

export interface ClearanceQuote {
  serviceType: 'clearance';
  
  // Step 1: Address
  pickup: ClearanceAddress;
  delivery?: ClearanceAddress; // Optional specific disposal location
  date?: Date;
  dateUnsure?: boolean;
  flexibility?: string;
  clearanceServiceType?: string; // 'House Clearance', 'Garden Clearance', 'Builders Waste', etc.
  
  // Step 2: Inventory
  inventory: ClearanceInventory;
  clearanceDetails?: ClearanceClearanceDetails;
  disposalSelected?: boolean; // true if "We'll dispose", false if customer provides location
  hasSpecificDisposalLocation?: boolean; // true if customer provides disposal location
  totalVolumeM3?: number; // Calculated from inventory
  
  // Step 3: Access
  access: ClearanceAccessDetails;
  
  // Step 4: Details
  contact?: {
    name: string;
    email: string;
    phone: string;
  };
  pickupAddress?: {
    addressLine1: string;
    addressLine2: string;
    city: string;
    postcode: string;
  };
  pickupDate?: string;
  pickupTime?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  notes?: string;
  
  // Step 5: Review
  agreedToTerms?: boolean;
  pricing?: ClearancePricing; // Pricing breakdown
  estimatedPrice?: number;
  
  // Payment
  paymentMethod?: 'pay_today' | 'pay_later';
  paymentDetails?: {
    paymentMethod: 'pay_today' | 'pay_later';
    cardNumber: string;
    expiryDate: string;
    securityCode: string;
    country: string;
    postalCode: string;
  };
  
  // Metadata
  quoteReference?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export function getDefaultClearanceQuote(): ClearanceQuote {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  
  return {
    serviceType: 'clearance',
    quoteReference: `SMH-${random}-${timestamp}`,
    pickup: {
      address: '',
      postcode: '',
      floor: 0,
      hasLift: false,
      parkingDistance: 0,
    },
    inventory: {
      items: [],
      totalVolume: 0,
      totalItems: 0,
    },
    access: {
      pickupFloor: 0,
      pickupHasLift: false,
      pickupParkingDistance: 0,
    },
  };
}