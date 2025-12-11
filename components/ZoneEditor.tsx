import React, { useState, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, Polygon, useMapEvents, Marker, Polyline, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LatLng } from '../types';
import { MAP_CENTER, MAP_ZOOM } from '../constants';
import { Button } from './ui';
import { Trash2, Check, RotateCcw, Plus, MousePointer, Move, X } from 'lucide-react';

// Custom marker icons
const createIcon = (color: string, isSelected: boolean = false) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: ${isSelected ? '18px' : '14px'};
      height: ${isSelected ? '18px' : '14px'};
      background: ${color};
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      cursor: ${isSelected ? 'move' : 'pointer'};
      transition: all 0.15s ease;
    "></div>`,
    iconSize: [isSelected ? 18 : 14, isSelected ? 18 : 14],
    iconAnchor: [isSelected ? 9 : 7, isSelected ? 9 : 7],
  });
};

interface ZoneEditorProps {
  initialPolygon?: LatLng[];
  onSave: (polygon: LatLng[]) => void;
  onCancel: () => void;
  color?: string;
}

type EditMode = 'draw' | 'select' | 'move';

function DrawingHandler({
  onPointAdd,
  mode,
}: {
  onPointAdd: (point: LatLng) => void;
  mode: EditMode;
}) {
  useMapEvents({
    click: (e) => {
      if (mode === 'draw') {
        onPointAdd({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    },
  });
  return null;
}

export const ZoneEditor: React.FC<ZoneEditorProps> = ({
  initialPolygon = [],
  onSave,
  onCancel,
  color = '#3b82f6',
}) => {
  const [points, setPoints] = useState<LatLng[]>(initialPolygon);
  const [mode, setMode] = useState<EditMode>(initialPolygon.length === 0 ? 'draw' : 'select');
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(null);

  const handlePointAdd = useCallback((point: LatLng) => {
    setPoints((prev) => [...prev, point]);
  }, []);

  const handleUndo = () => {
    setPoints((prev) => prev.slice(0, -1));
    setSelectedPointIndex(null);
  };

  const handleClear = () => {
    setPoints([]);
    setMode('draw');
    setSelectedPointIndex(null);
  };

  const handleDeletePoint = (index: number) => {
    setPoints((prev) => prev.filter((_, i) => i !== index));
    setSelectedPointIndex(null);
  };

  const handlePointDrag = (index: number, newPos: LatLng) => {
    setPoints((prev) => prev.map((p, i) => (i === index ? newPos : p)));
  };

  const handleMarkerClick = (index: number) => {
    if (mode === 'select') {
      setSelectedPointIndex(selectedPointIndex === index ? null : index);
    }
  };

  const handleSave = () => {
    if (points.length >= 3) {
      onSave(points);
    }
  };

  const modeConfig = {
    draw: { icon: Plus, label: 'Drawing', hint: 'Click on map to add points', color: 'bg-green-500' },
    select: { icon: MousePointer, label: 'Select', hint: 'Click points to select, then delete or drag', color: 'bg-blue-500' },
    move: { icon: Move, label: 'Move', hint: 'Drag points to reposition', color: 'bg-purple-500' },
  };

  // Create markers with drag capability
  const DraggableMarker = ({ point, index }: { point: LatLng; index: number }) => {
    const isSelected = selectedPointIndex === index;
    const eventHandlers = useMemo(
      () => ({
        click: () => handleMarkerClick(index),
        dragend: (e: L.DragEndEvent) => {
          const marker = e.target;
          const position = marker.getLatLng();
          handlePointDrag(index, { lat: position.lat, lng: position.lng });
        },
      }),
      [index]
    );

    return (
      <Marker
        position={[point.lat, point.lng]}
        icon={createIcon(isSelected ? '#ef4444' : color, isSelected)}
        draggable={mode === 'move' || isSelected}
        eventHandlers={eventHandlers}
      >
        <Tooltip direction="top" offset={[0, -10]} permanent={isSelected}>
          <span className="text-xs font-medium">Point {index + 1}</span>
        </Tooltip>
      </Marker>
    );
  };

  return (
    <div className="space-y-4">
      {/* Mode Toolbar */}
      <div className="flex items-center justify-between bg-slate-50 rounded-xl p-2">
        <div className="flex gap-1">
          {(Object.keys(modeConfig) as EditMode[]).map((m) => {
            const config = modeConfig[m];
            const Icon = config.icon;
            return (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  if (m !== 'select') setSelectedPointIndex(null);
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === m
                    ? `${config.color} text-white shadow-md`
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Icon size={16} />
                {config.label}
              </button>
            );
          })}
        </div>

        {selectedPointIndex !== null && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDeletePoint(selectedPointIndex)}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <Trash2 size={14} className="mr-1" /> Delete Point
          </Button>
        )}
      </div>

      {/* Hint Bar */}
      <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
        mode === 'draw' ? 'bg-green-50 text-green-700 border border-green-200' :
        mode === 'select' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
        'bg-purple-50 text-purple-700 border border-purple-200'
      }`}>
        {React.createElement(modeConfig[mode].icon, { size: 16 })}
        <span>{modeConfig[mode].hint}</span>
        <span className="ml-auto text-xs opacity-75">
          {points.length} point{points.length !== 1 ? 's' : ''} {points.length < 3 && '(min 3)'}
        </span>
      </div>

      {/* Map Container */}
      <div className="relative rounded-xl overflow-hidden shadow-lg border border-slate-200">
        <MapContainer
          center={[MAP_CENTER.lat, MAP_CENTER.lng]}
          zoom={MAP_ZOOM}
          style={{ height: '400px', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          {/* Show polygon if we have 3+ points */}
          {points.length >= 3 && (
            <Polygon
              positions={points.map((p) => [p.lat, p.lng] as [number, number])}
              pathOptions={{
                color: color,
                fillColor: color,
                fillOpacity: 0.2,
                weight: 3,
                dashArray: mode === 'draw' ? '5, 10' : undefined,
              }}
            />
          )}

          {/* Show connecting lines while drawing */}
          {points.length >= 2 && points.length < 3 && (
            <Polyline
              positions={points.map((p) => [p.lat, p.lng] as [number, number])}
              pathOptions={{ color: color, weight: 2, dashArray: '5, 10' }}
            />
          )}

          {/* Markers for each point */}
          {points.map((point, index) => (
            <DraggableMarker key={index} point={point} index={index} />
          ))}

          <DrawingHandler onPointAdd={handlePointAdd} mode={mode} />
        </MapContainer>

        {/* Floating point count badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md text-sm font-medium text-slate-700 z-[1000]">
          {points.length} / 3+ points
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-2">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleUndo} disabled={points.length === 0}>
            <RotateCcw size={16} className="mr-1" /> Undo
          </Button>
          <Button variant="outline" size="sm" onClick={handleClear} disabled={points.length === 0}>
            <X size={16} className="mr-1" /> Clear All
          </Button>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={points.length < 3}>
            <Check size={16} className="mr-1" /> Save Zone
          </Button>
        </div>
      </div>
    </div>
  );
};
