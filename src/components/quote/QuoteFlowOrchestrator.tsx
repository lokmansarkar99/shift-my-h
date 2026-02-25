/**
 * Quote Flow Orchestrator
 * Routes each service type to its own isolated flow
 * 
 * CRITICAL: Each service must have its own flow component
 * NO shared logic between services
 */

import React from 'react';
// import { HouseMoveFlow } from './flows/house-move/HouseMoveFlow';
import { ClearanceFlow } from './flows/clearance-removal/ClearanceFlow';
import { FurnitureFlow } from './flows/furniture-items/FurnitureFlow';
import { MotorbikeFlow } from './flows/motorbike-bicycle/MotorbikeFlow';
import { StorePickupFlow } from './flows/store-pickup/StorePickupFlow';
import { OtherDeliveryFlow } from './flows/other-delivery/OtherDeliveryFlow';

interface QuoteFlowOrchestratorProps {
  serviceType: string;
  onClose?: () => void; // Optional - for backwards compatibility
}

export function QuoteFlowOrchestrator({ serviceType, onClose }: QuoteFlowOrchestratorProps) {
  console.log('🎯 QuoteFlowOrchestrator - Routing to service:', serviceType);

  switch (serviceType) {
    case 'house-move':
      return <HouseMoveFlow />;
      
    case 'clearance':
      return <ClearanceFlow />;
      
    case 'furniture':
      return <FurnitureFlow />;
      
    case 'motorbike':
    case 'bicycle':
      return <MotorbikeFlow />;
      
    case 'store-pickup':
      return <StorePickupFlow />;
      
    case 'other':
      return <OtherDeliveryFlow />;
      
    default:
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-red-200">
            <h2 className="text-xl font-bold text-red-600 mb-2">Invalid Service Type</h2>
            <p className="text-slate-600">
              Service type "{serviceType}" is not recognized.
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Valid types: house-move, clearance, furniture, motorbike, store-pickup, other
            </p>
          </div>
        </div>
      );
  }
}