import { GoogleGenerativeAI } from '@google/generative-ai';
import { WasteAnalysis } from '../types';

// Safely retrieve API key without crashing in environments where process is undefined
const getApiKey = () => {
  try {
    return process.env.API_KEY || '';
  } catch {
    console.warn('process.env is not defined, skipping API key retrieval.');
    return '';
  }
};

const getClient = () => {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn('Gemini API Key is missing. AI features will be simulated.');
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
};

// Simulated AI response for demo when no API key
const getSimulatedAnalysis = (): WasteAnalysis => {
  const analyses: WasteAnalysis[] = [
    {
      description:
        'Mixed urban waste pile containing predominantly plastic bottles, food packaging, and paper materials near a public area.',
      severity: 'MEDIUM',
      wasteComposition: [
        { type: 'Plastic', percentage: 45, recyclable: true },
        { type: 'Paper/Cardboard', percentage: 25, recyclable: true },
        { type: 'Organic', percentage: 20, recyclable: false },
        { type: 'Metal', percentage: 10, recyclable: true },
      ],
      estimatedVolume: '2-3 garbage bags',
      environmentalImpact: 'MODERATE',
      healthHazard: false,
      recommendedAction:
        'Standard cleanup with sorting for recyclables. Separate plastic and paper for recycling facility.',
      estimatedCleanupTime: '30-45 minutes',
      specialEquipmentNeeded: ['Gloves', 'Garbage bags', 'Recycling bins'],
      confidence: 87,
    },
    {
      description:
        'Illegal dumping site with construction debris, household waste, and potentially hazardous materials.',
      severity: 'HIGH',
      wasteComposition: [
        { type: 'Construction Debris', percentage: 40, recyclable: false },
        { type: 'Plastic', percentage: 25, recyclable: true },
        { type: 'Mixed Household', percentage: 20, recyclable: false },
        { type: 'E-waste', percentage: 10, recyclable: true },
        { type: 'Unknown/Other', percentage: 5, recyclable: false },
      ],
      estimatedVolume: 'Requires pickup truck',
      environmentalImpact: 'HIGH',
      healthHazard: true,
      hazardDetails:
        'Potential sharp objects and electronic waste containing heavy metals. Possible chemical contamination.',
      recommendedAction:
        'Professional cleanup required. E-waste must be handled separately. Check for hazardous materials before disposal.',
      estimatedCleanupTime: '2-3 hours',
      specialEquipmentNeeded: [
        'Heavy-duty gloves',
        'Safety boots',
        'Face mask',
        'E-waste container',
        'Vehicle for transport',
      ],
      confidence: 82,
    },
    {
      description:
        'Overflowing public waste bin with scattered litter, mostly food containers and beverage bottles.',
      severity: 'LOW',
      wasteComposition: [
        { type: 'Plastic', percentage: 55, recyclable: true },
        { type: 'Organic/Food', percentage: 30, recyclable: false },
        { type: 'Paper', percentage: 15, recyclable: true },
      ],
      estimatedVolume: '1 garbage bag',
      environmentalImpact: 'LOW',
      healthHazard: false,
      recommendedAction:
        'Empty overflowing bin and collect scattered litter. Report bin capacity issue to maintenance.',
      estimatedCleanupTime: '15-20 minutes',
      specialEquipmentNeeded: ['Gloves', 'Garbage bag'],
      confidence: 94,
    },
  ];

  return analyses[Math.floor(Math.random() * analyses.length)];
};

