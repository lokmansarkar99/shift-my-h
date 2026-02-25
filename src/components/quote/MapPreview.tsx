import React, { useEffect, useState, useRef } from 'react';
import { MapPin, Clock, Loader2, Navigation } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_PUBLIC_TOKEN } from '../../utils/mapboxConfig';

// Set Mapbox access token
mapboxgl.accessToken = MAPBOX_PUBLIC_TOKEN;

interface MapPreviewProps {
  pickupCoords?: { lat: number; lng: number };
  deliveryCoords?: { lat: number; lng: number };
  pickupAddress?: string;
  deliveryAddress?: string;
  distance?: number; // miles
  duration?: number | string; // minutes (number) or formatted string (e.g. "2-3 hours")
}

export function MapPreview({
  pickupCoords,
  deliveryCoords,
  pickupAddress,
  deliveryAddress,
  distance,
  duration
}: MapPreviewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [routeData, setRouteData] = useState<any>(null);

  // Format duration for display
  const formatDuration = (dur: number | string | undefined): string | null => {
    if (!dur) return null;
    
    if (typeof dur === 'string') return dur;
    
    // If duration is a number (minutes), format it nicely
    const minutes = Math.round(dur);
    if (minutes < 60) {
      return `~${minutes} minutes`;
    } else {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `~${hours}h ${mins}m` : `~${hours} hours`;
    }
  };

  const formattedDuration = formatDuration(duration);

  // DEBUG - Log props when component renders
  useEffect(() => {
    console.log('🗺️ MapPreview Props:', {
      pickupCoords,
      deliveryCoords,
      pickupAddress,
      deliveryAddress,
      distance,
      duration
    });
  }, [pickupCoords, deliveryCoords, pickupAddress, deliveryAddress]);

  useEffect(() => {
    // Only initialize map if we have BOTH coordinates
    if (!pickupCoords || !deliveryCoords || !mapContainerRef.current) {
      console.log('❌ MapPreview: Missing coordinates or container', {
        hasPickup: !!pickupCoords,
        hasDelivery: !!deliveryCoords,
        hasContainer: !!mapContainerRef.current
      });
      return;
    }

    console.log('✅ MapPreview: Initializing map with coordinates', {
      pickup: pickupCoords,
      delivery: deliveryCoords
    });

    setIsLoading(true);

    // Initialize map
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [
        (pickupCoords.lng + deliveryCoords.lng) / 2,
        (pickupCoords.lat + deliveryCoords.lat) / 2
      ],
      zoom: 10,
      interactive: false, // Disable interactions for preview
      attributionControl: false
    });

    mapRef.current = map;

    map.on('load', async () => {
      // Add markers for pickup and delivery
      new mapboxgl.Marker({ color: '#10b981' }) // Green for pickup
        .setLngLat([pickupCoords.lng, pickupCoords.lat])
        .addTo(map);

      new mapboxgl.Marker({ color: '#ef4444' }) // Red for delivery
        .setLngLat([deliveryCoords.lng, deliveryCoords.lat])
        .addTo(map);

      // Fetch route from Mapbox Directions API
      try {
        const response = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/driving/${pickupCoords.lng},${pickupCoords.lat};${deliveryCoords.lng},${deliveryCoords.lat}?geometries=geojson&access_token=${MAPBOX_PUBLIC_TOKEN}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch route');
        }

        const data = await response.json();
        
        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          setRouteData(route);

          // Add route line to map
          map.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: route.geometry
            }
          });

          map.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#3b82f6',
              'line-width': 4,
              'line-opacity': 0.75
            }
          });

          // Fit map to show the entire route
          const coordinates = route.geometry.coordinates;
          const bounds = coordinates.reduce(
            (bounds: mapboxgl.LngLatBounds, coord: [number, number]) => {
              return bounds.extend(coord as [number, number]);
            },
            new mapboxgl.LngLatBounds(coordinates[0], coordinates[0])
          );

          map.fitBounds(bounds, {
            padding: 40,
            duration: 0
          });
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch route from Mapbox:', error);
        setIsLoading(false);
      }
    });

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [pickupCoords?.lat, pickupCoords?.lng, deliveryCoords?.lat, deliveryCoords?.lng]);

  // Placeholder when addresses are not selected
  if (!pickupAddress || !deliveryAddress || !pickupCoords || !deliveryCoords) {
    return (
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-dashed border-slate-300 rounded-xl p-8">
        <div className="text-center">
          <Navigation className="w-12 h-12 mx-auto mb-4 text-slate-400" />
          <p className="text-sm font-medium text-slate-600">
            Select both pickup and delivery addresses to preview the route
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl overflow-hidden">
      {/* Map Container */}
      <div 
        ref={mapContainerRef} 
        className="relative h-[200px] overflow-hidden bg-slate-100"
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        )}
      </div>

      {/* Route Details */}
      <div className="p-4 space-y-3">
        {/* Pickup */}
        <div className="flex items-start gap-2">
          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-xs font-bold">A</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">{pickupAddress}</p>
          </div>
        </div>

        {/* Dashed Line */}
        <div className="ml-3 border-l-2 border-dashed border-blue-300 h-3"></div>

        {/* Delivery */}
        <div className="flex items-start gap-2">
          <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-xs font-bold">B</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">{deliveryAddress}</p>
          </div>
        </div>

        {/* Distance & Duration - CLEAR AND BOLD */}
        {(distance || formattedDuration) && (
          <div className="pt-4 border-t-2 border-blue-300">
            <div className="grid grid-cols-2 gap-3">
              {/* Distance */}
              {distance && (
                <div className="bg-white rounded-lg p-3 border-2 border-blue-200">
                  <div className="flex items-center gap-1.5 mb-1">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-600 uppercase">Distance</span>
                  </div>
                  <p className="text-lg font-bold text-slate-900">{distance.toFixed(1)} mi</p>
                </div>
              )}
              
              {/* Duration */}
              {formattedDuration && (
                <div className="bg-white rounded-lg p-3 border-2 border-blue-200">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-600 uppercase">Drive Time</span>
                  </div>
                  <p className="text-lg font-bold text-slate-900">{formattedDuration}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}