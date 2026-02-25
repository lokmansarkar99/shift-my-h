import React, { useState } from 'react';
import { Calendar, HelpCircle, Home, Package, Trash2, Bike, ShoppingBag, Sparkles } from 'lucide-react';
import { getServiceTypes } from '../../utils/serviceTypesService';

interface QuoteFlowStep1Props {
  onContinue: (data: {
    serviceTypeId: string;
    moveDate?: Date;
    customerHelps: boolean;
  }) => void;
  initialData?: {
    serviceTypeId?: string;
    moveDate?: Date;
    customerHelps?: boolean;
  };
}

export function QuoteFlowStep1ServiceType({ onContinue, initialData }: QuoteFlowStep1Props) {
  const [selectedService, setSelectedService] = useState<string>(initialData?.serviceTypeId || '');
  const [moveDate, setMoveDate] = useState<string>(
    initialData?.moveDate ? initialData.moveDate.toISOString().split('T')[0] : ''
  );
  const [customerHelps, setCustomerHelps] = useState<boolean>(initialData?.customerHelps || false);

  const serviceTypes = getServiceTypes();

  const serviceIcons: Record<string, any> = {
    'house-move': Home,
    'furniture': Package,
    'clearance': Trash2,
    'motorbike': Bike,
    'store-pickup': ShoppingBag,
    'other': Sparkles,
  };

  const handleContinue = () => {
    if (!selectedService) {
      alert('Please select a service type');
      return;
    }

    onContinue({
      serviceTypeId: selectedService,
      moveDate: moveDate ? new Date(moveDate) : undefined,
      customerHelps,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-3">What do you need help with?</h2>
        <p className="text-slate-600 text-lg">Select the service that best matches your needs</p>
      </div>

      {/* Service Type Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {serviceTypes
          .filter(st => st.is_active)
          .map(service => {
            const Icon = serviceIcons[service.id] || Sparkles;
            const isSelected = selectedService === service.id;

            return (
              <button
                key={service.id}
                onClick={() => setSelectedService(service.id)}
                className={`
                  relative p-6 rounded-2xl border-2 transition-all duration-200 text-left
                  ${isSelected
                    ? 'border-indigo-600 bg-indigo-50 shadow-lg shadow-indigo-100'
                    : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md'
                  }
                `}
              >
                {/* Selected Badge */}
                {isSelected && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg">
                    ✓
                  </div>
                )}

                {/* Icon */}
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center mb-4
                  ${isSelected ? 'bg-indigo-600' : 'bg-slate-100'}
                `}>
                  <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-slate-600'}`} />
                </div>

                {/* Content */}
                <h3 className={`font-bold text-lg mb-2 ${isSelected ? 'text-indigo-900' : 'text-slate-900'}`}>
                  {service.name}
                </h3>
                <p className={`text-sm mb-4 ${isSelected ? 'text-indigo-700' : 'text-slate-600'}`}>
                  {service.description}
                </p>

                {/* Price Badge */}
                <div className={`
                  inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold
                  ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'}
                `}>
                  From £{service.min_price}
                </div>
              </button>
            );
          })}
      </div>

      {/* Additional Options */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 space-y-6">
        <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-600" />
          Additional Details
        </h3>

        {/* Move Date */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Preferred Move Date (Optional)
          </label>
          <input
            type="date"
            value={moveDate}
            onChange={(e) => setMoveDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <p className="text-sm text-slate-500 mt-2">
            💡 Weekend and peak season dates may have additional charges
          </p>
        </div>

        {/* Customer Helps */}
        {selectedService && serviceTypes.find(s => s.id === selectedService)?.allow_customer_help && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={customerHelps}
                onChange={(e) => setCustomerHelps(e.target.checked)}
                className="mt-1 w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <div>
                <div className="font-semibold text-blue-900 flex items-center gap-2">
                  I'll help with the move
                  <HelpCircle className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  ✅ Reduce costs by helping with loading/unloading<br />
                  💪 Physical assistance required - not suitable for large/heavy items
                </p>
              </div>
            </label>
          </div>
        )}
      </div>

      {/* Continue Button */}
      <div className="flex justify-center">
        <button
          onClick={handleContinue}
          disabled={!selectedService}
          className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-lg rounded-xl shadow-lg hover:from-indigo-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Addresses →
        </button>
      </div>
    </div>
  );
}
