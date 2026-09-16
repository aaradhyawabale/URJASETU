import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSites, getSiteScores, getSiteRisk } from '../services/api/sites';
import { CandidateSite } from '../types/site';
import { LeafletMap, LayerVisibilityState } from '../gis/components/LeafletMap';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ScoreBadge } from '../components/ui/ScoreBadge';

export const SiteIntelligence: React.FC = () => {
  const navigate = useNavigate();

  const [sites, setSites] = useState<CandidateSite[]>([]);
  const [selectedSite, setSelectedSite] = useState<CandidateSite | null>(null);
  const [siteScores, setSiteScores] = useState<any>(null);
  const [siteRisk, setSiteRisk] = useState<any>(null);

  // Real Discovered Data States
  const [solarData, setSolarData] = useState<any>(null);
  const [terrainData, setTerrainData] = useState<any>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFallback, setIsFallback] = useState<boolean>(false);

  // Active Map Layer Toggles for OSM & Infrastructure Layers
  const [layers, setLayers] = useState<LayerVisibilityState>({
    osmRoads: true,
    osmBuildings: false,
    osmPois: true,
    osmParking: true,
    osmEvCharging: true,
    osmLanduse: false,
    substationFeeders: true,
    floodways: true,
  });

  const toggleLayer = (layerKey: keyof LayerVisibilityState) => {
    setLayers((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const res = await getSites();
      setSites(res.sites);
      setIsFallback(res.isFallback);

      // Fetch NASA POWER Solar Climatology
      try {
        const solarRes = await fetch('http://localhost:5001/api/v1/gis/solar/climatology').then((r) => r.json());
        if (solarRes.success) {
          setSolarData(solarRes.data);
        }
      } catch (err) {
        console.warn('[SiteIntelligence] Error fetching solar climatology:', err);
      }

      if (res.sites.length > 0) {
        const initial = res.sites[0];
        setSelectedSite(initial);
        await loadSiteDetails(initial);
      }
      setIsLoading(false);
    }
    loadData();
  }, []);

  const loadSiteDetails = async (site: CandidateSite) => {
    const lat = site.latitude || site.lat || 19.9975;
    const lng = site.longitude || site.lng || 73.7898;

    const scoresRes = await getSiteScores(site.id);
    const riskRes = await getSiteRisk(site.id);

    setSiteScores(scoresRes.scores);
    setSiteRisk(riskRes.risk);

    // Fetch Elevation & Terrain analysis for specific coordinates
    try {
      const eleRes = await fetch(`http://localhost:5001/api/v1/gis/elevation?lat=${lat}&lng=${lng}`).then((r) =>
        r.json()
      );
      if (eleRes.success) {
        setTerrainData(eleRes.data);
      }
    } catch (err) {
      console.warn('[SiteIntelligence] Error fetching elevation data:', err);
    }
  };

  const handleSelectSite = async (site: CandidateSite) => {
    setSelectedSite(site);
    await loadSiteDetails(site);
  };

  return (
    <div className="relative w-full h-[calc(100vh-64px)] flex overflow-hidden">
      {/* 2D GIS Map Controls & Canvas (70% width) */}
      <div className="flex-1 relative bg-slate-100 h-full flex flex-col">
        {/* Map Floating Control Toolbar Header */}
        <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-md px-4 py-3 rounded-xl border border-border-subtle shadow-md flex flex-wrap items-center gap-2 max-w-4xl">
          <div className="flex items-center gap-1.5 mr-2">
            <span className="material-symbols-outlined text-primary text-[20px]">map</span>
            <span className="text-xs font-bold text-text-primary uppercase tracking-wider">GIS Layers:</span>
          </div>

          <button
            onClick={() => toggleLayer('osmRoads')}
            className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors ${
              layers.osmRoads
                ? 'bg-sky-50 text-sky-800 border-sky-300 font-semibold'
                : 'bg-surface-subtle text-text-muted border-border-subtle'
            }`}
          >
            🛣️ Roads (13.9k)
          </button>

          <button
            onClick={() => toggleLayer('osmBuildings')}
            className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors ${
              layers.osmBuildings
                ? 'bg-slate-100 text-slate-800 border-slate-300 font-semibold'
                : 'bg-surface-subtle text-text-muted border-border-subtle'
            }`}
          >
            🏢 Buildings (49.8k)
          </button>

          <button
            onClick={() => toggleLayer('osmPois')}
            className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors ${
              layers.osmPois
                ? 'bg-purple-50 text-purple-800 border-purple-300 font-semibold'
                : 'bg-surface-subtle text-text-muted border-border-subtle'
            }`}
          >
            📍 POIs (1.0k)
          </button>

          <button
            onClick={() => toggleLayer('osmParking')}
            className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors ${
              layers.osmParking
                ? 'bg-blue-50 text-blue-800 border-blue-300 font-semibold'
                : 'bg-surface-subtle text-text-muted border-border-subtle'
            }`}
          >
            🅿️ Parking (29)
          </button>

          <button
            onClick={() => toggleLayer('osmEvCharging')}
            className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors ${
              layers.osmEvCharging
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold'
                : 'bg-surface-subtle text-text-muted border-border-subtle'
            }`}
          >
            ⚡ EV Stations (29)
          </button>

          <button
            onClick={() => toggleLayer('osmLanduse')}
            className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors ${
              layers.osmLanduse
                ? 'bg-amber-50 text-amber-800 border-amber-300 font-semibold'
                : 'bg-surface-subtle text-text-muted border-border-subtle'
            }`}
          >
            🏞️ Land Use (645)
          </button>

          <button
            onClick={() => toggleLayer('substationFeeders')}
            className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors ${
              layers.substationFeeders
                ? 'bg-orange-50 text-orange-800 border-orange-300 font-semibold'
                : 'bg-surface-subtle text-text-muted border-border-subtle'
            }`}
          >
            🔌 33kV Feeders
          </button>

          <button
            onClick={() => toggleLayer('floodways')}
            className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors ${
              layers.floodways
                ? 'bg-cyan-50 text-cyan-800 border-cyan-300 font-semibold'
                : 'bg-surface-subtle text-text-muted border-border-subtle'
            }`}
          >
            🌊 Flood Screening
          </button>
        </div>

        {/* Fallback Banner */}
        {isFallback && (
          <div className="absolute top-20 left-4 z-20 bg-amber-50/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-amber-200 text-[11px] text-amber-900 font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Live GIS API Offline — Displaying Nashik Spatial Seed</span>
          </div>
        )}

        {/* Interactive Leaflet 2D GIS Map Component */}
        <div className="w-full h-full relative select-none">
          <LeafletMap
            sites={sites}
            selectedSite={selectedSite}
            onSelectSite={handleSelectSite}
            layers={layers}
          />
        </div>
      </div>

      {/* Selected Site Details Side Panel (30% width) */}
      <div className="w-[410px] bg-white border-l border-border-subtle h-full flex flex-col justify-between overflow-y-auto shadow-md select-text">
        {selectedSite ? (
          <div className="p-6 flex flex-col gap-5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border-subtle pb-4">
              <div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Candidate Site Dossier</span>
                <h2 className="text-xl font-bold text-text-primary mt-0.5">{selectedSite.code}</h2>
              </div>
              <ScoreBadge score={selectedSite.opportunityScore} size="lg" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-text-primary">{selectedSite.name}</h3>
              <p className="text-xs text-text-muted mt-0.5">{selectedSite.ward || selectedSite.wardName}</p>
              <div className="mt-2 flex items-center gap-2">
                <StatusBadge status={selectedSite.status} />
                <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {selectedSite.areaSqm || 2450} m²
                </span>
              </div>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed bg-surface-subtle p-3 rounded-lg border border-border-subtle">
              {selectedSite.description}
            </p>

            {/* Authoritative Regional Solar Data Card */}
            {solarData && (
              <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200 flex flex-col gap-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-900 flex items-center gap-1">
                    ☀️ Regional Solar Climatology
                  </span>
                  <span className="text-[9px] font-bold uppercase bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-300">
                    {solarData.classification}
                  </span>
                </div>
                <div className="flex justify-between text-emerald-950 font-medium mt-0.5">
                  <span>Optimal Tilt GHI (20° S):</span>
                  <span className="font-bold">{solarData.metrics.annualGhiOptimalTilt} kWh/m²/day</span>
                </div>
                <div className="text-[10px] text-emerald-700 flex flex-col gap-0.5 border-t border-emerald-200/60 pt-1 mt-0.5">
                  <div className="flex justify-between">
                    <span>Source: NASA POWER Climatology</span>
                    <span>Resolution: 0.5° Grid (~50km)</span>
                  </div>
                  <div className="text-[9px] text-emerald-800 italic leading-tight mt-0.5">
                    Note: 30-year regional climatology mean. Does not measure plot-level micro-shading from trees/buildings.
                  </div>
                </div>
              </div>
            )}

            {/* Copernicus DEM Elevation & Slope Card */}
            {terrainData && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 flex items-center gap-1">
                    ⛰️ Terrain & Slope Analysis
                  </span>
                  <span className="text-[9px] font-bold uppercase bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded border border-slate-300">
                    {terrainData.classification}
                  </span>
                </div>
                <div className="flex justify-between text-slate-800 font-medium mt-0.5">
                  <span>Elevation: <strong>{terrainData.elevationMeters}m MSL</strong></span>
                  <span>Slope: <strong>{terrainData.slopePercent}% ({terrainData.slopeCategory})</strong></span>
                </div>
                <div className="text-[10px] text-slate-500 border-t border-slate-200/60 pt-1 mt-0.5 leading-tight">
                  Method: IDW spatial interpolation from Copernicus DEM 30m reference nodes.
                </div>
              </div>
            )}

            {/* Decomposable Factor Breakdown Tree */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center justify-between">
                <span>Decomposable Suitability Tree</span>
                <span className="text-[10px] font-normal text-text-muted lowercase">(computed criteria)</span>
              </h4>
              
              <div className="flex flex-col gap-2.5 bg-surface-subtle p-3.5 rounded-xl border border-border-subtle">
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-text-secondary">☀️ Solar Photovoltaic Factor</span>
                    <span className="font-bold text-emerald-700">{selectedSite.metrics.solarSuitability}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full" style={{ width: `${selectedSite.metrics.solarSuitability}%` }}></div>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-text-secondary">⚡ EV Demand Proxy Factor</span>
                    <span className="font-bold text-sky-700">{selectedSite.metrics.evDemandProxy}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-sky-500 h-full" style={{ width: `${selectedSite.metrics.evDemandProxy}%` }}></div>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-text-secondary">🛣️ Road Access Factor</span>
                    <span className="font-bold text-emerald-700">{selectedSite.metrics.roadAccessibility}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full" style={{ width: `${selectedSite.metrics.roadAccessibility}%` }}></div>
                  </div>
                </div>

                {terrainData && (
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-text-secondary">⛰️ Terrain Slope Score</span>
                      <span className="font-bold text-slate-700">{terrainData.terrainScore}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-slate-600 h-full" style={{ width: `${terrainData.terrainScore}%` }}></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Environmental & Waterway Setback Screening */}
            <div className="flex flex-col gap-2 pt-2 border-t border-border-subtle">
              <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">Environmental & Legal Screening</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-lg bg-surface-subtle border border-border-subtle flex flex-col">
                  <span className="text-[10px] text-text-muted font-semibold uppercase">Riparian Setback</span>
                  <span className="text-xs font-bold text-emerald-700">{selectedSite.metrics.floodRisk} RISK</span>
                  <span className="text-[9px] text-text-muted mt-0.5">30m MRTP Blue Line</span>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-subtle border border-border-subtle flex flex-col">
                  <span className="text-[10px] text-text-muted font-semibold uppercase">Land Conflict</span>
                  <span className="text-xs font-bold text-emerald-700">{selectedSite.metrics.landConflict}</span>
                  <span className="text-[9px] text-text-muted mt-0.5">NMC Zoning Check</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 text-xs text-text-muted">Loading site dossier...</div>
        )}

        {/* CTA Footer */}
        {selectedSite && (
          <div className="p-4 bg-surface-subtle border-t border-border-subtle flex flex-col gap-2">
            <button
              onClick={() => navigate(`/planning/${selectedSite.id}`)}
              className="w-full py-2.5 px-4 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">design_services</span>
              <span>Proceed to Plot Planning</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
