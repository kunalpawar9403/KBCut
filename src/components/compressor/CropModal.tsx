import React, { useState, useRef, useEffect } from 'react';
import { X, RotateCw, Check, ZoomIn, ZoomOut, Crop, Move } from 'lucide-react';
import { ImageCropRect } from '../../utils/imageCompressor';

interface CropModalProps {
  isOpen: boolean;
  file: File;
  targetWidth: number;
  targetHeight: number;
  onApplyCrop: (cropRect: ImageCropRect, croppedPreviewUrl: string) => void;
  onClose: () => void;
}

export const CropModal: React.FC<CropModalProps> = ({
  isOpen,
  file,
  targetWidth,
  targetHeight,
  onApplyCrop,
  onClose,
}) => {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [naturalWidth, setNaturalWidth] = useState<number>(0);
  const [naturalHeight, setNaturalHeight] = useState<number>(0);
  const [rotation, setRotation] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImgSrc(url);

    const img = new Image();
    img.onload = () => {
      setNaturalWidth(img.naturalWidth);
      setNaturalHeight(img.naturalHeight);
    };
    img.src = url;

    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (!isOpen || !imgSrc) return null;

  const targetRatio = targetWidth > 0 && targetHeight > 0 ? targetWidth / targetHeight : 1;

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStartRef.current = {
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPan({
      x: e.touches[0].clientX - dragStartRef.current.x,
      y: e.touches[0].clientY - dragStartRef.current.y,
    });
  };

  const handleApply = async () => {
    if (!imgSrc || !naturalWidth || !naturalHeight) return;

    const img = new Image();
    img.src = imgSrc;
    await new Promise((res) => {
      img.onload = res;
    });

    const isQuarter = rotation === 90 || rotation === 270;
    const rotatedW = isQuarter ? naturalHeight : naturalWidth;
    const rotatedH = isQuarter ? naturalWidth : naturalHeight;

    // Create intermediate rotated & scaled canvas
    const rotCanvas = document.createElement('canvas');
    rotCanvas.width = rotatedW;
    rotCanvas.height = rotatedH;
    const rotCtx = rotCanvas.getContext('2d');
    if (!rotCtx) return;

    rotCtx.translate(rotatedW / 2, rotatedH / 2);
    rotCtx.rotate((rotation * Math.PI) / 180);
    rotCtx.drawImage(img, -naturalWidth / 2, -naturalHeight / 2);

    // Compute crop rect based on target aspect ratio and zoom/pan
    let cropW = rotatedW;
    let cropH = rotatedH;

    if (rotatedW / rotatedH > targetRatio) {
      cropW = Math.round(rotatedH * targetRatio);
    } else {
      cropH = Math.round(rotatedW / targetRatio);
    }

    // Apply zoom
    cropW = Math.max(20, Math.round(cropW / zoom));
    cropH = Math.max(20, Math.round(cropH / zoom));

    // Center plus normalized pan offset
    const maxPanX = (rotatedW - cropW) / 2;
    const maxPanY = (rotatedH - cropH) / 2;
    const offsetX = Math.max(-maxPanX, Math.min(maxPanX, -pan.x));
    const offsetY = Math.max(-maxPanY, Math.min(maxPanY, -pan.y));

    const cropX = Math.max(0, Math.min(rotatedW - cropW, Math.round((rotatedW - cropW) / 2 + offsetX)));
    const cropY = Math.max(0, Math.min(rotatedH - cropH, Math.round((rotatedH - cropH) / 2 + offsetY)));

    // Create final cropped canvas
    const outCanvas = document.createElement('canvas');
    outCanvas.width = Math.round(targetWidth);
    outCanvas.height = Math.round(targetHeight);
    const outCtx = outCanvas.getContext('2d');
    if (!outCtx) return;

    outCtx.fillStyle = '#FFFFFF';
    outCtx.fillRect(0, 0, outCanvas.width, outCanvas.height);
    outCtx.imageSmoothingEnabled = true;
    outCtx.imageSmoothingQuality = 'high';

    outCtx.drawImage(rotCanvas, cropX, cropY, cropW, cropH, 0, 0, outCanvas.width, outCanvas.height);

    const croppedUrl = outCanvas.toDataURL('image/jpeg', 0.92);
    onApplyCrop(
      {
        x: cropX,
        y: cropY,
        width: cropW,
        height: cropH,
      },
      croppedUrl
    );
    onClose();
  };

  const handleReset = () => {
    setRotation(0);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold">
              <Crop className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                Crop & Frame Image
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Locked to aspect ratio {targetWidth} × {targetHeight} ({targetRatio.toFixed(2)}:1)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport / Crop Canvas Area */}
        <div
          className="relative flex-1 min-h-[260px] max-h-[380px] bg-slate-950 flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
        >
          {/* Target Crop Mask Overlay Frame */}
          <div
            style={{
              aspectRatio: `${targetRatio}`,
              maxWidth: '85%',
              maxHeight: '85%',
            }}
            className="absolute z-10 w-full h-full border-2 border-brand-500 shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] pointer-events-none rounded-sm flex items-center justify-center"
          >
            {/* Rule of thirds grid lines */}
            <div className="w-full h-full grid grid-cols-3 grid-rows-3 pointer-events-none opacity-30">
              <div className="border-r border-b border-white" />
              <div className="border-r border-b border-white" />
              <div className="border-b border-white" />
              <div className="border-r border-b border-white" />
              <div className="border-r border-b border-white" />
              <div className="border-b border-white" />
              <div className="border-r border-white" />
              <div className="border-r border-white" />
              <div />
            </div>

            <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-sm">
              {targetWidth} × {targetHeight}
            </div>
          </div>

          {/* Draggable & Rotated Image */}
          <img
            src={imgSrc}
            alt="Crop candidate"
            draggable={false}
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) rotate(${rotation}deg) scale(${zoom})`,
              transition: isDragging ? 'none' : 'transform 0.15s ease-out',
            }}
            className="max-h-[85%] max-w-[85%] object-contain pointer-events-none"
          />

          <div className="absolute bottom-2 right-2 z-20 flex items-center gap-1 bg-black/70 px-2 py-1 rounded-lg text-[10px] text-slate-300 pointer-events-none">
            <Move className="w-3 h-3" />
            <span>Drag to frame</span>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between gap-3">
            {/* Zoom Slider */}
            <div className="flex items-center gap-2 flex-1">
              <ZoomOut className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input
                type="range"
                min="1"
                max="3"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
              />
              <ZoomIn className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 w-10 text-right">
                {zoom.toFixed(1)}x
              </span>
            </div>

            {/* Rotate Button */}
            <button
              type="button"
              onClick={handleRotate}
              className="py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 flex items-center space-x-1.5 touch-press"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Rotate 90°</span>
            </button>

            {/* Reset */}
            <button
              type="button"
              onClick={handleReset}
              className="py-1.5 px-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 touch-press"
            >
              Reset
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 touch-press"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="flex-[2] py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-md shadow-brand-500/20 flex items-center justify-center space-x-1.5 touch-press"
            >
              <Check className="w-4 h-4" />
              <span>Apply Crop & Continue</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
