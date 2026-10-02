/**
 * QPDF WebAssembly Service for Browser PDF Optimization
 * Uses @wasm-zoo/qpdf (compiled QPDF 12.4 CLI for browser WebAssembly)
 */

let qpdfLoaderPromise: Promise<any> | null = null;

export async function isQpdfSupported(): Promise<boolean> {
  return typeof window !== 'undefined' && typeof Worker !== 'undefined' && typeof WebAssembly !== 'undefined';
}

/**
 * Optimize a PDF using QPDF WebAssembly
 * Flags:
 * --linearize: Fast web view
 * --object-streams=generate: Compress objects into compressed streams
 * --recompress-flate: Recompress flate streams at highest compression
 * --compression-level=9: Maximum zlib compression
 */
export async function optimizePdfWithQpdf(
  inputBuffer: ArrayBuffer
): Promise<Uint8Array | null> {
  if (typeof window === 'undefined') return null;

  try {
    const { load } = await import('@wasm-zoo/qpdf');
    const qpdf = await load();

    try {
      // Clone buffer so QPDF worker transfer list does not detach caller's buffer!
      const clonedData = inputBuffer.slice(0);
      const result = await qpdf.exec(
        [
          '/input.pdf',
          '/output.pdf',
          '--linearize',
          '--object-streams=generate',
          '--recompress-flate',
          '--compression-level=9',
        ],
        {
          files: [{ name: '/input.pdf', data: clonedData }],
          outputs: ['/output.pdf'],
          timeoutMs: 15000,
        }
      );

      if (result && result.files && result.files.length > 0) {
        return result.files[0].data;
      }
      return null;
    } finally {
      try {
        qpdf.dispose();
      } catch {
        // Safe ignore
      }
    }
  } catch (err) {
    console.warn('QPDF WASM optimization skipped or failed, using native engine:', err);
    return null;
  }
}
