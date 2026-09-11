import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRankedSites } from '../services/api/sites';
import { CandidateSite } from '../types/site';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ScoreBadge } from '../components/ui/ScoreBadge';

export const RankedSites: React.FC = () => {
  const navigate = useNavigate();

  const [sites, setSites] = useState<CandidateSite[]>([]);
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
              Nashik ULB Seed
            </span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary mt-1">Ranked Site Results & Site Comparison</h1>
          <p className="text-xs text-text-secondary mt-1">
            Deterministic opportunity scoring evaluating solar irradiance, EV demand density, electrical feeder proximity, and environmental constraints.
          </p>
        </div>

        {sites.length > 0 && (
          <button
            onClick={() => navigate(`/planning/${sites[0].id}`)}
            className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors shadow-xs shrink-0"
          >
            Plan Top Site ({sites[0].code}) →
          </button>
        )}
      </div>

      {/* Grid of Ranked Sites Cards */}
      {isLoading ? (
        <div className="p-8 text-xs text-text-muted text-center">Loading site ranking matrix...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {sites.map((site, index) => (
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
                    <span className="font-bold text-text-primary">{site.metrics.solarSuitability}/100</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-text-muted">EV Demand Proxy</span>
                    <span className="font-bold text-text-primary">{site.metrics.evDemandProxy}/100</span>
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