export const analyzeWasteImage = async (
  base64Image: string
): Promise<WasteAnalysis | null> => {
  const ai = getClient();

  // If no key, return simulated response for demo purposes
  if (!ai) {
    await new Promise((r) => setTimeout(r, 2000)); // Simulate API delay
    return getSimulatedAnalysis();
  }

  try {
    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Analyze this image of waste/garbage and provide a comprehensive waste detection report. 
    
Return a JSON object with the following structure:
{
  "description": "Detailed description of the waste scene",
  "severity": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "wasteComposition": [
    { "type": "Waste type name", "percentage": number (0-100), "recyclable": boolean }
  ],
  "estimatedVolume": "Human readable volume estimate",
  "environmentalImpact": "LOW" | "MODERATE" | "HIGH" | "SEVERE",
  "healthHazard": boolean,
  "hazardDetails": "Details if healthHazard is true, otherwise omit",
  "recommendedAction": "What should be done to clean this",
  "estimatedCleanupTime": "Time estimate for cleanup",
  "specialEquipmentNeeded": ["List", "of", "equipment"],
  "confidence": number (0-100, your confidence in this analysis)
}

Waste types to identify: Plastic, Paper/Cardboard, Organic/Food, Metal, Glass, E-waste, Textile, Construction Debris, Medical Waste, Chemical/Hazardous, Mixed Household, Unknown/Other.

Be thorough in identifying all visible waste types and their approximate percentages. Consider environmental and health impacts carefully.`;

    // Remove header if present (e.g., "data:image/jpeg;base64,")
    const cleanBase64 = base64Image.split(',')[1] || base64Image;

    const response = await model.generateContent([
      prompt,
      { inlineData: { mimeType: 'image/jpeg', data: cleanBase64 } },
    ]);

    let text = response.response.text();
    if (text) {
      // Clean up markdown code blocks if the model includes them
      text = text.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(text) as WasteAnalysis;
    }
    return null;
  } catch (error) {
    console.error('Gemini analysis failed:', error);
    // Return simulated response on failure so the UI doesn't break
    return getSimulatedAnalysis();
  }
};


// Simulated cleanup comparison for demo
const getSimulatedCleanupComparison = (): CleanupComparison => {
  const comparisons: CleanupComparison[] = [
    {
      completionPercentage: 95,
      beforeSummary: 'Mixed urban waste with plastic bottles, food packaging, and scattered litter',
      afterSummary: 'Area is clean with minor residual debris. All major waste removed.',
      wasteRemoved: [
        { type: 'Plastic', percentage: 45, recyclable: true },
        { type: 'Paper/Cardboard', percentage: 30, recyclable: true },
        { type: 'Organic', percentage: 20, recyclable: false },
      ],
      remainingIssues: [],
      qualityRating: 'EXCELLENT',
      environmentalBenefit: 'Prevented approximately 2kg of plastic from entering waterways. Recyclable materials can be processed.',
      verificationStatus: 'VERIFIED',
      feedback: 'Outstanding cleanup work! The area has been thoroughly cleaned and all waste properly removed. Great attention to detail.',
      confidence: 92,
    },
    {
      completionPercentage: 78,
      beforeSummary: 'Illegal dumping site with construction debris and household waste',
      afterSummary: 'Most waste cleared but some heavy debris remains',
      wasteRemoved: [
        { type: 'Plastic', percentage: 35, recyclable: true },
        { type: 'Mixed Household', percentage: 40, recyclable: false },
      ],
      remainingIssues: ['Some construction debris too heavy to move', 'Staining on ground surface'],
      qualityRating: 'GOOD',
      environmentalBenefit: 'Significant reduction in pollution risk. Area is now accessible and safer.',
      verificationStatus: 'NEEDS_REVIEW',
      feedback: 'Good effort on the cleanup. Most waste has been removed. Consider requesting equipment for remaining heavy items.',
      confidence: 85,
    },
    {
      completionPercentage: 100,
      beforeSummary: 'Overflowing public bin with scattered food containers',
      afterSummary: 'Bin emptied and surrounding area completely clean',
      wasteRemoved: [
        { type: 'Plastic', percentage: 55, recyclable: true },
        { type: 'Organic/Food', percentage: 30, recyclable: false },
        { type: 'Paper', percentage: 15, recyclable: true },
      ],
      qualityRating: 'EXCELLENT',
      environmentalBenefit: 'Quick response prevented pest attraction and further littering. Recyclables sorted properly.',
      verificationStatus: 'VERIFIED',
      feedback: 'Perfect cleanup! The area looks spotless. Thank you for your quick and thorough work.',
      confidence: 96,
    },
  ];

  return comparisons[Math.floor(Math.random() * comparisons.length)];
};

import { CleanupComparison } from '../types';

export const analyzeCleanupComparison = async (
  beforeImage: string,
  afterImage: string,
  originalAnalysis?: WasteAnalysis
): Promise<CleanupComparison | null> => {
  const ai = getClient();

  // If no key, return simulated response for demo
  if (!ai) {
    await new Promise((r) => setTimeout(r, 2000));
    return getSimulatedCleanupComparison();
  }

  try {
    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const contextInfo = originalAnalysis
      ? `Original waste analysis showed: ${originalAnalysis.description}. Waste composition was: ${originalAnalysis.wasteComposition.map(w => `${w.type}: ${w.percentage}%`).join(', ')}.`
      : '';

    const prompt = `Compare these two images of a waste cleanup site. The first image is BEFORE cleanup, the second is AFTER cleanup.
    
${contextInfo}

Analyze the cleanup effectiveness and return a JSON object:
{
  "completionPercentage": number (0-100, how much waste was cleaned),
  "beforeSummary": "Brief description of the before state",
  "afterSummary": "Brief description of the after state",
  "wasteRemoved": [
    { "type": "Waste type", "percentage": number, "recyclable": boolean }
  ],
  "remainingIssues": ["List of any remaining problems"] or empty array if none,
  "qualityRating": "POOR" | "FAIR" | "GOOD" | "EXCELLENT",
  "environmentalBenefit": "Description of environmental impact of this cleanup",
  "verificationStatus": "VERIFIED" | "NEEDS_REVIEW" | "INCOMPLETE",
  "feedback": "Constructive feedback for the cleaner",
  "confidence": number (0-100)
}

Be thorough but fair in your assessment. Consider if the cleanup was complete and done properly.`;

    const cleanBefore = beforeImage.split(',')[1] || beforeImage;
    const cleanAfter = afterImage.split(',')[1] || afterImage;

    const response = await model.generateContent([
      prompt,
      { inlineData: { mimeType: 'image/jpeg', data: cleanBefore } },
      { inlineData: { mimeType: 'image/jpeg', data: cleanAfter } },
    ]);

    let text = response.response.text();
    if (text) {
      text = text.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(text) as CleanupComparison;
    }
    return null;
  } catch (error) {
    console.error('Cleanup comparison analysis failed:', error);
    return getSimulatedCleanupComparison();
  }
};
