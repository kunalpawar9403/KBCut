import React, { useState, useEffect } from 'react';
import { useI18n } from '../i18n';
import { storageService, HistoryItem } from '../services/storage';
import { formatFileSize, formatDate } from '../utils/formatters';
import { toast } from '../components/common/Toast';
import { Clock, Trash2, FileText, Image, Inbox, Sparkles } from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const { t } = useI18n();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const items = await storageService.getAllHistory();
      setHistory(items);
    } catch {
      // Safe fallback
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    await storageService.deleteHistory(id);
    setHistory((prev) => prev.filter((item) => item.id !== id));
    toast.info(t('history.deletedToast'));
  };

  const handleClearAll = async () => {
    if (window.confirm('Clear all recent files history?')) {
      await storageService.clearAllHistory();
      setHistory([]);
      toast.info(t('history.clearedToast'));
    }
  };

  return (
    <div className="w-full space-y-5 pb-20 md:pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-brand-500" />
            <span>{t('history.title')}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Persisted locally on your device
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center space-x-1 text-xs font-semibold text-rose-500 hover:text-rose-600 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/30"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t('history.clearAll')}</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400">Loading history...</div>
      ) : history.length === 0 ? (
        /* Friendly Empty State */
        <div className="p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-soft flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/80 text-brand-500 flex items-center justify-center mb-4">
            <Inbox className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
            {t('history.emptyTitle')}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1 leading-relaxed">
            {t('history.emptySub')}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {history.map((item) => {
            const isPdf = item.mimeType === 'application/pdf';
            const reduction = Math.max(
              0,
              Math.round(((item.originalSize - item.compressedSize) / item.originalSize) * 100)
            );

            return (
              <div
                key={item.id}
                className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft flex items-center justify-between group hover:border-brand-500/40 transition-all"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                      isPdf
                        ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400'
                        : 'bg-brand-50 text-brand-600 dark:bg-brand-950/80 dark:text-brand-400'
                    }`}
                  >
                    {isPdf ? <FileText className="w-5 h-5" /> : <Image className="w-5 h-5" />}
                  </div>

                  <div className="min-w-0">
                    <p className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">
                      {item.fileName}
                    </p>
                    <div className="flex items-center space-x-2 mt-0.5 text-[11px]">
                      <span className="text-slate-400 line-through">
                        {formatFileSize(item.originalSize)}
                      </span>
                      <span className="text-accent-600 dark:text-accent-400 font-bold">
                        {formatFileSize(item.compressedSize)}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-400">{formatDate(item.timestamp)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0 ml-3">
                  <span className="px-2 py-0.5 rounded-full bg-accent-100 dark:bg-accent-950 text-accent-700 dark:text-accent-300 font-extrabold text-[10px]">
                    -{reduction}%
                  </span>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    aria-label="Delete history item"
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
