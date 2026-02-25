import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { toast } from 'sonner';
import { 
  Save, 
  RefreshCw, 
  AlertCircle, 
  Timer, 
  Trash2, 
  Bike, 
  ShoppingCart, 
  Archive, 
  Sliders, 
  PoundSterling, 
  Clock, 
  Home,
  Calendar,
  ShieldCheck,
  TrendingUp,
  Percent,
  CircleDollarSign,
  Layers
} from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  fetchPricingConfig,
  savePricingConfig,
  PricingConfig,
  DEFAULT_PRICING_CONFIG,
} from '../../utils/pricingConfigService';
import { setPricingConfig } from '../../utils/pricingEngine';

export function PricingRulesManager() {
  const [config, setConfig] = useState<PricingConfig>(DEFAULT_PRICING_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const pricingConfig = await fetchPricingConfig();
      if (pricingConfig) {
        setConfig(pricingConfig);
        setPricingConfig(pricingConfig);
      }
    } catch (error) {
      console.error('Error loading pricing data:', error);
      toast.error('Failed to load pricing configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await savePricingConfig(config);
      if (result.success) {
        setPricingConfig(config);
        toast.success('Operational logic saved successfully!');
      } else {
        toast.error(result.error || 'Failed to save configuration');
      }
    } catch (error) {
      console.error('Error saving pricing config:', error);
      toast.error('Network error while saving');
    } finally {
      setSaving(false);
    }
  };

  const updateSection = (section: keyof PricingConfig, field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: value
      }
    }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20">
        <RefreshCw className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Dynamic Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-3 rounded-xl">
            <Sliders className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Advanced Pricing Logic</h2>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-0.5">Configure how quotes are calculated beyond base rates</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={loadData} className="rounded-xl font-bold uppercase text-[10px] tracking-widest border-2">
            <RefreshCw className="h-4 w-4 mr-2" /> Reload
          </Button>
          <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold uppercase text-[10px] tracking-widest px-8 shadow-lg shadow-blue-100">
            <Save className="h-4 w-4 mr-2" /> {saving ? 'Saving...' : 'Save Logic'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="house-move" className="w-full">
        <TabsList className="bg-slate-100 p-1 rounded-xl mb-6 grid grid-cols-8 h-12 overflow-x-auto overflow-y-hidden">
          <TabsTrigger value="house-move" className="rounded-lg font-bold text-[9px] uppercase">House Move</TabsTrigger>
          <TabsTrigger value="volume" className="rounded-lg font-bold text-[9px] uppercase">Volume Rules</TabsTrigger>
          <TabsTrigger value="clearance" className="rounded-lg font-bold text-[9px] uppercase">Clearance</TabsTrigger>
          <TabsTrigger value="motorbike" className="rounded-lg font-bold text-[9px] uppercase">Motorbike</TabsTrigger>
          <TabsTrigger value="pickup" className="rounded-lg font-bold text-[9px] uppercase">Pickup</TabsTrigger>
          <TabsTrigger value="other" className="rounded-lg font-bold text-[9px] uppercase">Other</TabsTrigger>
          <TabsTrigger value="global" className="rounded-lg font-bold text-[9px] uppercase">Global Adjust</TabsTrigger>
          <TabsTrigger value="margins" className="rounded-lg font-bold text-[9px] uppercase bg-purple-50 text-purple-700 data-[state=active]:bg-purple-600 data-[state=active]:text-white">Business Margin</TabsTrigger>
        </TabsList>

        {/* HOUSE MOVE: Hourly & Property Multipliers */}
        <TabsContent value="house-move" className="space-y-6">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1 rounded-2xl border-slate-200 shadow-sm">
                 <CardHeader className="p-6 border-b bg-slate-50/50">
                    <CardTitle className="text-sm font-black uppercase flex items-center gap-2"><Timer className="h-4 w-4 text-blue-600" /> Hourly Rates</CardTitle>
                 </CardHeader>
                 <CardContent className="p-6 space-y-6">
                    <div className="text-center">
                       <Label className="text-[10px] font-black uppercase text-slate-400 block mb-2">Base Hourly Rate</Label>
                       <div className="text-4xl font-black text-slate-900 mb-4">£{config.timeBasedPricing?.baseHourlyRate ?? 60}</div>
                       <Input 
                         type="range" min="30" max="150" step="5"
                         value={config.timeBasedPricing?.baseHourlyRate ?? 60}
                         onChange={(e) => updateSection('timeBasedPricing', 'baseHourlyRate', parseInt(e.target.value))}
                         className="accent-blue-600 h-2 mb-4"
                       />
                    </div>
                    <div className="space-y-4 pt-4 border-t">
                       <div className="flex justify-between items-center">
                          <Label className="text-xs font-bold text-slate-600">Min Billing (Hours)</Label>
                          <Input 
                            type="number" className="w-16 h-8 text-center font-bold"
                            value={config.timeBasedPricing?.minimumChargeableHours ?? 2}
                            onChange={(e) => updateSection('timeBasedPricing', 'minimumChargeableHours', parseInt(e.target.value))}
                          />
                       </div>
                       <div className="flex justify-between items-center">
                          <Label className="text-xs font-bold text-slate-600">Mins / Large Item</Label>
                          <Input 
                            type="number" step="0.1" className="w-16 h-8 text-center font-bold"
                            value={config.handlingTimeRules?.minutesPerInventoryItem ?? 1.5}
                            onChange={(e) => updateSection('handlingTimeRules', 'minutesPerInventoryItem', parseFloat(e.target.value))}
                          />
                       </div>
                    </div>
                 </CardContent>
              </Card>

              <Card className="lg:col-span-2 rounded-2xl border-slate-200 shadow-sm">
                 <CardHeader className="p-6 border-b bg-slate-50/50">
                    <CardTitle className="text-sm font-black uppercase flex items-center gap-2"><Home className="h-4 w-4 text-blue-600" /> Property Multipliers</CardTitle>
                 </CardHeader>
                 <CardContent className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                       {Object.entries(config.propertyTypeMultipliers ?? {}).map(([key, val]) => (
                          <div key={key} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                             <Label className="text-[9px] font-black uppercase text-slate-500 block mb-1 truncate">{key.replace(/-/g, ' ')}</Label>
                             <Input 
                               type="number" step="0.05" className="h-8 text-sm font-bold text-center bg-white"
                               value={val as number}
                               onChange={(e) => {
                                  const newMults = { ...config.propertyTypeMultipliers, [key]: parseFloat(e.target.value) || 1.0 };
                                  setConfig(prev => ({ ...prev, propertyTypeMultipliers: newMults }));
                               }}
                             />
                          </div>
                       ))}
                    </div>
                 </CardContent>
              </Card>
           </div>
        </TabsContent>

        {/* VOLUME & SAFETY RULES */}
        <TabsContent value="volume" className="space-y-6">
           <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-blue-600 p-6 text-white flex items-center gap-4">
                 <ShieldCheck className="h-8 w-8" />
                 <div>
                    <h3 className="font-black uppercase tracking-tight">Volume Calculation Precision</h3>
                    <p className="text-xs text-blue-100 font-medium">Fine-tune the gap between theoretical volume and real truck space.</p>
                 </div>
              </div>
              <CardContent className="p-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                       <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
                          <div>
                             <Label className="font-black text-slate-900 block">🎁 Packing Factor</Label>
                             <p className="text-[10px] text-slate-500 font-bold uppercase">Space for blankets & materials</p>
                          </div>
                          <div className="flex items-center gap-4">
                             <Input 
                               type="number" step="0.05" className="w-20 h-10 text-center font-black border-2 border-blue-200"
                               value={config.inventoryHandlingRules?.packingFactor ?? 1.1}
                               onChange={(e) => updateSection('inventoryHandlingRules', 'packingFactor', parseFloat(e.target.value))}
                             />
                          </div>
                       </div>
                       <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
                          <div>
                             <Label className="font-black text-slate-900 block">🛡️ Safety Margin</Label>
                             <p className="text-[10px] text-slate-500 font-bold uppercase">Buffer for imperfect packing</p>
                          </div>
                          <div className="flex items-center gap-4">
                             <Input 
                               type="number" step="0.05" className="w-20 h-10 text-center font-black border-2 border-blue-200"
                               value={config.inventoryHandlingRules?.safetyMargin ?? 1.1}
                               onChange={(e) => updateSection('inventoryHandlingRules', 'safetyMargin', parseFloat(e.target.value))}
                             />
                          </div>
                       </div>
                    </div>
                    <div className="bg-slate-900 rounded-3xl p-8 text-white flex flex-col justify-center">
                       <div className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-4">Live Example Calculation</div>
                       <div className="space-y-2 font-mono text-sm">
                          <div className="flex justify-between"><span>Base Volume:</span> <span>10.0 m³</span></div>
                          <div className="flex justify-between text-blue-300"><span>Packing ({(config.inventoryHandlingRules?.packingFactor ?? 1.1).toFixed(2)}x):</span> <span>+{(10 * ((config.inventoryHandlingRules?.packingFactor ?? 1.1) - 1)).toFixed(1)} m³</span></div>
                          <div className="flex justify-between text-blue-300"><span>Safety ({(config.inventoryHandlingRules?.safetyMargin ?? 1.1).toFixed(2)}x):</span> <span>+{(10 * (config.inventoryHandlingRules?.packingFactor ?? 1.1) * ((config.inventoryHandlingRules?.safetyMargin ?? 1.1) - 1)).toFixed(1)} m³</span></div>
                          <Separator className="bg-slate-700 my-4" />
                          <div className="flex justify-between text-xl font-black">
                             <span>Final Chargeable:</span>
                             <span className="text-blue-400">{(10 * (config.inventoryHandlingRules?.packingFactor ?? 1.1) * (config.inventoryHandlingRules?.safetyMargin ?? 1.1)).toFixed(1)} m³</span>
                          </div>
                       </div>
                    </div>
                 </div>
              </CardContent>
           </Card>
        </TabsContent>

        {/* CLEARANCE */}
        <TabsContent value="clearance" className="space-y-6">
           <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden">
              <CardHeader className="p-6 border-b bg-orange-50/50">
                 <CardTitle className="text-sm font-black uppercase flex items-center gap-2"><Trash2 className="h-4 w-4 text-orange-600" /> Waste Disposal Fees</CardTitle>
              </CardHeader>
              <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-3">
                    <Label className="text-xs font-black uppercase text-slate-500">Fixed Disposal Entry Fee (£)</Label>
                    <Input 
                      type="number" className="h-12 rounded-xl text-xl font-black border-2 text-center"
                      value={config.clearanceDisposalCharges?.disposal_fee_fixed ?? 50}
                      onChange={(e) => updateSection('clearanceDisposalCharges', 'disposal_fee_fixed', parseFloat(e.target.value))}
                    />
                 </div>
                 <div className="space-y-3">
                    <Label className="text-xs font-black uppercase text-slate-500">Waste Rate per m³ (£)</Label>
                    <Input 
                      type="number" className="h-12 rounded-xl text-xl font-black border-2 text-center"
                      value={config.clearanceDisposalCharges?.disposal_rate_per_m3 ?? 8}
                      onChange={(e) => updateSection('clearanceDisposalCharges', 'disposal_rate_per_m3', parseFloat(e.target.value))}
                    />
                 </div>
              </CardContent>
           </Card>
        </TabsContent>

        {/* MOTORBIKE */}
        <TabsContent value="motorbike" className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { key: 'standardMotorbike', label: 'Standard Bike', icon: '🏍️' },
                { key: 'largeMotorbike', label: 'Large / Touring', icon: '🛵' },
                { key: 'bicycle', label: 'Bicycle', icon: '🚲' }
              ].map(bike => (
                <Card key={bike.key} className="rounded-2xl border-slate-200 shadow-sm p-6 text-center">
                   <div className="text-4xl mb-4">{bike.icon}</div>
                   <Label className="text-[10px] font-black uppercase text-slate-400 block mb-4">{bike.label} Base</Label>
                   <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 font-bold">£</span>
                      <Input 
                        type="number" className="h-12 text-center font-black text-2xl border-2 pl-8"
                        value={(config.motorbikeTransportCharges as any)?.[bike.key] ?? 0}
                        onChange={(e) => updateSection('motorbikeTransportCharges', bike.key, parseFloat(e.target.value))}
                      />
                   </div>
                </Card>
              ))}
           </div>
        </TabsContent>

        {/* PICKUP */}
        <TabsContent value="pickup" className="space-y-6">
           <Card className="rounded-2xl border-slate-200 shadow-sm p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase text-slate-400 block">Base Pickup Fee (£)</Label>
                    <Input 
                      type="number" className="h-14 rounded-xl text-center font-black text-3xl border-2"
                      value={config.pickupServiceCharges?.basePickupFee ?? 35}
                      onChange={(e) => updateSection('pickupServiceCharges', 'basePickupFee', parseFloat(e.target.value))}
                    />
                 </div>
                 <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase text-slate-400 block">Same-Day Surcharge (£)</Label>
                    <Input 
                      type="number" className="h-14 rounded-xl text-center font-black text-3xl border-2 text-orange-600"
                      value={config.pickupServiceCharges?.sameDay ?? 40}
                      onChange={(e) => updateSection('pickupServiceCharges', 'sameDay', parseFloat(e.target.value))}
                    />
                 </div>
                 <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase text-slate-400 block">Next-Day Surcharge (£)</Label>
                    <Input 
                      type="number" className="h-14 rounded-xl text-center font-black text-3xl border-2 text-blue-600"
                      value={config.pickupServiceCharges?.nextDay ?? 20}
                      onChange={(e) => updateSection('pickupServiceCharges', 'nextDay', parseFloat(e.target.value))}
                    />
                 </div>
              </div>
           </Card>
        </TabsContent>

        {/* OTHER DELIVERY */}
        <TabsContent value="other" className="space-y-6">
           <Card className="rounded-2xl border-slate-200 shadow-sm p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { key: 'smallItem', label: 'Small Item' },
                    { key: 'mediumItem', label: 'Medium Item' },
                    { key: 'largeItem', label: 'Large Item' },
                    { key: 'bulkyItem', label: 'Bulky Item' }
                  ].map(size => (
                    <div key={size.key} className="space-y-2">
                       <Label className="text-[10px] font-black uppercase text-slate-400 block text-center">{size.label} Base</Label>
                       <Input 
                         type="number" className="h-12 rounded-xl text-center font-black text-xl border-2"
                         value={(config.otherDeliveryCharges as any)?.[size.key] ?? 0}
                         onChange={(e) => updateSection('otherDeliveryCharges', size.key, parseFloat(e.target.value))}
                       />
                    </div>
                  ))}
              </div>
           </Card>
        </TabsContent>

        {/* GLOBAL ADJUSTMENTS & DAY OF WEEK */}
        <TabsContent value="global" className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="rounded-2xl border-slate-200 shadow-sm">
                 <CardHeader className="p-6 border-b bg-slate-50/50">
                    <CardTitle className="text-sm font-black uppercase flex items-center gap-2"><Calendar className="h-4 w-4 text-slate-900" /> Day of Week Multipliers</CardTitle>
                 </CardHeader>
                 <CardContent className="p-6 grid grid-cols-4 gap-3">
                    {Object.entries(config.dayOfWeekMultipliers ?? {}).map(([day, val]) => (
                       <div key={day} className="text-center">
                          <Label className="text-[9px] font-black uppercase text-slate-500 block mb-1 truncate">{day}</Label>
                          <Input 
                            type="number" step="0.05" className="h-8 text-xs font-bold text-center"
                            value={val as number}
                            onChange={(e) => {
                               const newDays = { ...config.dayOfWeekMultipliers, [day]: parseFloat(e.target.value) || 1.0 };
                               setConfig(prev => ({ ...prev, dayOfWeekMultipliers: newDays }));
                            }}
                          />
                       </div>
                    ))}
                 </CardContent>
              </Card>

              <Card className="rounded-2xl border-slate-200 shadow-sm">
                 <CardHeader className="p-6 border-b bg-slate-50/50">
                    <CardTitle className="text-sm font-black uppercase flex items-center gap-2"><Route className="h-4 w-4 text-slate-900" /> General Surcharges</CardTitle>
                 </CardHeader>
                 <CardContent className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                       <Label className="text-xs font-bold">Weekend Surcharge (£)</Label>
                       <Input 
                         type="number" className="w-20 h-9 text-center font-bold"
                         value={config.dateSurcharges?.weekendSurcharge ?? 40}
                         onChange={(e) => updateSection('dateSurcharges', 'weekendSurcharge', parseFloat(e.target.value))}
                       />
                    </div>
                    <div className="flex justify-between items-center">
                       <Label className="text-xs font-bold">Peak Season (£)</Label>
                       <Input 
                         type="number" className="w-20 h-9 text-center font-bold"
                         value={config.dateSurcharges?.peakSeasonSurcharge ?? 60}
                         onChange={(e) => updateSection('dateSurcharges', 'peakSeasonSurcharge', parseFloat(e.target.value))}
                       />
                    </div>
                    <div className="flex justify-between items-center">
                       <Label className="text-xs font-bold">Flexible Date Discount (£)</Label>
                       <Input 
                         type="number" className="w-20 h-9 text-center font-bold text-emerald-600"
                         value={config.dateSurcharges?.flexibleDateDiscount ?? 20}
                         onChange={(e) => updateSection('dateSurcharges', 'flexibleDateDiscount', parseFloat(e.target.value))}
                       />
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                       <Label className="text-xs font-bold">Stairs / Floor (£)</Label>
                       <Input 
                         type="number" className="w-20 h-9 text-center font-bold"
                         value={config.accessCharges?.stairsWithoutLiftPerFloor ?? 15}
                         onChange={(e) => updateSection('accessCharges', 'stairsWithoutLiftPerFloor', parseFloat(e.target.value))}
                       />
                    </div>
                 </CardContent>
              </Card>
           </div>
        </TabsContent>

        {/* 🆕 BUSINESS MARGIN (The requested section) */}
        <TabsContent value="margins" className="space-y-6 animate-in slide-in-from-right-4 duration-500">
           <Card className="rounded-3xl border-purple-200 shadow-xl shadow-purple-50 overflow-hidden border-t-8 border-t-purple-600">
              <CardHeader className="bg-purple-50/50 p-8 border-b border-purple-100">
                 <div className="flex items-center gap-4">
                    <div className="bg-purple-600 p-3 rounded-2xl text-white shadow-lg shadow-purple-200">
                       <TrendingUp className="h-6 w-6" />
                    </div>
                    <div>
                       <CardTitle className="text-xl font-black uppercase tracking-tight text-slate-900">Margin Configuration</CardTitle>
                       <CardDescription className="text-purple-700 font-bold text-[10px] uppercase tracking-widest mt-1">Control platform fees and driver earnings distribution</CardDescription>
                    </div>
                 </div>
              </CardHeader>
              <CardContent className="p-10">
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Side: Margin Type Selection */}
                    <div className="space-y-8">
                       <div>
                          <Label className="text-sm font-black uppercase tracking-widest text-slate-500 block mb-6">Select Margin Type</Label>
                          <div className="grid grid-cols-1 gap-4">
                             {[
                               { id: 'percentage', label: 'Percentage Margin', icon: Percent, desc: 'Platform takes a percentage of the customer price' },
                               { id: 'fixed', label: 'Fixed Margin', icon: CircleDollarSign, desc: 'Platform takes a fixed amount per job' },
                               { id: 'hybrid', label: 'Hybrid (% + Minimum)', icon: Layers, desc: 'Use whichever margin is higher' }
                             ].map((type) => (
                               <button
                                 key={type.id}
                                 onClick={() => updateSection('platformMargin', 'marginType', type.id)}
                                 className={`flex items-start gap-4 p-5 rounded-2xl border-2 transition-all text-left ${
                                   config.platformMargin?.marginType === type.id 
                                   ? 'border-purple-600 bg-purple-50 shadow-md ring-4 ring-purple-100' 
                                   : 'border-slate-100 bg-white hover:border-slate-300'
                                 }`}
                               >
                                 <div className={`p-2 rounded-lg ${config.platformMargin?.marginType === type.id ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                   <type.icon className="h-5 w-5" />
                                 </div>
                                 <div>
                                   <div className="font-black text-slate-900 uppercase text-xs">{type.label}</div>
                                   <p className="text-[10px] text-slate-500 mt-1 font-medium">{type.desc}</p>
                                 </div>
                                 {config.platformMargin?.marginType === type.id && (
                                   <div className="ml-auto">
                                      <div className="w-3 h-3 rounded-full bg-purple-600 animate-pulse" />
                                   </div>
                                 )}
                               </button>
                             ))}
                          </div>
                       </div>
                    </div>

                    {/* Right Side: Specific Values */}
                    <div className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-200">
                       <div className="space-y-8">
                          {/* Percentage Value */}
                          {(config.platformMargin?.marginType === 'percentage' || config.platformMargin?.marginType === 'hybrid') && (
                            <div className="space-y-3 animate-in fade-in duration-300">
                               <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Percentage Margin (%)</Label>
                               <div className="relative">
                                  <Input 
                                    type="number"
                                    value={config.platformMargin?.percentageValue ?? 30}
                                    onChange={(e) => updateSection('platformMargin', 'percentageValue', parseFloat(e.target.value))}
                                    className="h-16 rounded-2xl text-center font-black text-4xl border-2 border-purple-200 focus:border-purple-600 pr-10"
                                  />
                                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 font-black text-2xl">%</span>
                               </div>
                               <p className="text-[10px] text-slate-400 italic">Example: 20% margin on £150 = £30 platform fee, £120 driver earnings</p>
                            </div>
                          )}

                          {/* Fixed Value */}
                          {config.platformMargin?.marginType === 'fixed' && (
                            <div className="space-y-3 animate-in fade-in duration-300">
                               <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Fixed Fee per Job (£)</Label>
                               <div className="relative">
                                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 font-black text-2xl">£</span>
                                  <Input 
                                    type="number"
                                    value={config.platformMargin?.fixedValue ?? 30}
                                    onChange={(e) => updateSection('platformMargin', 'fixedValue', parseFloat(e.target.value))}
                                    className="h-16 rounded-2xl text-center font-black text-4xl border-2 border-purple-200 focus:border-purple-600 pl-10"
                                  />
                               </div>
                            </div>
                          )}

                          {/* Hybrid Minimum */}
                          {config.platformMargin?.marginType === 'hybrid' && (
                            <div className="space-y-3 animate-in fade-in duration-300">
                               <Separator className="my-6" />
                               <Label className="text-[10px] font-black uppercase tracking-widest text-purple-600">Hybrid Minimum Guaranteed (£)</Label>
                               <div className="relative">
                                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-purple-300 font-black text-2xl">£</span>
                                  <Input 
                                    type="number"
                                    value={config.platformMargin?.hybridMinimumValue ?? 25}
                                    onChange={(e) => updateSection('platformMargin', 'hybridMinimumValue', parseFloat(e.target.value))}
                                    className="h-16 rounded-2xl text-center font-black text-4xl border-2 border-purple-200 focus:border-purple-600 pl-10 bg-white shadow-inner"
                                  />
                               </div>
                               <p className="text-[10px] text-purple-700 font-medium">System will take whichever is HIGHER: the percentage or this minimum.</p>
                            </div>
                          )}

                          {/* Summary Box */}
                          <div className="pt-6">
                             <div className="p-6 bg-slate-900 rounded-3xl text-white">
                                <div className="text-[10px] font-black uppercase text-purple-400 mb-4">Current Policy Summary</div>
                                <div className="text-sm font-bold">
                                   {config.platformMargin?.marginType === 'percentage' && `You receive ${config.platformMargin?.percentageValue}% from every completed job.`}
                                   {config.platformMargin?.marginType === 'fixed' && `You receive a flat fee of £${config.platformMargin?.fixedValue} per job.`}
                                   {config.platformMargin?.marginType === 'hybrid' && `You receive ${config.platformMargin?.percentageValue}% of the job price, but never less than £${config.platformMargin?.hybridMinimumValue}.`}
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </CardContent>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
