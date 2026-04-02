import { useState, useEffect } from 'react';
import { Button, Modal, Toast, Badge } from '../../components/ui';
import { Eye, TrendingUp, Star, CheckCircle, MessageSquare, Clock } from 'lucide-react';
import { Task } from '../../types';
import { AIAnalysisDisplay, CleanupComparisonDisplay } from '../../components/AIAnalysisDisplay';
import { cleanerAPI } from '../../services/api';
import { formatApiDate, formatApiDateTime } from '../../utils/date';

type TaskPaymentMeta = {
  status: 'PAID' | 'PENDING' | 'UNKNOWN';
  amount: number;
  paidAt?: string;
};

type EarningsTransaction = {
  task_id?: string;
  amount?: number;
  status?: string;
  paid_at?: string;
};

export const CleanerHistory = () => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [paymentFilter, setPaymentFilter] = useState<'ALL' | 'PAID' | 'PENDING' | 'UNKNOWN'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [taskPayments, setTaskPayments] = useState<Record<string, TaskPaymentMeta>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });

  useEffect(() => {
    const loadData = async () => {
      try {
        const tasksData = await cleanerAPI.getCompletedTasks();
        const earningsData = await cleanerAPI.getEarnings();

        const earningsRows = Array.isArray(earningsData)
          ? (earningsData as EarningsTransaction[])
          : [];

        const paymentMap: Record<string, TaskPaymentMeta> = {};
        earningsRows.forEach((row) => {
          const taskId = row?.task_id;
          if (!taskId) return;
          const normalizedStatus = String(row?.status || '').toUpperCase();
          paymentMap[taskId] = {
            status: normalizedStatus === 'PAID' ? 'PAID' : normalizedStatus === 'PENDING' ? 'PENDING' : 'UNKNOWN',
            amount: Number(row?.amount || 0),
            paidAt: row?.paid_at || undefined,
          };
        });

        setCompletedTasks(tasksData);
        setTaskPayments(paymentMap);
      } catch (error: any) {
        console.error('Failed to load history data:', error);
        setToast({ show: true, message: 'Failed to load history data', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const getPaymentMeta = (task: Task): TaskPaymentMeta => {
    const meta = taskPayments[task.id];
    if (meta) return meta;
    return {
      status: 'UNKNOWN',
      amount: Number(task.reward || 0),
      paidAt: undefined,
    };
  };

  const filteredTasks = completedTasks.filter((task) => {
    const payment = getPaymentMeta(task);
    if (paymentFilter !== 'ALL' && payment.status !== paymentFilter) return false;
    if (!searchTerm.trim()) return true;
    const query = searchTerm.trim().toLowerCase();
    return (
      task.id.toLowerCase().includes(query) ||
      task.zoneName.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query)
    );
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading history...</p>
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
      <div className="space-y-3 sm:space-y-4 md:space-y-6 px-0 sm:px-1">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by task ID, zone, or description"
            className="md:col-span-2 rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900"
          />
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value as 'ALL' | 'PAID' | 'PENDING' | 'UNKNOWN')}
            className="rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900"
          >
            <option value="ALL">All Payments</option>
            <option value="PAID">Paid</option>
            <option value="PENDING">Pending Payout</option>
            <option value="UNKNOWN">Unknown</option>
          </select>
        </div>
        <p className="mt-3 text-xs text-slate-600 dark:text-slate-300">
          Showing {filteredTasks.length} of {completedTasks.length} completed task(s)
        </p>
      </div>

      {/* History Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        {filteredTasks.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            <TrendingUp size={48} className="mx-auto mb-3 text-slate-300" />
            <p className="font-medium">No matching history found</p>
            <p className="text-sm">Try adjusting payment filter or search text</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-slate-500 uppercase">
                      Task ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                      Zone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                      Completed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                      Earned
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredTasks.map((task) => {
                    const payment = getPaymentMeta(task);
                    return (
                    <tr key={task.id} className="hover:bg-slate-50">
                      <td className="px-3 sm:px-6 py-2 sm:py-4 text-[11px] sm:text-sm font-medium text-slate-900 dark:text-slate-100">{task.id}</td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4 text-[11px] sm:text-sm text-slate-600 dark:text-slate-400">{task.zoneName}</td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4 text-[11px] sm:text-sm text-slate-500 dark:text-slate-400">
                        {formatApiDate(task.completedAt)}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-green-600">৳{task.reward}</td>
                      <td className="px-6 py-4 text-sm">
                        {payment.status === 'PAID' ? (
                          <div className="space-y-1">
                            <Badge variant="success">PAID</Badge>
                            <p className="text-xs text-slate-500">
                              {payment.paidAt ? `Paid on ${formatApiDate(payment.paidAt)}` : 'Paid'}
                            </p>
                          </div>
                        ) : payment.status === 'PENDING' ? (
                          <div className="space-y-1">
                            <Badge variant="warning">PENDING PAYOUT</Badge>
                            <p className="text-xs text-slate-500">Awaiting admin confirmation</p>
                          </div>
                        ) : (
                          <Badge variant="neutral">UNKNOWN</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Button size="sm" variant="outline" onClick={() => setSelectedTask(task)}>
                          <Eye size={14} className="mr-1" /> Details
                        </Button>
                      </td>
                    </tr>
                  );})}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-slate-200">
              {filteredTasks.map((task) => {
                const payment = getPaymentMeta(task);
                return (
                <div
                  key={task.id}
                  className="p-4 hover:bg-slate-50"
                  onClick={() => setSelectedTask(task)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-medium text-slate-900">{task.id}</span>
                      <p className="text-sm text-slate-500">{task.zoneName}</p>
                    </div>
                    <span className="font-bold text-green-600">৳{task.reward}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <CheckCircle size={12} />
                    {formatApiDate(task.completedAt)}
                  </div>
                  <div className="mt-2">
                    {payment.status === 'PAID' ? (
                      <Badge variant="success">PAID</Badge>
                    ) : payment.status === 'PENDING' ? (
                      <Badge variant="warning">PENDING PAYOUT</Badge>
                    ) : (
                      <Badge variant="neutral">UNKNOWN</Badge>
                    )}
                  </div>
                </div>
              );})}
            </div>
          </>
        )}
      </div>

      {/* Task Detail Modal */}
      <Modal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        title={`Task Details: ${selectedTask?.id}`}
        footer={<Button onClick={() => setSelectedTask(null)}>Close</Button>}
      >
        {selectedTask && (
          <div className="space-y-4">
            {(() => {
              const payment = getPaymentMeta(selectedTask);
              return (
                <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-3 bg-slate-50 dark:bg-slate-800/60">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Payment Status</p>
                    {payment.status === 'PAID' ? (
                      <Badge variant="success">PAID</Badge>
                    ) : payment.status === 'PENDING' ? (
                      <Badge variant="warning">PENDING PAYOUT</Badge>
                    ) : (
                      <Badge variant="neutral">UNKNOWN</Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {payment.status === 'PAID'
                      ? payment.paidAt
                        ? `Paid by admin on ${formatApiDateTime(payment.paidAt)}`
                        : 'Paid by admin'
                      : payment.status === 'PENDING'
                        ? 'Awaiting admin payment confirmation'
                        : 'Payment state not available'}
                  </p>
                </div>
              );
            })()}

            {/* Before/After Images */}
            {selectedTask.reportId && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Before</p>
                  <img
                    src={selectedTask.beforeImageUrl || '/placeholder-image.jpg'}
                    alt="Before"
                    className="w-full h-32 object-cover rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">After (Your Work)</p>
                  <img
                    src={selectedTask.evidenceImageUrl || '/placeholder-image.jpg'}
                    alt="After"
                    className="w-full h-32 object-cover rounded-lg border-2 border-green-400"
                  />
                </div>
              </div>
            )}

            {/* Task Info */}
            <div className="bg-slate-50 p-3 rounded-lg">
              <p className="font-medium text-slate-800">{selectedTask.zoneName}</p>
              <p className="text-sm text-slate-600">{selectedTask.description}</p>
            </div>

            {/* Earnings */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between">
              <span className="text-green-700 font-medium">Earned</span>
              <span className="text-xl font-bold text-green-700">৳{selectedTask.reward}</span>
            </div>

            {/* AI Analysis */}
            {selectedTask.aiAnalysis && (
              <AIAnalysisDisplay analysis={selectedTask.aiAnalysis} compact />
            )}

            {/* Cleanup Comparison */}
            {selectedTask.cleanupComparison && (
              <CleanupComparisonDisplay comparison={selectedTask.cleanupComparison} />
            )}

            {/* Citizen Review */}
            {selectedTask.review ? (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Star size={18} className="text-amber-500" />
                  <span className="font-semibold text-amber-800">Citizen Review</span>
                </div>
                
                {/* Rating Stars */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={20}
                        className={`${
                          star <= selectedTask.review!.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-bold text-slate-800">
                    {selectedTask.review.rating}/5
                  </span>
                </div>

                {/* Comment */}
                {selectedTask.review.comment && (
                  <div className="bg-white rounded-lg p-3 mb-3">
                    <p className="text-sm text-slate-700 italic">"{selectedTask.review.comment}"</p>
                  </div>
                )}

                {/* Review Date */}
                <div className="flex items-center justify-end text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>{formatApiDate(selectedTask.review.reviewedAt)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center">
                <MessageSquare size={24} className="mx-auto mb-2 text-slate-300" />
                <p className="text-sm text-slate-500">No citizen review yet</p>
                <p className="text-xs text-slate-400">The citizen hasn't reviewed this cleanup</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
    </>
  );
};
