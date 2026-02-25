/**
 * Admin Items Library
 * Allows administrators to manage inventory items for all services
 */

import React, { useState } from 'react';
import { Package, Search, Plus, Trash2, Edit2, Save, X, Box, Filter, CheckCircle2, ShoppingCart, Bike, Truck, Trash, Archive } from 'lucide-react';

interface LibraryItem {
  id: string;
  name: string;
  category: string;
  volume: number;
  icon: string;
  serviceType: 'house-move' | 'furniture-items' | 'store-pickup' | 'clearance' | 'motorbike-bicycle' | 'other-delivery';
}

// Initial data (combining from services)
const INITIAL_ITEMS: LibraryItem[] = [
  // IKEA (Store/Pickup)
  { id: 'ikea-billy', name: 'BILLY Bookcase', category: 'IKEA Furniture', volume: 0.65, icon: '📚', serviceType: 'store-pickup' },
  { id: 'ikea-kallax', name: 'KALLAX Shelving Unit', category: 'IKEA Furniture', volume: 0.85, icon: '📦', serviceType: 'store-pickup' },
  { id: 'ikea-malm', name: 'MALM Bed Frame', category: 'IKEA Furniture', volume: 1.20, icon: '🛏️', serviceType: 'store-pickup' },
  { id: 'ikea-pax', name: 'PAX Wardrobe', category: 'IKEA Furniture', volume: 2.50, icon: '🚪', serviceType: 'store-pickup' },
  { id: 'ikea-sofa', name: 'KIVIK Sofa', category: 'IKEA Furniture', volume: 2.00, icon: '🛋️', serviceType: 'store-pickup' },
  
  // B&Q (Store/Pickup)
  { id: 'bq-timber', name: 'Timber Pack (2.4m)', category: 'B&Q / Hardware', volume: 0.50, icon: '🪵', serviceType: 'store-pickup' },
  { id: 'bq-paint', name: 'Paint Cans (5L x4)', category: 'B&Q / Hardware', volume: 0.25, icon: '🎨', serviceType: 'store-pickup' },
  
  // Appliances
  { id: 'appliance-fridge', name: 'Fridge (Retail Boxed)', category: 'Retail Appliances', volume: 1.20, icon: '❄️', serviceType: 'store-pickup' },
  { id: 'appliance-washer', name: 'Washing Machine (Boxed)', category: 'Retail Appliances', volume: 1.00, icon: '🌊', serviceType: 'store-pickup' },
  
  // House Move Standard Items
  { id: 'bed-double', name: 'Double Bed', category: 'Bedroom', volume: 1.80, icon: '🛏️', serviceType: 'house-move' },
  { id: 'sofa-3-seater', name: '3-Seater Sofa', category: 'Living Room', volume: 2.50, icon: '🛋️', serviceType: 'house-move' },
  { id: 'table-dining', name: 'Dining Table', category: 'Dining Room', volume: 1.20, icon: '🍽️', serviceType: 'house-move' },
  { id: 'wardrobe-large', name: 'Large Wardrobe', category: 'Bedroom', volume: 3.00, icon: '🚪', serviceType: 'house-move' },
  { id: 'box-standard', name: 'Standard Moving Box', category: 'Boxes', volume: 0.15, icon: '📦', serviceType: 'house-move' },

  // Motorbike/Bicycle
  { id: 'bike-sport', name: 'Sport Motorbike', category: 'Motorbike', volume: 1.5, icon: '🏍️', serviceType: 'motorbike-bicycle' },
  { id: 'bike-electric', name: 'Electric Bicycle', category: 'Bicycle', volume: 0.4, icon: '🚲', serviceType: 'motorbike-bicycle' },

  // Other Delivery
  { id: 'other-pallet', name: 'Euro Pallet (Large)', category: 'Commercial', volume: 1.5, icon: '📦', serviceType: 'other-delivery' },
  { id: 'other-crate', name: 'Oversized Crate', category: 'Industrial', volume: 2.0, icon: '🪵', serviceType: 'other-delivery' },
  { id: 'other-gym', name: 'Gym Equipment', category: 'Specialist', volume: 1.8, icon: '🏋️', serviceType: 'other-delivery' },
  { id: 'other-parcel', name: 'Heavy Parcel', category: 'Standard', volume: 0.25, icon: '📦', serviceType: 'other-delivery' },
  { id: 'other-exhibition', name: 'Exhibition Stand', category: 'Events', volume: 1.0, icon: '🖼️', serviceType: 'other-delivery' },
];

