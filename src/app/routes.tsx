import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { OverviewDashboard } from '../pages/OverviewDashboard';
import { SiteIntelligence } from '../pages/SiteIntelligence';
import { RankedSites } from '../pages/RankedSites';
import { SitePlanningWorkspace } from '../pages/SitePlanningWorkspace';
import { ThreeDSitePlanner } from '../pages/ThreeDSitePlanner';
import { AIProposalReview } from '../pages/AIProposalReview';
import { ProposalWorkspace } from '../pages/ProposalWorkspace';
import { SavedProposals } from '../pages/SavedProposals';
import { DataAnalysisLayers } from '../pages/DataAnalysisLayers';

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          {/* Screen 1: Overview / Municipal Dashboard */}
          <Route path="/" element={<OverviewDashboard />} />
          <Route path="/dashboard" element={<OverviewDashboard />} />

          {/* Screen 2: Site Intelligence / 2D GIS Map */}
          <Route path="/sites" element={<SiteIntelligence />} />

          {/* Screen 3: Ranked Site Results / Site Comparison */}
          <Route path="/sites/ranked" element={<RankedSites />} />

          {/* Screen 4: Site Planning Workspace */}
          <Route path="/planning/:siteId" element={<SitePlanningWorkspace />} />

          {/* Screen 5: 3D Site Planner */}
          <Route path="/planning/:siteId/3d" element={<ThreeDSitePlanner />} />

          {/* Screen 6: AI Proposal Review */}
          <Route path="/proposals/:id/review" element={<AIProposalReview />} />

          {/* Screen 7: Proposal Workspace */}
          <Route path="/proposals/:id" element={<ProposalWorkspace />} />

          {/* Screen 8: Saved Proposals */}
          <Route path="/proposals" element={<SavedProposals />} />

          {/* Screen 9: Data & Analysis Layers */}
          <Route path="/data-layers" element={<DataAnalysisLayers />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
};
