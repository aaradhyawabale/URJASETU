import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { getSiteById } from '../services/api/sites';
import { createProposal } from '../services/api/proposals';
import { CandidateSite, InfrastructureType, IPlacedComponent, ComponentType } from '../types/site';
import { InteractivePlotDrawer } from '../gis/components/InteractivePlotDrawer';
import { calculatePlotCapacityMetrics } from '../gis/utils/turfUtils';
import { ScoreBadge } from '../components/ui/ScoreBadge';
import { getPlanningDesign, savePlanningDesign } from '../services/planningStateService';

export const SitePlanningWorkspace: React.FC = () => {
  const { siteId } = useParams<{ siteId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const isAcquired = searchParams.get('acquired') === 'true';
  const customLat = searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : null;
  const customLng = searchParams.get('lng') ? parseFloat(searchParams.get('lng')!) : null;
  const customArea = searchParams.get('area') ? parseFloat(searchParams.get('area')!) : null;

  const [site, setSite] = useState<CandidateSite | null>(null);
  const [plotAreaSqm, setPlotAreaSqm] = useState<number>(customArea || 2450);
  const [plotGeometry, setPlotGeometry] = useState<number[][][] | null>(null);
  const [selectedInfra, setSelectedInfra] = useState<InfrastructureType>('SOLAR_EV_CHARGING_HUB');
  const [isSaving, setIsSaving] = useState(false);

  // Stage 7: 2D Placed Components State synced with Canonical PlanningDesign State
  const [placedComponents, setPlacedComponents] = useState<IPlacedComponent[]>([]);

  // Initialize/Load Canonical Design State
  useEffect(() => {
    async function loadSiteAndDesign() {
      if (siteId) {
        const res = await getSiteById(siteId);
        setSite(res.site);

        const design = getPlanningDesign(siteId, res.site, customArea);
        setPlacedComponents(design.components);
        setSelectedInfra(design.infrastructureType || 'SOLAR_EV_CHARGING_HUB');
        if (design.plotAreaSqm) setPlotAreaSqm(design.plotAreaSqm);
        if (design.plotGeometry) setPlotGeometry(design.plotGeometry);
      }
    }
    loadSiteAndDesign();
  }, [siteId, customArea]);

  // Sync back to canonical state whenever components, plotArea, or plotGeometry change
  const syncToCanonicalState = (
    updatedComponents: IPlacedComponent[],
    updatedArea: number,
    updatedGeometry: number[][][] | null,
    updatedInfra: InfrastructureType
  ) => {
    if (!siteId) return;
    savePlanningDesign({
      siteId,
      plotGeometry: updatedGeometry,
      plotAreaSqm: updatedArea,
      infrastructureType: updatedInfra,
      components: updatedComponents,
      provenance: {
        plotGeometry: isAcquired ? 'DERIVED_CANDIDATE_PLOT_GEOMETRY' : 'GEODESIC_DRAWN_PLOT_GEOMETRY',
        components: 'CANONICAL_PLANNING_STATE',
      },
      updatedAt: new Date().toISOString(),
    });
  };

  const handleAddComponent = (type: ComponentType) => {
    const id = `comp-${type.toLowerCase()}-${Date.now()}`;
    const offset = (placedComponents.length + 1) * 3;

    let newComp: IPlacedComponent;
    if (type === 'SOLAR_CANOPY') {
      newComp = {
        id,
        type,
        name: `Solar Array ${placedComponents.length + 1}`,
        xMeters: -5 - offset,
        yMeters: 5 + offset,
        widthMeters: 15,
        lengthMeters: 8,
        rotationDegrees: 0,
        specs: { capacityKwp: 24 },
      };
    } else if (type === 'EV_CHARGER') {
      newComp = {
        id,
        type,
        name: `EV Fast Charger ${placedComponents.length + 1}`,
        xMeters: 5 + offset,
        yMeters: -5 - offset,
        widthMeters: 4,
        lengthMeters: 2,
        rotationDegrees: 0,
        specs: { ports: 2, powerKw: 120 },
      };
    } else if (type === 'BESS_CONTAINER') {
      newComp = {
        id,
        type,
        name: `BESS Storage ${placedComponents.length + 1}`,
        xMeters: 8 + offset,
        yMeters: 6 + offset,
        widthMeters: 6,
        lengthMeters: 2.5,
        rotationDegrees: 0,
        specs: { capacityKwh: 250 },
      };
    } else {
      newComp = {
        id,
        type,
        name: `Transformer ${placedComponents.length + 1}`,
        xMeters: -8 - offset,
        yMeters: -6 - offset,
        widthMeters: 3,
        lengthMeters: 3,
        rotationDegrees: 0,
        specs: { ratingKva: 500 },
      };
    }

    const nextComponents = [...placedComponents, newComp];
    setPlacedComponents(nextComponents);
    syncToCanonicalState(nextComponents, plotAreaSqm, plotGeometry, selectedInfra);
  };

  const handleRemoveComponent = (id: string) => {
    const nextComponents = placedComponents.filter((c) => c.id !== id);
    setPlacedComponents(nextComponents);
    syncToCanonicalState(nextComponents, plotAreaSqm, plotGeometry, selectedInfra);
  };

  const handleAreaChange = (newArea: number) => {
    setPlotAreaSqm(newArea);
    syncToCanonicalState(placedComponents, newArea, plotGeometry, selectedInfra);
  };

  const handlePolygonChange = (ringCoordinates: number[][][]) => {
    setPlotGeometry(ringCoordinates);
    syncToCanonicalState(placedComponents, plotAreaSqm, ringCoordinates, selectedInfra);
  };

  const handleCreateProposalAndProceed = async () => {
    if (!site) return;
    setIsSaving(true);
    syncToCanonicalState(placedComponents, plotAreaSqm, plotGeometry, selectedInfra);

    const res = await createProposal({
      siteId: site.id,
      siteCode: site.code,
      title: `${site.code} ${selectedInfra.replace(/_/g, ' ')} Proposal`,
      opportunityScore: site.opportunityScore,
      estimatedAreaSqm: plotAreaSqm,
      infrastructureType: selectedInfra,
      aiSummary: `${site.code} parcel planning completed with ${plotAreaSqm.toLocaleString()} m² drawn plot area and ${selectedInfra} infrastructure selection.`,
      plotGeometry: plotGeometry ? { type: 'Polygon', coordinates: plotGeometry } : undefined,
      placedComponents,
    });

    setIsSaving(false);
    navigate(`/planning/${site.id}/3d`);
  };

  const effectiveLat = customLat || site?.latitude || site?.lat || 19.9975;
  const effectiveLng = customLng || site?.longitude || site?.lng || 73.7898;

  return (
    <div className="relative w-full h-[calc(100vh-64px)] flex overflow-hidden">
      {/* Interactive Turf.js & Leaflet 2D Plot Drawer (70% width) */}
      <div className="flex-1 relative bg-slate-100 h-full flex flex-col">
        {/* Acquired Plot Geometry Banner */}
        {isAcquired && (
          <div className="absolute top-4 left-4 z-20 bg-emerald-900/90 text-white backdrop-blur-md px-4 py-2 rounded-xl border border-emerald-700 shadow-md flex items-center justify-between gap-4 max-w-xl">
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-bold">PLOT GEOMETRY ACQUIRED:</span>
              <span>Loaded derived candidate plot boundary ({plotAreaSqm.toLocaleString()} m²)</span>
            </div>
            <span className="text-[10px] font-mono bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded border border-emerald-700">
              DERIVED_CANDIDATE_PLOT_GEOMETRY
            </span>
          </div>
        )}

        <InteractivePlotDrawer
          initialAreaSqm={plotAreaSqm}
          siteLat={effectiveLat}
          siteLng={effectiveLng}
          siteCode={site?.code || 'NSK-CND-001'}
          siteName={site?.name || 'Nashik Candidate Site'}
          placedComponents={placedComponents}
          onAreaChange={(newArea) => setPlotAreaSqm(newArea)}
          onPolygonChange={(ringCoordinates) => setPlotGeometry(ringCoordinates)}
        />
      </div>

      {/* Right Side Panel: Infrastructure Selection & Parameters (30% width) */}
      <div className="w-[380px] bg-white border-l border-border-subtle h-full flex flex-col justify-between overflow-y-auto shadow-md">
        {site ? (
          <div className="p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-border-subtle pb-4">
              <div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                  STEP 4: 2D PLOT DESIGNER
                </span>
                <h2 className="text-xl font-bold text-text-primary mt-0.5">{site.code}</h2>
              </div>
              <ScoreBadge score={site.opportunityScore} size="md" />
            </div>

            <div>
              <span className="text-xs text-text-muted">Selected Parcel</span>
              <h3 className="text-sm font-bold text-text-primary">{site.name}</h3>
              <p className="text-xs text-text-secondary mt-0.5">{site.ward || site.wardName || 'Nashik Municipal Corporation'}</p>
            </div>

            {/* Stage 7: 2D Infrastructure Component Placement Palette */}
            <div className="flex flex-col gap-2 bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-200">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                  2D Infrastructure Component Palette
                </label>
                <span className="text-[10px] font-mono font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                  {placedComponents.length} Placed
                </span>
              </div>
              <p className="text-[11px] text-emerald-800">
                Place typed infrastructure components on your drawn parcel canvas to simulate layout & capacity:
              </p>

              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  onClick={() => handleAddComponent('SOLAR_CANOPY')}
                  className="px-2.5 py-1.5 bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-900 text-xs font-semibold rounded-lg text-left flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <span>☀️</span>
                  <span>+ Solar Canopy</span>
                </button>
                <button
                  onClick={() => handleAddComponent('EV_CHARGER')}
                  className="px-2.5 py-1.5 bg-white border border-sky-300 hover:bg-sky-100 text-sky-900 text-xs font-semibold rounded-lg text-left flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <span>🔌</span>
                  <span>+ EV Fast Charger</span>
                </button>
                <button
                  onClick={() => handleAddComponent('BESS_CONTAINER')}
                  className="px-2.5 py-1.5 bg-white border border-purple-300 hover:bg-purple-100 text-purple-900 text-xs font-semibold rounded-lg text-left flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <span>🔋</span>
                  <span>+ BESS Container</span>
                </button>
                <button
                  onClick={() => handleAddComponent('TRANSFORMER')}
                  className="px-2.5 py-1.5 bg-white border border-red-300 hover:bg-red-100 text-red-900 text-xs font-semibold rounded-lg text-left flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <span>⚡</span>
                  <span>+ Transformer</span>
                </button>
              </div>

              {/* Placed Component List */}
              {placedComponents.length > 0 && (
                <div className="flex flex-col gap-1 mt-2 pt-2 border-t border-emerald-200/80 max-h-36 overflow-y-auto">
                  <span className="text-[10px] font-bold text-emerald-900 uppercase">Placed Layout Items:</span>
                  {placedComponents.map((comp) => (
                    <div
                      key={comp.id}
                      className="flex items-center justify-between bg-white px-2 py-1 rounded border border-emerald-200 text-xs"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px]">
                          {comp.type === 'SOLAR_CANOPY'
                            ? '☀️'
                            : comp.type === 'EV_CHARGER'
                            ? '🔌'
                            : comp.type === 'BESS_CONTAINER'
                            ? '🔋'
                            : '⚡'}
                        </span>
                        <span className="font-semibold text-slate-800 text-[11px] truncate max-w-[170px]">
                          {comp.name}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveComponent(comp.id)}
                        className="text-slate-400 hover:text-red-600 font-bold text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Plot Area & Placed Component Capacity Summary Card */}
            {(() => {
              const baseMetrics = calculatePlotCapacityMetrics(plotAreaSqm);
              // Calculate custom aggregated capacity from placed components
              const solarCanopies = placedComponents.filter((c) => c.type === 'SOLAR_CANOPY');
              const evChargers = placedComponents.filter((c) => c.type === 'EV_CHARGER' || c.type === 'CHARGING_BAY');
              const bessUnits = placedComponents.filter((c) => c.type === 'BESS_CONTAINER');

              const totalSolarKwp = solarCanopies.length > 0 ? solarCanopies.length * 24 : baseMetrics.solarCapacityKwp;
              const totalEvPorts = evChargers.length > 0 ? evChargers.length * 2 : baseMetrics.evChargerPorts;
              const totalBessKwh = bessUnits.length > 0 ? bessUnits.length * 250 : baseMetrics.bessCapacityKwh;
              const totalCapexInr = (totalSolarKwp * 45000) + (totalEvPorts * 800000) + (totalBessKwh * 18000);

              return (
                <div className="p-4 rounded-xl bg-surface-subtle border border-border-subtle flex flex-col gap-3">
                  <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                      Drawn Parcel & Placed Capacity
                    </span>
                    <span className="text-xs font-mono font-bold text-primary">{plotAreaSqm.toLocaleString()} m²</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white p-2.5 rounded-lg border border-border-subtle flex flex-col">
                      <span className="text-[9px] text-text-muted uppercase font-semibold">Solar PV Capacity</span>
                      <span className="font-bold text-emerald-700">{totalSolarKwp} kWp</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-border-subtle flex flex-col">
                      <span className="text-[9px] text-text-muted uppercase font-semibold">Annual Generation</span>
                      <span className="font-bold text-emerald-700">
                        {((totalSolarKwp * 5.02 * 365 * 0.80) / 1000).toFixed(1)} MWh/yr
                      </span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-border-subtle flex flex-col">
                      <span className="text-[9px] text-text-muted uppercase font-semibold">EV Charger Ports</span>
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
                      ₹{(totalCapexInr / 100000).toFixed(2)} Lakhs
                    </span>
                  </div>

                  <p className="text-[10px] text-text-muted italic">
                    Calculated from Turf.js geodesic polygon area & {placedComponents.length} placed layout components. Classified as <strong>PLANNING_HEURISTIC</strong>.
                  </p>
                </div>
              );
            })()}
          </div>
        ) : (
          <div className="p-6 text-xs text-text-muted">Loading planning workspace...</div>
        )}

        {/* CTA Footer */}
        {site && (
          <div className="p-4 bg-surface-subtle border-t border-border-subtle flex flex-col gap-2">
            <button
              onClick={handleCreateProposalAndProceed}
              disabled={isSaving || plotAreaSqm <= 0}
              className="w-full py-2.5 px-4 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-emerald-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">view_in_ar</span>
              <span>{isSaving ? 'Saving Planning Payload...' : 'Launch 3D Site Planner'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
