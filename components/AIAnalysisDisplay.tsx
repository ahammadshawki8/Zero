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
      return 'text-green-600 bg-green-100';
    case 'MODERATE':
      return 'text-amber-600 bg-amber-100';
    case 'HIGH':
      return 'text-orange-600 bg-orange-100';
    case 'SEVERE':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-slate-600 bg-slate-100';
  }
};

export const AIAnalysisDisplay = ({ analysis, compact = false }: AIAnalysisDisplayProps) => {
  if (compact) {
    return (
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-indigo-600" />
          <span className="text-sm font-medium text-indigo-800">AI Analysis</span>
          <span className="text-xs text-indigo-500 ml-auto">{analysis.confidence}%</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {analysis.wasteComposition.slice(0, 3).map((item, idx) => (
            <span
              key={idx}
              className="text-xs bg-white px-2 py-1 rounded-full flex items-center gap-1"
            >
              {item.type}: {item.percentage}%
              {item.recyclable && <Recycle size={10} className="text-green-500" />}
            </span>
          ))}
          {analysis.wasteComposition.length > 3 && (
            <span className="text-xs text-indigo-500">
              +{analysis.wasteComposition.length - 3} more
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className={`px-2 py-0.5 rounded-full ${getImpactColor(analysis.environmentalImpact)}`}>
            {analysis.environmentalImpact} Impact
          </span>
          {analysis.healthHazard && (
            <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-600 flex items-center gap-1">
              <AlertTriangle size={10} /> Hazard
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={20} className="text-indigo-600" />
          <span className="font-semibold text-indigo-800">AI Waste Analysis</span>
        </div>
        <div className="flex items-center gap-2">
          <BarChart3 size={14} className="text-indigo-500" />
          <span className="text-sm text-indigo-600">{analysis.confidence}% confidence</span>
        </div>
      </div>

      {/* Waste Composition */}
      <div>
        <p className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
          <Trash2 size={14} /> Waste Composition
        </p>
        <div className="space-y-2">
          {analysis.wasteComposition.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-700">{item.type}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{item.percentage}%</span>
                    {item.recyclable && <Recycle size={14} className="text-green-500" />}
                  </div>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
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
        <div className="bg-white rounded-lg p-3 text-center">
          <Trash2 size={18} className="mx-auto text-slate-500 mb-1" />
          <p className="text-xs text-slate-500">Volume</p>
          <p className="text-sm font-medium text-slate-800">{analysis.estimatedVolume}</p>
        </div>
        <div className="bg-white rounded-lg p-3 text-center">
          <Clock size={18} className="mx-auto text-slate-500 mb-1" />
          <p className="text-xs text-slate-500">Cleanup Time</p>
          <p className="text-sm font-medium text-slate-800">{analysis.estimatedCleanupTime}</p>
        </div>
        <div className="bg-white rounded-lg p-3 text-center">
          <Leaf size={18} className="mx-auto text-slate-500 mb-1" />
          <p className="text-xs text-slate-500">Env. Impact</p>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getImpactColor(analysis.environmentalImpact)}`}>
            {analysis.environmentalImpact}
          </span>
        </div>
        <div className="bg-white rounded-lg p-3 text-center">
          <Shield size={18} className="mx-auto text-slate-500 mb-1" />
          <p className="text-xs text-slate-500">Health Risk</p>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${analysis.healthHazard ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
            {analysis.healthHazard ? 'Yes' : 'No'}
          </span>
        </div>
      </div>

      {/* Health Hazard Warning */}
      {analysis.healthHazard && analysis.hazardDetails && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
          <AlertTriangle size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-800">Health Hazard Detected</p>
            <p className="text-xs text-red-600">{analysis.hazardDetails}</p>
          </div>
        </div>
      )}

      {/* Equipment Needed */}
      {analysis.specialEquipmentNeeded.length > 0 && (
        <div>
          <p className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
            <Wrench size={14} /> Equipment Needed
          </p>
          <div className="flex flex-wrap gap-2">
            {analysis.specialEquipmentNeeded.map((item, idx) => (
              <span key={idx} className="text-xs bg-white border border-slate-200 px-2 py-1 rounded-full text-slate-600">
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Action */}
      <div className="bg-white rounded-lg p-3">
        <p className="text-sm font-medium text-slate-700 mb-1">Recommended Action</p>
        <p className="text-sm text-slate-600">{analysis.recommendedAction}</p>
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
      return 'text-green-600 bg-green-100';
    case 'GOOD':
      return 'text-blue-600 bg-blue-100';
    case 'FAIR':
      return 'text-amber-600 bg-amber-100';
    case 'POOR':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-slate-600 bg-slate-100';
  }
};

const getVerificationColor = (status: string) => {
  switch (status) {
    case 'VERIFIED':
      return 'text-green-600 bg-green-100';
    case 'NEEDS_REVIEW':
      return 'text-amber-600 bg-amber-100';
    case 'INCOMPLETE':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-slate-600 bg-slate-100';
  }
};

export const CleanupComparisonDisplay = ({ comparison, compact = false }: CleanupComparisonDisplayProps) => {
  if (compact) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-emerald-600" />
            <span className="text-sm font-medium text-emerald-800">Cleanup Analysis</span>
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-full ${getQualityColor(comparison.qualityRating)}`}>
            {comparison.qualityRating}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-slate-200 rounded-full h-3">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-emerald-400 to-green-500"
              style={{ width: `${comparison.completionPercentage}%` }}
            />
          </div>
          <span className="text-sm font-bold text-emerald-700">{comparison.completionPercentage}%</span>
        </div>
        <p className="text-xs text-slate-600">{comparison.feedback}</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp size={20} className="text-emerald-600" />
          <span className="font-semibold text-emerald-800">AI Cleanup Verification</span>
        </div>
        <div className="flex items-center gap-2">
          <BarChart3 size={14} className="text-emerald-500" />
          <span className="text-sm text-emerald-600">{comparison.confidence}% confidence</span>
        </div>
      </div>

      {/* Completion Progress */}
      <div className="bg-white rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">Cleanup Completion</span>
          <span className="text-2xl font-bold text-emerald-600">{comparison.completionPercentage}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-4">
          <div
            className="h-4 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 transition-all"
            style={{ width: `${comparison.completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-lg p-3 text-center">
          <Award size={20} className="mx-auto text-slate-500 mb-1" />
          <p className="text-xs text-slate-500">Quality Rating</p>
          <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${getQualityColor(comparison.qualityRating)}`}>
            {comparison.qualityRating}
          </span>
        </div>
        <div className="bg-white rounded-lg p-3 text-center">
          <CheckCircle size={20} className="mx-auto text-slate-500 mb-1" />
          <p className="text-xs text-slate-500">Verification</p>
          <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${getVerificationColor(comparison.verificationStatus)}`}>
            {comparison.verificationStatus.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Before/After Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-xs font-medium text-red-700 mb-1">Before</p>
          <p className="text-sm text-red-600">{comparison.beforeSummary}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-xs font-medium text-green-700 mb-1">After</p>
          <p className="text-sm text-green-600">{comparison.afterSummary}</p>
        </div>
      </div>

      {/* Waste Removed */}
      {comparison.wasteRemoved.length > 0 && (
        <div>
          <p className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
            <Recycle size={14} className="text-green-500" /> Waste Removed
          </p>
          <div className="flex flex-wrap gap-2">
            {comparison.wasteRemoved.map((item, idx) => (
              <span key={idx} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                {item.type}: {item.percentage}%
                {item.recyclable && <Recycle size={10} />}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Remaining Issues */}
      {comparison.remainingIssues && comparison.remainingIssues.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-sm font-medium text-amber-700 mb-1 flex items-center gap-1">
            <AlertTriangle size={14} /> Remaining Issues
          </p>
          <ul className="text-xs text-amber-600 list-disc list-inside">
            {comparison.remainingIssues.map((issue, idx) => (
              <li key={idx}>{issue}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Environmental Benefit */}
      <div className="bg-white rounded-lg p-3 flex items-start gap-2">
        <Leaf size={18} className="text-green-500 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-slate-700">Environmental Benefit</p>
          <p className="text-sm text-slate-600">{comparison.environmentalBenefit}</p>
        </div>
      </div>

      {/* AI Feedback */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
        <p className="text-sm font-medium text-indigo-700 mb-1 flex items-center gap-1">
          <Sparkles size={14} /> AI Feedback
        </p>
        <p className="text-sm text-indigo-600">{comparison.feedback}</p>
      </div>
    </div>
  );
};
