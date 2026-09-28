import React from 'react';
import { NavLink } from 'react-router-dom';
import { CITY_CONFIG } from '../../config/cityConfig';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { path: '/sites', label: 'Overview Dashboard', icon: 'dashboard' },
  { path: '/sites/ranked', label: 'Ranked Candidate Sites', icon: 'format_list_bulleted' },
  { path: '/sites/compare', label: 'Site Comparison', icon: 'compare_arrows' },
  { path: '/proposals', label: 'Proposal Library', icon: 'folder' },
  { path: '/data-layers', label: 'Data & Analysis Layers', icon: 'layers' },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="fixed top-0 left-0 h-screen w-72 bg-white border-r border-border-subtle shadow-xs z-50 flex flex-col justify-between">
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="p-6 border-b border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[22px]">bolt</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-text-primary leading-tight tracking-tight">UrjaSetu</span>
              <span className="text-[10px] text-text-secondary font-mono tracking-wider uppercase">
                Geospatial Platform
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono font-semibold bg-emerald-50 text-primary border border-emerald-200 px-1.5 py-0.5 rounded">
            v1.0
          </span>
        </div>

        {/* Primary Navigation */}
        <div className="p-3">
          <div className="px-3 py-2 text-[10px] font-bold text-text-muted uppercase tracking-wider">
            Site Intelligence Engine
          </div>
          <nav className="flex flex-col gap-1 mt-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-50 text-primary border border-emerald-200 shadow-xs'
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
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>ACTIVE ULB
          </span>
          <span className="text-[10px] font-mono text-text-secondary px-1.5 py-0.5 rounded bg-white border border-border-subtle">
            {CITY_CONFIG.ulbCode}
          </span>
        </div>
        <div className="text-[11px] text-text-secondary leading-snug font-medium">
          {CITY_CONFIG.ulbName} ({CITY_CONFIG.cityName})
        </div>
      </div>
    </aside>
  );
};
