import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, useMapEvents, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Zone, LatLng } from '../types';
import { MAP_CENTER, MAP_ZOOM } from '../constants';

// Custom location marker icon
const locationIcon = L.divIcon({
  className: 'custom-location-marker',
  html: `
    <div style="position: relative;">
      <div style="
        width: 24px;
        height: 24px;
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        border: 3px solid white;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 3px 10px rgba(0,0,0,0.3);
      "></div>
      <div style="
        position: absolute;
        top: 6px;
        left: 6px;
        width: 12px;
        height: 12px;
        background: white;
        border-radius: 50%;
        transform: rotate(-45deg);
      "></div>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
});

interface ZoneDisplayMapProps {
  zones: Zone[];
  selectedPoint?: LatLng | null;
  onPointSelect?: (point: LatLng) => void;
  height?: string;
  showZoneLabels?: boolean;
}

// Component to handle map clicks
function MapClickHandler({ onPointSelect }: { onPointSelect?: (point: LatLng) => void }) {
  useMapEvents({
    click: (e) => {
      if (onPointSelect) {
        onPointSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    },
  });
  return null;
}

// Component to recenter map when point changes
function MapRecenter({ point }: { point: LatLng | null }) {
  const map = useMap();
  useEffect(() => {
    if (point) {
      map.setView([point.lat, point.lng], map.getZoom(), { animate: true });
    }
  }, [point, map]);
  return null;
}

export const ZoneDisplayMap: React.FC<ZoneDisplayMapProps> = ({
  zones,
  selectedPoint,
  onPointSelect,
  height = '400px',
  showZoneLabels = true,
}) => {
  return (
    <div className="relative rounded-xl overflow-hidden shadow-lg border border-slate-200">
      <MapContainer
        center={[MAP_CENTER.lat, MAP_CENTER.lng]}
        zoom={MAP_ZOOM}
        style={{ height, width: '100%' }}
        className="z-0"
      >
        {/* Modern map tiles - Voyager style */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* Zone polygons */}
        {zones.map((zone) => (
          <Polygon
            key={zone.id}
            positions={zone.polygon.map((p) => [p.lat, p.lng] as [number, number])}
            pathOptions={{
              color: zone.color || '#3b82f6',
              fillColor: zone.color || '#3b82f6',
              fillOpacity: 0.25,
              weight: 3,
            }}
            eventHandlers={
              onPointSelect
                ? {
                    click: (e) => {
                      // Prevent popup from opening in selection mode
                      L.DomEvent.stopPropagation(e.originalEvent);
                      onPointSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
                    },
                  }
                : undefined
            }
          >
            {/* Only show popup when NOT in selection mode */}
            {showZoneLabels && !onPointSelect && (
              <Popup>
                <div className="min-w-[150px]">
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: zone.color }}
                    />
                    <strong className="text-slate-800">{zone.name}</strong>
                  </div>
                  <p className="text-slate-500 text-xs">{zone.description}</p>
                  <div className="mt-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Cleanliness</span>
                      <span className="font-medium text-slate-700">{zone.cleanlinessScore}%</span>
                    </div>
                    <div className="mt-1 w-full bg-slate-200 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full transition-all"
                        style={{
                          width: `${zone.cleanlinessScore}%`,
                          backgroundColor: zone.color,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Popup>
            )}
          </Polygon>
        ))}

        {/* Selected location marker */}
        {selectedPoint && (
          <Marker position={[selectedPoint.lat, selectedPoint.lng]} icon={locationIcon}>
            <Popup>
              <div className="text-center">
                <div className="font-medium text-slate-800">Selected Location</div>
                <div className="text-xs text-slate-500 mt-1">
                  {selectedPoint.lat.toFixed(6)}, {selectedPoint.lng.toFixed(6)}
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        <MapClickHandler onPointSelect={onPointSelect} />
        <MapRecenter point={selectedPoint || null} />
      </MapContainer>

      {/* Floating zone legend */}
      {zones.length > 0 && (
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 z-[1000] max-w-[200px]">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Zones</div>
          <div className="space-y-1.5">
            {zones.map((zone) => (
              <div key={zone.id} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: zone.color }}
                />
                <span className="text-xs text-slate-700 truncate">{zone.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Click hint overlay */}
      {onPointSelect && !selectedPoint && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-slate-800/80 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full z-[1000]">
          Click on map to select location
        </div>
      )}
    </div>
  );
};
