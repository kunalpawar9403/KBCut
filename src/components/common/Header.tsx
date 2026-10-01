import React from 'react';
import { useI18n, Language } from '../../i18n';
import { Sun, Moon, ShieldCheck } from 'lucide-react';

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
    <header className="sticky top-0 z-30 w-full glass border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={onNavigateHome}
          className="flex items-center space-x-2.5 text-left focus:outline-none group"
        >
          <img
            src="/logo.png"
            alt="KBCut Logo"
            className="w-9 h-9 rounded-xl shadow-sm object-contain transition-transform group-hover:scale-105"
          />
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-xl tracking-tight text-brand-500 dark:text-brand-400 font-sans">
                KBCut
              </span>
              <span className="hidden sm:inline-flex items-center text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-accent-100 text-accent-700 dark:bg-accent-950 dark:text-accent-400">
                100% Private
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 -mt-1 hidden xs:block">
              {t('app.tagline')}
            </p>
          </div>
        </button>

        {/* Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Privacy badge indicator */}
          <div
            title={t('app.privacyBadge')}
            className="hidden md:flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/70 px-2.5 py-1.5 rounded-full"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-accent-500" />
            <span>On-Device Only</span>
          </div>

          {/* Language Switcher */}
          <div className="relative">
            <select
              value={lang}
              aria-label="Language"
              onChange={handleLangChange}
              className="appearance-none bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold py-1.5 pl-3 pr-7 rounded-full border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
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

          {/* Theme Switcher */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
