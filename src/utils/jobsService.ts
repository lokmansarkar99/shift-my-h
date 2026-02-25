/**
 * Jobs Service
 * Frontend service for managing jobs and quote-to-job conversion
 */

import { projectId, publicAnonKey } from './supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-94f26792`;

export interface JobRecord {
  id: string; // job_xxxxx
  job_ref: string; // JOB-xxxxx
  created_at: string;
  updated_at: string;
  status: 'Available' | 'Assigned' | 'Booked' | 'InProgress' | 'Completed' | 'Cancelled';
  
  // Source tracking
  source: 'AdminQuoteCalculator' | 'CustomerWebsite' | 'PhoneQuote' | 'Manual';
  quote_id?: string;
  
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
 * Get all jobs (with optional status filter)
 */
export async function fetchJobs(status?: string): Promise<JobRecord[]> {
  try {
    const url = status 
      ? `${API_BASE}/api/jobs?status=${status}`
      : `${API_BASE}/api/jobs`;
      
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch jobs: ${response.statusText}`);
    }

    const data = await response.json();
    return data.jobs || [];
  } catch (error) {
    // Silently return empty array if backend fails (normal in preview/development)
    return [];
  }
}

/**
 * Get single job by ID
 */
export async function fetchJob(id: string): Promise<JobRecord | null> {
  try {
    const response = await fetch(`${API_BASE}/api/jobs/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch job: ${response.statusText}`);
    }

    const data = await response.json();
    return data.job;
  } catch (error) {
    console.error('Error fetching job:', error);
    return null;
  }
}

/**
 * Create new job
 */
export async function createJob(job: Partial<JobRecord>): Promise<JobRecord | null> {
  try {
    const response = await fetch(`${API_BASE}/api/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify(job),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create job');
    }

    const data = await response.json();
    return data.job;
  } catch (error) {
    console.error('Error creating job:', error);
    throw error;
  }
}

/**
 * Convert quote to job
 */
export async function convertQuoteToJob(quoteId: string): Promise<{ job: JobRecord; quote: any } | null> {
  try {
    const response = await fetch(`${API_BASE}/api/jobs/convert-from-quote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ quote_id: quoteId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to convert quote to job');
    }

    const data = await response.json();
    return { job: data.job, quote: data.quote };
  } catch (error) {
    console.error('Error converting quote to job:', error);
    throw error;
  }
}

/**
 * Update existing job
 */
export async function updateJob(id: string, updates: Partial<JobRecord>): Promise<JobRecord | null> {
  try {
    const response = await fetch(`${API_BASE}/api/jobs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update job');
    }

    const data = await response.json();
    return data.job;
  } catch (error) {
    console.error('Error updating job:', error);
    throw error;
  }
}