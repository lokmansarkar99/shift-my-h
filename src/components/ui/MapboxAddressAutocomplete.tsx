import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Loader2, CheckCircle2, Home } from 'lucide-react';
import { MAPBOX_PUBLIC_TOKEN } from '../../utils/mapboxConfig';

interface ParsedAddress {
  houseNumber: string;
  buildingName: string;
  street: string;
  city: string;
  postcode: string;
  county: string;
  fullAddress: string;
  latitude?: number;
  longitude?: number;
}

interface MapboxAddressAutocompleteProps {
  onSelect: (parsedAddress: ParsedAddress) => void;
  placeholder?: string;
  defaultValue?: string;
  className?: string;
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  badgeType?: 'A' | 'B'; // ✅ NEW: Rounded square badge with letter
}

interface MapboxFeature {
  id: string;
  place_name: string;
  text: string;
  place_type: string[];
  center: [number, number]; // [longitude, latitude]
  context?: Array<{
    id: string;
    text: string;
    short_code?: string;
  }>;
  properties?: {
    address?: string;
  };
}

// Cache configuration
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const MAX_RESULTS = 8;
const MIN_CHARS = 3;
const DEBOUNCE_MS = 400;

interface CachedResult {
  results: MapboxFeature[];
  timestamp: number;
}

const searchCache = new Map<string, CachedResult>();

