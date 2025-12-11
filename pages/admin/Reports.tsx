import { useState } from 'react';
import { Card, Badge, Button, Input, Modal, Select, Toast } from '../../components/ui';
import { MOCK_REPORTS, STATUS_INFO } from '../../constants';
import {
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  MapPin,
  User,
  Calendar,
  Banknote,
} from 'lucide-react';
import { Report, Severity } from '../../types';
import { AIAnalysisDisplay } from '../../components/AIAnalysisDisplay';

export const AdminReports = () => {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [taskReward, setTaskReward] = useState('500');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [declineReason, setDeclineReason] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'warning' | 'info' }>({ show: false, message: '', type: 'success' });

  // Filter reports - show SUBMITTED first for approval
  const filteredReports = MOCK_REPORTS.filter((r) => {
    if (filterStatus === 'ALL') return true;
    return r.status === filterStatus;
  }).sort((a, b) => {
    // SUBMITTED reports first
    if (a.status === 'SUBMITTED' && b.status !== 'SUBMITTED') return -1;
    if (b.status === 'SUBMITTED' && a.status !== 'SUBMITTED') return 1;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  const pendingCount = MOCK_REPORTS.filter((r) => r.status === 'SUBMITTED').length;

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'warning' | 'info' | 'danger' | 'purple' | 'success'> = {
      SUBMITTED: 'warning',
      APPROVED: 'info',
      DECLINED: 'danger',
      IN_PROGRESS: 'purple',
      COMPLETED: 'success',
    };
    return variants[status] || 'neutral';
  };

  const getSeverityBadge = (severity: Severity) => {
    const variants: Record<Severity, 'success' | 'warning' | 'danger'> = {
      LOW: 'success',
      MEDIUM: 'warning',
      HIGH: 'danger',
      CRITICAL: 'danger',
    };
    return variants[severity];
  };

  const handleApprove = () => {
    setShowCreateTaskModal(true);
  };

  const handleDecline = () => {
    setShowDeclineModal(true);
  };

  const handleCreateTask = () => {
    console.log('Task created:', {
      reportId: selectedReport?.id,
      reward: taskReward,
      dueDate: taskDueDate,
    });
    setToast({ show: true, message: `Task created for Report ${selectedReport?.id} with reward ৳${taskReward} BDT`, type: 'success' });
    setShowCreateTaskModal(false);
    setSelectedReport(null);
    setTaskReward('500');
    setTaskDueDate('');
  };

  const handleConfirmDecline = () => {
    console.log('Report declined:', {
      reportId: selectedReport?.id,
      reason: declineReason,
    });
    setToast({ show: true, message: `Report ${selectedReport?.id} has been declined.`, type: 'warning' });
    setShowDeclineModal(false);
    setSelectedReport(null);
    setDeclineReason('');
  };

  const suggestedReward = (severity: Severity) => {
    const rewards: Record<Severity, number> = {
      LOW: 300,
      MEDIUM: 500,
      HIGH: 800,
      CRITICAL: 1200,
    };
    return rewards[severity];
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
        {/* Stats Header */}
        {pendingCount > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Clock size={24} className="text-amber-600" />
            </div>
            <div>
              <p className="font-semibold text-amber-800">
                {pendingCount} Report{pendingCount > 1 ? 's' : ''} Pending Approval
              </p>
              <p className="text-sm text-amber-600">
                Approve and create tasks for submitted reports
              </p>
            </div>
          </div>
        )}

        <Card title="Citizen Reports">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <Input placeholder="Search reports..." className="w-full sm:w-64" />
            <Select
              options={[
                { value: 'ALL', label: 'All Status' },
                { value: 'SUBMITTED', label: 'Pending Approval' },
                { value: 'APPROVED', label: 'Approved' },
                { value: 'IN_PROGRESS', label: 'In Progress' },
                { value: 'COMPLETED', label: 'Completed' },
                { value: 'DECLINED', label: 'Declined' },
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
                  <th className="px-4 py-3">Report ID</th>
                  <th className="px-4 py-3">Submitted By</th>
                  <th className="px-4 py-3">Zone</th>
                  <th className="px-4 py-3">Severity</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReports.map((report) => (
                  <tr
                    key={report.id}
                    className={report.status === 'SUBMITTED' ? 'bg-amber-50/50' : ''}
                  >
                    <td className="px-4 py-4 font-medium">{report.id}</td>
                    <td className="px-4 py-4">{report.userName}</td>
                    <td className="px-4 py-4">{report.zoneName}</td>
                    <td className="px-4 py-4">
                      <Badge variant={getSeverityBadge(report.severity)}>
                        {report.severity}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant={getStatusBadge(report.status) as any}>
                        {STATUS_INFO[report.status]?.label || report.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-slate-500">
                      {new Date(report.timestamp).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Button
                        size="sm"
                        variant={report.status === 'SUBMITTED' ? 'primary' : 'outline'}
                        onClick={() => setSelectedReport(report)}
                      >
                        <Eye size={14} className="mr-1" />
                        {report.status === 'SUBMITTED' ? 'Approve' : 'View'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className={`p-4 rounded-xl border ${
                  report.status === 'SUBMITTED'
                    ? 'bg-amber-50 border-amber-200'
                    : 'bg-white border-slate-200'
                }`}
                onClick={() => setSelectedReport(report)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-semibold">{report.id}</span>
                    <p className="text-sm text-slate-500">{report.userName}</p>
                  </div>
                  <Badge variant={getStatusBadge(report.status) as any}>
                    {STATUS_INFO[report.status]?.label}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} /> {report.zoneName}
                  </span>
                  <Badge variant={getSeverityBadge(report.severity)} >
                    {report.severity}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Report Detail Modal */}
      <Modal
        isOpen={!!selectedReport && !showCreateTaskModal && !showDeclineModal}
        onClose={() => setSelectedReport(null)}
        title={`Report: ${selectedReport?.id}`}
        footer={
          selectedReport?.status === 'SUBMITTED' ? (
            <div className="flex gap-2 w-full">
              <Button variant="danger" onClick={handleDecline} className="flex-1">
                <XCircle size={16} className="mr-1" /> Decline
              </Button>
              <Button onClick={handleApprove} className="flex-1">
                <CheckCircle size={16} className="mr-1" /> Approve & Create Task
              </Button>
            </div>
          ) : (
            <Button onClick={() => setSelectedReport(null)}>Close</Button>
          )
        }
      >
        {selectedReport && (
          <div className="space-y-4">
            {/* Image */}
            {selectedReport.imageUrl && (
              <img
                src={selectedReport.imageUrl}
                alt="Report evidence"
                className="w-full h-48 object-cover rounded-lg"
              />
            )}

            {/* Status */}
            <div
              className={`p-3 rounded-lg flex items-center gap-2 ${
                selectedReport.status === 'SUBMITTED'
                  ? 'bg-amber-50 text-amber-800'
                  : selectedReport.status === 'DECLINED'
                  ? 'bg-red-50 text-red-800'
                  : 'bg-green-50 text-green-800'
              }`}
            >
              {selectedReport.status === 'SUBMITTED' ? (
                <Clock size={18} />
              ) : selectedReport.status === 'DECLINED' ? (
                <XCircle size={18} />
              ) : (
                <CheckCircle size={18} />
              )}
              <span className="font-medium">
                {STATUS_INFO[selectedReport.status]?.label} -{' '}
                {STATUS_INFO[selectedReport.status]?.description}
              </span>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <User size={16} className="text-slate-400" />
                <div>
                  <p className="text-slate-500">Submitted By</p>
                  <p className="font-medium">{selectedReport.userName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-slate-400" />
                <div>
                  <p className="text-slate-500">Zone</p>
                  <p className="font-medium">{selectedReport.zoneName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-slate-400" />
                <div>
                  <p className="text-slate-500">Severity</p>
                  <Badge variant={getSeverityBadge(selectedReport.severity)}>
                    {selectedReport.severity}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-slate-400" />
                <div>
                  <p className="text-slate-500">Reported</p>
                  <p className="font-medium">
                    {new Date(selectedReport.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-sm text-slate-500 mb-1">Description</p>
              <p className="bg-slate-50 p-3 rounded-lg text-sm">
                {selectedReport.description}
              </p>
            </div>

            {/* AI Analysis */}
            {selectedReport.aiAnalysis && (
              <AIAnalysisDisplay analysis={selectedReport.aiAnalysis} />
            )}

            {/* Suggested Reward for SUBMITTED */}
            {selectedReport.status === 'SUBMITTED' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Banknote size={18} className="text-blue-600" />
                  <span className="text-sm text-blue-800">Suggested Task Reward</span>
                </div>
                <span className="font-bold text-blue-800">
                  ৳{suggestedReward(selectedReport.severity)} BDT
                </span>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Create Task Modal */}
      <Modal
        isOpen={showCreateTaskModal}
        onClose={() => setShowCreateTaskModal(false)}
        title="Create Cleanup Task"
        footer={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowCreateTaskModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTask} disabled={!taskReward || !taskDueDate}>
              Create Task
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-lg">
            <p className="text-sm text-slate-500">Creating task for</p>
            <p className="font-semibold">{selectedReport?.id} - {selectedReport?.zoneName}</p>
            <p className="text-sm text-slate-600 mt-1">{selectedReport?.description}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Task Reward (BDT)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">৳</span>
              <Input
                type="number"
                value={taskReward}
                onChange={(e) => setTaskReward(e.target.value)}
                className="pl-8"
                placeholder="Enter reward amount"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Suggested: ৳{selectedReport ? suggestedReward(selectedReport.severity) : 500} based on severity
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Due Date
            </label>
            <Input
              type="date"
              value={taskDueDate}
              onChange={(e) => setTaskDueDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-800">
              <strong>Note:</strong> Once created, this task will be visible to all cleaners.
              The first cleaner to take it will be assigned.
            </p>
          </div>
        </div>
      </Modal>

      {/* Decline Modal */}
      <Modal
        isOpen={showDeclineModal}
        onClose={() => setShowDeclineModal(false)}
        title="Decline Report"
        footer={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowDeclineModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmDecline}>
              Confirm Decline
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
            <XCircle size={18} className="text-red-600 mt-0.5" />
            <div>
              <p className="font-medium text-red-800">Declining Report {selectedReport?.id}</p>
              <p className="text-sm text-red-600">
                The citizen will be notified that their report was declined.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Reason for Declining (Optional)
            </label>
            <textarea
              rows={3}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              placeholder="e.g., Duplicate report, insufficient evidence, outside service area..."
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};
