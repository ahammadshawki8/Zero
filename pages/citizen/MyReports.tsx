import React, { useState, useEffect } from 'react';
import { Button, Badge, Modal, Card, Toast } from '../../components/ui';
import { citizenAPI } from '../../services/api';
import {
  Leaf,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Loader,
  Star,
  Camera,
  User,
} from 'lucide-react';
import { Status, Report } from '../../types';
import { AIAnalysisDisplay, CleanupComparisonDisplay } from '../../components/AIAnalysisDisplay';
import { formatApiDate, formatApiDateTime, parseApiDate } from '../../utils/date';

export const MyReports = () => {
  type PointsHistoryEntry = {
    id?: string;
    green_points?: number;
    reason?: string;
    created_at?: string;
    report_id?: string;
    greenPoints?: number;
    reportId?: string;
    createdAt?: string;
  };

  const [reports, setReports] = useState<Report[]>([]);
  const [pointsHistory, setPointsHistory] = useState<PointsHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<Report | null>(null);
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [deletingReportId, setDeletingReportId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    description: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  }>({
    description: '',
    severity: 'LOW',
  });
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'warning' | 'info' }>({
    show: false,
    message: '',
    type: 'success',
  });

  // Load reports on component mount
  useEffect(() => {
    const loadReports = async () => {
      try {
        const reportsData = await citizenAPI.getMyReports();
        const pointsData = await citizenAPI.getPointsHistory();

        setReports(reportsData);
        setPointsHistory(Array.isArray(pointsData) ? pointsData : []);
      } catch (error) {
        console.error('Failed to load reports:', error);
        setToast({ show: true, message: 'Failed to load reports', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    };

    loadReports();
  }, []);

  const getStatusColor = (status: Status) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'APPROVED':
        return 'info';
      case 'DECLINED':
        return 'danger';
      case 'IN_PROGRESS':
        return 'purple';
      case 'SUBMITTED':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  const getStatusIcon = (status: Status) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle size={16} />;
      case 'APPROVED':
        return <CheckCircle size={16} />;
      case 'DECLINED':
        return <XCircle size={16} />;
      case 'IN_PROGRESS':
        return <Loader size={16} className="animate-spin" />;
      case 'SUBMITTED':
        return <Clock size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  const getStatusText = (status: Status) => {
    switch (status) {
      case 'SUBMITTED':
        return 'Pending Review';
      case 'APPROVED':
        return 'Approved';
      case 'DECLINED':
        return 'Declined';
      case 'IN_PROGRESS':
        return 'Being Cleaned';
      case 'COMPLETED':
        return 'Completed';
      default:
        return status;
    }
  };

  const handleViewReport = async (report: Report) => {
    try {
      // Get detailed report data
      const detailedReport = await citizenAPI.getReportDetails(report.id);
      setSelectedReport(detailedReport);
    } catch (error) {
      console.error('Failed to load report details:', error);
      setToast({ show: true, message: 'Failed to load report details', type: 'error' });
    }
  };

  const handleRateCleanup = async (report: Report) => {
    try {
      const detailedReport = await citizenAPI.getReportDetails(report.id);
      if (detailedReport.citizenReview || detailedReport.review) {
        setToast({ show: true, message: 'You already reviewed this cleanup', type: 'info' });
        return;
      }

      setSelectedReport(detailedReport);
      setShowReviewModal(true);
      setReviewRating(0);
      setReviewComment('');
    } catch (error) {
      console.error('Failed to load cleanup details for review:', error);
      setToast({ show: true, message: 'Failed to open review', type: 'error' });
    }
  };

  const handleEditReport = async (report: Report) => {
    try {
      const detailedReport = await citizenAPI.getReportDetails(report.id);
      if (detailedReport.status !== 'SUBMITTED') {
        setToast({ show: true, message: 'Only submitted reports can be edited', type: 'warning' });
        return;
      }

      setEditingReport(detailedReport);
      setEditForm({
        description: detailedReport.description || '',
        severity: detailedReport.severity,
      });
      setShowEditModal(true);
    } catch (error) {
      console.error('Failed to prepare report edit:', error);
      setToast({ show: true, message: 'Failed to load report for editing', type: 'error' });
    }
  };

  const handleSaveReportEdit = async () => {
    if (!editingReport) return;

    if (!editForm.description.trim()) {
      setToast({ show: true, message: 'Description is required', type: 'warning' });
      return;
    }

    setIsSavingEdit(true);
    try {
      const updated = await citizenAPI.updateReport(editingReport.id, {
        description: editForm.description.trim(),
        severity: editForm.severity,
      });

      setReports((prev) =>
        prev.map((r) =>
          r.id === updated.id
            ? {
                ...r,
                description: updated.description,
                severity: updated.severity,
                status: updated.status,
              }
            : r
        )
      );

      if (selectedReport && selectedReport.id === updated.id) {
        setSelectedReport({
          ...selectedReport,
          description: updated.description,
          severity: updated.severity,
          status: updated.status,
        });
      }

      setShowEditModal(false);
      setEditingReport(null);
      setToast({ show: true, message: 'Report updated successfully', type: 'success' });
    } catch (error: any) {
      console.error('Failed to update report:', error);
      setToast({ show: true, message: error.message || 'Failed to update report', type: 'error' });
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDeleteReport = async (report: Report) => {
    if (report.status !== 'SUBMITTED') {
      setToast({ show: true, message: 'Only submitted reports can be deleted', type: 'warning' });
      return;
    }

    setReportToDelete(report);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!reportToDelete) return;

    setDeletingReportId(reportToDelete.id);
    try {
      await citizenAPI.deleteReport(reportToDelete.id);
      setReports((prev) => prev.filter((r) => r.id !== reportToDelete.id));

      if (selectedReport?.id === reportToDelete.id) {
        setSelectedReport(null);
      }

      setShowDeleteModal(false);
      setReportToDelete(null);

      setToast({ show: true, message: 'Report deleted successfully', type: 'success' });
    } catch (error: any) {
      console.error('Failed to delete report:', error);
      setToast({ show: true, message: error.message || 'Failed to delete report', type: 'error' });
    } finally {
      setDeletingReportId(null);
    }
  };

  const handleSubmitReview = async () => {
    if (!selectedReport || reviewRating === 0) {
      setToast({ show: true, message: 'Please provide a rating', type: 'error' });
      return;
    }

    setIsSubmittingReview(true);
    try {
      await citizenAPI.submitReview(selectedReport.id, {
        rating: reviewRating,
        comment: reviewComment,
        timestamp: new Date().toISOString(),
      });

      const reviewAt = new Date().toISOString();
      const submittedReview = { rating: reviewRating, comment: reviewComment, reviewedAt: reviewAt, timestamp: reviewAt };

      // Update local list to immediately hide "Rate Cleanup" button.
      setReports(reports.map((r) =>
        r.id === selectedReport.id
          ? { ...r, citizenReview: submittedReview, review: submittedReview }
          : r
      ));

      if (selectedReport) {
        setSelectedReport({
          ...selectedReport,
          citizenReview: submittedReview,
          review: submittedReview,
        });
      }

      setShowReviewModal(false);
      setToast({ show: true, message: 'Review submitted successfully!', type: 'success' });
    } catch (error) {
      console.error('Failed to submit review:', error);
      setToast({ show: true, message: 'Failed to submit review', type: 'error' });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const getPointsEarned = (report: Report) => {
    if (!report?.id) return 0;

    return pointsHistory
      .filter((entry) => (entry.report_id || entry.reportId) === report.id)
      .reduce((sum, entry) => sum + Number(entry.green_points ?? entry.greenPoints ?? 0), 0);
  };

  const getPointsEarnedByReportId = (reportId?: string) => {
    if (!reportId) return 0;

    return pointsHistory
      .filter((entry) => (entry.report_id || entry.reportId) === reportId)
      .reduce((sum, entry) => sum + Number(entry.green_points ?? entry.greenPoints ?? 0), 0);
  };

  const getPointsBadgeText = (points: number) => {
    return `${points} pts`;
  };

  const getPointsTextColor = (points: number) => {
    if (points > 0) return 'text-green-600';
    if (points < 0) return 'text-red-600';
    return 'text-slate-600';
  };

  const getReportShortId = (reportId?: string) => {
    if (!reportId) return 'Unknown';
    return reportId.slice(-8);
  };

  const formatTimestamp = (timestamp?: string) => {
    return formatApiDate(timestamp);
  };

  const formatDateTime = (timestamp?: string) => {
    return formatApiDateTime(timestamp);
  };

  const selectedReportPoints = selectedReport
    ? pointsHistory.filter((entry) => {
        const reportRef = entry.report_id || entry.reportId;
        return reportRef === selectedReport.id;
      })
    : [];

  const selectedReportPointsTotal = selectedReportPoints.reduce(
    (sum, entry) => sum + Number(entry.green_points ?? entry.greenPoints ?? 0),
    0
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your reports...</p>
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
      <div>
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">My Reports</h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Track your waste reports and their cleanup progress</p>
        </div>
      </div>

      {/* Reports List */}
      {reports.length === 0 ? (
        <Card>
          <div className="text-center py-8 sm:py-10 md:py-12">
            <Camera size={40} className="sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-slate-300" />
            <h3 className="text-sm sm:text-base md:text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">No reports yet</h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-4 sm:mb-6">Start making a difference by reporting waste in your area</p>
            <Button onClick={() => window.location.hash = '#/citizen/report'}>
              Report Waste
            </Button>
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
                      <h3 className="font-semibold text-slate-900 truncate">
                        Report #{getReportShortId(report.id)}
                      </h3>
                      <p className="text-sm text-slate-500">{report.zoneName}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusColor(report.status)}>
                        {getStatusIcon(report.status)}
                        {getStatusText(report.status)}
                      </Badge>
                      {(() => {
                        const reportPoints = getPointsEarned(report);
                        if (reportPoints === 0) return null;
                        return (
                          <Badge variant="success">
                            <Leaf size={12} />
                            {getPointsBadgeText(reportPoints)}
                          </Badge>
                        );
                      })()}
                    </div>
                  </div>

                  <p className="text-slate-700 text-sm mb-3 line-clamp-2">{report.description}</p>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>Severity: {report.severity}</span>
                      <span>Reported: {formatTimestamp(report.timestamp)}</span>
                    </div>

                    <div className="flex gap-2">
                      {report.status === 'SUBMITTED' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditReport(report)}
                        >
                          Edit
                        </Button>
                      )}

                      {report.status === 'SUBMITTED' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteReport(report)}
                          disabled={deletingReportId === report.id}
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          {deletingReportId === report.id ? 'Deleting...' : 'Delete'}
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewReport(report)}
                      >
                        View Details
                      </Button>
                      {report.status === 'COMPLETED' && !report.citizenReview && (
                        <Button
                          size="sm"
                          onClick={() => handleRateCleanup(report)}
                          className="bg-orange-500 hover:bg-orange-600"
                        >
                          <Star size={14} className="mr-1" />
                          Rate Cleanup
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
        isOpen={!!selectedReport && !showReviewModal}
        onClose={() => setSelectedReport(null)}
        title={`Report #${getReportShortId(selectedReport?.id)}`}
      >
        {selectedReport && (
          <div className="space-y-6">
            {/* Status and Points */}
            <div className="flex justify-between items-center">
              <Badge variant={getStatusColor(selectedReport.status)}>
                {getStatusIcon(selectedReport.status)}
                {getStatusText(selectedReport.status)}
              </Badge>
              {getPointsEarnedByReportId(selectedReport.id) !== 0 && (
                <div className={`flex items-center gap-1 font-medium ${getPointsTextColor(getPointsEarnedByReportId(selectedReport.id))}`}>
                  <Leaf size={16} />
                  {getPointsBadgeText(getPointsEarnedByReportId(selectedReport.id))} Green Points
                </div>
              )}
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

            {/* Report Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-slate-900 mb-2">Report Details</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="text-slate-500">Zone:</span> {selectedReport.zoneName}</div>
                  <div><span className="text-slate-500">Severity:</span> {selectedReport.severity}</div>
                  <div>
                    <span className="text-slate-500">Reported:</span>{' '}
                    {parseApiDate(selectedReport.timestamp)
                      ? formatApiDateTime(selectedReport.timestamp)
                      : 'N/A'}
                  </div>
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

            {/* Cleanup Comparison */}
            {selectedReport.cleanupComparison && (
              <div>
                <h4 className="font-medium text-slate-900 mb-3">Before & After</h4>
                <CleanupComparisonDisplay comparison={selectedReport.cleanupComparison} />
              </div>
            )}

            {/* Points Breakdown */}
            <div>
              <h4 className="font-medium text-slate-900 mb-3">Points Breakdown</h4>
              {selectedReportPoints.length === 0 ? (
                <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40">
                  No points transactions recorded for this report yet.
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 px-3 py-2">
                    <span className="text-sm text-slate-700 dark:text-slate-200">Total earned from this report</span>
                    <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                      {selectedReportPointsTotal >= 0 ? '+' : ''}{selectedReportPointsTotal} pts
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                    {selectedReportPoints.map((entry, index) => {
                      const points = Number(entry.green_points ?? entry.greenPoints ?? 0);
                      const createdAt = entry.created_at || entry.createdAt;
                      const key = entry.id || `${selectedReport.id}-${index}`;
                      return (
                        <div
                          key={key}
                          className="px-3 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-white dark:bg-slate-900/20"
                        >
                          <div>
                            <p className="text-sm text-slate-800 dark:text-slate-100">{entry.reason || 'Points earned'}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{formatDateTime(createdAt)}</p>
                          </div>
                          <div className={`text-sm font-semibold ${points >= 0 ? 'text-green-600 dark:text-green-300' : 'text-red-600 dark:text-red-300'}`}>
                            {points >= 0 ? '+' : ''}{points} pts
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Citizen Review */}
            {selectedReport.citizenReview && (
              <div>
                <h4 className="font-medium text-slate-900 mb-3">Your Review</h4>
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={16}
                          className={`${
                            star <= selectedReport.citizenReview!.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-slate-500">
                      {formatApiDate(selectedReport.citizenReview.timestamp)}
                    </span>
                  </div>
                  {selectedReport.citizenReview.comment && (
                    <p className="text-sm text-slate-700">{selectedReport.citizenReview.comment}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Review Modal */}
      <Modal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        title="Rate the Cleanup"
        footer={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowReviewModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitReview}
              disabled={reviewRating === 0 || isSubmittingReview}
            >
              {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
            </Button>
          </div>
        }
      >
        <div className="space-y-6">
          {selectedReport && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Before (Reported)</p>
                  {selectedReport.imageUrl ? (
                    <img
                      src={selectedReport.imageUrl}
                      alt="Before cleanup"
                      className="w-full h-28 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
                    />
                  ) : (
                    <div className="w-full h-28 rounded-lg border border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center text-xs text-slate-500">
                      No before image
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">After (Cleaner Evidence)</p>
                  {selectedReport.afterImageUrl ? (
                    <img
                      src={selectedReport.afterImageUrl}
                      alt="After cleanup"
                      className="w-full h-28 object-cover rounded-lg border border-emerald-300 dark:border-emerald-700"
                    />
                  ) : (
                    <div className="w-full h-28 rounded-lg border border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center text-xs text-slate-500">
                      No after image
                    </div>
                  )}
                </div>
              </div>

              {selectedReport.cleanupComparison && (
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">AI Cleanup Verification</p>
                  <CleanupComparisonDisplay comparison={selectedReport.cleanupComparison} compact />
                </div>
              )}

              {selectedReport.aiAnalysis && (
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">Original Waste AI Analysis</p>
                  <AIAnalysisDisplay analysis={selectedReport.aiAnalysis} compact />
                </div>
              )}
            </>
          )}

          <div className="text-center">
            <User className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              How was the cleanup quality?
            </h3>
            <p className="text-slate-500 text-sm">
              Your feedback helps us maintain high cleanup standards
            </p>
          </div>

          {/* Star Rating */}
          <div className="flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                onClick={() => setReviewRating(star)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  size={32}
                  className={`${
                    star <= (hoveredStar || reviewRating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-slate-300'
                  } transition-colors`}
                />
              </button>
            ))}
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Additional Comments (Optional)
            </label>
            <textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Share your thoughts about the cleanup quality..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
              rows={3}
            />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingReport(null);
        }}
        title={`Edit Report #${getReportShortId(editingReport?.id)}`}
        footer={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowEditModal(false);
                setEditingReport(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveReportEdit}
              disabled={isSavingEdit}
            >
              {isSavingEdit ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Severity</label>
            <select
              value={editForm.severity}
              onChange={(e) =>
                setEditForm((prev) => ({
                  ...prev,
                  severity: e.target.value as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
                }))
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="CRITICAL">CRITICAL</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <textarea
              value={editForm.description}
              onChange={(e) =>
                setEditForm((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={5}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
              placeholder="Update your report description"
            />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          if (!deletingReportId) {
            setShowDeleteModal(false);
            setReportToDelete(null);
          }
        }}
        title={`Delete Report #${getReportShortId(reportToDelete?.id)}`}
        footer={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false);
                setReportToDelete(null);
              }}
              disabled={!!deletingReportId}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              disabled={!!deletingReportId}
              className="bg-red-600 hover:bg-red-700"
            >
              {deletingReportId ? 'Deleting...' : 'Delete Permanently'}
            </Button>
          </div>
        }
      >
        <div className="space-y-2">
          <p className="text-slate-700 dark:text-slate-200">
            Delete this report permanently? This action cannot be undone.
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Only submitted reports can be deleted. Approved or completed reports are locked for audit history.
          </p>
        </div>
      </Modal>
    </div>
  );
};