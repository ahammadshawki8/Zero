import React, { useState } from 'react';
import { Card, Button, Input, Toast } from '../../components/ui';
import { MOCK_ZONES } from '../../constants';
import { Zone, LatLng } from '../../types';
import { ZoneDisplayMap } from '../../components/ZoneMap';
import { ZoneEditor } from '../../components/ZoneEditor';
import { Filter, Plus, Edit2, Trash2, MapPin, X } from 'lucide-react';

type ModalMode = 'none' | 'add' | 'edit' | 'view';

const ZONE_COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export const AdminZones = () => {
  const [zones, setZones] = useState<Zone[]>(MOCK_ZONES);
  const [modalMode, setModalMode] = useState<ModalMode>('none');
  const [editingZone, setEditingZone] = useState<Zone | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [tempPolygon, setTempPolygon] = useState<LatLng[]>([]);
  const [toast, setToast] = useState({ show: false, message: '', type: 'error' as const });

  const handleAddNew = () => {
    setModalMode('add');
    setFormData({ name: '', description: '' });
    setTempPolygon([]);
    setEditingZone(null);
  };

  const handleEdit = (zone: Zone) => {
    setModalMode('edit');
    setFormData({ name: zone.name, description: zone.description });
    setTempPolygon(zone.polygon);
    setEditingZone(zone);
  };

  const handleDelete = (zoneId: string) => {
    if (confirm('Are you sure you want to delete this zone?')) {
      setZones(zones.filter(z => z.id !== zoneId));
    }
  };

  const handleSavePolygon = (polygon: LatLng[]) => {
    setTempPolygon(polygon);
  };

  const handleSaveZone = () => {
    if (!formData.name || tempPolygon.length < 3) {
      setToast({ show: true, message: 'Please provide a name and draw a zone boundary (at least 3 points)', type: 'error' });
      return;
    }

    if (modalMode === 'add') {
      const newZone: Zone = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        cleanlinessScore: 100,
        polygon: tempPolygon,
        color: ZONE_COLORS[zones.length % ZONE_COLORS.length],
      };
      setZones([...zones, newZone]);
    } else if (modalMode === 'edit' && editingZone) {
      setZones(zones.map(z => 
        z.id === editingZone.id 
          ? { ...z, name: formData.name, description: formData.description, polygon: tempPolygon }
          : z
      ));
    }

    setModalMode('none');
    setEditingZone(null);
  };

  const handleCancel = () => {
    setModalMode('none');
    setEditingZone(null);
  };

  return (
    <>
      <Toast
        isOpen={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
        message={toast.message}
        type={toast.type}
      />
      <div className="space-y-6">
      {/* Zone Map Overview */}
      <Card title="Zone Map Overview">
        <ZoneDisplayMap zones={zones} height="350px" />
        <div className="mt-4 flex flex-wrap gap-2">
          {zones.map(zone => (
            <div key={zone.id} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: zone.color }}
              />
              <span>{zone.name}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Zones Table */}
      <Card title="Zones Management">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input placeholder="Search zones..." className="w-full sm:w-64" />
            <Button variant="outline" className="w-full sm:w-auto"><Filter size={16} className="mr-2" /> Filter</Button>
          </div>
          <Button onClick={handleAddNew} className="w-full sm:w-auto"><Plus size={16} className="mr-2" /> Add Zone</Button>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-3">Color</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3">Boundary Points</th>
                <th className="px-6 py-3">Cleanliness Score</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {zones.map((zone) => (
                <tr key={zone.id}>
                  <td className="px-6 py-4">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: zone.color }}
                    />
                  </td>
                  <td className="px-6 py-4 font-medium">{zone.name}</td>
                  <td className="px-6 py-4 text-slate-500">{zone.description}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-slate-500">
                      <MapPin size={14} /> {zone.polygon.length} points
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-slate-200 rounded-full h-2.5 max-w-[100px]">
                        <div 
                          className="bg-green-600 h-2.5 rounded-full" 
                          style={{ width: `${zone.cleanlinessScore}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium">{zone.cleanlinessScore}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <button 
                      className="text-slate-400 hover:text-blue-600"
                      onClick={() => handleEdit(zone)}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      className="text-slate-400 hover:text-red-600"
                      onClick={() => handleDelete(zone.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {zones.map((zone) => (
            <div key={zone.id} className="p-4 bg-white border border-slate-200 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: zone.color }} />
                  <span className="font-semibold">{zone.name}</span>
                </div>
                <div className="flex gap-2">
                  <button className="text-slate-400 hover:text-blue-600" onClick={() => handleEdit(zone)}>
                    <Edit2 size={16} />
                  </button>
                  <button className="text-slate-400 hover:text-red-600" onClick={() => handleDelete(zone.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-slate-500 mb-3">{zone.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1 text-slate-500">
                  <MapPin size={14} /> {zone.polygon.length} points
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-slate-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: `${zone.cleanlinessScore}%` }} />
                  </div>
                  <span className="text-xs font-medium">{zone.cleanlinessScore}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Add/Edit Modal */}
      {modalMode !== 'none' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b dark:border-slate-700">
              <h2 className="text-lg font-semibold dark:text-white">
                {modalMode === 'add' ? 'Add New Zone' : 'Edit Zone'}
              </h2>
              <button onClick={handleCancel} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Zone Name</label>
                  <Input 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Downtown Core"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                  <Input 
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="e.g., Central business district"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Zone Boundary (Draw on Map)
                </label>
                <ZoneEditor
                  initialPolygon={tempPolygon}
                  onSave={handleSavePolygon}
                  onCancel={handleCancel}
                  color={editingZone?.color || ZONE_COLORS[zones.length % ZONE_COLORS.length]}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 p-4 border-t dark:border-slate-700">
              <Button variant="outline" onClick={handleCancel} className="w-full sm:w-auto">Cancel</Button>
              <Button onClick={handleSaveZone} className="w-full sm:w-auto">
                {modalMode === 'add' ? 'Create Zone' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};
