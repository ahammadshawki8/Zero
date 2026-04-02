import React, { useState, useEffect } from 'react';
import { Button, Badge, Modal, Card, Toast } from '../../components/ui';
import { cleanerAPI } from '../../services/api';
import {
  Camera,
  Calendar,
  CheckCircle,
  Banknote,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { Task } from '../../types';
import { formatApiDate, parseApiDate } from '../../utils/date';

export const MyTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dueFilter, setDueFilter] = useState<'ALL' | 'OVERDUE' | 'TODAY' | 'THIS_WEEK'>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [evidenceImage, setEvidenceImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'warning' | 'info' }>({
    show: false,
    message: '',
    type: 'success',
  });

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const tasksData = await cleanerAPI.getMyTasks();
        setTasks(tasksData);
      } catch (error) {
        console.error('Failed to load data:', error);
        setToast({ show: true, message: 'Failed to load tasks', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const myTasks = tasks.filter(t => t.status === 'IN_PROGRESS');

  const getDueCategory = (dueDate: string) => {
    const now = new Date();
    const due = parseApiDate(dueDate);
    if (!due) return 'UNKNOWN' as const;

    const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startDue = new Date(due.getFullYear(), due.getMonth(), due.getDate()).getTime();
    const diffDays = Math.floor((startDue - startToday) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'OVERDUE' as const;
    if (diffDays === 0) return 'TODAY' as const;
    if (diffDays <= 7) return 'THIS_WEEK' as const;
    return 'LATER' as const;
  };

  const filteredTasks = myTasks
    .filter((task) => {
      if (dueFilter === 'ALL') return true;
      return getDueCategory(task.dueDate) === dueFilter;
    })
    .sort((a, b) => {
      const aDue = parseApiDate(a.dueDate)?.getTime() ?? Number.MAX_SAFE_INTEGER;
      const bDue = parseApiDate(b.dueDate)?.getTime() ?? Number.MAX_SAFE_INTEGER;
      return aDue - bDue;
    });

  const overdueCount = myTasks.filter((task) => getDueCategory(task.dueDate) === 'OVERDUE').length;

  const handleStartComplete = (task: Task) => {
    setActiveTask(task);
    setShowCompleteModal(true);
  };

  const handleComplete = async () => {
    if (!activeTask || !evidenceImage) {
      setToast({ show: true, message: 'Please upload proof of work', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    try {
      await cleanerAPI.completeTask(activeTask.id, {
        evidenceImageUrl: evidenceImage,
        completedAt: new Date().toISOString(),
      });

      // Update task in local state
      setTasks(tasks.map(t => 
        t.id === activeTask.id 
          ? { ...t, status: 'COMPLETED' as const, completedAt: new Date().toISOString(), evidenceImageUrl: evidenceImage }
          : t
      ));

      setToast({ 
        show: true, 
        message: `Task completed! ৳${activeTask.reward} will be added to your earnings.`, 
        type: 'success' 
      });
      
      setShowCompleteModal(false);
      setActiveTask(null);
      setEvidenceImage(null);
    } catch (error) {
      console.error('Failed to complete task:', error);
      setToast({ show: true, message: 'Failed to complete task', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setEvidenceImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your tasks...</p>
        </div>
      </div>
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
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100">My Tasks</h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Complete your assigned cleanup tasks</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'All', value: 'ALL' },
            { label: 'Overdue', value: 'OVERDUE' },
            { label: 'Due Today', value: 'TODAY' },
            { label: 'Due This Week', value: 'THIS_WEEK' },
          ].map((item) => (
            <Button
              key={item.value}
              variant={dueFilter === item.value ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setDueFilter(item.value as 'ALL' | 'OVERDUE' | 'TODAY' | 'THIS_WEEK')}
            >
              {item.label}
            </Button>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-600 dark:text-slate-300">
          Showing {filteredTasks.length} of {myTasks.length} active task(s)
          {overdueCount > 0 ? ` • ${overdueCount} overdue` : ''}
        </p>
      </div>

      {/* My Tasks */}
      {myTasks.length === 0 ? (
        <Card>
          <div className="py-12 text-center text-slate-500">
            <Clock size={48} className="mx-auto mb-3 text-slate-300" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No active tasks</h3>
            <p className="text-slate-500 mb-6">Take a task from the Available Tasks page to get started</p>
            <Button onClick={() => window.location.hash = '#/cleaner/available'}>
              Browse Available Tasks
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
          {filteredTasks.map((task) => (
            <Card key={task.id} className="border-2 border-purple-200 bg-purple-50/30">
              <div className="flex justify-between items-start mb-3">
                <Badge variant="purple" className="text-[10px] sm:text-xs">In Progress</Badge>
                <span className="text-[9px] sm:text-xs text-slate-500 font-mono">#{task.id.slice(-8)}</span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-1">{task.zoneName}</h3>
              <p className="text-slate-600 text-sm mb-4">{task.description}</p>

              <div className="flex items-center text-xs text-slate-500 mb-4 space-x-4">
                <div className="flex items-center">
                  <Calendar size={14} className="mr-1" />
                  Due: {formatApiDate(task.dueDate)}
                </div>
                <div className="flex items-center">
                  <Clock size={14} className="mr-1" />
                  Taken: {formatApiDate(task.takenAt)}
                </div>
              </div>

              <div className="mb-3">
                {getDueCategory(task.dueDate) === 'OVERDUE' && <Badge variant="danger">Overdue</Badge>}
                {getDueCategory(task.dueDate) === 'TODAY' && <Badge variant="warning">Due Today</Badge>}
                {getDueCategory(task.dueDate) === 'THIS_WEEK' && <Badge variant="info">Due This Week</Badge>}
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 flex items-center justify-between">
                <span className="text-green-700 font-medium text-sm">You'll Earn</span>
                <span className="text-xl font-bold text-green-700">৳{task.reward.toLocaleString()}</span>
              </div>

              <Button onClick={() => handleStartComplete(task)} className="w-full">
                <CheckCircle size={16} className="mr-1" /> Mark as Completed
              </Button>
            </Card>
          ))}
        </div>
      )}

      {/* Complete Task Modal */}
      <Modal
        isOpen={showCompleteModal}
        onClose={() => {
          setShowCompleteModal(false);
          setActiveTask(null);
          setEvidenceImage(null);
        }}
        title="Complete Task"
        footer={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowCompleteModal(false);
                setActiveTask(null);
                setEvidenceImage(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleComplete} 
              disabled={!evidenceImage || isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : (
                <>
                  <CheckCircle size={16} className="mr-1" /> Mark Completed
                </>
              )}
            </Button>
          </div>
        }
      >
        {activeTask && (
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="font-semibold text-slate-800">{activeTask.description}</h4>
              <p className="text-sm text-slate-500 mt-1">Location: {activeTask.zoneName}</p>
              <p className="text-sm text-slate-500">Task ID: #{activeTask.id.slice(-8)}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Upload Proof of Work (Required)
              </label>
              <label className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center block cursor-pointer hover:bg-slate-50 transition-colors">
                <input
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                {evidenceImage ? (
                  <img
                    src={evidenceImage}
                    alt="Preview"
                    className="max-h-48 mx-auto rounded shadow-sm"
                  />
                ) : (
                  <div className="space-y-2">
                    <Camera className="mx-auto text-slate-400" size={32} />
                    <span className="text-sm text-green-600 font-medium block">Upload a photo</span>
                    <span className="text-xs text-slate-500 block">
                      Take a photo of the cleaned area
                    </span>
                  </div>
                )}
              </label>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Banknote size={24} className="text-green-600" />
                <span className="text-green-800 font-medium">You'll Receive</span>
              </div>
              <span className="text-2xl font-bold text-green-700">৳{activeTask.reward.toLocaleString()}</span>
            </div>

            {evidenceImage && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-800">AI Verification Preview</span>
                </div>
                <p className="text-xs text-emerald-600">
                  Once submitted, AI will analyze your cleanup and compare with the original report.
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};