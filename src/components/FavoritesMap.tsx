import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Key } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Dynamic import for mapbox-gl to handle build issues
let mapboxgl: any = null;

// Airport coordinates database (major airports and city fallbacks)
const AIRPORT_COORDINATES: Record<string, [number, number]> = {
  // US Airports
  'KJFK': [-73.7781, 40.6413], // JFK
  'KLAX': [-118.4085, 33.9425], // LAX
  'KORD': [-87.9048, 41.9786], // ORD
  'KDEN': [-104.6737, 39.8617], // DEN
  'KIAH': [-95.3414, 29.9844], // IAH Houston Intercontinental
  'KHOU': [-95.2789, 29.6454], // Houston Hobby
  'KBOS': [-71.0096, 42.3656], // BOS
  'KSEA': [-122.3088, 47.4502], // SEA
  'KLAS': [-115.1522, 36.0840], // LAS
  'KMIA': [-80.2906, 25.7959], // MIA
  'KATL': [-84.4281, 33.6407], // ATL
  'KDFW': [-97.0372, 32.8998], // Dallas/Fort Worth
  'KPHX': [-112.0058, 33.4342], // Phoenix
  'KPHL': [-75.2424, 39.8744], // Philadelphia
  'KSAN': [-117.1933, 32.7336], // San Diego
  'KTPA': [-82.5332, 27.9755], // Tampa
  'KMCO': [-81.3089, 28.4294], // Orlando
  'KBWI': [-76.6678, 39.1754], // Baltimore
  'KMSP': [-93.2218, 44.8848], // Minneapolis
  'KSLC': [-111.9778, 40.7884], // Salt Lake City
  'KPDX': [-122.5951, 45.5898], // Portland
  'KCLT': [-80.9431, 35.2144], // Charlotte
  'KMEM': [-89.9767, 35.0424], // Memphis
  'KSTL': [-90.3700, 38.7487], // St. Louis
  'KCVG': [-84.6678, 39.0488], // Cincinnati
  'KPIT': [-80.2329, 40.4915], // Pittsburgh
  'KAUS': [-97.6699, 30.1945], // Austin
  
  // International Airports - Europe
  'EGLL': [-0.4614, 51.4700], // Heathrow
  'EGKK': [-0.1903, 51.1537], // Gatwick
  'LFPG': [2.5479, 49.0097], // Charles de Gaulle
  'LFPO': [2.3597, 48.7252], // Orly
  'EDDF': [8.5622, 50.0379], // Frankfurt
  'EDDM': [11.7861, 48.3538], // Munich
  'EHAM': [4.7683, 52.3105], // Amsterdam
  'EBBR': [4.4844, 50.9014], // Brussels
  'LIRF': [12.2389, 41.8003], // Rome Fiumicino
  'LIMC': [8.7231, 45.6306], // Milan Malpensa
  'LEMD': [-3.5676, 40.4983], // Madrid
  'LEBL': [2.0785, 41.2971], // Barcelona
  'LPPT': [-9.1354, 38.7813], // Lisbon
  'LOWW': [16.5697, 48.1103], // Vienna
  'LSZH': [8.5492, 47.4647], // Zurich
  'ESSA': [17.9186, 59.6519], // Stockholm Arlanda
  'ENGM': [11.1004, 60.1939], // Oslo
  'EKCH': [12.6561, 55.6181], // Copenhagen
  'EFHK': [24.9633, 60.3172], // Helsinki
  'EIDW': [-6.2499, 53.4213], // Dublin
  
  // Asia Pacific
  'RJTT': [139.7811, 35.5494], // Tokyo Haneda
  'RJAA': [140.3864, 35.7647], // Tokyo Narita
  'RKSI': [126.4406, 37.4691], // Seoul Incheon
  'VHHH': [113.9150, 22.3089], // Hong Kong
  'WSSS': [103.9915, 1.3644], // Singapore
  'WMKK': [101.7099, 2.7456], // Kuala Lumpur
  'VTBS': [100.7501, 13.6900], // Bangkok Suvarnabhumi
  'YSSY': [151.1772, -33.9399], // Sydney
  'YMML': [144.8430, -37.6690], // Melbourne
  'NZAA': [174.7850, -36.9985], // Auckland
  'ZBAA': [116.5974, 40.0801], // Beijing Capital
  'ZSPD': [121.8057, 31.1443], // Shanghai Pudong
  
  // Middle East & Africa
  'OMDB': [55.3648, 25.2532], // Dubai
  'OERK': [46.6977, 24.9576], // Riyadh
  'OTHH': [51.6081, 25.2731], // Doha
  'HECA': [31.4056, 30.1219], // Cairo
  'FACT': [18.6017, -33.9715], // Cape Town
  
  // Canada
  'CYYZ': [-79.6306, 43.6777], // Toronto
  'CYVR': [-123.1816, 49.1939], // Vancouver
  'CYUL': [-73.7281, 45.4706], // Montreal
  'CYYC': [-114.0103, 51.1315], // Calgary
  
  // Latin America
  'SBGR': [-46.4733, -23.4356], // São Paulo
  'SBGL': [-43.2436, -22.8089], // Rio de Janeiro
  'SCEL': [-70.7858, -33.3928], // Santiago
  'SAEZ': [-58.5358, -34.8222], // Buenos Aires
  'MMMX': [-99.0722, 19.4363], // Mexico City
};

