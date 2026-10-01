import { PDFDocument, degrees } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

// Ensure worker configured
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

/**
 * Merge multiple PDF and image files into a single unified PDF
 */
export async function mergeFilesToPdf(files: File[]): Promise<Blob> {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

    if (isPdf) {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    } else {
      // Image file (jpg, png, webp)
      const bytes = await file.arrayBuffer();
      let img;
      if (file.type === 'image/png' || file.name.toLowerCase().endsWith('.png')) {
        img = await mergedPdf.embedPng(bytes);
      } else {
        img = await mergedPdf.embedJpg(bytes);
      }

      // Add A4 or proportional page
      const { width, height } = img.scale(1);
      const page = mergedPdf.addPage([width, height]);
      page.drawImage(img, { x: 0, y: 0, width, height });
    }
  }

  const mergedBytes = await mergedPdf.save();
  return new Blob([mergedBytes as unknown as BlobPart], { type: 'application/pdf' });
}

/**
 * Split or extract pages from a PDF
 * pageRangesStr format: e.g. "1-3, 5, 7-9" (1-indexed for users)
 */
export async function splitPdfByRange(
  file: File | Blob,
  pageRangesStr: string
): Promise<Blob> {
  const bytes = await file.arrayBuffer();
  const srcDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const totalPages = srcDoc.getPageCount();

  const selectedIndices = new Set<number>();
  const parts = pageRangesStr.split(',').map((p) => p.trim());

  for (const part of parts) {
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-').map((s) => s.trim());
      const start = Math.max(1, parseInt(startStr, 10));
      const end = Math.min(totalPages, parseInt(endStr, 10));
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = start; i <= end; i++) {
          selectedIndices.add(i - 1);
        }
      }
    } else {
      const single = parseInt(part, 10);
      if (!isNaN(single) && single >= 1 && single <= totalPages) {
        selectedIndices.add(single - 1);
      }
    }
  }

  if (selectedIndices.size === 0) {
    throw new Error('NO_PAGES_SELECTED');
  }

  const sortedIndices = Array.from(selectedIndices).sort((a, b) => a - b);
  const outDoc = await PDFDocument.create();
  const copiedPages = await outDoc.copyPages(srcDoc, sortedIndices);
  copiedPages.forEach((p) => outDoc.addPage(p));

  const outBytes = await outDoc.save();
  return new Blob([outBytes as unknown as BlobPart], { type: 'application/pdf' });
}

/**
 * Rotate specific pages or all pages in a PDF
 */
export async function rotatePdfPages(
  file: File | Blob,
  rotationDegrees: 90 | 180 | 270
): Promise<Blob> {
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const pages = doc.getPages();
  for (const page of pages) {
    const current = page.getRotation().angle;
    page.setRotation(degrees((current + rotationDegrees) % 360));
  }
  const outBytes = await doc.save();
  return new Blob([outBytes as unknown as BlobPart], { type: 'application/pdf' });
}

/**
 * Stamp signature PNG onto a PDF page
 */
export async function stampSignatureOnPdf(
  pdfFile: File | Blob,
  signaturePngDataUrl: string,
  pageIndex: number, // 0-indexed
  xPercent: number, // 0 - 100% from left
  yPercent: number, // 0 - 100% from bottom
  widthPercent: number // 0 - 100% of page width
): Promise<Blob> {
  const pdfBytes = await pdfFile.arrayBuffer();
  const doc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
  const pages = doc.getPages();

  const targetPage = pages[Math.min(pageIndex, pages.length - 1)];
  const { width: pageWidth, height: pageHeight } = targetPage.getSize();

  // Load signature PNG
  const sigBytes = await (await fetch(signaturePngDataUrl)).arrayBuffer();
  const sigImage = await doc.embedPng(sigBytes);

  const sigWidth = (pageWidth * widthPercent) / 100;
  const sigHeight = sigWidth * (sigImage.height / sigImage.width);
  const x = (pageWidth * xPercent) / 100;
  const y = (pageHeight * yPercent) / 100;

  targetPage.drawImage(sigImage, {
    x,
    y,
    width: sigWidth,
    height: sigHeight,
  });

  const outBytes = await doc.save();
  return new Blob([outBytes as unknown as BlobPart], { type: 'application/pdf' });
}

/**
 * Build "Aadhaar front + back on one A4 page"
 * Places Front & Back side-by-side or top-and-bottom on standard A4 portrait (595.28 x 841.89 pt)
 */
