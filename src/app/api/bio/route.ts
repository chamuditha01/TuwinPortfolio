import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { fetchWorkbook, getSheetRows } from '@/lib/sheet';

const SHEET_NAME = 'Bio';

export const dynamic = 'force-dynamic';

function excelDateToLabel(value: unknown): string {
  if (typeof value === 'number') {
    const parsed = XLSX.SSF.parse_date_code(value);
    if (!parsed) return '';
    const date = new Date(parsed.y, parsed.m - 1, parsed.d);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }
  if (typeof value === 'string' && value.trim()) {
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }
  }
  return '';
}

export async function GET() {
  let workbook;
  try {
    workbook = await fetchWorkbook();
  } catch {
    return NextResponse.json({ error: 'Failed to fetch bio sheet' }, { status: 502 });
  }

  const rows = getSheetRows<{ Name?: unknown; Birthday?: unknown; 'World Rank'?: unknown; Age?: unknown; Description?: unknown }>(workbook, SHEET_NAME);
  const row = rows[0];

  if (!row) {
    return NextResponse.json({ error: 'No bio data found' }, { status: 404 });
  }

  return NextResponse.json({
    name: String(row.Name ?? '').trim(),
    birthday: excelDateToLabel(row.Birthday),
    worldRank: String(row['World Rank'] ?? '').trim(),
    age: String(row.Age ?? '').trim(),
    description: String(row.Description ?? '').trim(),
  });
}
