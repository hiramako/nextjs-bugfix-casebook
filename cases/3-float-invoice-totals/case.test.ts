import { describe, it, expect } from 'vitest';
import { invoiceTotalBuggy, invoiceTotal, toCents, type Line, type LineCents } from './invoice';

// 3 x $0.10 + 1 x $20.10 -> $20.40
const floatLines: Line[] = [
  { qty: 3, unitPrice: 0.1 },
  { qty: 1, unitPrice: 20.1 },
];
const centLines: LineCents[] = [
  { qty: 3, unitPriceCents: toCents(0.1) },
  { qty: 1, unitPriceCents: toCents(20.1) },
];

describe('invoice totals', () => {
  it('float arithmetic really does drift (the bug is not hypothetical)', () => {
    const raw = floatLines.reduce((a, l) => a + l.qty * l.unitPrice, 0);
    expect(raw === 20.4).toBe(false); // binary float artifact
  });

  it('integer cents produce the exact total', () => {
    expect(invoiceTotal(centLines)).toBe('$20.40');
  });

  it('subtotal of parts always equals the grand total', () => {
    const parts = centLines.map((l) => l.qty * l.unitPriceCents);
    const sum = parts.reduce((a, b) => a + b, 0);
    expect(invoiceTotal([{ qty: 1, unitPriceCents: sum }])).toBe(invoiceTotal(centLines));
  });
});
