import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Package, AlertCircle, CheckCircle } from 'lucide-react';
import { 
  ExtraServiceItem, 
  DEFAULT_EXTRAS_CATALOG,
  formatExtraPrice,
  formatUnitType
} from '../../utils/extrasCatalogService';

export function ExtrasManager() {
  const [extras, setExtras] = useState<ExtraServiceItem[]>(() => {
    // Load from localStorage or use defaults
    const saved = localStorage.getItem('smh_extras_catalog');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse extras catalog:', e);
        return DEFAULT_EXTRAS_CATALOG;
      }
    }
    return DEFAULT_EXTRAS_CATALOG;
  });

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Save to localStorage
  const handleSave = () => {
    setSaveStatus('saving');
    try {
      localStorage.setItem('smh_extras_catalog', JSON.stringify(extras));
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
      
      // Dispatch event for other components
      window.dispatchEvent(new CustomEvent('extrasCatalogUpdated'));
    } catch (e) {
      console.error('Failed to save extras catalog:', e);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleUpdateExtra = (id: string, field: keyof ExtraServiceItem, value: any) => {
    setExtras(prev => prev.map(extra => 
      extra.id === id ? { ...extra, [field]: value } : extra
    ));
  };

  const handleAddExtra = () => {
    const newExtra: ExtraServiceItem = {
      id: `extra-${Date.now()}`,
      name: 'New Extra Service',
      description: 'Description',
      category: 'Additional Services',
      pricingMode: 'fixed',
      price: 0,
      active: true,
    };
    setExtras(prev => [...prev, newExtra]);
  };

  const handleDeleteExtra = (id: string) => {
    if (confirm('Are you sure you want to delete this extra service?')) {
      setExtras(prev => prev.filter(extra => extra.id !== id));
    }
  };

  const handleResetToDefaults = () => {
    if (confirm('Reset all extras to default values? This will overwrite all custom changes.')) {
      setExtras(DEFAULT_EXTRAS_CATALOG);
      setSaveStatus('idle');
    }
  };

  // Group extras by category
  const categories = Array.from(new Set(extras.map(e => e.category)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Extras & Services Catalog</h2>
          <p className="text-slate-600 mt-1">Manage additional services, packing materials, and fees</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleResetToDefaults}
            className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Reset to Defaults
          </button>
          <button
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg disabled:opacity-50"
          >
            {saveStatus === 'saving' ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : saveStatus === 'saved' ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Saved!
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

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-slate-700">
          <p className="font-semibold text-blue-900 mb-1">✅ Active Pricing Source</p>
          <p>This is the <strong>single source of truth</strong> for all extras and additional services.</p>
          <ul className="mt-2 space-y-1 ml-4 list-disc">
            <li><strong>Fixed Price:</strong> One-time fee (e.g., £50 for packing materials)</li>
            <li><strong>Per Unit:</strong> Price per quantity (e.g., £3 per box, £15 per roll)</li>
            <li><strong>Percentage:</strong> Based on booking total (e.g., 30% cancellation fee with min/max caps)</li>
          </ul>
        </div>
      </div>

      {/* Add New Extra Button */}
      <div className="flex justify-end">
        <button
          onClick={handleAddExtra}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New Extra
        </button>
      </div>

      {/* Extras by Category */}
      {categories.map(category => {
        const categoryExtras = extras.filter(e => e.category === category);
        
        return (
          <div key={category} className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-indigo-600" />
                {category}
                <span className="ml-2 text-sm font-normal text-slate-500">
                  ({categoryExtras.length} {categoryExtras.length === 1 ? 'item' : 'items'})
                </span>
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Active</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Pricing Mode</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Base Price</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Min/Max</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {categoryExtras.map(extra => (
                    <tr key={extra.id} className="hover:bg-slate-50 transition-colors">
                      {/* Active Toggle */}
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={extra.active}
                          onChange={(e) => handleUpdateExtra(extra.id, 'active', e.target.checked)}
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </td>

                      {/* Name */}
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={extra.name}
                          onChange={(e) => handleUpdateExtra(extra.id, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </td>

                      {/* Description */}
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={extra.description || ''}
                          onChange={(e) => handleUpdateExtra(extra.id, 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </td>

                      {/* Pricing Mode */}
                      <td className="px-6 py-4">
                        <select
                          value={extra.pricingMode}
                          onChange={(e) => handleUpdateExtra(extra.id, 'pricingMode', e.target.value as any)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="fixed">Fixed Price</option>
                          <option value="per_unit">Per Unit</option>
                          <option value="percentage_of_booking">Percentage of Booking</option>
                        </select>
                      </td>

                      {/* Base Price */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {extra.pricingMode === 'percentage_of_booking' ? (
                            <input
                              type="number"
                              value={extra.percentValue || 0}
                              onChange={(e) => handleUpdateExtra(extra.id, 'percentValue', parseFloat(e.target.value))}
                              className="w-24 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              step="1"
                              min="0"
                              max="100"
                            />
                          ) : (
                            <input
                              type="number"
                              value={extra.price || 0}
                              onChange={(e) => handleUpdateExtra(extra.id, 'price', parseFloat(e.target.value))}
                              className="w-24 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              step="0.01"
                              min="0"
                            />
                          )}
                          <span className="text-sm text-slate-600">
                            {extra.pricingMode === 'percentage_of_booking' ? '%' : '£'}
                          </span>
                        </div>
                      </td>

                      {/* Min/Max (for percentage mode) */}
                      <td className="px-6 py-4">
                        {extra.pricingMode === 'percentage_of_booking' ? (
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-500">Min:</span>
                              <input
                                type="number"
                                value={extra.minFee || 0}
                                onChange={(e) => handleUpdateExtra(extra.id, 'minFee', parseFloat(e.target.value))}
                                className="w-20 px-2 py-1 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                                step="1"
                                min="0"
                              />
                              <span className="text-xs text-slate-500">£</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-500">Max:</span>
                              <input
                                type="number"
                                value={extra.maxFee || 0}
                                onChange={(e) => handleUpdateExtra(extra.id, 'maxFee', parseFloat(e.target.value))}
                                className="w-20 px-2 py-1 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                                step="1"
                                min="0"
                              />
                              <span className="text-xs text-slate-500">£</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDeleteExtra(extra.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete extra"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      {/* Summary */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
        <h3 className="font-bold text-green-900 mb-3">📊 Catalog Summary</h3>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold text-green-700">{extras.length}</div>
            <div className="text-sm text-slate-600 mt-1">Total Extras</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-700">{extras.filter(e => e.active).length}</div>
            <div className="text-sm text-slate-600 mt-1">Active</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-700">{extras.filter(e => e.pricingMode === 'per_unit').length}</div>
            <div className="text-sm text-slate-600 mt-1">Per Unit</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-700">{extras.filter(e => e.pricingMode === 'percentage_of_booking').length}</div>
            <div className="text-sm text-slate-600 mt-1">Percentage-based</div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-sm text-slate-500 text-center">
        💡 Changes are saved to localStorage. Click "Save Changes" to persist your modifications.
      </div>
    </div>
  );
}