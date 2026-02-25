import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {
  MapPin, Truck, Package, RefreshCw, XCircle, Save, Navigation, Users, Clock, 
  TrendingUp, Activity, Phone, Star, CheckCircle
} from 'lucide-react';
import { MAPBOX_PUBLIC_TOKEN } from '../../utils/mapboxConfig';

interface Driver {
  id: string;
  name: string;
  status: 'available' | 'busy' | 'offline';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  currentJobs: number;
  rating: number;
  vehicle: string;
  phone: string;
  lastUpdate: Date;
}

interface JobLocation {
  id: string;
  customerName: string;
  pickupAddress: string;
  pickupLocation: {
    lat: number;
    lng: number;
  };
  status: 'pending' | 'assigned' | 'in-progress';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  value: number;
}

// Mock data
const mockDrivers: Driver[] = [
  {
    id: 'DRV001', name: 'John Smith', status: 'available',
    location: { lat: 51.5074, lng: -0.1278, address: 'Central London' },
    currentJobs: 0, rating: 4.8, vehicle: 'Large Van', phone: '+44 7700 900123', lastUpdate: new Date()
  },
  {
    id: 'DRV002', name: 'Maria Garcia', status: 'available',
    location: { lat: 51.5155, lng: -0.1419, address: 'Westminster' },
    currentJobs: 0, rating: 4.9, vehicle: 'Luton Van', phone: '+44 7700 900124', lastUpdate: new Date()
  },
  {
    id: 'DRV003', name: 'Ahmed Hassan', status: 'busy',
    location: { lat: 51.4975, lng: -0.1357, address: 'Southwark' },
    currentJobs: 1, rating: 4.7, vehicle: 'Medium Van', phone: '+44 7700 900125', lastUpdate: new Date()
  },
];

const mockJobs: JobLocation[] = [
  {
    id: 'JOB001', customerName: 'Alice Brown', pickupAddress: '123 Oxford Street',
    pickupLocation: { lat: 51.5154, lng: -0.1419 }, status: 'pending', priority: 'urgent', value: 450
  },
  {
    id: 'JOB002', customerName: 'Bob Wilson', pickupAddress: '789 Camden High Street',
    pickupLocation: { lat: 51.5392, lng: -0.1426 }, status: 'pending', priority: 'high', value: 380
  },
];

