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

// Pre-indexed Pune Municipal Landmarks & Wards for instant zero-latency fuzzy search
const PREINDEXED_PUNE_LOCATIONS: SearchResult[] = [
  {
    id: 'ward-aundh-baner',
    name: 'Aundh - Baner Division',
    type: 'WARD',
    subtitle: 'PMC Administrative Division 1 • Western Tech Belt',
    lat: 18.5600,
    lng: 73.8070,
    zoom: 14,
    provenance: 'DERIVED_PMC_ADMINISTRATIVE_ZONES',
  },
  {
    id: 'ward-shivajinagar',
    name: 'Shivajinagar - Ghole Road Division',
    type: 'WARD',
    subtitle: 'PMC Administrative Division 2 • Central Commercial Axis',
    lat: 18.5285,
    lng: 73.8520,
    zoom: 14,
    provenance: 'DERIVED_PMC_ADMINISTRATIVE_ZONES',
  },
  {
    id: 'ward-yerwada',
    name: 'Yerwada - Kalas - Dhanori Division',
    type: 'WARD',
    subtitle: 'PMC Administrative Division 3 • North-Eastern Zone',
    lat: 18.5620,
    lng: 73.8810,
    zoom: 14,
    provenance: 'DERIVED_PMC_ADMINISTRATIVE_ZONES',
  },
  {
    id: 'ward-nagar-road',
    name: 'Nagar Road - Vadgaon Sheri Division',
    type: 'WARD',
    subtitle: 'PMC Administrative Division 4 • Eastern Tech Corridor',
    lat: 18.5510,
    lng: 73.9350,
    zoom: 14,
    provenance: 'DERIVED_PMC_ADMINISTRATIVE_ZONES',
  },
  {
    id: 'ward-kondhwa',
    name: 'Kondhwa - Wanwadi - Hadapsar Division',
    type: 'WARD',
    subtitle: 'PMC Administrative Division 5 • South-Eastern Zone',
    lat: 18.4810,
    lng: 73.8950,
    zoom: 14,
    provenance: 'DERIVED_PMC_ADMINISTRATIVE_ZONES',
  },
  {
    id: 'ward-dhankawadi',
    name: 'Dhankawadi - Sahakarnagar - Karvenagar Division',
    type: 'WARD',
    subtitle: 'PMC Administrative Division 6 • Southern Transit Node',
    lat: 18.4720,
    lng: 73.8510,
    zoom: 14,
    provenance: 'DERIVED_PMC_ADMINISTRATIVE_ZONES',
  },
  {
    id: 'loc-fc-road',
    name: 'Fergusson College (FC) Road',
    type: 'ROAD',
    subtitle: 'High Traffic Commercial Belt • Shivajinagar',
    lat: 18.5220,
    lng: 73.8420,
    zoom: 15,
    provenance: 'OPEN (OSM Roads)',
  },
  {
    id: 'loc-jm-road',
    name: 'Jangali Maharaj (JM) Road',
    type: 'ROAD',
    subtitle: 'Arterial Commercial Axis • Deccan Gymkhana',
    lat: 18.5240,
    lng: 73.8480,
    zoom: 15,
    provenance: 'OPEN (OSM Roads)',
  },
  {
    id: 'loc-baner-road',
    name: 'Baner Main Road',
    type: 'ROAD',
    subtitle: 'High EV Demand Tech Hub Axis • Aundh-Baner',
    lat: 18.5590,
    lng: 73.7980,
    zoom: 15,
    provenance: 'OPEN (OSM Roads)',
  },
  {
    id: 'loc-mula-mutha-riverfront',
    name: 'Mula-Mutha River Corridor',
    type: 'POI',
    subtitle: 'Hydrologic Setback Zone • 30m Blue Line',
    lat: 18.5300,
    lng: 73.8500,
    zoom: 15,
    provenance: 'CONSERVATIVE_PROJECT_SCREENING_BUFFER',
  },
  {
    id: 'loc-shivajinagar-terminal',
    name: 'Shivajinagar MSRTC Bus Terminal',
    type: 'POI',
    subtitle: 'Transit Hub • Heavy EV Fleet Node',
    lat: 18.5310,
    lng: 73.8520,
    zoom: 16,
    provenance: 'OPEN (OSM POI)',
  },
  {
    id: 'loc-kharadi-it-park',
    name: 'Kharadi EON Infotech Park',
    type: 'POI',
    subtitle: 'Eastern IT Corridor • High EV Charger Demand',
    lat: 18.5510,
    lng: 73.9520,
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
  const localResults: SearchResult[] = PREINDEXED_PUNE_LOCATIONS.filter(
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
      subtitle: `Score: ${site.opportunityScore}/100 • ${site.ward || site.wardName || 'Pune'}`,
      lat: site.latitude || site.lat || 18.5252,
      lng: site.longitude || site.lng || 73.8850,
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
      normalizedQuery + ', Pune, Maharashtra'
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
