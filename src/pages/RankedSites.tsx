import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NASHIK_DEMO_SITES } from '../data/nashikDemoData';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ScoreBadge } from '../components/ui/ScoreBadge';

export const RankedSites: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 xl:p-8 flex flex-col gap-6">
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

        <button
          onClick={() => navigate('/planning/nashik-site-01')}
          className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors shadow-xs shrink-0"
        >
          Plan Top Site (NASHIK-SITE-01) →
        </button>
      </div>

      {/* Grid of Ranked Sites Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {NASHIK_DEMO_SITES.map((site, index) => (
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
              <p className="text-[11px] text-text-muted mt-0.5">{site.ward}</p>

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
                  <span className="font-bold text-text-primary">{site.areaSqm.toLocaleString()} m²</span>
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
    </div>
  );
};
