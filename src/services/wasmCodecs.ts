import encodeJpeg from '@jsquash/jpeg/encode';
import { optimise as optimisePng } from '@jsquash/oxipng';
import encodePng from '@jsquash/png/encode';

/**
 * High-performance WebAssembly image encoders powered by MozJPEG & OxiPNG
 */

export async function mozjpegEncode(
  imageData: ImageData,
  quality: number = 75
): Promise<Blob> {
  try {
    const q = Math.max(1, Math.min(100, Math.round(quality)));
    const buffer = await encodeJpeg(imageData, {
      quality: q,
      baseline: false,
      progressive: true,
      optimize_coding: true,
      trellis_multipass: true,
      trellis_opt_zero: true,
      trellis_opt_table: true,
    });
    return new Blob([buffer], { type: 'image/jpeg' });
  } catch (err) {
    console.warn('MozJPEG WASM encode failed, falling back to canvas:', err);
    return canvasFallback(imageData, 'image/jpeg', quality / 100);
  }
}

export async function oxipngOptimize(
  pngBuffer: ArrayBuffer,
  level: number = 2
): Promise<Blob> {
  try {
    const optimized = await optimisePng(pngBuffer, { level });
    return new Blob([optimized], { type: 'image/png' });
  } catch (err) {
    console.warn('OxiPNG WASM optimize failed:', err);
    return new Blob([pngBuffer], { type: 'image/png' });
  }
}

export async function wasmPngEncode(
  imageData: ImageData
): Promise<Blob> {
  try {
    const buffer = await encodePng(imageData);
    return new Blob([buffer], { type: 'image/png' });
  } catch (err) {
    console.warn('WASM PNG encode failed, falling back to canvas:', err);
    return canvasFallback(imageData, 'image/png', 0.95);
  }
}

function canvasFallback(
  imageData: ImageData,
  mimeType: string,
  quality: number
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.putImageData(imageData, 0, 0);
  }
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error('CANVAS_FALLBACK_FAILED'));
      },
      mimeType,
      quality
    );
  });
}
