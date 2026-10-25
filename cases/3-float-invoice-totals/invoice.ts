// The bug: money as floats. 0.1 + 0.2 = 0.30000000000000004, and
// toFixed() rounds half-to-even-ish on binary artifacts, so invoice
// totals drift by cents and line items stop matching the grand total.
export type Line = { qty: number; unitPrice: number }; // dollars as float

export function invoiceTotalBuggy(lines: Line[]): string {
  const sum = lines.reduce((acc, l) => acc + l.qty * l.unitPrice, 0);
  return `$${sum.toFixed(2)}`;
}

// The fix: integer cents everywhere; format only at the edges.
export type LineCents = { qty: number; unitPriceCents: number };

export function toCents(dollars: number): number {
  return Math.round(dollars * 100);
}

export function invoiceTotal(lines: LineCents[]): string {
  const cents = lines.reduce((acc, l) => acc + l.qty * l.unitPriceCents, 0);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}
