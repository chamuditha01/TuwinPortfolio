import { NextResponse } from 'next/server';
import { fetchWorkbook, getSheetRows } from '@/lib/sheet';

const SHEET_NAME = 'CareerAchievements';

export const dynamic = 'force-dynamic';

export async function GET() {
  let workbook;
  try {
    workbook = await fetchWorkbook();
  } catch {
    return NextResponse.json({ error: 'Failed to fetch career achievements sheet' }, { status: 502 });
  }

  const rows = getSheetRows<{
    Title?: unknown;
    heading?: unknown;
    description?: unknown;
    footer?: unknown;
  }>(workbook, SHEET_NAME);

  const achievements = rows
    .map((row) => ({
      title: String(row.Title ?? '').trim(),
      heading: String(row.heading ?? '').trim(),
      description: String(row.description ?? '').trim(),
      footer: String(row.footer ?? '').trim(),
    }))
    .filter((a) => a.title || a.heading);

  return NextResponse.json({ achievements });
}
