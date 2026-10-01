import React, { useState, useRef } from 'react';
import { useI18n } from '../../i18n';
import { splitPdfByRange, rotatePdfPages } from '../../utils/pdfTools';
import { platformService } from '../../services/platform';
import { toast } from '../common/Toast';
import { FileText, Scissors, RotateCw, Download, Loader2 } from 'lucide-react';
import { formatFileSize } from '../../utils/formatters';

export const SplitPdfTool: React.FC = () => {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [pageRange, setPageRange] = useState<string>('1-2');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSplit = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const splitBlob = await splitPdfByRange(file, pageRange);
      await platformService.saveFile(splitBlob, `${file.name.replace('.pdf', '')}_pages_${pageRange}.pdf`);
      toast.success('Split PDF downloaded successfully!');
    } catch {
      toast.error('Invalid page range or corrupted PDF. Example range: 1-3, 5');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRotate = async (angle: 90 | 180 | 270) => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const rotBlob = await rotatePdfPages(file, angle);
      await platformService.saveFile(rotBlob, `${file.name.replace('.pdf', '')}_rotated.pdf`);
      toast.success('Rotated PDF downloaded!');
    } catch {
      toast.error('Could not rotate PDF');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      <div>
        <h2 className="font-bold text-base text-slate-900 dark:text-white">
          {t('tools.splitPdf.name')}
        </h2>
        <p className="text-xs text-slate-500">{t('tools.splitPdf.desc')}</p>
      </div>

      {!file ? (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full p-8 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-800 text-center hover:border-brand-500 transition-colors"
        >
          <FileText className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Select a PDF document to split or rotate
          </p>
        </button>
      ) : (
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                {file.name}
              </p>
              <span className="text-[10px] text-slate-400">
                {formatFileSize(file.size)}
              </span>
            </div>
            <button
              onClick={() => setFile(null)}
              className="text-xs font-semibold text-brand-500 hover:underline"
            >
              Change
            </button>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              {t('tools.splitPdf.pageRange')}
            </label>
            <input
              type="text"
              value={pageRange}
              onChange={(e) => setPageRange(e.target.value)}
              placeholder="e.g. 1-3, 5"
              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleSplit}
              className="flex-1 h-12 rounded-xl bg-brand-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 touch-press shadow-sm"
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Scissors className="w-4 h-4" />
                  <span>{t('tools.splitPdf.splitBtn')}</span>
                </>
              )}
            </button>

            <button
              type="button"
              disabled={isProcessing}
              onClick={() => handleRotate(90)}
              className="px-4 h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center space-x-1 touch-press"
            >
              <RotateCw className="w-4 h-4" />
              <span>Rotate 90°</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
