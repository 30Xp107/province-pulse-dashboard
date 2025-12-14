import { useState, useEffect, useCallback } from 'react';
import { ProvinceData, MunicipalityData } from '@/data/provinceData';

const SHEET_ID = '1nnv1x3KqtD990twWE0YdSa-ym6scyOazezKOkm_jVBg';
const REFRESH_INTERVAL = 30000; // 30 seconds

// Sheet GIDs - Update these based on your actual Google Sheet tab GIDs
// To find a GID: Click on each sheet tab and look at the URL for "gid=XXXX"
export const PROVINCE_SHEETS = {
  iloilo: { name: 'Iloilo', gid: 0 },
  antique: { name: 'Antique', gid: 476288213 },
  capiz: { name: 'Capiz', gid: 369889311 },
  nir: { name: 'NIR (Occidental)', gid: 937247947 },
} as const;

export type ProvinceKey = keyof typeof PROVINCE_SHEETS;

interface AllProvincesData {
  provinces: Record<ProvinceKey, ProvinceData>;
  combined: ProvinceData;
}

interface UseGoogleSheetDataResult {
  data: AllProvincesData | null;
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

async function fetchSheetData(gid: number, provinceName: string): Promise<ProvinceData> {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${gid}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${provinceName} data: ${response.statusText}`);
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
    
    // Skip empty rows, header rows, or total rows
    if (lgu && 
        lgu.toUpperCase() !== 'TOTAL' && 
        lgu.toUpperCase() !== 'LGU' &&
        !lgu.toUpperCase().includes('GRAND TOTAL')) {
      municipalities.push({
        municipality: lgu,
        target,
        systemResult,
        systemVariance,
      });
    }
  }
  
  const grandTotal = municipalities.reduce(
    (acc, m) => ({
      municipality: 'Grand Total',
      target: acc.target + m.target,
      systemResult: acc.systemResult + m.systemResult,
      systemVariance: acc.systemVariance + m.systemVariance,
    }),
    { municipality: 'Grand Total', target: 0, systemResult: 0, systemVariance: 0 }
  );
  
  return {
    name: provinceName,
    municipalities,
    grandTotal,
  };
}

function calculateCombinedData(provinces: Record<ProvinceKey, ProvinceData>): ProvinceData {
  const allMunicipalities: MunicipalityData[] = Object.entries(provinces).map(([key, province]) => ({
    municipality: province.name,
    target: province.grandTotal.target,
    systemResult: province.grandTotal.systemResult,
    systemVariance: province.grandTotal.systemVariance,
  }));

  const grandTotal = allMunicipalities.reduce(
    (acc, m) => ({
      municipality: 'Grand Total',
      target: acc.target + m.target,
      systemResult: acc.systemResult + m.systemResult,
      systemVariance: acc.systemVariance + m.systemVariance,
    }),
    { municipality: 'Grand Total', target: 0, systemResult: 0, systemVariance: 0 }
  );

  return {
    name: 'All Provinces',
    municipalities: allMunicipalities,
    grandTotal,
  };
}

export function useGoogleSheetData(): UseGoogleSheetDataResult {
  const [data, setData] = useState<AllProvincesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all provinces in parallel
      const provinceEntries = Object.entries(PROVINCE_SHEETS) as [ProvinceKey, typeof PROVINCE_SHEETS[ProvinceKey]][];
      
      const results = await Promise.allSettled(
        provinceEntries.map(([key, { name, gid }]) => 
          fetchSheetData(gid, name).then(data => ({ key, data }))
        )
      );
      
      const provinces = {} as Record<ProvinceKey, ProvinceData>;
      const errors: string[] = [];
      
      for (const result of results) {
        if (result.status === 'fulfilled') {
          provinces[result.value.key] = result.value.data;
        } else {
          errors.push(result.reason?.message || 'Unknown error');
        }
      }
      
      // Only proceed if we have at least one province
      if (Object.keys(provinces).length === 0) {
        throw new Error('Failed to fetch any province data');
      }
      
      const combined = calculateCombinedData(provinces);
      
      setData({ provinces, combined });
      setLastUpdated(new Date());
      
      if (errors.length > 0) {
        setError(`Some data failed to load: ${errors.join(', ')}`);
      }
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
