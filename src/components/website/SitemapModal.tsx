import React, { useState, useEffect, useRef } from 'react';
import { X, MapPin, Home, Package, Truck, Calendar, Mail, Phone, FileText, HelpCircle, Settings, Users, Globe, Search, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_PUBLIC_TOKEN } from '../../utils/mapboxConfig';
import { Logo } from './Logo';

interface SitemapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// City Data - With Lat/Lng for Mapbox
const scotlandCities = [
  { name: 'Inverness', lat: 57.4778, lng: -4.2247, region: 'Highlands' },
  { name: 'Aberdeen', lat: 57.1497, lng: -2.0943, region: 'Aberdeenshire', popular: true },
  { name: 'Dundee', lat: 56.4620, lng: -2.9707, region: 'Tayside' },
  { name: 'Perth', lat: 56.3950, lng: -3.4308, region: 'Perthshire' },
  { name: 'Stirling', lat: 56.1165, lng: -3.9369, region: 'Central' },
  { name: 'Edinburgh', lat: 55.9533, lng: -3.1883, region: 'Lothian', popular: true },
  { name: 'Glasgow', lat: 55.8642, lng: -4.2518, region: 'Strathclyde', popular: true },
  { name: 'Livingston', lat: 55.8818, lng: -3.5221, region: 'West Lothian' },
  { name: 'Paisley', lat: 55.8456, lng: -4.4237, region: 'Renfrewshire' },
  { name: 'East Kilbride', lat: 55.7600, lng: -4.2200, region: 'South Lanarkshire' },
  { name: 'Hamilton', lat: 55.7772, lng: -4.0377, region: 'South Lanarkshire' },
  { name: 'Kirkcaldy', lat: 56.1107, lng: -3.1674, region: 'Fife' },
  { name: 'Dunfermline', lat: 56.0719, lng: -3.4393, region: 'Fife' },
  { name: 'Falkirk', lat: 56.0019, lng: -3.7839, region: 'Falkirk' },
  { name: 'Ayr', lat: 55.4586, lng: -4.6292, region: 'Ayrshire' },
  { name: 'Dumfries', lat: 55.0709, lng: -3.6051, region: 'Dumfries & Galloway' },
  { name: 'Carlisle', lat: 54.8925, lng: -2.9329, region: 'Cumbria (Border)' },
];

const sitemapStructure = [
  {
    category: 'Main Pages',
    links: [
      { name: 'Home', path: '#home' },
      { name: 'About Us', path: '#about' },
      { name: 'Services', path: '#services' },
      { name: 'Pricing & Quote', path: '#booking' },
      { name: 'Contact', path: '#contact' },
    ]
  },
  {
    category: 'Services',
    links: [
      { name: 'House Removals', path: '#house-move' },
      { name: 'Furniture Transport', path: '#furniture' },
      { name: 'Man & Van', path: '#man-van' },
      { name: 'Motorbike Transport', path: '#motorbike' },
      { name: 'Office Moves', path: '#office' },
    ]
  },
  {
    category: 'Legal & Support',
    links: [
      { name: 'Terms & Conditions', path: '#terms' },
      { name: 'Privacy Policy', path: '#privacy' },
      { name: 'Cookie Policy', path: '#cookies' },
      { name: 'Help Center', path: '#help' },
    ]
  }
];

