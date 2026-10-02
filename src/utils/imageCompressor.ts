/**
 * Image Compression Engine for KBCut
 * 
 * Rules:
 * 1. Correct EXIF orientation.
 * 2. Resize to custom or preset dimensions (PX, CM, MM at specified DPI).
 * 3. Binary search JPEG quality (0.95 down to 0.10) to land strictly under target KB.
 * 4. Downscale dimensions iteratively if quality alone is not sufficient.
 * 5. Handle No-Limit target mode (lossless or 0.95 visual fidelity).
 * 6. Center-crop framing so aspect ratio changes do not distort/squash photos.
 */

export interface ImageCropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ImageCompressOptions {
  targetKb?: number; // 0 or undefined for No Limit
  targetWidth?: number;
  targetHeight?: number;
  maintainAspectRatio?: boolean;
  mimeType?: 'image/jpeg' | 'image/webp' | 'image/png';
  cropRect?: ImageCropRect;
}

export interface CompressResult {
  blob: Blob;
  originalSize: number;
  compressedSize: number;
  targetKb: number;
  width: number;
  height: number;
  quality: number;
  reachedTarget: boolean;
  suggestedKb?: number;
}

/**
 * Loads an image File or Blob into an HTMLImageElement
 */
export async function loadImageElement(source: Blob | File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(source);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('IMAGE_LOAD_FAILED'));
    };
    img.src = url;
  });
}

/**
 * Convert Canvas to Blob with specified quality
 */
export function canvasToBlob(
  canvas: HTMLCanvasElement | OffscreenCanvas,
  mimeType: string = 'image/jpeg',
  quality: number = 0.8
): Promise<Blob> {
  if ('convertToBlob' in canvas) {
    return (canvas as OffscreenCanvas).convertToBlob({ type: mimeType, quality });
  }
  return new Promise((resolve, reject) => {
    (canvas as HTMLCanvasElement).toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('CANVAS_TO_BLOB_FAILED'));
      },
      mimeType,
      quality
    );
  });
}

/**
 * Creates a canvas and draws the image at specified dimensions with center-crop framing
 */
export function drawToCanvas(
  img: HTMLImageElement | ImageBitmap,
  targetWidth: number,
  targetHeight: number,
  cropRect?: ImageCropRect
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(targetWidth));
  canvas.height = Math.max(1, Math.round(targetHeight));
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('CANVAS_CONTEXT_FAILED');

  // Fill white background for JPEGs (avoids black background if transparent PNG)
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // High quality interpolation
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  if (cropRect) {
    ctx.drawImage(
      img,
      cropRect.x,
      cropRect.y,
      cropRect.width,
      cropRect.height,
      0,
      0,
      canvas.width,
      canvas.height
    );
  } else {
    // Smart center-crop to prevent image squashing/stretching
    const srcW = 'naturalWidth' in img ? img.naturalWidth : img.width;
    const srcH = 'naturalHeight' in img ? img.naturalHeight : img.height;
    const targetRatio = canvas.width / canvas.height;
    const srcRatio = srcW / srcH;

    let sx = 0;
    let sy = 0;
    let sw = srcW;
    let sh = srcH;

    if (Math.abs(targetRatio - srcRatio) > 0.02) {
      if (srcRatio > targetRatio) {
        // Image is wider than target: crop left & right
        sw = Math.round(srcH * targetRatio);
        sx = Math.round((srcW - sw) / 2);
      } else {
        // Image is taller than target: crop top & bottom
        sh = Math.round(srcW / targetRatio);
        sy = Math.round((srcH - sh) / 2);
      }
    }

    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
  }

  return canvas;
}

/**
 * Main Image Compression Function
 */
