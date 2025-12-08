import { GoogleGenAI } from "@google/genai";

// Safely retrieve API key without crashing in environments where process is undefined
const getApiKey = () => {
  try {
    return process.env.API_KEY || '';
  } catch (e) {
    console.warn("process.env is not defined, skipping API key retrieval.");
    return '';
  }
};

const getClient = () => {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn("Gemini API Key is missing. AI features will be simulated.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeWasteImage = async (base64Image: string): Promise<{ description: string, severity: string } | null> => {
  const ai = getClient();
  
  // If no key, return simulated response for demo purposes
  if (!ai) {
    await new Promise(r => setTimeout(r, 1500));
    return {
      description: "AI Analysis (Demo): It looks like a pile of plastic bottles and cardboard near a park bench.",
      severity: "MEDIUM"
    };
  }

  try {
    const model = 'gemini-2.5-flash';
    const prompt = "Analyze this image of waste. Provide a short description of the waste and suggest a severity level (LOW, MEDIUM, HIGH, CRITICAL). Return JSON format: { \"description\": \"...\", \"severity\": \"...\" }";
    
    // Remove header if present (e.g., "data:image/jpeg;base64,")
    const cleanBase64 = base64Image.split(',')[1] || base64Image;

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: cleanBase64 } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json"
      }
    });

    let text = response.text;
    if (text) {
      // Clean up markdown code blocks if the model includes them despite responseMimeType
      text = text.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(text);
    }
    return null;

  } catch (error) {
    console.error("Gemini analysis failed:", error);
    // Return a fallback or null on failure so the UI doesn't break
    return null;
  }
};