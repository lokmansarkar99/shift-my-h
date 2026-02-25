/**
 * Quotes API Handler
 * Manages quote creation, updates, and conversion to jobs
 */

import { Context } from 'npm:hono';
import * as kv from './kv_store.tsx';

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
  pricing_breakdown: any; // Full breakdown from pricing engine
  subtotal: number;
  extras_total: number;
  total: number;
  audit_data: any; // Full audit trail
  
  // Conversion tracking
  converted_job_id?: string;
  converted_at?: string;
}

/**
 * Generate unique quote reference
 */
function generateQuoteRef(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `SMH-Q-${timestamp}${random}`;
}

/**
 * GET /api/quotes - Get all quotes
 */
export async function getQuotes(c: Context) {
  try {
    const quotes = await kv.getByPrefix('quote_');
    
    // Sort by created_at descending
    const sortedQuotes = quotes.sort((a, b) => 
      new Date(b.value.created_at).getTime() - new Date(a.value.created_at).getTime()
    );
    
    return c.json({
      success: true,
      quotes: sortedQuotes.map(q => q.value),
    });
  } catch (error: any) {
    console.error('❌ Error fetching quotes:', error);
    return c.json({
      success: false,
      error: error.message || 'Failed to fetch quotes',
    }, 500);
  }
}

/**
 * GET /api/quotes/:id - Get single quote
 */
export async function getQuote(c: Context) {
  try {
    const id = c.req.param('id');
    const quote = await kv.get(`quote_${id}`);
    
    if (!quote) {
      return c.json({
        success: false,
        error: 'Quote not found',
      }, 404);
    }
    
    return c.json({
      success: true,
      quote,
    });
  } catch (error: any) {
    console.error('❌ Error fetching quote:', error);
    return c.json({
      success: false,
      error: error.message || 'Failed to fetch quote',
    }, 500);
  }
}

/**
 * POST /api/quotes - Create new quote
 */
export async function createQuote(c: Context) {
  try {
    const body = await c.req.json();
    
    // Validate required fields
    if (!body.customer_phone) {
      return c.json({
        success: false,
        error: 'Customer phone is required',
      }, 400);
    }
    
    if (!body.service_type_id) {
      return c.json({
        success: false,
        error: 'Service type is required',
      }, 400);
    }
    
    if (!body.items || body.items.length === 0) {
      return c.json({
        success: false,
        error: 'At least one item is required',
      }, 400);
    }
    
    // Generate ID and reference
    const id = `quote_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const quote_ref = generateQuoteRef();
    const now = new Date().toISOString();
    
    const quote: QuoteRecord = {
      id,
      quote_ref,
      created_at: now,
      updated_at: now,
      status: body.status || 'Draft',
      service_type_id: body.service_type_id,
      service_type_name: body.service_type_name,
      distance_miles: body.distance_miles || 0,
      crew_size: body.crew_size || 2,
      pickup_address: body.pickup_address,
      delivery_address: body.delivery_address,
      customer_name: body.customer_name || 'Unknown Customer',
      customer_phone: body.customer_phone,
      customer_email: body.customer_email,
      items: body.items || [],
      extras: body.extras || [],
      pricing_breakdown: body.pricing_breakdown || {},
      subtotal: body.subtotal || 0,
      extras_total: body.extras_total || 0,
      total: body.total || 0,
      audit_data: body.audit_data || {},
    };
    
    // Save to KV store
    await kv.set(id, quote);
    
    console.log('✅ Quote created:', quote_ref, id);
    
    return c.json({
      success: true,
      quote,
    });
  } catch (error: any) {
    console.error('❌ Error creating quote:', error);
    return c.json({
      success: false,
      error: error.message || 'Failed to create quote',
    }, 500);
  }
}

/**
 * PUT /api/quotes/:id - Update existing quote
 */
export async function updateQuote(c: Context) {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    // Get existing quote
    const existing = await kv.get(id);
    if (!existing) {
      return c.json({
        success: false,
        error: 'Quote not found',
      }, 404);
    }
    
    const updated: QuoteRecord = {
      ...existing,
      ...body,
      id, // Preserve ID
      quote_ref: existing.quote_ref, // Preserve reference
      created_at: existing.created_at, // Preserve creation time
      updated_at: new Date().toISOString(),
    };
    
    await kv.set(id, updated);
    
    console.log('✅ Quote updated:', updated.quote_ref, id);
    
    return c.json({
      success: true,
      quote: updated,
    });
  } catch (error: any) {
    console.error('❌ Error updating quote:', error);
    return c.json({
      success: false,
      error: error.message || 'Failed to update quote',
    }, 500);
  }
}

/**
 * DELETE /api/quotes/:id - Delete quote
 */
export async function deleteQuote(c: Context) {
  try {
    const id = c.req.param('id');
    
    const existing = await kv.get(id);
    if (!existing) {
      return c.json({
        success: false,
        error: 'Quote not found',
      }, 404);
    }
    
    await kv.del(id);
    
    console.log('✅ Quote deleted:', id);
    
    return c.json({
      success: true,
      message: 'Quote deleted successfully',
    });
  } catch (error: any) {
    console.error('❌ Error deleting quote:', error);
    return c.json({
      success: false,
      error: error.message || 'Failed to delete quote',
    }, 500);
  }
}
