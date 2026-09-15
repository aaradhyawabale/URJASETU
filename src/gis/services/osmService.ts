import { FeatureCollection } from 'geojson';

const clientGeoJsonCache: Record<string, FeatureCollection> = {};

export async function fetchOsmLayer(layerKey: string): Promise<FeatureCollection | null> {
  if (clientGeoJsonCache[layerKey]) {
    return clientGeoJsonCache[layerKey];
  }

  // 1. Try Backend REST API first
  try {
    const res = await fetch(`http://localhost:5001/api/v1/gis/osm/${layerKey}`);
    if (res.ok) {
      const data = (await res.json()) as FeatureCollection;
      if (data && data.type === 'FeatureCollection') {
        clientGeoJsonCache[layerKey] = data;
        return data;
      }
    }
  } catch (err) {
    console.warn(`[osmService] Backend API fetch failed for '${layerKey}', trying static asset fallback:`, (err as Error).message);
  }

  // 2. Fall back to static asset URL
  const fileMap: Record<string, string> = {
    roads: '/data/osm/nashik_roads.geojson',
    buildings: '/data/osm/nashik_buildings.geojson',
    pois: '/data/osm/nashik_pois.geojson',
    landuse: '/data/osm/nashik_landuse.geojson',
    parking: '/data/osm/nashik_parking.geojson',
    ev: '/data/osm/nashik_ev_pois.geojson',
  };

  const staticUrl = fileMap[layerKey];
  if (!staticUrl) return null;

  try {
    const res = await fetch(staticUrl);
    if (res.ok) {
      const data = (await res.json()) as FeatureCollection;
      clientGeoJsonCache[layerKey] = data;
      return data;
    }
  } catch (err) {
    console.error(`[osmService] Failed to load static asset for layer '${layerKey}':`, (err as Error).message);
  }

  return null;
}
