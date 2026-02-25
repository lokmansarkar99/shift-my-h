import React, { useState, useEffect } from 'react';
import { Users, Truck, AlertCircle, CheckCircle, Info, HelpCircle } from 'lucide-react';
import { getServiceTypeConfig } from '../../utils/pricingEngine';
import { getVehicleTypes } from '../../utils/pricingEngine';

interface QuoteFlowStep4Props {
  serviceTypeId: string;
  customerHelps: boolean;
  estimatedVolume: number; // m³
  onContinue: (data: {
    crewSize: number;
    vehicleId?: string;
  }) => void;
  onBack: () => void;
  initialData?: {
    crewSize?: number;
    vehicleId?: string;
  };
}

export function QuoteFlowStep4CrewVehicle({
  serviceTypeId,
  customerHelps,
  estimatedVolume,
  onContinue,
  onBack,
  initialData,
}: QuoteFlowStep4Props) {
  const serviceConfig = getServiceTypeConfig(serviceTypeId);
  const vehicles = getVehicleTypes();

  // Crew size logic
  const minCrew = customerHelps && serviceConfig.allow_customer_help 
    ? Math.max(1, serviceConfig.min_crew - 1) 
    : serviceConfig.min_crew;
  const maxCrew = serviceConfig.max_crew;
  const defaultCrew = serviceConfig.default_crew;

  const [crewSize, setCrewSize] = useState<number>(
    initialData?.crewSize || defaultCrew
  );
  const [selectedVehicle, setSelectedVehicle] = useState<string>(
    initialData?.vehicleId || ''
  );

  // Auto-select vehicle based on volume
  useEffect(() => {
    if (!selectedVehicle && estimatedVolume > 0) {
      const recommendedVehicle = vehicles.find(
        v => estimatedVolume >= v.minVolume && estimatedVolume <= v.maxVolume
      ) || vehicles[vehicles.length - 1];
      
      setSelectedVehicle(recommendedVehicle.id);
    }
  }, [estimatedVolume, selectedVehicle, vehicles]);

  // Validate crew size
  useEffect(() => {
    if (crewSize < minCrew) {
      setCrewSize(minCrew);
    } else if (crewSize > maxCrew) {
      setCrewSize(maxCrew);
    }
  }, [minCrew, maxCrew, crewSize]);

  const handleContinue = () => {
    if (crewSize < minCrew || crewSize > maxCrew) {
      alert(`Crew size must be between ${minCrew} and ${maxCrew} for this service`);
      return;
    }

    onContinue({
      crewSize,
      vehicleId: selectedVehicle,
    });
  };

  // Crew option descriptions
  const crewDescriptions: Record<number, { title: string; description: string; badge?: string }> = {
    1: {
      title: '1 Person + You Help',
      description: 'Budget option - You actively help with loading/unloading',
      badge: customerHelps ? '💪 Customer Helps' : '⚠️ Not Available',
    },
    2: {
      title: '2 Person Crew',
      description: 'Standard service - Efficient for most moves',
      badge: crewSize === 2 ? '⭐ Recommended' : undefined,
    },
    3: {
      title: '3 Person Crew',
      description: 'Faster service - Better for larger jobs or tight schedules',
      badge: undefined,
    },
    4: {
      title: '4 Person Crew',
      description: 'Premium service - Fastest completion for large moves',
      badge: undefined,
    },
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-3">Crew & Vehicle Selection</h2>
        <p className="text-slate-600 text-lg">
          Choose the right team size for your {serviceConfig.name.toLowerCase()}
        </p>
      </div>

      {/* Customer Helps Banner */}
      {customerHelps && serviceConfig.allow_customer_help && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-green-900">Customer Help Mode Active</p>
            <p className="text-sm text-green-700 mt-1">
              ✅ You've chosen to help with the move - this allows smaller crew sizes and reduces cost<br />
              💡 Minimum crew reduced from {serviceConfig.min_crew} to {minCrew} person(s)
            </p>
          </div>
        </div>
      )}

      {/* Crew Size Selector */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-xl flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600" />
            Select Crew Size
          </h3>
          <div className="text-sm text-slate-600">
            Allowed: <span className="font-bold text-indigo-600">{minCrew}–{maxCrew} people</span>
          </div>
        </div>

        {/* Crew Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(size => {
            const isAvailable = size >= minCrew && size <= maxCrew;
            const isSelected = crewSize === size;
            const info = crewDescriptions[size];

            return (
              <button
                key={size}
                onClick={() => isAvailable && setCrewSize(size)}
                disabled={!isAvailable}
                className={`
                  relative p-5 rounded-xl border-2 transition-all duration-200 text-left
                  ${isSelected && isAvailable
                    ? 'border-indigo-600 bg-indigo-50 shadow-lg'
                    : isAvailable
                      ? 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md'
                      : 'border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed'
                  }
                `}
              >
                {/* Selected Badge */}
                {isSelected && isAvailable && (
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm shadow-lg">
                    ✓
                  </div>
                )}

                {/* Crew Icon */}
                <div className="flex items-center gap-3 mb-3">
                  <div className={`
                    flex items-center justify-center gap-1
                    ${isSelected ? 'text-indigo-600' : 'text-slate-600'}
                  `}>
                    {Array.from({ length: size }).map((_, i) => (
                      <Users key={i} className="w-5 h-5" />
                    ))}
                  </div>
                  <div className={`font-bold text-lg ${isSelected ? 'text-indigo-900' : 'text-slate-900'}`}>
                    {size} {size === 1 ? 'Person' : 'People'}
                  </div>
                </div>

                {/* Description */}
                <p className={`text-sm mb-2 ${isSelected ? 'text-indigo-700' : 'text-slate-600'}`}>
                  {info.description}
                </p>

                {/* Badge */}
                {info.badge && isAvailable && (
                  <div className={`
                    inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold
                    ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'}
                  `}>
                    {info.badge}
                  </div>
                )}

                {/* Not Available Indicator */}
                {!isAvailable && (
                  <div className="text-xs text-slate-500 mt-2">
                    {size < minCrew ? '❌ Below minimum' : '❌ Above maximum'}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Crew Logic Explanation */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-semibold mb-1">How crew size affects your quote:</p>
            <ul className="space-y-1 ml-4 list-disc text-blue-800">
              <li><strong>Handling time:</strong> More crew = faster loading/unloading</li>
              <li><strong>Price:</strong> Each extra person adds £50 to base price</li>
              <li><strong>Efficiency:</strong> Larger crews complete jobs {customerHelps ? '10-15%' : '15-20%'} faster</li>
              {customerHelps && (
                <li><strong>Customer help:</strong> You're helping, so we can work with a smaller team</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Vehicle Selector (Informational) */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-xl flex items-center gap-2">
            <Truck className="w-6 h-6 text-indigo-600" />
            Recommended Vehicle
          </h3>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <HelpCircle className="w-4 h-4" />
            Based on {estimatedVolume.toFixed(2)} m³ volume
          </div>
        </div>

        {/* Vehicle Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {vehicles.map(vehicle => {
            const isRecommended = estimatedVolume >= vehicle.minVolume && estimatedVolume <= vehicle.maxVolume;
            const isSelected = selectedVehicle === vehicle.id;

            return (
              <button
                key={vehicle.id}
                onClick={() => setSelectedVehicle(vehicle.id)}
                className={`
                  relative p-4 rounded-xl border-2 transition-all duration-200 text-left
                  ${isSelected
                    ? 'border-indigo-600 bg-indigo-50 shadow-md'
                    : 'border-slate-200 bg-white hover:border-indigo-300'
                  }
                `}
              >
                {/* Recommended Badge */}
                {isRecommended && (
                  <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-green-600 text-white text-xs font-bold rounded-full shadow-lg">
                    ⭐ Best Fit
                  </div>
                )}

                {/* Vehicle Icon */}
                <div className="text-3xl mb-2">{vehicle.icon}</div>

                {/* Name */}
                <div className={`font-bold ${isSelected ? 'text-indigo-900' : 'text-slate-900'}`}>
                  {vehicle.name}
                </div>

                {/* Capacity */}
                <div className="text-xs text-slate-600 mt-1">
                  Capacity: {vehicle.minVolume}–{vehicle.maxVolume} m³
                </div>

                {/* Crew */}
                <div className="text-xs text-slate-600 mt-1 flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {vehicle.crew} crew
                </div>
              </button>
            );
          })}
        </div>

        {/* Vehicle Note */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-orange-900">
            <strong>Note:</strong> Vehicle selection is for capacity planning only. 
            Pricing is calculated from service type rates, not vehicle type.
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all"
        >
          ← Back
        </button>
        <button
          onClick={handleContinue}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:from-indigo-700 hover:to-blue-700 transition-all"
        >
          Continue to Extras →
        </button>
      </div>
    </div>
  );
}
