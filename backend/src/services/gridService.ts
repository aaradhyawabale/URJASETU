import fs from 'fs';
import path from 'path';

export interface IGridProximityResult {
  nearestSubstationName: string;
  nearestSubstationCode: string;
  nearestSubstationDistanceMeters: number | string;
  nearestFeederLineName: string;
  nearestFeederDistanceMeters: number | string;
  estimatedFeederHostingCapacityMw: number | string;
  gridInterconnectionCapexTier: 'OPTIMAL_LOW_CAPEX' | 'MODERATE_CAPEX' | 'HIGH_CAPEX' | 'UNAVAILABLE';
  classification: 'DERIVED_GRID_INFRASTRUCTURE_PROXY' | 'UNAVAILABLE';
  capacityStatus: 'ESTIMATED_FEEDER_HOSTING_CAPACITY_PROXY' | 'UNAVAILABLE';
  disclaimer: string;
}

let msedclGridCache: any = null;

const getGridFilePath = (): string => {
  const cwd = process.cwd();
  const path1 = path.join(cwd, 'data', 'geo', 'pune_msedcl_grid.geojson');
  if (fs.existsSync(path1)) return path1;
  const path2 = path.join(cwd, '..', 'data', 'geo', 'pune_msedcl_grid.geojson');
  if (fs.existsSync(path2)) return path2;
  return path1;
};

export class GridService {
  public static getMsedclGridGeoJson(): any {
    if (msedclGridCache) return msedclGridCache;
    const filePath = getGridFilePath();
    if (!fs.existsSync(filePath)) return null;
    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      msedclGridCache = JSON.parse(raw);
      return msedclGridCache;
    } catch {
      return null;
    }
  }

  public static evaluateGridProximity(lat: number, lng: number): IGridProximityResult {
    const geojson = this.getMsedclGridGeoJson();
    if (!geojson || !geojson.features || geojson.features.length === 0) {
      return {
        nearestSubstationName: 'UNAVAILABLE — Grid Layer Offline',
        nearestSubstationCode: 'UNAVAILABLE',
        nearestSubstationDistanceMeters: 'UNAVAILABLE',
        nearestFeederLineName: 'UNAVAILABLE — Feeder Layer Offline',
        nearestFeederDistanceMeters: 'UNAVAILABLE',
        estimatedFeederHostingCapacityMw: 'UNAVAILABLE',
        gridInterconnectionCapexTier: 'UNAVAILABLE',
        classification: 'UNAVAILABLE',
        capacityStatus: 'UNAVAILABLE',
        disclaimer: 'MSEDCL grid layer is offline or unavailable. No hardcoded substation or feeder proximity estimates returned.',
      };
    }

    let minSubDistance = Infinity;
    let nearestSubFeature: any = null;

    let minFeederDistance = Infinity;
    let nearestFeederFeature: any = null;

    geojson.features.forEach((f: any) => {
      const props = f.properties || {};
      const geom = f.geometry || {};

      if ((props.nodeType === 'SUBSTATION' || (!props.nodeType && geom.type === 'Point')) && geom.type === 'Point' && geom.coordinates) {
        const [subLng, subLat] = geom.coordinates;
        const d = calculateHaversineMeters(lat, lng, subLat, subLng);
        if (d < minSubDistance) {
          minSubDistance = d;
          nearestSubFeature = f;
        }
      } else if ((props.nodeType === 'FEEDER_LINE' || geom.type === 'LineString') && geom.coordinates) {
        geom.coordinates.forEach(([fLng, fLat]: [number, number]) => {
          const d = calculateHaversineMeters(lat, lng, fLat, fLng);
          if (d < minFeederDistance) {
            minFeederDistance = d;
            nearestFeederFeature = f;
          }
        });
      }
    });

    const nearestSubDist = minSubDistance !== Infinity ? Math.round(minSubDistance) : 'UNAVAILABLE';
    const nearestFeederDist = minFeederDistance !== Infinity ? Math.round(minFeederDistance) : (minSubDistance !== Infinity ? Math.round(minSubDistance * 0.4) : 'UNAVAILABLE');

    let capexTier: IGridProximityResult['gridInterconnectionCapexTier'] = 'OPTIMAL_LOW_CAPEX';
    if (typeof nearestFeederDist === 'number') {
      if (nearestFeederDist > 1500) capexTier = 'HIGH_CAPEX';
      else if (nearestFeederDist > 500) capexTier = 'MODERATE_CAPEX';
    } else {
      capexTier = 'UNAVAILABLE';
    }

    const subProps = nearestSubFeature?.properties || {};
    const feederProps = nearestFeederFeature?.properties || {};

    return {
      nearestSubstationName: subProps.name || 'UNAVAILABLE',
      nearestSubstationCode: subProps.substation_id || subProps.code || 'UNAVAILABLE',
      nearestSubstationDistanceMeters: nearestSubDist,
      nearestFeederLineName: feederProps.name || (subProps.name ? `${subProps.name} Feeder Line` : 'UNAVAILABLE'),
      nearestFeederDistanceMeters: nearestFeederDist,
      estimatedFeederHostingCapacityMw: subProps.capacity_mva ? Number((subProps.capacity_mva * 0.15).toFixed(1)) : (subProps.estimatedAvailableCapacityMw || 'UNAVAILABLE'),
      gridInterconnectionCapexTier: capexTier,
      classification: 'DERIVED_GRID_INFRASTRUCTURE_PROXY',
      capacityStatus: 'ESTIMATED_FEEDER_HOSTING_CAPACITY_PROXY',
      disclaimer: 'MSEDCL feeder proximity and hosting capacity estimates are DERIVED PROXIES based on digitized utility corridors. They do NOT reflect real-time SCADA transformer loading or official MSEDCL grid NOC interconnection approval.',
    };
  }
}

function calculateHaversineMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
