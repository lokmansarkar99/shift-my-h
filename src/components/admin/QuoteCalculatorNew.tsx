import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calculator, 
  Package, 
  MapPin, 
  Users, 
  Plus, 
  Minus, 
  Search, 
  X,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Bed,
  Sofa,
  UtensilsCrossed,
  ShowerHead,
  Box,
  Trees,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Save,
  Send,
  RefreshCw,
  Edit3,
} from 'lucide-react';
import { calculatePrice, INVENTORY_METADATA, PricingResult } from '../../utils/pricingEngine';
import { getServiceTypes } from '../../utils/serviceTypesService';
import { getActiveExtras, ExtraServiceItem } from '../../utils/extrasCatalogService';
import { savePricingResult } from '../../utils/pricingResultsService';
import { createQuote, updateQuote, QuoteRecord } from '../../utils/quotesService';
import { convertQuoteToJob } from '../../utils/jobsService';
import { validateQuoteGeneration } from '../../utils/quoteValidation';
import { QuoteBreakdownDetailed } from './QuoteBreakdownDetailed';

// ============================================================
// ITEMS LIBRARY - BUILD FROM INVENTORY_METADATA
// ============================================================

interface ItemLibraryEntry {
  id: string;
  name: string;
  category: string;
  volume: number;
  weight: number;
}

// Build items library from INVENTORY_METADATA with proper categorization
const buildItemsLibrary = (): ItemLibraryEntry[] => {
  return Object.keys(INVENTORY_METADATA).map((id) => {
    const metadata = INVENTORY_METADATA[id];
    
    // Smart categorization based on ID
    let category = 'General';
    
    // Bedroom items
    if (
      id.includes('bed') || id.includes('mattress') || id.includes('wardrobe') || 
      id.includes('chest-drawers') || id.includes('tallboy') || id.includes('dressing-table') ||
      id.includes('bedside') || id.includes('headboard') || id.includes('mirror')
    ) {
      category = 'Bedroom';
    }
    // Living room items
    else if (
      id.includes('sofa') || id.includes('armchair') || id.includes('recliner') ||
      id.includes('coffee-table') || id.includes('side-table') || id.includes('tv') ||
      id.includes('bookshelf') || id.includes('sideboard') || id.includes('display-cabinet')
    ) {
      category = 'Living Room';
    }
    // Kitchen items
    else if (
      id.includes('fridge') || id.includes('freezer') || id.includes('washing') || 
      id.includes('dishwasher') || id.includes('oven') || id.includes('microwave') ||
      id.includes('kitchen') || id.includes('dining') || id.includes('chair') && !id.includes('armchair')
    ) {
      category = 'Kitchen';
    }
    // Bathroom items
    else if (id.includes('bathroom') || id.includes('laundry-basket')) {
      category = 'Bathroom';
    }
    // Boxes & Packing (EXCLUDE - these go to Extras Catalog!)
    else if (
      id.includes('box') || id.includes('bag') || id.includes('container') ||
      id.includes('bubble-wrap') || id.includes('packing') || id.includes('stretch-wrap')
    ) {
      category = 'Boxes & Packing';
    }
    // Garden & Garage
    else if (
      id.includes('garden') || id.includes('bbq') || id.includes('bike') ||
      id.includes('lawnmower') || id.includes('tools') || id.includes('garage') ||
      id.includes('shed') || id.includes('wheelbarrow') || id.includes('ladder')
    ) {
      category = 'Garden & Garage';
    }
    // Other Delivery
    else if (id.includes('other-') || id.includes('pallet') || id.includes('crate') || id.includes('industrial') || id.includes('machine')) {
      category = 'Other Delivery';
    }
    
    // Format name
    const name = id
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    
    return {
      id,
      name,
      category,
      volume: metadata.volume,
      weight: metadata.weight,
    };
  });
};

const ITEMS_LIBRARY = buildItemsLibrary();

// Category icons
const CATEGORY_ICONS: Record<string, any> = {
  'Bedroom': Bed,
  'Living Room': Sofa,
  'Kitchen': UtensilsCrossed,
  'Bathroom': ShowerHead,
  'Boxes & Packing': Box,
  'Garden & Garage': Trees,
  'Other Delivery': Package, // Fallback to Package if Truck is not imported
  'General': Package,
};

// ============================================================
// QUOTE CALCULATOR COMPONENT
// ============================================================

interface SelectedItem {
  id: string;
  quantity: number;
}

interface SelectedExtra {
  id: string;
  quantity: number;
}

