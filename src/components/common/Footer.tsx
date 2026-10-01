import React from 'react';
import { useI18n } from '../../i18n';
import { ShieldCheck, Heart, Sparkles, FileText, ArrowRight, Lock, Download } from 'lucide-react';
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

  return (
    <footer className="w-full bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Col 1: Brand & Privacy Guarantee */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3.5">
              <img
                src="/logo.png"
                alt="KBCut Logo"
                className="w-14 h-14 rounded-2xl shadow-md object-contain bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1.5"
              />
              <div>
                <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-brand-600 to-indigo-600 dark:from-brand-400 dark:to-indigo-300 bg-clip-text text-transparent">
                  KBCut
                </span>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 -mt-0.5">
                  Photo & PDF Size Reducer
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              Free, private in-browser document reducer helping students and job seekers across India get photos, signatures, and PDFs strictly under portal limits for SSC, UPSC, Banking, MPSC & Passport applications.
            </p>

            <div className="flex items-center space-x-2 p-3 rounded-2xl bg-accent-50/80 dark:bg-accent-950/40 border border-accent-200/60 dark:border-accent-900/60 text-accent-900 dark:text-accent-300 text-xs font-semibold max-w-sm">
              <Lock className="w-4 h-4 text-accent-600 shrink-0" />
              <span>100% Client-Side • Files Never Leave Your Device</span>
            </div>
          </div>

          {/* Col 2: Popular Exam Compressions (SEO routes) */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
              Exam Resizers
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-400">
              <li>
                <button
                  onClick={() => handleSeoClick('compress-image-to-50kb')}
                  className="hover:text-brand-500 transition-colors text-left"
                >
                  Compress Photo to 50 KB (SSC)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleSeoClick('signature-resize-140x60')}
                  className="hover:text-brand-500 transition-colors text-left"
                >
                  Signature Resize 140x60 px
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleSeoClick('compress-image-to-100kb')}
                  className="hover:text-brand-500 transition-colors text-left"
                >
                  Compress Photo to 100 KB
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleSeoClick('compress-pdf-to-200kb')}
                  className="hover:text-brand-500 transition-colors text-left"
                >
                  Compress PDF to 200 KB (Aadhaar)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Document Tools */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
              Document Tools
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-400">
              <li>
                <button
                  onClick={() => onNavigateTab?.('tools')}
                  className="hover:text-brand-500 transition-colors text-left"
                >
                  Aadhaar 2-in-1 on A4 Page
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab?.('tools')}
                  className="hover:text-brand-500 transition-colors text-left"
                >
                  Photo + Signature Sheet
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab?.('tools')}
                  className="hover:text-brand-500 transition-colors text-left"
                >
                  E-Sign PDF (Draw Signature)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab?.('tools')}
                  className="hover:text-brand-500 transition-colors text-left"
                >
                  Merge PDF & Images
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab?.('tools')}
                  className="hover:text-brand-500 transition-colors text-left"
                >
                  Split & Rotate PDF
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform & Trust */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
              Privacy & Info
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-400">
              <li className="flex items-center space-x-1.5 text-accent-600 dark:text-accent-400 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero Server Uploads</span>
              </li>
              <li>No Login or Registration</li>
              <li>No Third-Party Analytics</li>
              <li>Offline Ready (PWA Support)</li>
              <li>WebAssembly & Web Workers</li>
              <li className="pt-2">
                <a
                  href={getApkDownloadUrl()}
                  download="kbcut-app.apk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs shadow-md shadow-brand-500/20 transition-all touch-press"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Android APK (14 MB)</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-3">
          <p>© {new Date().getFullYear()} KBCut. Made with <Heart className="w-3.5 h-3.5 inline text-rose-500 fill-current mx-0.5" /> for Indian Students & Job Seekers.</p>
          <div className="flex items-center space-x-4">
            <span className="text-[11px] font-semibold text-slate-400">
              UPSC • SSC • IBPS • MPSC • NEET • JEE
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