export function FleetMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [drivers, setDrivers] = useState<Driver[]>(mockDrivers);
  const [jobs, setJobs] = useState<JobLocation[]>(mockJobs);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobLocation | null>(null);
  
  const [showDrivers, setShowDrivers] = useState(true);
  const [showJobs, setShowJobs] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tokenInput, setTokenInput] = useState('');

  // Helper to get token
  const getMapboxToken = () => {
    // 1. Try env var
    const envToken = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_MAPBOX_TOKEN) || 
                     (typeof import.meta !== 'undefined' && (import.meta as any).env?.NEXT_PUBLIC_MAPBOX_TOKEN);
    
    // 2. Try localStorage
    const localToken = typeof window !== 'undefined' ? localStorage.getItem('mapbox_token') : null;

    // 3. Use hardcoded token as final fallback
    return envToken || localToken || MAPBOX_PUBLIC_TOKEN;
  };

  const handleSaveToken = () => {
    if (tokenInput.trim()) {
      localStorage.setItem('mapbox_token', tokenInput.trim());
      window.location.reload();
    }
  };

  // Initialize Map
  useEffect(() => {
    const token = getMapboxToken();
                  
    if (!token) {
      setError("Missing Mapbox Token");
      return;
    }
    if (map.current) return;

    mapboxgl.accessToken = token;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current!,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-0.1278, 51.5074],
        zoom: 11
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
    } catch (err) {
      console.error("Map init error:", err);
      setError("Failed to initialize map");
    }

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update Markers
  useEffect(() => {
    if (!map.current) return;
    // Effect logic handled by marker refresh below
  }, [drivers, jobs, showDrivers, showJobs]);
  
  // Ref for markers to clear them
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!map.current) return;

    // Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Add Drivers
    if (showDrivers) {
      drivers.forEach(driver => {
        const el = document.createElement('div');
        el.className = 'w-8 h-8 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center';
        el.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M10 17h4v5h-4z"/><path d="M20 17h2v5h-2z"/><path d="M15 17h2v5h-2z"/><rect x="2" y="5" width="20" height="12" rx="2"/></svg>'; // Truck iconish
        
        // Color based on status
        if (driver.status === 'busy') el.style.backgroundColor = '#eab308';
        if (driver.status === 'offline') el.style.backgroundColor = '#94a3b8';

        const marker = new mapboxgl.Marker(el)
          .setLngLat([driver.location.lng, driver.location.lat])
          .setPopup(new mapboxgl.Popup().setHTML(`
            <div class="p-2">
              <div class="font-bold">${driver.name}</div>
              <div class="text-xs text-gray-500">${driver.status}</div>
              <div class="text-xs mt-1">${driver.vehicle}</div>
            </div>
          `))
          .addTo(map.current!);
        
        // Add click listener workaround via element
        el.addEventListener('click', () => setSelectedDriver(driver));
        
        markersRef.current.push(marker);
      });
    }

    // Add Jobs
    if (showJobs) {
      jobs.forEach(job => {
        const el = document.createElement('div');
        el.className = 'w-8 h-8 bg-purple-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center';
        el.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>'; // Package iconish

        if (job.priority === 'urgent') el.style.backgroundColor = '#ef4444';

        const marker = new mapboxgl.Marker(el)
          .setLngLat([job.pickupLocation.lng, job.pickupLocation.lat])
          .setPopup(new mapboxgl.Popup().setHTML(`
            <div class="p-2">
              <div class="font-bold">${job.id}</div>
              <div class="text-xs text-gray-500">${job.priority}</div>
              <div class="text-xs mt-1">${job.pickupAddress}</div>
            </div>
          `))
          .addTo(map.current!);

        el.addEventListener('click', () => setSelectedJob(job));

        markersRef.current.push(marker);
      });
    }

  }, [drivers, jobs, showDrivers, showJobs]);

  // Auto Refresh Simulation
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      setDrivers(prev => prev.map(d => ({
        ...d,
        location: {
          ...d.location,
          lat: d.location.lat + (Math.random() - 0.5) * 0.001,
          lng: d.location.lng + (Math.random() - 0.5) * 0.001
        }
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center text-red-600">
        <h3 className="font-bold text-lg mb-2">Map Error</h3>
        <p>{error}</p>
        <p className="text-sm mt-2 text-red-500 mb-4">Please ensure NEXT_PUBLIC_MAPBOX_TOKEN is set in your environment.</p>
        
        <div className="max-w-md mx-auto bg-white p-4 rounded-lg shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Manual Token Entry (Fallback)</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="pk.eyJ1..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <button 
              onClick={handleSaveToken}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-left">This will save to your browser's local storage.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Simplified Header with Better Contrast */}
      <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-500 p-6 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-50" />
        
        <div className="relative z-10 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-4 rounded-xl shadow-md">
              <Navigation className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-3xl">Live Fleet Map</h2>
              <p className="text-slate-600 text-base mt-1">Real-time driver and job tracking</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => setShowDrivers(!showDrivers)}
              className={`px-5 py-3 rounded-xl text-base font-bold flex items-center gap-3 transition-all duration-300 shadow-md ${
                showDrivers 
                  ? 'bg-blue-600 text-white scale-105 shadow-lg' 
                  : 'bg-white text-slate-700 border-2 border-slate-300 hover:border-blue-500'
              }`}
            >
              <Truck className="w-5 h-5" /> 
              Drivers
              <span className={`px-2.5 py-1 rounded-lg text-sm font-bold ${
                showDrivers ? 'bg-white/30' : 'bg-blue-100 text-blue-700'
              }`}>
                {drivers.length}
              </span>
            </button>
            
            <button 
              onClick={() => setShowJobs(!showJobs)}
              className={`px-5 py-3 rounded-xl text-base font-bold flex items-center gap-3 transition-all duration-300 shadow-md ${
                showJobs 
                  ? 'bg-purple-600 text-white scale-105 shadow-lg' 
                  : 'bg-white text-slate-700 border-2 border-slate-300 hover:border-purple-500'
              }`}
            >
              <Package className="w-5 h-5" /> 
              Jobs
              <span className={`px-2.5 py-1 rounded-lg text-sm font-bold ${
                showJobs ? 'bg-white/30' : 'bg-purple-100 text-purple-700'
              }`}>
                {jobs.length}
              </span>
            </button>
            
            <button 
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-5 py-3 rounded-xl text-base font-bold flex items-center gap-3 transition-all duration-300 shadow-md ${
                autoRefresh 
                  ? 'bg-emerald-600 text-white scale-105 shadow-lg' 
                  : 'bg-white text-slate-700 border-2 border-slate-300 hover:border-emerald-500'
              }`}
            >
              <Activity className={`w-5 h-5 ${autoRefresh ? 'animate-pulse' : ''}`} /> 
              {autoRefresh ? 'Live' : 'Paused'}
            </button>
          </div>
        </div>
      </div>

      {/* Clearer Stats Grid with Icons */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border-2 border-blue-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-blue-100 p-3 rounded-xl">
              <Truck className="w-7 h-7 text-blue-600" />
            </div>
            <span className="text-4xl font-black text-blue-600">
              {drivers.filter(d => d.status === 'available').length}
            </span>
          </div>
          <p className="text-slate-600 font-semibold text-base">Available Drivers</p>
          <p className="text-slate-400 text-sm mt-1">Ready for new jobs</p>
        </div>

        <div className="bg-white border-2 border-amber-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-amber-100 p-3 rounded-xl">
              <Clock className="w-7 h-7 text-amber-600" />
            </div>
            <span className="text-4xl font-black text-amber-600">
              {drivers.filter(d => d.status === 'busy').length}
            </span>
          </div>
          <p className="text-slate-600 font-semibold text-base">Busy Drivers</p>
          <p className="text-slate-400 text-sm mt-1">Currently on delivery</p>
        </div>

        <div className="bg-white border-2 border-purple-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-purple-100 p-3 rounded-xl">
              <Package className="w-7 h-7 text-purple-600" />
            </div>
            <span className="text-4xl font-black text-purple-600">
              {jobs.length}
            </span>
          </div>
          <p className="text-slate-600 font-semibold text-base">Active Jobs</p>
          <p className="text-slate-400 text-sm mt-1">Waiting for pickup</p>
        </div>

        <div className="bg-white border-2 border-emerald-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-emerald-100 p-3 rounded-xl">
              <TrendingUp className="w-7 h-7 text-emerald-600" />
            </div>
            <span className="text-4xl font-black text-emerald-600">
              {Math.round((drivers.filter(d => d.status === 'busy').length / drivers.length) * 100)}%
            </span>
          </div>
          <p className="text-slate-600 font-semibold text-base">Fleet Utilization</p>
          <p className="text-slate-400 text-sm mt-1">Current efficiency</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map with Clear Legend */}
        <div className="lg:col-span-3 h-[700px] bg-slate-50 rounded-2xl overflow-hidden relative shadow-xl border-2 border-slate-300">
           <div ref={mapContainer} className="w-full h-full" />
           
           {/* Color Map Overlay - Hidden when real Mapbox loads */}
           {!mapContainer.current && (
             <div className="absolute inset-0 w-full h-full">
               <svg className="w-full h-full" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice">
                 <defs>
                   <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                     <stop offset="0%" style={{ stopColor: '#e0f2fe', stopOpacity: 1 }} />
                     <stop offset="100%" style={{ stopColor: '#bae6fd', stopOpacity: 1 }} />
                   </linearGradient>
                   <pattern id="waterPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                     <rect width="40" height="40" fill="#93c5fd" opacity="0.3"/>
                     <path d="M0 20 Q10 15 20 20 T40 20" stroke="#60a5fa" strokeWidth="1" fill="none" opacity="0.5"/>
                   </pattern>
                   <filter id="dropShadow">
                     <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                     <feOffset dx="2" dy="2" result="offsetblur"/>
                     <feComponentTransfer>
                       <feFuncA type="linear" slope="0.3"/>
                     </feComponentTransfer>
                     <feMerge>
                       <feMergeNode/>
                       <feMergeNode in="SourceGraphic"/>
                     </feMerge>
                   </filter>
                 </defs>
                 
                 {/* Sky background */}
                 <rect width="1200" height="700" fill="url(#skyGradient)"/>
                 
                 {/* Land areas */}
                 <path d="M0 150 Q200 100 400 150 T800 150 Q1000 180 1200 150 L1200 700 L0 700 Z" fill="#bbf7d0" opacity="0.6"/>
                 <path d="M0 200 Q300 180 500 220 T900 200 L1200 220 L1200 700 L0 700 Z" fill="#86efac" opacity="0.5"/>
                 <path d="M0 280 Q250 250 450 280 T850 260 L1200 280 L1200 700 L0 700 Z" fill="#4ade80" opacity="0.4"/>
                 
                 {/* Water bodies */}
                 <ellipse cx="200" cy="400" rx="120" ry="80" fill="url(#waterPattern)" stroke="#3b82f6" strokeWidth="2"/>
                 <ellipse cx="900" cy="500" rx="150" ry="90" fill="url(#waterPattern)" stroke="#3b82f6" strokeWidth="2"/>
                 
                 {/* Parks/Green spaces */}
                 <circle cx="350" cy="250" r="60" fill="#22c55e" opacity="0.3" filter="url(#dropShadow)"/>
                 <circle cx="700" cy="350" r="80" fill="#22c55e" opacity="0.3" filter="url(#dropShadow)"/>
                 <rect x="500" y="180" width="100" height="70" rx="10" fill="#22c55e" opacity="0.3" filter="url(#dropShadow)"/>
                 
                 {/* Roads */}
                 <path d="M0 300 Q300 280 600 300 T1200 300" stroke="#fbbf24" strokeWidth="8" fill="none" opacity="0.6"/>
                 <path d="M0 450 L1200 450" stroke="#fbbf24" strokeWidth="8" fill="none" opacity="0.6"/>
                 <path d="M400 0 L400 700" stroke="#fbbf24" strokeWidth="6" fill="none" opacity="0.6"/>
                 <path d="M800 0 L800 700" stroke="#fbbf24" strokeWidth="6" fill="none" opacity="0.6"/>
                 
                 {/* Road markings */}
                 <path d="M0 300 Q300 280 600 300 T1200 300" stroke="#ffffff" strokeWidth="2" strokeDasharray="20,15" fill="none" opacity="0.8"/>
                 <path d="M0 450 L1200 450" stroke="#ffffff" strokeWidth="2" strokeDasharray="20,15" fill="none" opacity="0.8"/>
                 
                 {/* Buildings */}
                 <g opacity="0.7">
                   <rect x="250" y="350" width="60" height="80" fill="#f97316" filter="url(#dropShadow)"/>
                   <polygon points="250,350 280,320 310,350" fill="#ea580c"/>
                   
                   <rect x="550" y="400" width="70" height="100" fill="#3b82f6" filter="url(#dropShadow)"/>
                   <polygon points="550,400 585,370 620,400" fill="#2563eb"/>
                   
                   <rect x="950" y="320" width="80" height="90" fill="#8b5cf6" filter="url(#dropShadow)"/>
                   <polygon points="950,320 990,290 1030,320" fill="#7c3aed"/>
                   
                   <rect x="150" y="550" width="50" height="70" fill="#ec4899" filter="url(#dropShadow)"/>
                   <polygon points="150,550 175,530 200,550" fill="#db2777"/>
                   
                   <rect x="750" y="580" width="65" height="85" fill="#10b981" filter="url(#dropShadow)"/>
                   <polygon points="750,580 782.5,555 815,580" fill="#059669"/>
                 </g>
                 
                 {/* Trees */}
                 <g opacity="0.6">
                   <circle cx="420" cy="260" r="15" fill="#16a34a"/>
                   <rect x="415" y="270" width="10" height="20" fill="#92400e"/>
                   
                   <circle cx="680" cy="320" r="20" fill="#16a34a"/>
                   <rect x="673" y="335" width="14" height="25" fill="#92400e"/>
                   
                   <circle cx="320" cy="480" r="18" fill="#16a34a"/>
                   <rect x="314" y="493" width="12" height="22" fill="#92400e"/>
                 </g>
                 
                 {/* City labels */}
                 <text x="280" y="420" fontSize="16" fill="#1f2937" fontWeight="bold" filter="url(#dropShadow)">Birmingham</text>
                 <text x="585" y="470" fontSize="16" fill="#1f2937" fontWeight="bold" filter="url(#dropShadow)">Manchester</text>
                 <text x="980" y="390" fontSize="16" fill="#1f2937" fontWeight="bold" filter="url(#dropShadow)">Leeds</text>
               </svg>
             </div>
           )}
           
           {/* Improved Legend with Better Visibility */}
           <div className="absolute top-6 left-6 bg-white rounded-2xl shadow-2xl border-2 border-slate-300 overflow-hidden min-w-[220px]">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3">
                <div className="font-bold text-white text-base flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Map Legend
                </div>
              </div>
              
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
                  <div className="w-6 h-6 bg-blue-500 rounded-full shadow-md flex-shrink-0 border-2 border-white"></div> 
                  <div>
                    <p className="text-slate-900 font-bold text-sm">Available</p>
                    <p className="text-slate-500 text-xs">Ready drivers</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-amber-50 transition-colors cursor-pointer">
                  <div className="w-6 h-6 bg-amber-500 rounded-full shadow-md flex-shrink-0 border-2 border-white"></div> 
                  <div>
                    <p className="text-slate-900 font-bold text-sm">Busy</p>
                    <p className="text-slate-500 text-xs">On delivery</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="w-6 h-6 bg-slate-400 rounded-full shadow-md flex-shrink-0 border-2 border-white"></div> 
                  <div>
                    <p className="text-slate-900 font-bold text-sm">Offline</p>
                    <p className="text-slate-500 text-xs">Not available</p>
                  </div>
                </div>
                
                <div className="border-t-2 border-slate-200 my-2 pt-3"></div>
                
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer">
                  <div className="w-6 h-6 bg-purple-500 rounded-full shadow-md flex-shrink-0 border-2 border-white"></div> 
                  <div>
                    <p className="text-slate-900 font-bold text-sm">Job</p>
                    <p className="text-slate-500 text-xs">Pending job</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-red-50 transition-colors cursor-pointer">
                  <div className="w-6 h-6 bg-red-500 rounded-full shadow-md flex-shrink-0 border-2 border-white"></div> 
                  <div>
                    <p className="text-slate-900 font-bold text-sm">Urgent</p>
                    <p className="text-slate-500 text-xs">High priority</p>
                  </div>
                </div>
              </div>
           </div>

           {/* Live Update Indicator - More Prominent */}
           {autoRefresh && (
             <div className="absolute bottom-6 left-6 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-base font-bold border-2 border-emerald-400">
               <div className="relative">
                 <div className="w-3 h-3 bg-white rounded-full"></div>
                 <div className="absolute inset-0 w-3 h-3 bg-white rounded-full animate-ping"></div>
               </div>
               Updating Live
             </div>
           )}
        </div>

        {/* Clearer Sidebar Info */}
        <div className="space-y-4 h-[700px] overflow-y-auto pr-2 custom-scrollbar">
          {selectedDriver ? (
            <div className="bg-white border-2 border-blue-500 rounded-2xl shadow-xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 relative">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl">
                      <Truck className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-xl">Driver Details</h3>
                      <p className="text-blue-100 text-sm font-medium">{selectedDriver.id}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedDriver(null)}
                    className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
                  >
                    <XCircle className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>

              {/* Body with Clear Sections */}
              <div className="p-5 space-y-4">
                <div className="bg-slate-50 rounded-xl p-4 border-2 border-slate-200">
                  <p className="text-slate-500 text-sm font-semibold mb-2">DRIVER NAME</p>
                  <p className="font-bold text-slate-900 text-2xl">{selectedDriver.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-xl p-4 border-2 border-slate-200">
                    <p className="text-slate-500 text-xs font-semibold mb-2">STATUS</p>
                    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold ${
                      selectedDriver.status === 'available' ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-300' :
                      selectedDriver.status === 'busy' ? 'bg-amber-100 text-amber-700 border-2 border-amber-300' : 
                      'bg-slate-100 text-slate-700 border-2 border-slate-300'
                    }`}>
                      <div className={`w-3 h-3 rounded-full ${
                        selectedDriver.status === 'available' ? 'bg-emerald-500' :
                        selectedDriver.status === 'busy' ? 'bg-amber-500' : 'bg-slate-500'
                      } animate-pulse`}></div>
                      {selectedDriver.status.toUpperCase()}
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4 border-2 border-slate-200">
                    <p className="text-slate-500 text-xs font-semibold mb-2">RATING</p>
                    <div className="flex items-center gap-2">
                      <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-slate-900 text-xl">{selectedDriver.rating}</span>
                      <span className="text-slate-400 text-sm">/5.0</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border-2 border-slate-200">
                  <p className="text-slate-500 text-xs font-semibold mb-2">VEHICLE</p>
                  <p className="font-bold text-slate-900 text-base">{selectedDriver.vehicle}</p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border-2 border-slate-200">
                  <p className="text-slate-500 text-xs font-semibold mb-2">CURRENT LOCATION</p>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                    <p className="font-semibold text-slate-900 text-base">{selectedDriver.location.address}</p>
                  </div>
                </div>

                <a 
                  href={`tel:${selectedDriver.phone}`}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-base flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl"
                >
                  <Phone className="w-6 h-6" />
                  Call {selectedDriver.name}
                </a>

                <div className="text-center pt-3 border-t-2 border-slate-200">
                  <p className="text-slate-400 text-sm font-medium">
                    Last updated: <span className="text-slate-600 font-bold">{selectedDriver.lastUpdate.toLocaleTimeString()}</span>
                  </p>
                </div>
              </div>
            </div>
          ) : selectedJob ? (
            <div className="bg-white border-2 border-purple-500 rounded-2xl shadow-xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-5 relative">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl">
                      <Package className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-xl">Job Details</h3>
                      <p className="text-purple-100 text-sm font-medium">{selectedJob.id}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedJob(null)}
                    className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
                  >
                    <XCircle className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>

              {/* Body with Clear Sections */}
              <div className="p-5 space-y-4">
                <div className="bg-slate-50 rounded-xl p-4 border-2 border-slate-200">
                  <p className="text-slate-500 text-sm font-semibold mb-2">CUSTOMER</p>
                  <p className="font-bold text-slate-900 text-2xl">{selectedJob.customerName}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-xl p-4 border-2 border-slate-200">
                    <p className="text-slate-500 text-xs font-semibold mb-2">PRIORITY</p>
                    <div className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-bold ${
                      selectedJob.priority === 'urgent' ? 'bg-red-100 text-red-700 border-2 border-red-300' :
                      selectedJob.priority === 'high' ? 'bg-orange-100 text-orange-700 border-2 border-orange-300' : 
                      'bg-blue-100 text-blue-700 border-2 border-blue-300'
                    }`}>
                      {selectedJob.priority.toUpperCase()}
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4 border-2 border-slate-200">
                    <p className="text-slate-500 text-xs font-semibold mb-2">VALUE</p>
                    <p className="font-bold text-slate-900 text-xl">£{selectedJob.value}</p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border-2 border-slate-200">
                  <p className="text-slate-500 text-xs font-semibold mb-2">STATUS</p>
                  <p className="font-bold text-slate-900 text-base capitalize">{selectedJob.status}</p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border-2 border-slate-200">
                  <p className="text-slate-500 text-xs font-semibold mb-2">PICKUP ADDRESS</p>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                    <p className="font-semibold text-slate-900 text-base">{selectedJob.pickupAddress}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border-2 border-dashed border-slate-300 rounded-2xl p-10 text-center h-full flex flex-col items-center justify-center">
              <div className="bg-slate-100 p-6 rounded-full mb-5">
                <MapPin className="w-16 h-16 text-slate-400" />
              </div>
              <p className="text-slate-700 font-bold text-xl mb-2">No Selection</p>
              <p className="text-slate-500 text-base max-w-xs">Click on any driver or job marker on the map to view detailed information</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #94a3b8;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
      `}</style>
    </div>
  );
}