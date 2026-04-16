import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export function Header({ theme, onToggleTheme }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-5 pt-5 pb-2">
      <div className="flex items-center gap-3">
        {/* Red accent dot — KI Austria signature */}
        <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)] font-human tracking-tight">
            USt-Rechner
          </h1>
          <p className="text-[10px] font-tech font-medium tracking-[0.15em] uppercase text-[var(--text-muted)]">
            Umsatzsteuer Österreich
          </p>
        </div>
      </div>
      <ThemeToggle theme={theme} onToggle={onToggleTheme} />
    </header>
  );
}
