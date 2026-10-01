import React, { useState, useRef } from 'react';
import { useI18n } from '../../i18n';
import { createAadhaar2In1Pdf } from '../../utils/pdfTools';
import { platformService } from '../../services/platform';
import { toast } from '../common/Toast';
import { CreditCard, Upload, Download, Loader2, Check, Sparkles, FileText } from 'lucide-react';

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
    <div className="space-y-5">
      <div>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
              {t('tools.aadhaar2in1.name')}
            </h2>
            <p className="text-xs text-slate-500">{t('tools.aadhaar2in1.desc')}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
          className={`p-6 rounded-3xl border-2 border-dashed cursor-pointer text-center transition-all duration-200 ${
            frontFile
              ? 'border-accent-500 bg-accent-50/60 dark:bg-accent-950/40 shadow-sm'
              : 'border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:border-brand-500'
          }`}
        >
          {frontFile ? (
            <div className="flex flex-col items-center">
              <div className="w-11 h-11 rounded-2xl bg-accent-500 text-white flex items-center justify-center mb-2.5 shadow-md shadow-accent-500/25">
                <Check className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
                {frontFile.name}
              </span>
              <span className="text-[11px] text-accent-600 dark:text-accent-400 font-extrabold mt-0.5">
                Front Loaded ✓
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-11 h-11 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-2.5">
                <Upload className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {t('tools.aadhaar2in1.frontLabel')}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">Aadhaar Front Side (JPG / PDF)</span>
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
          className={`p-6 rounded-3xl border-2 border-dashed cursor-pointer text-center transition-all duration-200 ${
            backFile
              ? 'border-accent-500 bg-accent-50/60 dark:bg-accent-950/40 shadow-sm'
              : 'border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:border-brand-500'
          }`}
        >
          {backFile ? (
            <div className="flex flex-col items-center">
              <div className="w-11 h-11 rounded-2xl bg-accent-500 text-white flex items-center justify-center mb-2.5 shadow-md shadow-accent-500/25">
                <Check className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
                {backFile.name}
              </span>
              <span className="text-[11px] text-accent-600 dark:text-accent-400 font-extrabold mt-0.5">
                Back Loaded ✓
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-11 h-11 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-2.5">
                <Upload className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {t('tools.aadhaar2in1.backLabel')}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">Aadhaar Address Side (JPG / PDF)</span>
            </div>
          )}
        </div>
      </div>

      {/* Visual A4 Layout Simulator */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/70 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-14 bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-600 rounded shadow-sm flex flex-col items-center justify-center p-1 space-y-1 shrink-0">
            <div className={`w-full h-3 rounded-[2px] ${frontFile ? 'bg-accent-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
            <div className={`w-full h-3 rounded-[2px] ${backFile ? 'bg-accent-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
          </div>
          <div>
            <span className="font-bold text-slate-800 dark:text-slate-200 block">
              Standard Portrait A4 Sheet
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Front card top, Address card bottom, print-ready with margins
            </p>
          </div>
        </div>

        <span className="font-extrabold text-[11px] text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
          Govt Verified
        </span>
      </div>

      <button
        type="button"
        disabled={!frontFile || !backFile || isProcessing}
        onClick={handleGenerate}
        className="w-full h-14 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm tracking-wide shadow-elevated flex items-center justify-center space-x-2 touch-press transition-all disabled:opacity-40 animate-shimmer"
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
