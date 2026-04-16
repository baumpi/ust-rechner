import { useState } from 'react';
import type { HistoryEntry } from '../hooks/useHistory';
import { formatEuro } from '../utils/formatNumber';

interface HistoryProps {
  entries: HistoryEntry[];
  onSelect: (entry: HistoryEntry) => void;
  onClear: () => void;
}

export function History({ entries, onSelect, onClear }: HistoryProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (entries.length === 0) return null;

  return (
    <div className="px-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-2 px-1
                   text-[var(--text-muted)] hover:text-[var(--text-secondary)]
                   transition-colors"
      >
        <span className="text-[11px] font-tech font-medium tracking-wider uppercase">
          Verlauf ({entries.length})
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className="animate-fade-in">
          <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] overflow-hidden">
            {entries.map((entry, i) => {
              const isBrutto = entry.direction === 'brutto-to-netto';
              const inputLabel = isBrutto ? 'Br' : 'Ne';
              const resultLabel = isBrutto ? 'Ne' : 'Br';
              const resultValue = isBrutto ? entry.result.netto : entry.result.brutto;
              const timeStr = formatTime(entry.timestamp);

              return (
                <button
                  key={entry.id}
                  onClick={() => onSelect(entry)}
                  className={`w-full flex items-center justify-between px-4 py-3
                             hover:bg-[var(--overlay-light)] active:bg-[var(--overlay-medium)]
                             transition-colors text-left
                             ${i > 0 ? 'border-t border-[var(--border)]' : ''}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-[10px] font-tech text-[var(--text-muted)] flex-shrink-0 w-5">
                      {entry.rate}%
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-tech text-[var(--text-muted)]">{inputLabel}</span>
                        <span className="text-sm font-tech text-[var(--text-secondary)] truncate">
                          € {entry.input}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-tech text-[var(--color-accent-text)]">{resultLabel}</span>
                        <span className="text-sm font-tech font-medium text-[var(--text-primary)] truncate">
                          € {formatEuro(resultValue)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-tech text-[var(--text-muted)] flex-shrink-0 ml-2">
                    {timeStr}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onClear();
              setIsOpen(false);
            }}
            className="w-full text-center py-2 mt-1
                       text-[11px] font-tech text-[var(--text-muted)]
                       hover:text-red-400 transition-colors"
          >
            Verlauf löschen
          </button>
        </div>
      )}
    </div>
  );
}

function formatTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  if (diff < 60_000) return 'jetzt';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h`;

  return new Date(timestamp).toLocaleDateString('de-AT', {
    day: '2-digit',
    month: '2-digit',
  });
}
