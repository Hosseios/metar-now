
import airportCSV from "../assets/airports.csv";

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

// Parse CSV to array of objects (very simple CSV parser)
function parseCSV(csv: string): AirportEntry[] {
  const [header, ...rows] = csv.split("\n").map(line => line.trim()).filter(Boolean);
  const keys = header.split(",");
  return rows.map(row => {
    const values = row.split(",");
    const entry: any = {};
    keys.forEach((key, i) => { entry[key] = values[i] ?? ""; });
    return entry as AirportEntry;
  });
}

// Load and preprocess data at runtime (note: you may want to memoize or optimize this for larger CSVs)
let _AIRPORTS: AirportEntry[] | null = null;
export const getAirportDatabase = (): AirportEntry[] => {
  if (!_AIRPORTS) {
    _AIRPORTS = parseCSV(airportCSV);
  }
  return _AIRPORTS;
};

// Simple fuzzy search (matches substring anywhere in ICAO, IATA, name, municipality, or gps_code)
export function searchAirports(query: string, maxResults = 10): AirportEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const airports = getAirportDatabase();
  return airports.filter(a => (
    a.icao_code.toLowerCase().includes(q)
    || a.iata_code.toLowerCase().includes(q)
    || a.name.toLowerCase().includes(q)
    || a.municipality.toLowerCase().includes(q)
    || a.gps_code.toLowerCase().includes(q)
  )).slice(0, maxResults);
}

// Find single airport by exact code (ICAO or IATA)
export function findAirportByCode(input: string): AirportEntry | undefined {
  const code = input.trim().toUpperCase();
  const airports = getAirportDatabase();
  return airports.find(a =>
    a.icao_code.toUpperCase() === code ||
    a.iata_code.toUpperCase() === code
  );
}
