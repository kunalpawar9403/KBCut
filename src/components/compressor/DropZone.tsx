import React, { useRef, useState } from 'react';
import { useI18n } from '../../i18n';
import {
  Image,
  FileText,
  Camera,
  Shield,
  Sparkles,
  UploadCloud,
  CheckCircle2,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { EXAM_PRESETS, ExamPreset } from '../../data/presets';

interface DropZoneProps {
  onFileSelected: (file: File, preset?: ExamPreset) => void;
  onPresetClick?: (preset: ExamPreset) => void;
}

export const DropZone: React.FC<DropZoneProps> = ({ onFileSelected, onPresetClick }) => {
  const { t } = useI18n();
  const photoInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelected(e.target.files[0]);
      e.target.value = '';
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`w-full transition-all duration-300 ${
        isDragging ? 'ring-4 ring-brand-500/40 scale-[1.01]' : ''
      }`}
    >
      {/* Hidden native inputs */}
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        ref={pdfInputRef}
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Hero Badge & Headline */}
      <div className="text-center mb-7 pt-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand-50/90 dark:bg-brand-950/80 border border-brand-200/80 dark:border-brand-800/80 text-brand-700 dark:text-brand-300 text-xs font-bold mb-3 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-brand-500" />
          <span>SSC • UPSC • Banking • Passport • Aadhaar</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug sm:leading-tight">
          Make your file{' '}
          <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 dark:from-brand-400 dark:to-indigo-300 bg-clip-text text-transparent">
            under the size limit
          </span>{' '}
          in one tap
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-md mx-auto leading-relaxed">
          {t('app.tagline')} • Fix photo, signature & PDF sizes in seconds. Files stay 100% on your device.
        </p>
      </div>

      {/* Two Mega Action Cards (Photo & PDF) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-7">
        {/* Photo Card */}
        <div className="relative group rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200/80 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-500 shadow-soft hover:shadow-elevated transition-all duration-300 flex flex-col justify-between p-6 card-glow">
          <div className="absolute top-4 right-4">
            <span className="px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 font-bold text-[10px] uppercase tracking-wider">
              Photo / Sign
            </span>
          </div>

          <div
            onClick={() => photoInputRef.current?.click()}
            className="cursor-pointer flex flex-col items-center text-center pt-2"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-500 to-blue-600 text-white flex items-center justify-center mb-3.5 shadow-md shadow-brand-500/25 group-hover:scale-110 transition-transform duration-300">
              <Image className="w-8 h-8" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
              {t('home.selectPhoto')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[220px]">
              {t('home.selectPhotoSub')}
            </p>
          </div>

          {/* Quick Dual Actions: Browse or Direct Camera */}
          <div className="mt-5 grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              className="py-2.5 px-3 rounded-xl bg-brand-50 dark:bg-brand-950/70 hover:bg-brand-100 dark:hover:bg-brand-900 text-brand-700 dark:text-brand-300 font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors touch-press"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Gallery</span>
            </button>
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors touch-press"
            >
              <Camera className="w-3.5 h-3.5 text-brand-500" />
              <span>Camera</span>
            </button>
          </div>
        </div>

        {/* PDF Card */}
        <div className="relative group rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200/80 dark:border-slate-800 hover:border-accent-500 dark:hover:border-accent-500 shadow-soft hover:shadow-elevated transition-all duration-300 flex flex-col justify-between p-6 card-glow">
          <div className="absolute top-4 right-4">
            <span className="px-2 py-0.5 rounded-full bg-accent-50 dark:bg-accent-950 text-accent-700 dark:text-accent-400 font-bold text-[10px] uppercase tracking-wider">
              PDF Document
            </span>
          </div>

          <div
            onClick={() => pdfInputRef.current?.click()}
            className="cursor-pointer flex flex-col items-center text-center pt-2"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-accent-500 to-emerald-600 text-white flex items-center justify-center mb-3.5 shadow-md shadow-accent-500/25 group-hover:scale-110 transition-transform duration-300">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
              {t('home.selectPdf')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[220px]">
              {t('home.selectPdfSub')}
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => pdfInputRef.current?.click()}
              className="w-full py-2.5 px-3 rounded-xl bg-accent-50 dark:bg-accent-950/70 hover:bg-accent-100 dark:hover:bg-accent-900 text-accent-700 dark:text-accent-300 font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors touch-press"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Browse PDF Document</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Presets Carousel with Exam Branding */}
      <div className="mb-7">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            {t('home.quickPresets')}
          </span>
          <span className="text-[11px] font-semibold text-brand-600 dark:text-brand-400">
            One-Tap Auto Fit
          </span>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none -mx-1 px-1">
          {EXAM_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                if (onPresetClick) {
                  onPresetClick(preset);
                } else if (preset.type === 'pdf') {
                  pdfInputRef.current?.click();
                } else {
                  photoInputRef.current?.click();
                }
              }}
              className="shrink-0 flex items-center space-x-2.5 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-brand-500 shadow-sm text-xs font-bold text-slate-800 dark:text-slate-200 transition-all touch-press group"
            >
              <span className="group-hover:text-brand-500 transition-colors">{preset.name}</span>
              <span className="px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 font-extrabold text-[10px] border border-brand-100 dark:border-brand-900">
                {preset.badge || `< ${preset.targetKb} KB`}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Security & Guarantee Strip */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-3xl bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs shadow-sm">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-accent-500 text-white flex items-center justify-center shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 dark:text-white">
              {t('app.privacyBadge')}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {t('app.privacySubtext')}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-[11px] font-bold text-accent-700 dark:text-accent-400 shrink-0">
          <CheckCircle2 className="w-4 h-4 text-accent-500" />
          <span>UIDAI & Exam Portal Compliant</span>
        </div>
      </div>
    </div>
  );
};
