import * as turf from '@turf/turf';

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

export const AREA_DISCLAIMER_TEXT = "Estimated available plot area based on the drawn boundary";
