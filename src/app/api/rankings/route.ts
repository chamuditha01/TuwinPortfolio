import { NextResponse } from 'next/server';
import { fetchWorkbook, getSheetRows } from '@/lib/sheet';

const SHEET_NAME = 'Rankings';

export const dynamic = 'force-dynamic';

export async function GET() {
  let workbook;
  try {
    workbook = await fetchWorkbook();
  } catch {
    return NextResponse.json({ error: 'Failed to fetch rankings sheet' }, { status: 502 });
  }

  const rows = getSheetRows<{
    date?: unknown;
    ranking?: unknown;
  }>(workbook, SHEET_NAME);

  const rankings = rows
    .map((row) => ({
      date: String(row.date ?? '').trim(),
      ranking: Number(row.ranking),
    }))
    .filter((r) => r.date && Number.isFinite(r.ranking))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return NextResponse.json({ rankings });
}
