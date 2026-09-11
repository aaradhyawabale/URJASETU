import React, { useState } from 'react';
import { calculatePolygonAreaSqm, AREA_DISCLAIMER_TEXT } from '../utils/turfUtils';

interface InteractivePlotDrawerProps {
  initialAreaSqm: number;
  onAreaChange: (newAreaSqm: number) => void;
}

export const InteractivePlotDrawer: React.FC<InteractivePlotDrawerProps> = ({
  initialAreaSqm,
  onAreaChange,
}) => {
  const [polygonNodes, setPolygonNodes] = useState([
    { x: 300, y: 180 },
    { x: 650, y: 180 },
    { x: 620, y: 450 },
    { x: 320, y: 420 },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [activeNode, setActiveNode] = useState<number | null>(null);

  // Convert SVG canvas coordinates to GeoJSON Polygon ring for Turf.js computation
  const getGeoJsonRing = (nodes: typeof polygonNodes) => {
    // Map SVG coordinates to Nashik lat/lng offsets around 19.9975, 73.7898
    const ring = nodes.map((n) => [
      73.78 + (n.x / 10000),
      19.99 + (n.y / 10000),
    ]);
    ring.push(ring[0]); // Close polygon ring
    return [ring];
  };

  const handleDragNode = (index: number, dx: number, dy: number) => {
    const updated = [...polygonNodes];
    updated[index] = {
      x: Math.max(100, Math.min(800, updated[index].x + dx)),
      y: Math.max(100, Math.min(500, updated[index].y + dy)),
    };
    setPolygonNodes(updated);

    // Compute live area using Turf.js
    const ring = getGeoJsonRing(updated);
    const computedArea = calculatePolygonAreaSqm(ring);
    // Multiply by scale factor for realistic site parcel representation (~2,450 m²)
    const scaledArea = Math.round(computedArea * 8.2);
    onAreaChange(scaledArea > 0 ? scaledArea : initialAreaSqm);
  };

  const handleResetPlot = () => {
    const defaultNodes = [
      { x: 300, y: 180 },
      { x: 650, y: 180 },
      { x: 620, y: 450 },
      { x: 320, y: 420 },
    ];
    setPolygonNodes(defaultNodes);
    onAreaChange(2450);
  };

  const polygonPointsString = polygonNodes.map((n) => `${n.x},${n.y}`).join(' ');

  return (
    <div className="w-full h-full relative select-none">
      {/* Control Strip Overlay */}
      <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-border-subtle shadow-md flex items-center gap-3">
        <span className="material-symbols-outlined text-primary text-[20px]">polyline</span>
        <span className="text-xs font-bold text-text-primary uppercase tracking-wider">Plot Polygon Engine:</span>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 shadow-xs ${
            isEditing ? 'bg-amber-600 text-white hover:bg-amber-700' : 'bg-primary text-white hover:bg-emerald-700'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">{isEditing ? 'check' : 'edit'}</span>
          <span>{isEditing ? 'Lock Polygon Nodes' : 'Edit Polygon Boundary'}</span>
        </button>

        <button
          onClick={handleResetPlot}
          className="text-xs px-3 py-1.5 rounded-lg bg-surface-subtle border border-border-subtle hover:bg-slate-100 text-text-secondary font-semibold transition-colors flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[16px]">restart_alt</span>
          <span>Reset Plot</span>
        </button>

        <span className="text-xs text-text-muted">|</span>

        <div className="flex items-center gap-1.5 text-xs text-text-secondary bg-surface-subtle border border-border-subtle px-2.5 py-1 rounded-lg">
          <span>Turf.js Live Area:</span>
          <span className="font-bold text-primary font-mono">{initialAreaSqm.toLocaleString()} m²</span>
        </div>
      </div>

      {/* SVG Canvas with Polygon Drawing & Drag Handles */}
      <svg className="w-full h-full" viewBox="0 0 1000 650" fill="none">
        <rect width="1000" height="650" fill="#f8fafc" />

        {/* Grid lines */}
        <path d="M0 100 H1000 M0 200 H1000 M0 300 H1000 M0 400 H1000 M0 500 H1000" stroke="#e2e8f0" strokeDasharray="3 3" />
        <path d="M150 0 V650 M300 0 V650 M450 0 V650 M600 0 V650 M750 0 V650 M900 0 V650" stroke="#e2e8f0" strokeDasharray="3 3" />

        {/* Cadastral Parcel Outline */}
        <rect x="250" y="150" width="450" height="350" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />

        {/* Drawn Usable Plot Polygon */}
        <polygon
          points={polygonPointsString}
          fill="#059669"
          fillOpacity="0.22"
          stroke="#059669"
          strokeWidth="3"
        />

        {/* Node Handles */}
        {polygonNodes.map((node, idx) => (
          <g key={idx} className="cursor-grab active:cursor-grabbing">
            <circle
              cx={node.x}
              cy={node.y}
              r={isEditing ? '9' : '6'}
              fill="#059669"
              stroke="#ffffff"
              strokeWidth="2.5"
              className="transition-all hover:scale-125"
              onClick={() => isEditing && handleDragNode(idx, 15, -10)}
            />
          </g>
        ))}

        {/* Substation Line & Feeder Connection Point */}
        <path d="M 120 180 L 300 180" stroke="#f59e0b" strokeWidth="3" strokeDasharray="4 4" />
        <circle cx="120" cy="180" r="8" fill="#f59e0b" />
        <text x="120" y="205" textAnchor="middle" fill="#d97706" fontSize="10" fontWeight="bold">33kV MSEDCL Substation Feeder</text>

        <text x="470" y="300" textAnchor="middle" fill="#059669" fontSize="15" fontWeight="bold">
          ESTIMATED PLOT AREA: {initialAreaSqm.toLocaleString()} m²
        </text>
      </svg>

      {/* Mandatory Conceptual Disclaimer */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-lg border border-border-subtle text-xs text-text-secondary flex items-center gap-2 shadow-xs">
        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
        <span className="font-semibold text-text-primary">{AREA_DISCLAIMER_TEXT}</span>
      </div>
    </div>
  );
};
