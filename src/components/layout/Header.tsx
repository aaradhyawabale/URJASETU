import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-72 right-0 h-16 bg-white/95 backdrop-blur-md z-40 border-b border-border-subtle shadow-xs">
      <div className="h-16 w-full px-6 flex items-center justify-between gap-4">
        {/* Left Side: City Badge & Workflow Breadcrumb */}
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-surface-subtle border border-border-subtle px-3 py-1.5 rounded-full cursor-pointer hover:bg-slate-100 transition-colors gap-2">
            <span className="material-symbols-outlined text-primary text-[18px]">location_city</span>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-text-primary">Nashik, Maharashtra</span>
              <span className="text-[10px] font-semibold bg-emerald-50 text-primary border border-emerald-200 px-1.5 py-0.5 rounded">
                Tier-2 ULB
              </span>
            </div>
            <span className="material-symbols-outlined text-text-muted text-[16px]">keyboard_arrow_down</span>
          </div>

          <div className="hidden xl:flex items-center bg-surface-subtle border border-border-subtle px-3 py-1 rounded-full gap-1 text-[11px] font-semibold tracking-wider">
            <span className="text-primary font-bold">FIND</span>
            <span className="text-text-muted">→</span>
            <span className="text-text-secondary">SCREEN</span>
            <span className="text-text-muted">→</span>
            <span className="text-text-secondary">MEASURE</span>
            <span className="text-text-muted">→</span>
            <span className="text-text-secondary">VISUALIZE</span>
            <span className="text-text-muted">→</span>
            <span className="text-text-secondary">EXPLAIN</span>
            <span className="text-text-muted">→</span>
            <span className="text-text-secondary">DECIDE</span>
          </div>
        </div>

        {/* Right Side: Demo Mode, Help & Profile */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-1.5 bg-surface-subtle border border-border-subtle px-3 py-1 rounded-full text-[11px] font-medium text-text-secondary">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Demo Data • Nashik City Seed</span>
          </div>

          <div className="flex items-center gap-2 pl-2">
            <div className="flex flex-col text-right hidden lg:flex">
              <span className="text-xs font-semibold text-text-primary leading-tight">R. Deshmukh</span>
              <span className="text-[10px] text-text-secondary">Town Planning Dept</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-primary flex items-center justify-center font-semibold border border-emerald-200 shadow-xs">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
