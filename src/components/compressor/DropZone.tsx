import React, { useRef, useState } from 'react';
import { useI18n } from '../../i18n';
import { Image, FileText, Camera, Shield, Sparkles } from 'lucide-react';
import { EXAM_PRESETS, ExamPreset } from '../../data/presets';

interface DropZoneProps {
  onFileSelected: (file: File, preset?: ExamPreset) => void;
  onPresetClick?: (preset: ExamPreset) => void;
}

export const DropZone: React.FC<DropZoneProps> = ({ onFileSelected, onPresetClick }) => {
  const { t } = useI18n();
  const photoInputRef = useRef<HTMLInputElement>(null);
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
      e.target.value = ''; // Reset for re-selection
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`w-full transition-all duration-200 ${
        isDragging ? 'ring-4 ring-brand-500/30 scale-[1.01]' : ''
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
        ref={pdfInputRef}
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Main Headline */}
      <div className="text-center mb-6 pt-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
          {t('app.homeHeadline')}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
          {t('app.tagline')} • {t('app.subtagline')}
        </p>
      </div>

      {/* Two Big Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Photo Card */}
        <button
          type="button"
          onClick={() => photoInputRef.current?.click()}
          className="group relative flex flex-col items-center justify-center p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border-2 border-brand-500/20 dark:border-brand-500/30 hover:border-brand-500 dark:hover:border-brand-500 shadow-soft hover:shadow-elevated transition-all touch-press min-h-[170px] text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-3.5 group-hover:scale-110 transition-transform">
            <Image className="w-8 h-8" />
          </div>
          <span className="font-bold text-lg text-slate-900 dark:text-white">
            {t('home.selectPhoto')}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
            <Camera className="w-3.5 h-3.5" />
            {t('home.selectPhotoSub')}
          </span>
        </button>

        {/* PDF Card */}
        <button
          type="button"
          onClick={() => pdfInputRef.current?.click()}
          className="group relative flex flex-col items-center justify-center p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border-2 border-accent-500/20 dark:border-accent-500/30 hover:border-accent-500 dark:hover:border-accent-500 shadow-soft hover:shadow-elevated transition-all touch-press min-h-[170px] text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-accent-50 dark:bg-accent-950/80 text-accent-600 dark:text-accent-400 flex items-center justify-center mb-3.5 group-hover:scale-110 transition-transform">
            <FileText className="w-8 h-8" />
          </div>
          <span className="font-bold text-lg text-slate-900 dark:text-white">
            {t('home.selectPdf')}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('home.selectPdfSub')}
          </span>
        </button>
      </div>

      {/* Quick Presets Row */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            {t('home.quickPresets')}
          </span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-1 px-1">
          {EXAM_PRESETS.slice(0, 5).map((preset) => (
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
              className="shrink-0 flex items-center space-x-2 px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500 shadow-sm text-xs font-semibold text-slate-700 dark:text-slate-200 touch-press"
            >
              <span>{preset.name}</span>
              <span className="px-1.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 font-bold text-[10px]">
                {preset.badge || `< ${preset.targetKb} KB`}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Security & Privacy Guarantee Callout */}
      <div className="flex items-center justify-center space-x-2 py-3 px-4 rounded-2xl bg-accent-50/70 dark:bg-accent-950/40 border border-accent-200/60 dark:border-accent-900/60 text-accent-900 dark:text-accent-300 text-xs text-center font-medium">
        <Shield className="w-4 h-4 shrink-0 text-accent-600 dark:text-accent-400" />
        <span>{t('app.privacyBadge')}</span>
        <span className="hidden sm:inline">•</span>
        <span className="hidden sm:inline text-accent-700 dark:text-accent-400">{t('app.privacySubtext')}</span>
      </div>
    </div>
  );
};
