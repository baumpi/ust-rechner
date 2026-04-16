import { useMemo } from 'react';
import { calculateVat, type VatRate, type Direction, type VatResult } from '../utils/vatCalculation';
import { parseInput } from '../utils/formatNumber';

export function useVatCalculation(
  inputValue: string,
  rate: VatRate,
  direction: Direction
): VatResult | null {
  return useMemo(() => {
    const amount = parseInput(inputValue);
    if (amount === null || amount === 0) return null;
    return calculateVat(amount, rate, direction);
  }, [inputValue, rate, direction]);
}
