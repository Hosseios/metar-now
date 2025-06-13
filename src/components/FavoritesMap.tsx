
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin } from 'lucide-react';

// Airport coordinates database (major airports)
const AIRPORT_COORDINATES: Record<string, [number, number]> = {
  // US Airports
  'KJFK': [-73.7781, 40.6413], // JFK
  'KLAX': [-118.4085, 33.9425], // LAX
  'KORD': [-87.9048, 41.9786], // ORD
  'KDEN': [-104.6737, 39.8617], // DEN
  'KIAH': [-95.3414, 29.9844], // IAH
  'KBOS': [-71.0096, 42.3656], // BOS
  'KSEA': [-122.3088, 47.4502], // SEA
  'KLAS': [-115.1522, 36.0840], // LAS
  'KMIA': [-80.2906, 25.7959], // MIA
  'KATL': [-84.4281, 33.6407], // ATL
  
  // International Airports
  'EGLL': [-0.4614, 51.4700], // Heathrow
  'LFPG': [2.5479, 49.0097], // Charles de Gaulle
  'EDDF': [8.5622, 50.0379], // Frankfurt
  'EHAM': [4.7683, 52.3105], // Amsterdam
  'LIRF': [12.2389, 41.8003], // Rome
  'LEMD': [-3.5676, 40.4983], // Madrid
  'LOWW': [16.5697, 48.1103], // Vienna
  'ESSA': [17.9186, 59.6519], // Stockholm
  'EKCH': [12.6561, 55.6181], // Copenhagen
  'EIDW': [-6.2499, 53.4213], // Dublin
  
  // Asia Pacific
  'RJTT': [139.7811, 35.5494], // Tokyo Haneda
  'RKSI': [126.4406, 37.4691], // Seoul Incheon
  'VHHH': [113.9150, 22.3089], // Hong Kong
  'WSSS': [103.9915, 1.3644], // Singapore
  'YSSY': [151.1772, -33.9399], // Sydney
  'YMML': [144.8430, -37.6690], // Melbourne
  'NZAA': [174.7850, -36.9985], // Auckland
  
  // Canada
  'CYYZ': [-79.6306, 43.6777], // Toronto
  'CYVR': [-123.1816, 49.1939], // Vancouver
  'CYUL': [-73.7281, 45.4706], // Montreal
};

interface FavoritesMapProps {
  favorites: string[];
  onAirportClick: (icaoCode: string) => void;
}

const FavoritesMap = ({ favorites, onAirportClick }: FavoritesMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');

  useEffect(() => {
    // For now, we'll use a placeholder for the Mapbox token
    // In production, this should come from Supabase Edge Function Secrets
    const token = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
    setMapboxToken(token);
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    // Initialize map
    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      zoom: 1.5,
      center: [0, 20],
      projection: 'mercator' as any,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        showCompass: false,
        showZoom: true,
      }),
      'top-right'
    );

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [mapboxToken]);

  useEffect(() => {
    if (!map.current || !favorites.length) return;

    // Clear existing markers
    const existingMarkers = document.querySelectorAll('.airport-marker');
    existingMarkers.forEach(marker => marker.remove());

    // Add markers for each favorite airport
    const bounds = new mapboxgl.LngLatBounds();
    let validAirports = 0;

    favorites.forEach((icao) => {
      const coordinates = AIRPORT_COORDINATES[icao];
      if (!coordinates) return;

      validAirports++;
      bounds.extend(coordinates);

      // Create custom marker element
      const markerElement = document.createElement('div');
      markerElement.className = 'airport-marker cursor-pointer';
      markerElement.innerHTML = `
        <div class="relative group">
          <div class="w-8 h-8 bg-blue-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center hover:bg-blue-500 transition-colors">
            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12L8 10l4-8 4 8-2 2-4-2z"/>
            </svg>
          </div>
          <div class="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            ${icao}
          </div>
        </div>
      `;

      // Add click handler
      markerElement.addEventListener('click', () => {
        onAirportClick(icao);
      });

      // Create and add marker
      new mapboxgl.Marker(markerElement)
        .setLngLat(coordinates)
        .addTo(map.current!);
    });

    // Fit map to show all airports if there are valid coordinates
    if (validAirports > 0) {
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 8,
      });
    }
  }, [favorites, onAirportClick]);

  if (!mapboxToken) {
    return (
      <div className="h-64 bg-slate-700/50 rounded-lg flex items-center justify-center">
        <div className="text-slate-400">Loading map...</div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="h-64 bg-slate-700/50 rounded-lg flex flex-col items-center justify-center text-slate-400">
        <MapPin className="w-8 h-8 mb-2 opacity-50" />
        <p>No favorites to display on map</p>
        <p className="text-sm">Add some airports to see them here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-slate-300">Favorites Map</h3>
      <div className="relative h-64 rounded-lg overflow-hidden border border-slate-600">
        <div ref={mapContainer} className="absolute inset-0" />
        {favorites.some(icao => !AIRPORT_COORDINATES[icao]) && (
          <div className="absolute bottom-2 left-2 bg-slate-800/90 text-slate-300 text-xs px-2 py-1 rounded">
            Some airports may not be visible (coordinates not available)
          </div>
        )}
      </div>
      <p className="text-xs text-slate-400">
        Click on any airport marker to load its weather data
      </p>
    </div>
  );
};

export default FavoritesMap;
