import React from 'react';

interface ScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score, size = 'md' }) => {
  let bgColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (score < 60) {
    bgColor = 'bg-red-50 text-red-700 border-red-200';
  } else if (score < 75) {
    bgColor = 'bg-amber-50 text-amber-700 border-amber-200';
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 font-semibold',
    md: 'text-sm px-2.5 py-1 font-bold',
    lg: 'text-base px-3 py-1.5 font-extrabold',
  };

  return (
    <div className={`inline-flex items-center gap-1.5 border rounded-lg ${bgColor} ${sizeClasses[size]}`}>
      <span className="material-symbols-outlined text-[16px]">bolt</span>
      <span>{score}</span>
      <span className="text-[10px] font-medium opacity-80">/100</span>
    </div>
  );
};
