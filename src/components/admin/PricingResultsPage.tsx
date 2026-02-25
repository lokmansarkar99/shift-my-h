import React, { useState, useEffect } from 'react';
import { Calculator, Eye, Trash2 } from 'lucide-react';
import { getAllPricingResults, deletePricingResult } from '../../utils/pricingResultsService';
import { PricingResultDetailView } from './PricingResultDetailView';

export function PricingResultsPage() {
  const [results, setResults] = useState<any[]>([]);
  const [selectedResult, setSelectedResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    setIsLoading(true);
    const data = await getAllPricingResults();
    setResults(data);
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this pricing result?')) return;
    
    const success = await deletePricingResult(id);
    if (success) {
      loadResults();
      if (selectedResult?.id === id) {
        setSelectedResult(null);
      }
    }
  };

  const handleSave = (data: any) => {
    console.log('Save quote:', data);
    // TODO: Implement save logic
  };

  const handleSend = (data: any) => {
    console.log('Send to customer:', data);
    // TODO: Implement send logic
  };

  const handleConvertToJob = (data: any) => {
    console.log('Convert to job:', data);
    // TODO: Implement convert logic
  };

  const handleArchive = (data: any) => {
    console.log('Archive quote:', data);
    // TODO: Implement archive logic
  };

  if (selectedResult) {
    return (
      <PricingResultDetailView
        result={selectedResult}
        onBack={() => setSelectedResult(null)}
        onSave={handleSave}
        onSend={handleSend}
        onConvertToJob={handleConvertToJob}
        onArchive={handleArchive}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Pricing Results</h2>
          <p className="text-slate-600 mt-1">Complete audit trail of all quote calculations</p>
        </div>
        <button
          onClick={loadResults}
          className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
        >
          🔄 Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-slate-600 mt-4">Loading pricing results...</p>
        </div>
      ) : results.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-slate-200">
          <Calculator className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600">No pricing results yet</p>
          <p className="text-sm text-slate-400 mt-2">
            Pricing results are automatically saved when quotes are calculated.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {results.map((result) => {
            const totalPrice = result.finalPriceStandard || 0;
            const subtotal = (result.baseFee || 0) + (result.crewCost || 0) + (result.distanceCost || 0) + 
                            (result.volumeCost || 0) + (result.accessCharges || 0) + (result.dateAdjustments || 0);
            const minimumApplied = result.minChargeApplied || totalPrice > subtotal;

            return (
              <div
                key={result.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Customer & Service Info */}
                      <div className="mb-4">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-lg text-slate-900">
                            {result.customerName || 'Unknown Customer'}
                          </h3>
                          {minimumApplied && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                              MIN PRICE
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                          <span>{result.serviceType || 'N/A'}</span>
                          <span>•</span>
                          <span>{new Date(result.timestamp).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{new Date(result.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-4 gap-3">
                        <div className="bg-slate-50 rounded-lg p-3">
                          <p className="text-xs text-slate-500 mb-1">Volume</p>
                          <p className="font-semibold text-slate-900">{(result.finalM3Used || 0).toFixed(1)} m³</p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-3">
                          <p className="text-xs text-slate-500 mb-1">Distance</p>
                          <p className="font-semibold text-slate-900">{(result.distanceMiles || 0).toFixed(0)} mi</p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-3">
                          <p className="text-xs text-slate-500 mb-1">Items</p>
                          <p className="font-semibold text-slate-900">{result.items?.length || 0}</p>
                        </div>
                        <div className="bg-slate-900 rounded-lg p-3">
                          <p className="text-xs text-slate-400 mb-1">Total Price</p>
                          <p className="font-bold text-white text-lg">
                            £{totalPrice.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 ml-6">
                      <button
                        onClick={() => setSelectedResult(result)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      <button
                        onClick={() => handleDelete(result.id)}
                        className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-red-50 hover:text-red-700 flex items-center gap-2 text-sm font-medium"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}