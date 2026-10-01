import React, { useRef, useState, useEffect } from 'react';
import { useI18n } from '../../i18n';
import { storageService, SavedSignature } from '../../services/storage';
import { stampSignatureOnPdf } from '../../utils/pdfTools';
import { platformService } from '../../services/platform';
import { toast } from '../common/Toast';
import {
  PenTool,
  Trash2,
  Bookmark,
  Check,
  Download,
  FileText,
  Palette,
  Sparkles,
} from 'lucide-react';

const INK_COLORS = [
  { name: 'Official Blue', hex: '#1D4ED8' },
  { name: 'Standard Black', hex: '#0F172A' },
  { name: 'Exam Red', hex: '#DC2626' },
];

export const ESignTool: React.FC = () => {
  const { t } = useI18n();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedInk, setSelectedInk] = useState(INK_COLORS[0].hex);
  const [strokeWidth, setStrokeWidth] = useState(2.8);
  const [savedSignatures, setSavedSignatures] = useState<SavedSignature[]>([]);
  const [selectedSigDataUrl, setSelectedSigDataUrl] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [xPos, setXPos] = useState<number>(60);
  const [yPos, setYPos] = useState<number>(10);
  const [sigWidth, setSigWidth] = useState<number>(25);
  const [isExporting, setIsExporting] = useState(false);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadSaved();
  }, []);

  const loadSaved = async () => {
    const list = await storageService.getAllSignatures();
    setSavedSignatures(list);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineWidth = strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = selectedInk;
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing && canvasRef.current) {
      setIsDrawing(false);
      setSelectedSigDataUrl(canvasRef.current.toDataURL('image/png'));
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      setSelectedSigDataUrl(null);
    }
  };

  const handleSaveSignature = async () => {
    if (!selectedSigDataUrl) return;
    try {
      await storageService.saveSignature(selectedSigDataUrl);
      toast.success('Signature saved for future reuse!');
      loadSaved();
    } catch {
      toast.error('Failed to save signature');
    }
  };

  const handleExportSignedPdf = async () => {
    if (!pdfFile || !selectedSigDataUrl) return;
    setIsExporting(true);
    try {
      const signedBlob = await stampSignatureOnPdf(
        pdfFile,
        selectedSigDataUrl,
        0,
        xPos,
        yPos,
        sigWidth
      );
      await platformService.saveFile(signedBlob, `${pdfFile.name.replace('.pdf', '')}_signed.pdf`);
      toast.success('Signed PDF exported successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Could not sign PDF');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <PenTool className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
              {t('tools.esign.name')}
            </h2>
            <p className="text-xs text-slate-500">{t('tools.esign.desc')}</p>
          </div>
        </div>
      </div>

      {/* Signature Draw Pad */}
      <div className="p-5 rounded-3xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Ink color chips */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-500">Ink:</span>
            {INK_COLORS.map((c) => (
              <button
                key={c.hex}
                type="button"
                onClick={() => setSelectedInk(c.hex)}
                className={`w-6 h-6 rounded-full border-2 transition-transform ${
                  selectedInk === c.hex ? 'scale-110 ring-2 ring-brand-500 ring-offset-2' : ''
                }`}
                style={{ backgroundColor: c.hex, borderColor: '#FFFFFF' }}
                title={c.name}
              />
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={clearCanvas}
              className="text-xs font-bold text-rose-500 hover:text-rose-600 px-2 py-1"
            >
              {t('tools.esign.clearSignature')}
            </button>
            <button
              disabled={!selectedSigDataUrl}
              onClick={handleSaveSignature}
              className="text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950/80 px-3 py-1.5 rounded-xl disabled:opacity-40 shadow-sm"
            >
              <Bookmark className="w-3.5 h-3.5 inline mr-1" />
              {t('tools.esign.saveSignature')}
            </button>
          </div>
        </div>

        <div className="border-2 border-slate-300 dark:border-slate-700 rounded-2xl bg-white overflow-hidden touch-none shadow-inner">
          <canvas
            ref={canvasRef}
            width={380}
            height={160}
            className="w-full h-40 cursor-crosshair block"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </div>
        <p className="text-[11px] text-slate-400 text-center">
          Sign with your finger or stylus above. Transparency is auto-preserved.
        </p>
      </div>

      {/* Saved Signatures Carousel */}
      {savedSignatures.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 px-1">
            {t('tools.esign.savedSignatures')}
          </span>
          <div className="flex gap-2.5 overflow-x-auto pb-2">
            {savedSignatures.map((sig) => (
              <div
                key={sig.id}
                onClick={() => setSelectedSigDataUrl(sig.dataUrl)}
                className={`shrink-0 p-2.5 rounded-2xl border-2 cursor-pointer bg-white dark:bg-slate-900 transition-all ${
                  selectedSigDataUrl === sig.dataUrl
                    ? 'border-purple-500 ring-2 ring-purple-500/25 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-400'
                }`}
              >
                <img src={sig.dataUrl} alt="Signature" className="h-10 w-28 object-contain" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stamp on PDF section */}
      <div className="p-5 rounded-3xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
            {t('tools.esign.stampOnPdf')}
          </span>
          <input
            ref={pdfInputRef}
            type="file"
            accept="application/pdf"
            onChange={(e) => e.target.files && setPdfFile(e.target.files[0])}
            className="hidden"
          />
          <button
            onClick={() => pdfInputRef.current?.click()}
            className="text-xs font-bold text-brand-600 dark:text-brand-400 px-3 py-1.5 rounded-xl bg-brand-50 dark:bg-brand-950 border border-brand-200 dark:border-brand-800"
          >
            {pdfFile ? 'Change PDF' : 'Select PDF to Sign'}
          </button>
        </div>

        {pdfFile && (
          <div className="space-y-3.5 pt-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 dark:text-slate-200">
              <FileText className="w-4 h-4 text-brand-500" />
              <span className="truncate">{pdfFile.name}</span>
            </div>

            {/* Position Sliders */}
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <div>
                <div className="flex justify-between mb-1">
                  <span>Horizontal (X Position)</span>
                  <span className="font-bold text-slate-900 dark:text-white">{xPos}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="80"
                  value={xPos}
                  onChange={(e) => setXPos(Number(e.target.value))}
                  className="w-full accent-purple-600"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>Vertical (Y Position)</span>
                  <span className="font-bold text-slate-900 dark:text-white">{yPos}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="85"
                  value={yPos}
                  onChange={(e) => setYPos(Number(e.target.value))}
                  className="w-full accent-purple-600"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>Signature Size</span>
                  <span className="font-bold text-slate-900 dark:text-white">{sigWidth}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  value={sigWidth}
                  onChange={(e) => setSigWidth(Number(e.target.value))}
                  className="w-full accent-purple-600"
                />
              </div>
            </div>

            <button
              type="button"
              disabled={!selectedSigDataUrl || isExporting}
              onClick={handleExportSignedPdf}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs shadow-elevated flex items-center justify-center space-x-2 touch-press transition-all disabled:opacity-40 animate-shimmer"
            >
              <Download className="w-4 h-4" />
              <span>{t('tools.esign.exportPdf')}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
