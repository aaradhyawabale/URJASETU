import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { ClimateService } from '../services/climateService.js';
import { ElevationService } from '../services/elevationService.js';
import { RiskService } from '../services/riskService.js';
import { GridService } from '../services/gridService.js';

// In-memory cache for parsed GeoJSON layers to prevent redundant file parsing
const geojsonCache: Record<string, any> = {};

const getOsmDir = (): string => {
  const cwd = process.cwd();
  const path1 = path.join(cwd, 'data', 'osm');
  if (fs.existsSync(path1)) return path1;

  const path2 = path.join(cwd, '..', 'data', 'osm');
  if (fs.existsSync(path2)) return path2;

  return path1;
};

const getGeoJsonFilePath = (layerName: string): string => {
  const osmDir = getOsmDir();
  const layerMap: Record<string, string> = {
    roads: path.join(osmDir, 'nashik_roads.geojson'),
    buildings: path.join(osmDir, 'nashik_buildings.geojson'),
    pois: path.join(osmDir, 'nashik_pois.geojson'),
    landuse: path.join(osmDir, 'nashik_landuse.geojson'),
    parking: path.join(osmDir, 'nashik_parking.geojson'),
    ev: path.join(osmDir, 'nashik_ev_pois.geojson'),
  };

  return layerMap[layerName.toLowerCase()];
};

const loadGeoJsonLayer = (layerName: string): any | null => {
  if (geojsonCache[layerName]) {
    return geojsonCache[layerName];
  }

  const filePath = getGeoJsonFilePath(layerName);
  if (!filePath || !fs.existsSync(filePath)) {
    console.warn(`[gisController] File not found for layer '${layerName}': ${filePath}`);
    return null;
  }

  try {
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(rawData);
    geojsonCache[layerName] = parsed;
    return parsed;
  } catch (error) {
    console.error(`[gisController] Error loading layer '${layerName}':`, (error as Error).message);
    return null;
  }
};

export const getOsmLayer = (req: Request, res: Response) => {
  const { layer } = req.params;
  const validLayers = ['roads', 'buildings', 'pois', 'landuse', 'parking', 'ev'];

  if (!layer || !validLayers.includes(layer.toLowerCase())) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_LAYER',
        message: `Invalid layer '${layer}'. Supported layers: ${validLayers.join(', ')}`,
      },
    });
  }

  const data = loadGeoJsonLayer(layer.toLowerCase());
  if (!data) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'LAYER_NOT_FOUND',
        message: `Spatial dataset for '${layer}' could not be loaded.`,
      },
    });
  }

  return res.status(200).json(data);
};

export const getOsmMetadata = (_req: Request, res: Response) => {
  const osmDir = getOsmDir();
  const metadataPath = path.join(osmDir, 'metadata.json');

  if (!fs.existsSync(metadataPath)) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'METADATA_NOT_FOUND',
        message: `OSM metadata document not found at '${metadataPath}'.`,
      },
    });
  }

  try {
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
    return res.status(200).json({
      success: true,
      data: metadata,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: {
        code: 'METADATA_READ_ERROR',
        message: (err as Error).message,
      },
    });
  }
};

export const getSolarClimatology = async (_req: Request, res: Response) => {
  const data = await ClimateService.getNashikSolarClimatology();
  return res.status(200).json({
    success: true,
    data,
  });
};

export const getElevationAnalysis = (req: Request, res: Response) => {
  const lat = parseFloat(req.query.lat as string) || 19.9975;
  const lng = parseFloat(req.query.lng as string) || 73.7898;

  const data = ElevationService.evaluateTerrain(lat, lng);
  return res.status(200).json({
    success: true,
    data,
  });
};

export const getHydrologicalAnalysis = (req: Request, res: Response) => {
  const lat = parseFloat(req.query.lat as string) || 19.9975;
  const lng = parseFloat(req.query.lng as string) || 73.7898;

  const data = RiskService.evaluateHydrologicalRisk(lat, lng);
  return res.status(200).json({
    success: true,
    data,
  });
};

// Spatial Indicators Endpoint (Point -> nearest road distance, POI density, nearest EV charger)
export const getSpatialIndicators = (req: Request, res: Response) => {
  const { latitude, longitude } = req.body;

  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_COORDINATES',
        message: 'Must provide valid latitude and longitude numbers in request body.',
      },
    });
  }

  const evData = loadGeoJsonLayer('ev');
  const poisData = loadGeoJsonLayer('pois');
  const terrain = ElevationService.evaluateTerrain(latitude, longitude);

  let nearestEVChargerDistanceMeters: number | null = null;
  if (evData && evData.features && evData.features.length > 0) {
    let minDistance = Infinity;
    evData.features.forEach((f: any) => {
      if (f.geometry && f.geometry.coordinates) {
        const [lng, lat] = f.geometry.coordinates;
        const d = calculateHaversineMeters(latitude, longitude, lat, lng);
        if (d < minDistance) minDistance = d;
      }
    });
    if (minDistance !== Infinity) {
      nearestEVChargerDistanceMeters = Math.round(minDistance);
    }
  }

  let nearbyPoiCount500m = 0;
  if (poisData && poisData.features) {
    poisData.features.forEach((f: any) => {
      if (f.geometry && f.geometry.coordinates) {
        const [lng, lat] = f.geometry.coordinates;
        const d = calculateHaversineMeters(latitude, longitude, lat, lng);
        if (d <= 500) nearbyPoiCount500m++;
      }
    });
  }

  return res.status(200).json({
    success: true,
    data: {
      latitude,
      longitude,
      nearestEVChargerDistanceMeters,
      nearbyPoiCount500m,
      elevationMeters: terrain.elevationMeters,
      slopePercent: terrain.slopePercent,
      slopeCategory: terrain.slopeCategory,
      units: {
        distance: 'meters',
        radius: '500m',
        elevation: 'meters',
        slope: 'percent',
      },
    },
  });
};

export const getMsedclGridAnalysis = async (req: Request, res: Response) => {
  try {
    const lat = req.query.lat ? parseFloat(req.query.lat as string) : 19.9975;
    const lng = req.query.lng ? parseFloat(req.query.lng as string) : 73.7898;

    const geojson = GridService.getMsedclGridGeoJson();
    const proximity = GridService.evaluateGridProximity(lat, lng);

    return res.status(200).json({
      success: true,
      data: {
        coordinates: { latitude: lat, longitude: lng },
        proximity,
        geojson,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: { code: 'GRID_ANALYSIS_FAILED', message: (err as Error).message },
    });
  }
};


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
