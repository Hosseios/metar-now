
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

// Sample airport data - you can expand this with your full dataset
const SAMPLE_AIRPORTS: AirportEntry[] = [
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
  }
];

// Load airport data (using sample data for now)
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
