import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProposalById } from '../services/api/proposals';
import { getSiteById } from '../services/api/sites';
import { CandidateSite, Proposal } from '../types/site';
import { ScoreBadge } from '../components/ui/ScoreBadge';

export const ProposalWorkspace: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [site, setSite] = useState<CandidateSite | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadProposal() {
      setIsLoading(true);
      const propRes = await getProposalById(id || 'prop-nashik-01');
      setProposal(propRes.proposal);

      const siteRes = await getSiteById(propRes.proposal.siteId || 'nashik-site-01');
      setSite(siteRes.site);
      setIsLoading(false);
    }
    loadProposal();
  }, [id]);

  return (
    <div className="p-6 xl:p-8 flex flex-col gap-6 max-w-6xl mx-auto">
      {/* Header Bar */}
      {proposal && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-border-subtle shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-primary uppercase tracking-wider bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                Decision Package Workspace
              </span>
              <span className="text-[11px] font-mono text-text-secondary bg-surface-subtle border border-border-subtle px-2 py-0.5 rounded">
                Status: {proposal.status}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-text-primary mt-1">{proposal.title}</h1>
            <p className="text-xs text-text-secondary mt-1">
              Author: {proposal.author} • City: {proposal.cityName} • Created: {proposal.createdAt}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/proposals')}
              className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors shadow-xs"
            >
              Save to Proposal Library
            </button>
          </div>
        </div>
      )}

      {/* Main Proposal Dossier */}
      {isLoading ? (
        <div className="p-8 bg-white rounded-xl border border-border-subtle text-xs text-text-muted text-center">
          Loading proposal workspace dossier...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Technical Overview (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="bg-white rounded-xl p-6 border border-border-subtle shadow-xs flex flex-col gap-5">
              {site && (
                <div className="flex items-center justify-between border-b border-border-subtle pb-4">
                  <div>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Candidate Site Information</span>
                    <h3 className="text-xl font-bold text-text-primary mt-0.5">{site.code}</h3>
                    <p className="text-xs text-text-muted">{site.name}</p>
                  </div>
                  <ScoreBadge score={site.opportunityScore} size="lg" />
                </div>
              )}

              {proposal && (
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3 rounded-lg bg-surface-subtle border border-border-subtle flex flex-col">
                    <span className="text-text-muted font-semibold uppercase text-[10px]">Infrastructure Selected</span>
                    <span className="font-bold text-text-primary text-sm mt-0.5">{proposal.infrastructureType.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-surface-subtle border border-border-subtle flex flex-col">
                    <span className="text-text-muted font-semibold uppercase text-[10px]">Calculated Plot Footprint</span>
                    <span className="font-bold text-primary text-sm mt-0.5">{proposal.estimatedAreaSqm.toLocaleString()} m²</span>
                  </div>
                </div>
              )}

              {/* AI Review Summary Box */}
              {proposal && (
                <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                    <span className="material-symbols-outlined text-[18px]">psychology</span>
                    <span>AI Technical Review Summary</span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">{proposal.aiSummary}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Key Details & Actions (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="bg-white rounded-xl p-5 border border-border-subtle shadow-xs flex flex-col gap-4">
              <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">Proposal Actions</h4>
              <button
                onClick={() => alert('Proposal successfully exported as PDF dossier!')}
                className="w-full py-2 px-3 rounded-lg bg-surface-subtle border border-border-subtle hover:bg-slate-100 text-text-primary font-semibold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>Export PDF Dossier</span>
              </button>
              <button
                onClick={() => navigate('/proposals')}
                className="w-full py-2 px-3 rounded-lg bg-primary text-white font-semibold text-xs hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">folder</span>
                <span>View Saved Proposals</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
