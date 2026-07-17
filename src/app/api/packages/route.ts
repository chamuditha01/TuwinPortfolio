import { NextResponse } from 'next/server';
import { fetchWorkbook, getSheetRows } from '@/lib/sheet';

const SHEET_NAME = 'Packages';

export const dynamic = 'force-dynamic';

export async function GET() {
  let workbook;
  try {
    workbook = await fetchWorkbook();
  } catch {
    return NextResponse.json({ error: 'Failed to fetch packages sheet' }, { status: 502 });
  }

  const rows = getSheetRows<{
    'Tier Name'?: unknown;
    Title?: unknown;
    Price?: unknown;
    Benefits?: unknown;
    Image_Set?: unknown;
  }>(workbook, SHEET_NAME);

  const packages = rows
    .map((row) => ({
      tierName: String(row['Tier Name'] ?? '').trim(),
      title: String(row.Title ?? '').trim(),
      price: String(row.Price ?? '').trim(),
      benefits: String(row.Benefits ?? '')
        .split('\n')
        .map((b) => b.trim())
        .filter(Boolean),
      images: String(row.Image_Set ?? '')
        .split(',')
        .map((i) => i.trim())
        .filter(Boolean),
    }))
    .filter((pkg) => pkg.tierName);

  return NextResponse.json({ packages });
}
