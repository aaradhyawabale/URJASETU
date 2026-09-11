import React from 'react';

export const DataAnalysisLayers: React.FC = () => {
  const layersList = [
    {
      name: 'Global Horizontal Irradiance (GHI) Solar Layer',
      source: 'NREL / SolarGIS Data Proxy',
      type: 'Raster Heatmap Overlay',
      status: 'Active • High Resolution',
      description: 'Annual solar irradiance profile across Nashik Municipal Corporation boundaries, highlighting high GHI zones for PV canopy yields.',
    },
    {
      name: 'Activity-Based EV Demand Proxy Layer',
      source: 'OpenStreetMap POI Density & MSRTC Bus Routes',
      type: 'Vector Point Density Proxy',
      status: 'Active • Precalculated',
      description: 'Composite demand score calculated from commercial POI density, transit hubs, and main arterial traffic volume.',
    },
    {
      name: 'Digital Elevation Model (DEM) & Flood Risk Surface',
      source: 'Open DEM (30m Resolution)',
      type: 'Terrain Slope & Hydrologic Buffer',
      status: 'Active • 50-Year Flood Model',
      description: 'Elevation slope vector mapping Godavari river basin floodways to automatically disqualify high-risk riparian parcels.',
    },
    {
      name: 'MSEDCL 33kV / 11kV Substation & Feeder Network',
      source: 'MSEDCL DISCOM Feeder Map',
      type: 'Vector Polyline Network',
      status: 'Active • Power Grid Overlay',
      description: 'Electrical utility feeder lines and substation locations to ensure minimal interconnection capex for high-power EV fast chargers.',
    },
  ];

  return (
    <div className="p-6 xl:p-8 flex flex-col gap-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-border-subtle shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-primary uppercase tracking-wider bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              Spatial Registry
            </span>
            <span className="text-[11px] font-mono text-text-secondary bg-surface-subtle border border-border-subtle px-2 py-0.5 rounded">
              EPSG:4326 Projection
            </span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary mt-1">Data & Analysis Layers Catalog</h1>
          <p className="text-xs text-text-secondary mt-1">
            Authoritative geospatial layers used by the UrjaSetu Site Intelligence Engine for Nashik Municipal Agglomeration.
          </p>
        </div>
      </div>

      {/* Layers Catalog List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {layersList.map((layer, index) => (
          <div key={index} className="bg-white rounded-xl p-5 border border-border-subtle shadow-xs flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                {layer.type}
              </span>
              <span className="text-xs font-medium text-emerald-700">{layer.status}</span>
            </div>

            <h3 className="text-base font-bold text-text-primary">{layer.name}</h3>
            <p className="text-xs text-text-secondary leading-relaxed">{layer.description}</p>

            <div className="mt-2 pt-3 border-t border-border-subtle text-[11px] text-text-muted flex justify-between">
              <span>Source Provider:</span>
              <span className="font-semibold text-text-primary">{layer.source}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
