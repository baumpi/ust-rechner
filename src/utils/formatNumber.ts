const formatter = new Intl.NumberFormat('de-AT', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Format a number in Austrian locale: 1.234,56
 */
export function formatEuro(value: number): string {
  return formatter.format(value);
}

/**
 * Parse Austrian-format input string to number.
 * Accepts: "1234,56" or "1.234,56" or "1234.56" or "1234" or "1 000"
 * Returns null for invalid input.
 */
export function parseInput(input: string): number | null {
  const trimmed = input.trim();
  if (trimmed === '' || trimmed === ',' || trimmed === '.') return null;

  // Remove dots, spaces, and non-breaking spaces (thousands separators), replace comma with period
  const cleaned = trimmed
    .replace(/[\s\u00A0]/g, '')  // spaces & non-breaking spaces
    .replace(/\./g, '')          // dots (thousands sep)
    .replace(',', '.');          // comma → decimal point
  const num = parseFloat(cleaned);

  if (isNaN(num) || num < 0) return null;
  return num;
}

/**
 * Format a number as a simple string for the input field (dot thousands, comma decimal).
 */
export function formatForInput(value: number): string {
  // Use dot as thousands separator for input field compatibility
  return value.toLocaleString('de-DE'); // "1.000" not "1 000"
}

/**
 * Validate and clean input as the user types.
 * Allows digits, commas, dots — blocks letters and special chars.
 */
export function sanitizeInput(value: string): string {
  // Allow only digits, comma, dot
  return value.replace(/[^\d.,]/g, '');
}
