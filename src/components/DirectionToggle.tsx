import { useState } from 'react';
import type { Direction } from '../utils/vatCalculation';

interface DirectionToggleProps {
  direction: Direction;
  onChange: (direction: Direction) => void;
}

export function DirectionToggle({ direction, onChange }: DirectionToggleProps) {
  const [isSwapping, setIsSwapping] = useState(false);

  const handleSwap = () => {
    setIsSwapping(true);

    // Haptic feedback on supported devices
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }

    onChange(
      direction === 'brutto-to-netto' ? 'netto-to-brutto' : 'brutto-to-netto'
    );

    setTimeout(() => setIsSwapping(false), 300);
  };

  const isBruttoToNetto = direction === 'brutto-to-netto';

  return (
    <button
      onClick={handleSwap}
      className="w-full flex items-center justify-between gap-3 px-4 py-3
                 bg-[var(--bg-surface)] rounded-xl border border-[var(--border)]
                 hover:border-[var(--color-accent)] hover:bg-[var(--overlay-light)]
                 active:scale-[0.98] transition-all duration-200"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex flex-col items-start min-w-0">
          <span className="text-sm font-semibold text-[var(--text-primary)] font-human">
            {isBruttoToNetto ? 'Brutto → Netto' : 'Netto → Brutto'}
          </span>
          <span className="text-[11px] text-[var(--text-muted)] font-tech">
            {isBruttoToNetto ? 'MwSt herausrechnen' : 'MwSt aufschlagen'}
          </span>
        </div>
      </div>

      {/* Swap icon */}
      <div
        className={`w-9 h-9 flex items-center justify-center rounded-lg
                    bg-[var(--color-accent-light)] text-[var(--color-accent-text)]
                    flex-shrink-0 transition-transform duration-300
                    ${isSwapping ? 'rotate-180' : ''}`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="7 3 7 21" />
          <polyline points="3 7 7 3 11 7" />
          <polyline points="17 21 17 3" />
          <polyline points="13 17 17 21 21 17" />
        </svg>
      </div>
    </button>
  );
}
