
// Define the shape of each airport entry
export interface AirportEntry {
  ident: string;
  type: string;
  name: string;
  elevation_ft: string;
  continent: string;
  iso_country: string;
  iso_region: string;
  municipality: string;
  icao_code: string;
  iata_code: string;
  gps_code: string;
  local_code: string;
  coordinates: string;
}

// Expanded airport data with more European and international airports
const SAMPLE_AIRPORTS: AirportEntry[] = [
  // Original US airports
  {
    ident: "KJFK",
    type: "large_airport",
    name: "John F Kennedy International Airport",
    elevation_ft: "13",
    continent: "NA",
    iso_country: "US",
    iso_region: "US-NY",
    municipality: "New York",
    icao_code: "KJFK",
    iata_code: "JFK",
    gps_code: "KJFK",
    local_code: "JFK",
    coordinates: "-73.778925, 40.639751"
  },
  {
    ident: "KLAX",
    type: "large_airport",
    name: "Los Angeles International Airport",
    elevation_ft: "125",
    continent: "NA",
    iso_country: "US",
    iso_region: "US-CA",
    municipality: "Los Angeles",
    icao_code: "KLAX",
    iata_code: "LAX",
    gps_code: "KLAX",
    local_code: "LAX",
    coordinates: "-118.408075, 33.942536"
  },
  {
    ident: "KORD",
    type: "large_airport",
    name: "Chicago O'Hare International Airport",
    elevation_ft: "672",
    continent: "NA",
    iso_country: "US",
    iso_region: "US-IL",
    municipality: "Chicago",
    icao_code: "KORD",
    iata_code: "ORD",
    gps_code: "KORD",
    local_code: "ORD",
    coordinates: "-87.904842, 41.978603"
  },
  // European airports
  {
    ident: "EGLL",
    type: "large_airport",
    name: "London Heathrow Airport",
    elevation_ft: "83",
    continent: "EU",
    iso_country: "GB",
    iso_region: "GB-ENG",
    municipality: "London",
    icao_code: "EGLL",
    iata_code: "LHR",
    gps_code: "EGLL",
    local_code: "",
    coordinates: "-0.461941, 51.4706"
  },
  {
    ident: "LFPG",
    type: "large_airport",
    name: "Charles de Gaulle International Airport",
    elevation_ft: "392",
    continent: "EU",
    iso_country: "FR",
    iso_region: "FR-J",
    municipality: "Paris",
    icao_code: "LFPG",
    iata_code: "CDG",
    gps_code: "LFPG",
    local_code: "",
    coordinates: "2.55, 49.012779"
  },
  {
    ident: "EBLG",
    type: "medium_airport",
    name: "Liège Airport",
    elevation_ft: "659",
    continent: "EU",
    iso_country: "BE",
    iso_region: "BE-WLG",
    municipality: "Liège",
    icao_code: "EBLG",
    iata_code: "LGG",
    gps_code: "EBLG",
    local_code: "",
    coordinates: "5.443222, 50.637417"
  },
  {
    ident: "EDDF",
    type: "large_airport",
    name: "Frankfurt am Main Airport",
    elevation_ft: "364",
    continent: "EU",
    iso_country: "DE",
    iso_region: "DE-HE",
    municipality: "Frankfurt am Main",
    icao_code: "EDDF",
    iata_code: "FRA",
    gps_code: "EDDF",
    local_code: "",
    coordinates: "8.570556, 50.033333"
  },
  {
    ident: "EHAM",
    type: "large_airport",
    name: "Amsterdam Airport Schiphol",
    elevation_ft: "-11",
    continent: "EU",
    iso_country: "NL",
    iso_region: "NL-NH",
    municipality: "Amsterdam",
    icao_code: "EHAM",
    iata_code: "AMS",
    gps_code: "EHAM",
    local_code: "",
    coordinates: "4.768056, 52.308613"
  },
  {
    ident: "LIRF",
    type: "large_airport",
    name: "Leonardo da Vinci International Airport",
    elevation_ft: "13",
    continent: "EU",
    iso_country: "IT",
    iso_region: "IT-62",
    municipality: "Rome",
    icao_code: "LIRF",
    iata_code: "FCO",
    gps_code: "LIRF",
    local_code: "",
    coordinates: "12.238889, 41.804444"
  },
  {
    ident: "LEMD",
    type: "large_airport",
    name: "Adolfo Suárez Madrid–Barajas Airport",
    elevation_ft: "1998",
    continent: "EU",
    iso_country: "ES",
    iso_region: "ES-MD",
    municipality: "Madrid",
    icao_code: "LEMD",
    iata_code: "MAD",
    gps_code: "LEMD",
    local_code: "",
    coordinates: "-3.56264, 40.471926"
  },
  // Asian airports
  {
    ident: "RJTT",
    type: "large_airport",
    name: "Tokyo Haneda Airport",
    elevation_ft: "35",
    continent: "AS",
    iso_country: "JP",
    iso_region: "JP-13",
    municipality: "Tokyo",
    icao_code: "RJTT",
    iata_code: "HND",
    gps_code: "RJTT",
    local_code: "",
    coordinates: "139.781113, 35.552258"
  },
  {
    ident: "VHHH",
    type: "large_airport",
    name: "Hong Kong International Airport",
    elevation_ft: "28",
    continent: "AS",
    iso_country: "HK",
    iso_region: "HK-U-A",
    municipality: "Hong Kong",
    icao_code: "VHHH",
    iata_code: "HKG",
    gps_code: "VHHH",
    local_code: "",
    coordinates: "113.914603, 22.308919"
  }
];

// Load airport data (using expanded sample data for now)
let _AIRPORTS: AirportEntry[] | null = null;
export const getAirportDatabase = (): AirportEntry[] => {
  if (!_AIRPORTS) {
    _AIRPORTS = SAMPLE_AIRPORTS;
    console.log(`Loaded ${_AIRPORTS.length} airports into database`);
  }
  return _AIRPORTS;
};

// Simple fuzzy search (matches substring anywhere in ICAO, IATA, name, municipality, or gps_code)
export function searchAirports(query: string, maxResults = 10): AirportEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  
  const airports = getAirportDatabase();
  console.log(`Searching for "${q}" in ${airports.length} airports`);
  
  const results = airports.filter(a => (
    a.icao_code.toLowerCase().includes(q) ||
    a.iata_code.toLowerCase().includes(q) ||
    a.name.toLowerCase().includes(q) ||
    a.municipality.toLowerCase().includes(q) ||
    a.gps_code.toLowerCase().includes(q)
  )).slice(0, maxResults);
  
  console.log(`Found ${results.length} matching airports`);
  return results;
}

// Find single airport by exact code (ICAO or IATA)
export function findAirportByCode(input: string): AirportEntry | undefined {
  const code = input.trim().toUpperCase();
  const airports = getAirportDatabase();
  
  const result = airports.find(a =>
    a.icao_code.toUpperCase() === code ||
    a.iata_code.toUpperCase() === code
  );
  
  console.log(`Looking for airport with code "${code}":`, result ? result.name : 'Not found');
  return result;
}
