import React, { useState } from 'react';
import { Button, Card, Toast } from '../../components/ui';
import { MOCK_ZONES } from '../../constants';
import { Zone, LatLng, WasteAnalysis } from '../../types';
import { ZoneDisplayMap } from '../../components/ZoneMap';
import { findZoneForPoint } from '../../utils/geo';
import {
  Camera,
  Upload,
  Sparkles,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Navigation,
  X,
  Recycle,
  Clock,
  Shield,
  Leaf,
  Trash2,
  Wrench,
  BarChart3,
} from 'lucide-react';
import { analyzeWasteImage } from '../../services/gemini';

export const ReportWaste = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<WasteAnalysis | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<LatLng | null>(null);
  const [detectedZone, setDetectedZone] = useState<Zone | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    severity: 'LOW',
  });
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'warning' | 'info' }>({
    show: false,
    message: '',
    type: 'success',
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
        setAiAnalysis(null); // Reset analysis when new image uploaded
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAIAnalysis = async () => {
    if (!imagePreview) return;
    setIsAnalyzing(true);
    const result = await analyzeWasteImage(imagePreview);
    setIsAnalyzing(false);

    if (result) {
      setAiAnalysis(result);
      setFormData((prev) => ({
        ...prev,
        description: result.description,
        severity: result.severity,
      }));
    }
  };

  const handlePointSelect = (point: LatLng) => {
    setSelectedPoint(point);
    setLocationError(null);

    const zone = findZoneForPoint(point, MOCK_ZONES);

    if (zone) {
      setDetectedZone(zone);
      setLocationError(null);
    } else {
      setDetectedZone(null);
      setLocationError(
        'This location is outside all service zones. Please select a point within a colored zone area.'
      );
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setToast({ show: true, message: 'Geolocation is not supported by your browser', type: 'error' });
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const point = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        handlePointSelect(point);
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
        setToast({ show: true, message: 'Unable to get your location. Please select manually on the map.', type: 'warning' });
      },
      { enableHighAccuracy: true }
    );
  };

  const handleClearLocation = () => {
    setSelectedPoint(null);
    setDetectedZone(null);
    setLocationError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPoint || !detectedZone) {
      setToast({ show: true, message: 'Please select a valid location within a zone', type: 'warning' });
      return;
    }

    const reportData = {
      location: { lat: selectedPoint.lat, lng: selectedPoint.lng },
      zoneId: detectedZone.id,
      zoneName: detectedZone.name,
      description: formData.description,
      severity: formData.severity,
      imageUrl: imagePreview,
      aiAnalysis: aiAnalysis,
      timestamp: new Date().toISOString(),
    };

    console.log('Report submitted:', reportData);
    setToast({ show: true, message: 'Report submitted successfully!', type: 'success' });

    // Reset form
    setImagePreview(null);
    setSelectedPoint(null);
    setDetectedZone(null);
    setAiAnalysis(null);
    setFormData({ description: '', severity: 'LOW' });
  };

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


  return (
    <>
      <Toast
        isOpen={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
        message={toast.message}
        type={toast.type}
      />
      <div className="max-w-3xl mx-auto">
        <Card title="Report Waste Incident" className="border-t-4 border-t-green-500">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Photo Evidence</label>
            <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer group">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-64 mx-auto rounded-lg shadow-md"
                  />
                  <p className="mt-2 text-xs text-slate-500 font-medium bg-white/80 inline-block px-2 py-1 rounded">
                    Click to replace
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center text-slate-400 group-hover:text-slate-600 transition-colors">
                  <Camera size={48} className="mb-2" />
                  <span className="text-sm font-medium text-slate-600">
                    Tap to take photo or upload
                  </span>
                  <span className="text-xs">JPG, PNG up to 5MB</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
            </div>
          </div>

          {/* AI Analysis Button */}
          {imagePreview && !aiAnalysis && (
            <div className="flex justify-center">
              <Button
                type="button"
                variant="secondary"
                onClick={handleAIAnalysis}
                isLoading={isAnalyzing}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6"
              >
                <Sparkles size={18} className="mr-2" />
                {isAnalyzing ? 'Analyzing Waste...' : 'Analyze with AI'}
              </Button>
            </div>
          )}

          {/* AI Analysis Results */}
          {aiAnalysis && (
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles size={20} className="text-indigo-600" />
                  <span className="font-semibold text-indigo-800">AI Waste Analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 size={14} className="text-indigo-500" />
                  <span className="text-sm text-indigo-600">
                    {aiAnalysis.confidence}% confidence
                  </span>
                </div>
              </div>

              {/* Waste Composition */}
              <div>
                <p className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
                  <Trash2 size={14} /> Waste Composition
                </p>
                <div className="space-y-2">
                  {aiAnalysis.wasteComposition.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-slate-700">{item.type}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{item.percentage}%</span>
                            {item.recyclable && (
                              <Recycle size={14} className="text-green-500" />
                            )}
                          </div>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              item.recyclable ? 'bg-green-500' : 'bg-slate-400'
                            }`}
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                  <Recycle size={12} className="text-green-500" /> = Recyclable material
                </p>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div className="bg-white rounded-lg p-3 text-center">
                  <Trash2 size={18} className="mx-auto text-slate-500 mb-1" />
                  <p className="text-xs text-slate-500">Volume</p>
                  <p className="text-sm font-medium text-slate-800">
                    {aiAnalysis.estimatedVolume}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <Clock size={18} className="mx-auto text-slate-500 mb-1" />
                  <p className="text-xs text-slate-500">Cleanup Time</p>
                  <p className="text-sm font-medium text-slate-800">
                    {aiAnalysis.estimatedCleanupTime}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <Leaf size={18} className="mx-auto text-slate-500 mb-1" />
                  <p className="text-xs text-slate-500">Env. Impact</p>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${getImpactColor(
                      aiAnalysis.environmentalImpact
                    )}`}
                  >
                    {aiAnalysis.environmentalImpact}
                  </span>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <Shield size={18} className="mx-auto text-slate-500 mb-1" />
                  <p className="text-xs text-slate-500">Health Risk</p>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      aiAnalysis.healthHazard
                        ? 'bg-red-100 text-red-600'
                        : 'bg-green-100 text-green-600'
                    }`}
                  >
                    {aiAnalysis.healthHazard ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>

              {/* Health Hazard Warning */}
              {aiAnalysis.healthHazard && aiAnalysis.hazardDetails && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                  <AlertTriangle size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Health Hazard Detected</p>
                    <p className="text-xs text-red-600">{aiAnalysis.hazardDetails}</p>
                  </div>
                </div>
              )}

              {/* Equipment Needed */}
              {aiAnalysis.specialEquipmentNeeded.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
                    <Wrench size={14} /> Equipment Needed
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {aiAnalysis.specialEquipmentNeeded.map((item, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-white border border-slate-200 px-2 py-1 rounded-full text-slate-600"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Action */}
              <div className="bg-white rounded-lg p-3">
                <p className="text-sm font-medium text-slate-700 mb-1">Recommended Action</p>
                <p className="text-sm text-slate-600">{aiAnalysis.recommendedAction}</p>
              </div>

              {/* Re-analyze button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleAIAnalysis}
                  className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                  <Sparkles size={12} /> Re-analyze
                </button>
              </div>
            </div>
          )}

          {/* Location Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-slate-700">
                <MapPin size={16} className="inline mr-1" />
                Waste Location
              </label>
              <div className="flex gap-2">
                {selectedPoint && (
                  <button
                    type="button"
                    onClick={handleClearLocation}
                    className="text-xs text-slate-500 hover:text-red-500 flex items-center gap-1"
                  >
                    <X size={14} /> Clear
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={isLocating}
                  className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 disabled:opacity-50"
                >
                  <Navigation size={14} />
                  {isLocating ? 'Locating...' : 'Use my location'}
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              Click on the map to mark the exact waste location. The zone will be automatically
              detected.
            </p>

            <ZoneDisplayMap
              zones={MOCK_ZONES}
              selectedPoint={selectedPoint}
              onPointSelect={handlePointSelect}
              height="280px"
            />

            {/* Location Status */}
            {selectedPoint && (
              <div
                className={`p-4 rounded-xl flex items-start gap-3 ${
                  detectedZone
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200'
                    : 'bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200'
                }`}
              >
                {detectedZone ? (
                  <>
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle size={20} className="text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-green-800">{detectedZone.name}</p>
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: detectedZone.color }}
                        />
                      </div>
                      <p className="text-sm text-green-600">{detectedZone.description}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <AlertTriangle size={20} className="text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-amber-800">Outside Service Area</p>
                      <p className="text-sm text-amber-600">{locationError}</p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Severity Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Severity Level
              {aiAnalysis && (
                <span className="text-xs text-indigo-600 ml-2">(AI suggested)</span>
              )}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'LOW', label: 'Low', desc: 'Minor Litter', color: 'bg-green-100 border-green-300 text-green-700 ring-green-400' },
                { value: 'MEDIUM', label: 'Medium', desc: 'Overflowing Bin', color: 'bg-yellow-100 border-yellow-300 text-yellow-700 ring-yellow-400' },
                { value: 'HIGH', label: 'High', desc: 'Illegal Dumping', color: 'bg-orange-100 border-orange-300 text-orange-700 ring-orange-400' },
                { value: 'CRITICAL', label: 'Critical', desc: 'Hazardous', color: 'bg-red-100 border-red-300 text-red-700 ring-red-400' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, severity: option.value })}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    formData.severity === option.value
                      ? option.color + ' ring-2 ring-offset-1'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-medium text-sm">{option.label}</div>
                  <div className="text-xs opacity-75">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description
              {aiAnalysis && (
                <span className="text-xs text-indigo-600 ml-2">(AI generated)</span>
              )}
            </label>
            <textarea
              rows={4}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
              placeholder="Describe the waste issue (type, amount, any hazards...)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" size="lg" disabled={!detectedZone}>
            <Upload size={20} className="mr-2" />
            Submit Report
          </Button>

          {!detectedZone && selectedPoint && (
            <p className="text-center text-sm text-amber-600">
              Please select a location within a service zone to submit
            </p>
          )}
        </form>
        </Card>
      </div>
    </>
  );
};
