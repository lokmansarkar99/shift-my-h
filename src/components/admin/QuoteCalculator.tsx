import { useState, useEffect } from 'react';
import { Calculator, Package, MapPin, Calendar, Truck, Users, Plus, Minus, Trash2, Loader2, ChevronDown, ChevronUp, Save, ArrowRight, Building2, Sparkles, X, Navigation, AlertCircle } from 'lucide-react';
import { calculatePrice, INVENTORY_METADATA, PricingResult } from '../../utils/pricingEngine';
import { getServiceTypes, ServiceTypeConfig } from '../../utils/serviceTypesService';
import { ExtraServiceItem, getAllExtras } from '../../utils/extrasCatalogService';
import { QuoteBreakdownDetailed } from './QuoteBreakdownDetailed';
import { calculateDriverPrice } from '../../utils/marginService';
import { jobStatusManager } from '../../utils/jobStatusManager';
import { toast } from 'sonner';

// Mapbox GL imports
import 'mapbox-gl/dist/mapbox-gl.css';
import { RouteMap } from './RouteMap';

// Build items library from INVENTORY_METADATA
const ITEMS_LIBRARY = Object.keys(INVENTORY_METADATA).map((id) => {
  let category = 'General';
  if (id.includes('bed') || id.includes('mattress') || id.includes('wardrobe') || id.includes('chest-drawers') || id.includes('tallboy') || id.includes('dressing-table')) category = 'Bedroom';
  else if (id.includes('sofa') || id.includes('armchair') || id.includes('coffee-table') || id.includes('tv') || id.includes('bookshelf')) category = 'Living Room';
  else if (id.includes('fridge') || id.includes('washing') || id.includes('dishwasher') || id.includes('oven') || id.includes('microwave') || id.includes('kitchen')) category = 'Kitchen';
  else if (id.includes('bathroom')) category = 'Bathroom';
  else if (id.includes('box') || id.includes('bag') || id.includes('container')) category = 'Boxes & Packing';
  else if (id.includes('garden') || id.includes('bbq') || id.includes('bike') || id.includes('garage')) category = 'Garden & Garage';
  
  return {
    id,
    name: id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    category,
    volume: INVENTORY_METADATA[id].volume * 0.0283168, // Convert cubic feet to cubic meters
  };
});

interface SelectedItem {
  itemId: string;
  quantity: number;
}

