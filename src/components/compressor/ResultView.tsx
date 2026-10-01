import React, { useEffect, useState } from 'react';
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
  Sparkles,
  FileText,
  Copy,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface ResultViewProps {
  result: UnifiedCompressResult;
  onReset: () => void;
  onNavigateTools?: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ result, onReset, onNavigateTools }) => {
  const { t } = useI18n();
  const [sliderPos, setSliderPos] = useState(50); // percentage for comparison slider

  useEffect(() => {
    if (result.reachedTarget) {
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.65 },
          colors: ['#1F4FD8', '#16A34A', '#F97316', '#8B5CF6'],
        });
      } catch {
        // Safe ignore
      }
    }
  }, [result.reachedTarget]);

  const handleDownload = async () => {
    const ok = await platformService.saveFile(result.blob, result.fileName);
    if (ok) {
      toast.success(t('compress.download') + ' started!');
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
      toast.info('Share unavailable. File downloaded.');
    }
  };

  const reductionPercent = Math.max(
    0,
    Math.round(((result.originalSize - result.compressedSize) / result.originalSize) * 100)
  );

  return (
    <div className="w-full max-w-xl mx-auto space-y-5 animate-in zoom-in-95 duration-300">
      {/* Target Status Banner */}
      {result.reachedTarget ? (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-accent-500/10 via-emerald-500/10 to-teal-500/10 border-2 border-accent-500/40 dark:border-accent-500/50 text-accent-950 dark:text-accent-100 flex items-center space-x-3.5 shadow-soft">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-accent-600 to-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-accent-500/30">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-black text-base sm:text-lg text-slate-900 dark:text-white">
                {t('compress.doneBanner', { target: result.targetKb })}
              </h4>
              <span className="px-2 py-0.5 rounded-full bg-accent-500 text-white font-black text-[10px] uppercase tracking-wider">
                Ready
              </span>
            </div>
            <p className="text-xs text-accent-800 dark:text-accent-300 mt-0.5 font-medium">
              Verified compliant with SSC, UPSC, MPSC & Banking portal limits.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 sm:p-5 rounded-3xl bg-warning-50 dark:bg-warning-950/70 border-2 border-warning-500/40 dark:border-warning-500/50 text-warning-950 dark:text-warning-100 flex items-start space-x-3.5 shadow-soft">
          <div className="w-12 h-12 rounded-2xl bg-warning-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-warning-500/30 mt-0.5">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-black text-base text-slate-900 dark:text-white">
              Target size too low for clear output
            </h4>
            <p className="text-xs text-warning-800 dark:text-warning-200 mt-1 leading-relaxed">
              {t('compress.cannotReachTarget', {
                suggested: result.suggestedKb || result.targetKb + 25,
              })}
            </p>
          </div>
        </div>
      )}

      {/* Before & After Size Stat Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-soft text-center flex flex-col justify-center">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
            Original Size
          </span>
          <p className="text-xl sm:text-3xl font-black text-slate-500 dark:text-slate-400 mt-1 line-through decoration-rose-500 decoration-2">
            {formatFileSize(result.originalSize)}
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-accent-500 dark:border-accent-500 shadow-elevated text-center relative overflow-hidden flex flex-col justify-center">
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-accent-100 dark:bg-accent-950 text-accent-700 dark:text-accent-300 font-black text-xs">
            -{reductionPercent}%
          </div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-accent-600 dark:text-accent-400">
            New Size
          </span>
          <p className="text-xl sm:text-3xl font-black text-accent-600 dark:text-accent-400 mt-1">
            {formatFileSize(result.compressedSize)}
          </p>
        </div>
      </div>

      {/* Interactive Visual Preview Card */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-soft flex flex-col items-center">
        <div className="w-full flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            <span>Compressed Preview</span>
          </span>
          <span className="text-[11px] font-bold text-slate-400 truncate max-w-[200px]">
            {result.fileName}
          </span>
        </div>

        <div className="max-h-72 w-full flex items-center justify-center overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-950 p-3 border border-slate-200/60 dark:border-slate-800">
          {result.type === 'image' ? (
            <img
              src={result.previewUrl}
              alt="Compressed output"
              className="max-h-64 max-w-full rounded-xl object-contain shadow-sm"
            />
          ) : (
            <div className="py-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-accent-50 dark:bg-accent-950 text-accent-600 dark:text-accent-400 flex items-center justify-center mb-3">
                <FileText className="w-8 h-8" />
              </div>
              <p className="font-extrabold text-sm text-slate-900 dark:text-white">
                {result.fileName}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Multi-Page PDF Compressed & Optimized
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Primary Action Buttons (Min 56px height) */}
      <div className="space-y-3 pt-1">
        <button
          type="button"
          onClick={handleDownload}
          className="w-full h-14 rounded-2xl bg-gradient-to-r from-accent-600 to-emerald-600 hover:from-accent-500 hover:to-emerald-500 text-white font-black text-base tracking-wide shadow-elevated flex items-center justify-center space-x-2.5 touch-press transition-all animate-shimmer focus:outline-none focus:ring-4 focus:ring-accent-500/30"
        >
          <Download className="w-5 h-5" />
          <span>{t('compress.download')} ({formatFileSize(result.compressedSize)})</span>
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleShare}
            className="h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-brand-500 text-slate-800 dark:text-slate-200 font-extrabold text-xs sm:text-sm flex items-center justify-center space-x-2 touch-press transition-colors shadow-sm"
          >
            <Share2 className="w-4 h-4 text-brand-500" />
            <span>{t('compress.share')}</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-extrabold text-xs sm:text-sm flex items-center justify-center space-x-2 touch-press transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t('compress.compressAnother')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
