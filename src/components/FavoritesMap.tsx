
import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Key } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Dynamic import for mapbox-gl to handle build issues
let mapboxgl: any = null;

// Airport coordinates database (major airports and city fallbacks)
// Format: [longitude, latitude] for Mapbox GL JS
const AIRPORT_COORDINATES: Record<string, [number, number]> = {
  // US Airports
  'KJFK': [-73.7781, 40.6413], // JFK
  'KLAX': [-118.4085, 33.9425], // LAX
  'KORD': [-87.9048, 41.9786], // ORD
  'KDEN': [-104.6737, 39.8617], // DEN
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
  'EBLG': [5.4432, 50.6374], // Liège
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
  
  // Middle East & Africa
  'OLBA': [35.4883, 33.8209], // Beirut
  'OMDB': [55.3648, 25.2532], // Dubai
  'OERK': [46.6977, 24.9576], // Riyadh
  'OTHH': [51.6081, 25.2731], // Doha
  'HECA': [31.4056, 30.1219], // Cairo
  'FACT': [18.6017, -33.9715], // Cape Town
  
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
    'OL': [35.5, 33.9], // Lebanon/Syria
    
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
  const markersRef = useRef<any[]>([]);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [inputToken, setInputToken] = useState<string>('');
  const [mapboxLoaded, setMapboxLoaded] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string>('');
  const [showTokenInput, setShowTokenInput] = useState<boolean>(true);
  const [mapReady, setMapReady] = useState<boolean>(false);

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

    // Clean up existing map first
    if (map.current) {
      map.current.remove();
      map.current = null;
    }

    // Clear existing markers
    markersRef.current.forEach(marker => {
      if (marker && marker.remove) {
        marker.remove();
      }
    });
    markersRef.current = [];

    // Disable telemetry to prevent errors
    if (mapboxgl.config) {
      mapboxgl.config.EVENT_URL = null;
      mapboxgl.config.API_URL = 'https://api.mapbox.com';
    }

    // Initialize map with aviation dark theme
    mapboxgl.accessToken = mapboxToken;
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11', // Changed to dark theme for aviation feel
        zoom: 2,
        center: [10, 50], // Center on Europe where most favorites are
        antialias: true,
        preserveDrawingBuffer: true,
      });

      map.current.on('load', () => {
        console.log('Map loaded and ready');
        setMapReady(true);
        setLoadError('');
        
        // Force a resize to ensure proper rendering
        setTimeout(() => {
          if (map.current) {
            map.current.resize();
            console.log('Map resized after load');
          }
        }, 100);
      });

      map.current.on('error', (e: any) => {
        console.error('Map error:', e);
        if (e.error && e.error.message && e.error.message.includes('token')) {
          setLoadError('Invalid Mapbox token. Please check your token and try again.');
        } else {
          setLoadError('Map failed to load. Please try again.');
        }
        setShowTokenInput(true);
        setMapReady(false);
      });

      // Add navigation controls with aviation styling
      const nav = new mapboxgl.NavigationControl({
        showCompass: false,
        showZoom: true,
      });
      map.current.addControl(nav, 'top-right');

      // Style the navigation controls to match aviation theme
      setTimeout(() => {
        const navButtons = document.querySelectorAll('.mapboxgl-ctrl-group button');
        navButtons.forEach((button: any) => {
          button.style.backgroundColor = '#000000';
          button.style.border = '1px solid #f97316';
          button.style.color = '#f97316';
          button.style.boxShadow = '0 0 8px rgba(255, 165, 0, 0.3)';
        });
      }, 500);

    } catch (error) {
      console.error('Error initializing map:', error);
      setLoadError('Failed to initialize map');
      setShowTokenInput(true);
    }

    // Cleanup
    return () => {
      // Clear markers
      markersRef.current.forEach(marker => {
        if (marker && marker.remove) {
          marker.remove();
        }
      });
      markersRef.current = [];
      
      if (map.current) {
        try {
          map.current.remove();
        } catch (e) {
          console.warn('Error removing map:', e);
        }
        map.current = null;
      }
      setMapReady(false);
    };
  }, [mapboxToken, mapboxLoaded]);

  useEffect(() => {
    if (!map.current || !mapReady || !favorites.length || !mapboxgl) {
      console.log('Map not ready for markers:', { 
        hasMap: !!map.current, 
        mapReady, 
        favoritesCount: favorites.length,
        hasMapboxgl: !!mapboxgl 
      });
      return;
    }

    console.log('Adding markers for favorites:', favorites);

    // Clear existing markers
    markersRef.current.forEach(marker => {
      if (marker && marker.remove) {
        marker.remove();
      }
    });
    markersRef.current = [];

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

      // Ensure coordinates are in correct [lng, lat] format for Mapbox
      const [lng, lat] = coordinates;
      
      console.log(`Adding marker for ${icao} at [${lng}, ${lat}]`, isApproximate ? '(approximate)' : '(exact)');
      validAirports++;
      bounds.extend([lng, lat]);

      // Create custom aviation-style marker element
      const markerElement = document.createElement('div');
      markerElement.className = 'aviation-marker';
      markerElement.style.cssText = `
        position: relative;
        cursor: pointer;
        z-index: 1000;
        font-family: Monaco, "Courier New", monospace;
      `;
      
      markerElement.innerHTML = `
        <div style="position: relative; display: inline-block;">
          <div style="
            width: 24px;
            height: 24px;
            background-color: #ff6600;
            border: 2px solid #ff6600;
            border-radius: 50%;
            box-shadow: 
              0 0 12px rgba(255, 102, 0, 0.8),
              inset 0 0 6px rgba(255, 165, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            z-index: 1001;
            position: relative;
          " class="aviation-marker-circle">
            <div style="
              width: 8px;
              height: 8px;
              background-color: #ffffff;
              border-radius: 50%;
              box-shadow: 0 0 4px rgba(255, 255, 255, 0.8);
            "></div>
          </div>
          <div style="
            position: absolute;
            top: -45px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #000000;
            color: #ff6600;
            padding: 6px 10px;
            border: 1px solid #ff6600;
            border-radius: 4px;
            font-size: 11px;
            font-family: Monaco, 'Courier New', monospace;
            white-space: nowrap;
            opacity: 0;
            transition: opacity 0.2s ease;
            pointer-events: none;
            z-index: 1002;
            text-shadow: 0 0 6px rgba(255, 165, 0, 0.6);
            box-shadow: 
              0 0 8px rgba(255, 102, 0, 0.4),
              inset 0 0 4px rgba(255, 165, 0, 0.2);
          " class="aviation-marker-tooltip">
            ${icao}${isApproximate ? ' (APPROX)' : ''}
          </div>
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 40px;
            height: 40px;
            border: 1px solid rgba(255, 102, 0, 0.3);
            border-radius: 50%;
            opacity: 0;
            transition: all 0.3s ease;
            z-index: 999;
          " class="aviation-marker-pulse"></div>
        </div>
      `;

      // Add aviation-style hover effects
      const markerCircle = markerElement.querySelector('.aviation-marker-circle') as HTMLElement;
      const tooltip = markerElement.querySelector('.aviation-marker-tooltip') as HTMLElement;
      const pulse = markerElement.querySelector('.aviation-marker-pulse') as HTMLElement;
      
      markerElement.addEventListener('mouseenter', () => {
        if (markerCircle) {
          markerCircle.style.transform = 'scale(1.3)';
          markerCircle.style.boxShadow = '0 0 20px rgba(255, 102, 0, 1), inset 0 0 8px rgba(255, 165, 0, 0.7)';
        }
        if (tooltip) tooltip.style.opacity = '1';
        if (pulse) {
          pulse.style.opacity = '1';
          pulse.style.transform = 'translate(-50%, -50%) scale(1.2)';
        }
      });
      
      markerElement.addEventListener('mouseleave', () => {
        if (markerCircle) {
          markerCircle.style.transform = 'scale(1)';
          markerCircle.style.boxShadow = '0 0 12px rgba(255, 102, 0, 0.8), inset 0 0 6px rgba(255, 165, 0, 0.5)';
        }
        if (tooltip) tooltip.style.opacity = '0';
        if (pulse) {
          pulse.style.opacity = '0';
          pulse.style.transform = 'translate(-50%, -50%) scale(1)';
        }
      });

      // Add click handler
      markerElement.addEventListener('click', () => {
        console.log(`Clicked on airport: ${icao}`);
        onAirportClick(icao);
        
        // Add click animation
        if (markerCircle) {
          markerCircle.style.transform = 'scale(0.9)';
          setTimeout(() => {
            if (markerCircle) markerCircle.style.transform = 'scale(1)';
          }, 150);
        }
      });

      // Create and add marker
      try {
        const marker = new mapboxgl.Marker({
          element: markerElement,
          anchor: 'center'
        })
          .setLngLat([lng, lat])
          .addTo(map.current!);
        
        // Store marker reference for cleanup
        markersRef.current.push(marker);
        
        console.log(`Aviation marker added for ${icao} successfully`);
      } catch (error) {
        console.error(`Error adding marker for ${icao}:`, error);
      }
    });

    // Fit map to show all airports if there are valid coordinates
    if (validAirports > 0) {
      console.log(`Fitting map bounds for ${validAirports} airports`);
      try {
        // Add some delay to ensure map is fully rendered
        setTimeout(() => {
          if (map.current && bounds) {
            map.current.fitBounds(bounds, {
              padding: {
                top: 80,
                bottom: 80,
                left: 80,
                right: 80
              },
              maxZoom: 8,
              duration: 1500
            });
            console.log('Map bounds fitted successfully');
          }
        }, 500);
      } catch (error) {
        console.error('Error fitting bounds:', error);
      }
    } else {
      console.log('No valid airports found to display on map');
    }
  }, [favorites, onAirportClick, mapReady]);

  if (loadError) {
    return (
      <div className="h-64 bg-black border border-orange-400/50 rounded-lg flex items-center justify-center avionics-display">
        <div className="text-center text-orange-400 font-mono">
          <p className="mb-2 text-shadow-orange">ERROR: {loadError}</p>
          <Button 
            onClick={() => setShowTokenInput(true)} 
            size="sm"
            className="bg-orange-500/20 border border-orange-400/50 text-orange-400 hover:bg-orange-500/30 font-mono"
          >
            RETRY
          </Button>
        </div>
      </div>
    );
  }

  if (!mapboxLoaded) {
    return (
      <div className="h-64 bg-black border border-orange-400/50 rounded-lg flex items-center justify-center avionics-display">
        <div className="text-orange-400 font-mono" style={{ textShadow: '0 0 8px rgba(255, 165, 0, 0.6)' }}>
          INITIALIZING MAP SYSTEMS...
        </div>
      </div>
    );
  }

  if (showTokenInput) {
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-slate-300">Favorites Map</h3>
        <div className="h-64 bg-black border border-orange-400/50 rounded-lg flex flex-col items-center justify-center p-6 avionics-display">
          <Key className="w-8 h-8 mb-4 text-orange-400" style={{ filter: 'drop-shadow(0 0 8px rgba(255, 165, 0, 0.6))' }} />
          <p className="text-orange-400 mb-4 text-center font-mono" style={{ textShadow: '0 0 8px rgba(255, 165, 0, 0.6)' }}>
            ENTER MAPBOX ACCESS TOKEN
          </p>
          <div className="w-full max-w-sm space-y-3">
            <Input
              type="text"
              placeholder="pk.eyJ1IjoieW91ci11c2VybmFtZSI..."
              value={inputToken}
              onChange={(e) => setInputToken(e.target.value)}
              className="bg-black border-orange-400/50 text-orange-400 placeholder:text-orange-400/50 font-mono focus:border-orange-400 focus:ring-orange-400/50"
              style={{ textShadow: '0 0 4px rgba(255, 165, 0, 0.4)' }}
            />
            <Button 
              onClick={handleTokenSubmit} 
              className="w-full bg-orange-500/20 border border-orange-400/50 text-orange-400 hover:bg-orange-500/30 font-mono"
            >
              INITIALIZE MAP
            </Button>
          </div>
          <p className="text-xs text-orange-400/70 mt-3 text-center font-mono">
            Get token at{' '}
            <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 underline">
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
        <div className="h-64 bg-black border border-orange-400/50 rounded-lg flex flex-col items-center justify-center text-orange-400 avionics-display">
          <MapPin className="w-8 h-8 mb-2 opacity-50" style={{ filter: 'drop-shadow(0 0 8px rgba(255, 165, 0, 0.3))' }} />
          <p className="font-mono" style={{ textShadow: '0 0 8px rgba(255, 165, 0, 0.6)' }}>NO AIRPORTS IN FAVORITES</p>
          <p className="text-sm font-mono text-orange-400/70">ADD STATIONS TO DISPLAY ON MAP</p>
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
          className="text-xs text-orange-400/70 hover:text-orange-400 font-mono"
        >
          CHANGE TOKEN
        </Button>
      </div>
      <div className="relative h-64 rounded-lg overflow-hidden border-2 border-orange-400/50 avionics-display">
        <div 
          ref={mapContainer} 
          className="absolute inset-0" 
          style={{ 
            minHeight: '256px',
            filter: 'contrast(1.1) brightness(0.9) saturate(1.2)'
          }} 
        />
        {!mapReady && (
          <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-30 avionics-display">
            <div className="text-orange-400 font-mono" style={{ textShadow: '0 0 8px rgba(255, 165, 0, 0.6)' }}>
              LOADING NAVIGATION SYSTEM...
            </div>
          </div>
        )}
        <div className="absolute top-2 left-2 bg-black/90 border border-orange-400/50 text-orange-400 text-xs px-3 py-2 rounded z-20 font-mono avionics-display"
          style={{ textShadow: '0 0 6px rgba(255, 165, 0, 0.6)' }}>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-orange-500 rounded-full shadow-orange"></div>
              <span>EXACT POS</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-orange-400 rounded-full shadow-orange"></div>
              <span>APPROX POS</span>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse at center, transparent 60%, rgba(255, 102, 0, 0.03) 100%),
              linear-gradient(0deg, transparent 0%, rgba(255, 165, 0, 0.01) 50%, transparent 100%)
            `,
            boxShadow: 'inset 0 0 30px rgba(255, 102, 0, 0.1)'
          }}
        />
      </div>
      <p className="text-xs text-orange-400/70 font-mono">
        SELECT AIRPORT MARKER TO LOAD WEATHER DATA • AVIATION NAVIGATION SYSTEM
      </p>
    </div>
  );
};

export default FavoritesMap;
