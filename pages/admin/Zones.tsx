import React from 'react';
import { Card, Button, Input } from '../../components/ui';
import { MOCK_ZONES } from '../../constants';
import { Filter, Plus, Edit2, Trash2 } from 'lucide-react';

export const AdminZones = () => {
  return (
    <Card title="Zones Management">
      <div className="flex justify-between mb-6">
        <div className="flex gap-2">
          <Input placeholder="Search zones..." className="w-64" />
          <Button variant="outline"><Filter size={16} className="mr-2" /> Filter</Button>
        </div>
        <Button><Plus size={16} className="mr-2" /> Add Zone</Button>
      </div>
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Description</th>
            <th className="px-6 py-3">Cleanliness Score</th>
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {MOCK_ZONES.map((zone) => (
            <tr key={zone.id}>
              <td className="px-6 py-4 font-medium">{zone.name}</td>
              <td className="px-6 py-4 text-slate-500">{zone.description}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-full bg-slate-200 rounded-full h-2.5 max-w-[100px]">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${zone.cleanlinessScore}%` }}></div>
                  </div>
                  <span className="text-xs font-medium">{zone.cleanlinessScore}%</span>
                </div>
              </td>
              <td className="px-6 py-4 text-right flex justify-end gap-2">
                <button className="text-slate-400 hover:text-blue-600"><Edit2 size={16} /></button>
                <button className="text-slate-400 hover:text-red-600"><Trash2 size={16} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};