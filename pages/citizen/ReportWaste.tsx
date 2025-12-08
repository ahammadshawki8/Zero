import React, { useState } from 'react';
import { Button, Select, Card } from '../../components/ui';
import { MOCK_ZONES } from '../../constants';
import { Camera, Upload, Sparkles } from 'lucide-react';
import { analyzeWasteImage } from '../../services/gemini';

export const ReportWaste = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [formData, setFormData] = useState({
    zone: '',
    description: '',
    severity: 'LOW',
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
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
      setFormData(prev => ({
        ...prev,
        description: result.description,
        severity: result.severity
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Report submitted successfully! (Mock Action)');
    // Reset
    setImagePreview(null);
    setFormData({ zone: '', description: '', severity: 'LOW' });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card title="Report Waste Incident" className="border-t-4 border-t-green-500">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Image Upload Area */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Photo Evidence</label>
            <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer group">
              
              {imagePreview ? (
                <div className="relative">
                  <img src={imagePreview} alt="Preview" className="max-h-64 mx-auto rounded-lg shadow-md" />
                  <p className="mt-2 text-xs text-slate-500 font-medium bg-white/80 inline-block px-2 py-1 rounded">Click to replace</p>
                </div>
              ) : (
                <div className="flex flex-col items-center text-slate-400 group-hover:text-slate-600 transition-colors">
                  <Camera size={48} className="mb-2" />
                  <span className="text-sm font-medium text-slate-600">Tap to take photo or upload</span>
                  <span className="text-xs">JPG, PNG up to 5MB</span>
                </div>
              )}
              
              {/* Input moved to end and given z-index to ensure it captures clicks */}
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
            </div>
          </div>

          {/* AI Helper Button */}
          {imagePreview && (
            <div className="flex justify-end">
              <Button 
                type="button" 
                variant="secondary" 
                size="sm" 
                onClick={handleAIAnalysis} 
                isLoading={isAnalyzing}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Sparkles size={16} className="mr-2" />
                Auto-Fill Details with AI
              </Button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select 
              label="Zone / Location" 
              options={[
                { value: '', label: 'Select Zone' },
                ...MOCK_ZONES.map(z => ({ value: z.id, label: z.name }))
              ]}
              value={formData.zone}
              onChange={e => setFormData({...formData, zone: e.target.value})}
              required
            />
            
            <Select 
              label="Severity Level" 
              options={[
                { value: 'LOW', label: 'Low - Minor Litter' },
                { value: 'MEDIUM', label: 'Medium - Overflowing Bin' },
                { value: 'HIGH', label: 'High - Illegal Dumping' },
                { value: 'CRITICAL', label: 'Critical - Hazardous Waste' },
              ]}
              value={formData.severity}
              onChange={e => setFormData({...formData, severity: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea 
              rows={4}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              placeholder="Describe the waste..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <Button type="submit" className="w-full" size="lg">
            <Upload size={20} className="mr-2" />
            Submit Report
          </Button>
        </form>
      </Card>
    </div>
  );
};