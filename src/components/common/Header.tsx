import React from 'react';
import { useI18n, Language } from '../../i18n';
import { Sun, Moon, ShieldCheck, Sparkles } from 'lucide-react';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onNavigateHome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme, onNavigateHome }) => {
  const { lang, setLang, t } = useI18n();

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLang(e.target.value as Language);
  };

  return (
    <header className="sticky top-0 z-30 w-full glass border-b border-slate-200/80 dark:border-slate-800/80 transition-all duration-300">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand with Logo */}
        <button
          onClick={onNavigateHome}
          className="flex items-center space-x-3 text-left focus:outline-none group"
        >
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-500 to-accent-500 rounded-2xl blur-sm opacity-40 group-hover:opacity-75 transition duration-300" />
            <img
              src="/logo.png"
              alt="KBCut Logo"
              className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl shadow-md object-contain bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700/70 transition-transform group-hover:scale-105"
            />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 dark:from-brand-400 dark:via-blue-300 dark:to-indigo-300 bg-clip-text text-transparent font-sans">
                KBCut
              </span>
              <span className="hidden xs:inline-flex items-center space-x-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-accent-50 text-accent-700 dark:bg-accent-950/80 dark:text-accent-400 border border-accent-200/60 dark:border-accent-800/60">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-pulse mr-1" />
                Private
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 -mt-0.5 hidden sm:block">
              {t('app.tagline')}
            </p>
          </div>
        </button>

        {/* Right Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Privacy badge indicator on tablet/desktop */}
          <div
            title={t('app.privacyBadge')}
            className="hidden sm:flex items-center space-x-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700/80 px-3 py-1.5 rounded-full shadow-sm"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-accent-500 shrink-0" />
            <span>On-Device Only</span>
          </div>

          {/* Language Switcher */}
          <div className="relative">
            <select
              value={lang}
              aria-label="Language"
              onChange={handleLangChange}
              className="appearance-none bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 text-xs font-bold py-1.5 pl-3 pr-7 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer hover:border-brand-400 transition-colors"
            >
              <option value="en">English</option>
              <option value="mr">मराठी</option>
              <option value="hi">हिंदी</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
              <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>

          {/* Theme Switcher Button */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-brand-400 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 touch-press"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
