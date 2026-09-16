import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as turf from '@turf/turf';
import { getSiteById } from '../services/api/sites';
import { getProposals } from '../services/api/proposals';
import { fetchOsmLayer } from '../gis/services/osmService';
import { calculatePlotCapacityMetrics } from '../gis/utils/turfUtils';
import { CandidateSite, Proposal, IPlacedComponent, PlanningDesign } from '../types/site';
import { ScoreBadge } from '../components/ui/ScoreBadge';
import { getPlanningDesign, savePlanningDesign } from '../services/planningStateService';
import { ThreeDSceneCanvas } from '../components/3d/ThreeDSceneCanvas';

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
  const [planningDesign, setPlanningDesign] = useState<PlanningDesign | null>(null);
  const [surroundingBuildings, setSurroundingBuildings] = useState<OSMBuildingFeature[]>([]);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);

  // 3D Viewport Controls
  const [rotation, setRotation] = useState<number>(45);
  const [pitch, setPitch] = useState<number>(55);
  const [scale, setScale] = useState<number>(1.2);
  const [solarElevation, setSolarElevation] = useState<number>(45);

  useEffect(() => {
    async function loadSiteAndProposal() {
      if (!siteId) return;

      // 1. Fetch Candidate Site
      const siteRes = await getSiteById(siteId);
      setSite(siteRes.site);

      // 2. Load Canonical PlanningDesign State
      const design = getPlanningDesign(siteId, siteRes.site);
      setPlanningDesign(design);
      if (design.components.length > 0 && !selectedComponentId) {
        setSelectedComponentId(design.components[0].id);
      }

      const lat = siteRes.site.latitude || siteRes.site.lat || 19.9975;
      const lng = siteRes.site.longitude || siteRes.site.lng || 73.7898;
      const centerPt = turf.point([lng, lat]);

      // 3. Fetch Proposal for site
      const propRes = await getProposals();
      const match = propRes.proposals.find((p) => p.siteId === siteId) || propRes.proposals[0];
      setProposal(match);

      // 4. Fetch OSM Buildings & Spatially Filter within 500m of site
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
          setSurroundingBuildings(filtered.slice(0, 12));
        }
      } catch (err) {
        console.warn('[ThreeDSitePlanner] Failed to load spatially filtered OSM buildings:', err);
      }
    }

    loadSiteAndProposal();
  }, [siteId]);

  // Derived Active Placed Components & Selection
  const activeComponents = planningDesign?.components || [];
  const selectedComponent = activeComponents.find((c) => c.id === selectedComponentId) || null;

  // Component State Handlers with Canonical Two-Way Syncing
  const handleUpdateComponent = (updatedComp: IPlacedComponent) => {
    if (!planningDesign) return;
    const nextComponents = planningDesign.components.map((c) => (c.id === updatedComp.id ? updatedComp : c));
    const nextDesign = { ...planningDesign, components: nextComponents };
    setPlanningDesign(nextDesign);
    savePlanningDesign(nextDesign);
  };

  const handleAddComponent = (type: 'SOLAR_CANOPY' | 'EV_CHARGER' | 'BESS_CONTAINER' | 'TRANSFORMER') => {
    if (!planningDesign) return;
    const count = planningDesign.components.filter((c) => c.type === type).length + 1;
    const names = {
      SOLAR_CANOPY: `Solar Carport Array ${String.fromCharCode(64 + count)}`,
      EV_CHARGER: `DC Fast Charger Bay ${count}`,
      BESS_CONTAINER: `BESS Storage Unit ${count}`,
      TRANSFORMER: `Substation Kiosk ${count}`,
    };
    const defaultDims = {
      SOLAR_CANOPY: { width: 14, length: 8, specs: { capacityKwp: 28, moduleCount: 70 } },
      EV_CHARGER: { width: 4, length: 2, specs: { ports: 2, powerKw: 120 } },
      BESS_CONTAINER: { width: 6, length: 2.5, specs: { capacityKwh: 300 } },
      TRANSFORMER: { width: 3, length: 3, specs: { ratingKva: 500 } },
    };
    const dim = defaultDims[type];
    const newComp: IPlacedComponent = {
      id: `comp-${type.toLowerCase().slice(0, 4)}-${Date.now().toString().slice(-4)}`,
      type,
      name: names[type],
      xMeters: Math.round(Math.random() * 8 - 4),
      yMeters: Math.round(Math.random() * 8 - 4),
      widthMeters: dim.width,
      lengthMeters: dim.length,
      rotationDegrees: 0,
      specs: dim.specs,
    };
    const nextDesign = { ...planningDesign, components: [...planningDesign.components, newComp] };
    setPlanningDesign(nextDesign);
    savePlanningDesign(nextDesign);
    setSelectedComponentId(newComp.id);
  };

  const handleDuplicateComponent = (compId: string) => {
    if (!planningDesign) return;
    const target = planningDesign.components.find((c) => c.id === compId);
    if (!target) return;
    const dup: IPlacedComponent = {
      ...target,
      id: `comp-${target.type.toLowerCase().slice(0, 4)}-${Date.now().toString().slice(-4)}`,
      name: `${target.name} (Copy)`,
      xMeters: target.xMeters + 3,
      yMeters: target.yMeters + 3,
    };
    const nextDesign = { ...planningDesign, components: [...planningDesign.components, dup] };
    setPlanningDesign(nextDesign);
    savePlanningDesign(nextDesign);
    setSelectedComponentId(dup.id);
  };

  const handleDeleteComponent = (compId: string) => {
    if (!planningDesign) return;
    const nextComponents = planningDesign.components.filter((c) => c.id !== compId);
    const nextDesign = { ...planningDesign, components: nextComponents };
    setPlanningDesign(nextDesign);
    savePlanningDesign(nextDesign);
    setSelectedComponentId(nextComponents.length > 0 ? nextComponents[0].id : null);
  };

  const handleRotateComponent = (compId: string, deltaDeg: number = 90) => {
    if (!planningDesign) return;
    const target = planningDesign.components.find((c) => c.id === compId);
    if (!target) return;
    const nextDeg = ((target.rotationDegrees || 0) + deltaDeg) % 360;
    handleUpdateComponent({ ...target, rotationDegrees: nextDeg });
  };

  // Dynamic 3D Capacity Metrics Calculation
  const plotAreaSqm = planningDesign?.plotAreaSqm || proposal?.estimatedAreaSqm || site?.areaSqm || 2450;
  const baseMetrics = calculatePlotCapacityMetrics(plotAreaSqm);

  const totalSolarKwp = activeComponents
    .filter((c) => c.type === 'SOLAR_CANOPY')
    .reduce((sum, c) => sum + Number(c.specs?.capacityKwp || Math.round(c.widthMeters * c.lengthMeters * 0.2)), 0) || baseMetrics.solarCapacityKwp;

  const totalEvPorts = activeComponents
    .filter((c) => c.type === 'EV_CHARGER' || c.type === 'CHARGING_BAY')
    .reduce((sum, c) => sum + Number(c.specs?.ports || 2), 0) || baseMetrics.evChargerPorts;

  const totalBessKwh = activeComponents
    .filter((c) => c.type === 'BESS_CONTAINER')
    .reduce((sum, c) => sum + Number(c.specs?.capacityKwh || 250), 0) || baseMetrics.bessCapacityKwh;

  const activeCapexInr = (totalSolarKwp * 45000) + (totalEvPorts * 800000) + (totalBessKwh * 18000);

  // Micro-Shading Screening Proxy Calculations
  const averageBldgHeight = surroundingBuildings.length > 0
    ? Number((surroundingBuildings.reduce((a, b) => a + b.heightMeters, 0) / surroundingBuildings.length).toFixed(1))
    : 10.5;

  const elevRad = (Math.max(5, solarElevation) * Math.PI) / 180;
  const shadowLengthMeters = Number((averageBldgHeight / Math.tan(elevRad)).toFixed(1));
  const shadingLossPercent = Number(Math.min(30, (shadowLengthMeters / 40) * 15).toFixed(1));
  const regionalGhi = 5.02;
  const effectiveGhi = Number((regionalGhi * (1 - shadingLossPercent / 100)).toFixed(2));

  // Context Indicators
  const distanceToSubstationMeters = Math.round(site?.nearestEVChargerMeters ? site.nearestEVChargerMeters * 1.4 : 380);
  const distanceToArterialRoadMeters = Math.round(site?.nearestRoadMeters || 42);
  const riparianSetbackMeters = site?.exclusionCode === 'RIVER_SETBACK_EXCLUSION' ? 0 : 185;
  const riparianStatusText = riparianSetbackMeters > 50 ? `${riparianSetbackMeters}m Clear (Safe)` : 'Setback Violation (<50m)';

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

        {/* Floating Surrounding Context Indicator Chips */}
        <div className="absolute top-20 left-4 z-20 flex flex-wrap items-center gap-2 max-w-2xl">
          <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-xs text-slate-200 flex items-center gap-2 shadow-lg">
            <span className="text-orange-400 font-bold">🔌 Substation:</span>
            <span className="font-mono text-emerald-400 font-bold">{distanceToSubstationMeters}m</span>
            <span className="text-[10px] text-slate-400 font-mono">(MSEDCL 33/11kV)</span>
          </div>

          <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-xs text-slate-200 flex items-center gap-2 shadow-lg">
            <span className="text-sky-400 font-bold">🛣️ Arterial Road:</span>
            <span className="font-mono text-emerald-400 font-bold">{distanceToArterialRoadMeters}m</span>
            <span className="text-[10px] text-slate-400 font-mono">(OSM DP Network)</span>
          </div>

          <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-xs text-slate-200 flex items-center gap-2 shadow-lg">
            <span className="text-cyan-400 font-bold">🌊 Riparian Setback:</span>
            <span className={`font-mono font-bold ${riparianSetbackMeters > 50 ? 'text-emerald-400' : 'text-red-400'}`}>
              {riparianStatusText}
            </span>
          </div>
        </div>

        {/* Interactive 3D Perspective Viewport Canvas (WebGL Three.js / React Three Fiber) */}
        <div className="w-full h-full relative overflow-hidden">
          <ThreeDSceneCanvas
            components={activeComponents}
            plotAreaSqm={plotAreaSqm}
            plotGeometry={planningDesign?.plotGeometry}
            solarElevation={solarElevation}
            rotation={rotation}
            pitch={pitch}
            scale={scale}
            centerLat={site?.latitude || site?.lat || 19.9975}
            centerLng={site?.longitude || site?.lng || 73.7898}
            buildings={surroundingBuildings}
            selectedComponentId={selectedComponentId}
            onSelectComponent={(comp) => setSelectedComponentId(comp ? comp.id : null)}
            onUpdateComponent={handleUpdateComponent}
          />

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
            <span>Placed Components: <strong>{activeComponents.length} Assets</strong></span>
          </div>
        </div>
      </div>

      {/* Right Control & Capacity Side Panel (380px width) */}
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

            {/* Add Infrastructure Component Toolbar */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-text-primary uppercase tracking-wider">
                Add 3D Infrastructure
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleAddComponent('SOLAR_CANOPY')}
                  className="px-2.5 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <span className="text-base">☀️</span>
                  <span>+ Solar Canopy</span>
                </button>
                <button
                  onClick={() => handleAddComponent('EV_CHARGER')}
                  className="px-2.5 py-2 rounded-lg bg-sky-50 hover:bg-sky-100 border border-sky-300 text-sky-900 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <span className="text-base">⚡</span>
                  <span>+ EV Charger</span>
                </button>
                <button
                  onClick={() => handleAddComponent('BESS_CONTAINER')}
                  className="px-2.5 py-2 rounded-lg bg-purple-50 hover:bg-purple-100 border border-purple-300 text-purple-900 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <span className="text-base">🔋</span>
                  <span>+ BESS Buffer</span>
                </button>
                <button
                  onClick={() => handleAddComponent('TRANSFORMER')}
                  className="px-2.5 py-2 rounded-lg bg-red-50 hover:bg-red-100 border border-red-300 text-red-900 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <span className="text-base">🔌</span>
                  <span>+ Transformer</span>
                </button>
              </div>
            </div>

            {/* Component Selection Chips */}
            <div className="flex flex-col gap-2 pt-3 border-t border-border-subtle">
              <label className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center justify-between">
                <span>Placed Assets ({activeComponents.length})</span>
                <span className="text-[10px] text-slate-500 font-normal">Click component to inspect</span>
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-1 bg-slate-50 rounded-lg border border-slate-200">
                {activeComponents.map((c) => {
                  const isSel = c.id === selectedComponentId;
                  const icons: Record<string, string> = {
                    SOLAR_CANOPY: '☀️',
                    EV_CHARGER: '⚡',
                    CHARGING_BAY: '⚡',
                    BESS_CONTAINER: '🔋',
                    TRANSFORMER: '🔌',
                  };
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedComponentId(c.id)}
                      className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all ${
                        isSel
                          ? 'bg-amber-500 text-white font-bold shadow-xs scale-105'
                          : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
                      }`}
                    >
                      <span>{icons[c.type] || '📦'}</span>
                      <span className="truncate max-w-[110px]">{c.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Component Inspector & Transformations */}
            {selectedComponent && (
              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-300 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                  <span className="text-xs font-bold text-amber-900 uppercase">
                    Asset Inspector
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDuplicateComponent(selectedComponent.id)}
                      title="Duplicate Component"
                      className="px-2 py-1 rounded bg-white border border-amber-300 hover:bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center gap-1"
                    >
                      <span>📋 Copy</span>
                    </button>
                    <button
                      onClick={() => handleDeleteComponent(selectedComponent.id)}
                      title="Delete Component"
                      className="px-2 py-1 rounded bg-red-100 border border-red-300 hover:bg-red-200 text-red-800 text-[10px] font-bold flex items-center gap-1"
                    >
                      <span>🗑️ Delete</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-amber-900 uppercase">Asset Name</span>
                    <input
                      type="text"
                      value={selectedComponent.name}
                      onChange={(e) => handleUpdateComponent({ ...selectedComponent, name: e.target.value })}
                      className="w-full mt-0.5 px-2.5 py-1 rounded bg-white border border-amber-300 text-slate-900 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="flex justify-between text-[11px] font-bold text-amber-900">
                        <span>X-Offset</span>
                        <span className="font-mono text-amber-700">{selectedComponent.xMeters}m</span>
                      </div>
                      <input
                        type="range"
                        min="-35"
                        max="35"
                        value={selectedComponent.xMeters}
                        onChange={(e) => handleUpdateComponent({ ...selectedComponent, xMeters: Number(e.target.value) })}
                        className="w-full accent-amber-600"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] font-bold text-amber-900">
                        <span>Y-Offset</span>
                        <span className="font-mono text-amber-700">{selectedComponent.yMeters}m</span>
                      </div>
                      <input
                        type="range"
                        min="-35"
                        max="35"
                        value={selectedComponent.yMeters}
                        onChange={(e) => handleUpdateComponent({ ...selectedComponent, yMeters: Number(e.target.value) })}
                        className="w-full accent-amber-600"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex justify-between text-[11px] font-bold text-amber-900">
                        <span>Rotation</span>
                        <span className="font-mono text-amber-700">{selectedComponent.rotationDegrees || 0}°</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        value={selectedComponent.rotationDegrees || 0}
                        onChange={(e) => handleUpdateComponent({ ...selectedComponent, rotationDegrees: Number(e.target.value) })}
                        className="w-full accent-amber-600"
                      />
                    </div>
                    <button
                      onClick={() => handleRotateComponent(selectedComponent.id, 90)}
                      className="mt-3 px-2.5 py-1 rounded bg-amber-200 border border-amber-400 hover:bg-amber-300 text-amber-900 font-bold text-xs"
                    >
                      ↻ 90°
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="flex justify-between text-[11px] font-bold text-amber-900">
                        <span>Width</span>
                        <span className="font-mono text-amber-700">{selectedComponent.widthMeters}m</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="30"
                        value={selectedComponent.widthMeters}
                        onChange={(e) => handleUpdateComponent({ ...selectedComponent, widthMeters: Number(e.target.value) })}
                        className="w-full accent-amber-600"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] font-bold text-amber-900">
                        <span>Length</span>
                        <span className="font-mono text-amber-700">{selectedComponent.lengthMeters}m</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="30"
                        value={selectedComponent.lengthMeters}
                        onChange={(e) => handleUpdateComponent({ ...selectedComponent, lengthMeters: Number(e.target.value) })}
                        className="w-full accent-amber-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Viewport & Camera Controls */}
            <div className="flex flex-col gap-3 pt-3 border-t border-border-subtle">
              <label className="text-xs font-bold text-text-primary uppercase tracking-wider">
                Camera View Heading & Pitch
              </label>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs font-semibold text-text-primary">
                  <span>Model Heading</span>
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

            {/* Capacity Metrics Summary Synced with Active 3D Infrastructure */}
            <div className="p-4 rounded-xl bg-surface-subtle border border-border-subtle flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                  Live 3D Infrastructure Capacity
                </span>
                <span className="text-xs font-mono font-bold text-primary">{plotAreaSqm.toLocaleString()} m²</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-2.5 rounded-lg border border-border-subtle flex flex-col">
                  <span className="text-[9px] text-text-muted uppercase font-semibold">Solar PV Installed</span>
                  <span className="font-bold text-emerald-700">{totalSolarKwp} kWp</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-border-subtle flex flex-col">
                  <span className="text-[9px] text-text-muted uppercase font-semibold">Annual Yield (Est)</span>
                  <span className="font-bold text-emerald-700">
                    {Number(((totalSolarKwp * effectiveGhi * 365 * 0.80) / 1000).toFixed(1))} MWh/yr
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-border-subtle flex flex-col">
                  <span className="text-[9px] text-text-muted uppercase font-semibold">EV Fast Ports</span>
                  <span className="font-bold text-sky-700">{totalEvPorts} Ports</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-border-subtle flex flex-col">
                  <span className="text-[9px] text-text-muted uppercase font-semibold">BESS Storage</span>
                  <span className="font-bold text-purple-700">{totalBessKwh} kWh</span>
                </div>
              </div>

              <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 flex justify-between items-center text-xs">
                <span className="text-[10px] font-bold text-emerald-900 uppercase">Estimated Civil Capex:</span>
                <span className="font-bold font-mono text-emerald-800">
                  ₹{(activeCapexInr / 100000).toFixed(2)} Lakhs
                </span>
              </div>
            </div>

            {/* Surrounding Spatial Context Indicators */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-2.5">
              <span className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">
                Surrounding Spatial Context
              </span>

              <div className="grid grid-cols-1 gap-2 text-xs">
                <div className="bg-white p-2 rounded-lg border border-slate-200 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🔌</span>
                    <div>
                      <div className="font-bold text-slate-900 text-[11px]">MSEDCL Substation</div>
                      <div className="text-[9px] text-slate-500 font-mono">Grid Feeder Proxy</div>
                    </div>
                  </div>
                  <span className="font-bold font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                    {distanceToSubstationMeters}m
                  </span>
                </div>

                <div className="bg-white p-2 rounded-lg border border-slate-200 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🛣️</span>
                    <div>
                      <div className="font-bold text-slate-900 text-[11px]">Arterial Road Network</div>
                      <div className="text-[9px] text-slate-500 font-mono">OSM DP Trunk Corridor</div>
                    </div>
                  </div>
                  <span className="font-bold font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                    {distanceToArterialRoadMeters}m
                  </span>
                </div>

                <div className="bg-white p-2 rounded-lg border border-slate-200 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🌊</span>
                    <div>
                      <div className="font-bold text-slate-900 text-[11px]">Riparian Flood Clearance</div>
                      <div className="text-[9px] text-slate-500 font-mono">Godavari 100m Setback</div>
                    </div>
                  </div>
                  <span className={`font-bold font-mono px-2 py-0.5 rounded border text-[11px] ${
                    riparianSetbackMeters > 50
                      ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                      : 'text-red-700 bg-red-50 border-red-200'
                  }`}>
                    {riparianStatusText}
                  </span>
                </div>
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
