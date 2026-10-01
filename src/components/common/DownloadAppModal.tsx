import React, { useState } from 'react';
import { pwaService } from '../../services/pwa';
import { toast } from './Toast';
import {
  X,
  Download,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Share2,
} from 'lucide-react';

import { getApkDownloadUrl, APK_RELEASE_URL, GITHUB_REPO_URL } from '../../utils/formatters';

interface DownloadAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadAppModal: React.FC<DownloadAppModalProps> = ({ isOpen, onClose }) => {
  const [showInstructions, setShowInstructions] = useState(false);

  if (!isOpen) return null;

  const handlePwaInstall = async () => {
    const accepted = await pwaService.promptInstall();
    if (accepted) {
      toast.success('KBCut App installed to your device!');
      onClose();
    } else {
      toast.info('Tap browser menu (⋮ or Share) and select "Add to Home screen"');
    }
  };

  const handleDirectApkDownload = () => {
    const url = getApkDownloadUrl();
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'kbcut-app.apk';
    anchor.target = '_blank';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    toast.success('KBCut APK download started! (7.2 MB)');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'KBCut - Photo & PDF Size Reducer',
          text: 'Get under exam file size limits (50KB, 20KB, 200KB) 100% offline. Download KBCut app:',
          url: window.location.origin,
        });
      } catch {
        // User cancelled share
      }
    } else {
      navigator.clipboard.writeText(window.location.origin);
      toast.success('App link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-elevated text-slate-900 dark:text-white space-y-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with App Logo */}
        <div className="flex items-center space-x-3.5 pr-8">
          <img
            src="/logo.png"
            alt="KBCut"
            className="w-13 h-13 rounded-2xl shadow-md p-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 object-contain shrink-0"
          />
          <div>
            <h3 className="font-extrabold text-lg sm:text-xl flex items-center gap-1.5">
              <span>Get KBCut App</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent-100 dark:bg-accent-950 text-accent-700 dark:text-accent-300 font-black">
                v1.0
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              100% Offline Photo & PDF Resizer for Exams
            </p>
          </div>
        </div>

        {/* Option 1: Direct Android APK */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-brand-50 via-blue-50 to-indigo-50 dark:from-slate-800/90 dark:via-slate-800 dark:to-brand-950/50 border border-brand-200/90 dark:border-brand-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-brand-500 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
              Android APK (Recommended)
            </span>
            <span className="text-[11px] font-bold text-brand-600 dark:text-brand-400">
              7.2 MB • Android 8.0+
            </span>
          </div>

          <div>
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Direct Android APK Download
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-0.5">
              Install directly on any Android smartphone. Works fully offline without requiring Google Play Store.
            </p>
          </div>

          <button
            onClick={handleDirectApkDownload}
            className="w-full py-3 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-extrabold text-sm shadow-md shadow-brand-500/30 flex items-center justify-center space-x-2 touch-press transition-colors"
          >
            <Download className="w-4 h-4 animate-bounce" />
            <span>Download APK File (7.2 MB)</span>
          </button>

          {/* Sideload Instruction Toggle */}
          <button
            type="button"
            onClick={() => setShowInstructions(!showInstructions)}
            className="w-full pt-1 flex items-center justify-between text-[11px] font-bold text-brand-600 dark:text-brand-400 hover:underline"
          >
            <span className="flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              How to install APK on Android?
            </span>
            {showInstructions ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

          {showInstructions && (
            <div className="mt-2 p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-brand-200/60 dark:border-brand-900/60 text-[11px] text-slate-700 dark:text-slate-300 space-y-1.5 animate-in fade-in duration-150">
              <div className="flex items-start space-x-1.5">
                <span className="font-black text-brand-600 dark:text-brand-400">1.</span>
                <span>Tap <strong>Download APK</strong> above to download <code className="text-brand-600 dark:text-brand-400">kbcut-app.apk</code>.</span>
              </div>
              <div className="flex items-start space-x-1.5">
                <span className="font-black text-brand-600 dark:text-brand-400">2.</span>
                <span>If Chrome warns <em>"File might be harmful"</em>, tap <strong>"Download anyway"</strong> (this is Android's standard prompt for apps outside Play Store).</span>
              </div>
              <div className="flex items-start space-x-1.5">
                <span className="font-black text-brand-600 dark:text-brand-400">3.</span>
                <span>Open the file from your notifications or Downloads folder and tap <strong>"Install"</strong>.</span>
              </div>
            </div>
          )}
        </div>

        {/* Option 2: Instant PWA Home Screen Install */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-accent-500 text-white text-[10px] font-extrabold uppercase tracking-wider">
              Instant Web App (PWA)
            </span>
            <span className="text-[11px] text-slate-400 font-semibold">0 MB Storage • iOS & Android</span>
          </div>

          <div>
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Add to Home Screen
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
              Works directly in your browser without saving any APK file. Instant launch with offline caching.
            </p>
          </div>

          <button
            onClick={handlePwaInstall}
            className="w-full py-2.5 px-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-400 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center space-x-1.5 touch-press transition-colors"
          >
            <Smartphone className="w-4 h-4 text-accent-500" />
            <span>Install / Add to Home Screen</span>
          </button>
        </div>

        {/* Bottom Actions: Privacy & Share */}
        <div className="pt-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-1.5 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-accent-500 shrink-0" />
            <span>100% Device-Only • No Cloud</span>
          </div>

          <button
            onClick={handleShare}
            className="inline-flex items-center space-x-1 text-[11px] font-bold text-brand-600 dark:text-brand-400 hover:underline touch-press"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share App</span>
          </button>
        </div>
      </div>
    </div>
  );
};
