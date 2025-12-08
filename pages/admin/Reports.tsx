import React from 'react';
import { Card, Badge, Button, Input } from '../../components/ui';
import { MOCK_REPORTS } from '../../constants';
import { Eye } from 'lucide-react';

export const AdminReports = () => {
  return (
    <Card title="Citizen Reports">
      <div className="flex justify-between mb-6">
        <Input placeholder="Search reports..." className="w-64" />
      </div>
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <th className="px-6 py-3">Report ID</th>
            <th className="px-6 py-3">Submitted By</th>
            <th className="px-6 py-3">Zone</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {MOCK_REPORTS.map((report) => (
            <tr key={report.id}>
              <td className="px-6 py-4 font-medium">{report.id}</td>
              <td className="px-6 py-4">{report.userName}</td>
              <td className="px-6 py-4">{report.zoneName}</td>
              <td className="px-6 py-4">
                 <Badge variant={report.status === 'COMPLETED' ? 'success' : 'neutral'}>{report.status}</Badge>
              </td>
              <td className="px-6 py-4 text-right">
                 <Button size="sm" variant="outline"><Eye size={14} className="mr-2"/> View</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};