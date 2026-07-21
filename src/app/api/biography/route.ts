import { NextResponse } from 'next/server';
import { fetchWorkbook, getSheetRows } from '@/lib/sheet';

const SHEET_NAME = 'Biograpahy';

export const dynamic = 'force-dynamic';

export async function GET() {
  let workbook;
  try {
    workbook = await fetchWorkbook();
  } catch {
    return NextResponse.json({ error: 'Failed to fetch biography sheet' }, { status: 502 });
  }

  const rows = getSheetRows<{
    description?: unknown;
    Title?: unknown;
    Heading?: unknown;
    Description?: unknown;
  }>(workbook, SHEET_NAME);

  const description = rows
    .map((row) => String(row.description ?? '').trim())
    .find(Boolean) ?? '';

  const highlights = rows
    .map((row) => ({
      title: String(row.Title ?? '').trim(),
      heading: String(row.Heading ?? '').trim(),
      description: String(row.Description ?? '').trim(),
    }))
    .filter((h) => h.title || h.heading);

  return NextResponse.json({ description, highlights });
}
