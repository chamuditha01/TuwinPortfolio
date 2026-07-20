import { NextResponse } from 'next/server';
import { fetchWorkbook, getSheetRows } from '@/lib/sheet';

const SHEET_NAME = 'Contact';

export const dynamic = 'force-dynamic';

export async function GET() {
  let workbook;
  try {
    workbook = await fetchWorkbook();
  } catch {
    return NextResponse.json({ error: 'Failed to fetch contact sheet' }, { status: 502 });
  }

  const rows = getSheetRows<{
    Locations?: unknown;
    email?: unknown;
    'phone numbers'?: unknown;
  }>(workbook, SHEET_NAME);

  const row = rows[0];

  const contact = {
    locations: String(row?.Locations ?? '').trim(),
    email: String(row?.email ?? '').trim(),
    phoneNumbers: String(row?.['phone numbers'] ?? '')
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean),
  };

  return NextResponse.json({ contact });
}
