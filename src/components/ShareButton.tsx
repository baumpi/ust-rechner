import type { VatResult, VatRate, Direction } from '../utils/vatCalculation';
import { formatEuro } from '../utils/formatNumber';
import { useState } from 'react';

interface ShareButtonProps {
  result: VatResult;
  rate: VatRate;
  direction: Direction;
}

export function ShareButton({ result, rate, direction }: ShareButtonProps) {
  const [shared, setShared] = useState(false);

  const handleShare = async () => {
    const isBrutto = direction === 'brutto-to-netto';
    const text = [
      `USt-Rechner (${rate}%)`,
      `Netto:  € ${formatEuro(result.netto)}`,
      `${rate}% USt: € ${formatEuro(result.ust)}`,
      `Brutto: € ${formatEuro(result.brutto)}`,
      '',
      isBrutto ? '(Brutto → Netto)' : '(Netto → Brutto)',
    ].join('\n');

    if (navigator.share) {
      try {
        await navigator.share({ text });
        return;
      } catch {
        // User cancelled or not supported — fall through to clipboard
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(text);
      setShared(true);
      if (navigator.vibrate) navigator.vibrate(5);
      setTimeout(() => setShared(false), 1500);
    } catch {
      // Silently fail
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg
                 bg-[var(--overlay-light)] hover:bg-[var(--overlay-medium)]
                 active:scale-[0.98] transition-all duration-200
                 text-sm font-human font-medium text-[var(--text-secondary)]
                 hover:text-[var(--text-primary)]"
    >
      {shared ? (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span className="text-[var(--color-accent-text)]">Kopiert!</span>
        </>
      ) : (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          Ergebnis teilen
        </>
      )}
    </button>
  );
}
