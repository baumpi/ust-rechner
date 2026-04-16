import { formatForInput } from '../utils/formatNumber';

const QUICK_AMOUNTS = [100, 500, 1000, 5000, 10000];

interface QuickAmountsProps {
  onSelect: (amount: string) => void;
}

export function QuickAmounts({ onSelect }: QuickAmountsProps) {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-0.5 -mx-1 px-1 scrollbar-none">
      {QUICK_AMOUNTS.map((amount) => {
        const formatted = formatForInput(amount);
        return (
          <button
            key={amount}
            onClick={() => onSelect(formatted)}
            className="flex-shrink-0 px-3 py-1.5 rounded-lg
                       bg-[var(--overlay-light)] hover:bg-[var(--overlay-medium)]
                       active:scale-95 transition-all duration-150
                       text-xs font-tech font-medium text-[var(--text-muted)]
                       hover:text-[var(--text-secondary)]"
          >
            {formatted}
          </button>
        );
      })}
    </div>
  );
}
