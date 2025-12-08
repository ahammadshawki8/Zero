import React from 'react';
import { Card, Badge, Button, Input } from '../../components/ui';
import { MOCK_TASKS } from '../../constants';
import { Filter, CheckSquare } from 'lucide-react';

export const AdminTasks = () => {
  return (
    <Card title="Task Management">
      <div className="flex justify-between mb-6">
        <div className="flex gap-2">
          <Input placeholder="Search tasks..." className="w-64" />
          <Button variant="outline"><Filter size={16} className="mr-2" /> Filter</Button>
        </div>
      </div>
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <th className="px-6 py-3">Task ID</th>
            <th className="px-6 py-3">Zone</th>
            <th className="px-6 py-3">Cleaner</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Priority</th>
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {MOCK_TASKS.map((task) => (
            <tr key={task.id}>
              <td className="px-6 py-4 font-medium">{task.id}</td>
              <td className="px-6 py-4">{task.zoneName}</td>
              <td className="px-6 py-4">{task.cleanerName}</td>
              <td className="px-6 py-4">
                <Badge variant={task.status === 'COMPLETED' ? 'success' : 'warning'}>{task.status}</Badge>
              </td>
              <td className="px-6 py-4">
                <Badge variant={task.priority === 'HIGH' ? 'danger' : 'neutral'}>{task.priority}</Badge>
              </td>
              <td className="px-6 py-4 text-right">
                <Button size="sm" variant="ghost">Edit</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};