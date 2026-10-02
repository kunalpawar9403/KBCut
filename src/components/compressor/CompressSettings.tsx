import React, { useState, useEffect, useMemo } from 'react';
import { useI18n } from '../../i18n';
import { formatFileSize } from '../../utils/formatters';
import { EXAM_PRESETS, ExamPreset } from '../../data/presets';
import {
  DimensionUnit,
  DPI_OPTIONS,
  DEFAULT_DPI,
  convertDimension,
  resolveToPx,
} from '../../utils/dimensionUnits';
import { ImageCropRect } from '../../utils/imageCompressor';
import { CropModal } from './CropModal';
import {
  FileText,
  ArrowLeft,
  Zap,
  Sliders,
  Check,
  Sparkles,
  Link,
  Unlink,
  Crop,
  AlertTriangle,
  CheckCircle2,
  FileImage,
  Layers,
} from 'lucide-react';

interface CompressSettingsProps {
  file: File;
  initialPreset?: ExamPreset;
  onCompress: (
    targetKb: number,
    options?: {
      targetWidth?: number;
      targetHeight?: number;
      maintainAspectRatio?: boolean;
      mimeType?: 'image/jpeg' | 'image/png' | 'image/webp';
      cropRect?: ImageCropRect;
      dpi?: number;
      unit?: DimensionUnit;
    }
  ) => void;
  onBack: () => void;
}

