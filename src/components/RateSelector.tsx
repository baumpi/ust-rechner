import { VAT_RATES, type VatRate } from '../utils/vatCalculation';

interface RateSelectorProps {
  rate: VatRate;
  onChange: (rate: VatRate) => void;
}

export function RateSelector({ rate, onChange }: RateSelectorProps) {
  return (
    <div className="flex gap-2">
      {VAT_RATES.map((r) => {
        const isActive = r === rate;
        return (
          <button
            key={r}
            onClick={() => onChange(r)}
            className={`flex-1 py-2.5 rounded-lg font-tech font-medium text-sm
                       transition-all duration-200 active:scale-95
                       ${
                         isActive
                           ? 'bg-[var(--color-accent)] text-white shadow-lg shadow-[rgba(196,30,58,0.25)]'
                           : 'bg-[var(--overlay-light)] text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--overlay-medium)]'
                       }`}
          >
            {r}%
          </button>
        );
      })}
    </div>
  );
}
