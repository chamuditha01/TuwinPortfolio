import { NextResponse } from 'next/server';
import { fetchWorkbook, getSheetRows } from '@/lib/sheet';

const SHEET_NAME = 'Gallery';

export const dynamic = 'force-dynamic';

function toLabel(columnName: string): string {
  return columnName
    .trim()
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export async function GET() {
  let workbook;
  try {
    workbook = await fetchWorkbook();
  } catch {
    return NextResponse.json({ error: 'Failed to fetch gallery sheet' }, { status: 502 });
  }

  const rows = getSheetRows<Record<string, unknown>>(workbook, SHEET_NAME);

  // Every column in the sheet becomes its own gallery category, in column order.
  const columnNames: string[] = [];
  for (const row of rows) {
    for (const key of Object.keys(row)) {
      if (!columnNames.includes(key)) columnNames.push(key);
    }
  }

  const categories = columnNames.map((key) => ({
    key,
    label: toLabel(key),
    images: rows
      .map((row) => String(row[key] ?? '').trim())
      .filter(Boolean),
  }));

  return NextResponse.json({ categories });
}
