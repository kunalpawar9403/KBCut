export interface ExamPreset {
  id: string;
  name: string;
  description: string;
  targetKb: number;
  type: 'image' | 'pdf' | 'both';
  width?: number; // target px if fixed
  height?: number; // target px if fixed
  aspectRatio?: string; // e.g. "3.5:4.5", "140:60"
  badge?: string;
  category: 'exam' | 'id' | 'general';
}

export const TARGET_SIZE_OPTIONS = [20, 50, 100, 200] as const;

export const EXAM_PRESETS: ExamPreset[] = [
  {
    id: 'ssc-photo',
    name: 'SSC Photo',
    description: 'Staff Selection Commission (CGL, CHSL, MTS, GD)',
    targetKb: 50,
    type: 'image',
    width: 200,
    height: 230,
    aspectRatio: '3.5:4.5',
    badge: '< 50 KB',
    category: 'exam'
  },
  {
    id: 'signature-std',
    name: 'Standard Signature',
    description: 'Standard 140x60 px exam signature specification',
    targetKb: 30,
    type: 'image',
    width: 140,
    height: 60,
    aspectRatio: '140:60',
    badge: '140x60 px',
    category: 'exam'
  },
  {
    id: 'passport-photo',
    name: 'Passport Photo',
    description: '35x45 mm official passport photo standards',
    targetKb: 100,
    type: 'image',
    width: 413,
    height: 531,
    aspectRatio: '35:45',
    badge: '< 100 KB',
    category: 'id'
  },
  {
    id: 'aadhaar-doc',
    name: 'Aadhaar / Gov ID',
    description: 'Aadhaar card, PAN card, Voter ID PDF/image upload',
    targetKb: 200,
    type: 'both',
    badge: '< 200 KB',
    category: 'id'
  },
  {
    id: 'upsc-photo',
    name: 'UPSC Civil Services',
    description: 'Union Public Service Commission (IAS, NDA, CDS)',
    targetKb: 300,
    type: 'image',
    width: 350,
    height: 350,
    aspectRatio: '1:1',
    badge: '< 300 KB',
    category: 'exam'
  },
  {
    id: 'ibps-photo',
    name: 'IBPS / Banking Photo',
    description: 'IBPS PO, Clerk, SBI & RBI application photo',
    targetKb: 50,
    type: 'image',
    width: 200,
    height: 230,
    aspectRatio: '200:230',
    badge: '< 50 KB',
    category: 'exam'
  },
  {
    id: 'jee-gate-photo',
    name: 'GATE / JEE / NEET',
    description: 'NTA JEE Mains, NEET-UG & IIT GATE application',
    targetKb: 200,
    type: 'image',
    width: 480,
    height: 640,
    aspectRatio: '3.5:4.5',
    badge: '< 200 KB',
    category: 'exam'
  },
  {
    id: 'mpsc-photo',
    name: 'MPSC / State PSC',
    description: 'Maharashtra Public Service Commission & State PSCs',
    targetKb: 50,
    type: 'image',
    width: 160,
    height: 213,
    aspectRatio: '3:4',
    badge: '< 50 KB',
    category: 'exam'
  }
];

export function getPresetById(id: string): ExamPreset | undefined {
  return EXAM_PRESETS.find((p) => p.id === id);
}
