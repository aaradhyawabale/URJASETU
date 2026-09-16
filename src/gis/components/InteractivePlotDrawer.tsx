import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as turf from '@turf/turf';
import { fetchOsmLayer } from '../services/osmService';
import { NASHIK_GEOJSON_DATASET } from '../data/geojsonDemo';
import { calculatePolygonAreaSqm } from '../utils/turfUtils';

interface InteractivePlotDrawerProps {
  initialAreaSqm: number;
  siteLat?: number;
  siteLng?: number;
  siteCode?: string;
  siteName?: string;
  onAreaChange: (newAreaSqm: number) => void;
  onPolygonChange?: (ringGeoJson: number[][][]) => void;
}

export const InteractivePlotDrawer: React.FC<InteractivePlotDrawerProps> = ({
  initialAreaSqm,
  siteLat = 19.9975,
  siteLng = 73.7898,
  siteCode = 'NSK-CND-001',
  siteName = 'Nashik Candidate Site',
  onAreaChange,
  onPolygonChange,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const polygonLayerRef = useRef<L.Polygon | null>(null);
  const vertexMarkersRef = useRef<L.Marker[]>([]);
  const edgeLabelsRef = useRef<L.Marker[]>([]);
  const osmGroupRef = useRef<L.LayerGroup | null>(null);

  // WGS84 GeoJSON Ring Points: Array of [lng, lat]
  const [ringPts, setRingPts] = useState<Array<[number, number]>>(() => {
    // Generate default square polygon around (siteLat, siteLng) ~2450 m2
    const dLat = 0.00022; // ~25m
    const dLng = 0.00024; // ~25m
    return [
      [siteLng - dLng, siteLat + dLat],
      [siteLng + dLng, siteLat + dLat],
      [siteLng + dLng, siteLat - dLat],
      [siteLng - dLng, siteLat - dLat],
    ];
  });

  // Synchronize ring points when site center coordinates change (Click-to-Acquire)
  useEffect(() => {
    const dLat = 0.00022;
    const dLng = 0.00024;
    setRingPts([
      [siteLng - dLng, siteLat + dLat],
      [siteLng + dLng, siteLat + dLat],
      [siteLng + dLng, siteLat - dLat],
      [siteLng - dLng, siteLat - dLat],
    ]);
  }, [siteLat, siteLng]);

  const [isEditing, setIsEditing] = useState<boolean>(true);
  const [isClickToAdd, setIsClickToAdd] = useState<boolean>(false);
  const [selectedNodeIdx, setSelectedNodeIdx] = useState<number | null>(null);
  const [layersVisibility, setLayersVisibility] = useState({
    roads: true,
    buildings: true,
    ev: true,
  });

  // Calculate Turf.js geodesic metrics
  const getGeoJsonCoordinates = (pts: Array<[number, number]>): number[][][] => {
    if (pts.length < 3) return [[[]]];
    const closed = [...pts, pts[0]];
    return [closed];
  };

  const geoJsonRing = getGeoJsonCoordinates(ringPts);
  const calculatedAreaSqm = ringPts.length >= 3 ? calculatePolygonAreaSqm(geoJsonRing) : 0;
  const areaHectares = (calculatedAreaSqm / 10000).toFixed(3);
  const areaAcres = (calculatedAreaSqm / 4046.86).toFixed(3);

  // Check self-intersection using Turf.js kinks
  const hasKinks = (() => {
    if (ringPts.length < 4) return false;
    try {
      const poly = turf.polygon(geoJsonRing);
      const kinks = turf.kinks(poly);
      return kinks.features.length > 0;
    } catch {
      return true;
    }
  })();

  const isValidGeometry = ringPts.length >= 3 && calculatedAreaSqm > 0 && !hasKinks;

  // Segment edge lengths (meters)
  const segmentLengthsMeters = (() => {
    if (ringPts.length < 2) return [];
    const closed = [...ringPts, ringPts[0]];
    const lengths: number[] = [];
    for (let i = 0; i < closed.length - 1; i++) {
      const from = turf.point(closed[i]);
      const to = turf.point(closed[i + 1]);
      const distKm = turf.distance(from, to, { units: 'kilometers' });
      lengths.push(Math.round(distKm * 1000));
    }
    return lengths;
  })();

  const totalPerimeterMeters = segmentLengthsMeters.reduce((a, b) => a + b, 0);

  // Notify parent component of valid area changes
  useEffect(() => {
    if (isValidGeometry) {
      onAreaChange(calculatedAreaSqm);
      if (onPolygonChange) onPolygonChange(geoJsonRing);
    }
  }, [calculatedAreaSqm, isValidGeometry]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [siteLat, siteLng],
        zoom: 18,
        zoomControl: false,
        preferCanvas: true,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 20,
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Add Site Location Reference Marker
      const siteIcon = L.divIcon({
        className: 'site-center-pin',
        html: `
          <div style="display: flex; align-items: center; gap: 4px; background: #059669; color: white; padding: 2px 8px; border-radius: 12px; border: 2px solid white; font-weight: bold; font-size: 11px; font-family: Inter, sans-serif; box-shadow: 0 2px 6px rgba(0,0,0,0.2);">
            <span>📍</span>
            <span>${siteCode}</span>
          </div>
        `,
        iconSize: [80, 24],
        iconAnchor: [40, 12],
      });
      L.marker([siteLat, siteLng], { icon: siteIcon, zIndexOffset: 1000 }).addTo(map);

      // Initialize Layer Group for OSM Overlays
      const osmGroup = L.layerGroup().addTo(map);
      osmGroupRef.current = osmGroup;

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [siteLat, siteLng, siteCode]);

  // Map Click Listener for "Add Point" mode
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      if (isClickToAdd && ringPts.length < 12) {
        const newLng = Number(e.latlng.lng.toFixed(6));
        const newLat = Number(e.latlng.lat.toFixed(6));
        setRingPts((prev) => [...prev, [newLng, newLat]]);
      }
    };

    map.on('click', handleMapClick);
    return () => {
      map.off('click', handleMapClick);
    };
  }, [isClickToAdd, ringPts.length]);

  // Sync OSM Layers on Map
  useEffect(() => {
    const osmGroup = osmGroupRef.current;
    if (!osmGroup) return;

    osmGroup.clearLayers();

    if (layersVisibility.roads) {
      fetchOsmLayer('roads').then((data) => {
        if (data && osmGroupRef.current) {
          const roadLayer = L.geoJSON(data as any, {
            style: { color: '#0284c7', weight: 3, opacity: 0.7 },
          });
          osmGroupRef.current.addLayer(roadLayer);
        }
      });
    }

    if (layersVisibility.buildings) {
      fetchOsmLayer('buildings').then((data) => {
        if (data && osmGroupRef.current) {
          const bldgLayer = L.geoJSON(data as any, {
            style: { fillColor: '#64748b', fillOpacity: 0.35, weight: 1, color: '#475569' },
          });
          osmGroupRef.current.addLayer(bldgLayer);
        }
      });
    }

    if (layersVisibility.ev) {
      fetchOsmLayer('ev').then((data) => {
        if (data && osmGroupRef.current) {
          const evLayer = L.geoJSON(data as any, {
            pointToLayer: (_, latlng) =>
              L.circleMarker(latlng, { radius: 5, fillColor: '#059669', color: '#fff', weight: 1.5, fillOpacity: 1 }),
          });
          osmGroupRef.current.addLayer(evLayer);
        }
      });
    }
  }, [layersVisibility]);

  // Redraw Drawn Polygon & Draggable Vertex Markers on Leaflet Map
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // 1. Update Polygon Layer
    if (polygonLayerRef.current) {
      polygonLayerRef.current.remove();
      polygonLayerRef.current = null;
    }

    const leafletLatLngs = ringPts.map(([lng, lat]) => [lat, lng] as [number, number]);

    if (leafletLatLngs.length >= 3) {
      const polygonColor = isValidGeometry ? '#059669' : '#dc2626';
      const poly = L.polygon(leafletLatLngs, {
        color: polygonColor,
        weight: 3.5,
        fillColor: polygonColor,
        fillOpacity: 0.25,
        lineJoin: 'round',
      }).addTo(map);

      polygonLayerRef.current = poly;
    }

    // 2. Update Vertex Markers
    vertexMarkersRef.current.forEach((m) => m.remove());
    vertexMarkersRef.current = [];

    ringPts.forEach(([lng, lat], idx) => {
      const isSelected = selectedNodeIdx === idx;
      const markerColor = isSelected ? '#d97706' : isValidGeometry ? '#059669' : '#dc2626';

      const icon = L.divIcon({
        className: 'vertex-node-marker',
        html: `
          <div style="width: ${isSelected ? '22px' : '18px'}; height: ${isSelected ? '22px' : '18px'}; border-radius: 50%; background-color: ${markerColor}; border: 2.5px solid #ffffff; display: flex; align-items: center; justify-content: center; color: #ffffff; font-weight: 800; font-size: 10px; font-family: monospace; box-shadow: 0 2px 6px rgba(0,0,0,0.3); cursor: ${
          isEditing ? 'grab' : 'default'
        };">
            ${idx + 1}
          </div>
        `,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      const marker = L.marker([lat, lng], {
        icon,
        draggable: isEditing,
        zIndexOffset: 500 + idx,
      }).addTo(map);

      marker.on('click', () => {
        setSelectedNodeIdx(idx);
      });

      marker.on('drag', (e) => {
        const newPos = (e.target as L.Marker).getLatLng();
        setRingPts((prev) => {
          const updated = [...prev];
          updated[idx] = [Number(newPos.lng.toFixed(6)), Number(newPos.lat.toFixed(6))];
          return updated;
        });
      });

      vertexMarkersRef.current.push(marker);
    });

    // 3. Update Segment Edge Distance Labels
    edgeLabelsRef.current.forEach((m) => m.remove());
    edgeLabelsRef.current = [];

    if (ringPts.length >= 2) {
      const closed = [...ringPts, ringPts[0]];
      for (let i = 0; i < closed.length - 1; i++) {
        const p1 = closed[i];
        const p2 = closed[i + 1];
        const midLng = (p1[0] + p2[0]) / 2;
        const midLat = (p1[1] + p2[1]) / 2;
        const distM = segmentLengthsMeters[i] || 0;

        const labelIcon = L.divIcon({
          className: 'edge-length-label',
          html: `
            <div style="background: white; border: 1px solid #059669; color: #047857; font-size: 10px; font-weight: bold; font-family: monospace; padding: 1px 4px; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.15); white-space: nowrap;">
              ${distM}m
            </div>
          `,
          iconSize: [40, 16],
          iconAnchor: [20, 8],
        });

        const labelMarker = L.marker([midLat, midLng], { icon: labelIcon, interactive: false }).addTo(map);
        edgeLabelsRef.current.push(labelMarker);
      }
    }
  }, [ringPts, isEditing, selectedNodeIdx, isValidGeometry]);

  // Preset Handlers
  const handleApplyPreset = (presetType: 'SQUARE' | 'RECTANGLE' | 'L_SHAPE' | 'CORRIDOR') => {
    let newPts: Array<[number, number]> = [];

    if (presetType === 'SQUARE') {
      const d = 0.00022; // ~2450 m2
      newPts = [
        [siteLng - d, siteLat + d],
        [siteLng + d, siteLat + d],
        [siteLng + d, siteLat - d],
        [siteLng - d, siteLat - d],
      ];
    } else if (presetType === 'RECTANGLE') {
      const dLat = 0.00032; // ~5000 m2
      const dLng = 0.00018;
      newPts = [
        [siteLng - dLng, siteLat + dLat],
        [siteLng + dLng, siteLat + dLat],
        [siteLng + dLng, siteLat - dLat],
        [siteLng - dLng, siteLat - dLat],
      ];
    } else if (presetType === 'L_SHAPE') {
      const d = 0.00025; // ~3600 m2
      newPts = [
        [siteLng - d, siteLat + d],
        [siteLng + d, siteLat + d],
        [siteLng + d, siteLat],
        [siteLng, siteLat],
        [siteLng, siteLat - d],
        [siteLng - d, siteLat - d],
      ];
    } else if (presetType === 'CORRIDOR') {
      const dLat = 0.00012; // ~1800 m2
      const dLng = 0.00045;
      newPts = [
        [siteLng - dLng, siteLat + dLat],
        [siteLng + dLng, siteLat + dLat],
        [siteLng + dLng, siteLat - dLat],
        [siteLng - dLng, siteLat - dLat],
      ];
    }

    setRingPts(newPts);
    setSelectedNodeIdx(null);
    setIsClickToAdd(false);
  };

  const handleRemoveSelectedNode = () => {
    if (selectedNodeIdx === null || ringPts.length <= 3) return;
    setRingPts((prev) => prev.filter((_, idx) => idx !== selectedNodeIdx));
    setSelectedNodeIdx(null);
  };

  const handleClearPlot = () => {
    setRingPts([]);
    setSelectedNodeIdx(null);
    setIsClickToAdd(true);
  };

  return (
    <div className="w-full h-full relative select-none flex flex-col justify-between">
      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 bg-white/95 backdrop-blur-md px-4 py-3 rounded-xl border border-border-subtle shadow-md flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">polyline</span>
            <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
              Interactive 2D Geodesic Parcel Drawer
            </span>
          </div>

          <span className="text-xs text-text-muted">|</span>

          {/* Area & Perimeter Badge */}
          <div className={`flex items-center gap-2 text-xs px-3 py-1 rounded-lg border ${
            isValidGeometry ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'
          }`}>
            <span>Turf.js Geodesic Area:</span>
            <span className="font-bold font-mono text-sm">
              {calculatedAreaSqm.toLocaleString()} m²
            </span>
            <span className="text-[11px] opacity-80 font-mono">({areaHectares} ha / {areaAcres} ac)</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-text-secondary bg-surface-subtle border border-border-subtle px-2.5 py-1 rounded-lg font-mono">
            <span>Perimeter:</span>
            <span className="font-bold text-text-primary">{totalPerimeterMeters} m</span>
          </div>
        </div>

        {/* Action Controls & Presets */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsClickToAdd(!isClickToAdd)}
            className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1 shadow-xs ${
              isClickToAdd ? 'bg-emerald-600 text-white animate-pulse' : 'bg-surface-subtle border border-border-subtle text-text-primary hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">add_location_alt</span>
            <span>{isClickToAdd ? 'Click Map to Add Node' : 'Add Node on Map'}</span>
          </button>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1 shadow-xs ${
              isEditing ? 'bg-amber-600 text-white hover:bg-amber-700' : 'bg-primary text-white hover:bg-emerald-700'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">{isEditing ? 'lock' : 'edit'}</span>
            <span>{isEditing ? 'Lock Vertices' : 'Edit Vertices'}</span>
          </button>

          {selectedNodeIdx !== null && (
            <button
              onClick={handleRemoveSelectedNode}
              disabled={ringPts.length <= 3}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-red-50 border border-red-200 hover:bg-red-100 text-red-700 font-semibold disabled:opacity-50 transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">delete</span>
              <span>Remove Node #{selectedNodeIdx + 1}</span>
            </button>
          )}

          <button
            onClick={handleClearPlot}
            className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 font-semibold transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">restart_alt</span>
            <span>Clear / Reset</span>
          </button>

          <div className="h-4 w-px bg-border-subtle mx-1"></div>

          <span className="text-[11px] font-semibold text-text-muted">Presets:</span>
          <button
            onClick={() => handleApplyPreset('SQUARE')}
            className="text-[11px] px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-text-primary font-medium"
          >
            Square
          </button>
          <button
            onClick={() => handleApplyPreset('RECTANGLE')}
            className="text-[11px] px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-text-primary font-medium"
          >
            Large Canopy
          </button>
          <button
            onClick={() => handleApplyPreset('L_SHAPE')}
            className="text-[11px] px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-text-primary font-medium"
          >
            L-Shape
          </button>
          <button
            onClick={() => handleApplyPreset('CORRIDOR')}
            className="text-[11px] px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-text-primary font-medium"
          >
            Corridor
          </button>
        </div>
      </div>

      {/* Interactive Leaflet Map Container */}
      <div ref={mapContainerRef} className="w-full h-full bg-slate-100 z-10" />

      {/* Geometry Validation Warning Overlay */}
      {!isValidGeometry && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 bg-red-600 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-lg border border-red-700 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">warning</span>
          <span>
            Invalid Polygon Geometry: {ringPts.length < 3 ? 'Minimum 3 vertices required.' : hasKinks ? 'Self-intersecting polygon boundary.' : 'Area must be greater than zero.'}
          </span>
        </div>
      )}

      {/* Layer Toggle Quick Strip */}
      <div className="absolute bottom-16 left-4 z-20 bg-white/95 backdrop-blur-md p-2 rounded-xl border border-border-subtle shadow-md flex items-center gap-2 text-xs">
        <span className="text-[10px] font-bold text-text-muted uppercase px-1">OSM Context Layers:</span>
        <button
          onClick={() => setLayersVisibility((p) => ({ ...p, roads: !p.roads }))}
          className={`px-2 py-1 rounded font-semibold text-[11px] ${
            layersVisibility.roads ? 'bg-sky-100 text-sky-800 border border-sky-300' : 'bg-slate-100 text-slate-500'
          }`}
        >
          🛣️ Roads
        </button>
        <button
          onClick={() => setLayersVisibility((p) => ({ ...p, buildings: !p.buildings }))}
          className={`px-2 py-1 rounded font-semibold text-[11px] ${
            layersVisibility.buildings ? 'bg-slate-200 text-slate-800 border border-slate-300' : 'bg-slate-100 text-slate-500'
          }`}
        >
          🏢 Buildings
        </button>
        <button
          onClick={() => setLayersVisibility((p) => ({ ...p, ev: !p.ev }))}
          className={`px-2 py-1 rounded font-semibold text-[11px] ${
            layersVisibility.ev ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-100 text-slate-500'
          }`}
        >
          ⚡ EV Chargers
        </button>
      </div>

      {/* Bottom Data Honesty Banner */}
      <div className="absolute bottom-4 left-4 right-4 z-20 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-border-subtle shadow-md flex items-center justify-between text-xs text-text-secondary">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Target Site: <strong>{siteCode}</strong> ({siteName})</span>
          <span className="text-text-muted">|</span>
          <span>Center Lat/Lng: <strong>{siteLat.toFixed(4)}°N, {siteLng.toFixed(4)}°E</strong></span>
          <span className="text-text-muted">|</span>
          <span>Vertices: <strong>{ringPts.length} Points</strong></span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-text-muted">
          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
            TURF_GEODESIC_AREA_CALCULATION
          </span>
          <span>WGS84 EPSG:4326</span>
        </div>
      </div>
    </div>
  );
};
