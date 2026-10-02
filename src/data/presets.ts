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
  recommendedFormat?: 'image/jpeg' | 'image/png' | 'image/webp';
  unit?: 'px' | 'cm' | 'mm';
  dpi?: number;
}

export const TARGET_SIZE_OPTIONS = [20, 50, 100, 200] as const;

export const EXAM_PRESETS: ExamPreset[] = [
  {
    id: 'sbi-clerk-photo',
    name: 'SBI Clerk / PO Photo',
    description: 'SBI Clerk, PO & Associate photo specification (20–50 KB)',
    targetKb: 50,
    type: 'image',
    width: 200,
    height: 230,
    aspectRatio: '200:230',
    badge: '20–50 KB',
    category: 'exam',
    recommendedFormat: 'image/jpeg',
    unit: 'px',
    dpi: 300,
  },
  {
    id: 'sbi-clerk-sign',
    name: 'SBI Clerk Signature',
    description: 'SBI Clerk & Banking signature specification (10–20 KB)',
    targetKb: 20,
    type: 'image',
    width: 140,
    height: 60,
    aspectRatio: '140:60',
    badge: '10–20 KB',
    category: 'exam',
    recommendedFormat: 'image/jpeg',
    unit: 'px',
    dpi: 300,
  },
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
    category: 'exam',
    recommendedFormat: 'image/jpeg',
    unit: 'px',
    dpi: 300,
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
    category: 'exam',
    recommendedFormat: 'image/jpeg',
    unit: 'px',
    dpi: 300,
  },
  {
    id: 'passport-photo',
    name: 'Passport Photo (35×45 mm)',
    description: '35x45 mm official passport photo standards (at 300 DPI)',
    targetKb: 100,
    type: 'image',
    width: 413,
    height: 531,
    aspectRatio: '35:45',
    badge: '35×45 mm',
    category: 'id',
    recommendedFormat: 'image/jpeg',
    unit: 'mm',
    dpi: 300,
  },
  {
    id: 'aadhaar-doc',
    name: 'Aadhaar / Gov ID',
    description: 'Aadhaar card, PAN card, Voter ID PDF/image upload',
    targetKb: 200,
    type: 'both',
    badge: '< 200 KB',
    category: 'id',
    recommendedFormat: 'image/jpeg',
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
    category: 'exam',
    recommendedFormat: 'image/jpeg',
    unit: 'px',
    dpi: 300,
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
    category: 'exam',
    recommendedFormat: 'image/jpeg',
    unit: 'px',
    dpi: 300,
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
    category: 'exam',
    recommendedFormat: 'image/jpeg',
    unit: 'px',
    dpi: 300,
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
    category: 'exam',
    recommendedFormat: 'image/jpeg',
    unit: 'px',
    dpi: 300,
  },
];

export function getPresetById(id: string): ExamPreset | undefined {
  return EXAM_PRESETS.find((p) => p.id === id);
}
