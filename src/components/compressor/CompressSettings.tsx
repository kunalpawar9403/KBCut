import React, { useState, useEffect } from 'react';
import { useI18n } from '../../i18n';
import { formatFileSize } from '../../utils/formatters';
import { EXAM_PRESETS, TARGET_SIZE_OPTIONS, ExamPreset } from '../../data/presets';
import { FileText, ArrowLeft, Zap, Sliders, Check } from 'lucide-react';

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

  return (
    <div className="w-full max-w-xl mx-auto space-y-5 animate-in fade-in duration-200">
      {/* Top back bar & file metadata card */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 py-1.5 px-2.5 -ml-2 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          {t('common.back')}
        </button>
      </div>

      {/* Selected File Card */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft flex items-center space-x-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 shrink-0 overflow-hidden flex items-center justify-center border border-slate-200/60 dark:border-slate-700/60">
          {previewUrl ? (
            <img src={previewUrl} alt="File preview" className="w-full h-full object-cover" />
          ) : (
            <FileText className="w-8 h-8 text-brand-500" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-slate-900 dark:text-white truncate">
            {file.name}
          </p>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {t('compress.originalSize')}:
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {formatFileSize(file.size)}
            </span>
          </div>
        </div>
      </div>

      {/* Target Size Chips */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft space-y-4">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-brand-500" />
            {t('compress.targetSize')}
          </label>
          <p className="text-xs text-slate-400 mt-0.5">
            Choose standard size or enter custom limit in KB
          </p>
        </div>

        {/* Chips Grid */}
        <div className="grid grid-cols-4 gap-2">
          {TARGET_SIZE_OPTIONS.map((kb) => {
            const active = selectedKb === kb && !isCustom;
            return (
              <button
                key={kb}
                type="button"
                onClick={() => handleSelectChip(kb)}
                className={`py-3 px-2 rounded-2xl font-bold text-sm text-center transition-all touch-press ${
                  active
                    ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25 scale-[1.02]'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {kb} KB
              </button>
            );
          })}
        </div>

        {/* Custom KB Input */}
        <div className="pt-1">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder={t('compress.enterKb')}
              value={customKb}
              onChange={handleCustomChange}
              onFocus={() => {
                if (customKb) {
                  setIsCustom(true);
                  setSelectedPresetId(null);
                }
              }}
              className={`flex-1 py-3 px-4 rounded-2xl border text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                isCustom
                  ? 'border-brand-500 bg-brand-50/20 dark:bg-brand-950/20 text-brand-700 dark:text-brand-300'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white'
              }`}
            />
            {isCustom && (
              <span className="text-xs font-bold text-brand-600 dark:text-brand-400 px-3 py-1 bg-brand-50 dark:bg-brand-950 rounded-xl">
                Active
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Preset Specifications (Single File Driven) */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          {t('compress.presetLabel')}
        </label>
        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
          {EXAM_PRESETS.map((preset) => {
            const isMatch = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`p-3 rounded-2xl text-left border transition-all touch-press flex flex-col justify-between ${
                  isMatch
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/60 ring-2 ring-brand-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-100 truncate">
                    {preset.name}
                  </span>
                  {isMatch && <Check className="w-3.5 h-3.5 text-brand-500 shrink-0" />}
                </div>
                <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-200/50 dark:border-slate-700/50 text-[10px]">
                  <span className="text-slate-500 dark:text-slate-400">
                    {preset.width && preset.height ? `${preset.width}x${preset.height}px` : 'Standard'}
                  </span>
                  <span className="font-extrabold text-brand-600 dark:text-brand-400">
                    {preset.badge || `< ${preset.targetKb} KB`}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Big Action Compress Button (min 56px height) */}
      <button
        type="button"
        onClick={handleStartCompress}
        className="w-full h-14 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-base tracking-wide shadow-elevated flex items-center justify-center space-x-2 touch-press transition-all focus:outline-none focus:ring-4 focus:ring-brand-500/30"
      >
        <Zap className="w-5 h-5 fill-current" />
        <span>{t('compress.compressBtn')} ({selectedKb} KB)</span>
      </button>
    </div>
  );
};
