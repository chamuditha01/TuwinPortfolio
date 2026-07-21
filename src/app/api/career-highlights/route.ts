import { NextResponse } from 'next/server';
import { fetchWorkbook, getSheetRows } from '@/lib/sheet';

const SHEET_NAME = 'CareerHighlights';

export const dynamic = 'force-dynamic';

export async function GET() {
  let workbook;
  try {
    workbook = await fetchWorkbook();
  } catch {
    return NextResponse.json({ error: 'Failed to fetch career highlights sheet' }, { status: 502 });
  }

  const rows = getSheetRows<{
    year?: unknown;
    title?: unknown;
    description?: unknown;
    tag?: unknown;
    icon?: unknown;
  }>(workbook, SHEET_NAME);

  const highlights = rows
    .map((row) => ({
      year: String(row.year ?? '').trim(),
      title: String(row.title ?? '').trim(),
      description: String(row.description ?? '').trim(),
      tag: String(row.tag ?? '').trim(),
      icon: String(row.icon ?? '').trim(),
    }))
    .filter((h) => h.year && h.title);

  return NextResponse.json({ highlights });
}
