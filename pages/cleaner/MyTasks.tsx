import { useState } from 'react';
import { Button, Badge, Modal, Card, Toast } from '../../components/ui';
import { MOCK_TASKS, MOCK_CLEANER_PROFILE } from '../../constants';
import {
  Camera,
  Calendar,
  CheckCircle,
  Banknote,
  Clock,
  TrendingUp,
  Star,
} from 'lucide-react';
import { Task } from '../../types';

export const MyTasks = () => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [evidenceImage, setEvidenceImage] = useState<string | null>(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as const });

  const profile = MOCK_CLEANER_PROFILE;
  const myTasks = MOCK_TASKS.filter(
    (t) => t.cleanerId === profile.userId && t.status === 'IN_PROGRESS'
  );

  const handleStartComplete = (task: Task) => {
    setActiveTask(task);
    setShowCompleteModal(true);
  };

  const handleComplete = () => {
    console.log('Task completed:', activeTask?.id, 'Evidence:', evidenceImage);
    setToast({ show: true, message: `Task ${activeTask?.id} completed! ৳${activeTask?.reward} will be added to your earnings.`, type: 'success' });
    setShowCompleteModal(false);
    setActiveTask(null);
    setEvidenceImage(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setEvidenceImage(reader.result as string);
      reader.readAsDataURL(file);
    }
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
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-4 sm:p-5 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-purple-100 text-sm mb-1">Active Tasks</p>
            <div className="flex items-center gap-2">
              <Clock size={24} className="sm:w-7 sm:h-7" />
              <span className="text-2xl sm:text-3xl font-bold">{myTasks.length}</span>
              <span className="text-purple-200 text-sm sm:text-base">in progress</span>
            </div>
          </div>
          <div className="flex gap-4 sm:gap-6">
            <div className="text-center sm:text-right">
              <div className="text-lg sm:text-2xl font-bold">৳{profile.pendingEarnings.toLocaleString()}</div>
              <div className="text-xs text-purple-100">Pending</div>
            </div>
            <div className="text-center sm:text-right">
              <div className="text-lg sm:text-2xl font-bold flex items-center gap-1">
                <Star size={14} className="fill-yellow-400 text-yellow-400" />
                {profile.rating}
              </div>
              <div className="text-xs text-purple-100">Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* My Tasks */}
      {myTasks.length === 0 ? (
        <div className="py-12 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
          <Clock size={48} className="mx-auto mb-3 text-slate-300" />
          <p className="font-medium">No active tasks</p>
          <p className="text-sm">Take a task from the Available Tasks page to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myTasks.map((task) => (
            <Card key={task.id} className="border-2 border-purple-200 bg-purple-50/30">
              <div className="flex justify-between items-start mb-3">
                <Badge variant="purple">In Progress</Badge>
                <span className="text-xs text-slate-500 font-mono">{task.id}</span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-1">{task.zoneName}</h3>
              <p className="text-slate-600 text-sm mb-4">{task.description}</p>

              <div className="flex items-center text-xs text-slate-500 mb-4 space-x-4">
                <div className="flex items-center">
                  <Calendar size={14} className="mr-1" />
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Clock size={14} className="mr-1" />
                  Taken: {task.takenAt ? new Date(task.takenAt).toLocaleDateString() : 'N/A'}
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 flex items-center justify-between">
                <span className="text-green-700 font-medium text-sm">You'll Earn</span>
                <span className="text-xl font-bold text-green-700">৳{task.reward}</span>
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
            <Button onClick={handleComplete} disabled={!evidenceImage}>
              <CheckCircle size={16} className="mr-1" /> Mark Completed
            </Button>
          </div>
        }
      >
        {activeTask && (
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="font-semibold text-slate-800">{activeTask.description}</h4>
              <p className="text-sm text-slate-500 mt-1">Location: {activeTask.zoneName}</p>
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
              <span className="text-2xl font-bold text-green-700">৳{activeTask.reward}</span>
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
    </>
  );
};
