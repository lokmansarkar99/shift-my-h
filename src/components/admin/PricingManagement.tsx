import React, { useState } from 'react';
import { PoundSterling, Settings, Calculator, Sliders } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { PricingRulesManager } from './PricingRulesManager';
import { QuoteCalculator } from './QuoteCalculator';
import { AdminExtraPricingSettings } from './AdminExtraPricingSettings';
import { ServiceTypesManager } from './ServiceTypesManager';

export function PricingManagement() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Pricing & Quotes</h2>
          <p className="text-slate-600 mt-1">Configure pricing rules, calculate quotes, and manage rates</p>
        </div>
      </div>

      <Tabs defaultValue="rules" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="rules" className="flex items-center gap-2">
            <Sliders className="h-4 w-4" />
            Pricing Rules
          </TabsTrigger>
          <TabsTrigger value="service-types" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Service Types
          </TabsTrigger>
          <TabsTrigger value="calculator" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Quote Calculator
          </TabsTrigger>
          <TabsTrigger value="extras" className="flex items-center gap-2">
            <PoundSterling className="h-4 w-4" />
            Extras Pricing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="mt-6">
          <PricingRulesManager />
        </TabsContent>

        <TabsContent value="service-types" className="mt-6">
          <ServiceTypesManager />
        </TabsContent>

        <TabsContent value="calculator" className="mt-6">
          <QuoteCalculator />
        </TabsContent>

        <TabsContent value="extras" className="mt-6">
          <AdminExtraPricingSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