const SERVICE_TYPES = [
  { id: 'all', label: 'All Services', icon: <Box className="w-4 h-4" /> },
  { id: 'house-move', label: 'House Move', icon: <Truck className="w-4 h-4" /> },
  { id: 'furniture-items', label: 'Furniture & Items', icon: <Package className="w-4 h-4" /> },
  { id: 'store-pickup', label: 'Store/Pickup', icon: <ShoppingCart className="w-4 h-4" /> },
  { id: 'clearance', label: 'Clearance', icon: <Trash className="w-4 h-4" /> },
  { id: 'motorbike-bicycle', label: 'Motorbike/Bicycle', icon: <Bike className="w-4 h-4" /> },
  { id: 'other-delivery', label: 'Other Delivery', icon: <Archive className="w-4 h-4" /> },
];

export function AdminItemsLibrary() {
  const [items, setItems] = useState<LibraryItem[]>(INITIAL_ITEMS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterService, setFilterService] = useState('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<LibraryItem>>({});
  const [isAdding, setIsAdding] = useState(false);

  // Filter logic
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesService = filterService === 'all' || item.serviceType === filterService;
    return matchesSearch && matchesService;
  });

  const handleEdit = (item: LibraryItem) => {
    setEditingId(item.id);
    setEditForm(item);
  };

  const handleSave = () => {
    if (!editForm.id) return;
    setItems(items.map(item => item.id === editForm.id ? { ...item, ...editForm } as LibraryItem : item));
    setEditingId(null);
    setEditForm({});
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this item from the library?')) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleAddNew = () => {
    const newItem: LibraryItem = {
      id: 'item-' + Date.now(),
      name: editForm.name || 'New Item',
      category: editForm.category || 'General',
      volume: editForm.volume || 0.1,
      icon: editForm.icon || '📦',
      serviceType: (editForm.serviceType as any) || 'house-move',
    };
    setItems([newItem, ...items]);
    setIsAdding(false);
    setEditForm({});
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search library items by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-200 outline-none transition-all"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <select
              value={filterService}
              onChange={(e) => setFilterService(e.target.value)}
              className="pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none cursor-pointer hover:border-blue-300 transition-colors"
            >
              {SERVICE_TYPES.map(s => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>
          
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Add New Item
          </button>
        </div>
      </div>

      {/* Add New Item Modal/Panel */}
      {isAdding && (
        <div className="bg-blue-50 p-6 rounded-2xl border-2 border-dashed border-blue-300 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-blue-900 flex items-center gap-2">
              <Plus className="w-5 h-5" /> Add New Library Item
            </h3>
            <button onClick={() => setIsAdding(false)}><X className="w-5 h-5 text-blue-600" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-blue-700">Item Name</label>
              <input
                type="text"
                placeholder="e.g. Double Sofa"
                className="w-full px-4 py-2 rounded-lg border border-blue-200 bg-white"
                value={editForm.name || ''}
                onChange={e => setEditForm({...editForm, name: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-blue-700">Category</label>
              <input
                type="text"
                placeholder="e.g. Living Room"
                className="w-full px-4 py-2 rounded-lg border border-blue-200 bg-white"
                value={editForm.category || ''}
                onChange={e => setEditForm({...editForm, category: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-blue-700">Volume (m³)</label>
              <input
                type="number"
                placeholder="Volume (m³)"
                step="0.01"
                className="w-full px-4 py-2 rounded-lg border border-blue-200 bg-white"
                value={editForm.volume || ''}
                onChange={e => setEditForm({...editForm, volume: parseFloat(e.target.value)})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-blue-700">Service Type</label>
              <select
                className="w-full px-4 py-2 rounded-lg border border-blue-200 bg-white"
                value={editForm.serviceType || 'house-move'}
                onChange={e => setEditForm({...editForm, serviceType: e.target.value as any})}
              >
                {SERVICE_TYPES.slice(1).map(s => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-3">
            <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-slate-600 font-medium">Cancel</button>
            <button onClick={handleAddNew} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-md">Create Item</button>
          </div>
        </div>
      )}

      {/* Items Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-sm font-bold text-slate-700 uppercase tracking-wider">Item & Category</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-700 uppercase tracking-wider">Service Type</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-700 uppercase tracking-wider text-center">Volume (m³)</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-700 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredItems.map((item) => {
                const isEditing = editingId === item.id;
                
                return (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-xl shadow-sm">
                          {isEditing ? (
                            <input 
                              type="text" 
                              className="w-full text-center bg-transparent border-none p-0 focus:ring-0" 
                              value={editForm.icon || ''} 
                              onChange={e => setEditForm({...editForm, icon: e.target.value})}
                            />
                          ) : item.icon}
                        </div>
                        <div>
                          {isEditing ? (
                            <input 
                              type="text" 
                              className="font-bold text-slate-900 border-b border-blue-300 focus:outline-none" 
                              value={editForm.name || ''} 
                              onChange={e => setEditForm({...editForm, name: e.target.value})}
                            />
                          ) : (
                            <p className="font-bold text-slate-900">{item.name}</p>
                          )}
                          {isEditing ? (
                            <input 
                              type="text" 
                              className="text-xs text-slate-500 border-b border-blue-200 focus:outline-none mt-1" 
                              value={editForm.category || ''} 
                              onChange={e => setEditForm({...editForm, category: e.target.value})}
                            />
                          ) : (
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{item.category}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <select
                          className="text-sm bg-white border border-slate-200 rounded p-1"
                          value={editForm.serviceType || ''}
                          onChange={e => setEditForm({...editForm, serviceType: e.target.value as any})}
                        >
                          {SERVICE_TYPES.slice(1).map(s => (
                            <option key={s.id} value={s.id}>{s.label}</option>
                          ))}
                        </select>
                      ) : (
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 w-fit ${
                          item.serviceType === 'house-move' ? 'bg-blue-100 text-blue-700' :
                          item.serviceType === 'store-pickup' ? 'bg-emerald-100 text-emerald-700' :
                          item.serviceType === 'furniture-items' ? 'bg-purple-100 text-purple-700' :
                          item.serviceType === 'motorbike-bicycle' ? 'bg-orange-100 text-orange-700' :
                          item.serviceType === 'clearance' ? 'bg-red-100 text-red-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {SERVICE_TYPES.find(s => s.id === item.serviceType)?.icon}
                          {item.serviceType.replace('-', ' ')}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {isEditing ? (
                        <input 
                          type="number" 
                          step="0.01" 
                          className="w-20 text-center font-bold text-blue-600 border-b border-blue-300 focus:outline-none" 
                          value={editForm.volume || ''} 
                          onChange={e => setEditForm({...editForm, volume: parseFloat(e.target.value)})}
                        />
                      ) : (
                        <span className="font-bold text-slate-700">{item.volume.toFixed(2)}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isEditing ? (
                          <>
                            <button onClick={handleSave} className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors shadow-sm">
                              <Save className="w-4 h-4" />
                            </button>
                            <button onClick={() => setEditingId(null)} className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors shadow-sm">
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => handleEdit(item)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {filteredItems.length === 0 && (
            <div className="py-20 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Box className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No items found</h3>
              <p className="text-slate-500">Try adjusting your search or filters to find what you're looking for.</p>
            </div>
          )}
        </div>
      </div>

      {/* Stats / Footer */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
              <Box className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Items</p>
              <p className="text-2xl font-black text-slate-900">{items.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Avg Volume</p>
              <p className="text-2xl font-black text-slate-900">
                {(items.reduce((sum, i) => sum + i.volume, 0) / (items.length || 1)).toFixed(2)} m³
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Retail Store</p>
              <p className="text-2xl font-black text-slate-900">
                {items.filter(i => i.serviceType === 'store-pickup').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
              <Bike className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Motorbikes</p>
              <p className="text-2xl font-black text-slate-900">
                {items.filter(i => i.serviceType === 'motorbike-bicycle').length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
