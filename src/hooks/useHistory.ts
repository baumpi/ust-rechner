import { useLocalStorage } from './useLocalStorage';
import type { VatResult, VatRate, Direction } from '../utils/vatCalculation';

export interface HistoryEntry {
  id: string;
  input: string;
  rate: VatRate;
  direction: Direction;
  result: VatResult;
  timestamp: number;
}

const MAX_HISTORY = 15;

export function useHistory() {
  const [history, setHistory] = useLocalStorage<HistoryEntry[]>('ust-history', []);

  const addEntry = (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => {
    const newEntry: HistoryEntry = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };

    setHistory((prev: HistoryEntry[]) => {
      // Avoid duplicate if same input/rate/direction as last entry
      if (prev.length > 0) {
        const last = prev[0];
        if (last.input === entry.input && last.rate === entry.rate && last.direction === entry.direction) {
          return prev;
        }
      }
      return [newEntry, ...prev].slice(0, MAX_HISTORY);
    });
  };

  const clearHistory = () => setHistory([]);

  return { history, addEntry, clearHistory };
}