export async function createAadhaar2In1Pdf(
  frontFile: File | Blob,
  backFile: File | Blob
): Promise<Blob> {
  const doc = await PDFDocument.create();
  // Standard A4: 595.28 x 841.89 pt
  const A4_WIDTH = 595.28;
  const A4_HEIGHT = 841.89;
  const page = doc.addPage([A4_WIDTH, A4_HEIGHT]);

  async function embedAnyImage(f: File | Blob) {
    const buf = await f.arrayBuffer();
    try {
      if (f.type.includes('png')) {
        return await doc.embedPng(buf);
      }
      return await doc.embedJpg(buf);
    } catch {
      // Fallback: draw through canvas to JPEG
      const img = new Image();
      const url = URL.createObjectURL(f);
      await new Promise((res, rej) => {
        img.onload = res;
        img.onerror = rej;
        img.src = url;
      });
      const c = document.createElement('canvas');
      c.width = img.width;
      c.height = img.height;
      const ctx = c.getContext('2d')!;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      const jpgBlob: Blob = await new Promise((r) => c.toBlob((b) => r(b!), 'image/jpeg', 0.9));
      const jpgBuf = await jpgBlob.arrayBuffer();
      return await doc.embedJpg(jpgBuf);
    }
  }

  const frontImg = await embedAnyImage(frontFile);
  const backImg = await embedAnyImage(backFile);

  // Target card size on A4: width ~ 440 pt (standard ID card look)
  const cardWidth = 440;
  const frontHeight = cardWidth * (frontImg.height / frontImg.width);
  const backHeight = cardWidth * (backImg.height / backImg.width);

  const marginX = (A4_WIDTH - cardWidth) / 2;
  const totalCardsHeight = frontHeight + backHeight + 40; // 40 pt spacing
  const startY = (A4_HEIGHT - totalCardsHeight) / 2;

  // Draw Front (top)
  const frontY = startY + backHeight + 40;
  page.drawImage(frontImg, {
    x: marginX,
    y: frontY,
    width: cardWidth,
    height: frontHeight,
  });

  // Draw Back (bottom)
  const backY = startY;
  page.drawImage(backImg, {
    x: marginX,
    y: backY,
    width: cardWidth,
    height: backHeight,
  });

  const outBytes = await doc.save();
  return new Blob([outBytes as unknown as BlobPart], { type: 'application/pdf' });
}

/**
 * Build "Photo + Signature on one page / image"
 * Exam portals often require photo and signature combined in a single JPEG or PDF
 */
export async function createPhotoAndSignatureSheet(
  photoFile: File | Blob,
  signatureFile: File | Blob,
  outputType: 'image/jpeg' | 'application/pdf' = 'image/jpeg'
): Promise<Blob> {
  const photoImg = new Image();
  const sigImg = new Image();

  const photoUrl = URL.createObjectURL(photoFile);
  const sigUrl = URL.createObjectURL(signatureFile);

  await Promise.all([
    new Promise((res, rej) => { photoImg.onload = res; photoImg.onerror = rej; photoImg.src = photoUrl; }),
    new Promise((res, rej) => { sigImg.onload = res; sigImg.onerror = rej; sigImg.src = sigUrl; }),
  ]);

  URL.revokeObjectURL(photoUrl);
  URL.revokeObjectURL(sigUrl);

  // Standard exam combined sheet layout (e.g. 400x560 px)
  const canvasWidth = 450;
  const canvasHeight = 650;

  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext('2d')!;

  // White clean sheet background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Photo box: centered at top
  const photoTargetW = 300;
  const photoTargetH = 380;
  const photoX = (canvasWidth - photoTargetW) / 2;
  const photoY = 40;

  // Subtle border around photo
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1;
  ctx.strokeRect(photoX - 1, photoY - 1, photoTargetW + 2, photoTargetH + 2);
  ctx.drawImage(photoImg, photoX, photoY, photoTargetW, photoTargetH);

  // Signature box: centered below photo
  const sigTargetW = 320;
  const sigTargetH = 140;
  const sigX = (canvasWidth - sigTargetW) / 2;
  const sigY = photoY + photoTargetH + 30;

  ctx.strokeRect(sigX - 1, sigY - 1, sigTargetW + 2, sigTargetH + 2);
  ctx.drawImage(sigImg, sigX, sigY, sigTargetW, sigTargetH);

  if (outputType === 'application/pdf') {
    const doc = await PDFDocument.create();
    const page = doc.addPage([canvasWidth, canvasHeight]);
    const jpgBlob: Blob = await new Promise((r) => canvas.toBlob((b) => r(b!), 'image/jpeg', 0.92));
    const jpgBuf = await jpgBlob.arrayBuffer();
    const img = await doc.embedJpg(jpgBuf);
    page.drawImage(img, { x: 0, y: 0, width: canvasWidth, height: canvasHeight });
    const pdfBytes = await doc.save();
    return new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
  }

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', 0.9);
  });
}