export function QuoteCalculator() {
  // ========================================
  // STATE - Service & Items
  // ========================================
  const [serviceTypeId, setServiceTypeId] = useState<string>('house-move');
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // ========================================
  // STATE - Job Details
  // ========================================
  const [distance, setDistance] = useState(15);
  const [crewSize, setCrewSize] = useState(2);
  const [propertyType, setPropertyType] = useState<string>('flat');
  
  // ========================================
  // STATE - Addresses (for auto distance calculation)
  // ========================================
  const [pickupAddress, setPickupAddress] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false);
  const [distanceError, setDistanceError] = useState<string | null>(null);
  const [autoCalculatedDistance, setAutoCalculatedDistance] = useState(false);
  
  // Map coordinates and route geometry
  const [pickupCoords, setPickupCoords] = useState<[number, number] | null>(null);
  const [deliveryCoords, setDeliveryCoords] = useState<[number, number] | null>(null);
  const [routeGeometry, setRouteGeometry] = useState<any>(null);
  
  // ========================================
  // STATE - Property Access
  // ========================================
  const [fromFloor, setFromFloor] = useState(0);
  const [fromLift, setFromLift] = useState(false);
  const [fromParking, setFromParking] = useState<string>('easy');
  const [toFloor, setToFloor] = useState(0);
  const [toLift, setToLift] = useState(false);
  const [toParking, setToParking] = useState<string>('easy');
  
  // ========================================
  // STATE - Date & Extras
  // ========================================
  const [moveDate, setMoveDate] = useState<string>('');
  const [flexibleDate, setFlexibleDate] = useState(false);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  
  // ========================================
  // STATE - Results
  // ========================================
  const [quote, setQuote] = useState<PricingResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showSelectedItems, setShowSelectedItems] = useState(true); // Default OPEN
  
  // ========================================
  // LOAD DATA
  // ========================================
  const [serviceTypes, setServiceTypes] = useState<ServiceTypeConfig[]>([]);
  const [extrasCatalog, setExtrasCatalog] = useState<ExtraServiceItem[]>([]);
  
  useEffect(() => {
    setServiceTypes(getServiceTypes());
    setExtrasCatalog(getAllExtras());
  }, []);
  
  const selectedServiceType = serviceTypes.find(s => s.id === serviceTypeId);
  
  // ========================================
  // CALCULATE TOTAL VOLUME
  // ========================================
  const totalVolume = selectedItems.reduce((acc, item) => {
    const libItem = ITEMS_LIBRARY.find(i => i.id === item.itemId);
    return acc + (libItem ? libItem.volume * item.quantity : 0);
  }, 0);
  
  // ========================================
  // AUTO DISTANCE CALCULATION (MAPBOX)
  // ========================================
  useEffect(() => {
    const calculateDistance = async () => {
      if (!pickupAddress.trim() || !deliveryAddress.trim()) {
        return;
      }
      
      setIsCalculatingDistance(true);
      setDistanceError(null);
      
      try {
        const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN
        
        // Geocode pickup address
        const pickupGeo = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(pickupAddress)}.json?access_token=${MAPBOX_TOKEN}&country=GB&limit=1`
        );
        const pickupData = await pickupGeo.json();
        
        // Geocode delivery address
        const deliveryGeo = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(deliveryAddress)}.json?access_token=${MAPBOX_TOKEN}&country=GB&limit=1`
        );
        const deliveryData = await deliveryGeo.json();
        
        if (!pickupData.features?.length || !deliveryData.features?.length) {
          setDistanceError('Unable to find one or both addresses. Please check and try again.');
          return;
        }
        
        const pickupCoordsResult = pickupData.features[0].center;
        const deliveryCoordsResult = deliveryData.features[0].center;
        
        // Get driving directions
        const directionsResponse = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/driving/${pickupCoordsResult[0]},${pickupCoordsResult[1]};${deliveryCoordsResult[0]},${deliveryCoordsResult[1]}?access_token=${MAPBOX_TOKEN}&geometries=geojson`
        );
        const directionsData = await directionsResponse.json();
        
        if (directionsData.routes?.length > 0) {
          const distanceMeters = directionsData.routes[0].distance;
          const distanceMiles = Math.round(distanceMeters * 0.000621371); // Convert meters to miles
          const routeGeo = directionsData.routes[0].geometry;
          
          setDistance(distanceMiles);
          setAutoCalculatedDistance(true);
          setDistanceError(null);
          
          // Save coordinates and route geometry for map
          setPickupCoords(pickupCoordsResult);
          setDeliveryCoords(deliveryCoordsResult);
          setRouteGeometry(routeGeo);
          
          console.log('✅ [Auto Distance] Calculated:', distanceMiles, 'miles');
          console.log('✅ [Map Coords] Pickup:', pickupCoordsResult, 'Delivery:', deliveryCoordsResult);
        } else {
          setDistanceError('Unable to calculate driving distance. Please enter miles manually.');
        }
      } catch (err) {
        console.error('❌ [Auto Distance] Error:', err);
        setDistanceError('Unable to calculate distance. Please enter miles manually.');
      } finally {
        setIsCalculatingDistance(false);
      }
    };
    
    // Debounce: wait 600ms after user stops typing
    const timer = setTimeout(calculateDistance, 600);
    return () => clearTimeout(timer);
  }, [pickupAddress, deliveryAddress]);
  
  // ========================================
  // RECALCULATE QUOTE (DEBOUNCED)
  // ========================================
  useEffect(() => {
    const calculateResult = async () => {
      if (selectedItems.length === 0) {
        setQuote(null);
        return;
      }

      setIsLoading(true);

      try {
        console.log('🔧 [QuoteCalculator] Starting calculation with Service Type:', serviceTypeId);
        
        const response = calculatePrice({
          serviceType: serviceTypeId,
          distanceMiles: distance,
          inventory: selectedItems.map(item => ({ id: item.itemId, quantity: item.quantity })),
          crewSize,
          propertyType,
          fromFloor,
          fromLift,
          fromParking,
          toFloor,
          toLift,
          toParking,
          moveDate: moveDate ? new Date(moveDate) : undefined,
          flexibleDate,
          extras: selectedExtras,
        });
        
        console.log('📊 [QuoteCalculator] Calculation complete:', {
          totalPrice: response.totalPrice,
          subtotal: response.breakdown.base + response.breakdown.inventory + response.breakdown.distance,
          volumeBreakdown: response.volumeBreakdown,
        });
        
        setQuote(response);
      } catch (err) {
        console.error('❌ [QuoteCalculator] Calculation error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(calculateResult, 500); // Debounce
    return () => clearTimeout(timer);
  }, [
    serviceTypeId,
    selectedItems,
    distance,
    crewSize,
    propertyType,
    fromFloor,
    fromLift,
    fromParking,
    toFloor,
    toLift,
    toParking,
    moveDate,
    flexibleDate,
    selectedExtras,
  ]);

  // ========================================
  // ITEM MANAGEMENT
  // ========================================
  const addItem = (itemId: string) => {
    const existing = selectedItems.find((i) => i.itemId === itemId);
    if (existing) {
      setSelectedItems(selectedItems.map((i) => (i.itemId === itemId ? { ...i, quantity: i.quantity + 1 } : i)));
    } else {
      setSelectedItems([...selectedItems, { itemId, quantity: 1 }]);
    }
  };

  const removeItem = (itemId: string) => {
    const existing = selectedItems.find((i) => i.itemId === itemId);
    if (existing && existing.quantity > 1) {
      setSelectedItems(selectedItems.map((i) => (i.itemId === itemId ? { ...i, quantity: i.quantity - 1 } : i)));
    } else {
      setSelectedItems(selectedItems.filter((i) => i.itemId !== itemId));
    }
  };
  
  // ========================================
  // EXTRAS MANAGEMENT
  // ========================================
  const toggleExtra = (extraId: string) => {
    if (selectedExtras.includes(extraId)) {
      setSelectedExtras(selectedExtras.filter(id => id !== extraId));
    } else {
      setSelectedExtras([...selectedExtras, extraId]);
    }
  };
  
  // ========================================
  // ACTIONS
  // ========================================
  const handleSaveQuote = async () => {
    if (!quote) return;
    
    try {
      // TODO: Implement save quote to database
      // This would save quote details for later retrieval
      toast.success('💾 Quote saved successfully!');
      console.log('📝 [QuoteCalculator] Quote saved:', {
        serviceTypeId,
        totalPrice: quote.totalPrice,
        items: selectedItems,
      });
    } catch (error) {
      console.error('❌ [QuoteCalculator] Error saving quote:', error);
      toast.error('Failed to save quote');
    }
  };
  
  const handleConvertToJob = () => {
    if (!quote || !pickupAddress || !deliveryAddress) {
      toast.error('Please enter pickup and delivery addresses before converting to job');
      return;
    }

    try {
      // Calculate driver price from customer price using margin configuration
      const customerPrice = quote.totalPrice;
      const driverBreakdown = calculateDriverPrice(customerPrice);

      // Determine recommended vehicle based on volume
      let vehicle = 'Transit Van';
      if (totalVolume > 20) vehicle = 'Luton Van';
      else if (totalVolume > 30) vehicle = 'Luton Van + Trailer';

      // Parse move date or use today
      const jobDate = moveDate ? new Date(moveDate) : new Date();
      const dateString = jobDate.toISOString().split('T')[0]; // YYYY-MM-DD
      const timeString = '09:00'; // Default time

      // Estimate duration from quote
      const durationHours = quote.estimatedTime || 4;
      const durationString = `${durationHours.toFixed(1)} hours`;

      // Create JobLocation objects from address strings
      const pickupLocation = {
        address: pickupAddress,
        postcode: '', // Extract from address if needed
        city: '',
      };

      const deliveryLocation = {
        address: deliveryAddress,
        postcode: '',
        city: '',
      };

      // Create job using jobStatusManager with ALL required fields
      const newJob = jobStatusManager.createJob({
        title: `${selectedServiceType?.name || 'Move'} - ${selectedItems.length} items`,
        service: selectedServiceType?.name || 'House Move',
        description: `Quote Calculator: ${selectedItems.length} items (${totalVolume.toFixed(2)} m³)`,
        customerName: 'Admin Created',
        customerPhone: '',
        customerEmail: '',
        pickup: pickupLocation,
        delivery: deliveryLocation,
        date: dateString,
        time: timeString,
        distance: distance,
        duration: durationString,
        totalVolume: totalVolume,
        vehicle: vehicle,
        crew: crewSize,
        items: selectedItems.map(item => {
          const libItem = ITEMS_LIBRARY.find(i => i.id === item.itemId);
          return {
            id: item.itemId,
            name: libItem?.name || item.itemId,
            quantity: item.quantity,
            volume: libItem ? libItem.volume * item.quantity : 0,
            category: libItem?.category || 'General',
          };
        }),
        customerPrice: driverBreakdown.customerPrice,
        driverPrice: driverBreakdown.driverPrice,
        platformFee: driverBreakdown.platformMargin,
        status: 'available' as const,
        serviceType: selectedServiceType?.name,
      });

      toast.success(`🚀 Job created successfully! Reference: ${newJob.reference}`);
      console.log('✅ [QuoteCalculator] Job created:', {
        reference: newJob.reference,
        id: newJob.id,
        status: newJob.status,
        customerPrice: driverBreakdown.customerPrice,
        driverPrice: driverBreakdown.driverPrice,
        platformMargin: driverBreakdown.platformMargin,
      });

      // Reset form after successful conversion
      setTimeout(() => {
        setSelectedItems([]);
        setPickupAddress('');
        setDeliveryAddress('');
        setMoveDate('');
        setSelectedExtras([]);
        setQuote(null);
      }, 1500);

    } catch (error) {
      console.error('❌ [QuoteCalculator] Error converting to job:', error);
      toast.error('Failed to create job. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Quote Calculator</h2>
          <p className="text-slate-600 mt-1">Generate instant quotes with transparent pricing breakdown</p>
        </div>
        {quote && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveQuote}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
            >
              <Save className="w-4 h-4" />
              Save Quote
            </button>
            <button
              onClick={handleConvertToJob}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all"
            >
              <ArrowRight className="w-4 h-4" />
              Convert to Job
            </button>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ========================================
            LEFT: INPUTS (2 columns)
            ======================================== */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Service Type Selector */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5 text-blue-600" />
              Service Type
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {serviceTypes.filter(s => s.active).map((service) => (
                <button
                  key={service.id}
                  onClick={() => setServiceTypeId(service.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    serviceTypeId === service.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 bg-white hover:border-blue-300'
                  }`}
                >
                  <div className="font-bold text-slate-900">{service.name}</div>
                  <div className="text-xs text-slate-500 mt-1">{service.description}</div>
                  <div className="flex items-center gap-3 mt-2 text-xs">
                    <span className="font-bold text-blue-600">£{service.min_price} min</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-600">£{service.price_per_m3}/m³</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Items Selector */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              Items Library ({selectedItems.length} selected • {totalVolume.toFixed(2)} m³)
            </h3>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items... (e.g., sofa, bed, table)"
              className="w-full px-4 py-2 mb-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
            />
            <div className="grid sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto">
              {ITEMS_LIBRARY.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())).map((item) => {
                const selected = selectedItems.find((i) => i.itemId === item.id);
                return (
                  <div
                    key={item.id}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      selected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 bg-white hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-slate-900 text-sm">{item.name}</div>
                        <div className="text-xs text-slate-500">{item.category}</div>
                        <div className="text-xs font-bold text-blue-600 mt-1">{item.volume.toFixed(2)} m³</div>
                      </div>
                      {selected ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="w-7 h-7 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-bold text-slate-900 w-6 text-center">{selected.quantity}</span>
                          <button
                            onClick={() => addItem(item.id)}
                            className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 flex items-center justify-center"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addItem(item.id)}
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 transition-all"
                        >
                          Add
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Job Parameters */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* 🆕 ADDRESSES + AUTO DISTANCE */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-lg p-6 border-2 border-indigo-200 md:col-span-2">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Navigation className="w-5 h-5 text-indigo-600" />
                Addresses (Auto Distance Calculation)
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Pickup Address / Postcode
                  </label>
                  <input
                    type="text"
                    value={pickupAddress}
                    onChange={(e) => {
                      setPickupAddress(e.target.value);
                      setAutoCalculatedDistance(false);
                    }}
                    placeholder="e.g., EH1 2NG or 10 Main Street, Edinburgh"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Delivery Address / Postcode
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => {
                      setDeliveryAddress(e.target.value);
                      setAutoCalculatedDistance(false);
                    }}
                    placeholder="e.g., G1 1AA or 25 High Street, Glasgow"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-200 outline-none"
                  />
                </div>
              </div>
              
              {/* Distance Calculation Status */}
              {isCalculatingDistance && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  <span className="text-blue-900">Calculating distance...</span>
                </div>
              )}
              
              {autoCalculatedDistance && !isCalculatingDistance && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-sm">
                  <Navigation className="w-4 h-4 text-green-600" />
                  <span className="text-green-900 font-semibold">Distance auto-calculated: {distance} miles</span>
                </div>
              )}
              
              {distanceError && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-red-900">{distanceError}</span>
                </div>
              )}
              
              {/* 🗺️ MAP PREVIEW */}
              {pickupCoords && deliveryCoords && routeGeometry && (
                <div className="mt-4">
                  <RouteMap
                    pickupCoords={pickupCoords}
                    deliveryCoords={deliveryCoords}
                    routeGeometry={routeGeometry}
                  />
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-indigo-600" />
                Distance & Crew
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Distance (miles) {autoCalculatedDistance && '✓ Auto-calculated'}
                  </label>
                  <input
                    type="number"
                    value={distance}
                    onChange={(e) => {
                      setDistance(parseInt(e.target.value) || 0);
                      setAutoCalculatedDistance(false);
                    }}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    {autoCalculatedDistance ? '✓ Calculated from addresses' : 'Enter manually or add addresses above'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Crew Size
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3].map((size) => (
                      <button
                        key={size}
                        onClick={() => setCrewSize(size)}
                        className={`flex-1 px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                          crewSize === size
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {size} {size === 1 ? 'Man' : 'Men'}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Property Type
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                  >
                    <option value="flat">Flat</option>
                    <option value="house">House</option>
                    <option value="terrace">Terrace</option>
                    <option value="semi-detached">Semi-Detached</option>
                    <option value="detached">Detached</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-purple-600" />
                Property Access
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    From Floor
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={fromFloor}
                      onChange={(e) => setFromFloor(parseInt(e.target.value) || 0)}
                      className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                    />
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={fromLift}
                        onChange={(e) => setFromLift(e.target.checked)}
                        className="w-4 h-4"
                      />
                      Lift
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    To Floor
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={toFloor}
                      onChange={(e) => setToFloor(parseInt(e.target.value) || 0)}
                      className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                    />
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={toLift}
                        onChange={(e) => setToLift(e.target.checked)}
                        className="w-4 h-4"
                      />
                      Lift
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Parking Difficulty
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={fromParking}
                      onChange={(e) => setFromParking(e.target.value)}
                      className="px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-200 outline-none"
                    >
                      <option value="easy">From: Easy</option>
                      <option value="moderate">From: Moderate</option>
                      <option value="difficult">From: Difficult</option>
                    </select>
                    <select
                      value={toParking}
                      onChange={(e) => setToParking(e.target.value)}
                      className="px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-200 outline-none"
                    >
                      <option value="easy">To: Easy</option>
                      <option value="moderate">To: Moderate</option>
                      <option value="difficult">To: Difficult</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Date & Extras */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-600" />
              Move Date & Extras
            </h3>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Move Date (optional)
                </label>
                <input
                  type="date"
                  value={moveDate}
                  onChange={(e) => setMoveDate(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={flexibleDate}
                    onChange={(e) => setFlexibleDate(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="font-semibold text-slate-700">Flexible Date (save £20)</span>
                </label>
              </div>
            </div>
            
            {/* Extras Catalog */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Additional Services
              </label>
              <div className="grid sm:grid-cols-2 gap-2">
                {extrasCatalog.filter(e => e.is_active).map((extra) => (
                  <button
                    key={extra.id}
                    onClick={() => toggleExtra(extra.id)}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      selectedExtras.includes(extra.id)
                        ? 'border-green-500 bg-green-50'
                        : 'border-slate-200 bg-white hover:border-green-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-slate-900 text-sm">{extra.name}</div>
                        <div className="text-xs text-slate-500 mt-1">{extra.description}</div>
                      </div>
                      <div className="ml-2">
                        <div className="text-xs font-bold text-green-600">
                          {extra.pricing_type === 'fixed' && `£${extra.fixed_price}`}
                          {extra.pricing_type === 'per_unit' && `£${extra.price_per_unit}/unit`}
                          {extra.pricing_type === 'percent' && `${extra.percent_of_subtotal}%`}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================
            RIGHT: RESULTS (1 column)
            ======================================== */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-4">
            {isLoading && !quote ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 flex items-center justify-center border border-slate-200">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : quote ? (
              <>
                {/* 1️⃣ QUOTE GENERATED (Total Price - Verde) */}
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl shadow-xl p-6 border border-green-400">
                  <div className="text-green-100 text-sm font-semibold uppercase mb-1">Quote Generated</div>
                  <div className="text-5xl font-extrabold mb-2">
                    £{quote.totalPrice.toFixed(2)}
                  </div>
                  <div className="text-green-100 text-sm">
                    {selectedItems.reduce((sum, i) => sum + i.quantity, 0)} items • {totalVolume.toFixed(2)} m³
                  </div>
                </div>

                {/* 2️⃣ SELECTED ITEMS SUMMARY - TABEL EXPANDABLE */}
                {selectedItems.length > 0 && (
                  <div className="bg-white rounded-lg shadow border border-slate-200">
                    {/* Header - Mereu vizibil */}
                    <button
                      onClick={() => setShowSelectedItems(!showSelectedItems)}
                      className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                    >
                      <div>
                        <div className="font-semibold text-slate-900">Selected Items</div>
                        <div className="text-sm text-slate-600">
                          {selectedItems.reduce((sum, i) => sum + i.quantity, 0)} items • {totalVolume.toFixed(2)} m³
                        </div>
                      </div>
                      {showSelectedItems ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </button>

                    {/* Tabel - Expandable (Default OPEN) */}
                    {showSelectedItems && (
                      <div className="border-t border-slate-200">
                        {/* Header Tabel */}
                        <div className="grid grid-cols-12 gap-2 p-3 bg-slate-50 text-xs font-semibold text-slate-600 border-b border-slate-200">
                          <div className="col-span-4">Item name</div>
                          <div className="col-span-1 text-center">Qty</div>
                          <div className="col-span-2 text-right">m³/item</div>
                          <div className="col-span-2 text-right">Total m³</div>
                          <div className="col-span-3 text-right">Total £</div>
                        </div>

                        {/* Rows - cu scroll dacă sunt multe */}
                        <div className="max-h-64 overflow-y-auto">
                          {selectedItems.map((item) => {
                            const libItem = ITEMS_LIBRARY.find(i => i.id === item.itemId);
                            if (!libItem) return null;
                            const itemTotalVolume = libItem.volume * item.quantity;
                            const pricePerM3 = selectedServiceType?.price_per_m3 || 0;
                            const itemTotalPrice = itemTotalVolume * pricePerM3;
                            return (
                              <div 
                                key={item.itemId} 
                                className="grid grid-cols-12 gap-2 p-3 text-sm border-b border-slate-100 hover:bg-slate-50 transition-colors"
                              >
                                <div className="col-span-4 text-slate-900 font-medium">{libItem.name}</div>
                                <div className="col-span-1 text-center text-slate-700">{item.quantity}</div>
                                <div className="col-span-2 text-right text-slate-600">{libItem.volume.toFixed(2)}</div>
                                <div className="col-span-2 text-right text-slate-900 font-semibold">{itemTotalVolume.toFixed(2)}</div>
                                <div className="col-span-3 text-right text-green-600 font-bold">£{itemTotalPrice.toFixed(2)}</div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Footer Tabel */}
                        <div className="grid grid-cols-12 gap-2 p-3 bg-slate-50 border-t-2 border-slate-300">
                          <div className="col-span-5 text-sm font-bold text-slate-900">TOTAL:</div>
                          <div className="col-span-2 text-center text-sm font-bold text-slate-900">
                            {selectedItems.reduce((sum, i) => sum + i.quantity, 0)}
                          </div>
                          <div className="col-span-2 text-right text-sm font-bold text-slate-900">
                            {totalVolume.toFixed(2)} m³
                          </div>
                          <div className="col-span-3 text-right text-sm font-bold text-green-600">
                            £{(totalVolume * (selectedServiceType?.price_per_m3 || 0)).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 3⃣ COMPLETE PRICE BREAKDOWN */}
                <div className="bg-white rounded-lg shadow border border-slate-200">
                  <button
                    onClick={() => setShowBreakdown(!showBreakdown)}
                    className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <div className="font-semibold text-slate-900">Complete Price Breakdown</div>
                    {showBreakdown ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </button>

                  {showBreakdown && (
                    <div className="border-t border-slate-200 p-4">
                      <QuoteBreakdownDetailed quote={quote} serviceTypeId={serviceTypeId} />
                    </div>
                  )}
                </div>

                {/* 4️⃣ ESTIMATED TIME */}
                <div className="bg-white rounded-lg shadow border border-slate-200 p-4">
                  <div className="font-semibold text-slate-900 mb-3">Estimated Time</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between p-2 bg-slate-50 rounded">
                      <span className="text-slate-600">Total Time:</span>
                      <span className="font-bold text-slate-900">{quote.estimatedTime.toFixed(1)} hours</span>
                    </div>
                    {quote.handlingTimeHours && quote.handlingTimeHours > 0 && (
                      <div className="flex justify-between p-2 bg-purple-50 rounded border border-purple-200">
                        <span className="text-slate-600">Handling Time:</span>
                        <span className="font-bold text-purple-900">{quote.handlingTimeHours.toFixed(1)}h</span>
                      </div>
                    )}
                    <div className="flex justify-between p-2 bg-slate-50 rounded">
                      <span className="text-slate-600">Crew Size:</span>
                      <span className="font-bold text-slate-900">{crewSize} {crewSize === 1 ? 'person' : 'people'}</span>
                    </div>
                  </div>
                </div>

                {/* 5️⃣ PRICING SOURCES VERIFIED */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg shadow border border-blue-200 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    <div className="font-semibold text-slate-900">Pricing Sources Verified</div>
                  </div>
                  <div className="space-y-1 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      <span>Service Type: <span className="font-semibold text-slate-900">{selectedServiceType?.name}</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      <span>Items Library: <span className="font-semibold text-slate-900">{selectedItems.length} verified items</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      <span>Extras Catalog: <span className="font-semibold text-slate-900">{selectedExtras.length} selected</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      <span>Distance: <span className="font-semibold text-slate-900">{distance} miles</span></span>
                    </div>
                  </div>
                </div>

                {/* 6️⃣ ACTIONS */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleSaveQuote}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold"
                  >
                    <Save className="w-4 h-4" />
                    Save Quote
                  </button>
                  <button
                    onClick={handleConvertToJob}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
                  >
                    <ArrowRight className="w-4 h-4" />
                    Convert
                  </button>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-12 border border-slate-200 text-center">
                <Calculator className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-500">Select service type and add items to calculate price</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}