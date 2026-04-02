import { useEffect, useMemo, useState } from 'react';
import { Button, Badge, Modal, Card, Toast } from '../../components/ui';
import { citizenAPI } from '../../services/api';
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
import { formatApiDate } from '../../utils/date';

const REVIEW_BONUS_POINTS = 5;

const hasCitizenReview = (report: Report) => {
  const r = report.citizenReview || report.review;
  return Boolean(r && Number(r.rating) > 0);
};

export const MyReviews = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  }>({ show: false, message: '', type: 'success' });

  const loadReports = async () => {
    try {
      setIsLoading(true);
      const data = await citizenAPI.getMyReports();
      setReports(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load reviews data:', error);
      setToast({ show: true, message: 'Failed to load reviews', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const completedReports = useMemo(() => reports.filter((r) => r.status === 'COMPLETED'), [reports]);
  const pendingReviews = useMemo(() => completedReports.filter((r) => !hasCitizenReview(r)), [completedReports]);
  const submittedReviews = useMemo(() => completedReports.filter((r) => hasCitizenReview(r)), [completedReports]);

  const handleOpenDetails = async (report: Report, openForWrite = false) => {
    try {
      const details = await citizenAPI.getReportDetails(report.id);
      if (openForWrite && hasCitizenReview(details)) {
        setToast({ show: true, message: 'You already reviewed this cleanup', type: 'info' });
        return;
      }

      setSelectedReport(details);
      setReviewRating(details.citizenReview?.rating || details.review?.rating || 0);
      setReviewComment(details.citizenReview?.comment || details.review?.comment || '');
      setShowReviewModal(openForWrite);
    } catch (error) {
      console.error('Failed to load report details:', error);
      setToast({ show: true, message: 'Failed to load review details', type: 'error' });
    }
  };

  const handleSubmitReview = async () => {
    if (!selectedReport || reviewRating < 1 || reviewRating > 5) {
      setToast({ show: true, message: 'Please add a valid rating', type: 'warning' });
      return;
    }

    setIsSubmittingReview(true);
    try {
      await citizenAPI.submitReview(selectedReport.id, {
        rating: reviewRating,
        comment: reviewComment.trim() || undefined,
        timestamp: new Date().toISOString(),
      });

      const reviewedAt = new Date().toISOString();
      const reviewData = {
        rating: reviewRating,
        comment: reviewComment.trim() || undefined,
        reviewedAt,
        timestamp: reviewedAt,
      };

      setReports((prev) =>
        prev.map((item) =>
          item.id === selectedReport.id
            ? { ...item, review: reviewData, citizenReview: reviewData }
            : item
        )
      );

      setSelectedReport((prev) =>
        prev
          ? {
              ...prev,
              review: reviewData,
              citizenReview: reviewData,
            }
          : prev
      );

      setShowReviewModal(false);
      setToast({
        show: true,
        message: 'Review submitted. It now appears under Your Reviews.',
        type: 'success',
      });
    } catch (error: any) {
      console.error('Failed to submit review:', error);
      setToast({ show: true, message: error?.message || 'Failed to submit review', type: 'error' });
    } finally {
      setIsSubmittingReview(false);
    }
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
                  : 'text-slate-300 dark:text-slate-600'
              } transition-colors`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">Loading your reviews...</p>
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

      <div className="space-y-3 sm:space-y-4 md:space-y-6">
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-3 sm:p-4 md:p-6 text-white shadow-lg dark:shadow-amber-900/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 sm:p-2.5 bg-white/20 rounded-lg">
              <Star size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
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
              <div className="text-lg sm:text-xl md:text-2xl font-bold">{pendingReviews.length}</div>
              <div className="text-xs sm:text-sm text-amber-100">Pending Reviews</div>
            </div>
            <div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold">{submittedReviews.length}</div>
              <div className="text-xs sm:text-sm text-amber-100">Reviews Submitted</div>
            </div>
          </div>
        </div>

        {pendingReviews.length > 0 && (
          <Card title="Awaiting Your Review">
            <div className="space-y-4">
              {pendingReviews.map((report) => (
                <div
                  key={report.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                    {report.afterImageUrl || report.imageUrl ? (
                      <img
                        src={report.afterImageUrl || report.imageUrl}
                        alt="Cleanup"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <Camera size={16} />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">Report #{report.id.slice(-8)}</span>
                      <Badge variant="success">COMPLETED</Badge>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 truncate">{report.zoneName}</p>
                    <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <User size={12} />
                      <span>Cleaned by {report.cleanerName || 'Assigned cleaner'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto sm:flex-col sm:items-end gap-2">
                    <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 order-2 sm:order-1">
                      <Leaf size={10} /> +{REVIEW_BONUS_POINTS} pts
                    </span>
                    <Button size="sm" onClick={() => handleOpenDetails(report, true)} className="order-1 sm:order-2">
                      <Star size={14} className="mr-1" /> Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        <Card title="Your Reviews">
          {submittedReviews.length === 0 ? (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              <MessageSquare size={40} className="mx-auto mb-3 opacity-30" />
              <p>No reviews submitted yet</p>
              <p className="text-sm">Completed cleanups will appear here for review</p>
            </div>
          ) : (
            <div className="space-y-4">
              {submittedReviews.map((report) => {
                const review = report.citizenReview || report.review;
                return (
                  <div
                    key={report.id}
                    className="p-3 sm:p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <div className="flex-shrink-0 flex gap-2">
                        <div className="relative">
                          {report.imageUrl ? (
                            <img
                              src={report.imageUrl}
                              alt="Before"
                              className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-slate-100 dark:bg-slate-700"></div>
                          )}
                          <span className="absolute bottom-1 left-1 text-[10px] bg-black/60 text-white px-1 py-0.5 rounded">
                            Before
                          </span>
                        </div>
                        <div className="relative">
                          {report.afterImageUrl ? (
                            <img
                              src={report.afterImageUrl}
                              alt="After"
                              className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover border-2 border-green-400"
                            />
                          ) : (
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-slate-100 dark:bg-slate-700 border-2 border-green-300"></div>
                          )}
                          <span className="absolute bottom-1 left-1 text-[10px] bg-green-600 text-white px-1 py-0.5 rounded">
                            After
                          </span>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">Report #{report.id.slice(-8)}</span>
                            <span className="text-sm text-slate-600 dark:text-slate-400">{report.zoneName}</span>
                          </div>
                          <button
                            onClick={() => handleOpenDetails(report, false)}
                            className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 text-sm flex items-center gap-1"
                          >
                            <Eye size={14} /> View
                          </button>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          {renderStars(review?.rating || 0)}
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {review?.rating || 0}/5
                          </span>
                        </div>

                        {review?.comment && (
                          <p className="text-sm text-slate-600 dark:text-slate-400 italic line-clamp-2">
                            "{review.comment}"
                          </p>
                        )}

                        <div className="flex items-center gap-3 sm:gap-4 mt-2 text-xs text-slate-400 dark:text-slate-500">
                          <span className="flex items-center gap-1">
                            <User size={12} />
                            {report.cleanerName || 'Cleaner'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {review?.reviewedAt
                              ? formatApiDate(review.reviewedAt)
                              : review?.timestamp
                                ? formatApiDate(review.timestamp)
                                : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      <Modal
        isOpen={!!selectedReport && !showReviewModal}
        onClose={() => setSelectedReport(null)}
        title={`Cleanup Details: Report #${selectedReport?.id?.slice(-8) || ''}`}
        footer={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setSelectedReport(null)}>
              Close
            </Button>
            {selectedReport && !hasCitizenReview(selectedReport) && (
              <Button onClick={() => setShowReviewModal(true)}>
                <Star size={14} className="mr-1" /> Write Review
              </Button>
            )}
          </div>
        }
      >
        {selectedReport && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                  <Camera size={12} /> Before (Your Report)
                </p>
                {selectedReport.imageUrl ? (
                  <img
                    src={selectedReport.imageUrl}
                    alt="Before cleanup"
                    className="w-full h-40 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
                  />
                ) : (
                  <div className="w-full h-40 rounded-lg border border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center text-xs text-slate-500 dark:text-slate-400">
                    No before image
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                  <CheckCircle size={12} className="text-green-500" /> After (Cleaned)
                </p>
                {selectedReport.afterImageUrl ? (
                  <img
                    src={selectedReport.afterImageUrl}
                    alt="After cleanup"
                    className="w-full h-40 object-cover rounded-lg border border-emerald-300 dark:border-emerald-700"
                  />
                ) : (
                  <div className="w-full h-40 rounded-lg border border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center text-xs text-slate-500 dark:text-slate-400">
                    No after image
                  </div>
                )}
              </div>
            </div>

            {selectedReport.cleanupComparison && (
              <CleanupComparisonDisplay comparison={selectedReport.cleanupComparison} />
            )}

            {selectedReport.aiAnalysis && (
              <AIAnalysisDisplay analysis={selectedReport.aiAnalysis} compact />
            )}
          </div>
        )}
      </Modal>

      <Modal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        title="Rate This Cleanup"
        footer={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowReviewModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitReview} disabled={reviewRating === 0 || isSubmittingReview}>
              {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          {selectedReport && (
            <>
              <div className="grid grid-cols-2 gap-2">
                {selectedReport.imageUrl ? (
                  <img
                    src={selectedReport.imageUrl}
                    alt="Before"
                    className="w-full h-24 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-24 rounded-lg bg-slate-100 dark:bg-slate-700" />
                )}
                {selectedReport.afterImageUrl ? (
                  <img
                    src={selectedReport.afterImageUrl}
                    alt="After"
                    className="w-full h-24 object-cover rounded-lg border-2 border-green-400"
                  />
                ) : (
                  <div className="w-full h-24 rounded-lg bg-slate-100 dark:bg-slate-700 border-2 border-green-300" />
                )}
              </div>

              {selectedReport.cleanupComparison && (
                <CleanupComparisonDisplay comparison={selectedReport.cleanupComparison} compact />
              )}

              {selectedReport.aiAnalysis && (
                <AIAnalysisDisplay analysis={selectedReport.aiAnalysis} compact />
              )}
            </>
          )}

          <div className="text-center py-2">
            <p className="text-slate-600 dark:text-slate-300 mb-3">How would you rate the cleanup quality?</p>
            <div className="flex justify-center">{renderStars(reviewRating, true, 30)}</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Additional Comments (Optional)
            </label>
            <textarea
              rows={3}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              placeholder="Share your feedback about the cleanup..."
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
            />
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 text-sm text-green-700 dark:text-green-300 flex items-center justify-between">
            <div>
              <p className="font-medium flex items-center gap-1">
                <Leaf size={14} /> Earn Green Points
              </p>
              <p className="text-xs mt-0.5">Submit your review to earn bonus points.</p>
            </div>
            <span className="text-lg font-bold">+{REVIEW_BONUS_POINTS}</span>
          </div>
        </div>
      </Modal>
    </>
  );
};