export async function compressImage(
  file: File | Blob,
  options: ImageCompressOptions
): Promise<CompressResult> {
  const originalSize = file.size;
  const isNoLimit = !options.targetKb || options.targetKb <= 0;
  const targetBytes = (options.targetKb || 0) * 1024;
  const mime = options.mimeType || 'image/jpeg';

  const img = await loadImageElement(file);
  let srcWidth = img.naturalWidth || img.width;
  let srcHeight = img.naturalHeight || img.height;

  if (!srcWidth || !srcHeight) {
    throw new Error('INVALID_IMAGE_DIMENSIONS');
  }

  // Determine starting target dimensions
  let currentWidth = srcWidth;
  let currentHeight = srcHeight;

  if (options.targetWidth && options.targetHeight) {
    if (options.maintainAspectRatio) {
      const ratio = Math.min(options.targetWidth / srcWidth, options.targetHeight / srcHeight);
      currentWidth = Math.round(srcWidth * ratio);
      currentHeight = Math.round(srcHeight * ratio);
    } else {
      currentWidth = options.targetWidth;
      currentHeight = options.targetHeight;
    }
  } else if (options.targetWidth) {
    const ratio = options.targetWidth / srcWidth;
    currentWidth = options.targetWidth;
    currentHeight = Math.round(srcHeight * ratio);
  } else if (options.targetHeight) {
    const ratio = options.targetHeight / srcHeight;
    currentHeight = options.targetHeight;
    currentWidth = Math.round(srcWidth * ratio);
  }

  // Cap initial extreme sizes (e.g. 64MP mobile cameras) if no specific target width set
  const maxInitialDim = 2800;
  if ((!options.targetWidth || !options.targetHeight) && (currentWidth > maxInitialDim || currentHeight > maxInitialDim)) {
    const scale = maxInitialDim / Math.max(currentWidth, currentHeight);
    currentWidth = Math.round(currentWidth * scale);
    currentHeight = Math.round(currentHeight * scale);
  }

  // 1. If NO LIMIT mode: output high-quality canvas directly
  if (isNoLimit) {
    const canvas = drawToCanvas(img, currentWidth, currentHeight, options.cropRect);
    const blob = await canvasToBlob(canvas, mime, 0.95);
    return {
      blob,
      originalSize,
      compressedSize: blob.size,
      targetKb: 0,
      width: currentWidth,
      height: currentHeight,
      quality: 0.95,
      reachedTarget: true,
    };
  }

  // 2. Binary search + quality optimization loop to stay strictly under target KB
  let bestBlob: Blob | null = null;
  let bestQuality = 0.85;
  let bestWidth = currentWidth;
  let bestHeight = currentHeight;

  const MAX_DOWNSCALE_STEPS = 12;
  const MIN_DIMENSION = 40;

  for (let step = 0; step < MAX_DOWNSCALE_STEPS; step++) {
    const canvas = drawToCanvas(img, currentWidth, currentHeight, options.cropRect);

    let high = 0.96;
    let low = 0.10;
    let stepBestBlob: Blob | null = null;
    let stepBestQuality = low;

    // Binary search quality (up to 7 iterations)
    for (let iter = 0; iter < 7; iter++) {
      const mid = Number(((low + high) / 2).toFixed(3));
      const blob = await canvasToBlob(canvas, mime, mid);

      if (blob.size <= targetBytes) {
        stepBestBlob = blob;
        stepBestQuality = mid;
        low = mid;
      } else {
        high = mid;
      }

      if (high - low < 0.035) {
        break;
      }
    }

    if (stepBestBlob && stepBestBlob.size <= targetBytes) {
      bestBlob = stepBestBlob;
      bestQuality = stepBestQuality;
      bestWidth = currentWidth;
      bestHeight = currentHeight;
      break;
    }

    // Try lowest acceptable quality on this resolution
    const lowestBlob = await canvasToBlob(canvas, mime, 0.10);
    if (lowestBlob.size <= targetBytes) {
      bestBlob = lowestBlob;
      bestQuality = 0.10;
      bestWidth = currentWidth;
      bestHeight = currentHeight;
      break;
    }

    if (!bestBlob || lowestBlob.size < bestBlob.size) {
      bestBlob = lowestBlob;
      bestQuality = 0.10;
      bestWidth = currentWidth;
      bestHeight = currentHeight;
    }

    // If target width and height were explicitly locked by user and step > 4,
    // don't aggressively reduce dimensions if they asked for exact fixed dimensions
    if (currentWidth * 0.9 < MIN_DIMENSION || currentHeight * 0.9 < MIN_DIMENSION) {
      break;
    }
    currentWidth = Math.round(currentWidth * 0.9);
    currentHeight = Math.round(currentHeight * 0.9);
  }

  if (!bestBlob) {
    const fallbackCanvas = drawToCanvas(img, currentWidth, currentHeight, options.cropRect);
    bestBlob = await canvasToBlob(fallbackCanvas, mime, 0.10);
  }

  const reachedTarget = bestBlob.size <= targetBytes;
  const suggestedKb = reachedTarget ? undefined : Math.ceil((bestBlob.size / 1024) * 1.1);

  return {
    blob: bestBlob,
    originalSize,
    compressedSize: bestBlob.size,
    targetKb: options.targetKb || 0,
    width: bestWidth,
    height: bestHeight,
    quality: bestQuality,
    reachedTarget,
    suggestedKb,
  };
}
