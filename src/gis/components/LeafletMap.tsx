import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CandidateSite } from '../../types/site';
import { NASHIK_GEOJSON_DATASET } from '../data/geojsonDemo';
import { fetchOsmLayer } from '../services/osmService';

export interface LayerVisibilityState {
  osmRoads?: boolean;
  osmBuildings?: boolean;
  osmPois?: boolean;
  osmParking?: boolean;
  osmEvCharging?: boolean;
  osmLanduse?: boolean;
  substationFeeders?: boolean;
  floodways?: boolean;
}

interface LeafletMapProps {
  sites: CandidateSite[];
  selectedSite: CandidateSite | null;
  onSelectSite: (site: CandidateSite) => void;
  layers: LayerVisibilityState;
  flyToLocation?: { lat: number; lng: number; zoom?: number } | null;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  sites,
  selectedSite,
  onSelectSite,
  layers,
  flyToLocation,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const geojsonLayersRef = useRef<Record<string, L.LayerGroup>>({});

  // Fly to target location effect
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !flyToLocation) return;
    map.flyTo([flyToLocation.lat, flyToLocation.lng], flyToLocation.zoom || 15, {
      duration: 1.5,
      easeLinearity: 0.25,
    });
  }, [flyToLocation]);

  // Initialize Leaflet Map Instance
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Center on Nashik extent: 19.9975, 73.7898
      const map = L.map(mapContainerRef.current, {
        center: [19.9975, 73.7898],
        zoom: 13,
        zoomControl: false,
        preferCanvas: true, // Use canvas renderer for high feature counts
      });

      // Add Cartographic Light Tile Layer with explicit OSM attribution
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      // Add Zoom Control to bottom-right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Sync OSM and Demo GeoJSON Layers asynchronously
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    let isSubscribed = true;

    async function syncLayers() {
      // 1. Clear or initialize Layer Groups
      const groupMap = geojsonLayersRef.current;

      const layerKeys = [
        'osmLanduse',
        'osmRoads',
        'osmBuildings',
        'osmPois',
        'osmParking',
        'osmEvCharging',
        'floodways',
        'substationFeeders',
      ];

      layerKeys.forEach((key) => {
        if (!groupMap[key]) {
          groupMap[key] = L.layerGroup().addTo(map!);
        } else {
          groupMap[key].clearLayers();
        }
      });

      // 2. Render Demo Floodways & Feeders if toggled
      if (layers.floodways) {
        const riverLayer = L.geoJSON(NASHIK_GEOJSON_DATASET.riverways as any, {
          style: { color: '#0284c7', weight: 10, opacity: 0.5 },
        });
        const floodZoneLayer = L.geoJSON(NASHIK_GEOJSON_DATASET.floodZones as any, {
          style: { color: '#dc2626', fillColor: '#fef2f2', fillOpacity: 0.35, weight: 2, dashArray: '4 4' },
        });
        groupMap.floodways.addLayer(riverLayer);
        groupMap.floodways.addLayer(floodZoneLayer);
      }

      if (layers.substationFeeders) {
        const feederLayer = L.geoJSON(NASHIK_GEOJSON_DATASET.feeders as any, {
          style: { color: '#f59e0b', weight: 3, dashArray: '6 6', opacity: 0.9 },
        });
        groupMap.substationFeeders.addLayer(feederLayer);
      }

      // 3. Render OSM Land Use Layer
      if (layers.osmLanduse) {
        const data = await fetchOsmLayer('landuse');
        if (data && isSubscribed) {
          const landuseLayer = L.geoJSON(data as any, {
            style: (feature) => {
              const landuseType = feature?.properties?.landuse || '';
              let fillColor = '#e2e8f0';
              if (landuseType === 'industrial') fillColor = '#cbd5e1';
              if (landuseType === 'commercial') fillColor = '#fed7aa';
              if (landuseType === 'residential') fillColor = '#fef08a';
              if (landuseType === 'farmland' || landuseType === 'grass') fillColor = '#bbf7d0';
              return {
                fillColor,
                fillOpacity: 0.4,
                weight: 1,
                color: '#94a3b8',
              };
            },
            onEachFeature: (feature, layer) => {
              const props = feature.properties || {};
              const name = props.name || props.landuse || 'Zoned Parcel';
              const type = props.landuse || props.type || 'General Zone';
              const osmId = props['@id'] || 'Not available';

              layer.bindPopup(`
                <div style="font-family: Inter, sans-serif; padding: 4px;">
                  <div style="font-size: 10px; font-weight: 700; color: #475569; text-transform: uppercase;">OSM Land Use Zone</div>
                  <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-top: 2px;">${name}</div>
                  <div style="font-size: 11px; color: #64748b; margin-top: 4px;">
                    <div>Category: <strong>${type}</strong></div>
                    <div>OSM ID: <code>${osmId}</code></div>
                  </div>
                </div>
              `);
            },
          });
          groupMap.osmLanduse.addLayer(landuseLayer);
        }
      }

      // 4. Render OSM Roads Network Layer
      if (layers.osmRoads) {
        const data = await fetchOsmLayer('roads');
        if (data && isSubscribed) {
          const currentZoom = map!.getZoom();
          const roadLayer = L.geoJSON(data as any, {
            style: (feature) => {
              const highway = feature?.properties?.highway || '';
              let color = '#64748b';
              let weight = 2;
              let opacity = 0.7;

              if (highway === 'motorway' || highway === 'trunk') {
                color = '#dc2626';
                weight = currentZoom > 13 ? 5 : 3;
                opacity = 0.9;
              } else if (highway === 'primary' || highway === 'secondary') {
                color = '#0284c7';
                weight = currentZoom > 13 ? 4 : 2.5;
                opacity = 0.85;
              } else if (highway === 'tertiary') {
                color = '#475569';
                weight = 2;
              } else if (currentZoom < 13) {
                // Hide or fade minor residential roads at macro zoom to preserve performance
                opacity = 0.2;
                weight = 1;
              }

              return { color, weight, opacity };
            },
            onEachFeature: (feature, layer) => {
              const props = feature.properties || {};
              const name = props.name || props.ref || 'Unassigned Highway/Road';
              const highway = props.highway || 'local';
              const osmId = props['@id'] || 'Not available';

              layer.bindPopup(`
                <div style="font-family: Inter, sans-serif; padding: 4px;">
                  <div style="font-size: 10px; font-weight: 700; color: #0284c7; text-transform: uppercase;">OSM Road Corridor</div>
                  <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-top: 2px;">${name}</div>
                  <div style="font-size: 11px; color: #64748b; margin-top: 4px;">
                    <div>Highway Classification: <strong>${highway}</strong></div>
                    <div>Ref / Old Code: ${props.ref || 'None'}</div>
                    <div>OSM ID: <code>${osmId}</code></div>
                  </div>
                </div>
              `);
            },
          });
          groupMap.osmRoads.addLayer(roadLayer);
        }
      }

      // 5. Render OSM Buildings Layer (High-density 49k features)
      if (layers.osmBuildings) {
        const data = await fetchOsmLayer('buildings');
        if (data && isSubscribed) {
          const buildingLayer = L.geoJSON(data as any, {
            style: {
              fillColor: '#64748b',
              fillOpacity: 0.3,
              weight: 1,
              color: '#475569',
            },
            onEachFeature: (feature, layer) => {
              const props = feature.properties || {};
              const name = props.name || props.building || 'Building Footprint';
              const type = props.building || props.type || 'Structure';
              const osmId = props['@id'] || 'Not available';

              layer.bindPopup(`
                <div style="font-family: Inter, sans-serif; padding: 4px;">
                  <div style="font-size: 10px; font-weight: 700; color: #475569; text-transform: uppercase;">OSM Building Footprint</div>
                  <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-top: 2px;">${name}</div>
                  <div style="font-size: 11px; color: #64748b; margin-top: 4px;">
                    <div>Building Type: <strong>${type}</strong></div>
                    <div>OSM ID: <code>${osmId}</code></div>
                  </div>
                </div>
              `);
            },
          });
          groupMap.osmBuildings.addLayer(buildingLayer);
        }
      }

      // 6. Render OSM POIs Layer
      if (layers.osmPois) {
        const data = await fetchOsmLayer('pois');
        if (data && isSubscribed) {
          const poiLayer = L.geoJSON(data as any, {
            pointToLayer: (feature, latlng) => {
              return L.circleMarker(latlng, {
                radius: 4,
                fillColor: '#8b5cf6',
                color: '#ffffff',
                weight: 1.5,
                fillOpacity: 0.9,
              });
            },
            onEachFeature: (feature, layer) => {
              const props = feature.properties || {};
              const name = props.name || 'Amenity / POI Node';
              const category = props.amenity || props.building || 'Commercial Node';
              const osmId = props['@id'] || 'Not available';

              layer.bindPopup(`
                <div style="font-family: Inter, sans-serif; padding: 4px;">
                  <div style="font-size: 10px; font-weight: 700; color: #7c3aed; text-transform: uppercase;">OSM Activity POI</div>
                  <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-top: 2px;">${name}</div>
                  <div style="font-size: 11px; color: #64748b; margin-top: 4px;">
                    <div>Category: <strong>${category}</strong></div>
                    <div>OSM ID: <code>${osmId}</code></div>
                  </div>
                </div>
              `);
            },
          });
          groupMap.osmPois.addLayer(poiLayer);
        }
      }

      // 7. Render OSM Parking Layer
      if (layers.osmParking) {
        const data = await fetchOsmLayer('parking');
        if (data && isSubscribed) {
          const parkingLayer = L.geoJSON(data as any, {
            pointToLayer: (feature, latlng) => {
              return L.circleMarker(latlng, {
                radius: 6,
                fillColor: '#0284c7',
                color: '#ffffff',
                weight: 2,
                fillOpacity: 0.95,
              });
            },
            onEachFeature: (feature, layer) => {
              const props = feature.properties || {};
              const name = props.name || 'Designated Parking Area';
              const parkingType = props.parking || props.amenity || 'Surface Parking';
              const osmId = props['@id'] || 'Not available';

              layer.bindPopup(`
                <div style="font-family: Inter, sans-serif; padding: 4px;">
                  <div style="font-size: 10px; font-weight: 700; color: #0284c7; text-transform: uppercase;">🅿️ OSM Parking Facility</div>
                  <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-top: 2px;">${name}</div>
                  <div style="font-size: 11px; color: #64748b; margin-top: 4px;">
                    <div>Parking Type: <strong>${parkingType}</strong></div>
                    <div>OSM ID: <code>${osmId}</code></div>
                  </div>
                </div>
              `);
            },
          });
          groupMap.osmParking.addLayer(parkingLayer);
        }
      }

      // 8. Render OSM EV Charging Stations Layer
      if (layers.osmEvCharging) {
        const data = await fetchOsmLayer('ev');
        if (data && isSubscribed) {
          const evLayer = L.geoJSON(data as any, {
            pointToLayer: (feature, latlng) => {
              const customEvIcon = L.divIcon({
                className: 'custom-ev-marker',
                html: `
                  <div style="width: 22px; height: 22px; border-radius: 50%; background-color: #059669; border: 2px solid #ffffff; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.2); color: white; font-size: 12px; font-weight: bold;">
                    ⚡
                  </div>
                `,
                iconSize: [22, 22],
                iconAnchor: [11, 11],
              });
              return L.marker(latlng, { icon: customEvIcon });
            },
            onEachFeature: (feature, layer) => {
              const props = feature.properties || {};
              const name = props.name || 'Existing EV Charging Station';
              const operator = props.operator || 'Not available';
              const amenity = props.amenity || 'charging_station';
              const osmId = props['@id'] || 'Not available';

              layer.bindPopup(`
                <div style="font-family: Inter, sans-serif; padding: 4px;">
                  <div style="font-size: 10px; font-weight: 700; color: #059669; text-transform: uppercase;">⚡ Existing EV Infrastructure</div>
                  <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-top: 2px;">${name}</div>
                  <div style="font-size: 11px; color: #64748b; margin-top: 4px;">
                    <div>Operator: <strong>${operator}</strong></div>
                    <div>Amenity Type: <strong>${amenity}</strong></div>
                    <div>OSM ID: <code>${osmId}</code></div>
                  </div>
                </div>
              `);
            },
          });
          groupMap.osmEvCharging.addLayer(evLayer);
        }
      }
    }

    syncLayers();

    return () => {
      isSubscribed = false;
    };
  }, [layers]);

  // Update Candidate Site Leaflet Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    sites.forEach((site) => {
      const lat = site.latitude || site.lat || 19.9975;
      const lng = site.longitude || site.lng || 73.7898;
      const isSelected = selectedSite?.id === site.id;
      const isExcluded = site.isRetained === false || site.status === 'EXCLUDED' || site.status === 'DISQUALIFIED';

      let markerColor = '#059669'; // Emerald (High Suitability)
      if (site.status === 'MODERATE_SUITABILITY' || site.status === 'UNDER_REVIEW') markerColor = '#d97706'; // Amber
      if (site.status === 'LOW_SUITABILITY') markerColor = '#64748b'; // Slate
      if (isExcluded) markerColor = '#ef4444'; // Red

      const customIcon = L.divIcon({
        className: 'custom-site-marker',
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            ${
              isSelected
                ? `<div style="position: absolute; width: 42px; height: 42px; border-radius: 50%; border: 3px solid ${markerColor}; animation: ping 1.5s infinite; opacity: 0.7;"></div>`
                : ''
            }
            <div style="width: ${isSelected ? '32px' : '26px'}; height: ${
          isSelected ? '32px' : '26px'
        }; border-radius: 50%; background-color: ${isExcluded ? '#fef2f2' : '#ffffff'}; border: 2.5px solid ${markerColor}; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.15);">
              <div style="width: 10px; height: 10px; border-radius: 50%; background-color: ${markerColor};"></div>
            </div>
            <div style="position: absolute; top: 32px; font-family: Inter, sans-serif; font-size: 11px; font-weight: 700; color: ${isExcluded ? '#991b1b' : '#0f172a'}; white-space: nowrap; background: ${isExcluded ? 'rgba(254,242,242,0.95)' : 'rgba(255,255,255,0.95)'}; padding: 1px 5px; border-radius: 4px; border: 1px solid ${isExcluded ? '#fca5a5' : '#cbd5e1'}; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
              ${site.code} ${isExcluded ? '❌' : ''}
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

      // Popup Content
      marker.bindPopup(`
        <div style="font-family: Inter, sans-serif; padding: 4px; max-width: 260px;">
          <div style="font-size: 10px; font-weight: 700; color: ${markerColor}; text-transform: uppercase;">
            ${isExcluded ? '❌ EXCLUDED CANDIDATE' : '📍 CANDIDATE SITE'} (${site.code})
          </div>
          <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-top: 2px;">${site.name}</div>
          ${
            isExcluded
              ? `<div style="font-size: 11px; color: #b91c1c; background: #fef2f2; padding: 4px 6px; border-radius: 4px; margin-top: 6px; border: 1px solid #fecaca;">
                  <strong>Exclusion Reason:</strong> ${site.exclusionReason || 'Violates project screening constraints.'}
                </div>`
              : `<div style="font-size: 11px; color: #475569; margin-top: 4px;">
                  Opportunity Score: <strong>${site.opportunityScore}/100</strong>
                </div>`
          }
        </div>
      `);

      marker.on('click', () => {
        onSelectSite(site);
      });

      markersRef.current[site.id] = marker;
    });
  }, [sites, selectedSite, onSelectSite]);

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainerRef} className="w-full h-full bg-slate-100 z-10" />
    </div>
  );
};
