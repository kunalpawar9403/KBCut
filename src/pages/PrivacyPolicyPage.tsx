import React from 'react';
import { ShieldCheck, Lock, EyeOff, ServerOff, Database, ArrowLeft } from 'lucide-react';

interface PrivacyPolicyPageProps {
  onBack?: () => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 px-4 sm:px-6 space-y-8">
      {onBack && (
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:underline mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to App</span>
        </button>
      )}

      {/* Header */}
      <div className="space-y-3 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>100% Client-Side • Zero Data Collection</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Last updated: October 2026 • Effective for KBCut Web & Android App (com.kbcut.app)
        </p>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft">
          <ServerOff className="w-8 h-8 text-brand-500 mb-3" />
          <h2 className="font-bold text-base text-slate-900 dark:text-white">Zero Server Uploads</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
            Your photos, signatures, and PDFs are processed strictly inside your device browser or app. They are never sent to any remote server.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft">
          <EyeOff className="w-8 h-8 text-accent-500 mb-3" />
          <h2 className="font-bold text-base text-slate-900 dark:text-white">No Tracking or Ads</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
            We do not use advertising trackers, biometric fingerprinting, or invasive analytics. Your identity remains private.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft">
          <Database className="w-8 h-8 text-indigo-500 mb-3" />
          <h2 className="font-bold text-base text-slate-900 dark:text-white">Local Storage Only</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
            Recent files history and user preferences are stored exclusively on your device's IndexedDB / LocalStorage, and can be cleared with one tap.
          </p>
        </div>
      </div>

      {/* Detailed Policy Sections */}
      <div className="space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-soft">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-brand-500" />
            <span>1. Information We Do NOT Collect</span>
          </h2>
          <p>
            KBCut is designed with privacy-first engineering. Because all compression algorithms (MozJPEG, OxiPNG, QPDF WebAssembly) run locally on your device hardware:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            <li>We do NOT collect, store, or view your uploaded photos, signatures, or PDF documents.</li>
            <li>We do NOT collect personally identifiable information (Name, Email, Phone Number, Aadhaar details).</li>
            <li>We do NOT collect precise geolocation data.</li>
            <li>We do NOT sell or monetize your personal data.</li>
          </ul>
        </section>

        <section className="space-y-2 border-t border-slate-200 dark:border-slate-800 pt-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            2. Android App Permissions
          </h2>
          <p>
            The KBCut Android application (<code>com.kbcut.app</code>) requests only standard network permission (<code>INTERNET</code>) to serve static application resources and check for updates. The app does not require sensitive runtime permissions such as camera access, microphone access, contacts, or location.
          </p>
        </section>

        <section className="space-y-2 border-t border-slate-200 dark:border-slate-800 pt-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            3. Local Data Storage & User Control
          </h2>
          <p>
            When you compress a file, a temporary reference record (file name and compressed file size) is stored locally on your device to power the "History" tab. You can delete individual records or permanently clear all local history at any time from the History page.
          </p>
        </section>

        <section className="space-y-2 border-t border-slate-200 dark:border-slate-800 pt-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            4. Third-Party Services & External Links
          </h2>
          <p>
            KBCut contains no third-party SDKs that harvest user telemetry. If you access external links (such as government exam portal specifications), those portals maintain their own respective privacy policies.
          </p>
        </section>

        <section className="space-y-2 border-t border-slate-200 dark:border-slate-800 pt-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            5. Contact Us
          </h2>
          <p>
            If you have any questions or feedback regarding this Privacy Policy or KBCut data practices, you may reach out via our open repository or developer contact:
          </p>
          <p className="font-semibold text-slate-900 dark:text-white">
            Developer: Kunal Pawar<br />
            Email: <a href="mailto:support@kbcut.com" className="text-brand-500 hover:underline">support@kbcut.com</a><br />
            Project: <a href="https://github.com/kunalpawar9403/KBCut" target="_blank" rel="noopener noreferrer" className="text-brand-500 hover:underline">github.com/kunalpawar9403/KBCut</a>
          </p>
        </section>
      </div>
    </div>
  );
};
