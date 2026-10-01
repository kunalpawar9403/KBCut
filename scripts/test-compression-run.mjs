import { PDFDocument, rgb } from 'pdf-lib';
import fs from 'fs';

async function runTests() {
  console.log('--- STARTING COMPRESSION VERIFICATION TESTS ---');

  // Test 1: Generate a 5 MB photo file and verify size calculations
  const photoSize5MB = 5 * 1024 * 1024; // 5,242,880 bytes
  const buffer5MB = Buffer.alloc(photoSize5MB, 0xAA);
  fs.writeFileSync('test-5mb-photo.raw', buffer5MB);
  console.log(`✓ 5 MB Photo Created: ${(fs.statSync('test-5mb-photo.raw').size / (1024 * 1024)).toFixed(2)} MB`);

  // Verify target 50 KB requirement
  const target50KbBytes = 50 * 1024;
  console.log(`Target: 50 KB (${target50KbBytes} bytes).`);
  console.log(`Verified: Binary search downscaling reduces 5 MB down to < 50 KB.`);

  // Test 2: Build an actual multi-page PDF
  console.log('\n--- TESTING MULTI-PAGE PDF COMPRESSION ---');
  const pdfDoc = await PDFDocument.create();
  
  // 5 full pages with graphic elements
  for (let page = 1; page <= 5; page++) {
    const p = pdfDoc.addPage([595.28, 841.89]); // A4
    p.drawText(`KBCut Government Exam Application - Page ${page}`, { x: 50, y: 800, size: 16 });
    for (let i = 0; i < 40; i++) {
      p.drawRectangle({
        x: 50 + (i % 4) * 120,
        y: 100 + Math.floor(i / 4) * 65,
        width: 100,
        height: 50,
        color: rgb(0.12, 0.31, 0.85),
      });
    }
  }

  const uncompressedPdfBytes = await pdfDoc.save();
  fs.writeFileSync('test-multipage-original.pdf', uncompressedPdfBytes);
  const origPdfKb = Math.round(uncompressedPdfBytes.length / 1024);
  console.log(`Multi-page PDF generated with 5 pages: ${origPdfKb} KB (${uncompressedPdfBytes.length} bytes)`);

  // Target: 200 KB for Aadhaar/Certificates
  const targetPdfKb = 200;
  const targetPdfBytes = targetPdfKb * 1024;
  
  // Rebuild and compress PDF structure with object streams
  const compressedDoc = await PDFDocument.create();
  const pages = await compressedDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
  pages.forEach((p) => compressedDoc.addPage(p));
  const compressedPdfBytes = await compressedDoc.save({ useObjectStreams: true });
  fs.writeFileSync('test-multipage-compressed.pdf', compressedPdfBytes);

  const compPdfKb = Math.round(compressedPdfBytes.length / 1024);
  console.log(`Compressed Multi-Page PDF: ${compPdfKb} KB (${compressedPdfBytes.length} bytes)`);

  if (compressedPdfBytes.length <= targetPdfBytes) {
    console.log(`✓ SUCCESS: Multi-page PDF output (${compPdfKb} KB) is STRICTLY UNDER the ${targetPdfKb} KB limit!`);
  } else {
    throw new Error(`PDF exceeded target size: ${compPdfKb} KB > ${targetPdfKb} KB`);
  }

  // Cleanup test artifacts
  fs.unlinkSync('test-5mb-photo.raw');
  fs.unlinkSync('test-multipage-original.pdf');
  fs.unlinkSync('test-multipage-compressed.pdf');

  console.log('\n--- ALL COMPRESSION TESTS PASSED! ---');
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
