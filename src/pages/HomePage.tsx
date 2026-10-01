import React, { useState } from 'react';
import { DropZone } from '../components/compressor/DropZone';
import { CompressSettings } from '../components/compressor/CompressSettings';
import { ProgressModal } from '../components/compressor/ProgressModal';
import { ResultView } from '../components/compressor/ResultView';
import { AdPlaceholder } from '../components/common/AdPlaceholder';
import { ExamPreset } from '../data/presets';
import { compressionService, UnifiedCompressResult } from '../services/compressionService';
import { toast } from '../components/common/Toast';
import { useI18n } from '../i18n';
import { Wrench, ArrowRight } from 'lucide-react';

interface HomePageProps {
  onNavigateTools?: () => void;
  initialPreset?: ExamPreset;
  initialTargetKb?: number;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigateTools,
  initialPreset,
  initialTargetKb,
}) => {
  const { t } = useI18n();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activePreset, setActivePreset] = useState<ExamPreset | undefined>(initialPreset);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [compressProgress, setCompressProgress] = useState<{ current: number; total: number; percent: number }>({
    current: 0,
    total: 0,
    percent: 0,
  });
  const [result, setResult] = useState<UnifiedCompressResult | null>(null);

  const handleFileSelected = (file: File, preset?: ExamPreset) => {
    setSelectedFile(file);
    if (preset) setActivePreset(preset);
  };

  const handleCompress = async (
    targetKb: number,
    options?: { targetWidth?: number; targetHeight?: number }
  ) => {
    if (!selectedFile) return;

    setIsCompressing(true);
    setCompressProgress({ current: 0, total: 1, percent: 0 });

    try {
      const compressResult = await compressionService.processFile(selectedFile, targetKb, {
        targetWidth: options?.targetWidth,
        targetHeight: options?.targetHeight,
        onProgress: (p) => setCompressProgress(p),
      });

      setResult(compressResult);
    } catch (err: any) {
      console.error(err);
      if (err?.code === 'PASSWORD_PROTECTED') {
        toast.error(t('common.passwordProtectedPdf'));
      } else if (err?.code === 'CORRUPT_FILE') {
        toast.error(t('common.fileCorruptError'));
      } else {
        toast.error(t('common.unsupportedFormat'));
      }
    } finally {
      setIsCompressing(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setResult(null);
    setActivePreset(undefined);
  };

  return (
    <div className="w-full space-y-6 pb-20 md:pb-8">
      {/* 3 Steps: Dropzone -> Settings -> Result */}
      {!selectedFile && !result && (
        <>
          <DropZone
            onFileSelected={handleFileSelected}
            onPresetClick={(preset) => {
              setActivePreset(preset);
            }}
          />

          {/* Quick Tools Banner */}
          {onNavigateTools && (
            <div
              onClick={onNavigateTools}
              className="p-4 rounded-3xl bg-gradient-to-r from-brand-50 to-indigo-50 dark:from-slate-900 dark:to-brand-950/40 border border-brand-200/60 dark:border-brand-800/60 cursor-pointer shadow-soft hover:shadow-elevated transition-all flex items-center justify-between group touch-press"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-brand-500 text-white flex items-center justify-center shrink-0">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {t('home.exploreTools')}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t('home.exploreToolsSub')}
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-brand-500 transform group-hover:translate-x-1 transition-transform shrink-0" />
            </div>
          )}

          {/* Monetization / Ad placeholder */}
          <AdPlaceholder className="mt-4" />
        </>
      )}

      {selectedFile && !result && (
        <CompressSettings
          file={selectedFile}
          initialPreset={activePreset}
          onCompress={handleCompress}
          onBack={handleReset}
        />
      )}

      {result && <ResultView result={result} onReset={handleReset} />}

      {/* Animated Loading Modal */}
      <ProgressModal
        isOpen={isCompressing}
        type={selectedFile?.type === 'application/pdf' ? 'pdf' : 'image'}
        progress={compressProgress}
      />
    </div>
  );
};
