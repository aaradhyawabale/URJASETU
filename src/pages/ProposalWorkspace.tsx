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
  const [notFound, setNotFound] = useState<boolean>(false);

  useEffect(() => {
    async function loadProposal() {
      if (!id) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const propRes = await getProposalById(id);
      if (!propRes.proposal) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      setProposal(propRes.proposal);

      if (propRes.proposal.siteId) {
        const siteRes = await getSiteById(propRes.proposal.siteId);
        setSite(siteRes.site);
      }
      setIsLoading(false);
    }
    loadProposal();
  }, [id]);

  if (isLoading) {
    return (
      <div className="p-8 text-center text-sm text-text-muted">
        Loading proposal workspace dossier...
      </div>
    );
  }

  if (notFound || !proposal) {
    return (
      <div className="p-8 max-w-xl mx-auto my-12 bg-white rounded-xl border border-border-subtle shadow-xs text-center flex flex-col items-center gap-4">
        <span className="material-symbols-outlined text-amber-500 text-4xl">folder_off</span>
        <h2 className="text-xl font-bold text-text-primary">Proposal Package Not Found</h2>
        <p className="text-xs text-text-secondary leading-relaxed">
          The requested proposal ID <code className="font-mono bg-surface-subtle px-1.5 py-0.5 rounded text-amber-900">{id || 'EMPTY'}</code> does not exist in the active Pune database.
        </p>
        <button
          onClick={() => navigate('/proposals')}
          className="mt-2 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors shadow-xs"
        >
          Return to Proposal Library
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 xl:p-8 flex flex-col gap-6 max-w-6xl mx-auto">
      {/* Header Bar */}
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

      {/* Main Proposal Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white rounded-xl p-6 border border-border-subtle shadow-xs flex flex-col gap-4">
            <h3 className="text-base font-bold text-text-primary">Executive Summary & Proposal Justification</h3>
            <p className="text-sm text-text-secondary leading-relaxed">{proposal.aiSummary}</p>
          </div>

          {site && (
            <div className="bg-white rounded-xl p-6 border border-border-subtle shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-text-primary">Associated Candidate Site</h3>
                <ScoreBadge score={site.opportunityScore} />
              </div>
              <div className="flex flex-col gap-2 text-xs">
                <div className="flex justify-between py-1 border-b border-border-subtle">
                  <span className="text-text-muted">Site Code:</span>
                  <span className="font-mono font-semibold text-text-primary">{site.code}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border-subtle">
                  <span className="text-text-muted">Site Name:</span>
                  <span className="font-semibold text-text-primary">{site.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border-subtle">
                  <span className="text-text-muted">Administrative Ward:</span>
                  <span className="text-text-secondary">{site.ward}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-text-muted">Parcel Area:</span>
                  <span className="text-text-secondary">{(site.areaSqm || 2450).toLocaleString()} m²</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-xl p-6 border border-border-subtle shadow-xs flex flex-col gap-4">
            <h3 className="text-base font-bold text-text-primary">Project Parameters</h3>
            <div className="flex flex-col gap-3 text-xs">
              <div className="flex justify-between py-1 border-b border-border-subtle">
                <span className="text-text-muted">Infrastructure Type:</span>
                <span className="font-semibold text-primary">{proposal.infrastructureType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border-subtle">
                <span className="text-text-muted">Opportunity Score:</span>
                <span className="font-bold text-emerald-700">{proposal.opportunityScore}/100</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-text-muted">Estimated Area:</span>
                <span className="text-text-secondary">{proposal.estimatedAreaSqm.toLocaleString()} m²</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
