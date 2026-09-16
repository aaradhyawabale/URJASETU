import { CandidateSite } from '../../types/site';

export interface SearchResult {
  id: string;
  name: string;
  type: 'WARD' | 'ROAD' | 'POI' | 'CANDIDATE_SITE' | 'GEOLOCATION';
  subtitle?: string;
  lat: number;
  lng: number;
  zoom?: number;
  bounds?: [[number, number], [number, number]];
  provenance: string;
}

// Pre-indexed Nashik Municipal Landmarks & Wards for instant zero-latency fuzzy search
const PREINDEXED_NASHIK_LOCATIONS: SearchResult[] = [
  {
    id: 'ward-panchavati',
    name: 'Panchavati Division',
    type: 'WARD',
    subtitle: 'NMC Administrative Division 1 • North Nashik',
    lat: 20.0089,
    lng: 73.7954,
    zoom: 14,
    provenance: 'DERIVED_NMC_ADMINISTRATIVE_ZONES',
  },
  {
    id: 'ward-satpur',
    name: 'Satpur Division',
    type: 'WARD',
    subtitle: 'NMC Administrative Division 2 • West Industrial Belt',
    lat: 19.9882,
    lng: 73.7421,
    zoom: 14,
    provenance: 'DERIVED_NMC_ADMINISTRATIVE_ZONES',
  },
  {
    id: 'ward-cidco-ambad',
    name: 'CIDCO / Ambad Division',
    type: 'WARD',
    subtitle: 'NMC Administrative Division 3 • South Industrial Hub',
    lat: 19.9450,
    lng: 73.7610,
    zoom: 14,
    provenance: 'DERIVED_NMC_ADMINISTRATIVE_ZONES',
  },
  {
    id: 'ward-nashik-road',
    name: 'Nashik Road Division',
    type: 'WARD',
    subtitle: 'NMC Administrative Division 4 • Railway Corridor',
    lat: 19.9530,
    lng: 73.8340,
    zoom: 14,
    provenance: 'DERIVED_NMC_ADMINISTRATIVE_ZONES',
  },
  {
    id: 'ward-nashik-east',
    name: 'Nashik East Division',
    type: 'WARD',
    subtitle: 'NMC Administrative Division 5 • Central Commercial',
    lat: 19.9975,
    lng: 73.7898,
    zoom: 14,
    provenance: 'DERIVED_NMC_ADMINISTRATIVE_ZONES',
  },
  {
    id: 'ward-nashik-west',
    name: 'Nashik West Division',
    type: 'WARD',
    subtitle: 'NMC Administrative Division 6 • Residential West',
    lat: 20.0120,
    lng: 73.7650,
    zoom: 14,
    provenance: 'DERIVED_NMC_ADMINISTRATIVE_ZONES',
  },
  {
    id: 'loc-trimbak-road',
    name: 'Trimbak Road Corridor',
    type: 'ROAD',
    subtitle: 'Major Arterial Road • Satpur - Govardhan Axis',
    lat: 19.9850,
    lng: 73.7250,
    zoom: 15,
    provenance: 'OPEN (OSM Roads)',
  },
  {
    id: 'loc-college-road',
    name: 'College Road Commercial Belt',
    type: 'ROAD',
    subtitle: 'High EV Demand Activity Corridor',
    lat: 20.0050,
    lng: 73.7680,
    zoom: 15,
    provenance: 'OPEN (OSM Roads)',
  },
  {
    id: 'loc-gangapur-road',
    name: 'Gangapur Road Ribbon',
    type: 'ROAD',
    subtitle: 'North-West Residential Arterial',
    lat: 20.0210,
    lng: 73.7540,
    zoom: 15,
    provenance: 'OPEN (OSM Roads)',
  },
  {
    id: 'loc-godavari-riverfront',
    name: 'Godavari River Corridor',
    type: 'POI',
    subtitle: 'Hydrologic Setback Zone • Ramkund Basin',
    lat: 20.0065,
    lng: 73.7920,
    zoom: 15,
    provenance: 'CONSERVATIVE_PROJECT_SCREENING_BUFFER',
  },
  {
    id: 'loc-cbs-nashik',
    name: 'Central Bus Station (CBS)',
    type: 'POI',
    subtitle: 'Transit Hub • Heavy EV Fleet Transit Node',
    lat: 19.9960,
    lng: 73.7820,
    zoom: 16,
    provenance: 'OPEN (OSM POI)',
  },
  {
    id: 'loc-ambad-midc',
    name: 'Ambad MIDC Industrial Estate',
    type: 'POI',
    subtitle: 'Industrial Power Grid Buffer Zone',
    lat: 19.9380,
    lng: 73.7520,
    zoom: 15,
    provenance: 'OPEN (OSM Landuse)',
  },
];

/**
 * Searches local indexed features (wards, corridors, POIs, candidate sites) and falls back to OSM Nominatim API.
 */
export async function searchLocations(
  query: string,
  candidateSites: CandidateSite[] = []
): Promise<SearchResult[]> {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return [];

  // 1. Search local pre-indexed landmarks
  const localResults: SearchResult[] = PREINDEXED_NASHIK_LOCATIONS.filter(
    (item) =>
      item.name.toLowerCase().includes(normalizedQuery) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(normalizedQuery)) ||
      item.type.toLowerCase().includes(normalizedQuery)
  );

  // 2. Search candidate sites passed dynamically
  const siteResults: SearchResult[] = candidateSites
    .filter(
      (site) =>
        site.code.toLowerCase().includes(normalizedQuery) ||
        site.name.toLowerCase().includes(normalizedQuery) ||
        (site.ward && site.ward.toLowerCase().includes(normalizedQuery))
    )
    .map((site) => ({
      id: site.id,
      name: `${site.code} — ${site.name}`,
      type: 'CANDIDATE_SITE',
      subtitle: `Score: ${site.opportunityScore}/100 • ${site.ward || site.wardName || 'Nashik'}`,
      lat: site.latitude || site.lat || 19.9975,
      lng: site.longitude || site.lng || 73.7898,
      zoom: 16,
      provenance: 'DERIVED_CANDIDATE_PLOT_GEOMETRY',
    }));

  const mergedLocal = [...siteResults, ...localResults];

  // If local results are found (or query is short <3 chars), return local results immediately
  if (mergedLocal.length > 0 || normalizedQuery.length < 3) {
    return mergedLocal.slice(0, 8);
  }

  // 3. Fallback to OpenStreetMap Nominatim Geocoding API
  try {
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      normalizedQuery + ', Nashik, Maharashtra'
    )}&limit=5`;

    const res = await fetch(nominatimUrl, {
      headers: {
        'User-Agent': 'UrjaSetu-Geospatial-Platform/1.0',
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const nominatimResults: SearchResult[] = data.map((item: any, idx: number) => ({
          id: `osm-nom-${item.place_id || idx}`,
          name: item.display_name.split(',')[0],
          type: 'GEOLOCATION',
          subtitle: item.display_name,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
          zoom: 15,
          provenance: 'OPEN (OSM Nominatim Geocoder)',
        }));
        return [...mergedLocal, ...nominatimResults].slice(0, 8);
      }
    }
  } catch (err) {
    console.warn('[searchService] Nominatim fallback query failed or timed out:', err);
  }

  return mergedLocal.slice(0, 8);
}
