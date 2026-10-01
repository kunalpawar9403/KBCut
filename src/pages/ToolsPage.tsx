import React, { useState } from 'react';
import { useI18n } from '../i18n';
import { MergePdfTool } from '../components/tools/MergePdfTool';
import { SplitPdfTool } from '../components/tools/SplitPdfTool';
import { ESignTool } from '../components/tools/ESignTool';
import { Aadhaar2In1Tool } from '../components/tools/Aadhaar2In1Tool';
import { PhotoSignTool } from '../components/tools/PhotoSignTool';
import { CropRotateTool } from '../components/tools/CropRotateTool';
import {
  Layers,
  Scissors,
  PenTool,
  CreditCard,
  Users,
  Crop,
  Sparkles,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';

type ToolId = 'merge' | 'split' | 'esign' | 'aadhaar' | 'photosign' | 'crop';

export const ToolsPage: React.FC = () => {
  const { t } = useI18n();
  const [activeTool, setActiveTool] = useState<ToolId | null>(null);

  const tools: {
    id: ToolId;
    name: string;
    desc: string;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
    badge: string;
  }[] = [
    {
      id: 'aadhaar',
      name: t('tools.aadhaar2in1.name'),
      desc: t('tools.aadhaar2in1.desc'),
      icon: <CreditCard className="w-6 h-6" />,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/80',
      badge: 'Govt ID',
    },
    {
      id: 'photosign',
      name: t('tools.photoSign.name'),
      desc: t('tools.photoSign.desc'),
      icon: <Users className="w-6 h-6" />,
      color: 'text-brand-600 dark:text-brand-400',
      bgColor: 'bg-brand-50 dark:bg-brand-950/80',
      badge: 'SSC & UPSC',
    },
    {
      id: 'esign',
      name: t('tools.esign.name'),
      desc: t('tools.esign.desc'),
      icon: <PenTool className="w-6 h-6" />,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950/80',
      badge: 'Reusable Ink',
    },
    {
      id: 'merge',
      name: t('tools.mergePdf.name'),
      desc: t('tools.mergePdf.desc'),
      icon: <Layers className="w-6 h-6" />,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/80',
      badge: 'PDF + Images',
    },
    {
      id: 'split',
      name: t('tools.splitPdf.name'),
      desc: t('tools.splitPdf.desc'),
      icon: <Scissors className="w-6 h-6" />,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/80',
      badge: 'Extract & Rotate',
    },
    {
      id: 'crop',
      name: t('tools.cropRotate.name'),
      desc: t('tools.cropRotate.desc'),
      icon: <Crop className="w-6 h-6" />,
      color: 'text-teal-600 dark:text-teal-400',
      bgColor: 'bg-teal-50 dark:bg-teal-950/80',
      badge: '3.5x4.5 & 140x60',
    },
  ];

  return (
    <div className="w-full space-y-6 pb-24 md:pb-8">
      {/* Title */}
      <div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/80 border border-brand-200/80 dark:border-brand-800/80 text-brand-700 dark:text-brand-300 text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-brand-500" />
          <span>Student & Exam Utilities</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {t('tools.title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t('tools.subtitle')}
        </p>
      </div>

      {/* When a tool is selected: Show back bar and active studio */}
      {activeTool ? (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveTool(null)}
              className="flex items-center text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-brand-500 py-1.5 px-3 -ml-2 rounded-xl transition-colors bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              <span>Back to All Tools</span>
            </button>
          </div>

          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-soft">
            {activeTool === 'aadhaar' && <Aadhaar2In1Tool />}
            {activeTool === 'photosign' && <PhotoSignTool />}
            {activeTool === 'esign' && <ESignTool />}
            {activeTool === 'merge' && <MergePdfTool />}
            {activeTool === 'split' && <SplitPdfTool />}
            {activeTool === 'crop' && <CropRotateTool />}
          </div>
        </div>
      ) : (
        /* Tools Grid View (Inspiration from ILovePDF & Apple Utilities) */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 animate-in fade-in duration-300">
          {tools.map((tool) => (
            <div
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className="group p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-500 shadow-soft hover:shadow-elevated transition-all duration-300 cursor-pointer flex flex-col justify-between card-glow touch-press"
            >
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <div className={`w-12 h-12 rounded-2xl ${tool.bgColor} ${tool.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    {tool.icon}
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-extrabold text-[10px] uppercase tracking-wider">
                    {tool.badge}
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {tool.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-brand-600 dark:text-brand-400">
                <span>Open Tool</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
