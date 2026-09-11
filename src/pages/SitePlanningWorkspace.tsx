import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSiteById } from '../services/api/sites';
import { createProposal } from '../services/api/proposals';
import { CandidateSite, InfrastructureType } from '../types/site';
import { InteractivePlotDrawer } from '../gis/components/InteractivePlotDrawer';
import { ScoreBadge } from '../components/ui/ScoreBadge';

export const SitePlanningWorkspace: React.FC = () => {
  const { siteId } = useParams<{ siteId: string }>();
  const navigate = useNavigate();

  const [site, setSite] = useState<CandidateSite | null>(null);
  const [plotAreaSqm, setPlotAreaSqm] = useState<number>(2450);
  const [selectedInfra, setSelectedInfra] = useState<InfrastructureType>('SOLAR_EV_CHARGING_HUB');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadSite() {
      if (siteId) {
        const res = await getSiteById(siteId);
        setSite(res.site);
        if (res.site.areaSqm) setPlotAreaSqm(res.site.areaSqm);
      }
    }
    loadSite();
  }, [siteId]);

  const handleCreateProposalAndProceed = async () => {
    if (!site) return;
    setIsSaving(true);
    await createProposal({
      siteId: site.id,
      siteCode: site.code,
      title: `${site.code} ${selectedInfra.replace(/_/g, ' ')} Proposal`,
      opportunityScore: site.opportunityScore,
      estimatedAreaSqm: plotAreaSqm,
      infrastructureType: selectedInfra,
      aiSummary: `${site.code} parcel planning completed with ${plotAreaSqm.toLocaleString()} m² plot area and ${selectedInfra} infrastructure selection.`,
    });

    setIsSaving(false);
    navigate(`/planning/${site.id}/3d`);
  };

  return (
    <div className="relative w-full h-[calc(100vh-64px)] flex overflow-hidden">
      {/* Interactive Turf.js Plot Drawing Canvas (70% width) */}
      <div className="flex-1 relative bg-slate-100 h-full flex flex-col">
        <InteractivePlotDrawer
          initialAreaSqm={plotAreaSqm}
          onAreaChange={(newArea) => setPlotAreaSqm(newArea)}
        />
      </div>

      {/* Right Side Panel: Infrastructure Selection & Parameters (30% width) */}
      <div className="w-[380px] bg-white border-l border-border-subtle h-full flex flex-col justify-between overflow-y-auto shadow-md">
        {site ? (
          <div className="p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-border-subtle pb-4">
              <div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Site Planning Workspace</span>
                <h2 className="text-xl font-bold text-text-primary mt-0.5">{site.code}</h2>
              </div>
              <ScoreBadge score={site.opportunityScore} size="md" />
            </div>

            <div>
              <span className="text-xs text-text-muted">Selected Parcel</span>
              <h3 className="text-sm font-bold text-text-primary">{site.name}</h3>
              <p className="text-xs text-text-secondary mt-0.5">{site.ward || site.wardName}</p>
            </div>

            {/* Infrastructure Type Selection */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-text-primary uppercase tracking-wider">
                Select Infrastructure Model
              </label>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setSelectedInfra('SOLAR_EV_CHARGING_HUB')}
                  className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                    selectedInfra === 'SOLAR_EV_CHARGING_HUB'
                      ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-500/20'
                      : 'bg-white border-border-subtle hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text-primary">Solar-EV Charging Hub</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-semibold">
                      Recommended
                    </span>
                  </div>
                  <p className="text-[11px] text-text-secondary">
                    Integrated 500kW rooftop/canopy solar PV + 8 DC fast charger bays.
                  </p>
                </button>

                <button
                  onClick={() => setSelectedInfra('STANDALONE_EV_STATION')}
                  className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                    selectedInfra === 'STANDALONE_EV_STATION'
                      ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-500/20'
                      : 'bg-white border-border-subtle hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xs font-bold text-text-primary">Standalone EV Fast Station</span>
                  <p className="text-[11px] text-text-secondary">Grid-connected DC fast charger cluster without solar array.</p>
                </button>
              </div>
            </div>

            {/* Plot Area Summary Card */}
            <div className="p-4 rounded-xl bg-surface-subtle border border-border-subtle flex flex-col gap-2">
              <span className="text-[10px] font-bold text-text-muted uppercase">Drawn Boundary Area Summary</span>
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-text-secondary">Estimated Plot Area:</span>
                <span className="text-lg font-bold text-primary font-mono">{plotAreaSqm.toLocaleString()} m²</span>
              </div>
              <p className="text-[11px] text-text-muted">Calculated via Turf.js browser-side polygon area computation engine.</p>
            </div>
          </div>
        ) : (
          <div className="p-6 text-xs text-text-muted">Loading planning workspace...</div>
        )}

        {/* CTA Footer */}
        {site && (
          <div className="p-4 bg-surface-subtle border-t border-border-subtle flex flex-col gap-2">
            <button
              onClick={handleCreateProposalAndProceed}
              disabled={isSaving}
              className="w-full py-2.5 px-4 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">view_in_ar</span>
              <span>{isSaving ? 'Saving Planning Payload...' : 'Launch 3D Site Planner'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
