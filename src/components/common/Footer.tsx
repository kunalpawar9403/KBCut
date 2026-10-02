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
  Smartphone,
  Sparkles,
} from 'lucide-react';

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
    <footer className="w-full bg-slate-50/70 dark:bg-slate-900/90 border-t border-slate-200/80 dark:border-slate-800 transition-colors relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
        
        {/* Main Columns Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 pb-8 border-b border-slate-200/80 dark:border-slate-800">
          
          {/* Col 1: Brand & On-Device Guarantee (4 cols on desktop) */}
          <div className="lg:col-span-4 space-y-3.5">
            <div className="flex items-center space-x-2.5">
              <img
                src="/logo.png"
                alt="KBCut Logo"
                className="w-8 h-8 rounded-xl shadow-sm object-contain bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 p-0.5"
              />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 dark:from-brand-400 dark:to-indigo-300 bg-clip-text text-transparent">
                    KBCut
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded-md bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 border border-brand-200/60 dark:border-brand-800/60">
                    v1.0
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  Photo & PDF Size Reducer
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              Free, private in-browser document optimizer engineered for Indian students and job seekers. Resize photos, compress PDFs, and join signatures strictly under official portal limits without quality loss.
            </p>

            {/* Privacy Guarantee Pill */}
            <div className="inline-flex items-center space-x-2 px-3 py-2 rounded-xl bg-accent-50/90 dark:bg-accent-950/50 border border-accent-200/70 dark:border-accent-900/60 text-accent-900 dark:text-accent-300 text-xs font-bold max-w-full">
              <Lock className="w-3.5 h-3.5 text-accent-600 dark:text-accent-400 shrink-0" />
              <span className="truncate">100% On-Device • Files Never Leave Your Device</span>
            </div>
          </div>

          {/* Col 2 & Col 3: Two side-by-side columns on mobile/tablet for compact scanning */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4 sm:gap-6">
            
            {/* Sub-Col A: Popular Exam Resizers */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-[11px] uppercase tracking-wider text-slate-900 dark:text-white flex items-center space-x-1.5">
                <FileCheck className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                <span className="truncate">Exam Resizers</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
                <li>
                  <button
                    onClick={() => handleSeoClick('compress-image-to-50kb')}
                    className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors text-left flex items-start space-x-1.5"
                  >
                    <span className="text-brand-500 mt-0.5">•</span>
                    <span>Photo 50 KB (SSC)</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleSeoClick('signature-resize-140x60')}
                    className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors text-left flex items-start space-x-1.5"
                  >
                    <span className="text-brand-500 mt-0.5">•</span>
                    <span>Sign 140x60 (20 KB)</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleSeoClick('compress-image-to-100kb')}
                    className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors text-left flex items-start space-x-1.5"
                  >
                    <span className="text-brand-500 mt-0.5">•</span>
                    <span>Photo 100 KB (UPSC)</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleSeoClick('compress-pdf-to-200kb')}
                    className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors text-left flex items-start space-x-1.5"
                  >
                    <span className="text-brand-500 mt-0.5">•</span>
                    <span>PDF 200 KB (Aadhaar)</span>
                  </button>
                </li>
                <li className="pt-0.5">
                  <button
                    onClick={() => {
                      onNavigateTab?.('home');
                      scrollToTop();
                    }}
                    className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors text-left font-bold text-brand-600 dark:text-brand-400 text-[11px]"
                  >
                    View 30+ Presets →
                  </button>
                </li>
              </ul>
            </div>

            {/* Sub-Col B: Document Tools */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-[11px] uppercase tracking-wider text-slate-900 dark:text-white flex items-center space-x-1.5">
                <Wrench className="w-3.5 h-3.5 text-accent-500 shrink-0" />
                <span className="truncate">Document Tools</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
                <li>
                  <button
                    onClick={() => onNavigateTab?.('tools')}
                    className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors text-left flex items-start space-x-1.5"
                  >
                    <span className="text-accent-500 mt-0.5">•</span>
                    <span>Aadhaar 2-in-1 A4</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigateTab?.('tools')}
                    className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors text-left flex items-start space-x-1.5"
                  >
                    <span className="text-accent-500 mt-0.5">•</span>
                    <span>Photo + Sign Joiner</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigateTab?.('tools')}
                    className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors text-left flex items-start space-x-1.5"
                  >
                    <span className="text-accent-500 mt-0.5">•</span>
                    <span>Draw & Sign PDF</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigateTab?.('tools')}
                    className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors text-left flex items-start space-x-1.5"
                  >
                    <span className="text-accent-500 mt-0.5">•</span>
                    <span>Merge PDFs & Images</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigateTab?.('tools')}
                    className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors text-left flex items-start space-x-1.5"
                  >
                    <span className="text-accent-500 mt-0.5">•</span>
                    <span>Split & Rotate PDF</span>
                  </button>
                </li>
              </ul>
            </div>

          </div>

          {/* Col 4: Trust & Privacy (3 cols on desktop) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-extrabold text-[11px] uppercase tracking-wider text-slate-900 dark:text-white flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Trust & Privacy</span>
            </h4>
            
            {/* Trust points list */}
            <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400 font-medium">
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

          </div>

        </div>

        {/* Supported Portals Strip */}
        <div className="py-4 sm:py-5 border-b border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          <div className="flex items-center space-x-1.5 shrink-0">
            <Globe2 className="w-3.5 h-3.5 text-brand-500 shrink-0" />
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
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
                className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[10px] sm:text-[11px] border border-slate-200/80 dark:border-slate-700/60 shadow-2xs"
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="py-3.5 sm:py-4 border-b border-slate-200/80 dark:border-slate-800">
          <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed text-center sm:text-left">
            <strong className="text-slate-700 dark:text-slate-300 font-semibold">Disclaimer:</strong> KBCut is an independent client-side utility. All file processing is executed locally in your browser and files never leave your device. KBCut is not affiliated with, endorsed by, or connected to SSC, UPSC, IBPS, UIDAI, or any government examination authority.
          </p>
        </div>

        {/* Bottom Bar: Copyright & Quick Links */}
        <div className="pt-4 sm:pt-5 flex flex-col-reverse sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-3 sm:gap-4">
          <div className="flex items-center space-x-1 text-center sm:text-left text-[11px] sm:text-xs">
            <span>© {new Date().getFullYear()} KBCut. Made with</span>
            <Heart className="w-3 h-3 inline text-rose-500 fill-current mx-0.5" />
            <span>for Indian Students & Job Seekers.</span>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4 text-xs font-semibold">
            <button
              onClick={() => {
                onNavigateTab?.('home');
                scrollToTop();
              }}
              className="hover:text-brand-500 transition-colors py-1"
            >
              Home
            </button>
            <button
              onClick={() => {
                onNavigateTab?.('tools');
                scrollToTop();
              }}
              className="hover:text-brand-500 transition-colors py-1"
            >
              Tools
            </button>
            <button
              onClick={() => {
                onNavigateTab?.('history');
                scrollToTop();
              }}
              className="hover:text-brand-500 transition-colors py-1"
            >
              History
            </button>
            <button
              onClick={() => {
                onNavigateTab?.('settings');
                scrollToTop();
              }}
              className="hover:text-brand-500 transition-colors py-1"
            >
              Settings
            </button>
            <button
              onClick={scrollToTop}
              aria-label="Scroll to top"
              className="inline-flex items-center space-x-1 px-2 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-brand-950/60 text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 text-[11px] font-bold transition-all border border-slate-200 dark:border-slate-700 shadow-2xs"
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

