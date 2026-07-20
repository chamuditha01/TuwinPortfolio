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

  // Each coach starts on a row with a Name; subsequent blank-Name rows
  // each contribute one more bullet point to that coach's Profile list.
  const coaches: { name: string; profile: string[]; biography: string; imageUrl: string }[] = [];

  for (const row of rows) {
    const name = String(row.Name ?? '').trim();
    const profilePoint = String(row.Profile ?? '').trim();

    if (name) {
      coaches.push({
        name,
        profile: profilePoint ? [profilePoint] : [],
        biography: String(row.Biography ?? '').trim(),
        imageUrl: String(row['Image Url'] ?? '').trim(),
      });
    } else if (profilePoint && coaches.length > 0) {
      coaches[coaches.length - 1].profile.push(profilePoint);
    }
  }

  return NextResponse.json({ coaches });
}
