import React from 'react';
import { useI18n } from '../../i18n';
import { Home, Wrench, Clock, Settings } from 'lucide-react';

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
      className="fixed bottom-0 left-0 right-0 z-30 md:hidden glass border-t border-slate-200 dark:border-slate-800 pb-[env(safe-area-inset-bottom)]"
    >
      <div className="flex items-center justify-around h-16 max-w-md mx-auto px-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors min-h-[50px] ${
                isActive
                  ? 'text-brand-500 dark:text-brand-400 font-semibold'
                  : 'text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <div
                className={`p-1 rounded-full transition-transform ${
                  isActive ? 'scale-110 bg-brand-50 dark:bg-brand-950/60' : ''
                }`}
              >
                {tab.icon}
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
