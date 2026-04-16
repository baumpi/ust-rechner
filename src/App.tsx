import { useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Header } from './components/Header';
import { Calculator } from './components/Calculator';

type Theme = 'dark' | 'light';

export default function App() {
  const [theme, setTheme] = useLocalStorage<Theme>('ust-theme', 'light');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('theme-light');
    } else {
      root.classList.remove('theme-light');
    }

    // Update theme-color meta tag
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', theme === 'dark' ? '#1F1E1C' : '#FAFAF7');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev: Theme) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[var(--bg-app)] transition-colors duration-300">
      {/* Constrained container for tablet/desktop */}
      <div className="w-full max-w-md mx-auto flex flex-col flex-1">
        <Header theme={theme} onToggleTheme={toggleTheme} />
        <main className="flex-1 flex flex-col pt-2">
          <Calculator />
        </main>
        {/* Minimal footer */}
        <footer className="text-center py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <p className="text-[10px] font-tech text-[var(--text-muted)] opacity-50">
            KI Austria · USt-Rechner v1.0
          </p>
        </footer>
      </div>
    </div>
  );
}
