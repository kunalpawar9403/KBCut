import React from 'react';
import { useI18n } from '../../i18n';
import { Home, Wrench, Clock, Settings, Sparkles } from 'lucide-react';

export type NavTab = 'home' | 'tools' | 'history' | 'settings';

interface BottomNavProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab }) => {
  const { t } = useI18n();

  const tabs: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: t('nav.home'), icon: <Home className="w-5 h-5" /> },
    { id: 'tools', label: t('nav.tools'), icon: <Wrench className="w-5 h-5" /> },
    { id: 'history', label: t('nav.history'), icon: <Clock className="w-5 h-5" /> },
    { id: 'settings', label: t('nav.settings'), icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <nav
      aria-label="Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden px-3 pb-[calc(env(safe-area-inset-bottom)+8px)] pt-1 pointer-events-none"
    >
      <div className="pointer-events-auto max-w-sm mx-auto glass rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-elevated flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`relative flex-1 flex flex-col items-center justify-center py-1 transition-all min-h-[52px] touch-press ${
                isActive
                  ? 'text-brand-600 dark:text-brand-400 font-extrabold'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              <div
                className={`p-1.5 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? 'scale-110 bg-brand-500 text-white shadow-md shadow-brand-500/30'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {tab.icon}
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-black' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
