import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

interface RouteMapProps {
  pickupCoords: [number, number]; // [lng, lat]
  deliveryCoords: [number, number]; // [lng, lat]
  routeGeometry?: any; // GeoJSON LineString geometry
}

export function RouteMap({ pickupCoords, deliveryCoords, routeGeometry }: RouteMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    mapboxgl.accessToken = MAPBOX_TOKEN;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: pickupCoords,
      zoom: 8,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add pickup marker (red)
    new mapboxgl.Marker({ color: '#ef4444' })
      .setLngLat(pickupCoords)
      .setPopup(new mapboxgl.Popup().setHTML('<strong>Pickup Location</strong>'))
      .addTo(map.current);

    // Add delivery marker (blue)
    new mapboxgl.Marker({ color: '#3b82f6' })
      .setLngLat(deliveryCoords)
      .setPopup(new mapboxgl.Popup().setHTML('<strong>Delivery Location</strong>'))
      .addTo(map.current);

    // If route geometry exists, draw the route
    if (routeGeometry) {
      map.current.on('load', () => {
        if (!map.current) return;

        map.current.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: routeGeometry,
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
            'line-opacity': 0.75,
          },
        });
      });
    }

    // Auto-fit bounds to show both markers
    const bounds = new mapboxgl.LngLatBounds();
    bounds.extend(pickupCoords);
    bounds.extend(deliveryCoords);
    map.current.fitBounds(bounds, {
      padding: 60,
      maxZoom: 12,
    });

    // Cleanup on unmount
    return () => {
      map.current?.remove();
    };
  }, [pickupCoords, deliveryCoords, routeGeometry]);

  return (
    <div 
      ref={mapContainer} 
      className="w-full h-64 rounded-lg border-2 border-slate-200 shadow-sm"
      style={{ minHeight: '256px' }}
    />
  );
}
