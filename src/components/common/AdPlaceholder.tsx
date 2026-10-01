import React from 'react';
import { useI18n } from '../../i18n';

interface AdPlaceholderProps {
  className?: string;
  format?: 'banner' | 'card';
}

export const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ className = '', format = 'banner' }) => {
  const { t } = useI18n();

  return (
    <div
      aria-label="Advertisement Placeholder"
      className={`w-full rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 p-4 text-center flex flex-col items-center justify-center transition-colors ${
        format === 'banner' ? 'h-24' : 'h-48'
      } ${className}`}
    >
      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        {t('home.adPlaceholder')}
      </span>
      <p className="text-xs text-slate-400/80 dark:text-slate-500/80 mt-0.5">
        Reserved for AdSense / Sponsor Banner
      </p>
    </div>
  );
};
