import { useState } from 'react';
import { Button, Badge, Modal, Card, Toast } from '../../components/ui';
import {
  MOCK_REPORTS,
  MOCK_CURRENT_USER_PROFILE,
  POINTS_CONFIG,
  STATUS_INFO,
} from '../../constants';
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

export const MyReports = () => {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as const });
  const userProfile = MOCK_CURRENT_USER_PROFILE;

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
        return <CheckCircle size={16} className="text-green-500" />;
      case 'APPROVED':
        return <AlertCircle size={16} className="text-blue-500" />;
      case 'DECLINED':
        return <XCircle size={16} className="text-red-500" />;
      case 'IN_PROGRESS':
        return <Loader size={16} className="text-purple-500" />;
      default:
        return <Clock size={16} className="text-yellow-500" />;
    }
  };

  const getPointsForReport = (report: Report) => {
    const severityBonus =
      POINTS_CONFIG.SEVERITY_BONUS[
        report.severity as keyof typeof POINTS_CONFIG.SEVERITY_BONUS
      ] || 0;
    const reviewBonus = report.review ? POINTS_CONFIG.REVIEW_SUBMITTED : 0;

    switch (report.status) {
      case 'SUBMITTED':
        return POINTS_CONFIG.REPORT_CREATED;
      case 'APPROVED':
      case 'IN_PROGRESS':
        return POINTS_CONFIG.REPORT_CREATED + POINTS_CONFIG.REPORT_APPROVED + severityBonus;
      case 'COMPLETED':
        return (
          POINTS_CONFIG.REPORT_CREATED +
          POINTS_CONFIG.REPORT_APPROVED +
          POINTS_CONFIG.TASK_COMPLETED +
          severityBonus +
          reviewBonus
        );
      case 'DECLINED':
        return 0;
      default:
        return 0;
    }
  };

  const getStatusDescription = (status: Status) => {
    return STATUS_INFO[status]?.description || '';
  };

  const handleOpenReview = () => {
    setReviewRating(selectedReport?.review?.rating || 0);
    setReviewComment(selectedReport?.review?.comment || '');
    setShowReviewModal(true);
  };

  const handleSubmitReview = () => {
    // In real app, this would send to backend
    console.log('Review submitted:', { rating: reviewRating, comment: reviewComment });
    setToast({ show: true, message: 'Thank you for your review! Your feedback helps improve our service.', type: 'success' });
    setShowReviewModal(false);
  };

  const renderStars = (rating: number, interactive = false, size = 16) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && setReviewRating(star)}
            onMouseEnter={() => interactive && setHoveredStar(star)}
            onMouseLeave={() => interactive && setHoveredStar(0)}
            className={interactive ? 'cursor-pointer' : 'cursor-default'}
          >
            <Star
              size={size}
              className={`${
                star <= (interactive ? hoveredStar || reviewRating : rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-slate-300'
              } transition-colors`}
            />
          </button>
        ))}
      </div>
    );
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
        {/* Points Summary Card */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-4 sm:p-5 text-white shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-green-100 text-sm mb-1">Your Green Impact</p>
              <div className="flex items-center gap-2">
                <Leaf size={24} className="sm:w-7 sm:h-7" />
                <span className="text-2xl sm:text-3xl font-bold">{userProfile.greenPoints}</span>
                <span className="text-green-100 text-sm sm:text-base">points</span>
              </div>
            </div>
            <div className="flex gap-4 sm:gap-6">
              <div className="text-center sm:text-right">
                <div className="text-xl sm:text-2xl font-bold">{userProfile.approvedReports}</div>
                <div className="text-xs text-green-100">Approved</div>
              </div>
              <div className="text-center sm:text-right">
                <div className="text-xl sm:text-2xl font-bold">#{userProfile.rank}</div>
                <div className="text-xs text-green-100">Rank</div>
              </div>
            </div>
          </div>
        </div>

        {/* Reports Section */}
        <Card title="Submission History">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Zone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Points
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {MOCK_REPORTS.map((report) => {
                  const points = getPointsForReport(report);
                  return (
                    <tr key={report.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                        {report.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {report.zoneName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {new Date(report.timestamp).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(report.status)}
                          <Badge variant={getStatusColor(report.status) as any}>
                            {STATUS_INFO[report.status]?.label || report.status}
                          </Badge>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {points > 0 ? (
                          <div className="flex items-center gap-1 text-green-600 font-medium">
                            <Leaf size={14} />+{points}
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setSelectedReport(report)}
                          className="text-green-600 hover:text-green-900"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {MOCK_REPORTS.map((report) => {
              const points = getPointsForReport(report);
              return (
                <div
                  key={report.id}
                  className="bg-white p-4 rounded-xl shadow-sm border border-slate-200"
                  onClick={() => setSelectedReport(report)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-bold text-slate-800">{report.id}</span>
                        <Badge variant={getStatusColor(report.status) as any}>
                          {STATUS_INFO[report.status]?.label || report.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600">{report.zoneName}</p>
                      <p className="text-xs text-slate-400">
                        {new Date(report.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <img
                      src={report.imageUrl}
                      alt=""
                      className="h-16 w-16 rounded-lg object-cover bg-slate-100"
                    />
                  </div>
                  {points > 0 ? (
                    <div className="flex items-center gap-1 text-green-600 font-medium text-sm bg-green-50 px-3 py-1.5 rounded-lg w-fit">
                      <Leaf size={14} />+{points} Green Points
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400">No points earned</div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Report Detail Modal */}
      <Modal
        isOpen={!!selectedReport && !showReviewModal}
        onClose={() => setSelectedReport(null)}
        title={`Report Details: ${selectedReport?.id}`}
        footer={<Button onClick={() => setSelectedReport(null)}>Close</Button>}
      >
        {selectedReport && (
          <div className="space-y-4">
            {/* Before/After Comparison for Completed Reports */}
            {selectedReport.status === 'COMPLETED' && selectedReport.afterImageUrl ? (
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">Before & After</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                      <Camera size={12} /> Before (Your Report)
                    </p>
                    <img
                      src={selectedReport.imageUrl}
                      alt="Before cleanup"
                      className="w-full h-40 object-cover rounded-lg shadow-sm border border-slate-200"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                      <CheckCircle size={12} className="text-green-500" /> After (Cleaned)
                    </p>
                    <img
                      src={selectedReport.afterImageUrl}
                      alt="After cleanup"
                      className="w-full h-40 object-cover rounded-lg shadow-sm border border-green-200"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <img
                src={selectedReport.imageUrl}
                alt="Evidence"
                className="w-full rounded-lg shadow-sm"
              />
            )}

            {/* Status Banner */}
            <div
              className={`p-4 rounded-xl flex items-center gap-3 ${
                selectedReport.status === 'COMPLETED'
                  ? 'bg-green-50 border border-green-200'
                  : selectedReport.status === 'DECLINED'
                  ? 'bg-red-50 border border-red-200'
                  : selectedReport.status === 'IN_PROGRESS'
                  ? 'bg-purple-50 border border-purple-200'
                  : selectedReport.status === 'APPROVED'
                  ? 'bg-blue-50 border border-blue-200'
                  : 'bg-yellow-50 border border-yellow-200'
              }`}
            >
              {getStatusIcon(selectedReport.status)}
              <div className="flex-1">
                <div className="font-medium">
                  {STATUS_INFO[selectedReport.status as Status]?.label}
                </div>
                <div className="text-sm text-slate-500">
                  {getStatusDescription(selectedReport.status)}
                </div>
              </div>
            </div>

            {/* AI Waste Analysis */}
            {selectedReport.aiAnalysis && (
              <AIAnalysisDisplay analysis={selectedReport.aiAnalysis} compact />
            )}

            {/* AI Cleanup Comparison for Completed Reports */}
            {selectedReport.status === 'COMPLETED' && selectedReport.cleanupComparison && (
              <CleanupComparisonDisplay comparison={selectedReport.cleanupComparison} compact />
            )}

            {/* Cleaner Info for Completed Reports */}
            {selectedReport.status === 'COMPLETED' && selectedReport.cleanerName && (
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User size={20} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">
                    Cleaned by {selectedReport.cleanerName}
                  </p>
                  <p className="text-xs text-slate-500">
                    Completed on{' '}
                    {selectedReport.completedAt
                      ? new Date(selectedReport.completedAt).toLocaleString()
                      : 'N/A'}
                  </p>
                </div>
              </div>
            )}

            {/* Existing Review or Review Button */}
            {selectedReport.status === 'COMPLETED' && (
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-slate-700">Citizen Watchdog Review</p>
                  {!selectedReport.review && (
                    <Button size="sm" onClick={handleOpenReview}>
                      <Star size={14} className="mr-1" /> Rate Cleanup
                    </Button>
                  )}
                </div>

                {selectedReport.review ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {renderStars(selectedReport.review.rating)}
                      <span className="text-sm font-medium text-slate-700">
                        {selectedReport.review.rating}/5
                      </span>
                    </div>
                    {selectedReport.review.comment && (
                      <p className="text-sm text-slate-600 italic">
                        "{selectedReport.review.comment}"
                      </p>
                    )}
                    <p className="text-xs text-slate-400 mt-2">
                      Reviewed on{' '}
                      {new Date(selectedReport.review.reviewedAt).toLocaleDateString()}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">
                    Help improve our service by rating this cleanup job.
                  </p>
                )}
              </div>
            )}

            {/* Points Earned Banner */}
            {getPointsForReport(selectedReport) > 0 && (
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Leaf size={24} />
                  <div>
                    <div className="font-bold">Points Earned!</div>
                    <div className="text-sm text-green-100">Thank you for your contribution</div>
                  </div>
                </div>
                <div className="text-2xl font-bold">+{getPointsForReport(selectedReport)}</div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Zone</p>
                <p className="font-medium">{selectedReport.zoneName}</p>
              </div>
              <div>
                <p className="text-slate-500">Reported</p>
                <p className="font-medium">
                  {new Date(selectedReport.timestamp).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Severity</p>
                <p className="font-medium">{selectedReport.severity}</p>
              </div>
              <div>
                <p className="text-slate-500">Status</p>
                <div className="flex items-center gap-2">
                  {getStatusIcon(selectedReport.status)}
                  <Badge variant={getStatusColor(selectedReport.status) as any}>
                    {STATUS_INFO[selectedReport.status as Status]?.label}
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <p className="text-slate-500 text-sm mb-1">Description</p>
              <p className="text-slate-800 bg-slate-50 p-3 rounded-lg text-sm">
                {selectedReport.description}
              </p>
            </div>

            {/* Points Breakdown */}
            {getPointsForReport(selectedReport) > 0 && (
              <div className="border-t pt-4">
                <p className="text-sm font-medium text-slate-700 mb-2">Points Breakdown</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Report Created</span>
                    <span className="text-green-600">+{POINTS_CONFIG.REPORT_CREATED}</span>
                  </div>
                  {['APPROVED', 'IN_PROGRESS', 'COMPLETED'].includes(selectedReport.status) && (
                    <div className="flex justify-between text-slate-600">
                      <span>Approved Bonus</span>
                      <span className="text-green-600">+{POINTS_CONFIG.REPORT_APPROVED}</span>
                    </div>
                  )}
                  {selectedReport.status === 'COMPLETED' && (
                    <div className="flex justify-between text-slate-600">
                      <span>Task Completed Bonus</span>
                      <span className="text-green-600">+{POINTS_CONFIG.TASK_COMPLETED}</span>
                    </div>
                  )}
                  {selectedReport.status === 'COMPLETED' && selectedReport.review && (
                    <div className="flex justify-between text-slate-600">
                      <span>Review Submitted Bonus</span>
                      <span className="text-green-600">+{POINTS_CONFIG.REVIEW_SUBMITTED}</span>
                    </div>
                  )}
                  {POINTS_CONFIG.SEVERITY_BONUS[
                    selectedReport.severity as keyof typeof POINTS_CONFIG.SEVERITY_BONUS
                  ] > 0 &&
                    ['APPROVED', 'IN_PROGRESS', 'COMPLETED'].includes(selectedReport.status) && (
                      <div className="flex justify-between text-slate-600">
                        <span>Severity Bonus ({selectedReport.severity})</span>
                        <span className="text-green-600">
                          +
                          {
                            POINTS_CONFIG.SEVERITY_BONUS[
                              selectedReport.severity as keyof typeof POINTS_CONFIG.SEVERITY_BONUS
                            ]
                          }
                        </span>
                      </div>
                    )}
                  <div className="flex justify-between font-medium text-slate-800 border-t pt-2">
                    <span>Total</span>
                    <span className="text-green-600">+{getPointsForReport(selectedReport)}</span>
                  </div>
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
        title="Rate This Cleanup"
        footer={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowReviewModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitReview} disabled={reviewRating === 0}>
              Submit Review
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="text-center py-4">
            <p className="text-slate-600 mb-4">How would you rate the cleanup quality?</p>
            <div className="flex justify-center">{renderStars(reviewRating, true, 32)}</div>
            <p className="text-sm text-slate-500 mt-2">
              {reviewRating === 0 && 'Click to rate'}
              {reviewRating === 1 && 'Poor - Needs improvement'}
              {reviewRating === 2 && 'Fair - Could be better'}
              {reviewRating === 3 && 'Good - Acceptable'}
              {reviewRating === 4 && 'Very Good - Well done'}
              {reviewRating === 5 && 'Excellent - Outstanding!'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Additional Comments (Optional)
            </label>
            <textarea
              rows={3}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              placeholder="Share your feedback about the cleanup..."
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
            <p className="font-medium">🛡️ Citizen Watchdog</p>
            <p className="text-xs mt-1">
              Your review helps maintain quality standards and holds cleaners accountable.
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
};
