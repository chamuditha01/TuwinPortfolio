import { NextResponse } from 'next/server';
import { fetchWorkbook, getSheetRows } from '@/lib/sheet';

const SHEET_NAME = 'Gallery';

export const dynamic = 'force-dynamic';

export async function GET() {
  let workbook;
  try {
    workbook = await fetchWorkbook();
  } catch {
    return NextResponse.json({ error: 'Failed to fetch gallery sheet' }, { status: 502 });
  }

  const rows = getSheetRows<{ local?: unknown; international?: unknown }>(workbook, SHEET_NAME);

  const local = rows
    .map((row) => String(row.local ?? '').trim())
    .filter(Boolean);

  const international = rows
    .map((row) => String(row.international ?? '').trim())
    .filter(Boolean);

  return NextResponse.json({ local, international });
}
