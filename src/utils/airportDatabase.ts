// Define the shape of each airport entry
export interface AirportEntry {
  ident: string; // Primary ICAO code (most reliable)
  type: string;
  name: string;
  elevation_ft: string;
  continent: string;
  iso_country: string;
  iso_region: string;
  municipality: string;
  icao_code: string; // Secondary ICAO field (may have parsing issues)
  iata_code: string;
  gps_code: string;
  local_code: string;
  coordinates: string;
}

// Proper CSV parser that handles quoted fields with commas
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  let i = 0;

  while (i < line.length) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Handle escaped quotes ""
        current += '"';
        i += 2;
        continue;
      }
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
    i++;
  }
  
  result.push(current.trim());
  return result;
}

// Parse CSV to array of objects
function parseCSV(csvText: string): AirportEntry[] {
  const lines = csvText.trim().split('\n');
  const airports: AirportEntry[] = [];
  
  console.log(`Processing ${lines.length} lines from CSV`);
  
  for (let i = 1; i < lines.length; i++) {
    try {
      const values = parseCSVLine(lines[i]);
      
      if (values.length >= 13) {
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
        
        // Use ident as primary ICAO validation (should be 4 characters for airports)
        if (airport.ident && airport.ident.length === 4) {
          airports.push(airport);
        } else {
          console.log(`Skipping airport with invalid ident: "${airport.ident}" for ${airport.name}`);
        }
      } else {
        console.log(`Skipping line ${i + 1}: insufficient fields (${values.length})`);
      }
    } catch (error) {
      console.log(`Error parsing line ${i + 1}:`, error);
    }
  }
  
  console.log(`Successfully parsed ${airports.length} airports from CSV`);
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

// Updated search function using ident as primary ICAO field
export async function searchAirports(query: string, maxResults = 10): Promise<AirportEntry[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  
  const airports = await getAirportDatabase();
  console.log(`Searching for "${q}" in ${airports.length} airports`);
  
  const results = airports.filter(a => (
    a.ident.toLowerCase().includes(q) ||           // Primary ICAO search
    a.iata_code.toLowerCase().includes(q) ||
    a.name.toLowerCase().includes(q) ||
    a.municipality.toLowerCase().includes(q) ||
    a.icao_code.toLowerCase().includes(q) ||       // Fallback ICAO search
    a.gps_code.toLowerCase().includes(q)
  )).slice(0, maxResults);
  
  console.log(`Found ${results.length} matching airports`);
  return results;
}

// Updated find function using ident as primary ICAO field
export async function findAirportByCode(input: string): Promise<AirportEntry | undefined> {
  const code = input.trim().toUpperCase();
  const airports = await getAirportDatabase();
  
  // First try ident (primary ICAO), then IATA, then fallback icao_code
  const result = airports.find(a =>
    a.ident.toUpperCase() === code ||
    a.iata_code.toUpperCase() === code ||
    a.icao_code.toUpperCase() === code
  );
  
  if (result) {
    console.log(`Found airport with code "${code}": ${result.name} (ICAO: ${result.ident})`);
  } else {
    console.log(`No airport found with code "${code}"`);
  }
  
  return result;
}
