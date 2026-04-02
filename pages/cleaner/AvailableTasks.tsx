import { useState, useEffect } from 'react';
import { Button, Badge, Modal, Card, Toast } from '../../components/ui';
import { cleanerAPI, sharedAPI } from '../../services/api';
import {
  Calendar,
  MapPin,
  CheckCircle,
  Banknote,
  Zap,
  AlertTriangle,
  Eye,
} from 'lucide-react';
import { Task, Severity, Zone } from '../../types';
import { ZoneDisplayMap } from '../../components/ZoneMap';
import { AIAnalysisDisplay } from '../../components/AIAnalysisDisplay';
import { formatApiDate, parseApiDate } from '../../utils/date';

export const AvailableTasks = () => {
  const [availableTasks, setAvailableTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'ALL' | Severity>('ALL');
  const [sortBy, setSortBy] = useState<'DUE_SOON' | 'REWARD_HIGH' | 'PRIORITY_HIGH'>('DUE_SOON');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [showTakeTaskModal, setShowTakeTaskModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsTask, setDetailsTask] = useState<Task | null>(null);
  const [zones, setZones] = useState<Zone[]>([]);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const tasksData = await cleanerAPI.getAvailableTasks();
        const zonesData = await sharedAPI.getZones();
        setAvailableTasks(tasksData);
        setZones(Array.isArray(zonesData) ? zonesData : []);
      } catch (error) {
        console.error('Failed to load data:', error);
        setToast({ show: true, message: 'Failed to load data', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleTakeTask = (task: Task) => {
    setActiveTask(task);
    setShowTakeTaskModal(true);
  };

  const handleViewDetails = (task: Task) => {
    setDetailsTask(task);
    setShowDetailsModal(true);
  };

  const formatDate = (value?: string) => {
    return formatApiDate(value);
  };

  const handleConfirmTake = async () => {
    if (!activeTask) return;
    
    try {
      await cleanerAPI.takeTask(activeTask.id);
      setToast({ 
        show: true, 
        message: `You have taken task ${activeTask.id}! Start working on it now.`, 
        type: 'success' 
      });
      
      // Remove task from available tasks
      setAvailableTasks(prev => prev.filter(t => t.id !== activeTask.id));
      
      setShowTakeTaskModal(false);
      setActiveTask(null);
    } catch (error: any) {
      console.error('Failed to take task:', error);
      setToast({ 
        show: true, 
        message: error.message || 'Failed to take task. Please try again.', 
        type: 'error' 
      });
    }
  };

  const getPriorityRank = (priority: Severity) => {
    const rank: Record<Severity, number> = {
      CRITICAL: 4,
      HIGH: 3,
      MEDIUM: 2,
      LOW: 1,
    };
    return rank[priority];
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

  const filteredTasks = availableTasks
    .filter((task) => {
      if (priorityFilter !== 'ALL' && task.priority !== priorityFilter) return false;
      if (!searchTerm.trim()) return true;
      const query = searchTerm.trim().toLowerCase();
      return (
        task.zoneName.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.id.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'REWARD_HIGH') {
        return Number(b.reward || 0) - Number(a.reward || 0);
      }
      if (sortBy === 'PRIORITY_HIGH') {
        return getPriorityRank(b.priority) - getPriorityRank(a.priority);
      }
      const aDue = a.dueDate ? new Date(a.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
      const bDue = b.dueDate ? new Date(b.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
      return aDue - bDue;
    });

  const urgentCount = filteredTasks.filter((task) => task.priority === 'HIGH' || task.priority === 'CRITICAL').length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toast
        isOpen={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
        message={toast.message}
        type={toast.type}
      />
      <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by task ID, zone, or description"
            className="sm:col-span-2 rounded-lg border border-slate-300 dark:border-slate-600 px-3 sm:px-4 py-2 text-xs sm:text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900"
          />
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as 'ALL' | Severity)}
            className="rounded-lg border border-slate-300 dark:border-slate-600 px-3 sm:px-4 py-2 text-xs sm:text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'DUE_SOON' | 'REWARD_HIGH' | 'PRIORITY_HIGH')}
            className="rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900"
          >
            <option value="DUE_SOON">Sort: Due Soon</option>
            <option value="REWARD_HIGH">Sort: Reward High-Low</option>
            <option value="PRIORITY_HIGH">Sort: Priority High-Low</option>
          </select>
        </div>
        <div className="mt-3 text-xs text-slate-600 dark:text-slate-300 flex flex-wrap gap-4">
          <span>Matching tasks: {filteredTasks.length}</span>
          <span>Urgent (High/Critical): {urgentCount}</span>
        </div>
      </div>

      {/* Available Tasks */}
      {filteredTasks.length === 0 ? (
        <div className="py-12 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
          <CheckCircle size={48} className="mx-auto mb-3 text-slate-300" />
          <p className="font-medium">No matching tasks found</p>
          <p className="text-sm">Try changing filter/search criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
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
                  Due: {formatDate(task.dueDate)}
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

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => handleViewDetails(task)} className="flex-1">
                  <Eye size={16} className="mr-1" /> View Details
                </Button>
                <Button onClick={() => handleTakeTask(task)} className="flex-1">
                  <Zap size={16} className="mr-1" /> Take This Task
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Task Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setDetailsTask(null);
        }}
        title={detailsTask ? `Task Details #${detailsTask.id.slice(-8)}` : 'Task Details'}
        footer={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowDetailsModal(false);
                setDetailsTask(null);
              }}
            >
              Close
            </Button>
            {detailsTask && (
              <Button
                onClick={() => {
                  setShowDetailsModal(false);
                  handleTakeTask(detailsTask);
                }}
              >
                <Zap size={16} className="mr-1" /> Take This Task
              </Button>
            )}
          </div>
        }
      >
        {detailsTask && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Zone</p>
                <p className="font-medium">{detailsTask.zoneName}</p>
              </div>
              <div>
                <p className="text-slate-500">Due Date</p>
                <p className="font-medium">{formatDate(detailsTask.dueDate)}</p>
              </div>
              <div>
                <p className="text-slate-500">Priority</p>
                <Badge variant={getPriorityBadge(detailsTask.priority)}>{detailsTask.priority}</Badge>
              </div>
              <div>
                <p className="text-slate-500">Reward</p>
                <p className="font-bold text-green-700">৳{Number(detailsTask.reward || 0).toLocaleString()}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-slate-500 mb-1">Description</p>
              <p className="bg-slate-50 p-3 rounded-lg text-sm">{detailsTask.description}</p>
            </div>

            {detailsTask.beforeImageUrl && (
              <div>
                <p className="text-sm text-slate-500 mb-1">Reported Image</p>
                <img
                  src={detailsTask.beforeImageUrl}
                  alt="Reported waste"
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}

            {detailsTask.aiAnalysis && (
              <div>
                <p className="text-sm text-slate-500 mb-2">AI Analysis</p>
                <AIAnalysisDisplay analysis={detailsTask.aiAnalysis} compact />
              </div>
            )}

            <div>
              <p className="text-sm text-slate-500 mb-1">Exact Location</p>
              {detailsTask.location ? (
                <>
                  <ZoneDisplayMap
                    zones={zones}
                    selectedPoint={detailsTask.location}
                    height="260px"
                    showZoneLabels={true}
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    Pin: {detailsTask.location.lat.toFixed(6)}, {detailsTask.location.lng.toFixed(6)}
                  </p>
                </>
              ) : (
                <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-500">
                  Exact report coordinates are not available for this task.
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

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
                <p className="font-medium">{formatApiDate(activeTask.dueDate)}</p>
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
