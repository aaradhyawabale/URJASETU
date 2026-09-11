import React from 'react';
import { CENTRAL_GIS_LAYERS_REGISTRY } from '../gis/data/layersRegistry';

export const DataAnalysisLayers: React.FC = () => {
  return (
    <div className="p-6 xl:p-8 flex flex-col gap-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-border-subtle shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-primary uppercase tracking-wider bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              Spatial Layer Registry
            </span>
            <span className="text-[11px] font-mono text-text-secondary bg-surface-subtle border border-border-subtle px-2 py-0.5 rounded">
              EPSG:4326 WGS84
            </span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary mt-1">Data & Analysis Layers Catalog</h1>
          <p className="text-xs text-text-secondary mt-1">
            Authoritative spatial datasets powering the UrjaSetu Site Intelligence Engine for Nashik Municipal Corporation.
          </p>
        </div>
      </div>

      {/* Layers Catalog List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CENTRAL_GIS_LAYERS_REGISTRY.map((layer) => (
          <div key={layer.id} className="bg-white rounded-xl p-5 border border-border-subtle shadow-xs flex flex-col justify-between gap-3">
            <div>
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  {layer.type}
                </span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  {layer.status}
                </span>
              </div>

              <h3 className="text-base font-bold text-text-primary mt-2">{layer.name}</h3>
              <p className="text-xs text-text-secondary leading-relaxed mt-1">{layer.description}</p>
            </div>

            <div className="flex flex-col gap-1.5 pt-3 border-t border-border-subtle text-[11px] text-text-muted">
              <div className="flex justify-between">
                <span>Data Source:</span>
                <span className="font-semibold text-text-primary">{layer.source}</span>
              </div>
              <div className="flex justify-between">
                <span>Coverage Scope:</span>
                <span className="font-medium text-text-secondary">{layer.coverage}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
