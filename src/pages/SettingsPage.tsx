import React, { useState, useEffect } from 'react';
import { useI18n, Language } from '../i18n';
import { pwaService } from '../services/pwa';
import { toast } from '../components/common/Toast';
import {
  Settings,
  Languages,
  Moon,
  Sun,
  ShieldCheck,
  Info,
  DownloadCloud,
  Check,
  Smartphone,
  Download,
} from 'lucide-react';
import { DownloadAppModal } from '../components/common/DownloadAppModal';

interface SettingsPageProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ theme, onToggleTheme }) => {
  const { lang, setLang, t } = useI18n();
  const [canInstall, setCanInstall] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  useEffect(() => {
    const unsubscribe = pwaService.subscribe((installable) => setCanInstall(installable));
    return () => {
      unsubscribe();
    };
  }, []);

  const handleInstallApp = async () => {
    const accepted = await pwaService.promptInstall();
    if (accepted) {
      toast.success('KBCut App installed successfully!');
    }
  };

  const languages: { id: Language; label: string; sub: string }[] = [
    { id: 'en', label: 'English', sub: 'Default' },
    { id: 'mr', label: 'मराठी', sub: 'Marathi' },
    { id: 'hi', label: 'हिंदी', sub: 'Hindi' },
  ];

  return (
    <div className="w-full space-y-5 pb-20 md:pb-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-brand-500" />
          <span>{t('settings.title')}</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Preferences & app details
        </p>
      </div>

      {/* KBCut Android App & APK Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-brand-50 to-blue-50 dark:from-slate-900 dark:to-brand-950/40 border border-brand-200/90 dark:border-brand-800 shadow-soft space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-500 text-white flex items-center justify-center shadow-sm">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Android App (.APK)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent-100 dark:bg-accent-950 text-accent-700 dark:text-accent-300 font-extrabold">
                  Offline
                </span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Direct install on any Android phone (14 MB)
              </p>
            </div>
          </div>

          <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
            v1.0.0
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          <a
            href="/kbcut.apk"
            download="kbcut-app.apk"
            className="flex-1 py-2.5 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs flex items-center justify-center space-x-2 shadow-sm touch-press transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download APK (14 MB)</span>
          </a>

          <button
            type="button"
            onClick={() => setShowDownloadModal(true)}
            className="py-2.5 px-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center space-x-1.5 hover:bg-slate-50 dark:hover:bg-slate-700 touch-press transition-colors"
          >
            <span>Installation Guide</span>
          </button>
        </div>
      </div>

      {/* PWA Install Banner */}
      {canInstall && (
        <div className="p-4 rounded-3xl bg-brand-500 text-white shadow-elevated flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
              <DownloadCloud className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm">Install KBCut App</h4>
              <p className="text-xs text-brand-100">Fast offline access on your home screen</p>
            </div>
          </div>
          <button
            onClick={handleInstallApp}
            className="px-3.5 py-2 rounded-xl bg-white text-brand-600 font-extrabold text-xs shadow-sm touch-press"
          >
            Install
          </button>
        </div>
      )}

      {/* Language Selector Card */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Languages className="w-4 h-4 text-brand-500" />
          <span>{t('settings.language')}</span>
        </label>

        <div className="grid grid-cols-3 gap-2">
          {languages.map((l) => {
            const isSelected = lang === l.id;
            return (
              <button
                key={l.id}
                type="button"
                onClick={() => setLang(l.id)}
                className={`p-3 rounded-2xl border text-center transition-all touch-press ${
                  isSelected
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/60 ring-2 ring-brand-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50'
                }`}
              >
                <p
                  className={`font-bold text-sm ${
                    isSelected ? 'text-brand-600 dark:text-brand-400' : 'text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {l.label}
                </p>
                <span className="text-[10px] text-slate-400 block mt-0.5">{l.sub}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Theme Card */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
            {theme === 'dark' ? <Moon className="w-5 h-5 text-amber-400" /> : <Sun className="w-5 h-5" />}
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              {t('settings.theme')}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {theme === 'dark' ? t('settings.themeDark') : t('settings.themeLight')}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleTheme}
          className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs text-slate-800 dark:text-slate-200 transition-colors touch-press"
        >
          {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
        </button>
      </div>

      {/* Privacy Policy Guarantee */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft space-y-2">
        <div className="flex items-center space-x-2 text-accent-600 dark:text-accent-400 font-bold text-sm">
          <ShieldCheck className="w-5 h-5 shrink-0" />
          <span>{t('settings.privacyTitle')}</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {t('settings.privacyText')}
        </p>
        <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-semibold text-accent-700 dark:text-accent-400">
          <span className="px-2.5 py-1 rounded-full bg-accent-50 dark:bg-accent-950/60 border border-accent-200 dark:border-accent-900">
            ✓ Zero Cloud Uploads
          </span>
          <span className="px-2.5 py-1 rounded-full bg-accent-50 dark:bg-accent-950/60 border border-accent-200 dark:border-accent-900">
            ✓ No Login or Accounts
          </span>
          <span className="px-2.5 py-1 rounded-full bg-accent-50 dark:bg-accent-950/60 border border-accent-200 dark:border-accent-900">
            ✓ Safe for Aadhaar & PAN
          </span>
        </div>
      </div>

      {/* About KBCut */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft space-y-2">
        <div className="flex items-center space-x-2 text-slate-800 dark:text-slate-200 font-bold text-sm">
          <Info className="w-4 h-4 text-brand-500 shrink-0" />
          <span>{t('settings.aboutTitle')}</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          {t('settings.aboutText')}
        </p>
        <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800 mt-2">
          <span>{t('settings.version')} 1.0.0</span>
          <span>{t('settings.offlineReady')}</span>
        </div>
      </div>

      {/* Download App Modal */}
      <DownloadAppModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
      />
    </div>
  );
};
