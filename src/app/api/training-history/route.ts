import { NextResponse } from 'next/server';
import { fetchWorkbook, getSheetRows } from '@/lib/sheet';

const SHEET_NAME = 'TrainingHistory';

export const dynamic = 'force-dynamic';

export async function GET() {
  let workbook;
  try {
    workbook = await fetchWorkbook();
  } catch {
    return NextResponse.json({ error: 'Failed to fetch training history sheet' }, { status: 502 });
  }

  const rows = getSheetRows<{
    title?: unknown;
    heading?: unknown;
    description?: unknown;
  }>(workbook, SHEET_NAME);

  const trainingHistory = rows
    .map((row) => ({
      title: String(row.title ?? '').trim(),
      heading: String(row.heading ?? '').trim(),
      description: String(row.description ?? '').trim(),
    }))
    .filter((t) => t.title || t.heading);

  return NextResponse.json({ trainingHistory });
}
