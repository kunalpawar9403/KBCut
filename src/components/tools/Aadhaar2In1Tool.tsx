import React, { useState, useRef } from 'react';
import { useI18n } from '../../i18n';
import { createAadhaar2In1Pdf } from '../../utils/pdfTools';
import { platformService } from '../../services/platform';
import { toast } from '../common/Toast';
import { CreditCard, Upload, Download, Loader2, Check } from 'lucide-react';

export const Aadhaar2In1Tool: React.FC = () => {
  const { t } = useI18n();
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async () => {
    if (!frontFile || !backFile) return;
    setIsProcessing(true);
    try {
      const pdfBlob = await createAadhaar2In1Pdf(frontFile, backFile);
      await platformService.saveFile(pdfBlob, 'aadhaar_front_back_a4.pdf');
      toast.success('Aadhaar 2-in-1 A4 PDF generated and downloaded!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to create Aadhaar 2-in-1 PDF');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-1.5">
          <CreditCard className="w-4 h-4 text-brand-500" />
          <span>{t('tools.aadhaar2in1.name')}</span>
        </h2>
        <p className="text-xs text-slate-500">{t('tools.aadhaar2in1.desc')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Front Side */}
        <input
          ref={frontInputRef}
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => e.target.files && setFrontFile(e.target.files[0])}
          className="hidden"
        />
        <div
          onClick={() => frontInputRef.current?.click()}
          className={`p-5 rounded-3xl border-2 border-dashed cursor-pointer text-center transition-all ${
            frontFile
              ? 'border-accent-500 bg-accent-50/50 dark:bg-accent-950/30'
              : 'border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-500'
          }`}
        >
          {frontFile ? (
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-accent-500 text-white flex items-center justify-center mb-2">
                <Check className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate max-w-[200px]">
                {frontFile.name}
              </span>
              <span className="text-[10px] text-accent-600 font-semibold mt-0.5">Front Loaded</span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="w-8 h-8 text-slate-400 mb-2" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {t('tools.aadhaar2in1.frontLabel')}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">Photo or PDF</span>
            </div>
          )}
        </div>

        {/* Back Side */}
        <input
          ref={backInputRef}
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => e.target.files && setBackFile(e.target.files[0])}
          className="hidden"
        />
        <div
          onClick={() => backInputRef.current?.click()}
          className={`p-5 rounded-3xl border-2 border-dashed cursor-pointer text-center transition-all ${
            backFile
              ? 'border-accent-500 bg-accent-50/50 dark:bg-accent-950/30'
              : 'border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-500'
          }`}
        >
          {backFile ? (
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-accent-500 text-white flex items-center justify-center mb-2">
                <Check className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate max-w-[200px]">
                {backFile.name}
              </span>
              <span className="text-[10px] text-accent-600 font-semibold mt-0.5">Back Loaded</span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="w-8 h-8 text-slate-400 mb-2" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {t('tools.aadhaar2in1.backLabel')}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">Photo or PDF</span>
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        disabled={!frontFile || !backFile || isProcessing}
        onClick={handleGenerate}
        className="w-full h-14 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-sm tracking-wide shadow-elevated flex items-center justify-center space-x-2 touch-press transition-all disabled:opacity-40"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Generating A4 PDF...</span>
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            <span>{t('tools.aadhaar2in1.generateBtn')}</span>
          </>
        )}
      </button>
    </div>
  );
};
