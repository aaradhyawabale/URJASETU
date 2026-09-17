import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { OverviewDashboard } from '../pages/OverviewDashboard';
import { SiteIntelligence } from '../pages/SiteIntelligence';
import { RankedSites } from '../pages/RankedSites';
import { SiteComparison } from '../pages/SiteComparison';
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
          {/* Simplified 11-Step Journey Default Route: Clean Nashik Map Screen */}
          <Route path="/" element={<Navigate to="/sites" replace />} />
          <Route path="/dashboard" element={<Navigate to="/sites" replace />} />

          {/* Screen 2: Site Intelligence / 2D GIS Map */}
          <Route path="/sites" element={<SiteIntelligence />} />

          {/* Screen 3: Ranked Site Results / Site Comparison */}
          <Route path="/sites/ranked" element={<RankedSites />} />
          <Route path="/sites/compare" element={<SiteComparison />} />

          {/* Screen 4: Site Planning Workspace & Alias */}
          <Route path="/planning/:siteId" element={<SitePlanningWorkspace />} />
          <Route path="/sites/:siteId/plan" element={<SitePlanningWorkspace />} />

          {/* Screen 5: 3D Site Planner & Alias */}
          <Route path="/planning/:siteId/3d" element={<ThreeDSitePlanner />} />
          <Route path="/sites/:siteId/3d" element={<ThreeDSitePlanner />} />

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
