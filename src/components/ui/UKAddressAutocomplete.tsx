import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Loader2, Edit3, CheckCircle2, Home } from 'lucide-react';
import { ukAddressService, AddressSearchResult, UKAddress } from '../../utils/ukAddressService';

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

interface UKAddressAutocompleteProps {
  onSelect: (parsedAddress: ParsedAddress) => void;
  placeholder?: string;
  defaultValue?: string;
  className?: string;
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
}

const CACHE_DURATION = 24 * 60 * 60 * 1000;
const MAX_RESULTS = 8;
const MIN_CHARS = 4;
const DEBOUNCE_MS = 600;

interface CachedResult {
  results: AddressSearchResult[];
  timestamp: number;
}

const searchCache = new Map<string, CachedResult>();

export function UKAddressAutocomplete({ 
  onSelect, 
  placeholder = "Enter postcode or address", 
  defaultValue = "", 
  className = "",
  label = "",
  value,
  onChange,
  required
}: UKAddressAutocompleteProps) {
  const [query, setQuery] = useState(value || defaultValue);
  const [results, setResults] = useState<AddressSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isAddressSelected, setIsAddressSelected] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isConfigured, setIsConfigured] = useState(false);
  const [isCheckingConfig, setIsCheckingConfig] = useState(true);

  useEffect(() => {
    const checkConfiguration = async () => {
      setIsCheckingConfig(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsConfigured(ukAddressService.isConfigured());
      setIsCheckingConfig(false);
    };
    
    checkConfiguration();
  }, []);

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
      setErrorMessage(null);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query, isOpen, isAddressSelected]);

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
    const cachedResult = searchCache.get(searchQuery);
    if (cachedResult && (Date.now() - cachedResult.timestamp < CACHE_DURATION)) {
      console.log('📦 Using cached results for:', searchQuery);
      setResults(cachedResult.results);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const addressResults = await ukAddressService.searchAddresses(searchQuery);
      const limitedResults = addressResults.slice(0, MAX_RESULTS);
      setResults(limitedResults);
      
      if (addressResults.length === 0 && isConfigured) {
        setErrorMessage('No addresses found for this search');
      }

      searchCache.set(searchQuery, { results: limitedResults, timestamp: Date.now() });
      console.log('💾 Cached results for:', searchQuery);
    } catch (error: any) {
      console.log('Address search error (ignored):', error.message);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = async (result: AddressSearchResult) => {
    setQuery(result.address);
    setIsOpen(false);
    setIsAddressSelected(true);
    setErrorMessage(null);

    let fullDetails: UKAddress | null = result.fullDetails || null;
    
    if (!fullDetails && result.id) {
      try {
        fullDetails = await ukAddressService.getAddressById(result.id);
      } catch (error) {
        console.error('Failed to get full address details:', error);
      }
    }

    const parsedAddress = parseAddress(fullDetails || {
      line_1: result.address.split(',')[0] || '',
      post_town: result.address.split(',').slice(-2, -1)[0]?.trim() || '',
      postcode: result.address.split(',').slice(-1)[0]?.trim() || '',
      fullAddress: result.address
    } as UKAddress);

    onSelect(parsedAddress);
  };

  const parseAddress = (ukAddr: UKAddress): ParsedAddress => {
    const houseNumberMatch = ukAddr.line_1?.match(/^(\d+[A-Za-z]?)/);
    const houseNumber = houseNumberMatch ? houseNumberMatch[1] : '';
    const street = ukAddr.street || ukAddr.line_1?.replace(/^\d+[A-Za-z]?\s*/, '') || '';

    return {
      houseNumber: houseNumber || ukAddr.building_number || '',
      buildingName: ukAddr.building_name || ukAddr.line_2 || '',
      street: street,
      city: ukAddr.post_town || '',
      postcode: ukAddr.postcode || '',
      county: ukAddr.county || '',
      fullAddress: ukAddr.fullAddress || '',
      latitude: ukAddr.latitude,
      longitude: ukAddr.longitude
    };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    setIsOpen(true);
    setIsAddressSelected(false);
    setShowManualEntry(false);
    setErrorMessage(null);
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleManualEntry = () => {
    setShowManualEntry(true);
    setIsOpen(false);
    setIsAddressSelected(true);
    
    const parts = query.split(',').map(p => p.trim());
    const parsedAddress: ParsedAddress = {
      houseNumber: '',
      buildingName: '',
      street: parts[0] || '',
      city: parts[1] || '',
      postcode: parts[2] || '',
      county: '',
      fullAddress: query,
      latitude: undefined,
      longitude: undefined
    };
    
    onSelect(parsedAddress);
  };

  return (
    <div className={`relative ${className}`} ref={wrapperRef}>
      {label && (
        <label className="block text-[15px] font-semibold text-slate-800 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        <MapPin className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
          isAddressSelected ? 'text-green-500' : 'text-gray-400'
        }`} />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.length >= MIN_CHARS && setIsOpen(true)}
          placeholder={
            !isConfigured 
              ? "Type address and click 'Use Manual Entry'" 
              : placeholder
          }
          disabled={false}
          className={`w-full pl-11 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-[15px] font-medium ${
            isAddressSelected 
              ? 'border-green-400 bg-green-50/30 text-green-900' 
              : !isConfigured
              ? 'border-amber-300 bg-amber-50/30'
              : 'border-gray-300 bg-white'
          }`}
        />
        
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

      {!isConfigured && !isCheckingConfig && query.length > 0 && (
        <div className="mt-2">
          <button
            onClick={handleManualEntry}
            className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
          >
            <Edit3 className="w-4 h-4" />
            Enter Address Manually
          </button>
        </div>
      )}
      
      {isCheckingConfig && (
        <p className="mt-2 text-sm text-gray-600 font-medium flex items-center gap-1">
          <Loader2 className="w-3 h-3 animate-spin" />
          <span>Loading...</span>
        </p>
      )}

      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-96 overflow-hidden">
          <div className="max-h-80 overflow-y-auto">
            {results.map((result, index) => (
              <button
                key={result.id || index}
                onClick={() => handleSelect(result)}
                className="w-full text-left px-4 py-3 hover:bg-blue-50 active:bg-blue-100 flex items-start gap-3 border-b border-gray-100 last:border-0 transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Home className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-semibold text-gray-900 group-hover:text-blue-900">
                    {result.address.split(',')[0]}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {result.address.split(',').slice(1).join(', ')}
                  </p>
                </div>
              </button>
            ))}
          </div>
          
          <button
            onClick={handleManualEntry}
            className="w-full px-4 py-3 bg-gradient-to-r from-gray-50 to-blue-50 hover:from-gray-100 hover:to-blue-100 text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-2 transition-all border-t-2 border-gray-200"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Can't find your address? Enter manually
          </button>
          
          <div className="px-3 py-2 bg-gray-50 text-[10px] text-right text-gray-400 border-t border-gray-100 flex items-center justify-between">
            <span className="text-gray-500">Powered by {ukAddressService.getCurrentProvider()}</span>
            <span className="text-gray-400">{results.length} result{results.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      )}
      
      {isOpen && !isLoading && results.length === 0 && query.length >= MIN_CHARS && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden">
          <div className="px-4 py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-700 mb-1">No addresses found</p>
            <p className="text-xs text-gray-500">Try a different postcode or address</p>
          </div>
          <button
            onClick={handleManualEntry}
            className="w-full px-4 py-3 bg-gradient-to-r from-gray-50 to-blue-50 hover:from-gray-100 hover:to-blue-100 text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-2 transition-all border-t-2 border-gray-200"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Enter address manually instead
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="absolute z-50 w-full mt-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <p className="text-xs text-red-700">{errorMessage}</p>
        </div>
      )}
    </div>
  );
}
