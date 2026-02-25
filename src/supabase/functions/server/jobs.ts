/**
 * Jobs API Handler
 * Manages job creation and conversion from quotes
 */

import { Context } from 'npm:hono';
import * as kv from './kv_store.tsx';

export interface JobRecord {
  id: string; // job_xxxxx
  job_ref: string; // JOB-xxxxx
  created_at: string;
  updated_at: string;
  status: 'Available' | 'Assigned' | 'Booked' | 'InProgress' | 'Completed' | 'Cancelled';
  
  // Source tracking
  source: 'AdminQuoteCalculator' | 'CustomerWebsite' | 'PhoneQuote' | 'Manual';
  quote_id?: string; // Reference to original quote
  
  // Service details
  service_type_id: string;
  service_type_name?: string;
  distance_miles: number;
  crew_size: number;
  
  // Addresses
  pickup_address: {
    address: string;
    postcode: string;
    floor?: number;
    lift?: boolean;
    parking?: 'easy' | 'moderate' | 'difficult';
    walkingDistance?: number;
  };
  delivery_address: {
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
  price_total: number;
  pricing_breakdown?: any;
  
  // Assignment
  assigned_driver_id?: string;
  assigned_driver_name?: string;
  assigned_at?: string;
  
  // Scheduling
  scheduled_date?: string;
  scheduled_time?: string;
  
  // Completion
  completed_at?: string;
  completion_notes?: string;
}

/**
 * Generate unique job reference
 */
function generateJobRef(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `JOB-${timestamp}${random}`;
}

/**
 * GET /api/jobs - Get all jobs (with optional status filter)
 */
export async function getJobs(c: Context) {
  try {
    const status = c.req.query('status'); // e.g., ?status=Available
    
    const jobs = await kv.getByPrefix('job_');
    
    // Filter by status if provided
    let filteredJobs = jobs.map(j => j.value);
    if (status) {
      filteredJobs = filteredJobs.filter(j => j.status === status);
    }
    
    // Sort by created_at descending
    const sortedJobs = filteredJobs.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    return c.json({
      success: true,
      jobs: sortedJobs,
    });
  } catch (error: any) {
    console.error('❌ Error fetching jobs:', error);
    return c.json({
      success: false,
      error: error.message || 'Failed to fetch jobs',
    }, 500);
  }
}

/**
 * GET /api/jobs/:id - Get single job
 */
export async function getJob(c: Context) {
  try {
    const id = c.req.param('id');
    const job = await kv.get(`job_${id}`);
    
    if (!job) {
      return c.json({
        success: false,
        error: 'Job not found',
      }, 404);
    }
    
    return c.json({
      success: true,
      job,
    });
  } catch (error: any) {
    console.error('❌ Error fetching job:', error);
    return c.json({
      success: false,
      error: error.message || 'Failed to fetch job',
    }, 500);
  }
}

/**
 * POST /api/jobs - Create new job
 */
export async function createJob(c: Context) {
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
    
    if (!body.pickup_address || !body.delivery_address) {
      return c.json({
        success: false,
        error: 'Pickup and delivery addresses are required',
      }, 400);
    }
    
    // Generate ID and reference
    const id = `job_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const job_ref = generateJobRef();
    const now = new Date().toISOString();
    
    const job: JobRecord = {
      id,
      job_ref,
      created_at: now,
      updated_at: now,
      status: body.status || 'Available',
      source: body.source || 'Manual',
      quote_id: body.quote_id,
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
      price_total: body.price_total || 0,
      pricing_breakdown: body.pricing_breakdown,
      scheduled_date: body.scheduled_date,
      scheduled_time: body.scheduled_time,
    };
    
    // Save to KV store
    await kv.set(id, job);
    
    console.log('✅ Job created:', job_ref, id);
    
    return c.json({
      success: true,
      job,
    });
  } catch (error: any) {
    console.error('❌ Error creating job:', error);
    return c.json({
      success: false,
      error: error.message || 'Failed to create job',
    }, 500);
  }
}

/**
 * POST /api/jobs/convert-from-quote - Convert quote to job
 */
export async function convertQuoteToJob(c: Context) {
  try {
    const body = await c.req.json();
    const quoteId = body.quote_id;
    
    if (!quoteId) {
      return c.json({
        success: false,
        error: 'Quote ID is required',
      }, 400);
    }
    
    // Get the quote
    const quote = await kv.get(quoteId);
    if (!quote) {
      return c.json({
        success: false,
        error: 'Quote not found',
      }, 404);
    }
    
    // Check if already converted
    if (quote.status === 'Converted') {
      return c.json({
        success: false,
        error: 'Quote has already been converted to a job',
        converted_job_id: quote.converted_job_id,
      }, 400);
    }
    
    // Validate quote has required data
    if (!quote.pickup_address || !quote.delivery_address) {
      return c.json({
        success: false,
        error: 'Quote must have pickup and delivery addresses to convert to job',
      }, 400);
    }
    
    // Generate job ID and reference
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const job_ref = generateJobRef();
    const now = new Date().toISOString();
    
    // Create job from quote data
    const job: JobRecord = {
      id: jobId,
      job_ref,
      created_at: now,
      updated_at: now,
      status: 'Available',
      source: 'AdminQuoteCalculator',
      quote_id: quoteId,
      service_type_id: quote.service_type_id,
      service_type_name: quote.service_type_name,
      distance_miles: quote.distance_miles,
      crew_size: quote.crew_size,
      pickup_address: quote.pickup_address,
      delivery_address: quote.delivery_address,
      customer_name: quote.customer_name,
      customer_phone: quote.customer_phone,
      customer_email: quote.customer_email,
      items: quote.items,
      extras: quote.extras,
      price_total: quote.total,
      pricing_breakdown: quote.pricing_breakdown,
    };
    
    // Save job
    await kv.set(jobId, job);
    
    // Update quote status
    const updatedQuote = {
      ...quote,
      status: 'Converted' as const,
      converted_job_id: jobId,
      converted_at: now,
      updated_at: now,
    };
    await kv.set(quoteId, updatedQuote);
    
    console.log('✅ Quote converted to job:', quote.quote_ref, '→', job_ref);
    
    return c.json({
      success: true,
      job,
      quote: updatedQuote,
    });
  } catch (error: any) {
    console.error('❌ Error converting quote to job:', error);
    return c.json({
      success: false,
      error: error.message || 'Failed to convert quote to job',
    }, 500);
  }
}

/**
 * PUT /api/jobs/:id - Update job
 */
export async function updateJob(c: Context) {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    const existing = await kv.get(id);
    if (!existing) {
      return c.json({
        success: false,
        error: 'Job not found',
      }, 404);
    }
    
    const updated: JobRecord = {
      ...existing,
      ...body,
      id, // Preserve ID
      job_ref: existing.job_ref, // Preserve reference
      created_at: existing.created_at, // Preserve creation time
      updated_at: new Date().toISOString(),
    };
    
    await kv.set(id, updated);
    
    console.log('✅ Job updated:', updated.job_ref, id);
    
    return c.json({
      success: true,
      job: updated,
    });
  } catch (error: any) {
    console.error('❌ Error updating job:', error);
    return c.json({
      success: false,
      error: error.message || 'Failed to update job',
    }, 500);
  }
}
