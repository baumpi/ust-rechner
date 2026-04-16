import { useRef, useEffect } from 'react';
import { sanitizeInput } from '../utils/formatNumber';

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
}

export function AmountInput({ value, onChange, label }: AmountInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus on mount with slight delay for mobile keyboard
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeInput(e.target.value);
    onChange(sanitized);
  };

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      <label className="block text-[11px] font-tech font-medium tracking-wider uppercase text-[var(--text-muted)] mb-2 px-1">
        {label}
      </label>
      <div
        className="flex items-center gap-2 bg-[var(--bg-surface)] rounded-xl border border-[var(--border)]
                    focus-within:border-[var(--color-accent)] focus-within:ring-2 focus-within:ring-[rgba(196,30,58,0.3)]
                    transition-all duration-200 px-4 py-3"
      >
        <span className="text-[var(--text-muted)] font-tech text-lg font-medium select-none flex-shrink-0">
          €
        </span>
        <input
          ref={inputRef}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          value={value}
          onChange={handleChange}
          placeholder="0,00"
          className="flex-1 bg-transparent font-tech text-2xl font-medium text-[var(--text-primary)]
                     placeholder:text-[var(--text-muted)] placeholder:opacity-40
                     caret-[var(--color-accent)] min-w-0 outline-none"
        />
        {value && (
          <button
            onClick={handleClear}
            className="w-8 h-8 flex items-center justify-center rounded-lg
                       text-[var(--text-muted)] hover:text-[var(--text-secondary)]
                       hover:bg-[var(--overlay-light)] transition-colors flex-shrink-0"
            aria-label="Eingabe löschen"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
