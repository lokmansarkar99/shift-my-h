/**
 * Other Delivery Quote Types
 */

export interface OtherQuote {
  serviceType: 'other_delivery';
  
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

  // Step 4: Access & Contact Details
  accessDetails?: {
    pickupParking?: string;
    deliveryParking?: string;
    additionalNotes?: string;
  };
  contactDetails?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    pickupLine1: string;
    pickupCity: string;
    pickupPostcode: string;
    deliveryLine1: string;
    deliveryCity: string;
    deliveryPostcode: string;
  };
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  volume: number;
  category?: string;
}

export function getDefaultOtherQuote(): OtherQuote {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  
  return {
    serviceType: 'other_delivery',
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
