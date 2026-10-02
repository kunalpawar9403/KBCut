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

  const tabs: { id: NavTab; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'home', label: t('nav.home'), icon: Home },
    { id: 'tools', label: t('nav.tools'), icon: Wrench, badge: '6' },
    { id: 'history', label: t('nav.history'), icon: Clock },
    { id: 'settings', label: t('nav.settings'), icon: Settings },
  ];

  return (
    <nav
      aria-label="Mobile bottom navigation"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
    >
      <div className="glass border-t border-slate-200/80 dark:border-slate-700/80 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_24px_rgba(0,0,0,0.30)] flex items-stretch h-[60px] overflow-hidden">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`relative flex-1 flex flex-col items-center justify-center gap-0.5 py-1 transition-all duration-200 touch-press ${
                isActive
                  ? 'text-brand-600 dark:text-brand-400'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              {/* Active top indicator */}
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-brand-500" />
              )}

              {/* Icon with optional badge */}
              <div className="relative">
                <div className={`p-1.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-50 dark:bg-brand-950/80'
                    : ''
                }`}>
                  <Icon className="w-[18px] h-[18px]" />
                </div>
                {tab.badge && (
                  <span className="absolute -top-1 -right-1.5 min-w-[14px] h-[14px] flex items-center justify-center rounded-full bg-brand-500 text-white text-[8px] font-black px-0.5 leading-none">
                    {tab.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span className={`text-[10px] leading-none tracking-tight ${
                isActive ? 'font-black' : 'font-medium'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
