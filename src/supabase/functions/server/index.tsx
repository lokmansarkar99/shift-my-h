import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { retryWithBackoff } from "./retryHelper.tsx";
import * as pricingResults from "./pricingResults.ts";
import * as quotes from "./quotes.ts";
import * as jobs from "./jobs.ts";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

const BASE_PATH = "/make-server-94f26792";

// Get Mapbox token from environment (server-side only for API calls)
const getMapboxToken = (): string => {
  const token = Deno.env.get('NEXT_PUBLIC_MAPBOX_TOKEN');
  if (!token) {
    console.error('⚠️ NEXT_PUBLIC_MAPBOX_TOKEN not found in environment variables');
    throw new Error('Mapbox token not configured');
  }
  return token;
};

// Health check endpoint
app.get(`${BASE_PATH}/health`, (c) => {
  return c.json({ status: "ok" });
});

// ================= CONFIG API =================
app.get(`${BASE_PATH}/config`, (c) => {
  try {
    const token = getMapboxToken();
    return c.json({
      mapboxToken: token,
    });
  } catch (error) {
    console.error('Config endpoint error:', error);
    return c.json({ error: 'Mapbox token not configured' }, 500);
  }
});

// Get address lookup API keys (for UK postcode lookup)
app.get(`${BASE_PATH}/api/config/address-lookup`, (c) => {
  try {
    const getAddressKey = Deno.env.get('GETADDRESS_API_KEY') || null;
    
    return c.json({
      getAddressKey: getAddressKey
    });
  } catch (error) {
    console.error('Address lookup config error:', error);
    return c.json({ 
      getAddressKey: null
    }, 200);
  }
});

// ================= QUOTE REFERENCE APIs =================

// Save quote reference to database
app.post(`${BASE_PATH}/save-quote-ref`, async (c) => {
  try {
    const { quoteRef, journeyId, serviceCategory } = await c.req.json();
    
    if (!quoteRef) {
      return c.json({ error: 'Quote reference is required' }, 400);
    }

    // Save to KV store with quote ref as key
    await kv.set(`quote:${quoteRef}`, {
      quoteRef,
      journeyId,
      serviceCategory,
      createdAt: new Date().toISOString(),
    });

    console.log(`✅ Quote reference saved: ${quoteRef}`);

    return c.json({ success: true, quoteRef });
  } catch (error) {
    console.error('Error saving quote reference:', error);
    return c.json({ error: 'Failed to save quote reference' }, 500);
  }
});

// ================= PRICING CONFIG APIs =================

// Get pricing configuration
app.get(`${BASE_PATH}/pricing-config`, async (c) => {
  try {
    const config = await kv.get('pricing_config');
    
    if (!config) {
      // Return empty to let frontend use defaults
      return c.json({ config: null });
    }

    return c.json({ config });
  } catch (error) {
    console.error('Error fetching pricing config:', error);
    return c.json({ error: 'Failed to fetch pricing config' }, 500);
  }
});

// Save pricing configuration (Admin only)
app.post(`${BASE_PATH}/pricing-config`, async (c) => {
  try {
    const { config } = await c.req.json();
    
    if (!config) {
      return c.json({ error: 'Config is required' }, 400);
    }

    // Add timestamp
    config.lastUpdated = new Date().toISOString();

    // Save to KV store
    await kv.set('pricing_config', config);

    console.log('✅ Pricing config saved successfully');

    return c.json({ success: true, config });
  } catch (error) {
    console.error('Error saving pricing config:', error);
    return c.json({ error: 'Failed to save pricing config' }, 500);
  }
});

// ================= DRIVER PRICING CONFIG APIs =================
// Get driver pricing configuration
app.get(`${BASE_PATH}/driver-pricing-config`, async (c) => {
  try {
    const config = await kv.get('driver_pricing_config');
    
    if (!config) {
      return c.json({ config: null });
    }

    return c.json({ config });
  } catch (error) {
    console.error('Error fetching driver pricing config:', error);
    return c.json({ error: 'Failed to fetch driver pricing config' }, 500);
  }
});

// Save driver pricing configuration (Admin only)
app.post(`${BASE_PATH}/driver-pricing-config`, async (c) => {
  try {
    const { config } = await c.req.json();
    
    if (!config) {
      return c.json({ error: 'Config is required' }, 400);
    }

    // Add timestamp
    config.lastUpdated = new Date().toISOString();

    // Save to KV store
    await kv.set('driver_pricing_config', config);

    console.log('✅ Driver pricing config saved successfully');

    return c.json({ success: true, config });
  } catch (error) {
    console.error('Error saving driver pricing config:', error);
    return c.json({ error: 'Failed to save driver pricing config' }, 500);
  }
});

