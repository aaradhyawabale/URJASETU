import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CandidateSite } from '../../types/site';
import { NASHIK_GEOJSON_DATASET } from '../data/geojsonDemo';

interface LeafletMapProps {
  sites: CandidateSite[];
  selectedSite: CandidateSite | null;
  onSelectSite: (site: CandidateSite) => void;
  layers: {
    solarIrradiance: boolean;
    evDemandProxy: boolean;
    substationFeeders: boolean;
    floodways: boolean;
  };
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  sites,
  selectedSite,
  onSelectSite,
  layers,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const geojsonLayersRef = useRef<L.LayerGroup | null>(null);

  // Initialize Leaflet Map Instance
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Center on Nashik: 19.9975, 73.7898
      const map = L.map(mapContainerRef.current, {
        center: [19.9975, 73.7898],
        zoom: 13,
        zoomControl: false,
      });

      // Add Cartographic Light Tile Layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      // Add Zoom Control to bottom-right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      geojsonLayersRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Dynamic GeoJSON Overlays
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = geojsonLayersRef.current;
    if (!map || !group) return;

    group.clearLayers();

    // 1. Godavari Riverway Ribbon
    if (layers.floodways) {
      const riverLayer = L.geoJSON(NASHIK_GEOJSON_DATASET.riverways as any, {
        style: {
          color: '#0284c7',
          weight: 12,
          opacity: 0.6,
        },
      });
      group.addLayer(riverLayer);

      // Flood Risk Polygon
      const floodZoneLayer = L.geoJSON(NASHIK_GEOJSON_DATASET.floodZones as any, {
        style: {
          color: '#dc2626',
          fillColor: '#fef2f2',
          fillOpacity: 0.4,
          weight: 2,
          dashArray: '4 4',
        },
      });
      group.addLayer(floodZoneLayer);
    }

    // 2. Arterial Road Corridors
    const roadLayer = L.geoJSON(NASHIK_GEOJSON_DATASET.roads as any, {
      style: {
        color: '#64748b',
        weight: 4,
        opacity: 0.8,
      },
    });
    group.addLayer(roadLayer);

    // 3. 33kV Substation Grid Feeders
    if (layers.substationFeeders) {
      const feederLayer = L.geoJSON(NASHIK_GEOJSON_DATASET.feeders as any, {
        style: {
          color: '#f59e0b',
          weight: 3,
          dashArray: '6 6',
          opacity: 0.9,
        },
      });
      group.addLayer(feederLayer);
    }
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

      let markerColor = '#059669'; // Emerald
      if (site.status === 'UNDER_REVIEW') markerColor = '#d97706'; // Amber
      if (site.status === 'SCREENING' || site.status === 'DISQUALIFIED') markerColor = '#dc2626'; // Red

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
        }; border-radius: 50%; background-color: #ffffff; border: 2.5px solid ${markerColor}; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.15);">
              <div style="width: 10px; height: 10px; border-radius: 50%; background-color: ${markerColor};"></div>
            </div>
            <div style="position: absolute; top: 32px; font-family: Inter, sans-serif; font-size: 11px; font-weight: 700; color: #0f172a; white-space: nowrap; background: rgba(255,255,255,0.9); padding: 1px 5px; border-radius: 4px; border: 1px solid #cbd5e1; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
              ${site.code}
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

      // Popup Content
      marker.bindPopup(`
        <div style="font-family: Inter, sans-serif; padding: 4px;">
          <div style="font-size: 10px; font-weight: 700; color: #059669; text-transform: uppercase;">${site.code}</div>
          <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-top: 2px;">${site.name}</div>
          <div style="font-size: 11px; color: #475569; margin-top: 2px;">Opportunity Score: <strong>${site.opportunityScore}/100</strong></div>
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
