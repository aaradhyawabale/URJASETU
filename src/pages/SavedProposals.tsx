import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProposals, deleteProposal } from '../services/api/proposals';
import { Proposal } from '../types/site';
import { ScoreBadge } from '../components/ui/ScoreBadge';

export const SavedProposals: React.FC = () => {
  const navigate = useNavigate();

  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFallback, setIsFallback] = useState<boolean>(false);

  useEffect(() => {
    async function loadProposals() {
      setIsLoading(true);
      const res = await getProposals();
      setProposals(res.proposals);
      setIsFallback(res.isFallback);
      setIsLoading(false);
    }
    loadProposals();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this proposal package?')) return;

    await deleteProposal(id);
    setProposals((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="p-6 xl:p-8 flex flex-col gap-6 max-w-6xl mx-auto">
      {/* Fallback Banner */}
      {isFallback && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span>Live API offline — showing Nashik proposal library repository.</span>
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
      {isLoading ? (
        <div className="p-8 bg-white rounded-xl border border-border-subtle text-xs text-text-muted text-center">
          Loading proposal repository...
        </div>
      ) : proposals.length === 0 ? (
        <div className="p-12 bg-white rounded-xl border border-border-subtle text-center flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-text-muted text-[48px]">folder_off</span>
          <h3 className="text-base font-bold text-text-primary">No Saved Proposals Found</h3>
          <p className="text-xs text-text-secondary max-w-md">
            Start a new site selection workflow in Site Intelligence to generate and save proposal packages.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {proposals.map((prop) => (
            <div
              key={prop.id}
              className="bg-white rounded-xl p-5 border border-border-subtle shadow-xs hover:border-emerald-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
              onClick={() => navigate(`/proposals/${prop.id}`)}
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

              <div className="flex items-center gap-3 shrink-0">
                <ScoreBadge score={prop.opportunityScore} size="md" />

                <button
                  onClick={(e) => handleDelete(prop.id, e)}
                  className="p-2 rounded-lg text-text-muted hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Delete proposal"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>

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
      )}
    </div>
  );
};
