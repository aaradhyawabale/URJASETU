import React from 'react';

interface DemoFallbackBannerProps {
  isFallback: boolean;
  message?: string;
}

export const DemoFallbackBanner: React.FC<DemoFallbackBannerProps> = ({ isFallback, message }) => {
  if (!isFallback) return null;

  return (
    <div className="bg-amber-50 border-l-4 border-amber-500 text-amber-800 p-3 mb-4 rounded-r shadow-xs text-xs flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="font-bold uppercase tracking-wider text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded">
          DEMO DATA
        </span>
        <span className="font-semibold">
          {message || 'DEMO data — backend unreachable'}
        </span>
      </div>
      <span className="text-[10px] text-amber-700 font-mono bg-amber-100 border border-amber-300 px-2 py-0.5 rounded">
        Offline Mode Active
      </span>
    </div>
  );
};
