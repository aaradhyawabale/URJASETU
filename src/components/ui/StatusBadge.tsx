import React from 'react';
import { SiteStatus } from '../../types/site';

interface StatusBadgeProps {
  status: SiteStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  switch (status) {
    case 'RECOMMENDED':
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
          Recommended Site
        </span>
      );
    case 'UNDER_REVIEW':
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>
          Under Review
        </span>
      );
    case 'SCREENING':
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mr-1.5"></span>
          Screening Active
        </span>
      );
    case 'DISQUALIFIED':
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5"></span>
          Disqualified
        </span>
      );
    default:
      return null;
  }
};
