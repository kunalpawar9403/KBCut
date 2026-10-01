import React from 'react';
import { useI18n } from '../../i18n';
import {
  ShieldCheck,
  Heart,
  Lock,
  Zap,
  CheckCircle2,
  ArrowUp,
  FileCheck,
  Wrench,
  Globe2,
  Download,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import { getApkDownloadUrl } from '../../utils/formatters';

interface FooterProps {
  onNavigateTab?: (tab: 'home' | 'tools' | 'history' | 'settings') => void;
  onNavigateSeo?: (slug: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab, onNavigateSeo }) => {
  const { t } = useI18n();

  const handleSeoClick = (slug: string) => {
    window.history.pushState({}, '', `/${slug}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-10 border-b border-slate-200/80 dark:border-slate-800">
          
          {/* Col 1: Brand & Guarantee (4 columns on lg) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center space-x-3.5">
              <img
                src="/logo.png"
                alt="KBCut Logo"
                className="w-13 h-13 rounded-2xl shadow-md object-contain bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 p-1"
              />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 dark:from-brand-400 dark:to-indigo-300 bg-clip-text text-transparent">
                    KBCut
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 border border-brand-200/60 dark:border-brand-800/60">
                    v1.0
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 -mt-0.5">
                  Photo & PDF Size Reducer
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              India's fast, privacy-first document optimizer. Resize photos, compress PDFs, and join signatures strictly under official portal guidelines without quality loss.
            </p>

            {/* Privacy Guarantee Pill */}
            <div className="flex items-center space-x-2.5 p-3 rounded-2xl bg-accent-50/80 dark:bg-accent-950/40 border border-accent-200/60 dark:border-accent-900/60 text-accent-900 dark:text-accent-300 text-xs font-bold">
              <Lock className="w-4 h-4 text-accent-600 dark:text-accent-400 shrink-0" />
              <span>100% On-Device • Files Never Leave Your Device</span>
            </div>
          </div>

          {/* Col 2: Popular Exam Resizers (3 columns on lg) */}
          <div className="lg:col-span-3 space-y-3.5">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-white flex items-center space-x-1.5">
              <FileCheck className="w-4 h-4 text-brand-500" />
              <span>Popular Exam Resizers</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <li>
                <button
                  onClick={() => handleSeoClick('compress-image-to-50kb')}
                  className="hover:text-brand-600 dark:hover:text-brand-400 hover:translate-x-1 transition-all text-left flex items-center space-x-2 py-0.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500/60 shrink-0" />
                  <span>Compress Photo to 50 KB (SSC)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleSeoClick('signature-resize-140x60')}
                  className="hover:text-brand-600 dark:hover:text-brand-400 hover:translate-x-1 transition-all text-left flex items-center space-x-2 py-0.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500/60 shrink-0" />
                  <span>Signature Resize 140x60 px (20 KB)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleSeoClick('compress-image-to-100kb')}
                  className="hover:text-brand-600 dark:hover:text-brand-400 hover:translate-x-1 transition-all text-left flex items-center space-x-2 py-0.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500/60 shrink-0" />
                  <span>Compress Photo to 100 KB (UPSC)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleSeoClick('compress-pdf-to-200kb')}
                  className="hover:text-brand-600 dark:hover:text-brand-400 hover:translate-x-1 transition-all text-left flex items-center space-x-2 py-0.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500/60 shrink-0" />
                  <span>Compress PDF to 200 KB (Aadhaar)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigateTab?.('home');
                    scrollToTop();
                  }}
                  className="hover:text-brand-600 dark:hover:text-brand-400 hover:translate-x-1 transition-all text-left flex items-center space-x-2 py-0.5 font-bold text-brand-600 dark:text-brand-400 pt-1"
                >
                  <span>→ View All 30+ Portal Presets</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Document Tools (2.5 / 3 columns on lg) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-white flex items-center space-x-1.5">
              <Wrench className="w-4 h-4 text-accent-500" />
              <span>Exam Document Tools</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <li>
                <button
                  onClick={() => onNavigateTab?.('tools')}
                  className="hover:text-brand-600 dark:hover:text-brand-400 hover:translate-x-1 transition-all text-left flex items-center space-x-2 py-0.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-500/60 shrink-0" />
                  <span>Aadhaar 2-in-1 on A4</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab?.('tools')}
                  className="hover:text-brand-600 dark:hover:text-brand-400 hover:translate-x-1 transition-all text-left flex items-center space-x-2 py-0.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-500/60 shrink-0" />
                  <span>Photo + Sign Joiner</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab?.('tools')}
                  className="hover:text-brand-600 dark:hover:text-brand-400 hover:translate-x-1 transition-all text-left flex items-center space-x-2 py-0.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-500/60 shrink-0" />
                  <span>Draw & Sign PDF</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab?.('tools')}
                  className="hover:text-brand-600 dark:hover:text-brand-400 hover:translate-x-1 transition-all text-left flex items-center space-x-2 py-0.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-500/60 shrink-0" />
                  <span>Merge PDFs & Images</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab?.('tools')}
                  className="hover:text-brand-600 dark:hover:text-brand-400 hover:translate-x-1 transition-all text-left flex items-center space-x-2 py-0.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-500/60 shrink-0" />
                  <span>Split & Rotate PDF</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Privacy & App Download (3 columns on lg) */}
          <div className="lg:col-span-3 space-y-3.5">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-white flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Trust & Android App</span>
            </h4>
            
            {/* Trust points list */}
            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Zero Server Uploads (100% Private)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                <span>WebAssembly Speed Engine</span>
              </div>
              <div className="flex items-center space-x-2">
                <Smartphone className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span>Works Completely Offline</span>
              </div>
            </div>

            {/* Android APK Download Card */}
            <div className="pt-2">
              <a
                href={getApkDownloadUrl()}
                download="kbcut-app.apk"
                target="_blank"
                rel="noopener noreferrer"
                className="group block p-3 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-brand-900 hover:from-slate-800 hover:to-brand-800 text-white shadow-md hover:shadow-lg transition-all border border-slate-700/60 touch-press"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-brand-500/20 text-brand-300 border border-brand-400/30 group-hover:scale-105 transition-transform">
                    <Download className="w-4 h-4 text-brand-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs font-black tracking-tight">Android App (APK)</span>
                      <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/30">
                        7.2 MB
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-300 truncate">
                      Direct download • No login required
                    </p>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Supported Portals Strip */}
        <div className="py-6 border-b border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-2 shrink-0">
            <Globe2 className="w-4 h-4 text-brand-500 shrink-0" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Supported Portals:
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              'SSC CGL / CHSL',
              'UPSC CSE',
              'IBPS PO / Clerk',
              'SBI Clerk',
              'MPSC',
              'NEET / JEE',
              'Aadhaar UIDAI',
              'Passport Seva',
              'Railway RRB',
              'BPSC',
              'CUET',
            ].map((p) => (
              <span
                key={p}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold text-[11px] border border-slate-200/70 dark:border-slate-700/60"
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="py-5 border-b border-slate-200/80 dark:border-slate-800">
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            <strong className="text-slate-700 dark:text-slate-300">Disclaimer:</strong> KBCut is an independent client-side privacy tool. All compression and file processing are executed entirely inside your web browser. Documents are never transmitted, stored, or viewed by any server. KBCut is not affiliated with, endorsed by, or connected to SSC, UPSC, IBPS, UIDAI, or any government examination authority.
          </p>
        </div>

        {/* Bottom Bar: Copyright & Quick Links */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-4">
          <div className="flex items-center space-x-1 text-center sm:text-left">
            <span>© {new Date().getFullYear()} KBCut. Made with</span>
            <Heart className="w-3.5 h-3.5 inline text-rose-500 fill-current mx-0.5" />
            <span>for Indian Students & Job Seekers.</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                onNavigateTab?.('home');
                scrollToTop();
              }}
              className="hover:text-brand-500 font-semibold transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => {
                onNavigateTab?.('tools');
                scrollToTop();
              }}
              className="hover:text-brand-500 font-semibold transition-colors"
            >
              Tools
            </button>
            <button
              onClick={() => {
                onNavigateTab?.('history');
                scrollToTop();
              }}
              className="hover:text-brand-500 font-semibold transition-colors"
            >
              History
            </button>
            <button
              onClick={() => {
                onNavigateTab?.('settings');
                scrollToTop();
              }}
              className="hover:text-brand-500 font-semibold transition-colors"
            >
              Settings
            </button>
            <button
              onClick={scrollToTop}
              aria-label="Scroll to top"
              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-brand-950/60 text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 text-xs font-bold transition-all ml-1 border border-slate-200 dark:border-slate-700"
            >
              <span>Top</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

