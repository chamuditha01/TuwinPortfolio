import { NextResponse } from 'next/server';
import { fetchWorkbook, getSheetRows } from '@/lib/sheet';

const SHEET_NAME = 'CompetencyBlueprint';

export const dynamic = 'force-dynamic';

export async function GET() {
  let workbook;
  try {
    workbook = await fetchWorkbook();
  } catch {
    return NextResponse.json({ error: 'Failed to fetch competency blueprint sheet' }, { status: 502 });
  }

  const rows = getSheetRows<{ blueprints?: unknown }>(workbook, SHEET_NAME);

  const points = rows
    .map((row) => String(row.blueprints ?? '').trim())
    .filter(Boolean);

  return NextResponse.json({ points });
}
