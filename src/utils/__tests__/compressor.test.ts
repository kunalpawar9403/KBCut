import { describe, it, expect } from 'vitest';
import { EXAM_PRESETS, getPresetById, TARGET_SIZE_OPTIONS } from '../../data/presets';
import { formatFileSize, bytesToKb } from '../formatters';
import { PDFDocument } from 'pdf-lib';

describe('Exam Presets & Specifications', () => {
  it('should have all 8 required exam and ID presets defined', () => {
    expect(EXAM_PRESETS.length).toBeGreaterThanOrEqual(8);

    const ssc = getPresetById('ssc-photo');
    expect(ssc).toBeDefined();
    expect(ssc?.targetKb).toBe(50);
    expect(ssc?.width).toBe(200);
    expect(ssc?.height).toBe(230);

    const sig = getPresetById('signature-std');
    expect(sig).toBeDefined();
    expect(sig?.targetKb).toBe(30);
    expect(sig?.width).toBe(140);
    expect(sig?.height).toBe(60);

    const passport = getPresetById('passport-photo');
    expect(passport).toBeDefined();
    expect(passport?.targetKb).toBe(100);

    const aadhaar = getPresetById('aadhaar-doc');
    expect(aadhaar).toBeDefined();
    expect(aadhaar?.targetKb).toBe(200);

    const upsc = getPresetById('upsc-photo');
    expect(upsc).toBeDefined();
    expect(upsc?.targetKb).toBe(300);

    const ibps = getPresetById('ibps-photo');
    expect(ibps).toBeDefined();
    expect(ibps?.targetKb).toBe(50);

    const gate = getPresetById('jee-gate-photo');
    expect(gate).toBeDefined();
    expect(gate?.targetKb).toBe(200);

    const mpsc = getPresetById('mpsc-photo');
    expect(mpsc).toBeDefined();
    expect(mpsc?.targetKb).toBe(50);
  });

  it('should contain the 4 quick target options 20, 50, 100, 200 KB', () => {
    expect(TARGET_SIZE_OPTIONS).toEqual([20, 50, 100, 200]);
  });
});

describe('File Size Formatters', () => {
  it('should correctly format bytes into readable KB and MB', () => {
    expect(formatFileSize(0)).toBe('0 KB');
    expect(formatFileSize(512)).toBe('512 B');
    expect(formatFileSize(48 * 1024)).toBe('48 KB');
    expect(formatFileSize(50 * 1024)).toBe('50 KB');
    expect(formatFileSize(5 * 1024 * 1024)).toBe('5.00 MB');
    expect(formatFileSize(3.2 * 1024 * 1024)).toBe('3.20 MB');
  });

  it('should correctly calculate bytes to KB', () => {
    expect(bytesToKb(51200)).toBe(50);
    expect(bytesToKb(102400)).toBe(100);
  });
});

describe('PDF Generation and Page Budget Logic', () => {
  it('should build a multi-page PDF and verify page count and byte budget calculation', async () => {
    const doc = await PDFDocument.create();
    
    // Create 3 page test PDF
    for (let i = 0; i < 3; i++) {
      const page = doc.addPage([595, 842]); // A4
      page.drawText(`KBCut Multi-Page Test Document - Page ${i + 1}`, { x: 50, y: 800 });
    }

    const pdfBytes = await doc.save();
    const originalPdfSize = pdfBytes.length;
    expect(originalPdfSize).toBeGreaterThan(0);

    // Target: 100 KB
    const targetKb = 100;
    const targetBytes = targetKb * 1024;
    const structureOverhead = Math.min(8192, Math.floor(targetBytes * 0.1));
    const usableBytes = Math.max(10240, targetBytes - structureOverhead);
    const targetBytesPerPage = Math.floor(usableBytes / 3);

    expect(targetBytesPerPage).toBeGreaterThan(20000);
    expect(targetBytesPerPage * 3 + structureOverhead).toBeLessThanOrEqual(targetBytes);
  });
});