// Fallback function to get city coordinates for unknown airports
const getCityCoordinates = (icaoCode: string): [number, number] | null => {
  const prefix = icaoCode.substring(0, 2);
  
  // Basic fallback based on country prefixes
  const countryFallbacks: Record<string, [number, number]> = {
    // Europe
    'EG': [-2.0, 53.0], // UK
    'LF': [2.3, 46.2], // France
    'ED': [10.0, 51.5], // Germany
    'EH': [4.9, 52.3], // Netherlands
    'EB': [4.4, 50.8], // Belgium
    'LI': [12.5, 42.8], // Italy
    'LE': [-3.7, 40.4], // Spain
    'LP': [-9.1, 39.3], // Portugal
    
    // North America
    'K': [-98.0, 39.8], // USA (center)
    'CY': [-106.3, 52.1], // Canada (center)
    
    // Asia
    'RJ': [138.3, 36.2], // Japan
    'RK': [127.8, 35.9], // South Korea
    'VH': [114.2, 22.4], // Hong Kong
    'WS': [103.8, 1.3], // Singapore
    'VT': [100.5, 13.8], // Thailand
    'RP': [121.8, 12.9], // Philippines
    'ZB': [116.4, 39.9], // China (Beijing)
    'ZS': [121.5, 31.2], // China (Shanghai)
    
    // Oceania
    'YS': [151.2, -33.9], // Australia (Sydney)
    'YM': [144.9, -37.8], // Australia (Melbourne)
    'NZ': [174.8, -41.3], // New Zealand
    
    // Middle East
    'OM': [55.3, 25.3], // UAE
    'OE': [46.7, 24.6], // Saudi Arabia
    'OT': [51.5, 25.3], // Qatar
    
    // Africa
    'FA': [24.0, -29.0], // South Africa
    'HE': [31.2, 30.0], // Egypt
    
    // South America
    'SB': [-47.9, -15.8], // Brazil
    'SC': [-70.6, -33.4], // Chile
    'SA': [-64.2, -31.4], // Argentina
    'SK': [-74.1, 4.6], // Colombia
    
    // Central America & Caribbean
    'MM': [-102.6, 23.6], // Mexico
    'TJ': [-66.6, 18.2], // Puerto Rico
  };
  
  return countryFallbacks[prefix] || null;
};

interface FavoritesMapProps {
  favorites: string[];
  onAirportClick: (icaoCode: string) => void;
}

