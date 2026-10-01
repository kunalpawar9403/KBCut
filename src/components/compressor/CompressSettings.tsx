import React, { useState, useEffect } from 'react';
import { useI18n } from '../../i18n';
import { formatFileSize } from '../../utils/formatters';
import { EXAM_PRESETS, TARGET_SIZE_OPTIONS, ExamPreset } from '../../data/presets';
import {
  FileText,
  ArrowLeft,
  Zap,
  Sliders,
  Check,
  Plus,
  Minus,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface CompressSettingsProps {
  file: File;
  initialPreset?: ExamPreset;
  onCompress: (targetKb: number, options?: { targetWidth?: number; targetHeight?: number }) => void;
  onBack: () => void;
}

export const CompressSettings: React.FC<CompressSettingsProps> = ({
  file,
  initialPreset,
  onCompress,
  onBack,
}) => {
  const { t } = useI18n();
  const [selectedKb, setSelectedKb] = useState<number>(initialPreset ? initialPreset.targetKb : 50);
  const [customKb, setCustomKb] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(initialPreset?.id || null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

  useEffect(() => {
    if (!isPdf) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file, isPdf]);

  const handleSelectChip = (kb: number) => {
    setSelectedKb(kb);
    setIsCustom(false);
    setSelectedPresetId(null);
  };

  const handleSelectPreset = (preset: ExamPreset) => {
    setSelectedPresetId(preset.id);
    setSelectedKb(preset.targetKb);
    setIsCustom(false);
  };

  const adjustKb = (delta: number) => {
    const next = Math.max(5, Math.min(2000, selectedKb + delta));
    setSelectedKb(next);
    setIsCustom(true);
    setSelectedPresetId(null);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setCustomKb(val);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num > 0) {
      setSelectedKb(num);
      setIsCustom(true);
      setSelectedPresetId(null);
    }
  };

  const handleStartCompress = () => {
    const activePreset = EXAM_PRESETS.find((p) => p.id === selectedPresetId);
    onCompress(selectedKb, {
      targetWidth: activePreset?.width,
      targetHeight: activePreset?.height,
    });
  };

  // Quality indicator calculation inspired by Squoosh
  const getQualityEstimate = () => {
    if (selectedKb >= 150) {
      return { label: 'Ultra Crisp • Ideal for IDs', color: 'text-accent-600 dark:text-accent-400', bg: 'bg-accent-50 dark:bg-accent-950/60' };
    }
    if (selectedKb >= 50) {
      return { label: 'Exam Portal Recommended • Sharp Text', color: 'text-brand-600 dark:text-brand-400', bg: 'bg-brand-50 dark:bg-brand-950/60' };
    }
    return { label: 'Tight Size Limit • Signature / Strict Portal', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/60' };
  };

  const quality = getQualityEstimate();

  return (
    <div className="w-full max-w-xl mx-auto space-y-5 animate-in fade-in duration-300">
      {/* Top back bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-brand-500 py-1.5 px-3 -ml-2 rounded-xl transition-colors bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          <span>{t('common.back')}</span>
        </button>

        <span className="text-xs font-semibold text-slate-500">Step 2 of 3</span>
      </div>

      {/* Selected File Card with High-End Styling */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-soft flex items-center space-x-4">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 shrink-0 overflow-hidden flex items-center justify-center border border-slate-200/80 dark:border-slate-700/80 shadow-inner">
          {previewUrl ? (
            <img src={previewUrl} alt="File preview" className="w-full h-full object-cover" />
          ) : (
            <FileText className="w-9 h-9 text-brand-500" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white truncate">
            {file.name}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              Original: {formatFileSize(file.size)}
            </span>
            <span className="text-[11px] font-semibold text-slate-400 uppercase">
              {isPdf ? 'PDF Document' : 'Photo Image'}
            </span>
          </div>
        </div>
      </div>

      {/* Target Size Interactive Controls (Squoosh & 11zon inspired) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-soft space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-brand-500" />
              <span>{t('compress.targetSize')}</span>
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Set exact maximum file limit in Kilobytes (KB)
            </p>
          </div>

          <div className="text-right">
            <span className="text-2xl font-black text-brand-600 dark:text-brand-400">
              {selectedKb} <span className="text-sm font-bold text-slate-400">KB</span>
            </span>
          </div>
        </div>

        {/* Quick Target Chips */}
        <div className="grid grid-cols-4 gap-2">
          {TARGET_SIZE_OPTIONS.map((kb) => {
            const active = selectedKb === kb && !isCustom && !selectedPresetId;
            return (
              <button
                key={kb}
                type="button"
                onClick={() => handleSelectChip(kb)}
                className={`py-3 px-2 rounded-2xl font-extrabold text-sm text-center transition-all touch-press ${
                  active
                    ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-md shadow-brand-500/25 scale-[1.03] ring-2 ring-brand-500/40'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-transparent'
                }`}
              >
                {kb} KB
              </button>
            );
          })}
        </div>

        {/* Interactive Slider & Stepper Bar */}
        <div className="space-y-3 pt-2">
          <input
            type="range"
            min="10"
            max="1000"
            step="5"
            value={selectedKb}
            onChange={(e) => {
              setSelectedKb(Number(e.target.value));
              setIsCustom(true);
              setSelectedPresetId(null);
            }}
            className="w-full accent-brand-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
          />

          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => adjustKb(-10)}
                className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 touch-press"
              >
                -10
              </button>
              <button
                type="button"
                onClick={() => adjustKb(-5)}
                className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 touch-press"
              >
                -5
              </button>
            </div>

            <div className="flex-1 max-w-[140px]">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder={t('compress.enterKb')}
                value={customKb}
                onChange={handleCustomChange}
                className="w-full py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-center focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => adjustKb(+5)}
                className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 touch-press"
              >
                +5
              </button>
              <button
                type="button"
                onClick={() => adjustKb(+10)}
                className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 touch-press"
              >
                +10
              </button>
            </div>
          </div>
        </div>

        {/* Quality Meter Badge */}
        <div className={`p-3 rounded-2xl ${quality.bg} flex items-center justify-between text-xs`}>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-brand-500 shrink-0" />
            <span className={`font-extrabold ${quality.color}`}>{quality.label}</span>
          </div>
          <span className="text-[10px] font-bold text-slate-400">Strictly ≤ {selectedKb} KB</span>
        </div>
      </div>

      {/* Preset Specifications Grid */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-soft space-y-3">
        <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
          {t('compress.presetLabel')}
        </label>
        <div className="grid grid-cols-2 gap-2.5 max-h-52 overflow-y-auto pr-1">
          {EXAM_PRESETS.map((preset) => {
            const isMatch = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`p-3.5 rounded-2xl text-left border transition-all touch-press flex flex-col justify-between ${
                  isMatch
                    ? 'border-brand-500 bg-brand-50/80 dark:bg-brand-950/70 ring-2 ring-brand-500/25 shadow-sm'
                    : 'border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                    {preset.name}
                  </span>
                  {isMatch && <Check className="w-4 h-4 text-brand-500 shrink-0" />}
                </div>
                <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-200/60 dark:border-slate-700/60 text-[10px]">
                  <span className="text-slate-500 dark:text-slate-400">
                    {preset.width && preset.height ? `${preset.width}x${preset.height}px` : 'Standard'}
                  </span>
                  <span className="font-black text-brand-600 dark:text-brand-400">
                    {preset.badge || `< ${preset.targetKb} KB`}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mega Action Compress Button (min 56px height) */}
      <button
        type="button"
        onClick={handleStartCompress}
        className="w-full h-14 rounded-2xl bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-black text-base tracking-wide shadow-elevated flex items-center justify-center space-x-2.5 touch-press transition-all animate-shimmer focus:outline-none focus:ring-4 focus:ring-brand-500/30"
      >
        <Zap className="w-5 h-5 fill-current" />
        <span>{t('compress.compressBtn')} ({selectedKb} KB)</span>
      </button>
    </div>
  );
};
