export type DimensionUnit = 'px' | 'cm' | 'mm';

export const DEFAULT_DPI = 300;
export const DPI_OPTIONS = [72, 96, 150, 200, 300] as const;

/**
 * CM → PX: pixels = (cm / 2.54) × DPI
 */
export function cmToPx(cm: number, dpi: number = DEFAULT_DPI): number {
  if (!cm || isNaN(cm) || cm <= 0) return 0;
  return Math.round((cm / 2.54) * dpi);
}

/**
 * MM → PX: pixels = (mm / 25.4) × DPI
 */
export function mmToPx(mm: number, dpi: number = DEFAULT_DPI): number {
  if (!mm || isNaN(mm) || mm <= 0) return 0;
  return Math.round((mm / 25.4) * dpi);
}

/**
 * PX → CM: cm = (px × 2.54) / DPI
 */
export function pxToCm(px: number, dpi: number = DEFAULT_DPI): number {
  if (!px || isNaN(px) || px <= 0) return 0;
  const val = (px * 2.54) / dpi;
  return Number(val.toFixed(2));
}

/**
 * PX → MM: mm = (px × 25.4) / DPI
 */
export function pxToMm(px: number, dpi: number = DEFAULT_DPI): number {
  if (!px || isNaN(px) || px <= 0) return 0;
  const val = (px * 25.4) / dpi;
  return Number(val.toFixed(1));
}

/**
 * Convert value between any two units preserving physical size at given DPI
 */
export function convertDimension(
  val: number,
  fromUnit: DimensionUnit,
  toUnit: DimensionUnit,
  dpi: number = DEFAULT_DPI
): number {
  if (fromUnit === toUnit) return val;
  if (!val || isNaN(val) || val <= 0) return 0;

  // Convert source unit to base PX
  let px = val;
  if (fromUnit === 'cm') {
    px = (val / 2.54) * dpi;
  } else if (fromUnit === 'mm') {
    px = (val / 25.4) * dpi;
  }

  // Convert base PX to target unit
  if (toUnit === 'px') {
    return Math.round(px);
  }
  if (toUnit === 'cm') {
    return Number(((px * 2.54) / dpi).toFixed(2));
  }
  if (toUnit === 'mm') {
    return Number(((px * 25.4) / dpi).toFixed(1));
  }
  return val;
}

/**
 * Resolves current value to pixel equivalent
 */
export function resolveToPx(
  val: number,
  unit: DimensionUnit,
  dpi: number = DEFAULT_DPI
): number {
  if (unit === 'px') return Math.round(val);
  if (unit === 'cm') return cmToPx(val, dpi);
  if (unit === 'mm') return mmToPx(val, dpi);
  return Math.round(val);
}
