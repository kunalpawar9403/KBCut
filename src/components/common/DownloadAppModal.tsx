import React from 'react';
import { pwaService } from '../../services/pwa';
import { toast } from './Toast';
import {
  X,
  Smartphone,
  ShieldCheck,
  Share2,
  Plus,
  Wifi,
  Zap,
  CheckCircle2,
} from 'lucide-react';

interface DownloadAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadAppModal: React.FC<DownloadAppModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePwaInstall = async () => {
    const accepted = await pwaService.promptInstall();
    if (accepted) {
      toast.success('KBCut installed to your home screen!');
      onClose();
    } else {
      toast.info('Tap browser menu (⋮ or Share ↑) → "Add to Home Screen"');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'KBCut - Photo & PDF Size Reducer',
          text: 'Free offline tool to resize exam photos & PDFs. No uploads, 100% private.',
          url: window.location.origin,
        });
      } catch {
        // cancelled
      }
    } else {
      await navigator.clipboard.writeText(window.location.origin);
      toast.success('App link copied to clipboard!');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">

        {/* ── Hero gradient strip ── */}
        <div className="relative bg-gradient-to-br from-brand-600 via-brand-500 to-indigo-600 px-6 pt-8 pb-10">
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Logo + title row */}
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="absolute -inset-1 bg-white/30 rounded-2xl blur-sm" />
              <img
                src="/logo.png"
                alt="KBCut"
                className="relative w-14 h-14 rounded-2xl object-contain bg-white p-1 shadow-lg"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl text-white tracking-tight">KBCut</span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30">
                  v1.0
                </span>
              </div>
              <p className="text-xs text-brand-100 font-medium mt-0.5">
                Photo &amp; PDF Size Reducer
              </p>
            </div>
          </div>

          {/* Tag line */}
          <p className="mt-4 text-sm text-white/90 font-semibold leading-snug">
            Add KBCut to your home screen — works completely offline, no install required.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 mt-3">
            {[
              { icon: <Wifi className="w-3 h-3" />, label: 'Works Offline' },
              { icon: <Zap className="w-3 h-3" />, label: 'Instant Launch' },
              { icon: <ShieldCheck className="w-3 h-3" />, label: '0 MB Storage' },
            ].map((pill) => (
              <span
                key={pill.label}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/15 border border-white/25 text-white text-[11px] font-semibold"
              >
                {pill.icon}
                {pill.label}
              </span>
            ))}
          </div>
        </div>

        {/* ── Overlap card ── */}
        <div className="relative -mt-5 mx-4 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 p-4 space-y-3">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            How to install
          </p>

          {[
            { num: '1', text: 'Tap the browser menu', sub: '(⋮ on Android · Share ↑ on iPhone)' },
            { num: '2', text: 'Select "Add to Home Screen"', sub: 'Find it in the menu list' },
            { num: '3', text: 'Tap "Add" to confirm', sub: 'Opens instantly like a native app' },
          ].map((step) => (
            <div key={step.num} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-brand-500 text-white text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5">
                {step.num}
              </span>
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{step.text}</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">{step.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Actions ── */}
        <div className="px-4 pt-3 pb-5 space-y-2.5">
          {/* Primary CTA */}
          <button
            onClick={handlePwaInstall}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-brand-500 to-indigo-600 hover:from-brand-600 hover:to-indigo-700 active:scale-[0.98] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-500/25 transition-all touch-press"
          >
            <Plus className="w-4 h-4" />
            <span>Add to Home Screen</span>
          </button>

          {/* Share link */}
          <button
            onClick={handleShare}
            className="w-full py-2.5 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-2 transition-all touch-press"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share App Link</span>
          </button>

          {/* Privacy note */}
          <div className="flex items-center justify-center gap-1.5 pt-0.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
              100% private · No account · No cloud uploads
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
