import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface IntentResult {
  category: "Emergency" | "Healthcare" | "Governance" | "Finance" | "Infrastructure" | "General";
  priority: "Low" | "Medium" | "High" | "Critical";
  summary: string;
  structuredData: Record<string, any>;
  recommendedActions: string[];
  ethicalConsiderations: string;
}

export async function processIntent(input: string, imageBase64?: string): Promise<IntentResult> {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `You are the "Universal Intent Bridge" (UIB). 
Your task is to take messy, unstructured human input (text, images, or both) and transform it into a highly structured, actionable JSON format for critical systems.

Categories:
- Emergency: Life-threatening, accidents, disasters.
- Healthcare: Medical advice, triage, symptoms.
- Governance: Public services, legal, permits.
- Finance: Banking, fraud, investment.
- Infrastructure: Utilities, transport, public works.

Rules:
1. Extract ALL relevant entities (names, locations, dates, quantities).
2. Determine priority based on urgency.
3. Provide clear, actionable steps for the relevant system.
4. Include a brief ethical note if the request involves sensitive data or high-stakes decisions.`;

  const prompt = `Analyze the following input and bridge it to a structured system output:
  Input: ${input}`;

  const parts: any[] = [{ text: prompt }];
  if (imageBase64) {
    parts.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: imageBase64.split(",")[1] || imageBase64,
      },
    });
  }

  const response = await ai.models.generateContent({
    model,
    contents: { parts },
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING, enum: ["Emergency", "Healthcare", "Governance", "Finance", "Infrastructure", "General"] },
          priority: { type: Type.STRING, enum: ["Low", "Medium", "High", "Critical"] },
          summary: { type: Type.STRING },
          structuredData: { type: Type.OBJECT },
          recommendedActions: { type: Type.ARRAY, items: { type: Type.STRING } },
          ethicalConsiderations: { type: Type.STRING },
        },
        required: ["category", "priority", "summary", "structuredData", "recommendedActions", "ethicalConsiderations"],
      },
    },
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    throw new Error("Invalid response from AI engine.");
  }
}
