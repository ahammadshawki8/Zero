import React, { useState } from 'react';
import { Button, Badge, Modal, Card } from '../../components/ui';
import { MOCK_TASKS } from '../../constants';
import { Camera, Calendar, MapPin, CheckCircle } from 'lucide-react';

export const CleanerDashboard = () => {
  const [activeTask, setActiveTask] = useState<any>(null);
  const [evidenceImage, setEvidenceImage] = useState<string | null>(null);
  const [view, setView] = useState<'TASKS' | 'HISTORY'>('TASKS');

  const handleComplete = (taskId: string) => {
    alert(`Task ${taskId} marked as completed!`);
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

  const pendingTasks = MOCK_TASKS.filter(t => t.status === 'ASSIGNED' || t.status === 'IN_PROGRESS');
  const completedTasks = MOCK_TASKS.filter(t => t.status === 'COMPLETED');

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg w-fit">
        <button 
          onClick={() => setView('TASKS')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${view === 'TASKS' ? 'bg-white text-green-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          My Tasks
        </button>
        <button 
          onClick={() => setView('HISTORY')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${view === 'HISTORY' ? 'bg-white text-green-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          History
        </button>
      </div>

      {view === 'TASKS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingTasks.map(task => (
            <Card key={task.id} className="flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <Badge variant="warning">Priority: {task.priority}</Badge>
                <span className="text-xs text-slate-500 font-mono">{task.id}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{task.zoneName}</h3>
              <p className="text-slate-600 text-sm mb-4 flex-grow">{task.description}</p>
              
              <div className="flex items-center text-xs text-slate-500 mb-6 space-x-4">
                <div className="flex items-center">
                  <Calendar size={14} className="mr-1" />
                  {new Date(task.dueDate).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <MapPin size={14} className="mr-1" />
                  Zone {task.zoneId}
                </div>
              </div>

              <Button onClick={() => setActiveTask(task)} className="w-full">
                Start / Complete
              </Button>
            </Card>
          ))}
          {pendingTasks.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
              <CheckCircle size={48} className="mx-auto mb-3 text-slate-300" />
              <p>No pending tasks assigned. Good job!</p>
            </div>
          )}
        </div>
      )}

      {view === 'HISTORY' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Task ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Zone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Completed On</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Evidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {completedTasks.map(task => (
                <tr key={task.id}>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{task.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{task.zoneName}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{new Date(task.dueDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm">
                    {task.evidenceImageUrl ? (
                      <a href={task.evidenceImageUrl} target="_blank" rel="noreferrer" className="text-green-600 hover:underline">View Photo</a>
                    ) : <span className="text-slate-400">N/A</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Complete Task Modal */}
      <Modal
        isOpen={!!activeTask}
        onClose={() => { setActiveTask(null); setEvidenceImage(null); }}
        title="Complete Task"
        footer={
          <>
            <Button variant="ghost" onClick={() => { setActiveTask(null); setEvidenceImage(null); }}>Cancel</Button>
            <Button onClick={() => handleComplete(activeTask?.id)} disabled={!evidenceImage}>Mark Completed</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-lg">
            <h4 className="font-semibold text-slate-800">{activeTask?.description}</h4>
            <p className="text-sm text-slate-500 mt-1">Location: {activeTask?.zoneName}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Upload Proof of Work</label>
            <label className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center block cursor-pointer hover:bg-slate-50 transition-colors">
              <input type="file" className="sr-only" accept="image/*" onChange={handleImageUpload} />
              {evidenceImage ? (
                <img src={evidenceImage} alt="Preview" className="max-h-48 mx-auto rounded shadow-sm" />
              ) : (
                <div className="space-y-2">
                  <Camera className="mx-auto text-slate-400" size={32} />
                  <span className="text-sm text-green-600 font-medium block">Upload a file</span>
                </div>
              )}
            </label>
          </div>
        </div>
      </Modal>
    </div>
  );
};