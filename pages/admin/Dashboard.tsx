import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  LineChart, Line 
} from 'recharts';
import { 
  Users, AlertTriangle, CheckSquare, Map, Sparkles
} from 'lucide-react';
import { Card, Badge, Button } from '../../components/ui';
import { 
  CHART_DATA_CLEANLINESS, CHART_DATA_COMPLETION, 
  MOCK_ALERTS 
} from '../../constants';

export const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total AI Events', value: '1,240', icon: <AlertTriangle className="text-amber-500" />, trend: '+12%' },
          { title: 'Citizen Reports', value: '85', icon: <Users className="text-blue-500" />, trend: '+5%' },
          { title: 'Tasks Completed', value: '432', icon: <CheckSquare className="text-green-500" />, trend: '+18%' },
          { title: 'Hotspot Zones', value: '3', icon: <Map className="text-red-500" />, trend: 'stable' },
        ].map((metric, idx) => (
          <Card key={idx} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">{metric.title}</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{metric.value}</h3>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg">{metric.icon}</div>
            </div>
            <div className="mt-4 flex items-center text-xs">
              <span className="text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">{metric.trend}</span>
              <span className="ml-2 text-slate-400">from last month</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Cleanliness Score by Zone" className="min-h-[400px]">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={CHART_DATA_CLEANLINESS}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <RechartsTooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Bar dataKey="score" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Task Completion Trends" className="min-h-[400px]">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={CHART_DATA_COMPLETION}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Line type="monotone" dataKey="completed" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4, fill: '#0ea5e9', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Alerts */}
      <Card title="Recent Alerts & Reports">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Source</th>
                <th className="px-6 py-3">Zone</th>
                <th className="px-6 py-3">Severity</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_ALERTS.map((alert) => (
                <tr key={alert.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium">{alert.id}</td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1 ${alert.source === 'AI' ? 'text-indigo-600' : 'text-slate-600'}`}>
                       {alert.source === 'AI' && <Sparkles size={14} />} {alert.source}
                    </span>
                  </td>
                  <td className="px-6 py-4">{alert.zoneName}</td>
                  <td className="px-6 py-4">
                    <Badge variant={alert.severity === 'HIGH' ? 'danger' : 'warning'}>{alert.severity}</Badge>
                  </td>
                  <td className="px-6 py-4">{alert.status}</td>
                  <td className="px-6 py-4 text-right">
                    <Button size="sm" variant="outline">Create Task</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};