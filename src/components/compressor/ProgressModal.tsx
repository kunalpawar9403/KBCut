import React from 'react';
import { useI18n } from '../../i18n';
import { Loader2 } from 'lucide-react';

interface ProgressModalProps {
  isOpen: boolean;
  type: 'image' | 'pdf';
  progress?: { current: number; total: number; percent: number };
}

export const ProgressModal: React.FC<ProgressModalProps> = ({ isOpen, type, progress }) => {
  const { t } = useI18n();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xs p-6 rounded-3xl bg-white dark:bg-slate-900 shadow-elevated border border-slate-200 dark:border-slate-800 text-center flex flex-col items-center">
        {/* Animated Brand Pulse Indicator */}
        <div className="relative w-20 h-20 mb-4 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-brand-500/10 animate-ping" />
          <div className="relative w-16 h-16 rounded-2xl bg-brand-500/15 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
          </div>
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
          {t('compress.compressing')}
        </h3>

        {type === 'pdf' && progress && progress.total > 0 ? (
          <div className="w-full mt-3 space-y-2">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {t('compress.pageProgress', {
                current: progress.current,
                total: progress.total,
                percent: progress.percent,
              })}
            </p>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-brand-500 transition-all duration-300 rounded-full"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Analyzing pixels & optimizing compression...
          </p>
        )}
      </div>
    </div>
  );
};
