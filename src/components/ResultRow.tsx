import { useState, useCallback } from 'react';
import { formatEuro } from '../utils/formatNumber';
import { copyToClipboard } from '../utils/clipboard';

interface ResultRowProps {
  label: string;
  value: number;
  isHighlighted?: boolean;
  sublabel?: string;
  onTapValue?: (formattedValue: string) => void;
}

export function ResultRow({ label, value, isHighlighted = false, sublabel, onTapValue }: ResultRowProps) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);

  const handleCopy = useCallback(() => {
    // Synchronous call — preserves iOS Safari user-gesture context
    const ok = copyToClipboard(formatEuro(value));
    if (ok) {
      setCopied(true);
      if (navigator.vibrate) navigator.vibrate(8);
      setTimeout(() => setCopied(false), 1500);
    } else {
      setError(true);
      setTimeout(() => setError(false), 1500);
    }
  }, [value]);

  const handleTapValue = () => {
    if (onTapValue) {
      onTapValue(formatEuro(value));
      if (navigator.vibrate) navigator.vibrate(8);
    }
  };

  return (
    <div className="flex items-center justify-between py-3 px-1 group gap-2">
      <div className="flex flex-col min-w-0">
        <span
          className={`font-human text-sm font-medium
            ${isHighlighted ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}
        >
          {label}
        </span>
        {sublabel && (
          <span className="text-[10px] font-tech text-[var(--text-muted)]">
            {sublabel}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1">
        {/* Tappable value — tap to reuse as input */}
        <button
          onClick={handleTapValue}
          className={`font-tech tabular-nums text-right px-2 py-1 rounded-lg
                     transition-colors duration-150 active:scale-95
                     hover:bg-[var(--overlay-light)]
                     ${
                       isHighlighted
                         ? 'text-lg font-bold text-[var(--color-accent-text)]'
                         : 'text-base font-medium text-[var(--text-primary)]'
                     }`}
          title="Tippen, um als Eingabe zu verwenden"
        >
          € {formatEuro(value)}
        </button>

        {/* Copy button — always visible on mobile, 40px touch target */}
        <button
          onClick={handleCopy}
          className={`min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg
                     transition-all duration-150 flex-shrink-0 active:scale-90
                     ${copied
                       ? 'bg-[var(--color-accent-light)] text-[var(--color-accent)]'
                       : error
                         ? 'bg-red-500/10 text-red-500'
                         : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--overlay-light)]'}`}
          aria-label={`${label} kopieren`}
        >
          {copied ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : error ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
