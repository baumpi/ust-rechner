import { useState, useCallback, useEffect, useRef } from 'react';
import { useVatCalculation } from '../hooks/useVatCalculation';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useHistory, type HistoryEntry } from '../hooks/useHistory';
import { AmountInput } from './AmountInput';
import { DirectionToggle } from './DirectionToggle';
import { RateSelector } from './RateSelector';
import { ResultsDisplay } from './ResultsDisplay';
import { QuickAmounts } from './QuickAmounts';
import { History } from './History';
import type { VatRate, Direction } from '../utils/vatCalculation';

export function Calculator() {
  const [inputValue, setInputValue] = useState('');
  const [rate, setRate] = useLocalStorage<VatRate>('ust-rate', 20);
  const [direction, setDirection] = useLocalStorage<Direction>('ust-direction', 'brutto-to-netto');
  const { history, addEntry, clearHistory } = useHistory();

  const result = useVatCalculation(inputValue, rate, direction);

  // Track last saved input to avoid duplicate history entries on re-renders
  const lastSavedRef = useRef('');

  // Save to history when result changes meaningfully (debounced)
  useEffect(() => {
    if (!result || !inputValue) return;

    const key = `${inputValue}|${rate}|${direction}`;
    if (key === lastSavedRef.current) return;

    const timer = setTimeout(() => {
      addEntry({ input: inputValue, rate, direction, result });
      lastSavedRef.current = key;
    }, 1500); // Wait 1.5s after last keystroke

    return () => clearTimeout(timer);
  }, [inputValue, rate, direction, result, addEntry]);

  const inputLabel = direction === 'brutto-to-netto' ? 'Brutto-Betrag' : 'Netto-Betrag';

  // Tap a result value → use it as new input
  const handleTapValue = useCallback((formattedValue: string) => {
    setInputValue(formattedValue);
  }, []);

  // Select from history → restore everything
  const handleHistorySelect = useCallback((entry: HistoryEntry) => {
    setInputValue(entry.input);
    setRate(entry.rate);
    setDirection(entry.direction);
  }, [setRate, setDirection]);

  return (
    <div className="flex flex-col gap-4 px-4 pb-4 flex-1">
      {/* Direction Toggle */}
      <DirectionToggle direction={direction} onChange={setDirection} />

      {/* Amount Input */}
      <AmountInput value={inputValue} onChange={setInputValue} label={inputLabel} />

      {/* Quick Amounts */}
      <QuickAmounts onSelect={setInputValue} />

      {/* Rate Selector */}
      <div>
        <label className="block text-[11px] font-tech font-medium tracking-wider uppercase text-[var(--text-muted)] mb-2 px-1">
          Steuersatz
        </label>
        <RateSelector rate={rate} onChange={setRate} />
      </div>

      {/* Red accent stroke — KI Austria signature element */}
      <div className="flex justify-center py-0.5">
        <div className="w-16 h-[3px] rounded-full bg-[var(--color-accent)] opacity-60" />
      </div>

      {/* Results */}
      <ResultsDisplay
        result={result}
        rate={rate}
        direction={direction}
        onTapValue={handleTapValue}
      />

      {/* History */}
      <History
        entries={history}
        onSelect={handleHistorySelect}
        onClear={clearHistory}
      />
    </div>
  );
}
