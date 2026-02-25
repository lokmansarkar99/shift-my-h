import React, { useState } from 'react';
import { Home, Armchair, CheckCircle2, Trash2, MapPin, Package as PackageIcon, Calendar, CreditCard, FileText, ChevronLeft, Users, Bike, Store, Truck } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { router } from '../../utils/router';
import { generateJourneyId, clearQuoteData, saveQuoteData } from '../../utils/quoteStorage';
import type { ServiceCategory } from '../../utils/quoteStorage';

interface ServiceCardsProps {
  selectedService: string | null;
  onSelectService: (service: string) => void;
}

interface ServiceConfig {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  gradient: string;
  hoverGradient: string;
  image: string;
  showPhoneNote?: boolean;
}

const services: ServiceConfig[] = [
  {
    id: 'house-move',
    icon: Home,
    title: 'House Move',
    description: 'Complete home relocations with professional care',
    gradient: 'from-blue-500 to-indigo-600',
    hoverGradient: 'from-blue-600 to-indigo-700',
    image: 'https://images.unsplash.com/photo-1594873604892-b599f847e859?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjU4MTMyNjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 'furniture',
    icon: Armchair,
    title: 'Furniture & items',
    description: 'Sofas, beds, wardrobes delivered safely',
    showPhoneNote: true,
    gradient: 'from-purple-500 to-pink-600',
    hoverGradient: 'from-purple-600 to-pink-700',
    image: 'https://images.unsplash.com/photo-1763565909003-46e9dfb68a00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2ZhJTIwZnVybml0dXJlJTIwbW9kZXJufGVufDF8fHx8MTc2NTgxODk1OHww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 'clearance',
    icon: Trash2,
    title: 'Clearance & Removal',
    description: 'House, garden, builders and junk clearance with professional loading and disposal',
    gradient: 'from-orange-500 to-red-600',
    hoverGradient: 'from-orange-600 to-red-700',
    image: 'https://images.unsplash.com/photo-1738236662730-b4ea66d35d0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXN0ZSUyMHJlbW92YWwlMjB2YW4lMjBsb2FkaW5nJTIwZnVybml0dXJlJTIwZGlzcG9zYWx8ZW58MXx8fHwxNjY3Mjg1NTg5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 'motorbike',
    icon: Bike,
    title: 'Motorbike & Bicycle',
    description: 'Safe transport for motorcycles, scooters, and bicycles',
    gradient: 'from-cyan-500 to-blue-600',
    hoverGradient: 'from-cyan-600 to-blue-700',
    image: 'https://images.unsplash.com/photo-1558981852-426c6c22a060?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwdHJhbnNwb3J0fGVufDF8fHx8MTY2NzI4NTU4OXww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 'store-pickup',
    icon: Store,
    title: 'Store/Pickup',
    description: 'Collect and deliver items from retail stores and warehouses',
    gradient: 'from-emerald-500 to-teal-600',
    hoverGradient: 'from-emerald-600 to-teal-700',
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRhaWwlMjBzdG9yZSUyMHBpY2t1cHxlbnwxfHx8fDE2NjcyODU1ODl8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 'other',
    icon: Truck,
    title: 'Other Delivery',
    description: 'Custom delivery solutions for any other transport needs',
    gradient: 'from-amber-500 to-orange-600',
    hoverGradient: 'from-amber-600 to-orange-700',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpdmVyeSUyMHRydWNrJTIwdmFufGVufDF8fHx8MTY2NzI4NTU4OXww&ixlib=rb-4.1.0&q=80&w=1080',
  },
];

// Service ID to Category mapping
const SERVICE_CATEGORY_MAP: Record<string, ServiceCategory> = {
  'house-move': 'house_move',
  'furniture': 'furniture_items',
  'clearance': 'clearance_removal',
  'motorbike': 'vehicle_delivery',
  'store-pickup': 'furniture_items',
  'other': 'furniture_items',
};

// Step cards configuration
const stepCards = [
  {
    step: 1,
    icon: MapPin,
    title: 'Addresses',
    description: 'Pickup and delivery locations',
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    step: 2,
    icon: PackageIcon,
    title: 'Items',
    description: 'What needs to be moved',
    gradient: 'from-purple-500 to-pink-600',
  },
  {
    step: 3,
    icon: Calendar,
    title: 'Date & Time',
    description: 'When to schedule your move',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    step: 4,
    icon: Users,
    title: 'Services',
    description: 'Additional moving services',
    gradient: 'from-orange-500 to-red-600',
  },
  {
    step: 5,
    icon: FileText,
    title: 'Review',
    description: 'Check your quote details',
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    step: 6,
    icon: CreditCard,
    title: 'Book',
    description: 'Confirm and pay',
    gradient: 'from-pink-500 to-rose-600',
  },
];

