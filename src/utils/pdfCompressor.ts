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
 * High-Clarity PDF Compression Engine for KBCut
 * 
 * Rules:
 * 1. Phase 1 (Lossless Pass): Re-compress stream objects & strip unreferenced metadata.
 *    If lossless pass satisfies targetKb, return it directly to preserve 100% vector clarity.
 * 2. Phase 2 (High-Clarity Rendering):
 *    - Render at high scale (1.75x to 2.0x, ~126-144 DPI) so text is razor-sharp.
 *    - Apply background whitening & text contrast enhancement. Pure #FFFFFF background
 *      collapses JPEG DCT blocks to near 0-bytes, preserving byte budget for sharp text edges.
 *    - Never drop JPEG quality below 0.45 floor to prevent blurriness.
 */
export async function compressPdf(
  file: File | Blob,
  options: PdfCompressOptions
): Promise<PdfCompressResult> {
  const originalSize = file.size;
  const isNoLimit = !options.targetKb || options.targetKb <= 0;
  const targetBytes = (options.targetKb || 0) * 1024;

  let arrayBuffer: ArrayBuffer;
  try {
    arrayBuffer = await file.arrayBuffer();
  } catch {
    throw new PdfError('CORRUPT_FILE', 'Failed to read file buffer');
  }

  // Phase 1: Try Lossless Vector Compression first
  try {
    const directDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    directDoc.setTitle('');
    directDoc.setAuthor('');
    directDoc.setSubject('');
    directDoc.setKeywords([]);
    directDoc.setProducer('KBCut');
    directDoc.setCreator('KBCut');

    const losslessBytes = await directDoc.save({
      useObjectStreams: true,
      addDefaultPage: false,
    });

    if (isNoLimit || losslessBytes.length <= targetBytes) {
      const losslessBlob = new Blob([losslessBytes as unknown as BlobPart], { type: 'application/pdf' });
      return {
        blob: losslessBlob,
        originalSize,
        compressedSize: losslessBlob.size,
        targetKb: options.targetKb || 0,
        totalPages: directDoc.getPageCount(),
        reachedTarget: true,
      };
    }
  } catch {
    // Continue to high-clarity rasterization if direct load fails or exceeds target
  }

  // Phase 2: High-Clarity Document Rasterization
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

  // Structural overhead allowance
  const structureOverhead = Math.min(8192, Math.floor(targetBytes * 0.08));
  const usableBytes = Math.max(10240, targetBytes - structureOverhead);
  const targetBytesPerPage = Math.floor(usableBytes / totalPages);

  // New PDF document
  const outPdf = await PDFDocument.create();

  // Create reusable offscreen canvas
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('CANVAS_UNAVAILABLE');

  // Maintain high resolution (144 DPI / 2.0x default, 1.75x or 1.5x minimum on very tight budgets)
  let renderScale = 2.0;
  if (targetBytesPerPage < 40000) renderScale = 1.75;
  if (targetBytesPerPage < 18000) renderScale = 1.5;

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale: renderScale });

    canvas.width = Math.round(viewport.width);
    canvas.height = Math.round(viewport.height);

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // High quality interpolation
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    await page.render({
      canvasContext: ctx,
      viewport: viewport,
      intent: 'print',
    }).promise;

    // Document background whitening & text contrast enhancement
    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = imgData.data;
      const len = d.length;

      for (let i = 0; i < len; i += 4) {
        const r = d[i];
        const g = d[i + 1];
        const b = d[i + 2];

        // Background whitening: near-white document paper becomes pure white #FFFFFF
        if (r > 230 && g > 230 && b > 230) {
          d[i] = 255;
          d[i + 1] = 255;
          d[i + 2] = 255;
        } else if (r < 80 && g < 80 && b < 80) {
          // Deepen dark text strokes slightly for razor-sharp legibility
          d[i] = Math.max(0, r - 12);
          d[i + 1] = Math.max(0, g - 12);
          d[i + 2] = Math.max(0, b - 12);
        }
      }
      ctx.putImageData(imgData, 0, 0);
    } catch {
      // Safe fallback
    }

    // Quality search with a high clarity floor (never drop below 0.45)
    let high = 0.88;
    let low = 0.48;
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

      if (high - low < 0.05) break;
    }

    if (!bestJpgBlob) {
      bestJpgBlob = await new Promise((res) => canvas.toBlob((b) => res(b!), 'image/jpeg', 0.48));
    }

    const jpgBytes = await bestJpgBlob!.arrayBuffer();
    const embeddedImg = await outPdf.embedJpg(jpgBytes);

    // Add page matching original point dimensions
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

  const reachedTarget = isNoLimit || finalBlob.size <= targetBytes;
  const suggestedKb = reachedTarget ? undefined : Math.ceil((finalBlob.size / 1024) * 1.1);

  return {
    blob: finalBlob,
    originalSize,
    compressedSize: finalBlob.size,
    targetKb: options.targetKb || 0,
    totalPages,
    reachedTarget,
    suggestedKb,
  };
}