export function SitemapModal({ isOpen, onClose }: SitemapModalProps) {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  const filteredCities = scotlandCities.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (!isOpen) return;

    const token = MAPBOX_PUBLIC_TOKEN;
    if (!token) {
        console.warn("Mapbox token missing for Sitemap map");
        return;
    }

    mapboxgl.accessToken = token;
    
    try {
      if (!mapContainer.current) return;
      if (map.current) return; // Prevent double init
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12', // Changed to streets for better contrast
        center: [-4.2026, 56.4907], // Scotland center
        zoom: 6,
        cooperativeGestures: true
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.current.on('load', () => {
        // Add markers
        scotlandCities.forEach(city => {
          if (!city.lat || !city.lng) return;

          const el = document.createElement('div');
          el.className = 'marker-container group';
          
          // Create custom marker element matching the previous design
          const markerHtml = `
            <div class="relative cursor-pointer group">
               <div class="absolute inset-0 -m-3 rounded-full animate-ping pointer-events-none opacity-60 ${city.popular ? 'bg-blue-500' : 'bg-slate-400'}" style="animation-duration: 2s;"></div>
               <div class="relative w-4 h-4 rounded-full border-3 border-white shadow-xl transition-all duration-300 ${city.popular ? 'bg-blue-600 scale-150 shadow-blue-500/50' : 'bg-slate-500 hover:bg-blue-500 hover:scale-125'}" style="box-shadow: 0 0 20px rgba(0,0,0,0.3), 0 0 10px ${city.popular ? 'rgba(37,99,235,0.5)' : 'rgba(100,116,139,0.3)'}"></div>
               
               <div class="absolute left-6 top-1/2 -translate-y-1/2 transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 pointer-events-none group-hover:pointer-events-auto z-50 min-w-[140px]">
                  <div class="flex items-center">
                    <div class="w-5 h-[3px] absolute -left-6 top-1/2 ${city.popular ? 'bg-blue-600' : 'bg-slate-500'} shadow-md"></div>
                    <div class="bg-white/98 backdrop-blur-md border-2 ${city.popular ? 'border-blue-500' : 'border-slate-300'} rounded-xl px-4 py-2 shadow-2xl flex items-center gap-2 hover:scale-105 transition-transform">
                      <div class="border-l-2 ${city.popular ? 'border-blue-500' : 'border-slate-300'} pl-3 ml-1">
                        <span class="text-slate-900 text-sm font-bold whitespace-nowrap block">${city.name}</span>
                        <span class="text-slate-500 text-xs block">${city.region}</span>
                      </div>
                    </div>
                  </div>
               </div>
            </div>
          `;
          
          el.innerHTML = markerHtml;

          new mapboxgl.Marker(el)
            .setLngLat([city.lng, city.lat])
            .addTo(map.current!);
        });
      });

    } catch (err) {
      console.error("Map init error:", err);
    }

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [isOpen]);

  // Handle Search FlyTo
  useEffect(() => {
    if (!map.current || !filteredCities.length) return;
    
    // If search term matches exactly one city, fly to it
    if (searchTerm.length > 2 && filteredCities.length > 0) {
        const bestMatch = filteredCities[0];
        map.current.flyTo({
            center: [bestMatch.lng, bestMatch.lat],
            zoom: 10,
            essential: true
        });
    }
  }, [searchTerm, filteredCities]);

  if (!isOpen) return null;

  const hasToken = !!MAPBOX_PUBLIC_TOKEN;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-0 md:p-4 bg-slate-900/95 backdrop-blur-sm">
      <div className="bg-white rounded-none md:rounded-3xl shadow-2xl max-w-7xl w-full h-screen md:h-[90vh] overflow-hidden flex flex-col relative">
        
        {/* LEFT SIDEBAR - Collapsible */}
        <div className={`absolute left-0 top-0 bottom-0 z-40 bg-white border-r border-slate-200 transition-all duration-300 ${sidebarCollapsed ? 'w-0 -translate-x-full' : 'w-80'} hidden lg:block shadow-xl`}>
          <div className="p-8 overflow-y-auto h-full scrollbar-hide">
            <div className="mb-8">
              <Logo variant="blue" className="h-8 mb-4" />
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Sitemap
              </h2>
              <p className="text-xs text-slate-500 mt-1">Full website index & navigation</p>
            </div>

            <div className="space-y-8">
              {sitemapStructure.map((section, idx) => (
                <div key={idx}>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 pb-2 border-b border-slate-200">
                    {section.category}
                  </h3>
                  <ul className="space-y-2">
                    {section.links.map((link, lIdx) => (
                      <li key={lIdx}>
                        <a 
                          href={link.path} 
                          onClick={onClose} 
                          className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition-colors group"
                        >
                          <span className="w-1 h-1 rounded-full bg-slate-300 group-hover:bg-blue-600 transition-colors"></span>
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-200">
              <p className="text-xs text-slate-400">© 2025 ShiftMyHome Ltd.</p>
            </div>
          </div>
        </div>

        {/* Sidebar Toggle Button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className={`hidden lg:flex absolute top-1/2 -translate-y-1/2 z-50 bg-white hover:bg-slate-50 border border-slate-300 p-2 rounded-r-lg shadow-lg transition-all ${sidebarCollapsed ? 'left-0' : 'left-80'}`}
          title={sidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4 text-slate-600" /> : <ChevronLeft className="w-4 h-4 text-slate-600" />}
        </button>

        {/* MAIN MAP CONTAINER */}
        <div className={`flex-1 bg-slate-100 relative overflow-hidden flex flex-col transition-all duration-300 ${sidebarCollapsed ? '' : 'lg:ml-80'}`}>
          
          {/* HEADER - Clean, Professional with Close Button */}
          <div className="relative z-30 bg-white border-b border-slate-200 shadow-sm">
            <div className="max-w-4xl mx-auto px-6 py-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Our UK Network Coverage</h2>
                  <p className="text-sm text-slate-500 mt-1 flex items-center gap-3">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span> 
                      <span className="font-medium">Live Status</span>
                    </span>
                    <span className="text-slate-300">•</span>
                    <span>{scotlandCities.length} Active Locations</span>
                  </p>
                </div>
                
                {/* Close Button - Clear and Visible */}
                <button
                  onClick={onClose}
                  className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl transition-all font-medium shadow-sm hover:shadow border border-slate-200"
                >
                  <X className="w-5 h-5" />
                  <span className="hidden sm:inline">Close</span>
                </button>
              </div>

              {/* Search - Centered under title */}
              <div className="relative max-w-xl">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search city or postcode..."
                  className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:border-slate-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* MAP VIEWPORT - Improved Contrast */}
          <div className="flex-1 relative w-full h-full group/map bg-slate-200">
            
            {!hasToken ? (
                 <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                    <div className="text-center p-8 bg-white rounded-xl shadow-lg border border-red-100">
                        <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-800">Map Unavailable</h3>
                        <p className="text-sm text-gray-500 mt-2">Mapbox token is missing. Please check Admin settings.</p>
                    </div>
                 </div>
            ) : (
                <>
                    <div ref={mapContainer} className="w-full h-full" style={{ filter: 'contrast(1.05) saturate(1.1)' }} />
                    {/* Subtle gradient for depth */}
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/5 via-transparent to-white/10 pointer-events-none" />
                </>
            )}
          </div>

          {/* BOTTOM CTA BAR - Cleaner, more subtle */}
          <div className="bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 md:p-5 z-30 shadow-lg">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-center md:text-left">
                <div className="hidden md:flex w-10 h-10 bg-blue-50 rounded-xl items-center justify-center flex-shrink-0">
                  <MapPin className="text-blue-600 w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-slate-900 font-bold text-sm">Location not listed?</h3>
                  <p className="text-slate-500 text-xs">We cover 99% of UK postcodes. Get in touch for a quote.</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 w-full md:w-auto">
                <a
                  href="tel:08001234567"
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-all shadow-md hover:shadow-lg"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Us</span>
                </a>
                <a
                  href="mailto:support@shiftmyhome.co.uk"
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all border border-slate-200"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Message</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}