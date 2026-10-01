import React, { useState } from 'react';
import { useI18n, Language } from '../../i18n';
import { DownloadAppModal } from './DownloadAppModal';
import {
  Sun,
  Moon,
  Sparkles,
  Wrench,
  Clock,
  FileText,
  ChevronDown,
  Smartphone,
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
  const { lang, setLang, t } = useI18n();
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLang(e.target.value as Language);
  };

  const scrollToSection = (id: string) => {
    if (activeTab !== 'home') {
      onNavigateTab('home');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 sm:h-20 flex items-center justify-between">
        {/* Left: Brand Identity */}
        <div className="flex items-center space-x-6">
          <button
            onClick={onNavigateHome}
            className="flex items-center space-x-3.5 text-left focus:outline-none group py-1"
          >
            <div className="relative">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-brand-500 to-accent-500 rounded-2xl blur-md opacity-35 group-hover:opacity-85 transition duration-300" />
              <img
                src="/logo.png"
                alt="KBCut Logo"
                className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl shadow-lg object-contain bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 p-1 transition-transform group-hover:scale-105"
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-2xl sm:text-2xl tracking-tight bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 dark:from-brand-400 dark:via-blue-300 dark:to-indigo-300 bg-clip-text text-transparent font-sans">
                  KBCut
                </span>
                <span className="hidden xs:inline-flex items-center space-x-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-accent-50 text-accent-700 dark:bg-accent-950/80 dark:text-accent-400 border border-accent-200/60 dark:border-accent-800/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-pulse mr-1" />
                  100% Private
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 -mt-0.5 hidden md:block">
                Get under the limit
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links (Integrated directly in navbar) */}
          <nav className="hidden lg:flex items-center space-x-1 pl-4 border-l border-slate-200 dark:border-slate-800">
            <button
              onClick={() => onNavigateTab('tools')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 ${
                activeTab === 'tools'
                  ? 'bg-brand-50 text-brand-600 dark:bg-brand-950/80 dark:text-brand-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <span>Exam Tools</span>
              <span className="px-1.5 py-0.2 rounded-full bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 text-[9px] font-black">
                6
              </span>
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('supported-exams')}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            >
              Supported Exams
            </button>
            <button
              onClick={() => onNavigateTab('history')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'history'
                  ? 'bg-brand-50 text-brand-600 dark:bg-brand-950/80 dark:text-brand-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              Recent Files
            </button>
          </nav>
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-2.5 sm:space-x-3">
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
              <ChevronDown className="w-3.5 h-3.5" />
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

          {/* Download App / APK Button (Mobile only) */}
          <button
            onClick={() => setShowDownloadModal(true)}
            aria-label="Download KBCut Android App APK"
            className="inline-flex md:hidden items-center space-x-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full bg-gradient-to-r from-accent-500 to-emerald-600 hover:from-accent-600 hover:to-emerald-700 text-white font-extrabold text-xs shadow-sm hover:shadow-md transition-all touch-press"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Download App</span>
          </button>
        </div>
      </div>

      {/* Download App Modal */}
      <DownloadAppModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
      />
    </header>
  );
};
