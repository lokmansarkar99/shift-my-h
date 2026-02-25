/**
 * Quotes Service
 * Frontend service for managing quotes
 */

import { projectId, publicAnonKey } from './supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-94f26792`;

export interface QuoteRecord {
  id: string; // quote_xxxxx
  quote_ref: string; // SMH-Q-xxxxx
  created_at: string;
  updated_at: string;
  status: 'Draft' | 'Sent' | 'Confirmed' | 'Converted';
  
  // Service details
  service_type_id: string;
  service_type_name?: string;
  distance_miles: number;
  crew_size: number;
  
  // Addresses
  pickup_address?: {
    address: string;
    postcode: string;
    floor?: number;
    lift?: boolean;
    parking?: 'easy' | 'moderate' | 'difficult';
    walkingDistance?: number;
  };
  delivery_address?: {
    address: string;
    postcode: string;
    floor?: number;
    lift?: boolean;
    parking?: 'easy' | 'moderate' | 'difficult';
    walkingDistance?: number;
  };
  
  // Customer info
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  
  // Items and extras
  items: Array<{
    itemId: string;
    name: string;
    quantity: number;
    volume: number;
  }>;
  extras: Array<{
    extraId: string;
    name: string;
    pricingMode: string;
    unit: string;
    quantity: number;
    price: number;
    percentValue?: number;
  }>;
  
  // Pricing
  pricing_breakdown: any;
  subtotal: number;
  extras_total: number;
  total: number;
  audit_data: any;
  
  // Conversion tracking
  converted_job_id?: string;
  converted_at?: string;
}

/**
 * Get all quotes
 */
export async function fetchQuotes(): Promise<QuoteRecord[]> {
  try {
    const response = await fetch(`${API_BASE}/api/quotes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch quotes: ${response.statusText}`);
    }

    const data = await response.json();
    return data.quotes || [];
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return [];
  }
}

/**
 * Get single quote by ID
 */
export async function fetchQuote(id: string): Promise<QuoteRecord | null> {
  try {
    const response = await fetch(`${API_BASE}/api/quotes/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch quote: ${response.statusText}`);
    }

    const data = await response.json();
    return data.quote;
  } catch (error) {
    console.error('Error fetching quote:', error);
    return null;
  }
}

/**
 * Create new quote
 */
export async function createQuote(quote: Partial<QuoteRecord>): Promise<QuoteRecord | null> {
  try {
    const response = await fetch(`${API_BASE}/api/quotes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify(quote),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create quote');
    }

    const data = await response.json();
    return data.quote;
  } catch (error) {
    console.error('Error creating quote:', error);
    throw error;
  }
}

/**
 * Update existing quote
 */
export async function updateQuote(id: string, updates: Partial<QuoteRecord>): Promise<QuoteRecord | null> {
  try {
    const response = await fetch(`${API_BASE}/api/quotes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update quote');
    }

    const data = await response.json();
    return data.quote;
  } catch (error) {
    console.error('Error updating quote:', error);
    throw error;
  }
}

/**
 * Delete quote
 */
export async function deleteQuote(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/api/quotes/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete quote');
    }

    return true;
  } catch (error) {
    console.error('Error deleting quote:', error);
    return false;
  }
}
