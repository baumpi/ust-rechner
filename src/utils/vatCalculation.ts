export type VatRate = 20 | 13 | 10;
export type Direction = 'brutto-to-netto' | 'netto-to-brutto';

export interface VatResult {
  netto: number;
  ust: number;
  brutto: number;
}

export const VAT_RATES: VatRate[] = [20, 13, 10];

export const RATE_LABELS: Record<VatRate, string> = {
  20: 'Standard',
  13: 'Ermäßigt',
  10: 'Ermäßigt',
};

export function calculateVat(
  amount: number,
  rate: VatRate,
  direction: Direction
): VatResult {
  const factor = rate / 100;

  if (direction === 'brutto-to-netto') {
    const netto = amount / (1 + factor);
    const ust = amount - netto;
    return {
      netto: roundCents(netto),
      ust: roundCents(ust),
      brutto: roundCents(amount),
    };
  } else {
    const ust = amount * factor;
    const brutto = amount + ust;
    return {
      netto: roundCents(amount),
      ust: roundCents(ust),
      brutto: roundCents(brutto),
    };
  }
}

function roundCents(value: number): number {
  return Math.round(value * 100) / 100;
}
