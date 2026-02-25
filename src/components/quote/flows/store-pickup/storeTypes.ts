/**
 * Store/Pickup Quote Types
 */

export interface StoreQuote {
  serviceType: 'store_pickup';
  
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
  
  // Step 3: Access Details
  pickupNotes?: string;
  deliveryNotes?: string;
  specialRequirements?: string;
  
  // Step 4: Customer Details
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddressLine1?: string;
  customerAddressLine2?: string;
  customerCity?: string;
  customerPostcode?: string;
  
  // Distance
  distance?: number;
  
  // Reference
  quoteReference?: string;
  
  // Pricing
  estimatedPrice?: number;
  orderNumber?: string;
  receiptUrl?: string;
  assemblyService?: boolean;
  extras?: Array<{
    id: string;
    name: string;
    price: number;
    quantity?: number;
  }>;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  volume: number;
  category?: string;
}

export function getDefaultStoreQuote(): StoreQuote {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  
  return {
    serviceType: 'store_pickup',
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