// Calculate extra item price (for driver app)
app.post(`${BASE_PATH}/driver/calculate-extra-items`, async (c) => {
  try {
    const { items, payingCash } = await c.req.json();
    
    if (!items || !Array.isArray(items)) {
      return c.json({ error: 'Items array is required' }, 400);
    }

    // Get driver pricing config
    const config = await kv.get('driver_pricing_config');
    
    // Calculate prices (frontend will use driverPricingEngine.ts for this)
    // This endpoint exists for validation/audit purposes
    
    return c.json({ 
      success: true,
      message: 'Use driverPricingEngine.ts on frontend for calculations'
    });
  } catch (error) {
    console.error('Error calculating extra items:', error);
    return c.json({ error: 'Failed to calculate extra items' }, 500);
  }
});

// Add extra items to existing job (driver updates job on-site)
app.post(`${BASE_PATH}/driver/add-extra-items`, async (c) => {
  try {
    const { jobId, extraItems, totalExtraCharge, paymentMethod, driverId } = await c.req.json();
    
    if (!jobId || !extraItems || !totalExtraCharge) {
      return c.json({ error: 'JobId, extraItems, and totalExtraCharge are required' }, 400);
    }

    // Get existing job
    const job = await kv.get(`job_${jobId}`);
    
    if (!job) {
      return c.json({ error: 'Job not found' }, 404);
    }

    // Update job with extra items
    const updatedJob = {
      ...job,
      extraItemsAddedOnSite: extraItems,
      extraChargeOnSite: totalExtraCharge,
      totalPrice: (job.totalPrice || 0) + totalExtraCharge,
      onSitePaymentMethod: paymentMethod,
      updatedBy: driverId,
      updatedAt: new Date().toISOString(),
    };

    // Save updated job
    await kv.set(`job_${jobId}`, updatedJob);

    console.log(`✅ Extra items added to job ${jobId}: +£${totalExtraCharge}`);

    return c.json({ success: true, job: updatedJob });
  } catch (error) {
    console.error('Error adding extra items to job:', error);
    return c.json({ error: 'Failed to add extra items' }, 500);
  }
});

// ================= MARGIN CONFIG APIs =================

// Get margin configuration
app.get(`${BASE_PATH}/margin-config`, async (c) => {
  try {
    const config = await kv.get('margin_config');
    
    if (!config) {
      // Return default config
      const defaultConfig = {
        type: 'percentage',
        percentageMargin: 30,
        fixedMargin: 15,
        minimumMargin: 10,
        useDriverRateCards: false,
      };
      return c.json(defaultConfig);
    }

    return c.json(config);
  } catch (error) {
    console.error('Error fetching margin config:', error);
    return c.json({ error: 'Failed to fetch margin config' }, 500);
  }
});

// Save margin configuration (Admin only)
app.post(`${BASE_PATH}/margin-config`, async (c) => {
  try {
    const config = await c.req.json();
    
    if (!config || !config.type) {
      return c.json({ error: 'Invalid margin configuration' }, 400);
    }

    // Add timestamp
    config.lastUpdated = new Date().toISOString();

    // Save to KV store
    await kv.set('margin_config', config);

    console.log('✅ Margin configuration saved successfully');

    return c.json({ success: true, config });
  } catch (error) {
    console.error('Error saving margin config:', error);
    return c.json({ error: 'Failed to save margin config' }, 500);
  }
});

// ================= SERVICE TYPES APIs =================
// Get all service types configurations
app.get(`${BASE_PATH}/api/service-types`, async (c) => {
  try {
    const serviceTypes = await kv.get('service_types_config');
    
    if (!serviceTypes) {
      // Return empty array to let frontend use defaults
      return c.json({ serviceTypes: [] });
    }

    return c.json({ serviceTypes });
  } catch (error) {
    console.error('Error fetching service types:', error);
    return c.json({ error: 'Failed to fetch service types' }, 500);
  }
});

// Update all service types configurations
app.put(`${BASE_PATH}/api/service-types`, async (c) => {
  try {
    const { serviceTypes } = await c.req.json();
    
    if (!serviceTypes || !Array.isArray(serviceTypes)) {
      return c.json({ error: 'Service types array is required' }, 400);
    }

    // Add timestamp
    const configWithTimestamp = {
      serviceTypes,
      lastUpdated: new Date().toISOString(),
    };

    // Save to KV store
    await kv.set('service_types_config', serviceTypes);

    console.log(`✅ Service types config saved (${serviceTypes.length} types)`);

    return c.json({ success: true, serviceTypes });
  } catch (error) {
    console.error('Error saving service types:', error);
    return c.json({ error: 'Failed to save service types' }, 500);
  }
});

