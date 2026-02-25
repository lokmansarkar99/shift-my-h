import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_PUBLIC_TOKEN } from '../../utils/mapboxConfig';

interface MapViewProps {
  pickupLat?: number;
  pickupLng?: number;
  deliveryLat?: number;
  deliveryLng?: number;
  onRouteUpdate?: (distance: number, duration: number) => void;
}

export function MapView({ pickupLat, pickupLng, deliveryLat, deliveryLng, onRouteUpdate }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const pickupMarker = useRef<mapboxgl.Marker | null>(null);
  const deliveryMarker = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    mapboxgl.accessToken = MAPBOX_PUBLIC_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-3.435973, 55.378051], // Scotland center
      zoom: 6,
      // Disable all interactions - make it static like an image
      interactive: false,
      scrollZoom: false,
      boxZoom: false,
      dragRotate: false,
      dragPan: false,
      keyboard: false,
      doubleClickZoom: false,
      touchZoomRotate: false,
      touchPitch: false,
    });

    // Remove navigation controls since map is not interactive
    // map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      map.current?.remove();
    };
  }, []);

  // Update markers and route
  useEffect(() => {
    if (!map.current) return;

    // Wait for map style to load before manipulating layers
    const addMarkersAndRoute = () => {
      if (!map.current) return;

      // Clear existing markers
      pickupMarker.current?.remove();
      deliveryMarker.current?.remove();

      // Add pickup marker (A)
      if (pickupLat && pickupLng) {
        const el = document.createElement('div');
        el.className = 'marker-pickup';
        el.innerHTML = `
          <div style="
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #3b82f6, #2563eb);
            border: 3px solid white;
            border-radius: 50% 50% 50% 0;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: white;
            font-size: 16px;
            transform: rotate(-45deg);
          ">
            <span style="transform: rotate(45deg);">A</span>
          </div>
        `;

        pickupMarker.current = new mapboxgl.Marker({ element: el })
          .setLngLat([pickupLng, pickupLat])
          .addTo(map.current);
      }

      // Add delivery marker (B)
      if (deliveryLat && deliveryLng) {
        const el = document.createElement('div');
        el.className = 'marker-delivery';
        el.innerHTML = `
          <div style="
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #ef4444, #dc2626);
            border: 3px solid white;
            border-radius: 50% 50% 50% 0;
            box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: white;
            font-size: 16px;
            transform: rotate(-45deg);
          ">
            <span style="transform: rotate(45deg);">B</span>
          </div>
        `;

        deliveryMarker.current = new mapboxgl.Marker({ element: el })
          .setLngLat([deliveryLng, deliveryLat])
          .addTo(map.current);
      }

      // Fit bounds if both markers exist
      if (pickupLat && pickupLng && deliveryLat && deliveryLng) {
        // Fetch Mapbox Directions route
        const query = `https://api.mapbox.com/directions/v5/mapbox/driving/${pickupLng},${pickupLat};${deliveryLng},${deliveryLat}?geometries=geojson&access_token=${MAPBOX_PUBLIC_TOKEN}`;

        fetch(query)
          .then(response => response.json())
          .then(data => {
            if (!data.routes || data.routes.length === 0) {
              console.error('No route found');
              return;
            }

            const route = data.routes[0];
            const geometry = route.geometry;
            const distance = route.distance / 1609.34; // Convert meters to miles
            const duration = route.duration / 60; // Convert seconds to minutes

            // Draw route on map - ensure style is loaded
            if (map.current && map.current.isStyleLoaded()) {
              // Remove existing route if any
              if (map.current.getSource('route')) {
                map.current.removeLayer('route');
                map.current.removeSource('route');
              }

              // Add route source and layer
              map.current.addSource('route', {
                type: 'geojson',
                data: {
                  type: 'Feature',
                  properties: {},
                  geometry: geometry,
                },
              });

              map.current.addLayer({
                id: 'route',
                type: 'line',
                source: 'route',
                layout: {
                  'line-join': 'round',
                  'line-cap': 'round',
                },
                paint: {
                  'line-color': '#3b82f6',
                  'line-width': 4,
                  'line-opacity': 0.8,
                },
              });

              // Fit bounds to show entire route
              const coordinates = geometry.coordinates;
              const bounds = coordinates.reduce((bounds: any, coord: any) => {
                return bounds.extend(coord);
              }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

              map.current.fitBounds(bounds, {
                padding: 80,
                maxZoom: 12,
                duration: 1000,
              });

              // Call onRouteUpdate callback
              if (onRouteUpdate) {
                onRouteUpdate(distance, duration);
              }
            }
          })
          .catch(error => console.error('Error fetching route:', error));
      }
    };

    // Check if style is already loaded
    if (map.current.isStyleLoaded()) {
      addMarkersAndRoute();
    } else {
      // Wait for style to load
      map.current.on('load', addMarkersAndRoute);
    }

    // Cleanup
    return () => {
      if (map.current) {
        map.current.off('load', addMarkersAndRoute);
      }
    };
  }, [pickupLat, pickupLng, deliveryLat, deliveryLng, onRouteUpdate]);

  return (
    <div 
      ref={mapContainer} 
      className="w-full h-[300px] rounded-xl cursor-default"
      style={{ minHeight: '300px' }}
    />
  );
}