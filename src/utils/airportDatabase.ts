
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

// Parse CSV to array of objects
function parseCSV(csvText: string): AirportEntry[] {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
  
  const airports: AirportEntry[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.replace(/"/g, '').trim());
    
    if (values.length >= headers.length) {
      const airport: AirportEntry = {
        ident: values[0] || '',
        type: values[1] || '',
        name: values[2] || '',
        elevation_ft: values[3] || '',
        continent: values[4] || '',
        iso_country: values[5] || '',
        iso_region: values[6] || '',
        municipality: values[7] || '',
        icao_code: values[8] || '',
        iata_code: values[9] || '',
        gps_code: values[10] || '',
        local_code: values[11] || '',
        coordinates: values[12] || ''
      };
      
      // Only include airports with valid ICAO codes
      if (airport.icao_code && airport.icao_code.length >= 3) {
        airports.push(airport);
      }
    }
  }
  
  console.log(`Parsed ${airports.length} airports from CSV`);
  return airports;
}

// Load airport data from CSV
let _AIRPORTS: AirportEntry[] | null = null;

export const getAirportDatabase = async (): Promise<AirportEntry[]> => {
  if (!_AIRPORTS) {
    try {
      // Import the CSV file
      const csvModule = await import('../assets/airports.csv?raw');
      const csvText = csvModule.default;
      
      _AIRPORTS = parseCSV(csvText);
      console.log(`Loaded ${_AIRPORTS.length} airports into database`);
    } catch (error) {
      console.error('Failed to load airports CSV:', error);
      _AIRPORTS = []; // Fallback to empty array
    }
  }
  return _AIRPORTS;
};

// Simple fuzzy search (matches substring anywhere in ICAO, IATA, name, municipality, or gps_code)
export async function searchAirports(query: string, maxResults = 10): Promise<AirportEntry[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  
  const airports = await getAirportDatabase();
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
export async function findAirportByCode(input: string): Promise<AirportEntry | undefined> {
  const code = input.trim().toUpperCase();
  const airports = await getAirportDatabase();
  
  const result = airports.find(a =>
    a.icao_code.toUpperCase() === code ||
    a.iata_code.toUpperCase() === code
  );
  
  console.log(`Looking for airport with code "${code}":`, result ? result.name : 'Not found');
  return result;
}
