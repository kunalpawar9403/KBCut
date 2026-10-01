import React, { useState } from 'react';
import { DropZone } from '../components/compressor/DropZone';
import { CompressSettings } from '../components/compressor/CompressSettings';
import { ProgressModal } from '../components/compressor/ProgressModal';
import { ResultView } from '../components/compressor/ResultView';
import { AdPlaceholder } from '../components/common/AdPlaceholder';
import { ExamPreset, EXAM_PRESETS } from '../data/presets';
import { compressionService, UnifiedCompressResult } from '../services/compressionService';
import { toast } from '../components/common/Toast';
import { useI18n } from '../i18n';
import {
  Wrench,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles,
  Camera,
  FileCheck,
  Cpu,
  HelpCircle,
  Download,
  Smartphone,
} from 'lucide-react';
import { DownloadAppModal } from '../components/common/DownloadAppModal';
import { getApkDownloadUrl } from '../utils/formatters';

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
  const [showDownloadModal, setShowDownloadModal] = useState<boolean>(false);

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
    <div className="w-full space-y-16 pb-12">
      {/* 1. Main Hero & Compressor Studio */}
      <section className="relative w-full">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-72 bg-gradient-to-b from-brand-500/15 via-accent-500/10 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="w-full max-w-xl mx-auto space-y-6">
          {!selectedFile && !result && (
            <DropZone
              onFileSelected={handleFileSelected}
              onPresetClick={(preset) => {
                setActivePreset(preset);
              }}
            />
          )}

          {selectedFile && !result && (
            <CompressSettings
              file={selectedFile}
              initialPreset={activePreset}
              onCompress={handleCompress}
              onBack={handleReset}
            />
          )}

          {result && (
            <ResultView
              result={result}
              onReset={handleReset}
              onNavigateTools={onNavigateTools}
            />
          )}

          {/* Quick Ad Placement */}
          <AdPlaceholder className="mt-4" />
        </div>
      </section>

      {/* 2. How It Works (3 Simple Steps) Section */}
      <section id="how-it-works" className="w-full max-w-4xl mx-auto px-2 scroll-mt-24">
        <div className="text-center mb-8">
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/80 px-3 py-1 rounded-full border border-brand-200 dark:border-brand-800">
            How It Works
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            Get under the limit in 3 easy steps
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
            Engineered so your application never gets rejected due to incorrect file size or blur.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Step 1 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-soft relative overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center font-black text-sm mb-4 border border-brand-200/60 dark:border-brand-800/60">
              01
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Select Photo or PDF
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Snap a fresh photo from your phone camera, pick a certificate image, or choose a multi-page PDF document.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-soft relative overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-accent-50 dark:bg-accent-950 text-accent-600 dark:text-accent-400 flex items-center justify-center font-black text-sm mb-4 border border-accent-200/60 dark:border-accent-800/60">
              02
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Pick Exam Preset or Target KB
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Tap your exam specification (SSC 50KB, Signature 140x60, Aadhaar 200KB) or enter any custom target KB.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-soft relative overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-sm mb-4 border border-indigo-200/60 dark:border-indigo-800/60">
              03
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Instant Download & Submit
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Our binary-search engine lands strictly under the target limit while keeping text and facial details razor sharp.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Supported Exam Portals Showcase */}
      <section id="supported-exams" className="w-full max-w-4xl mx-auto px-2 scroll-mt-24">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-brand-50/70 via-white to-blue-50/70 dark:from-slate-900 dark:via-slate-900 dark:to-brand-950/30 border border-brand-200/70 dark:border-brand-800/70 shadow-soft">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                Official Standards
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                Official Exam & Government Specifications
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">Click to pre-fill</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {EXAM_PRESETS.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  setActivePreset(p);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 hover:border-brand-500 transition-all cursor-pointer touch-press shadow-sm"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                    {p.name}
                  </span>
                  <span className="px-1.5 py-0.2 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 font-black text-[10px]">
                    {p.badge}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 truncate">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Download Android App / APK Banner */}
      <section id="download-app" className="w-full max-w-4xl mx-auto px-2 scroll-mt-24">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-indigo-800 text-white shadow-elevated relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 text-white font-extrabold text-xs backdrop-blur-sm border border-white/20">
                  <Smartphone className="w-3.5 h-3.5 text-accent-300" />
                  <span>Official Android App</span>
                </span>
                <span className="text-xs font-bold text-brand-200">v1.0.0 • 14 MB</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                Download KBCut Android App (.APK)
              </h3>

              <p className="text-xs sm:text-sm text-brand-100 leading-relaxed">
                Resize exam photos and certificates anytime, anywhere — even with zero internet. Direct Android install, no Google Play Store account required.
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-semibold text-brand-200">
                <span className="px-2.5 py-1 rounded-lg bg-black/20 backdrop-blur-sm">⚡ 100% Offline</span>
                <span className="px-2.5 py-1 rounded-lg bg-black/20 backdrop-blur-sm">🔒 Zero Cloud Uploads</span>
                <span className="px-2.5 py-1 rounded-lg bg-black/20 backdrop-blur-sm">📱 Android 8.0+</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
              <a
                href={getApkDownloadUrl()}
                download="kbcut-app.apk"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-4 rounded-2xl bg-white hover:bg-slate-100 active:bg-slate-200 text-brand-700 font-black text-sm flex items-center justify-center space-x-2.5 shadow-lg touch-press transition-all"
              >
                <Download className="w-5 h-5 text-brand-600 animate-bounce" />
                <span>Download APK (14 MB)</span>
              </a>

              <button
                type="button"
                onClick={() => setShowDownloadModal(true)}
                className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-xs flex items-center justify-center space-x-2 touch-press transition-all"
              >
                <Smartphone className="w-4 h-4 text-accent-300" />
                <span>Installation Guide & PWA</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Complete Document Tools Callout */}
      <section className="w-full max-w-4xl mx-auto px-2">
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white shadow-elevated relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-lg">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand-500/30 text-brand-300 font-extrabold text-xs border border-brand-400/30">
                <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                <span>More Than Just A Compressor</span>
              </span>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                All-in-One Exam Document Toolkit
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Need to put your Aadhaar front & back on 1 page? Want to sign a PDF on your phone? Or combine passport photo + signature? We built dedicated tools for exam applicants.
              </p>
            </div>

            <button
              onClick={onNavigateTools}
              className="px-6 py-4 rounded-2xl bg-brand-500 hover:bg-brand-400 text-white font-black text-sm flex items-center justify-center space-x-2 shadow-elevated touch-press shrink-0 transition-colors"
            >
              <span>Explore All 6 Tools</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. Privacy & Architecture Guarantee */}
      <section className="w-full max-w-4xl mx-auto px-2">
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-soft">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-accent-50 dark:bg-accent-950 text-accent-600 dark:text-accent-400 flex items-center justify-center">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                100% Private By Architecture
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Why your personal documents are safer with KBCut than other sites
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 dark:text-slate-300">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1.5">
              <h4 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-accent-500" />
                <span>Zero Server Uploads</span>
              </h4>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                Your Aadhaar card, PAN, marksheets, and signatures are processed inside your device browser memory. Files are never sent across the internet.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1.5">
              <h4 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-accent-500" />
                <span>Never Exceeds Target</span>
              </h4>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                Exam portals reject files that are even 1 KB over the limit. KBCut uses strict binary search validation to ensure the output is always under the limit.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1.5">
              <h4 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-accent-500" />
                <span>No Accounts, No Tracking</span>
              </h4>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                No phone number required, no OTP, no email spam. Open the app, get your file under the limit, and submit your exam form.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Modal */}
      <ProgressModal
        isOpen={isCompressing}
        type={selectedFile?.type === 'application/pdf' ? 'pdf' : 'image'}
        progress={compressProgress}
      />

      {/* Download App Modal */}
      <DownloadAppModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
      />
    </div>
  );
};