const FavoritesMap = ({ favorites, onAirportClick }: FavoritesMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [inputToken, setInputToken] = useState<string>('');
  const [mapboxLoaded, setMapboxLoaded] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string>('');
  const [showTokenInput, setShowTokenInput] = useState<boolean>(true);

  useEffect(() => {
    // Load mapbox-gl dynamically
    const loadMapbox = async () => {
      try {
        const mapboxModule = await import('mapbox-gl');
        mapboxgl = mapboxModule.default;
        
        // Import CSS
        await import('mapbox-gl/dist/mapbox-gl.css');
        
        setMapboxLoaded(true);
        console.log('Mapbox loaded successfully');
      } catch (error) {
        console.error('Failed to load Mapbox:', error);
        setLoadError('Failed to load map library');
      }
    };

    loadMapbox();
  }, []);

  const handleTokenSubmit = () => {
    if (!inputToken.trim()) {
      setLoadError('Please enter a valid Mapbox token');
      return;
    }
    setMapboxToken(inputToken.trim());
    setShowTokenInput(false);
    setLoadError('');
  };

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || !mapboxLoaded || !mapboxgl) return;

    console.log('Initializing map with token:', mapboxToken.substring(0, 20) + '...');

    // Initialize map
    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      zoom: 1.5,
      center: [0, 20],
      projection: 'mercator' as any,
    });

    map.current.on('load', () => {
      console.log('Map loaded successfully');
      setLoadError('');
    });

    map.current.on('error', (e: any) => {
      console.error('Map error:', e);
      setLoadError('Invalid Mapbox token or map failed to load');
      setShowTokenInput(true);
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
  }, [mapboxToken, mapboxLoaded]);

  useEffect(() => {
    if (!map.current || !favorites.length || !mapboxgl) return;

    console.log('Adding markers for favorites:', favorites);

    // Clear existing markers
    const existingMarkers = document.querySelectorAll('.airport-marker');
    existingMarkers.forEach(marker => marker.remove());

    // Add markers for each favorite airport
    const bounds = new mapboxgl.LngLatBounds();
    let validAirports = 0;

    favorites.forEach((icao) => {
      // Try to get exact airport coordinates first, then fallback to city coordinates
      let coordinates = AIRPORT_COORDINATES[icao];
      let isApproximate = false;
      
      if (!coordinates) {
        coordinates = getCityCoordinates(icao);
        isApproximate = true;
      }
      
      if (!coordinates) {
        console.log(`No coordinates found for ${icao}`);
        return;
      }

      console.log(`Adding marker for ${icao} at`, coordinates, isApproximate ? '(approximate)' : '(exact)');
      validAirports++;
      bounds.extend(coordinates);

      // Create custom marker element
      const markerElement = document.createElement('div');
      markerElement.className = 'airport-marker cursor-pointer';
      markerElement.innerHTML = `
        <div class="relative group">
          <div class="w-8 h-8 ${isApproximate ? 'bg-orange-600' : 'bg-blue-600'} rounded-full border-2 border-white shadow-lg flex items-center justify-center hover:${isApproximate ? 'bg-orange-500' : 'bg-blue-500'} transition-colors">
            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12L8 10l4-8 4 8-2 2-4-2z"/>
            </svg>
          </div>
          <div class="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            ${icao}${isApproximate ? ' (approx)' : ''}
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
  }, [favorites, onAirportClick, mapboxLoaded, mapboxToken]);

  if (loadError) {
    return (
      <div className="h-64 bg-slate-700/50 rounded-lg flex items-center justify-center">
        <div className="text-center text-slate-400">
          <p className="mb-2">Error: {loadError}</p>
          <Button onClick={() => setShowTokenInput(true)} size="sm">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!mapboxLoaded) {
    return (
      <div className="h-64 bg-slate-700/50 rounded-lg flex items-center justify-center">
        <div className="text-slate-400">Loading map...</div>
      </div>
    );
  }

  if (showTokenInput) {
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-slate-300">Favorites Map</h3>
        <div className="h-64 bg-slate-700/50 rounded-lg flex flex-col items-center justify-center p-6">
          <Key className="w-8 h-8 mb-4 text-slate-400" />
          <p className="text-slate-300 mb-4 text-center">Enter your Mapbox public token to display the map</p>
          <div className="w-full max-w-sm space-y-3">
            <Input
              type="text"
              placeholder="pk.eyJ1IjoieW91ci11c2VybmFtZSI..."
              value={inputToken}
              onChange={(e) => setInputToken(e.target.value)}
              className="bg-slate-600 border-slate-500 text-white"
            />
            <Button onClick={handleTokenSubmit} className="w-full">
              Load Map
            </Button>
          </div>
          <p className="text-xs text-slate-400 mt-3 text-center">
            Get your free token at{' '}
            <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
              mapbox.com
            </a>
          </p>
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-slate-300">Favorites Map</h3>
        <div className="h-64 bg-slate-700/50 rounded-lg flex flex-col items-center justify-center text-slate-400">
          <MapPin className="w-8 h-8 mb-2 opacity-50" />
          <p>No favorites to display on map</p>
          <p className="text-sm">Add some airports to see them here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-300">Favorites Map</h3>
        <Button 
          onClick={() => setShowTokenInput(true)} 
          size="sm" 
          variant="ghost" 
          className="text-xs text-slate-400 hover:text-slate-300"
        >
          Change Token
        </Button>
      </div>
      <div className="relative h-64 rounded-lg overflow-hidden border border-slate-600">
        <div ref={mapContainer} className="absolute inset-0" />
        <div className="absolute top-2 left-2 bg-slate-800/90 text-slate-300 text-xs px-2 py-1 rounded">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <span>Exact location</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
              <span>City/Region</span>
            </div>
          </div>
        </div>
      </div>
      <p className="text-xs text-slate-400">
        Click on any airport marker to load its weather data. Orange markers show approximate city locations.
      </p>
    </div>
  );
};

export default FavoritesMap;
