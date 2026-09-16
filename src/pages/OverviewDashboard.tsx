import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSites } from '../services/api/sites';
import { getProposals } from '../services/api/proposals';
import { CandidateSite, Proposal } from '../types/site';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ScoreBadge } from '../components/ui/ScoreBadge';

export const OverviewDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [sites, setSites] = useState<CandidateSite[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFallback, setIsFallback] = useState<boolean>(false);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const sitesResult = await getSites();
      const proposalsResult = await getProposals();

      setSites(sitesResult.sites);
      setProposals(proposalsResult.proposals);
      setIsFallback(sitesResult.isFallback || proposalsResult.isFallback);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const recommendedSites = sites.filter((s) => s.status === 'RECOMMENDED');
  const reviewSites = sites.filter((s) => s.status === 'UNDER_REVIEW');
  const disqualifiedSites = sites.filter((s) => s.status === 'DISQUALIFIED' || s.status === 'SCREENING');

  const topSite = recommendedSites[0] || sites[0];

  return (
    <div className="p-6 xl:p-8 flex flex-col gap-6">
      {/* Fallback Banner Notice if API is offline */}
      {isFallback && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span>Live API connection offline — displaying Nashik Municipal seed dataset.</span>
          </div>
          <span className="font-mono text-[10px] bg-white border border-amber-200 px-2 py-0.5 rounded text-amber-900 font-semibold">
            DEMO DATA MODE
          </span>
        </div>
      )}

      {/* Executive Strategic Hero Banner */}
      <div className="relative overflow-hidden rounded-xl bg-white p-6 xl:p-8 border border-border-subtle shadow-xs">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-4xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] text-primary bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded uppercase tracking-wider font-semibold">
                ULB Municipal Audit Dossier
              </span>
              <span className="text-text-muted">•</span>
              <span className="text-[11px] text-text-secondary bg-surface-subtle border border-border-subtle px-2 py-0.5 rounded font-mono">
                SRID: EPSG:4326
              </span>
              <span className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                FY 2024-25 Urban Siting Matrix
              </span>
            </div>
            <h1 className="text-2xl xl:text-3xl text-text-primary tracking-tight font-bold">
              Nashik Urban Agglomeration <span className="text-text-secondary font-normal">— Solar-EV Infrastructure Siting Overview</span>
            </h1>
            <p className="text-sm text-text-secondary max-w-3xl leading-relaxed">
              Geospatial assessment combining solar irradiance, road connectivity, activity-based EV demand proxies, and flood/conflict screening for clean energy infrastructure deployment across the Godavari municipal basin.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/sites')}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white font-semibold text-sm shadow-xs hover:bg-emerald-700 transition-all group"
            >
              <span>Explore Site Intelligence</span>
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 4-Column Tactical Siting Tally */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* 01 Total Evaluated */}
        <div className="bg-white rounded-xl p-5 flex flex-col justify-between border border-border-subtle shadow-xs hover:border-border-strong transition-colors">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] text-text-muted uppercase tracking-wider font-semibold">Candidate Sites</span>
              <span className="text-sm font-semibold text-text-secondary">Urban Boundary Limits</span>
            </div>
            <span className="material-symbols-outlined text-text-muted text-[22px]">domain</span>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl text-text-primary font-bold">{isLoading ? '...' : sites.length}</span>
              <span className="text-xs text-text-secondary">Sites Evaluated</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-surface-subtle border border-border-subtle text-text-secondary">
              100% Screened
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-slate-400 h-full w-full"></div>
          </div>
        </div>

        {/* 02 Recommended */}
        <div className="bg-white rounded-xl p-5 flex flex-col justify-between border border-emerald-200/80 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] text-primary uppercase tracking-wider font-semibold">Clear Viability</span>
              <span className="text-sm font-semibold text-text-primary">Recommended Tiers</span>
            </div>
            <div className="w-7 h-7 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl text-primary font-bold">{isLoading ? '...' : recommendedSites.length}</span>
              <span className="text-xs text-text-secondary">High Opportunity</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
              <span>SITE-01</span>
              <span>•</span>
              <span>SITE-02</span>
            </div>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-primary h-full w-[50%]"></div>
          </div>
        </div>

        {/* 03 Review Required */}
        <div className="bg-white rounded-xl p-5 flex flex-col justify-between border border-amber-200/80 shadow-xs hover:border-amber-300 transition-colors">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] text-amber-700 uppercase tracking-wider font-semibold">Soft Operational Flags</span>
              <span className="text-sm font-semibold text-text-primary">Review Required</span>
            </div>
            <div className="w-7 h-7 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center">
              <span className="material-symbols-outlined text-amber-600 text-[18px]">pending_actions</span>
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl text-amber-700 font-bold">{isLoading ? '...' : reviewSites.length}</span>
              <span className="text-xs text-text-secondary">Moderate Risk</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
              <span>SITE-03</span>
            </div>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-amber-500 h-full w-[25%]"></div>
          </div>
        </div>

        {/* 04 Flagged / Rejected */}
        <div className="bg-white rounded-xl p-5 flex flex-col justify-between border border-red-200/80 shadow-xs hover:border-red-300 transition-colors">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] text-red-700 uppercase tracking-wider font-semibold">Severe Constraint</span>
              <span className="text-sm font-semibold text-text-primary">Risk Disqualified</span>
            </div>
            <div className="w-7 h-7 rounded-full bg-red-50 border border-red-200 flex items-center justify-center">
              <span className="material-symbols-outlined text-red-600 text-[18px]">report</span>
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl text-red-700 font-bold">{isLoading ? '...' : disqualifiedSites.length}</span>
              <span className="text-xs text-text-secondary">Hydrologic Conflict</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-red-50 text-red-800 border border-red-200 font-semibold">
              <span>SITE-04</span>
            </div>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-red-500 h-full w-[25%]"></div>
          </div>
        </div>
      </div>

      {/* Main Workspace Split (65% / 35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Spatial Overview Canvas (lg:col-span-8) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-white rounded-xl overflow-hidden border border-border-subtle shadow-xs flex flex-col">
            <div className="px-5 py-3 bg-surface-subtle border-b border-border-subtle flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">layers</span>
                <span className="text-sm font-semibold text-text-primary">Spatial Basin Topology</span>
                <span className="text-[10px] text-text-secondary bg-white border border-border-subtle px-2 py-0.5 rounded">
                  Nashik Ward Overlays
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] px-2 py-1 rounded bg-sky-50 text-sky-800 border border-sky-200 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-sky-500"></span>Godavari Riverway
                </span>
                <span className="text-[10px] px-2 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-slate-500"></span>Trimbak Corridor
                </span>
                <span className="text-[10px] px-2 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>33kV MSEDCL Feeder
                </span>
              </div>
            </div>

            {/* GIS Map Visualization Container */}
            <div className="relative w-full h-[460px] bg-slate-50 overflow-hidden flex items-center justify-center border-b border-border-subtle">
              {/* GIS Vector Representation SVG */}
              <svg className="w-full h-full" viewBox="0 0 800 450" fill="none">
                <rect width="800" height="450" fill="#f8fafc" />
                {/* Grid Lines */}
                <path d="M0 100 H800 M0 200 H800 M0 300 H800 M0 400 H800" stroke="#e2e8f0" strokeDasharray="3 3" />
                <path d="M150 0 V450 M300 0 V450 M450 0 V450 M600 0 V450 M750 0 V450" stroke="#e2e8f0" strokeDasharray="3 3" />

                {/* Godavari River Ribbon */}
                <path d="M 0 320 Q 200 280, 400 310 T 800 240" stroke="#bae6fd" strokeWidth="24" fill="none" strokeLinecap="round" opacity="0.7" />
                <path d="M 0 320 Q 200 280, 400 310 T 800 240" stroke="#38bdf8" strokeWidth="4" fill="none" strokeLinecap="round" />

                {/* Main Arterial Roads */}
                <path d="M 100 0 L 350 450" stroke="#cbd5e1" strokeWidth="12" />
                <path d="M 100 0 L 350 450" stroke="#64748b" strokeWidth="3" />

                <path d="M 50 180 L 750 200" stroke="#cbd5e1" strokeWidth="10" />
                <path d="M 50 180 L 750 200" stroke="#64748b" strokeWidth="2" />

                {/* Candidate Sites Pins from API Data */}
                {sites.map((site, index) => {
                  const positions = [
                    { x: 280, y: 160 },
                    { x: 520, y: 120 },
                    { x: 620, y: 280 },
                    { x: 340, y: 300 },
                  ];
                  const pos = positions[index] || { x: 400, y: 200 };
                  const isRec = site.status === 'RECOMMENDED';

                  return (
                    <g key={site.id} className="cursor-pointer group" onClick={() => navigate(`/planning/${site.id}`)}>
                      <circle cx={pos.x} cy={pos.y} r={isRec ? '26' : '18'} fill={isRec ? '#ecfdf5' : '#fffbeb'} stroke={isRec ? '#059669' : '#d97706'} strokeWidth="2" />
                      <circle cx={pos.x} cy={pos.y} r="8" fill={isRec ? '#059669' : '#d97706'} />
                      <text x={pos.x} y={pos.y + 40} textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold">
                        {site.code}
                      </text>
                      <text x={pos.x} y={pos.y + 54} textAnchor="middle" fill={isRec ? '#059669' : '#d97706'} fontSize="10" fontWeight="bold">
                        Score: {site.opportunityScore}/100
                      </text>
                    </g>
                  );
                })}
              </svg>

              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-2 rounded-lg border border-border-subtle text-xs text-text-secondary flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span>Recommended ({recommendedSites.length})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span>Under Review ({reviewSites.length})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                  <span>Disqualified ({disqualifiedSites.length})</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: High-Priority Candidate Site Dossier (lg:col-span-4) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {topSite && (
            <div className="bg-white rounded-xl p-5 border border-emerald-200 shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-primary tracking-wider uppercase">Top Ranked Candidate</span>
                  <span className="text-lg font-bold text-text-primary">{topSite.code}</span>
                </div>
                <ScoreBadge score={topSite.opportunityScore} size="lg" />
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-text-secondary">Location</span>
                <p className="text-sm text-text-primary font-medium">{topSite.name}</p>
                <p className="text-xs text-text-muted">{topSite.ward || topSite.wardName}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border-subtle">
                <div className="p-2.5 rounded-lg bg-surface-subtle border border-border-subtle flex flex-col">
                  <span className="text-[10px] text-text-muted uppercase font-semibold">Solar Suitability</span>
                  <span className="text-sm font-bold text-emerald-700">{topSite.metrics?.solarSuitability ?? 84} / 100</span>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-subtle border border-border-subtle flex flex-col">
                  <span className="text-[10px] text-text-muted uppercase font-semibold">EV Demand Proxy</span>
                  <span className="text-sm font-bold text-emerald-700">{topSite.metrics?.evDemandProxy ?? 72} / 100</span>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-subtle border border-border-subtle flex flex-col">
                  <span className="text-[10px] text-text-muted uppercase font-semibold">Est. Plot Area</span>
                  <span className="text-sm font-bold text-text-primary">{(topSite.areaSqm || 2450).toLocaleString()} m²</span>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-subtle border border-border-subtle flex flex-col">
                  <span className="text-[10px] text-text-muted uppercase font-semibold">Flood Risk</span>
                  <span className="text-sm font-bold text-emerald-700">{topSite.metrics?.floodRisk ?? 'LOW'} Risk</span>
                </div>
              </div>

              <button
                onClick={() => navigate(`/planning/${topSite.id}`)}
                className="w-full py-2.5 px-4 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 mt-2 shadow-xs"
              >
                <span className="material-symbols-outlined text-[18px]">design_services</span>
                <span>Open Site Planning Workspace</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Candidate Sites Matrix Table */}
      <div className="bg-white rounded-xl border border-border-subtle shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between">
          <h3 className="text-base font-bold text-text-primary">Nashik Candidate Site Siting Matrix</h3>
          <button onClick={() => navigate('/sites/ranked')} className="text-xs font-semibold text-primary hover:underline">
            View Full Ranked Shortlist →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-subtle text-[11px] font-semibold uppercase tracking-wider text-text-secondary border-b border-border-subtle">
                <th className="py-3 px-6">Site Code</th>
                <th className="py-3 px-6">Site Name & Ward</th>
                <th className="py-3 px-6">Opportunity Score</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Est. Area</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-sm">
              {sites.map((site) => (
                <tr key={site.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-6 font-mono font-bold text-text-primary">{site.code}</td>
                  <td className="py-3 px-6">
                    <div className="font-semibold text-text-primary">{site.name}</div>
                    <div className="text-xs text-text-muted">{site.ward || site.wardName}</div>
                  </td>
                  <td className="py-3 px-6">
                    <ScoreBadge score={site.opportunityScore} size="sm" />
                  </td>
                  <td className="py-3 px-6">
                    <StatusBadge status={site.status} />
                  </td>
                  <td className="py-3 px-6 font-medium text-text-secondary">{(site.areaSqm || 2450).toLocaleString()} m²</td>
                  <td className="py-3 px-6 text-right">
                    <button
                      onClick={() => navigate(`/planning/${site.id}`)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-surface-subtle border border-border-subtle hover:bg-emerald-50 hover:text-primary hover:border-emerald-200 transition-colors"
                    >
                      Plan Site
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
