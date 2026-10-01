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
} from 'lucide-react';

type ToolId = 'merge' | 'split' | 'esign' | 'aadhaar' | 'photosign' | 'crop';

export const ToolsPage: React.FC = () => {
  const { t } = useI18n();
  const [activeTool, setActiveTool] = useState<ToolId>('merge');

  const toolList: { id: ToolId; name: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: 'merge',
      name: t('tools.mergePdf.name'),
      desc: t('tools.mergePdf.desc'),
      icon: <Layers className="w-4 h-4" />,
    },
    {
      id: 'split',
      name: t('tools.splitPdf.name'),
      desc: t('tools.splitPdf.desc'),
      icon: <Scissors className="w-4 h-4" />,
    },
    {
      id: 'esign',
      name: t('tools.esign.name'),
      desc: t('tools.esign.desc'),
      icon: <PenTool className="w-4 h-4" />,
    },
    {
      id: 'aadhaar',
      name: t('tools.aadhaar2in1.name'),
      desc: t('tools.aadhaar2in1.desc'),
      icon: <CreditCard className="w-4 h-4" />,
    },
    {
      id: 'photosign',
      name: t('tools.photoSign.name'),
      desc: t('tools.photoSign.desc'),
      icon: <Users className="w-4 h-4" />,
    },
    {
      id: 'crop',
      name: t('tools.cropRotate.name'),
      desc: t('tools.cropRotate.desc'),
      icon: <Crop className="w-4 h-4" />,
    },
  ];

  return (
    <div className="w-full space-y-5 pb-20 md:pb-8">
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-brand-500" />
          <span>{t('tools.title')}</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {t('tools.subtitle')}
        </p>
      </div>

      {/* Tools Horizontal Pills Bar */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none -mx-1 px-1">
        {toolList.map((tool) => {
          const isActive = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`shrink-0 flex items-center space-x-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all touch-press ${
                isActive
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25 scale-[1.02]'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              <span>{tool.icon}</span>
              <span>{tool.name}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tool View */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft">
        {activeTool === 'merge' && <MergePdfTool />}
        {activeTool === 'split' && <SplitPdfTool />}
        {activeTool === 'esign' && <ESignTool />}
        {activeTool === 'aadhaar' && <Aadhaar2In1Tool />}
        {activeTool === 'photosign' && <PhotoSignTool />}
        {activeTool === 'crop' && <CropRotateTool />}
      </div>
    </div>
  );
};
