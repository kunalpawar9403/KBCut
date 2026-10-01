import React, { useState, useRef } from 'react';
import { useI18n } from '../../i18n';
import { createPhotoAndSignatureSheet } from '../../utils/pdfTools';
import { platformService } from '../../services/platform';
import { toast } from '../common/Toast';
import { Users, Upload, Download, Loader2, Check } from 'lucide-react';

export const PhotoSignTool: React.FC = () => {
  const { t } = useI18n();
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [signFile, setSignFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'application/pdf'>('image/jpeg');
  const [isProcessing, setIsProcessing] = useState(false);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const signInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async () => {
    if (!photoFile || !signFile) return;
    setIsProcessing(true);
    try {
      const blob = await createPhotoAndSignatureSheet(photoFile, signFile, outputFormat);
      const ext = outputFormat === 'application/pdf' ? 'pdf' : 'jpg';
      await platformService.saveFile(blob, `photo_signature_sheet.${ext}`);
      toast.success('Combined document downloaded successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to combine photo and signature');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-1.5">
          <Users className="w-4 h-4 text-brand-500" />
          <span>{t('tools.photoSign.name')}</span>
        </h2>
        <p className="text-xs text-slate-500">{t('tools.photoSign.desc')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Photo Box */}
        <input
          ref={photoInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files && setPhotoFile(e.target.files[0])}
          className="hidden"
        />
        <div
          onClick={() => photoInputRef.current?.click()}
          className={`p-5 rounded-3xl border-2 border-dashed cursor-pointer text-center transition-all ${
            photoFile
              ? 'border-accent-500 bg-accent-50/50 dark:bg-accent-950/30'
              : 'border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-500'
          }`}
        >
          {photoFile ? (
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-accent-500 text-white flex items-center justify-center mb-2">
                <Check className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate max-w-[200px]">
                {photoFile.name}
              </span>
              <span className="text-[10px] text-accent-600 font-semibold mt-0.5">Photo Loaded</span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="w-8 h-8 text-slate-400 mb-2" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {t('tools.photoSign.photoLabel')}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">Passport Size Photo</span>
            </div>
          )}
        </div>

        {/* Signature Box */}
        <input
          ref={signInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files && setSignFile(e.target.files[0])}
          className="hidden"
        />
        <div
          onClick={() => signInputRef.current?.click()}
          className={`p-5 rounded-3xl border-2 border-dashed cursor-pointer text-center transition-all ${
            signFile
              ? 'border-accent-500 bg-accent-50/50 dark:bg-accent-950/30'
              : 'border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-500'
          }`}
        >
          {signFile ? (
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-accent-500 text-white flex items-center justify-center mb-2">
                <Check className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate max-w-[200px]">
                {signFile.name}
              </span>
              <span className="text-[10px] text-accent-600 font-semibold mt-0.5">Signature Loaded</span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="w-8 h-8 text-slate-400 mb-2" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {t('tools.photoSign.signLabel')}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">Signed on white paper</span>
            </div>
          )}
        </div>
      </div>

      {/* Format Selection */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
        <span className="font-semibold text-slate-700 dark:text-slate-300">Output Format:</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setOutputFormat('image/jpeg')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              outputFormat === 'image/jpeg'
                ? 'bg-brand-500 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            JPG Image
          </button>
          <button
            type="button"
            onClick={() => setOutputFormat('application/pdf')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              outputFormat === 'application/pdf'
                ? 'bg-brand-500 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            PDF Doc
          </button>
        </div>
      </div>

      <button
        type="button"
        disabled={!photoFile || !signFile || isProcessing}
        onClick={handleGenerate}
        className="w-full h-14 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-sm tracking-wide shadow-elevated flex items-center justify-center space-x-2 touch-press transition-all disabled:opacity-40"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Generating Sheet...</span>
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            <span>{t('tools.photoSign.generateBtn')}</span>
          </>
        )}
      </button>
    </div>
  );
};
