import { useState } from 'react';
import { Button, Modal } from '../../components/ui';
import { MOCK_TASKS, MOCK_CLEANER_PROFILE, MOCK_REPORTS } from '../../constants';
import { Eye, TrendingUp, Banknote, Star, CheckCircle, MessageSquare, Clock } from 'lucide-react';
import { Task } from '../../types';
import { AIAnalysisDisplay, CleanupComparisonDisplay } from '../../components/AIAnalysisDisplay';

export const CleanerHistory = () => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const profile = MOCK_CLEANER_PROFILE;
  const completedTasks = MOCK_TASKS.filter(
    (t) => t.cleanerId === profile.userId && t.status === 'COMPLETED'
  );

  const totalEarned = completedTasks.reduce((sum, t) => sum + t.reward, 0);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-4 sm:p-5 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-green-100 text-sm mb-1">Total Earned</p>
            <div className="flex items-center gap-2">
              <Banknote size={24} className="sm:w-7 sm:h-7" />
              <span className="text-2xl sm:text-3xl font-bold">৳{totalEarned.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex gap-4 sm:gap-6">
            <div className="text-center sm:text-right">
              <div className="text-xl sm:text-2xl font-bold">{completedTasks.length}</div>
              <div className="text-xs text-green-100">Completed</div>
            </div>
            <div className="text-center sm:text-right">
              <div className="text-xl sm:text-2xl font-bold flex items-center gap-1">
                <Star size={14} className="fill-yellow-400 text-yellow-400" />
                {profile.rating}
              </div>
              <div className="text-xs text-green-100">Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {completedTasks.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            <TrendingUp size={48} className="mx-auto mb-3 text-slate-300" />
            <p className="font-medium">No completed tasks yet</p>
            <p className="text-sm">Complete tasks to see your history here</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
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
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {completedTasks.map((task) => (
                    <tr key={task.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{task.id}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{task.zoneName}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {task.completedAt ? new Date(task.completedAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-green-600">৳{task.reward}</td>
                      <td className="px-6 py-4 text-sm">
                        <Button size="sm" variant="outline" onClick={() => setSelectedTask(task)}>
                          <Eye size={14} className="mr-1" /> Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-slate-200">
              {completedTasks.map((task) => (
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
                    {task.completedAt ? new Date(task.completedAt).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              ))}
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
            {/* Before/After Images */}
            {(() => {
              const linkedReport = MOCK_REPORTS.find((r) => r.id === selectedTask.reportId);
              return linkedReport ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Before</p>
                    <img
                      src={linkedReport.imageUrl}
                      alt="Before"
                      className="w-full h-32 object-cover rounded-lg border border-slate-200"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">After (Your Work)</p>
                    <img
                      src={selectedTask.evidenceImageUrl || linkedReport.afterImageUrl}
                      alt="After"
                      className="w-full h-32 object-cover rounded-lg border-2 border-green-400"
                    />
                  </div>
                </div>
              ) : null;
            })()}

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
            {(() => {
              const linkedReport = MOCK_REPORTS.find((r) => r.id === selectedTask.reportId);
              return linkedReport?.aiAnalysis ? (
                <AIAnalysisDisplay analysis={linkedReport.aiAnalysis} compact />
              ) : null;
            })()}

            {/* Cleanup Comparison */}
            {(() => {
              const linkedReport = MOCK_REPORTS.find((r) => r.id === selectedTask.reportId);
              return linkedReport?.cleanupComparison ? (
                <CleanupComparisonDisplay comparison={linkedReport.cleanupComparison} />
              ) : null;
            })()}

            {/* Citizen Review */}
            {(() => {
              const linkedReport = MOCK_REPORTS.find((r) => r.id === selectedTask.reportId);
              if (!linkedReport?.review) {
                return (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center">
                    <MessageSquare size={24} className="mx-auto mb-2 text-slate-300" />
                    <p className="text-sm text-slate-500">No citizen review yet</p>
                    <p className="text-xs text-slate-400">The citizen hasn't reviewed this cleanup</p>
                  </div>
                );
              }
              return (
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
                            star <= linkedReport.review!.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-lg font-bold text-slate-800">
                      {linkedReport.review.rating}/5
                    </span>
                  </div>

                  {/* Comment */}
                  {linkedReport.review.comment && (
                    <div className="bg-white rounded-lg p-3 mb-3">
                      <p className="text-sm text-slate-700 italic">"{linkedReport.review.comment}"</p>
                    </div>
                  )}

                  {/* Review Date */}
                  <div className="flex items-center justify-end text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>{new Date(linkedReport.review.reviewedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </Modal>
    </div>
  );
};
