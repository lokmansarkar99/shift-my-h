import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { toast } from 'sonner';
import { Save, RefreshCw, RotateCcw, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import {
  fetchDriverPricingConfig,
  saveDriverPricingConfig,
  DriverPricingConfig,
  DEFAULT_DRIVER_PRICING,
  DriverItemPrice,
} from '../../utils/driverPricingEngine';

export function DriverPricingManager() {
  const [config, setConfig] = useState<DriverPricingConfig>(DEFAULT_DRIVER_PRICING);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    setLoading(true);
    try {
      const loadedConfig = await fetchDriverPricingConfig();
      setConfig(loadedConfig);
    } catch (error) {
      console.error('Error loading driver pricing config:', error);
      toast.error('Failed to load driver pricing configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await saveDriverPricingConfig(config);
      if (result.success) {
        toast.success('Driver pricing configuration saved successfully');
      } else {
        toast.error(result.error || 'Failed to save configuration');
      }
    } catch (error) {
      console.error('Error saving config:', error);
      toast.error('Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset to default values?')) {
      setConfig(DEFAULT_DRIVER_PRICING);
      toast.info('Reset to default values (not saved yet)');
    }
  };

  const updateItem = (itemId: string, updates: Partial<DriverItemPrice>) => {
    setConfig({
      ...config,
      items: config.items.map(item =>
        item.id === itemId ? { ...item, ...updates } : item
      ),
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
        <span className="ml-2 text-slate-600">Loading driver pricing configuration...</span>
      </div>
    );
  }

  const furnitureItems = config.items.filter(i => i.category === 'furniture');
  const applianceItems = config.items.filter(i => i.category === 'appliance');
  const boxItems = config.items.filter(i => i.category === 'box');
  const specialtyItems = config.items.filter(i => i.category === 'specialty');
  const vehicleItems = config.items.filter(i => i.category === 'vehicle');

  return (
    <div className="space-y-6">
      {/* Header - Same style as Pricing Rules */}
      <Card className="border-2 border-slate-200 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-slate-900">Driver Pricing Configuration</CardTitle>
              <CardDescription className="text-sm text-slate-600 mt-1">
                Configure all driver pricing rules. Changes apply immediately to new on-site additions.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleReset} disabled={saving}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset to Defaults
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Configuration'}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Info Alert */}
      <Alert className="border-blue-200 bg-blue-50">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-sm text-blue-900">
          <strong>🎯 Driver Pricing:</strong> These prices are for items added <strong>ON-SITE</strong> by drivers when customers
          forget to mention them. Late addition surcharges and multipliers apply automatically.
        </AlertDescription>
      </Alert>

      {/* Global Settings - Same card style */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50/50 border-b border-slate-200">
          <CardTitle className="text-lg font-semibold text-slate-900">⚙️ Global Settings</CardTitle>
          <CardDescription className="text-xs text-slate-600">
            Late addition policies and minimum charges
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="space-y-2">
              <Label htmlFor="lateMultiplier" className="text-sm font-medium text-slate-700">
                Late Addition Multiplier
              </Label>
              <Input
                id="lateMultiplier"
                type="number"
                step="0.05"
                value={config.lateAdditionMultiplier}
                onChange={(e) => setConfig({ ...config, lateAdditionMultiplier: parseFloat(e.target.value) || 1.2 })}
                className="font-mono"
              />
              <p className="text-xs text-slate-500">
                {config.lateAdditionMultiplier} = +{((config.lateAdditionMultiplier - 1) * 100).toFixed(0)}% on all on-site additions
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="minCharge" className="text-sm font-medium text-slate-700">
                Minimum Extra Charge (£)
              </Label>
              <Input
                id="minCharge"
                type="number"
                step="5"
                value={config.minimumExtraCharge}
                onChange={(e) => setConfig({ ...config, minimumExtraCharge: parseFloat(e.target.value) || 25 })}
                className="font-mono"
              />
              <p className="text-xs text-slate-500">
                Minimum charge for any extra item
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cashDiscount" className="text-sm font-medium text-slate-700">
                Cash Payment Discount
              </Label>
              <Input
                id="cashDiscount"
                type="number"
                step="0.01"
                value={config.cashPaymentDiscount}
                onChange={(e) => setConfig({ ...config, cashPaymentDiscount: parseFloat(e.target.value) || 0.05 })}
                className="font-mono"
              />
              <p className="text-xs text-slate-500">
                {config.cashPaymentDiscount} = {(config.cashPaymentDiscount * 100).toFixed(0)}% off if customer pays cash
              </p>
            </div>
          </div>

          {/* 💰 REVENUE SPLIT SECTION (NEW) */}
          <Separator className="my-6" />
          
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg font-bold">💰</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Revenue Split Configuration</h4>
                <p className="text-xs text-slate-600">How extra item payments are divided between driver and company</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Driver Commission */}
              <div className="space-y-2">
                <Label htmlFor="driverCommission" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  🚚 Driver Commission
                </Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="driverCommission"
                    type="number"
                    step="0.05"
                    min="0"
                    max="1"
                    value={config.driverCommissionPercentage}
                    onChange={(e) => {
                      const driverPct = parseFloat(e.target.value) || 0.70;
                      setConfig({ 
                        ...config, 
                        driverCommissionPercentage: driverPct,
                        companyRevenuePercentage: 1 - driverPct 
                      });
                    }}
                    className="font-mono"
                  />
                  <span className="text-lg font-bold text-green-700 min-w-[60px]">
                    {(config.driverCommissionPercentage * 100).toFixed(0)}%
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Driver receives <strong className="text-green-700">{(config.driverCommissionPercentage * 100).toFixed(0)}%</strong> of every extra item sale
                </p>
              </div>

              {/* Company Revenue */}
              <div className="space-y-2">
                <Label htmlFor="companyRevenue" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  🏢 Company Revenue
                </Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="companyRevenue"
                    type="number"
                    step="0.05"
                    min="0"
                    max="1"
                    value={config.companyRevenuePercentage}
                    onChange={(e) => {
                      const companyPct = parseFloat(e.target.value) || 0.30;
                      setConfig({ 
                        ...config, 
                        companyRevenuePercentage: companyPct,
                        driverCommissionPercentage: 1 - companyPct 
                      });
                    }}
                    className="font-mono"
                  />
                  <span className="text-lg font-bold text-blue-700 min-w-[60px]">
                    {(config.companyRevenuePercentage * 100).toFixed(0)}%
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Company receives <strong className="text-blue-700">{(config.companyRevenuePercentage * 100).toFixed(0)}%</strong> of every extra item sale
                </p>
              </div>
            </div>

            {/* Validation Warning */}
            {Math.abs((config.driverCommissionPercentage + config.companyRevenuePercentage) - 1.0) > 0.01 && (
              <Alert className="mt-4 border-red-300 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-sm text-red-800">
                  ⚠️ <strong>Error:</strong> Driver Commission + Company Revenue must equal 100%! 
                  Currently: {((config.driverCommissionPercentage + config.companyRevenuePercentage) * 100).toFixed(0)}%
                </AlertDescription>
              </Alert>
            )}

            {/* Example Calculation */}
            <div className="mt-4 bg-white rounded-lg p-4 border border-slate-200">
              <div className="text-xs font-semibold text-slate-700 mb-2">💡 Example Split:</div>
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="text-slate-600">Customer Pays</div>
                  <div className="text-lg font-bold text-slate-900">£100.00</div>
                </div>
                <div>
                  <div className="text-slate-600">Driver Gets</div>
                  <div className="text-lg font-bold text-green-700">£{(100 * config.driverCommissionPercentage).toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-slate-600">Company Gets</div>
                  <div className="text-lg font-bold text-blue-700">£{(100 * config.companyRevenuePercentage).toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 🪑 FURNITURE ITEMS */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50/50 border-b border-slate-200">
          <CardTitle className="text-lg font-semibold text-slate-900">🪑 Furniture Items</CardTitle>
          <CardDescription className="text-xs text-slate-600">
            Pricing for furniture items added on-site
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 text-xs text-slate-600 uppercase tracking-wider">
                  <th className="text-left py-3 px-3 font-semibold">Item</th>
                  <th className="text-right py-3 px-3 font-semibold">Base Price (£)</th>
                  <th className="text-right py-3 px-3 font-semibold">Late Surcharge</th>
                  <th className="text-right py-3 px-3 font-semibold bg-blue-50">Total On-Site</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {furnitureItems.map(item => {
                  const onSitePrice = item.basePrice * (1 + item.lateAdditionSurcharge) * config.lateAdditionMultiplier;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-3">
                        <div>
                          <p className="font-medium text-sm text-slate-900">{item.name}</p>
                          {item.description && <p className="text-xs text-slate-500">{item.description}</p>}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Input
                          type="number"
                          step="5"
                          value={item.basePrice}
                          onChange={(e) => updateItem(item.id, { basePrice: parseFloat(e.target.value) || 0 })}
                          className="w-24 text-right font-mono text-sm ml-auto"
                        />
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Input
                            type="number"
                            step="0.05"
                            value={item.lateAdditionSurcharge}
                            onChange={(e) => updateItem(item.id, { lateAdditionSurcharge: parseFloat(e.target.value) || 0 })}
                            className="w-20 text-right font-mono text-sm"
                          />
                          <span className="text-xs text-slate-500 w-10">{(item.lateAdditionSurcharge * 100).toFixed(0)}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right bg-blue-50/50">
                        <span className="text-sm font-bold text-blue-700">£{onSitePrice.toFixed(2)}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 🔌 APPLIANCES */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50/50 border-b border-slate-200">
          <CardTitle className="text-lg font-semibold text-slate-900">🔌 Appliances</CardTitle>
          <CardDescription className="text-xs text-slate-600">
            Pricing for appliances added on-site
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 text-xs text-slate-600 uppercase tracking-wider">
                  <th className="text-left py-3 px-3 font-semibold">Item</th>
                  <th className="text-right py-3 px-3 font-semibold">Base Price (£)</th>
                  <th className="text-right py-3 px-3 font-semibold">Late Surcharge</th>
                  <th className="text-right py-3 px-3 font-semibold bg-blue-50">Total On-Site</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applianceItems.map(item => {
                  const onSitePrice = item.basePrice * (1 + item.lateAdditionSurcharge) * config.lateAdditionMultiplier;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-3">
                        <div>
                          <p className="font-medium text-sm text-slate-900">{item.name}</p>
                          {item.description && <p className="text-xs text-slate-500">{item.description}</p>}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Input
                          type="number"
                          step="5"
                          value={item.basePrice}
                          onChange={(e) => updateItem(item.id, { basePrice: parseFloat(e.target.value) || 0 })}
                          className="w-24 text-right font-mono text-sm ml-auto"
                        />
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Input
                            type="number"
                            step="0.05"
                            value={item.lateAdditionSurcharge}
                            onChange={(e) => updateItem(item.id, { lateAdditionSurcharge: parseFloat(e.target.value) || 0 })}
                            className="w-20 text-right font-mono text-sm"
                          />
                          <span className="text-xs text-slate-500 w-10">{(item.lateAdditionSurcharge * 100).toFixed(0)}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right bg-blue-50/50">
                        <span className="text-sm font-bold text-blue-700">£{onSitePrice.toFixed(2)}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 📦 BOXES & BAGS */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50/50 border-b border-slate-200">
          <CardTitle className="text-lg font-semibold text-slate-900">📦 Boxes & Bags</CardTitle>
          <CardDescription className="text-xs text-slate-600">
            Pricing for boxes and bags added on-site
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 text-xs text-slate-600 uppercase tracking-wider">
                  <th className="text-left py-3 px-3 font-semibold">Item</th>
                  <th className="text-right py-3 px-3 font-semibold">Base Price (£)</th>
                  <th className="text-right py-3 px-3 font-semibold">Late Surcharge</th>
                  <th className="text-right py-3 px-3 font-semibold bg-blue-50">Total On-Site</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {boxItems.map(item => {
                  const onSitePrice = item.basePrice * (1 + item.lateAdditionSurcharge) * config.lateAdditionMultiplier;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-3">
                        <div>
                          <p className="font-medium text-sm text-slate-900">{item.name}</p>
                          {item.description && <p className="text-xs text-slate-500">{item.description}</p>}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Input
                          type="number"
                          step="1"
                          value={item.basePrice}
                          onChange={(e) => updateItem(item.id, { basePrice: parseFloat(e.target.value) || 0 })}
                          className="w-24 text-right font-mono text-sm ml-auto"
                        />
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Input
                            type="number"
                            step="0.05"
                            value={item.lateAdditionSurcharge}
                            onChange={(e) => updateItem(item.id, { lateAdditionSurcharge: parseFloat(e.target.value) || 0 })}
                            className="w-20 text-right font-mono text-sm"
                          />
                          <span className="text-xs text-slate-500 w-10">{(item.lateAdditionSurcharge * 100).toFixed(0)}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right bg-blue-50/50">
                        <span className="text-sm font-bold text-blue-700">£{onSitePrice.toFixed(2)}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ✨ SPECIALTY ITEMS */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50/50 border-b border-slate-200">
          <CardTitle className="text-lg font-semibold text-slate-900">✨ Specialty Items</CardTitle>
          <CardDescription className="text-xs text-slate-600">
            Pricing for specialty items added on-site
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 text-xs text-slate-600 uppercase tracking-wider">
                  <th className="text-left py-3 px-3 font-semibold">Item</th>
                  <th className="text-right py-3 px-3 font-semibold">Base Price (£)</th>
                  <th className="text-right py-3 px-3 font-semibold">Late Surcharge</th>
                  <th className="text-right py-3 px-3 font-semibold bg-blue-50">Total On-Site</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {specialtyItems.map(item => {
                  const onSitePrice = item.basePrice * (1 + item.lateAdditionSurcharge) * config.lateAdditionMultiplier;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-3">
                        <div>
                          <p className="font-medium text-sm text-slate-900">{item.name}</p>
                          {item.description && <p className="text-xs text-slate-500">{item.description}</p>}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Input
                          type="number"
                          step="5"
                          value={item.basePrice}
                          onChange={(e) => updateItem(item.id, { basePrice: parseFloat(e.target.value) || 0 })}
                          className="w-24 text-right font-mono text-sm ml-auto"
                        />
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Input
                            type="number"
                            step="0.05"
                            value={item.lateAdditionSurcharge}
                            onChange={(e) => updateItem(item.id, { lateAdditionSurcharge: parseFloat(e.target.value) || 0 })}
                            className="w-20 text-right font-mono text-sm"
                          />
                          <span className="text-xs text-slate-500 w-10">{(item.lateAdditionSurcharge * 100).toFixed(0)}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right bg-blue-50/50">
                        <span className="text-sm font-bold text-blue-700">£{onSitePrice.toFixed(2)}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 🚲 VEHICLES */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50/50 border-b border-slate-200">
          <CardTitle className="text-lg font-semibold text-slate-900">🚲 Vehicles</CardTitle>
          <CardDescription className="text-xs text-slate-600">
            Pricing for vehicles added on-site
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 text-xs text-slate-600 uppercase tracking-wider">
                  <th className="text-left py-3 px-3 font-semibold">Item</th>
                  <th className="text-right py-3 px-3 font-semibold">Base Price (£)</th>
                  <th className="text-right py-3 px-3 font-semibold">Late Surcharge</th>
                  <th className="text-right py-3 px-3 font-semibold bg-blue-50">Total On-Site</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vehicleItems.map(item => {
                  const onSitePrice = item.basePrice * (1 + item.lateAdditionSurcharge) * config.lateAdditionMultiplier;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-3">
                        <div>
                          <p className="font-medium text-sm text-slate-900">{item.name}</p>
                          {item.description && <p className="text-xs text-slate-500">{item.description}</p>}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Input
                          type="number"
                          step="5"
                          value={item.basePrice}
                          onChange={(e) => updateItem(item.id, { basePrice: parseFloat(e.target.value) || 0 })}
                          className="w-24 text-right font-mono text-sm ml-auto"
                        />
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Input
                            type="number"
                            step="0.05"
                            value={item.lateAdditionSurcharge}
                            onChange={(e) => updateItem(item.id, { lateAdditionSurcharge: parseFloat(e.target.value) || 0 })}
                            className="w-20 text-right font-mono text-sm"
                          />
                          <span className="text-xs text-slate-500 w-10">{(item.lateAdditionSurcharge * 100).toFixed(0)}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right bg-blue-50/50">
                        <span className="text-sm font-bold text-blue-700">£{onSitePrice.toFixed(2)}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Footer timestamp */}
      {config.lastUpdated && (
        <div className="text-center">
          <p className="text-sm text-slate-500">
            Last updated: {new Date(config.lastUpdated).toLocaleString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })}
          </p>
        </div>
      )}
    </div>
  );
}