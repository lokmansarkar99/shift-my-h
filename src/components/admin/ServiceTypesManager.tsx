import React, { useState, useEffect } from 'react';
import { 
  Home, Armchair, Trash2, Bike, Store, Package, 
  Save, RefreshCw, AlertCircle, CheckCircle2, 
  ChevronDown, ChevronUp, Settings, DollarSign, 
  ToggleLeft, ToggleRight, Info 
} from 'lucide-react';
import { 
  ServiceTypeConfig, 
  fetchServiceTypes, 
  updateServiceTypes, 
  DEFAULT_SERVICE_TYPES 
} from '../../utils/serviceTypesService';

const ICON_MAP: Record<string, any> = {
  Home,
  Armchair,
  Trash2,
  Bike,
  Store,
  Package,
};

export function ServiceTypesManager() {
  const [serviceTypes, setServiceTypes] = useState<ServiceTypeConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    loadServiceTypes();
  }, []);

  const loadServiceTypes = async () => {
    try {
      setLoading(true);
      const data = await fetchServiceTypes();
      
      // If no data, initialize with defaults
      if (!data || data.length === 0) {
        setServiceTypes(DEFAULT_SERVICE_TYPES);
      } else {
        setServiceTypes(data);
      }
      
      setError(null);
    } catch (err) {
      console.error('Failed to load service types:', err);
      setError('Failed to load service types configuration');
      setServiceTypes(DEFAULT_SERVICE_TYPES);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      
      await updateServiceTypes(serviceTypes);
      
      setSuccessMessage('Service types saved successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Failed to save service types:', err);
      setError('Failed to save service types');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Reset all service types to defaults? This will overwrite your current configuration.')) {
      setServiceTypes(DEFAULT_SERVICE_TYPES);
      setSuccessMessage('Reset to defaults. Click Save to apply.');
    }
  };

  const updateServiceType = (id: string, updates: Partial<ServiceTypeConfig>) => {
    setServiceTypes(prev =>
      prev.map(st => (st.id === id ? { ...st, ...updates } : st))
    );
  };

  const handleUpdateServiceType = (id: string, updates: Partial<ServiceTypeConfig>) => {
    updateServiceType(id, updates);
  };

  const toggleExpanded = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-600" />
            Service Types Configuration
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Configure pricing rules and features for each service type
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className="w-4 h-4 inline mr-2" />
            Reset to Defaults
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2 text-red-800">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2 text-green-800">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Service Types List */}
      <div className="space-y-4">
        {serviceTypes.map((serviceType) => {
          const Icon = ICON_MAP[serviceType.icon];
          const isExpanded = expandedId === serviceType.id;

          return (
            <div
              key={serviceType.id}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => toggleExpanded(serviceType.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    {Icon && <Icon className="w-5 h-5 text-blue-600" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{serviceType.name}</h3>
                    <p className="text-xs text-slate-500">{serviceType.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-700">
                    Min: £{serviceType.min_price}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateServiceType(serviceType.id, { active: !serviceType.active });
                    }}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      serviceType.active ? 'bg-blue-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        serviceType.active ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Expanded Configuration */}
              {isExpanded && (
                <div className="border-t border-slate-200 bg-slate-50 p-6 space-y-6">
                  {/* Feature Toggles */}
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <ToggleRight className="w-4 h-4 text-blue-600" />
                      Feature Toggles
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {[
                        { key: 'use_items', label: 'Use Items/Inventory' },
                        { key: 'use_m3', label: 'Use Volume (m³)' },
                        { key: 'use_floors', label: 'Use Floors' },
                        { key: 'use_property_type', label: 'Use Property Type' },
                        { key: 'use_waiting_time', label: 'Use Waiting Time' },
                        { key: 'use_weight_tiers', label: 'Use Weight Tiers' },
                      ].map(({ key, label }) => (
                        <label key={key} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={serviceType[key as keyof ServiceTypeConfig] as boolean}
                            onChange={(e) =>
                              updateServiceType(serviceType.id, { [key]: e.target.checked })
                            }
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-sm text-slate-700">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Pricing Configuration */}
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-blue-600" />
                      Pricing Rules
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Minimum Price (£)
                        </label>
                        <input
                          type="number"
                          value={serviceType.min_price}
                          onChange={(e) =>
                            updateServiceType(serviceType.id, {
                              min_price: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          step="10"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Base Price (£)
                        </label>
                        <input
                          type="number"
                          value={serviceType.base_price}
                          onChange={(e) =>
                            updateServiceType(serviceType.id, {
                              base_price: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          step="10"
                        />
                      </div>
                      {serviceType.use_m3 && (
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            Price per m³ (£)
                          </label>
                          <input
                            type="number"
                            value={serviceType.price_per_m3}
                            onChange={(e) =>
                              updateServiceType(serviceType.id, {
                                price_per_m3: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            step="0.5"
                          />
                        </div>
                      )}
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Price per Mile (£)
                        </label>
                        <input
                          type="number"
                          value={serviceType.price_per_mile}
                          onChange={(e) =>
                            updateServiceType(serviceType.id, {
                              price_per_mile: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          step="0.1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 🆕 CREW SETTINGS */}
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <Settings className="w-4 h-4 text-blue-600" />
                      Crew Settings
                    </h4>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-blue-900">
                          <strong>Crew size controls job handling time & cost.</strong> Formula: handlingTime = volume ÷ (crew × speed). More crew = faster job but proportional cost.
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Minimum Crew
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="4"
                          value={serviceType.min_crew}
                          onChange={(e) => {
                            const newMin = parseInt(e.target.value) || 1;
                            const updates: Partial<ServiceTypeConfig> = { min_crew: newMin };
                            
                            // Validate: default_crew must be >= min_crew
                            if (serviceType.default_crew < newMin) {
                              updates.default_crew = newMin;
                            }
                            
                            // Validate: max_crew must be >= min_crew
                            if (serviceType.max_crew < newMin) {
                              updates.max_crew = newMin;
                            }
                            
                            handleUpdateServiceType(serviceType.id, updates);
                          }}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="text-xs text-slate-500 mt-1">Min crew required (1-4)</p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Maximum Crew
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="4"
                          value={serviceType.max_crew}
                          onChange={(e) => {
                            const newMax = parseInt(e.target.value) || 4;
                            const updates: Partial<ServiceTypeConfig> = { max_crew: newMax };
                            
                            // Validate: default_crew must be <= max_crew
                            if (serviceType.default_crew > newMax) {
                              updates.default_crew = newMax;
                            }
                            
                            // Validate: min_crew must be <= max_crew
                            if (serviceType.min_crew > newMax) {
                              updates.min_crew = newMax;
                            }
                            
                            handleUpdateServiceType(serviceType.id, updates);
                          }}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="text-xs text-slate-500 mt-1">Max crew allowed (1-4)</p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Default Crew
                        </label>
                        <input
                          type="number"
                          min={serviceType.min_crew}
                          max={serviceType.max_crew}
                          value={serviceType.default_crew}
                          onChange={(e) => {
                            let newDefault = parseInt(e.target.value) || serviceType.min_crew;
                            
                            // Clamp between min and max
                            newDefault = Math.max(serviceType.min_crew, Math.min(serviceType.max_crew, newDefault));
                            
                            updateServiceType(serviceType.id, { default_crew: newDefault });
                          }}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="text-xs text-slate-500 mt-1">Pre-selected in quote ({serviceType.min_crew}-{serviceType.max_crew})</p>
                      </div>
                    </div>
                    <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <p className="text-xs text-slate-700">
                        <strong>Current:</strong> {serviceType.min_crew} ≤ crew ≤ {serviceType.max_crew}, default = {serviceType.default_crew}
                        {serviceType.min_crew === 1 && <span className="ml-2 text-blue-600">• 1 man = customer helps with lifting</span>}
                      </p>
                    </div>
                  </div>

                  {/* Property Type Multipliers */}
                  {serviceType.use_property_type && serviceType.property_multipliers && (
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                        <Home className="w-4 h-4 text-blue-600" />
                        Property Type Multipliers
                      </h4>
                      <div className="grid grid-cols-3 gap-4">
                        {Object.entries(serviceType.property_multipliers).map(([type, value]) => (
                          <div key={type}>
                            <label className="block text-xs font-medium text-slate-700 mb-1 capitalize">
                              {type}
                            </label>
                            <input
                              type="number"
                              value={value}
                              onChange={(e) =>
                                updateServiceType(serviceType.id, {
                                  property_multipliers: {
                                    ...serviceType.property_multipliers!,
                                    [type]: parseFloat(e.target.value) || 1,
                                  },
                                })
                              }
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              step="0.1"
                              min="1"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Floor Charges */}
                  {serviceType.use_floors && serviceType.floor_charges && (
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                        <Info className="w-4 h-4 text-blue-600" />
                        Floor Charges
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            Per Floor Collection (£)
                          </label>
                          <input
                            type="number"
                            value={serviceType.floor_charges.per_floor_collection}
                            onChange={(e) =>
                              updateServiceType(serviceType.id, {
                                floor_charges: {
                                  ...serviceType.floor_charges!,
                                  per_floor_collection: parseFloat(e.target.value) || 0,
                                },
                              })
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            step="5"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            Per Floor Delivery (£)
                          </label>
                          <input
                            type="number"
                            value={serviceType.floor_charges.per_floor_delivery}
                            onChange={(e) =>
                              updateServiceType(serviceType.id, {
                                floor_charges: {
                                  ...serviceType.floor_charges!,
                                  per_floor_delivery: parseFloat(e.target.value) || 0,
                                },
                              })
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            step="5"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Disposal Pricing (for clearance) */}
                  {serviceType.id === 'clearance' && serviceType.disposal_pricing && (
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                        <Trash2 className="w-4 h-4 text-blue-600" />
                        Disposal Pricing
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            Price per m³ Disposal (£)
                          </label>
                          <input
                            type="number"
                            value={serviceType.disposal_pricing.price_per_m3}
                            onChange={(e) =>
                              updateServiceType(serviceType.id, {
                                disposal_pricing: {
                                  ...serviceType.disposal_pricing!,
                                  price_per_m3: parseFloat(e.target.value) || 0,
                                },
                              })
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            step="5"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            Heavy Item Surcharge (£)
                          </label>
                          <input
                            type="number"
                            value={serviceType.disposal_pricing.heavy_item_surcharge}
                            onChange={(e) =>
                              updateServiceType(serviceType.id, {
                                disposal_pricing: {
                                  ...serviceType.disposal_pricing!,
                                  heavy_item_surcharge: parseFloat(e.target.value) || 0,
                                },
                              })
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            step="5"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Enabled Extras Info */}
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                      <Info className="w-4 h-4 text-blue-600" />
                      Enabled Extras
                    </h4>
                    <p className="text-xs text-slate-600 mb-2">
                      {serviceType.enabled_extras.length} extras available for this service type
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {serviceType.enabled_extras.map((extraId) => (
                        <span
                          key={extraId}
                          className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md"
                        >
                          {extraId.replace(/-/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-2">
          <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-semibold mb-1">Service Type Configuration</p>
            <p className="text-blue-800">
              Each public quote card maps to one service type. Configure pricing rules, feature toggles, 
              and enabled extras per service. The pricing engine will use these settings when calculating quotes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}