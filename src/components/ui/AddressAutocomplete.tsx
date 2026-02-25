import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Loader2, Edit3, CheckCircle2 } from 'lucide-react';
import { fetchSystemConfig } from '../../utils/configService';
import { MAPBOX_PUBLIC_TOKEN } from '../../utils/mapboxConfig';

interface AddressResult {
  place_name: string;
  center: [number, number]; // [lng, lat]
  context?: any[];
  address?: string;
  text?: string;
}

interface ParsedAddress {
  houseNumber: string;
  street: string;
  city: string;
  postcode: string;
  fullAddress: string;
}

interface AddressAutocompleteProps {
  onSelect: (address: string, lat: number, lng: number, parsed?: ParsedAddress) => void;
  placeholder?: string;
  defaultValue?: string;
  className?: string;
  required?: boolean;
}

export function AddressAutocomplete({ 
  onSelect, 
  placeholder = "Enter postcode or address...", 
  defaultValue = "", 
  className = "",
  required = true 
}: AddressAutocompleteProps) {
  const [query, setQuery] = useState(defaultValue);
  const [results, setResults] = useState<AddressResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isAddressSelected, setIsAddressSelected] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);
  const [isLoadingToken, setIsLoadingToken] = useState(true);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  // Fetch Mapbox token on mount
  useEffect(() => {
    const loadToken = async () => {
      setIsLoadingToken(true);
      const token = await getMapboxToken();
      setMapboxToken(token);
      setIsLoadingToken(false);
    };
    loadToken();
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query && query.length > 2 && isOpen && mapboxToken) {
        searchAddress(query);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query, isOpen, mapboxToken]);

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

  const getMapboxToken = async (): Promise<string | null> => {
    // 1. Check environment variable
    const envToken = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_MAPBOX_TOKEN) || 
                     (typeof import.meta !== 'undefined' && (import.meta as any).env?.NEXT_PUBLIC_MAPBOX_TOKEN);
    if (envToken) {
      return envToken;
    }
    
    // 2. Check localStorage
    const localToken = typeof window !== 'undefined' ? localStorage.getItem('mapbox_token') : null;
    if (localToken) {
      return localToken;
    }

    // 3. Fetch from backend
    const config = await fetchSystemConfig();
    if (config?.mapboxToken) {
        localStorage.setItem('mapbox_token', config.mapboxToken);
        return config.mapboxToken;
    }

    // 4. Use hardcoded token as final fallback
    if (MAPBOX_PUBLIC_TOKEN) {
        return MAPBOX_PUBLIC_TOKEN;
    }

    console.error('❌ Mapbox token not found in any source. Please configure NEXT_PUBLIC_MAPBOX_TOKEN environment variable.');
    return null;
  };

  const searchAddress = async (searchText: string) => {
    if (!mapboxToken) {
      console.error("Mapbox Token missing");
      return;
    }

    setIsLoading(true);
    try {
      // Add country=GB to restrict to UK if needed, or remove for global
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchText)}.json?access_token=${mapboxToken}&autocomplete=true&country=gb`,
        {
          signal: AbortSignal.timeout(10000), // 10 second timeout
        }
      );
      
      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.features) {
        setResults(data.features);
      }
    } catch (error) {
      // Silently handle errors - don't break the UI
      if (error instanceof Error && error.name !== 'AbortError') {
        console.warn("Address search error:", error.message);
      }
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (item: AddressResult) => {
    setQuery(item.place_name);
    setIsOpen(false);
    setIsAddressSelected(true);
    // Mapbox returns [lng, lat], we pass [lat, lng] to callback for consistency with Leaflet/Google
    onSelect(item.place_name, item.center[1], item.center[0], parseAddress(item));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    setIsOpen(true);
    setIsAddressSelected(false); // Reset selection when user types
    setShowManualEntry(false);
    
    // Clear results if query is too short
    if (newValue.length < 3) {
      setResults([]);
    }
  };

  const handleManualEntry = () => {
    setShowManualEntry(true);
    setIsOpen(false);
    setIsAddressSelected(true); // Allow manual entry
    // For manual entry, we still need coordinates - use a default or geocode the text
    onSelect(query, 0, 0); // You may want to geocode this later
  };

  const hasToken = !!mapboxToken;

  const parseAddress = (addressResult: AddressResult): ParsedAddress => {
    const address = addressResult.place_name;
    const parts = address.split(',').map(part => part.trim());
    const houseNumber = parts[0].split(' ')[0];
    const street = parts[0].split(' ').slice(1).join(' ');
    const city = parts[1];
    const postcode = parts[parts.length - 1];
    const fullAddress = address;
    return { houseNumber, street, city, postcode, fullAddress };
  };

  return (
    <div className={`relative ${className}`} ref={wrapperRef}>
      <div className="relative">
        <MapPin className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors ${
          isAddressSelected ? 'text-green-500' : 'text-gray-400'
        }`} />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.length > 2 && setIsOpen(true)}
          placeholder={isLoadingToken ? "Loading..." : (hasToken ? placeholder : "Mapbox Token Missing - Add in Environment Variables")}
          disabled={!hasToken || isLoadingToken}
          className={`w-full pl-9 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
            isAddressSelected 
              ? 'border-green-300 bg-green-50/30' 
              : 'border-gray-300 bg-white'
          }`}
        />
        {isAddressSelected && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          </div>
        )}
        {(isLoading || isLoadingToken) && !isAddressSelected && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
          </div>
        )}
      </div>

      {/* Address dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-80 overflow-hidden">
          <div className="max-h-64 overflow-y-auto">
            {results.map((item, index) => (
              <button
                key={item.id || index}
                onClick={() => handleSelect(item)}
                className="w-full text-left px-4 py-3 hover:bg-blue-50 flex items-start gap-3 border-b border-gray-100 last:border-0 transition-colors"
              >
                <MapPin className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{item.place_name.split(',')[0]}</p>
                  <p className="text-xs text-gray-500 truncate">{item.place_name.split(',').slice(1).join(',')}</p>
                </div>
              </button>
            ))}
          </div>
          
          {/* Manual entry link */}
          <button
            onClick={handleManualEntry}
            className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-2 transition-colors border-t border-gray-200"
          >
            <Edit3 className="w-3 h-3" />
            No address found? Enter manually
          </button>
          
          <div className="px-3 py-1.5 bg-gray-50 text-[10px] text-right text-gray-400 border-t border-gray-100">
            Powered by Mapbox
          </div>
        </div>
      )}
      
      {/* Show manual entry link when no results after typing */}
      {isOpen && !isLoading && results.length === 0 && query.length > 2 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
          <div className="px-4 py-3 text-sm text-gray-500 text-center">
            No addresses found
          </div>
          <button
            onClick={handleManualEntry}
            className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-2 transition-colors border-t border-gray-200"
          >
            <Edit3 className="w-3 h-3" />
            Enter address manually
          </button>
        </div>
      )}
    </div>
  );
}