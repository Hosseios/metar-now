
import React, { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

// Dynamic import for mapbox-gl to handle build issues
let mapboxgl: any = null;

// Airport coordinates database (major airports and city fallbacks)
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
  'KIAH': [-95.3414, 29.9844], // Houston Intercontinental
  'KHOU': [-95.2789, 29.6454], // Houston Hobby
  'KJAX': [-81.6879, 30.4941], // Jacksonville
  'KRDU': [-78.7875, 35.8777], // Raleigh-Durham
  'KBNA': [-86.6782, 36.1245], // Nashville
  'KIND': [-86.2948, 39.7173], // Indianapolis
  'KCMH': [-82.8918, 39.9980], // Columbus
  'KCLE': [-81.8498, 41.4075], // Cleveland
  'KDET': [-83.3534, 42.2162], // Detroit
  'KMKE': [-87.8966, 42.9472], // Milwaukee
  'KOKC': [-97.5977, 35.3932], // Oklahoma City
  'KTUL': [-95.8881, 36.1984], // Tulsa
  'KOMA': [-95.8944, 41.3032], // Omaha
  'KDSM': [-93.6631, 41.5339], // Des Moines
  'KFAR': [-96.8159, 46.9207], // Fargo
  'KBIS': [-100.7467, 46.7727], // Bismarck
  'KRAP': [-103.0574, 44.0453], // Rapid City
  'KCYS': [-104.8120, 41.1557], // Cheyenne
  'KCOS': [-104.7006, 38.8058], // Colorado Springs
  'KGEG': [-117.5336, 47.6198], // Spokane
  'KANC': [-149.9962, 61.1744], // Anchorage
  'PHNL': [-157.9224, 21.3099], // Honolulu
  
  // International Airports - Europe
  'EGLL': [-0.4614, 51.4700], // Heathrow
  'EGKK': [-0.1903, 51.1537], // Gatwick
  'EGLC': [0.0481, 51.5048], // London City
  'EGSS': [0.2349, 51.8850], // Stansted
  'EGGW': [-0.3717, 51.8763], // Luton
  'LFPG': [2.5479, 49.0097], // Charles de Gaulle
  'LFPO': [2.3597, 48.7252], // Orly
  'EDDF': [8.5622, 50.0379], // Frankfurt
  'EDDM': [11.7861, 48.3538], // Munich
  'EDDT': [13.2877, 52.5597], // Berlin Tegel
  'EDDL': [6.7668, 51.2895], // Düsseldorf
  'EDDH': [9.9882, 53.6304], // Hamburg
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
  'UUDD': [37.9066, 55.4088], // Moscow Domodedovo
  'EIDW': [-6.2499, 53.4213], // Dublin
  'EGPH': [-3.3749, 55.9500], // Edinburgh
  'EGPF': [-4.4326, 55.8719], // Glasgow
  'EGGD': [-2.7191, 51.3827], // Bristol
  'EGNX': [-1.3281, 52.8311], // East Midlands
  'EGCC': [-2.2750, 53.3537], // Manchester
  'EGGP': [-2.8497, 53.3536], // Liverpool
  'EGNM': [-1.4307, 54.5085], // Leeds Bradford
  'EGNT': [-1.6915, 55.0375], // Newcastle
  
  // Asia Pacific
  'RJTT': [139.7811, 35.5494], // Tokyo Haneda
  'RJAA': [140.3864, 35.7647], // Tokyo Narita
  'RKSI': [126.4406, 37.4691], // Seoul Incheon
  'RKSS': [126.7909, 37.4386], // Seoul Gimpo
  'VHHH': [113.9150, 22.3089], // Hong Kong
  'WSSS': [103.9915, 1.3644], // Singapore
  'WBKK': [117.5647, 4.9442], // Kota Kinabalu
  'WMKK': [101.7099, 2.7456], // Kuala Lumpur
  'VTBS': [100.7501, 13.6900], // Bangkok Suvarnabhumi
  'VVTS': [106.6519, 10.8191], // Ho Chi Minh City
  'VVNB': [105.8067, 21.2212], // Hanoi
  'RPLL': [121.0198, 14.5086], // Manila
  'YSSY': [151.1772, -33.9399], // Sydney
  'YMML': [144.8430, -37.6690], // Melbourne
  'YBBN': [153.1175, -27.3842], // Brisbane
  'YPPH': [115.9672, -31.9403], // Perth
  'YPAD': [138.5306, -34.9462], // Adelaide
  'NZAA': [174.7850, -36.9985], // Auckland
  'NZCH': [172.5362, -43.4894], // Christchurch
  'NZWN': [174.8049, -41.3276], // Wellington
  'ZBAA': [116.5974, 40.0801], // Beijing Capital
  'ZSPD': [121.8057, 31.1443], // Shanghai Pudong
  'ZGGG': [113.2990, 23.3924], // Guangzhou
  'ZUUU': [104.0173, 30.5785], // Chengdu
  'ZGSZ': [113.8206, 22.6393], // Shenzhen
  'ZYHB': [126.2503, 45.6234], // Harbin
  'ZYCC': [125.6842, 43.996], // Changchun
  
  // Middle East & Africa
  'OMDB': [55.3648, 25.2532], // Dubai
  'OERK': [46.6977, 24.9576], // Riyadh
  'OTHH': [51.6081, 25.2731], // Doha
  'OKBK': [47.9689, 29.2267], // Kuwait
  'LTBA': [28.8157, 41.2753], // Istanbul
  'OJAI': [35.9916, 31.7226], // Amman
  'LLBG': [34.8870, 32.0114], // Tel Aviv
  'HECA': [31.4056, 30.1219], // Cairo
  'FACT': [18.6017, -33.9715], // Cape Town
  'FAOR': [28.2460, -26.1392], // Johannesburg
  'FALE': [27.9306, -29.4597], // Maseru
  'FMMI': [-47.4789, -18.7969], // Antananarivo
  
  // Canada
  'CYYZ': [-79.6306, 43.6777], // Toronto
  'CYVR': [-123.1816, 49.1939], // Vancouver
  'CYUL': [-73.7281, 45.4706], // Montreal
  'CYYC': [-114.0103, 51.1315], // Calgary
  'CYEG': [-113.5803, 53.3097], // Edmonton
  'CYWG': [-97.2396, 49.9100], // Winnipeg
  'CYQX': [-106.7000, 52.1708], // Gander
  'CYHZ': [-63.5086, 44.8808], // Halifax
  'CYYT': [-52.7519, 47.6186], // St. John's
  'CYVT': [-110.8278, 50.0333], // Buffalo Narrows
  
  // Latin America
  'SBGR': [-46.4733, -23.4356], // São Paulo
  'SBGL': [-43.2436, -22.8089], // Rio de Janeiro
  'SCEL': [-70.7858, -33.3928], // Santiago
  'SAEZ': [-58.5358, -34.8222], // Buenos Aires
  'SKBO': [-74.1469, 4.7016], // Bogotá
  'SLVR': [-64.5483, -21.1075], // Santa Cruz
  'SPJC': [-77.1144, -12.0219], // Lima
  'SEQM': [-78.4878, -0.1295], // Quito
  'MMMX': [-99.0722, 19.4363], // Mexico City
  'MMUN': [-100.2861, 25.7785], // Monterrey
  'MMGL': [-103.31, 20.5218], // Guadalajara
  'TJSJ': [-66.0018, 18.4394], // San Juan
  
  // Additional European cities (using capital coordinates as fallback)
  'LIME': [8.7231, 45.6306], // Milan (using Milan coordinates)
  'LIML': [9.2781, 45.4642], // Milan Linate
  'LFMN': [7.2159, 43.6584], // Nice
  'LFML': [5.2139, 43.4364], // Marseille
  'LFLL': [5.0814, 45.7256], // Lyon
  'LFRN': [1.4828, 49.3842], // Rouen (using Rouen coordinates)
  'EGBB': [-1.7480, 52.4539], // Birmingham
  'EGTE': [-3.4142, 50.7344], // Exeter
  'EGHI': [-1.3568, 50.9503], // Southampton
  'EGNV': [-3.0394, 53.1747], // Teesside
  'EGPD': [-2.1978, 57.2019], // Aberdeen
  'EGPK': [-4.5867, 55.5086], // Prestwick
};