export function MapboxAddressAutocomplete({ 
  onSelect, 
  placeholder = "Enter address", 
  defaultValue = "", 
  className = "",
  label = "",
  value,
  onChange,
  required,
  badgeType
}: MapboxAddressAutocompleteProps) {
  const [query, setQuery] = useState(value || defaultValue);
  const [results, setResults] = useState<MapboxFeature[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isAddressSelected, setIsAddressSelected] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.length >= MIN_CHARS && isOpen && !isAddressSelected) {
      searchTimeoutRef.current = setTimeout(() => {
        searchAddresses(query);
      }, DEBOUNCE_MS);
    } else if (query.length < MIN_CHARS) {
      setResults([]);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query, isOpen, isAddressSelected]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchAddresses = async (searchQuery: string) => {
    // Check cache first
    const cachedResult = searchCache.get(searchQuery);
    if (cachedResult && (Date.now() - cachedResult.timestamp < CACHE_DURATION)) {
      console.log('📦 Using cached Mapbox results for:', searchQuery);
      setResults(cachedResult.results);
      return;
    }

    setIsLoading(true);

    try {
      // Mapbox Geocoding API
      // Focus on UK addresses, prioritize address types
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?` +
        `access_token=${MAPBOX_PUBLIC_TOKEN}` +
        `&country=GB` + // Restrict to UK
        `&types=address,place,postcode` + // Address types
        `&limit=${MAX_RESULTS}` +
        `&language=en`;

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Mapbox API error: ${response.status}`);
      }

      const data = await response.json();
      const features: MapboxFeature[] = data.features || [];
      
      setResults(features);

      // Cache the results
      searchCache.set(searchQuery, { results: features, timestamp: Date.now() });
      console.log('💾 Cached Mapbox results for:', searchQuery);
    } catch (error: any) {
      console.error('Mapbox geocoding error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const parseMapboxFeature = (feature: MapboxFeature): ParsedAddress => {
    const [longitude, latitude] = feature.center;
    
    // Extract address components from context
    let postcode = '';
    let city = '';
    let county = '';
    
    if (feature.context) {
      for (const ctx of feature.context) {
        if (ctx.id.startsWith('postcode.')) {
          postcode = ctx.text;
        } else if (ctx.id.startsWith('place.')) {
          city = ctx.text;
        } else if (ctx.id.startsWith('region.')) {
          county = ctx.text;
        }
      }
    }

    // Extract house number and street
    let houseNumber = '';
    let street = feature.text;
    
    if (feature.properties?.address) {
      houseNumber = feature.properties.address;
    }

    // If the text starts with a number, extract it
    const numberMatch = feature.text.match(/^(\d+[A-Za-z]?)/);
    if (numberMatch) {
      houseNumber = numberMatch[1];
      street = feature.text.replace(/^\d+[A-Za-z]?\s*/, '');
    }

    return {
      houseNumber,
      buildingName: '',
      street,
      city,
      postcode,
      county,
      fullAddress: feature.place_name,
      latitude,
      longitude
    };
  };

  const handleSelect = (feature: MapboxFeature) => {
    setQuery(feature.place_name);
    setIsOpen(false);
    setIsAddressSelected(true);

    const parsedAddress = parseMapboxFeature(feature);
    onSelect(parsedAddress);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    setIsOpen(true);
    setIsAddressSelected(false);
    if (onChange) {
      onChange(newValue);
    }
  };

  // Sync external value changes
  useEffect(() => {
    if (value !== undefined && value !== query) {
      setQuery(value);
    }
  }, [value]);

  return (
    <div className={`relative ${className}`} ref={wrapperRef}>
      {label && (
        <label className="block text-[15px] font-semibold text-slate-800 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {/* Left Icon/Badge */}
        {badgeType ? (
          // ✅ Rounded Square Badge with Letter (A or B)
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex-shrink-0">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm ${
              isAddressSelected 
                ? badgeType === 'A' 
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                  : 'bg-gradient-to-br from-green-500 to-green-600'
                : badgeType === 'A'
                  ? 'bg-blue-50 border-2 border-blue-200'
                  : 'bg-green-50 border-2 border-green-200'
            }`}>
              <span className={`text-base font-bold ${
                isAddressSelected 
                  ? 'text-white' 
                  : badgeType === 'A' 
                    ? 'text-blue-600' 
                    : 'text-green-600'
              }`}>
                {badgeType}
              </span>
            </div>
          </div>
        ) : (
          // ❌ Default: MapPin icon (for backward compatibility)
          <MapPin className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
            isAddressSelected ? 'text-green-500' : 'text-gray-400'
          }`} />
        )}
        
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.length >= MIN_CHARS && setIsOpen(true)}
          placeholder={placeholder}
          required={required}
          className={`w-full ${badgeType ? 'pl-16' : 'pl-11'} pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-[15px] font-medium ${
            isAddressSelected 
              ? 'border-green-400 bg-green-50/30 text-green-900' 
              : 'border-gray-300 bg-white'
          }`}
        />
        
        {/* Status Icons */}
        {isAddressSelected && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          </div>
        )}
        {isLoading && !isAddressSelected && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
          </div>
        )}
      </div>

      {/* Address dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-96 overflow-hidden">
          <div className="max-h-80 overflow-y-auto">
            {results.map((result, index) => {
              // Split address for better display
              const parts = result.place_name.split(',');
              const firstPart = parts[0];
              const restParts = parts.slice(1).join(',');

              return (
                <button
                  key={result.id || index}
                  onClick={() => handleSelect(result)}
                  className="w-full text-left px-4 py-3 hover:bg-blue-50 active:bg-blue-100 flex items-start gap-3 border-b border-gray-100 last:border-0 transition-colors group"
                >
                  {/* Icon/Badge for dropdown items */}
                  {badgeType ? (
                    // ✅ Small rounded square badge (consistent with input)
                    <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all">
                      <MapPin className="w-4 h-4 text-slate-500 group-hover:text-blue-600" />
                    </div>
                  ) : (
                    // ❌ Default: Round badge (backward compatibility)
                    <div className="w-8 h-8 rounded-full bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Home className="w-4 h-4 text-blue-600" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-semibold text-gray-900 group-hover:text-blue-900">
                      {firstPart}
                    </p>
                    {restParts && (
                      <p className="text-xs text-gray-500 truncate">
                        {restParts}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          
          <div className="px-3 py-2 bg-gray-50 text-[10px] text-right text-gray-400 border-t border-gray-100 flex items-center justify-between">
            <span className="text-gray-500 flex items-center gap-1">
              <span className="font-semibold">Powered by Mapbox</span>
            </span>
            <span className="text-gray-400">{results.length} result{results.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      )}
      
      {/* No results message */}
      {isOpen && !isLoading && results.length === 0 && query.length >= MIN_CHARS && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden">
          <div className="px-4 py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-700 mb-1">No addresses found</p>
            <p className="text-xs text-gray-500">Try a different address or postcode</p>
          </div>
        </div>
      )}
    </div>
  );
}