export const CompressSettings: React.FC<CompressSettingsProps> = ({
  file,
  initialPreset,
  onCompress,
  onBack,
}) => {
  const { t } = useI18n();
  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

  // Mode: 'preset' (Exam Presets) vs 'custom' (Custom Resize)
  const [activeMode, setActiveMode] = useState<'preset' | 'custom'>(
    initialPreset ? 'preset' : 'custom'
  );
  const [selectedPreset, setSelectedPreset] = useState<ExamPreset | null>(
    initialPreset || null
  );

  // Dimension Unit: 'px' | 'cm' | 'mm'
  const [unit, setUnit] = useState<DimensionUnit>(
    initialPreset?.unit || 'px'
  );

  // DPI (only for CM / MM)
  const [dpi, setDpi] = useState<number>(initialPreset?.dpi || DEFAULT_DPI);
  const [isCustomDpi, setIsCustomDpi] = useState<boolean>(false);
  const [customDpiInput, setCustomDpiInput] = useState<string>('300');

  // Editable Width & Height inputs
  const initialW = initialPreset?.width ? String(initialPreset.width) : '';
  const initialH = initialPreset?.height ? String(initialPreset.height) : '';
  const [widthInput, setWidthInput] = useState<string>(initialW);
  const [heightInput, setHeightInput] = useState<string>(initialH);

  // Aspect ratio lock
  const [lockAspectRatio, setLockAspectRatio] = useState<boolean>(true);
  const [aspectRatio, setAspectRatio] = useState<number>(
    initialPreset?.width && initialPreset?.height
      ? initialPreset.width / initialPreset.height
      : 1
  );

  // Target File Size section: 'max' vs 'nolimit'
  const [sizeMode, setSizeMode] = useState<'max' | 'nolimit'>('max');
  const [selectedKb, setSelectedKb] = useState<number>(
    initialPreset ? initialPreset.targetKb : 50
  );
  const [customKbInput, setCustomKbInput] = useState<string>('');
  const [isCustomKb, setIsCustomKb] = useState<boolean>(false);

  // Format selector: 'image/jpeg' | 'image/png' | 'image/webp'
  const [format, setFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>(
    initialPreset?.recommendedFormat || 'image/jpeg'
  );

  // Preview & Crop states
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [croppedPreviewUrl, setCroppedPreviewUrl] = useState<string | null>(null);
  const [appliedCropRect, setAppliedCropRect] = useState<ImageCropRect | undefined>(undefined);
  const [isCropModalOpen, setIsCropModalOpen] = useState<boolean>(false);
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(
    null
  );

  // Load preview and natural dimensions on mount
  useEffect(() => {
    if (!isPdf) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({ width: img.naturalWidth, height: img.naturalHeight });
        // If no preset was explicitly passed, populate with original natural dimensions
        if (!initialPreset) {
          setWidthInput(String(img.naturalWidth));
          setHeightInput(String(img.naturalHeight));
          setAspectRatio(img.naturalWidth / img.naturalHeight);
        }
      };
      img.src = url;

      return () => URL.revokeObjectURL(url);
    }
  }, [file, isPdf, initialPreset]);

  // Derived resolved pixel dimensions
  const numW = parseFloat(widthInput) || 0;
  const numH = parseFloat(heightInput) || 0;
  const resolvedPxWidth = useMemo(() => resolveToPx(numW, unit, dpi), [numW, unit, dpi]);
  const resolvedPxHeight = useMemo(() => resolveToPx(numH, unit, dpi), [numH, unit, dpi]);

  // Preset match detection: has the user customized official preset values?
  const isPresetCustomized = useMemo(() => {
    if (!selectedPreset) return true;

    // Check width & height
    const presetPxW = selectedPreset.width;
    const presetPxH = selectedPreset.height;
    if (presetPxW && Math.abs(resolvedPxWidth - presetPxW) > 2) return true;
    if (presetPxH && Math.abs(resolvedPxHeight - presetPxH) > 2) return true;

    // Check size limit
    if (sizeMode === 'nolimit') return true;
    if (selectedKb !== selectedPreset.targetKb) return true;

    return false;
  }, [selectedPreset, resolvedPxWidth, resolvedPxHeight, sizeMode, selectedKb]);

  // Preset Selection handler
  const handleSelectPreset = (preset: ExamPreset) => {
    setSelectedPreset(preset);
    setActiveMode('preset');

    const targetUnit = preset.unit || 'px';
    const targetDpi = preset.dpi || 300;
    setUnit(targetUnit);
    setDpi(targetDpi);
    setCustomDpiInput(String(targetDpi));
    setIsCustomDpi(false);

    if (preset.width && preset.height) {
      let displayW = preset.width;
      let displayH = preset.height;
      if (targetUnit !== 'px') {
        displayW = convertDimension(preset.width, 'px', targetUnit, targetDpi);
        displayH = convertDimension(preset.height, 'px', targetUnit, targetDpi);
      }
      setWidthInput(String(displayW));
      setHeightInput(String(displayH));
      setAspectRatio(preset.width / preset.height);
      setLockAspectRatio(true);
    }

    setSizeMode('max');
    setSelectedKb(preset.targetKb);
    setCustomKbInput('');
    setIsCustomKb(false);

    if (preset.recommendedFormat) {
      setFormat(preset.recommendedFormat);
    } else {
      setFormat('image/jpeg');
    }
  };

  // Unit Switching with exact physical size preservation
  const handleUnitChange = (newUnit: DimensionUnit) => {
    if (newUnit === unit) return;

    if (numW > 0 && numH > 0) {
      const convertedW = convertDimension(numW, unit, newUnit, dpi);
      const convertedH = convertDimension(numH, unit, newUnit, dpi);
      setWidthInput(String(convertedW));
      setHeightInput(String(convertedH));
    }
    setUnit(newUnit);
  };

  // Width change handler (respects Lock Aspect Ratio)
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valStr = e.target.value.replace(/[^0-9.]/g, '');
    setWidthInput(valStr);
    const val = parseFloat(valStr);

    if (lockAspectRatio && val > 0 && aspectRatio > 0) {
      const calculatedH = val / aspectRatio;
      if (unit === 'px') {
        setHeightInput(String(Math.round(calculatedH)));
      } else if (unit === 'cm') {
        setHeightInput(calculatedH.toFixed(2));
      } else {
        setHeightInput(calculatedH.toFixed(1));
      }
    }
  };

  // Height change handler (respects Lock Aspect Ratio)
  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valStr = e.target.value.replace(/[^0-9.]/g, '');
    setHeightInput(valStr);
    const val = parseFloat(valStr);

    if (lockAspectRatio && val > 0 && aspectRatio > 0) {
      const calculatedW = val * aspectRatio;
      if (unit === 'px') {
        setWidthInput(String(Math.round(calculatedW)));
      } else if (unit === 'cm') {
        setWidthInput(calculatedW.toFixed(2));
      } else {
        setWidthInput(calculatedW.toFixed(1));
      }
    }
  };

  // Toggle aspect ratio lock
  const handleToggleLock = () => {
    const nextLock = !lockAspectRatio;
    setLockAspectRatio(nextLock);
    if (nextLock && numW > 0 && numH > 0) {
      setAspectRatio(numW / numH);
    }
  };

  // DPI change handlers
  const handleSelectDpi = (val: number) => {
    setDpi(val);
    setCustomDpiInput(String(val));
    setIsCustomDpi(false);
  };

  const handleCustomDpiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valStr = e.target.value.replace(/[^0-9]/g, '');
    setCustomDpiInput(valStr);
    const num = parseInt(valStr, 10);
    if (!isNaN(num) && num > 0) {
      setDpi(num);
    }
  };

  // Target KB selection & adjustment
  const handleSelectKbChip = (kb: number) => {
    setSelectedKb(kb);
    setSizeMode('max');
    setIsCustomKb(false);
    setCustomKbInput('');
  };

  const handleCustomKbChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setCustomKbInput(val);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num > 0) {
      setSelectedKb(num);
      setSizeMode('max');
      setIsCustomKb(true);
    }
  };

  const adjustKb = (delta: number) => {
    const next = Math.max(5, Math.min(3000, selectedKb + delta));
    setSelectedKb(next);
    setSizeMode('max');
    setIsCustomKb(true);
    setCustomKbInput(String(next));
  };

  // Start Compression Execution
  const handleStartCompress = () => {
    const targetKb = sizeMode === 'nolimit' ? 0 : selectedKb;
    onCompress(targetKb, {
      targetWidth: resolvedPxWidth > 0 ? resolvedPxWidth : undefined,
      targetHeight: resolvedPxHeight > 0 ? resolvedPxHeight : undefined,
      maintainAspectRatio: false, // exact target crop/resize
      mimeType: format,
      cropRect: appliedCropRect,
      dpi: unit !== 'px' ? dpi : undefined,
      unit,
    });
  };

  // Quality estimate for target file size
  const getQualityEstimate = () => {
    if (sizeMode === 'nolimit') {
      return {
        label: 'Lossless / Maximum Fidelity • No File Size Limit',
        color: 'text-indigo-600 dark:text-indigo-400',
        bg: 'bg-indigo-50 dark:bg-indigo-950/60',
      };
    }
    if (selectedKb >= 150) {
      return {
        label: 'Ultra Crisp • Ideal for IDs & Certificates',
        color: 'text-accent-600 dark:text-accent-400',
        bg: 'bg-accent-50 dark:bg-accent-950/60',
      };
    }
    if (selectedKb >= 50) {
      return {
        label: 'Exam Portal Recommended • Sharp Facial Features',
        color: 'text-brand-600 dark:text-brand-400',
        bg: 'bg-brand-50 dark:bg-brand-950/60',
      };
    }
    return {
      label: 'Strict Size Limit • Micro Signature / Thumbnail',
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/60',
    };
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

      {/* Selected File Card & Quick Crop CTA */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-soft flex items-center justify-between gap-3">
        <div className="flex items-center space-x-3.5 min-w-0">
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 shrink-0 overflow-hidden flex items-center justify-center border border-slate-200/80 dark:border-slate-700/80 shadow-inner">
            {croppedPreviewUrl || previewUrl ? (
              <img
                src={croppedPreviewUrl || previewUrl || ''}
                alt="File preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <FileText className="w-8 h-8 text-brand-500" />
            )}
          </div>

          <div className="min-w-0">
            <p className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white truncate">
              {file.name}
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {formatFileSize(file.size)}
              </span>
              {originalDimensions && (
                <span className="text-[11px] font-semibold text-slate-400">
                  {originalDimensions.width} × {originalDimensions.height} px
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Interactive Crop / Framing Button */}
        {!isPdf && (
          <button
            type="button"
            onClick={() => setIsCropModalOpen(true)}
            className="py-2 px-3 rounded-2xl border border-brand-200 dark:border-brand-800 bg-brand-50/80 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 hover:bg-brand-100 dark:hover:bg-brand-900 text-xs font-bold flex items-center space-x-1.5 shrink-0 touch-press transition-colors shadow-sm"
          >
            <Crop className="w-3.5 h-3.5" />
            <span>Crop & Frame</span>
          </button>
        )}
      </div>

      {/* Two Clear Modes: [ Exam Presets ] [ Custom Resize ] */}
      <div className="p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 flex items-center">
        <button
          type="button"
          onClick={() => setActiveMode('preset')}
          className={`flex-1 py-2.5 px-3 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all touch-press ${
            activeMode === 'preset'
              ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-md ring-1 ring-slate-900/5'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Exam Presets</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMode('custom')}
          className={`flex-1 py-2.5 px-3 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all touch-press ${
            activeMode === 'custom'
              ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-md ring-1 ring-slate-900/5'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Custom Resize</span>
        </button>
      </div>

      {/* Mode 1: Exam Presets Grid & Specifications */}
      {activeMode === 'preset' && (
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
              Official Exam & Govt Presets
            </label>
            <span className="text-[11px] text-slate-400 font-medium">Click to pre-fill</span>
          </div>

          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
            {EXAM_PRESETS.map((preset) => {
              const isMatch = selectedPreset?.id === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-3 rounded-2xl text-left border transition-all touch-press flex flex-col justify-between ${
                    isMatch
                      ? 'border-brand-500 bg-brand-50/80 dark:bg-brand-950/70 ring-2 ring-brand-500/25 shadow-sm'
                      : 'border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                      {preset.name}
                    </span>
                    {isMatch && <Check className="w-3.5 h-3.5 text-brand-500 shrink-0" />}
                  </div>
                  <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-slate-200/60 dark:border-slate-700/60 text-[10px]">
                    <span className="text-slate-500 dark:text-slate-400">
                      {preset.width && preset.height ? `${preset.width}×${preset.height} px` : 'Custom'}
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
      )}

      {/* Preset Status Indicator Banner */}
      {selectedPreset && (
        <div
          className={`p-3.5 rounded-2xl border transition-all flex items-start space-x-2.5 text-xs ${
            !isPresetCustomized
              ? 'bg-brand-50/70 dark:bg-brand-950/50 border-brand-200 dark:border-brand-800/70 text-brand-900 dark:text-brand-200'
              : 'bg-amber-50/80 dark:bg-amber-950/50 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
          }`}
        >
          {!isPresetCustomized ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold block">
                  Official preset ({selectedPreset.name}) — values can be customized
                </span>
                <span className="text-[11px] text-brand-700 dark:text-brand-300">
                  Default: {selectedPreset.width} × {selectedPreset.height} px • &le; {selectedPreset.targetKb} KB. You can edit any value below.
                </span>
              </div>
            </>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold block">
                  Custom dimensions — this no longer matches the selected preset.
                </span>
                <span className="text-[11px] text-amber-700 dark:text-amber-300">
                  Customized dimensions or size limits may not satisfy official {selectedPreset.name} requirements.
                </span>
              </div>
            </>
          )}
        </div>
      )}

      {/* 2. Custom Dimension Editor (PX / CM / MM) */}
      {!isPdf && (
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-brand-500" />
                <span>Dimension & Scaling</span>
              </label>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Freely enter and switch between PX, CM, and MM
              </p>
            </div>

            {/* Dimension Unit Segmented Control: [ PX ] [ CM ] [ MM ] */}
            <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200/80 dark:border-slate-700">
              {(['px', 'cm', 'mm'] as DimensionUnit[]).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => handleUnitChange(u)}
                  className={`py-1 px-3 rounded-lg text-xs font-black uppercase transition-all touch-press ${
                    unit === u
                      ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          {/* Width & Height Inputs Row */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            {/* Width Input */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>Width ({unit.toUpperCase()})</span>
                {unit !== 'px' && (
                  <span className="text-[10px] text-slate-400">≈ {resolvedPxWidth} px</span>
                )}
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  value={widthInput}
                  onChange={handleWidthChange}
                  placeholder={`Width in ${unit}`}
                  className="w-full py-2.5 px-3.5 pr-10 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-extrabold focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 uppercase pointer-events-none">
                  {unit}
                </span>
              </div>
            </div>

            {/* Height Input */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>Height ({unit.toUpperCase()})</span>
                {unit !== 'px' && (
                  <span className="text-[10px] text-slate-400">≈ {resolvedPxHeight} px</span>
                )}
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  value={heightInput}
                  onChange={handleHeightChange}
                  placeholder={`Height in ${unit}`}
                  className="w-full py-2.5 px-3.5 pr-10 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-extrabold focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 uppercase pointer-events-none">
                  {unit}
                </span>
              </div>
            </div>
          </div>

          {/* Aspect Ratio Lock & Live Equivalent Summary */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleToggleLock}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all touch-press border ${
                lockAspectRatio
                  ? 'bg-brand-50 dark:bg-brand-950/80 border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              {lockAspectRatio ? (
                <>
                  <Link className="w-3.5 h-3.5" />
                  <span>Lock Aspect Ratio ({aspectRatio ? aspectRatio.toFixed(2) : '1'}:1)</span>
                </>
              ) : (
                <>
                  <Unlink className="w-3.5 h-3.5" />
                  <span>Free Dimensions (Unlocked)</span>
                </>
              )}
            </button>

            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              Output: <strong className="text-slate-800 dark:text-slate-200">{resolvedPxWidth} × {resolvedPxHeight} PX</strong>
            </span>
          </div>

          {/* DPI Section: ONLY shown when CM or MM is selected */}
          {(unit === 'cm' || unit === 'mm') && (
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-2.5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <span>DPI Resolution</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    (Standard for print / exam photos: 300)
                  </span>
                </label>
                <span className="text-xs font-black text-brand-600 dark:text-brand-400">
                  {dpi} DPI
                </span>
              </div>

              {/* DPI Selector: [ 72 ] [ 96 ] [ 150 ] [ 200 ] [ 300 ] [ Custom ] */}
              <div className="flex flex-wrap items-center gap-1.5">
                {DPI_OPTIONS.map((opt) => {
                  const active = dpi === opt && !isCustomDpi;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleSelectDpi(opt)}
                      className={`py-1 px-2.5 rounded-xl text-xs font-extrabold transition-all touch-press ${
                        active
                          ? 'bg-brand-500 text-white shadow-sm'
                          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => setIsCustomDpi(true)}
                  className={`py-1 px-2.5 rounded-xl text-xs font-extrabold transition-all touch-press ${
                    isCustomDpi
                      ? 'bg-brand-500 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  Custom
                </button>

                {isCustomDpi && (
                  <div className="w-20 ml-1">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={customDpiInput}
                      onChange={handleCustomDpiChange}
                      placeholder="DPI"
                      className="w-full py-1 px-2 rounded-xl border border-slate-300 dark:border-slate-600 text-xs font-bold text-center focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Independent Target File Size Compression Section */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-brand-500" />
              <span>Target File Size</span>
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select exact file limit or preserve maximum quality
            </p>
          </div>

          {/* Size Mode Switcher: [ Maximum KB ] [ No Limit ] */}
          <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200/80 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setSizeMode('max')}
              className={`py-1 px-2.5 rounded-lg text-xs font-bold transition-all touch-press ${
                sizeMode === 'max'
                  ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Maximum KB
            </button>
            <button
              type="button"
              onClick={() => setSizeMode('nolimit')}
              className={`py-1 px-2.5 rounded-lg text-xs font-bold transition-all touch-press ${
                sizeMode === 'nolimit'
                  ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              No Limit
            </button>
          </div>
        </div>

        {sizeMode === 'max' ? (
          <>
            {/* Quick KB Chips: 10, 20, 50, 100, 200, 500, Custom */}
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
              {[10, 20, 50, 100, 200, 500].map((kb) => {
                const active = selectedKb === kb && !isCustomKb;
                return (
                  <button
                    key={kb}
                    type="button"
                    onClick={() => handleSelectKbChip(kb)}
                    className={`py-2 px-1 rounded-xl font-extrabold text-xs text-center transition-all touch-press ${
                      active
                        ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-md shadow-brand-500/25 scale-[1.02] ring-2 ring-brand-500/40'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-transparent'
                    }`}
                  >
                    {kb} KB
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => setIsCustomKb(true)}
                className={`py-2 px-1 rounded-xl font-extrabold text-xs text-center transition-all touch-press ${
                  isCustomKb
                    ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 border border-transparent'
                }`}
              >
                Custom
              </button>
            </div>

            {/* Stepper + Manual Entry */}
            <div className="space-y-3 pt-1">
              <input
                type="range"
                min="5"
                max="1000"
                step="5"
                value={selectedKb}
                onChange={(e) => {
                  setSelectedKb(Number(e.target.value));
                  setIsCustomKb(true);
                  setCustomKbInput(e.target.value);
                }}
                className="w-full accent-brand-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
              />

              <div className="flex items-center justify-between gap-2">
                <div className="flex gap-1">
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

                <div className="flex-1 max-w-[140px] relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter KB"
                    value={customKbInput || selectedKb}
                    onChange={handleCustomKbChange}
                    className="w-full py-1.5 px-3 pr-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-black text-center focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">
                    KB
                  </span>
                </div>

                <div className="flex gap-1">
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

            {/* Quality badge */}
            <div className={`p-3 rounded-2xl ${quality.bg} flex items-center justify-between text-xs`}>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-brand-500 shrink-0" />
                <span className={`font-extrabold ${quality.color}`}>{quality.label}</span>
              </div>
              <span className="text-[10px] font-black text-slate-500 dark:text-slate-400">
                Limit &le; {selectedKb} KB
              </span>
            </div>
          </>
        ) : (
          <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-200 space-y-1">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span className="font-extrabold">No File Size Limit Mode</span>
            </div>
            <p className="text-[11px] text-indigo-700 dark:text-indigo-300 leading-relaxed">
              Image will be resized and cropped to your exact dimensions ({resolvedPxWidth} × {resolvedPxHeight} px) with pristine visual quality and zero artificial degradation.
            </p>
          </div>
        )}
      </div>

      {/* 4. Format Selector */}
      {!isPdf && (
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-soft flex items-center justify-between gap-3">
          <div>
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <FileImage className="w-4 h-4 text-brand-500" />
              <span>Format</span>
            </label>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {format === 'image/jpeg' ? 'Standard for exam & govt portals' : 'Custom image encoding'}
            </p>
          </div>

          <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200/80 dark:border-slate-700">
            {[
              { label: 'JPG / JPEG', value: 'image/jpeg' },
              { label: 'PNG', value: 'image/png' },
              { label: 'WEBP', value: 'image/webp' },
            ].map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFormat(f.value as any)}
                className={`py-1.5 px-3 rounded-lg text-xs font-extrabold transition-all touch-press ${
                  format === f.value
                    ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Primary Action Button */}
      <button
        type="button"
        onClick={handleStartCompress}
        className="w-full h-14 rounded-2xl bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-black text-base tracking-wide shadow-elevated flex items-center justify-center space-x-2.5 touch-press transition-all animate-shimmer focus:outline-none focus:ring-4 focus:ring-brand-500/30"
      >
        <Zap className="w-5 h-5 fill-current" />
        <span>
          Resize & Compress ({sizeMode === 'nolimit' ? 'No Limit' : `${selectedKb} KB`})
        </span>
      </button>

      {/* Crop Modal */}
      {!isPdf && (
        <CropModal
          isOpen={isCropModalOpen}
          file={file}
          targetWidth={resolvedPxWidth > 0 ? resolvedPxWidth : 200}
          targetHeight={resolvedPxHeight > 0 ? resolvedPxHeight : 230}
          onApplyCrop={(cropRect, croppedUrl) => {
            setAppliedCropRect(cropRect);
            setCroppedPreviewUrl(croppedUrl);
          }}
          onClose={() => setIsCropModalOpen(false)}
        />
      )}
    </div>
  );
};