// Fallback function to get city coordinates for unknown airports
const getCityCoordinates = (icaoCode: string): [number, number] | null => {
  // This is a simplified fallback - in a real app you'd want to use a proper geocoding service
  // For now, we'll use some common patterns based on ICAO prefixes
  const prefix = icaoCode.substring(0, 2);
  
  // Basic fallback based on country prefixes
  const countryFallbacks: Record<string, [number, number]> = {
    // Europe
    'EG': [-2.0, 53.0], // UK (somewhere in middle of England)
    'LF': [2.3, 46.2], // France (Paris area)
    'ED': [10.0, 51.5], // Germany (central)
    'EH': [4.9, 52.3], // Netherlands (Amsterdam)
    'EB': [4.4, 50.8], // Belgium (Brussels)
    'LI': [12.5, 42.8], // Italy (Rome area)
    'LE': [-3.7, 40.4], // Spain (Madrid)
    'LP': [-9.1, 39.3], // Portugal (Lisbon)
    'LO': [16.4, 48.2], // Austria (Vienna)
    'LS': [8.2, 47.1], // Switzerland (Bern)
    'ES': [18.1, 59.3], // Sweden (Stockholm)
    'EN': [10.7, 59.9], // Norway (Oslo)
    'EK': [12.6, 55.7], // Denmark (Copenhagen)
    'EF': [24.9, 60.2], // Finland (Helsinki)
    'UU': [37.6, 55.8], // Russia (Moscow)
    'EI': [-6.3, 53.3], // Ireland (Dublin)
    
    // North America
    'K': [-98.0, 39.8], // USA (center)
    'CY': [-106.3, 52.1], // Canada (center)
    
    // Asia
    'RJ': [138.3, 36.2], // Japan (Tokyo area)
    'RK': [127.8, 35.9], // South Korea (Seoul)
    'VH': [114.2, 22.4], // Hong Kong
    'WS': [103.8, 1.3], // Singapore
    'VT': [100.5, 13.8], // Thailand (Bangkok)
    'VV': [106.0, 16.0], // Vietnam (central)
    'RP': [121.8, 12.9], // Philippines (Manila area)
    'ZB': [116.4, 39.9], // China (Beijing)
    'ZS': [121.5, 31.2], // China (Shanghai)
    'ZG': [113.3, 23.1], // China (Guangzhou)
    
    // Oceania
    'YS': [151.2, -33.9], // Australia (Sydney)
    'YM': [144.9, -37.8], // Australia (Melbourne)
    'YB': [153.0, -27.5], // Australia (Brisbane)
    'YP': [115.9, -31.9], // Australia (Perth)
    'NZ': [174.8, -41.3], // New Zealand (Wellington)
    
    // Middle East
    'OM': [55.3, 25.3], // UAE (Dubai)
    'OE': [46.7, 24.6], // Saudi Arabia (Riyadh)
    'OT': [51.5, 25.3], // Qatar (Doha)
    'OK': [47.5, 29.3], // Kuwait
    'LT': [35.2, 39.0], // Turkey (Ankara)
    
    // Africa
    'FA': [24.0, -29.0], // South Africa (central)
    'HE': [31.2, 30.0], // Egypt (Cairo)
    
    // South America
    'SB': [-47.9, -15.8], // Brazil (Brasília)
    'SC': [-70.6, -33.4], // Chile (Santiago)
    'SA': [-64.2, -31.4], // Argentina (central)
    'SK': [-74.1, 4.6], // Colombia (Bogotá)
    'SL': [-63.2, -17.8], // Bolivia (central)
    'SP': [-76.0, -9.2], // Peru (Lima area)
    'SE': [-78.5, -1.8], // Ecuador (Quito)
    
    // Central America & Caribbean
    'MM': [-102.6, 23.6], // Mexico (central)
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
  const [mapboxLoaded, setMapboxLoaded] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string>('');

  useEffect(() => {
    // Load mapbox-gl dynamically
    const loadMapbox = async () => {
      try {
        const mapboxModule = await import('mapbox-gl');
        mapboxgl = mapboxModule.default;
        
        // Import CSS
        await import('mapbox-gl/dist/mapbox-gl.css');
        
        setMapboxLoaded(true);
        
        // For now, we'll use a placeholder for the Mapbox token
        // In production, this should come from Supabase Edge Function Secrets
        const token = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
        setMapboxToken(token);
      } catch (error) {
        console.error('Failed to load Mapbox:', error);
        setLoadError('Failed to load map library');
      }
    };

    loadMapbox();
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || !mapboxLoaded || !mapboxgl) return;

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
  }, [mapboxToken, mapboxLoaded]);

  useEffect(() => {
    if (!map.current || !favorites.length || !mapboxgl) return;

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
      
      if (!coordinates) return;

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
  }, [favorites, onAirportClick, mapboxLoaded]);

  if (loadError) {
    return (
      <div className="h-64 bg-slate-700/50 rounded-lg flex items-center justify-center">
        <div className="text-slate-400">Error loading map: {loadError}</div>
      </div>
    );
  }

  if (!mapboxLoaded || !mapboxToken) {
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
