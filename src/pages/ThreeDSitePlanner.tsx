import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as turf from '@turf/turf';
import { getSiteById } from '../services/api/sites';
import { getProposals } from '../services/api/proposals';
import { fetchOsmLayer } from '../gis/services/osmService';
import { calculatePlotCapacityMetrics } from '../gis/utils/turfUtils';
import { CandidateSite, Proposal, IPlacedComponent } from '../types/site';
import { ScoreBadge } from '../components/ui/ScoreBadge';

interface OSMBuildingFeature {
  id: string;
  name: string;
  heightMeters: number;
  distanceMeters: number;
  coordinates: number[][]; // [lng, lat] footprint
}

export const ThreeDSitePlanner: React.FC = () => {
  const { siteId } = useParams<{ siteId: string }>();
  const navigate = useNavigate();

  const [site, setSite] = useState<CandidateSite | null>(null);
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [surroundingBuildings, setSurroundingBuildings] = useState<OSMBuildingFeature[]>([]);
  
  // 3D Viewport Controls
  const [rotation, setRotation] = useState<number>(45);
  const [pitch, setPitch] = useState<number>(55);
  const [scale, setScale] = useState<number>(1.2);
  const [solarElevation, setSolarElevation] = useState<number>(45);
  const [showShadows] = useState<boolean>(true);
  const [showBuildings] = useState<boolean>(true);

  useEffect(() => {
    async function loadSiteAndProposal() {
      if (!siteId) return;

      // 1. Fetch Candidate Site
      const siteRes = await getSiteById(siteId);
      setSite(siteRes.site);

      const lat = siteRes.site.latitude || siteRes.site.lat || 19.9975;
      const lng = siteRes.site.longitude || siteRes.site.lng || 73.7898;
      const centerPt = turf.point([lng, lat]);

      // 2. Fetch Latest Proposal for this siteId (to extract 2D drawn plot geometry)
      const propRes = await getProposals();
      const match = propRes.proposals.find((p) => p.siteId === siteId) || propRes.proposals[0];
      setProposal(match);

      // 3. Fetch OSM Buildings & Spatially Filter within 500m of site
      try {
        const bldgData = await fetchOsmLayer('buildings');
        if (bldgData && bldgData.features) {
          const filtered: OSMBuildingFeature[] = [];
          for (const feat of bldgData.features.slice(0, 100)) {
            const geom = feat.geometry as any;
            if (!geom || !geom.coordinates) continue;
            let coords: number[][] = [];
            if (geom.type === 'Polygon' && geom.coordinates[0]) {
              coords = geom.coordinates[0];
            } else if (geom.type === 'MultiPolygon' && geom.coordinates[0]?.[0]) {
              coords = geom.coordinates[0][0];
            }

            if (coords.length > 0) {
              const bldgPt = turf.point(coords[0]);
              const distMeters = Math.round(turf.distance(centerPt, bldgPt, { units: 'kilometers' }) * 1000);
              if (distMeters <= 500) {
                const levels = feat.properties?.['building:levels'] ? parseInt(feat.properties['building:levels'], 10) : 3;
                const heightMeters = Number((levels * 3.5).toFixed(1)); // DERIVED_ESTIMATED_BUILDING_HEIGHT_PROXY
                filtered.push({
                  id: String(feat.id || `bldg-${filtered.length}`),
                  name: feat.properties?.name || feat.properties?.building || 'OSM Building Structure',
                  heightMeters,
                  distanceMeters: distMeters,
                  coordinates: coords,
                });
              }
            }
          }
          setSurroundingBuildings(filtered.slice(0, 12)); // Cap at 12 nearest buildings for smooth canvas render
        }
      } catch (err) {
        console.warn('[ThreeDSitePlanner] Failed to load spatially filtered OSM buildings:', err);
      }
    }

    loadSiteAndProposal();
  }, [siteId]);

  // Derived 3D Plot Area & Geometry
  const plotAreaSqm = proposal?.estimatedAreaSqm || site?.areaSqm || 2450;
  const capacityMetrics = calculatePlotCapacityMetrics(plotAreaSqm);

  // Derived 3D Micro-Shading Screening Proxy Calculations
  const averageBldgHeight = surroundingBuildings.length > 0
    ? Number((surroundingBuildings.reduce((a, b) => a + b.heightMeters, 0) / surroundingBuildings.length).toFixed(1))
    : 10.5;

  const elevRad = (Math.max(5, solarElevation) * Math.PI) / 180;
  const shadowLengthMeters = Number((averageBldgHeight / Math.tan(elevRad)).toFixed(1));
  const shadingLossPercent = Number(Math.min(30, (shadowLengthMeters / 40) * 15).toFixed(1));
  const regionalGhi = 5.02; // NASA POWER annual mean baseline
  const effectiveGhi = Number((regionalGhi * (1 - shadingLossPercent / 100)).toFixed(2));

  // Reset Camera View Handler
  const handleResetCamera = () => {
    setRotation(45);
    setPitch(55);
    setScale(1.2);
    setSolarElevation(45);
  };

  return (
    <div className="relative w-full h-[calc(100vh-64px)] flex overflow-hidden select-none">
      {/* 3D Visual Viewport (75% width) */}
      <div className="flex-1 relative bg-slate-950 h-full flex flex-col justify-between">
        {/* Top 3D Overlay Header */}
        <div className="absolute top-4 left-4 right-4 z-20 bg-slate-900/90 backdrop-blur-md px-4 py-3 rounded-xl border border-slate-700 text-white shadow-xl flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-400 text-[24px]">view_in_ar</span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                3D Connected Site Planner
              </span>
            </div>

            <span className="text-slate-700">|</span>

            {site && (
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-white">{site.code}</span>
                <span className="text-slate-400">({site.name})</span>
                <span className="text-emerald-400 font-mono text-[11px] bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded">
                  {plotAreaSqm.toLocaleString()} m² Plot
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => navigate(`/planning/${siteId}`)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 font-semibold transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">edit_location</span>
              <span>Back to 2D Parcel Drawer</span>
            </button>

            <button
              onClick={handleResetCamera}
              className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 font-semibold transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">restart_alt</span>
              <span>Reset View</span>
            </button>
          </div>
        </div>

        {/* Interactive 3D Perspective Viewport Canvas */}
        <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
          {/* Sky & Perspective Grid Canvas */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
            {/* 3D Perspective Coordinate Container */}
            <div
              className="relative transition-transform duration-200 ease-out flex items-center justify-center"
              style={{
                transform: `rotateX(${pitch}deg) rotateZ(${rotation}deg) scale(${scale})`,
                transformStyle: 'preserve-3d',
              }}
            >
              {/* 3D Ground Plane Grid (1000m x 1000m grid representation) */}
              <div className="w-[600px] h-[600px] rounded-3xl bg-slate-900/80 border-2 border-slate-700/60 shadow-2xl relative flex items-center justify-center overflow-hidden">
                <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 600 600">
                  <defs>
                    <pattern id="grid3d_mesh" width="30" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#94a3b8" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="600" height="600" fill="url(#grid3d_mesh)" />
                </svg>

                {/* Confirmed 2D Plot Polygon Extrusion Base */}
                <div className="w-80 h-52 rounded-2xl bg-emerald-950/60 border-3 border-emerald-400 shadow-[0_0_35px_rgba(16,185,129,0.35)] flex flex-col items-center justify-center relative backdrop-blur-xs p-3">
                  {/* Confirmed 2D Parcel Boundary Badge */}
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-bold font-mono px-3.5 py-0.5 rounded-full border border-emerald-300 shadow-md whitespace-nowrap">
                    STEP 5: 3D CONFIRMED PARCEL ({plotAreaSqm.toLocaleString()} m²)
                  </div>

                  {/* 3D Placed Infrastructure Component Layout Container */}
                  <div className="w-full h-full relative bg-slate-900/60 border border-emerald-500/30 rounded-xl overflow-hidden flex items-center justify-center">
                    {/* Grid Overlay */}
                    <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:12px_12px] opacity-20"></div>

                    {/* Render Individual 3D Placed Infrastructure Component Blocks */}
                    {(proposal?.placedComponents || [
                      { id: 'c1', type: 'SOLAR_CANOPY', name: 'Solar Carport Array A', xMeters: -8, yMeters: 6, widthMeters: 15, lengthMeters: 8, rotationDegrees: 0, specs: {} },
                      { id: 'c2', type: 'EV_CHARGER', name: 'DC Fast Charger Bay 1', xMeters: 8, yMeters: -6, widthMeters: 4, lengthMeters: 2, rotationDegrees: 0, specs: {} },
                      { id: 'c3', type: 'BESS_CONTAINER', name: 'BESS Storage Unit 1', xMeters: 10, yMeters: 7, widthMeters: 6, lengthMeters: 2.5, rotationDegrees: 0, specs: {} },
                      { id: 'c4', type: 'TRANSFORMER', name: 'Interconnect Kiosk', xMeters: -10, yMeters: -7, widthMeters: 3, lengthMeters: 3, rotationDegrees: 0, specs: {} },
                    ]).map((comp: IPlacedComponent) => {
                      let compBg = 'bg-amber-600/40 border-amber-300 text-amber-200';
                      let symbol = '☀️';
                      if (comp.type === 'EV_CHARGER') {
                        compBg = 'bg-sky-600/80 border-sky-300 text-sky-100';
                        symbol = '🔌';
                      } else if (comp.type === 'BESS_CONTAINER') {
                        compBg = 'bg-purple-600/80 border-purple-300 text-purple-100';
                        symbol = '🔋';
                      } else if (comp.type === 'TRANSFORMER') {
                        compBg = 'bg-red-600/80 border-red-300 text-red-100';
                        symbol = '⚡';
                      }

                      return (
                        <div
                          key={comp.id}
                          className={`absolute rounded-lg border flex flex-col items-center justify-center p-1 text-[9px] font-mono shadow-lg transition-all ${compBg}`}
                          style={{
                            width: `${Math.max(32, comp.widthMeters * 3.5)}px`,
                            height: `${Math.max(22, comp.lengthMeters * 3.5)}px`,
                            transform: `translate(${comp.xMeters * 4.5}px, ${comp.yMeters * 3.2}px) rotate(${comp.rotationDegrees || 0}deg)`,
                          }}
                        >
                          <span className="font-bold flex items-center gap-0.5">
                            <span>{symbol}</span>
                            <span className="truncate max-w-[45px] text-[8px]">{comp.name.split(' ')[0]}</span>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3D Spatially Filtered Surrounding OSM Buildings */}
                {showBuildings && surroundingBuildings.map((bldg, idx) => {
                  const angle = (idx * (360 / Math.max(1, surroundingBuildings.length)) * Math.PI) / 180;
                  const radius = 210 + (idx % 3) * 15;
                  const offsetX = Math.round(Math.cos(angle) * radius);
                  const offsetY = Math.round(Math.sin(angle) * radius);

                  return (
                    <div
                      key={bldg.id}
                      className="absolute rounded-lg bg-slate-800/90 border border-slate-600 flex flex-col items-center justify-center p-1 text-[9px] text-slate-300 font-mono shadow-xl transition-all"
                      style={{
                        width: '70px',
                        height: '50px',
                        transform: `translate(${offsetX}px, ${offsetY}px)`,
                        boxShadow: showShadows ? `${shadowLengthMeters * 1.5}px ${shadowLengthMeters * 1.5}px 15px rgba(0,0,0,0.7)` : 'none',
                      }}
                    >
                      <span className="font-bold text-slate-200 truncate max-w-[60px]">{bldg.name}</span>
                      <span className="text-amber-400 font-semibold">{bldg.heightMeters}m</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 3D Viewport Legend Strip */}
          <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-700 text-xs text-slate-300 flex items-center gap-4 shadow-lg">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Target Parcel: <strong>{site?.code || 'NSK-CND-001'}</strong></span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
              <span>Spatially Filtered OSM Buildings: <strong>{surroundingBuildings.length} Features (&lt;500m)</strong></span>
            </div>
            <span className="text-slate-700">|</span>
            <span>Rotation: <strong>{rotation}°</strong></span>
            <span className="text-slate-700">|</span>
            <span>Pitch: <strong>{pitch}°</strong></span>
          </div>
        </div>
      </div>

      {/* Right Control & Capacity Side Panel (25% width) */}
      <div className="w-[380px] bg-white border-l border-border-subtle h-full flex flex-col justify-between overflow-y-auto shadow-md">
        {site ? (
          <div className="p-6 flex flex-col gap-5">
            <div className="border-b border-border-subtle pb-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">3D Placement & Capacity Workspace</span>
                <h2 className="text-xl font-bold text-text-primary mt-0.5">{site.code}</h2>
                <p className="text-xs text-text-muted mt-0.5">{site.name}</p>
              </div>
              <ScoreBadge score={site.opportunityScore} size="md" />
            </div>

            {/* Viewport & Camera Controls */}
            <div className="flex flex-col gap-3">
              <label className="text-xs font-bold text-text-primary uppercase tracking-wider">
                Camera & 3D View Controls
              </label>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs font-semibold text-text-primary">
                  <span>Model Rotation (Heading)</span>
                  <span className="font-mono text-primary">{rotation}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={rotation}
                  onChange={(e) => setRotation(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs font-semibold text-text-primary">
                  <span>Camera Pitch Angle</span>
                  <span className="font-mono text-primary">{pitch}°</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="85"
                  value={pitch}
                  onChange={(e) => setPitch(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs font-semibold text-text-primary">
                  <span>Zoom Scale</span>
                  <span className="font-mono text-primary">{scale.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.2"
                  step="0.1"
                  value={scale}
                  onChange={(e) => setScale(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
            </div>

            {/* Solar Elevation Slider & Micro-Shading Proxy */}
            <div className="flex flex-col gap-2 pt-3 border-t border-border-subtle">
              <div className="flex justify-between text-xs font-semibold text-text-primary">
                <span>Solar Elevation Angle</span>
                <span className="font-mono text-amber-600">{solarElevation}°</span>
              </div>
              <input
                type="range"
                min="10"
                max="85"
                value={solarElevation}
                onChange={(e) => setSolarElevation(Number(e.target.value))}
                className="w-full accent-amber-500"
              />

              <div className="mt-2 p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs flex flex-col gap-1.5">
                <div className="flex items-center justify-between font-bold text-amber-900">
                  <span>Micro-Shading Screening</span>
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-mono">
                    CONCEPTUAL_PROXY
                  </span>
                </div>
                <div className="flex justify-between text-amber-900">
                  <span>Avg OSM Building Height:</span>
                  <span className="font-bold">{averageBldgHeight} meters</span>
                </div>
                <div className="flex justify-between text-amber-900">
                  <span>Projected Building Shadow:</span>
                  <span className="font-bold">{shadowLengthMeters} meters</span>
                </div>
                <div className="flex justify-between text-amber-900">
                  <span>Estimated Shading Loss:</span>
                  <span className="font-bold">{shadingLossPercent}%</span>
                </div>
                <div className="flex justify-between text-amber-900">
                  <span>Effective GHI Irradiance:</span>
                  <span className="font-bold">{effectiveGhi} kWh/m²/day</span>
                </div>
              </div>
            </div>

            {/* Capacity Metrics Summary from Confirmed 2D Plot */}
            <div className="p-4 rounded-xl bg-surface-subtle border border-border-subtle flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                  Confirmed Plot Capacity Summary
                </span>
                <span className="text-xs font-mono font-bold text-primary">{plotAreaSqm.toLocaleString()} m²</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-2.5 rounded-lg border border-border-subtle flex flex-col">
                  <span className="text-[9px] text-text-muted uppercase font-semibold">Solar PV Capacity</span>
                  <span className="font-bold text-emerald-700">{capacityMetrics.solarCapacityKwp} kWp</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-border-subtle flex flex-col">
                  <span className="text-[9px] text-text-muted uppercase font-semibold">Annual Generation</span>
                  <span className="font-bold text-emerald-700">{capacityMetrics.annualGenerationMwh} MWh/yr</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-border-subtle flex flex-col">
                  <span className="text-[9px] text-text-muted uppercase font-semibold">EV Fast Ports</span>
                  <span className="font-bold text-sky-700">{capacityMetrics.evChargerPorts} Ports</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-border-subtle flex flex-col">
                  <span className="text-[9px] text-text-muted uppercase font-semibold">BESS Buffer</span>
                  <span className="font-bold text-purple-700">{capacityMetrics.bessCapacityKwh} kWh</span>
                </div>
              </div>

              <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 flex justify-between items-center text-xs">
                <span className="text-[10px] font-bold text-emerald-900 uppercase">Estimated Civil Capex:</span>
                <span className="font-bold font-mono text-emerald-800">
                  ₹{(capacityMetrics.estimatedCapexInr / 100000).toFixed(2)} Lakhs
                </span>
              </div>
            </div>

            {/* Data Provenance & Disclaimer Note */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col gap-1.5 text-slate-700">
              <span className="font-bold text-slate-900 uppercase text-[10px]">Data Honesty & Provenance</span>
              <p className="leading-relaxed text-[11px]">
                High-resolution LiDAR / 3D building mesh is unavailable for Nashik. Building heights are <strong>DERIVED_ESTIMATED_BUILDING_HEIGHT_PROXY</strong> (height = levels × 3.5m). Capacity numbers are <strong>PLANNING_HEURISTIC</strong>.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-6 text-xs text-text-muted">Loading 3D workspace...</div>
        )}

        {/* CTA Footer */}
        {site && (
          <div className="p-4 bg-surface-subtle border-t border-border-subtle flex flex-col gap-2">
            <button
              onClick={() => navigate(`/proposals/${proposal?.id || 'prop-nashik-01'}/review`)}
              className="w-full py-2.5 px-4 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">psychology</span>
              <span>Proceed to AI Proposal Review</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
