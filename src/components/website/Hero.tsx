import React from 'react';
import { ArrowRight, CheckCircle, Star, Home, Armchair, Trash2, Bike, Store, Package } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { TrustpilotInline } from './TrustpilotWidget';
import { router } from '../../utils/router';
import { saveQuoteData } from '../../utils/quoteStorage';
import clearanceImage from "figma:asset/93c818f8078059d3d97ffbe0a6600bbca0fae6e9.png";
import houseMoveImage from "figma:asset/bf477d3271b9713b8221dde8489b21b22d836b05.png";
import furnitureImage from "figma:asset/165561f775e3390ecbd8766bbbab2823587ba105.png";
import motorbikeImage from "figma:asset/2a1908c202bc74162032236830212b73ec7e604b.png";
import storePickupImage from "figma:asset/15f0e8e72608221827599d41d09483b798d7cc32.png";
import otherDeliveryImage from "figma:asset/864c06d6100a320b1a063a154e27ca0ee169923e.png";

interface HeroProps {
  onGetStarted: () => void;
  onSelectService: (service: string) => void;
  selectedService: string | null;
}

const services = [
  {
    id: 'house-move',
    icon: Home,
    title: 'House Move',
    description: 'Complete, professional, stress-free',
    image: houseMoveImage,
  },
  {
    id: 'furniture',
    icon: Armchair,
    title: 'Furniture & Items',
    description: 'Sofas, beds, wardrobes delivered safely',
    image: furnitureImage,
  },
  {
    id: 'clearance',
    icon: Trash2,
    title: 'Clearance & Removal',
    description: 'House, garden, builders and item disposal',
    image: clearanceImage,
  },
  {
    id: 'motorbike',
    icon: Bike,
    title: 'Motorbike & Bicycle Transport',
    description: 'Secure transport for your vehicles',
    image: motorbikeImage,
  },
  {
    id: 'store-pickup',
    icon: Store,
    title: 'Store / Pickup Service',
    description: 'IKEA, B&Q, and retail pickups',
    image: storePickupImage,
  },
  {
    id: 'other',
    icon: Package,
    title: 'Other Delivery',
    description: 'Custom solutions for any item',
    image: otherDeliveryImage,
  },
];

export function Hero({ onGetStarted, onSelectService, selectedService }: HeroProps) {
  return (
    <section className="relative min-h-[calc(100vh-72px)] flex flex-col overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1757233451731-9a34e164b208?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwc2t5bGluZSUyMGJ1aWxkaW5nc3xlbnwxfHx8fDE3NjU3ODkzNzR8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="City skyline"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-blue-900/90 to-indigo-900/95" />
      </div>

      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-cyan-500/30 to-blue-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-float"></div>
        <div className="absolute top-2/3 left-1/2 w-3 h-3 bg-cyan-400 rounded-full animate-float" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-purple-400 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/3 right-1/4 w-4 h-4 bg-blue-300 rounded-full animate-float" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-3 lg:py-4 relative z-10 w-full">
        {/* Main Hero Content */}
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-5xl lg:text-5xl xl:text-6xl mb-2 leading-tight">
            <span className="block bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent font-extrabold">
              Move anything,
            </span>
            <span className="block bg-gradient-to-r from-cyan-100 via-blue-100 to-white bg-clip-text text-transparent font-extrabold">
              anywhere in the UK
            </span>
          </h1>
          
          <p className="text-base md:text-lg lg:text-xl mb-3 text-blue-100 leading-relaxed max-w-3xl mx-auto">
            Professional removals made simple. Get instant quotes, book trusted drivers, and relax while we handle your move.
          </p>

          {/* Service Cards - 6 cards in 3x2 grid on desktop */}
          <div className="mb-3">
            <h2 className="text-xl lg:text-xl font-bold text-white text-center mb-3">
              What can we move for you?
            </h2>
            
            {/* FIXED 3x2 Grid Layout - NO CAROUSEL, NO DRAG */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 max-w-6xl mx-auto">
              {services.map((service) => {
                const Icon = service.icon;
                const isSelected = selectedService === service.id;
                
                return (
                  <div
                    key={service.id}
                    onClick={() => onSelectService(service.id)}
                    className={`group relative bg-white rounded-2xl overflow-hidden transition-all duration-500 ease-out cursor-pointer ${
                      isSelected 
                        ? 'ring-4 ring-blue-400 shadow-2xl shadow-blue-500/40 scale-[1.03]' 
                        : 'shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-[1.03]'
                    }`}
                    style={{
                      height: 'clamp(250px, 26vh, 290px)',
                      transform: isSelected ? 'translateY(-4px)' : undefined,
                    }}
                  >
                    {/* Image Background with Overlay */}
                    <div className="relative h-full overflow-hidden flex flex-col">
                      <div className="absolute inset-0">
                        <ImageWithFallback
                          src={service.image}
                          alt={service.title}
                          className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-110"
                        />
                        {/* Sophisticated gradient overlay for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/60 to-slate-900/20 group-hover:from-blue-900/95 group-hover:via-blue-900/60 transition-all duration-500"></div>
                      </div>
                      
                      {/* Icon with soft shadow */}
                      <div className="absolute top-3 left-3 lg:top-4 lg:left-4 w-14 h-14 lg:w-16 lg:h-16 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-slate-900/30 group-hover:shadow-xl group-hover:shadow-blue-500/40 transition-all duration-500 group-hover:scale-110 z-10 border-[3px] border-blue-600/20 group-hover:border-blue-500/40">
                        <Icon className="w-7 h-7 lg:w-8 lg:h-8 text-blue-600 group-hover:text-blue-500 transition-colors duration-300 stroke-[2.5]" />
                      </div>

                      {/* Title & Description */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 lg:p-4 transform transition-all duration-500 group-hover:translate-y-[-2px] z-10">
                        <h3 className="text-xl lg:text-2xl font-bold text-white mb-1.5 group-hover:text-blue-100 transition-colors duration-300 line-clamp-1">{service.title}</h3>
                        <p className="text-sm lg:text-base text-white/90 group-hover:text-white transition-all duration-300 line-clamp-2">{service.description}</p>
                        
                        {/* CTA Button - Compact */}
                        <button
                          className={`w-full mt-2.5 py-2.5 rounded-lg font-bold text-sm lg:text-base transition-all duration-500 shadow-md group-hover:shadow-xl ${
                            isSelected
                              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-blue-500/50'
                              : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 group-hover:shadow-blue-500/50'
                          } transform group-hover:scale-[1.02] active:scale-[0.98]`}
                        >
                          Get a Quote
                        </button>
                      </div>
                    </div>

                    {/* Premium hover glow effect */}
                    <div className="absolute -inset-[2px] bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 opacity-0 group-hover:opacity-30 blur-2xl transition-all duration-700 -z-10 rounded-2xl"></div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Features - Compact */}
          <div className="flex flex-wrap justify-center gap-2 lg:gap-2 mb-2 max-w-4xl mx-auto">
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-1.5">
              <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
              <span className="text-xs text-blue-100">Instant quotes</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-1.5">
              <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
              <span className="text-xs text-blue-100">Licensed drivers</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-1.5">
              <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
              <span className="text-xs text-blue-100">Real-time tracking</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-1.5">
              <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
              <span className="text-xs text-blue-100">24/7 support</span>
            </div>
          </div>

          {/* Trustpilot Trust Badge - Compact */}
          <div className="flex justify-center">
            <TrustpilotInline />
          </div>
        </div>
      </div>
    </section>
  );
}