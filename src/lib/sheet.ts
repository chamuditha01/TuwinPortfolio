import * as XLSX from 'xlsx';

// Full workbook export (no `gid`) so every tab (Articles, Gallery, ...) comes back in one fetch.
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1sY7_eNfVYkKDoS3SXm1ft2luVwKsN59orsIjehfV9Xs/export?format=xlsx';

export async function fetchWorkbook(): Promise<XLSX.WorkBook> {
  const res = await fetch(SHEET_URL, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error('Failed to fetch spreadsheet');
  }

  const buffer = await res.arrayBuffer();
  return XLSX.read(buffer, { type: 'array' });
}

export function getSheetRows<T = Record<string, unknown>>(workbook: XLSX.WorkBook, sheetName: string): T[] {
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) return [];
  return XLSX.utils.sheet_to_json<T>(sheet, { defval: '' });
}
