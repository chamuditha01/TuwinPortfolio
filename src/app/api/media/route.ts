import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { fetchWorkbook, getSheetRows } from '@/lib/sheet';

const SHEET_NAME = 'Articles';

export const dynamic = 'force-dynamic';

function excelDateToLabel(value: unknown): string {
  if (typeof value !== 'number') return '';
  const parsed = XLSX.SSF.parse_date_code(value);
  if (!parsed) return '';
  const date = new Date(parsed.y, parsed.m - 1, parsed.d);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export async function GET() {
  let workbook;
  try {
    workbook = await fetchWorkbook();
  } catch {
    return NextResponse.json({ error: 'Failed to fetch media sheet' }, { status: 502 });
  }

  const rows = getSheetRows(workbook, SHEET_NAME);

  const items = rows
    .map((row, index) => ({
      id: `media-${index}`,
      category: String(row.category ?? '').trim(),
      source: String(row.source ?? '').trim(),
      date: excelDateToLabel(row.date),
      title: String(row.title ?? '').trim(),
      description: String(row.description ?? '').trim(),
      linkText: String(row.link_text ?? '').trim(),
      url: String(row.url ?? '').trim(),
    }))
    .filter((item) => item.title && item.url);

  return NextResponse.json(items);
}
