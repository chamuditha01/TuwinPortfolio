import { NextResponse } from 'next/server';
import { fetchWorkbook, getSheetRows } from '@/lib/sheet';

const SHEET_NAME = 'UpcomingTournaments';

export const dynamic = 'force-dynamic';

export async function GET() {
  let workbook;
  try {
    workbook = await fetchWorkbook();
  } catch {
    return NextResponse.json({ error: 'Failed to fetch tournaments sheet' }, { status: 502 });
  }

  const rows = getSheetRows<{
    Name?: unknown;
    Venue?: unknown;
    'Tournament Size'?: unknown;
    'Start Date'?: unknown;
    'End Date'?: unknown;
    'Tournament Category'?: unknown;
    'Finished Position'?: unknown;
    Status?: unknown;
    logo?: unknown;
  }>(workbook, SHEET_NAME);

  const tournaments = rows
    .map((row) => ({
      name: String(row.Name ?? '').trim(),
      venue: String(row.Venue ?? '').trim(),
      tournamentSize: String(row['Tournament Size'] ?? '').trim(),
      startDate: String(row['Start Date'] ?? '').trim(),
      endDate: String(row['End Date'] ?? '').trim(),
      category: String(row['Tournament Category'] ?? '').trim(),
      finishedPosition: String(row['Finished Position'] ?? '').trim(),
      status: String(row.Status ?? '').trim(),
      logos: String(row.logo ?? '')
        .split(',')
        .map((l) => l.trim())
        .filter(Boolean),
    }))
    .filter((t) => t.name);

  return NextResponse.json({ tournaments });
}
