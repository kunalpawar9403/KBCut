import { compressImage, ImageCropRect } from '../utils/imageCompressor';
import { compressPdf } from '../utils/pdfCompressor';
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
  width?: number;
  height?: number;
  dpi?: number;
  unit?: string;
  format?: string;
}

export interface ProcessFileOptions {
  targetWidth?: number;
  targetHeight?: number;
  maintainAspectRatio?: boolean;
  mimeType?: 'image/jpeg' | 'image/png' | 'image/webp';
  cropRect?: ImageCropRect;
  dpi?: number;
  unit?: 'px' | 'cm' | 'mm';
  onProgress?: (progress: { current: number; total: number; percent: number }) => void;
}

export const compressionService = {
  /**
   * Main unified compressor entry point
   */
  async processFile(
    file: File,
    targetKb: number,
    options: ProcessFileOptions = {}
  ): Promise<UnifiedCompressResult> {
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isImage = file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|bmp)$/i.test(file.name);

    if (!isPdf && !isImage) {
      throw new Error('UNSUPPORTED_FORMAT');
    }

    if (isImage) {
      const mime = options.mimeType || 'image/jpeg';
      const result = await compressImage(file, {
        targetKb,
        targetWidth: options.targetWidth,
        targetHeight: options.targetHeight,
        maintainAspectRatio: options.maintainAspectRatio ?? (!options.targetWidth || !options.targetHeight),
        mimeType: mime,
        cropRect: options.cropRect,
      });

      const previewUrl = URL.createObjectURL(result.blob);

      // Determine proper file extension
      let ext = 'jpg';
      if (mime === 'image/png') ext = 'png';
      else if (mime === 'image/webp') ext = 'webp';

      const suffix = targetKb > 0 ? `${targetKb}kb` : 'custom';
      const baseName = file.name.replace(/\.[^/.]+$/, '');
      const outFileName = `${baseName}_kbcut_${suffix}.${ext}`;

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
        fileName: outFileName,
        previewUrl,
        width: result.width,
        height: result.height,
        dpi: options.dpi,
        unit: options.unit,
        format: ext.toUpperCase(),
      };
    } else {
      // Compress PDF
      const result = await compressPdf(file, {
        targetKb,
        onProgress: options.onProgress,
      });

      const previewUrl = URL.createObjectURL(result.blob);
      const baseName = file.name.replace(/\.[^/.]+$/, '');
      const outFileName = `${baseName}_kbcut_${targetKb}kb.pdf`;

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
        fileName: outFileName,
        previewUrl,
      };
    }
  }
};
