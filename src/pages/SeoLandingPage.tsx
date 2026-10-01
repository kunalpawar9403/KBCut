import React, { useEffect } from 'react';
import { HomePage } from './HomePage';
import { ExamPreset, EXAM_PRESETS } from '../data/presets';
import { useI18n } from '../i18n';
import { CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

interface SeoLandingConfig {
  slug: string;
  title: string;
  metaDesc: string;
  h1: string;
  targetKb: number;
  presetId?: string;
  faqs: { q: string; a: string }[];
}

const SEO_CONFIGS: Record<string, SeoLandingConfig> = {
  'compress-image-to-50kb': {
    slug: 'compress-image-to-50kb',
    title: 'Compress Image to 50 KB Online Free | SSC & Exam Ready - KBCut',
    metaDesc: 'Resize and compress photo or JPG image to under 50 KB without blur. Perfect for SSC CGL, CHSL, MTS, and state government application forms.',
    h1: 'Compress Image to Under 50 KB',
    targetKb: 50,
    presetId: 'ssc-photo',
    faqs: [
      {
        q: 'Which exams require photo under 50 KB?',
        a: 'SSC (CGL, CHSL, MTS, GD), IBPS Bank PO/Clerk, State Police Bharti, and Indian Army Agniveer recruitments require photos under 50 KB.',
      },
      {
        q: 'Will compressing to 50 KB make my photo blurry?',
        a: 'No. KBCut uses smart binary search compression that preserves sharp facial features, eyes, and background contrast required by exam scanners.',
      },
    ],
  },
  'compress-image-to-100kb': {
    slug: 'compress-image-to-100kb',
    title: 'Compress Image to 100 KB Free Online | Passport & ID - KBCut',
    metaDesc: 'Reduce photo and image size to exactly under 100 KB. Ideal for Indian Passport Seva, Visa applications, and college admissions.',
    h1: 'Compress Photo to Under 100 KB',
    targetKb: 100,
    presetId: 'passport-photo',
    faqs: [
      {
        q: 'What is the passport photo size limit in India?',
        a: 'Passport Seva Kendra portals usually require passport size photographs between 10 KB and 100 KB with 35x45 mm dimensions.',
      },
    ],
  },
  'signature-resize-140x60': {
    slug: 'signature-resize-140x60',
    title: 'Signature Resize 140x60 px & Under 30 KB | SSC & UPSC - KBCut',
    metaDesc: 'Resize signature to 140x60 pixels and under 30 KB/20 KB online. Meet exact SSC, UPSC, and Banking signature requirements in 1 click.',
    h1: 'Resize Signature to 140x60 px (Under 30 KB)',
    targetKb: 30,
    presetId: 'signature-std',
    faqs: [
      {
        q: 'How to resize signature to 140x60 pixels?',
        a: 'Upload your cropped signature photo above. KBCut automatically scales it to 140x60 pixels and compresses the file size below 30 KB.',
      },
    ],
  },
  'compress-pdf-to-200kb': {
    slug: 'compress-pdf-to-200kb',
    title: 'Compress PDF to 200 KB Online Free | Aadhaar & Certificates - KBCut',
    metaDesc: 'Compress PDF files to under 200 KB or 100 KB for Aadhaar card, PAN card, caste certificates, and marksheets for government job portals.',
    h1: 'Compress PDF to Under 200 KB',
    targetKb: 200,
    presetId: 'aadhaar-doc',
    faqs: [
      {
        q: 'Is it safe to compress Aadhaar card or PAN card PDF here?',
        a: 'Yes, 100% safe. KBCut runs entirely inside your device browser using WebAssembly. Your PDF is never uploaded to any remote server or stored anywhere.',
      },
    ],
  },
};

interface SeoLandingPageProps {
  slug: string;
}

export const SeoLandingPage: React.FC<SeoLandingPageProps> = ({ slug }) => {
  const config = SEO_CONFIGS[slug] || SEO_CONFIGS['compress-image-to-50kb'];
  const preset = config.presetId ? EXAM_PRESETS.find((p) => p.id === config.presetId) : undefined;

  useEffect(() => {
    // Dynamic SEO title & meta description update
    document.title = config.title;
    const metaTag = document.querySelector('meta[name="description"]');
    if (metaTag) {
      metaTag.setAttribute('content', config.metaDesc);
    }
  }, [config]);

  return (
    <div className="space-y-8">
      {/* Dynamic SEO Header Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-brand-50 to-blue-50 dark:from-slate-900 dark:to-brand-950/40 border border-brand-200/70 dark:border-brand-800/70 text-center">
        <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-brand-500 text-white text-[11px] font-extrabold uppercase tracking-wider mb-2">
          <Zap className="w-3 h-3 fill-current" />
          <span>Pre-configured target: {config.targetKb} KB</span>
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {config.h1}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-lg mx-auto leading-relaxed">
          {config.metaDesc}
        </p>
      </div>

      {/* Embedded Compressor Pre-Configured */}
      <HomePage initialPreset={preset} initialTargetKb={config.targetKb} />

      {/* SEO FAQ section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft space-y-4">
        <h2 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-brand-500" />
          <span>Frequently Asked Questions</span>
        </h2>
        <div className="space-y-3">
          {config.faqs.map((faq, i) => (
            <div key={i} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-1">
              <p className="font-bold text-xs text-slate-800 dark:text-slate-200">{faq.q}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
