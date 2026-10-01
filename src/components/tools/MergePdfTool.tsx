import React, { useState, useRef } from 'react';
import { useI18n } from '../../i18n';
import { mergeFilesToPdf } from '../../utils/pdfTools';
import { platformService } from '../../services/platform';
import { toast } from '../common/Toast';
import { formatFileSize } from '../../utils/formatters';
import { Plus, ArrowUp, ArrowDown, Trash2, FileText, Download, Loader2 } from 'lucide-react';

export const MergePdfTool: React.FC = () => {
  const { t } = useI18n();
  const [files, setFiles] = useState<File[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const added = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...added]);
    }
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newFiles = [...files];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newFiles.length) return;
    const temp = newFiles[index];
    newFiles[index] = newFiles[targetIdx];
    newFiles[targetIdx] = temp;
    setFiles(newFiles);
  };

  const removeItem = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMerge = async () => {
    if (files.length === 0) return;
    setIsMerging(true);
    try {
      const mergedBlob = await mergeFilesToPdf(files);
      await platformService.saveFile(mergedBlob, `kbcut_merged_${Date.now()}.pdf`);
      toast.success('Merged PDF downloaded successfully!');
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to merge files');
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="application/pdf,image/*"
        onChange={handleAddFiles}
        className="hidden"
      />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-base text-slate-900 dark:text-white">
            {t('tools.mergePdf.name')}
          </h2>
          <p className="text-xs text-slate-500">{t('tools.mergePdf.desc')}</p>
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 font-bold text-xs touch-press border border-brand-200 dark:border-brand-800"
        >
          <Plus className="w-4 h-4" />
          <span>{t('tools.mergePdf.addFiles')}</span>
        </button>
      </div>

      {files.length === 0 ? (
        <div
          onClick={() => inputRef.current?.click()}
          className="p-8 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-800 text-center cursor-pointer hover:border-brand-500 transition-colors"
        >
          <FileText className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Tap to select multiple PDFs or images to merge
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {files.map((file, idx) => (
            <div
              key={`${file.name}_${idx}`}
              className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center space-x-3 min-w-0">
                <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-xs">
                  {idx + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {file.name}
                  </p>
                  <span className="text-[10px] text-slate-400">
                    {formatFileSize(file.size)}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => moveItem(idx, 'up')}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 disabled:opacity-30"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={idx === files.length - 1}
                  onClick={() => moveItem(idx, 'down')}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 disabled:opacity-30"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            disabled={isMerging}
            onClick={handleMerge}
            className="w-full h-14 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-sm tracking-wide shadow-elevated flex items-center justify-center space-x-2 touch-press transition-all mt-4"
          >
            {isMerging ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Merging Files...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>{t('tools.mergePdf.mergeBtn')}</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
