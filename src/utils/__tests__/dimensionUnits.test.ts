import { describe, it, expect } from 'vitest';
import {
  cmToPx,
  mmToPx,
  pxToCm,
  pxToMm,
  convertDimension,
  resolveToPx,
} from '../dimensionUnits';

describe('Dimension Units Conversions (PX, CM, MM at DPI)', () => {
  it('converts PX to CM at 300 DPI matching user example (200x230 px -> 1.69x1.95 cm)', () => {
    // PX: 200 × 230 at 300 DPI
    const cmW = pxToCm(200, 300);
    const cmH = pxToCm(230, 300);

    expect(cmW).toBe(1.69);
    expect(cmH).toBe(1.95);
  });

  it('converts CM back to PX at 300 DPI matching user example (1.69x1.95 cm -> 200x230 px)', () => {
    const pxW = cmToPx(1.69, 300);
    const pxH = cmToPx(1.95, 300);

    expect(pxW).toBe(200);
    expect(pxH).toBe(230);
  });

  it('converts MM to PX at 300 DPI (e.g. Passport Photo 35x45 mm)', () => {
    // 35 mm at 300 DPI: (35 / 25.4) * 300 = 413.38 -> 413 px
    // 45 mm at 300 DPI: (45 / 25.4) * 300 = 531.49 -> 531 px
    const pxW = mmToPx(35, 300);
    const pxH = mmToPx(45, 300);

    expect(pxW).toBe(413);
    expect(pxH).toBe(531);
  });

  it('converts PX to MM at 300 DPI', () => {
    const mmW = pxToMm(413, 300);
    const mmH = pxToMm(531, 300);

    expect(mmW).toBe(35.0);
    expect(mmH).toBe(45.0);
  });

  it('converts between units using convertDimension', () => {
    // 200 PX -> CM at 300 DPI
    expect(convertDimension(200, 'px', 'cm', 300)).toBe(1.69);
    // 1.69 CM -> PX at 300 DPI
    expect(convertDimension(1.69, 'cm', 'px', 300)).toBe(200);
    // 35 MM -> PX at 300 DPI
    expect(convertDimension(35, 'mm', 'px', 300)).toBe(413);
    // 413 PX -> MM at 300 DPI
    expect(convertDimension(413, 'px', 'mm', 300)).toBe(35.0);
  });

  it('adapts to custom DPI settings', () => {
    // At 150 DPI instead of 300 DPI:
    expect(cmToPx(2.54, 150)).toBe(150);
    expect(cmToPx(2.54, 300)).toBe(300);
    expect(mmToPx(25.4, 150)).toBe(150);
    expect(mmToPx(25.4, 300)).toBe(300);
  });

  it('resolves values to exact PX correctly with resolveToPx', () => {
    expect(resolveToPx(200, 'px', 300)).toBe(200);
    expect(resolveToPx(1.69, 'cm', 300)).toBe(200);
    expect(resolveToPx(35, 'mm', 300)).toBe(413);
  });
});
