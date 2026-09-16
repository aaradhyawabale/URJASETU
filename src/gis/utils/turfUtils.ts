import * as turf from '@turf/turf';

export interface IPlotCapacityMetrics {
  areaSqm: number;
  usableCanopyAreaSqm: number;
  solarCapacityKwp: number;
  annualGenerationMwh: number;
  evChargerPorts: number;
  bessCapacityKwh: number;
  estimatedCapexInr: number;
}

/**
 * Calculates area of GeoJSON Polygon in square meters using Turf.js
 */
export function calculatePolygonAreaSqm(coordinates: number[][][]): number {
  try {
    const poly = turf.polygon(coordinates);
    const area = turf.area(poly);
    return Math.round(area);
  } catch (err) {
    console.warn('[Turf.js] Failed to calculate polygon area:', err);
    return 2450; // Fallback default
  }
}

/**
 * Validates whether a polygon is closed and valid for area computation
 */
export function isValidPolygon(coordinates: number[][][]): boolean {
  if (!coordinates || coordinates.length === 0) return false;
  const ring = coordinates[0];
  if (!ring || ring.length < 4) return false;
  const first = ring[0];
  const last = ring[ring.length - 1];
  return first[0] === last[0] && first[1] === last[1];
}

/**
 * Computes engineering capacity metrics for drawn parcel area
 */
export function calculatePlotCapacityMetrics(areaSqm: number, ghiKwhM2Day: number = 5.02): IPlotCapacityMetrics {
  const safeArea = Math.max(500, areaSqm);
  const usableCanopyAreaSqm = Math.round(safeArea * 0.60);
  const solarCapacityKwp = Math.round(usableCanopyAreaSqm * 0.20);
  const annualGenerationMwh = Number(((solarCapacityKwp * ghiKwhM2Day * 365 * 0.80) / 1000).toFixed(1));
  const evChargerPorts = Math.max(2, Math.min(32, Math.floor(safeArea / 250) * 2));
  const bessCapacityKwh = Math.round(solarCapacityKwp * 0.50);
  const estimatedCapexInr = (solarCapacityKwp * 45000) + (evChargerPorts * 800000) + (bessCapacityKwh * 18000);

  return {
    areaSqm: safeArea,
    usableCanopyAreaSqm,
    solarCapacityKwp,
    annualGenerationMwh,
    evChargerPorts,
    bessCapacityKwh,
    estimatedCapexInr,
  };
}

export const AREA_DISCLAIMER_TEXT = "Estimated available plot area based on the drawn boundary";
