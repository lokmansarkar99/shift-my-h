/**
 * House Move - Reusable Map Panel
 * Same across all steps (1-5) for UI consistency
 */

import React from 'react';
import { MapView } from '../../MapView';
import { HouseMoveQuote } from './houseMoveTypes';

interface MapPanelProps {
  data: HouseMoveQuote;
  onRouteUpdate?: (distance: number, duration: number) => void;
}

export function HouseMoveMapPanel({ data, onRouteUpdate }: MapPanelProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
      <MapView
        pickupLat={data.pickup?.lat}
        pickupLng={data.pickup?.lng}
        deliveryLat={data.dropoff?.lat}
        deliveryLng={data.dropoff?.lng}
        onRouteUpdate={onRouteUpdate}
      />
    </div>
  );
}