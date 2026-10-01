import React, { useState, useRef, useEffect } from 'react';
import { useI18n } from '../../i18n';
import { platformService } from '../../services/platform';
import { toast } from '../common/Toast';
import { Crop, RotateCw, Download, Upload, Check } from 'lucide-react';

interface AspectOption {
  label: string;
  ratio: number | null; // width / height
}

const ASPECTS: AspectOption[] = [
  { label: '3.5 : 4.5 (Passport/Exam)', ratio: 3.5 / 4.5 },
  { label: '140 : 60 (Signature)', ratio: 140 / 60 },
  { label: '1 : 1 (Square)', ratio: 1 },
  { label: 'Original', ratio: null },
];

export const CropRotateTool: React.FC = () => {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [rotation, setRotation] = useState<number>(0);
  const [selectedRatio, setSelectedRatio] = useState<number | null>(3.5 / 4.5);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setImageSrc(url);
      setRotation(0);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleApplyAndDownload = async () => {
    if (!imageSrc) return;
    const img = new Image();
    img.src = imageSrc;
    await new Promise((res) => { img.onload = res; });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle rotation dimensions
    const isQuarter = rotation === 90 || rotation === 270;
    const rotW = isQuarter ? img.height : img.width;
    const rotH = isQuarter ? img.width : img.height;

    // Apply aspect ratio crop to center
    let cropW = rotW;
    let cropH = rotH;
    let startX = 0;
    let startY = 0;

    if (selectedRatio) {
      if (rotW / rotH > selectedRatio) {
        cropW = Math.round(rotH * selectedRatio);
        startX = Math.round((rotW - cropW) / 2);
      } else {
        cropH = Math.round(rotW / selectedRatio);
        startY = Math.round((rotH - cropH) / 2);
      }
    }

    // Temporary canvas for rotation
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = rotW;
    tempCanvas.height = rotH;
    const tempCtx = tempCanvas.getContext('2d')!;

    tempCtx.translate(rotW / 2, rotH / 2);
    tempCtx.rotate((rotation * Math.PI) / 180);
    tempCtx.drawImage(img, -img.width / 2, -img.height / 2);

    // Final crop canvas
    canvas.width = cropW;
    canvas.height = cropH;
    ctx.drawImage(tempCanvas, startX, startY, cropW, cropH, 0, 0, cropW, cropH);

    const blob: Blob = await new Promise((res) => canvas.toBlob((b) => res(b!), 'image/jpeg', 0.95));
    await platformService.saveFile(blob, `cropped_${file?.name || 'photo.jpg'}`);
    toast.success('Cropped image downloaded!');
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files && setFile(e.target.files[0])}
        className="hidden"
      />

      <div>
        <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-1.5">
          <Crop className="w-4 h-4 text-brand-500" />
          <span>{t('tools.cropRotate.name')}</span>
        </h2>
        <p className="text-xs text-slate-500">{t('tools.cropRotate.desc')}</p>
      </div>

      {!imageSrc ? (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full p-8 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-800 text-center hover:border-brand-500 transition-colors"
        >
          <Upload className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Select a photo to crop & rotate
          </p>
        </button>
      ) : (
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          {/* Preview Box */}
          <div className="relative max-h-64 rounded-2xl bg-slate-100 dark:bg-slate-950 overflow-hidden flex items-center justify-center p-2">
            <img
              src={imageSrc}
              alt="Crop preview"
              style={{ transform: `rotate(${rotation}deg)` }}
              className="max-h-56 max-w-full object-contain transition-transform duration-200 rounded-lg shadow-sm"
            />
          </div>

          {/* Aspect Ratio Selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              {t('tools.cropRotate.aspectRatios')}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ASPECTS.map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setSelectedRatio(opt.ratio)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all text-center border ${
                    selectedRatio === opt.ratio
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleRotate}
              className="px-4 h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center space-x-1.5 touch-press"
            >
              <RotateCw className="w-4 h-4" />
              <span>Rotate 90°</span>
            </button>

            <button
              type="button"
              onClick={handleApplyAndDownload}
              className="flex-1 h-12 rounded-xl bg-brand-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 touch-press shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>{t('tools.cropRotate.cropBtn')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
