/**
 * Web Worker for Offscreen Image Processing
 */

self.onmessage = async (e: MessageEvent) => {
  const { id, type, fileData, options } = e.data;

  try {
    if (type === 'PING') {
      self.postMessage({ id, status: 'PONG' });
      return;
    }

    if (type === 'COMPRESS_IMAGE_BUFFER') {
      // Decode image bitmap in worker thread
      const blob = new Blob([fileData], { type: options.mimeType || 'image/jpeg' });
      const bitmap = await createImageBitmap(blob);
      const targetBytes = options.targetKb * 1024;

      let currentWidth = options.targetWidth || bitmap.width;
      let currentHeight = options.targetHeight || bitmap.height;

      // Restrict extreme sizes
      if (currentWidth > 2400 || currentHeight > 2400) {
        const scale = 2400 / Math.max(currentWidth, currentHeight);
        currentWidth = Math.round(currentWidth * scale);
        currentHeight = Math.round(currentHeight * scale);
      }

      let bestBlob: Blob | null = null;
      let bestQuality = 0.8;
      const mime = options.mimeType || 'image/jpeg';

      for (let step = 0; step < 10; step++) {
        const offscreen = new OffscreenCanvas(currentWidth, currentHeight);
        const ctx = offscreen.getContext('2d');
        if (!ctx) break;

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, currentWidth, currentHeight);
        ctx.drawImage(bitmap, 0, 0, currentWidth, currentHeight);

        let high = 0.95;
        let low = 0.10;
        let stepBestBlob: Blob | null = null;

        for (let iter = 0; iter < 6; iter++) {
          const mid = Number(((low + high) / 2).toFixed(3));
          const testBlob = await offscreen.convertToBlob({ type: mime, quality: mid });

          if (testBlob.size <= targetBytes) {
            stepBestBlob = testBlob;
            bestQuality = mid;
            low = mid;
          } else {
            high = mid;
          }
          if (high - low < 0.05) break;
        }

        if (stepBestBlob && stepBestBlob.size <= targetBytes) {
          bestBlob = stepBestBlob;
          break;
        }

        // Try minimum quality
        const minBlob = await offscreen.convertToBlob({ type: mime, quality: 0.10 });
        if (minBlob.size <= targetBytes) {
          bestBlob = minBlob;
          bestQuality = 0.10;
          break;
        }

        if (!bestBlob || minBlob.size < bestBlob.size) {
          bestBlob = minBlob;
        }

        currentWidth = Math.round(currentWidth * 0.9);
        currentHeight = Math.round(currentHeight * 0.9);
        if (currentWidth < 50 || currentHeight < 50) break;
      }

      bitmap.close();

      if (bestBlob) {
        const buffer = await bestBlob.arrayBuffer();
        (self as any).postMessage({
          id,
          status: 'SUCCESS',
          buffer,
          compressedSize: bestBlob.size,
          width: currentWidth,
          height: currentHeight,
          quality: bestQuality,
          reachedTarget: bestBlob.size <= targetBytes,
        }, [buffer]);
      } else {
        (self as any).postMessage({ id, status: 'ERROR', message: 'FAILED_TO_COMPRESS' });
      }
    }
  } catch (err: any) {
    (self as any).postMessage({ id, status: 'ERROR', message: err?.message || 'WORKER_ERROR' });
  }
};
