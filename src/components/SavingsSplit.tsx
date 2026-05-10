import { useState, useCallback, useEffect } from 'react';
import { formatEuro } from '../utils/formatNumber';
import { copyToClipboard } from '../utils/clipboard';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface SavingsSplitProps {
  netto: number;
}

const PRESETS = [30, 40, 45, 50] as const;

export function SavingsSplit({ netto }: SavingsSplitProps) {
  const [savePct, setSavePct] = useLocalStorage<number>('ust-save-pct', 45);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(savePct));

  useEffect(() => {
    if (!editing) setDraft(String(savePct));
  }, [savePct, editing]);

  const commitDraft = () => {
    const n = parseInt(draft, 10);
    if (!isNaN(n) && n >= 0 && n <= 100) {
      setSavePct(n);
    } else {
      setDraft(String(savePct));
    }
    setEditing(false);
  };

  const transferAmount = Math.round(netto * (savePct / 100) * 100) / 100;
  const keepAmount = Math.round(netto * ((100 - savePct) / 100) * 100) / 100;
  const keepPct = 100 - savePct;

  return (
    <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-4">
      <div className="flex items-center justify-between mb-3 px-1 gap-2">
        <span className="text-[11px] font-tech font-medium tracking-wider uppercase text-[var(--text-muted)]">
          Konto-Split (vom Netto)
        </span>
        <div className="flex items-center gap-1 font-tech text-[11px] text-[var(--color-accent-text)]">
          {editing ? (
            <input
              type="number"
              inputMode="numeric"
              min={0}
              max={100}
              value={draft}
              autoFocus
              onChange={(e) => setDraft(e.target.value.replace(/[^\d]/g, '').slice(0, 3))}
              onBlur={commitDraft}
              onKeyDown={(e) => {
                if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
                if (e.key === 'Escape') {
                  setDraft(String(savePct));
                  setEditing(false);
                }
              }}
              className="w-10 text-right bg-[var(--overlay-light)] rounded px-1.5 py-0.5
                         font-tech text-[11px] text-[var(--color-accent-text)] tabular-nums
                         outline-none focus:ring-1 focus:ring-[var(--color-accent)]
                         [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="px-1.5 py-0.5 rounded hover:bg-[var(--overlay-light)] transition-colors"
              aria-label="Split-Prozentsatz ändern"
            >
              {savePct}
            </button>
          )}
          <span>/ {keepPct}</span>
        </div>
      </div>

      <div className="flex gap-1.5 mb-3 px-1">
        {PRESETS.map((p) => {
          const active = p === savePct;
          return (
            <button
              key={p}
              onClick={() => setSavePct(p)}
              className={`flex-1 py-1.5 rounded-lg font-tech text-xs font-medium
                         transition-all active:scale-95
                         ${
                           active
                             ? 'bg-[var(--color-accent)] text-white'
                             : 'bg-[var(--overlay-light)] text-[var(--text-muted)]'
                         }`}
            >
              {p}%
            </button>
          );
        })}
      </div>

      <SplitRow
        label="Überweisen"
        sublabel={`${savePct}% → Sparkonto`}
        value={transferAmount}
        accent
      />
      <div className="h-px bg-[var(--border)] mx-1" />
      <SplitRow
        label="Verfügbar"
        sublabel={`${keepPct}% → Hauptkonto`}
        value={keepAmount}
      />
    </div>
  );
}

interface SplitRowProps {
  label: string;
  sublabel: string;
  value: number;
  accent?: boolean;
}

function SplitRow({ label, sublabel, value, accent = false }: SplitRowProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    const ok = copyToClipboard(formatEuro(value));
    if (ok) {
      setCopied(true);
      if (navigator.vibrate) navigator.vibrate(8);
      setTimeout(() => setCopied(false), 1500);
    }
  }, [value]);

  return (
    <div className="flex items-center justify-between py-2.5 px-1 gap-2">
      <div className="flex flex-col min-w-0">
        <span className="font-human text-sm font-medium text-[var(--text-secondary)]">
          {label}
        </span>
        <span className="text-[10px] font-tech text-[var(--text-muted)]">
          {sublabel}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <span
          className={`font-tech tabular-nums text-right px-2 py-1
                     ${accent
                       ? 'text-base font-bold text-[var(--color-accent-text)]'
                       : 'text-base font-medium text-[var(--text-primary)]'}`}
        >
          € {formatEuro(value)}
        </span>

        <button
          onClick={handleCopy}
          className={`min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg
                     transition-all duration-150 flex-shrink-0 active:scale-90
                     ${copied
                       ? 'bg-[var(--color-accent-light)] text-[var(--color-accent)]'
                       : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--overlay-light)]'}`}
          aria-label={`${label} kopieren`}
        >
          {copied ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
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
