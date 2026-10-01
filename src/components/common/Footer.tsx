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
    <footer className="w-full bg-white dark:bg-slate-900/90 border-t border-slate-200/80 dark:border-slate-800 transition-colors relative z-10">
      {/* Top Main Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Col 1: Brand & Architecture (4 cols on desktop) */}
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

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              Free, private in-browser document optimizer engineered for Indian students and job seekers. Get photos, signatures, and PDFs strictly under portal limits without quality loss.
            </p>

            {/* Trust Badges Pill Grid */}
            <div className="grid grid-cols-2 gap-2 pt-1 max-w-sm">
              <div className="flex items-center space-x-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                <Lock className="w-3.5 h-3.5 text-accent-500 shrink-0" />
                <span>100% On-Device</span>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-accent-500 shrink-0" />
                <span>Zero Cloud Uploads</span>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                <Zap className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                <span>WebAssembly Speed</span>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                <span>Strict Limit Guarantee</span>
              </div>
            </div>
          </div>

          {/* Col 2: Popular Exam Resizers (3 cols on desktop) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-extrabold text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center space-x-1.5">
              <FileCheck className="w-3.5 h-3.5 text-brand-500" />
              <span>Exam Resizers</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <li>
                <button
                  onClick={() => handleSeoClick('compress-image-to-50kb')}
                  className="hover:text-brand-600 dark:hover:text-brand-400 hover:translate-x-1 transition-all text-left flex items-center space-x-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500/50" />
                  <span>Compress Photo to 50 KB (SSC)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleSeoClick('signature-resize-140x60')}
                  className="hover:text-brand-600 dark:hover:text-brand-400 hover:translate-x-1 transition-all text-left flex items-center space-x-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500/50" />
                  <span>Signature Resize 140x60 px</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleSeoClick('compress-image-to-100kb')}
                  className="hover:text-brand-600 dark:hover:text-brand-400 hover:translate-x-1 transition-all text-left flex items-center space-x-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500/50" />
                  <span>Compress Photo to 100 KB</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleSeoClick('compress-pdf-to-200kb')}
                  className="hover:text-brand-600 dark:hover:text-brand-400 hover:translate-x-1 transition-all text-left flex items-center space-x-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500/50" />
                  <span>Compress PDF to 200 KB (Aadhaar)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigateTab?.('home');
                    scrollToTop();
                  }}
                  className="hover:text-brand-600 dark:hover:text-brand-400 hover:translate-x-1 transition-all text-left flex items-center space-x-1.5 font-bold text-brand-600 dark:text-brand-400"
                >
                  <span>→ View All Exam Presets</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Document Toolkit (3 cols on desktop) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-extrabold text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center space-x-1.5">
              <Wrench className="w-3.5 h-3.5 text-accent-500" />
              <span>Exam Document Tools</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <li>
                <button
                  onClick={() => onNavigateTab?.('tools')}
                  className="hover:text-brand-600 dark:hover:text-brand-400 hover:translate-x-1 transition-all text-left flex items-center space-x-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-500/50" />
                  <span>Aadhaar Front & Back on A4</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab?.('tools')}
                  className="hover:text-brand-600 dark:hover:text-brand-400 hover:translate-x-1 transition-all text-left flex items-center space-x-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-500/50" />
                  <span>Photo + Signature Joiner</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab?.('tools')}
                  className="hover:text-brand-600 dark:hover:text-brand-400 hover:translate-x-1 transition-all text-left flex items-center space-x-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-500/50" />
                  <span>Draw & E-Sign PDF Document</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab?.('tools')}
                  className="hover:text-brand-600 dark:hover:text-brand-400 hover:translate-x-1 transition-all text-left flex items-center space-x-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-500/50" />
                  <span>Merge Multiple PDFs & Images</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab?.('tools')}
                  className="hover:text-brand-600 dark:hover:text-brand-400 hover:translate-x-1 transition-all text-left flex items-center space-x-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-500/50" />
                  <span>Split, Rotate & Extract Pages</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Supported Portals (2 cols on desktop) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-extrabold text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center space-x-1.5">
              <Globe2 className="w-3.5 h-3.5 text-indigo-500" />
              <span>Supported Portals</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {['SSC CGL', 'UPSC CSE', 'IBPS PO', 'MPSC', 'NEET', 'JEE', 'Aadhaar', 'Passport', 'Railway RRB', 'BPSC'].map((p) => (
                <span
                  key={p}
                  className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[10px] border border-slate-200/60 dark:border-slate-700/60"
                >
                  {p}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 pt-1 leading-normal">
              Built to strictly match guidelines released by official exam boards.
            </p>
          </div>
        </div>

        {/* Disclaimer Note */}
        <div className="mt-10 pt-6 border-t border-slate-200/60 dark:border-slate-800/80">
          <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center sm:text-left leading-relaxed">
            <strong>Disclaimer:</strong> KBCut is an independent privacy-first document utility. All photo and PDF processing happens locally in your web browser. Documents are never transmitted or stored on any server. KBCut is not affiliated with or endorsed by SSC, UPSC, IBPS, UIDAI, or any government portal.
          </p>
        </div>

        {/* Bottom Bar: Copyright & Navigation */}
        <div className="mt-6 pt-6 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-4">
          <div className="flex items-center space-x-1 text-center sm:text-left">
            <span>© {new Date().getFullYear()} KBCut. Made with</span>
            <Heart className="w-3.5 h-3.5 inline text-rose-500 fill-current mx-0.5" />
            <span>for Indian Students & Job Seekers.</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => onNavigateTab?.('home')}
              className="hover:text-brand-500 font-semibold transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => onNavigateTab?.('tools')}
              className="hover:text-brand-500 font-semibold transition-colors"
            >
              Tools
            </button>
            <button
              onClick={() => onNavigateTab?.('history')}
              className="hover:text-brand-500 font-semibold transition-colors"
            >
              History
            </button>
            <button
              onClick={() => onNavigateTab?.('settings')}
              className="hover:text-brand-500 font-semibold transition-colors"
            >
              Settings
            </button>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-brand-950/60 text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 text-xs font-bold transition-all ml-2"
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
