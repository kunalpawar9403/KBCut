import React, { useRef, useState, useEffect } from 'react';
import { useI18n } from '../../i18n';
import { storageService, SavedSignature } from '../../services/storage';
import { stampSignatureOnPdf } from '../../utils/pdfTools';
import { platformService } from '../../services/platform';
import { toast } from '../common/Toast';
import { PenTool, Trash2, Bookmark, Check, Download, FileText, Move } from 'lucide-react';

export const ESignTool: React.FC = () => {
  const { t } = useI18n();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [savedSignatures, setSavedSignatures] = useState<SavedSignature[]>([]);
  const [selectedSigDataUrl, setSelectedSigDataUrl] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [xPos, setXPos] = useState<number>(60); // % from left
  const [yPos, setYPos] = useState<number>(10); // % from bottom
  const [sigWidth, setSigWidth] = useState<number>(25); // % of page width
  const [isExporting, setIsExporting] = useState(false);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadSaved();
  }, []);

  const loadSaved = async () => {
    const list = await storageService.getAllSignatures();
    setSavedSignatures(list);
  };

  // Canvas drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0F172A'; // Dark blue-black ink
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
        0, // page 1
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
        <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-1.5">
          <PenTool className="w-4 h-4 text-brand-500" />
          <span>{t('tools.esign.name')}</span>
        </h2>
        <p className="text-xs text-slate-500">{t('tools.esign.desc')}</p>
      </div>

      {/* Signature Draw Pad */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            {t('tools.esign.drawSignature')}
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={clearCanvas}
              className="text-xs font-semibold text-rose-500 hover:text-rose-600 px-2 py-1"
            >
              {t('tools.esign.clearSignature')}
            </button>
            <button
              disabled={!selectedSigDataUrl}
              onClick={handleSaveSignature}
              className="text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950 px-2.5 py-1 rounded-xl disabled:opacity-40"
            >
              <Bookmark className="w-3.5 h-3.5 inline mr-1" />
              {t('tools.esign.saveSignature')}
            </button>
          </div>
        </div>

        <div className="border border-slate-200 dark:border-slate-700 rounded-2xl bg-white overflow-hidden touch-none">
          <canvas
            ref={canvasRef}
            width={360}
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
      </div>

      {/* Saved Signatures Carousel */}
      {savedSignatures.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            {t('tools.esign.savedSignatures')}
          </span>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {savedSignatures.map((sig) => (
              <div
                key={sig.id}
                onClick={() => setSelectedSigDataUrl(sig.dataUrl)}
                className={`shrink-0 p-2 rounded-2xl border cursor-pointer bg-white dark:bg-slate-900 transition-all ${
                  selectedSigDataUrl === sig.dataUrl
                    ? 'border-brand-500 ring-2 ring-brand-500/20'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <img src={sig.dataUrl} alt="Signature" className="h-10 w-24 object-contain" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stamp on PDF section */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
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
            className="text-xs font-bold text-brand-600 dark:text-brand-400 px-2.5 py-1 rounded-xl bg-brand-50 dark:bg-brand-950"
          >
            {pdfFile ? 'Change PDF' : 'Select PDF'}
          </button>
        </div>

        {pdfFile && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <FileText className="w-4 h-4 text-brand-500" />
              <span className="truncate">{pdfFile.name}</span>
            </div>

            {/* Position Sliders */}
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 pt-1">
              <div>
                <div className="flex justify-between mb-1">
                  <span>Horizontal Position (X)</span>
                  <span className="font-bold">{xPos}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="80"
                  value={xPos}
                  onChange={(e) => setXPos(Number(e.target.value))}
                  className="w-full accent-brand-500"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>Vertical Position (Y)</span>
                  <span className="font-bold">{yPos}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="85"
                  value={yPos}
                  onChange={(e) => setYPos(Number(e.target.value))}
                  className="w-full accent-brand-500"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>Signature Size</span>
                  <span className="font-bold">{sigWidth}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  value={sigWidth}
                  onChange={(e) => setSigWidth(Number(e.target.value))}
                  className="w-full accent-brand-500"
                />
              </div>
            </div>

            <button
              type="button"
              disabled={!selectedSigDataUrl || isExporting}
              onClick={handleExportSignedPdf}
              className="w-full h-12 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs shadow-soft flex items-center justify-center space-x-1.5 touch-press transition-all disabled:opacity-40"
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
