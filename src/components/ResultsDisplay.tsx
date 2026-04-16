import type { VatResult, VatRate, Direction } from '../utils/vatCalculation';
import { ResultRow } from './ResultRow';
import { ShareButton } from './ShareButton';

interface ResultsDisplayProps {
  result: VatResult | null;
  rate: VatRate;
  direction: Direction;
  onTapValue?: (formattedValue: string) => void;
}

export function ResultsDisplay({ result, rate, direction, onTapValue }: ResultsDisplayProps) {
  if (!result) {
    return (
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-5">
        <div className="text-center py-6">
          <p className="text-[var(--text-muted)] text-sm font-human">
            Betrag eingeben…
          </p>
        </div>
      </div>
    );
  }

  const isBruttoToNetto = direction === 'brutto-to-netto';

  return (
    <div className="flex flex-col gap-3 animate-fade-in">
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-4">
        {isBruttoToNetto ? (
          <>
            <ResultRow
              label="Netto"
              value={result.netto}
              isHighlighted
              sublabel="ohne Steuer"
              onTapValue={onTapValue}
            />
            <div className="h-px bg-[var(--border)] mx-1" />
            <ResultRow
              label={`${rate}% USt`}
              value={result.ust}
              sublabel="Umsatzsteuer"
              onTapValue={onTapValue}
            />
            <div className="h-px bg-[var(--border)] mx-1" />
            <ResultRow
              label="Brutto"
              value={result.brutto}
              sublabel="Eingabe"
              onTapValue={onTapValue}
            />
          </>
        ) : (
          <>
            <ResultRow
              label="Brutto"
              value={result.brutto}
              isHighlighted
              sublabel="mit Steuer"
              onTapValue={onTapValue}
            />
            <div className="h-px bg-[var(--border)] mx-1" />
            <ResultRow
              label={`${rate}% USt`}
              value={result.ust}
              sublabel="Umsatzsteuer"
              onTapValue={onTapValue}
            />
            <div className="h-px bg-[var(--border)] mx-1" />
            <ResultRow
              label="Netto"
              value={result.netto}
              sublabel="Eingabe"
              onTapValue={onTapValue}
            />
          </>
        )}
      </div>

      {/* Share button */}
      <ShareButton result={result} rate={rate} direction={direction} />
    </div>
  );
}
