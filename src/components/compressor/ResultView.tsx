import React, { useEffect } from 'react';
import { useI18n } from '../../i18n';
import { UnifiedCompressResult } from '../../services/compressionService';
import { platformService } from '../../services/platform';
import { formatFileSize } from '../../utils/formatters';
import { toast } from '../common/Toast';
import confetti from 'canvas-confetti';
import {
  Download,
  Share2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  FileText,
} from 'lucide-react';

interface ResultViewProps {
  result: UnifiedCompressResult;
  onReset: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ result, onReset }) => {
  const { t } = useI18n();

  useEffect(() => {
    // Confetti celebration if target was reached!
    if (result.reachedTarget) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#1F4FD8', '#16A34A', '#F97316'],
        });
      } catch {
        // Safe ignore
      }
    }
  }, [result.reachedTarget]);

  const handleDownload = async () => {
    const ok = await platformService.saveFile(result.blob, result.fileName);
    if (ok) {
      toast.success(t('compress.download') + ' started');
    } else {
      toast.error('Could not download file');
    }
  };

  const handleShare = async () => {
    const res = await platformService.shareFile({
      title: 'Compressed with KBCut',
      text: `Reduced to ${formatFileSize(result.compressedSize)} with KBCut`,
      blob: result.blob,
      fileName: result.fileName,
    });
    if (res === 'shared') {
      toast.success('Shared successfully!');
    } else if (res === 'downloaded') {
      toast.info('Share unavailable on this browser. File downloaded.');
    }
  };

  const reductionPercent = Math.max(
    0,
    Math.round(((result.originalSize - result.compressedSize) / result.originalSize) * 100)
  );

  return (
    <div className="w-full max-w-xl mx-auto space-y-5 animate-in zoom-in-95 duration-200">
      {/* Target Status Banner */}
      {result.reachedTarget ? (
        <div className="p-4 rounded-3xl bg-accent-50 dark:bg-accent-950/70 border border-accent-200 dark:border-accent-800 text-accent-900 dark:text-accent-100 flex items-center space-x-3 shadow-soft">
          <div className="w-10 h-10 rounded-2xl bg-accent-500 text-white flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm sm:text-base">
              {t('compress.doneBanner', { target: result.targetKb })}
            </h4>
            <p className="text-xs text-accent-700 dark:text-accent-300">
              Ready for exam portal upload with 0 quality compromise
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-3xl bg-warning-50 dark:bg-warning-950/70 border border-warning-200 dark:border-warning-800 text-warning-900 dark:text-warning-100 flex items-start space-x-3 shadow-soft">
          <div className="w-10 h-10 rounded-2xl bg-warning-500 text-white flex items-center justify-center shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm">
              Target size too low for this file
            </h4>
            <p className="text-xs text-warning-800 dark:text-warning-200 mt-0.5 leading-relaxed">
              {t('compress.cannotReachTarget', {
                suggested: result.suggestedKb || result.targetKb + 30,
              })}
            </p>
          </div>
        </div>
      )}

      {/* Before & After Size Stat Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Original
          </span>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-700 dark:text-slate-300 mt-1 line-through decoration-rose-500">
            {formatFileSize(result.originalSize)}
          </p>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border-2 border-accent-500 dark:border-accent-500 shadow-soft text-center relative overflow-hidden">
          <span className="text-[11px] font-bold uppercase tracking-wider text-accent-600 dark:text-accent-400">
            Compressed
          </span>
          <p className="text-xl sm:text-2xl font-extrabold text-accent-600 dark:text-accent-400 mt-1">
            {formatFileSize(result.compressedSize)}
          </p>
          <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full bg-accent-100 dark:bg-accent-950 text-accent-700 dark:text-accent-300 font-bold text-[10px]">
            -{reductionPercent}%
          </span>
        </div>
      </div>

      {/* Preview Card */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft flex flex-col items-center">
        <div className="max-h-64 w-full flex items-center justify-center overflow-hidden rounded-2xl bg-slate-50 dark:bg-slate-950 p-2">
          {result.type === 'image' ? (
            <img
              src={result.previewUrl}
              alt="Compressed output"
              className="max-h-60 max-w-full rounded-xl object-contain shadow-sm"
            />
          ) : (
            <div className="py-12 flex flex-col items-center text-slate-500">
              <FileText className="w-16 h-16 text-brand-500 mb-2" />
              <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                {result.fileName}
              </span>
              <span className="text-xs text-slate-400 mt-0.5">
                PDF Compressed & Optimized
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Primary Action Buttons (min 56px height) */}
      <div className="space-y-3 pt-1">
        <button
          type="button"
          onClick={handleDownload}
          className="w-full h-14 rounded-2xl bg-accent-600 hover:bg-accent-700 text-white font-extrabold text-base tracking-wide shadow-elevated flex items-center justify-center space-x-2 touch-press transition-all focus:outline-none focus:ring-4 focus:ring-accent-500/30"
        >
          <Download className="w-5 h-5" />
          <span>{t('compress.download')}</span>
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleShare}
            className="h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-sm flex items-center justify-center space-x-2 touch-press transition-colors"
          >
            <Share2 className="w-4 h-4 text-brand-500" />
            <span>{t('compress.share')}</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm flex items-center justify-center space-x-2 touch-press transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t('compress.compressAnother')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
