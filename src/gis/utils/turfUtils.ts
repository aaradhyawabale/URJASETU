import * as turf from '@turf/turf';

export interface IPlotCapacityMetrics {
  areaSqm: number;
  usableCanopyAreaSqm: number;
  solarCapacityKwp: number;
  annualGenerationMwh: number;
  evChargerPorts: number;
  bessCapacityKwh: number;
  estimatedCapexInr: number;
  classifications: {
    solarYield: 'PRELIMINARY_MODELED_ESTIMATE';
    evPorts: 'SPATIAL_PLANNING_HEURISTIC';
    bessSizing: 'PRELIMINARY_SIZING_HEURISTIC';
    capex: 'PRELIMINARY_PLANNING_ESTIMATE';
  };
  disclaimers: {
    solarYield: string;
    evPorts: string;
    bessSizing: string;
    capex: string;
  };
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
 * Computes preliminary spatial planning estimates for drawn parcel area.
 * Uses explicit PLANNING_HEURISTIC and PROJECT_MODELING_ASSUMPTION parameters.
 */
export function calculatePlotCapacityMetrics(areaSqm: number, ghiKwhM2Day: number = 5.02): IPlotCapacityMetrics {
  const safeArea = Math.max(500, areaSqm);
  const usableCanopyAreaSqm = Math.round(safeArea * 0.60); // 60% usable footprint heuristic
  const solarCapacityKwp = Math.round(usableCanopyAreaSqm * 0.20); // 200W/m² module efficiency assumption
  const annualGenerationMwh = Number(((solarCapacityKwp * ghiKwhM2Day * 365 * 0.80) / 1000).toFixed(1)); // 80% PR assumption
  const evChargerPorts = Math.max(2, Math.min(32, Math.floor(safeArea / 250) * 2)); // 2 ports per 250m² spatial heuristic
  const bessCapacityKwh = Math.round(solarCapacityKwp * 0.50); // 0.5hr storage heuristic
  const estimatedCapexInr = (solarCapacityKwp * 45000) + (evChargerPorts * 800000) + (bessCapacityKwh * 18000);

  return {
    areaSqm: safeArea,
    usableCanopyAreaSqm,
    solarCapacityKwp,
    annualGenerationMwh,
    evChargerPorts,
    bessCapacityKwh,
    estimatedCapexInr,
    classifications: {
      solarYield: 'PRELIMINARY_MODELED_ESTIMATE',
      evPorts: 'SPATIAL_PLANNING_HEURISTIC',
      bessSizing: 'PRELIMINARY_SIZING_HEURISTIC',
      capex: 'PRELIMINARY_PLANNING_ESTIMATE',
    },
    disclaimers: {
      solarYield: 'Preliminary modeled annual generation estimate based on 50km NASA POWER regional climatology (5.02 kWh/m²/day GHI) and 80% PR. Does NOT account for plot micro-shading, tilt/azimuth orientation, or inverter losses.',
      evPorts: 'Preliminary spatial planning heuristic (2 ports per 250 m²). Does NOT measure EV vehicle traffic or electrical grid capacity.',
      bessSizing: 'Preliminary sizing heuristic (0.50 hours storage per solar kWp). Not a detailed electrical power flow design.',
      capex: 'Preliminary planning estimate (₹45k/kWp solar, ₹800k/EV fast charger, ₹18k/kWh BESS). Excludes grid connection upgrades, land acquisition, GST, and legal fees.',
    },
  };
}

export const AREA_DISCLAIMER_TEXT = "Estimated available plot area based on the drawn boundary";