export function QuoteCalculatorNew() {
  // Service Type
  const [serviceTypeId, setServiceTypeId] = useState<string>('house-move');
  
  // Items
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('Bedroom');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Parameters
  const [distance, setDistance] = useState<number>(15);
  const [crewSize, setCrewSize] = useState<number>(2);
  
  // Extras
  const [selectedExtras, setSelectedExtras] = useState<SelectedExtra[]>([]);
  
  // Results
  const [quote, setQuote] = useState<PricingResult | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showSelectedItems, setShowSelectedItems] = useState<boolean>(true); // Default OPEN

  // Save Quote state
  const [savedQuote, setSavedQuote] = useState<QuoteRecord | null>(null);
  const [showCustomerModal, setShowCustomerModal] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  
  // Toast notification state
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  // Customer info for saving (optional for admin calculator)
  const [customerName, setCustomerName] = useState<string>('Walk-in Customer');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [pickupAddress, setPickupAddress] = useState<string>('');
  const [pickupPostcode, setPickupPostcode] = useState<string>('');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [deliveryPostcode, setDeliveryPostcode] = useState<string>('');
  
  // ✅ NEW: Structured Address Fields for PROFESSIONAL Logistics
  const [pickupLine1, setPickupLine1] = useState<string>('');
  const [pickupCity, setPickupCity] = useState<string>('');
  const [deliveryLine1, setDeliveryLine1] = useState<string>('');
  const [deliveryCity, setDeliveryCity] = useState<string>('');
  
  // Get service types and extras
  const serviceTypes = getServiceTypes();
  const extras = getActiveExtras();
  const serviceConfig = serviceTypes.find(st => st.id === serviceTypeId);

  // ✅ Validate quote has valid total (prevent NaN)
  const hasValidQuote = quote && Number.isFinite(quote.totalPrice) && quote.totalPrice > 0;

  // Calculate total volume
  const totalVolume = useMemo(() => {
    return selectedItems.reduce((sum, item) => {
      const itemData = ITEMS_LIBRARY.find(i => i.id === item.id);
      return sum + (itemData?.volume || 0) * item.quantity;
    }, 0);
  }, [selectedItems]);

  // Calculate extras total
  const extrasTotal = useMemo(() => {
    return selectedExtras.reduce((sum, selected) => {
      const extra = extras.find(e => e.id === selected.id);
      if (!extra) return sum;
      
      // ✅ FIX: Use 'price' not 'basePrice' (correct field name from extrasCatalogService)
      const price = extra.price || 0;
      
      if (extra.pricingMode === 'fixed') {
        return sum + price;
      } else if (extra.pricingMode === 'per_unit') {
        return sum + price * selected.quantity;
      }
      return sum;
    }, 0);
  }, [selectedExtras, extras]);

  // Filter items based on category and search
  const filteredItems = useMemo(() => {
    let items = ITEMS_LIBRARY;
    
    // Filter out packing materials (they go to Extras)
    items = items.filter(item => item.category !== 'Boxes & Packing');
    
    // Filter by category
    if (activeCategory !== 'All') {
      items = items.filter(item => item.category === activeCategory);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query)
      );
    }
    
    return items;
  }, [activeCategory, searchQuery]);

  // Get categories (excluding packing materials)
  const categories = useMemo(() => {
    const cats = Array.from(new Set(
      ITEMS_LIBRARY
        .filter(item => item.category !== 'Boxes & Packing')
        .map(item => item.category)
    )).sort();
    return ['All', ...cats];
  }, []);

  // Update crew size when service type changes
  useEffect(() => {
    if (serviceConfig) {
      const defaultCrew = serviceConfig.default_crew || 2;
      // Only set if current crew size is invalid for new service type
      if (crewSize < serviceConfig.min_crew || crewSize > serviceConfig.max_crew) {
        setCrewSize(Math.max(serviceConfig.min_crew, Math.min(defaultCrew, serviceConfig.max_crew)));
      }
    }
  }, [serviceTypeId]); // ✅ Only run when serviceTypeId changes, NOT serviceConfig

  // Validate crew size (removed auto-correction to avoid overriding user selection)
  useEffect(() => {
    if (!serviceConfig) return;
    
    // Just warn, don't auto-correct (let user see the validation state)
    if (crewSize < serviceConfig.min_crew) {
      console.warn(`Crew size ${crewSize} below minimum ${serviceConfig.min_crew} for ${serviceConfig.name}`);
    } else if (crewSize > serviceConfig.max_crew) {
      console.warn(`Crew size ${crewSize} above maximum ${serviceConfig.max_crew} for ${serviceConfig.name}`);
    }
  }, [crewSize, serviceConfig]);

  // ============================================================
  // HANDLERS
  // ============================================================

  const handleAddItem = (itemId: string) => {
    setSelectedItems(prev => {
      const existing = prev.find(i => i.id === itemId);
      if (existing) {
        return prev.map(i => i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { id: itemId, quantity: 1 }];
    });
  };

  const handleUpdateItemQuantity = (itemId: string, delta: number) => {
    setSelectedItems(prev => {
      return prev.map(i => {
        if (i.id === itemId) {
          const newQty = Math.max(0, i.quantity + delta);
          return { ...i, quantity: newQty };
        }
        return i;
      }).filter(i => i.quantity > 0);
    });
  };

  const handleRemoveItem = (itemId: string) => {
    setSelectedItems(prev => prev.filter(i => i.id !== itemId));
  };

  const handleToggleExtra = (extraId: string) => {
    setSelectedExtras(prev => {
      const existing = prev.find(e => e.id === extraId);
      if (existing) {
        return prev.filter(e => e.id !== extraId);
      }
      return [...prev, { id: extraId, quantity: 1 }];
    });
  };

  const handleUpdateExtraQuantity = (extraId: string, delta: number) => {
    setSelectedExtras(prev => {
      return prev.map(e => {
        if (e.id === extraId) {
          const newQty = Math.max(1, e.quantity + delta);
          return { ...e, quantity: newQty };
        }
        return e;
      });
    });
  };

  const handleGenerateQuote = () => {
    setIsGenerating(true);
    
    try {
      // ✅ STEP 1: HARD VALIDATION (NO SILENT FAILURES!)
      console.group('🛡️ [VALIDATION] Quote Generation Validation');
      const validation = validateQuoteGeneration({
        serviceConfig,
        distance,
        crewSize,
        selectedItems,
        customerPhone,
        pickupAddress,
        deliveryAddress,
        checkCustomerData: false, // ✅ Don't check customer data for quote generation (only for job conversion)
      });
      
      console.log('Validation Result:', validation);
      console.groupEnd();
      
      // If validation fails, show errors and STOP
      if (!validation.valid) {
        const errorMessage = validation.errors.join('\n');
        setToast({ type: 'error', message: errorMessage });
        setIsGenerating(false);
        return; // ✅ HARD STOP - do not proceed with invalid data
      }
      
      // Show warnings (but allow continuation)
      if (validation.warnings.length > 0) {
        console.warn('⚠️ Validation Warnings:', validation.warnings);
        // Could show toast with warnings if needed
      }
      
      // ✅ STEP 2: DEBUG LOGGING
      console.group('🔍 [DEBUG] Quote Generation Input');
      console.log('Service Type ID:', serviceTypeId);
      console.log('Distance:', distance);
      console.log('Crew Size:', crewSize);
      console.log('Selected Items:', selectedItems);
      console.log('Selected Extras:', selectedExtras);
      console.log('Service Config:', serviceConfig);
      
      // ✅ CRITICAL: Log service config fields individually
      if (serviceConfig) {
        console.log('  → Service Name:', serviceConfig.name);
        console.log('  → Min Price:', serviceConfig.min_price, typeof serviceConfig.min_price);
        console.log('  → Base Price:', serviceConfig.base_price, typeof serviceConfig.base_price);
        console.log('  → Price per m³:', serviceConfig.price_per_m3, typeof serviceConfig.price_per_m3);
        console.log('  → Price per mile:', serviceConfig.price_per_mile, typeof serviceConfig.price_per_mile);
      } else {
        console.error('❌ SERVICE CONFIG IS NULL/UNDEFINED!');
      }
      console.groupEnd();

      // ✅ STEP 3: CALCULATE PRICE (with validated inputs)
      const result = calculatePrice({
        serviceType: serviceTypeId,
        distanceMiles: distance,
        inventory: selectedItems.map(item => ({
          id: item.id,
          quantity: item.quantity,
        })),
        crewSize: crewSize as 1 | 2 | 3 | 4,
        // ✅ ADD: Crew pricing (optional - uses default if not provided)
        crewPricing: {
          crew1Man: 0,
          crew2Men: 100,
          crew3Men: 150,
        },
        selectedExtras: selectedExtras,
        // Mock property details (can be added later)
        fromFloor: 0,
        fromLift: true,
        toFloor: 0,
        toLift: true,
        fromParking: 'easy',
        toParking: 'easy',
      });

      console.group('✅ [DEBUG] Quote Generation Result');
      console.log('Total Price:', result.totalPrice, typeof result.totalPrice);
      console.log('Base Price:', result.basePrice, typeof result.basePrice);
      console.log('Crew Price:', result.crewPrice, typeof result.crewPrice);
      console.log('Distance Price:', result.distancePrice, typeof result.distancePrice);
      console.log('Inventory Price:', result.inventoryPrice, typeof result.inventoryPrice);
      console.log('Subtotal:', result.subtotal, typeof result.subtotal);
      console.log('Breakdown:', result.breakdown);
      console.log('Full Result:', result);
      
      // ✅ CHECK FOR NaN
      if (!Number.isFinite(result.totalPrice)) {
        console.error('❌ TOTAL PRICE IS NaN OR INFINITE!');
        console.error('  Base:', result.basePrice);
        console.error('  Crew:', result.crewPrice);
        console.error('  Distance:', result.distancePrice);
        console.error('  Inventory:', result.inventoryPrice);
        console.error('  Subtotal:', result.subtotal);
      }
      console.groupEnd();

      setQuote(result);
      
      // ✅ AUTO-SAVE TO PRICING RESULTS (for audit/debugging)
      console.log('💾 [QuoteCalculatorNew] Attempting to save pricing result...');
      savePricingResult({
        customerName: 'Admin Quote Calculator',
        serviceType: serviceConfig?.name || 'Unknown Service',
        distanceMiles: distance,
        crewSize: crewSize,
        pricingResult: result,
      }).then(saved => {
        if (saved) {
          console.log('✅ [QuoteCalculatorNew] Pricing result saved successfully:', saved.id);
        } else {
          console.warn('⚠️ [QuoteCalculatorNew] Pricing result save returned null');
        }
      }).catch(err => {
        console.error('❌ [QuoteCalculatorNew] Failed to save pricing result:', err);
      });
    } catch (error) {
      console.error('Quote generation error:', error);
      alert('Error generating quote. Please check console.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Get selected item details
  const getItemQuantity = (itemId: string): number => {
    return selectedItems.find(i => i.id === itemId)?.quantity || 0;
  };

  // Check if extra is selected
  const isExtraSelected = (extraId: string): boolean => {
    return selectedExtras.some(e => e.id === extraId);
  };

  const getExtraQuantity = (extraId: string): number => {
    return selectedExtras.find(e => e.id === extraId)?.quantity || 1;
  };

  // ============================================================
  // QUOTE ACTIONS HANDLERS
  // ============================================================

  const handleSaveQuote = async () => {
    if (!quote || !hasValidQuote) {
      setToast({ type: 'error', message: '❌ Cannot save invalid quote' });
      return;
    }

    // ✅ VALIDATE: Customer phone is required
    if (!customerPhone || customerPhone.trim() === '') {
      setToast({ type: 'error', message: '❌ Customer phone number is required' });
      return;
    }

    // ✅ VALIDATE: Addresses are required
    if (!pickupAddress || pickupAddress.trim() === '') {
      setToast({ type: 'error', message: '❌ Pickup address is required' });
      return;
    }

    if (!deliveryAddress || deliveryAddress.trim() === '') {
      setToast({ type: 'error', message: '❌ Delivery address is required' });
      return;
    }

    setIsSaving(true);

    try {
      // Prepare quote data
      const quoteData = {
        customer_name: customerName || 'Walk-in Customer',
        customer_email: customerEmail || '',
        customer_phone: customerPhone || '',
        pickup_postcode: pickupPostcode || '',
        pickup_address: pickupAddress || pickupLine1 || '',
        delivery_postcode: deliveryPostcode || '',
        delivery_address: deliveryAddress || deliveryLine1 || '',
        
        // Include structured contact details for Logistics
        contact_details: {
          firstName: customerName?.split(' ')[0] || '',
          lastName: customerName?.split(' ').slice(1).join(' ') || '',
          email: customerEmail || '',
          phone: customerPhone || '',
          pickupLine1: pickupLine1 || pickupAddress || '',
          pickupCity: pickupCity || '',
          pickupPostcode: pickupPostcode || '',
          deliveryLine1: deliveryLine1 || deliveryAddress || '',
          deliveryCity: deliveryCity || '',
          deliveryPostcode: deliveryPostcode || '',
        },

        service_type_id: serviceTypeId,
        distance_miles: distance,
        crew_size: crewSize,
        // Backend expects 'items' not 'selected_items'
        items: selectedItems.map(item => {
          const itemData = ITEMS_LIBRARY.find(i => i.id === item.id);
          return {
            itemId: item.id,
            name: itemData?.name || item.id,
            quantity: item.quantity,
            volume: itemData?.volume || 0,
          };
        }),
        // Backend expects 'extras' not 'selected_extras'
        extras: selectedExtras.map(extra => {
          const extraData = extras.find(e => e.id === extra.id);
          return {
            extraId: extra.id,
            name: extraData?.name || extra.id,
            quantity: extra.quantity,
            pricingMode: extraData?.pricingMode || 'fixed',
            unit: extraData?.unit || '',
            price: extraData?.price || 0,
            percentValue: extraData?.percentValue,
          };
        }),
        pricing_breakdown: quote.breakdown,
        subtotal: quote.breakdown?.base || 0,
        extras_total: quote.breakdown?.extras || 0,
        total: quote.totalPrice,
        audit_data: quote.auditData || {},
        status: 'Draft' as const,
      };

      let result: QuoteRecord | null;

      if (savedQuote) {
        // Update existing quote
        result = await updateQuote(savedQuote.id, quoteData);
        setToast({ type: 'success', message: `✅ Quote updated: ${savedQuote.quote_number}` });
      } else {
        // Create new quote
        result = await createQuote(quoteData);
        if (result) {
          setSavedQuote(result);
          setToast({ type: 'success', message: `✅ Quote saved: ${result.quote_number}` });
        }
      }
    } catch (error) {
      console.error('❌ [QuoteCalculatorNew] Failed to save quote:', error);
      setToast({ type: 'error', message: '❌ Failed to save quote. Check console.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleConvertToJob = async () => {
    if (!quote || !hasValidQuote) {
      setToast({ type: 'error', message: '❌ Cannot convert invalid quote' });
      return;
    }

    setIsConverting(true);

    try {
      // If quote not saved yet, save it first
      let quoteToConvert = savedQuote;
      if (!quoteToConvert) {
        await handleSaveQuote();
        // Wait for savedQuote state to update
        await new Promise(resolve => setTimeout(resolve, 500));
        quoteToConvert = savedQuote;
      }

      if (!quoteToConvert) {
        setToast({ type: 'error', message: '❌ Quote must be saved before conversion' });
        setIsConverting(false);
        return;
      }

      // Convert quote to job
      const job = await convertQuoteToJob(quoteToConvert.id, {
        customer_name: customerName || 'Walk-in Customer',
        customer_email: customerEmail || '',
        customer_phone: customerPhone || '',
        pickup_postcode: pickupPostcode || '',
        pickup_address: pickupAddress || '',
        delivery_postcode: deliveryPostcode || '',
        delivery_address: deliveryAddress || '',
      });

      if (job) {
        setToast({ 
          type: 'success', 
          message: `✅ Job created: ${job.job_number} (Available Jobs)` 
        });

        // Reset calculator after successful conversion
        setTimeout(() => {
          handleResetQuote();
        }, 2000);
      }
    } catch (error) {
      console.error('❌ [QuoteCalculatorNew] Failed to convert to job:', error);
      setToast({ type: 'error', message: '❌ Failed to convert to job. Check console.' });
    } finally {
      setIsConverting(false);
    }
  };

  const handleResetQuote = () => {
    setQuote(null);
    setSavedQuote(null);
    setSelectedItems([]);
    setSelectedExtras([]);
    setDistance(15);
    setCrewSize(2);
    setCustomerName('Walk-in Customer');
    setCustomerEmail('');
    setCustomerPhone('');
    setPickupAddress('');
    setPickupPostcode('');
    setDeliveryAddress('');
    setDeliveryPostcode('');
    setPickupLine1('');
    setPickupCity('');
    setDeliveryLine1('');
    setDeliveryCity('');
    setToast({ type: 'success', message: '✅ Calculator reset' });
  };

  const handleCopyQuoteLink = async () => {
    if (!savedQuote) {
      setToast({ type: 'error', message: '⚠️ Save quote first to get link' });
      return;
    }

    const link = `${window.location.origin}/quote/${savedQuote.id}`;
    
    try {
      // Try modern clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(link);
        setToast({ type: 'success', message: '✅ Quote link copied to clipboard' });
      } else {
        // Fallback for older browsers or restricted contexts
        const textArea = document.createElement('textarea');
        textArea.value = link;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          setToast({ type: 'success', message: '✅ Quote link copied to clipboard' });
        } catch (err) {
          console.error('Fallback: Could not copy text', err);
          setToast({ type: 'error', message: '⚠️ Could not copy link' });
        }
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
      setToast({ type: 'error', message: '⚠️ Could not copy link' });
    }
  };

  // Auto-hide toast after 4 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center gap-3 mb-3">
          <Calculator className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Instant Phone Quote Calculator</h1>
        </div>
        <p className="text-indigo-100">
          Fast quote generation tool for customer service - select service, items, and get instant pricing
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN - INPUT FORM */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* SERVICE TYPE SELECTOR */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              Service Type
            </h3>
            <select
              value={serviceTypeId}
              onChange={(e) => setServiceTypeId(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-semibold"
            >
              {serviceTypes.filter(st => st.active).map(st => (
                <option key={st.id} value={st.id}>
                  {st.name} (£{st.min_price}+)
                </option>
              ))}
            </select>
            {serviceConfig && (
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-slate-500 text-xs">Base Price</div>
                  <div className="font-bold text-slate-900">£{serviceConfig.base_price}</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-slate-500 text-xs">Price/Mile</div>
                  <div className="font-bold text-slate-900">£{serviceConfig.price_per_mile}/mi</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-slate-500 text-xs">Price/m³</div>
                  <div className="font-bold text-slate-900">£{serviceConfig.price_per_m3}/m³</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-slate-500 text-xs">Crew Range</div>
                  <div className="font-bold text-slate-900">{serviceConfig.min_crew}–{serviceConfig.max_crew} people</div>
                </div>
              </div>
            )}
          </div>

          {/* PARAMETERS */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-indigo-600" />
              Parameters
            </h3>
            
            <div className="space-y-4">
              {/* Distance */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Distance (miles)
                </label>
                <input
                  type="number"
                  value={distance}
                  onChange={(e) => setDistance(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  min="0"
                  step="0.1"
                />
              </div>

              {/* Crew Size */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Crew Size
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map(size => {
                    const isAllowed = serviceConfig 
                      ? size >= serviceConfig.min_crew && size <= serviceConfig.max_crew
                      : true;
                    
                    return (
                      <button
                        key={size}
                        onClick={() => isAllowed && setCrewSize(size)}
                        disabled={!isAllowed}
                        className={`
                          py-3 rounded-xl font-bold transition-all
                          ${crewSize === size && isAllowed
                            ? 'bg-indigo-600 text-white shadow-lg'
                            : isAllowed
                              ? 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                              : 'bg-slate-50 text-slate-400 cursor-not-allowed'
                          }
                        `}
                      >
                        {size} {size === 1 ? 'Man' : 'Men'}
                      </button>
                    );
                  })}
                </div>
                {serviceConfig && (
                  <p className="text-xs text-slate-500 mt-2">
                    Allowed for {serviceConfig.name}: {serviceConfig.min_crew}–{serviceConfig.max_crew} crew
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ✅ CUSTOMER INFORMATION (REQUIRED FOR SAVING) */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              Customer Information
            </h3>
            
            <div className="space-y-4">
              {/* Customer Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g., John Smith"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Customer Phone (REQUIRED) */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Phone Number <span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g., 07700 900000"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-slate-500 mt-1">
                  Required for saving quotes and creating jobs
                </p>
              </div>

              {/* Customer Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="e.g., customer@email.com"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Addresses */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Pickup Postcode
                  </label>
                  <input
                    type="text"
                    value={pickupPostcode}
                    onChange={(e) => setPickupPostcode(e.target.value)}
                    placeholder="e.g., SW1A 1AA"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Delivery Postcode
                  </label>
                  <input
                    type="text"
                    value={deliveryPostcode}
                    onChange={(e) => setDeliveryPostcode(e.target.value)}
                    placeholder="e.g., W1A 1AA"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Full Addresses */}
              <div className="space-y-4">
                {/* Pickup Address Structured */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold text-xs">A</div>
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Collection Point</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Street Name & Number</label>
                      <input
                        type="text"
                        value={pickupLine1}
                        onChange={(e) => {
                          setPickupLine1(e.target.value);
                          setPickupAddress(e.target.value); // Sync legacy
                        }}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm bg-white"
                        placeholder="e.g. 10 Downing Street"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Postcode</label>
                      <input
                        type="text"
                        value={pickupPostcode}
                        onChange={(e) => setPickupPostcode(e.target.value.toUpperCase())}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm bg-white uppercase"
                        placeholder="SW1A 2AA"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Town / City</label>
                    <input
                      type="text"
                      value={pickupCity}
                      onChange={(e) => setPickupCity(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm bg-white"
                      placeholder="e.g. London"
                    />
                  </div>
                </div>

                {/* Delivery Address Structured */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center font-bold text-xs">B</div>
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Delivery Destination</h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Street Name & Number</label>
                      <input
                        type="text"
                        value={deliveryLine1}
                        onChange={(e) => {
                          setDeliveryLine1(e.target.value);
                          setDeliveryAddress(e.target.value); // Sync legacy
                        }}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm bg-white"
                        placeholder="e.g. 1 Horse Guards Road"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Postcode</label>
                      <input
                        type="text"
                        value={deliveryPostcode}
                        onChange={(e) => setDeliveryPostcode(e.target.value.toUpperCase())}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm bg-white uppercase"
                        placeholder="SW1A 2HQ"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Town / City</label>
                    <input
                      type="text"
                      value={deliveryCity}
                      onChange={(e) => setDeliveryCity(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm bg-white"
                      placeholder="e.g. London"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ITEMS SELECTION */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-indigo-600" />
                Select Items ({selectedItems.length} selected, {totalVolume.toFixed(2)} m³)
              </h3>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-slate-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search items..."
                  className="w-full pl-10 pr-10 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 p-4 border-b border-slate-200 overflow-x-auto">
              {categories.map(category => {
                const Icon = CATEGORY_ICONS[category] || Package;
                return (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all
                      ${activeCategory === category
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    {category}
                  </button>
                );
              })}
            </div>

            {/* Items Grid */}
            <div className="p-4 max-h-96 overflow-y-auto">
              {filteredItems.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  No items found. Try a different category or search term.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredItems.map(item => {
                    const quantity = getItemQuantity(item.id);
                    const isSelected = quantity > 0;

                    return (
                      <div
                        key={item.id}
                        className={`
                          p-4 rounded-xl border-2 transition-all
                          ${isSelected
                            ? 'border-indigo-600 bg-indigo-50'
                            : 'border-slate-200 bg-white hover:border-indigo-300'
                          }
                        `}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <h4 className={`font-semibold text-sm ${isSelected ? 'text-indigo-900' : 'text-slate-900'}`}>
                              {item.name}
                            </h4>
                            <p className="text-xs text-slate-500 mt-1">
                              {item.volume.toFixed(2)} m³ • {item.weight} kg
                            </p>
                          </div>

                          {isSelected ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleUpdateItemQuantity(item.id, -1)}
                                className="w-8 h-8 flex items-center justify-center bg-white border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <div className="w-10 text-center font-bold text-indigo-900">
                                {quantity}
                              </div>
                              <button
                                onClick={() => handleUpdateItemQuantity(item.id, 1)}
                                className="w-8 h-8 flex items-center justify-center bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleAddItem(item.id)}
                              className="w-8 h-8 flex items-center justify-center bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* EXTRAS */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-indigo-600" />
                Extras & Services ({selectedExtras.length} selected, £{extrasTotal.toFixed(2)})
              </h3>
            </div>

            <div className="p-4 max-h-96 overflow-y-auto space-y-4">
              {/* Group extras by category */}
              {Array.from(new Set(extras.map(e => e.category))).map(category => {
                const categoryExtras = extras.filter(e => e.category === category);
                
                return (
                  <div key={category}>
                    <h4 className="font-bold text-slate-700 text-sm mb-3">{category}</h4>
                    <div className="space-y-2">
                      {categoryExtras.map(extra => {
                        const isSelected = isExtraSelected(extra.id);
                        const quantity = getExtraQuantity(extra.id);

                        return (
                          <div
                            key={extra.id}
                            className={`
                              p-3 rounded-xl border-2 transition-all
                              ${isSelected
                                ? 'border-green-600 bg-green-50'
                                : 'border-slate-200 bg-white hover:border-green-300'
                              }
                            `}
                          >
                            <div className="flex items-start gap-3">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleToggleExtra(extra.id)}
                                className="mt-1 w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                              />
                              
                              <div className="flex-1">
                                <div className="font-semibold text-sm text-slate-900">
                                  {extra.name}
                                </div>
                                <div className="text-xs text-slate-600 mt-1">
                                  {extra.description}
                                </div>
                                <div className="text-xs font-bold text-green-700 mt-1">
                                  {/* ✅ FIX: Use correct field names - 'price' not 'basePrice', 'unitType' not 'unit_label' */}
                                  {extra.pricingMode === 'fixed' && `£${(extra.price || 0).toFixed(2)}`}
                                  {extra.pricingMode === 'per_unit' && `£${(extra.price || 0).toFixed(2)} per ${extra.unitType || 'unit'}`}
                                  {extra.pricingMode === 'percentage_of_booking' && `${extra.percentValue || 0}% of booking`}
                                </div>
                              </div>

                              {isSelected && extra.pricingMode === 'per_unit' && (
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleUpdateExtraQuantity(extra.id, -1)}
                                    className="w-7 h-7 flex items-center justify-center bg-white border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <div className="w-8 text-center font-bold text-green-900 text-sm">
                                    {quantity}
                                  </div>
                                  <button
                                    onClick={() => handleUpdateExtraQuantity(extra.id, 1)}
                                    className="w-7 h-7 flex items-center justify-center bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* GENERATE QUOTE BUTTON */}
          <button
            onClick={handleGenerateQuote}
            disabled={isGenerating || selectedItems.length === 0}
            className="w-full px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-lg rounded-xl shadow-xl hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isGenerating ? (
              <>
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Calculator className="w-6 h-6" />
                Generate Quote
              </>
            )}
          </button>
        </div>

        {/* RIGHT COLUMN - RESULTS */}
        <div className="lg:col-span-1">
          {quote ? (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 sticky top-6">
              {/* Quote Header */}
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-2xl p-6">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-6 h-6" />
                  <h3 className="font-bold text-lg">Quote Generated</h3>
                </div>
                <div className="text-4xl font-bold">
                  £{quote.totalPrice.toFixed(2)}
                </div>
                <div className="text-green-100 text-sm mt-1">
                  {serviceConfig?.name} • {totalVolume.toFixed(2)} m³
                </div>
              </div>

              {/* Breakdown - COMPREHENSIVE */}
              <div className="p-6 space-y-3 max-h-[600px] overflow-y-auto">
                {/* ✅ SELECTED ITEMS SUMMARY PANEL - EXPANDABLE */}
                {selectedItems.length > 0 && (
                  <div className="bg-white rounded-lg shadow border border-slate-200 mb-3">
                    {/* Header - Always visible */}
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

                    {/* Table - Expandable (Default OPEN) */}
                    {showSelectedItems && (
                      <div className="border-t border-slate-200">
                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-2 p-3 bg-slate-50 text-xs font-semibold text-slate-600 border-b border-slate-200">
                          <div className="col-span-4">Item name</div>
                          <div className="col-span-1 text-center">Qty</div>
                          <div className="col-span-2 text-right">m³/item</div>
                          <div className="col-span-2 text-right">Total m³</div>
                          <div className="col-span-3 text-right">Vol. Charge</div>
                        </div>

                        {/* Rows - with scroll if many items */}
                        <div className="max-h-64 overflow-y-auto">
                          {selectedItems.map((item) => {
                            const itemData = ITEMS_LIBRARY.find(i => i.id === item.id);
                            if (!itemData) return null;
                            const itemTotalVolume = itemData.volume * item.quantity;
                            const pricePerM3 = serviceConfig?.price_per_m3 || 0;
                            const itemTotalPrice = itemTotalVolume * pricePerM3;
                            return (
                              <div 
                                key={item.id} 
                                className="grid grid-cols-12 gap-2 p-3 text-sm border-b border-slate-100 hover:bg-slate-50 transition-colors"
                              >
                                <div className="col-span-4 text-slate-900 font-medium">{itemData.name}</div>
                                <div className="col-span-1 text-center text-slate-700">{item.quantity}</div>
                                <div className="col-span-2 text-right text-slate-600">{itemData.volume.toFixed(2)}</div>
                                <div className="col-span-2 text-right text-slate-900 font-semibold">{itemTotalVolume.toFixed(2)}</div>
                                <div className="col-span-3 text-right text-green-600 font-bold">£{itemTotalPrice.toFixed(2)}</div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Table Footer */}
                        <div className="grid grid-cols-12 gap-2 p-3 bg-slate-50 border-t-2 border-slate-300">
                          <div className="col-span-5 text-sm font-bold text-slate-900">TOTAL:</div>
                          <div className="col-span-2 text-center text-sm font-bold text-slate-900">
                            {selectedItems.reduce((sum, i) => sum + i.quantity, 0)}
                          </div>
                          <div className="col-span-2 text-right text-sm font-bold text-slate-900">
                            {totalVolume.toFixed(2)} m³
                          </div>
                          <div className="col-span-3 text-right text-sm font-bold text-green-600">
                            £{(totalVolume * (serviceConfig?.price_per_m3 || 0)).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <QuoteBreakdownDetailed
                  quote={quote}
                  serviceTypeId={serviceTypeId}
                />

                {/* ✅ ACTIONS PANEL - ONLY SHOW IF VALID QUOTE */}
                {hasValidQuote && (
                  <div className="pt-4 border-t-2 border-slate-300 space-y-3">
                    <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wide">
                      Actions
                    </h4>

                    {/* Saved Quote Info */}
                    {savedQuote && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs">
                        <div className="font-semibold text-blue-900">
                          Quote ID: {savedQuote.quote_number}
                        </div>
                        <div className="text-blue-700 mt-1">
                          Status: {savedQuote.status}
                        </div>
                      </div>
                    )}

                    {/* Edit Instructions */}
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-xs text-purple-900">
                      <div className="flex items-start gap-2">
                        <Edit3 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-semibold mb-1">Want to modify this quote?</div>
                          <div className="text-purple-700">
                            You can edit items, extras, distance, or crew size above, then click "Edit & Recalculate" to update the quote without losing your work.
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Primary Actions */}
                    <div className="space-y-2">
                      {/* ✅ EDIT & RECALCULATE - Allow editing quote without losing it */}
                      <button
                        onClick={handleGenerateQuote}
                        disabled={isGenerating}
                        className="w-full px-4 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isGenerating ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Recalculating...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-4 h-4" />
                            Edit & Recalculate
                          </>
                        )}
                      </button>

                      <button
                        onClick={handleSaveQuote}
                        disabled={isSaving}
                        className="w-full px-4 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isSaving ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            {savedQuote ? 'Updating...' : 'Saving...'}
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            {savedQuote ? 'Update Quote' : 'Save Quote'}
                          </>
                        )}
                      </button>

                      <button
                        onClick={handleConvertToJob}
                        disabled={isConverting}
                        className="w-full px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isConverting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Converting...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Convert to Job
                          </>
                        )}
                      </button>
                    </div>

                    {/* Secondary Actions */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={handleCopyQuoteLink}
                        className="px-3 py-2 bg-slate-100 text-slate-700 font-semibold text-sm rounded-lg hover:bg-slate-200 transition-all"
                      >
                        Copy Link
                      </button>
                      <button
                        onClick={handleResetQuote}
                        className="px-3 py-2 bg-red-100 text-red-700 font-semibold text-sm rounded-lg hover:bg-red-200 transition-all"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center sticky top-6">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">No Quote Yet</h3>
              <p className="text-slate-600 text-sm">
                Select service type, items, and parameters, then click "Generate Quote" to see pricing
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ✅ TOAST NOTIFICATION */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
          <div className={`
            px-6 py-4 rounded-xl shadow-2xl border-2 flex items-center gap-3 min-w-[300px]
            ${toast.type === 'success'
              ? 'bg-green-50 border-green-500 text-green-900'
              : 'bg-red-50 border-red-500 text-red-900'
            }
          `}>
            {toast.type === 'success' ? (
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
            )}
            <div className="flex-1 font-semibold">
              {toast.message}
            </div>
            <button
              onClick={() => setToast(null)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}