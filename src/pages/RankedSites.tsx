import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRankedSites } from '../services/api/sites';
import { CandidateSite } from '../types/site';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ScoreBadge } from '../components/ui/ScoreBadge';

export const RankedSites: React.FC = () => {
  const navigate = useNavigate();

  const [sites, setSites] = useState<CandidateSite[]>([]);
  const [selectedDivision, setSelectedDivision] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFallback, setIsFallback] = useState<boolean>(false);

  useEffect(() => {
    async function loadRanked() {
      setIsLoading(true);
      const res = await getRankedSites();
      setSites(res.sites);
      setIsFallback(res.isFallback);
      setIsLoading(false);
    }
    loadRanked();
  }, []);

  const divisions = [
    { id: 'ALL', name: 'All NMC Administrative Divisions (6 Divisions)' },
    { id: 'nmc_div_01', name: 'Panchavati Division (NMC-DIV-01)' },
    { id: 'nmc_div_02', name: 'Nashik East Division (NMC-DIV-02)' },
    { id: 'nmc_div_03', name: 'Nashik West Division (NMC-DIV-03)' },
    { id: 'nmc_div_04', name: 'Cidco Division (NMC-DIV-04)' },
    { id: 'nmc_div_05', name: 'Satpur Division (NMC-DIV-05)' },
    { id: 'nmc_div_06', name: 'Nashik Road Division (NMC-DIV-06)' },
  ];

  const filteredSites = sites.filter((s) => {
    if (selectedDivision === 'ALL') return true;
    return s.divisionId === selectedDivision || (s.zoneName && s.zoneName.toLowerCase().includes(selectedDivision.toLowerCase()));
  });

  return (
    <div className="p-6 xl:p-8 flex flex-col gap-6">
      {/* Fallback Banner */}
      {isFallback && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span>Live API connection offline — showing Nashik candidate site ranking dataset.</span>
          </div>
          <span className="font-mono text-[10px] bg-white border border-amber-200 px-2 py-0.5 rounded text-amber-900 font-semibold">
            DEMO DATA MODE
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-border-subtle shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-primary uppercase tracking-wider bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              Multi-Criteria Decision Matrix
            </span>
            <span className="text-[11px] font-mono text-text-secondary bg-surface-subtle border border-border-subtle px-2 py-0.5 rounded">
              NMC 6 Divisional Offices (DERIVED)
            </span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary mt-1">Ranked Candidate Sites & Spatial Division Filter</h1>
          <p className="text-xs text-text-secondary mt-1">
            Deterministic opportunity scoring evaluating solar irradiance, EV demand proxy, road accessibility, and environmental constraints aggregated across Nashik Municipal Corporation Administrative Divisions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-text-muted">Filter by Administrative Division:</label>
            <select
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              className="px-3 py-2 text-xs font-semibold bg-white border border-border-strong rounded-lg text-text-primary focus:ring-2 focus:ring-primary/20 outline-none"
            >
              {divisions.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {filteredSites.length > 0 && (
            <button
              onClick={() => navigate(`/planning/${filteredSites[0].id}`)}
              className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors shadow-xs shrink-0 self-end"
            >
              Plan Top Site ({filteredSites[0].code}) →
            </button>
          )}
        </div>
      </div>

      {/* Grid of Ranked Sites Cards */}
      {isLoading ? (
        <div className="p-8 text-xs text-text-muted text-center">Loading site ranking matrix...</div>
      ) : filteredSites.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-border-subtle text-xs text-text-muted">
          No candidate sites found matching selected administrative division filter ({selectedDivision}).
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {filteredSites.map((site, index) => (
            <div
              key={site.id}
              className={`bg-white rounded-xl p-5 border flex flex-col justify-between shadow-xs transition-all ${
                index === 0 ? 'border-emerald-300 ring-2 ring-emerald-500/20' : 'border-border-subtle hover:border-border-strong'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="text-xs font-mono font-bold text-text-muted">RANK #{index + 1}</span>
                  <ScoreBadge score={site.opportunityScore} size="md" />
                </div>

                <h3 className="text-base font-bold text-text-primary mt-2">{site.code}</h3>
                <p className="text-xs text-text-secondary font-medium line-clamp-1">{site.name}</p>
                <p className="text-[11px] text-text-muted mt-0.5">{site.ward || site.wardName}</p>

                <div className="mt-3">
                  <StatusBadge status={site.status} />
                </div>

                {/* Quick Metrics */}
                <div className="mt-4 pt-3 border-t border-border-subtle flex flex-col gap-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-text-muted">Solar Score</span>
                    <span className="font-bold text-text-primary">{site.metrics?.solarSuitability ?? 84}/100</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-text-muted">EV Demand Proxy</span>
                    <span className="font-bold text-text-primary">{site.metrics?.evDemandProxy ?? 72}/100</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-text-muted">Est. Parcel Area</span>
                    <span className="font-bold text-text-primary">{(site.areaSqm || 2450).toLocaleString()} m²</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate(`/planning/${site.id}`)}
                className="mt-5 w-full py-2 px-3 rounded-lg bg-surface-subtle border border-border-subtle hover:bg-emerald-50 hover:text-primary hover:border-emerald-200 transition-colors text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <span>Select & Plan Site</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
