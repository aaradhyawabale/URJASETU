import React, { useState, useEffect } from 'react';
import * as turf from '@turf/turf';
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
  siteName = 'Govardhan Candidate Site',
  onAreaChange,
  onPolygonChange,
}) => {
  // Nodes in SVG coordinate space (1000 x 650 viewport)
  const [nodes, setNodes] = useState<Array<{ x: number; y: number }>>([
    { x: 300, y: 180 },
    { x: 650, y: 180 },
    { x: 620, y: 450 },
    { x: 320, y: 420 },
  ]);

  const [isEditing, setIsEditing] = useState<boolean>(true);
  const [selectedNodeIdx, setSelectedNodeIdx] = useState<number | null>(null);

  // Convert SVG canvas coordinates to real WGS84 GeoJSON polygon coordinates centered around (siteLat, siteLng)
  const getGeoJsonCoordinates = (canvasNodes: typeof nodes): number[][][] => {
    // 100 SVG units approx 0.00045 degrees (~50 meters)
    const ring = canvasNodes.map((n) => {
      const lngOffset = ((n.x - 500) / 100) * 0.00045;
      const latOffset = ((325 - n.y) / 100) * 0.00045;
      return [
        Number((siteLng + lngOffset).toFixed(6)),
        Number((siteLat + latOffset).toFixed(6)),
      ];
    });
    // Close polygon ring
    ring.push(ring[0]);
    return [ring];
  };

  // Recalculate Turf.js geodesic area and segment lengths whenever nodes change
  const computePlotGeometry = (currentNodes: typeof nodes) => {
    const geoJsonRing = getGeoJsonCoordinates(currentNodes);
    const calculatedArea = calculatePolygonAreaSqm(geoJsonRing);

    // Calculate perimeter and edge lengths using Turf.js distance
    const ringPts = geoJsonRing[0];
    let totalPerimeterMeters = 0;
    const segmentLengthsMeters: number[] = [];

    for (let i = 0; i < ringPts.length - 1; i++) {
      const from = turf.point(ringPts[i]);
      const to = turf.point(ringPts[i + 1]);
      const distKm = turf.distance(from, to, { units: 'kilometers' });
      const distM = Math.round(distKm * 1000);
      segmentLengthsMeters.push(distM);
      totalPerimeterMeters += distM;
    }

    onAreaChange(calculatedArea > 0 ? calculatedArea : initialAreaSqm);
    if (onPolygonChange) onPolygonChange(geoJsonRing);

    return { calculatedArea, segmentLengthsMeters, totalPerimeterMeters };
  };

  const { calculatedArea, segmentLengthsMeters, totalPerimeterMeters } = computePlotGeometry(nodes);

  const handleNodeDrag = (index: number, newX: number, newY: number) => {
    const updated = [...nodes];
    updated[index] = {
      x: Math.max(100, Math.min(900, newX)),
      y: Math.max(80, Math.min(570, newY)),
    };
    setNodes(updated);
  };

  const handleAddVertex = () => {
    if (nodes.length >= 8) return;
    // Insert new vertex midpoint between last and first node
    const last = nodes[nodes.length - 1];
    const first = nodes[0];
    const midX = Math.round((last.x + first.x) / 2 + 30);
    const midY = Math.round((last.y + first.y) / 2 + 30);
    const updated = [...nodes, { x: midX, y: midY }];
    setNodes(updated);
  };

  const handleDeleteVertex = (index: number) => {
    if (nodes.length <= 3) return; // Keep at least 3 vertices for a valid polygon
    const updated = nodes.filter((_, idx) => idx !== index);
    setNodes(updated);
    setSelectedNodeIdx(null);
  };

  const handleApplyPreset = (presetType: 'RECTANGLE' | 'L_SHAPE' | 'EXPANDED') => {
    if (presetType === 'RECTANGLE') {
      setNodes([
        { x: 300, y: 200 },
        { x: 650, y: 200 },
        { x: 650, y: 420 },
        { x: 300, y: 420 },
      ]);
    } else if (presetType === 'L_SHAPE') {
      setNodes([
        { x: 280, y: 180 },
        { x: 650, y: 180 },
        { x: 650, y: 320 },
        { x: 480, y: 320 },
        { x: 480, y: 450 },
        { x: 280, y: 450 },
      ]);
    } else if (presetType === 'EXPANDED') {
      setNodes([
        { x: 220, y: 150 },
        { x: 750, y: 150 },
        { x: 720, y: 480 },
        { x: 250, y: 450 },
      ]);
    }
  };

  const polygonPointsString = nodes.map((n) => `${n.x},${n.y}`).join(' ');

  return (
    <div className="w-full h-full relative select-none flex flex-col justify-between">
      {/* Control Strip Overlay Header */}
      <div className="absolute top-4 left-4 right-4 z-20 bg-white/95 backdrop-blur-md px-4 py-3 rounded-xl border border-border-subtle shadow-md flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">polyline</span>
            <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
              2D Geodesic Parcel Drawer
            </span>
          </div>

          <span className="text-xs text-text-muted">|</span>

          <div className="flex items-center gap-1.5 text-xs text-text-secondary bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">
            <span>Turf.js Geodesic Area:</span>
            <span className="font-bold text-primary font-mono text-sm">
              {calculatedArea.toLocaleString()} m²
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-text-secondary bg-surface-subtle border border-border-subtle px-2.5 py-1 rounded-lg">
            <span>Perimeter:</span>
            <span className="font-bold text-text-primary font-mono">{totalPerimeterMeters} m</span>
          </div>
        </div>

        {/* Action Controls & Presets */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 shadow-xs ${
              isEditing ? 'bg-amber-600 text-white hover:bg-amber-700' : 'bg-primary text-white hover:bg-emerald-700'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">{isEditing ? 'lock' : 'edit'}</span>
            <span>{isEditing ? 'Lock Nodes' : 'Edit Nodes'}</span>
          </button>

          <button
            onClick={handleAddVertex}
            disabled={nodes.length >= 8}
            className="text-xs px-2.5 py-1.5 rounded-lg bg-surface-subtle border border-border-subtle hover:bg-slate-100 text-text-secondary font-semibold disabled:opacity-50 transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Add Node ({nodes.length}/8)</span>
          </button>

          {selectedNodeIdx !== null && (
            <button
              onClick={() => handleDeleteVertex(selectedNodeIdx)}
              disabled={nodes.length <= 3}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-red-50 border border-red-200 hover:bg-red-100 text-red-700 font-semibold disabled:opacity-50 transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">delete</span>
              <span>Remove Node #{selectedNodeIdx + 1}</span>
            </button>
          )}

          <div className="h-4 w-px bg-border-subtle mx-1"></div>

          <span className="text-[11px] font-semibold text-text-muted">Presets:</span>
          <button
            onClick={() => handleApplyPreset('RECTANGLE')}
            className="text-[11px] px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-text-primary font-medium"
          >
            Rectangle
          </button>
          <button
            onClick={() => handleApplyPreset('L_SHAPE')}
            className="text-[11px] px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-text-primary font-medium"
          >
            L-Shape
          </button>
          <button
            onClick={() => handleApplyPreset('EXPANDED')}
            className="text-[11px] px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-text-primary font-medium"
          >
            Expanded
          </button>
        </div>
      </div>

      {/* SVG Canvas for Interactive Geodesic Polygon Node Editing */}
      <svg className="w-full h-full" viewBox="0 0 1000 650" fill="none">
        <rect width="1000" height="650" fill="#f8fafc" />

        {/* Spatial Grid Backdrop Lines */}
        <path d="M0 100 H1000 M0 200 H1000 M0 300 H1000 M0 400 H1000 M0 500 H1000 M0 600 H1000" stroke="#e2e8f0" strokeDasharray="4 4" />
        <path d="M100 0 V650 M250 0 V650 M400 0 V650 M550 0 V650 M700 0 V650 M850 0 V650" stroke="#e2e8f0" strokeDasharray="4 4" />

        {/* Site Reference Target Outline */}
        <circle cx="500" cy="325" r="220" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="6 6" />

        {/* Drawn Plot Polygon */}
        <polygon
          points={polygonPointsString}
          fill="#059669"
          fillOpacity="0.25"
          stroke="#059669"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Edge Distance Labels (Geodesic Turf Segment Lengths in meters) */}
        {nodes.map((node, i) => {
          const nextNode = nodes[(i + 1) % nodes.length];
          const midX = Math.round((node.x + nextNode.x) / 2);
          const midY = Math.round((node.y + nextNode.y) / 2);
          const segMeters = segmentLengthsMeters[i] || 50;

          return (
            <g key={`seg_${i}`}>
              <rect
                x={midX - 24}
                y={midY - 10}
                width="48"
                height="18"
                rx="4"
                fill="#ffffff"
                stroke="#059669"
                strokeWidth="1"
              />
              <text
                x={midX}
                y={midY + 3}
                fill="#047857"
                fontSize="10"
                fontWeight="bold"
                fontFamily="monospace"
                textAnchor="middle"
              >
                {segMeters}m
              </text>
            </g>
          );
        })}

        {/* Draggable Polygon Node Handles */}
        {nodes.map((node, idx) => (
          <g
            key={idx}
            className={isEditing ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}
            onClick={() => setSelectedNodeIdx(idx)}
          >
            <circle
              cx={node.x}
              cy={node.y}
              r={selectedNodeIdx === idx ? "12" : "9"}
              fill={selectedNodeIdx === idx ? "#d97706" : "#059669"}
              stroke="#ffffff"
              strokeWidth="2.5"
              className="transition-all shadow-md"
            />
            <text
              x={node.x}
              y={node.y + 4}
              fill="#ffffff"
              fontSize="9"
              fontWeight="bold"
              textAnchor="middle"
            >
              {idx + 1}
            </text>
          </g>
        ))}
      </svg>

      {/* Bottom Data Honesty Banner */}
      <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-border-subtle shadow-md flex items-center justify-between text-xs text-text-secondary">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Target Site: <strong>{siteCode}</strong> ({siteName})</span>
          <span className="text-text-muted">|</span>
          <span>Center Lat/Lng: <strong>{siteLat.toFixed(4)}°N, {siteLng.toFixed(4)}°E</strong></span>
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
