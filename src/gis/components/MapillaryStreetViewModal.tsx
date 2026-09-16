import React, { useState } from 'react';

interface MapillaryStreetViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  lat?: number;
  lng?: number;
  title?: string;
}

export const MapillaryStreetViewModal: React.FC<MapillaryStreetViewModalProps> = ({
  isOpen,
  onClose,
  lat = 19.9975,
  lng = 73.7898,
  title = 'Nashik Street-Level Visual Inspection',
}) => {
  const [activeProvider, setActiveProvider] = useState<'MAPILLARY' | 'KARTAVIEW' | 'AERIAL'>('MAPILLARY');

  if (!isOpen) return null;

  // Embedded URLs for Street View visual inspection
  const mapillaryUrl = `https://www.mapillary.com/app/?lat=${lat}&lng=${lng}&z=17&focus=map`;
  const kartaviewUrl = `https://kartaview.org/map/@${lat},${lng},17z`;
  const satelliteUrl = `https://www.google.com/maps/@?api=1&map_action=map&center=${lat},${lng}&zoom=19&basemap=satellite`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">📸</span>
            <div>
              <h3 className="text-sm font-bold text-white">{title}</h3>
              <p className="text-xs text-slate-400 font-mono">
                Lat: {lat.toFixed(5)}°N, Lng: {lng.toFixed(5)}°E (Nashik, MH)
              </p>
            </div>
          </div>

          {/* Provider Tabs */}
          <div className="flex items-center bg-slate-900 p-1 rounded-lg border border-slate-700 text-xs">
            <button
              onClick={() => setActiveProvider('MAPILLARY')}
              className={`px-3 py-1 rounded-md font-bold transition-colors ${
                activeProvider === 'MAPILLARY'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Mapillary Open Street
            </button>
            <button
              onClick={() => setActiveProvider('KARTAVIEW')}
              className={`px-3 py-1 rounded-md font-bold transition-colors ${
                activeProvider === 'KARTAVIEW'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              KartaView Corridor
            </button>
            <button
              onClick={() => setActiveProvider('AERIAL')}
              className={`px-3 py-1 rounded-md font-bold transition-colors ${
                activeProvider === 'AERIAL'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Aerial Bird's-Eye
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Modal Body / Provider Frame */}
        <div className="flex-1 bg-slate-950 relative overflow-hidden">
          {activeProvider === 'MAPILLARY' && (
            <iframe
              src={mapillaryUrl}
              title="Mapillary Nashik Street View"
              className="w-full h-full border-0"
              allow="geolocation"
            />
          )}

          {activeProvider === 'KARTAVIEW' && (
            <iframe
              src={kartaviewUrl}
              title="KartaView Nashik Street View"
              className="w-full h-full border-0"
              allow="geolocation"
            />
          )}

          {activeProvider === 'AERIAL' && (
            <iframe
              src={satelliteUrl}
              title="Satellite High-Res Aerial View"
              className="w-full h-full border-0"
            />
          )}

          {/* Footer Provenance Note */}
          <div className="absolute bottom-3 left-4 bg-slate-900/90 border border-slate-700 px-3 py-1.5 rounded-lg text-[10px] text-slate-300 font-mono backdrop-blur-md shadow-md">
            <span>Source: </span>
            <strong className="text-emerald-400">
              {activeProvider === 'MAPILLARY' ? 'Mapillary CC-BY-SA Imagery' : activeProvider === 'KARTAVIEW' ? 'KartaView Open Imagery' : 'High-Res Aerial Vector Satellite'}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};
