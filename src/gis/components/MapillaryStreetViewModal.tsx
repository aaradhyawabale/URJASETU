import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { IPlacedComponent } from '../../types/site';

interface MapillaryStreetViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  lat?: number;
  lng?: number;
  title?: string;
  placedComponents?: IPlacedComponent[];
  plotGeometry?: number[][][] | null;
}

export const MapillaryStreetViewModal: React.FC<MapillaryStreetViewModalProps> = ({
  isOpen,
  onClose,
  lat = 19.9975,
  lng = 73.7898,
  title = 'Nashik Synchronous Street View & Aerial Inspection',
  placedComponents = [],
  plotGeometry,
}) => {
  const [activeLayer, setActiveLayer] = useState<'SATELLITE' | 'STREET_VECTOR' | 'HYBRID'>('SATELLITE');
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // External photo panorama links
  const mapillaryDirectUrl = `https://www.mapillary.com/app/?lat=${lat}&lng=${lng}&z=17&focus=map`;
  const kartaviewDirectUrl = `https://kartaview.org/map/@${lat},${lng},17z`;

  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    // Destroy existing map instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: [lat, lng],
      zoom: 19,
      zoomControl: true,
      maxZoom: 21,
    });

    // Tile URLs
    let tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    let attribution = '&copy; Esri, Maxar, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community';

    if (activeLayer === 'STREET_VECTOR') {
      tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
      attribution = '&copy; OpenStreetMap contributors &copy; CARTO';
    } else if (activeLayer === 'HYBRID') {
      tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      attribution = '&copy; OpenStreetMap contributors';
    }

    const tileLayer = L.tileLayer(tileUrl, { attribution, maxZoom: 21 }).addTo(map);
    tileLayerRef.current = tileLayer;

    // Add Target Site Pin Marker
    const sitePin = L.divIcon({
      className: 'site-target-pin',
      html: `
        <div style="background: #059669; color: white; padding: 4px 10px; border-radius: 12px; border: 2px solid white; font-weight: bold; font-size: 11px; font-family: Inter, sans-serif; box-shadow: 0 4px 12px rgba(0,0,0,0.4); display: flex; align-items: center; gap: 4px; whitespace-nowrap;">
          <span>🏥</span>
          <span>Target Site (${lat.toFixed(4)}°, ${lng.toFixed(4)}°)</span>
        </div>
      `,
      iconSize: [160, 28],
      iconAnchor: [80, 14],
    });
    L.marker([lat, lng], { icon: sitePin, zIndexOffset: 1000 }).addTo(map);

    // Render Plot Boundary Polygon if available
    if (plotGeometry && plotGeometry[0] && plotGeometry[0].length >= 3) {
      const polygonCoords = plotGeometry[0].map(([gLng, gLat]) => [gLat, gLng] as [number, number]);
      L.polygon(polygonCoords, {
        color: '#10b981',
        weight: 3,
        fillColor: '#10b981',
        fillOpacity: 0.35,
        dashArray: '5, 5',
      }).addTo(map);
    } else {
      // Fallback 50m x 40m plot box centered at site
      const dLat = 0.00022;
      const dLng = 0.00024;
      const defaultBox: [number, number][] = [
        [lat + dLat, lng - dLng],
        [lat + dLat, lng + dLng],
        [lat - dLat, lng + dLng],
        [lat - dLat, lng - dLng],
      ];
      L.polygon(defaultBox, {
        color: '#10b981',
        weight: 3,
        fillColor: '#10b981',
        fillOpacity: 0.35,
      }).addTo(map);
    }

    // Render Placed Infrastructure Assets (Hospital, Solar, EV Chargers)
    const metersPerDegreeLat = 111139;
    const metersPerDegreeLng = 111139 * Math.cos((lat * Math.PI) / 180);

    placedComponents.forEach((comp) => {
      const compLat = lat + comp.yMeters / metersPerDegreeLat;
      const compLng = lng + comp.xMeters / metersPerDegreeLng;

      let iconSymbol = '⚡';
      let iconBg = '#059669';
      if (comp.type === 'HOSPITAL_BUILDING' || comp.type === 'HOSPITAL') {
        iconSymbol = '🏥';
        iconBg = '#059669';
      } else if (comp.type === 'SOLAR_CANOPY') {
        iconSymbol = '☀️';
        iconBg = '#d97706';
      } else if (comp.type === 'EV_CHARGER') {
        iconSymbol = '🔌';
        iconBg = '#0284c7';
      } else if (comp.type === 'BESS_CONTAINER') {
        iconSymbol = '🔋';
        iconBg = '#7c3aed';
      } else if (comp.type === 'TRANSFORMER') {
        iconSymbol = '⚡';
        iconBg = '#dc2626';
      }

      const compIcon = L.divIcon({
        className: 'infra-asset-pin',
        html: `
          <div style="background: ${iconBg}; color: white; border: 2px solid white; border-radius: 8px; padding: 3px 8px; font-family: Inter, sans-serif; font-size: 11px; font-weight: bold; box-shadow: 0 3px 8px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 4px; white-space: nowrap;">
            <span>${iconSymbol}</span>
            <span>${comp.name}</span>
          </div>
        `,
        iconSize: [140, 26],
        iconAnchor: [70, 13],
      });

      L.marker([compLat, compLng], { icon: compIcon, zIndexOffset: 900 }).addTo(map);
    });

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen, lat, lng, activeLayer, placedComponents, plotGeometry]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-5xl h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 bg-slate-800/95 border-b border-slate-700 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏥</span>
            <div>
              <h3 className="text-sm font-bold text-white">{title}</h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Target Coordinates: {lat.toFixed(5)}°N, {lng.toFixed(5)}°E • Synchronous GIS Layer
              </p>
            </div>
          </div>

          {/* Layer Mode Selectors */}
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-700 text-xs">
            <button
              onClick={() => setActiveLayer('SATELLITE')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                activeLayer === 'SATELLITE'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🛰️ High-Res Esri Satellite (0.3m)
            </button>
            <button
              onClick={() => setActiveLayer('STREET_VECTOR')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                activeLayer === 'STREET_VECTOR'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🗺️ Carto Street Vector
            </button>
            <button
              onClick={() => setActiveLayer('HYBRID')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                activeLayer === 'HYBRID'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🛣️ OSM Road Network
            </button>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={mapillaryDirectUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-colors"
            >
              <span>📸 Open Mapillary Panorama ↗</span>
            </a>
            <a
              href={kartaviewDirectUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-colors"
            >
              <span>🛣️ Open KartaView Sequence ↗</span>
            </a>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Synchronous High-Res GIS Viewport */}
        <div className="flex-1 bg-slate-950 relative overflow-hidden">
          <div ref={mapContainerRef} className="w-full h-full" />

          {/* Floating Infrastructure Legend Badge */}
          <div className="absolute top-4 left-4 z-20 bg-slate-900/90 border border-slate-700 px-3.5 py-2 rounded-xl text-xs text-slate-200 backdrop-blur-md shadow-xl flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Proposed Parcel Boundary</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1.5">
              <span>Placed Infrastructure: <strong>{placedComponents.length} Assets</strong></span>
            </div>
          </div>

          {/* Footer Provenance Note */}
          <div className="absolute bottom-4 left-4 right-4 z-20 bg-slate-900/90 border border-slate-700 px-4 py-2 rounded-xl text-xs text-slate-300 font-mono backdrop-blur-md shadow-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">SYNCHRONOUS_GIS_VIEWER:</span>
              <span>Showing High-Resolution Street Aerial Footage centered on Nashik coordinates.</span>
            </div>
            <span className="text-[10px] bg-slate-800 border border-slate-700 px-2 py-0.5 rounded font-mono text-emerald-400">
              0.3m GROUND_RESOLUTION
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
