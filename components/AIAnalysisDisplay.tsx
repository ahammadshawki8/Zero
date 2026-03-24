import {
  Sparkles,
  Trash2,
  Recycle,
  Clock,
  Shield,
  Leaf,
  Wrench,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Award,
} from 'lucide-react';
import { WasteAnalysis, CleanupComparison } from '../types';

interface AIAnalysisDisplayProps {
  analysis: WasteAnalysis;
  compact?: boolean;
}

const getImpactColor = (impact: string) => {
  switch (impact) {
    case 'LOW':
      return 'text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/40';
    case 'MODERATE':
      return 'text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-900/40';
    case 'HIGH':
      return 'text-orange-700 bg-orange-100 dark:text-orange-300 dark:bg-orange-900/40';
    case 'SEVERE':
      return 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/40';
    default:
      return 'text-slate-700 bg-slate-100 dark:text-slate-300 dark:bg-slate-700';
  }
};

export const AIAnalysisDisplay = ({ analysis, compact = false }: AIAnalysisDisplayProps) => {
  if (compact) {
    return (
      <div className="bg-indigo-50 border border-indigo-200 dark:bg-slate-800 dark:border-slate-700 rounded-lg p-3 space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-indigo-600 dark:text-indigo-300" />
          <span className="text-sm font-medium text-indigo-800 dark:text-indigo-200">AI Analysis</span>
          <span className="text-xs text-indigo-500 dark:text-indigo-300 ml-auto">{analysis.confidence}%</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {analysis.wasteComposition.slice(0, 3).map((item, idx) => (
            <span
              key={idx}
              className="text-xs bg-white text-slate-700 dark:bg-slate-700 dark:text-slate-200 px-2 py-1 rounded-full flex items-center gap-1"
            >
              {item.type}: {item.percentage}%
              {item.recyclable && <Recycle size={10} className="text-green-500" />}
            </span>
          ))}
          {analysis.wasteComposition.length > 3 && (
            <span className="text-xs text-indigo-500 dark:text-indigo-300">
              +{analysis.wasteComposition.length - 3} more
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className={`px-2 py-0.5 rounded-full ${getImpactColor(analysis.environmentalImpact)}`}>
            {analysis.environmentalImpact} Impact
          </span>
          {analysis.healthHazard && (
            <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 flex items-center gap-1">
              <AlertTriangle size={10} /> Hazard
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 dark:from-slate-800 dark:to-slate-900 dark:border-slate-700 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={20} className="text-indigo-600 dark:text-indigo-300" />
          <span className="font-semibold text-indigo-800 dark:text-indigo-200">AI Waste Analysis</span>
        </div>
        <div className="flex items-center gap-2">
          <BarChart3 size={14} className="text-indigo-500 dark:text-indigo-300" />
          <span className="text-sm text-indigo-600 dark:text-indigo-300">{analysis.confidence}% confidence</span>
        </div>
      </div>

      {/* Waste Composition */}
      <div>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-1">
          <Trash2 size={14} /> Waste Composition
        </p>
        <div className="space-y-2">
          {analysis.wasteComposition.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-700 dark:text-slate-200">{item.type}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-100">{item.percentage}%</span>
                    {item.recyclable && <Recycle size={14} className="text-green-500" />}
                  </div>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${item.recyclable ? 'bg-green-500' : 'bg-slate-400'}`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-3 text-center">
          <Trash2 size={18} className="mx-auto text-slate-500 dark:text-slate-300 mb-1" />
          <p className="text-xs text-slate-500 dark:text-slate-300">Volume</p>
          <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{analysis.estimatedVolume}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-3 text-center">
          <Clock size={18} className="mx-auto text-slate-500 dark:text-slate-300 mb-1" />
          <p className="text-xs text-slate-500 dark:text-slate-300">Cleanup Time</p>
          <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{analysis.estimatedCleanupTime}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-3 text-center">
          <Leaf size={18} className="mx-auto text-slate-500 dark:text-slate-300 mb-1" />
          <p className="text-xs text-slate-500 dark:text-slate-300">Env. Impact</p>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getImpactColor(analysis.environmentalImpact)}`}>
            {analysis.environmentalImpact}
          </span>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg p-3 text-center">
          <Shield size={18} className="mx-auto text-slate-500 dark:text-slate-300 mb-1" />
          <p className="text-xs text-slate-500 dark:text-slate-300">Health Risk</p>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${analysis.healthHazard ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' : 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'}`}>
            {analysis.healthHazard ? 'Yes' : 'No'}
          </span>
        </div>
      </div>

      {/* Health Hazard Warning */}
      {analysis.healthHazard && analysis.hazardDetails && (
        <div className="bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800 rounded-lg p-3 flex items-start gap-2">
          <AlertTriangle size={18} className="text-red-500 dark:text-red-300 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-800 dark:text-red-200">Health Hazard Detected</p>
            <p className="text-xs text-red-700 dark:text-red-300">{analysis.hazardDetails}</p>
          </div>
        </div>
      )}

      {/* Equipment Needed */}
      {analysis.specialEquipmentNeeded.length > 0 && (
        <div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-1">
            <Wrench size={14} /> Equipment Needed
          </p>
          <div className="flex flex-wrap gap-2">
            {analysis.specialEquipmentNeeded.map((item, idx) => (
              <span key={idx} className="text-xs bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-600 px-2 py-1 rounded-full text-slate-600 dark:text-slate-200">
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Action */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-3">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-100 mb-1">Recommended Action</p>
        <p className="text-sm text-slate-600 dark:text-slate-200">{analysis.recommendedAction}</p>
      </div>
    </div>
  );
};


// Cleanup Comparison Display (Before vs After)
interface CleanupComparisonDisplayProps {
  comparison: CleanupComparison;
  compact?: boolean;
}

const getQualityColor = (quality: string) => {
  switch (quality) {
    case 'EXCELLENT':
      return 'text-green-800 bg-green-100 dark:text-green-200 dark:bg-green-900/40';
    case 'GOOD':
      return 'text-blue-800 bg-blue-100 dark:text-blue-200 dark:bg-blue-900/40';
    case 'FAIR':
      return 'text-amber-800 bg-amber-100 dark:text-amber-200 dark:bg-amber-900/40';
    case 'POOR':
      return 'text-red-800 bg-red-100 dark:text-red-200 dark:bg-red-900/40';
    default:
      return 'text-slate-800 bg-slate-100 dark:text-slate-200 dark:bg-slate-700';
  }
};

const getVerificationColor = (status: string) => {
  switch (status) {
    case 'VERIFIED':
      return 'text-green-800 bg-green-100 dark:text-green-200 dark:bg-green-900/40';
    case 'NEEDS_REVIEW':
      return 'text-amber-800 bg-amber-100 dark:text-amber-200 dark:bg-amber-900/40';
    case 'INCOMPLETE':
      return 'text-red-800 bg-red-100 dark:text-red-200 dark:bg-red-900/40';
    default:
      return 'text-slate-800 bg-slate-100 dark:text-slate-200 dark:bg-slate-700';
  }
};

const normalizePercentage = (value: number) => {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Number(value)));
};

const getCompletionBarColor = (value: number) => {
  if (value >= 85) {
    return 'bg-gradient-to-r from-emerald-500 to-green-500';
  }
  if (value >= 60) {
    return 'bg-gradient-to-r from-teal-500 to-emerald-500';
  }
  if (value >= 40) {
    return 'bg-gradient-to-r from-amber-500 to-yellow-500';
  }
  return 'bg-gradient-to-r from-red-500 to-rose-500';
};

const getConfidenceTone = (value: number) => {
  if (value >= 80) {
    return {
      icon: 'text-emerald-600 dark:text-emerald-300',
      text: 'text-emerald-700 dark:text-emerald-300',
      chip: 'bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-700',
    };
  }
  if (value >= 60) {
    return {
      icon: 'text-blue-600 dark:text-blue-300',
      text: 'text-blue-700 dark:text-blue-300',
      chip: 'bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-700',
    };
  }
  if (value >= 40) {
    return {
      icon: 'text-amber-600 dark:text-amber-300',
      text: 'text-amber-700 dark:text-amber-300',
      chip: 'bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-700',
    };
  }
  return {
    icon: 'text-red-600 dark:text-red-300',
    text: 'text-red-700 dark:text-red-300',
    chip: 'bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/30 dark:text-red-200 dark:border-red-700',
  };
};

const getSummaryTone = (summary: string, type: 'before' | 'after') => {
  const normalized = (summary || '').toLowerCase();
  const parseIssue = normalized.includes('could not reliably parse') || normalized.includes('unable to parse');

  if (parseIssue) {
    return 'bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-200';
  }

  return type === 'before'
    ? 'bg-rose-50 border-rose-200 text-rose-900 dark:bg-rose-900/20 dark:border-rose-800 dark:text-rose-200'
    : 'bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-200';
};

export const CleanupComparisonDisplay = ({ comparison, compact = false }: CleanupComparisonDisplayProps) => {
  const completionPercentage = normalizePercentage(comparison.completionPercentage);
  const confidence = normalizePercentage(comparison.confidence);
  const confidenceTone = getConfidenceTone(confidence);

  if (compact) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 dark:bg-slate-800 dark:border-slate-700 rounded-lg p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className={confidenceTone.icon} />
            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Cleanup Analysis</span>
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-full ${getQualityColor(comparison.qualityRating)}`}>
            {comparison.qualityRating}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-3">
            <div
              className={`h-3 rounded-full ${getCompletionBarColor(completionPercentage)}`}
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <span className={`text-sm font-bold ${confidenceTone.text}`}>{completionPercentage}%</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300">{comparison.feedback}</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 dark:from-slate-900 dark:to-slate-800 dark:border-slate-700 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp size={20} className={confidenceTone.icon} />
          <span className="font-semibold text-slate-900 dark:text-slate-100">AI Cleanup Verification</span>
        </div>
        <div className="flex items-center gap-2">
          <BarChart3 size={14} className={confidenceTone.icon} />
          <span className={`text-sm px-2 py-1 rounded-full ${confidenceTone.chip}`}>{confidence}% confidence</span>
        </div>
      </div>

      {confidence < 50 && (
        <div className="bg-amber-50 border border-amber-200 dark:bg-amber-900/20 dark:border-amber-800 rounded-lg p-3 flex items-start gap-2">
          <AlertTriangle size={16} className="text-amber-600 dark:text-amber-300 mt-0.5" />
          <p className="text-sm text-amber-800 dark:text-amber-200">
            Low AI confidence detected. Manual verification is recommended before final payout decisions.
          </p>
        </div>
      )}

      {/* Completion Progress */}
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Cleanup Completion</span>
          <span className={`text-2xl font-bold ${confidenceTone.text}`}>{completionPercentage}%</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4">
          <div
            className={`h-4 rounded-full transition-all ${getCompletionBarColor(completionPercentage)}`}
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg p-3 text-center">
          <Award size={20} className="mx-auto text-slate-500 dark:text-slate-300 mb-1" />
          <p className="text-xs text-slate-500 dark:text-slate-300">Quality Rating</p>
          <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${getQualityColor(comparison.qualityRating)}`}>
            {comparison.qualityRating}
          </span>
        </div>
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg p-3 text-center">
          <CheckCircle size={20} className="mx-auto text-slate-500 dark:text-slate-300 mb-1" />
          <p className="text-xs text-slate-500 dark:text-slate-300">Verification</p>
          <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${getVerificationColor(comparison.verificationStatus)}`}>
            {comparison.verificationStatus.replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      {/* Before/After Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className={`border rounded-lg p-3 ${getSummaryTone(comparison.beforeSummary, 'before')}`}>
          <p className="text-xs font-semibold mb-1">Before</p>
          <p className="text-sm">{comparison.beforeSummary}</p>
        </div>
        <div className={`border rounded-lg p-3 ${getSummaryTone(comparison.afterSummary, 'after')}`}>
          <p className="text-xs font-semibold mb-1">After</p>
          <p className="text-sm">{comparison.afterSummary}</p>
        </div>
      </div>

      {/* Waste Removed */}
      {comparison.wasteRemoved.length > 0 && (
        <div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-1">
            <Recycle size={14} className="text-green-500 dark:text-green-300" /> Waste Removed
          </p>
          <div className="flex flex-wrap gap-2">
            {comparison.wasteRemoved.map((item, idx) => (
              <span key={idx} className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200 px-2 py-1 rounded-full flex items-center gap-1">
                {item.type}: {item.percentage}%
                {item.recyclable && <Recycle size={10} />}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Remaining Issues */}
      {comparison.remainingIssues && comparison.remainingIssues.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 dark:bg-amber-900/20 dark:border-amber-800 rounded-lg p-3">
          <p className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-1 flex items-center gap-1">
            <AlertTriangle size={14} /> Remaining Issues
          </p>
          <ul className="text-xs text-amber-700 dark:text-amber-300 list-disc list-inside">
            {comparison.remainingIssues.map((issue, idx) => (
              <li key={idx}>{issue}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Environmental Benefit */}
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg p-3 flex items-start gap-2">
        <Leaf size={18} className="text-green-500 dark:text-green-300 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-100">Environmental Benefit</p>
          <p className="text-sm text-slate-600 dark:text-slate-300">{comparison.environmentalBenefit}</p>
        </div>
      </div>

      {/* AI Feedback */}
      <div className="bg-indigo-50 border border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800 rounded-lg p-3">
        <p className="text-sm font-medium text-indigo-800 dark:text-indigo-200 mb-1 flex items-center gap-1">
          <Sparkles size={14} /> AI Feedback
        </p>
        <p className="text-sm text-indigo-700 dark:text-indigo-300">{comparison.feedback}</p>
      </div>
    </div>
  );
};
