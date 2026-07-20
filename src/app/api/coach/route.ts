import { NextResponse } from 'next/server';
import { fetchWorkbook, getSheetRows } from '@/lib/sheet';

const SHEET_NAME = 'Coach&Club';

export const dynamic = 'force-dynamic';

export async function GET() {
  let workbook;
  try {
    workbook = await fetchWorkbook();
  } catch {
    return NextResponse.json({ error: 'Failed to fetch coach sheet' }, { status: 502 });
  }

  const rows = getSheetRows<{
    Name?: unknown;
    Profile?: unknown;
    Biography?: unknown;
    'Image Url'?: unknown;
  }>(workbook, SHEET_NAME);

  const coaches = rows
    .map((row) => ({
      name: String(row.Name ?? '').trim(),
      profile: String(row.Profile ?? '')
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean),
      biography: String(row.Biography ?? '').trim(),
      imageUrl: String(row['Image Url'] ?? '').trim(),
    }))
    .filter((c) => c.name);

  return NextResponse.json({ coaches });
}
