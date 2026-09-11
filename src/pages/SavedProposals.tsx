import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NASHIK_DEMO_PROPOSALS } from '../data/nashikDemoData';
import { ScoreBadge } from '../components/ui/ScoreBadge';

export const SavedProposals: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 xl:p-8 flex flex-col gap-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-border-subtle shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-primary uppercase tracking-wider bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              Municipal Proposal Repository
            </span>
            <span className="text-[11px] font-mono text-text-secondary bg-surface-subtle border border-border-subtle px-2 py-0.5 rounded">
              Nashik ULB Archive
            </span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary mt-1">Saved Proposals & Decision Dossiers</h1>
          <p className="text-xs text-text-secondary mt-1">
            Archived and active Solar-EV Charging Hub proposals generated through the UrjaSetu decision support workflow.
          </p>
        </div>

        <button
          onClick={() => navigate('/sites')}
          className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors shadow-xs shrink-0 flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Create New Siting Proposal</span>
        </button>
      </div>

      {/* Proposals List */}
      <div className="flex flex-col gap-4">
        {NASHIK_DEMO_PROPOSALS.map((prop) => (
          <div
            key={prop.id}
            className="bg-white rounded-xl p-5 border border-border-subtle shadow-xs hover:border-emerald-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="flex flex-col gap-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-text-primary text-sm">{prop.siteCode}</span>
                <span className="text-text-muted">•</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {prop.status}
                </span>
                <span className="text-text-muted">•</span>
                <span className="text-xs text-text-muted">Updated {prop.updatedAt}</span>
              </div>

              <h3 className="text-base font-bold text-text-primary">{prop.title}</h3>
              <p className="text-xs text-text-secondary line-clamp-2">{prop.aiSummary}</p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <ScoreBadge score={prop.opportunityScore} size="md" />

              <button
                onClick={() => navigate(`/proposals/${prop.id}`)}
                className="px-4 py-2 rounded-lg bg-surface-subtle border border-border-subtle hover:bg-emerald-50 hover:text-primary hover:border-emerald-200 transition-colors text-xs font-semibold flex items-center gap-1.5"
              >
                <span>Open Proposal</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
