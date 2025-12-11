import { useState } from 'react';
import { Button, Badge, Modal, Card, Toast } from '../../components/ui';
import { MOCK_TASKS, MOCK_CLEANER_PROFILE } from '../../constants';
import {
  Calendar,
  MapPin,
  CheckCircle,
  Banknote,
  Zap,
  AlertTriangle,
  Star,
} from 'lucide-react';
import { Task, Severity } from '../../types';

export const AvailableTasks = () => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [showTakeTaskModal, setShowTakeTaskModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as const });

  const profile = MOCK_CLEANER_PROFILE;
  const availableTasks = MOCK_TASKS.filter((t) => t.status === 'APPROVED');

  const handleTakeTask = (task: Task) => {
    setActiveTask(task);
    setShowTakeTaskModal(true);
  };

  const handleConfirmTake = () => {
    console.log('Task taken:', activeTask?.id);
    setToast({ show: true, message: `You have taken task ${activeTask?.id}! Start working on it now.`, type: 'success' });
    setShowTakeTaskModal(false);
    setActiveTask(null);
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
      <Toast
        isOpen={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
        message={toast.message}
        type={toast.type}
      />
      <div className="space-y-6">
      {/* Earnings Summary */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-4 sm:p-5 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-blue-100 text-sm mb-1">Your Earnings</p>
            <div className="flex items-center gap-2">
              <Banknote size={24} className="sm:w-7 sm:h-7" />
              <span className="text-2xl sm:text-3xl font-bold">৳{profile.totalEarnings.toLocaleString()}</span>
            </div>
            {profile.pendingEarnings > 0 && (
              <p className="text-blue-200 text-sm mt-1">+৳{profile.pendingEarnings} pending</p>
            )}
          </div>
          <div className="flex gap-4 sm:gap-6">
            <div className="text-center sm:text-right">
              <div className="text-xl sm:text-2xl font-bold">{profile.completedTasks}</div>
              <div className="text-xs text-blue-100">Completed</div>
            </div>
            <div className="text-center sm:text-right">
              <div className="text-xl sm:text-2xl font-bold flex items-center gap-1">
                <Star size={14} className="fill-yellow-400 text-yellow-400" />
                {profile.rating}
              </div>
              <div className="text-xs text-blue-100">Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Available Tasks */}
      {availableTasks.length === 0 ? (
        <div className="py-12 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
          <CheckCircle size={48} className="mx-auto mb-3 text-slate-300" />
          <p className="font-medium">No tasks available right now</p>
          <p className="text-sm">Check back later for new cleanup tasks</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableTasks.map((task) => (
            <Card key={task.id} className="flex flex-col h-full">
              <div className="flex justify-between items-start mb-3">
                <Badge variant={getPriorityBadge(task.priority)}>{task.priority} Priority</Badge>
                <span className="text-xs text-slate-500 font-mono">{task.id}</span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-1">{task.zoneName}</h3>
              <p className="text-slate-600 text-sm mb-4 flex-grow line-clamp-2">
                {task.description}
              </p>

              <div className="flex items-center text-xs text-slate-500 mb-4 space-x-4">
                <div className="flex items-center">
                  <Calendar size={14} className="mr-1" />
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <MapPin size={14} className="mr-1" />
                  Zone {task.zoneId}
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 flex items-center justify-between">
                <span className="text-green-700 font-medium text-sm">Reward</span>
                <span className="text-xl font-bold text-green-700">৳{task.reward}</span>
              </div>

              <Button onClick={() => handleTakeTask(task)} className="w-full">
                <Zap size={16} className="mr-1" /> Take This Task
              </Button>
            </Card>
          ))}
        </div>
      )}

      {/* Take Task Modal */}
      <Modal
        isOpen={showTakeTaskModal}
        onClose={() => {
          setShowTakeTaskModal(false);
          setActiveTask(null);
        }}
        title="Take This Task?"
        footer={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowTakeTaskModal(false);
                setActiveTask(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmTake}>
              <Zap size={16} className="mr-1" /> Confirm & Take
            </Button>
          </div>
        }
      >
        {activeTask && (
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="font-semibold text-slate-800">{activeTask.zoneName}</h4>
              <p className="text-sm text-slate-600 mt-1">{activeTask.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Priority</p>
                <Badge variant={getPriorityBadge(activeTask.priority)}>{activeTask.priority}</Badge>
              </div>
              <div>
                <p className="text-slate-500">Due Date</p>
                <p className="font-medium">{new Date(activeTask.dueDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Banknote size={24} className="text-green-600" />
                <span className="text-green-800 font-medium">You'll Earn</span>
              </div>
              <span className="text-2xl font-bold text-green-700">৳{activeTask.reward}</span>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
              <AlertTriangle size={18} className="text-amber-600 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-medium">Important</p>
                <p>
                  Once you take this task, you're committed to completing it. Make sure you can
                  finish before the due date.
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
      </div>
    </>
  );
};