export function ServiceCards({ selectedService, onSelectService }: ServiceCardsProps) {
  const [showSteps, setShowSteps] = useState(false);

  const handleServiceClick = (serviceId: string) => {
    console.log('Service clicked:', serviceId);
    onSelectService(serviceId);
    setShowSteps(true);
  };

  const handleStepClick = (step: number) => {
    if (!selectedService) return;

    console.log('=== STEP CLICK DEBUG ===');
    console.log('1. Selected service:', selectedService);
    
    // Map service ID to category
    const category = SERVICE_CATEGORY_MAP[selectedService] || 'house_move';
    console.log('2. Mapped category:', category);
    
    // Clear old data and start fresh
    clearQuoteData();
    
    // Generate journey ID
    const journeyId = generateJourneyId();
    
    // CRITICAL: Save using NEW SYSTEM (service-specific storage)
    // selectedService is already the correct ServiceType (e.g., 'house-move', 'clearance', 'furniture')
    const serviceType = selectedService as any; // This is correct - service IDs match ServiceType exactly
    
    console.log('3. Saving with serviceType:', serviceType);
    console.log('4. Journey ID:', journeyId);
    
    // This will save to localStorage with the correct key AND set 'active-service-type'
    saveQuoteData(serviceType, {
      journeyId,
      serviceCategory: category,
      serviceType: selectedService,
    });
    
    console.log('5. Data saved, now navigating to step:', step);
    
    // Verify it was saved
    const activeService = localStorage.getItem('active-service-type');
    console.log('6. Active service type in localStorage:', activeService);
    console.log('=== END DEBUG ===');
    
    // Navigate to the selected step
    router.navigate({ page: 'quote-step', step });
  };

  const handleBackToServices = () => {
    setShowSteps(false);
    onSelectService('');
  };

  const selectedServiceData = services.find(s => s.id === selectedService);

  // Show step cards if a service is selected
  if (showSteps && selectedService && selectedServiceData) {
    return (
      <section className="py-8 sm:py-12 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-br from-cyan-200/30 to-blue-200/30 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Back button */}
          <button
            onClick={handleBackToServices}
            className="mb-8 flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold">Back to Services</span>
          </button>

          {/* Selected service header */}
          <div className="text-center mb-12">
            <div className={`inline-flex items-center gap-3 bg-gradient-to-r ${selectedServiceData.gradient} text-white px-6 py-3 rounded-full mb-4`}>
              {React.createElement(selectedServiceData.icon, { className: 'w-6 h-6' })}
              <span className="font-bold text-lg">{selectedServiceData.title}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-3">
              Complete your quote in 6 easy steps
            </h2>
            <p className="text-lg text-slate-600">
              Click on any step below to get started
            </p>
          </div>

          {/* Step Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {stepCards.map((stepCard) => {
              const Icon = stepCard.icon;
              
              return (
                <div
                  key={stepCard.step}
                  onClick={() => handleStepClick(stepCard.step)}
                  className="group relative bg-white/90 backdrop-blur-sm border-2 border-white/50 hover:border-blue-300 rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl hover:scale-[1.02] sm:hover:scale-105"
                >
                  {/* Header with gradient */}
                  <div className={`relative h-24 sm:h-28 bg-gradient-to-br ${stepCard.gradient} flex items-center justify-center`}>
                    <div className="text-center text-white">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-md border border-white/40 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-lg">
                        <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                      </div>
                      <div className="text-xs font-bold opacity-90">Step {stepCard.step}</div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-5 lg:p-6">
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 mb-1.5 sm:mb-2">
                      {stepCard.title}
                    </h3>
                    <p className="text-xs sm:text-sm lg:text-base text-slate-600 mb-3 sm:mb-4">
                      {stepCard.description}
                    </p>
                    
                    <button
                      className={`w-full py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all shadow-lg hover:shadow-xl active:scale-95 sm:hover:scale-105 bg-gradient-to-r ${stepCard.gradient} text-white`}
                    >
                      Start Step {stepCard.step}
                    </button>
                  </div>

                  {/* Hover glow effect */}
                  <div className={`absolute -inset-1 bg-gradient-to-r ${stepCard.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity -z-10`}></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // Show service cards (initial view)
  return (
    <section id="services" className="py-8 sm:py-12 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-br from-cyan-200/30 to-blue-200/30 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            const isSelected = selectedService === service.id;
            
            return (
              <div
                key={service.id}
                onClick={() => handleServiceClick(service.id)}
                className={`group relative bg-white/90 backdrop-blur-sm border-2 rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer ${
                  isSelected 
                    ? 'border-blue-500 shadow-2xl shadow-blue-500/20 scale-[1.02] sm:scale-105' 
                    : 'border-white/50 hover:border-blue-300 shadow-lg hover:shadow-2xl hover:scale-[1.02] sm:hover:scale-105'
                }`}
              >
                {/* Image Background */}
                <div className="relative h-36 sm:h-40 lg:h-48 overflow-hidden">
                  <ImageWithFallback
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-60 group-hover:opacity-70 transition-opacity`}></div>
                  
                  {/* Icon */}
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-white/20 backdrop-blur-md border border-white/40 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
                  </div>

                  {/* Selected Badge */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-2.5 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span className="hidden xs:inline">Selected</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 lg:p-6">
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 mb-1.5 sm:mb-2">{service.title}</h3>
                  <p className="text-xs sm:text-sm lg:text-base text-slate-600 mb-3 sm:mb-4 line-clamp-2">{service.description}</p>
                  
                  {/* CTA Button */}
                  <button
                    className={`w-full py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all shadow-lg hover:shadow-xl active:scale-95 sm:hover:scale-105 bg-gradient-to-r ${service.gradient} text-white`}
                  >
                    Get a Quote
                  </button>

                  {service.showPhoneNote && (
                    <p className="mt-2.5 sm:mt-3 text-xs text-slate-500 text-center italic">
                      📞 Sofa dimensions required - we'll call to confirm
                    </p>
                  )}
                </div>

                {/* Hover glow effect */}
                <div className={`absolute -inset-1 bg-gradient-to-r ${service.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity -z-10`}></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}