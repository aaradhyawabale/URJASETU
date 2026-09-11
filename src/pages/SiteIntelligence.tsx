import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSites, getSiteScores, getSiteRisk } from '../services/api/sites';
import { CandidateSite } from '../types/site';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ScoreBadge } from '../components/ui/ScoreBadge';

export const SiteIntelligence: React.FC = () => {
  const navigate = useNavigate();

  const [sites, setSites] = useState<CandidateSite[]>([]);
  const [selectedSite, setSelectedSite] = useState<CandidateSite | null>(null);
  const [siteScores, setSiteScores] = useState<any>(null);
  const [siteRisk, setSiteRisk] = useState<any>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFallback, setIsFallback] = useState<boolean>(false);

  // Active Map Layer Toggles
  const [layers, setLayers] = useState({
    solarIrradiance: true,
    evDemandProxy: true,
    substationFeeders: true,
    floodways: true,
  });

  const toggleLayer = (layerKey: keyof typeof layers) => {
    setLayers((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const res = await getSites();
      setSites(res.sites);
      setIsFallback(res.isFallback);

      if (res.sites.length > 0) {
        const initial = res.sites[0];
        setSelectedSite(initial);

        const scoresRes = await getSiteScores(initial.id);
        const riskRes = await getSiteRisk(initial.id);

        setSiteScores(scoresRes.scores);
        setSiteRisk(riskRes.risk);
      }
      setIsLoading(false);
    }
    loadData();
  }, []);

  const handleSelectSite = async (site: CandidateSite) => {
    setSelectedSite(site);
    const scoresRes = await getSiteScores(site.id);
    const riskRes = await getSiteRisk(site.id);

    setSiteScores(scoresRes.scores);
    setSiteRisk(riskRes.risk);
  };

  return (
    <div className="relative w-full h-[calc(100vh-64px)] flex overflow-hidden">
      {/* 2D GIS Map Controls & Canvas (70% width) */}
      <div className="flex-1 relative bg-slate-100 h-full flex flex-col">
        {/* Map Floating Control Toolbar Header */}
        <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-border-subtle shadow-md flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-[20px]">layers</span>
          <span className="text-xs font-bold text-text-primary uppercase tracking-wider">Analysis Layers:</span>

          <button
            onClick={() => toggleLayer('solarIrradiance')}
            className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors ${
              layers.solarIrradiance ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold' : 'bg-surface-subtle text-text-muted border-border-subtle'
            }`}
          >
            ☀️ Solar Irradiance
          </button>

          <button
            onClick={() => toggleLayer('evDemandProxy')}
            className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors ${
              layers.evDemandProxy ? 'bg-sky-50 text-sky-800 border-sky-300 font-semibold' : 'bg-surface-subtle text-text-muted border-border-subtle'
            }`}
          >
            ⚡ EV Demand Proxy
          </button>

          <button
            onClick={() => toggleLayer('substationFeeders')}
            className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors ${
              layers.substationFeeders ? 'bg-amber-50 text-amber-800 border-amber-300 font-semibold' : 'bg-surface-subtle text-text-muted border-border-subtle'
            }`}
          >
            🔌 33kV Feeders
          </button>

          <button
            onClick={() => toggleLayer('floodways')}
            className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors ${
              layers.floodways ? 'bg-blue-50 text-blue-800 border-blue-300 font-semibold' : 'bg-surface-subtle text-text-muted border-border-subtle'
            }`}
          >
            🌊 Flood Screening
          </button>
        </div>

        {/* Fallback Banner */}
        {isFallback && (
          <div className="absolute top-16 left-4 z-20 bg-amber-50/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-amber-200 text-[11px] text-amber-900 font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Live GIS API Offline — Displaying Nashik Spatial Seed</span>
          </div>
        )}

        {/* GIS Map Visualization Canvas */}
        <div className="w-full h-full relative select-none">
          <svg className="w-full h-full" viewBox="0 0 1000 650" fill="none">
            <rect width="1000" height="650" fill="#f1f5f9" />

            {/* Map Grid */}
            <path d="M0 100 H1000 M0 200 H1000 M0 300 H1000 M0 400 H1000 M0 500 H1000 M0 600 H1000" stroke="#cbd5e1" strokeDasharray="3 3" />
            <path d="M150 0 V650 M300 0 V650 M450 0 V650 M600 0 V650 M750 0 V650 M900 0 V650" stroke="#cbd5e1" strokeDasharray="3 3" />

            {/* Solar Irradiance Heatmap Layer */}
            {layers.solarIrradiance && (
              <g opacity="0.25">
                <circle cx="350" cy="220" r="180" fill="#fef08a" />
                <circle cx="350" cy="220" r="110" fill="#fde047" />
                <circle cx="650" cy="180" r="160" fill="#fef08a" />
              </g>
            )}

            {/* EV Demand Heatmap Layer */}
            {layers.evDemandProxy && (
              <g opacity="0.2">
                <circle cx="350" cy="240" r="120" fill="#0284c7" />
                <circle cx="700" cy="350" r="150" fill="#0284c7" />
              </g>
            )}

            {/* Flood Risk Overlay */}
            {layers.floodways && (
              <path d="M 0 450 Q 300 380, 550 440 T 1000 380" stroke="#7dd3fc" strokeWidth="36" fill="none" opacity="0.6" />
            )}

            {/* 33kV Substation Feeders */}
            {layers.substationFeeders && (
              <path d="M 120 50 L 350 220 L 700 200 M 350 220 L 350 480" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="6 4" />
            )}

            {/* Arterial Roads */}
            <path d="M 150 0 L 450 650" stroke="#94a3b8" strokeWidth="10" />
            <path d="M 50 220 L 950 250" stroke="#94a3b8" strokeWidth="8" />

            {/* Candidate Sites Pins */}
            {sites.map((site, index) => {
              const positions = [
                { x: 350, y: 220 },
                { x: 650, y: 180 },
                { x: 720, y: 380 },
                { x: 420, y: 420 },
              ];
              const pos = positions[index] || { x: 400, y: 300 };
              const isSelected = selectedSite?.id === site.id;

              return (
                <g
                  key={site.id}
                  className="cursor-pointer transition-transform hover:scale-110"
                  onClick={() => handleSelectSite(site)}
                >
                  {isSelected && (
                    <circle cx={pos.x} cy={pos.y} r="32" fill="none" stroke="#059669" strokeWidth="3" className="animate-ping" />
                  )}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isSelected ? '24' : '18'}
                    fill={site.status === 'RECOMMENDED' ? '#ecfdf5' : site.status === 'UNDER_REVIEW' ? '#fffbeb' : '#fef2f2'}
                    stroke={site.status === 'RECOMMENDED' ? '#059669' : site.status === 'UNDER_REVIEW' ? '#d97706' : '#dc2626'}
                    strokeWidth="2.5"
                  />
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="8"
                    fill={site.status === 'RECOMMENDED' ? '#059669' : site.status === 'UNDER_REVIEW' ? '#d97706' : '#dc2626'}
                  />
                  <text x={pos.x} y={pos.y + 36} textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="bold">
                    {site.code}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Map Footer Legend */}
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-border-subtle text-xs flex items-center gap-4 shadow-sm">
            <span className="font-bold text-text-primary uppercase tracking-wider text-[11px]">GIS Legend:</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Recommended (80+ Score)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>Review Needed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
              <span>Risk Disqualified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Site Details Side Panel (30% width) */}
      <div className="w-[380px] bg-white border-l border-border-subtle h-full flex flex-col justify-between overflow-y-auto shadow-md">
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
              <div className="mt-2">
                <StatusBadge status={selectedSite.status} />
              </div>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed bg-surface-subtle p-3 rounded-lg border border-border-subtle">
              {selectedSite.description}
            </p>

            {/* Metrics Breakdown */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">Opportunity Factors</h4>
              
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-text-secondary">Solar Suitability</span>
                  <span className="font-bold text-emerald-700">{selectedSite.metrics.solarSuitability}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full" style={{ width: `${selectedSite.metrics.solarSuitability}%` }}></div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-text-secondary">EV Demand Proxy</span>
                  <span className="font-bold text-sky-700">{selectedSite.metrics.evDemandProxy}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-sky-500 h-full" style={{ width: `${selectedSite.metrics.evDemandProxy}%` }}></div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-text-secondary">Road Accessibility</span>
                  <span className="font-bold text-emerald-700">{selectedSite.metrics.roadAccessibility}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full" style={{ width: `${selectedSite.metrics.roadAccessibility}%` }}></div>
                </div>
              </div>
            </div>

            {/* Risk & Conflict Screening */}
            <div className="flex flex-col gap-2 pt-2 border-t border-border-subtle">
              <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">Risk & Conflict Screening</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-lg bg-surface-subtle border border-border-subtle flex flex-col">
                  <span className="text-[10px] text-text-muted font-semibold uppercase">Flood Screening</span>
                  <span className="text-xs font-bold text-emerald-700">{selectedSite.metrics.floodRisk} RISK</span>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-subtle border border-border-subtle flex flex-col">
                  <span className="text-[10px] text-text-muted font-semibold uppercase">Land Conflict</span>
                  <span className="text-xs font-bold text-emerald-700">{selectedSite.metrics.landConflict}</span>
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
