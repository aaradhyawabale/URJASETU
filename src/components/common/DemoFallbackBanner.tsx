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
          DEMO MODE
        </span>
        <span>
          {message || 'Backend unreachable — Displaying precomputed Pune candidate dataset.'}
        </span>
      </div>
      <span className="text-[10px] text-amber-600 font-mono">
        Offline Mode Active
      </span>
    </div>
  );
};
