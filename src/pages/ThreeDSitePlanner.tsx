import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSiteById } from '../services/api/sites';
import { CandidateSite } from '../types/site';

export const ThreeDSitePlanner: React.FC = () => {
  const { siteId } = useParams<{ siteId: string }>();
  const navigate = useNavigate();

  const [site, setSite] = useState<CandidateSite | null>(null);
  const [rotation, setRotation] = useState<number>(45);
  const [scale, setScale] = useState<number>(1.0);
  const [solarElevation, setSolarElevation] = useState<number>(45);

  useEffect(() => {
    async function loadSite() {
      if (siteId) {
        const res = await getSiteById(siteId);
        setSite(res.site);
      }
    }
    loadSite();
  }, [siteId]);

  // Derived conceptual 3D micro-shading proxy calculations
  const estimatedBuildingHeight = 10.5; // DERIVED_ESTIMATED_BUILDING_HEIGHT_PROXY (3 floors @ 3.5m)
  const elevRad = (Math.max(5, solarElevation) * Math.PI) / 180;
  const shadowLengthMeters = Number((estimatedBuildingHeight / Math.tan(elevRad)).toFixed(1));
  const shadingLossPercent = Number(Math.min(30, (shadowLengthMeters / 40) * 15).toFixed(1));
  const regionalGhi = 5.02; // NASA POWER annual mean baseline
  const effectiveGhi = Number((regionalGhi * (1 - shadingLossPercent / 100)).toFixed(2));

  return (
    <div className="relative w-full h-[calc(100vh-64px)] flex overflow-hidden">
      {/* 3D Viewport Canvas (75% width) */}
      <div className="flex-1 relative bg-slate-900 h-full flex flex-col justify-between">
        {/* Top 3D Status Overlay */}
        <div className="absolute top-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-700 text-white shadow-lg flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-400 text-[20px]">view_in_ar</span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">3D Conceptual Planner</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-xs font-mono text-slate-300">Interactive 3D Visual Canvas (CONCEPTUAL_3D_PLOT_SHADOW_SCREENING_PROXY)</span>
          <span className="text-slate-600">|</span>
          <span className="text-xs text-slate-300">{site ? site.code : 'NASHIK-SITE-01'} Parcel Overlay</span>
        </div>

        {/* 3D Canvas Mock Representation */}
        <div className="w-full h-full relative select-none overflow-hidden flex items-center justify-center">
          {/* 3D Rendering Canvas Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 flex items-center justify-center">
            {/* Grid Mesh */}
            <svg className="w-full h-full opacity-30" viewBox="0 0 1000 600">
              <defs>
                <pattern id="grid3d" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#64748b" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="1000" height="600" fill="url(#grid3d)" />
            </svg>

            {/* Simulated 3D Solar-EV Hub Conceptual Model */}
            <div className="relative z-10 flex flex-col items-center justify-center transition-all duration-300" style={{ transform: `rotate(${rotation}deg) scale(${scale})` }}>
              {/* Solar Canopy 3D Structure */}
              <div className="w-64 h-36 bg-emerald-600/40 border-2 border-emerald-400 rounded-xl shadow-2xl backdrop-blur-md flex flex-col items-center justify-center relative p-3">
                <div className="w-full h-full bg-emerald-500/20 border border-emerald-300/40 rounded-lg flex flex-col items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-emerald-300 text-[36px]">solar_power</span>
                  <span className="text-xs font-bold text-white tracking-widest uppercase">Solar Canopy Structure</span>
                  <span className="text-[10px] text-emerald-200">DC Fast Charger Hub Concept</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3D Legend Overlay */}
          <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-700 text-xs text-slate-300 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>3D Model: Conceptual Solar Canopy Structure</span>
            <span className="text-slate-600">|</span>
            <span>Scale: {scale.toFixed(1)}x</span>
            <span className="text-slate-600">|</span>
            <span>Shadow Length: {shadowLengthMeters}m</span>
          </div>
        </div>
      </div>

      {/* Right Control Side Panel (25% width) */}
      <div className="w-[360px] bg-white border-l border-border-subtle h-full flex flex-col justify-between overflow-y-auto shadow-md">
        {site ? (
          <div className="p-6 flex flex-col gap-5">
            <div className="border-b border-border-subtle pb-4">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">3D Placement & Solar Controls</span>
              <h2 className="text-xl font-bold text-text-primary mt-0.5">{site.code}</h2>
              <p className="text-xs text-text-muted mt-1">{site.name}</p>
            </div>

            {/* Rotation Controls */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-semibold text-text-primary">
                <span>Model Rotation</span>
                <span className="font-mono text-primary">{rotation}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={rotation}
                onChange={(e) => setRotation(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>

            {/* Scale Controls */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-semibold text-text-primary">
                <span>Model Scale</span>
                <span className="font-mono text-primary">{scale.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>

            {/* Solar Elevation Slider & Micro-Shading Proxy */}
            <div className="flex flex-col gap-2 pt-3 border-t border-border-subtle">
              <div className="flex justify-between text-xs font-semibold text-text-primary">
                <span>Solar Elevation Angle</span>
                <span className="font-mono text-amber-600">{solarElevation}°</span>
              </div>
              <input
                type="range"
                min="10"
                max="85"
                value={solarElevation}
                onChange={(e) => setSolarElevation(Number(e.target.value))}
                className="w-full accent-amber-500"
              />

              <div className="mt-2 p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs flex flex-col gap-1.5">
                <div className="flex items-center justify-between font-bold text-amber-900">
                  <span>Micro-Shading Screening</span>
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-mono">
                    PROXY
                  </span>
                </div>
                <div className="flex justify-between text-amber-900">
                  <span>Projected Building Shadow:</span>
                  <span className="font-bold">{shadowLengthMeters} meters</span>
                </div>
                <div className="flex justify-between text-amber-900">
                  <span>Estimated Shading Loss:</span>
                  <span className="font-bold">{shadingLossPercent}%</span>
                </div>
                <div className="flex justify-between text-amber-900">
                  <span>Shaded GHI Irradiance:</span>
                  <span className="font-bold">{effectiveGhi} kWh/m²/day</span>
                </div>
              </div>
            </div>

            {/* 3D Context & Provenance Note */}
            <div className="p-4 rounded-xl bg-surface-subtle border border-border-subtle flex flex-col gap-2 text-xs">
              <span className="font-bold text-text-primary uppercase text-[10px]">Data Provenance & Disclaimer</span>
              <p className="text-text-secondary leading-relaxed">
                High-resolution 1m LiDAR / 3D building mesh is unavailable for Nashik. Micro-shading loss and shadow projections are <strong>CONCEPTUAL_3D_PLOT_SHADOW_SCREENING_PROXY</strong> models calculated from OSM building height proxies (3.5m/floor).
              </p>
            </div>
          </div>
        ) : (
          <div className="p-6 text-xs text-text-muted">Loading 3D workspace...</div>
        )}

        {/* CTA Footer */}
        {site && (
          <div className="p-4 bg-surface-subtle border-t border-border-subtle flex flex-col gap-2">
            <button
              onClick={() => navigate('/proposals/prop-nashik-01/review')}
              className="w-full py-2.5 px-4 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">psychology</span>
              <span>Proceed to AI Proposal Review</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
