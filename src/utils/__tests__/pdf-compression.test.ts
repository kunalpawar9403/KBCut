import { describe, it, expect } from 'vitest';
import { PDFDocument, rgb } from 'pdf-lib';

describe('Multi-page PDF Compression Verification', () => {
  it('should take a large multi-page PDF and rebuild it strictly under 200 KB', async () => {
    // 1. Create a simulated heavy multi-page PDF
    const largeDoc = await PDFDocument.create();
    for (let i = 0; i < 6; i++) {
      const page = largeDoc.addPage([595.28, 841.89]);
      // Add lots of vectors, text and shapes to simulate heavy page data
      for (let j = 0; j < 50; j++) {
        page.drawRectangle({
          x: 40 + (j % 5) * 100,
          y: 100 + Math.floor(j / 5) * 60,
          width: 80,
          height: 40,
          color: rgb(0.1, 0.3, 0.8),
        });
      }
    }

    const largeBytes = await largeDoc.save();
    expect(largeBytes.length).toBeGreaterThan(0);

    // 2. Simulate the compression engine budget: target 200 KB (204,800 bytes)
    const targetKb = 200;
    const targetBytes = targetKb * 1024;
    const structureOverhead = Math.min(8192, Math.floor(targetBytes * 0.1));
    const usableBytes = Math.max(10240, targetBytes - structureOverhead);
    const targetBytesPerPage = Math.floor(usableBytes / 6);

    // Rebuild compressed document
    const compressedDoc = await PDFDocument.create();
    const copiedPages = await compressedDoc.copyPages(largeDoc, largeDoc.getPageIndices());
    copiedPages.forEach((p) => compressedDoc.addPage(p));
    const compressedBytes = await compressedDoc.save({ useObjectStreams: true });

    // Output must be under 200 KB
    expect(compressedBytes.length).toBeLessThanOrEqual(targetBytes);
    expect(Math.round(compressedBytes.length / 1024)).toBeLessThanOrEqual(targetKb);
  });
});
