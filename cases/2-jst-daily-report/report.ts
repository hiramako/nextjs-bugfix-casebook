// The bug: a JST business report grouped by the UTC date string.
// Anything sold between 00:00 and 08:59 JST sits on the PREVIOUS UTC day,
// so night sales silently shift into yesterday's bucket. `toISOString()`
// is a UTC string — it has no idea the office runs on Asia/Tokyo.
export type Sale = { at: Date; amountCents: number };

export function dailyTotalsBuggy(sales: Sale[]): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const s of sales) {
    const day = s.at.toISOString().slice(0, 10); // UTC day, silently wrong for JST
    totals[day] = (totals[day] ?? 0) + s.amountCents;
  }
  return totals;
}

// The fix: bucket by the business timezone with Intl (no date lib needed).
const dayInJst = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Tokyo',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

export function dailyTotals(sales: Sale[], timeZone = 'Asia/Tokyo'): Record<string, number> {
  const fmt = timeZone === 'Asia/Tokyo'
    ? dayInJst
    : new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' });
  const totals: Record<string, number> = {};
  for (const s of sales) {
    const day = fmt.format(s.at); // "YYYY-MM-DD" in the office's calendar
    totals[day] = (totals[day] ?? 0) + s.amountCents;
  }
  return totals;
}
