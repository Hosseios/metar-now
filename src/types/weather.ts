
export interface WeatherData {
  metar: string;
  taf: string;
  airport: string;
  notam: string;
}

export interface DataFetchResult {
  data: string;
  error: string | null;
}

export interface NotamItem {
  id: string;
  type: 'A' | 'B' | 'H' | 'J' | 'V';
  category: 'critical' | 'operational' | 'informational';
  text: string;
  effectiveDate?: string;
  expiryDate?: string;
  createdDate?: string;
}
