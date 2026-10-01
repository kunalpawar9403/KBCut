import { compressImage, CompressResult, ImageCompressOptions } from '../utils/imageCompressor';
import { compressPdf, PdfCompressResult, PdfCompressOptions } from '../utils/pdfCompressor';
import { storageService } from './storage';

export type FileCompressionType = 'image' | 'pdf';

export interface UnifiedCompressResult {
  blob: Blob;
  originalSize: number;
  compressedSize: number;
  targetKb: number;
  reachedTarget: boolean;
  suggestedKb?: number;
  type: FileCompressionType;
  fileName: string;
  previewUrl: string;
}

let workerInstance: Worker | null = null;
function getWorker(): Worker | null {
  if (typeof window === 'undefined' || typeof Worker === 'undefined') return null;
  try {
    if (!workerInstance) {
      workerInstance = new Worker(new URL('../workers/compress.worker.ts', import.meta.url), {
        type: 'module',
      });
    }
    return workerInstance;
  } catch {
    return null;
  }
}

export const compressionService = {
  /**
   * Main unified compressor entry point
   */
  async processFile(
    file: File,
    targetKb: number,
    options: {
      targetWidth?: number;
      targetHeight?: number;
      onProgress?: (progress: { current: number; total: number; percent: number }) => void;
    } = {}
  ): Promise<UnifiedCompressResult> {
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isImage = file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|bmp)$/i.test(file.name);

    if (!isPdf && !isImage) {
      throw new Error('UNSUPPORTED_FORMAT');
    }

    if (isImage) {
      // Compress image
      const result = await compressImage(file, {
        targetKb,
        targetWidth: options.targetWidth,
        targetHeight: options.targetHeight,
        maintainAspectRatio: !options.targetWidth || !options.targetHeight,
      });

      const previewUrl = URL.createObjectURL(result.blob);

      // Save to history in background
      storageService.addHistory({
        fileName: file.name,
        originalSize: result.originalSize,
        compressedSize: result.compressedSize,
        targetKb,
        mimeType: result.blob.type,
      }).catch(console.error);

      return {
        blob: result.blob,
        originalSize: result.originalSize,
        compressedSize: result.compressedSize,
        targetKb,
        reachedTarget: result.reachedTarget,
        suggestedKb: result.suggestedKb,
        type: 'image',
        fileName: file.name.replace(/\.[^/.]+$/, '') + `_kbcut_${targetKb}kb.jpg`,
        previewUrl,
      };
    } else {
      // Compress PDF
      const result = await compressPdf(file, {
        targetKb,
        onProgress: options.onProgress,
      });

      const previewUrl = URL.createObjectURL(result.blob);

      // Save to history in background
      storageService.addHistory({
        fileName: file.name,
        originalSize: result.originalSize,
        compressedSize: result.compressedSize,
        targetKb,
        mimeType: 'application/pdf',
      }).catch(console.error);

      return {
        blob: result.blob,
        originalSize: result.originalSize,
        compressedSize: result.compressedSize,
        targetKb,
        reachedTarget: result.reachedTarget,
        suggestedKb: result.suggestedKb,
        type: 'pdf',
        fileName: file.name.replace(/\.[^/.]+$/, '') + `_kbcut_${targetKb}kb.pdf`,
        previewUrl,
      };
    }
  }
};
