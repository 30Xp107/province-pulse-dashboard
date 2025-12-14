import { useState, useEffect, useCallback } from 'react';
import { ProvinceData, MunicipalityData } from '@/data/provinceData';

const SHEET_ID = '1nnv1x3KqtD990twWE0YdSa-ym6scyOazezKOkm_jVBg';
const REFRESH_INTERVAL = 30000; // 30 seconds

// Sheet GIDs - you may need to update these based on your actual sheet
const SHEET_GIDS = {
  iloilo: 0, // Default sheet (gid=0)
};

interface UseGoogleSheetDataResult {
  data: ProvinceData | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => Promise<void>;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function parseNumber(value: string): number {
  const cleaned = value.replace(/[^0-9.-]/g, '');
  const num = parseInt(cleaned, 10);
  return isNaN(num) ? 0 : num;
}

async function fetchSheetData(gid: number): Promise<MunicipalityData[]> {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${gid}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch sheet data: ${response.statusText}`);
  }
  
  const csvText = await response.text();
  const lines = csvText.split('\n').filter(line => line.trim());
  
  // Skip header row
  const dataLines = lines.slice(1);
  
  const municipalities: MunicipalityData[] = [];
  
  for (const line of dataLines) {
    const columns = parseCSVLine(line);
    
    // Column mapping based on the sheet structure:
    // 0: LGU, 7: TOTAL TARGET, 8: TOTAL VALIDATED, 9: TOTAL VARIANCE
    const lgu = columns[0]?.trim();
    const target = parseNumber(columns[7] || '0');
    const systemResult = parseNumber(columns[8] || '0');
    const systemVariance = parseNumber(columns[9] || '0');
    
    // Skip empty rows or total rows
    if (lgu && lgu.toUpperCase() !== 'TOTAL' && lgu.toUpperCase() !== 'LGU') {
      municipalities.push({
        municipality: lgu,
        target,
        systemResult,
        systemVariance,
      });
    }
  }
  
  return municipalities;
}

function calculateGrandTotal(municipalities: MunicipalityData[]): MunicipalityData {
  return municipalities.reduce(
    (acc, m) => ({
      municipality: 'Grand Total',
      target: acc.target + m.target,
      systemResult: acc.systemResult + m.systemResult,
      systemVariance: acc.systemVariance + m.systemVariance,
    }),
    { municipality: 'Grand Total', target: 0, systemResult: 0, systemVariance: 0 }
  );
}

export function useGoogleSheetData(): UseGoogleSheetDataResult {
  const [data, setData] = useState<ProvinceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const municipalities = await fetchSheetData(SHEET_GIDS.iloilo);
      
      const provinceData: ProvinceData = {
        name: 'Iloilo',
        municipalities,
        grandTotal: calculateGrandTotal(municipalities),
      };
      
      setData(provinceData);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching Google Sheet data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    
    // Set up auto-refresh interval
    const intervalId = setInterval(fetchData, REFRESH_INTERVAL);
    
    return () => clearInterval(intervalId);
  }, [fetchData]);

  return { data, loading, error, lastUpdated, refresh: fetchData };
}
