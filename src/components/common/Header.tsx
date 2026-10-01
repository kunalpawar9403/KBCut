import React, { useState } from 'react';
import { useI18n, Language } from '../../i18n';
import { DownloadAppModal } from './DownloadAppModal';
import {
  Sun,
  Moon,
  Wrench,
  Clock,
  Home,
  Settings,
  ChevronDown,
  Smartphone,
  Download,
} from 'lucide-react';

interface HeaderProps {
  theme: 'light' | 'dark';
  activeTab: 'home' | 'tools' | 'history' | 'settings';
  onToggleTheme: () => void;
  onNavigateTab: (tab: 'home' | 'tools' | 'history' | 'settings') => void;
  onNavigateHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  activeTab,
  onToggleTheme,
  onNavigateTab,
  onNavigateHome,
}) => {
  const { lang, setLang } = useI18n();
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLang(e.target.value as Language);
  };

  const scrollToSection = (id: string) => {
    if (activeTab !== 'home') {
      onNavigateTab('home');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems: {
    label: string;
    tab: 'home' | 'tools' | 'history' | 'settings';
    icon: React.ElementType;
    badge?: string;
  }[] = [
    { label: 'Home', tab: 'home', icon: Home },
    { label: 'Exam Tools', tab: 'tools', icon: Wrench, badge: '6' },
    { label: 'History', tab: 'history', icon: Clock },
    { label: 'Settings', tab: 'settings', icon: Settings },
  ];

  return (
    <>
      {/* ─── Sticky Top Header ──────────────────────────────────── */}
      <header className="sticky top-0 z-40 w-full glass border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4">

          {/* Left: Brand */}
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2.5 text-left focus:outline-none group flex-shrink-0"
            aria-label="KBCut home"
          >
            <div className="relative flex-shrink-0">
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-500 to-accent-500 rounded-xl blur-sm opacity-25 group-hover:opacity-60 transition duration-300" />
              <img
                src="/logo.png"
                alt="KBCut Logo"
                className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl shadow-sm object-contain bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 p-0.5 transition-transform group-hover:scale-105"
              />
            </div>
            <div className="leading-none">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-[18px] sm:text-xl tracking-tight bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 dark:from-brand-400 dark:via-blue-300 dark:to-indigo-300 bg-clip-text text-transparent">
                  KBCut
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[9px] uppercase font-black tracking-widest px-1.5 py-0.5 rounded-md bg-accent-50 dark:bg-accent-950/80 text-accent-700 dark:text-accent-400 border border-accent-200/60 dark:border-accent-800/60 leading-none">
                  <span className="w-1 h-1 rounded-full bg-accent-500 animate-pulse flex-shrink-0" />
                  Private
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 hidden sm:block mt-0.5">
                Photo &amp; PDF Size Reducer
              </p>
            </div>
          </button>

          {/* Centre: Desktop navigation — hidden on mobile (BottomNav handles it) */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center" aria-label="Main navigation">
            {navItems.map(({ label, tab, icon: Icon, badge }) => (
              <button
                key={tab}
                onClick={() => onNavigateTab(tab)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === tab
                    ? 'bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400'
                    : 'text-slate-600 dark:text-slate-300 hover:text-brand-500 hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
                {badge && (
                  <span className="px-1.5 py-0.5 rounded-full bg-brand-100 dark:bg-brand-900/80 text-brand-700 dark:text-brand-300 text-[9px] font-black leading-none">
                    {badge}
                  </span>
                )}
              </button>
            ))}
            <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-brand-500 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-all"
            >
              How It Works
            </button>
          </nav>

          {/* Right: Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">

            {/* Language Switcher — hidden on smallest screens */}
            <div className="relative hidden sm:block">
              <select
                value={lang}
                aria-label="Language"
                onChange={handleLangChange}
                className="appearance-none bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 text-xs font-bold py-1.5 pl-2.5 pr-5 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer hover:border-brand-400 transition-colors"
              >
                <option value="en">EN</option>
                <option value="mr">MR</option>
                <option value="hi">HI</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-slate-400">
                <ChevronDown className="w-3 h-3" />
              </div>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-lg bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 hover:border-brand-400 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 touch-press"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Download App — compact on tablet/mobile */}
            <button
              onClick={() => setShowDownloadModal(true)}
              aria-label="Download KBCut Android App"
              className="lg:hidden inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-brand-500 to-accent-500 hover:from-brand-600 hover:to-accent-600 text-white font-extrabold text-[11px] shadow-sm hover:shadow-md transition-all touch-press"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">App</span>
            </button>

            {/* Download App — full button on desktop */}
            <button
              onClick={() => setShowDownloadModal(true)}
              aria-label="Download KBCut Android App APK"
              className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-brand-500 to-accent-500 hover:from-brand-600 hover:to-accent-600 text-white font-extrabold text-xs shadow-sm hover:shadow-md transition-all touch-press"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Download App</span>
            </button>
          </div>

        </div>
      </header>

      {/* Download App Modal */}
      <DownloadAppModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
      />
    </>
  );
};
