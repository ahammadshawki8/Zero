import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, Input, Modal, Select, Toast } from '../../components/ui';
import { InlineLoader, PageLoader } from '../../components/ZeroLoader';
import { adminAPI } from '../../services/api';
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
  Edit,
  Trash2,
} from 'lucide-react';
import { Task, Severity } from '../../types';
import { AIAnalysisDisplay, CleanupComparisonDisplay } from '../../components/AIAnalysisDisplay';
import { formatApiDate, formatApiDateTime, parseApiDate } from '../../utils/date';

export const AdminTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    reward: '',
    dueDate: '',
    priority: 'MEDIUM' as Severity,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'warning' | 'info' }>({
    show: false,
    message: '',
    type: 'success',
  });

  // Load tasks on component mount and when filter changes
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const tasksData = await adminAPI.getAllTasks();
        setTasks(tasksData);
      } catch (error) {
        console.error('Failed to load tasks:', error);
        setToast({ show: true, message: 'Failed to load tasks', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, []);

  // Filter and search tasks
  const filteredTasks = tasks
    .filter((t) => {
      if (filterStatus !== 'ALL' && t.status !== filterStatus) return false;
      if (searchTerm && !t.id.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !t.zoneName.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !t.cleanerName?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => (parseApiDate(b.createdAt)?.getTime() ?? 0) - (parseApiDate(a.createdAt)?.getTime() ?? 0));

  const availableTasks = tasks.filter((t) => t.status === 'APPROVED').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const completedTasks = tasks.filter((t) => t.status === 'COMPLETED').length;
  const totalRewards = tasks.reduce((sum, t) => sum + t.reward, 0);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'warning' | 'info' | 'danger' | 'purple' | 'success'> = {
      APPROVED: 'info',
      IN_PROGRESS: 'purple',
      COMPLETED: 'success',
    };
    return variants[status] || 'warning';
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

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      APPROVED: 'Available',
      IN_PROGRESS: 'In Progress',
      COMPLETED: 'Completed',
    };
    return labels[status] || status;
  };

  const formatDateTime = (value?: string) => {
    return formatApiDateTime(value);
  };

  const formatDateOnly = (value?: string) => {
    return formatApiDate(value);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setEditForm({
      reward: task.reward.toString(),
      dueDate: task.dueDate.split('T')[0], // Convert to YYYY-MM-DD format
      priority: task.priority,
    });
    setShowEditModal(true);
  };

  const handleUpdateTask = async () => {
    if (!selectedTask) return;

    setIsProcessing(true);
    try {
      const updatedTask = await adminAPI.updateTask(selectedTask.id, {
        reward: parseInt(editForm.reward),
        dueDate: editForm.dueDate,
        priority: editForm.priority,
      });

      // Update task in local state
      setTasks(tasks.map(t => t.id === selectedTask.id ? { ...t, ...updatedTask } : t));
      
      setToast({ show: true, message: 'Task updated successfully', type: 'success' });
      setShowEditModal(false);
      setSelectedTask(null);
    } catch (error) {
      console.error('Failed to update task:', error);
      setToast({ show: true, message: 'Failed to update task', type: 'error' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    setIsProcessing(true);
    try {
      await adminAPI.deleteTask(taskId);
      
      // Remove task from local state
      setTasks(tasks.filter(t => t.id !== taskId));
      
      setToast({ show: true, message: 'Task deleted successfully', type: 'success' });
      setSelectedTask(null);
    } catch (error) {
      console.error('Failed to delete task:', error);
      setToast({ show: true, message: 'Failed to delete task', type: 'error' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewTask = async (task: Task) => {
    setIsLoadingDetails(true);
    try {
      const detailedTask = await adminAPI.getTaskDetails(task.id);
      setSelectedTask(detailedTask);
    } catch (error) {
      console.error('Failed to load task details:', error);
      setSelectedTask(task);
      setToast({ show: true, message: 'Could not load full task details', type: 'warning' });
    } finally {
      setIsLoadingDetails(false);
    }
  };

  if (isLoading) {
    return (
      <PageLoader label="Loading tasks..." className="min-h-[400px]" />
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-6">
      <Toast
        isOpen={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
        message={toast.message}
        type={toast.type}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div className="w-full">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100">Task Management</h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Monitor and manage cleanup tasks</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-2 sm:p-3 md:p-4 border border-slate-200 dark:border-slate-700 active:scale-95 transition-transform touch-manipulation">
          <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
            <div className="p-1 sm:p-1.5 md:p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Clock size={16} className="sm:w-5 sm:h-5 md:w-[18px] md:h-[18px] text-blue-600" />
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
              <p className="text-xs text-slate-500 dark:text-slate-400">Total Rewards</p>
            </div>
          </div>
        </div>
      </div>

      <Card title="All Tasks">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <Input 
            placeholder="Search tasks..." 
            className="w-full sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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

        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle size={48} className="mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No tasks found</h3>
            <p className="text-slate-500">No tasks match the current filter criteria</p>
          </div>
        ) : (
          <>
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
                    <th className="px-4 py-3">Due Date</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTasks.map((task) => (
                    <tr key={task.id} className="hover:bg-slate-50">
                      <td className="px-4 py-4 font-medium">#{task.id.slice(-8)}</td>
                      <td className="px-4 py-4">{task.zoneName}</td>
                      <td className="px-4 py-4">
                        {task.cleanerName || (
                          <span className="text-slate-400 italic">Unassigned</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant={getStatusBadge(task.status)}>
                          {getStatusLabel(task.status)}
                        </Badge>
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant={getPriorityBadge(task.priority)}>
                          {task.priority}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 font-medium text-green-600">
                        ৳{task.reward.toLocaleString()}
                      </td>
                      <td className="px-4 py-4">
                        {formatApiDate(task.dueDate)}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex gap-1 justify-end">
                          <Button size="sm" variant="outline" onClick={() => handleViewTask(task)}>
                            <Eye size={14} className="mr-1" /> View
                          </Button>
                          {task.status === 'APPROVED' && (
                            <>
                              <Button size="sm" variant="outline" onClick={() => handleEditTask(task)}>
                                <Edit size={14} />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleDeleteTask(task.id)}
                                className="text-red-600 hover:bg-red-50"
                              >
                                <Trash2 size={14} />
                              </Button>
                            </>
                          )}
                        </div>
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
                  className="p-4 bg-white rounded-xl border border-slate-200 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleViewTask(task)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-semibold">#{task.id.slice(-8)}</span>
                      <p className="text-sm text-slate-500">{task.zoneName}</p>
                    </div>
                    <Badge variant={getStatusBadge(task.status)}>
                      {getStatusLabel(task.status)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <Badge variant={getPriorityBadge(task.priority)}>{task.priority}</Badge>
                      {task.cleanerName && (
                        <span className="text-xs text-slate-500">{task.cleanerName}</span>
                      )}
                    </div>
                    <span className="font-bold text-green-600">৳{task.reward.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>

      {/* Task Detail Modal */}
      <Modal
        isOpen={!!selectedTask && !showEditModal}
        onClose={() => setSelectedTask(null)}
        title={`Task #${selectedTask?.id.slice(-8)}`}
        footer={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setSelectedTask(null)}>
              Close
            </Button>
            {selectedTask?.status === 'APPROVED' && (
              <>
                <Button variant="outline" onClick={() => handleEditTask(selectedTask)}>
                  <Edit size={16} className="mr-2" />
                  Edit Task
                </Button>
                <Button 
                  onClick={() => handleDeleteTask(selectedTask.id)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Trash2 size={16} className="mr-2" />
                  Delete Task
                </Button>
              </>
            )}
          </div>
        }
      >
        {isLoadingDetails ? (
          <InlineLoader label="Loading task details..." className="py-8" />
        ) : selectedTask && (
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
              <span className="text-2xl font-bold text-green-700">৳{selectedTask.reward.toLocaleString()}</span>
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
                    {formatDateOnly(selectedTask.dueDate)}
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

            {/* Report & Evidence Images */}
            {(selectedTask.beforeImageUrl || selectedTask.evidenceImageUrl) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedTask.beforeImageUrl && (
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Reported Image (Before)</p>
                    <img
                      src={selectedTask.beforeImageUrl}
                      alt="Before cleanup"
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  </div>
                )}
                {selectedTask.evidenceImageUrl && (
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Cleaner Evidence (After)</p>
                    <img
                      src={selectedTask.evidenceImageUrl}
                      alt="Cleanup evidence"
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            )}

            {/* AI Analysis */}
            {selectedTask.aiAnalysis && (
              <div>
                <p className="text-sm text-slate-500 mb-2">AI Analysis (from report)</p>
                <AIAnalysisDisplay analysis={selectedTask.aiAnalysis} />
              </div>
            )}

            {/* Cleanup Comparison */}
            {selectedTask.cleanupComparison && (
              <div>
                <p className="text-sm text-slate-500 mb-2">AI Cleanup Comparison</p>
                <CleanupComparisonDisplay comparison={selectedTask.cleanupComparison} />
              </div>
            )}

            {/* Timeline */}
            <div>
              <p className="text-sm text-slate-500 mb-2">Timeline</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span>Created: {formatDateTime(selectedTask.createdAt)}</span>
                </div>
                {selectedTask.takenAt && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full" />
                    <span>Taken: {formatDateTime(selectedTask.takenAt)}</span>
                  </div>
                )}
                {selectedTask.completedAt && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Completed: {formatDateTime(selectedTask.completedAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Task"
        footer={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateTask}
              disabled={isProcessing}
            >
              {isProcessing ? 'Updating...' : 'Update Task'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Reward Amount (BDT)
            </label>
            <Input
              type="number"
              value={editForm.reward}
              onChange={(e) => setEditForm({ ...editForm, reward: e.target.value })}
              placeholder="Enter reward amount"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Due Date
            </label>
            <Input
              type="date"
              value={editForm.dueDate}
              onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Priority Level
            </label>
            <Select
              options={[
                { value: 'LOW', label: 'Low' },
                { value: 'MEDIUM', label: 'Medium' },
                { value: 'HIGH', label: 'High' },
                { value: 'CRITICAL', label: 'Critical' },
              ]}
              value={editForm.priority}
              onChange={(e) => setEditForm({ ...editForm, priority: e.target.value as Severity })}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};