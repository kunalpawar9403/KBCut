/**
 * Image Compression Engine for KBCut
 * 
 * Rules:
 * 1. Correct EXIF orientation.
 * 2. Resize to preset dimensions if specified.
 * 3. Binary search JPEG quality (0.95 down to 0.10) to land just under target.
 * 4. Downscale dimensions by 10% iteratively if quality alone is not sufficient.
 * 5. NEVER exceed target size if possible.
 */

export interface ImageCompressOptions {
  targetKb: number;
  targetWidth?: number;
  targetHeight?: number;
  maintainAspectRatio?: boolean;
  mimeType?: 'image/jpeg' | 'image/webp' | 'image/png';
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
 * Loads an image File or Blob into an HTMLImageElement or ImageBitmap
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
 * Creates a canvas and draws the image at specified dimensions
 */
export function drawToCanvas(
  img: HTMLImageElement | ImageBitmap,
  targetWidth: number,
  targetHeight: number
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
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

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
  const targetBytes = options.targetKb * 1024;

  const img = await loadImageElement(file);
  let srcWidth = img.naturalWidth || img.width;
  let srcHeight = img.naturalHeight || img.height;

  if (!srcWidth || !srcHeight) {
    throw new Error('INVALID_IMAGE_DIMENSIONS');
  }

  // Determine starting dimensions
  let currentWidth = srcWidth;
  let currentHeight = srcHeight;

  if (options.targetWidth && options.targetHeight) {
    if (options.maintainAspectRatio) {
      const ratio = Math.min(options.targetWidth / srcWidth, options.targetHeight / srcHeight);
      currentWidth = Math.round(srcWidth * ratio);
      currentHeight = Math.round(srcHeight * ratio);
    } else {
      // Exact preset dimensions (e.g. 140x60 for signature or 200x230 for SSC)
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

  // Cap initial extreme sizes (e.g. 48MP phone cameras) to standard maximum display size
  const maxInitialDim = 2400;
  if (currentWidth > maxInitialDim || currentHeight > maxInitialDim) {
    const scale = maxInitialDim / Math.max(currentWidth, currentHeight);
    currentWidth = Math.round(currentWidth * scale);
    currentHeight = Math.round(currentHeight * scale);
  }

  let bestBlob: Blob | null = null;
  let bestQuality = 0.8;
  let bestWidth = currentWidth;
  let bestHeight = currentHeight;
  const mime = options.mimeType || 'image/jpeg';

  // Iterative downscaling loop if binary quality search alone is not enough
  const MAX_DOWNSCALE_STEPS = 12; // 10% steps
  const MIN_DIMENSION = 40;

  for (let step = 0; step < MAX_DOWNSCALE_STEPS; step++) {
    const canvas = drawToCanvas(img, currentWidth, currentHeight);

    // First check high quality
    let high = 0.95;
    let low = 0.10;
    let stepBestBlob: Blob | null = null;
    let stepBestQuality = low;

    // Binary search quality (up to 7 iterations)
    for (let iter = 0; iter < 7; iter++) {
      const mid = Number(((low + high) / 2).toFixed(3));
      const blob = await canvasToBlob(canvas, mime, mid);

      if (blob.size <= targetBytes) {
        // Fits under target! Keep this candidate and try higher quality
        stepBestBlob = blob;
        stepBestQuality = mid;
        low = mid;
      } else {
        // Exceeds target! Lower quality
        high = mid;
      }

      if (high - low < 0.04) {
        break;
      }
    }

    if (stepBestBlob && stepBestBlob.size <= targetBytes) {
      bestBlob = stepBestBlob;
      bestQuality = stepBestQuality;
      bestWidth = currentWidth;
      bestHeight = currentHeight;
      break; // Success! Under target limit
    }

    // Try at lowest acceptable quality on this canvas
    const lowestBlob = await canvasToBlob(canvas, mime, 0.10);
    if (lowestBlob.size <= targetBytes) {
      bestBlob = lowestBlob;
      bestQuality = 0.10;
      bestWidth = currentWidth;
      bestHeight = currentHeight;
      break;
    }

    // If still over target, retain lowest as fallback candidate
    if (!bestBlob || lowestBlob.size < bestBlob.size) {
      bestBlob = lowestBlob;
      bestQuality = 0.10;
      bestWidth = currentWidth;
      bestHeight = currentHeight;
    }

    // Downscale dimensions by 10% for next pass
    if (currentWidth * 0.9 < MIN_DIMENSION || currentHeight * 0.9 < MIN_DIMENSION) {
      break; // Avoid reducing to non-visible icon
    }
    currentWidth = Math.round(currentWidth * 0.9);
    currentHeight = Math.round(currentHeight * 0.9);
  }

  if (!bestBlob) {
    const fallbackCanvas = drawToCanvas(img, currentWidth, currentHeight);
    bestBlob = await canvasToBlob(fallbackCanvas, mime, 0.10);
  }

  const reachedTarget = bestBlob.size <= targetBytes;
  const suggestedKb = reachedTarget ? undefined : Math.ceil((bestBlob.size / 1024) * 1.1);

  return {
    blob: bestBlob,
    originalSize,
    compressedSize: bestBlob.size,
    targetKb: options.targetKb,
    width: bestWidth,
    height: bestHeight,
    quality: bestQuality,
    reachedTarget,
    suggestedKb,
  };
}
