import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, Input, Modal, Select, Toast } from '../../components/ui';
import { adminAPI } from '../../services/api';
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
import { AIAnalysisDisplay, CleanupComparisonDisplay } from '../../components/AIAnalysisDisplay';
import { formatApiDate, formatApiDateTime, parseApiDate } from '../../utils/date';

export const AdminReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [showReopenModal, setShowReopenModal] = useState(false);
  const [aiSuggestedReward, setAiSuggestedReward] = useState<number | null>(null);
  const [aiSuggestedRange, setAiSuggestedRange] = useState<{ min: number; max: number } | null>(null);
  const [aiSuggestedConfidence, setAiSuggestedConfidence] = useState<number | null>(null);
  const [aiSuggestedComponents, setAiSuggestedComponents] = useState<Array<{ label: string; amount: number }>>([]);
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
  const [taskReward, setTaskReward] = useState('500');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [declineReason, setDeclineReason] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [isProcessing, setIsProcessing] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'warning' | 'info' }>({ 
    show: false, 
    message: '', 
    type: 'success' 
  });

  // Load reports on component mount and when filter changes
  useEffect(() => {
    const loadReports = async () => {
      try {
        let reportsData;
        if (filterStatus === 'SUBMITTED') {
          reportsData = await adminAPI.getPendingReports();
        } else {
          reportsData = await adminAPI.getAllReports();
        }
        
        // Filter reports based on status
        const filteredReports = filterStatus === 'ALL' 
          ? reportsData 
          : reportsData.filter((r: Report) => r.status === filterStatus);
        
        // Sort reports - SUBMITTED first
        const sortedReports = filteredReports.sort((a: Report, b: Report) => {
          if (a.status === 'SUBMITTED' && b.status !== 'SUBMITTED') return -1;
          if (b.status === 'SUBMITTED' && a.status !== 'SUBMITTED') return 1;
          return (parseApiDate(b.timestamp)?.getTime() ?? 0) - (parseApiDate(a.timestamp)?.getTime() ?? 0);
        });
        
        setReports(sortedReports);
      } catch (error) {
        console.error('Failed to load reports:', error);
        setToast({ show: true, message: 'Failed to load reports', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    };

    loadReports();
  }, [filterStatus]);

  const pendingCount = reports.filter((r) => r.status === 'SUBMITTED').length;

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'warning' | 'info' | 'danger' | 'purple' | 'success'> = {
      SUBMITTED: 'warning',
      APPROVED: 'info',
      DECLINED: 'danger',
      IN_PROGRESS: 'purple',
      COMPLETED: 'success',
    };
    return variants[status] || 'warning';
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

  const handleViewReport = async (report: Report) => {
    try {
      const detailedReport = await adminAPI.getReportDetails(report.id);
      setSelectedReport(detailedReport);
    } catch (error) {
      console.error('Failed to load report details:', error);
      setToast({ show: true, message: 'Failed to load report details', type: 'error' });
    }
  };

  const handleApprove = async (reportToApprove?: Report) => {
    const targetReport = reportToApprove || selectedReport;
    if (!targetReport) return;

    try {
      setIsLoadingSuggestion(true);

      const detailedReport = await adminAPI.getReportDetails(targetReport.id);
      setSelectedReport(detailedReport);

      const fallbackReward = suggestedReward(detailedReport.severity);
      let finalSuggestedReward = fallbackReward;
      setAiSuggestedRange(null);
      setAiSuggestedConfidence(null);
      setAiSuggestedComponents([]);

      try {
        const suggestion = await adminAPI.getRewardSuggestion(targetReport.id);
        if (suggestion?.suggested_reward) {
          finalSuggestedReward = Number(suggestion.suggested_reward);
          setAiSuggestedReward(finalSuggestedReward);
          if (suggestion.range_min != null && suggestion.range_max != null) {
            setAiSuggestedRange({ min: Number(suggestion.range_min), max: Number(suggestion.range_max) });
          }
          if (suggestion.confidence != null) {
            setAiSuggestedConfidence(Number(suggestion.confidence));
          }
          if (Array.isArray(suggestion.pricing_components)) {
            setAiSuggestedComponents(
              suggestion.pricing_components.map((c: any) => ({
                label: c.label || 'Pricing factor',
                amount: Number(c.amount || 0),
              }))
            );
          }
        } else {
          setAiSuggestedReward(fallbackReward);
        }
      } catch (suggestionError) {
        console.warn('Failed to get AI reward suggestion, using fallback:', suggestionError);
        setAiSuggestedReward(fallbackReward);
      }

      setTaskReward(finalSuggestedReward.toString());
      setTaskDueDate(getDefaultDueDate());
      setShowCreateTaskModal(true);
    } catch (error) {
      console.error('Failed to prepare approval modal:', error);
      setToast({ show: true, message: 'Failed to load report details for approval', type: 'error' });
    } finally {
      setIsLoadingSuggestion(false);
    }
  };

  const handleDecline = () => {
    setShowDeclineModal(true);
  };

  const handleReopen = (report: Report) => {
    setSelectedReport(report);
    setShowReopenModal(true);
  };

  const handleCreateTask = async () => {
    if (!selectedReport) return;
    
    setIsProcessing(true);
    try {
      await adminAPI.approveReport(selectedReport.id, {
        reward: parseInt(taskReward),
        dueDate: taskDueDate,
      });
      
      // Update the report in local state
      setReports(reports.map(r => 
        r.id === selectedReport.id 
          ? { ...r, status: 'APPROVED' as const }
          : r
      ));
      
      setToast({ 
        show: true, 
        message: `Report approved and task created with reward ৳${taskReward} BDT`, 
        type: 'success' 
      });
      
      setShowCreateTaskModal(false);
      setSelectedReport(null);
      setAiSuggestedReward(null);
      setAiSuggestedRange(null);
      setAiSuggestedConfidence(null);
      setAiSuggestedComponents([]);
      setTaskReward('500');
      setTaskDueDate('');
    } catch (error) {
      console.error('Failed to approve report:', error);
      setToast({ show: true, message: 'Failed to approve report', type: 'error' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmDecline = async () => {
    if (!selectedReport) return;
    
    setIsProcessing(true);
    try {
      await adminAPI.declineReport(selectedReport.id, declineReason);
      
      // Update the report in local state
      setReports(reports.map(r => 
        r.id === selectedReport.id 
          ? { ...r, status: 'DECLINED' as const }
          : r
      ));
      
      setToast({ 
        show: true, 
        message: `Report ${selectedReport.id.slice(-8)} has been declined`, 
        type: 'warning' 
      });
      
      setShowDeclineModal(false);
      setSelectedReport(null);
      setDeclineReason('');
    } catch (error) {
      console.error('Failed to decline report:', error);
      setToast({ show: true, message: 'Failed to decline report', type: 'error' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmReopen = async () => {
    if (!selectedReport) return;

    setIsProcessing(true);
    try {
      await adminAPI.reopenReport(selectedReport.id);

      setReports(reports.map(r =>
        r.id === selectedReport.id
          ? { ...r, status: 'SUBMITTED' as const }
          : r
      ));

      setToast({
        show: true,
        message: `Report ${selectedReport.id.slice(-8)} moved back to pending review`,
        type: 'info'
      });

      setShowReopenModal(false);
      setSelectedReport(null);
    } catch (error) {
      console.error('Failed to reopen report:', error);
      setToast({ show: true, message: 'Failed to move report back to pending', type: 'error' });
    } finally {
      setIsProcessing(false);
    }
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

  const getDefaultDueDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7); // 7 days from now
    return date.toISOString().split('T')[0];
  };

  const closeCreateTaskModal = () => {
    setShowCreateTaskModal(false);
    setAiSuggestedReward(null);
    setAiSuggestedRange(null);
    setAiSuggestedConfidence(null);
    setAiSuggestedComponents([]);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Toast
        isOpen={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
        message={toast.message}
        type={toast.type}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Report Management</h1>
          <p className="text-slate-600">Review and approve citizen waste reports</p>
        </div>
        {pendingCount > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-800 rounded-lg">
            <AlertTriangle size={16} />
            <span className="font-medium">{pendingCount} reports pending review</span>
          </div>
        )}
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-wrap gap-2">
          {['ALL', 'SUBMITTED', 'APPROVED', 'DECLINED', 'IN_PROGRESS', 'COMPLETED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filterStatus === status
                  ? 'bg-green-500 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status === 'ALL' ? 'All Reports' : status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </Card>

      {/* Reports List */}
      {reports.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <AlertTriangle size={48} className="mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No reports found</h3>
            <p className="text-slate-500">No reports match the current filter criteria</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Report Image */}
                {report.imageUrl && (
                  <div className="lg:w-32 lg:h-32 w-full h-48 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={report.imageUrl}
                      alt="Waste report"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Report Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-3">
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        Report #{report.id.slice(-8)}
                      </h3>
                      <p className="text-sm text-slate-500 flex items-center gap-1">
                        <User size={12} />
                        {report.userName} • {report.zoneName}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusBadge(report.status)}>
                        {report.status.replace('_', ' ')}
                      </Badge>
                      <Badge variant={getSeverityBadge(report.severity)}>
                        {report.severity}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-slate-700 text-sm mb-3 line-clamp-2">{report.description}</p>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {formatApiDate(report.timestamp)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={12} />
                        {report.location ? `${report.location.lat.toFixed(4)}, ${report.location.lng.toFixed(4)}` : 'Location not available'}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewReport(report)}
                      >
                        <Eye size={14} className="mr-1" />
                        View Details
                      </Button>
                      {report.status === 'SUBMITTED' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedReport(report);
                              handleApprove(report);
                            }}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle size={14} className="mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedReport(report);
                              handleDecline();
                            }}
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <XCircle size={14} className="mr-1" />
                            Decline
                          </Button>
                        </>
                      )}
                      {report.status === 'DECLINED' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReopen(report)}
                          className="border-amber-300 text-amber-700 hover:bg-amber-50"
                        >
                          <Clock size={14} className="mr-1" />
                          Move to Pending
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Report Details Modal */}
      <Modal
        isOpen={!!selectedReport && !showCreateTaskModal && !showDeclineModal && !showReopenModal}
        onClose={() => setSelectedReport(null)}
        title={`Report #${selectedReport?.id.slice(-8)}`}
      >
        {selectedReport && (
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
            {/* Status and Basic Info */}
            <div className="flex justify-between items-start">
              <div>
                <Badge variant={getStatusBadge(selectedReport.status)}>
                  {selectedReport.status.replace('_', ' ')}
                </Badge>
                <div className="ml-2">
                  <Badge variant={getSeverityBadge(selectedReport.severity)}>
                    {selectedReport.severity}
                  </Badge>
                </div>
              </div>
              <div className="text-right text-sm text-slate-500">
                <div>Reported by: {selectedReport.userName}</div>
                <div>{formatApiDateTime(selectedReport.timestamp)}</div>
              </div>
            </div>

            {/* Report Image */}
            {selectedReport.imageUrl && (
              <div className="w-full h-64 bg-slate-100 rounded-lg overflow-hidden">
                <img
                  src={selectedReport.imageUrl}
                  alt="Waste report"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Report Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-slate-900 mb-2">Location Details</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="text-slate-500">Zone:</span> {selectedReport.zoneName}</div>
                  <div><span className="text-slate-500">Coordinates:</span> {selectedReport.location ? `${selectedReport.location.lat.toFixed(6)}, ${selectedReport.location.lng.toFixed(6)}` : 'Not available'}</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-slate-900 mb-2">Description</h4>
                <p className="text-sm text-slate-700">{selectedReport.description}</p>
              </div>
            </div>

            {/* AI Analysis */}
            {selectedReport.aiAnalysis && (
              <div>
                <h4 className="font-medium text-slate-900 mb-3">AI Analysis</h4>
                <AIAnalysisDisplay analysis={selectedReport.aiAnalysis} />
              </div>
            )}

            {selectedReport.cleanupComparison && (
              <div>
                <h4 className="font-medium text-slate-900 mb-3">Cleanup Verification Report (AI Before vs After)</h4>
                <CleanupComparisonDisplay comparison={selectedReport.cleanupComparison} />
              </div>
            )}

            {/* Action Buttons */}
            {selectedReport.status === 'SUBMITTED' && (
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  onClick={() => handleApprove(selectedReport)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle size={16} className="mr-2" />
                  Approve & Create Task
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDecline}
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  <XCircle size={16} className="mr-2" />
                  Decline Report
                </Button>
              </div>
            )}
            {selectedReport.status === 'DECLINED' && (
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => handleReopen(selectedReport)}
                  className="border-amber-300 text-amber-700 hover:bg-amber-50"
                >
                  <Clock size={16} className="mr-2" />
                  Move Back to Pending
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Create Task Modal */}
      <Modal
        isOpen={showCreateTaskModal}
        onClose={closeCreateTaskModal}
        title="Create Cleanup Task"
        footer={
          <div className="flex gap-2">
            <Button variant="outline" onClick={closeCreateTaskModal}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateTask}
              disabled={isProcessing}
            >
              {isProcessing ? 'Creating...' : 'Create Task'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-lg">
            <h4 className="font-medium text-slate-900 mb-2">Report Summary</h4>
            <p className="text-sm text-slate-600">{selectedReport?.description}</p>
            <div className="mt-2 text-xs text-slate-500">
              Zone: {selectedReport?.zoneName} • Severity: {selectedReport?.severity}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Task Reward (BDT)
            </label>
            <Input
              type="number"
              value={taskReward}
              onChange={(e) => setTaskReward(e.target.value)}
              placeholder="Enter reward amount"
            />

            <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-emerald-800">
                  AI + Local Market Suggested: ৳{(aiSuggestedReward ?? (selectedReport ? suggestedReward(selectedReport.severity) : 500)).toLocaleString()} BDT
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setTaskReward(String(aiSuggestedReward ?? (selectedReport ? suggestedReward(selectedReport.severity) : 500)))}
                  className="border-emerald-300 text-emerald-700 hover:bg-emerald-100"
                >
                  Use Suggested
                </Button>
              </div>

              {aiSuggestedRange && (
                <p className="text-[11px] text-emerald-700 mt-1">
                  Suggested range: ৳{aiSuggestedRange.min.toLocaleString()} - ৳{aiSuggestedRange.max.toLocaleString()}
                </p>
              )}
              {aiSuggestedConfidence !== null && (
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  Confidence: {aiSuggestedConfidence}%
                </p>
              )}
              {isLoadingSuggestion && (
                <p className="text-[11px] text-emerald-700 mt-0.5">Calculating suggestion...</p>
              )}
            </div>

            {aiSuggestedComponents.length > 0 && (
              <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 p-2">
                <p className="text-[11px] font-semibold text-slate-700 mb-1">Pricing basis</p>
                <div className="space-y-1 max-h-24 overflow-y-auto">
                  {aiSuggestedComponents.slice(0, 6).map((component, idx) => (
                    <div key={`${component.label}-${idx}`} className="flex items-center justify-between text-[11px] text-slate-600">
                      <span className="truncate pr-2">{component.label}</span>
                      <span>৳{Number(component.amount).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Due Date
            </label>
            <Input
              type="date"
              value={taskDueDate}
              onChange={(e) => setTaskDueDate(e.target.value)}
            />
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
            <Button 
              onClick={handleConfirmDecline}
              disabled={isProcessing}
              className="bg-red-600 hover:bg-red-700"
            >
              {isProcessing ? 'Declining...' : 'Decline Report'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="text-center py-4">
            <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Decline this report?</h3>
            <p className="text-slate-500 text-sm">
              Please provide a reason for declining this report. The citizen will be notified.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Reason for Decline
            </label>
            <textarea
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="Explain why this report is being declined..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
              rows={3}
              required
            />
          </div>
        </div>
      </Modal>

      {/* Reopen Modal */}
      <Modal
        isOpen={showReopenModal}
        onClose={() => setShowReopenModal(false)}
        title="Move Report Back to Pending"
        footer={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowReopenModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmReopen}
              disabled={isProcessing}
              className="bg-amber-600 hover:bg-amber-700"
            >
              {isProcessing ? 'Moving...' : 'Move to Pending'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="text-center py-4">
            <Clock className="w-16 h-16 mx-auto mb-4 text-amber-500" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Reopen this declined report?</h3>
            <p className="text-slate-500 text-sm">
              This will move the report back to pending review so it can be approved or declined again.
            </p>
          </div>

          <div className="p-3 bg-amber-50 rounded-lg text-sm text-amber-800">
            Report: #{selectedReport?.id.slice(-8)}
          </div>
        </div>
      </Modal>
    </div>
  );
};