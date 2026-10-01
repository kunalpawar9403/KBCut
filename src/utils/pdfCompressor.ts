import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument } from 'pdf-lib';

// Configure PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

export interface PdfCompressOptions {
  targetKb: number;
  onProgress?: (progress: { current: number; total: number; percent: number }) => void;
}

export interface PdfCompressResult {
  blob: Blob;
  originalSize: number;
  compressedSize: number;
  targetKb: number;
  totalPages: number;
  reachedTarget: boolean;
  suggestedKb?: number;
}

export class PdfError extends Error {
  code: 'PASSWORD_PROTECTED' | 'CORRUPT_FILE' | 'UNSUPPORTED' | 'UNKNOWN';
  constructor(code: 'PASSWORD_PROTECTED' | 'CORRUPT_FILE' | 'UNSUPPORTED' | 'UNKNOWN', message?: string) {
    super(message || code);
    this.code = code;
  }
}

/**
 * Compress a PDF by rasterizing each page into JPEG under a distributed byte budget
 * and reconstructing into a new streamlined PDF via pdf-lib.
 * Page-by-page garbage collection prevents memory spikes on 10MB+ files.
 */
export async function compressPdf(
  file: File | Blob,
  options: PdfCompressOptions
): Promise<PdfCompressResult> {
  const originalSize = file.size;
  const targetBytes = options.targetKb * 1024;

  let arrayBuffer: ArrayBuffer;
  try {
    arrayBuffer = await file.arrayBuffer();
  } catch {
    throw new PdfError('CORRUPT_FILE', 'Failed to read file buffer');
  }

  // Load document using pdfjs
  let pdfDoc: pdfjsLib.PDFDocumentProxy;
  try {
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      useSystemFonts: true,
      stopAtErrors: false,
    });
    pdfDoc = await loadingTask.promise;
  } catch (err: any) {
    if (err?.name === 'PasswordException' || err?.message?.includes('password')) {
      throw new PdfError('PASSWORD_PROTECTED', 'Password protected PDF');
    }
    throw new PdfError('CORRUPT_FILE', 'Corrupt or unreadable PDF');
  }

  const totalPages = pdfDoc.numPages;
  if (totalPages <= 0) {
    throw new PdfError('CORRUPT_FILE', 'PDF has no pages');
  }

  // PDF structural overhead allowance: ~8 KB
  const structureOverhead = Math.min(8192, Math.floor(targetBytes * 0.1));
  const usableBytes = Math.max(10240, targetBytes - structureOverhead);
  const targetBytesPerPage = Math.floor(usableBytes / totalPages);

  // New PDF document
  const outPdf = await PDFDocument.create();

  // Create reusable offscreen canvas
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('CANVAS_UNAVAILABLE');

  // Process one page at a time to prevent high memory usage
  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);
    
    // Adjust scale based on byte budget per page
    let renderScale = 1.4;
    if (targetBytesPerPage < 35000) renderScale = 1.0;
    if (targetBytesPerPage < 18000) renderScale = 0.8;
    if (targetBytesPerPage < 10000) renderScale = 0.65;

    const viewport = page.getViewport({ scale: renderScale });
    canvas.width = Math.round(viewport.width);
    canvas.height = Math.round(viewport.height);

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({
      canvasContext: ctx,
      viewport: viewport,
      intent: 'print',
    }).promise;

    // Search quality for this page
    let high = 0.88;
    let low = 0.12;
    let bestJpgBlob: Blob | null = null;

    for (let iter = 0; iter < 5; iter++) {
      const mid = Number(((low + high) / 2).toFixed(2));
      const blob: Blob = await new Promise((res) => canvas.toBlob((b) => res(b!), 'image/jpeg', mid));

      if (blob.size <= targetBytesPerPage) {
        bestJpgBlob = blob;
        low = mid;
      } else {
        high = mid;
      }

      if (high - low < 0.08) break;
    }

    if (!bestJpgBlob) {
      bestJpgBlob = await new Promise((res) => canvas.toBlob((b) => res(b!), 'image/jpeg', 0.12));
    }

    const jpgBytes = await bestJpgBlob!.arrayBuffer();
    const embeddedImg = await outPdf.embedJpg(jpgBytes);

    // Add page matching original aspect ratio
    const outPage = outPdf.addPage([viewport.width / renderScale, viewport.height / renderScale]);
    outPage.drawImage(embeddedImg, {
      x: 0,
      y: 0,
      width: outPage.getWidth(),
      height: outPage.getHeight(),
    });

    // Clean up page resources immediately
    page.cleanup();
    canvas.width = 1;
    canvas.height = 1;

    // Notify progress
    if (options.onProgress) {
      options.onProgress({
        current: pageNum,
        total: totalPages,
        percent: Math.round((pageNum / totalPages) * 100),
      });
    }
  }

  // Destroy pdfjs proxy to release worker memory
  pdfDoc.destroy();

  const finalPdfBytes = await outPdf.save({ useObjectStreams: true });
  const finalBlob = new Blob([finalPdfBytes as unknown as BlobPart], { type: 'application/pdf' });

  const reachedTarget = finalBlob.size <= targetBytes;
  const suggestedKb = reachedTarget ? undefined : Math.ceil((finalBlob.size / 1024) * 1.1);

  return {
    blob: finalBlob,
    originalSize,
    compressedSize: finalBlob.size,
    targetKb: options.targetKb,
    totalPages,
    reachedTarget,
    suggestedKb,
  };
}
