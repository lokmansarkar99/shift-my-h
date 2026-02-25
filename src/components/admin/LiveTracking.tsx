import React, { useState, useEffect } from 'react';
import { 
  Navigation, MapPin, Phone, Clock, Package, User, Truck, CheckCircle, AlertCircle, 
  Play, Pause, Activity, TrendingUp, Zap, Radio
} from 'lucide-react';

interface ActiveJob {
  id: string;
  bookingNumber: string;
  driver: {
    name: string;
    phone: string;
    vehicle: string;
  };
  customer: {
    name: string;
    phone: string;
  };
  pickup: {
    address: string;
    postcode: string;
    lat: number;
    lng: number;
  };
  delivery: {
    address: string;
    postcode: string;
    lat: number;
    lng: number;
  };
  status: 'picked-up' | 'in-transit' | 'near-delivery' | 'delivered';
  currentLocation: {
    lat: number;
    lng: number;
  };
  eta: string;
  distance: number;
  completedDistance: number;
}

export function LiveTracking() {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(true);

  // Mock active jobs with GPS coordinates
  const [activeJobs] = useState<ActiveJob[]>([
    {
      id: '1',
      bookingNumber: 'SMH-1002',
      driver: { name: 'Mike Johnson', phone: '07700 900111', vehicle: 'Large Van - AB12 CDE' },
      customer: { name: 'Emma Wilson', phone: '07700 900456' },
      pickup: { address: 'Birmingham B1 1AA', postcode: 'B1 1AA', lat: 52.4862, lng: -1.8904 },
      delivery: { address: 'Leeds LS1 1AA', postcode: 'LS1 1AA', lat: 53.7997, lng: -1.5492 },
      status: 'in-transit',
      currentLocation: { lat: 53.1424, lng: -1.6724 }, // Somewhere between
      eta: '14:30',
      distance: 120,
      completedDistance: 65,
    },
    {
      id: '2',
      bookingNumber: 'SMH-1003',
      driver: { name: 'Sarah Davis', phone: '07700 900222', vehicle: 'Medium Van - FG34 HIJ' },
      customer: { name: 'David Brown', phone: '07700 900789' },
      pickup: { address: 'London SW1A 1AA', postcode: 'SW1A 1AA', lat: 51.5014, lng: -0.1419 },
      delivery: { address: 'Oxford OX1 1AA', postcode: 'OX1 1AA', lat: 51.7520, lng: -1.2577 },
      status: 'picked-up',
      currentLocation: { lat: 51.5014, lng: -0.1419 },
      eta: '11:45',
      distance: 60,
      completedDistance: 5,
    },
    {
      id: '3',
      bookingNumber: 'SMH-1005',
      driver: { name: 'Tom Wilson', phone: '07700 900333', vehicle: 'Luton Van - KL56 MNO' },
      customer: { name: 'Lisa Anderson', phone: '07700 900321' },
      pickup: { address: 'Bristol BS1 1AA', postcode: 'BS1 1AA', lat: 51.4545, lng: -2.5879 },
      delivery: { address: 'Cardiff CF10 1AA', postcode: 'CF10 1AA', lat: 51.4816, lng: -3.1791 },
      status: 'near-delivery',
      currentLocation: { lat: 51.4780, lng: -3.1500 },
      eta: '10:15',
      distance: 45,
      completedDistance: 42,
    },
  ]);

  const statusConfig = {
    'picked-up': { label: 'Picked Up', color: 'bg-blue-100 text-blue-700', icon: '📦' },
    'in-transit': { label: 'In Transit', color: 'bg-purple-100 text-purple-700', icon: '🚚' },
    'near-delivery': { label: 'Near Delivery', color: 'bg-orange-100 text-orange-700', icon: '📍' },
    'delivered': { label: 'Delivered', color: 'bg-green-100 text-green-700', icon: '✅' },
  };

  const job = selectedJob ? activeJobs.find(j => j.id === selectedJob) : activeJobs[0];

  // Simulate GPS updates
  useEffect(() => {
    if (!isLive || !job) return;

    const interval = setInterval(() => {
      // In production, this would fetch real GPS data from backend
      console.log('Updating GPS location...');
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive, job]);

  return (
    <div className="space-y-6">
      {/* Simplified Header with Better Contrast */}
      <div className="bg-white rounded-2xl shadow-lg border-2 border-purple-500 p-6 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-pink-50 opacity-50" />
        
        <div className="relative z-10 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-purple-600 p-4 rounded-xl shadow-md">
              <Radio className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-3xl">Live GPS Tracking</h2>
              <p className="text-slate-600 text-base mt-1">Real-time monitoring of active deliveries</p>
            </div>
          </div>

          <button
            onClick={() => setIsLive(!isLive)}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 font-bold text-base shadow-md ${
              isLive
                ? 'bg-emerald-600 text-white scale-105 shadow-lg'
                : 'bg-white text-slate-700 border-2 border-slate-300 hover:border-emerald-500'
            }`}
          >
            {isLive ? <Activity className="w-6 h-6 animate-pulse" /> : <Play className="w-6 h-6" />}
            {isLive ? 'Live Updates ON' : 'Live Updates OFF'}
          </button>
        </div>
      </div>

      {/* Clearer Stats Grid */}
      <div className="grid sm:grid-cols-4 gap-5">
        <div className="bg-white border-2 border-blue-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-blue-100 p-3 rounded-xl">
              <Truck className="w-7 h-7 text-blue-600" />
            </div>
            <span className="text-4xl font-black text-blue-600">{activeJobs.length}</span>
          </div>
          <p className="text-slate-600 font-semibold text-base">Active Jobs</p>
          <p className="text-slate-400 text-sm mt-1">Currently in progress</p>
        </div>
        
        <div className="bg-white border-2 border-purple-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-purple-100 p-3 rounded-xl">
              <Navigation className="w-7 h-7 text-purple-600" />
            </div>
            <span className="text-4xl font-black text-purple-600">
              {activeJobs.filter(j => j.status === 'in-transit').length}
            </span>
          </div>
          <p className="text-slate-600 font-semibold text-base">In Transit</p>
          <p className="text-slate-400 text-sm mt-1">On the way</p>
        </div>
        
        <div className="bg-white border-2 border-orange-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-orange-100 p-3 rounded-xl">
              <MapPin className="w-7 h-7 text-orange-600" />
            </div>
            <span className="text-4xl font-black text-orange-600">
              {activeJobs.filter(j => j.status === 'near-delivery').length}
            </span>
          </div>
          <p className="text-slate-600 font-semibold text-base">Near Delivery</p>
          <p className="text-slate-400 text-sm mt-1">Almost there</p>
        </div>
        
        <div className="bg-white border-2 border-emerald-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-emerald-100 p-3 rounded-xl">
              <Zap className="w-7 h-7 text-emerald-600" />
            </div>
            <span className="text-4xl font-black text-emerald-600">25</span>
          </div>
          <p className="text-slate-600 font-semibold text-base">Avg ETA</p>
          <p className="text-slate-400 text-sm mt-1">Minutes remaining</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Active Jobs List with Clear Organization */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border-2 border-slate-300 rounded-xl p-4 shadow-md">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Active Deliveries</h3>
              <span className="bg-purple-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold">
                {activeJobs.length}
              </span>
            </div>
          </div>
          
          <div className="space-y-3 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
            {activeJobs.map((jobItem) => (
              <button
                key={jobItem.id}
                onClick={() => setSelectedJob(jobItem.id)}
                className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 shadow-md ${
                  selectedJob === jobItem.id || (!selectedJob && jobItem.id === activeJobs[0].id)
                    ? 'border-purple-600 bg-purple-50 shadow-xl scale-105'
                    : 'border-slate-300 bg-white hover:border-purple-400 hover:shadow-lg'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="font-bold text-slate-900 text-xl mb-1">{jobItem.bookingNumber}</div>
                    <div className="text-base text-slate-600 flex items-center gap-2">
                      <Truck className="w-4 h-4" />
                      {jobItem.driver.name}
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-xl text-sm font-bold shadow-sm border-2 ${
                    statusConfig[jobItem.status].color.includes('blue') ? 'bg-blue-100 text-blue-700 border-blue-300' :
                    statusConfig[jobItem.status].color.includes('purple') ? 'bg-purple-100 text-purple-700 border-purple-300' :
                    statusConfig[jobItem.status].color.includes('orange') ? 'bg-orange-100 text-orange-700 border-orange-300' :
                    'bg-green-100 text-green-700 border-green-300'
                  }`}>
                    {statusConfig[jobItem.status].icon} {statusConfig[jobItem.status].label}
                  </span>
                </div>

                <div className="space-y-3 text-base mb-4">
                  <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <MapPin className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-semibold">DESTINATION</p>
                      <p className="font-bold text-slate-900">{jobItem.delivery.postcode}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <Clock className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-semibold">ESTIMATED ARRIVAL</p>
                      <p className="font-bold text-slate-900">{jobItem.eta}</p>
                    </div>
                  </div>
                </div>

                {/* Enhanced Progress Bar with Clear Labels */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                  <div className="flex justify-between text-sm text-slate-600 mb-2 font-bold">
                    <span>{jobItem.completedDistance}mi completed</span>
                    <span>{Math.round((jobItem.completedDistance / jobItem.distance) * 100)}%</span>
                  </div>
                  <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden shadow-inner border border-slate-300">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500"
                      style={{ width: `${(jobItem.completedDistance / jobItem.distance) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-slate-500 mt-2 font-semibold text-center">
                    {jobItem.distance - jobItem.completedDistance}mi remaining
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Map & Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Live Map with Clear Header */}
          <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-300 overflow-hidden">
            <div className="bg-white p-5 border-b-2 border-slate-300 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-purple-600 p-3 rounded-xl">
                  <Navigation className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-xl">Live Route Map</h3>
                  <p className="text-slate-600 text-sm font-medium">{job?.bookingNumber}</p>
                </div>
              </div>
              
              {isLive && (
                <div className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl shadow-md border-2 border-emerald-400">
                  <div className="relative">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                    <div className="absolute inset-0 w-3 h-3 bg-white rounded-full animate-ping"></div>
                  </div>
                  <span className="text-sm font-bold">Tracking Live</span>
                </div>
              )}
            </div>

            {/* Interactive Map */}
            <div className="relative w-full h-96 bg-gradient-to-br from-slate-50 to-slate-100">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 400">
                {/* Background grid */}
                <defs>
                  <pattern id="liveGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#cbd5e1" strokeWidth="1" opacity="0.3" />
                  </pattern>
                  <linearGradient id="routeLive" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
                    <stop offset="50%" style={{ stopColor: '#ec4899', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#10b981', stopOpacity: 1 }} />
                  </linearGradient>
                  <linearGradient id="skyGradientLive" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#ddd6fe', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#fbcfe8', stopOpacity: 1 }} />
                  </linearGradient>
                  <pattern id="waterPatternLive" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                    <rect width="30" height="30" fill="#a5b4fc" opacity="0.4"/>
                    <path d="M0 15 Q7.5 12 15 15 T30 15" stroke="#818cf8" strokeWidth="1" fill="none" opacity="0.6"/>
                  </pattern>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                  <filter id="dropShadowLive">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
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
                <rect width="800" height="400" fill="url(#skyGradientLive)"/>
                
                {/* Land areas - colorful terrain */}
                <path d="M0 100 Q150 80 300 110 T600 100 Q700 120 800 100 L800 400 L0 400 Z" fill="#d9f99d" opacity="0.5"/>
                <path d="M0 150 Q200 130 400 160 T800 150 L800 400 L0 400 Z" fill="#bef264" opacity="0.4"/>
                <path d="M0 200 Q180 180 350 200 T700 190 L800 200 L800 400 L0 400 Z" fill="#a3e635" opacity="0.3"/>
                
                {/* Water body */}
                <ellipse cx="650" cy="280" rx="100" ry="60" fill="url(#waterPatternLive)" stroke="#818cf8" strokeWidth="2"/>
                
                {/* Parks/Green spaces */}
                <circle cx="250" cy="170" r="45" fill="#34d399" opacity="0.3" filter="url(#dropShadowLive)"/>
                <circle cx="520" cy="240" r="50" fill="#34d399" opacity="0.3" filter="url(#dropShadowLive)"/>
                
                {/* Roads with colors */}
                <path d="M0 220 Q200 200 400 220 T800 220" stroke="#fde047" strokeWidth="10" fill="none" opacity="0.5"/>
                <path d="M300 0 L300 400" stroke="#fde047" strokeWidth="8" fill="none" opacity="0.5"/>
                <path d="M600 0 L600 400" stroke="#fde047" strokeWidth="8" fill="none" opacity="0.5"/>
                
                {/* Road markings */}
                <path d="M0 220 Q200 200 400 220 T800 220" stroke="#ffffff" strokeWidth="2" strokeDasharray="15,10" fill="none" opacity="0.7"/>
                
                {/* Buildings - colorful */}
                <g opacity="0.6">
                  <rect x="200" y="250" width="50" height="70" fill="#f472b6" filter="url(#dropShadowLive)"/>
                  <polygon points="200,250 225,230 250,250" fill="#ec4899"/>
                  
                  <rect x="400" y="280" width="60" height="80" fill="#a78bfa" filter="url(#dropShadowLive)"/>
                  <polygon points="400,280 430,260 460,280" fill="#8b5cf6"/>
                  
                  <rect x="550" y="320" width="45" height="60" fill="#60a5fa" filter="url(#dropShadowLive)"/>
                  <polygon points="550,320 572.5,305 595,320" fill="#3b82f6"/>
                  
                  <rect x="150" y="320" width="40" height="55" fill="#fb923c" filter="url(#dropShadowLive)"/>
                  <polygon points="150,320 170,305 190,320" fill="#f97316"/>
                </g>
                
                {/* Trees */}
                <g opacity="0.5">
                  <circle cx="280" cy="180" r="12" fill="#22c55e"/>
                  <rect x="275" y="189" width="10" height="18" fill="#92400e"/>
                  
                  <circle cx="490" cy="220" r="15" fill="#22c55e"/>
                  <rect x="484" y="232" width="12" height="20" fill="#92400e"/>
                </g>
                
                {/* Route line with glow */}
                <path
                  d="M 100 300 Q 300 150, 700 100"
                  stroke="url(#routeLive)"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  filter="url(#glow)"
                />

                {/* Pickup Point - Enhanced with Clear Label */}
                <g>
                  <circle cx="100" cy="300" r="28" fill="#8b5cf6" stroke="white" strokeWidth="4" filter="url(#glow)" />
                  <text x="100" y="308" fontSize="20" fill="white" textAnchor="middle" fontWeight="bold">A</text>
                  
                  {/* Label box */}
                  <rect x="30" y="320" width="140" height="50" rx="12" fill="white" stroke="#8b5cf6" strokeWidth="3" />
                  <text x="100" y="340" fontSize="14" fill="#8b5cf6" textAnchor="middle" fontWeight="800">
                    {job?.pickup.postcode}
                  </text>
                  <text x="100" y="358" fontSize="12" fill="#64748b" textAnchor="middle" fontWeight="700">PICKUP POINT</text>
                </g>

                {/* Delivery Point - Enhanced with Clear Label */}
                <g>
                  <circle cx="700" cy="100" r="28" fill="#10b981" stroke="white" strokeWidth="4" filter="url(#glow)" />
                  <text x="700" y="108" fontSize="20" fill="white" textAnchor="middle" fontWeight="bold">B</text>
                  
                  {/* Label box */}
                  <rect x="630" y="10" width="140" height="50" rx="12" fill="white" stroke="#10b981" strokeWidth="3" />
                  <text x="700" y="30" fontSize="14" fill="#10b981" textAnchor="middle" fontWeight="800">
                    {job?.delivery.postcode}
                  </text>
                  <text x="700" y="48" fontSize="12" fill="#64748b" textAnchor="middle" fontWeight="700">DELIVERY POINT</text>
                </g>

                {/* Moving Driver Marker - Enhanced */}
                <g>
                  {/* Outer pulse ring */}
                  <circle 
                    cx={100 + ((job?.completedDistance || 0) / (job?.distance || 1)) * 600} 
                    cy={300 - ((job?.completedDistance || 0) / (job?.distance || 1)) * 200}
                    r="60" 
                    fill="none" 
                    stroke="#ec4899" 
                    strokeWidth="4" 
                    opacity="0.2"
                    className="animate-ping"
                  />
                  
                  {/* Main driver marker */}
                  <circle 
                    cx={100 + ((job?.completedDistance || 0) / (job?.distance || 1)) * 600} 
                    cy={300 - ((job?.completedDistance || 0) / (job?.distance || 1)) * 200}
                    r="32" 
                    fill="#ec4899" 
                    stroke="white" 
                    strokeWidth="5" 
                    filter="url(#glow)"
                  />
                  
                  <text 
                    x={100 + ((job?.completedDistance || 0) / (job?.distance || 1)) * 600}
                    y={310 - ((job?.completedDistance || 0) / (job?.distance || 1)) * 200}
                    fontSize="28" 
                    textAnchor="middle"
                  >
                    🚚
                  </text>
                </g>
              </svg>

              {/* Enhanced Map Info Overlay with Clear Labels */}
              <div className="absolute bottom-4 left-4 right-4 bg-white rounded-2xl shadow-2xl p-5 border-2 border-slate-300">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-50 rounded-xl p-3 border-2 border-slate-200">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="bg-purple-100 p-1.5 rounded-lg">
                        <Navigation className="w-4 h-4 text-purple-600" />
                      </div>
                      <p className="text-xs text-slate-500 font-bold uppercase">Distance</p>
                    </div>
                    <p className="text-lg font-black text-slate-900">
                      {job?.completedDistance}/{job?.distance}mi
                    </p>
                  </div>
                  
                  <div className="bg-slate-50 rounded-xl p-3 border-2 border-slate-200">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="bg-orange-100 p-1.5 rounded-lg">
                        <Clock className="w-4 h-4 text-orange-600" />
                      </div>
                      <p className="text-xs text-slate-500 font-bold uppercase">ETA</p>
                    </div>
                    <p className="text-lg font-black text-slate-900">{job?.eta}</p>
                  </div>
                  
                  <div className="bg-slate-50 rounded-xl p-3 border-2 border-slate-200">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="bg-blue-100 p-1.5 rounded-lg">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                      </div>
                      <p className="text-xs text-slate-500 font-bold uppercase">Progress</p>
                    </div>
                    <p className="text-lg font-black text-slate-900">
                      {Math.round(((job?.completedDistance || 0) / (job?.distance || 1)) * 100)}%
                    </p>
                  </div>
                  
                  <div className="bg-slate-50 rounded-xl p-3 border-2 border-slate-200">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="bg-emerald-100 p-1.5 rounded-lg">
                        <Activity className="w-4 h-4 text-emerald-600 animate-pulse" />
                      </div>
                      <p className="text-xs text-slate-500 font-bold uppercase">Status</p>
                    </div>
                    <p className="text-lg font-black text-emerald-600">ACTIVE</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Job Details with Clear Sections */}
          {job && (
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Driver Info - Clearer Layout */}
              <div className="bg-white border-2 border-purple-500 rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-5">
                  <h4 className="font-bold text-white text-xl flex items-center gap-2">
                    <div className="bg-white/20 backdrop-blur-md p-2 rounded-lg">
                      <Truck className="w-6 h-6" />
                    </div>
                    Driver Information
                  </h4>
                </div>
                
                <div className="p-5 space-y-4">
                  <div className="bg-slate-50 rounded-xl p-4 border-2 border-slate-200">
                    <p className="text-xs text-slate-500 font-bold mb-2 uppercase">Driver Name</p>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-xl border-3 border-white shadow-lg">
                        {job.driver.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-lg">{job.driver.name}</div>
                        <div className="text-sm text-slate-600">{job.driver.vehicle}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 rounded-xl p-4 border-2 border-slate-200">
                    <p className="text-xs text-slate-500 font-bold mb-2 uppercase">Phone Number</p>
                    <div className="flex items-center gap-2 text-base text-slate-900 font-semibold">
                      <Phone className="w-5 h-5 text-purple-600" />
                      {job.driver.phone}
                    </div>
                  </div>
                  
                  <a
                    href={`tel:${job.driver.phone}`}
                    className="w-full px-4 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-all flex items-center justify-center gap-3 font-bold text-base shadow-lg hover:shadow-xl"
                  >
                    <Phone className="w-6 h-6" />
                    Call {job.driver.name}
                  </a>
                </div>
              </div>

              {/* Customer Info - Clearer Layout */}
              <div className="bg-white border-2 border-blue-500 rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-5">
                  <h4 className="font-bold text-white text-xl flex items-center gap-2">
                    <div className="bg-white/20 backdrop-blur-md p-2 rounded-lg">
                      <User className="w-6 h-6" />
                    </div>
                    Customer Information
                  </h4>
                </div>
                
                <div className="p-5 space-y-4">
                  <div className="bg-slate-50 rounded-xl p-4 border-2 border-slate-200">
                    <p className="text-xs text-slate-500 font-bold mb-2 uppercase">Customer Name</p>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-bold text-xl border-3 border-white shadow-lg">
                        {job.customer.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-lg">{job.customer.name}</div>
                        <div className="text-sm text-slate-600">{job.bookingNumber}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 rounded-xl p-4 border-2 border-slate-200">
                    <p className="text-xs text-slate-500 font-bold mb-2 uppercase">Phone Number</p>
                    <div className="flex items-center gap-2 text-base text-slate-900 font-semibold">
                      <Phone className="w-5 h-5 text-blue-600" />
                      {job.customer.phone}
                    </div>
                  </div>
                  
                  <a
                    href={`tel:${job.customer.phone}`}
                    className="w-full px-4 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all flex items-center justify-center gap-3 font-bold text-base shadow-lg hover:shadow-xl"
                  >
                    <Phone className="w-6 h-6" />
                    Call {job.customer.name}
                  </a>
                </div>
              </div>
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