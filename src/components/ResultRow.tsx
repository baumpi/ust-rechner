import { useState, useCallback } from 'react';
import { formatEuro } from '../utils/formatNumber';

interface ResultRowProps {
  label: string;
  value: number;
  isHighlighted?: boolean;
  sublabel?: string;
  onTapValue?: (formattedValue: string) => void;
}

export function ResultRow({ label, value, isHighlighted = false, sublabel, onTapValue }: ResultRowProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(formatEuro(value));
      setCopied(true);
      if (navigator.vibrate) navigator.vibrate(5);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // Silently fail
    }
  }, [value]);

  const handleTapValue = () => {
    if (onTapValue) {
      onTapValue(formatEuro(value));
      if (navigator.vibrate) navigator.vibrate(8);
    }
  };

  return (
    <div className="flex items-center justify-between py-3 px-1 group">
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

      <div className="flex items-center gap-2">
        {/* Tappable value — tap to reuse as input */}
        <button
          onClick={handleTapValue}
          className={`font-tech tabular-nums text-right transition-colors duration-150
                     hover:text-[var(--color-accent-text)] active:scale-95
                     ${
                       isHighlighted
                         ? 'text-lg font-bold text-[var(--color-accent-text)]'
                         : 'text-base font-medium text-[var(--text-primary)]'
                     }`}
          title="Als Eingabe verwenden"
        >
          € {formatEuro(value)}
        </button>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="w-8 h-8 flex items-center justify-center rounded-lg
                     text-[var(--text-muted)] hover:text-[var(--text-secondary)]
                     hover:bg-[var(--overlay-light)]
                     opacity-0 group-hover:opacity-100 focus:opacity-100
                     transition-all duration-150 flex-shrink-0
                     max-[768px]:opacity-60"
          aria-label={`${label} kopieren`}
        >
          {copied ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
