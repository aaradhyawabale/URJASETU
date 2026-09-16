import React from 'react';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const navItems = [
    {
      step: '1',
      label: '1. Map Landing',
      path: '/sites',
      icon: 'map',
      description: 'Nashik Map & Location',
    },
    {
      step: '2',
      label: '2. Priority Matrix',
      path: '/sites/ranked',
      icon: 'format_list_bulleted',
      description: 'Area Requirement & Shortlist',
    },
    {
      step: '3',
      label: '3. Site Comparison',
      path: '/sites/compare',
      icon: 'compare_arrows',
      description: 'Side-by-Side Trade-offs',
    },
    {
      step: '4',
      label: '4. 2D Plot Designer',
      path: '/planning/nashik-site-01',
      icon: 'design_services',
      description: '2D Layout & Capacity',
    },
    {
      step: '5',
      label: '5. 3D Spatial View',
      path: '/planning/nashik-site-01/3d',
      icon: 'view_in_ar',
      description: '3D Building & Solar View',
    },
    {
      step: '6',
      label: '6. AI Proposal Review',
      path: '/proposals/prop-nashik-01/review',
      icon: 'psychology',
      description: 'Gemini Technical Review',
    },
    {
      step: '7',
      label: '7. Saved Proposals',
      path: '/proposals',
      icon: 'folder_special',
      description: 'Proposal Dossier Library',
    },
    {
      step: 'D',
      label: 'Overview Dashboard',
      path: '/dashboard',
      icon: 'grid_view',
      description: 'Executive Matrix Overview',
    },
    {
      step: 'L',
      label: 'Data & Layers',
      path: '/data-layers',
      icon: 'layers',
      description: 'GIS Datasets & Provenance',
    },
  ];

  return (
    <aside className={`fixed left-0 top-0 h-full w-72 bg-white border-r border-border-subtle z-50 flex flex-col justify-between shadow-[0_1px_4px_rgba(0,0,0,0.04)] ${className}`}>
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center gap-3 border-b border-border-subtle">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            <span className="material-symbols-outlined text-[20px]">bolt</span>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold text-text-primary leading-none tracking-tight">UrjaSetu</span>
            <span className="text-[10px] text-primary tracking-wider uppercase font-semibold mt-1">Geospatial Intelligence</span>
          </div>
        </div>

        {/* Command Navigation */}
        <div className="px-3 py-3 overflow-y-auto max-h-[calc(100vh-160px)]">
          <div className="px-2 py-1 mb-1 text-[11px] font-semibold text-text-muted uppercase tracking-wider">
            Command Navigation
          </div>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                    isActive
                      ? 'bg-emerald-50 text-primary border border-emerald-200/80 font-semibold shadow-xs'
                      : 'text-text-secondary hover:bg-surface-subtle hover:text-text-primary'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-primary' : 'text-text-muted'}`}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Footer Status Panel */}
      <div className="p-3 m-3 bg-surface-subtle border border-border-subtle rounded-xl flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold text-primary flex items-center gap-1.5 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>LIVE FEEDS
          </span>
          <span className="text-[10px] font-mono text-text-secondary px-1.5 py-0.5 rounded bg-white border border-border-subtle">
            ULB-GRID
          </span>
        </div>
        <div className="text-[12px] text-text-secondary leading-snug">
          Maharashtra GIS Portal & DISCOM 11kV Feeder Overlay Online
        </div>
      </div>
    </aside>
  );
};
