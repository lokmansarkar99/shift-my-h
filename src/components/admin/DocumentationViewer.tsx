import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { 
  BookOpen, 
  FileText, 
  Download, 
  ExternalLink, 
  DollarSign,
  TrendingUp,
  Percent,
  Package,
  CheckCircle2,
  Info
} from 'lucide-react';

export function DocumentationViewer() {
  const [activeDoc, setActiveDoc] = useState<'margin' | 'revenue'>('revenue');

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-slate-200 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <BookOpen className="w-7 h-7 text-blue-600" />
                Pricing Documentation
              </CardTitle>
              <CardDescription className="text-sm text-slate-600 mt-1">
                Complete guides for understanding pricing systems and configuration
              </CardDescription>
            </div>
            <Badge className="bg-green-100 text-green-800 border-green-300 px-4 py-2 text-sm font-semibold">
              <CheckCircle2 className="w-4 h-4 mr-1" />
              Up to Date
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-4">
        <Card 
          className={`cursor-pointer transition-all hover:shadow-lg border-2 ${
            activeDoc === 'revenue' 
              ? 'border-green-500 bg-green-50' 
              : 'border-slate-200 hover:border-green-300'
          }`}
          onClick={() => setActiveDoc('revenue')}
        >
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 text-lg mb-1">Revenue Split System</h3>
                <p className="text-sm text-slate-600 mb-3">
                  Driver Pricing Engine - How extra items are priced and split between driver & company
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Badge variant="outline" className="bg-white">Driver Commission</Badge>
                  <Badge variant="outline" className="bg-white">Extra Items</Badge>
                  <Badge variant="outline" className="bg-white">70/30 Split</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all hover:shadow-lg border-2 ${
            activeDoc === 'margin' 
              ? 'border-purple-500 bg-purple-50' 
              : 'border-slate-200 hover:border-purple-300'
          }`}
          onClick={() => setActiveDoc('margin')}
        >
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Percent className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 text-lg mb-1">Margin Configuration</h3>
                <p className="text-sm text-slate-600 mb-3">
                  Main Job Pricing - How driver earnings are calculated from customer prices
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Badge variant="outline" className="bg-white">Driver Rates</Badge>
                  <Badge variant="outline" className="bg-white">Main Jobs</Badge>
                  <Badge variant="outline" className="bg-white">3 Types</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documentation Content */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              {activeDoc === 'revenue' ? 'Revenue Split Implementation' : 'Margin Configuration Explained'}
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                Open in New Tab
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-400px)]">
            <div className="p-8 prose prose-slate max-w-none">
              {activeDoc === 'revenue' ? <RevenueDocumentation /> : <MarginDocumentation />}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

// Revenue Split Documentation Component
function RevenueDocumentation() {
  return (
    <div className="space-y-6">
      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mt-0 mb-2">💰 Revenue Split System</h1>
            <p className="text-slate-700 text-base mb-0">
              <strong>Driver Pricing Engine</strong> - Complete implementation guide for extra items pricing and revenue split
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="text-sm text-blue-700 font-semibold mb-1">Status</div>
          <div className="text-xl font-bold text-blue-900">✅ FULLY IMPLEMENTED</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="text-sm text-purple-700 font-semibold mb-1">Default Split</div>
          <div className="text-xl font-bold text-purple-900">70% / 30%</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="text-sm text-green-700 font-semibold mb-1">Last Updated</div>
          <div className="text-xl font-bold text-green-900">Jan 19, 2026</div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 border-b-2 border-slate-200 pb-2">🎯 What is Revenue Split?</h2>
      
      <p className="text-slate-700">
        When drivers add <strong>extra items ON-SITE</strong> (items customers forgot to mention), the payment is automatically split between:
      </p>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 border-2 border-green-300 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">🚚</span>
            </div>
            <h3 className="font-bold text-green-900 text-lg">Driver Commission</h3>
          </div>
          <div className="text-3xl font-bold text-green-700 mb-1">70%</div>
          <p className="text-sm text-green-800">Driver receives commission for upselling extra items on-site</p>
        </div>

        <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">🏢</span>
            </div>
            <h3 className="font-bold text-blue-900 text-lg">Company Revenue</h3>
          </div>
          <div className="text-3xl font-bold text-blue-700 mb-1">30%</div>
          <p className="text-sm text-blue-800">Company receives platform fee to cover overhead costs</p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 border-b-2 border-slate-200 pb-2">📐 Formula</h2>

      <div className="bg-slate-100 border-2 border-slate-300 rounded-xl p-6 font-mono text-sm">
        <div className="space-y-3">
          <div><strong>Step 1: Calculate Item Price</strong></div>
          <div className="pl-4 text-slate-700">
            basePrice = item.basePrice × quantity<br/>
            surcharge = basePrice × item.lateAdditionSurcharge<br/>
            subtotal = basePrice + surcharge<br/>
            finalPrice = subtotal × config.lateAdditionMultiplier<br/>
            finalPrice = MAX(finalPrice, config.minimumExtraCharge)
          </div>

          <div className="border-t border-slate-300 pt-3"><strong>Step 2: Apply Cash Discount (if paying cash)</strong></div>
          <div className="pl-4 text-slate-700">
            if (payingCash) &#123;<br/>
            &nbsp;&nbsp;cashDiscount = finalPrice × config.cashPaymentDiscount<br/>
            &nbsp;&nbsp;totalCustomerPaid = finalPrice - cashDiscount<br/>
            &#125;
          </div>

          <div className="border-t border-slate-300 pt-3"><strong>Step 3: Split Revenue</strong></div>
          <div className="pl-4 text-slate-700">
            driverEarnings = totalCustomerPaid × 0.70<br/>
            companyRevenue = totalCustomerPaid × 0.30
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 border-b-2 border-slate-200 pb-2">💡 Example Calculation</h2>

      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-xl p-6">
        <h3 className="font-bold text-blue-900 text-lg mb-4">📦 Example: 2-Seater Sofa (Card Payment)</h3>
        
        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong className="text-slate-700">Item:</strong> 2-Seater Sofa<br/>
              <strong className="text-slate-700">Base Price:</strong> £100<br/>
              <strong className="text-slate-700">Late Surcharge:</strong> 20%<br/>
              <strong className="text-slate-700">Global Multiplier:</strong> 1.2 (+20%)<br/>
              <strong className="text-slate-700">Quantity:</strong> 1<br/>
              <strong className="text-slate-700">Payment:</strong> Card
            </div>
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="font-mono text-xs space-y-1">
                <div>baseTotal = £100 × 1 = £100</div>
                <div>surcharge = £100 × 0.20 = £20</div>
                <div>subtotal = £100 + £20 = £120</div>
                <div>finalPrice = £120 × 1.2 = £144</div>
                <div className="border-t border-slate-300 pt-1 mt-2">
                  <strong>totalCustomerPaid = £144</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border-2 border-green-300 mt-4">
            <div className="font-bold text-green-900 mb-2">💰 Revenue Split (70% / 30%):</div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xs text-slate-600 mb-1">Customer Pays</div>
                <div className="text-2xl font-bold text-slate-900">£144.00</div>
              </div>
              <div>
                <div className="text-xs text-green-600 mb-1">Driver Gets (70%)</div>
                <div className="text-2xl font-bold text-green-700">£100.80</div>
              </div>
              <div>
                <div className="text-xs text-blue-600 mb-1">Company Gets (30%)</div>
                <div className="text-2xl font-bold text-blue-700">£43.20</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 border-b-2 border-slate-200 pb-2">⚙️ Configuration Location</h2>

      <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-yellow-700 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-yellow-900 mb-2">📍 How to Configure Revenue Split:</h3>
            <ol className="text-sm text-yellow-800 space-y-2 mb-0">
              <li><strong>1.</strong> Go to <strong>Admin Panel</strong> → <strong>Pricing & Quotes</strong></li>
              <li><strong>2.</strong> Click <strong>🚚 Driver Pricing</strong> tab</li>
              <li><strong>3.</strong> Scroll to <strong>💰 Revenue Split Configuration</strong> section</li>
              <li><strong>4.</strong> Adjust <strong>Driver Commission %</strong> and <strong>Company Revenue %</strong></li>
              <li><strong>5.</strong> Ensure percentages sum to <strong>100%</strong></li>
              <li><strong>6.</strong> Click <strong>Save Configuration</strong></li>
            </ol>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 border-b-2 border-slate-200 pb-2">🎯 Key Features</h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <h4 className="font-bold text-slate-900">Automatic Split Calculation</h4>
          </div>
          <p className="text-sm text-slate-600 mb-0">Every extra item payment is automatically split 70/30 between driver and company</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <h4 className="font-bold text-slate-900">Configurable Percentages</h4>
          </div>
          <p className="text-sm text-slate-600 mb-0">Admin can adjust split percentages to match business needs (e.g., 80/20, 60/40)</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <h4 className="font-bold text-slate-900">Live Preview</h4>
          </div>
          <p className="text-sm text-slate-600 mb-0">See example calculations in real-time as you adjust percentages</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <h4 className="font-bold text-slate-900">Validation</h4>
          </div>
          <p className="text-sm text-slate-600 mb-0">System ensures driver + company percentages always equal 100%</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 rounded-xl p-6 mt-8">
        <h3 className="font-bold text-slate-900 text-lg mb-3">📚 Full Documentation Available</h3>
        <p className="text-slate-700 mb-4">
          Complete technical documentation with 10+ examples, backend integration details, and analytics tracking 
          is available in <code className="bg-white px-2 py-1 rounded text-sm">/REVENUE_SPLIT_IMPLEMENTATION.md</code>
        </p>
        <div className="flex gap-3">
          <Button size="sm" variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            View Full Documentation
          </Button>
          <Button size="sm" variant="outline">
            <Package className="w-4 h-4 mr-2" />
            View Code Implementation
          </Button>
        </div>
      </div>
    </div>
  );
}

// Margin Configuration Documentation Component
function MarginDocumentation() {
  return (
    <div className="space-y-6">
      <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Percent className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mt-0 mb-2">📊 Margin Configuration</h1>
            <p className="text-slate-700 text-base mb-0">
              <strong>Main Job Pricing</strong> - Complete guide for automatic driver/partner pricing from customer prices
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="text-sm text-blue-700 font-semibold mb-1">Status</div>
          <div className="text-xl font-bold text-blue-900">✅ FULLY FUNCTIONAL</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="text-sm text-purple-700 font-semibold mb-1">Margin Types</div>
          <div className="text-xl font-bold text-purple-900">3 Options</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="text-sm text-green-700 font-semibold mb-1">Default Margin</div>
          <div className="text-xl font-bold text-green-900">Percentage (30%)</div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 border-b-2 border-slate-200 pb-2">🎯 What is Margin Configuration?</h2>
      
      <p className="text-slate-700">
        <strong>Margin Configuration</strong> automatically calculates how much drivers earn from jobs based on customer prices. 
        The system uses <strong>service-specific pricing engines</strong> to calculate customer prices, then applies 
        the configured margin to determine driver earnings.
      </p>

      <div className="bg-slate-100 border-2 border-slate-300 rounded-xl p-6">
        <h3 className="font-bold text-slate-900 text-lg mb-4">🔑 Key Concept:</h3>
        <div className="font-mono text-sm bg-white rounded-lg p-4 border border-slate-200">
          <div className="space-y-2 text-slate-700">
            <div><strong className="text-blue-600">Customer Price</strong> = What customer pays</div>
            <div><strong className="text-purple-600">Company Margin</strong> = Company's cut</div>
            <div><strong className="text-green-600">Driver Price</strong> = What driver earns</div>
            <div className="border-t border-slate-300 pt-2 mt-3">
              <strong>Formula:</strong> Driver Price = Customer Price - Company Margin
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 border-b-2 border-slate-200 pb-2">🔄 How it works</h2>

      <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-300 rounded-xl p-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600 font-bold text-sm">
              1
            </div>
            <div>
              <strong className="text-slate-900">Customer price</strong> is calculated using service-specific pricing engines:
              <div className="text-sm text-slate-600 mt-1 ml-0 bg-white rounded-lg p-3 border border-blue-200">
                • <strong>House Move:</strong> Time-Based (inventory → volume → time → £60/hr)<br/>
                • <strong>Furniture & Items:</strong> Volume-Based (volume × £12/m³)<br/>
                • <strong>Other services:</strong> Service-specific formulas
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 text-purple-600 font-bold text-sm">
              2
            </div>
            <div>
              <strong className="text-slate-900">Driver price</strong> is calculated from customer price using your margin configuration
              <div className="text-sm text-slate-600 mt-1 ml-0 bg-white rounded-lg p-3 border border-purple-200">
                Based on your selected margin type (percentage, fixed, or hybrid)
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 text-green-600 font-bold text-sm">
              3
            </div>
            <div>
              <strong className="text-slate-900">Admin sees both prices</strong>, driver sees only their earnings amount
              <div className="text-sm text-slate-600 mt-1 ml-0 bg-white rounded-lg p-3 border border-green-200">
                Full transparency for admins, simplified view for drivers
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 text-orange-600 font-bold text-sm">
              4
            </div>
            <div>
              <strong className="text-slate-900">Platform margin</strong> is calculated automatically
              <div className="text-sm text-slate-600 mt-1 ml-0 bg-white rounded-lg p-3 border border-orange-200">
                Platform Margin = Customer Price - Driver Price
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 border-b-2 border-slate-200 pb-2">⚙️ Three Margin Types</h2>

      <div className="space-y-4">
        {/* Percentage Margin */}
        <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <Percent className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-purple-900 text-lg">1️⃣ Percentage Margin (Default: 30%)</h3>
              <p className="text-sm text-purple-700">Platform takes a percentage of the customer price</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-purple-200">
            <div className="text-sm font-mono mb-3">
              <strong>Formula:</strong><br/>
              Company Margin = Customer Price × Percentage<br/>
              Driver Price = Customer Price - Company Margin
            </div>
            
            <div className="bg-purple-100 rounded-lg p-3 border border-purple-300">
              <strong className="text-purple-900">Example:</strong>
              <div className="grid grid-cols-3 gap-3 mt-2 text-center text-sm">
                <div>
                  <div className="text-xs text-purple-700">Customer</div>
                  <div className="font-bold text-purple-900">£150</div>
                </div>
                <div>
                  <div className="text-xs text-purple-700">Company (30%)</div>
                  <div className="font-bold text-purple-900">£45</div>
                </div>
                <div>
                  <div className="text-xs text-purple-700">Driver (70%)</div>
                  <div className="font-bold text-purple-900">£105</div>
                </div>
              </div>
            </div>

            <div className="mt-3 text-xs">
              <div className="flex gap-4">
                <div>
                  <strong className="text-green-700">✅ Pros:</strong>
                  <div className="text-slate-600">Scales with job value, fair for all sizes</div>
                </div>
                <div>
                  <strong className="text-red-700">❌ Cons:</strong>
                  <div className="text-slate-600">Small jobs = small company revenue</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Margin */}
        <div className="bg-green-50 border-2 border-green-300 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-green-900 text-lg">2️⃣ Fixed Margin (Default: £15)</h3>
              <p className="text-sm text-green-700">Platform takes a fixed amount per job</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <div className="text-sm font-mono mb-3">
              <strong>Formula:</strong><br/>
              Company Margin = Fixed Amount (e.g., £15)<br/>
              Driver Price = Customer Price - Fixed Margin
            </div>
            
            <div className="bg-green-100 rounded-lg p-3 border border-green-300">
              <strong className="text-green-900">Example:</strong>
              <div className="grid grid-cols-3 gap-3 mt-2 text-center text-sm">
                <div>
                  <div className="text-xs text-green-700">Customer</div>
                  <div className="font-bold text-green-900">£150</div>
                </div>
                <div>
                  <div className="text-xs text-green-700">Company (£15)</div>
                  <div className="font-bold text-green-900">£15</div>
                </div>
                <div>
                  <div className="text-xs text-green-700">Driver (90%)</div>
                  <div className="font-bold text-green-900">£135</div>
                </div>
              </div>
            </div>

            <div className="mt-3 text-xs">
              <div className="flex gap-4">
                <div>
                  <strong className="text-green-700">✅ Pros:</strong>
                  <div className="text-slate-600">Predictable company revenue</div>
                </div>
                <div>
                  <strong className="text-red-700">❌ Cons:</strong>
                  <div className="text-slate-600">Unfair on cheap jobs (30%!)</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hybrid Margin */}
        <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-blue-900 text-lg">3️⃣ Hybrid Margin (RECOMMENDED)</h3>
              <p className="text-sm text-blue-700">Use whichever margin is higher (percentage OR minimum)</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <div className="text-sm font-mono mb-3">
              <strong>Formula:</strong><br/>
              Percentage Margin = Customer Price × Percentage<br/>
              Company Margin = MAX(Percentage Margin, Minimum Margin)<br/>
              Driver Price = Customer Price - Company Margin
            </div>
            
            <div className="bg-blue-100 rounded-lg p-3 border border-blue-300">
              <strong className="text-blue-900">Example 1 - Expensive Job:</strong>
              <div className="grid grid-cols-4 gap-2 mt-2 text-center text-xs">
                <div>
                  <div className="text-blue-700">Customer</div>
                  <div className="font-bold text-blue-900">£150</div>
                </div>
                <div>
                  <div className="text-blue-700">20% = £30</div>
                  <div className="font-bold text-blue-900">MIN £10</div>
                </div>
                <div>
                  <div className="text-blue-700">Company</div>
                  <div className="font-bold text-blue-900">£30 ✅</div>
                </div>
                <div>
                  <div className="text-blue-700">Driver</div>
                  <div className="font-bold text-blue-900">£120</div>
                </div>
              </div>

              <div className="border-t border-blue-300 mt-3 pt-3">
                <strong className="text-blue-900">Example 2 - Cheap Job:</strong>
                <div className="grid grid-cols-4 gap-2 mt-2 text-center text-xs">
                  <div>
                    <div className="text-blue-700">Customer</div>
                    <div className="font-bold text-blue-900">£40</div>
                  </div>
                  <div>
                    <div className="text-blue-700">20% = £8</div>
                    <div className="font-bold text-blue-900">MIN £10</div>
                  </div>
                  <div>
                    <div className="text-blue-700">Company</div>
                    <div className="font-bold text-blue-900">£10 ✅</div>
                  </div>
                  <div>
                    <div className="text-blue-700">Driver</div>
                    <div className="font-bold text-blue-900">£30</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 text-xs">
              <div className="flex gap-4">
                <div>
                  <strong className="text-green-700">✅ Pros:</strong>
                  <div className="text-slate-600">Best of both worlds, minimum guarantee</div>
                </div>
                <div>
                  <strong className="text-red-700">❌ Cons:</strong>
                  <div className="text-slate-600">Slightly more complex</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 border-b-2 border-slate-200 pb-2">📊 Comparison Table</h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 border-b-2 border-slate-300">
              <th className="border border-slate-300 p-3 text-left font-bold">Job Price</th>
              <th className="border border-slate-300 p-3 text-center font-bold bg-purple-50">Percentage (30%)</th>
              <th className="border border-slate-300 p-3 text-center font-bold bg-green-50">Fixed (£15)</th>
              <th className="border border-slate-300 p-3 text-center font-bold bg-blue-50">Hybrid (20% or £10)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-300 p-3 font-bold">£50</td>
              <td className="border border-slate-300 p-3 text-center bg-purple-50">
                <div className="font-semibold text-purple-900">Driver: £35</div>
                <div className="text-xs text-purple-700">Company: £15 (30%)</div>
              </td>
              <td className="border border-slate-300 p-3 text-center bg-green-50">
                <div className="font-semibold text-green-900">Driver: £35</div>
                <div className="text-xs text-green-700">Company: £15 (30%)</div>
              </td>
              <td className="border border-slate-300 p-3 text-center bg-blue-50">
                <div className="font-semibold text-blue-900">Driver: £40 ✅</div>
                <div className="text-xs text-blue-700">Company: £10 (20%)</div>
              </td>
            </tr>
            <tr>
              <td className="border border-slate-300 p-3 font-bold">£150</td>
              <td className="border border-slate-300 p-3 text-center bg-purple-50">
                <div className="font-semibold text-purple-900">Driver: £105</div>
                <div className="text-xs text-purple-700">Company: £45 (30%)</div>
              </td>
              <td className="border border-slate-300 p-3 text-center bg-green-50">
                <div className="font-semibold text-green-900">Driver: £135 ✅</div>
                <div className="text-xs text-green-700">Company: £15 (10%)</div>
              </td>
              <td className="border border-slate-300 p-3 text-center bg-blue-50">
                <div className="font-semibold text-blue-900">Driver: £120</div>
                <div className="text-xs text-blue-700">Company: £30 (20%)</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-yellow-700 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-yellow-900 mb-2">📍 Configuration Location:</h3>
            <p className="text-sm text-yellow-800 mb-0">
              Go to <strong>Admin Panel</strong> → <strong>Pricing & Quotes</strong> → <strong>Margin Configuration</strong>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-300 rounded-xl p-6 mt-8">
        <h3 className="font-bold text-slate-900 text-lg mb-3">📚 Full Documentation Available</h3>
        <p className="text-slate-700 mb-4">
          Complete technical documentation with formulas, use cases, and best practices 
          is available in <code className="bg-white px-2 py-1 rounded text-sm">/MARGIN_CONFIGURATION_EXPLAINED.md</code>
        </p>
        <div className="flex gap-3">
          <Button size="sm" variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            View Full Documentation
          </Button>
          <Button size="sm" variant="outline">
            <Package className="w-4 h-4 mr-2" />
            View UI Implementation
          </Button>
        </div>
      </div>
    </div>
  );
}