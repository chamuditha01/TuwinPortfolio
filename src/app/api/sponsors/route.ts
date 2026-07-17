import { NextResponse } from 'next/server';
import { fetchWorkbook, getSheetRows } from '@/lib/sheet';

const SHEET_NAME = 'Sponsors';

export const dynamic = 'force-dynamic';

export async function GET() {
  let workbook;
  try {
    workbook = await fetchWorkbook();
  } catch {
    return NextResponse.json({ error: 'Failed to fetch sponsors sheet' }, { status: 502 });
  }

  const rows = getSheetRows<{ Name?: unknown; Image_Url?: unknown; Status?: unknown; Description?: unknown }>(workbook, SHEET_NAME);

  const sponsors = rows
    .map((row) => ({
      name: String(row.Name ?? '').trim(),
      imageUrl: String(row.Image_Url ?? '').trim(),
      status: String(row.Status ?? '').trim().toLowerCase(),
      description: String(row.Description ?? '').trim(),
    }))
    .filter((sponsor) => sponsor.imageUrl);

  return NextResponse.json({ sponsors });
}
