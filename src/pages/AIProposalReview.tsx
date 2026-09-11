import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { NASHIK_DEMO_PROPOSALS, NASHIK_DEMO_SITES } from '../data/nashikDemoData';
import { ScoreBadge } from '../components/ui/ScoreBadge';

export const AIProposalReview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const proposal = NASHIK_DEMO_PROPOSALS.find((p) => p.id === id) || NASHIK_DEMO_PROPOSALS[0];
  const site = NASHIK_DEMO_SITES.find((s) => s.code === proposal.siteCode) || NASHIK_DEMO_SITES[0];

  const [isGenerating, setIsGenerating] = useState(false);

  const handleRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 1000);
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
              Gemini AI Service
            </span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary mt-1">AI Proposal Review & Technical Assessment</h1>
          <p className="text-xs text-text-secondary mt-1">
            Explainable AI synthesis converting structured GIS metrics and plot parameters into municipal review documentation.
          </p>
        </div>

        <button
          onClick={() => navigate(`/proposals/${proposal.id}`)}
          className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors shadow-xs shrink-0 flex items-center gap-2"
        >
          <span>Open Proposal Workspace</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>

      {/* Main Review Card */}
      <div className="bg-white rounded-xl p-6 border border-border-subtle shadow-xs flex flex-col gap-6">
        {/* Dossier Summary Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-surface-subtle border border-border-subtle">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-text-muted uppercase">Target Candidate Site</span>
            <span className="text-lg font-bold text-text-primary">{site.code} — {site.name}</span>
            <span className="text-xs text-text-muted">{site.ward}</span>
          </div>
          <ScoreBadge score={site.opportunityScore} size="lg" />
        </div>

        {/* AI Synthesis Section */}
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
            <p>
              <strong>Executive Summary:</strong> <span className="font-mono text-emerald-800 font-bold">{site.code}</span> represents the premier candidate parcel for Solar-EV Charging Hub deployment in Nashik's Western Transit Corridor. With an Opportunity Score of <strong>84/100</strong> and an estimated <strong>2,450 m²</strong> parcel footprint, the site fulfills all primary ULB infrastructure criteria.
            </p>

            <ul className="list-disc pl-5 flex flex-col gap-1 text-xs text-text-secondary">
              <li><strong>Solar Irradiation:</strong> 88/100 score indicating optimal GHI solar yield with minimal shading.</li>
              <li><strong>EV Demand Density:</strong> High activity proxy driven by adjacent MSRTC Trimbak bus depot.</li>
              <li><strong>Electrical Feeder:</strong> Direct adjacency to 33kV MSEDCL feeder line reduces interconnection capex.</li>
              <li><strong>Environmental Risk:</strong> Zero hydrologic or drainage conflict detected in 50-year DEM flood model.</li>
            </ul>
          </div>
        </div>

        {/* Verification Checklist */}
        <div className="flex flex-col gap-3">
          <h3 className="text-base font-bold text-text-primary">Municipal Verification Checklist</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
              <span>PostGIS Spatial Intersect: Clear of River Floodways</span>
            </div>
            <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
              <span>MSEDCL Feeder Capacity: 33kV Substation Available</span>
            </div>
            <div className="p-3 rounded-lg border border-amber-200 bg-amber-50 text-amber-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-600 text-[18px]">pending</span>
              <span>Cadastral Survey: Verification Required Prior to Tender</span>
            </div>
            <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
              <span>Turf.js Plot Boundary: ~2,450 m² Usable Area Confirmed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