// Get single service type by ID
app.get(`${BASE_PATH}/api/service-types/:id`, async (c) => {
  try {
    const id = c.req.param('id');
    const serviceTypes = await kv.get('service_types_config');
    
    if (!serviceTypes || !Array.isArray(serviceTypes)) {
      return c.json({ error: 'Service type not found' }, 404);
    }

    const serviceType = serviceTypes.find((st: any) => st.id === id);
    
    if (!serviceType) {
      return c.json({ error: 'Service type not found' }, 404);
    }

    return c.json({ serviceType });
  } catch (error) {
    console.error('Error fetching service type:', error);
    return c.json({ error: 'Failed to fetch service type' }, 500);
  }
});

// ================= EXTRAS CATALOG APIs =================

// Get extras catalog
app.get(`${BASE_PATH}/extras-catalog`, async (c) => {
  try {
    const extras = await kv.get('extras_catalog');
    
    if (!extras) {
      // Return empty array to let frontend use defaults
      return c.json([]);
    }

    return c.json(extras);
  } catch (error) {
    console.error('Error fetching extras catalog:', error);
    return c.json({ error: 'Failed to fetch extras catalog' }, 500);
  }
});

// Update extras catalog (Admin only)
app.post(`${BASE_PATH}/extras-catalog`, async (c) => {
  try {
    const extras = await c.req.json();
    
    if (!extras || !Array.isArray(extras)) {
      return c.json({ error: 'Extras array is required' }, 400);
    }

    // Save to KV store with timestamp
    const dataWithTimestamp = {
      extras,
      lastUpdated: new Date().toISOString(),
    };

    await kv.set('extras_catalog', extras);

    console.log(`✅ Extras catalog saved (${extras.length} items)`);

    return c.json({ success: true, extras });
  } catch (error) {
    console.error('Error saving extras catalog:', error);
    return c.json({ error: 'Failed to save extras catalog' }, 500);
  }
});

// ================= MAPBOX INTEGRATION APIs =================

