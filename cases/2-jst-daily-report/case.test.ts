import { describe, it, expect } from 'vitest';
import { dailyTotalsBuggy, dailyTotals, type Sale } from './report';

const sales: Sale[] = [
  { at: new Date('2026-10-24T23:30:00+09:00'), amountCents: 1200 }, // Oct 24 in JST
  { at: new Date('2026-10-25T00:10:00+09:00'), amountCents: 800 },  // Oct 25 in JST
  { at: new Date('2026-10-24T10:00:00+09:00'), amountCents: 500 },  // Oct 24 in JST
];

describe('JST daily report', () => {
  it.fails('buggy version: evening sales shift to the next UTC day', () => {
    expect(dailyTotalsBuggy(sales)).toEqual({
      '2026-10-24': 1700,
      '2026-10-25': 800,
    });
  });

  it('fixed version: sales land on their JST calendar day', () => {
    expect(dailyTotals(sales)).toEqual({
      '2026-10-24': 1700,
      '2026-10-25': 800,
    });
  });
});
