import { useState } from 'react';
import { Card, Badge, Button, Input, Modal, Select } from '../../components/ui';
import { MOCK_TASKS, MOCK_REPORTS, STATUS_INFO } from '../../constants';
import {
  Filter,
  Eye,
  Clock,
  User,
  MapPin,
  Calendar,
  Banknote,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { Task, Severity } from '../../types';
import { AIAnalysisDisplay, CleanupComparisonDisplay } from '../../components/AIAnalysisDisplay';

export const AdminTasks = () => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filterStatus, setFilterStatus] = useState('ALL');

  const filteredTasks = MOCK_TASKS.filter((t) => {
    if (filterStatus === 'ALL') return true;
    return t.status === filterStatus;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const availableTasks = MOCK_TASKS.filter((t) => t.status === 'APPROVED').length;
  const inProgressTasks = MOCK_TASKS.filter((t) => t.status === 'IN_PROGRESS').length;
  const completedTasks = MOCK_TASKS.filter((t) => t.status === 'COMPLETED').length;
  const totalRewards = MOCK_TASKS.reduce((sum, t) => sum + t.reward, 0);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'warning' | 'info' | 'danger' | 'purple' | 'success'> = {
      APPROVED: 'info',
      IN_PROGRESS: 'purple',
      COMPLETED: 'success',
    };
    return variants[status] || 'neutral';
  };

  const getPriorityBadge = (priority: Severity) => {
    const variants: Record<Severity, 'success' | 'warning' | 'danger'> = {
      LOW: 'success',
      MEDIUM: 'warning',
      HIGH: 'danger',
      CRITICAL: 'danger',
    };
    return variants[priority];
  };

  return (
    <>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-3 sm:p-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Clock size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-200">{availableTasks}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Available</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-3 sm:p-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <User size={18} className="text-purple-600" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-200">{inProgressTasks}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">In Progress</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-3 sm:p-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle size={18} className="text-green-600" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-200">{completedTasks}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Completed</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-3 sm:p-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <Banknote size={18} className="text-amber-600" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-200">৳{totalRewards.toLocaleString()}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Rewards</p>
              </div>
            </div>
          </div>
        </div>

        <Card title="Task Management">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <Input placeholder="Search tasks..." className="w-full sm:w-64" />
            <Select
              options={[
                { value: 'ALL', label: 'All Status' },
                { value: 'APPROVED', label: 'Available' },
                { value: 'IN_PROGRESS', label: 'In Progress' },
                { value: 'COMPLETED', label: 'Completed' },
              ]}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full sm:w-48"
            />
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3">Task ID</th>
                  <th className="px-4 py-3">Zone</th>
                  <th className="px-4 py-3">Cleaner</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Reward</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-50">
                    <td className="px-4 py-4 font-medium">{task.id}</td>
                    <td className="px-4 py-4">{task.zoneName}</td>
                    <td className="px-4 py-4">
                      {task.cleanerName || (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant={getStatusBadge(task.status) as any}>
                        {task.status === 'APPROVED' ? 'Available' : STATUS_INFO[task.status]?.label}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant={getPriorityBadge(task.priority)}>
                        {task.priority}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 font-medium text-green-600">
                      ৳{task.reward}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Button size="sm" variant="outline" onClick={() => setSelectedTask(task)}>
                        <Eye size={14} className="mr-1" /> View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="p-4 bg-white rounded-xl border border-slate-200"
                onClick={() => setSelectedTask(task)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-semibold">{task.id}</span>
                    <p className="text-sm text-slate-500">{task.zoneName}</p>
                  </div>
                  <Badge variant={getStatusBadge(task.status) as any}>
                    {task.status === 'APPROVED' ? 'Available' : STATUS_INFO[task.status]?.label}
                  </Badge>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <Badge variant={getPriorityBadge(task.priority)}>{task.priority}</Badge>
                    {task.cleanerName && (
                      <span className="text-xs text-slate-500">{task.cleanerName}</span>
                    )}
                  </div>
                  <span className="font-bold text-green-600">৳{task.reward}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Task Detail Modal */}
      <Modal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        title={`Task: ${selectedTask?.id}`}
        footer={<Button onClick={() => setSelectedTask(null)}>Close</Button>}
      >
        {selectedTask && (
          <div className="space-y-4">
            {/* Status Banner */}
            <div
              className={`p-3 rounded-lg flex items-center gap-2 ${
                selectedTask.status === 'APPROVED'
                  ? 'bg-blue-50 text-blue-800'
                  : selectedTask.status === 'IN_PROGRESS'
                  ? 'bg-purple-50 text-purple-800'
                  : 'bg-green-50 text-green-800'
              }`}
            >
              {selectedTask.status === 'APPROVED' ? (
                <Clock size={18} />
              ) : selectedTask.status === 'IN_PROGRESS' ? (
                <User size={18} />
              ) : (
                <CheckCircle size={18} />
              )}
              <span className="font-medium">
                {selectedTask.status === 'APPROVED'
                  ? 'Available - Waiting for cleaner'
                  : selectedTask.status === 'IN_PROGRESS'
                  ? `In Progress - ${selectedTask.cleanerName}`
                  : `Completed by ${selectedTask.cleanerName}`}
              </span>
            </div>

            {/* Reward */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Banknote size={24} className="text-green-600" />
                <span className="text-green-800 font-medium">Task Reward</span>
              </div>
              <span className="text-2xl font-bold text-green-700">৳{selectedTask.reward}</span>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-slate-400" />
                <div>
                  <p className="text-slate-500">Zone</p>
                  <p className="font-medium">{selectedTask.zoneName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-slate-400" />
                <div>
                  <p className="text-slate-500">Priority</p>
                  <Badge variant={getPriorityBadge(selectedTask.priority)}>
                    {selectedTask.priority}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-slate-400" />
                <div>
                  <p className="text-slate-500">Due Date</p>
                  <p className="font-medium">
                    {new Date(selectedTask.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <User size={16} className="text-slate-400" />
                <div>
                  <p className="text-slate-500">Assigned To</p>
                  <p className="font-medium">
                    {selectedTask.cleanerName || 'Unassigned'}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-sm text-slate-500 mb-1">Description</p>
              <p className="bg-slate-50 p-3 rounded-lg text-sm">{selectedTask.description}</p>
            </div>

            {/* Timeline */}
            <div>
              <p className="text-sm text-slate-500 mb-2">Timeline</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span>Created: {new Date(selectedTask.createdAt).toLocaleString()}</span>
                </div>
                {selectedTask.takenAt && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full" />
                    <span>Taken: {new Date(selectedTask.takenAt).toLocaleString()}</span>
                  </div>
                )}
                {selectedTask.completedAt && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Completed: {new Date(selectedTask.completedAt).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Evidence */}
            {selectedTask.evidenceImageUrl && (
              <div>
                <p className="text-sm text-slate-500 mb-1">Completion Evidence</p>
                <img
                  src={selectedTask.evidenceImageUrl}
                  alt="Evidence"
                  className="w-full h-40 object-cover rounded-lg"
                />
              </div>
            )}

            {/* AI Analysis from linked report */}
            {(() => {
              const linkedReport = MOCK_REPORTS.find(r => r.id === selectedTask.reportId);
              return linkedReport?.aiAnalysis ? (
                <AIAnalysisDisplay analysis={linkedReport.aiAnalysis} />
              ) : null;
            })()}

            {/* Cleanup Comparison (for completed tasks) */}
            {(() => {
              const linkedReport = MOCK_REPORTS.find(r => r.id === selectedTask.reportId);
              return selectedTask.status === 'COMPLETED' && linkedReport?.cleanupComparison ? (
                <CleanupComparisonDisplay comparison={linkedReport.cleanupComparison} />
              ) : null;
            })()}
          </div>
        )}
      </Modal>
    </>
  );
};
