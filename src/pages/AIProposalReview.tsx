import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postAIReview, IAIReviewResponse } from '../services/api/ai';
import { getProposalById } from '../services/api/proposals';
import { getSiteById } from '../services/api/sites';
import { CandidateSite, Proposal } from '../types/site';
import { ScoreBadge } from '../components/ui/ScoreBadge';

export const AIProposalReview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [site, setSite] = useState<CandidateSite | null>(null);
  const [aiReview, setAiReview] = useState<IAIReviewResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const propRes = await getProposalById(id || 'prop-nashik-01');
      setProposal(propRes.proposal);

      const siteRes = await getSiteById(propRes.proposal.siteId || 'nashik-site-01');
      setSite(siteRes.site);

      const aiRes = await postAIReview({
        siteId: siteRes.site.id,
        estimatedAreaSqm: propRes.proposal.estimatedAreaSqm,
        infrastructureType: propRes.proposal.infrastructureType,
      });

      setAiReview(aiRes.review);
      setIsLoading(false);
    }
    loadData();
  }, [id]);

  const handleRegenerate = async () => {
    if (!site || !proposal) return;
    setIsGenerating(true);
    const aiRes = await postAIReview({
      siteId: site.id,
      estimatedAreaSqm: proposal.estimatedAreaSqm,
      infrastructureType: proposal.infrastructureType,
    });
    setAiReview(aiRes.review);
    setIsGenerating(false);
  };

  return (
    <div className="p-6 xl:p-8 flex flex-col gap-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-border-subtle shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-primary uppercase tracking-wider bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              AI Technical Review Layer
            </span>
            <span className="text-[11px] font-mono text-text-secondary bg-surface-subtle border border-border-subtle px-2 py-0.5 rounded">
              {aiReview?.source === 'GEMINI_API' ? 'Gemini AI Live API' : 'Deterministic Technical Fallback'}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary mt-1">AI Proposal Review & Technical Assessment</h1>
          <p className="text-xs text-text-secondary mt-1">
            Explainable AI synthesis converting structured GIS metrics and plot parameters into municipal review documentation.
          </p>
        </div>

        {proposal && (
          <button
            onClick={() => navigate(`/proposals/${proposal.id}`)}
            className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors shadow-xs shrink-0 flex items-center gap-2"
          >
            <span>Open Proposal Workspace</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        )}
      </div>

      {/* Main Review Card */}
      {isLoading ? (
        <div className="p-8 bg-white rounded-xl border border-border-subtle text-xs text-text-muted text-center">
          Loading AI technical review synthesis...
        </div>
      ) : (
        <div className="bg-white rounded-xl p-6 border border-border-subtle shadow-xs flex flex-col gap-6">
          {/* Dossier Summary Header */}
          {site && (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-surface-subtle border border-border-subtle">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-text-muted uppercase">Target Candidate Site</span>
                <span className="text-lg font-bold text-text-primary">{site.code} — {site.name}</span>
                <span className="text-xs text-text-muted">{site.ward || site.wardName}</span>
              </div>
              <ScoreBadge score={site.opportunityScore} size="lg" />
            </div>
          )}

          {/* AI Synthesis Section */}
          {aiReview && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[22px]">psychology</span>
                  <h3 className="text-base font-bold text-text-primary">AI Executive Synthesis</h3>
                </div>
                <button
                  onClick={handleRegenerate}
                  disabled={isGenerating}
                  className="text-xs text-primary hover:underline font-semibold flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">refresh</span>
                  <span>{isGenerating ? 'Synthesizing...' : 'Regenerate Analysis'}</span>
                </button>
              </div>

              <div className="p-5 rounded-xl bg-emerald-50/50 border border-emerald-200 text-sm text-text-primary leading-relaxed flex flex-col gap-3">
                <p>{aiReview.summary}</p>

                <div className="flex flex-col gap-1 text-xs text-text-secondary mt-1">
                  <span className="font-bold text-text-primary">Key Siting Strengths:</span>
                  <ul className="list-disc pl-5 flex flex-col gap-1">
                    {aiReview.strengths.map((str, idx) => (
                      <li key={idx}>{str}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Verification Checklist */}
          {aiReview && (
            <div className="flex flex-col gap-3">
              <h3 className="text-base font-bold text-text-primary">Municipal Verification Checklist</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {aiReview.verificationsRequired.map((ver, idx) => (
                  <div key={idx} className="p-3 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-900 flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
                    <span>{ver}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