// Calculate distance and duration between two points using Mapbox Directions API
app.post(`${BASE_PATH}/api/calculate-distance`, async (c) => {
  try {
    const { origin, destination } = await c.req.json();
    
    if (!origin?.lng || !origin?.lat || !destination?.lng || !destination?.lat) {
      return c.json({ error: 'Invalid coordinates provided' }, 400);
    }

    const token = getMapboxToken();
    const coords = `${origin.lng},${origin.lat};${destination.lng},${destination.lat}`;
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coords}?access_token=${token}&geometries=geojson`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (!data.routes || data.routes.length === 0) {
      return c.json({ error: 'No route found' }, 404);
    }

    const route = data.routes[0];
    const distanceMeters = route.distance;
    const durationSeconds = route.duration;

    // Convert to miles and minutes
    const distanceMiles = distanceMeters * 0.000621371;
    const durationMinutes = durationSeconds / 60;

    return c.json({
      success: true,
      distanceMiles: parseFloat(distanceMiles.toFixed(1)),
      durationMinutes: Math.round(durationMinutes),
      geometry: route.geometry,
    });

  } catch (error) {
    console.error('Error calculating distance:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Calculate journey estimate (multi-stop route optimization)
app.post(`${BASE_PATH}/api/journey/estimate`, async (c) => {
  try {
    const { waypoints } = await c.req.json();
    
    if (!waypoints || waypoints.length < 2) {
      return c.json({ error: 'At least 2 waypoints required' }, 400);
    }

    const token = getMapboxToken();
    
    // Build coordinates string
    const coords = waypoints.map((wp: any) => `${wp.lng},${wp.lat}`).join(';');
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coords}?access_token=${token}&geometries=geojson&overview=full`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (!data.routes || data.routes.length === 0) {
      return c.json({ error: 'No route found' }, 404);
    }

    const route = data.routes[0];
    const distanceMeters = route.distance;
    const durationSeconds = route.duration;

    // Convert to miles and minutes
    const distanceMiles = distanceMeters * 0.000621371;
    const durationMinutes = durationSeconds / 60;

    return c.json({
      success: true,
      totalDistanceMiles: parseFloat(distanceMiles.toFixed(1)),
      totalDurationMinutes: Math.round(durationMinutes),
      geometry: route.geometry,
      legs: route.legs.map((leg: any) => ({
        distanceMiles: parseFloat((leg.distance * 0.000621371).toFixed(1)),
        durationMinutes: Math.round(leg.duration / 60),
      })),
    });

  } catch (error) {
    console.error('Error calculating journey estimate:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Driver allocation logic - find nearest available driver
app.post(`${BASE_PATH}/api/allocate-driver`, async (c) => {
  try {
    const { jobLocation, availableDrivers } = await c.req.json();
    
    if (!jobLocation?.lng || !jobLocation?.lat) {
      return c.json({ error: 'Invalid job location' }, 400);
    }

    if (!availableDrivers || availableDrivers.length === 0) {
      return c.json({ error: 'No available drivers' }, 404);
    }

    const token = getMapboxToken();
    
    // Use Mapbox Matrix API to calculate distances from all drivers to job
    const allPoints = [jobLocation, ...availableDrivers.map((d: any) => ({ lng: d.lng, lat: d.lat }))];
    const coords = allPoints.map(p => `${p.lng},${p.lat}`).join(';');
    
    // Source is job (index 0), destinations are drivers (indices 1+)
    const url = `https://api.mapbox.com/directions-matrix/v1/mapbox/driving/${coords}?sources=0&annotations=distance,duration&access_token=${token}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (!data.durations || !data.durations[0]) {
      return c.json({ error: 'Could not calculate driver distances' }, 500);
    }

    // Find nearest driver
    const durations = data.durations[0]; // First row (from job to all drivers)
    const distances = data.distances[0];
    
    let nearestDriverIndex = -1;
    let minDuration = Infinity;
    
    for (let i = 1; i < durations.length; i++) { // Skip index 0 (job to itself)
      if (durations[i] < minDuration) {
        minDuration = durations[i];
        nearestDriverIndex = i - 1; // Adjust for driver array index
      }
    }

    if (nearestDriverIndex === -1) {
      return c.json({ error: 'No suitable driver found' }, 404);
    }

    const nearestDriver = availableDrivers[nearestDriverIndex];
    const etaMinutes = Math.round(durations[nearestDriverIndex + 1] / 60);
    const distanceMiles = parseFloat((distances[nearestDriverIndex + 1] * 0.000621371).toFixed(1));

    return c.json({
      success: true,
      driver: nearestDriver,
      etaMinutes,
      distanceMiles,
    });

  } catch (error) {
    console.error('Error allocating driver:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ================= JOBS API =================

// GET all jobs
app.get(`${BASE_PATH}/jobs`, async (c) => {
  try {
    const jobs = await retryWithBackoff(() => kv.getByPrefix('job:'), {
      maxAttempts: 3,
      initialDelayMs: 100,
      maxDelayMs: 1000
    });
    return c.json(jobs);
  } catch (e) {
    // Silently return empty array if KV store is unavailable (normal in preview mode)
    return c.json([]);
  }
});

// CREATE a job
app.post(`${BASE_PATH}/jobs`, async (c) => {
  try {
    const job = await c.req.json();
    if (!job.id) return c.json({ error: 'Job ID missing' }, 400);
    
    // Save to KV with retry logic
    await retryWithBackoff(() => kv.set(`job:${job.id}`, job), {
      maxAttempts: 3,
      initialDelayMs: 100
    });
    return c.json({ success: true, job });
  } catch (e) {
    console.error("Error creating job:", e);
    return c.json({ error: e.message }, 500);
  }
});

// UPDATE a job (partial update)
app.put(`${BASE_PATH}/jobs/:id`, async (c) => {
  try {
    const id = c.req.param('id');
    const updates = await c.req.json();
    
    // Get existing to merge with retry logic
    const existing = await retryWithBackoff(() => kv.get(`job:${id}`), {
      maxAttempts: 3,
      initialDelayMs: 100
    });
    if (!existing) {
      return c.json({ error: 'Job not found' }, 404);
    }

    const updatedJob = { ...existing, ...updates };
    await retryWithBackoff(() => kv.set(`job:${id}`, updatedJob), {
      maxAttempts: 3,
      initialDelayMs: 100
    });
    
    return c.json({ success: true, job: updatedJob });
  } catch (e) {
    console.error("Error updating job:", e);
    return c.json({ error: e.message }, 500);
  }
});

// DELETE a job
app.delete(`${BASE_PATH}/jobs/:id`, async (c) => {
  try {
    const id = c.req.param('id');
    await retryWithBackoff(() => kv.del(`job:${id}`), {
      maxAttempts: 3,
      initialDelayMs: 100
    });
    return c.json({ success: true });
  } catch (e) {
    console.error("Error deleting job:", e);
    return c.json({ error: e.message }, 500);
  }
});

// ================= SMS NOTIFICATIONS (TWILIO) =================

app.post(`${BASE_PATH}/send-sms`, async (c) => {
  try {
    const { to, message } = await c.req.json();
    
    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const fromNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

    if (!accountSid || !authToken || !fromNumber) {
      console.log(`[MOCK SMS] To: ${to} | Message: ${message}`);
      return c.json({ success: true, mock: true, warning: "Twilio credentials missing" });
    }

    // Call Twilio API
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'To': to,
          'From': fromNumber,
          'Body': message,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Twilio Error:", errorText);
      throw new Error(`Twilio API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return c.json({ success: true, sid: data.sid });

  } catch (e) {
    console.error("Error sending SMS:", e);
    return c.json({ error: e.message }, 500);
  }
});

// ================= INTERESTS API =================
// Manage driver interests separately or as part of job.
// Let's support a separate endpoint for cleaner separation if needed, 
// but modifying the job object is often atomic and safer.
// For now, we assume the frontend updates the job object to include interests.

// ================= PRICING RESULTS API =================

// Save a pricing result (after quote calculation)
app.post(`${BASE_PATH}/pricing-results`, async (c) => {
  try {
    const data = await c.req.json();
    const result = await pricingResults.savePricingResult(data);
    return c.json({ success: true, result });
  } catch (error) {
    console.error('Error saving pricing result:', error);
    return c.json({ error: 'Failed to save pricing result' }, 500);
  }
});

// Get all pricing results
app.get(`${BASE_PATH}/pricing-results`, async (c) => {
  try {
    const results = await pricingResults.getAllPricingResults();
    return c.json({ results });
  } catch (error) {
    console.error('Error fetching pricing results:', error);
    return c.json({ error: 'Failed to fetch pricing results' }, 500);
  }
});

// Get a specific pricing result by ID
app.get(`${BASE_PATH}/pricing-results/:id`, async (c) => {
  try {
    const id = c.req.param('id');
    const result = await pricingResults.getPricingResult(id);
    
    if (!result) {
      return c.json({ error: 'Pricing result not found' }, 404);
    }
    
    return c.json({ result });
  } catch (error) {
    console.error('Error fetching pricing result:', error);
    return c.json({ error: 'Failed to fetch pricing result' }, 500);
  }
});

// Get pricing results by quote ID
app.get(`${BASE_PATH}/pricing-results/by-quote/:quoteId`, async (c) => {
  try {
    const quoteId = c.req.param('quoteId');
    const results = await pricingResults.getPricingResultsByQuoteId(quoteId);
    return c.json({ results });
  } catch (error) {
    console.error('Error fetching pricing results by quote:', error);
    return c.json({ error: 'Failed to fetch pricing results' }, 500);
  }
});

// Delete a pricing result
app.delete(`${BASE_PATH}/pricing-results/:id`, async (c) => {
  try {
    const id = c.req.param('id');
    await pricingResults.deletePricingResult(id);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting pricing result:', error);
    return c.json({ error: 'Failed to delete pricing result' }, 500);
  }
});

// ================= QUOTES API (NEW STRUCTURE) =================

// Get all quotes
app.get(`${BASE_PATH}/api/quotes`, async (c) => quotes.getQuotes(c));

// Get single quote
app.get(`${BASE_PATH}/api/quotes/:id`, async (c) => quotes.getQuote(c));

// Create new quote
app.post(`${BASE_PATH}/api/quotes`, async (c) => quotes.createQuote(c));

// Update quote
app.put(`${BASE_PATH}/api/quotes/:id`, async (c) => quotes.updateQuote(c));

// Delete quote
app.delete(`${BASE_PATH}/api/quotes/:id`, async (c) => quotes.deleteQuote(c));

// ================= JOBS API (NEW STRUCTURE) =================

// Get all jobs (with optional status filter)
app.get(`${BASE_PATH}/api/jobs`, async (c) => jobs.getJobs(c));

// Get single job
app.get(`${BASE_PATH}/api/jobs/:id`, async (c) => jobs.getJob(c));

// Create new job
app.post(`${BASE_PATH}/api/jobs`, async (c) => jobs.createJob(c));

// Convert quote to job
app.post(`${BASE_PATH}/api/jobs/convert-from-quote`, async (c) => jobs.convertQuoteToJob(c));

// Update job
app.put(`${BASE_PATH}/api/jobs/:id`, async (c) => jobs.updateJob(c));

Deno.serve(app.fetch);