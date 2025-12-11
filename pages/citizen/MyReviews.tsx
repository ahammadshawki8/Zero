import { useState } from 'react';
import { Button, Badge, Modal, Card, Toast } from '../../components/ui';
import { MOCK_REPORTS, STATUS_INFO, POINTS_CONFIG } from '../../constants';
import {
  Star,
  Camera,
  User,
  CheckCircle,
  Clock,
  MessageSquare,
  Eye,
  Leaf,
} from 'lucide-react';
import { Report } from '../../types';
import { AIAnalysisDisplay, CleanupComparisonDisplay } from '../../components/AIAnalysisDisplay';

export const MyReviews = () => {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as const });

  // Filter only completed reports (eligible for review)
  const completedReports = MOCK_REPORTS.filter((r) => r.status === 'COMPLETED');
  const pendingReviews = completedReports.filter((r) => !r.review);
  const submittedReviews = completedReports.filter((r) => r.review);

  const handleOpenReview = (report: Report) => {
    setSelectedReport(report);
    setReviewRating(report.review?.rating || 0);
    setReviewComment(report.review?.comment || '');
    setShowReviewModal(true);
  };

  const handleSubmitReview = () => {
    console.log('Review submitted:', {
      reportId: selectedReport?.id,
      rating: reviewRating,
      comment: reviewComment,
    });
    setToast({ show: true, message: 'Thank you for your review! Your feedback helps improve our service.', type: 'success' });
    setShowReviewModal(false);
    setSelectedReport(null);
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
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-4 sm:p-5 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg">
              <Star size={20} className="sm:w-6 sm:h-6" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold">Citizen Watchdog</h1>
              <p className="text-amber-100 text-xs sm:text-sm">
                Review cleanups and help maintain quality standards
              </p>
            </div>
          </div>
          <div className="flex gap-6 mt-4">
            <div>
              <div className="text-xl sm:text-2xl font-bold">{pendingReviews.length}</div>
              <div className="text-xs text-amber-100">Pending Reviews</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold">{submittedReviews.length}</div>
              <div className="text-xs text-amber-100">Reviews Submitted</div>
            </div>
          </div>
        </div>

        {/* Pending Reviews Section */}
        {pendingReviews.length > 0 && (
          <Card title="Awaiting Your Review">
            <div className="space-y-4">
              {pendingReviews.map((report) => (
                <div
                  key={report.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl"
                >
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-slate-100">
                        <img
                          src={report.afterImageUrl || report.imageUrl}
                          alt="Cleanup"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 sm:hidden">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{report.id}</span>
                        <Badge variant="success">
                          {STATUS_INFO[report.status]?.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 truncate">{report.zoneName}</p>
                    </div>
                  </div>
                  <div className="hidden sm:block flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{report.id}</span>
                      <Badge variant="success">
                        {STATUS_INFO[report.status]?.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 truncate">{report.zoneName}</p>
                    <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <User size={12} />
                      <span>Cleaned by {report.cleanerName}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between w-full sm:w-auto sm:flex-col sm:items-end gap-2">
                    <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 order-2 sm:order-1">
                      <Leaf size={10} /> +{POINTS_CONFIG.REVIEW_SUBMITTED} pts
                    </span>
                    <Button size="sm" onClick={() => handleOpenReview(report)} className="order-1 sm:order-2">
                      <Star size={14} className="mr-1" /> Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Submitted Reviews Section */}
        <Card title="Your Reviews">
          {submittedReviews.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <MessageSquare size={40} className="mx-auto mb-3 opacity-30" />
              <p>No reviews submitted yet</p>
              <p className="text-sm">Complete cleanups will appear here for review</p>
            </div>
          ) : (
            <div className="space-y-4">
              {submittedReviews.map((report) => (
                <div
                  key={report.id}
                  className="p-3 sm:p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    {/* Before/After Images */}
                    <div className="flex-shrink-0 flex gap-2">
                      <div className="relative">
                        <img
                          src={report.imageUrl}
                          alt="Before"
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover"
                        />
                        <span className="absolute bottom-1 left-1 text-[10px] bg-black/60 text-white px-1 sm:px-1.5 py-0.5 rounded">
                          Before
                        </span>
                      </div>
                      <div className="relative">
                        <img
                          src={report.afterImageUrl}
                          alt="After"
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover border-2 border-green-400"
                        />
                        <span className="absolute bottom-1 left-1 text-[10px] bg-green-600 text-white px-1 sm:px-1.5 py-0.5 rounded">
                          After
                        </span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{report.id}</span>
                          <span className="text-slate-400 hidden sm:inline">•</span>
                          <span className="text-sm text-slate-600 dark:text-slate-400 hidden sm:inline">{report.zoneName}</span>
                        </div>
                        <button
                          onClick={() => setSelectedReport(report)}
                          className="text-green-600 dark:text-green-400 hover:text-green-700 text-sm flex items-center gap-1"
                        >
                          <Eye size={14} /> View
                        </button>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-2">
                        {renderStars(report.review?.rating || 0)}
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {report.review?.rating}/5
                        </span>
                      </div>

                      {/* Comment */}
                      {report.review?.comment && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 italic line-clamp-2">
                          "{report.review.comment}"
                        </p>
                      )}

                      {/* Meta */}
                      <div className="flex items-center gap-3 sm:gap-4 mt-2 text-xs text-slate-400 dark:text-slate-500">
                        <span className="flex items-center gap-1">
                          <User size={12} />
                          {report.cleanerName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {report.review?.reviewedAt
                            ? new Date(report.review.reviewedAt).toLocaleDateString()
                            : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* View Detail Modal */}
      <Modal
        isOpen={!!selectedReport && !showReviewModal}
        onClose={() => setSelectedReport(null)}
        title={`Cleanup Details: ${selectedReport?.id}`}
        footer={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setSelectedReport(null)}>
              Close
            </Button>
            {selectedReport && !selectedReport.review && (
              <Button onClick={() => handleOpenReview(selectedReport)}>
                <Star size={14} className="mr-1" /> Write Review
              </Button>
            )}
          </div>
        }
      >
        {selectedReport && (
          <div className="space-y-4">
            {/* Before/After Comparison */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                  <Camera size={12} /> Before (Your Report)
                </p>
                <img
                  src={selectedReport.imageUrl}
                  alt="Before cleanup"
                  className="w-full h-40 object-cover rounded-lg border border-slate-200"
                />
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                  <CheckCircle size={12} className="text-green-500" /> After (Cleaned)
                </p>
                <img
                  src={selectedReport.afterImageUrl}
                  alt="After cleanup"
                  className="w-full h-40 object-cover rounded-lg border-2 border-green-400"
                />
              </div>
            </div>

            {/* Cleaner Info */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User size={20} className="text-blue-600" />
              </div>
              <div>
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

            {/* Existing Review */}
            {selectedReport.review && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-sm font-medium text-slate-700 mb-2">Your Review</p>
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
              </div>
            )}

            {/* Report Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Zone</p>
                <p className="font-medium">{selectedReport.zoneName}</p>
              </div>
              <div>
                <p className="text-slate-500">Reported</p>
                <p className="font-medium">
                  {new Date(selectedReport.timestamp).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Severity</p>
                <p className="font-medium">{selectedReport.severity}</p>
              </div>
              <div>
                <p className="text-slate-500">Description</p>
                <p className="font-medium truncate">{selectedReport.description}</p>
              </div>
            </div>

            {/* AI Analysis */}
            {selectedReport.aiAnalysis && (
              <AIAnalysisDisplay analysis={selectedReport.aiAnalysis} compact />
            )}

            {/* Cleanup Comparison */}
            {selectedReport.cleanupComparison && (
              <CleanupComparisonDisplay comparison={selectedReport.cleanupComparison} />
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
          {/* Before/After Preview */}
          {selectedReport && (
            <div className="grid grid-cols-2 gap-2">
              <img
                src={selectedReport.imageUrl}
                alt="Before"
                className="w-full h-24 object-cover rounded-lg"
              />
              <img
                src={selectedReport.afterImageUrl}
                alt="After"
                className="w-full h-24 object-cover rounded-lg border-2 border-green-400"
              />
            </div>
          )}

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

          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700 flex items-center justify-between">
            <div>
              <p className="font-medium flex items-center gap-1">
                <Leaf size={14} /> Earn Green Points
              </p>
              <p className="text-xs mt-0.5">Submit your review to earn bonus points!</p>
            </div>
            <span className="text-lg font-bold">+{POINTS_CONFIG.REVIEW_SUBMITTED}</span>
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
